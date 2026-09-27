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
import { LessonPlayer } from "./lessons/player.js";
import { Module1Runner } from "./modules/numberline/runner.js";
import { fill, ReadScreen } from "./modules/numberline/screen.js";
import { runNotion } from "./session/notion.js";
import { FactsScreen, runWarmup } from "./modules/facts/screen.js";
import { Warmup } from "./modules/facts/warmup.js";
import { Rewards } from "./session/rewards.js";
import { chooseName, goodNight, onTap, reward, spriteBox, StarHud } from "./session/screens.js";
import { doneToday, Session } from "./session/session.js";
import { Reef } from "./session/reef.js";
import { Album } from "./session/album.js";
import { Frieze } from "./session/frieze.js";
import { FreeTraining } from "./session/free.js";
import { clock } from "./engine/clock.js";
import { pop } from "./engine/ui.js";
import { ParentSpace, parentLogo } from "./parent/parent.js";

const T0 = performance.now();
const json = async (p) => (await fetch(p)).json();

const stage = new Stage(document.getElementById("stage"));
// hors ligne : le service worker met toute l'application en cache (pas en file://, ni pendant les tests qui
// le désactivent), avec une seule résolution des planches d'images : celle que cet écran utilise (sprites.js)
if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !location.search.includes("nosw")) navigator.serviceWorker.register(`sw.js?r=${stage.px > 1.2 ? 2 : 1}`).catch(() => {});
const [atlas, module1, module2, textes, seance, lecons, cartes, parentContent, voix] = await Promise.all([loadAtlas(), json("content/module1.json"), json("content/module2.json"), json("content/textes.json"), json("content/seance.json"), json("content/lecons.json"), json("content/cartes.json"), json("content/parent.json"), json("assets/voix/index.json").catch(() => null)]);
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
// pour les tests et les captures : ?voix=rapide ?niveau=N ?format=lire|sauter|placer|estimer ?questions=N ?guides=N ?faits=N ?sans=etape ?sansLecon ?lecon=L1 ?etoiles=N
const P = new URLSearchParams(location.search);
const text = { data: textes, pick: (k, v = {}) => { const e = textes[k]; return fill(Array.isArray(e) ? e[Math.floor(rnd() * e.length)] : e, { mascotte: app.mascotte, ...v }); } };
// les phrases fabriquées à l'avance (assets/voix/) ; ?voix=synthese : seulement la synthèse du navigateur (comparaison)
const voice = new Voice({ rate: 0.9, fast: P.get("voix") === "rapide" }).setIndex(P.get("voix") === "synthese" ? null : voix);
const rewards = await new Rewards(store, cartes).load();
if (P.get("etoiles")) { rewards.st.total = Number(P.get("etoiles")); await rewards.save(); } // tests : un trésor de départ
const app = { stage, sprites, ocean, voice, text, rnd, atlas, store, rewards, lecons, cartes, clock, line: new LineView(stage), mascotte: await store.setting("mascotte") };
// la vitesse des animations des exemples guidés et des corrections (1 : la vitesse d'origine ; la voix garde son débit)
app.vitesse = seance.vitesseAnimations ?? 1;
app.lineScreen = () => (app.screen ??= new ReadScreen(app)); // l'écran de la ligne (aussi pour l'aide des faits + 1, + 2)
window.__app = app;

