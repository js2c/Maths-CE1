// SIMULATION DE LA BOUTIQUE SUR UNE ANNÉE (art/boutique/README.md, « Le calibrage »).
// 1. Le flux d'étoiles : la simulation de l'application (tests/sim-recette.mjs, les modules réels, profils diff, reel, sait ;
//    2, 3 et 5 séances par semaine, du 28 septembre 2026 au 2 juillet 2027, graine 7), séance par séance : les étoiles gagnées
//    (bonnes réponses, séance terminée, série, record…), les étoiles dorées. Mis en cache dans art/boutique/.travail/.
// 2. La boutique rejouée sur ce flux, avec les règles proposées (ou une autre grille de prix) :
//    - mode A (arrivages) : 2 créatures arrivent en vitrine par semaine d'école (calendrier.json), dans l'ordre des zones,
//      une rare toutes les 3 ou 4 ; mode B (libre) : toute la zone ouverte est en vitrine ;
//    - une zone s'ouvre quand ses communes et rares sont toutes achetées ET que son contenu est prêt (grand large le
//      1er février 2027, abysses le 26 avril 2027 : SPEC, section 10) ; son coquillage offre une commune de la zone ;
//    - les légendaires : une étoile dorée, la zone finie (comme aujourd'hui) ;
//    - l'enfant (hypothèse) : un vœu tiré au hasard dans la vitrine ; elle l'achète dès qu'elle a assez, sinon elle
//      économise ; quand la vitrine est vide, elle fait briller la moins chère ; une créature achetée sort brillante une
//      fois sur cinq.
//   node art/boutique/outils/simulation.mjs [commune rare brillerCommune brillerRare]   (par défaut : 40 100 150 300)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = join(dirname(fileURLToPath(import.meta.url)), ".."), RACINE = join(ICI, "..", ".."), CACHE = join(ICI, ".travail");
mkdirSync(CACHE, { recursive: true });
const lire = (p) => JSON.parse(readFileSync(join(RACINE, p), "utf8"));
const C = lire("app/content/cartes.json"), cal = lire("app/content/calendrier.json");
const { schoolWeeks, dateOf } = await import(join(RACINE, "app/js/session/rewards.js"));
const PROFILS = ["diff", "reel", "sait"], RYTHMES = [2, 3, 5];

// ---------------------------------------------------------------- 1. le flux d'étoiles
async function flux(profil, pw) {
  const f = join(CACHE, `flux-${profil}-${pw}.json`);
  if (existsSync(f)) return JSON.parse(readFileSync(f, "utf8"));
  const { simulate } = await import(join(RACINE, "tests/sim-recette.mjs"));
  const hol = cal.vacances.map((v) => [new Date(dateOf(v.debut)), new Date(dateOf(v.reprise))]), fin = new Date(dateOf("2027-07-02") + 86400000);
  const wd = pw === 2 ? [1, 4] : pw === 3 ? [1, 3, 5] : [1, 2, 3, 4, 5], jours = [];
  for (let d = new Date("2026-09-28T00:00:00"); d < fin; d = new Date(d.getTime() + 86400000)) if (!hol.some(([a, b]) => d >= a && d < b) && wd.includes(d.getDay())) jours.push(new Date(d));
  const res = await simulate({ profil, jours, seed: 7 });
  let avant = 0;
  const out = res.map((r, i) => { const ord = r.cartes.filter((c) => !c.includes("(doré)")).length, e = r.reste - avant + C.coquillage.prix * ord; avant = r.reste; return { d: jours[i].toISOString().slice(0, 10), e, doree: !!r.doree }; });
  writeFileSync(f, JSON.stringify(out));
  return out;
}

