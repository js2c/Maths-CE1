// VIDÉO D'UNE SÉANCE : accueil, salut de la mascotte, questions (une juste, une fausse, une juste).
// Les images viennent du flux d'écran de Chromium (CDP Page.startScreencast), assemblées en MP4 à
// 30 images/s avec leurs vrais horodatages. Processeur non ralenti : on montre le rendu, les mesures
// sont faites par perf.mjs.   FFMPEG=/chemin/ffmpeg node tests/e2e/video.mjs [--out fichier.mp4]
import { chromium } from "./navigateur.mjs";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args[args.indexOf("--out") + 1] && args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/seance.mp4");
const TMP = resolve("tests/e2e/out/frames"); rmSync(TMP, { recursive: true, force: true }); mkdirSync(TMP, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
const page = await ctx.newPage(), cdp = await ctx.newCDPSession(page);
const frames = [];
cdp.on("Page.screencastFrame", async (f) => { frames.push({ t: f.metadata.timestamp, data: f.data }); await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
await page.goto(url + "?sans=echauffement"); await page.waitForFunction(() => window.__ready !== undefined); await page.waitForTimeout(800);
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1280, maxHeight: 800, everyNthFrame: 1 });
await page.waitForTimeout(2500);
await page.tap(".play", { force: true });
const next = () => page.waitForFunction(() => document.querySelectorAll(".answer").length && !window.__app.screen?.locked, null, { timeout: 30000 });
const answer = async (right) => { const v = await page.evaluate((r) => { const q = window.__app.screen.q; return r ? q.answer : q.choices.find((c) => c.value !== q.answer).value; }, right); await page.tap(`.answer[data-value="${v}"]`, { force: true }); };
for (const right of [true, false, true]) { await next(); await page.waitForTimeout(3200); await answer(right); await page.waitForTimeout(right ? 2600 : 4200); }
await next(); await page.waitForTimeout(2500);
await cdp.send("Page.stopScreencast");
await browser.close(); srv.close();
// assemblage : chaque image dure jusqu'à la suivante
const list = frames.map((f, i) => { const file = join(TMP, `${String(i).padStart(5, "0")}.jpg`); writeFileSync(file, Buffer.from(f.data, "base64")); const d = i + 1 < frames.length ? frames[i + 1].t - f.t : 1 / 30; return `file '${file}'\nduration ${Math.max(0.001, d).toFixed(4)}`; });
writeFileSync(join(TMP, "list.txt"), list.join("\n") + `\nfile '${join(TMP, `${String(frames.length - 1).padStart(5, "0")}.jpg`)}'\n`);
execFileSync(process.env.FFMPEG ?? "ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", join(TMP, "list.txt"), "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "20", "-preset", "slow", "-movflags", "+faststart", OUT]);
console.log(`${frames.length} images en ${(frames.at(-1).t - frames[0].t).toFixed(1)} s -> ${OUT}`);
rmSync(TMP, { recursive: true, force: true });
