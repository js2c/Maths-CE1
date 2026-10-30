// LE RÉCIF VIVANT DANS LES PARCOURS (session/reef.js) : ses créatures ne sont plus des boutons mais des images dessinées dans
// un canvas ; on les trouve et on les touche par l'interface du module (recif/recif-vivant.js : vivantes, aller, ou).
// attend que le récif soit ouvert et dessiné ; renvoie les créatures présentes (noms de la maquette)
export async function recifOuvert(page, timeout = 30000) {
  await page.waitForFunction(() => window.__app.reef?.open && window.__app.reef.api, null, { timeout });
  await page.waitForTimeout(1500);
  return page.evaluate(() => window.__app.reef.api.vivantes());
}
// touche une créature (nom de la carte) : la vue glisse jusqu'à elle, puis un toucher bref au milieu de son image
export async function toucherCreature(page, id) {
  const m = await page.evaluate((id) => { const N = { "benitier-geant": "benitier", "meduse-criniere": "meduse", "ver-tubicole-geant": "ver-tubicole", "requin-groenland": "requin-du-groenland" }; const k = N[id] ?? id; window.__app.reef.api.aller(k); return k; }, id);
  // (la position n'est connue qu'une fois l'image suivante dessinée : sur une machine lente, plusieurs centaines de ms)
  await page.waitForFunction((k) => window.__app.reef.api.ou(k), m, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(300);
  const pos = await page.evaluate((k) => window.__app.reef.api.ou(k), m);
  if (!pos) throw new Error(`créature introuvable à l'écran : ${id}`);
  const box = await page.locator("canvas.recif-dessin").boundingBox();
  // le point d'ancrage d'une créature posée est son pied : on touche un peu au-dessus
  const x = box.x + pos.x, y = box.y + pos.y - 12;
  const touch = await page.evaluate(() => matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0);
  if (touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
}
// LA BASE DES ARRIVAGES DE LA BOUTIQUE « IL Y A k SEMAINES », COMPTÉE EN SEMAINES D'ÉCOLE (lot « Correctifs des relectures »,
// recette du 30 octobre 2026) : les créatures n'arrivent que le lundi des semaines d'école (session/rewards.js, quotaAt). Une base
// datée de « maintenant moins k semaines » ne donnait, pendant les vacances, aucune arrivée : la vitrine restait vide et les
// parcours de la boutique échouaient selon la date. Ce lundi-là compte k + 1 semaines d'école jusqu'à maintenant (les k d'avant
// et celle en cours), comme une base de k semaines un jour de classe.
import { readFileSync } from "node:fs";
import { schoolWeeks, weekStart } from "../../app/js/session/rewards.js";
const CAL = JSON.parse(readFileSync(new URL("../../app/content/calendrier.json", import.meta.url), "utf8"));
export function ilYaSemaines(k, now = Date.now()) {
  const d = new Date(weekStart(now));
  for (let i = 0; i < 104 && schoolWeeks(CAL, d.getTime(), now) < k + 1; i++) d.setDate(d.getDate() - 7);
  return d.getTime();
}