// ---------------------------------------------------------------- 2. la boutique
const ZONES = C.zones.map((z) => z.id), PRET = { lagon: "2026-01-01", corail: "2026-01-01", large: "2027-02-01", abysses: "2027-04-26" };
const ORDRE = ZONES.flatMap((z) => { const c = C.cartes.filter((x) => x.zone === z && x.rarete === "commune"), r = C.cartes.filter((x) => x.zone === z && x.rarete === "rare"), out = [], k = Math.ceil(c.length / (r.length + 1)); while (c.length || r.length) { out.push(...c.splice(0, k)); if (r.length) out.push(r.shift()); } return out; });
const alea = (g) => { let s = g >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; }; };
export function boutique(fl, { mode, prix, parSemaine = 2, chance = 0.2, graine = 3 }) {
  const R = alea(graine), own = {}, open = ["lagon"], dates = {}, base = new Date(fl[0].d + "T18:00").getTime();
  let st = 0, dorees = 0, sansAchat = 0, rienAAcheter = 0, achats = 0, vide = 0;
  const cout = (c, b) => (b ? prix.briller[c.rarete] : prix[c.rarete]);
  const finie = (z) => C.cartes.filter((c) => c.zone === z && c.rarete !== "legendaire").every((c) => own[c.id]);
  for (const f of fl) {
    const t = new Date(f.d + "T18:00").getTime(); st += f.e; if (f.doree) dorees++;
    for (;;) { const nx = ZONES[ZONES.indexOf(open.at(-1)) + 1]; if (!nx || !finie(open.at(-1)) || f.d < PRET[nx]) break; open.push(nx); dates[`zone ${nx}`] = f.d;
      const offerte = C.cartes.filter((c) => c.zone === nx && c.rarete === "commune")[0]; own[offerte.id] = { b: false }; }
    const leg = C.cartes.find((c) => c.rarete === "legendaire" && open.includes(c.zone) && !own[c.id] && finie(c.zone));
    if (leg && dorees > 0) { dorees--; own[leg.id] = { b: false }; }
    const arrivees = mode === "A" ? parSemaine * schoolWeeks(cal, base, t) : Infinity;
    const vitrine = () => { const pool = ORDRE.filter((c) => open.includes(c.zone)); return pool.slice(0, Math.min(pool.length, arrivees)).filter((c) => !own[c.id]); };
    let n = 0; if (!vitrine().length) vide++;
    for (;;) {
      const v = vitrine();
      if (v.length) { const w = v[Math.floor(R() * v.length)]; if (st >= cout(w)) { st -= cout(w); own[w.id] = { b: R() < chance }; n++; continue; } break; }
      const ternes = C.cartes.filter((c) => own[c.id] && !own[c.id].b && c.rarete !== "legendaire").sort((a, b) => cout(a, 1) - cout(b, 1));
      if (ternes.length && st >= cout(ternes[0], 1)) { st -= cout(ternes[0], 1); own[ternes[0].id].b = true; n++; continue; }
      if (!ternes.length) rienAAcheter++;
      break;
    }
    achats += n; if (!n) sansAchat++;
    const k = Object.keys(own).filter((id) => C.cartes.find((c) => c.id === id).rarete !== "legendaire").length;
    for (const m of [15, 30, 45, 55]) if (k >= m && !dates[m]) dates[m] = f.d;
  }
  return { cartes: Object.keys(own).length, brillantes: Object.values(own).filter((o) => o.b).length, reste: st, dates, sansAchat, rienAAcheter, vide, seances: fl.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [pc = 40, pr = 100, bc = 150, br = 300] = process.argv.slice(2).map(Number), prix = { commune: pc, rare: pr, briller: { commune: bc, rare: br } };
  const jj = (d) => (d ? d.slice(8) + "/" + d.slice(5, 7) : "—");
  console.log(`prix : commune ${pc}, rare ${pr} ; faire briller ${bc} (commune), ${br} (rare)\n`);
  console.log("| mode | séances/sem. | profil | ★ gagnées | 15 | 30 | 45 | 55 | fin : cartes (/60) | brillantes | ★ restantes | séances sans achat | vitrine sans nouvelle |");
  console.log("| --- | ---: | --- | ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |");
  for (const mode of ["A", "B"]) for (const pw of RYTHMES) for (const p of PROFILS) {
    const fl = await flux(p, pw), r = boutique(fl, { mode, prix });
    console.log(`| ${mode === "A" ? "arrivages" : "libre"} | ${pw} | ${p} | ${fl.reduce((a, f) => a + f.e, 0)} | ${jj(r.dates[15])} | ${jj(r.dates[30])} | ${jj(r.dates[45])} | ${jj(r.dates[55])} | ${r.cartes} | ${r.brillantes} | ${r.reste} | ${r.sansAchat}/${r.seances} | ${r.vide} |`);
  }
}
