// LES PHRASES LUES (fonctions pures, partagées par l'application et par l'outil qui fabrique la voix,
// tools/voix/). Ce que la voix dit est découpé en phrases (après « . », « ! », « ? », « … ») : chaque
// phrase a son fichier son, fabriqué à l'avance avec ses nombres (docs/SPEC.md, « Voix enregistrée à
// l'avance »). Une phrase n'est jamais collée en morceaux ; seules des phrases entières se suivent.

// un gabarit de content/textes.json rempli : « {a} plus {b} ? » -> « 3 plus 4 ? ». Une variable non
// fournie reste telle quelle, pour être remplie ensuite : `fill(text.pick("fait"), { a, b })` (pick remplit
// d'abord {mascotte}). Avant le lot 1 bis, elle devenait vide et la voix disait « plus ? » au lieu de
// « 0 plus 6 ? » (le défaut que docs/SPEC.md attribuait à la synthèse du navigateur).
export const fill = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (v[k] == null ? m : String(v[k])));

// la forme de référence d'une phrase : espaces insécables et répétés ramenés à une espace, apostrophe droite
export const normalize = (s) => s.replace(/[  \s]+/g, " ").replace(/[’ʼ]/g, "'").trim();

// « Bravo ! Ce soir, tu as gagné 3 étoiles de mer. » -> ["Bravo !", "Ce soir, tu as gagné 3 étoiles de mer."]
export const sentences = (text) => normalize(text).split(/(?<=[.!?…])\s+(?=\S)/).filter(Boolean);

// l'erreur E5 : « 3 dizaines et 7 unités. », accordée au singulier (« 1 dizaine et 1 unité. », décision du
// parent) ; T : content/textes.json ; renvoie les variables { dizaines, unites } du gabarit erreur.E5
export const decompose = (T, n) => {
  const d = Math.floor(n / 10), u = n % 10;
  return { dizaines: d === 1 ? T.uneDizaine : fill(T.desDizaines, { d }), unites: u === 1 ? T.uneUnite : fill(T.desUnites, { u }) };
};

// l'erreur E6 (lot 2, étape 8) : « 307 : 3 centaines, 0 dizaine, 7 unités. » (singulier pour 0 et 1, comme dans
// docs/SPEC-COMPLEMENTS.md) ; renvoie les variables { centaines, dizaines, unites } du gabarit erreur.E6
export const hundredsWords = (T, n) => {
  const c = Math.floor(n / 100), d = Math.floor(n / 10) % 10, u = n % 10, one = (v, k1, kn, x) => fill(v <= 1 ? T[k1] : T[kn], { [x]: v });
  return { centaines: one(c, "centaineUn", "centainesPlus", "c"), dizaines: one(d, "dizaineUn", "desDizaines", "d"), unites: one(u, "uniteUn", "desUnites", "u") };
};

// LES NOMBRES EN LETTRES (de 0 à 999 999), tels que la voix les lit (tools/voix/lettres.mjs, qui les reprend d'ici) :
// « vingt-et-un », « soixante-et-onze » avec traits d'union, « deux cent un » ; `feminin` : « une » (une étoile).
const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const DIZAINES = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante" };
const moinsDeVingt = (n) => (n <= 16 ? UNITES[n] : `dix-${UNITES[n - 10]}`);
function moinsDeCent(n) {
  if (n < 20) return moinsDeVingt(n);
  if (n < 70) { const d = DIZAINES[Math.floor(n / 10)], u = n % 10; return u === 0 ? d : u === 1 ? `${d}-et-un` : `${d}-${UNITES[u]}`; }
  if (n < 80) return n === 71 ? "soixante-et-onze" : `soixante-${moinsDeVingt(n - 60)}`;
  return n === 80 ? "quatre-vingts" : `quatre-vingt-${moinsDeVingt(n - 80)}`;
}
function moinsDeMille(n) {
  if (n < 100) return moinsDeCent(n);
  const c = Math.floor(n / 100), r = n % 100, cents = c === 1 ? "cent" : `${UNITES[c]} cent${r === 0 ? "s" : ""}`;
  return r === 0 ? cents : `${cents} ${moinsDeCent(r)}`;
}
export function enLettres(n, { feminin = false } = {}) {
  if (!Number.isInteger(n) || n < 0 || n > 999999) throw new Error(`nombre hors du domaine : ${n}`);
  let s;
  if (n < 1000) s = moinsDeMille(n);
  else { const m = Math.floor(n / 1000), r = n % 1000; s = `${m === 1 ? "mille" : `${moinsDeMille(m)} mille`}${r ? ` ${moinsDeMille(r)}` : ""}`; }
  return feminin ? s.replace(/\bun$/, "une") : s;
}
// (lot « Les voiliers ») un nombre écrit en lettres À L'ÉCRAN (la bulle du jeu des voiliers) : l'écriture de l'application,
// avec des traits d'union partout (« trois-cent-quarante-sept », « deux-cents », « vingt-et-un » ; docs/SPEC.md, section 5)
export const ecritEnLettres = (n) => enLettres(n).replace(/ /g, "-");
