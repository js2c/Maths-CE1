// LA VOIX FABRIQUÉE À L'AVANCE, jouée pour de vrai dans Chromium (sans voix accélérée) : les fichiers se
// décodent, l'événement `ended` arrive (la phrase ne finit pas sur le délai de secours), la durée jouée
// correspond à l'index, un texte de plusieurs phrases enchaîne ses fichiers, « réécouter » rejoue le
// fichier, et un texte sans fichier passe par la synthèse. Échantillon : 40 phrases tirées de l'index.
//   node tests/e2e/voix.mjs
import { chromium, voixPermise } from "./navigateur.mjs";
import { readFileSync } from "node:fs";
import { serve } from "../serve.mjs";

const index = JSON.parse(readFileSync(new URL("../../app/assets/voix/index.json", import.meta.url))).phrases;
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true })).newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);

// 1. chaque fichier de l'échantillon se décode et dure ce que dit l'index
const keys = Object.keys(index), sample = Array.from({ length: 40 }, (_, i) => keys[Math.floor((i * keys.length) / 40)]);
const decoded = await page.evaluate(async (files) => {
  const ctx = new OfflineAudioContext(1, 48000, 48000), out = [];
  for (const f of files) { try { const b = await ctx.decodeAudioData(await (await fetch(`assets/voix/${f}`)).arrayBuffer()); out.push(Math.round(b.duration * 1000)); } catch (e) { out.push(-1); } }
  return out;
}, sample.map((k) => index[k][0]));
const bad = sample.filter((k, i) => decoded[i] < 0 || Math.abs(decoded[i] - index[k][1]) > 120);
check(bad.length === 0, `40 fichiers décodés, durée conforme à l'index à 120 ms près${bad.length ? ` ; en défaut : ${bad.join(" | ")}` : ""}`);

// 2. lecture réelle : `ended` arrive, et le temps de lecture suit la durée des fichiers
const run = (text) => page.evaluate(async (t) => { const v = window.__app.voice, t0 = performance.now(), n0 = v.files; await v.say(t, { instruction: true }); return { ms: Math.round(performance.now() - t0), files: v.files - n0, misses: [...v.misses] }; }, text);
for (const t of ["Place le poisson sur le nombre 37.", "0 plus 6 ?", "Bravo ! Ce soir, tu as gagné 12 étoiles de mer."]) {
  const r = await run(t), attendu = t.split(/(?<=[.!?])\s+/).reduce((s, p) => s + index[p][1], 0);
  check(r.misses.length === 0 && r.files >= 1 && r.ms >= attendu - 100 && r.ms < attendu + 1000, `« ${t} » : ${r.files} fichier(s) joué(s) en ${r.ms} ms (durée des fichiers : ${attendu} ms)`);
}
// 3. « réécouter » rejoue le fichier de la dernière consigne
const re = await page.evaluate(async () => { const v = window.__app.voice, n0 = v.files; await v.replay(); return { files: v.files - n0, listens: v.listens }; });
check(re.files === 2 && re.listens === 2, `« réécouter » rejoue les fichiers de la consigne (${JSON.stringify(re)})`);
// 4. un texte sans fichier (nom tapé par le parent) : synthèse du navigateur, phrase notée (volontairement absente : permise)
voixPermise(/^C.est moi, Zoé\.$/);
const miss = await run("C'est moi, Zoé.");
check(miss.files === 0 && miss.misses.includes("C'est moi, Zoé."), "un texte sans fichier passe par la synthèse et est noté");
// 5. « stop » coupe un fichier en cours et libère aussitôt
const cut = await page.evaluate(async () => { const v = window.__app.voice, t0 = performance.now(), p = v.say("Chez l'hippocampe, c'est le papa qui porte les bébés, dans une poche sur son ventre."); await new Promise((r) => setTimeout(r, 300)); v.stop(); await p; return Math.round(performance.now() - t0); });
check(cut < 600, `« stop » coupe la phrase en cours (${cut} ms)`);
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
