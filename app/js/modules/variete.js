// LA RÉPONSE QUI VARIE (lot 3 bis, docs/SPEC-LOT3BIS.md, §0), commune aux trois modules. Fonctions pures, sans DOM ;
// réglages dans content/seance.json (`variete`), jamais en dur. Sur la notion du jour d'une séance :
//  - la réponse attendue prend au moins `valeursMin` valeurs différentes (tant qu'elle n'en a pas pris autant, une
//    question dont la réponse est déjà sortie est un peu moins bien placée) ;
//  - jamais plus de `memeReponseSuite` fois de suite la même réponse ;
//  - pas de suite prévisible de plus de `suiteMax` questions : des réponses qui avancent d'un même pas, ou les mêmes
//    questions dans le même ordre qu'avant (une suite de `suiteMax` + 1 questions déjà vue dans la séance) ;
//  - une même question (un même fait aux additions) au plus `memeQuestionMax` fois, retours après une erreur compris.
// Le déroulement de chaque module propose ses candidats dans son ordre de préférence ; `pick` garde le premier qui
// ne coûte rien, sinon le moins coûteux, pourvu qu'il ne manque aucune règle (coût sous `MANQUE`).
export const VARIETE = { valeursMin: 5, memeReponseSuite: 2, suiteMax: 3, memeQuestionMax: 3 };
export const BLOQUE = 1000;
// au-delà de ce coût, une règle « jamais » serait manquée : le candidat n'est pas posé (la notion du jour s'arrête plutôt)
export const MANQUE = 50;

export class Variete {
  constructor(cfg = {}) { this.c = { ...VARIETE, ...cfg }; this.answers = []; this.keys = []; this.count = new Map(); this.grams = new Set(); }
  // combien de fois une question a déjà été posée
  times(cle) { return this.count.get(cle) ?? 0; }
  // le coût d'un candidat { cle, reponse } ; `attente` : ses retours déjà prévus (une erreur qui reviendra)
  // `retour` : le candidat est le retour prévu d'une question (il est déjà compté dans `attente`)
  cost({ cle, reponse }, { attente = 0, retour = false } = {}) {
    const A = this.answers, K = this.keys, C = this.c;
    let c = 0;
    if (this.times(cle) + (retour ? 0 : attente) >= C.memeQuestionMax) c += BLOQUE;
    const m = C.memeReponseSuite;
    if (A.length >= m && A.slice(-m).every((v) => v === reponse)) c += 100;
    const s = C.suiteMax;
    if (A.length >= s) {
      const w = [...A.slice(-s), reponse], d = w[1] - w[0];
      if (d !== 0 && w.every((v, i) => i === 0 || v - w[i - 1] === d)) c += 100;
    }
    if (K.length >= s && this.grams.has([...K.slice(-s), cle].join("|"))) c += 50;
    // (et jamais deux fois de suite la même question)
    if (K.length && K.at(-1) === cle) c += 50;
    if (new Set(A).size < C.valeursMin && A.includes(reponse)) c += 1;
    return c;
  }
  // le meilleur de candidats déjà rangés par préférence ; renvoie { i, cout } (i = -1 : aucun candidat)
  pick(cands, opts = () => ({})) {
    let best = { i: -1, cout: Infinity };
    for (let i = 0; i < cands.length; i++) { const k = this.cost(cands[i], opts(cands[i], i)); if (k < best.cout) best = { i, cout: k }; if (!k) break; }
    return best;
  }
  // une question posée
  note({ cle, reponse }) {
    const s = this.c.suiteMax;
    if (this.keys.length >= s) this.grams.add([...this.keys.slice(-s), cle].join("|"));
    this.answers.push(reponse); this.keys.push(cle); this.count.set(cle, this.times(cle) + 1);
  }
}

// le contrôle d'une suite de questions (le test de la recette, tests/recette-fonctionnelle/b-sequences.mjs --test) :
// [{ cle, reponse }] -> la liste des règles manquées
export function checkSequence(seq, cfg = {}) {
  const C = { ...VARIETE, ...cfg }, A = seq.map((x) => x.reponse), K = seq.map((x) => x.cle), out = [];
  const distinct = new Set(A).size;
  if (A.length >= C.valeursMin && distinct < C.valeursMin) out.push(`${distinct} réponses différentes`);
  for (let i = C.memeReponseSuite; i < A.length; i++) if (A.slice(i - C.memeReponseSuite, i + 1).every((v) => v === A[i])) { out.push(`${C.memeReponseSuite + 1} fois de suite ${A[i]} (question ${i + 1})`); break; }
  for (let i = C.suiteMax; i < A.length; i++) {
    const w = A.slice(i - C.suiteMax, i + 1), d = w[1] - w[0];
    if (d !== 0 && w.every((v, j) => j === 0 || v - w[j - 1] === d)) { out.push(`suite de pas ${d} : ${w.join(", ")} (question ${i + 1})`); break; }
  }
  const seen = new Set();
  for (let i = C.suiteMax; i < K.length; i++) { const g = K.slice(i - C.suiteMax, i + 1).join("|"); if (seen.has(g)) { out.push(`même suite de ${C.suiteMax + 1} questions qu'avant (question ${i + 1})`); break; } seen.add(g); }
  const n = new Map(); for (const k of K) n.set(k, (n.get(k) ?? 0) + 1);
  for (const [k, v] of n) if (v > C.memeQuestionMax) { out.push(`« ${k} » posée ${v} fois`); break; }
  return out;
}
