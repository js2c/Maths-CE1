// LA CARTE GRAPHIQUE PERDUE PUIS RENDUE (lot « Correctifs : la carte graphique perdue », constat du parent du 2 novembre 2026 :
// la tablette laissée ouverte longtemps, une première partie faite, puis un autre jeu : la mascotte et la maison avaient
// disparu, les poissons du fond étaient coupés net, à l'horizontale ; le compteur d'étoiles aussi avait disparu).
//
// La cause : Android reprend la mémoire de la carte graphique d'une page restée longtemps ouverte (ou en arrière-plan), et
// Chrome peut alors arrêter son processus graphique. Reproduit sur le banc en tuant ce processus (tests/e2e/carte-graphique.mjs) :
//  - chaque canvas 2D perd son dessin : Chrome le rend aussitôt (« contextrestored »), mais VIDE. Ce qui est redessiné à chaque
//    image s'en remet seul ; ce qui n'avait été dessiné qu'une fois (la maison, le compteur d'étoiles, le bouton « réécouter »,
//    les galets de l'écran en cours, les poissons figés par l'allègement) restait vide pour toujours : présent, touchable, invisible ;
//  - les contextes WebGL sont perdus (la mascotte, le miroitement du lagon), et rendus… ou pas ;
//  - les images des planches (des ImageBitmap) peuvent être abîmées : les poissons, redessinés depuis la planche, restaient coupés.
//
// Ce module ne connaît pas les écrans : chaque canvas dessiné une fois s'inscrit avec sa fonction de dessin (`repeindre(canvas,
// f)` : spriteBox et l'entourage d'engine/ui.js, les acteurs d'engine/actor.js), et les parties qui ont leur propre reprise
// s'abonnent (`apresPerte(f)` : la planche des sprites rechargée, le lagon, la mascotte). Après une perte :
//  1. chaque canvas rendu est redessiné aussitôt (son propre « contextrestored ») ;
//  2. une fois la rafale passée (`CALME_MS` sans nouvel événement), les planches sont rechargées depuis le cache, puis les
//     abonnés reprennent, puis TOUS les canvas inscrits encore dans la page sont redessinés une seconde fois, avec les planches
//     neuves ;
//  3. la perte et la reprise sont notées dans le journal technique de l'espace parent (`journal`, posé par main.js).
// Les écouteurs sont posés sur le document, à la capture : un « contextrestored » ne remonte pas, mais passe par ses ancêtres.

export const CALME_MS = 400;
// canvas → fonction qui le redessine en entier. Le registre ne retient AUCUN canvas : la fonction est rangée dans une WeakMap
// (clé : le canvas), et la liste à parcourir ne garde que des références faibles. Un canvas sorti de la page (un poisson qui a
// quitté le lagon, un écran détruit) est donc libéré comme avant (constat de la journée du banc, étape 7, sur la première
// version : en 5 minutes sur l'accueil, 51 canvas vivants devenus 100, ceux des poissons passés, retenus par ce registre).
const dessins = new WeakMap();
const refs = new WeakMap(); // canvas → sa WeakRef dans `inscrits`
const inscrits = new Set(); // WeakRef des canvas inscrits
const abonnes = new Set();
let journal = () => {};
let perte = null; // la rafale en cours : { t, perdus2d, perdusGL, rendus2d, rendusGL }
let minuterie = 0;
export const compteurs = { pertes: 0, reprises: 0 };

// un canvas dessiné une fois : `f()` le redessine en entier (effacement compris) ; f = null le retire
// (les références des canvas libérés sont oubliées de temps en temps, quand la liste double)
let seuil = 300;
const oublier = () => { for (const r of inscrits) if (!r.deref()) inscrits.delete(r); seuil = Math.max(300, 2 * inscrits.size); };
export function repeindre(c, f) {
  if (!c) return;
  if (!f) { dessins.delete(c); const r = refs.get(c); if (r) inscrits.delete(r); refs.delete(c); return; }
  dessins.set(c, f);
  if (!refs.has(c)) { const r = new WeakRef(c); refs.set(c, r); inscrits.add(r); }
  if (inscrits.size > seuil) oublier();
}
export const nbInscrits = () => inscrits.size;
// une reprise propre à une partie de l'application (peut être asynchrone) ; renvoie de quoi se désabonner
export function apresPerte(f) { abonnes.add(f); return () => abonnes.delete(f); }
export function journaliser(f) { journal = f; }

const essayer = (f) => { try { return f(); } catch (e) { journal("redessin impossible", { erreur: String(e?.message ?? e) }); } };
// (tous les canvas encore vivants, même hors de la page : un écran gardé de côté puis remis ne doit pas revenir vide ; on compte
// ceux de la page)
function redessinerTout() {
  let n = 0;
  for (const r of inscrits) { const c = r.deref(); if (!c) { inscrits.delete(r); continue; } const f = dessins.get(c); if (f) essayer(f); if (c.isConnected) n++; }
  return n;
}
function rafale(genre) {
  if (!perte) { perte = { t: performance.now(), perdus2d: 0, perdusGL: 0, rendus2d: 0, rendusGL: 0 }; compteurs.pertes++; }
  perte[genre]++;
  clearTimeout(minuterie); minuterie = setTimeout(reprendre, CALME_MS);
}
async function reprendre() {
  const p = perte; perte = null; if (!p) return;
  journal("carte graphique perdue", { canvas2d: p.perdus2d, webgl: p.perdusGL, rendus2d: p.rendus2d, rendusWebgl: p.rendusGL });
  for (const f of abonnes) await essayer(f);
  const n = redessinerTout();
  compteurs.reprises++;
  journal("carte graphique rendue : tout est redessiné", { canvas: n, ms: Math.round(performance.now() - p.t) });
}
// (pour les parcours de test : la reprise complète, sans perte réelle)
export const reprendreMaintenant = async () => { perte ??= { t: performance.now(), perdus2d: 0, perdusGL: 0, rendus2d: 0, rendusGL: 0 }; clearTimeout(minuterie); await reprendre(); };

if (typeof globalThis.document?.addEventListener === "function") { // (les tests unitaires donnent parfois un faux document)
  document.addEventListener("contextlost", () => rafale("perdus2d"), true);
  document.addEventListener("webglcontextlost", () => rafale("perdusGL"), true);
  document.addEventListener("contextrestored", (e) => { const f = dessins.get(e.target); if (f) essayer(f); rafale("rendus2d"); }, true);
  document.addEventListener("webglcontextrestored", () => rafale("rendusGL"), true);
}
