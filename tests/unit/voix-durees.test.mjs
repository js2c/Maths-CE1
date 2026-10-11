// LE CONTRÔLE DES DURÉES DE LA VOIX (lot « Recette de l'enfant et nettoyage des couches », point 0.3 ; tools/voix/durees.mjs).
// Le fichier de la phrase « 4 » durait 1,6 s, en deux morceaux de paroles séparés par 0,6 s de silence (« 0 » et « 9 » de
// même) : le parent entendait « 2, 4, 2, 6 » à l'étal. Le contrôle par retranscription ne le voyait pas. Ce contrôle-ci
// refuse une phrase d'un seul mot coupée en morceaux, ou bien plus lente que les phrases de sa famille ; la fabrication
// (chatterbox_lot.py) applique la même règle, avec les mêmes seuils (tools/voix/durees.json), et refait le tirage.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { famille, genre, juger, morceaux, reference } from "../../tools/voix/durees.mjs";

const SR = 24000;
// un son fait de bouffées de « paroles » (un son modulé) et de silences : [[durée en s, parle ?]…]
const son = (plan) => {
  const n = plan.reduce((t, [d]) => t + Math.round(d * SR), 0), ech = new Float32Array(n); let o = 0, k = 0;
  for (const [d, parle] of plan) { const m = Math.round(d * SR); if (parle) for (let i = 0; i < m; i++) ech[o + i] = 0.3 * Math.sin((2 * Math.PI * 180 * i) / SR) * (0.6 + 0.4 * Math.sin((2 * Math.PI * 5 * i) / SR)) + 0.001 * Math.sin(k++); o += m; }
  return ech;
};
const SONS = {
  "un morceau": son([[0.05, false], [0.4, true], [0.1, false]]),
  "deux morceaux": son([[0.05, false], [0.35, true], [0.64, false], [0.45, true], [0.1, false]]),
  "silence de consonne": son([[0.05, false], [0.2, true], [0.1, false], [0.25, true], [0.1, false]]),
  "un clic": son([[0.05, false], [0.4, true], [0.4, false], [0.02, true], [0.05, false]]),
};

test("les morceaux de paroles : une pause d'une consonne ne coupe pas, une vraie pause coupe, un clic ne compte pas", () => {
  assert.deepEqual(morceaux(SONS["un morceau"], SR), { total: 0.55, morceaux: 1, pauses: [], parole: 0.4 });
  const d = morceaux(SONS["deux morceaux"], SR);
  assert.equal(d.morceaux, 2); assert.deepEqual(d.pauses, [640]); assert.equal(d.parole, 1.44);
  assert.equal(morceaux(SONS["silence de consonne"], SR).morceaux, 1);
  assert.equal(morceaux(SONS["un clic"], SR).morceaux, 1);
});

test("le jugement : « 4 » en deux morceaux est refusé, « 2 » d'un seul tenant est gardé (mesures des fichiers du 4 octobre)", () => {
  // les mesures relevées le 11 octobre 2026 sur les fichiers de l'application (node tools/voix/durees.mjs)
  assert.match(juger("4", "quatre", { morceaux: 2, pauses: [640], parole: 1.45 }), /un seul mot, en 2 morceaux/);
  assert.match(juger("9", "neuf", { morceaux: 2, pauses: [740], parole: 1.67 }), /un seul mot/);
  assert.match(juger("0", "zéro", { morceaux: 2, pauses: [860], parole: 1.72 }), /un seul mot/);
  for (const [cle, lu, parole] of [["2", "deux", 0.44], ["3", "trois", 0.36], ["6", "six", 0.62], ["8", "huit", 0.35], ["10", "dix", 0.59]]) assert.equal(juger(cle, lu, { morceaux: 1, pauses: [], parole }), null, cle);
  // une phrase plus longue : les pauses aux virgules sont normales ; bien plus lente que sa famille, elle est refusée
  assert.equal(juger("3 plus 4, 7.", "trois plusse quatre, sept.", { morceaux: 3, pauses: [300, 420], parole: 2.1 }), null);
  assert.match(juger("Ça fait 11.", "Ça fait onze.", { morceaux: 2, pauses: [900], parole: 2.4 }), /dans sa famille/);
  assert.equal(juger("Ça fait 12.", "Ça fait douze.", { morceaux: 1, pauses: [], parole: 0.8 }), null);
  assert.equal(juger("x", "x", { morceaux: 0, pauses: [], parole: 0 }), "aucune parole");
});

