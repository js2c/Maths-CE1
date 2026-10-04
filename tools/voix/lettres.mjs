// NOMBRES ET SYMBOLES EN TOUTES LETTRES, avant la synthèse (docs/SPEC.md, « Voix enregistrée à
// l'avance ») : la voix lit « trente-sept » et « plus », jamais « 37 » ou « + », pour maîtriser la
// prononciation. Ce texte n'est jamais affiché : il est écrit pour être bien dit par la voix (Chatterbox).
// - « vingt-et-un », « soixante-et-onze » avec traits d'union : écrits en trois mots, la voix les coupait
//   (« vingt… et un ») une fois sur quatre ;
// - « plusse » pour le « plus » de l'addition, que la voix lisait souvent « plu » ;
// - « sisse », « huite », « disse », « cinque » devant une opération (« vingt-sisse plusse dix ») : la voix
//   disait « si », « hui », « di » comme devant un nom. Devant un nom (« six poissons »), rien ne change.
// (Essais d'écoute d'octobre 2026. Le contrôle par retranscription n'entend pas ces défauts.)

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

// un entier de 0 à 999 999 en lettres ; `feminin` : « une », « vingt et une » (une étoile, une dizaine)
export function enLettres(n, { feminin = false } = {}) {
  if (!Number.isInteger(n) || n < 0 || n > 999999) throw new Error(`nombre hors du domaine : ${n}`);
  let s;
  if (n < 1000) s = moinsDeMille(n);
  else { const m = Math.floor(n / 1000), r = n % 1000; s = `${m === 1 ? "mille" : `${moinsDeMille(m)} mille`}${r ? ` ${moinsDeMille(r)}` : ""}`; }
  return feminin ? s.replace(/\bun$/, "une") : s;
}

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
