// LEÇONS ANIMÉES · LA PARTITION (fonctions pures, sans DOM : testées par tests/unit/lessons.test.mjs).
// Une leçon (content/lecons.json) est une suite de phrases, chaque phrase une suite de temps
// { dire, faire }. Pour que « rejouer » (et chaque début de phrase) retombe toujours sur la même image,
// l'état de la scène au début de chaque phrase se calcule sans rien jouer : on part de la scène vide et
// on applique, dans l'ordre, l'effet final de chaque action des phrases d'avant (`settle`). Le lecteur
// (player.js) joue ensuite la phrase demandée avec ses animations, et finit sur ce même état.
//
// L'état : { ligne, tortue (graduation ou null), arcs [{ de, a, texte }], ecrits (graduations dont le
// nombre est écrit), note ({ texte } au-dessus de la tortue), etoile, filets (graduation de départ de
// chaque intervalle), compteur, anneaux, allumees }. Toutes les positions sont des numéros de graduation.

export const emptyState = () => ({ ligne: false, tortue: null, arcs: [], ecrits: [], note: null, etoile: null, filets: [], compteur: null, anneaux: [], allumees: [] });

// numéro de graduation d'une valeur de la ligne
export const tickOf = (line, v) => Math.round((v - line.min) / line.pas);
export const valueOf = (line, i) => line.min + i * line.pas;
// les actions d'un temps : [[nom, argument], …] dans l'ordre (« faire » est une liste d'objets à une clé)
export const actions = (beat) => (beat.faire ?? []).flatMap((o) => Object.entries(o));
const addAll = (arr, xs) => [...new Set([...arr, ...xs])].sort((a, b) => a - b);

// ce que dit l'arc du k-ième saut arrivé en i, et ce que dit la voix, pour « compter »
export const countLabel = (line, how, k, i) => (how === "valeurs" ? String(valueOf(line, i)) : String(k));

// l'effet final d'une action sur l'état (les actions passagères, allumer, clignoter, loupe, n'en ont pas)
export function settle(S, [name, arg], line) {
  const t = (v) => tickOf(line, v), list = (a) => (Array.isArray(a) ? a : [a]).map(t);
  switch (name) {
    case "ligne": return { ...S, ligne: true };
    case "tortue": return { ...S, tortue: t(arg) };
    case "note": return { ...S, note: { texte: arg } };
    case "sauter": { const to = t(arg[0]); return { ...S, arcs: [...S.arcs, { de: S.tortue, a: to, texte: arg[1] ?? "" }], tortue: to, note: null }; }
    case "ecrire": return { ...S, ecrits: addAll(S.ecrits, list(arg)) };
    case "etoile": return { ...S, etoile: t(arg) };
    case "retour": return { ...S, arcs: [], tortue: t(arg), note: null };
    case "compter": {
      const to = t(arg.jusqua), arcs = [...S.arcs], ecrits = [];
      for (let i = S.tortue + 1, k = 1; i <= to; i++, k++) { arcs.push({ de: i - 1, a: i, texte: countLabel(line, arg.arcs, k, i) }); if (arg.ecrire) ecrits.push(i); }
      return { ...S, arcs, tortue: to, note: null, ecrits: addAll(S.ecrits, ecrits) };
    }
    case "filet": return { ...S, filets: addAll(S.filets, list(arg)) };
    case "compteur": return { ...S, compteur: arg };
    case "entourer": return { ...S, anneaux: addAll(S.anneaux, list(arg)) };
    case "arc": return { ...S, arcs: S.arcs.map((a, k) => (k === arg[0] ? { ...a, texte: arg[1] } : a)) };
    case "eclairer": return { ...S, allumees: addAll(S.allumees, list(arg)) };
    case "allumer": case "clignoter": case "loupe": return S;
    default: throw new Error(`action de leçon inconnue : ${name}`);
  }
}
// l'état au début de la phrase p (0 : la scène vide)
export function stateAt(lesson, p) {
  let S = emptyState();
  for (const phrase of lesson.phrases.slice(0, p)) for (const beat of phrase) for (const a of actions(beat)) S = settle(S, a, lesson.ligne);
  return S;
}
// la ligne à dessiner (runtime.js, drawLine) : les nombres écrits au départ seulement ; les autres sont
// écrits en direct par la leçon, au même endroit et de la même plume
export function lessonLineSpec(lesson, { x0 = 290, x1 = 1134, y = 452 } = {}) {
  const L = lesson.ligne, n = Math.round((L.max - L.min) / L.pas) + 1;
  return { x0, x1, y, n, k: L.k, ...(L.geant ? { geant: true } : {}), labels: Array.from({ length: n }, (_, i) => (L.ecrits.includes(valueOf(L, i)) ? String(valueOf(L, i)) : null)) };
}
// vérifie une leçon du contenu (actions connues, valeurs sur la ligne, la tortue posée avant de sauter)
export function check(lesson) {
  const errs = [], L = lesson.ligne, n = Math.round((L.max - L.min) / L.pas) + 1, onLine = (v) => Number.isInteger(tickOf(L, v)) && (v - L.min) % L.pas === 0 && tickOf(L, v) >= 0 && tickOf(L, v) < n;
  let S = emptyState();
  lesson.phrases.forEach((ph, p) => ph.forEach((beat, b) => actions(beat).forEach((a) => {
    const where = `phrase ${p + 1}, temps ${b + 1}, ${a[0]}`, vals = { tortue: [a[1]], sauter: [a[1]?.[0]], ecrire: [].concat(a[1]), etoile: [a[1]], retour: [a[1]], filet: [].concat(a[1]), entourer: [].concat(a[1]), eclairer: [].concat(a[1]), loupe: [a[1]], compter: [a[1]?.jusqua] }[a[0]] ?? [];
    vals.forEach((v) => { if (!onLine(v)) errs.push(`${where} : ${v} n'est pas sur la ligne`); });
    if ((a[0] === "sauter" || a[0] === "compter") && S.tortue === null) errs.push(`${where} : la tortue n'est pas encore posée`);
    if (a[0] === "arc" && !S.arcs[a[1][0]]) errs.push(`${where} : pas d'arc n° ${a[1][0]}`);
    try { S = settle(S, a, L); } catch (e) { errs.push(`${where} : ${e.message}`); }
  })));
  return errs;
}