test("les références : les seuils et les familles sont dans durees.json, partagé avec la fabrication", () => {
  const ref = reference();
  for (const k of ["seuilDb", "plancherDb", "pauseMinMs", "morceauMinMs", "pauseMotMs", "familleMin", "ecarts", "fois", "margeS"]) assert.equal(typeof ref.regles[k], "number", k);
  for (const f of ["#", "# plus # ?", "Ça fait #."]) assert.ok(ref.familles[f], f);
  for (const g of ["1 mot", "2 mots", "3-4 mots", "5-8 mots", "9 mots et plus"]) assert.ok(ref.genres[g], g);
  assert.equal(famille("12 plus 7 ?"), "# plus # ?"); assert.equal(genre("vingt-et-un"), "1 mot"); assert.equal(genre("Ça fait onze."), "3-4 mots");
  assert.match(readFileSync(new URL("../../tools/voix/fabriquer.mjs", import.meta.url), "utf8"), /durees: dureesReference\(\)/);
});

// la reprise en Python (chatterbox_lot.py) mesure et juge comme durees.mjs (seulement si Python et numpy sont là)
let python = null;
try { execFileSync("python3", ["-c", "import numpy"], { stdio: "ignore" }); python = "python3"; } catch { /* pas de numpy ici */ }
test("chatterbox_lot.py mesure et juge comme durees.mjs", { skip: !python && "Python avec numpy absent" }, () => {
  const dir = mkdtempSync(join(tmpdir(), "durees-"));
  try {
    const noms = Object.keys(SONS);
    for (const [i, k] of noms.entries()) writeFileSync(join(dir, `${i}.f32`), Buffer.from(SONS[k].buffer));
    const cas = [["4", "quatre", { morceaux: 2, pauses: [640], parole: 1.45 }], ["2", "deux", { morceaux: 1, pauses: [], parole: 0.44 }], ["Ça fait 11.", "Ça fait onze.", { morceaux: 2, pauses: [900], parole: 2.4 }], ["3 plus 4, 7.", "trois plusse quatre, sept.", { morceaux: 3, pauses: [300, 420], parole: 2.1 }]];
    writeFileSync(join(dir, "ref.json"), JSON.stringify({ ref: reference(), cas }));
    const py = `
import json, sys
sys.path.insert(0, ${JSON.stringify(new URL("../../tools/voix/", import.meta.url).pathname)})
import numpy as np, chatterbox_lot as c
d = ${JSON.stringify(dir)}
j = json.load(open(d + "/ref.json", encoding="utf-8"))
m = [list(c.morceaux(np.fromfile(f"{d}/{i}.f32", dtype="<f4"), ${SR}, np, j["ref"]["regles"])) for i in range(${noms.length})]
v = [c.juger_duree(k, lu, (x["morceaux"], x["pauses"], x["parole"]), j["ref"]) for k, lu, x in j["cas"]]
print(json.dumps({"m": m, "v": v}, ensure_ascii=False))`;
    const r = JSON.parse(execFileSync(python, ["-c", py], { encoding: "utf8" }));
    noms.forEach((k, i) => { const js = morceaux(SONS[k], SR); assert.deepEqual(r.m[i], [js.morceaux, js.pauses, js.parole], k); });
    cas.forEach(([cle, lu, m], i) => assert.equal(r.v[i], juger(cle, lu, m), cle));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
