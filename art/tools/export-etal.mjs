// L'ÉTAL DU PÊCHEUR DANS L'APPLICATION (docs/SPEC.md, section 7 quater ; lot « L'étal du pêcheur », fiche 7 de docs/LOTS.md).
// La scène de l'exercice de monnaie est la maquette art/etal/index.html, validée par le parent le 10 octobre 2026, intégrée
// telle quelle : on ne la réécrit pas, on la transporte (même méthode que les voiliers et le récif vivant). Cet outil, sans
// jamais modifier la maquette :
//   1. copie ses images (art/etal/img/, portefeuille compris) dans app/assets/etal/ ;
//   2. fabrique app/js/etal/etal-scene.js : le script de la maquette lui-même (le ciel, la mer en trois bandes, les oiseaux,
//      les bateaux, le phare, la pluie, la lampe et sa lumière cuite dans l'étal, la pêche du jour et ses ardoises écrites par
//      le code, le portefeuille, l'argent rangé, sorti, glissé ou touché, la soucoupe), enveloppé dans une fonction
//      `startEtal(OPTS)`, ses éléments (la caisse, les voiles, le canvas des effets) et ses styles, avec ses seuls raccords à
//      l'application retouchés (RETOUCHES et SECTIONS ci-dessous) : les éléments et les images, le temps (qui s'arrête
//      pendant la pause), le toucher, les réglages (app/content/etal.json au lieu du panneau), le temps qu'il fait (tiré par
//      l'application), l'orage et sa réplique (dite par la voix de l'application, entre deux questions), la pêche et ses
//      prix (donnés par l'exercice). Ce qui disparaît : les boutons, le panneau de réglages, le compteur, l'écran
//      « Chargement… », la bulle et le capitaine de la maquette (l'application a les siens). Ce qui s'ajoute (RACCORDS) :
//      ce que l'exercice demande à la scène (allumer un produit, l'emballer, remplir le portefeuille, lire la soucoupe,
//      montrer le compte, prendre l'argent, rendre la monnaie, une bonne façon de payer).
// Chaque retouche doit trouver son texte exactement une fois : si la maquette change, l'export échoue au lieu de produire
// un module faux. Une seconde fabrication doit donner les mêmes octets (contrôlé ici).
//
//   node tools/export-etal.mjs
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const HERE = resolve(new URL(".", import.meta.url).pathname, "..");
const MAQUETTE = join(HERE, "etal/index.html"), IMG = join(HERE, "etal/img"), APP = resolve(HERE, "../app");
const OUT_IMG = join(APP, "assets/etal"), OUT_JS = join(APP, "js/etal/etal-scene.js");

// les éléments de la maquette qui viennent dans l'application (préfixés « etal- ») ; les autres disparaissent
export const GARDES = ["captVoile", "caisse", "soucoupe", "total", "pf", "pfFond", "pfAvant", "effets", "nuit", "voile"];
const RETIRES = ["cadre", "decor", "capt", "bulle", "commandes", "reglages", "compteur", "chargement"];

