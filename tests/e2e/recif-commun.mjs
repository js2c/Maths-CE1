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
