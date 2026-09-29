// DÉMARRAGE. Charge l'atlas et les planches nécessaires au premier écran (fond, pieuvre au repos,
// décor), lance l'animation, puis charge le reste en arrière-plan (gestes de la pieuvre).
// Premier écran : l'océan vivant et une grosse bulle « jouer » (ou, si la séance du jour est déjà faite,
// la lune en décor et la bulle « Encore ! » de l'entraînement libre), le récif et l'album ; le premier
// toucher débloque la voix et lance la séance (session/session.js). Pendant la séance, la maison (en haut
// à gauche) la met en pause ; la frise d'avancement montre où l'on en est.
import { repriseText } from "./engine/toucher.js";
import { Ocean, rng } from "./engine/ocean.js";
import { LineView } from "./engine/line.js";
import { persist, Store } from "./engine/store.js";
import { loadAtlas, Sprites } from "./engine/sprites.js";
import { Stage } from "./engine/stage.js";
import { Voice } from "./engine/voice.js";
import { pickMusic, Sound } from "./engine/son.js";
import { LessonPlayer } from "./lessons/player.js";
import { Module1Runner } from "./modules/numberline/runner.js";
import { fill, ReadScreen } from "./modules/numberline/screen.js";
import { runNotion } from "./session/notion.js";
import { FactsScreen, runWarmup } from "./modules/facts/screen.js";
import { Warmup } from "./modules/facts/warmup.js";
import { WarmupSkip } from "./modules/facts/warmupskip.js";
import { Module2Runner } from "./modules/facts/runner.js";
import { calcMastery, Module3Runner } from "./modules/calc/runner.js";
import { CalcScreen } from "./modules/calc/screen.js";
import { median } from "./modules/facts/facts.js";
import { Hermit } from "./engine/hermit.js";
import { runChallenge } from "./modules/facts/challenge.js";
import { Dictation } from "./modules/numberline/dictation.js";
import { AidBoard } from "./modules/facts/aids.js";
import { ChallengeView } from "./modules/facts/challengeView.js";
import { Rewards } from "./session/rewards.js";
import { chooseName, goodNight, onTap, reward, spriteBox, StarHud } from "./session/screens.js";
import { challengeReady, doneToday, sameDay, Session } from "./session/session.js";
import { Reef } from "./session/reef.js";
import { drawSurprise, playSurprise, previousSession } from "./session/surprise.js";
import { Album } from "./session/album.js";
import { Frieze } from "./session/frieze.js";
import { FreeTraining } from "./session/free.js";
import { allowedCrans, chooseCran } from "./session/selector.js";
import { choose } from "./session/choice.js";
import { clock } from "./engine/clock.js";
import { onBrief, pop, skipKey } from "./engine/ui.js";
import { ParentSpace, parentLogo } from "./parent/parent.js";

const T0 = performance.now();
const json = async (p) => (await fetch(p)).json();

const stage = new Stage(document.getElementById("stage"));
// hors ligne : le service worker met toute l'application en cache (pas en file://, ni pendant les tests qui
// le désactivent), avec une seule résolution des planches d'images : celle que cet écran utilise (sprites.js)
if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !location.search.includes("nosw")) navigator.serviceWorker.register(`sw.js?r=${stage.px > 1.2 ? 2 : 1}`).catch(() => {});
const [atlas, module1, module2, textes, seance, lecons, cartes, calendrier, parentContent, voix] = await Promise.all([loadAtlas(), json("content/module1.json"), json("content/module2.json"), json("content/textes.json"), json("content/seance.json"), json("content/lecons.json"), json("content/cartes.json"), json("content/calendrier.json"), json("content/parent.json"), json("assets/voix/index.json").catch(() => null)]);
const [sonContent, sonIndex, module3, legendes] = await Promise.all([json("content/son.json"), json("assets/son/index.json").catch(() => null), json("content/module3.json"), json("content/legendes.json")]);
const sprites = new Sprites(atlas, stage.px);
// la base locale ; au premier lancement, on demande au navigateur de ne jamais l'effacer de lui-même
const store = await Store.open();
if (!(await store.setting("premierLancement"))) { await store.setSetting("premierLancement", new Date().toISOString()); await store.setSetting("stockagePersistant", await persist()); }
await Promise.all(["fond", "rayons", "pieuvre", "algues", "poissons", "petits", "tortue"].map((s) => sprites.load(s)));
const ocean = new Ocean(stage, sprites, atlas);
ocean.paintStatic();
stage.ticks.add((t, dt) => { ocean.update(t, dt); ocean.render(); });
stage.start();
// un changement d'échelle (rotation, fenêtre) demanderait d'autres planches : on recharge simplement
stage.onResize(() => { if (Math.abs(stage.px - sprites.px) > 0.01) location.reload(); });

