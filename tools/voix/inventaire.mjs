// INVENTAIRE DE TOUT CE QUE LA VOIX PEUT DIRE, tiré de app/content/ (docs/SPEC.md, « Voix enregistrée à
// l'avance »). Chaque gabarit de textes.json est rempli avec toutes les valeurs que l'application peut lui
// donner (les nombres des niveaux du module 1, les 66 additions sous leurs trois formes, les noms de la
// pieuvre, les créatures…), puis découpé en phrases (app/js/engine/phrases.js) : une phrase = un fichier.
// Le domaine de chaque nombre est écrit ici, à côté de la règle du code qui le produit ; un gabarit à
// nombre ajouté dans textes.json sans règle ici fait échouer l'inventaire (et donc les tests).
import { readFileSync } from "node:fs";
import { decompose, fill, hundredsWords, sentences } from "../../app/js/engine/phrases.js";
import { e7Value, levelValues } from "../../app/js/modules/numberline/generator.js";
import { e7Words } from "../../app/js/modules/numberline/dictation.js";
import { calcsOf, chemin } from "../../app/js/modules/calc/calc.js";

const CONTENT = new URL("../../app/content/", import.meta.url);
export const lireContenu = () => Object.fromEntries(["textes", "lecons", "cartes", "module1", "module2", "module3", "module4", "seance"].map((k) => [k, JSON.parse(readFileSync(new URL(`${k}.json`, CONTENT), "utf8"))]));

const range = (a, b, s = 1) => { const out = []; for (let v = a; v <= b; v += s) out.push(v); return out; };
const TOUS = range(0, 100); // tout nombre de la ligne graduée (le module 1 va de 0 à 100)
// au plus autant d'étoiles gagnées dans une séance dites au bilan ; au-delà, la synthèse du navigateur prend le relais
export const ETOILES_MAX = 60;
// le score du défi record (lot 2, étape 7, modules/facts/challenge.js) et le record dit quand il n'est pas battu :
// au plus autant de bonnes réponses en une minute (au-delà, la synthèse du navigateur prend le relais)
export const DEFI_MAX = 60;
// les sauts d'une question « sauter » : 1 à 4 (generator.js, makeJump)
const SAUTS_MAX = 4;

// les 66 additions dont le résultat ne dépasse pas 10 (docs/SPEC.md, Module 2), 0 compris
export const additions = (max = 10) => range(0, max).flatMap((a) => range(0, max - a).map((b) => ({ a, b, n: a + b })));

// les fragments qui ne sont jamais dits seuls : ils remplissent un autre gabarit
const FRAGMENTS = new Set(["unSaut", "sauts", "uneEtoile", "desEtoiles", "uneDizaine", "desDizaines", "uneUnite", "desUnites", "centaineUn", "centainesPlus", "dizaineUn", "uniteUn", "placesUnites", "placesDizainesUnites"]);

