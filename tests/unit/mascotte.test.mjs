// LOT « MASCOTTE » (docs/SPEC.md, section 11 ; docs/LOTS.md, lot 1) : le capitaine en vidéo remplace la pieuvre.
//  - le moteur de l'application est celui de la maquette validée (art/mascotte/mascotte-moteur.js) : mêmes tables ;
//  - la bulle : sa forme (celle de la maquette des voiliers), ses mots, sa place qui évite ce que l'enfant touche ;
//  - la voix prévient la mascotte : un texte commence (avec sa durée), il s'arrête (fini, coupé, mis en pause) ;
//  - la flèche : où elle se pose (jamais sur la réponse), son arrivée ;
//  - le contenu : pas de nom, la bienvenue, la relance ; la pieuvre a disparu de l'application.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { BAL_K, balloonPath, BOUCHE, choisirPlace, largeurMax, MASCOTTE, mots, ovale, PLACES, poser } from "../../app/js/engine/bulle.js";
import { arrivee, ARRIVEE } from "../../app/js/engine/fleche.js";
import { Voice } from "../../app/js/engine/voice.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const app = read("app/js/engine/mascotte.js"), maquette = read("art/mascotte/mascotte-moteur.js");

// une déclaration `const NOM = …;` (sur une ou plusieurs lignes), évaluée
const table = (src, nom) => {
  const m = new RegExp(`(const |, )${nom} =`).exec(src); assert.ok(m, `${nom} introuvable`); const i = m.index;
  let j = src.indexOf("=", i) + 1, depth = 0;
  for (let k = j; k < src.length; k++) { const c = src[k]; if ("{[(".includes(c)) depth++; else if ("}])".includes(c)) depth--; else if ((c === ";" || c === ",") && depth === 0) return new Function(`return (${src.slice(j, k)});`)(); }
  throw new Error(nom);
};

