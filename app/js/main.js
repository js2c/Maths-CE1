// DÉMARRAGE. Charge l'atlas et les planches nécessaires au premier écran (fond, pieuvre au repos,
// décor), lance l'animation, puis charge le reste en arrière-plan (gestes de la pieuvre).
// Premier écran : l'océan vivant et une grosse bulle « jouer » (ou, si la séance du jour est déjà faite,
// la lune en décor et la bulle « Encore ! » de l'entraînement libre), le récif et l'album ; le premier
// toucher débloque la voix et lance la séance (session/session.js). Pendant la séance, la maison (en haut
// à gauche) la met en pause ; la frise d'avancement montre où l'on en est.
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
import { Module2Runner } from "./modules/facts/runner.js";
import { Hermit } from "./engine/hermit.js";
import { runChallenge } from "./modules/facts/challenge.js";
import { Dictation } from "./modules/numberline/dictation.js";
import { AidBoard } from "./modules/facts/aids.js";
import { ChallengeView } from "./modules/facts/challengeView.js";
import { Rewards } from "./session/rewards.js";
import { chooseName, goodNight, onTap, reward, spriteBox, StarHud } from "./session/screens.js";
import { challengeReady, doneToday, Session } from "./session/session.js";
import { Reef } from "./session/reef.js";
import { drawSurprise, playSurprise, previousSession } from "./session/surprise.js";
import { Album } from "./session/album.js";
import { Frieze } from "./session/frieze.js";
import { FreeTraining } from "./session/free.js";
import { allowedCrans, chooseCran } from "./session/selector.js";
import { clock } from "./engine/clock.js";
import { pop } from "./engine/ui.js";
import { ParentSpace, parentLogo } from "./parent/parent.js";

const T0 = performance.now();
const json = async (p) => (await fetch(p)).json();

const stage = new Stage(document.getElementById("stage"));
// hors ligne : le service worker met toute l'application en cache (pas en file://, ni pendant les tests qui
// le désactivent), avec une seule résolution des planches d'images : celle que cet écran utilise (sprites.js)
if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !location.search.includes("nosw")) navigator.serviceWorker.register(`sw.js?r=${stage.px > 1.2 ? 2 : 1}`).catch(() => {});
const [atlas, module1, module2, textes, seance, lecons, cartes, calendrier, parentContent, voix] = await Promise.all([loadAtlas(), json("content/module1.json"), json("content/module2.json"), json("content/textes.json"), json("content/seance.json"), json("content/lecons.json"), json("content/cartes.json"), json("content/calendrier.json"), json("content/parent.json"), json("assets/voix/index.json").catch(() => null)]);
const [sonContent, sonIndex] = await Promise.all([json("content/son.json"), json("assets/son/index.json").catch(() => null)]);
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
const rewards = await new Rewards(store, cartes, calendrier).load();
if (P.get("etoiles")) { rewards.st.total = Number(P.get("etoiles")); await rewards.save(); } // tests : un trésor de départ
const app = { stage, sprites, ocean, voice, sound, text, rnd, atlas, store, rewards, lecons, cartes, calendrier, clock, line: new LineView(stage), mascotte: await store.setting("mascotte") };
// la vitesse des animations des exemples guidés et des corrections (1 : la vitesse d'origine ; la voix garde son débit)
app.vitesse = seance.vitesseAnimations ?? 1;
app.lineScreen = () => (app.screen ??= new ReadScreen(app));
// lot 2, étape 8 : la dictée de nombres (niveau 12) prend le pavé de l'écran des additions ; les chaluts des centaines vont sur le calque des aides
app.dictation = new Dictation(app, () => (app.facts ??= new FactsScreen(app, module2)));
app.aidBoard ??= new AidBoard(app); // l'écran de la ligne (aussi pour l'aide des faits + 1, + 2)
window.__app = app;
// la musique baisse pendant que la voix parle
stage.ticks.add(() => sound.duck(voice.speaking));

