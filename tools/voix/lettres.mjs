// NOMBRES ET SYMBOLES EN TOUTES LETTRES, avant la synthèse (docs/SPEC.md, « Voix enregistrée à
// l'avance ») : la voix lit « trente-sept » et « plus », jamais « 37 » ou « + », pour maîtriser la
// prononciation. Ce texte n'est jamais affiché : il est écrit pour être bien dit par la voix (Chatterbox).
// - « vingt-et-un », « soixante-et-onze » avec traits d'union : écrits en trois mots, la voix les coupait
//   (« vingt… et un ») une fois sur quatre ;
// - « plusse » pour le « plus » de l'addition, que la voix lisait souvent « plu » ;
// - « sisse », « huite », « disse », « cinque » devant une opération (« vingt-sisse plusse dix ») : la voix
//   disait « si », « hui », « di » comme devant un nom. Devant un nom (« six poissons »), rien ne change.
// (Essais d'écoute d'octobre 2026. Le contrôle par retranscription n'entend pas ces défauts.)

// (les nombres en lettres sont rangés dans app/js/engine/phrases.js, partagés avec l'application : lot « Les voiliers », la
// bulle écrit le nombre du bateau en lettres)
import { enLettres } from "../../app/js/engine/phrases.js";
export { enLettres };

// les mots féminins qui peuvent suivre un nombre dans les phrases de l'application
const FEMININS = /^(étoiles?|dizaines?|unités?|secondes?|minutes?)(?![\p{L}-])/u;

// le « plus » qui se dit « plusse » : devant un nombre ou « combien » (l'addition), et « de plus », « en plus »
// en fin de groupe. Les autres (« le plus grand », « ne savent plus ») restent « plus ».
const NOMBRE = "zéro|une?|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante|soixante|cent|mille";
const PLUS = new RegExp(`\\b(p)lus(?= (?:combien|${NOMBRE})(?![\\p{L}])|(?<=\\b(?:de|en) plus)\\s*(?:[!,.?]|$))`, "giu");
// six, huit, dix, cinq devant une opération : la forme pleine, écrite comme elle se dit
const PLEINES = { six: "sisse", huit: "huite", dix: "disse", cinq: "cinque" };
const PLEIN = /(?<![\p{L}])(six|huit|dix|cinq)(?= (?:plusse|moins|fois|égale)(?![\p{L}]))/giu;
const plein = (m) => (m[0] === m[0].toLowerCase() ? PLEINES[m] : PLEINES[m.toLowerCase()].replace(/^./, (c) => c.toUpperCase()));

// une phrase telle que la voix doit la lire : symboles puis nombres en lettres
export function pourLaVoix(phrase) {
  return phrase
    .replace(/\s*\+\s*/g, " plus ").replace(/\s*[−–]\s*/g, " moins ").replace(/\s*×\s*/g, " fois ").replace(/\s*=\s*/g, " égale ")
    .replace(/(?<=plus |moins |fois |égale )\?/g, "combien").replace(/^\?(?= plus)/, "Combien")
    .replace(/\d+/g, (d, i, s) => enLettres(Number(d), { feminin: FEMININS.test(s.slice(i + d.length).trimStart()) }))
    .replace(/\s{2,}/g, " ").trim()
    .replace(PLUS, "$1lusse").replace(PLEIN, plein);
}