const rnd = rng(Date.now() & 0xffffffff);
// pour les tests et les captures : ?module=2 ?cran=dur ?surprise=cadeau:corail ?voix=rapide ?niveau=N ?format=lire|sauter|placer|estimer ?questions=N ?guides=N ?faits=N ?sans=etape ?sansLecon ?lecon=L1 ?etoiles=N
const P = new URLSearchParams(location.search);
const text = { data: textes, pick: (k, v = {}) => { const e = textes[k]; return fill(Array.isArray(e) ? e[Math.floor(rnd() * e.length)] : e, { mascotte: app.mascotte, ...v }); } };
// les phrases fabriquées à l'avance (assets/voix/) ; ?voix=synthese : seulement la synthèse du navigateur (comparaison)
const voice = new Voice({ rate: 0.9, fast: P.get("voix") === "rapide" }).setIndex(P.get("voix") === "synthese" ? null : voix);
// les bruitages et la musique (lot 2) ; ?son=non : silence (mesures)
const sound = new Sound({ content: sonContent, index: sonIndex, off: P.get("son") === "non" });
sound.setPrefs(await store.setting("son"));
// chaque toucher débloque (ou réveille) le son ; un bouton fait son petit bruit (pas les bulles-réponses, qui ont
// les leurs, ni le coquillage)
document.addEventListener("pointerdown", (e) => {
  sound.unlock();
  const b = e.target.closest?.("#ui button");
  if (b && !b.matches(".answer, .shelltap, .touchband") && !b.disabled) sound.play("bouton");
}, { capture: true });
// lot 3, étape 5 : le journal des incidents techniques (erreur de page, image introuvable), avec leur contexte, dans la
// console et dans l'espace parent (« Données et réglages », réglage journalErreurs : les 20 derniers)
const journal = async (e) => {
  try {
    const ctx = { t: Date.now(), ecran: (() => { try { return mode; } catch { return null; } })(), etape: window.__app?.session?.progress?.etape ?? null, enPause: !!window.__app?.enPause, ...e };
    console.warn("incident noté pour l'espace parent :", ctx);
    const l = (await store.setting("journalErreurs")) ?? []; l.push(ctx); await store.setSetting("journalErreurs", l.slice(-20));
  } catch { /* le journal ne doit jamais gêner l'enfant */ }
};
sprites.onMissing = (c) => journal({ type: "image introuvable", ...c });
addEventListener("error", (ev) => journal({ type: "erreur de page", message: ev.message, source: `${(ev.filename ?? "").split("/").pop()}:${ev.lineno}`, pile: ev.error?.stack?.split("\n").slice(0, 4).join(" | ") ?? null }));
addEventListener("unhandledrejection", (ev) => journal({ type: "erreur de page", message: String(ev.reason?.message ?? ev.reason), pile: ev.reason?.stack?.split("\n").slice(0, 4).join(" | ") ?? null }));
const rewards = await new Rewards(store, cartes, calendrier).load();
if (P.get("etoiles")) { rewards.st.total = Number(P.get("etoiles")); await rewards.save(); } // tests : un trésor de départ
const app = { stage, sprites, ocean, voice, sound, text, rnd, atlas, store, rewards, lecons, cartes, calendrier, clock, legendes, line: new LineView(stage), mascotte: await store.setting("mascotte") };
// la vitesse des animations des exemples guidés et des corrections (1 : la vitesse d'origine ; la voix garde son débit)
app.vitesse = seance.vitesseAnimations ?? 1;
app.toucher = seance.toucher ?? {}; // (lot 3 bis, A5 : le double toucher)
app.lineScreen = () => (app.screen ??= new ReadScreen(app));
// lot 2, étape 8 : la dictée de nombres (niveau 12) prend le pavé de l'écran des additions ; les chaluts des centaines vont sur le calque des aides
app.dictation = new Dictation(app, () => (app.facts ??= new FactsScreen(app, module2)));
app.aidBoard ??= new AidBoard(app); // l'écran de la ligne (aussi pour l'aide des faits + 1, + 2)
// lot 3, étape 4 : le calcul rapide prend l'ardoise et le pavé de l'écran des additions
app.calc = new CalcScreen(app, () => (app.facts ??= new FactsScreen(app, module2)));
app.module3 = module3;
window.__app = app;
// la musique baisse pendant que la voix parle
stage.ticks.add(() => sound.duck(voice.speaking));

// le premier écran est prêt : on le note pour la mesure du démarrage
requestAnimationFrame(() => requestAnimationFrame(() => { performance.mark("app-ready"); window.__ready = performance.now() - T0; }));
sprites.load("pieuvre-gestes").then(() => ocean.octo.warm("pieuvre-gestes"));
sprites.load("aides"); // lot 2 : les aides visuelles du module 2 (petite planche : cadre de 10, maison, bulle dorée)

// ---------------------------------------------------------------- en-tête : réécouter, étoiles de mer
// (lot 3 bis, R22) « réécouter » reste visible pendant la pause (`keep`) ; à l'accueil, il redit ce qu'on peut faire ; en
// pause, il le dit aussi, avec une file de voix à part (la voix de la séance, en pause, est rendue intacte ensuite)
const speaker = spriteBox(app, { x: 1140, y: 8, w: 130, h: 130, cls: "hud speaker keep", label: "réécouter", paint: (ctx) => sprites.draw(ctx, "reecouter", 0, 65, 65) });
let pauseTalk = null;
onTap(speaker, async () => {
  speaker.classList.remove("pop"); void speaker.offsetWidth; speaker.classList.add("pop");
  if (app.enPause && !visiting) {
    if (pauseTalk) return;
    pauseTalk = voice.suspend();
    try { await voice.say(text.data.pauseConsigne); } finally { voice.restore(pauseTalk); pauseTalk = null; }
    return;
  }
  voice.replay();
});
const hud = new StarHud(app, rewards);
app.hud = hud;