test("le moteur est celui de la maquette : mêmes clips, raccords, ambiances, règles de tirage et délais", () => {
  for (const nom of ["CLIPS", "FADE", "AMBIANCES", "ECART_MIN", "RELANCE", "PETITES_REUSSITES", "MIN_REACTION", "RELANCE_GESTE", "RELANCE_PHRASE"]) assert.deepEqual(table(app, nom), table(maquette, nom), nom);
  assert.deepEqual([...table(app, "CALMES")], [...table(maquette, "CALMES")]);
  // les 17 clips, et un fichier WebM pour chacun dans l'application (le Chromium des tests ne lit pas le H.264)
  const clips = Object.keys(table(app, "CLIPS"));
  assert.equal(clips.length, 17);
  for (const k of clips) assert.ok(existsSync(new URL(`../../app/assets/mascotte/${k}.webm`, import.meta.url)), k);
  assert.deepEqual(readdirSync(new URL("../../app/assets/mascotte/", import.meta.url)).sort(), clips.map((k) => `${k}.webm`).sort());
  // les mêmes entrées de la parole, le même détourage du fond vert, les mêmes règles de choix (texte identique)
  const norm = (s) => s.replace(/"/g, "'").replace(/\s+/g, " ");
  for (const bout of ["ENTREES: { 'talk-a': [0, 1.9, 2.5, 4.35, 5.0, 5.8], 'talk-b': [0] }", "float al = 1. - smoothstep(.098, .275, c.g - m);", "const clip = reste > 7.4 && this.dernierTalk !== 'talk-b' ? 'talk-b' : 'talk-a';",
    "const fort = opts.fort || this.erreurs > 0 || this.serie % 3 === 0;", "clip = this.erreurs === 1 ? 'wrong' : 'encourage';", "if (this.gesteAvant) { const calmes = c.filter(([k]) => CALMES.has(k)); if (calmes.length) c = calmes; }",
    "if (q.forceAfter != null && now() - q.t >= q.forceAfter && this.prochainRaccord(info, t, q.doux) - t > 0.45) return this.start(q, 'force');"]) {
    assert.ok(norm(maquette).includes(norm(bout)), `maquette : ${bout}`); assert.ok(norm(app).includes(norm(bout)), `application : ${bout}`);
  }
  // le poids des vidéos (le cache hors ligne) : environ 7,5 Mo
  const poids = clips.reduce((s, k) => s + statSync(new URL(`../../app/assets/mascotte/${k}.webm`, import.meta.url)).size, 0);
  assert.ok(poids < 9e6, `${(poids / 1e6).toFixed(1)} Mo`);
});

test("les raccords nouveaux : mode accéléré, pause, cachée, allègement, journal", () => {
  assert.match(app, /const fini = \(p\) => \(rapide \? Promise\.resolve\(\) : p\)/);
  assert.match(app, /M\.suspendre = /); assert.match(app, /M\.afficher = /);
  assert.match(app, /if \(suspendue \|\| !visible\) return;/);
  assert.match(app, /niveau\(\) >= 2 && performance\.now\(\) - lastUp < 80/);
  assert.match(app, /const EXT = "webm"/);
});

test("la bulle : la forme de la maquette des voiliers, un ovale qui contient le texte, la pointe vers la bouche", () => {
  const voiliers = read("art/voiliers/index.html");
  assert.match(voiliers, /const BAL_N=2\.7,BAL_K=Math\.pow\(2,1\/BAL_N\)/);
  assert.match(voiliers, /const a=w\/2\*BAL_K\+8,b=h\/2\*BAL_K\+6/);
  assert.equal(BAL_K, Math.pow(2, 1 / 2.7));
  const { a, b } = ovale(400, 80); assert.equal(a, 200 * BAL_K + 8); assert.equal(b, 40 * BAL_K + 6);
  const d = balloonPath(600, 200, a, b, 3, BOUCHE), fin = d.match(/Q[\d.\- ]+?Q/)[0];
  assert.ok(d.startsWith("M") && d.endsWith("Z"));
  assert.ok(fin.includes(`${BOUCHE[0].toFixed(1)} ${BOUCHE[1].toFixed(1)}`), "la pointe arrive à la bouche");
  // la bouche : devant la joue droite de la tête, à 71,5 % de sa hauteur
  assert.ok(BOUCHE[0] > MASCOTTE.x + MASCOTTE.w * 0.8 && BOUCHE[0] < MASCOTTE.x + MASCOTTE.w + 20);
  assert.equal(BOUCHE[1], MASCOTTE.y + MASCOTTE.h * 0.715);
});

test("la bulle : les mots, les nombres à part (en rouge), la typographie française", () => {
  assert.deepEqual(mots("Place le nombre 47 !").map((m) => m.map((p) => p.t).join("|")), ["Place", "le", "nombre", "47|\u00a0!"]); // (l'espace avant « ! » devient insécable)
  const n = mots("12 plus 7 ?"); assert.equal(n[0][0].nombre, true); assert.equal(n[1][0].nombre, false);
  assert.deepEqual(mots("Combien font 3+4 ?")[2].map((p) => [p.t, p.nombre]), [["3", true], ["+", false], ["4", true], ["\u00a0?", false]]);
});

test("la bulle ne couvre jamais ce que l'enfant touche : elle change de place, plus étroite, ou sous la tête", () => {
  const texte = (maxW) => [Math.min(maxW, 760), maxW >= 760 ? 40 : maxW >= 500 ? 80 : 120]; // un texte de 760 px sur une ligne
  // rien à éviter : à droite de la tête, au-dessus de la ligne graduée, l'ovale entier dans la scène
  const libre = choisirPlace([], texte);
  assert.equal(libre.place.nom, "droite"); assert.equal(libre.couvre, 0);
  assert.ok(libre.rect[0] >= BOUCHE[0] && libre.rect[3] <= 292 && libre.rect[1] >= 92 && libre.rect[2] <= 1128);
  // les tuiles de l'écran « choisir » (de x 420 à 1160, à partir de y 170) : sous la tête
  const tuiles = [[420, 170, 1160, 760]];
  const c = choisirPlace(tuiles, texte); assert.equal(c.couvre, 0); assert.equal(c.place.nom, "dessous");
  // un bouton à droite (« passer ») : la bulle se fait plus étroite
  const passer = [[880, 150, 1020, 290]];
  const p = choisirPlace(passer, texte); assert.equal(p.couvre, 0); assert.ok(p.rect[2] < 880);
  // impossible partout : celle qui couvre le moins
  const tout = choisirPlace([[0, 0, 1280, 800]], texte); assert.ok(tout.couvre > 0);
  // chaque place tient dans la scène et laisse la tête visible
  for (const pl of PLACES) {
    const r = poser(pl, Math.min(300, largeurMax(pl.boite)), 40).rect;
    assert.ok(r[0] >= 0 && r[1] >= 0 && r[2] <= 1280 && r[3] <= 800, pl.nom);
    assert.ok(r[0] >= MASCOTTE.x + MASCOTTE.w || r[1] >= MASCOTTE.y + MASCOTTE.h, `${pl.nom} : pas sur la tête`);
  }
});

test("la voix prévient la mascotte : un texte commence (avec sa durée), il s'arrête ; la pause aussi", async () => {
  const ev = [], v = new Voice({ fast: true }).setIndex({ phrases: { "Bravo !": ["a.ogg", 1000], "Place le poisson sur le nombre 37.": ["b.ogg", 2500] } });
  v.onTalk = (t, ms, o) => ev.push(["parle", t, Math.round(ms), o.instruction]); v.onSilence = () => ev.push(["silence"]);
  await v.say("Bravo ! Place le poisson sur le nombre 37.", { instruction: true });
  // la durée : les fichiers et le silence entre eux (140 ms), en mode accéléré × 0,12
  assert.deepEqual(ev, [["parle", "Bravo ! Place le poisson sur le nombre 37.", Math.round((1000 + 2500 + 140) * 0.12), true], ["silence"]]);
  // sans fichier : la durée estimée de la synthèse
  ev.length = 0; await v.say("Une phrase sans fichier.");
  assert.equal(ev[0][0], "parle"); assert.equal(ev[0][2], Math.round(v.fallbackMs("Une phrase sans fichier."))); assert.equal(ev[0][3], false); assert.deepEqual(ev[1], ["silence"]);
  // la pause : la mascotte se tait ; la reprise : la phrase recommence, elle reparle
  ev.length = 0; const p = v.say("Bravo !"); await new Promise((r) => setTimeout(r, 5));
  v.pause(); assert.deepEqual(ev.map((e) => e[0]), ["parle", "silence"]);
  v.resume(); await p; assert.deepEqual(ev.map((e) => e[0]), ["parle", "silence", "parle", "silence"]);
  // coupée (« réécouter », une réponse pendant la consigne) ou abandonnée : silence
  ev.length = 0; v.say("Bravo !"); await new Promise((r) => setTimeout(r, 5)); v.stop(); assert.deepEqual(ev.map((e) => e[0]), ["parle", "silence"]);
  ev.length = 0; v.say("Bravo !"); await new Promise((r) => setTimeout(r, 5)); v.abandon(); assert.deepEqual(ev.map((e) => e[0]), ["parle", "silence"]);
});

test("la flèche : jamais sur la réponse à placer ; une arrivée avec un petit rebond", async () => {
  const { cibleFleche } = await import("../../app/js/modules/numberline/screen.js");
  const geo = { tick: (i) => [100 + 50 * i, 470], seat: (i) => [100 + 50 * i, 441] };
  assert.deepEqual(cibleFleche({ format: "lire", target: 4 }, geo), [300, 470 - 42 - 44]);
  assert.deepEqual(cibleFleche({ format: "sauter", start: 2 }, geo), [200, 441 - 70]);
  // placer, estimer : sur le poisson qui porte le nombre, quelle que soit la réponse
  const a = cibleFleche({ format: "placer", answer: 3 }, geo), b = cibleFleche({ format: "placer", answer: 9 }, geo), e = cibleFleche({ format: "estimer", answer: 40 }, geo);
  assert.deepEqual(a, b); assert.deepEqual(a, e);
  assert.equal(arrivee(0), 1); assert.equal(arrivee(1), 0);
  const creux = Math.min(...Array.from({ length: 50 }, (_, i) => arrivee(i / 50))); assert.ok(creux < 0 && creux > -0.2, `rebond ${creux}`);
  assert.ok(ARRIVEE.ms <= 500);
});

test("le contenu : pas de nom, la bienvenue, la relance ; plus de choix du nom", () => {
  const T = JSON.parse(read("app/content/textes.json")), S = JSON.parse(read("app/content/seance.json"));
  assert.ok(!/\{mascotte\}/.test(read("app/content/textes.json")));
  for (const k of ["nomDemande", "nomTouche", "nomValider", "nomChoisi"]) assert.equal(T[k], undefined, k);
  assert.equal(S.noms, undefined);
  assert.ok(T.accueil.length >= 2 && T.accueil.every((t) => /bienvenue/i.test(t)), "la bienvenue");
  assert.equal(T.relanceAide, "Prends ton temps. Tu peux réécouter la consigne."); // docs/SPEC.md, section 11
  assert.ok(!/chooseName|nomDemande/.test(read("app/js/main.js") + read("app/js/session/screens.js")));
  assert.ok(!/Nom de la pieuvre|pieuvre s'appelle/.test(read("app/js/parent/parent.js")));
});

test("la pieuvre a disparu de l'application : moteur, planches, service worker ; la flèche est fabriquée", () => {
  assert.ok(!existsSync(new URL("../../app/js/engine/octopus.js", import.meta.url)));
  const atlas = JSON.parse(read("app/assets/art/atlas.json"));
  assert.equal(atlas.octo, undefined);
  assert.deepEqual(Object.keys(atlas.sprites).filter((n) => n.startsWith("pieuvre") || n === "nom"), []);
  assert.ok(atlas.sprites.fleche, "la flèche");
  assert.ok(!readdirSync(new URL("../../app/assets/art/", import.meta.url)).some((f) => f.startsWith("pieuvre")));
  const sw = read("app/sw-files.json");
  assert.ok(!/pieuvre(-gestes)?@/.test(sw)); assert.ok(/assets\/mascotte\/talk-a\.webm/.test(sw)); assert.ok(/assets\/polices\/shantell-sans-600\.woff2/.test(sw));
  for (const f of ["app/js/main.js", "app/js/engine/ocean.js", "app/js/modules/numberline/screen.js", "app/js/lessons/player.js", "app/index.html"]) assert.ok(!/octoAt|octo\.|#octo|Octopus/.test(read(f)), f);
});
