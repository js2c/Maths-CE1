// Lot « Correctifs de la tablette » (docs/LOTS.md, fiche 6) : les décisions du parent du 8 octobre 2026, après le premier
// essai sur la tablette. Les numéros sont ceux de la fiche.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { contenu } from "../../tools/precache.mjs";

const racine = (f) => new URL(`../../${f}`, import.meta.url);

test("8 : fins de ligne LF partout (.gitattributes), binaires marqués ; l'empreinte du mode hors ligne ignore les CRLF", () => {
  const ga = readFileSync(racine(".gitattributes"), "utf8");
  assert.match(ga, /^\* text=auto eol=lf$/m);
  for (const ext of ["png", "webp", "jpg", "ogg", "mp3", "webm", "mp4", "woff2"]) assert.match(ga, new RegExp(`^\\*\\.${ext} binary$`, "m"), ext);
  const lf = Buffer.from('{\n "a": 1\n}\n'), crlf = Buffer.from('{\r\n "a": 1\r\n}\r\n');
  assert.deepEqual(contenu("content/x.json", crlf), lf);
  assert.deepEqual(contenu("js/x.js", crlf), lf);
  const bin = Buffer.from([1, 13, 10, 2]);
  assert.equal(contenu("assets/voix/x.ogg", bin), bin, "un binaire n'est jamais modifié");
});

import { Selection, voisines } from "../../app/js/session/selection.js";
import { avecLarges, choisirPlace, LIGNE_LARGE, PLACES, placesTuile, poser } from "../../app/js/engine/bulle.js";
import { avancement, lignesInfo } from "../../app/js/session/demarrage.js";
import { CalcScreen } from "../../app/js/modules/calc/screen.js";
import { inventaire, lireContenu } from "../../tools/voix/inventaire.mjs";
import { sentences } from "../../app/js/engine/phrases.js";

const contenu_ = lireContenu(), T = contenu_.textes, inv = inventaire(contenu_);

test("2 : choisir en deux touchers : le premier sélectionne, le second sur la même lance, une autre prend la sélection, dehors désélectionne", () => {
  const s = new Selection();
  assert.equal(s.toucher("3"), "choisie");
  assert.equal(s.toucher("5"), "choisie", "une autre tuile prend la sélection");
  assert.equal(s.toucher("5"), "lancee", "le second toucher sur la même lance");
  const t = new Selection();
  t.toucher("3"); assert.equal(t.dehors(), "vide"); assert.equal(t.toucher("3"), "choisie", "après un toucher dehors, il faut deux touchers");
  assert.equal(new Selection().dehors(), null);
});

test("2 : la bulle d'une tuile : huit places au plus, deux par coin (puis les mêmes, éloignées), pointe sur un coin, boîtes dans l'écran et hors de la tuile", () => {
  for (const r of [[421, 178, 571, 314], [1009, 178, 1159, 314], [421, 634, 571, 770], [1009, 634, 1159, 770], [700, 400, 880, 580]]) {
    const ps = placesTuile(r);
    const pres = ps.filter((p) => !p.loin);
    assert.ok(pres.length >= 1 && pres.length <= 8 && ps.slice(0, pres.length).every((p) => !p.loin), "d'abord les places collées au coin");
    assert.ok(ps.filter((p) => p.loin).every((p) => p.boite[3] - p.boite[1] >= 100));
    for (const p of ps) {
      const [a, b, c, d] = p.boite;
      assert.ok(a >= 0 && b >= 0 && c <= 1280 && d <= 800, `${p.nom} dans l'écran`);
      assert.ok(Math.min(...[[r[0], r[1]], [r[2], r[1]], [r[0], r[3]], [r[2], r[3]]].map(([x, y]) => Math.hypot(p.pointe[0] - x, p.pointe[1] - y))) < 25, `${p.nom} : la pointe vise un coin`);
      // l'ovale posé dans sa boîte ne touche pas la tuile
      const o = poser(p, 300, 70);
      if (!o.deborde) assert.ok(o.rect[2] <= r[0] || o.rect[0] >= r[2] || o.rect[3] <= r[1] || o.rect[1] >= r[3], `${p.nom} : hors de la tuile`);
    }
    // d'abord du côté où l'écran a le plus de place
    const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2, p0 = ps[0].boite;
    assert.ok(cy < 400 ? p0[1] >= r[3] - 1 : p0[3] <= r[1] + 1, "la première place est du côté vertical le plus libre");
    assert.ok(cx < 640 ? p0[2] > r[2] : p0[0] < r[0], "et du côté horizontal le plus libre");
  }
  // les tuiles voisines : à côté et en diagonale, pas plus loin
  const g = [[0, 0, 150, 136], [196, 0, 346, 136], [392, 0, 542, 136], [0, 152, 150, 288], [196, 152, 346, 288]];
  assert.deepEqual(voisines(g[0], g).map((r) => r[0] + "," + r[1]), ["196,0", "0,152", "196,152"]);
});