// ---------------------------------------------------------------- la séance
// les étapes que l'application sait jouer (les autres sont sautées : défi et problème du jour sont
// désactivés au lot 1)
// une leçon animée (L1 à L3), « rejouer » et « passer » dès la première vue
const lessons = new LessonPlayer(app, lecons);
app.lessons = lessons;
const lessonIn = () => (id) => lessons.play(id); // notée dans la séance par runNotion
const handlers = {
  accueil: async ({ session }) => {
    // la musique de la séance : l'une des trois, tirée au hasard, gardée toute la séance (pause comprise)
    session.rec.musique ??= pickMusic(sonIndex, rnd); await session.save(); sound.startMusic(session.rec.musique);
    // premier lancement : l'enfant choisit le nom de la pieuvre ; ensuite, la pieuvre salue
    if (!app.mascotte) {
      app.mascotte = await chooseName(app, seance.noms); await store.setSetting("mascotte", app.mascotte);
      ocean.octo.play("rejouir"); await voice.say(text.pick("nomChoisi"));
    } else { ocean.octo.play("saluer"); await voice.say(text.pick("accueil")); }
    // une séance sur cinq environ : une surprise (un visiteur, ou un cadeau pour le récif) ; ?surprise=cadeau:corail|visite:tortue (tests)
    const forced = P.get("surprise")?.split(":"), prev = previousSession(await store.all("seances"), session.id);
    const s = forced ? { type: forced[0], id: forced[1] } : drawSurprise(rnd, cartes.surprise, prev, rewards.gifts);
    if (s) { session.rec.surprise = s; await session.save(); await playSurprise(app, s); }
    // lot 2 : le sélecteur de difficulté (?cran=dur pour les tests : sans l'écran)
    if (seance.selecteur?.actif) await session.setCran(P.get("cran") ?? await chooseCran(app, { allowed: allowedCrans(await store.setting("cransAutorises")), attenteS: seance.selecteur.attenteS }));
  },
  // échauffement : faits d'addition dus (familles 1 et 2 au lot 1), précédés des questions du temps de base
  echauffement: async (ctx) => {
    const screen = (app.facts ??= new FactsScreen(app, module2)), warmup = await new Warmup({ store, content: module2, rnd, seance: ctx.session.id, cran: () => ctx.session.cran, dejaNouveaux: ctx.session.nouveaux }).load();
    const step = { ...ctx.step, ...(P.get("faits") ? { questions: [Number(P.get("faits")), Number(P.get("faits"))] } : {}) };
    app.warmup = warmup;
    // lot 3 ter (T1) : le bouton « passer l'échauffement », présent pendant tout l'échauffement, confirmé par la coche
    const skip = (onSkip) => warmupSkipKey(onSkip);
    await runWarmup({ ...ctx, step, warmup, screen, rnd, skip, intro: async (skipped) => { await voice.say(text.pick("echauffement")); if (!warmup.base.mesures.length && !skipped()) await voice.say(text.data.pave); } });
  },
  notion: async (ctx) => {
    frieze.notionIcon(ctx.session.rec.module);
    if (ctx.session.rec.module === 2) return notion2(ctx);
    if (ctx.session.rec.module === 3) return notion3(ctx);
    const screen = app.lineScreen();
    // lot 3 : le niveau choisi par l'enfant (écran « choisir ») : toutes les questions à ce niveau
    const runner = await new Module1Runner({ screen, store, content: module1, rnd, seance: ctx.session.id, variete: seance.variete, offset: () => ctx.session.offset, cran: () => ctx.session.cran, choix: ctx.session.choix?.niveau ?? null }).load();
    if (P.get("niveau")) { runner.st.niveau = Number(P.get("niveau")); runner.save = () => {}; }
    if (P.get("format")) runner.levels = runner.levels.map((c) => ({ ...c, formats: [P.get("format")] }));
    const step = { ...ctx.step, ...(P.get("questions") ? { questions: [Number(P.get("questions")), Number(P.get("questions"))] } : {}), ...(P.get("guides") ? { guides: Number(P.get("guides")) } : {}) };
    app.runner = runner;
    await runNotion({ ...ctx, step, runner, screen, lesson: P.has("sansLecon") ? async () => false : lessonIn(ctx.session), rnd });
    screen.leave();
  },
  // lot 2, étape 7 : le défi record (une minute, faits en boîte 3 ou plus, la bulle qui se vide, le record)
  defi: async (ctx) => {
    const screen = (app.facts ??= new FactsScreen(app, module2)), warmup = await new Warmup({ store, content: module2, rnd, seance: ctx.session.id, cran: () => "conseille" }).load();
    warmup.defi = true;
    await sprites.load("defi");
    const view = new ChallengeView(app); app.challenge = view;
    try {
      await runChallenge({ ...ctx, warmup, screen, view, store, rnd, octo: ocean.octo, stars: seance.etoiles, say: (k, v = {}) => voice.say(text.pick(k, v)) });
    } finally { view.remove(); app.challenge = null; sprites.unload("defi"); }
  },
  recompense: (ctx) => reward(app, { ...ctx, hud }),
};
// lot 2, étape 6 : la notion du jour sur les additions (docs/SPEC-LOT2.md, section 3) : l'écran des additions, le
// bernard-l'ermite (planche « ermite », chargée le temps de l'étape), la leçon de la famille la première fois
// (L4 à L6), sinon deux exemples guidés ; une famille acquise rapporte une étoile arc-en-ciel
async function notion2(ctx) {
  const { session } = ctx, screen = (app.facts ??= new FactsScreen(app, module2));
  const runner = await new Module2Runner({ store, content: module2, rnd, seance: session.id, variete: seance.variete, cran: () => session.cran, dejaNouveaux: session.nouveaux, choix: session.choix?.famille ?? null }).load();
  const conf = ctx.step.module2 ?? ctx.step, step = { ...ctx.step, ...conf, ...(P.get("questions") ? { questions: [Number(P.get("questions")), Number(P.get("questions"))] } : {}), ...(P.get("guides") ? { guides: Number(P.get("guides")) } : {}) };
  app.runner = runner; session.rec.famille = runner.famille; await session.save();
  await Promise.all([sprites.load("ermite"), sprites.load("aides")]);
  const hermit = new Hermit(ocean, { x: 150, y: 776, scale: 0.85 }); // (lot 3 bis, R20 : un peu plus haut, il était coupé par le bas de l'écran)
  screen.hermit = hermit; screen.notion = true; app.hermit = hermit;
  hermit.show(true); hermit.play("sortir");
  screen.show(true); screen.keys(false);
  await voice.say(text.pick("notionFaits"));
  const ask = { ask: async (q, cfg, o) => screen.askNotion(q, cfg, o) };
  try {
    const res = await runNotion({ ...ctx, step, runner, screen: ask, lesson: P.has("sansLecon") ? async () => false : lessonIn(session), rnd });
    for (const e of res?.events ?? []) { if (e.type === "acquise" && !e.parent && !(runner.events ?? []).some((x) => x.famille === e.famille)) await session.levelUp(); (session.rec.familles ??= []).push(e); }
  } finally {
    session.nouveaux = runner.nouveaux; session.rec.faitsNouveaux = runner.nouveaux; await session.save();
    screen.notion = false; screen.hermit = null; app.hermit = null; screen.leave(); hermit.remove(); sprites.unload("ermite");
  }
}
// lot 3, étape 4 : la notion du jour sur le calcul rapide (docs/SPEC-LOT3.md, section 6) : l'écran des additions (ardoise,
// pavé), le mur de corail, le chemin et le petit poisson (planche « calcul », chargée le temps de l'étape) ; la leçon
// d'entrée du niveau (L7, L8, L9), les 3 calculs guidés d'un nouveau niveau ; un niveau acquis rapporte une étoile arc-en-ciel
async function notion3(ctx) {
  const { session } = ctx, conf = ctx.step.module3 ?? ctx.step;
  const step = { ...ctx.step, ...conf, ...(P.get("questions") ? { questions: [Number(P.get("questions")), Number(P.get("questions"))] } : {}) };
  const base = median((await store.setting("tempsDeBase"))?.mesures ?? []) ?? module2.base.defautS * 1000;
  const runner = await new Module3Runner({ store, content: module3, content2: module2, rnd, seance: session.id, variete: seance.variete, cran: () => session.cran, choix: session.choix?.module === 3 ? session.choix.niveau : null, baseMs: base }).load();
  app.runner = runner; session.rec.niveauCalcul = runner.niveau; await session.save();
  await sprites.load("calcul");
  const fs = (app.facts ??= new FactsScreen(app, module2)); fs.show(true); fs.keys(false);
  // (lot 3 bis, B4) « Le petit poisson va t'aider » n'est dit que s'il est à l'écran : aux niveaux du mur, le mur et le poisson
  // sont montrés le temps de la phrase ; sinon, une phrase sans le poisson
  if (module3.niveaux.find((c) => c.niveau === runner.niveau)?.support === "mur") await app.calc.introWall(text.pick("notionCalculMur"));
  else await voice.say(text.pick("notionCalcul"));
  try {
    await runNotion({ ...ctx, step, runner, screen: { ask: (q) => app.calc.askNotion(q) }, lesson: P.has("sansLecon") ? async () => false : lessonIn(session), rnd });
  } finally { app.calc.leave(); sprites.unload("calcul"); }
}
// LOT 3 TER (docs/SPEC-LOT3TER.md, T1 ; décision du parent) : « PASSER L'ÉCHAUFFEMENT ». Un bouton dédié (son propre
// pictogramme, `passer.echauffement`), présent pendant tout l'échauffement, hors du pavé (content/seance.json,
// `passerEchauffement`). Touché, l'échauffement est EN ATTENTE : l'horloge et la voix de la séance sont mises en pause puis
// de côté (comme pour une visite depuis l'accueil en pause), le pavé se ferme, la question reste affichée, les autres
// « passer » sont masqués ; la voix demande de toucher la coche, qui remplace le bouton. La coche touchée : l'échauffement
// est passé (`onSkip`). Rien pendant `attenteMs` : la coche s'en va, le bouton revient, tout reprend où c'en était et la
// consigne de la question en cours est redite. La règle (états, délai) : modules/facts/warmupskip.js.
function warmupSkipKey(onSkip) {
  const C = seance.passerEchauffement ?? {}, [x, y] = C.place ?? [1205, 400], S = C.taille ?? 140;
  const key = spriteBox(app, { x: x - S / 2, y: y - S / 2, w: S, h: S, cls: "bubble skip-warmup", label: "passer l'échauffement", paint: (ctx) => sprites.draw(ctx, "passer.echauffement", 0, S / 2, S / 2) });
  const check = spriteBox(app, { x: x - 80, y: y - 80, w: 160, h: 160, cls: "bubble check-warmup", label: "oui, passer l'échauffement", paint: (ctx) => sprites.draw(ctx, "valider", 0, 80, 80) });
  let cs = null, vs = null, vis = [];
  const pad = () => (app.facts ? [app.facts.help, app.facts.nsp, ...app.facts.els] : []);
  // la séance retrouve son horloge et sa voix (toujours en pause) ; ce que disait la question de confirmation est coupé
  const back = () => { voice.stop(); voice.restore(vs); clock.restore(cs); stage.root.classList.remove("attente-passer"); app.warmupPending = false; };
  const ws = new WarmupSkip({
    attenteMs: C.attenteMs ?? 5000,
    showKey: (v) => { key.style.visibility = v ? "visible" : "hidden"; if (v) pop(key); },
    showCheck: (v) => { check.style.visibility = v ? "visible" : "hidden"; if (v) pop(check); },
    pause: () => {
      clock.pause(); voice.pause(); stage.root.classList.add("attente-passer"); app.warmupPending = true;
      vis = pad().map((e) => [e, e.style.visibility]); app.facts?.keys(false);
      cs = clock.suspend(); vs = voice.suspend();
    },
    ask: () => voice.say(text.data.passerEchauffementQuestion, { instruction: true }),
    resume: () => {
      back(); for (const [e, v] of vis) e.style.visibility = v;
      clock.resume(); voice.resume();
      if (awaiting() && voice.instruction) { if (voice.cur) voice.stop(); voice.say(voice.instruction); }
    },
    confirm: () => { back(); voice.stop(); clock.resume(); voice.resume(); onSkip(); },
  });
  onTap(key, () => ws.tap());
  onTap(check, () => { pop(check); ws.check(); });
  app.warmupSkip = ws;
  return { remove() { ws.stop(); key.remove(); check.remove(); if (app.warmupSkip === ws) app.warmupSkip = null; } };
}
// pour les mesures : ?sans=echauffement (ou une autre étape) la saute
for (const id of (P.get("sans") ?? "").split(",").filter(Boolean)) delete handlers[id];
// chaque gain d'étoiles pendant les questions : les étoiles s'envolent des bulles-réponses vers le compteur
// (le bilan de fin de séance fait voler les siennes lui-même)
rewards.onChange((n, raison) => { if (raison !== "séance terminée") hud.fly(n, app.starFrom ?? [640, 690], { gap: 140 }); });

