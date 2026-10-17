// LE STOCKAGE DE LA TABLETTE (lot « Banc Android et recette en conditions réelles », point 2 ; docs/LOTS.md, fiche 13). Quand la
// tablette n'a pas assez de place pour garder l'application entière hors ligne (environ 135 Mo), le service worker ne
// télécharge rien et le note « stockage plein » dans le journal technique (app/sw.js) ; l'application reste utilisable tant que
// le Wi-Fi est là, et les données de l'enfant s'enregistrent (elles prennent peu de place). L'espace parent le dit au parent,
// en haut de chaque onglet, jusqu'à ce qu'une installation réussisse.
import { lire } from "./journal.js";

// la règle, testée (tests/unit/banc.test.mjs) : le dernier événement d'installation du service worker est « stockage plein »
export function stockagePlein(evenements) {
  const sw = evenements.filter((e) => e.source === "service worker" && ["stockage plein", "installation finie", "version activée"].includes(e.message));
  const d = sw.at(-1);
  return d?.message === "stockage plein" ? d : null;
}
const mo = (n) => (n == null ? null : `${Math.max(0, Math.round(n))} Mo`);
// le texte pour le parent (ou null si tout va bien)
export function texteStockage(d, { controlee = false } = {}) {
  if (!d) return null;
  const besoin = mo(d.besoinMo) ?? "environ 135 Mo", libre = mo(d.libreMo);
  return `La tablette n'a plus assez de place pour garder l'application hors ligne (il faut ${besoin}${libre ? `, il reste ${libre}` : ""}). `
    + (controlee ? "La version déjà installée continue de marcher, mais la nouvelle ne peut pas s'installer. " : "L'application marche tant que le Wi-Fi est là ; sans Wi-Fi, elle ne s'ouvrira pas. ")
    + "Les progrès de l'enfant sont bien enregistrés. Pour régler cela : libérez de la place sur la tablette (photos, vidéos, applications inutilisées), puis relancez l'application avec le Wi-Fi.";
}
export async function avisStockage() {
  try {
    const d = stockagePlein(await lire());
    if (!d) return null;
    return { texte: texteStockage(d, { controlee: !!navigator.serviceWorker?.controller }), details: d };
  } catch { return null; }
}