// le premier écran est prêt : on le note pour la mesure du démarrage
requestAnimationFrame(() => requestAnimationFrame(() => { performance.mark("app-ready"); window.__ready = performance.now() - T0; }));
sprites.load("pieuvre-gestes").then(() => ocean.octo.warm("pieuvre-gestes"));
sprites.load("aides"); // lot 2 : les aides visuelles du module 2 (petite planche : cadre de 10, maison, bulle dorée)

// ---------------------------------------------------------------- en-tête : réécouter, étoiles de mer
const speaker = spriteBox(app, { x: 1140, y: 8, w: 130, h: 130, cls: "hud speaker", label: "réécouter", paint: (ctx) => sprites.draw(ctx, "reecouter", 0, 65, 65) });
onTap(speaker, () => { speaker.classList.remove("pop"); void speaker.offsetWidth; speaker.classList.add("pop"); voice.replay(); });
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
    await runWarmup({ ...ctx, step, warmup, screen, rnd, intro: async () => { await voice.say(text.pick("echauffement")); if (!warmup.base.mesures.length) await voice.say(text.data.pave); } });
  },
  notion: async (ctx) => {
    frieze.notionIcon(ctx.session.rec.module);
    if (ctx.session.rec.module === 2) return notion2(ctx);
    const screen = app.lineScreen();
    const runner = await new Module1Runner({ screen, store, content: module1, rnd, seance: ctx.session.id, offset: () => ctx.session.offset, cran: () => ctx.session.cran }).load();
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
  const runner = await new Module2Runner({ store, content: module2, rnd, seance: session.id, cran: () => session.cran, dejaNouveaux: session.nouveaux }).load();
  const conf = ctx.step.module2 ?? ctx.step, step = { ...ctx.step, ...conf, ...(P.get("questions") ? { questions: [Number(P.get("questions")), Number(P.get("questions"))] } : {}), ...(P.get("guides") ? { guides: Number(P.get("guides")) } : {}) };
  app.runner = runner; session.rec.famille = runner.famille; await session.save();
  await Promise.all([sprites.load("ermite"), sprites.load("aides")]);
  const hermit = new Hermit(ocean, { x: 150, y: 795, scale: 0.85 });
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
const parent = new ParentSpace(app, { content: parentContent, seance, module2, cartes, calendrier });
app.parent = parent;
// l'espace parent coupe le son ; à la sortie, ses réglages (musique, volume, bruitages) sont relus
// (pendant une pause, le parent peut terminer la séance : endPausedSession)
const openParent = async () => { voice.stop(); sound.suspend(); const r = await parent.open(); if (r?.terminer) await endPausedSession(); if (r?.reload) location.reload(); sound.setPrefs(await store.setting("son")); sound.resume(); };
const big = (name, cx, cy, label, cls = "bubble") => spriteBox(app, { x: cx - 90, y: cy - 90, w: 180, h: 180, cls, label, paint: (ctx) => sprites.draw(ctx, name, 0, 90, 90) });
let homeEls = [];
const clearHome = () => { homeEls.forEach((e) => e.remove()); homeEls = []; };
async function showHome({ done, first = false }) {
  clearHome();
  const reefKey = big("recif", 860, 650, "le récif", "bubble reefkey"), albumKey = big("album", 1080, 650, "l'album", "bubble albumkey");
  homeEls.push(reefKey, albumKey, parentLogo(app, { onOpen: openParent, holdMs: parentContent.appuiLongMs }));
  const visit = (place) => async () => { voice.unlock(); voice.stop(); clearHome(); await place.visit(); showHome({ done: await doneToday(store) }); };
  onTap(reefKey, visit(reef)); onTap(albumKey, visit(album));
  if (done) {
    // la séance du jour est faite : la lune (un décor) et « Encore ! », l'entraînement libre
    const again = big("encore", 640, 650, "encore", "bubble play again");
    homeEls.push(again);
    onTap(again, () => { voice.unlock(); clearHome(); freeTraining(); });
    homeEls.push(await goodNight(app, { first }));
    return;
  }
  // la séance du jour
  const play = big("jouer", 640, 650, "jouer", "bubble play");
  homeEls.push(play);
  play.addEventListener("pointerdown", async (e) => {
    e.preventDefault(); voice.unlock(); clearHome();
    // pour les captures et les tests : ?lecon=L1 joue seulement cette leçon
    if (P.get("lecon")) { window.__lecon = await lessons.play(P.get("lecon")); return; }
    // ?module=2 (tests) : la notion du jour imposée pour cette séance
    if (P.get("module")) await store.setSetting("moduleImpose", { module: Number(P.get("module")), t: Date.now() });
    // la durée maximale d'une séance est un réglage du parent (seance.json donne la valeur par défaut)
    const session = new Session({ store, content: { ...seance, dureeMaxMin: await store.setting("dureeSeanceMin", seance.dureeMaxMin) }, handlers, rewards, paused: () => clock.pausedTotal(), onProgress: (p) => progress(p),
      // la protection du sélecteur redescend d'un cran : la pieuvre encourage, la voix le dit doucement
      onCranDown: async () => { voice.stop(); ocean.octo.play("encourager"); await voice.say(text.data.cranDescente); } });
    app.session = session; mode = "seance";
    // la frise ne montre le défi record que s'il aura lieu (à partir de la 5e séance, assez de faits bien sus)
    const defi = seance.etapes.find((e) => e.id === "defi");
    frieze.only(defi && handlers.defi && !(await challengeReady(store, defi)) ? ["defi"] : []);
    await session.run();
    mode = null; frieze.show(false); homeKey.style.visibility = "hidden";
    sound.stopMusic();
    showHome({ done: true, first: true });
  }, { once: true });
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
  // la maison pendant les questions et les leçons (pas pendant l'accueil ni la récompense)
  homeKey.style.visibility = p.etape === "echauffement" || p.etape === "notion" ? "visible" : "hidden";
};
// attend-on une réponse de l'enfant (la consigne est finie ou en cours) ?
const awaiting = () => [app.screen, app.facts].some((s) => s && s.resolve && !s.locked);
let pausedEls = null; // la pause en cours : la bulle « continuer » et le logo de l'espace parent
async function pauseSession() {
  clock.pause(); voice.pause(); sound.pauseLevel(true); stage.root.classList.add("paused"); homeKey.style.visibility = "hidden";
  await app.session?.notePause();
  const resume = big("jouer", 640, 650, "continuer", "bubble play keep"), logo = parentLogo(app, { onOpen: openParent, holdMs: parentContent.appuiLongMs });
  logo.classList.add("keep"); pausedEls = [resume, logo]; app.enPause = true;
  onTap(resume, () => {
    pausedEls = null; app.enPause = false;
    voice.unlock(); resume.remove(); logo.remove(); stage.root.classList.remove("paused"); homeKey.style.visibility = "visible";
    clock.resume(); voice.resume(); sound.pauseLevel(false);
    // la séance attendait une réponse : la voix redit la consigne
    if (!voice.cur && awaiting() && voice.instruction) voice.say(`${text.data.reprise} ${voice.instruction}`);
  });
}
// l'activité en cours est abandonnée pour de bon (engine/clock.js) et la scène rangée
function abandonActivity() {
  clock.abandon(); voice.abandon();
  app.screen?.leave(); app.facts?.leave(); app.dictation?.hide?.(); lessons.abandon();
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
async function endPausedSession() {
  if (!pausedEls || !app.session) return;
  pausedEls.forEach((e) => e.remove()); pausedEls = null; app.enPause = false;
  await app.session.interrupt();
  abandonActivity(); frieze.show(false); stage.root.classList.remove("paused"); sound.pauseLevel(false);
  showHome({ done: await doneToday(store) });
}
onTap(homeKey, () => { pop(homeKey); if (mode === "seance") pauseSession(); else if (mode === "libre") quitFree(); });
async function freeTraining() {
  mode = "libre"; homeKey.style.visibility = "visible"; sound.startMusic(pickMusic(sonIndex, rnd));
  const free = new FreeTraining(app, { store, module1, module2, rnd, seance });
  app.free = free;
  await free.menu();
}
showHome({ done: await doneToday(store) });
