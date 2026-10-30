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
// ce que la page fait avant « prêt », relevé de l'extérieur (rien ne change dans l'application) : le navigateur garde tous les
// temps de chargement (250 par défaut) ; chaque fichier lu en entier (`Response.blob` : les planches, les vidéos de la mascotte)
// et chaque image décodée (`createImageBitmap` : les planches du premier écran, le fond du lagon) sont datés
const ESPION = () => {
  performance.setResourceTimingBufferSize(20000);
  const T = (window.__tDemarrage = { blobs: [], images: [] });
  const blob = Response.prototype.blob;
  Response.prototype.blob = async function () { const u = this.url, t0 = performance.now(), r = await blob.call(this); T.blobs.push({ u: decodeURIComponent(new URL(u).pathname).replace(/^\/Maths-CE1\//, ""), t0, t1: performance.now() }); return r; };
  const cib = window.createImageBitmap;
  window.createImageBitmap = function (...a) { const t0 = performance.now(), p = cib.apply(this, a); p.then(() => T.images.push({ t0, t1: performance.now() }), () => {}); return p; };
};
const a = new Appareil(PROFIL, { serveur, journal: console.log, scripts: [ESPION] });

// ce lancement : les marques, la fin du dernier fichier de chaque sorte, la fin du dernier décodage d'image, et l'heure où chaque
// vidéo de la mascotte est lue en entier (ms depuis l'ouverture de la page ; seulement avant « prêt »)
const fichiers = () => a.page.evaluate(() => {
  const m = (n) => Math.round(performance.getEntriesByName(n)[0]?.startTime ?? NaN), pret = m("demarrage-pret"), T = window.__tDemarrage ?? { blobs: [], images: [] };
  const r = performance.getEntriesByType("resource").map((e) => ({ n: decodeURIComponent(new URL(e.name).pathname).replace(/^\/Maths-CE1\//, ""), fin: Math.round(e.responseEnd) })).filter((f) => f.fin <= pret);
  const sorte = (n) => (/^content\//.test(n) ? "contenus" : /voix\/index\.json$/.test(n) ? "index de la voix" : /^assets\/art\//.test(n) ? "planches" : /^assets\/logo\//.test(n) ? "logo" : /^assets\/mascotte\//.test(n) ? "vidéos" : /\.js$/.test(n) ? "code" : "autres");
  const fin = {}; for (const f of r) { const s = sorte(f.n); fin[s] = Math.max(fin[s] ?? 0, f.fin); }
  const images = T.images.filter((x) => x.t1 <= pret), videos = T.blobs.filter((b) => /^assets\/mascotte\//.test(b.u) && b.t1 <= pret).map((b) => ({ clip: b.u.replace(/^assets\/mascotte\/|\.webm$/g, ""), t1: Math.round(b.t1) }));
  return { image: m("demarrage-visible"), pret, app: m("app-ready"), fin, imagesFin: Math.round(Math.max(0, ...images.map((x) => x.t1))), imagesMs: Math.round(images.reduce((s, x) => s + x.t1 - x.t0, 0)), videos };
});
const lancements = [];
const noter = async (r, nom) => {
  const f = r.echec ? null : await fichiers().catch(() => null);
  // sans les vidéos : la fin des fichiers (hors vidéos) et des décodages d'images ; avec les vidéos de l'accueil seulement
  const sansVideos = f ? Math.max(f.imagesFin, ...Object.entries(f.fin).filter(([s]) => s !== "vidéos" && s !== "autres").map(([, v]) => v)) : NaN;
  const vids = f?.videos ?? [], derniere = [...vids].sort((x, y) => y.t1 - x.t1)[0] ?? null;
  const avecAccueil = f ? Math.max(sansVideos, ...vids.filter((v) => ACCUEIL.includes(v.clip)).map((v) => v.t1)) : NaN;
  const l = { nom, ...r, mesures: f, sansVideos, avecAccueil, videosFin: derniere?.t1 ?? NaN, derniereVideo: derniere?.clip ?? null };
  lancements.push(l);
  console.log(`     ${nom} : ${r.echec ? `ÉCHEC ${r.echec}` : `première image ${r.image} ms, prêt ${r.pret} ms, accueil ${r.app} ms ; images décodées à ${f?.imagesFin} ms (${f?.imagesMs} ms de décodage) ; tout sauf les vidéos à ${sansVideos} ms ; + vidéos de l'accueil ${avecAccueil} ms ; 17 vidéos lues à ${l.videosFin} ms (la dernière : ${derniere?.clip}, ${vids.length} relevées) ; fin par sorte ${JSON.stringify(f?.fin ?? {})}`}`);
};

await noter(await a.ouvrir(), "premier lancement (rien en cache)");
const inst = await a.installer();
console.log(`     installation finie ${inst.dureeS} s après`);
for (let i = 1; i <= N; i++) await noter(i % 2 === 0 ? await a.tuerEtRelancer() : await a.relancer(), `relance ${i}${i % 2 === 0 ? " (tuée)" : ""}`);
await a.fermer(); await serveur.fermer();

const rel = lancements.slice(1).filter((l) => !l.echec), q = (k) => { const v = rel.map((l) => l[k]).filter(Number.isFinite).sort((x, y) => x - y); return { min: v[0], med: v[v.length >> 1], max: v.at(-1) }; };
const S = { profil: PROFIL, budget: BUDGET, relances: rel.length, image: q("image"), pret: q("pret"), app: q("app"), sansVideos: q("sansVideos"), avecAccueil: q("avecAccueil"), videosFin: q("videosFin") };
const t = (m) => `${m.min} à ${m.max} ms (médiane ${m.med})`;
const md = [`# Le temps de démarrage, profil ${PROFIL}`, "", `${new Date().toISOString()} ; budget : ${BUDGET} ms (CLAUDE.md). Application installée (service worker), processeur ralenti comme le profil ; ${rel.length} relances (une sur deux, le navigateur tué).`, "",
  "| Mesure (relances) | Temps |", "| --- | --- |",
  `| première image (l'écran de démarrage) | ${t(S.image)} |`, `| prêt (« Toucher pour continuer ») | ${t(S.pret)} |`, `| accueil, après le toucher | ${t(S.app)} |`,
  `| les 17 vidéos de la mascotte lues en entier | ${t(S.videosFin)} |`, `| tout sauf les vidéos (fichiers, décodage des images) | ${t(S.sansVideos)} |`, `| … et les vidéos de l'accueil seulement (${ACCUEIL.join(", ")}) | ${t(S.avecAccueil)} |`, "",
  "| Lancement | Première image | Prêt | Accueil | Images décodées | Tout sauf les vidéos | + vidéos de l'accueil | 17 vidéos lues |", "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...lancements.map((l) => `| ${l.nom} | ${l.image ?? "—"} | ${l.pret ?? "—"} | ${l.app ?? "—"} | ${l.mesures?.imagesFin ?? "—"} (${l.mesures?.imagesMs ?? "—"} ms) | ${l.sansVideos} | ${l.avecAccueil} | ${l.videosFin} (${l.derniereVideo ?? "—"}) |`), ""];
writeFileSync(`${OUT}/${PROFIL}.md`, md.join("\n"));
writeFileSync(`${OUT}/${PROFIL}.json`, JSON.stringify({ S, lancements }, null, 1));
console.log(`\n${md.slice(4, 11).join("\n")}`);
console.log(`\nbilan : ${OUT}/${PROFIL}.md`);
