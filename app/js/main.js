// DÉMARRAGE. Charge l'atlas et les planches nécessaires au premier écran (fond, pieuvre au repos,
// décor), lance l'animation, puis charge le reste en arrière-plan (gestes de la pieuvre).
// Premier écran : l'océan vivant et une grosse bulle « jouer » ; le premier toucher débloque la voix.
import * as R from "./art/runtime.js";
import { Ocean, rng } from "./engine/ocean.js";
import { LineView } from "./engine/line.js";
import { persist, Store } from "./engine/store.js";
import { loadAtlas, Sprites } from "./engine/sprites.js";
import { Stage } from "./engine/stage.js";
import { Voice } from "./engine/voice.js";
import { Module1Runner } from "./modules/numberline/runner.js";
import { fill, ReadScreen } from "./modules/numberline/screen.js";

const T0 = performance.now();
// hors ligne : le service worker met toute l'application en cache (pas en file://, ni pendant les tests qui le désactivent)
if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !location.search.includes("nosw")) navigator.serviceWorker.register("sw.js").catch(() => {});
const json = async (p) => (await fetch(p)).json();

const stage = new Stage(document.getElementById("stage"));
const [atlas, module1, textes] = await Promise.all([loadAtlas(), json("content/module1.json"), json("content/textes.json")]);
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
const mascotte = "Pili"; // le nom choisi au premier lancement (à venir : écran de choix)
const text = { data: textes, pick: (k, v = {}) => { const e = textes[k]; return fill(Array.isArray(e) ? e[Math.floor(rnd() * e.length)] : e, { mascotte, ...v }); } };
const voice = new Voice({ rate: 0.9 });
const app = { stage, sprites, ocean, voice, text, rnd, atlas, store, line: new LineView(stage) };
window.__app = app;

// le premier écran est prêt : on le note pour la mesure du démarrage
requestAnimationFrame(() => requestAnimationFrame(() => { performance.mark("app-ready"); window.__ready = performance.now() - T0; }));
sprites.load("pieuvre-gestes").then(() => ocean.octo.warm("pieuvre-gestes"));

// ---------------------------------------------------------------- en-tête : réécouter, étoiles de mer
const hudCanvas = (cls, x, y, w, h) => { const b = document.createElement(cls === "speaker" ? "button" : "div"), c = document.createElement("canvas"); b.className = `hud ${cls}`; Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` }); c.width = Math.round(w * stage.px); c.height = Math.round(h * stage.px); b.append(c); stage.ui.append(b); return [b, c.getContext("2d")]; };
const [speaker, spk] = hudCanvas("speaker", 1140, 8, 130, 130);
sprites.draw(spk, "reecouter", 0, 65, 65);
speaker.setAttribute("aria-label", "réécouter");
speaker.addEventListener("pointerdown", (e) => { e.preventDefault(); speaker.classList.remove("pop"); void speaker.offsetWidth; speaker.classList.add("pop"); voice.replay(); });
const [, stc] = hudCanvas("stars", 960, 22, 170, 100);
let stars = 0;
const paintStars = () => {
  stc.setTransform(1, 0, 0, 1, 0, 0); stc.clearRect(0, 0, stc.canvas.width, stc.canvas.height);
  const q = sprites.frame("etoile", 0), k = 0.62; // l'étoile, réduite (jamais agrandie)
  stc.drawImage(q.img, q.sx, q.sy, q.w, q.h, 50 * stage.px + q.dx * k, 50 * stage.px + q.dy * k, q.w * k, q.h * k);
  stc.setTransform(stage.px, 0, 0, stage.px, 0, 0);
  R.drawNumber(stc, String(stars), 118, 32, 40, { w: 5.6 });
};
paintStars();

// ---------------------------------------------------------------- premier écran, puis séance (version du point d'étape)
const play = document.createElement("button"); play.className = "bubble play"; play.setAttribute("aria-label", "jouer");
{ const c = document.createElement("canvas"); c.width = c.height = Math.round(180 * stage.px); play.append(c); sprites.draw(c.getContext("2d"), "jouer", 0, 90, 90); }
stage.ui.append(play);
play.addEventListener("pointerdown", async (e) => {
  e.preventDefault(); voice.unlock(); play.remove();
  ocean.octo.play("saluer");
  await voice.say(text.pick("accueil"));
  // pour les tests et les captures : ?niveau=N&format=lire|sauter|placer|estimer
  const P = new URLSearchParams(location.search), screen = new ReadScreen(app);
  app.screen = screen;
  const runner = await new Module1Runner({ screen, store, content: module1, rnd }).load();
  if (P.get("niveau")) { runner.st.niveau = Number(P.get("niveau")); runner.save = () => {}; }
  if (P.get("format")) runner.levels = runner.levels.map((c) => ({ ...c, formats: [P.get("format")] }));
  app.runner = runner;
  for (;;) {
    const { q, cfg } = runner.next(), r = await screen.ask(q, cfg), { etoiles } = await runner.record(r, cfg);
    stars += etoiles; paintStars();
  }
}, { once: true });
