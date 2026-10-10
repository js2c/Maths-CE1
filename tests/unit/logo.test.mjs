// Lot « Correctifs : passage de l'échauffement aux voiliers », points 9, 13 et 14 : le logo de l'écran de démarrage (maquette
// art/logo/), le bouton de l'espace parent et les icônes, copiés par art/tools/export-logo.mjs ; les mouvements de la maquette
// repris avec leurs valeurs ; l'allègement de l'écran.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { COPIES, exportLogo, RETIRES } from "../../art/tools/export-logo.mjs";
import { allegement, INFO_Y } from "../../app/js/session/demarrage.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

test("les images du logo, du bouton et les icônes sont celles des maquettes (relancer : cd art && node tools/export-logo.mjs)", () => {
  const { ecarts } = exportLogo({ ecrire: false, log: () => {} });
  assert.deepEqual(ecarts, []);
  for (const [, d] of COPIES) assert.ok(existsSync(new URL(`../../app/${d}`, import.meta.url)), d);
  for (const f of RETIRES) assert.ok(!existsSync(new URL(`../../app/${f}`, import.meta.url)), `${f} : l'ancienne icône de la pieuvre`);
  // le logo n'est plus dessiné dans la planche « demarrage » (seule la barre y reste)
  const atlas = JSON.parse(read("app/assets/art/atlas.json"));
  assert.equal(atlas.sprites["demarrage.logo"], undefined);
  assert.deepEqual(Object.keys(atlas.sprites).filter((k) => atlas.sprites[k].sheet === "demarrage").sort(), ["demarrage.barre.pleine", "demarrage.barre.vide"]);
});

test("les mouvements de l'écran de démarrage sont ceux de la maquette, avec ses valeurs", () => {
  const maq = read("art/logo/index.html"), css = read("app/css/app.css"), js = read("app/js/session/demarrage.js");
  // le corps d'une animation (@keyframes), accolades équilibrées, espaces normalisés
  const kf = (src, nom) => { const i = src.indexOf(`@keyframes ${nom} {`); if (i < 0) return undefined; let d = 0, j = src.indexOf("{", i); const a = j; for (; j < src.length; j++) { if (src[j] === "{") d++; else if (src[j] === "}" && !--d) break; } return src.slice(a + 1, j).replace(/\s+/g, " ").trim(); };
  for (const [m, a] of [["respire", "demarrage-respire"], ["ombre", "demarrage-ombre"], ["tour", "demarrage-tour"], ["apparait", "demarrage-apparait"], ["va-et-vient", "demarrage-va-et-vient"], ["barre-prete", "barre-prete"]]) assert.equal(kf(css, a), kf(maq, m), m);
  for (const t of ["animation: demarrage-respire 3.6s ease-in-out infinite", "animation: demarrage-ombre 3.6s ease-in-out infinite", "animation: demarrage-tour 3.2s infinite", "transform-origin: 50% 55%", "transform-origin: 50% 52%", "demarrage-va-et-vient 2.4s ease-in-out 0.5s infinite", "left: 340px; top: 652px; width: 600px; height: 64px", "font: 600 38px/1 \"Shantell Sans\""]) assert.ok(css.includes(t), t);
  // le hasard, les faisceaux, les bulles et les étincelles : le code de la maquette
  for (const t of ["parkMiller(97)", "for (let x = -380; x < 1420; x += ", "const centre = 1 - 0.45 * smooth(250, 760, Math.abs(x + 160 - 640));", "b.x0 = 1004 +", "b.x0 = 550 +", "[694, 158, 9], [376, 245, 6], [529, 469, 5], [967, 400, 7], [1042, 474, 5], [258, 359, 4], [452, 498, 4], [858, 166, 4]", "const TAILLES = [3, 5, 8, 12, 17, 24]"]) {
    const t2 = t.replace("const TAILLES = [3, 5, 8, 12, 17, 24]", "TAILLES = [3, 5, 8, 12, 17, 24]");
    assert.ok(maq.includes(t2.replace("Rr(", "R(")) || maq.includes(t2), `maquette : ${t}`); assert.ok(js.includes(t2), `application : ${t}`);
  }
  assert.ok(js.includes("t - this.lastRay >= 0.05"), "faisceaux 20 fois par seconde");
  assert.equal(INFO_Y, 744, "la ligne d'information descend à 744 px");
});

test("l'allègement de l'écran de démarrage : au-delà de 20 ms en moyenne, moins de bulles, puis faisceaux figés", () => {
  const n = (ms, k = 30) => Array(k).fill(ms);
  assert.equal(allegement(0, n(16)), 0);
  assert.equal(allegement(0, n(25)), 1);
  assert.equal(allegement(1, n(25)), 2);
  assert.equal(allegement(2, n(60)), 2);
  assert.equal(allegement(0, n(40, 10)), 0, "pas sur moins de 20 images");
});

test("point 14 : l'icône de l'application est le logo, le nom affiché « Maths CE1 »", () => {
  const m = JSON.parse(read("app/manifest.webmanifest")), html = read("app/index.html");
  assert.equal(m.name, "Maths CE1"); assert.equal(m.short_name, "Maths CE1");
  assert.deepEqual(m.icons.map((i) => [i.src, i.sizes, i.purpose]), [["icons/icone-192.png", "192x192", "any"], ["icons/icone-512.png", "512x512", "any"], ["icons/icone-maskable-512.png", "512x512", "maskable"]]);
  assert.match(html, /<link rel="icon" href="icons\/icone-192\.png">/); assert.match(html, /<link rel="apple-touch-icon" href="icons\/icone-180\.png">/);
  for (const i of m.icons) assert.ok(existsSync(new URL(`../../app/${i.src}`, import.meta.url)), i.src);
});

test("point 13 : le bouton de l'espace parent est l'image du parent, l'anneau de l'appui long suit son carré arrondi", () => {
  const js = read("app/js/parent/parent.js"), css = read("app/css/parent.css");
  assert.match(js, /assets\/boutons\/parents@\$\{/);
  assert.match(js, /s\("rect", \{[^}]*rx: ANNEAU\.rayon \+ m, pathLength: 100 \}\)/);
  assert.ok(!/s\("circle", \{ cx: 58/.test(js), "plus d'anneau rond");
  assert.match(css, /\.logo \{ position: absolute; left: 26px; top: 675\.6px; width: 108px;/);
  assert.ok(!/\.logo img \{[^}]*box-shadow/.test(css), "plus d'ombre ni de cadre en CSS : l'image a les siens");
  const forme = JSON.parse(read("app/assets/boutons/parents-forme.json"));
  assert.equal(forme.w, 108);
});
