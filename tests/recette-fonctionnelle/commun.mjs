// RECETTE FONCTIONNELLE DU LOT 3 : ce que partagent les outils des parties A, C et D.
//  - le navigateur au format de la tablette (1280 × 800, densité 1, tactile) ;
//  - les deux bases de départ : « neuve » (premier lancement) et « mois » (tools/sauvegarde-test.mjs reel 2 4) ;
//  - ce que dit la voix, relevé à chaque phrase (window.__dit) ;
//  - la capture (JPEG, qualité 80) avec sa légende : écran, état, voix, tout ce qui est touchable ;
//  - les planches contact de 4 captures (2 × 2, légendées) ; l'index de chaque partie.
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { serve } from "../serve.mjs";

export const ROOT = new URL("../../", import.meta.url).pathname;
// (lot 3 bis : RECETTE_OUT=tests/recette-fonctionnelle/out-lot3bis range le nouveau matériel à part, sans toucher à celui du rapport)
export const OUT = join(ROOT, process.env.RECETTE_OUT ?? "tests/recette-fonctionnelle/out");
export const argv = process.argv.slice(2), opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);

// ---------------------------------------------------------------- la base « un mois »
let dump = null;
export function dumpMois() {
  if (dump) return dump;
  const f = join(OUT, "sauvegarde-un-mois.json");
  if (!existsSync(f)) { mkdirSync(OUT, { recursive: true }); execFileSync("node", ["tools/sauvegarde-test.mjs", "reel", "2", "4", "--sortie", f], { cwd: ROOT }); }
  return (dump = JSON.parse(readFileSync(f, "utf8")));
}

