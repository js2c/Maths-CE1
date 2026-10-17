// LE PARCOURS DU LOT « Banc Android et recette en conditions réelles » (docs/LOTS.md, fiche 13) : chaque situation nouvelle
// pour l'enfant et pour le parent, avec ses captures (tests/e2e/out/banc-android/), sur le banc Android (appareils.mjs) :
//   1. « tourne ton téléphone » : la page ouverte en portrait dans un onglet (smartphone, petit smartphone, et la tablette de
//      référence tenue droite) : un écran clair, un dessin, pas de texte, rien de la scène ; remise en paysage, l'application est
//      là (un seul rechargement si elle a été ouverte en portrait ; aucun si elle a été tournée puis remise en paysage) ;
//   2. l'encoche d'un smartphone (zones sûres émulées) : la scène entière et centrée, rien sous l'encoche ;
//   3. le stockage plein : l'avis en haut de chaque onglet de l'espace parent (1 280 × 800 et 1 920 × 1 200) ;
//   4. le journal technique : la ligne « état de la page » écrite avec les mesures des budgets (le même code que le banc).
//   node tests/e2e/banc-android.mjs [--seul 1,2,3,4]
import { Appareil, PROFILS, serveurBanc } from "./appareils.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const SEUL = arg("--seul")?.split(","), faire = (n) => !SEUL || SEUL.includes(String(n));
const OUT = resolve("tests/e2e/out/banc-android"); mkdirSync(OUT, { recursive: true });
const serveur = await serveurBanc();
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const erreurs = [];

// la part de pixels peints (non transparents) d'un canvas de l'écran « tourner »
const peint = (page, sel) => page.evaluate((s) => { const c = document.querySelector(s); if (!c?.width) return 0; const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 16) if (d[i] > 200) n++; return n / (d.length / 16); }, sel);
const etatTourner = (page) => page.evaluate(() => { const t = document.getElementById("tourner"), r = t?.getBoundingClientRect(); return { visible: !!t && getComputedStyle(t).display !== "none", couvre: !!r && r.width >= innerWidth && r.height >= innerHeight, texte: (t?.innerText ?? "").trim(), w: innerWidth, h: innerHeight }; });

if (faire(1)) for (const nom of ["smartphone", "petit-smartphone", "s5e"]) {
  // ouverte en portrait, dans un onglet (avant l'installation)
  const a = new Appareil(nom, { serveur, portrait: true, ralenti: false });
  await a.ouvrir({ toucher: false });
  await a.page.waitForTimeout(1500);
  const e = await etatTourner(a.page), f = await peint(a.page, ".tourner-fleche"), t = await peint(a.page, ".tourner-tel");
  await a.page.screenshot({ path: join(OUT, `1-tourner-${nom}-portrait.png`) });
  check(e.visible && e.couvre && !e.texte && f > 0.03 && t > 0.2, `${nom} en portrait (${e.w} × ${e.h}) : « tourne ton téléphone » couvre tout l'écran, sans texte, ses deux dessins peints (flèche ${(f * 100).toFixed(0)} %, téléphone ${(t * 100).toFixed(0)} % de pixels)`);
  // le téléphone pivote (une capture un peu plus tard : un autre angle)
  await a.page.waitForTimeout(1300); await a.page.screenshot({ path: join(OUT, `1-tourner-${nom}-portrait-pivote.png`) });
  const angle = await a.page.evaluate(() => getComputedStyle(document.querySelector(".tourner-pivot")).transform);
  check(angle !== "none", `${nom} : le téléphone pivote (${angle})`);
  // remis en paysage : l'application (rechargée une fois, à la bonne échelle)
  const p = PROFILS[nom];
  await a.page.setViewportSize({ width: p.largeur, height: p.hauteur });
  await a.page.waitForFunction(() => document.querySelector(".demarrage.pret, .galet") && getComputedStyle(document.getElementById("tourner")).display === "none", null, { timeout: 60000 }).catch(() => {});
  await a.page.waitForTimeout(800);
  const e2 = await etatTourner(a.page);
  await a.page.screenshot({ path: join(OUT, `1-tourner-${nom}-paysage.png`) });
  check(!e2.visible, `${nom} remis en paysage : l'écran « tourner » s'efface, l'application est là`);
  // tournée de nouveau en portrait puis remise en paysage : plus aucun rechargement
  if (await a.page.evaluate(() => !!document.querySelector(".demarrage.pret"))) { await a.toucher(".demarrage.pret"); await a.attendre(() => window.__ready !== undefined, 60000); }
  await a.page.evaluate(() => { window.__marque = 1; });
  await a.page.setViewportSize({ width: p.hauteur, height: p.largeur }); await a.page.waitForTimeout(1200);
  await a.page.setViewportSize({ width: p.largeur, height: p.hauteur }); await a.page.waitForTimeout(1500);
  check(await a.page.evaluate(() => window.__marque === 1).catch(() => false), `${nom} : tourné en portrait puis remis en paysage, la page ne se recharge pas (rien n'est perdu)`);
  erreurs.push(...a.erreurs); await a.detruire();
}

