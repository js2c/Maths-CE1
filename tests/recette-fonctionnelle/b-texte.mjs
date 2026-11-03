// RECETTE FONCTIONNELLE, PARTIE B (b-sequences.mjs) : ce que le relecteur lit, en mots simples. Fonctions pures, testées par
// tests/unit/b-sequences-texte.test.mjs.
// (lot « Correctifs des relectures » ; relecture du lot « Décisions sur les constats de l'agent », questions 3 et 4) CE QUE LE
// RELECTEUR LIT : les étapes et les événements des familles en mots simples. Avant, « étapes : accueil, echauffement, notion,
// defi… », en noms internes sur une ligne longue, se lisait « accueil, echauffement » seulement ; « acquise famille 7 » pendant une
// séance sur la famille 3, et « trou famille 3 » pour une enfant qui a tout juste, semblaient des erreurs de l'outil : ce sont des
// événements réels de l'application (une famille revue à l'échauffement ou en révision devient acquise ; les formes à trou
// s'ouvrent pour une famille), qui disent désormais ce qu'ils sont.
const ETAPE_NOM = { accueil: "accueil", echauffement: "échauffement", notion: "notion du jour", defi: "défi record", probleme: "problème du jour", recompense: "récompense" };
const SAUTEE_NOM = { "pas encore": "pas encore (moins de 5 séances terminées, ou trop peu de faits bien sus)", "désactivée": "pas encore construit", "temps écoulé": "le temps de la séance était écoulé" };
export const etapesTexte = (etapes) => {
  const jouees = etapes.filter((e) => !e.sautee).map((e) => ETAPE_NOM[e.id] ?? e.id), sautees = etapes.filter((e) => e.sautee).map((e) => `${ETAPE_NOM[e.id] ?? e.id} (${SAUTEE_NOM[e.sautee] ?? e.sautee})`);
  return `${jouees.join(", ")}${sautees.length ? ` ; sautées : ${sautees.join(", ")}` : ""}`;
};
// un événement des familles à la fin de la notion du jour des additions ; `jour` : la famille de la séance ; `familles` :
// module2.json, familles
export const evenementFamilleTexte = (e, jour, familles) => {
  const fam = familles.find((x) => x.id === e.famille), f = `la famille ${e.famille} (${fam?.nom ?? ""})`, autre = e.famille !== jour;
  // (un mélange n'a pas d'ouverture propre des formes à trou : chaque fait y prend celles des familles dont il relève, docs/SPEC.md,
  // section 6 ; l'événement interne est sans effet : il n'est pas écrit)
  if (e.type === "trou" && fam?.regle === "melange") return null; // (rien à écrire)
  if (e.type === "acquise") return `${f} est acquise${autre ? ` : ce n'est pas la famille de la séance, ses faits revus aujourd'hui (échauffement, révision) sont maintenant bien sus` : ""}`;
  if (e.type === "trou") return [3, 4, 5].includes(e.famille) ? `${f} : la moitié de ses faits sont bien sus ; ses questions ne changent pas (elles sont déjà à trou selon le cran), mais dans le mélange ses faits pourront être posés à trou` : `les formes à trou s'ouvrent pour ${f} : la moitié de ses faits sont bien sus, ses questions pourront être « 3 + ? = 7 »`;
  if (e.type === "ouverte") return `${f} s'ouvre${e.stagnation ? " (la famille d'avant n'avançait plus)" : ""}`;
  if (e.type === "depassee") return `${f} est dépassée (pas acquise après 6 séances) : elle reste en révision`;
  return `${e.type} famille ${e.famille}`;
};