// ---------------------------------------------------------------- premier écran
// L'océan vivant, la bulle « jouer » (ou la lune et « Encore ! » si la séance du jour est faite), la bulle
// du récif et le livre de l'album : la visite du récif et de l'album est toujours libre (docs/SPEC.md,
// « Séance plafonnée »).
const reef = new Reef(app);
app.reef = reef;
const album = new Album(app);
app.album = album;
// l'espace parent : appui long sur le logo, puis le code (parent/parent.js) ; après une restauration ou un
// effacement, l'application repart de zéro
const parent = new ParentSpace(app, { content: parentContent, seance, module2, cartes, calendrier, legendes });
app.parent = parent;
// l'espace parent coupe le son ; à la sortie, ses réglages (musique, volume, bruitages) sont relus
// (pendant une pause, le parent peut terminer la séance : endPausedSession)
const openParent = async () => { voice.stop(); sound.suspend(); const r = await parent.open(); if (r?.terminer) await endPausedSession({ par: "parent", raison: "terminée par le parent pendant une pause" }); if (r?.reload) location.reload(); sound.setPrefs(await store.setting("son")); sound.resume(); };
const big = (name, cx, cy, label, cls = "bubble") => spriteBox(app, { x: cx - 90, y: cy - 90, w: 180, h: 180, cls, label, paint: (ctx) => sprites.draw(ctx, name, 0, 90, 90) });
let homeEls = [];
const clearHome = () => { homeEls.forEach((e) => e.remove()); homeEls = []; };
async function showHome({ done, first = false }) {
  clearHome();
  // (lot 3 bis, R22) ce que « réécouter » redit à l'accueil
  voice.instruction = done ? text.data.accueilConsigneFaite : text.data.accueilConsigne;
  const reefKey = big("recif", HOME_X[2], 650, "le récif", "bubble reefkey"), albumKey = big("album", HOME_X[3], 650, "l'album", "bubble albumkey");
  homeEls.push(reefKey, albumKey, parentLogo(app, { onOpen: openParent, holdMs: parentContent.appuiLongMs }));
  const visit = (place) => async () => { voice.unlock(); voice.stop(); clearHome(); await place.visit(); showHome({ done: await doneToday(store) }); };
  // (lot 3 bis, B3) les bulles de l'accueil : un toucher bref les lance, un appui long montre leur étiquette
  onBrief(app, reefKey, visit(reef), "recif"); onBrief(app, albumKey, visit(album), "album");
  if (done) {
    // la séance du jour est faite : la lune (un décor) et « Encore ! », l'entraînement libre (le même écran « choisir »,
    // sans étoiles)
    const again = big("encore", HOME_X[0] + 55, 650, "encore", "bubble play again");
    homeEls.push(again);
    onTap(again, () => { voice.unlock(); clearHome(); freeTraining(); });
    homeEls.push(await goodNight(app, { first }));
    return;
  }
  // la séance du jour : « jouer » (la séance proposée par l'application) ou « choisir » (lot 3 : l'exercice et le niveau)
  const play = big("jouer", HOME_X[0], 650, "jouer", "bubble play"), pickKey = big("choisir", HOME_X[1], 650, "choisir", "bubble choisir");
  homeEls.push(play, pickKey);
  let played = false;
  onBrief(app, play, async () => {
    if (played) return; played = true; voice.unlock(); clearHome();
    // pour les captures et les tests : ?lecon=L1 joue seulement cette leçon
    if (P.get("lecon")) { window.__lecon = await lessons.play(P.get("lecon")); return; }
    // ?module=2 (tests) : la notion du jour imposée pour cette séance
    if (P.get("module")) await store.setSetting("moduleImpose", { module: Number(P.get("module")), t: Date.now() });
    // ?choix=1:8 ou ?choix=2:5 (tests, captures) : l'exercice choisi sans passer par l'écran « choisir »
    const ch = P.get("choix")?.split(":").map(Number);
    await runSession(ch ? (ch[0] === 2 ? { module: 2, famille: ch[1] } : { module: ch[0], niveau: ch[1] }) : null);
  }, "jouer");
  onBrief(app, pickKey, async () => {
    voice.unlock(); clearHome();
    mode = "choix"; homeKey.style.visibility = "visible";
    const c = await choose(app, { store, content: { module1, module2, module3, seance } });
    mode = null; homeKey.style.visibility = "hidden";
    if (c.lecon) return lessonAlone(c.lecon);
    await runSession(c);
  }, "choisir");
}
// les bulles de l'accueil : jouer (ou « Encore ! »), choisir, le récif, l'album
// (lot 3 bis, R20 : l'album était posé sur le rocher de droite ; les bulles se décalent vers la gauche, sous la pieuvre)
const HOME_X = [390, 580, 770, 960];
// une séance du jour : proposée par l'application (« jouer »), ou l'exercice choisi (`choix`, lot 3)
async function runSession(choix = null) {
  // la durée maximale d'une séance est un réglage du parent (seance.json donne la valeur par défaut) ; « Échauffement :
  // non » (réglage du parent, lot 3) le retire de la séance et de la frise
  const sans = (await store.setting("echauffement")) === false ? ["echauffement"] : [], sansRaison = {};
  // lot 3, étape 5 : l'échauffement déjà fait ou passé ce jour-là (séance interrompue pour un autre exercice) n'est pas refait
  if (!sans.length && (await store.all("seances")).some((s) => !s.libre && sameDay(s.debut, Date.now()) && (s.etapes ?? []).some((e) => e.id === "echauffement" && e.dureeS !== undefined))) { sans.push("echauffement"); sansRaison.echauffement = "déjà fait aujourd'hui"; }
  // lot 3 : la rotation de « jouer » entre les trois modules, le moins maîtrisé d'abord (session.js, chooseModule)
  const [n1, n2, n3] = await Promise.all([1, 2, 3].map((k) => store.get("niveaux", k))), mastery = { 1: ((n1?.niveau ?? 1) - 1) / module1.niveaux.length, 2: (n2?.acquises?.length ?? 0) / module2.familles.length, 3: calcMastery(module3, n3) };
  const session = new Session({ store, content: { ...seance, dureeMaxMin: await store.setting("dureeSeanceMin", seance.dureeMaxMin) }, handlers, rewards, paused: () => clock.pausedTotal(), onProgress: (p) => progress(p), choix, sans, sansRaison, mastery: (m) => mastery[m] ?? 0,
    // la protection du sélecteur redescend d'un cran : la pieuvre encourage, la voix le dit doucement
    onCranDown: async () => { voice.stop(); ocean.octo.play("encourager"); await voice.say(text.data.cranDescente); } });
  app.session = session; mode = "seance";
  // la frise ne montre le défi record que s'il aura lieu (à partir de la 5e séance, assez de faits bien sus)
  const defi = seance.etapes.find((e) => e.id === "defi");
  frieze.only([...sans, ...(defi && handlers.defi && !(await challengeReady(store, defi)) ? ["defi"] : [])]);
  await session.run();
  mode = null; frieze.show(false); homeKey.style.visibility = "hidden";
  sound.stopMusic();
  showHome({ done: true, first: true });
}
// une leçon choisie seule (lot 3) : ce n'est pas une séance ; regardée jusqu'au bout, elle rapporte ses étoiles une
// fois par leçon et par jour (seance.json, choix.etoilesLecon), puis retour à l'accueil. Elle est notée vue, et
// rangée dans l'historique du parent comme une séance « libre » (qui ne compte jamais comme la séance du jour).
// (lot 3, étape 5 : `pause` : choisie depuis l'accueil en pause ; jouée par un lecteur à part, dans le bac à sable de la
// scène (`sandbox`), puis retour à l'accueil en pause, la séance intacte ; la maison la quitte, sans rien noter)
async function lessonAlone(id, { pause = false } = {}) {
  const player = pause ? new LessonPlayer(app, lecons, { screen: new ReadScreen(app) }) : lessons;
  mode = pause ? "pause-lecon" : "lecon"; homeKey.style.visibility = "visible";
  const t0 = Date.now(), r = await Promise.race([player.play(id), new Promise((res) => { app.lessonCancel = () => { player.abandon(); clock.abandon(); voice.abandon(); res(null); }; })]);
  app.lessonCancel = null; mode = pause ? "seance" : null; homeKey.style.visibility = "hidden";
  if (!r) return;
  const L = lecons[id], key = L?.module === 2 ? 2 : L?.module === 3 ? 3 : 1, st = (await store.get("niveaux", key)) ?? (key === 3 ? { module: 3, acquis: [], obtenus: [], vus: {}, fenetres: {}, lecons: [] } : null);
  if ((r?.vue || r?.passee) && st && !(st.lecons ??= []).includes(id)) { st.lecons.push(id); await store.put("niveaux", st); }
  const today = new Date().toDateString(), done = await store.setting("leconsChoisies"), ids = done?.jour === today ? done.ids : [];
  let etoiles = 0;
  if (r?.vue && !ids.includes(id)) { etoiles = seance.choix?.etoilesLecon ?? 3; await store.setSetting("leconsChoisies", { jour: today, ids: [...ids, id] }); app.starFrom = [640, 400]; await rewards.add(etoiles, `leçon ${id}`); }
  await store.add("seances", { debut: t0, fin: Date.now(), dureeS: Math.round((Date.now() - t0) / 1000), terminee: false, libre: true, leconChoisie: true, ...(pause ? { pendantPause: app.session?.id ?? true } : {}), module: key, questions: 0, justes: 0, reussite: null, etoiles, etapes: [], lecons: [{ id, raison: "choix", ...r }] });
  await clock.wait?.(etoiles ? 1500 : 0);
  if (!pause) showHome({ done: await doneToday(store) });
}

