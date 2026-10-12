// L'ENFANT IMPRÉVISIBLE (lot « Recette de l'enfant et nettoyage des couches », point 3 ; docs/LOTS.md, fiche 9). Un parcours
// tiré au hasard, mais reproductible (une graine), qui enchaîne des actions d'enfant : toucher la cible ou juste à côté (10 à
// 60 px), l'eau vide ; deux ou trois touchers rapides, un appui long, deux doigts ; toucher pendant une animation ou une
// phrase ; la mascotte encore et encore ; « je ne sais pas » plusieurs fois ; passer l'échauffement à n'importe quel moment ;
// la maison en pleine question puis un autre jeu par « choisir » ; une leçon quittée en route ; des allers-retours rapides
// entre les menus ; la pause et la reprise ; l'écran mis en veille puis repris ; l'espace parent ouvert pendant une pause ; la
// page rechargée en pleine séance ; et, pour avancer, des réponses justes ou fausses comme une enfant qui joue.
// Après chaque action, et chaque seconde, il vérifie :
//  - rien d'une étape quittée n'est visible : chaque élément affiché appartient à l'écran en cours (`incoherences`) ;
//  - une seule mascotte, une seule bulle, au plus un « je ne sais pas », au plus un bouton « passer l'échauffement » ;
//  - aucune phrase d'une étape quittée n'est dite (chaque phrase est rattachée, par la pile d'appels, au fichier qui la
//    demande : un exercice qui parle alors qu'il n'est plus à l'écran est un défaut) ; aucune phrase sans son fichier
//    (navigateur.mjs) ;
//  - aucune erreur dans la console, aucune promesse rejetée sans être traitée ;
//  - jamais d'impasse : quelque chose à toucher (autre que la maison et la mascotte) apparaît en moins de 20 s ;
//  - le temps d'image (moyenne, 95e centile) ;
// et, avec --fuite : après 20 tours accueil, jeu, accueil, le nombre d'éléments, de canvas, de minuteries et d'écouteurs
// revient à celui du départ.
//   node tests/e2e/enfant.mjs [--graines 4] [--depart 1] [--actions 80] [--lent 1] [--tablette] [--parallele 1]
//                             [--fuite] [--veille-longue] [--out dossier] [--rejouer fichier.json [--reduire]]
//   --lent N : processeur ralenti N fois ; --tablette : 1138 × 711, densité 2,25 (la tablette du parent) ; --panne : le
//   contrôle du contrôle (une touche orpheline et une erreur injectées : le parcours doit échouer)
//   --rejouer : rejoue les actions enregistrées d'un défaut (out/…/defaut-*.json) ; --reduire : cherche la plus courte suite
//   d'actions qui le montre encore (delta-debugging), et l'écrit à côté (…-reduit.json)
// Version courte (tests de GitHub, .github/workflows/tests.yml) : node tests/e2e/enfant.mjs --graines 3 --actions 60
import { accueilReel, chromium } from "./navigateur.mjs";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const GRAINES = Number(arg("--graines", 4)), DEPART = Number(arg("--depart", 1)), ACTIONS = Number(arg("--actions", 80)), LENT = Number(arg("--lent", 1));
const TABLETTE = args.includes("--tablette"), PARALLELE = Number(arg("--parallele", 1)), FUITE = args.includes("--fuite"), VEILLE_LONGUE = args.includes("--veille-longue");
const OUT = resolve(arg("--out", "tests/e2e/out/enfant")); mkdirSync(OUT, { recursive: true });
const REJOUER = arg("--rejouer"), REDUIRE = args.includes("--reduire"), PANNE = args.includes("--panne");
const IMPASSE_MS = 20000;
const VUE = TABLETTE ? { width: 1138, height: 711, deviceScaleFactor: 2.25 } : { width: 1280, height: 800, deviceScaleFactor: 1 };
// une base d'un mois (des cartes dans l'album et le récif, des étoiles pour la boutique), fabriquée une fois
const SAVE = join(OUT, "base-un-mois.json");
if (!existsSync(SAVE)) execFileSync("node", ["tools/sauvegarde-test.mjs", "reel", "2", "4", "--sortie", SAVE], { stdio: "ignore" });
const BASE = JSON.parse(readFileSync(SAVE, "utf8"));

const { srv, url } = await serve(0);
// un Chromium par partie : partagé, son processeur graphique (logiciel, ici) servait toutes les parties en parallèle, et le temps
// d'image d'une partie montait avec le nombre de parties déjà jouées (de 190 à 550 ms au fil d'une longue série)
const lancer = () => chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

