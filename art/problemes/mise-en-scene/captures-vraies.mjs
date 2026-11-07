// LES 15 ÉCRANS DE LA MAQUETTE, PRIS DANS L'APPLICATION AVEC LES VRAIES IMAGES (lot « Mise en scène des problèmes », fiche 24) : les
// mêmes énoncés et les mêmes moments que la maquette (art/problemes/mise-en-scene/index.html, captures.mjs), joués dans l'application
// (les lieux et les objets générés par le parent, app/assets/problemes/). Dans docs/maquettes/problemes-scene/vraies/ (1280 × 800) et,
// côte à côte avec la capture provisoire de la maquette, dans docs/maquettes/problemes-scene/comparaison/.
//   node art/problemes/mise-en-scene/captures-vraies.mjs
// (voix rapide, sans service worker, son coupé : des captures, pas un contrôle ; les contrôles sont dans tests/e2e/problemes.mjs)
import { chromium } from "../../../tests/e2e/navigateur.mjs";
import { serve } from "../../../tests/serve.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../../..", import.meta.url))), DOC = join(ROOT, "docs/maquettes/problemes-scene");
const OUT = join(DOC, "vraies"), CMP = join(DOC, "comparaison");
mkdirSync(OUT, { recursive: true }); mkdirSync(CMP, { recursive: true });
const BANQUE = JSON.parse(readFileSync(join(ROOT, "app/content/problemes.json"), "utf8")).enonces, E = (id) => BANQUE.find((e) => e.id === id);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const erreurs = [];

async function ouvrir(id, cran = "conseille") {
  const e = E(id), context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage();
  page.on("pageerror", (x) => erreurs.push(`${id} : ${x.message}`));
  await page.goto(`${url}?nosw&voix=rapide&son=non&choix=7:${e.niveau}&cran=${cran}&sans=echauffement&sansLecon&questions=2&enonce=${id}`);
  await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await page.tap(".play", { force: true });
  return { page, context, e };
}
const prob = (page) => page.waitForFunction(() => { const s = window.__app.facts; return s?.q?.module === 7 && window.__app.prob?.L; }, null, { timeout: 60000 });
const dit = (page, t) => page.waitForFunction((t) => window.__said.includes(t), t, { timeout: 60000 });
const question = (page) => page.waitForFunction(() => { const s = window.__app.facts; return s?.q?.module === 7 && s.resolve && !s.locked && /\?$|réécouter/.test(window.__said.at(-1) ?? ""); }, null, { timeout: 60000 });
const taper = async (page, n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(160); } await page.tap('.key[data-key="valider"]', { force: true }); };
const correction = (page) => page.waitForFunction(() => window.__app.prob.montre, null, { timeout: 30000 });
const ECRANS = ["reunion-question", "reunion-facile", "reunion-correction", "transformation-histoire", "transformation-question", "transformation-correction", "comparaison-question", "comparaison-aide", "groupes-histoire", "groupes-question", "groupes-bonds", "groupes-correction", "partage-histoire", "partage-manipule", "partage-question"];
const prendre = async (page, nom) => { const f = `${String(ECRANS.indexOf(nom) + 1).padStart(2, "0")}-${nom}.png`; await page.waitForTimeout(500); await page.screenshot({ path: join(OUT, f) }); console.log(`  vraies/${f}`); };

// la réunion : la question, le cran « plus facile », la correction
{ const { page, context, e } = await ouvrir("reu-t-07"); await question(page); await prendre(page, "reunion-question");
  await taper(page, e.reponse + 1); await correction(page); await prendre(page, "reunion-correction"); await context.close(); }
{ const { page, context } = await ouvrir("reu-t-07", "facile"); await question(page); await prendre(page, "reunion-facile"); await context.close(); }
// la transformation : l'histoire (la deuxième phrase), la question, la correction
{ const { page, context, e } = await ouvrir("tra-pf-13"); await prob(page); await dit(page, e.enonce[1]); await page.waitForTimeout(300); await prendre(page, "transformation-histoire");
  await question(page); await prendre(page, "transformation-question"); await taper(page, e.reponse + 1); await correction(page); await prendre(page, "transformation-correction"); await context.close(); }
