// CAPTURES de la maquette de la boutique, ouverte comme sur la tablette (fichier local, toucher), à 1138 × 711 en densité
// 2,25 (la tablette) et à 1280 × 800 : récif, boutique (premier toucher, pas assez d'étoiles, vœu, achat, brillante),
// mode libre, fin de séance (jauge du vœu, arrivage, ouverture d'une zone), espace parent. Relève les erreurs de la page.
//   node art/boutique/outils/captures.mjs [--out dossier] [--seul tablette|1280]
import { mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "../../node_modules/playwright-core/index.mjs";

const ICI = join(dirname(fileURLToPath(import.meta.url)), ".."), args = process.argv.slice(2);
const OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : join(ICI, "captures")); mkdirSync(OUT, { recursive: true });
const seul = args.includes("--seul") ? args[args.indexOf("--seul") + 1] : null;
const URL0 = pathToFileURL(join(ICI, "index.html")).href;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const erreurs = [];

async function parcours(nom, viewport, dpr) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, hasTouch: true, isMobile: true }), page = await ctx.newPage();
  page.on("pageerror", (e) => erreurs.push(`${nom} : ${e.message}`)); page.on("console", (m) => { if (m.type() === "error") erreurs.push(`${nom} : ${m.text()}`); });
  const k = Math.min(viewport.width / 1280, viewport.height / 800), ox = (viewport.width - 1280 * k) / 2, oy = (viewport.height - 800 * k) / 2;
  const tap = async (x, y, att = 450) => { await page.touchscreen.tap(ox + x * k, oy + y * k); await page.waitForTimeout(att); };
  const tapSel = async (sel, att = 450) => { const b = await page.locator(sel).first().boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(att); };
  const shot = (f) => page.screenshot({ path: join(OUT, `${nom}-${f}.png`) });
  const etat = (s) => page.evaluate((s) => { localStorage.setItem("maths-ce1-maquette-boutique-1", JSON.stringify(s)); }, s);
  const octobre = { mode: "A", prix: "propose", owned: { "poisson-clown": { b: false }, "etoile-de-mer": { b: false }, crabe: { b: true }, crevette: { b: false } }, etoiles: 58, arrivees: 6, zones: ["lagon"], dorees: 0, nouveautes: [], arrivee: null };

  await page.goto(URL0); await page.evaluate(() => localStorage.clear());
  await etat(octobre); await page.goto(URL0); await page.waitForTimeout(1500);
  await shot("01-recif");
  await tapSel("#r-boutique", 900); await page.waitForTimeout(2600); await shot("02-boutique-consigne");
  await page.waitForTimeout(5000);
  // premier toucher : le bernard-l'ermite (arrivé, 40 étoiles, elle en a 58) : la croix et la coche apparaissent
  await tapSel('.vt[data-id="bernard-l-ermite"]', 5200); await shot("03-premier-toucher");
  // l'hippocampe (100) : il manque 42 étoiles, ni coche ni croix
  await tapSel('.vt[data-id="hippocampe"]', 6000); await shot("04-il-manque");
  // un second toucher sur la tuile n'achète rien ; la croix annule
  await tapSel('.vt[data-id="bernard-l-ermite"]', 1500); await tapSel('.vt[data-id="bernard-l-ermite"]', 1200);
  await tapSel("#annuler", 900); await shot("05-annule");
  // l'achat du bernard-l'ermite : sélection, puis la coche ; les étoiles volent, la créature sort et grandit
  await tapSel('.vt[data-id="bernard-l-ermite"]', 2500); await tapSel("#acheter", 500); await shot("06-achat-etoiles");
  await page.waitForTimeout(1600); await shot("07-achat-creature");
  await page.waitForTimeout(4500); await shot("08-apres-achat");
  // la crevette, déjà là : la faire briller (150 : pas assez)
  await tapSel('.vt[data-id="crevette"]', 7800); await shot("09-faire-briller");
  // retour au récif : le bernard-l'ermite arrive à la nage
  await tapSel("#b-retour", 1800); await shot("10-recif-arrivee"); await page.waitForTimeout(3000); await shot("11-recif-apres");
  // mode libre, février : lagon et récif de corail complets, grand large ouvert
  await page.goto(URL0 + "?ecran=boutique"); await page.waitForTimeout(800);
  await page.evaluate(() => { document.querySelector('[data-pre="fevrier"]').click(); document.querySelector('input[name=mode][value=B]').click(); document.querySelector("#p-fermer").click(); });
  await page.waitForTimeout(3000); await shot("12-libre-fevrier");
  await page.waitForTimeout(3500);
  await tapSel('.vt[data-id="raie-manta"]', 6000); await shot("13-libre-rare");
  await tapSel('.vt[data-id="grand-requin-blanc"]', 5500); await shot("14-legendaire");
  await tapSel('.onglet[aria-label="abysses"]', 5800); await shot("15-zone-fermee");
  // la fin de séance : le bilan, puis l'invitation à la boutique
  await page.evaluate(() => document.querySelector("#p-seance").click()); await page.waitForTimeout(5200); await shot("16-fin-bilan");
  // octobre, mode arrivages : deux séances (un lundi)
  await etat({ ...octobre, etoiles: 40 }); await page.goto(URL0 + "?ecran=recif"); await page.waitForTimeout(800);
  await page.evaluate(() => { window.__maquette.S.seances = 1; document.querySelector("#p-seance").click(); }); await page.waitForTimeout(5400); await shot("17-fin-arrivage");
  // zone finie : le lagon complet, fin de séance : le coquillage ouvre le récif de corail et offre son premier habitant
  await etat({ ...octobre, mode: "B", owned: Object.fromEntries(["poisson-clown", "etoile-de-mer", "crabe", "crevette", "bernard-l-ermite", "moule", "oursin", "anemone", "concombre-de-mer", "coquille-saint-jacques", "poisson-chirurgien", "hippocampe", "poisson-ballon", "limace-de-mer", "raie-pastenague"].map((id) => [id, { b: false }])), etoiles: 30 });
  await page.goto(URL0 + "?ecran=recif"); await page.waitForTimeout(800); await shot("18-recif-lagon-complet");
  await page.evaluate(() => document.querySelector("#p-seance").click()); await page.waitForTimeout(8600); await shot("19-fin-zone-coquillage");
  await page.waitForTimeout(6000);
  // une légendaire : le grand large fini, une étoile de platine : le coquillage de platine
  await etat({ ...octobre, mode: "B", zones: ["lagon", "corail", "large"], dorees: 1, etoiles: 10, owned: Object.fromEntries(["lagon", "corail", "large"].flatMap((z) => (z === "large" ? ["dauphin", "poisson-volant", "thon-rouge", "espadon", "meduse-criniere", "tortue-luth", "poisson-lune", "otarie", "requin-bleu", "requin-marteau", "requin-baleine", "raie-manta", "baleine-a-bosse"] : [])).map((id) => [id, { b: false }])) });
  await page.goto(URL0 + "?ecran=recif"); await page.waitForTimeout(800);
  await page.evaluate(() => document.querySelector("#p-seance").click()); await page.waitForTimeout(8000); await shot("20-fin-zone-abysses");
  await page.waitForTimeout(9500); await shot("21-fin-legendaire-platine");
  await page.waitForTimeout(7000);
  // l'espace parent
  await page.evaluate(() => window.__maquette.ouvrirParent()); await page.waitForTimeout(400); await shot("22-parent");
  await ctx.close();
}
if (seul !== "1280") await parcours("tablette", { width: 1138, height: 711 }, 2.25);
if (seul !== "tablette") await parcours("1280", { width: 1280, height: 800 }, 1);
await browser.close();
console.log(erreurs.length ? `ERREURS :\n${erreurs.join("\n")}` : "aucune erreur dans la page");
console.log(`captures : ${OUT}`);