// le hasard reproductible (mulberry32)
const hasard = (graine) => { let a = graine >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

// ---------------------------------------------------------------- dans la page : l'instrumentation (avant tout script)
const INSTRUMENTS = () => {
  // les minuteries et les écouteurs de la fenêtre et du document : combien sont actifs
  const actives = new Set(), st = window.setTimeout, si = window.setInterval, ct = window.clearTimeout, ci = window.clearInterval;
  window.setTimeout = function (f, ms, ...a) { const id = st.call(window, (...b) => { actives.delete(id); return typeof f === "function" ? f(...b) : undefined; }, ms, ...a); actives.add(id); return id; };
  window.setInterval = function (f, ms, ...a) { const id = si.call(window, f, ms, ...a); actives.add(id); return id; };
  window.clearTimeout = function (id) { actives.delete(id); return ct.call(window, id); };
  window.clearInterval = function (id) { actives.delete(id); return ci.call(window, id); };
  const ecoutes = new Map(), add = EventTarget.prototype.addEventListener, rem = EventTarget.prototype.removeEventListener;
  const cle = (t, type, f, o) => `${t === window ? "w" : "d"}:${type}:${typeof o === "boolean" ? o : !!o?.capture}`;
  EventTarget.prototype.addEventListener = function (type, f, o) { if ((this === window || this === document) && f) { const k = cle(this, type, f, o), s = ecoutes.get(k) ?? ecoutes.set(k, new Set()).get(k); if (o?.once) { /* compté jusqu'au retrait explicite ou à l'appel */ } s.add(f); } return add.call(this, type, f, o); };
  EventTarget.prototype.removeEventListener = function (type, f, o) { if (this === window || this === document) ecoutes.get(cle(this, type, f, o))?.delete(f); return rem.call(this, type, f, o); };
  // le temps entre deux images
  const gaps = []; let l = 0; const f = (t) => { if (l) { gaps.push(t - l); if (gaps.length > 20000) gaps.splice(0, 10000); } l = t; requestAnimationFrame(f); }; requestAnimationFrame(f);
  window.__enfant = { gaps, comptes: () => ({ elements: document.getElementsByTagName("*").length, canvas: document.getElementsByTagName("canvas").length, minuteries: actives.size, ecouteurs: [...ecoutes.values()].reduce((n, s) => n + s.size, 0) }), phrases: [] };
  // chaque phrase dite : son texte, l'écran à ce moment, et les fichiers de l'application qui l'ont demandée
  const poser = () => {
    const a = window.__app; if (!a?.voice || a.voice.__enfant) return setTimeout(poser, 100);
    a.voice.__enfant = true; const say = a.voice.say.bind(a.voice);
    a.voice.say = (t, o) => { const pile = (new Error().stack ?? "").split("\n").map((l) => /\/js\/([\w/.-]+\.js)/.exec(l)?.[1]).filter(Boolean); window.__enfant.phrases.push({ t: performance.now(), texte: t, pile: [...new Set(pile)].filter((f) => f !== "engine/voice.js").slice(0, 6), ctx: window.__enfantContexte?.() }); if (window.__enfant.phrases.length > 400) window.__enfant.phrases.splice(0, 200); return say(t, o); };
  };
  poser();
  // l'écran en cours, d'après l'application
  window.__enfantContexte = () => {
    const a = window.__app; if (!a) return null;
    return { mode: a.modeEcran?.() ?? null, etape: a.session?.progress?.etape ?? null, module: a.session?.rec?.module ?? null, pause: !!a.enPause, parent: !!a.parent?.root?.isConnected, recif: !!a.reef?.open, album: !!a.album?.open, boutique: !!a.boutique?.open, voiliers: !!a.voiliers?.actif, etal: !!(a.etal?.actif || a.etalLecon?.actif), facts: !!a.facts?.q, ligne: !!a.screen?.q, libre: a.free?.module ?? null };
  };
};

// ---------------------------------------------------------------- dans la page : ce qui est à l'écran et ce qui ne va pas
const ETAT = () => {
  const a = window.__app, c = window.__enfantContexte(), vis = (e) => e.isConnected && !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true }) && e.getBoundingClientRect().width > 2;
  const n = (s) => [...document.querySelectorAll(s)].filter(vis).length, pb = [];
  if (document.querySelectorAll("#mascotte").length !== 1) pb.push(`${document.querySelectorAll("#mascotte").length} mascottes`);
  if (document.querySelectorAll(".bulle").length !== 1) pb.push(`${document.querySelectorAll(".bulle").length} bulles`);
  if (n(".nsp") > 1) pb.push(`${n(".nsp")} « je ne sais pas »`);
  if (document.querySelectorAll(".skip-warmup").length > 1) pb.push(`${document.querySelectorAll(".skip-warmup").length} boutons « passer l'échauffement »`);
  if (n(".skip-warmup") && (c.etape !== "echauffement" || c.mode !== "seance")) pb.push("bouton « passer l'échauffement » hors de l'échauffement");
  // chaque élément affiché appartient à l'écran en cours
  const jeu = c.mode === "seance" || c.mode === "libre" || c.mode === "lecon" || c.mode === "pause-lecon" || c.mode === "lecon-fin";
  if (!c.pause && n(".key:not(.etal-key)") && !(jeu && (c.facts || a.dictation?.on || a.challenge || a.warmupPending))) pb.push(`pavé visible sans question (${c.mode}, ${c.etape})`);
  if (!c.pause && n(".answer") && !(jeu && c.ligne)) pb.push(`bulles-réponses sans question (${c.mode}, ${c.etape})`);
  if (document.querySelector("canvas.voiliers") && !c.voiliers) pb.push("mer des voiliers sans jeu");
  if (c.voiliers && !["seance", "libre", "pause-choix", "pause-lecons", "pause-lecon", "pause-table"].includes(c.mode) && !c.pause) pb.push(`voiliers actifs hors d'un jeu (${c.mode})`);
  if (document.querySelector("canvas.etal-decor") && !c.etal) pb.push("étal sans jeu");
  if (c.etal && c.mode === null && !c.recif && !c.album && !c.boutique) pb.push("étal actif à l'accueil");
  if (a.hermit && c.mode === null) pb.push("bernard-l'ermite à l'accueil");
  if (n(".defi-timer, .defi-row") && c.etape !== "defi") pb.push("défi hors de son étape");
  // l'accueil (ni séance, ni visite, ni parent) : seulement ses galets, la lune, le bouton du parent, la tête et le compteur
  if (c.mode === null && !c.parent && !c.recif && !c.album && !c.boutique && !document.querySelector(".fin-recompense, .card, .shelltap, .coquillage")) {
    const autres = [...document.querySelectorAll("#ui > *")].filter((e) => vis(e) && !e.matches(".galet, .moon, .logo, .mascotte-tap, .stars, .bulle, .speaker, .etiquette, .hud.stars, .entourage") && !e.closest(".galet"));
    if (autres.length) pb.push(`à l'accueil : ${autres.slice(0, 4).map((e) => e.className || e.tagName).join(", ")}`);
  }
  // quelque chose à toucher (hors maison, tête et compteur) : un bouton, ou une scène qui attend le geste
  const touchable = [...document.querySelectorAll("#ui button, .pa button, .demarrage")].some((e) => vis(e) && !e.disabled && !e.matches(".mascotte-tap, .session-home, .speaker, .stars")) || !!a.voiliers?.attend || !!a.etal?.attend || c.recif;
  return { pb, touchable, c };
};
// les cibles possibles : boutons visibles (avec leur boîte) et scènes à toucher
const CIBLES = () => {
  const vis = (e) => e.isConnected && !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true });
  return [...document.querySelectorAll("#ui button, .pa button, .pa input, canvas.recif-dessin, .demarrage, .etal-scene .etal-objet")].filter(vis).map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, quoi: (e.getAttribute("aria-label") || e.className || e.tagName).toString().slice(0, 40), cls: String(e.className) }; }).filter((t) => t.w > 4 && t.h > 4 && t.x > 0 && t.y > 0 && t.x < innerWidth && t.y < innerHeight);
};
// répondre comme une enfant qui joue : juste (le plus souvent) ou faux, à la question en cours, quelle qu'elle soit
const REPONDRE = async (juste) => {
  const a = window.__app, f = a.facts, s = a.screen, r = (n) => (juste ? n : n + 1 + Math.floor(Math.random() * 3));
  const taper = async (n) => { for (const d of String(n)) { document.querySelector(`.key[data-key="${d}"]:not(.etal-key)`)?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await new Promise((x) => setTimeout(x, 180)); } const v = document.querySelector('.key[data-key="valider"]:not(.etal-key)'); v?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); v?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); };
  if (f?.q && f.resolve && !f.locked) {
    const q = f.q;
    let n = q.dictee ? q.answer : q.forme === "trouDroite" || q.forme === "trou" ? q.b : q.forme === "trouGauche" ? q.a : q.module === 5 ? q.a * q.b : q.op ? (await import("./js/modules/calc/calc.js")).answerOf(q) : q.a + q.b;
    await taper(r(n)); return "pavé";
  }
  if (s?.q && s.resolve && !s.locked) { const q = s.q; if (q.choices) { const v = juste ? q.answer : q.choices.find((c) => c.value !== q.answer)?.value ?? q.answer; document.querySelector(`.answer[data-value="${v}"]`)?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); return "bulle"; } s.aimed = juste ? q.answer : q.answer + 1; s.answer(s.aimed, null); return "ligne"; }
  if (a.voiliers?.attend && a.voiliers.q) { const q = a.voiliers.q; a.voiliers.api.deposer(juste ? q.k : (q.k + 1) % Math.max(2, (q.bouees?.length ?? 3) + 1)); return "voiliers"; }
  if (a.etal?.attend && a.etal.q) {
    const e = a.etal, q = e.q;
    if (q.type === "rendre") { const { rendu } = await import("./js/modules/etal/etal.js"); for (const d of String(Math.round((juste ? rendu(q) : rendu(q) + 100) / 100))) { document.querySelector(`.etal-key[data-key="${d}"]`)?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await new Promise((x) => setTimeout(x, 180)); } }
    else { const { solution } = await import("./js/modules/etal/etal.js"), cfg = a.module6.niveaux[q.niveau - 1], sol = solution(cfg, q.type === "poser" ? 0 : q.prix, q.portefeuille, q.valeur); for (const v of juste ? sol : sol.slice(0, -1)) { await e.api.deposer(v); await new Promise((x) => setTimeout(x, 120)); } }
    const c = document.querySelector(".etal-coche"); if (c && getComputedStyle(c).visibility === "visible") { c.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); c.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); }
    return "étal";
  }
  return null;
};

