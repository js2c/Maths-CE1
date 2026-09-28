// La voix fabriquée à l'avance : nombres en lettres, découpage en phrases, inventaire tiré du contenu,
// un fichier pour chaque phrase (tools/voix/), et le moteur de l'application (engine/voice.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { enLettres, pourLaVoix } from "../../tools/voix/lettres.mjs";
import { additions, inventaire, lireContenu } from "../../tools/voix/inventaire.mjs";
import { bilan, VOIX } from "../../tools/voix/fabriquer.mjs";
import { fill, sentences } from "../../app/js/engine/phrases.js";
import { Voice } from "../../app/js/engine/voice.js";

test("les nombres de 0 à 100 en lettres", () => {
  const attendu = { 0: "zéro", 1: "un", 7: "sept", 10: "dix", 11: "onze", 16: "seize", 17: "dix-sept", 20: "vingt", 21: "vingt et un", 22: "vingt-deux", 37: "trente-sept", 41: "quarante et un", 60: "soixante", 69: "soixante-neuf", 70: "soixante-dix", 71: "soixante et onze", 72: "soixante-douze", 79: "soixante-dix-neuf", 80: "quatre-vingts", 81: "quatre-vingt-un", 88: "quatre-vingt-huit", 90: "quatre-vingt-dix", 91: "quatre-vingt-onze", 97: "quatre-vingt-dix-sept", 99: "quatre-vingt-dix-neuf", 100: "cent" };
  for (const [n, s] of Object.entries(attendu)) assert.equal(enLettres(Number(n)), s, `${n}`);
  assert.equal(enLettres(200), "deux cents"); assert.equal(enLettres(201), "deux cent un"); assert.equal(enLettres(1000), "mille");
  assert.equal(enLettres(21, { feminin: true }), "vingt et une"); assert.equal(enLettres(81, { feminin: true }), "quatre-vingt-une"); assert.equal(enLettres(11, { feminin: true }), "onze");
  // chaque nombre de 0 à 100 a une écriture sans chiffre, et deux nombres différents s'écrivent différemment
  const toutes = Array.from({ length: 101 }, (_, n) => enLettres(n));
  assert.ok(toutes.every((s) => !/\d/.test(s))); assert.equal(new Set(toutes).size, 101);
  assert.throws(() => enLettres(-1)); assert.throws(() => enLettres(2.5));
});

test("une phrase pour la voix : nombres, symboles, féminin", () => {
  assert.equal(pourLaVoix("0 plus 6 ?"), "zéro plus six ?"); // l'exemple mal lu par la synthèse (docs/SPEC.md)
  assert.equal(pourLaVoix("Place le poisson sur le nombre 37."), "Place le poisson sur le nombre trente-sept.");
  assert.equal(pourLaVoix("5 + 2 = ?"), "cinq plus deux égale combien");
  assert.equal(pourLaVoix("3 + ? = 7"), "trois plus combien égale sept");
  assert.equal(pourLaVoix("? + 4 = 6"), "Combien plus quatre égale six");
  assert.equal(pourLaVoix("6 × 7 − 2"), "six fois sept moins deux");
  assert.equal(pourLaVoix("Ce soir, tu as gagné 21 étoiles de mer."), "Ce soir, tu as gagné vingt et une étoiles de mer.");
  assert.equal(pourLaVoix("1 dizaine et 1 unité."), "une dizaine et une unité.");
  assert.equal(pourLaVoix("La tortue est sur 1."), "La tortue est sur un.");
  assert.equal(pourLaVoix("La tortue est sur 7 et fait 2 sauts. Où arrive-t-elle ?"), "La tortue est sur sept et fait deux sauts. Où arrive-t-elle ?");
});

test("découpage en phrases", () => {
  assert.deepEqual(sentences("Bravo ! Ce soir, tu as gagné 3 étoiles de mer."), ["Bravo !", "Ce soir, tu as gagné 3 étoiles de mer."]);
  assert.deepEqual(sentences("Hop, un saut :"), ["Hop, un saut :"]);
  assert.deepEqual(sentences("trente…"), ["trente…"]);
  assert.deepEqual(sentences("À toi !  Où est le nombre 12 ?"), ["À toi !", "Où est le nombre 12 ?"]);
  assert.deepEqual(sentences("C’est moi !"), ["C'est moi !"]);
});

test("inventaire : les phrases à nombre sont déclinées pour chaque valeur", () => {
  const inv = inventaire();
  for (const s of ["Place le poisson sur le nombre 37.", "Où est le nombre 0 ?", "Où mettrais-tu 100 ?", "C'était 64.", "0 plus 6 ?", "Combien font 10 plus 0 ?", "La tortue est sur 6 et fait 4 sauts.", "La tortue est sur 9 et fait un saut.", "4 dizaines et 7 unités.", "1 dizaine et 2 unités.", "2 dizaines et 1 unité.", "1 dizaine et 3 unités.", "Cette carte t'attend quelque part dans le lagon !", "Ce n'est pas grave, regardons ensemble.", "La ligne commence à 30, pas à zéro.", "La tortue part de 3, pas de zéro.", "Ce soir, tu as gagné 12 étoiles de mer.", "Coucou !", "C'est moi, Plouf.", "C'est l'hippocampe !", "37", "trente…"]) assert.ok(inv.has(s), s);
  // les 66 additions sous leurs trois formes, et leur correction
  const faits = additions();
  assert.equal(faits.length, 66);
  for (const f of faits) for (const t of ["{a} plus {b} ?", "{a} plus combien, ça fait {n} ?", "Combien plus {b}, ça fait {n} ?", "{a} plus {b}, ça fait {n}."]) assert.ok(inv.has(fill(t, f)), fill(t, f));
  // aucune phrase ne garde un gabarit, et toutes se lisent sans chiffre
  for (const s of inv.keys()) { assert.ok(!/[{}]/.test(s), s); assert.ok(!/\d/.test(pourLaVoix(s)), s); }
});

