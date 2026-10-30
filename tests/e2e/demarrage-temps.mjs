// LE TEMPS DE DÉMARRAGE SUR LE BANC ANDROID (lot « Correctifs des relectures » ; budget de CLAUDE.md : « démarrage en moins de
// 3 s » ; docs/IDEES.md, section 3, « Le temps de démarrage »). Une mesure, pas un contrôle : rien ne change dans l'application.
// L'application installée sur le profil de la tablette de référence (s5e, processeur ralenti 4 fois, service worker, vraie voix,
// écran de démarrage touché pour de vrai), puis des relances (une sur deux, le navigateur tué net, comme Android ferme Chrome).
// Pour chaque lancement : la première image (l'écran de démarrage), « prêt » (« Toucher pour continuer »), l'accueil après le
// toucher ; et, d'après les temps de chargement des fichiers (Resource Timing), ce que l'écran attendait en dernier : les
// contenus, l'index de la voix, les planches du premier écran, les images du logo, chacune des 17 vidéos de la mascotte.
// L'estimation « si l'on n'attendait que les vidéos de l'accueil » prend la fin du dernier de ces fichiers sans les autres
// vidéos (une borne basse : les vidéos chargées derrière occuperaient encore le processeur).
//   node tests/e2e/demarrage-temps.mjs [--profil s5e] [--relances 10] [--racine dossier]
// (le bilan : tests/e2e/out/demarrage-temps/<profil>.md et .json)
import { Appareil, serveurBanc, REFERENCE } from "./appareils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PROFIL = arg("--profil", REFERENCE), N = Number(arg("--relances", 10)), BUDGET = 3000;
// les vidéos dont l'accueil a besoin tout de suite : le repos (les attentes calmes), la parole, le salut de la bienvenue
// (engine/mascotte.js : le salut est « success », la parole « talk-a » et « talk-b », le repos « idle-respiration »)
const ACCUEIL = ["idle-respiration", "talk-a", "talk-b", "success"];
const OUT = "tests/e2e/out/demarrage-temps"; mkdirSync(OUT, { recursive: true });
const serveur = await serveurBanc({ racine: arg("--racine", "app") });
const a = new Appareil(PROFIL, { serveur, journal: console.log });

// les fichiers de ce lancement, rangés par sorte, et la fin du dernier de chaque sorte (ms depuis l'ouverture de la page)
const fichiers = () => a.page.evaluate(() => {
  const r = performance.getEntriesByType("resource").map((e) => ({ n: decodeURIComponent(new URL(e.name).pathname).replace(/^\/Maths-CE1\//, ""), fin: Math.round(e.responseEnd), octets: e.transferSize || e.encodedBodySize || 0 }));
  const sorte = (n) => (/^content\//.test(n) ? "contenus" : /voix\/index\.json$/.test(n) ? "index de la voix" : /^assets\/art\//.test(n) ? "planches" : /^assets\/logo\//.test(n) ? "logo" : /^assets\/mascotte\//.test(n) ? "vidéos de la mascotte" : /\.js$/.test(n) ? "code" : "autres");
  const par = {}; for (const f of r) { const s = sorte(f.n); (par[s] ??= []).push(f); }
  const m = (n) => Math.round(performance.getEntriesByName(n)[0]?.startTime ?? NaN);
  return { par: Object.fromEntries(Object.entries(par).map(([s, l]) => [s, { n: l.length, fin: Math.max(...l.map((f) => f.fin)) }])), videos: (par["vidéos de la mascotte"] ?? []).map((f) => ({ clip: f.n.replace(/^assets\/mascotte\/|\.webm$/g, ""), fin: f.fin })), image: m("demarrage-visible"), pret: m("demarrage-pret"), app: m("app-ready") };
});
const lancements = [];
const noter = async (r, nom) => {
  const f = r.echec ? null : await fichiers().catch(() => null);
  const autres = f ? Math.max(...Object.entries(f.par).filter(([s]) => s !== "vidéos de la mascotte" && s !== "autres").map(([, v]) => v.fin)) : NaN;
  const accueil = f ? Math.max(autres, ...f.videos.filter((v) => ACCUEIL.includes(v.clip)).map((v) => v.fin)) : NaN;
  const l = { nom, ...r, fichiers: f, finSansVideos: autres, finVideosAccueil: accueil, derniereVideo: f?.videos.sort((x, y) => y.fin - x.fin)[0] ?? null };
  lancements.push(l);
  console.log(`     ${nom} : ${r.echec ? `ÉCHEC ${r.echec}` : `première image ${r.image} ms, prêt ${r.pret} ms, accueil ${r.app} ms ; fichiers hors vidéos finis à ${autres} ms ; vidéos de l'accueil à ${accueil} ms ; dernière vidéo ${l.derniereVideo?.clip} à ${l.derniereVideo?.fin} ms`}`);
};

await noter(await a.ouvrir(), "premier lancement (rien en cache)");
const inst = await a.installer();
console.log(`     installation finie ${inst.dureeS} s après`);
for (let i = 1; i <= N; i++) await noter(i % 2 === 0 ? await a.tuerEtRelancer() : await a.relancer(), `relance ${i}${i % 2 === 0 ? " (tuée)" : ""}`);
await a.fermer(); await serveur.fermer();

const rel = lancements.slice(1).filter((l) => !l.echec), q = (k) => { const v = rel.map((l) => l[k]).filter(Number.isFinite).sort((x, y) => x - y); return { min: v[0], med: v[v.length >> 1], max: v.at(-1) }; };
const S = { profil: PROFIL, budget: BUDGET, relances: rel.length, image: q("image"), pret: q("pret"), app: q("app"), finSansVideos: q("finSansVideos"), finVideosAccueil: q("finVideosAccueil") };
const t = (m) => `${m.min} à ${m.max} ms (médiane ${m.med})`;
const md = [`# Le temps de démarrage, profil ${PROFIL}`, "", `${new Date().toISOString()} ; budget : ${BUDGET} ms (CLAUDE.md). Application installée (service worker), processeur ralenti comme le profil ; ${rel.length} relances (une sur deux, le navigateur tué).`, "",
  "| Mesure (relances) | Temps |", "| --- | --- |",
  `| première image (l'écran de démarrage) | ${t(S.image)} |`, `| prêt (« Toucher pour continuer ») | ${t(S.pret)} |`, `| accueil, après le toucher | ${t(S.app)} |`,
  `| fin des fichiers hors vidéos (contenus, voix, planches, logo, code) | ${t(S.finSansVideos)} |`, `| … et des vidéos de l'accueil seulement (${ACCUEIL.join(", ")}) | ${t(S.finVideosAccueil)} |`, "",
  "| Lancement | Première image | Prêt | Accueil | Hors vidéos | Vidéos de l'accueil | Dernière vidéo |", "| --- | --- | --- | --- | --- | --- | --- |",
  ...lancements.map((l) => `| ${l.nom} | ${l.image ?? "—"} | ${l.pret ?? "—"} | ${l.app ?? "—"} | ${l.finSansVideos} | ${l.finVideosAccueil} | ${l.derniereVideo ? `${l.derniereVideo.clip} (${l.derniereVideo.fin})` : "—"} |`), ""];
writeFileSync(`${OUT}/${PROFIL}.md`, md.join("\n"));
writeFileSync(`${OUT}/${PROFIL}.json`, JSON.stringify({ S, lancements }, null, 1));
console.log(`\n${md.slice(4, 10).join("\n")}`);
console.log(`\nbilan : ${OUT}/${PROFIL}.md`);
