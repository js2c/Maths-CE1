// Lot « Nouveaux boutons, mascotte du récif et étoiles » (décisions du parent du 7 novembre 2026) : les boutons faits d'une image du
// parent. L'outil (art/tools/export-boutons.mjs) : l'ajustement du cercle, l'ordre de lecture d'une planche ; la liste des usages
// (app/js/engine/boutons.js) et les images fabriquées ; les boutons ronds dans le code des écrans.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { ajusterCercle, ordreLecture } from "../../art/tools/export-boutons.mjs";
import { USAGES, fichier, tailles, usagesDe } from "../../app/js/engine/boutons.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

test("l'ajustement du cercle retrouve un cercle bruité, et ignore les points qui s'en écartent", () => {
  let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  const pts = Array.from({ length: 400 }, (_, i) => { const a = (i / 400) * 2 * Math.PI; return [512 + Math.cos(a) * 431 + r(), 506 + Math.sin(a) * 431 + r()]; });
  // une pointe qui dépasse (une étoile collée à l'anneau) : 20 points loin du cercle
  for (let i = 0; i < 20; i++) pts.push([512 + 470 + i, 506 + i]);
  const c = ajusterCercle(pts);
  assert.ok(Math.abs(c.cx - 512) < 0.5 && Math.abs(c.cy - 506) < 0.5 && Math.abs(c.r - 431) < 0.5, JSON.stringify(c));
  assert.ok(c.ecart < 0.5 && c.gardes >= 400 && c.gardes < 420);
});

test("une planche se lit par rangées, de haut en bas, puis de gauche à droite (la planche 01 du parent : 4 puis 3)", () => {
  const c = (cx, cy) => ({ cx, cy, r: 300 });
  const o = ordreLecture([c(1958, 1076), c(338, 385), c(1303, 1076), c(2246, 385), c(979, 384), c(649, 1076), c(1614, 386)]);
  assert.deepEqual(o.map((x) => x.cx), [338, 979, 1614, 2246, 649, 1303, 1958]);
});

test("chaque usage a son image du parent, à sa taille, @1x et @2x, à la bonne dimension", async () => {
  const conf = JSON.parse(read("art/boutons/boutons.json")), noms = Object.values(conf.sources).flat(), index = JSON.parse(read("app/assets/boutons/index.json"));
  for (const [n, u] of Object.entries(USAGES)) {
    assert.ok(noms.includes(u.image), `${n} : l'image ${u.image} vient d'une source du parent`);
    assert.ok(index.images[u.image]?.includes(u.d), `${n} : ${u.image} à ${u.d} px est fabriquée`);
    for (const k of [1, 2]) {
      const f = new URL(`../../app/assets/boutons/${fichier(u.image, u.d)}@${k}x.webp`, import.meta.url);
      assert.ok(existsSync(f), `${n} @${k}x`);
      // la taille, lue dans l'en-tête WebP (VP8X : largeur et hauteur sur 3 octets, moins 1)
      const b = readFileSync(f); assert.equal(b.toString("ascii", 12, 16), "VP8X", `${n} : WebP avec transparence`);
      const w = 1 + b.readUIntLE(24, 3), h = 1 + b.readUIntLE(27, 3);
      assert.deepEqual([w, h], [u.d * k, u.d * k], `${n} @${k}x`);
    }
    assert.ok(u.ancien && Number.isFinite(u.k), `${n} : l'ancien dessin, pour une image qui manquerait`);
  }
  // les 19 images du parent ont chacune au moins un usage ; leur mesure : un cercle (écart du bord moins de 2 px)
  for (const n of noms) { assert.ok(tailles()[n]?.length, `${n} sert`); assert.ok(index.mesures[n].ecart < 2, `${n} : bord à ${index.mesures[n].ecart} px du cercle`); }
  // la planche 01 donne les sept exercices, les autres une image chacune
  assert.equal(conf.sources["01"].length, 7);
});

test("les usages se chargent avec leur planche (choisir : la planche « choix » ; la grande maison : « lecons-atoi » ; le reste toujours)", () => {
  assert.deepEqual(usagesDe("choix").sort(), Object.keys(USAGES).filter((n) => n.startsWith("bouton.choix.")).sort());
  assert.deepEqual(usagesDe("lecons-atoi"), ["bouton.lecons.maison"]);
  const main = read("app/js/main.js"); assert.ok(main.includes('const ALWAYS = new Set(["lagon", "lagon-vie", "poissons", "petits", "tortue", "aides"])'));
  for (const n of Object.keys(USAGES)) assert.ok(["petits", "choix", "lecons-atoi"].includes(USAGES[n].planche), n);
});