// ---------------------------------------------------------------- les actions
// une action tirée devient une action concrète (coordonnées, durées), rejouable telle quelle
const POIDS = [["cible", 26], ["cibleAcote", 8], ["eau", 6], ["rafale", 6], ["appuiLong", 4], ["deuxDoigts", 2], ["mascotte", 4], ["nsp", 4], ["passerEchauffement", 3], ["maison", 5], ["choisirAutre", 4], ["repondreJuste", 14], ["repondreFaux", 5], ["attendre", 5], ["pause", 2], ["veille", 1], ["parent", 1], ["recharger", 1], ["menus", 3]];
// (une graine sur deux, une enfant « sage » : elle joue surtout, et va donc jusqu'au bout des exercices ; l'autre, « dissipée »,
// touche à tout)
const SAGE = new Map([["repondreJuste", 45], ["repondreFaux", 10], ["cible", 12], ["maison", 2], ["menus", 1], ["choisirAutre", 2], ["attendre", 8]]);
const poids = (sage) => POIDS.map(([k, p]) => [k, sage ? SAGE.get(k) ?? Math.max(1, Math.round(p / 3)) : p]);
const tirer = (rnd, sage) => { const P = poids(sage), T = P.reduce((s, [, p]) => s + p, 0); let x = rnd() * T; for (const [k, p] of P) if ((x -= p) < 0) return k; return "cible"; };
async function concretiser(page, rnd, type) {
  const cibles = await page.evaluate(CIBLES), W = VUE.width, H = VUE.height, pick = (l) => l[Math.floor(rnd() * l.length)];
  const par = (re) => cibles.filter((c) => re.test(c.cls + " " + c.quoi));
  switch (type) {
    case "cible": { const c = pick(cibles); return c ? { type: "tap", x: c.x, y: c.y, quoi: c.quoi } : { type: "tap", x: rnd() * W, y: rnd() * H, quoi: "eau" }; }
    case "cibleAcote": { const c = pick(cibles), d = 10 + rnd() * 50, ang = rnd() * 2 * Math.PI; return c ? { type: "tap", x: c.x + (c.w / 2 + d) * Math.cos(ang), y: c.y + (c.h / 2 + d) * Math.sin(ang), quoi: `à côté de ${c.quoi}` } : { type: "tap", x: rnd() * W, y: rnd() * H, quoi: "eau" }; }
    case "eau": return { type: "tap", x: 200 + rnd() * (W - 400), y: 150 + rnd() * (H - 350), quoi: "eau" };
    case "rafale": { const c = pick(cibles) ?? { x: rnd() * W, y: rnd() * H, quoi: "eau" }; return { type: "rafale", x: c.x, y: c.y, n: 2 + Math.floor(rnd() * 2), gap: 30 + rnd() * 120, quoi: c.quoi }; }
    case "appuiLong": { const c = pick(cibles) ?? { x: W / 2, y: H / 2, quoi: "eau" }; return { type: "appui", x: c.x, y: c.y, ms: 600 + rnd() * 900, quoi: c.quoi }; }
    case "deuxDoigts": { const c = pick(cibles) ?? { x: W / 2, y: H / 2 }; return { type: "deuxDoigts", x: c.x, y: c.y, x2: rnd() * W, y2: rnd() * H, ms: 80 + rnd() * 400 }; }
    case "mascotte": { const c = par(/mascotte-tap/)[0]; return c ? { type: "rafale", x: c.x, y: c.y, n: 2 + Math.floor(rnd() * 3), gap: 150 + rnd() * 500, quoi: "la mascotte" } : { type: "attendre", ms: 300 }; }
    case "nsp": { const c = par(/\bnsp\b/)[0]; return c ? { type: "rafale", x: c.x, y: c.y, n: 1 + Math.floor(rnd() * 3), gap: 300 + rnd() * 900, quoi: "je ne sais pas" } : { type: "attendre", ms: 200 }; }
    case "passerEchauffement": { const c = par(/skip-warmup|check-warmup/)[0]; return c ? { type: "tap", x: c.x, y: c.y, quoi: c.quoi } : { type: "attendre", ms: 200 }; }
    case "maison": { const c = par(/homekey|session-home|boutique-retour|retour/)[0]; return c ? { type: "tap", x: c.x, y: c.y, quoi: "la maison" } : { type: "attendre", ms: 200 }; }
    case "choisirAutre": { const c = par(/choisir|choix-ex|choix-tuile/); return c.length ? { type: "deux", x: pick(c).x, y: pick(c).y, quoi: "choisir" } : { type: "attendre", ms: 200 }; }
    case "menus": { const c = par(/galet|choisir|leconskey|reefkey|albumkey|homekey|lecons-tuile|choix-ex|album-tab|boutique-onglet/); const c1 = pick(c); return c1 ? { type: "deux", x: c1.x, y: c1.y, quoi: c1.quoi } : { type: "attendre", ms: 200 }; }
    case "repondreJuste": case "repondreFaux": {
      // pas de question qui attend : l'enfant avance (jouer, choisir, un exercice, un niveau, continuer, la coche, la carte)
      const attend = await page.evaluate(() => { const a = window.__app; return !!((a.facts?.q && a.facts.resolve && !a.facts.locked) || (a.screen?.q && a.screen.resolve && !a.screen.locked) || a.voiliers?.attend || a.etal?.attend); });
      if (attend) return { type: "repondre", juste: type === "repondreJuste" };
      const c = par(/galet|play|choisir|choix-ex|choix-tuile|lecons-tuile|check|shelltap|fin-recompense|cran|atoi|carte/);
      const c1 = pick(c); return c1 ? { type: "deux", x: c1.x, y: c1.y, quoi: c1.quoi } : { type: "attendre", ms: 500 };
    }
    case "attendre": return { type: "attendre", ms: 300 + rnd() * 3000 };
    case "pause": { const c = par(/session-home/)[0]; return c ? { type: "pauseReprise", x: c.x, y: c.y, ms: 400 + rnd() * 2500 } : { type: "attendre", ms: 200 }; }
    case "veille": return { type: "veille", ms: VEILLE_LONGUE ? 300000 : 2000 + rnd() * 8000 };
    case "parent": { const c = par(/\blogo\b/)[0]; return c ? { type: "parent", x: c.x, y: c.y, ms: 400 + rnd() * 2000, sortie: rnd() } : { type: "attendre", ms: 200 }; }
    case "recharger": return { type: "recharger" };
  }
  return { type: "attendre", ms: 200 };
}
const lent = (ms) => ms * Math.max(1, LENT / 2);
async function jouer(page, cdp, act) {
  const touche = (pts) => cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pts.map(([x, y]) => ({ x: Math.max(1, Math.min(VUE.width - 1, x)), y: Math.max(1, Math.min(VUE.height - 1, y)) })) });
  const leve = () => cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  const tap = async (x, y, ms = 60) => { await touche([[x, y]]); await page.waitForTimeout(ms); await leve(); };
  switch (act.type) {
    case "tap": await tap(act.x, act.y); await page.waitForTimeout(lent(250)); break;
    case "deux": await tap(act.x, act.y); await page.waitForTimeout(lent(450)); await tap(act.x, act.y); await page.waitForTimeout(lent(350)); break;
    case "rafale": for (let i = 0; i < act.n; i++) { await tap(act.x, act.y, 40); await page.waitForTimeout(act.gap); } break;
    case "appui": await tap(act.x, act.y, act.ms); await page.waitForTimeout(lent(300)); break;
    case "deuxDoigts": await touche([[act.x, act.y], [act.x2, act.y2]]); await page.waitForTimeout(act.ms); await leve(); await page.waitForTimeout(200); break;
    case "repondre": await page.evaluate(REPONDRE, act.juste).catch(() => {}); await page.waitForTimeout(lent(500)); break;
    case "attendre": await page.waitForTimeout(act.ms); break;
    case "pauseReprise": { await tap(act.x, act.y); await page.waitForTimeout(act.ms); const p = await page.evaluate(() => { const b = document.querySelector(".play.keep"); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }); if (p) await tap(...p); await page.waitForTimeout(lent(300)); break; }
    case "veille": await cdp.send("Page.setWebLifecycleState", { state: "frozen" }).catch(() => {}); await page.waitForTimeout(act.ms); await cdp.send("Page.setWebLifecycleState", { state: "active" }).catch(() => {}); await page.waitForTimeout(300); break;
    case "parent": {
      await touche([[act.x, act.y]]); await page.waitForTimeout(4200); await leve(); await page.waitForTimeout(act.ms);
      // l'enfant ne connaît pas le code : quelques chiffres au hasard, puis « Retour à l'océan », ou la page laissée telle quelle
      const b = await page.evaluate(() => [...document.querySelectorAll(".pa button")].filter((e) => e.checkVisibility()).map((e) => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, e.textContent]; }));
      for (const x of b.filter((x) => /^\d$/.test(x[2])).slice(0, 3)) await tap(x[0], x[1]);
      const retour = b.find((x) => /Retour|Fermer/.test(x[2])); if (retour && act.sortie < 0.85) await tap(retour[0], retour[1]);
      await page.waitForTimeout(400); break;
    }
    case "recharger": await page.reload(); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: lent(60000) }); break;
  }
}