// ---------------------------------------------------------------- le navigateur
export async function navigateur() {
  const { srv, url } = await serve(0);
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  return { url, browser, close: async () => { await browser.close(); srv.close(); } };
}
// le relevé de la voix : chaque phrase dite (say) ou redite (réécouter), avec l'heure
export const ecouteVoix = (page) => page.evaluate(() => {
  const v = window.__app.voice; if (v.__releve) return; v.__releve = true; window.__dit = [];
  const say = v.say.bind(v); v.say = (t, o) => { window.__dit.push({ t: String(t), at: performance.now() }); return say(t, o); };
  const replay = v.replay?.bind(v); if (replay) v.replay = (...a) => { window.__dit.push({ t: `(réécouter) ${v.instruction ?? ""}`, at: performance.now() }); return replay(...a); };
});
// une page ouverte sur l'application : `base` « neuve » ou « mois » ; `params` : paramètres de test de main.js ;
// `nom` : la pieuvre déjà nommée (sinon, base neuve : le choix du nom au premier « jouer ») ; `avant(page)` : de quoi
// préparer la base avant le rechargement (séances, cartes…)
export async function ouvrir(nav, { base = "neuve", params = "", nom = false, voix = "rapide", avant = null } = {}) {
  const context = await nav.browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
  const page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const q = `?nosw&son=non${voix ? `&voix=${voix}` : ""}${params ? `&${params}` : ""}`;
  await page.goto(nav.url + q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async ({ d, nom }) => {
    const s = window.__app.store;
    if (d) await s.restore(d, []);
    await s.setSetting("codeParent", "1234");
    if (nom) await s.setSetting("mascotte", "Pili");
  }, { d: base === "mois" ? dumpMois() : null, nom });
  if (avant) await avant(page);
  await page.goto(nav.url + q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.waitForTimeout(700);
  await ecouteVoix(page);
  return { page, context, errors, base };
}

// ---------------------------------------------------------------- ce qui est touchable
// les éléments visibles qui réagissent au toucher (boutons, bulles, bande de la ligne, cartes), nommés comme l'enfant
// les voit (le nom accessible, la valeur d'une bulle), regroupés (le pavé, les bulles-réponses, les tuiles)
export const touchables = (page) => page.evaluate(() => {
  const vis = (e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (r.width < 4 || r.height < 4 || r.right < 0 || r.bottom < 0 || r.left > 1280 || r.top > 800) return false; if (cs.visibility === "hidden" || cs.display === "none" || cs.pointerEvents === "none" || Number(cs.opacity) < 0.05) return false; for (let p = e; p; p = p.parentElement) { const c = getComputedStyle(p); if (c.display === "none" || c.visibility === "hidden" || p.classList?.contains("stash")) return false; } return true; };
  // (un élément recouvert par un autre, par exemple l'accueil sous l'espace parent ou sous une carte ouverte, ne reçoit pas
  // le toucher : on garde ceux dont le centre, ou l'un des quatre points à mi-chemin des bords, est bien le leur)
  const onTop = (e) => { const r = e.getBoundingClientRect(); return [[0.5, 0.5], [0.3, 0.5], [0.7, 0.5], [0.5, 0.3], [0.5, 0.7]].some(([fx, fy]) => { const x = r.left + r.width * fx, y = r.top + r.height * fy; if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false; const t = document.elementFromPoint(x, y); return !!t && (t === e || e.contains(t)); }); };
  const els = [...document.querySelectorAll("button, .touchband, .reef-swipe, .card, [role=tab], .pa-root a, input, select")].filter(vis).filter(onTop);
  const groups = new Map(), add = (g, v) => { if (!groups.has(g)) groups.set(g, []); if (v != null && !groups.get(g).includes(v)) groups.get(g).push(v); };
  for (const e of els) {
    const cl = e.classList, lab = e.getAttribute("aria-label");
    if (cl.contains("key")) add("pavé", e.dataset.key === "valider" ? "valider" : e.dataset.key === "effacer" ? "effacer" : e.dataset.key);
    else if (cl.contains("answer")) add("bulles-réponses", e.dataset.value);
    else if (cl.contains("choix-tuile")) add("tuiles", `${e.dataset.key}${e.dataset.conseille === "1" ? " (conseillé)" : ""}${e.dataset.valide === "1" ? " (validé)" : ""}`);
    else if (cl.contains("album-card")) add(cl.contains("album-tab") ? "onglets de zone de l'album" : "cartes de l'album", lab || "?");
    else if (cl.contains("creature")) add("créatures du récif", lab);
    else if (cl.contains("card")) add("la carte (la retourner)");
    else if (cl.contains("touchband")) add("bande de la ligne (poser le poisson)");
    else if (cl.contains("reef-swipe")) add("fond du récif (glisser)");
    else if (e.getAttribute("role") === "tab") add("onglets", e.textContent.trim());
    else if (cl.contains("name")) add("noms proposés", e.dataset.value ?? lab);
    else if (cl.contains("cran")) add("crans", lab);
    else add(lab || e.textContent.trim().slice(0, 40) || [...cl].join("."));
  }
  return [...groups].map(([g, v]) => (v.length ? `${g} : ${v.join(", ")}` : g));
});

// ---------------------------------------------------------------- les captures et les planches
// une série de captures (une partie, un thème) ; `shot` prend la capture et sa légende ; `planches` les range par 4
export class Serie {
  // `par` : captures par planche (4, en 2 × 2) ; `pleine` : une colonne à pleine taille (écrans à petit texte, l'espace parent)
  constructor(dir, prefix, titre, { par = 4, pleine = false } = {}) { this.dir = dir; this.prefix = prefix; this.titre = titre; this.items = []; this.par = pleine ? 2 : par; this.pleine = pleine; mkdirSync(dir, { recursive: true }); }
  // `voix` : ce que dit la voix (sinon : les phrases dites depuis la capture précédente de cette page)
  async shot(page, { ecran, etat = "", voix = null, note = "", touch = true } = {}) {
    const dit = voix ?? (await page.evaluate(() => { const d = window.__dit ?? [], i = window.__vu ?? 0; window.__vu = d.length; return d.slice(i).map((x) => x.t); }).catch(() => []));
    const parle = await page.evaluate(() => !!window.__app?.voice?.speaking).catch(() => false);
    const t = touch ? await touchables(page).catch(() => []) : [];
    const img = await page.screenshot({ type: "jpeg", quality: 80 });
    this.items.push({ img, ecran, etat, voix: Array.isArray(dit) ? (dit.length ? dit.slice(-3).map((x) => `« ${x} »`).join(" ") + (dit.length > 3 ? ` (et ${dit.length - 3} avant)` : "") : parle ? "(parle)" : "(silence)") : dit, note, touch: t });
    return this.items.at(-1);
  }
  // les planches : 4 captures (2 × 2) réduites de moitié, légendées ; JPEG qualité 80
  async planches(nav) {
    // (les planches d'un lancement précédent de la même série sont retirées : leur nombre a pu changer)
    for (const f of readdirSync(this.dir)) if (f.startsWith(`${this.prefix}-`) && /^\d+\.jpg$/.test(f.slice(this.prefix.length + 1))) unlinkSync(join(this.dir, f));
    const out = [], ctx = await nav.browser.newContext({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 1 }), p = await ctx.newPage();
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const W = this.pleine ? 1280 : 640, H = this.pleine ? 800 : 400, cols = this.pleine ? 1 : 2;
    for (let k = 0; k < this.items.length; k += this.par) {
      const group = this.items.slice(k, k + this.par), n = out.length + 1, file = `${this.prefix}-${String(n).padStart(2, "0")}.jpg`;
      const cells = group.map((it, i) => `<figure><div class="num">${k + i + 1}</div><img src="data:image/jpeg;base64,${it.img.toString("base64")}"><figcaption><b>${esc(it.ecran)}</b>${it.etat ? ` · ${esc(it.etat)}` : ""}<br><span class="v">Voix : ${esc(it.voix)}</span>${it.touch.length ? `<br><span class="t">Touchable : ${esc(it.touch.join(" · "))}</span>` : "<br><span class=\"t\">Touchable : rien</span>"}${it.note ? `<br><span class="n">${esc(it.note)}</span>` : ""}</figcaption></figure>`).join("");
      await p.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:8px;background:#fff;font:15px/1.3 system-ui,sans-serif;color:#111;width:${cols * W + 4}px}h1{font-size:16px;margin:0 0 6px}.g{display:grid;grid-template-columns:repeat(${cols},${W}px);gap:4px}figure{margin:0;position:relative;border:1px solid #bbb}img{width:${W}px;height:${H}px;display:block}.num{position:absolute;left:4px;top:4px;background:#111;color:#fff;font-weight:700;padding:1px 7px;border-radius:9px}figcaption{padding:4px 6px 6px}.v{color:#123f8a}.t{color:#6a3b00}.n{color:#555;font-style:italic}</style><h1>${esc(this.titre)} · planche ${n}</h1><div class="g">${cells}</div>`);
      await p.screenshot({ path: join(this.dir, file), type: "jpeg", quality: 80, fullPage: true });
      out.push({ file, contenu: group.map((it) => `${it.ecran}${it.etat ? ` (${it.etat})` : ""}`).join(" ; ") });
    }
    await ctx.close();
    return out;
  }
}
// l'index d'une partie (fichier -> une ligne), rangé dans son dossier ; INDEX.md les rassemble
export function indexPartie(dir, titre, lignes, intro = "") { writeFileSync(join(dir, "_index.json"), JSON.stringify({ titre, intro, lignes }, null, 1)); }
export function ecrireIndex() {
  const parts = readdirSync(OUT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  const L = ["# Matériel de la recette fonctionnelle du lot 3 : index", "", "Produit par les outils de `tests/recette-fonctionnelle/` (session 1 de `docs/PROMPT-RECETTE-LOT3.md`). Aucun jugement ici : seulement ce que l'application montre, dit et génère. Captures au format de la tablette (1280 × 800, densité 1), en JPEG qualité 80, regroupées en planches de 4 (2 × 2) ; chaque légende donne l'écran, l'état, ce que dit la voix à ce moment (les dernières phrases dites depuis la capture précédente) et tout ce qui est touchable.", "", "Bases de départ : **base neuve** (premier lancement) et **un mois** (`node tools/sauvegarde-test.mjs reel 2 4`, fichier `sauvegarde-un-mois.json`).", ""];
  L.push("## Notes de production (à lire avant les planches)", "",
    "- **Ordre de lecture proposé** : partie A dans l'ordre des numéros (A01 accueil → A10 espace parent), puis `B-sequences/SYNTHESE.md`, `C-toucher/JOURNAL.md`, `D-vitesse-reelle/SYNTHESE.md` ; les fichiers détaillés au besoin.",
    "- **Pilotage** : l'application n'est pas modifiée. Les outils utilisent ses réglages de test (`?choix=module:niveau`, `?cran`, `?sans=echauffement,defi…`, `?sansLecon`, `?guides=0`, `?lecon=Lx`, `?etoiles=N`, `?voix=rapide`, `?son=non`) et `window.__app` (lecture de l'état, réponses juste ou fausse données comme l'écran les reçoit). Pour la récompense, deux états sont forcés dans la page : le doublon (quota de cartes mis à 0) et la brillante (tirage au plus bas) ; entre deux essais au pavé (partie C), l'ardoise est vidée par l'outil.",
    "- **Voix** : accélérée pour les captures de la partie A (sauf les leçons, en voix réelle) ; réelle pour les parties C et D. La légende « Voix » donne les dernières phrases commencées depuis la capture précédente de la même page (« (silence) » : aucune).",
    "- **Touchable** : les boutons, bulles, touches, bandes et onglets visibles et non recouverts à l'instant de la capture. Un élément affiché mais bloqué (bulles et pavé pendant une correction) y figure : c'est la partie C qui dit ce que fait un toucher.",
    "- **Format** : planches de 4 captures réduites de moitié (2 × 2) ; exception : l'espace parent, 2 captures par planche à pleine taille, sinon son texte serait illisible.",
    "- **Partie B** : la voix est reconstituée à partir de `app/content/textes.json` avec la logique des écrans ; les durées hors réponse sont estimées (elles ne servent qu'au plafond de la séance) ; voir l'en-tête de `B-sequences/SYNTHESE.md`.",
    "- **Partie D** : première séance (base neuve), comme `tests/e2e/recette.mjs` : le défi record n'y a pas lieu (il est capturé en A07, base « un mois »).",
    "- **Réseau** : pendant les parcours, Chromium sans écran a tenté de joindre des services Google (mises à jour du navigateur), refusés par le proxy de l'environnement ; l'application elle-même n'a fait aucun appel extérieur.",
    "");
  if (existsSync(join(OUT, "sauvegarde-un-mois.json"))) L.push("- `sauvegarde-un-mois.json` : la sauvegarde « un mois » (profil réel, 2 séances par semaine, 4 semaines), restaurée au départ des captures et des séquences.", "");
  for (const p of parts) {
    const f = join(OUT, p, "_index.json"); if (!existsSync(f)) continue;
    const { titre, intro, lignes } = JSON.parse(readFileSync(f, "utf8"));
    L.push(`## ${titre}`, ""); if (intro) L.push(intro, "");
    for (const [file, desc] of lignes) L.push(`- \`${p}/${file}\` : ${desc}`);
    L.push("");
  }
  writeFileSync(join(OUT, "INDEX.md"), L.join("\n"));
}
// attendre qu'une condition dans la page soit vraie (sans lever d'erreur au bout du délai) ; renvoie vrai si elle l'est
export const attendre = (page, fn, arg, ms = 30000) => page.waitForFunction(fn, arg, { timeout: ms, polling: 100 }).then(() => true, () => false);
export const toucher = (page, sel) => page.tap(sel, { force: true, timeout: 5000 }).then(() => true, () => false);
// attendre que la voix se taise (au plus `ms`)
export const silence = (page, ms = 15000) => attendre(page, () => !window.__app.voice.speaking, null, ms);
