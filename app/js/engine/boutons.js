// LES BOUTONS FAITS D'UNE IMAGE DU PARENT (lot « Nouveaux boutons, mascotte du récif et étoiles », décisions du parent du
// 7 novembre 2026 ; docs/SPEC.md, section 11 ; CLAUDE.md, l'exception des boutons). Le parent a généré les boutons ronds (verre
// bombé, anneau gris épais) ; l'outil de l'atelier (art/tools/export-boutons.mjs) les détoure, les recadre sur leur cercle exact et
// en fait une image par taille, @1x et @2x, dans app/assets/boutons/ (index.json : ce qui a son image).
//
// Ce module est la SEULE liste des usages : l'outil la lit pour savoir quelles tailles fabriquer, l'application pour poser chaque
// bouton (engine/sprites.js : un usage se dessine comme un sprite, centré sur son ancrage, à sa taille exacte, sans réduction à
// l'affichage). Un usage : son nom (celui que le code dessine), l'image du parent (`image`, art/boutons/boutons.json), son
// diamètre en px de scène (`d` : le cercle extérieur de l'anneau), la planche avec laquelle il se charge et se libère (`planche` :
// « petits » est toujours chargée ; « choix » le temps de l'écran « choisir »…), et l'ancien dessin de l'atelier (`ancien` : le
// sprite et son échelle), posé tant que l'image manque (un bouton sans image garde son dessin).
// Fonctions pures, sans navigateur : tests/unit/boutons.test.mjs.

const u = (image, d, planche, ancien, k = 1) => ({ image, d, planche, ancien, k });
// les exercices de l'écran « choisir » (la planche 01 du parent) : la bulle de l'exercice (150) et, à l'étape du niveau, la même
// en petit en haut à gauche (le retour au choix de l'exercice, 100)
const EXOS = { ligne: "choix.ex.ligne", additions: "libre.faits", calcul: "choix.ex.calcul", voiliers: "choix.ex.voiliers", multiplication: "choix.ex.multiplication", etal: "choix.ex.etal", problemes: "choix.ex.problemes" };
const exos = Object.fromEntries(Object.entries(EXOS).flatMap(([id, s]) => [[`bouton.choix.${id}`, u(id, 150, "choix", s)], [`bouton.choix.${id}.retour`, u(id, 100, "choix", s, 100 / 150)]]));
// les zones de l'album : les onglets de l'album (108) et de la boutique (96)
const ZONES = ["lagon", "corail", "large", "abysses"];
const zones = Object.fromEntries(ZONES.flatMap((z) => [[`bouton.album.${z}`, u(`zone-${z}`, 108, "petits", `album.zone.${z}`)], [`bouton.boutique.onglet.${z}`, u(`zone-${z}`, 96, "petits", `album.zone.${z}`, 96 / 108)]]));

// (les diamètres sont ceux des boutons d'avant, mesurés sur leur dessin : la bulle et son trait, sans l'ombre ; les galets de
// l'accueil, ovales de 210 × 180 environ, deviennent des cercles de 200)
export const USAGES = {
  // l'accueil (et l'accueil en pause : « continuer » a l'image de « jouer »)
  "bouton.accueil.jouer": u("jouer", 200, "petits", "accueil.galet.jouer"),
  "bouton.accueil.choisir": u("choisir", 200, "petits", "accueil.galet.choisir"),
  "bouton.accueil.lecons": u("lecons", 200, "petits", "accueil.galet.lecons"),
  "bouton.accueil.recif": u("recif", 200, "petits", "accueil.galet.recif"),
  "bouton.accueil.encore": u("encore", 200, "petits", "accueil.galet.encore"),
  ...exos,
  // le récif : la maison, le livre de cartes, la boutique (à gauche, de bas en haut)
  "bouton.recif.maison": u("maison", 120, "petits", "maison"),
  "bouton.recif.album": u("album", 120, "petits", "album", (120 / 138)),
  "bouton.recif.boutique": u("boutique", 128, "petits", "boutique", 128 / 138),
  // l'album : sa sortie, le récif (sans flèche : décision du parent du 7 novembre 2026), et ses onglets
  "bouton.album.retour": u("recif", 120, "petits", "recif", 120 / 138),
  ...zones,
  // la boutique : le retour au récif, le petit récif dans le coin des tuiles des créatures déjà dans le récif
  "bouton.boutique.retour": u("recif", 101, "petits", "recif", 101 / 138),
  "bouton.boutique.coin": u("recif", 38, "petits", "recif", 38 / 138),
  // la fin de la récompense : la boutique ou le récif ; le livre de l'album où volent les étoiles arc-en-ciel, et celui de
  // l'ouverture d'une zone
  "bouton.fin.recif": u("recif", 115, "petits", "recif", 115 / 138),
  "bouton.fin.boutique": u("boutique", 138, "petits", "boutique"),
  "bouton.recompense.album": u("album", 138, "petits", "album"),
  // la maison : pendant la séance (en haut à gauche), et la grande maison de la fin d'une leçon
  "bouton.seance.maison": u("maison", 103, "petits", "maison", 103 / 120),
  "bouton.lecons.maison": u("maison", 156, "lecons-atoi", "maison.grande"),
};

// les images à fabriquer : pour chaque image du parent, ses diamètres, du plus grand au plus petit
export function tailles(usages = USAGES) {
  const t = {};
  for (const x of Object.values(usages)) (t[x.image] ??= new Set()).add(x.d);
  return Object.fromEntries(Object.entries(t).map(([k, s]) => [k, [...s].sort((a, b) => b - a)]));
}
// le nom du fichier d'une image à une taille (sans l'échelle) : « recif-120 » → recif-120@1x.webp et @2x.webp
export const fichier = (image, d) => `${image}-${d}`;
// les usages d'une planche
export const usagesDe = (planche, usages = USAGES) => Object.entries(usages).filter(([, x]) => x.planche === planche).map(([n]) => n);