test("chaque usage est dessiné par un écran, et chaque bouton du parent est rond (boutonRond : le toucher dans le cercle)", () => {
  const code = ["app/js/main.js", "app/js/session/choice.js", "app/js/session/reef.js", "app/js/session/album.js", "app/js/session/boutique.js", "app/js/session/screens.js", "app/js/session/lessons.js"].map(read).join("\n");
  for (const n of Object.keys(USAGES)) {
    const motif = n.replace(/\.(ligne|additions|calcul|voiliers|multiplication|etal|problemes)(\.retour)?$/, ".${e.id}$2").replace(/\.(ligne|additions|calcul|voiliers|multiplication|etal|problemes)\.retour$/, ".${exo.id}.retour");
    const dyn = [`"${n}"`, n.replace(/\.(lagon|corail|large|abysses)$/, ".${z.id}"), n.replace(/\.(jouer|choisir|lecons|recif|encore)$/, ".${id}"), n.replace(/\.(ligne|additions|calcul|voiliers|multiplication|etal|problemes)$/, ".${e.id}"), n.replace(/\.(ligne|additions|calcul|voiliers|multiplication|etal|problemes)\.retour$/, ".${exo.id}.retour")];
    assert.ok(dyn.some((m) => code.includes(m)) || code.includes(motif), `${n} est dessiné`);
  }
  const css = read("app/css/app.css");
  assert.ok(css.includes(".rond { border-radius: 50%; overflow: visible; }") && css.includes(".rond > canvas { pointer-events: none; }"));
  // les boutons des écrans touchés sont des boutons ronds
  for (const [f, cls] of [["app/js/main.js", "galet ${cls}"], ["app/js/main.js", "homekey session-home keep"], ["app/js/session/choice.js", '"choix-ex"'], ["app/js/session/choice.js", '"choix-retour"'], ["app/js/session/reef.js", '"homekey"'], ["app/js/session/reef.js", '"albumkey"'], ["app/js/session/reef.js", "boutique-cle${"], ["app/js/session/album.js", '"homekey album-retour"'], ["app/js/session/album.js", "album-tab${"], ["app/js/session/boutique.js", '"homekey boutique-retour"'], ["app/js/session/screens.js", "invite fin-recompense"], ["app/js/session/lessons.js", '"lecons-maison"']]) {
    const src = read(f), i = src.indexOf(cls); assert.ok(i > 0, `${f} : ${cls}`);
    assert.ok(src.lastIndexOf("boutonRond(", i) > src.lastIndexOf("\n", src.lastIndexOf("\n", i) - 1) - 400, `${f} : ${cls} est un boutonRond`);
  }
});

test("le relevé des boutons qui gardent leur dessin : un prompt par image, à jour (relancer : node art/boutons/prompts.mjs)", async () => {
  const { relever, prompt } = await import("../../art/boutons/prompts.mjs");
  const R = relever(), md = read("docs/maquettes/boutons/PROMPTS.md"), atlas = JSON.parse(read("app/assets/art/atlas.json"));
  const n = R.commandes.length + R.vagues.length + R.niveaux.reduce((s, x) => s + x.liste.length, 0) + R.lecons.length;
  assert.equal((md.match(/```text/g) ?? []).length, n);
  assert.equal(R.niveaux.reduce((s, x) => s + x.liste.length, 0), 13 + 13 + 9 + 9 + 9 + 10 + 9, "tous les niveaux de l'écran « choisir »");
  for (const c of R.commandes) { if (!c.sprite.startsWith("(")) assert.ok(atlas.sprites[c.sprite], c.sprite); assert.ok(md.includes(`art/boutons/sources/${c.f}.png`), c.f); assert.ok(md.includes(prompt(c)), `${c.f} : le prompt complet`); }
  // aucun des boutons relevés n'a déjà son image du parent
  for (const c of R.commandes) assert.ok(!R.remplaces.includes(c.sprite), c.sprite);
});
