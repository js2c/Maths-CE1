// INVENTAIRE DE TOUT CE QUE LA VOIX PEUT DIRE, tiré de app/content/ (docs/SPEC.md, « Voix enregistrée à
// l'avance »). Chaque gabarit de textes.json est rempli avec toutes les valeurs que l'application peut lui
// donner (les nombres des niveaux du module 1, les 66 additions sous leurs trois formes, les noms de la
// pieuvre, les créatures…), puis découpé en phrases (app/js/engine/phrases.js) : une phrase = un fichier.
// Le domaine de chaque nombre est écrit ici, à côté de la règle du code qui le produit ; un gabarit à
// nombre ajouté dans textes.json sans règle ici fait échouer l'inventaire (et donc les tests).
import { readFileSync } from "node:fs";
import { decompose, fill, sentences } from "../../app/js/engine/phrases.js";

const CONTENT = new URL("../../app/content/", import.meta.url);
export const lireContenu = () => Object.fromEntries(["textes", "lecons", "cartes", "module1", "module2", "seance"].map((k) => [k, JSON.parse(readFileSync(new URL(`${k}.json`, CONTENT), "utf8"))]));

const range = (a, b, s = 1) => { const out = []; for (let v = a; v <= b; v += s) out.push(v); return out; };
const TOUS = range(0, 100); // tout nombre de la ligne graduée (le module 1 va de 0 à 100)
// au plus autant d'étoiles gagnées dans une séance dites au bilan ; au-delà, la synthèse du navigateur prend le relais
export const ETOILES_MAX = 60;
// les sauts d'une question « sauter » : 1 à 4 (generator.js, makeJump)
const SAUTS_MAX = 4;

// les 66 additions dont le résultat ne dépasse pas 10 (docs/SPEC.md, Module 2), 0 compris
export const additions = (max = 10) => range(0, max).flatMap((a) => range(0, max - a).map((b) => ({ a, b, n: a + b })));

// les fragments qui ne sont jamais dits seuls : ils remplissent un autre gabarit
const FRAGMENTS = new Set(["unSaut", "sauts", "uneEtoile", "desEtoiles", "uneDizaine", "desDizaines", "uneUnite", "desUnites"]);

// clé de textes.json -> liste des valeurs de ses {variables}
function domaines(C) {
  const T = C.textes, M1 = C.module1.niveaux, noms = C.seance.noms;
  const sautsDe = (b) => (b === 1 ? T.unSaut : `${b} ${T.sauts}`);
  const etoiles = (n) => (n === 1 ? T.uneEtoile : fill(T.desEtoiles, { n }));
  // les lignes des niveaux : pour « sauter », tous les départs et nombres de sauts possibles
  const lignes = M1.map((c) => ({ c, min: c.min ?? 0, max: c.max ?? 100, pas: Array.isArray(c.pas) ? c.pas : [c.pas ?? 1] }));
  const sauter = lignes.filter((l) => l.c.formats.includes("sauter")).flatMap((l) => {
    const n = Math.round((l.max - l.min) / l.pas[0]) + 1;
    return range(1, SAUTS_MAX).flatMap((b) => range(0, n - 1 - b).map((i) => ({ a: l.min + i * l.pas[0], b })));
  });
  // les débuts de ligne qui ne sont pas 0 (erreur E3) : départs des niveaux, dizaines du niveau 7 (generator.js, lineFor)
  const departs = new Set([...M1.flatMap((c) => c.departs ?? []), ...M1.filter((c) => c.min > 0).map((c) => c.min), ...(M1.some((c) => c.niveau === 7) ? range(10, 90, 10) : [])]);
  // les nombres dont on peut inverser les chiffres (erreur E5, generator.js, TRAPS.E5)
  // accord au singulier : « 1 dizaine », « 1 unité » (numberline/screen.js, decompose)
  const e5 = range(10, 99).filter((n) => n % 10 !== 0 && n % 10 !== Math.floor(n / 10)).map((n) => decompose(T, n));
  const faits = additions(C.module2.sommeMax);
  const milieux = M1.filter((c) => c.formats.includes("estimer")).map((c) => ({ n: (c.min + c.max) / 2 }));
  // seules les cartes qui se gagnent déjà sont dites (celles des zones 2 à 4 attendent leur anecdote, lot 4)
  const cartes = C.cartes.cartes.filter((c) => c.anecdote).map((c) => ({ nom: c.nomLu ?? c.nom }));
  return {
    accueil: noms.map((mascotte) => ({ mascotte })),
    nomChoisi: noms.map((mascotte) => ({ mascotte })),
    nomTouche: noms.map((nom) => ({ nom })),
    nomValider: noms.map((nom) => ({ nom })),
    sauter: sauter.map(({ a, b }) => ({ a, sauts: sautsDe(b) })),
    "erreur.E3": [...departs].map((a) => ({ a })),
    "erreur.E3sauter": [...new Set(sauter.map((s) => s.a))].map((a) => ({ a })),
    "erreur.E5": e5,
    bonneReponse: TOUS.map((n) => ({ n })),
    placer: TOUS.map((n) => ({ n })),
    estimer: TOUS.map((n) => ({ n })),
    guideDepart: TOUS.map((a) => ({ a })),
    guideMilieu: milieux,
    recompense: range(0, ETOILES_MAX).map((n) => ({ etoiles: etoiles(n) })),
    serieBonus: [{ n: C.cartes.serie.bonus }],
    fait: faits, faitTrouDroite: faits, faitTrouGauche: faits, faitCorrection: faits,
    // l'aide de la famille 1 : la tortue part du grand nombre et fait 1 ou 2 sauts (facts/screen.js)
    aideLigne: faits.filter(({ a, b }) => Math.min(a, b) === 1 || Math.min(a, b) === 2).map(({ a, b }) => ({ a: Math.max(a, b), sauts: sautsDe(Math.min(a, b)) })),
    // l'aide des doubles jusqu'à 5 : a poissons et leur reflet
    aideReflet: range(1, 5).map((a) => ({ a })),
    carteNouvelle: cartes, carteDoublon: cartes, recifCarte: cartes,
  };
}

