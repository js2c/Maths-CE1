// NOMBRES ET SYMBOLES EN TOUTES LETTRES, avant la synthèse (docs/SPEC.md, « Voix enregistrée à
// l'avance ») : la voix lit « trente-sept » et « plus », jamais « 37 » ou « + », pour maîtriser la
// prononciation. Orthographe traditionnelle (« vingt et un », « quatre-vingts »), qui se prononce comme
// l'orthographe rectifiée.

const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const DIZAINES = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante" };

const moinsDeVingt = (n) => (n <= 16 ? UNITES[n] : `dix-${UNITES[n - 10]}`);
function moinsDeCent(n) {
  if (n < 20) return moinsDeVingt(n);
  if (n < 70) { const d = DIZAINES[Math.floor(n / 10)], u = n % 10; return u === 0 ? d : u === 1 ? `${d} et un` : `${d}-${UNITES[u]}`; }
  if (n < 80) return n === 71 ? "soixante et onze" : `soixante-${moinsDeVingt(n - 60)}`;
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

// une phrase telle que la voix doit la lire : symboles puis nombres en lettres
export function pourLaVoix(phrase) {
  return phrase
    .replace(/\s*\+\s*/g, " plus ").replace(/\s*[−–]\s*/g, " moins ").replace(/\s*×\s*/g, " fois ").replace(/\s*=\s*/g, " égale ")
    .replace(/(?<=plus |moins |fois |égale )\?/g, "combien").replace(/^\?(?= plus)/, "Combien")
    .replace(/\d+/g, (d, i, s) => enLettres(Number(d), { feminin: FEMININS.test(s.slice(i + d.length).trimStart()) }))
    .replace(/\s{2,}/g, " ").trim();
}