// les raccords : [ce que dit la maquette, ce que dit l'application, pourquoi]
const RETOUCHES = [
  ["'use strict';\n", "", "le module est déjà strict"],
  ["try { Object.assign(R, JSON.parse(localStorage.getItem('etal-reglages') || '{}')); } catch (e) { /* stockage indisponible */ }", "Object.assign(R, OPTS.reglages);", "les réglages sont ceux de app/content/etal.json (le panneau de la maquette disparaît)"],
  ["i.src = `img/${n}.webp`;", "i.src = OPTS.images + n + '.webp';", "les images sont dans assets/etal/"],
  ["new FontFace('Ardoise', 'url(polices/shantell-sans-600.woff2)')", "new FontFace('Ardoise', 'url(' + OPTS.police + ')')", "la police des ardoises est celle de l'application"],
  ["const $ = id => document.getElementById(id);", "const $ = id => EL(id);", "les éléments sont ceux que fabrique le module (ci-dessous), pas ceux de la page de la maquette"],
  ["function tirerPeche() {\n  const noms = Object.keys(PRODUITS).sort(() => Math.random() - 0.5).slice(0, 8);", "function tirerPeche(noms = Object.keys(PRODUITS).sort(() => Math.random() - 0.5).slice(0, 8), prix = {}) {", "la pêche du jour et ses prix sont donnés par l'exercice"],
  ["rot: hasard(-4, 4) * Math.PI / 180, prix: PRODUITS[n].prix * 100 };", "rot: hasard(-4, 4) * Math.PI / 180, prix: prix[n] ?? PRODUITS[n].prix * 100 };", "le prix de chaque produit est donné par l'exercice"],
  ["    c.drawImage(orage ? sombreProduit(p.n) : im, -w / 2, -h / 2, w, h);", "    if (!p.cache) c.drawImage(orage ? sombreProduit(p.n) : im, -w / 2, -h / 2, w, h);", "un produit allumé quitte le calque de l'étal : il est posé à part, soulevé (RACCORDS)"],
  ["    if (orage) {                        // la lumière de la lampe sur le produit", "    if (orage && !p.cache) {            // la lumière de la lampe sur le produit", "(de même)"],
  ["    ardoise(c, ax, ay, fmtPrix(p.prix), lum);", "    if (!p.cache) ardoise(c, ax, ay, fmtPrix(p.prix), lum);", "(de même : son ardoise est soulevée avec lui)"],
  ["  preparerSprites(); tirerPeche(); composerEtal();", "  preparerSprites(); tirerPeche(...(OPTS.peche ?? [])); composerEtal();", "la première pêche est celle de l'exercice"],
  ["function image(ms) {\n", "function image(ms) {\n  if (!VIVANT) return; RAF = requestAnimationFrame(image);\n  if (OPTS.fige?.()) { dernier = 0; return; }\n  OPTS.mesure?.(ms);\n", "l'animation s'arrête en sortant, et pendant la pause (tout s'arrête : le ciel, la mer, les bateaux, la pluie) ; le temps d'image est mesuré"],
  ["  premierPlan(); lampe(); effets();\n  if (orageA !== null && t >= orageA) orageArrive();\n", "  premierPlan(); lampe(); effets(); majSouleves();\n", "l'orage arrive quand l'application le dit (entre deux questions) ; les produits soulevés suivent le temps qu'il fait"],
  ["  requestAnimationFrame(image);\n}\n", "}\n", "(l'image suivante est demandée au début de l'image)"],
  ["$('bMeteo').onclick = () => { if (meteoCible) poserMeteo(0); else orageArrive(); };\n$('bPrix').onclick = () => { tirerPrix(); composerEtal(); };\n$('bBateau').onclick = () => nouveauBateau();\n$('bPeche').onclick = () => { tirerPeche(); composerEtal(); };\n", "", "les boutons de la maquette disparaissent"],
  ["  $('bMeteo').textContent = v ? '☀ Beau temps' : '⛈ Mauvais temps';\n", "", "(de même)"],
  ["let orageA = null, derniereReplique = -1;", "let orageA = null, derniereReplique = OPTS.derniereReplique ?? -1;", "jamais deux fois de suite la même réplique, d'une partie à l'autre aussi"],
  ["  setTimeout(() => dire(REPLIQUES_ORAGE[k]), 700);    // les premières gouttes, puis la réplique\n", "  return k;                             // les premières gouttes, puis la réplique, dite par la voix de l'application\n", "la réplique est dite par la voix de l'application (textes.json, etalOrage)"],
  ["let MASC = null, bulleT = 0;\nfunction dire(texte) {", "function direMaquette(texte) {", "la bulle et le capitaine de la maquette disparaissent (la fonction, qui n'est plus appelée, est vidée ci-dessous)"],
  ["  const ms = Math.max(1800, texte.length * 70);\n  const b = $('bulle'); b.textContent = texte; b.classList.add('vue');\n  clearTimeout(bulleT); bulleT = setTimeout(() => { b.classList.remove('vue'); MASC && MASC.silence(); }, ms + 1500);\n  if (MASC) { MASC.parole(texte, ms); setTimeout(() => MASC.silence(), ms); }\n", "  void texte;\n", "(de même)"],
  ["let captOui = true;\n$('bCapt').onclick = () => { captOui = !captOui; $('capt').classList.toggle('cache', !captOui); $('bCapt').textContent = `Capitaine : ${captOui ? 'oui' : 'non'}`; };\n", "", "(de même)"],
  ["let contenuPf = 'complet', totalVu = false;", "let contenuPf = 'complet', totalVu = false, CONTENU = null, VERROU = false, ETIQ = false;", "le contenu du portefeuille vient de l'exercice ; la caisse se verrouille pendant le compte et les corrections ; la valeur écrite sur l'argent (cran « plus facile », aide)"],
  ["  const C = CONTENUS[contenuPf];", "  const C = CONTENU ?? CONTENUS[contenuPf];", "(de même)"],
  ["el.src = `img/${IMG_V[v]}.webp`;", "el.src = OPTS.images + IMG_V[v] + '.webp';", "les images sont dans assets/etal/"],
  ["  it.el.style.zIndex = z; it.el.style.opacity = op; it.el.style.pointerEvents = op && touchable ? 'auto' : 'none';\n", "  it.el.style.zIndex = z; it.el.style.opacity = op; it.el.style.pointerEvents = op && touchable ? 'auto' : 'none';\n  etiquette(it);\n", "la valeur écrite suit l'argent (RACCORDS)"],
  ["  $('total').textContent = t ? fmtPrix(t) : ''; $('total').style.opacity = totalVu ? 1 : 0;\n", "  $('total').textContent = t ? fmtPrix(t) : ''; $('total').style.opacity = totalVu ? 1 : 0;\n  OPTS.change?.();\n", "l'exercice suit ce qui est posé dans la soucoupe"],
  ["  if (pfEtat === 'anim' || it.transit || it.lieu === 'poche') return;", "  if (VERROU || !OPTS.toucher(e) || pfEtat === 'anim' || it.transit || it.lieu === 'poche') return;", "le toucher : pas pendant la pause, ni pendant le compte ou une correction"],
  ["addEventListener('pointermove', e => {", "OPTS.on(window, 'pointermove', e => {", "écouteur de la fenêtre retiré en sortant"],
  ["addEventListener('pointerup', e => {\n  if (!prise || e.pointerId !== prise.id) return;", "OPTS.on(window, 'pointerup', e => {\n  if (!prise || e.pointerId !== prise.id) return;", "(de même)"],
  ["const toucherPf = () => {\n  if (prise) return;", "const toucherPf = e => {\n  if (prise || VERROU || !OPTS.toucher(e)) return;", "le toucher du portefeuille : pas pendant la pause, ni pendant le compte ou une correction"],
  ["  if (prise || e.target.closest('.m, #pf, #pfFond, #commandes, #reglages, #bulle, #capt')) return;", "  if (prise || VERROU || !OPTS.toucher(e) || e.target !== $('scene')) return;", "un toucher « à côté » : sur le décor seulement (pas sur un bouton de l'application)"],
];
// les sections retirées en entier (de leur bannière à la bannière suivante)
const SECTIONS = [
  ["mise à l'échelle de la scène", "l'application met la scène à l'échelle de l'écran"],
  ["panneau de réglages", "les réglages sont figés dans app/content/etal.json"],
  ["le capitaine (vidéos de la mascotte, moteur commun)", "la mascotte est celle de l'application, à sa place dans la fenêtre de la cabane"],
];
// LES RACCORDS : ce que l'exercice demande à la scène. Les gestes sont ceux de la maquette (versSoucoupe, versPortefeuille,
// glisserDedans, sortirTout, rangerEtFermer, ouvrirPf, composerEtal, orageArrive…) ; s'y ajoutent le produit allumé
// (soulevé, son halo, son ardoise avec lui), le produit emballé, l'objet compté (son halo), l'argent pris par le pêcheur,
// la monnaie qu'il pose dans la soucoupe, la valeur écrite sur l'argent.
const RACCORDS = String.raw`/* =====================================================================================
   RACCORDS AVEC L'APPLICATION (art/tools/export-etal.mjs) : l'exercice conduit la scène
   ===================================================================================== */
const attendre = ms => new Promise(ok => setTimeout(ok, ms / (VIT.k || 1)));
const VIT = { k: 1 };
/* le produit allumé : posé à part (le calque de l'étal est recomposé sans lui), dans un petit canvas par temps (beau,
   mauvais), avec son ombre et son ardoise, dessinés par objetsEtal comme les autres ; soulevé, avec un halo */
let souleves = [];
function cadre(p) {
  const D = Math.hypot(p.w, p.h);
  const x0 = Math.max(0, Math.floor(p.x - D / 2 - 26)), y0 = Math.max(0, Math.floor(p.y - D / 2 - 26));
  const x1 = Math.min(1280, Math.ceil(Math.max(p.x + D / 2, p.x + p.w * 0.3 + 70) + 26)), y1 = Math.min(800, Math.ceil(Math.max(p.y + D / 2, p.y + p.h * 0.28 + 44) + 26));
  return { x0, y0, w: x1 - x0, h: y1 - y0 };
}
function decoupe(p, orage, r) {
  const sauve = peche; peche = [{ ...p, cache: false }];
  const o = objetsEtal(orage); peche = sauve;
  const c = document.createElement('canvas'); c.width = Math.round(r.w * K); c.height = Math.round(r.h * K);
  c.getContext('2d').drawImage(o, r.x0 * K, r.y0 * K, c.width, c.height, 0, 0, c.width, c.height);
  return c;
}
function soulever(i) {
  const p = peche[i], r = cadre(p), d = document.createElement('div'); d.className = 'etal-souleve';
  Object.assign(d.style, { left: r.x0 + 'px', top: r.y0 + 'px', width: r.w + 'px', height: r.h + 'px' });
  d.style.setProperty('--dx', (FENETRE.x - (r.x0 + r.w / 2)) + 'px'); d.style.setProperty('--dy', (FENETRE.y - (r.y0 + r.h / 2)) + 'px');
  const b = decoupe(p, false, r), o = decoupe(p, true, r); o.style.opacity = meteo;
  d.append(b, o); d.dataset.produit = p.n;
  $('scene').insertBefore(d, $('scene').firstChild);
  souleves.push({ i, el: d, b, o, m: meteo });
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('allume')));
}
function majSouleves() { for (const s of souleves) if (Math.abs(s.m - meteo) > 0.004) { s.m = meteo; s.o.style.opacity = meteo.toFixed(3); } }
function retirerSouleves() { souleves.forEach(s => s.el.remove()); souleves = []; }
/* l'argent : sa valeur écrite (cran « plus facile », aide), le halo de l'objet compté */
const ecrite = v => v >= 100 ? (v / 100) + ' €' : v + ' c';
function etiquette(it) {
  const voir = ETIQ && it.lieu !== 'poche' && it.op > 0;
  if (!voir) { if (it.lab) it.lab.style.opacity = 0; return; }
  if (!it.lab) { it.lab = document.createElement('div'); it.lab.className = 'etal-valeur'; it.lab.textContent = ecrite(it.v); $('caisse').appendChild(it.lab); }
  it.lab.style.transform = 'translate(' + it.x + 'px,' + (it.y + hauteur(it) * it.sc * 0.42) + 'px) translate(-50%,-50%)';
  it.lab.style.zIndex = it.z + 1; it.lab.style.opacity = 1;
}
const enSoucoupe = () => items.filter(i => i.lieu === 'soucoupe');
const nouvelObjet = v => {
  const el = document.createElement('img'); el.src = OPTS.images + IMG_V[v] + '.webp'; el.className = 'm'; el.draggable = false;
  el.style.width = LARG[v] + 'px'; el.style.opacity = 0;
  const it = { v, b: v >= 500, lieu: 'poche', el, x: 0, y: 0, r: 0, sc: 1, z: 4, op: 0, h: hasard(0, 1) };
  el.addEventListener('pointerdown', e => attraper(e, it));
  $('caisse').appendChild(el); items.push(it); return it;
};
const oter = it => { it.el.remove(); it.lab?.remove(); items = items.filter(x => x !== it); };
const FENETRE = { x: 150, y: 330 };                  // là où le pêcheur prend l'argent et d'où il pose la monnaie
const API = {
  // ---- la pêche du jour
  produits: Object.keys(PRODUITS),
  // les 8 produits de l'étal : nom, prix (centimes), place
  peche: () => peche.map(p => ({ n: p.n, prix: p.prix, x: p.x, y: p.y, w: p.w, h: p.h })),
  // une nouvelle question : des produits remplacés (achetés à la question d'avant), des prix changés, des produits allumés ;
  // le calque de l'étal est recomposé une seule fois
  question({ remplacer = [], prix = {}, allumes = [] } = {}) {
    retirerSouleves();
    for (const [i, n, c] of remplacer) { peche[i].n = n; peche[i].prix = c; }
    for (const i in prix) peche[i].prix = prix[i];
    peche.forEach((p, i) => { p.cache = allumes.includes(i); });
    composerEtal();
    allumes.forEach(soulever);
  },
  // les produits allumés reviennent à leur place, sans halo (ils restent posés à part jusqu'à la question suivante)
  eteindre() { souleves.forEach(s => s.el.classList.remove('allume')); },
  // les produits posés à part, cachés (la ligne graduée du niveau 7 passe devant l'étal)
  cacher(v) { souleves.forEach(s => { s.el.style.visibility = v ? 'hidden' : ''; }); },
  rallumer() { souleves.forEach(s => s.el.classList.add('allume')); },
  // le produit acheté est emballé : il glisse hors de l'étal, vers la fenêtre du pêcheur
  async emballer() { souleves.forEach(s => s.el.classList.add('emballe')); await attendre(900); souleves.forEach(s => { s.el.style.visibility = 'hidden'; }); },
  // ---- le portefeuille
  // regarni à chaque question (valeurs en centimes) ; ce qui est dans la soucoupe revient d'abord au portefeuille
  remplir(valeurs) {
    const v = valeurs.slice().sort((a, b) => b - a);
    CONTENU = { b: v.filter(x => x >= 500), p: v.filter(x => x < 500) };
    items.forEach(it => it.lab?.remove());
    remplirPortefeuille();
  },
  // le portefeuille montré ou caché (au niveau 7, le paiement est déjà dans la soucoupe)
  visible(v) { for (const e of [pfEl, fondEl, avEl]) e.style.visibility = v ? '' : 'hidden'; items.filter(i => i.lieu !== 'soucoupe').forEach(i => { i.el.style.visibility = v ? '' : 'hidden'; if (i.lab) i.lab.style.visibility = v ? '' : 'hidden'; }); },
  async ouvrir() { if (pfEtat === 'ferme') ouvrirPf(); while (pfEtat === 'anim' || pfEtat === 'ferme') await attendre(40); },
  sortir() { if (pfEtat === 'ouvert') sortirTout(); },
  async fermer() { if (pfEtat === 'sorti') rangerEtFermer(); else if (pfEtat === 'ouvert') fermerPf(); await attendre(900); },
  // ---- la soucoupe
  soucoupe: () => enSoucoupe().sort((a, b) => a.ordre - b.ordre).map(i => i.v),
  // les objets de la soucoupe, du plus gros au plus petit (l'ordre du compte du pêcheur)
  objets: () => enSoucoupe().sort((a, b) => b.v - a.v || a.ordre - b.ordre),
  total: () => enSoucoupe().reduce((a, i) => a + i.v, 0),
  // le total écrit au-dessus de la soucoupe (cran « plus facile », aide, compte)
  totalVu(v) { totalVu = !!v; majTotal(); },
  // la valeur écrite sur l'argent sorti et posé
  etiquettes(v) { ETIQ = !!v; items.forEach(etiquette); },
  verrou(v) { VERROU = !!v; $('scene').classList.toggle('verrou', VERROU); },
  // l'objet compté : un halo
  halo(it, on = true) { it?.el.classList.toggle('compte', on); },
  sansHalo() { items.forEach(i => i.el.classList.remove('compte')); },
  // des objets de la soucoupe reviennent au portefeuille (rangés, ou avec l'argent sorti)
  async rendre(objets = enSoucoupe()) { for (const it of objets.slice()) { it.el.classList.remove('compte'); versPortefeuille(it); } await attendre(700); },
  // un objet du portefeuille va dans la soucoupe, comme le doigt (correction, parcours de test) ; null s'il n'y en a pas
  async deposer(v) {
    let it = items.find(i => i.v === v && i.lieu === 'sortie') ?? items.find(i => i.v === v && i.lieu === 'poche');
    if (!it) return null;
    if (it.lieu === 'poche') { await API.ouvrir(); if (pfEtat === 'ouvert') sortirTout(); await attendre(420); }
    if (it.lieu === 'soucoupe') return null;
    versSoucoupe(it); return it;
  },
  // le pêcheur prend l'argent : il glisse vers sa fenêtre et s'efface
  async prendre() {
    const A = enSoucoupe();
    A.forEach((it, k) => setTimeout(() => { poser(it, FENETRE.x + k * 6, FENETRE.y, it.r, 0.35, 95, 0, false); }, k * 90 / (VIT.k || 1)));
    await attendre(650 + A.length * 90); A.forEach(oter); majTotal();
  },
  // le pêcheur pose une pièce ou un billet de sa caisse dans la soucoupe (la monnaie qu'il rend, ou le billet du niveau 7)
  async poserMonnaie(v, { aussitot = false } = {}) {
    const it = nouvelObjet(v);
    poser(it, FENETRE.x, FENETRE.y, 0, 0.4, 95, 0, false); it.lieu = 'caisse';
    if (!aussitot) await attendre(30);
    it.rendu = true; versSoucoupe(it); if (!aussitot) await attendre(420);
    return it;
  },
  // la monnaie rendue rejoint le portefeuille de l'enfant
  async rangerRendu() { const A = enSoucoupe(); A.forEach(it => { it.rendu = false; versPortefeuille(it); }); await attendre(700); },
  // ---- le temps qu'il fait
  get meteo() { return meteoCible; },
  // l'orage arrive (une fois par partie au plus) : renvoie le numéro de la réplique (textes.json, etalOrage)
  orage() { const k = orageArrive(); return { k, derniere: derniereReplique }; },
  // ---- la vitesse des gestes (corrections, « passer »)
  vitesse(k) { VIT.k = k; },
  // ---- pour les parcours de test
  // les boîtes de l'argent sorti et posé (px de la scène) : ce que l'enfant touche (la bulle ne les couvre jamais)
  boites: () => items.filter(i => (i.lieu === 'sortie' || i.lieu === 'soucoupe') && i.op > 0).map(i => { const w = LARG[i.v] * i.sc, h = hauteur(i) * i.sc; return [i.x - w / 2 - 6, i.y - h / 2 - 6, i.x + w / 2 + 6, i.y + h / 2 + 6]; }),
  // les produits allumés, leur ardoise comprise (pour la bulle : elle ne les couvre jamais)
  allumes: () => souleves.filter(s => s.el.style.visibility !== 'hidden').map(s => { const r = cadre(peche[s.i]); return [r.x0 + 14, r.y0 + 14, r.x0 + r.w - 14, r.y0 + r.h - 14]; }),
  // pour les parcours de test : la boîte à l'écran de chaque objet
  rects: () => items.map(i => { const r = i.el.getBoundingClientRect(); return { v: i.v, lieu: i.lieu, x: r.x + r.width / 2, y: r.y + r.height / 2 }; }),
  etat: () => ({ pf: pfEtat, meteo, meteoCible, qualite, items: items.map(i => ({ v: i.v, lieu: i.lieu })), soucoupe: API.soucoupe(), allumes: souleves.map(s => peche[s.i]?.n), peche: API.peche(), verrou: VERROU }),
  stop() { VIVANT = false; cancelAnimationFrame(RAF); retirerSouleves(); },
};
`;