// toutes les phrases : Map phrase -> origine (la première clé de contenu qui la produit)
export function inventaire(C = lireContenu()) {
  const out = new Map(), D = domaines(C);
  const add = (texte, origine) => { for (const s of sentences(texte)) if (!out.has(s)) out.set(s, origine); };
  const gabarit = (cle, t) => {
    const vars = [...new Set([...t.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
    if (!vars.length) return add(t, cle);
    const dom = D[cle];
    if (!dom) throw new Error(`inventaire : pas de règle pour les nombres ou noms de « ${cle} » (${t}) : l'ajouter dans tools/voix/inventaire.mjs`);
    for (const v of dom) { const s = fill(t, v); if (/\{\w+\}/.test(s)) throw new Error(`inventaire : « ${cle} » reste incomplet : ${s}`); add(s, cle); }
  };
  const parcourir = (cle, v) => {
    if (typeof v === "string") return gabarit(cle, v);
    if (Array.isArray(v)) return v.forEach((x) => parcourir(cle, x));
    for (const [k, x] of Object.entries(v)) parcourir(`${cle}.${k}`, x);
  };
  for (const [k, v] of Object.entries(C.textes)) if (k !== "_doc" && !FRAGMENTS.has(k)) parcourir(k, v);
  // les leçons : chaque phrase dite, et ce que la voix dit au premier exercice guidé
  for (const [id, L] of Object.entries(C.lecons)) {
    if (id === "_doc") continue;
    L.phrases.flat().forEach((temps) => temps.dire && add(temps.dire, `lecons.${id}`));
    for (const k of ["aToi", "aToiDepuisZero"]) if (L[k]) add(L[k], `lecons.${id}.${k}`);
  }
  // les anecdotes des cartes (dites après « C'est … ! », dans le récif et dans l'album)
  for (const c of C.cartes.cartes) if (c.anecdote) add(c.anecdote, `cartes.${c.id}`);
  // l'album : le dos d'une carte pas encore découverte, une zone fermée, le dos doré d'une légendaire
  for (const z of C.cartes.zones) for (const k of ["dosLu", "fermeeLu"]) if (z[k]) add(z[k], `cartes.zones.${z.id}.${k}`);
  if (C.cartes.legendaireLu) add(C.cartes.legendaireLu, "cartes.legendaireLu");
  // les sauts comptés à voix haute (tortue, leçons, aide) : un nombre seul, par sauts ou par valeurs
  for (const n of TOUS) add(String(n), "comptage");
  return out;
}