test("4 : la bulle passe en lignes larges seulement si aucune place n'est libre en lignes équilibrées", () => {
  const ps = avecLarges(PLACES);
  assert.equal(ps.length, 2 * PLACES.length); assert.ok(ps.slice(0, PLACES.length).every((p) => !p.large) && ps.slice(PLACES.length).every((p) => p.large));
  // une consigne longue : 4 lignes de 344 px (équilibrées), ou 2 lignes de 500 px (larges)
  const mesure = (w, p) => (p?.large ? [Math.min(w, LIGNE_LARGE), 70] : [Math.min(w, 344), 139]);
  const ardoise = [495, 112, 1085, 332], pave = [334, 484, 1066, 724];
  const r = choisirPlace([pave], mesure, ps, [ardoise]);
  assert.equal(r.gene, 0, "elle ne couvre plus l'ardoise"); assert.equal(r.couvre, 0, "ni le pavé"); assert.ok(r.place.large && r.place.nom === "milieu", `entre l'ardoise et le pavé (${r.place.nom})`);
});

test("1 : la barre de chargement avance selon ce qui est chargé ; les petites lignes : 2026, js2c, la version (sans prénom)", () => {
  assert.equal(avancement(0, 10), 0); assert.equal(avancement(5, 10), 0.5); assert.equal(avancement(12, 10), 1); assert.equal(avancement(0, 0), 1);
  assert.deepEqual(lignesInfo("f8aeaedb7e95"), ["2026", "js2c", "version f8aeaed"]);
  assert.deepEqual(lignesInfo(null), ["2026", "js2c"]);
});

test("1 et 2 : les phrases nouvelles sont dans l'inventaire de la voix (bienvenues, descriptions des tuiles, consignes, « Touche-moi… »)", () => {
  for (const t of T.bienvenueLancement) for (const s of sentences(t)) assert.ok(inv.has(s), s);
  for (const [ex, d] of Object.entries(T.choixDescription)) for (const [k, t] of Object.entries(d)) { assert.ok(t.length < 90, `${ex} ${k} : une courte description`); for (const s of sentences(t)) assert.ok(inv.has(s), s); }
  assert.ok(inv.has("Touche-moi pour réécouter la consigne."));
  for (const k of ["choixExercice", "choixNiveau", "choixLecon"]) for (const s of sentences(T[k])) assert.ok(inv.has(s), s);
  // chaque tuile de chaque écran de choix a sa description
  const L = JSON.parse(readFileSync(racine("app/content/legendes.json"), "utf8"));
  for (const ex of ["ligne", "additions", "calcul", "voiliers", "multiplication"]) for (const r of L[ex]) assert.ok(T.choixDescription[ex][r.n], `${ex} ${r.n}`);
  for (const r of L.lecons) assert.ok(r.n === "+" || r.n === "×" ? T.choixDescription.tables[r.n === "+" ? "addition" : "multiplication"] : T.choixDescription.lecons[r.n], r.n);
});

test("5 : les pas des calculs guidés sont dits avec la phrase du pont (« Plus 10. »), qui a son fichier ; le bilan est dit jusqu'à 160 étoiles", () => {
  const c = new CalcScreen({ text: { data: T } }, () => null);
  for (const [op, k] of [["+", 10], ["-", 10], ["-", 2], ["+", 6], ["+", 30]]) { const s = c.consigne({ pont: true, op, b: k }); assert.ok(inv.has(s), `« ${s} » est dans l'inventaire`); }
  assert.equal(contenu_.seance.etoiles.bilanDitMax, 160);
  assert.ok(inv.has("Ce soir, tu as gagné 160 étoiles de mer.") && !inv.has("Ce soir, tu as gagné 161 étoiles de mer."));
  assert.ok(inv.has("Ce soir, tu as gagné plein d'étoiles de mer !"));
  assert.match(readFileSync(racine("app/js/session/screens.js"), "utf8"), /earned > \(E\.bilanDitMax \?\? 60\) \? text\.data\.recompenseBeaucoup/);
});

test("7 : plus de bouton « réécouter » à côté de la mascotte : on la touche (toute la tête) ; la relance le dit", () => {
  assert.equal(T.relanceAide, "Prends ton temps. Touche-moi pour réécouter la consigne.");
  const main = readFileSync(racine("app/js/main.js"), "utf8");
  assert.match(main, /headTap\.className = "mascotte-tap keep"/);
  assert.match(main, /width: `\$\{MASCOTTE\.w\}px`, height: `\$\{MASCOTTE\.h\}px`/);
  assert.match(main, /speaker\.style\.visibility = v \? "hidden" : "visible"/, "le bouton ne revient que là où la mascotte n'est pas");
});

test("6 : le clavier : chiffres (pavé numérique compris), Retour arrière, Entrée, seulement quand le pavé est à l'écran", () => {
  const src = readFileSync(racine("app/js/modules/facts/screen.js"), "utf8");
  assert.match(src, /\/\^Numpad\[0-9\]\$\/\.test\(e\.code\)/);
  assert.match(src, /e\.key === "Backspace" \? "effacer" : e\.key === "Enter" \? "valider"/);
  assert.match(src, /checkVisibility/);
});