// clé de textes.json -> liste des valeurs de ses {variables}
function domaines(C) {
  const T = C.textes, M1 = C.module1.niveaux;
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
  // seules les cartes qui se gagnent déjà sont dites (celles qui attendent leur anecdote ne se gagnent pas)
  const cartes = C.cartes.cartes.filter((c) => c.anecdote).map((c) => ({ nom: c.nomLu ?? c.nom }));
  // lot 2, étape 8 : les nombres jusqu'à 1 000, seulement ceux que les niveaux 9 à 13 peuvent produire
  // (generator.js, levelValues : lignes, départs, nombres dictés, cibles « estimer ») ; docs/SPEC-LOT2.md, section 4
  const N = (n) => M1.find((c) => c.niveau === n) ?? null, vals = (ns) => [...new Set(ns.flatMap((n) => (N(n) ? levelValues(N(n)) : [])))].filter((v) => v > 100);
  const lignes1000 = vals([9, 10, 11]), dictee = N(12)?.nombres ?? [], estimer1000 = N(13)?.cibles ?? [], grands = [...new Set([...lignes1000, ...dictee, ...estimer1000])];
  const departs1000 = M1.filter((c) => c.niveau >= 9 && c.departs).flatMap((c) => c.departs);
  const avecNombre = (xs) => xs.map((n) => ({ n }));
  return {
    // lot 2, étape 8 : la dictée, la correction E6 (décomposition) et E7 (écrit comme on l'entend)
    ecrire: avecNombre(dictee),
    "erreur.E6": grands.filter((n) => n < 1000).map((n) => ({ n, ...hundredsWords(T, n) })),
    "erreur.E7": dictee.filter((n) => e7Value(n) !== null).map((n) => e7Words(n, T)),
    sauter: sauter.map(({ a, b }) => ({ a, sauts: sautsDe(b) })),
    "erreur.E3": [...departs, ...departs1000].map((a) => ({ a })),
    "erreur.E3sauter": [...new Set(sauter.map((s) => s.a))].map((a) => ({ a })),
    "erreur.E5": e5,
    bonneReponse: [...TOUS, ...grands].map((n) => ({ n })),
    placer: [...TOUS, ...lignes1000].map((n) => ({ n })),
    estimer: [...TOUS, ...estimer1000].map((n) => ({ n })),
    guideDepart: [...TOUS, ...lignes1000.filter((v) => v % 10 === 0)].map((a) => ({ a })),
    guideMilieu: [...milieux, ...(N(13) ? [{ n: (N(13).min + N(13).max) / 2 }] : [])],
    recompense: range(1, ETOILES_MAX).map((n) => ({ etoiles: etoiles(n) })),
    serieBonus: [{ n: C.cartes.serie.bonus }],
    // lot 3 bis (B6) : plusieurs étoiles arc-en-ciel à la récompense, une seule phrase (au plus un niveau par question)
    etoilesArc: range(2, 20).map((n) => ({ n })),
    fait: faits, faitTrouDroite: faits, faitTrouGauche: faits, faitCorrection: faits,
    // l'aide de la famille 1 : la tortue part du grand nombre et fait 1 ou 2 sauts (facts/screen.js)
    aideLigne: faits.filter(({ a, b }) => Math.min(a, b) === 1 || Math.min(a, b) === 2).map(({ a, b }) => ({ a: Math.max(a, b), sauts: sautsDe(Math.min(a, b)) })),
    // l'aide des doubles jusqu'à 5 : a poissons et leur reflet
    aideReflet: range(2, 5).map((a) => ({ a })),
    // lot 3 bis (B5) : la famille 1 à trou (la tortue saute jusqu'au total), la maison à trou (les places sous le toit)
    aideLigneTrou: range(1, C.module2.sommeMax).map((n) => ({ n })),
    aideMaisonTrou: range(2, C.module2.sommeMax).map((n) => ({ n })),
    // lot 2, étape 6 : le cadre de 10 (le nombre de poissons déjà dans la boîte), le double + 1 (le double)
    aideCadre: range(2, 9).map((k) => ({ k })),
    aideDoublePlus: range(1, 4).map((d) => ({ d })),
    // lot 3 : chaque question des presque-doubles rappelle le double (facts/runner.js, q.rappel : d, le petit nombre)
    rappelDouble: faits.filter(({ a, b }) => Math.abs(a - b) === 1 && Math.max(a, b) <= 5).map(({ a, b }) => ({ a, b, d: Math.min(a, b) })),
    // lot 3, étape 4 : le calcul rapide (modules/calc/calc.js : calcsOf, les calculs de chaque niveau de module3.json ; chemin :
    // les pas des ponts ; la forme à trou aux niveaux où elle a un sens ; C4 et C5 : les unités et le nombre ajouté ou retiré)
    ...(() => {
      const M3 = C.module3?.niveaux ?? [], all = M3.flatMap((c) => calcsOf(c).map((x) => ({ ...x, type: c.type, support: c.support, trou: c.trou, trouDepart: c.trouDepart })));
      const steps = all.flatMap((x) => chemin(x)), k = (op) => [...new Set([...steps.filter((s) => s.op === op).map((s) => s.k), ...all.filter((x) => x.op === op && x.b < 10).map((x) => x.b)])].sort((a, b) => a - b).map((v) => ({ k: v }));
      const u = (n) => n % 10;
      return {
        calcPlus: all.filter((x) => x.op === "+").map(({ a, b }) => ({ a, b })), calcMoins: all.filter((x) => x.op === "-").map(({ a, b }) => ({ a, b })),
        calcTrouPlus: all.filter((x) => x.op === "+" && x.trou).map(({ a, n }) => ({ a, n })), calcTrouMoins: all.filter((x) => x.op === "-" && x.trou).map(({ a, n }) => ({ a, n })),
        // (lot 3 bis : le trou sur le nombre de départ aux niveaux à pas fixe, « Combien plus 10 ? Ça fait 57. »)
        calcTrouDepartPlus: all.filter((x) => x.op === "+" && x.trouDepart).map(({ b, n }) => ({ b, n })), calcTrouDepartMoins: all.filter((x) => x.op === "-" && x.trouDepart).map(({ b, n }) => ({ b, n })),
        "calcPont.plus": k("+"), "calcPont.moins": k("-"),
        "erreurCalc.C4": all.filter((x) => x.op === "+" && x.b < 10 && u(x.a) + x.b >= 10).map((x) => ({ u: u(x.a), b: x.b })),
        "erreurCalc.C5": all.filter((x) => x.op === "-" && x.b < 10 && u(x.a) < x.b).map((x) => ({ b: x.b, u: u(x.a) })),
        // lot 3 bis (B4) : l'aide du coquillage dit le premier pas (calc/screen.js, help) : au mur, le poisson descend ou monte
        // d'une ou plusieurs rangées ; sur un chemin de plusieurs ponts, « D'abord, on va jusqu'à 40 » ; d'un seul pont, le départ et le pas
        ...(() => {
          const first = all.map((x) => ({ x, s: chemin(x)[0], n: chemin(x).length })), mur = first.filter((f) => f.x.support === "mur" && f.s.k % 10 === 0 && f.s.k > 10);
          const uniq = (xs) => [...new Map(xs.map((v) => [JSON.stringify(v), v])).values()];
          return {
            "aideMur.plusDizaines": uniq(mur.filter((f) => f.s.op === "+").map((f) => ({ k: f.s.k, r: f.s.k / 10 }))),
            "aideMur.moinsDizaines": uniq(mur.filter((f) => f.s.op === "-").map((f) => ({ k: f.s.k, r: f.s.k / 10 }))),
            aideCheminPont: uniq(first.filter((f) => f.x.support !== "mur" && f.n > 1).map((f) => ({ n: f.s.a }))),
            aideChemin1: uniq(first.filter((f) => f.x.support !== "mur" && f.n === 1).map((f) => ({ a: f.x.a }))),
          };
        })(),
      };
    })(),
    // lot « Les voiliers » (modules/voiliers/voiliers.js) : les bouées rondes d'une rangée (genBuoys : de 10 à 990, de 10 en
    // 10 ; centaines de 100 à 900) et de la rangée des dizaines du double encadrement (tensWindow) ; « C'est entre {a} et
    // {b} ! » : deux dizaines voisines (10 et 20 … 980 et 990) ou deux centaines voisines (100 et 200 … 800 et 900)
    ...(() => {
      if (!C.module4) return {};
      const rondes = range(10, 990, 10).map((b) => ({ b }));
      return { "voiliersErreur.plusGrand": rondes, "voiliersErreur.plusPetit": rondes, voiliersBravoEntre: [...range(10, 980, 10).map((a) => ({ a, b: a + 10 })), ...range(100, 800, 100).map((a) => ({ a, b: a + 100 }))] };
    })(),
    // le défi record (lot 3 bis, B6) : le score en perles, 2 ou plus (une seule : les phrases « …Un »)
    defiNouveauRecord: range(2, DEFI_MAX).map((n) => ({ n })),
    defiEgal: range(2, DEFI_MAX).map((n) => ({ n })),
    defiPresque: range(2, DEFI_MAX).map((n) => ({ n })),
    carteNouvelle: cartes, recifCarte: cartes,
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
  // l'album : le dos d'une carte pas encore découverte, une zone qui s'ouvre, une zone fermée, le dos doré d'une légendaire
  for (const z of C.cartes.zones) for (const k of ["dosLu", "ouvertureLu", "fermeeLu"]) if (z[k]) add(z[k], `cartes.zones.${z.id}.${k}`);
  if (C.cartes.legendaireLu) add(C.cartes.legendaireLu, "cartes.legendaireLu");
  // les sauts comptés à voix haute (tortue, leçons, aide) : un nombre seul, par sauts ou par valeurs
  for (const n of TOUS) add(String(n), "comptage");
  // lot 2, étape 8 : les nombres des lignes des niveaux 9 à 11, comptés pendant les corrections
  const M1 = C.module1.niveaux;
  for (const c of M1.filter((x) => x.niveau >= 9 && x.niveau <= 11)) for (const n of levelValues(c)) if (n > 100) add(String(n), "comptage");
  // lot « Les voiliers » : le nombre du bateau, dit seul (pickNumber : de 1 à 99 jusqu'à 100, de 1 à 999 jusqu'à 1 000)
  if (C.module4) for (const n of range(1, Math.max(...C.module4.niveaux.map((c) => c.max)) - 1)) add(String(n), "voiliers");
  return out;
}