// ---------------------------------------------------------------- pendant la séance : la frise et la maison
// La frise montre les étapes et les questions ; la maison (échauffement, notion du jour, entraînement libre)
// met la séance en pause (elle reprendra exactement où elle en était) ou quitte l'entraînement libre.
const frieze = new Frieze(app, seance.etapes.filter((e) => e.actif !== false && handlers[e.id]).map((e) => e.id)); // les étapes qui existent
app.frieze = frieze;
let mode = null; // "seance", "libre" ou null (écran d'accueil)
const homeKey = spriteBox(app, { x: 14, y: 10, w: 120, h: 120, cls: "bubble homekey session-home keep", label: "maison", paint: (ctx, px) => { const q = sprites.frame("maison", 0), k = 120 / 140; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 60 * px + q.dx * k, 60 * px + q.dy * k, q.w * k, q.h * k); } });
homeKey.style.visibility = "hidden";
const progress = (p) => {
  frieze.set(p); frieze.show(!!p.etape);
  // la maison pendant les questions et les leçons (pas pendant l'accueil ni la récompense ; lot 3, étape 5 : aussi pendant le défi record)
  homeKey.style.visibility = app.enPause ? "hidden" : p.etape === "echauffement" || p.etape === "notion" || p.etape === "defi" ? "visible" : "hidden";
};
// attend-on une réponse de l'enfant (la consigne est finie ou en cours) ?
const awaiting = () => [app.screen, app.facts].some((s) => s && s.resolve && !s.locked);
// L'ACCUEIL COMPLET PENDANT UNE PAUSE (lot 3, étape 5 ; décision du parent du 28 septembre ; docs/SPEC.md, « Navigation
// pendant la séance ») : « continuer » (reprise exacte), « choisir » (l'écran de choix : revenir sans valider ramène ici ;
// valider un exercice termine la séance en pause, interrompue, et lance l'exercice choisi comme séance du jour ; valider
// une leçon la joue puis revient ici), le récif et l'album (visite libre, puis retour ici), le logo de l'espace parent.
// Horloge, voix et musique de la séance restent en pause pendant les visites (le temps n'est pas compté).
let pausedEls = null; // l'accueil en pause : continuer, choisir, le récif, l'album, le logo de l'espace parent
let visiting = false;
async function pauseSession() {
  clock.pause(); voice.pause(); sound.pauseLevel(true); stage.root.classList.add("paused"); homeKey.style.visibility = "hidden";
  app.enPause = true;
  await app.session?.notePause();
  showPauseHome();
}
function clearPauseHome() { pausedEls?.forEach((e) => e.remove()); pausedEls = null; }
function showPauseHome() {
  clearPauseHome();
  const resume = big("jouer", HOME_X[0], 650, "continuer", "bubble play keep"), pickKey = big("choisir", HOME_X[1], 650, "choisir", "bubble choisir keep");
  const reefKey = big("recif", HOME_X[2], 650, "le récif", "bubble reefkey keep"), albumKey = big("album", HOME_X[3], 650, "l'album", "bubble albumkey keep");
  const logo = parentLogo(app, { onOpen: openParent, holdMs: parentContent.appuiLongMs }); logo.classList.add("keep");
  pausedEls = [resume, pickKey, reefKey, albumKey, logo];
  onBrief(app, resume, resumeSession, "jouer");
  onBrief(app, reefKey, () => visitInPause(() => reef.visit()), "recif");
  onBrief(app, albumKey, () => visitInPause(() => album.visit()), "album");
  onBrief(app, pickKey, () => visitInPause(pickInPause), "choisir");
}
function resumeSession() {
  if (visiting) return;
  clearPauseHome(); app.enPause = false;
  voice.unlock(); stage.root.classList.remove("paused"); homeKey.style.visibility = "visible";
  clock.resume(); voice.resume(); sound.pauseLevel(false);
  // la séance attendait une réponse : la voix redit la consigne (lot 3 bis, A5 : même si la pause a coupé la consigne, qui
  // reprendrait sans « On continue ! » ; pendant une correction, la phrase coupée est redite, puis la question suivante)
  const again = repriseText({ attend: awaiting(), consigne: voice.instruction, reprise: text.data.reprise });
  if (again) { if (voice.cur) voice.stop(); voice.say(again); }
}
// une visite depuis l'accueil en pause, dans le bac à sable de la scène ; ensuite, retour à l'accueil en pause (ou, si
// l'enfant a validé un autre exercice, la séance en pause est terminée et l'exercice choisi commence)
async function visitInPause(fn) {
  if (visiting || !app.enPause) return;
  visiting = true; voice.unlock(); clearPauseHome();
  const back = sandbox(); let after = null;
  try { after = await fn(); } finally { back(); visiting = false; }
  if (after?.exercice) return startChosen(after.exercice);
  showPauseHome();
}
// l'écran « choisir » depuis la pause : la maison y revient sans rien valider
async function pickInPause() {
  mode = "pause-choix"; homeKey.style.visibility = "visible";
  const c = await choose(app, { store, content: { module1, module2, module3, seance } });
  mode = "seance"; homeKey.style.visibility = "hidden";
  if (!c) return null;
  if (c.lecon) { await lessonAlone(c.lecon, { pause: true }); return null; }
  return { exercice: c };
}
// un autre exercice validé : la séance en pause est terminée comme « Terminer la séance » du parent (interrompue, sans
// récompense ; ses réponses et ses étoiles restent), avec la raison, puis l'exercice choisi est la séance du jour
async function startChosen(c) {
  await endPausedSession({ par: "enfant", raison: "autre exercice choisi par l'enfant", home: false });
  await runSession(c);
}
// LE BAC À SABLE DE LA SCÈNE pendant une visite en pause : ce que montre la séance est masqué tel quel (classe « stash »),
// ses planches sont épinglées (jamais libérées pendant la visite), l'horloge et la voix de la séance sont mises de côté
// (`suspend`) ; une leçon dessine dans des calques neufs (ligne, effets, aides) avec son propre écran de la ligne. Au
// retour, tout ce que la visite a ajouté (éléments, acteurs, rappels d'image, planches) est retiré, et la séance
// retrouve exactement sa pause.
const ALWAYS = new Set(["fond", "rayons", "pieuvre", "algues", "poissons", "petits", "tortue", "pieuvre-gestes", "aides"]);
function sandbox() {
  const o = ocean, st = stage, kids = (el) => new Set(el.children);
  const ui = kids(st.ui), front = kids(o.frontEl), root = kids(st.root);
  const hidden = [...[...ui].filter((e) => !e.matches(".stars, .speaker, .session-home")), ...front, ...[...root].filter((e) => e.matches("#line, #fx, #aides, .aid-board"))];
  hidden.forEach((e) => e.classList.add("stash"));
  const actors = [...o.actors], oFront = [...o.front], ticks = new Set(st.ticks), sheets = sprites.held();
  // (l'écran de la ligne de la séance reste en place, masqué : une leçon en pause a le sien ; les additions, le calque des
  // aides et le bernard-l'ermite sont mis de côté : une leçon des additions ou du calcul rapide prend les siens)
  const saved = { facts: app.facts, aidBoard: app.aidBoard, hermit: app.hermit, starFrom: app.starFrom, octoAt: [...o.octoAt], holding: o.octo.holding };
  app.facts = null; app.aidBoard = null; app.hermit = null;
  const lineBack = app.line.swap();
  sprites.pinned = sheets;
  const cs = clock.suspend(), vs = voice.suspend();
  st.root.classList.remove("paused");
  return () => {
    voice.restore(vs); clock.restore(cs);
    lineBack();
    for (const [el, before] of [[st.ui, ui], [o.frontEl, front], [st.root, root]]) [...el.children].forEach((e) => { if (!before.has(e)) e.remove(); });
    o.actors.splice(0, o.actors.length, ...actors); o.front.splice(0, o.front.length, ...oFront);
    for (const f of [...st.ticks]) if (!ticks.has(f)) st.ticks.delete(f);
    hidden.forEach((e) => e.classList.remove("stash"));
    Object.assign(app, { facts: saved.facts, aidBoard: saved.aidBoard, hermit: saved.hermit, starFrom: saved.starFrom });
    o.octoAt = saved.octoAt; o.octo.holding = saved.holding;
    sprites.pinned = null;
    for (const k of sprites.held()) if (!sheets.has(k) && !ALWAYS.has(k)) sprites.unload(k);
    st.root.classList.add("paused");
  };
}
// l'activité en cours est abandonnée pour de bon (engine/clock.js) et la scène rangée
function abandonActivity() {
  clock.abandon(); voice.abandon();
  app.choiceClear?.(); app.choiceClear = null; if (app.facts) app.facts.notion = false; app.calc?.fishDone(); // (lot 3 : l'écran « choisir », les additions libres, le poisson du mur)
  app.screen?.leave(); app.facts?.leave(); app.dictation?.hide?.(); lessons.abandon();
  // (correctif du 28 septembre 2026) le défi record quitté en cours : sa bulle-sablier et ses perles restaient à l'écran
  if (app.challenge) { app.challenge.remove(); app.challenge = null; sprites.unload("defi"); }
  for (const s of [app.screen, app.facts]) if (s) { s.resolve = null; s.locked = true; }
  // le bernard-l'ermite de la notion du jour sur les additions (notion2)
  if (app.hermit) { app.hermit.remove(); app.hermit = null; if (app.facts) { app.facts.notion = false; app.facts.hermit = null; } sprites.unload("ermite"); }
  document.querySelectorAll("#ui .free, #ui .skip").forEach((e) => e.remove());
  mode = null; homeKey.style.visibility = "hidden"; sound.stopMusic();
}
// quitter l'entraînement libre
function quitFree() { abandonActivity(); showHome({ done: true }); }
// terminer la séance en pause, depuis l'espace parent (décision du parent du 27 septembre : l'enfant n'a pas de
// bouton d'arrêt) : elle est enregistrée comme interrompue (terminée : non, sans récompense), retour à l'accueil
// (lot 3, étape 5 : aussi quand l'enfant choisit un autre exercice depuis l'accueil en pause : `par` « enfant », la raison
// notée pour l'historique du parent, et pas de retour à l'accueil : l'exercice choisi commence)
async function endPausedSession({ par = "parent", raison = null, home = true } = {}) {
  if (!app.enPause || !app.session) return;
  clearPauseHome(); app.enPause = false;
  await app.session.interrupt({ par, raison });
  abandonActivity(); frieze.show(false); stage.root.classList.remove("paused"); sound.pauseLevel(false);
  if (home) showHome({ done: await doneToday(store) });
}
onTap(homeKey, () => {
  pop(homeKey);
  if (mode === "seance") { if (app.warmupSkip?.pending) app.warmupSkip.timeout(); if (!app.enPause) pauseSession(); }
  else if (mode === "libre") quitFree();
  else if (mode === "choix" || mode === "lecon") { abandonActivity(); showHome({ done: false }); }
  // (lot 3, étape 5) depuis l'accueil en pause : l'écran « choisir » ou la leçon seule, quittés sans rien toucher à la séance
  else if (mode === "pause-choix") app.choiceCancel?.();
  else if (mode === "pause-lecon") app.lessonCancel?.();
});
async function freeTraining() {
  mode = "libre"; homeKey.style.visibility = "visible"; sound.startMusic(pickMusic(sonIndex, rnd));
  const free = new FreeTraining(app, { store, module1, module2, module3, rnd, seance });
  app.free = free;
  await free.menu();
}
showHome({ done: await doneToday(store) });