if (faire(2)) {
  // l'encoche (zone sûre de 32 px à gauche, émulée par le banc) : la scène centrée dans le reste
  const a = new Appareil("smartphone", { serveur, ralenti: false });
  await a.ouvrir(); await a.page.waitForTimeout(1500);
  const r = await a.page.evaluate(() => { const b = document.getElementById("stage").getBoundingClientRect(); return { l: b.left, r: innerWidth - b.right, t: b.top, b: innerHeight - b.bottom, w: b.width, h: b.height }; });
  await a.page.screenshot({ path: join(OUT, "2-encoche-smartphone.png") });
  check(r.l >= 32 && Math.abs(r.t) < 1 && Math.abs(r.b) < 1 && Math.abs(r.w / r.h - 1.6) < 0.01, `smartphone avec encoche : la scène entière (${Math.round(r.w)} × ${Math.round(r.h)}), à ${Math.round(r.l)} px du bord gauche (encoche 32 px), à ${Math.round(r.r)} px du bord droit`);
  erreurs.push(...a.erreurs); await a.detruire();
}

if (faire(3) || faire(4)) for (const [w, h] of [[1280, 800], [1920, 1200]]) {
  // le stockage plein (60 Mo pour une application de 135 Mo) : l'avis dans l'espace parent
  const a = new Appareil("tablette-entree", { serveur, ralenti: false, quota: faire(3) ? 60e6 : null }); // (1 280 × 800, densité 1,5)
  await a.ouvrir();
  // (une autre taille d'écran : la page se recharge à la bonne échelle, et l'écran de démarrage attend son toucher)
  if (w !== 1280) { await a.page.setViewportSize({ width: w, height: h }); await a.page.waitForTimeout(1500); await a.attendre(() => document.querySelector(".demarrage.pret") || window.__ready !== undefined, 60000); if (await a.page.evaluate(() => !!document.querySelector(".demarrage.pret"))) { await a.toucher(".demarrage.pret"); await a.attendre(() => window.__ready !== undefined, 60000); } }
  if (faire(3)) await a.attendre(() => window.__journalTechnique, 5000).catch(() => {});
  // (l'état de la page est écrit toutes les 10 minutes : il est écrit ici tout de suite, par le même code)
  await a.page.evaluate(async () => { const { noter } = await import("./js/engine/journal.js"); await noter("état", "état de la page", window.__etatPage()); });
  for (let i = 0; i < 60 && faire(3); i++) { const j = await a.journalTechnique(); if (j.some((e) => e.message === "stockage plein")) break; await a.page.waitForTimeout(1000); }
  await a.page.waitForTimeout(1500);
  await a.toucher(".logo", { ms: 2400 });
  await a.attendre(() => document.querySelector(".pa-keys"), 10000);
  for (const c of ["2468", "2468"]) { for (const d of c) { await a.toucher(`.pa-keys [data-key="${d}"]`); await a.page.waitForTimeout(200); } await a.page.waitForTimeout(400); }
  await a.attendre(() => document.querySelector(".pa-sheet"), 15000);
  await a.page.waitForTimeout(800);
  if (faire(3)) {
    const avis = await a.page.evaluate(() => document.querySelector(".pa-stockage")?.innerText ?? null);
    await a.page.screenshot({ path: join(OUT, `3-stockage-plein-${w}.png`) });
    check(!!avis && /Plus assez de place/.test(avis) && /Wi-Fi/.test(avis), `${w} × ${h} : l'espace parent dit que la tablette manque de place (« ${avis?.slice(0, 90)}… »)`);
  }
  if (faire(4) && w === 1280) {
    await a.toucher('[data-tab="donnees"]'); await a.page.waitForTimeout(800);
    await a.page.evaluate(() => [...document.querySelectorAll("h2, h3, summary, .pa-row")].find((e) => /Journal technique/.test(e.textContent))?.scrollIntoView());
    await a.page.waitForTimeout(500);
    const ligne = await a.page.evaluate(() => [...document.querySelectorAll("li, p, div")].map((e) => e.textContent).find((t) => /état de la page \(/.test(t) && t.length < 400) ?? null);
    await a.page.screenshot({ path: join(OUT, "4-journal-etat-de-la-page.png") });
    check(!!ligne && /zones de dessin/.test(ligne) && /images en mémoire/.test(ligne), `journal technique : la ligne « état de la page » donne les mesures des budgets (${ligne?.replace(/\s+/g, " ").slice(0, 200)})`);
  }
  erreurs.push(...a.erreurs); await a.detruire();
}

check(!erreurs.length, `aucune erreur dans les pages${erreurs.length ? ` (${erreurs.slice(0, 2).join(" | ")})` : ""}`);
await serveur.fermer();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nbanc Android : chaque situation nouvelle du lot est en place");
process.exitCode = fail.length ? 1 : 0;
