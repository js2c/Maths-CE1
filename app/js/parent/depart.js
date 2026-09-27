// LE POINT DE DÉPART DU PARENT (docs/SPEC-LOT2.md, section 7) : choisir le niveau actuel de la ligne graduée
// (niveaux 1 à 8 à l'étape 2), marquer une famille de faits comme connue (familles 1 et 2 : ses faits passent
// en boîte 3). Noté dans l'historique des niveaux comme un choix du parent ; ne rapporte rien à l'enfant
// (pas d'étoile arc-en-ciel). Aussi, pour l'espace parent : les crans autorisés du sélecteur de difficulté et
// l'activation du défi record.
import { initialLevelState } from "../modules/progress.js";
import { catalog, DAY, familyOf, ruleFacts, startOfDay } from "../modules/facts/facts.js";
import { initialFamilies, updateFamilies } from "../modules/facts/families.js";

// le niveau actuel de la ligne graduée, choisi par le parent
export async function setLineLevel(store, niveau, now = Date.now()) {
  const st0 = (await store.get("niveaux", 1)) ?? initialLevelState(1, now);
  if (st0.niveau === niveau) return st0;
  const st = { ...st0, niveau, fenetre: [], vus: 0, taux: [], justesNiveau: 0, obtenus: [...(st0.obtenus ?? []), { niveau, date: now, parent: true, de: st0.niveau }] };
  await store.put("niveaux", st);
  return st;
}
// une famille marquée connue : chacun des faits de sa règle passe en boîte 3 (un fait déjà plus haut y reste),
// prochain passage dans les jours de la boîte 3 ; le passage est noté dans l'historique du fait
export async function markFamilyKnown(store, c, id, now = Date.now()) {
  const byKey = new Map((await store.all("faits")).map((f) => [f.fait, f])), cat = new Map(catalog(c).map((f) => [f.fait, f])), out = [];
  for (const r of ruleFacts(c, id)) {
    const f0 = byKey.get(r.fait) ?? { ...cat.get(r.fait), historique: [], introduit: now };
    if ((f0.boite ?? 0) >= 3) continue;
    const f = { ...f0, boite: 3, prochain: startOfDay(now) + c.boites[2] * DAY, historique: [...(f0.historique ?? []), { t: now, parent: true, boite: f0.boite ?? null, apres: 3 }] };
    await store.put("faits", f); out.push(f);
  }
  const log = (await store.setting("choixParent")) ?? [];
  await store.setSetting("choixParent", [...log, { t: now, type: "famille", famille: id, nom: familyOf(c, id)?.nom, faits: out.length }]);
  // lot 2, étape 6 : la famille (et celles d'avant) est ouverte ; elle compte comme acquise, choix du parent (pas
  // d'étoile arc-en-ciel) ; la suivante s'ouvrira d'elle-même (règle des 80 %, à la prochaine séance)
  let st = (await store.get("niveaux", 2)) ?? initialFamilies(c, now);
  for (const f of c.familles) if (f.id <= id && !st.ouvertes.includes(f.id)) { st = { ...st, ouvertes: [...st.ouvertes, f.id], ouvertures: [...st.ouvertures, { famille: f.id, date: now, parent: true }] }; }
  st = updateFamilies(c, st, await store.all("faits"), now, { parent: true, open: false }).st;
  await store.put("niveaux", st);
  return out;
}
// les familles déjà connues (au moins 80 % des faits de leur règle en boîte 3 ou plus)
export function familyKnown(c, faits, id) {
  const rule = ruleFacts(c, id), byKey = new Map(faits.map((f) => [f.fait, f]));
  return rule.length > 0 && rule.filter((r) => (byKey.get(r.fait)?.boite ?? 0) >= 3).length >= 0.8 * rule.length;
}