// le premier écran est prêt : on le note pour la mesure du démarrage
requestAnimationFrame(() => requestAnimationFrame(() => { performance.mark("app-ready"); window.__ready = performance.now() - T0; }));
sprites.load("pieuvre-gestes").then(() => ocean.octo.warm("pieuvre-gestes"));

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
  accueil: async () => {
    // premier lancement : l'enfant choisit le nom de la pieuvre ; ensuite, la pieuvre salue
    if (!app.mascotte) {
      app.mascotte = await chooseName(app, seance.noms); await store.setSetting("mascotte", app.mascotte);
      ocean.octo.play("rejouir"); await voice.say(text.pick("nomChoisi"));
    } else { ocean.octo.play("saluer"); await voice.say(text.pick("accueil")); }
  },
  // échauffement : faits d'addition dus (familles 1 et 2 au lot 1), précédés des questions du temps de base
  echauffement: async (ctx) => {
    const screen = (app.facts ??= new FactsScreen(app, module2)), warmup = await new Warmup({ store, content: module2, rnd, seance: ctx.session.id }).load();
    const step = { ...ctx.step, ...(P.get("faits") ? { questions: [Number(P.get("faits")), Number(P.get("faits"))] } : {}) };
    app.warmup = warmup;
    await runWarmup({ ...ctx, step, warmup, screen, rnd, intro: async () => { await voice.say(text.pick("echauffement")); if (!warmup.base.mesures.length) await voice.say(text.data.pave); } });
  },
  notion: async (ctx) => {
    const screen = app.lineScreen();
    const runner = await new Module1Runner({ screen, store, content: module1, rnd, seance: ctx.session.id }).load();
    if (P.get("niveau")) { runner.st.niveau = Number(P.get("niveau")); runner.save = () => {}; }
    if (P.get("format")) runner.levels = runner.levels.map((c) => ({ ...c, formats: [P.get("format")] }));
    const step = { ...ctx.step, ...(P.get("questions") ? { questions: [Number(P.get("questions")), Number(P.get("questions"))] } : {}), ...(P.get("guides") ? { guides: Number(P.get("guides")) } : {}) };
    app.runner = runner;
    await runNotion({ ...ctx, step, runner, screen, lesson: P.has("sansLecon") ? async () => false : lessonIn(ctx.session), rnd });
    screen.leave();
  },
  recompense: (ctx) => reward(app, { ...ctx, hud }),
};
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
const parent = new ParentSpace(app, { content: parentContent, seance, module2, cartes });
app.parent = parent;
const openParent = async () => { voice.stop(); const r = await parent.open(); if (r?.reload) location.reload(); };
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
    // la durée maximale d'une séance est un réglage du parent (seance.json donne la valeur par défaut)
    const session = new Session({ store, content: { ...seance, dureeMaxMin: await store.setting("dureeSeanceMin", seance.dureeMaxMin) }, handlers, rewards, paused: () => clock.pausedTotal(), onProgress: (p) => progress(p) });
    app.session = session; mode = "seance";
    await session.run();
    mode = null; frieze.show(false); homeKey.style.visibility = "hidden";
    showHome({ done: true, first: true });
  }, { once: true });
}

// ---------------------------------------------------------------- pendant la séance : la frise et la maison
// La frise montre les étapes et les questions ; la maison (échauffement, notion du jour, entraînement libre)
// met la séance en pause (elle reprendra exactement où elle en était) ou quitte l'entraînement libre.
const frieze = new Frieze(app, seance.etapes.filter((e) => e.actif !== false).map((e) => e.id));
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
async function pauseSession() {
  clock.pause(); voice.pause(); stage.root.classList.add("paused"); homeKey.style.visibility = "hidden";
  await app.session?.notePause();
  const resume = big("jouer", 640, 650, "continuer", "bubble play keep"), logo = parentLogo(app, { onOpen: openParent, holdMs: parentContent.appuiLongMs });
  logo.classList.add("keep");
  onTap(resume, () => {
    voice.unlock(); resume.remove(); logo.remove(); stage.root.classList.remove("paused"); homeKey.style.visibility = "visible";
    clock.resume(); voice.resume();
    // la séance attendait une réponse : la voix redit la consigne
    if (!voice.cur && awaiting() && voice.instruction) voice.say(`${text.data.reprise} ${voice.instruction}`);
  });
}
// quitter l'entraînement libre : l'activité en cours est abandonnée (engine/clock.js) et la scène rangée
function quitFree() {
  clock.abandon(); voice.abandon();
  app.screen?.leave(); app.facts?.leave(); lessons.abandon();
  for (const s of [app.screen, app.facts]) if (s) { s.resolve = null; s.locked = true; }
  document.querySelectorAll("#ui .free").forEach((e) => e.remove());
  mode = null; homeKey.style.visibility = "hidden";
  showHome({ done: true });
}
onTap(homeKey, () => { pop(homeKey); if (mode === "seance") pauseSession(); else if (mode === "libre") quitFree(); });
async function freeTraining() {
  mode = "libre"; homeKey.style.visibility = "visible";
  const free = new FreeTraining(app, { store, module1, module2, rnd });
  app.free = free;
  await free.menu();
}
showHome({ done: await doneToday(store) });