// la comparaison : la question, l'aide (les étiquettes aux couleurs du schéma)
{ const { page, context, e } = await ouvrir("cmp-g-04"); await question(page); await prendre(page, "comparaison-question");
  await taper(page, e.reponse - 10); await page.waitForFunction(() => window.__app.prob.teintes, null, { timeout: 30000 }); await prendre(page, "comparaison-aide"); await context.close(); }
// les groupes égaux : l'histoire, la question, l'aide par bonds, la correction
{ const { page, context, e } = await ouvrir("grp-07"); await prob(page); await dit(page, e.enonce[1]); await page.waitForTimeout(300); await prendre(page, "groupes-histoire");
  await question(page); await prendre(page, "groupes-question");
  await page.tap(".help", { force: true }); await page.waitForFunction(() => window.__app.prob.litCopies?.size >= 2, null, { timeout: 30000 }); await prendre(page, "groupes-bonds");
  await page.waitForFunction(() => !window.__app.prob.aideVisible, null, { timeout: 30000 }).catch(() => {}); await question(page);
  await taper(page, e.reponse / 2); await correction(page); await prendre(page, "groupes-correction"); await context.close(); }
// le partage (niveau 3) : l'histoire, le partage manipulé (3 crayons rangés), la question (tout rangé)
{ const { page, context, e } = await ouvrir("par-v-03"); await prob(page); await dit(page, e.enonce[1]); await page.waitForTimeout(300); await prendre(page, "partage-histoire");
  await page.waitForFunction(() => window.__app.prob.cibles, null, { timeout: 60000 }); await page.waitForTimeout(500);
  const glisser = async (i) => { const b = (await page.$$(".probleme-objet"))[0], c = await page.evaluate((i) => window.__app.prob.cibles[i], i), box = await b.boundingBox(), k = await page.evaluate(() => window.__app.stage.k), r = await page.evaluate(() => { const x = window.__app.stage.ui.getBoundingClientRect(); return [x.left, x.top]; });
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(r[0] + ((c[0] + c[2]) / 2) * k, r[1] + ((c[1] + c[3]) / 2) * k, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(250); };
  for (const i of [0, 1, 2]) await glisser(i);
  await prendre(page, "partage-manipule");
  for (const i of [0, 1, 2, 0, 1, 2, 0, 1, 2]) await glisser(i);
  await question(page); await prendre(page, "partage-question"); await context.close(); }

await browser.close(); srv.close();
// côte à côte : la maquette (provisoire) à gauche, l'application (les vraies images) à droite
execFileSync("python3", ["-c", `
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont
doc, out, cmp = sys.argv[1:4]
try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
except Exception: f = ImageFont.load_default()
for p in sorted(glob.glob(out + '/*.png')):
    n = os.path.basename(p); a = os.path.join(doc, n)
    if not os.path.exists(a): continue
    A = Image.open(a).convert('RGB').resize((640, 400), Image.LANCZOS); B = Image.open(p).convert('RGB').resize((640, 400), Image.LANCZOS)
    S = Image.new('RGB', (1288, 430), (255, 255, 255)); S.paste(A, (0, 30)); S.paste(B, (648, 30)); d = ImageDraw.Draw(S)
    d.text((6, 5), 'maquette (images provisoires)', fill=(90, 90, 90), font=f); d.text((654, 5), "application (vraies images)", fill=(0, 0, 0), font=f)
    S.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(os.path.join(cmp, n), optimize=True)
for p in glob.glob(out + '/*.png'):
    Image.open(p).convert('RGB').quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(p, optimize=True)
`, DOC, OUT, CMP]);
console.log(erreurs.length ? `erreurs de page :\n${erreurs.join("\n")}` : "aucune erreur de page");
process.exit(erreurs.length ? 1 : 0);
