// LE RÉCIF EN PAGES, UNE PAR ZONE (lot 3, étape 5 ; décision du parent du 28 septembre 2026 ; docs/SPEC.md, « Le récif »).
// Fonctions pures, testées par tests/unit/recif-pages.test.mjs ; l'écran est dans reef.js.
//  - les zones et leur ordre sont ceux des cartes et de l'album (content/cartes.json, zones) ;
//  - une zone a sa page seulement si elle est ouverte ET si au moins une de ses créatures a un dessin (le sprite
//    `creature.<id>` de l'atelier) et une place dans le récif (`recif` : [x, y] dans cartes.json) : rien en dur, le lot 4
//    ajoutera les zones 2 à 4 par le contenu et l'atelier ;
//  - à l'entrée, la page de la zone de la dernière carte gagnée (sinon la première page : le lagon) ;
//  - glisser : au-delà d'un tiers de l'écran, ou d'un geste rapide, on passe à la page voisine ; sinon retour ; en bout de
//    liste, une résistance, puis un rebond.

// les réglages par défaut (content/cartes.json, `recifPages`, les remplace)
export const PAGES = { largeur: 1280, seuil: 1 / 3, vitesse: 0.45, distanceRapide: 40, glisser: 12, toucherMs: 700, resistance: 0.3, rebondMax: 110, dureeMs: 320 };
export const pagesConf = (cartes) => ({ ...PAGES, ...(cartes?.recifPages ?? {}) });

// les zones qui ont leur page, dans l'ordre des cartes : [id]
export function reefPages(cartes, { zoneOpen = () => false, hasSprite = () => false } = {}) {
  return (cartes.zones ?? []).map((z) => z.id).filter((id) => zoneOpen(id) && (cartes.cartes ?? []).some((c) => c.zone === id && Array.isArray(c.recif) && hasSprite(c.id)));
}
// les créatures d'une page : les cartes gagnées de la zone qui ont un dessin et une place
export const pageCreatures = (collection, zone, hasSprite = () => true) => collection.filter((c) => c.zone === zone && Array.isArray(c.recif) && hasSprite(c.id));
// la page d'entrée : la zone de la dernière carte gagnée (`derniere`, sinon `premiere`), si elle a sa page ; sinon la première
export function entryZone(pages, collection = []) {
  if (!pages.length) return null;
  const last = [...collection].filter((c) => (c.derniere ?? c.premiere) != null).sort((a, b) => (b.derniere ?? b.premiere) - (a.derniere ?? a.premiere))[0];
  return last && pages.includes(last.zone) ? last.zone : pages[0];
}
// toucher ou glisser ? un geste devient un glisser quand il s'écarte de plus de `glisser` px, surtout à l'horizontale
export const isDrag = (dx, dy, conf = PAGES) => Math.abs(dx) > conf.glisser && Math.abs(dx) >= Math.abs(dy);
// un toucher bref, sans glisser, sur une créature : sa carte s'ouvre
export const isTap = (dx, dy, ms, conf = PAGES) => Math.hypot(dx, dy) <= conf.glisser && ms <= conf.toucherMs;
// le décalage montré pendant le glisser : le doigt, sauf au-delà des bouts de la liste (une résistance, bornée)
export function dragShift(dx, idx, n, conf = PAGES) {
  const over = (dx > 0 && idx === 0) || (dx < 0 && idx === n - 1);
  if (!over) return Math.max(-conf.largeur, Math.min(conf.largeur, dx));
  return Math.sign(dx) * Math.min(conf.rebondMax, Math.abs(dx) * conf.resistance);
}
// au relâcher : la page où se caler (-1 : la précédente, +1 : la suivante, 0 : rester) ; v : vitesse en px par ms
export function settleTarget(dx, v, idx, n, conf = PAGES) {
  const dir = dx < 0 ? 1 : -1, far = Math.abs(dx) > conf.largeur * conf.seuil, fast = Math.abs(v) > conf.vitesse && Math.abs(dx) > conf.distanceRapide && Math.sign(v) === Math.sign(dx);
  if (!far && !fast) return 0;
  const to = idx + dir;
  return to >= 0 && to < n ? dir : 0;
}
// les planches d'une page : celles des créatures gagnées de la zone (`owned` : { id: … }), et de son décor s'il y en a un
// (`zones[].recif.decor`, un sprite de l'atelier : lot 4)
export function pageSheets(atlas, cartes, zone, owned = {}) {
  const out = new Set(), z = (cartes.zones ?? []).find((x) => x.id === zone);
  for (const c of cartes.cartes ?? []) { const s = atlas.sprites[`creature.${c.id}`]; if (c.zone === zone && owned[c.id] && Array.isArray(c.recif) && s) out.add(s.sheet); }
  const d = z?.recif?.decor && atlas.sprites[z.recif.decor]; if (d) out.add(d.sheet);
  return out;
}
