// DÉMARRAGE. Charge l'atlas et les planches nécessaires au premier écran (fond, pieuvre au repos,
// décor), lance l'animation, puis charge le reste en arrière-plan (gestes de la pieuvre).
// Premier écran : l'océan vivant et une grosse bulle « jouer » (ou la lune si la séance du jour est
// déjà faite) ; le premier toucher débloque la voix et lance la séance (session/session.js).
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
import { ParentSpace, parentLogo } from "./parent/parent.js";

const T0 = performance.now();
// hors ligne : le service worker met toute l'application en cache (pas en file://, ni pendant les tests qui le désactivent)
if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !location.search.includes("nosw")) navigator.serviceWorker.register("sw.js").catch(() => {});
const json = async (p) => (await fetch(p)).json();

const stage = new Stage(document.getElementById("stage"));
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
const app = { stage, sprites, ocean, voice, text, rnd, atlas, store, rewards, lecons, line: new LineView(stage), mascotte: await store.setting("mascotte") };
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
// une leçon animée (L1 à L3) ; notée dans l'enregistrement de la séance (vue, durée, retours en arrière)
const lessons = new LessonPlayer(app, lecons);
app.lessons = lessons;
const lessonIn = (session) => async (id, raison) => {
  const r = await lessons.play(id);
  (session.rec.lecons ??= []).push({ id, raison, ...r }); await session.save();
  return r.vue;
};
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
// L'océan vivant, la bulle « jouer » (ou la lune si la séance du jour est faite) et, à côté, la bulle du
// récif : la visite du récif est toujours libre (docs/SPEC.md, « Séance plafonnée »).
const reef = new Reef(app);
app.reef = reef;
// l'espace parent : appui long sur le logo, puis le code (parent/parent.js) ; après une restauration ou un
// effacement, l'application repart de zéro
const parent = new ParentSpace(app, { content: parentContent, seance, module2, cartes });
app.parent = parent;
const openParent = async () => { voice.stop(); const r = await parent.open(); if (r?.reload) location.reload(); };
async function showHome({ done, first = false }) {
  const els = [], y = done ? 420 : 650;
  const reefKey = spriteBox(app, { x: 860 - 90, y: y - 90, w: 180, h: 180, cls: "bubble reefkey", label: "le récif", paint: (ctx) => sprites.draw(ctx, "recif", 0, 90, 90) });
  els.push(reefKey, parentLogo(app, { onOpen: openParent, holdMs: parentContent.appuiLongMs }));
  onTap(reefKey, async () => { voice.unlock(); voice.stop(); els.forEach((e) => e.remove()); await reef.visit(); showHome({ done: await doneToday(store) }); });
  if (done) { els.push(await goodNight(app, { first })); return; }
  // la séance du jour ; « à demain » quand elle est finie
  const play = spriteBox(app, { x: 550, y: 560, w: 180, h: 180, cls: "bubble play", label: "jouer", paint: (ctx) => sprites.draw(ctx, "jouer", 0, 90, 90) });
  els.push(play);
  play.addEventListener("pointerdown", async (e) => {
    e.preventDefault(); voice.unlock(); els.forEach((x) => x.remove());
    // pour les captures et les tests : ?lecon=L1 joue seulement cette leçon
    if (P.get("lecon")) { window.__lecon = await lessons.play(P.get("lecon")); return; }
    // la durée maximale d'une séance est un réglage du parent (seance.json donne la valeur par défaut)
    const session = new Session({ store, content: { ...seance, dureeMaxMin: await store.setting("dureeSeanceMin", seance.dureeMaxMin) }, handlers, rewards });
    app.session = session;
    await session.run();
    showHome({ done: true, first: true });
  }, { once: true });
}
showHome({ done: await doneToday(store) });