test("inventaire : chaque texte du contenu est couvert, un gabarit sans règle est refusé", () => {
  const C = lireContenu(), inv = inventaire(C);
  // chaque texte sans variable de textes.json, chaque phrase des leçons, chaque anecdote
  const textes = [];
  const walk = (k, v) => (typeof v === "string" ? textes.push([k, v]) : Array.isArray(v) ? v.forEach((x) => walk(k, x)) : Object.entries(v).forEach(([kk, x]) => walk(`${k}.${kk}`, x)));
  Object.entries(C.textes).forEach(([k, v]) => k !== "_doc" && walk(k, v));
  for (const [k, t] of textes) if (!/\{/.test(t) && !["unSaut", "sauts", "uneEtoile", "uneDizaine", "uneUnite", "placesUnites", "placesDizainesUnites"].includes(k)) for (const s of sentences(t)) assert.ok(inv.has(s), `${k} : ${s}`);
  for (const [id, L] of Object.entries(C.lecons)) if (id !== "_doc") for (const b of L.phrases.flat()) if (b.dire) for (const s of sentences(b.dire)) assert.ok(inv.has(s), `${id} : ${s}`);
  for (const c of C.cartes.cartes.filter((x) => x.anecdote)) for (const s of sentences(c.anecdote)) assert.ok(inv.has(s), c.id);
  for (const z of C.cartes.zones) for (const t of [z.dosLu, z.fermeeLu].filter(Boolean)) assert.ok(inv.has(t), `${z.id} : ${t}`);
  // un nouveau gabarit à nombre sans domaine : l'inventaire échoue au lieu d'oublier des phrases
  const C2 = { ...C, textes: { ...C.textes, nouveau: "Il y a {n} bulles." } };
  assert.throws(() => inventaire(C2), /pas de règle/);
});

test("chaque phrase de l'inventaire a son fichier son ; poids total sous 80 Mo (décision du parent du 28 septembre 2026 ; lot 3 : sous 60 Mo, pour garder 20 Mo au lot 4)", () => {
  const { phrases, index, afaire } = bilan();
  assert.deepEqual(afaire, [], `phrases sans fichier à jour (lancer node tools/voix/fabriquer.mjs) : ${afaire.slice(0, 5).join(" | ")}`);
  for (const k of phrases.keys()) assert.ok(existsSync(join(VOIX, index.phrases[k][0])), k);
  // pas de phrase périmée dans l'index, pas de fichier orphelin
  assert.deepEqual(Object.keys(index.phrases).filter((k) => !phrases.has(k)), []);
  const utiles = new Set(Object.values(index.phrases).map(([f]) => f));
  assert.deepEqual(readdirSync(VOIX).filter((f) => f.endsWith(".ogg") && !utiles.has(f)), []);
  const poids = readdirSync(VOIX).reduce((s, f) => s + statSync(join(VOIX, f)).size, 0);
  assert.ok(poids < 80e6, `${(poids / 1e6).toFixed(1)} Mo`);
  // des durées plausibles (un nombre seul : au moins 0,3 s ; une anecdote : quelques secondes)
  for (const [k, [, ms]] of Object.entries(index.phrases)) assert.ok(ms > 300 && ms < 15000, `${k} : ${ms} ms`);
});

test("le moteur de voix joue les fichiers, la synthèse en secours, « réécouter » rejoue le fichier", async () => {
  const index = JSON.parse(readFileSync(join(VOIX, "index.json"), "utf8"));
  const v = new Voice({ fast: true }).setIndex(index);
  const p = v.plan("Bravo ! Ce soir, tu as gagné 3 étoiles de mer.");
  assert.equal(p.length, 2); assert.equal(p[0].src, `assets/voix/${index.phrases["Bravo !"][0]}`);
  assert.equal(v.plan("Coucou ! C'est moi, Zoé."), null); // un nom tapé par le parent : pas de fichier
  await v.say("Place le poisson sur le nombre 37.", { instruction: true });
  assert.equal(v.misses.size, 0);
  await v.say("Coucou ! C'est moi, Zoé.");
  assert.deepEqual([...v.misses], ["C'est moi, Zoé."]);
  // « réécouter » : la même consigne, donc le même fichier ; l'écoute est comptée
  v.misses.clear(); await v.replay();
  assert.equal(v.listens, 2); assert.equal(v.misses.size, 0); assert.ok(v.plan(v.instruction));
  // sans index (fichier absent), tout passe par la synthèse
  const s = new Voice({ fast: true }); assert.equal(s.plan("Bravo !"), null); await s.say("Bravo !");
});

test("un gabarit rempli en deux temps garde ses nombres (défaut « plus ? » du lot 1)", () => {
  // comme main.js : pick remplit {mascotte}, puis l'écran remplit les nombres
  const pick = (t) => fill(t, { mascotte: "Bulle" });
  assert.equal(fill(pick("{a} plus {b} ?"), { a: 0, b: 6 }), "0 plus 6 ?");
  assert.equal(fill(pick("Regarde tout ce que tu as gagné ce soir : {etoiles} !"), { etoiles: "3 étoiles de mer" }), "Regarde tout ce que tu as gagné ce soir : 3 étoiles de mer !");
  assert.equal(pick("C'est moi, {mascotte}."), "C'est moi, Bulle.");
});