// la feuille de style de la maquette, pour l'application : les règles des éléments gardés, préfixés ; plus rien de la page
// (html, body, cadre, boutons, panneau, compteur, chargement, bulle, capitaine) ; le décor est un canvas de la scène de
// l'application, dimensionné par elle
export function styles(css) {
  const out = [];
  const regles = css.replace(/@media[^{]*\{[^{}]*\{[^{}]*\}\s*\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").match(/[^{}]+\{[^{}]*\}/g) ?? [];
  for (const r of regles) {
    const [, sel, corps] = r.trim().match(/^([^{]+)\{([^{}]*)\}$/);
    const garde = sel.split(",").map((s) => s.trim()).filter((s) => {
      if (/^(:root|html|body)\b/.test(s) || s === "#scene") return false;
      return !RETIRES.some((id) => new RegExp(`#${id}(?![A-Za-z])`).test(s));
    }).map((s) => s.replace(/#scene(?![A-Za-z])/g, "#etal-scene").replace(new RegExp(`#(${GARDES.join("|")})(?![A-Za-z])`, "g"), "#etal-$1"));
    if (garde.length) out.push(`${garde.join(",")}{${corps}}`);
  }
  return out.join("\n");
}

// une section de la maquette : de sa bannière (« /* ---------- NOM ---------- */ ») à la bannière suivante
function section(js, nom) {
  const ban = `/* ---------- ${nom} ---------- */`, i = js.indexOf(ban);
  if (i < 0 || js.indexOf(ban, i + 1) >= 0) throw new Error(`export-etal : section « ${nom} » introuvable ou en double ; la maquette a changé`);
  const j = js.indexOf("/* ----------", i + ban.length), k = js.indexOf("const MONNAIE = [", i + ban.length);
  const fin = [j, k].filter((x) => x > 0).reduce((a, b) => Math.min(a, b), js.length);
  return [i, fin];
}
const lister = (d, pre = "") => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? lister(join(d, f), `${pre}${f}/`) : [`${pre}${f}`])).sort();

export function exportEtal({ log = console.log, ecrire = true } = {}) {
  const html = readFileSync(MAQUETTE, "utf8"), empreinte = createHash("sha256").update(html).digest("hex").slice(0, 12);
  const css = html.match(/<style>\n([\s\S]*?)\n<\/style>/)?.[1], js0 = html.match(/<script>\n([\s\S]*?)\n<\/script>/)?.[1];
  if (!css || !js0) throw new Error("export-etal : style ou script de la maquette introuvable");
  // 1. les éléments de la scène : de la caisse aux voiles, ids préfixés, sans le capitaine, la bulle ni les commandes
  const a = html.indexOf('  <div id="captVoile"></div>'), b = html.indexOf('  <div id="voile"></div>');
  if (a < 0 || b < a) throw new Error("export-etal : les éléments de la scène ont changé");
  const corps = html.slice(a, b + '  <div id="voile"></div>'.length).replace(/ id="([A-Za-z]+)"/g, (m, id) => { if (!GARDES.includes(id)) throw new Error(`export-etal : élément ${id} inattendu`); return ` id="etal-${id}"`; })
    .replace(/ src="img\//g, ' src="${IMGS}').replace(/\n\s*/g, "");
  // 2. le script, retouché
  let js = js0;
  for (const [x, y, pourquoi] of RETOUCHES) {
    const n = js.split(x).length - 1; if (n !== 1) throw new Error(`export-etal : retouche « ${pourquoi} » : ${n} occurrence(s) au lieu d'une ; la maquette a changé`);
    js = js.replace(x, () => y);
  }
  // le compteur d'images par seconde disparaît (la mesure est celle de l'application)
  const cpt = /\n {2}if \(fpsT > 0\.5\) \{ \$\('compteur'\)\.textContent = .*\n/;
  if (!cpt.test(js)) throw new Error("export-etal : compteur introuvable ; la maquette a changé"); js = js.replace(cpt, "\n  if (fpsT > 0.5) { fpsN = 0; fpsT = 0; }\n");
  for (const [nom] of SECTIONS) { const [i, j] = section(js, nom); js = js.slice(0, i) + js.slice(j); }
  // le démarrage : les images, puis la scène (le temps qu'il fait est tiré par l'application), sans le capitaine, le panneau,
  // l'écran de chargement ni les crochets d'essai de la maquette
  const d0 = js.indexOf("Promise.all([...NOMS");
  if (d0 < 0 || js.indexOf("Promise.all([...NOMS", d0 + 1) >= 0) throw new Error("export-etal : démarrage introuvable");
  const charge = js.slice(d0, js.indexOf(".then(() => {", d0));
  js = js.slice(0, d0) + RACCORDS + `const PRET = ${charge}.then(() => {
  preparer(); initPluie();
  poserMeteo(OPTS.meteo ? 1 : 0); meteo = meteoCible;
  nouveauBateau(hasard(450, 700)); nouveauBateau(hasard(850, 1150));
  appliquerVignette(); caisse();
  RAF = requestAnimationFrame(image);
});
API.pret = PRET;
return API;
`;
  // plus rien de la page de la maquette
  for (const [re, quoi] of [[/document\.getElementById/, "un élément de la page de la maquette"], [/\$\('(bMeteo|bPrix|bBateau|bPeche|bCapt|bRegl|reglages|compteur|chargement|bulle|capt|decor2)'\)/, "un élément retiré"], [/\bMASC\b|localStorage|window\.MAQ|\bdire\(|programmerOrage\(\);/, "un reste de la maquette"], [/(^|[^.\w])addEventListener\(/m, "un écouteur de la fenêtre qui ne serait pas retiré"]]) {
    const x = js.match(re); if (x) throw new Error(`export-etal : ${quoi} reste : ${js.slice(Math.max(0, x.index - 40), x.index + 60)}`);
  }
  const feuille = styles(css);
  const module = `// FICHIER GÉNÉRÉ par art/tools/export-etal.mjs depuis art/etal/index.html (empreinte ${empreinte}) : ne pas modifier à
// la main. Le script de la maquette de l'étal du pêcheur, tel quel, enveloppé dans startEtal ; ses raccords à l'application
// sont décrits dans l'outil (RETOUCHES, SECTIONS, RACCORDS). Les images sont dans assets/etal/.
//
// OPTS : { images : le dossier des images (« assets/etal/ ») ; police : la police des ardoises ; reglages : etal.json ;
// meteo : mauvais temps dès l'entrée (true) ; peche : [noms, prix] la première pêche ; derniereReplique ; fige() : la scène
// est-elle en pause ; toucher(e) : ce toucher peut-il agir ; on(cible, type, f) : un écouteur à retirer en sortant ;
// change() : la soucoupe a changé ; mesure(t) : appelé à chaque image }.
// Renvoie { decor, scene, api } : le canvas du décor (à poser sous la mascotte), la scène de la caisse (1280 × 800, à poser
// dans le calque des boutons, sous eux), et l'interface (API ; api.pret : les images chargées).
/* eslint-disable */
export const STYLE = ${JSON.stringify(feuille)};
export function startEtal(OPTS) {
let VIVANT = true, RAF = 0;
const IMGS = OPTS.images;
const DECOR = document.createElement('canvas'); DECOR.id = 'etal-decor'; DECOR.className = 'etal-decor'; DECOR.width = 1920; DECOR.height = 1200;
const SCENE = document.createElement('div'); SCENE.id = 'etal-scene'; SCENE.className = 'etal-scene';
SCENE.innerHTML = \`${corps}\`;
const EL = id => id === 'decor' ? DECOR : id === 'scene' ? SCENE : SCENE.querySelector('#etal-' + id);
const API0 = (() => {
${js}
})();
return { decor: DECOR, scene: SCENE, api: API0 };
}
`;
  const images = lister(IMG);
  if (ecrire) {
    mkdirSync(OUT_IMG, { recursive: true });
    for (const f of images) { mkdirSync(join(OUT_IMG, f, ".."), { recursive: true }); copyFileSync(join(IMG, f), join(OUT_IMG, f)); }
    for (const f of lister(OUT_IMG)) if (!images.includes(f)) unlinkSync(join(OUT_IMG, f));
    mkdirSync(join(APP, "js/etal"), { recursive: true });
    writeFileSync(OUT_JS, module);
    execFileSync(process.execPath, ["--check", OUT_JS]); // (le module se lit)
  }
  const poids = images.reduce((s, f) => s + statSync(join(IMG, f)).size, 0);
  const empreinteSortie = createHash("sha256").update(module).update(images.map((f) => f + createHash("sha256").update(readFileSync(join(IMG, f))).digest("hex")).join()).digest("hex").slice(0, 12);
  log(`étal : ${images.length} images (${(poids / 1048576).toFixed(2)} Mo) -> ${OUT_IMG} ; module ${(module.length / 1024).toFixed(0)} Ko -> ${OUT_JS} ; empreinte ${empreinteSortie}`);
  return { images, poids, empreinte, empreinteSortie, module };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const x = exportEtal(), y = exportEtal({ ecrire: false, log: () => {} });
  if (x.empreinteSortie !== y.empreinteSortie) throw new Error("export-etal : deux fabrications différentes");
  console.log("seconde fabrication identique");
}