// ---------------------------------------------------------------- une partie : une graine
// `liste` : les actions concrètes à rejouer (au lieu du hasard)
async function partie(graine, { liste = null, cherche = null } = {}) {
  const rnd = hasard(graine * 7919 + 13);
  const browser = await lancer();
  const context = await browser.newContext({ viewport: { width: VUE.width, height: VUE.height }, deviceScaleFactor: VUE.deviceScaleFactor, hasTouch: true });
  await accueilReel(context); await context.addInitScript(INSTRUMENTS);
  const page = await context.newPage(), cdp = await context.newCDPSession(page), erreurs = [];
  page.on("pageerror", (e) => erreurs.push({ t: Date.now(), m: e.message }));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) erreurs.push({ t: Date.now(), m: m.text() }); });
  const defauts = [], faits = [], noter = (quoi, detail) => { if (!defauts.some((d) => d.quoi === quoi)) defauts.push({ quoi, detail, apres: faits.length }); };
  // la garde : une partie qui n'avance plus pendant 3 minutes (une action ou une vérification qui ne rend jamais la main) est
  // arrêtée, avec l'endroit où elle s'est arrêtée et une capture (premières longues séries : deux parties restées une heure)
  let pas = Date.now(), ou = "chargement", bloque = null;
  const garde = setInterval(async () => {
    if (bloque || Date.now() - pas < lent(180000)) return;
    bloque = { ou, apres: faits.length };
    await page.screenshot({ path: join(OUT, `bloque-${graine}.png`), timeout: 10000 }).catch(() => {});
    bloque.etat = await Promise.race([page.evaluate(() => ({ ...window.__enfantContexte?.(), scene: window.__app?.etal?.api?.etat?.() ?? window.__app?.voiliers?.api?.etat?.() ?? null })).catch((x) => x.message), new Promise((r) => setTimeout(() => r("(la page ne répond plus)"), 10000))]);
    context.close().catch(() => {});
  }, 5000);
  try {
    await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
    // une graine sur deux : la base d'un mois (des créatures, des étoiles) ; sinon une base neuve
    if (graine % 2 === 0) await page.evaluate(async (d) => { await window.__app.store.restore(d, ["reglages"]); }, BASE);
    await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
    if (LENT > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: LENT });
    let dernierTouchable = Date.now(), dernierEtat = 0, nPhrases = 0; const vus = new Set();
    const verifier = async (quand) => {
      let e;
      try { e = await page.evaluate(ETAT); } catch (x) { if (/Execution context was destroyed|navigation/i.test(x.message)) return; throw x; }
      for (const p of e.pb) noter(`incohérence : ${p.replace(/\d+/g, "#")}`, `${p} (${quand} ; ${JSON.stringify(e.c)})`);
      if (e.touchable || e.c.pause || e.c.parent) dernierTouchable = Date.now();
      else if (Date.now() - dernierTouchable > lent(IMPASSE_MS)) noter("impasse : rien à toucher pendant 20 s", JSON.stringify(e.c));
      // les phrases : un exercice qui n'est plus à l'écran ne parle pas
      vus.add([e.c.mode ?? "accueil", e.c.etape, e.c.module, e.c.pause && "pause", e.c.recif && "récif", e.c.album && "album", e.c.boutique && "boutique", e.c.parent && "parent"].filter(Boolean).join(" "));
      const nouvelles = await page.evaluate(() => { const l = window.__enfant.phrases.splice(0); return l; }).catch(() => []);
      nPhrases += nouvelles.length;
      for (const p of nouvelles) { const pb = phraseHorsEcran(p); if (pb) noter(`phrase d'une étape quittée : ${pb.split(" (")[0]}`, `« ${p.texte} » ${pb} ; ${JSON.stringify(p.ctx)}`); }
      for (const x of erreurs.splice(0)) noter(`erreur : ${x.m.slice(0, 80)}`, x.m);
      dernierEtat = Date.now();
    };
    const n = liste ? liste.length : ACTIONS;
    for (let i = 0; i < n; i++) {
      pas = Date.now(); ou = `choix de l'action ${i + 1}`;
      const act = liste ? liste[i] : await concretiser(page, rnd, tirer(rnd, graine % 4 < 2));
      faits.push(act); pas = Date.now(); ou = `action ${i + 1} : ${act.type}${act.quoi ? ` (${act.quoi})` : ""}`;
      await jouer(page, cdp, act).catch((x) => noter(`action impossible : ${act.type}`, x.message.split("\n")[0]));
      // (--panne : le contrôle du contrôle ; à la 5e action, une touche du pavé orpheline et une erreur de page, qui doivent
      // être vues)
      if (PANNE && i === 4) await page.evaluate(() => { const b = document.createElement("button"); b.className = "bubble key"; b.dataset.key = "5"; Object.assign(b.style, { position: "absolute", left: "600px", top: "600px", width: "80px", height: "80px" }); document.querySelector("#ui").append(b); setTimeout(() => { throw new Error("panne volontaire"); }, 10); });
      pas = Date.now(); ou = `vérification après l'action ${i + 1} : ${act.type}`;
      await verifier(`après ${act.type}${act.quoi ? ` (${act.quoi})` : ""}`);
      if (Date.now() - dernierEtat > 1000) await verifier("chaque seconde");
      if (cherche && defauts.some((d) => d.quoi === cherche)) break;
    }
    await page.waitForTimeout(1500); await verifier("à la fin");
    const temps = await page.evaluate(() => { const g = window.__enfant.gaps.filter((x) => x < 2000).sort((a, b) => a - b); return g.length ? { moyenne: +(g.reduce((s, x) => s + x, 0) / g.length).toFixed(1), p95: +g[Math.floor(0.95 * (g.length - 1))].toFixed(1), images: g.length } : null; }).catch(() => null);
    return { graine, actions: faits.length, defauts, temps, faits, vus: [...vus], phrases: nPhrases };
  } catch (x) {
    if (!bloque) throw x;
    noter(`partie bloquée : ${bloque.ou.replace(/\d+/g, "#")}`, `${bloque.ou} ; ${typeof bloque.etat === "string" ? bloque.etat : JSON.stringify(bloque.etat)}`);
    return { graine, actions: faits.length, defauts, temps: null, faits, vus: [], phrases: 0 };
  } finally { clearInterval(garde); await context.close().catch(() => {}); await browser.close().catch(() => {}); }
}
// un exercice parle alors qu'il n'est plus à l'écran : la phrase est rattachée au fichier qui l'a demandée
const PROPRIETAIRES = [[/^modules\/voiliers\//, "voiliers"], [/^modules\/etal\/|^lessons\/etal\.js/, "etal"], [/^modules\/calc\//, "calc"], [/^modules\/mult\//, "mult"]];
function phraseHorsEcran(p) {
  const c = p.ctx; if (!c) return null;
  for (const [re, quoi] of PROPRIETAIRES) {
    if (!p.pile.some((f) => re.test(f))) continue;
    if (quoi === "voiliers" && !c.voiliers) return `(les voiliers ne sont plus là : ${p.pile.join(" < ")})`;
    if (quoi === "etal" && !c.etal) return `(l'étal n'est plus là : ${p.pile.join(" < ")})`;
    if ((quoi === "calc" || quoi === "mult") && c.mode === null && !c.facts) return `(${quoi} parle à l'accueil : ${p.pile.join(" < ")})`;
  }
  // à l'accueil (rien d'ouvert), aucune phrase d'exercice
  if (c.mode === null && !c.recif && !c.album && !c.boutique && p.pile.some((f) => /^modules\//.test(f))) return `(un exercice parle à l'accueil : ${p.pile.join(" < ")})`;
  return null;
}

// ---------------------------------------------------------------- la fuite : 20 tours accueil, jeu, accueil
async function fuite() {
  const browser = await lancer();
  const context = await browser.newContext({ viewport: { width: VUE.width, height: VUE.height }, deviceScaleFactor: VUE.deviceScaleFactor, hasTouch: true });
  await context.addInitScript(INSTRUMENTS);
  const page = await context.newPage(), erreurs = [];
  page.on("pageerror", (e) => erreurs.push(e.message));
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  // la séance du jour faite : l'accueil propose « Encore ! », l'entraînement libre, que la maison quitte pour l'accueil
  await page.evaluate(async (d) => { await window.__app.store.restore(d, ["reglages"]); await window.__app.store.add("seances", { debut: Date.now() - 600000, fin: Date.now() - 60000, terminee: true, module: 1, questions: 20, justes: 18, etapes: [] }); }, BASE);
  await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&sansLecon"); await page.waitForFunction(() => window.__ready !== undefined);
  const exos = ["ligne", "additions", "calcul", "voiliers", "multiplication", "etal"], releves = [];
  const accueil = async () => { await page.waitForSelector(".galet.again", { timeout: 30000 }); await page.waitForTimeout(1500); return page.evaluate(() => window.__enfant.comptes()); };
  releves.push(await accueil());
  for (let t = 0; t < 20; t++) {
    await page.locator(".galet.again").first().tap({ force: true });
    await page.waitForSelector(".choix-ex", { timeout: 20000 }); await page.waitForTimeout(300);
    const k = `.choix-ex[data-key="${exos[t % exos.length]}"]`;
    await page.locator(k).first().tap({ force: true }); await page.waitForTimeout(450); if (await page.locator(k).count()) await page.locator(k).first().tap({ force: true });
    await page.waitForSelector(".choix-tuile", { timeout: 20000 }); await page.waitForTimeout(300);
    await page.locator('.choix-tuile[data-key="1"]').first().tap({ force: true }); await page.waitForTimeout(450); if (await page.locator('.choix-tuile[data-key="1"]').count()) await page.locator('.choix-tuile[data-key="1"]').first().tap({ force: true });
    // une question ou deux, puis la maison
    for (let q = 0; q < 2; q++) { await page.waitForFunction(() => { const a = window.__app; return (a.facts?.q && a.facts.resolve && !a.facts.locked) || (a.screen?.q && a.screen.resolve && !a.screen.locked) || a.voiliers?.attend || a.etal?.attend; }, null, { timeout: 60000 }).catch(() => {}); await page.evaluate(REPONDRE, true).catch(() => {}); await page.waitForTimeout(1200); }
    await page.locator(".session-home").first().tap({ force: true });
    releves.push(await accueil());
  }
  await context.close(); await browser.close();
  return { releves, erreurs };
}

// ---------------------------------------------------------------- le déroulement
const resume = { debut: new Date().toISOString(), vue: VUE, lent: LENT, parties: [] };
if (REJOUER) {
  const d = JSON.parse(readFileSync(REJOUER, "utf8"));
  let liste = d.faits.slice(0, d.defaut.apres + 1);
  const montre = async (l) => (await partie(d.graine, { liste: l, cherche: d.defaut.quoi })).defauts.some((x) => x.quoi === d.defaut.quoi);
  console.log(`rejoue ${liste.length} actions de la graine ${d.graine} : « ${d.defaut.quoi} »`);
  if (!(await montre(liste))) console.log("     le défaut ne se reproduit pas à l'identique (le hasard de l'application) ; nouvel essai…");
  if (REDUIRE) {
    // delta-debugging : retirer des tranches d'actions tant que le défaut se montre encore (deux essais par candidat)
    let k = 2;
    while (liste.length >= 2) {
      const pas = Math.ceil(liste.length / k); let reduit = false;
      for (let i = 0; i < liste.length; i += pas) {
        const cand = [...liste.slice(0, i), ...liste.slice(i + pas)];
        if (await montre(cand) || await montre(cand)) { liste = cand; k = Math.max(k - 1, 2); reduit = true; console.log(`     ${liste.length} actions`); break; }
      }
      if (!reduit) { if (k >= liste.length) break; k = Math.min(liste.length, k * 2); }
    }
    writeFileSync(REJOUER.replace(/\.json$/, "-reduit.json"), JSON.stringify({ ...d, faits: liste, defaut: { ...d.defaut, apres: liste.length - 1 } }, null, 1));
    console.log(`plus courte suite trouvée : ${liste.length} action(s) : ${liste.map((a) => a.type + (a.quoi ? `(${a.quoi})` : "")).join(", ")}`);
  }
} else if (FUITE) {
  const { releves, erreurs } = await fuite();
  const d = releves[1], f = releves.at(-1);
  console.log(`     tours : 20 ; après le 1er : ${JSON.stringify(d)} ; après le 20e : ${JSON.stringify(f)}`);
  resume.fuite = { releves, erreurs };
  const ok = Math.abs(f.elements - d.elements) <= 5 && f.canvas <= d.canvas && f.minuteries <= d.minuteries + 2 && f.ecouteurs <= d.ecouteurs;
  console.log(`${ok ? "ok  " : "ÉCHEC"} pas de fuite : éléments ${d.elements} → ${f.elements}, canvas ${d.canvas} → ${f.canvas}, minuteries ${d.minuteries} → ${f.minuteries}, écouteurs ${d.ecouteurs} → ${f.ecouteurs}`);
  console.log(`${!erreurs.length ? "ok  " : "ÉCHEC"} aucune erreur dans la page${erreurs.length ? ` (${erreurs[0]})` : ""}`);
  process.exitCode = ok && !erreurs.length ? 0 : 1;
} else {
  const graines = Array.from({ length: GRAINES }, (_, i) => DEPART + i);
  let suivante = 0;
  await Promise.all(Array.from({ length: PARALLELE }, async () => {
    while (suivante < graines.length) {
      const g = graines[suivante++], t0 = Date.now();
      const r = await partie(g).catch((e) => ({ graine: g, actions: 0, defauts: [{ quoi: `partie interrompue : ${e.message.split("\n")[0].slice(0, 80)}`, detail: e.stack, apres: 0 }], faits: [] }));
      r.dureeS = Math.round((Date.now() - t0) / 1000);
      for (const d of r.defauts) writeFileSync(join(OUT, `defaut-${g}-${d.quoi.replace(/[^a-z0-9]+/gi, "-").slice(0, 50)}.json`), JSON.stringify({ graine: g, vue: VUE, lent: LENT, defaut: d, faits: r.faits }, null, 1));
      console.log(`${r.defauts.length ? "ÉCHEC" : "ok  "} graine ${g} : ${r.actions} actions en ${r.dureeS} s${r.temps ? `, image ${r.temps.moyenne} ms (95e centile ${r.temps.p95})` : ""}${r.defauts.length ? ` ; ${r.defauts.map((d) => d.quoi).join(" ; ")}` : ""}`);
      resume.parties.push({ graine: g, actions: r.actions, dureeS: r.dureeS, temps: r.temps, vus: r.vus, phrases: r.phrases, types: Object.entries(r.faits.reduce((m, a) => ({ ...m, [a.type]: (m[a.type] ?? 0) + 1 }), {})), defauts: r.defauts.map(({ quoi, detail, apres }) => ({ quoi, detail: String(detail).slice(0, 600), apres })) });
    }
  }));
  const tous = resume.parties.flatMap((p) => p.defauts.map((d) => d.quoi));
  const par = {}; for (const q of tous) par[q] = (par[q] ?? 0) + 1;
  console.log(`\n${resume.parties.length} graines, ${resume.parties.reduce((s, p) => s + p.actions, 0)} actions ; ${tous.length ? `défauts : ${Object.entries(par).map(([q, n]) => `${q} (${n})`).join(" ; ")}` : "aucun défaut"}`);
  process.exitCode = tous.length ? 1 : 0;
}
writeFileSync(join(OUT, `resume-${TABLETTE ? "tablette" : "1280"}-lent${LENT}${FUITE ? "-fuite" : ""}-${DEPART}.json`), JSON.stringify(resume, null, 1));
srv.close();
