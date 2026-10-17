// LA TAILLE RÉELLE DES CIBLES (lot « Banc Android et recette en conditions réelles », point 5 ; docs/LOTS.md, fiche 13). La scène
// fait 1 280 × 800 et se réduit pour tenir dans l'écran : une cible de 64 px de la scène mesure 11 mm sur la tablette de
// référence, mais environ 5 mm sur un petit smartphone, sous les 9 mm conseillés pour un doigt d'enfant. Pour chaque profil du
// banc (tests/e2e/appareils.mjs) et chaque écran, chaque cible visible (bouton, galet, tuile, touche, réponse, objet de l'étal,
// la tête de la mascotte) est mesurée en millimètres sur l'écran de l'appareil (taille en pixels CSS × mmParPx du profil) ;
// le résultat : tests/e2e/out/cibles/cibles.md et cibles.json. Le parcours échoue si une cible des tablettes mesure moins de
// 9 mm ; sur les smartphones, il ne fait que mesurer (la décision appartient au parent : docs/LOTS.md, fiche 13, point 6).
//   node tests/e2e/cibles.mjs [--profils s5e,tablette-entree,smartphone,petit-smartphone]
import { Appareil, PROFILS, mmParPx, serveurBanc } from "./appareils.mjs";
import { ATTEND } from "./jeu.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const NOMS = arg("--profils", Object.keys(PROFILS).join(",")).split(",");
const OUT = resolve("tests/e2e/out/cibles"); mkdirSync(OUT, { recursive: true });
const MIN_MM = 9;
const serveur = await serveurBanc();
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };

// les cibles visibles, en pixels CSS (l'espace parent à part : il est pour le parent)
const MESURER = () => {
  const vis = (e) => e.isConnected && !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true });
  const sel = "#ui button, .mascotte-tap, .etal-scene .etal-objet, .pa button, .pa-keys [data-key]";
  return [...document.querySelectorAll(sel)].filter(vis).map((e) => { const r = e.getBoundingClientRect(); return { quoi: (e.getAttribute("aria-label") || e.dataset.key || String(e.className)).toString().slice(0, 40), cls: String(e.className).slice(0, 40), w: r.width, h: r.height, parent: !!e.closest(".pa") }; })
    .filter((t) => t.w > 4 && t.h > 4 && t.w < innerWidth * 0.9);
};
const resultats = [];
for (const nom of NOMS) {
  const p = PROFILS[nom], mm = mmParPx(p), a = new Appareil(nom, { serveur, ralenti: false });
  console.log(`\n${nom} (${p.nom}) : ${p.largeur} × ${p.hauteur} px CSS, densité ${p.densite}, ${p.diagonale} pouces : 1 px CSS = ${mm.toFixed(3)} mm`);
  await a.ouvrir(); await a.installer();
  const vue = async (ecran, preparer) => {
    try { await preparer(); } catch (e) { console.log(`     ${ecran} : pas atteint (${e.message.split("\n")[0]})`); return; }
    await a.page.waitForTimeout(1200);
    const l = (await a.page.evaluate(MESURER)).map((t) => ({ ...t, mm: +(Math.min(t.w, t.h) * mm).toFixed(1) }));
    const enfant = l.filter((t) => !t.parent), petites = enfant.filter((t) => t.mm < MIN_MM).sort((x, y) => x.mm - y.mm);
    const r = { profil: nom, ecran, cibles: enfant.length, minMm: enfant.length ? Math.min(...enfant.map((t) => t.mm)) : null, sous9: petites.length, plusPetites: petites.slice(0, 4).map((t) => `${t.quoi} ${t.mm} mm`), parentMin: l.some((t) => t.parent) ? Math.min(...l.filter((t) => t.parent).map((t) => t.mm)) : null };
    resultats.push(r);
    await a.page.screenshot({ path: join(OUT, `${nom}-${ecran.replace(/\W+/g, "-")}.png`) });
    console.log(`     ${ecran} : ${r.cibles} cibles, la plus petite ${r.minMm} mm, ${r.sous9} sous ${MIN_MM} mm${r.parentMin != null ? ` ; espace parent : ${r.parentMin} mm` : ""}`);
  };
  const vis = (s) => a.attendre((s) => [...document.querySelectorAll(s)].some((e) => e.checkVisibility()), 30000, s);
  const exercice = async (choix) => { await a.relancer({ q: `?sansReprise&sansLecon&guides=0&sans=echauffement&cran=conseille&meteo=beau&choix=${choix}` }); await a.deuxTouchers(".galet.play"); await a.attendre(ATTEND, 90000); await a.attendre(() => !window.__app.voice.speaking, 30000).catch(() => {}); };
  await vue("accueil", async () => { await a.relancer({ q: "?sansReprise" }); await vis(".galet.play"); });
  await vue("choisir : les exercices", async () => { await a.deuxTouchers(".galet.choisir"); await vis(".choix-ex"); });
  await vue("choisir : les niveaux", async () => { await a.deuxTouchers('.choix-ex[data-key="ligne"]'); await vis(".choix-tuile"); });
  await vue("les leçons", async () => { await a.relancer({ q: "?sansReprise" }); await a.deuxTouchers(".galet.leconskey"); await vis(".lecons-tuile"); });
  await vue("additions", () => exercice("2:1"));
  await vue("accueil en pause", async () => { await a.toucher(".session-home"); await vis(".keep.play"); });
  await vue("ligne graduée", () => exercice("1:3"));
  await vue("calcul rapide", () => exercice("3:1"));
  await vue("multiplication", () => exercice("5:1"));
  await vue("voiliers", () => exercice("4:1"));
  await vue("étal", () => exercice("6:2"));
  await vue("récif", async () => { await a.relancer({ q: "?sansReprise" }); await a.deuxTouchers(".galet.reefkey"); await vis(".boutique-cle"); });
  await vue("boutique", async () => { await a.toucher(".boutique-cle"); await vis(".boutique-tuile"); });
  await vue("album", async () => { await a.relancer({ q: "?sansReprise" }); await a.deuxTouchers(".galet.albumkey"); await a.attendre(() => window.__app.album?.open, 20000); });
  await vue("espace parent : le code", async () => { await a.relancer({ q: "?sansReprise" }); await a.page.waitForTimeout(1500); await a.toucher(".logo", { ms: 2400 }); await vis(".pa-keys"); });
  // la scène entière, centrée, hors des zones sûres (l'encoche des smartphones, émulée par le banc)
  await a.relancer({ q: "?sansReprise" });
  const place = await a.page.evaluate(() => { const r = document.getElementById("stage").getBoundingClientRect(), d = document.createElement("div"); d.style.cssText = "position:fixed;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)"; document.body.append(d); const c = getComputedStyle(d), z = [c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft].map(parseFloat); d.remove(); return { l: r.left, t: r.top, r: innerWidth - r.right, b: innerHeight - r.bottom, z }; });
  check(place.l >= place.z[3] - 0.5 && place.r >= place.z[1] - 0.5 && place.t >= place.z[0] - 0.5 && place.b >= place.z[2] - 0.5, `${nom} : la scène est entière et hors des zones sûres (marges ${[place.t, place.r, place.b, place.l].map((x) => Math.round(x)).join(", ")} px ; zones sûres ${place.z.join(", ")} px)`);
  if (!p.telephone) for (const r of resultats.filter((r) => r.profil === nom)) check(!r.sous9, `${nom}, ${r.ecran} : toutes les cibles font au moins ${MIN_MM} mm (la plus petite : ${r.minMm} mm${r.sous9 ? ` ; ${r.plusPetites.join(", ")}` : ""})`);
  check(!a.erreurs.length, `${nom} : aucune erreur dans la page${a.erreurs.length ? ` (${a.erreurs[0]})` : ""}`);
  await a.detruire();
}
const md = ["# La taille réelle des cibles, par profil et par écran", "", `Mesurée par tests/e2e/cibles.mjs le ${new Date().toISOString().slice(0, 10)} ; conseillé pour un doigt d'enfant : au moins ${MIN_MM} mm.`, "",
  `| Écran | ${NOMS.join(" | ")} |`, `| --- | ${NOMS.map(() => "---").join(" | ")} |`,
  ...[...new Set(resultats.map((r) => r.ecran))].map((e) => `| ${e} | ${NOMS.map((n) => { const r = resultats.find((x) => x.profil === n && x.ecran === e); return r ? `${r.minMm} mm${r.sous9 ? ` (${r.sous9} sous ${MIN_MM} mm)` : ""}` : "-"; }).join(" | ")} |`),
  "", "Chaque case : la plus petite cible de l'écran, en millimètres sur l'appareil, et le nombre de cibles sous le seuil."];
writeFileSync(join(OUT, "cibles.md"), md.join("\n") + "\n"); writeFileSync(join(OUT, "cibles.json"), JSON.stringify(resultats, null, 1));
await serveur.fermer();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ncibles : mesurées sur chaque profil");
process.exitCode = fail.length ? 1 : 0;
