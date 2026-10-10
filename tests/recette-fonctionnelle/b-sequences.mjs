// RECETTE FONCTIONNELLE DU LOT 3, PARTIE B : les séquences de questions (docs/PROMPT-RECETTE-LOT3.md, session 1).
// Pour chaque exercice × niveau (ou famille) × cran, le texte d'une séance complète telle que le moteur la génère
// (échauffement, notion du jour, défi record s'il a lieu, récompense), en base neuve et en « un mois »
// (tools/sauvegarde-test.mjs reel 2 4), avec trois comportements de l'enfant : appliquée, réelle, pressée.
// Sans navigateur : les modules réels de l'application (Session, runners, Warmup, runChallenge, Rewards), comme
// tests/sim-recette.mjs ; seuls les écrans sont remplacés par l'enfant simulée ci-dessous. Rien n'est jugé.
//   node tests/recette-fonctionnelle/b-sequences.mjs [--seulement 1:5] (un seul exercice:niveau, pour essayer)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { decompose, fill, hundredsWords } from "../../app/js/engine/phrases.js";
import { classify, e6Values, e7Value, makeEstimate, makeJump, makePlace, makeRead, makeWrite, questionKey, TRAPS } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { Session } from "../../app/js/session/session.js";
import { runNotion } from "../../app/js/session/notion.js";
import { Rewards, goldenStar } from "../../app/js/session/rewards.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { FactsScreen, runWarmup } from "../../app/js/modules/facts/screen.js";
import { aidFor, expected, median } from "../../app/js/modules/facts/facts.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { calcMastery, Module3Runner } from "../../app/js/modules/calc/runner.js";
import { Module4Runner, passageTexte } from "../../app/js/modules/voiliers/runner.js";
import { codeErreur, entre, explication, pourquoi } from "../../app/js/modules/voiliers/voiliers.js";
import { calcKey, classifyCalc } from "../../app/js/modules/calc/calc.js";
import { Module5Runner } from "../../app/js/modules/mult/runner.js";
import { classifyMult, multAnswer, multKey, multQuestion } from "../../app/js/modules/mult/mult.js";
import { MultScreen } from "../../app/js/modules/mult/screen.js";
import { checkSequence } from "../../app/js/modules/variete.js";
import { Module6Runner, soucoupeTexte } from "../../app/js/modules/etal/runner.js";
import { juger, montantDit, montantEcrit, solution } from "../../app/js/modules/etal/etal.js";
import { runChallenge } from "../../app/js/modules/facts/challenge.js";

const ROOT = new URL("../../", import.meta.url).pathname;
const load = (f) => JSON.parse(readFileSync(join(ROOT, "app/content", f), "utf8"));
const seance = load("seance.json"), module1 = load("module1.json"), module2 = load("module2.json"), module3 = load("module3.json"), module4 = load("module4.json"), module5 = load("module5.json"), module6 = load("module6.json"), cartes = load("cartes.json"), calendrier = load("calendrier.json"), T = load("textes.json"), lecons = load("lecons.json");
const OUT = join(ROOT, process.env.RECETTE_OUT ?? "tests/recette-fonctionnelle/out", "B-sequences");
mkdirSync(OUT, { recursive: true });
// --test (lot 3 bis, docs/SPEC-LOT3BIS.md, §0) : rien n'est écrit ; les quatre règles de la réponse qui varie sont vérifiées
// sur chaque séance (bases neuve et « un mois », comportements « appliquée » et « réelle ») ; code de sortie 1 si une
// seule séance les manque.
const argv = process.argv.slice(2), TEST = argv.includes("--test"), only = argv.includes("--seulement") ? argv[argv.indexOf("--seulement") + 1].split(":").map(Number) : null;

// ---------------------------------------------------------------- les trois comportements
// ms : temps de réponse ; erreur : part des réponses fausses (dont `nsp` en « je ne sais pas ») ; hasard : au hasard
const COMPORTEMENTS = {
  appliquee: { nom: "appliquée", ms: 4000, erreur: 0, nsp: 0, hasard: false, dit: "tout juste, 4 s par réponse" },
  reelle: { nom: "réelle", ms: 5000, erreur: 0.25, nsp: 0.2, hasard: false, dit: "25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse" },
  pressee: { nom: "pressée", ms: 1000, erreur: 0, nsp: 0, hasard: true, dit: "réponses au hasard, 1 s par réponse" },
};
// la durée des moments hors réponse (voix et animations, ordre de grandeur de tests/e2e/recette-durees.mjs) : elle ne
// sert qu'au plafond de la séance (12 minutes) et à la durée des étapes
const D = { consigne: 3000, bravo: 1500, correction: 11000, correctionCalc: 14000, demo: 12000, lecon: 75000, accueil: 20000, selecteur: 8000, defiApres: 500 };
const CRANS = ["facile", "conseille", "dur", "tresdur"], CRAN_NOM = { facile: "plus facile", conseille: "conseillé", dur: "plus dur", tresdur: "très dur" };

const pickT = (R, k, v = {}) => { const e = T[k]; return fill(Array.isArray(e) ? e[Math.floor(R() * e.length)] : e, v); };
const any = (R, xs) => xs[Math.floor(R() * xs.length)];
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

// ---------------------------------------------------------------- ce que l'écran affiche et ce que dit la voix
const vals = (q) => q.labelled.map((i) => q.min + i * q.step);
function formeLigne(q) {
  const ligne = q.format === "estimer" ? `corde ${q.min}–${q.max} sans graduations${q.repere ? `, repère ${(q.min + q.max) / 2}` : ""}` : q.format === "ecrire" ? `pavé numérique${q.tableau ? " + tableau chalut/filet/poisson" : ""}` : `ligne ${q.min}–${q.max} (pas ${q.step}, ${q.n} graduations) écrits ${vals(q).join("·") || "aucun"}`;
  const bulles = q.choices ? ` ; bulles ${q.choices.map((c) => c.value).join(" / ")}` : "";
  if (q.format === "lire") return `${ligne} ; étoile sur ${q.answer}${bulles}`;
  if (q.format === "sauter") return `${ligne} ; tortue sur ${q.min + q.start * q.step}, ${q.jumps} saut(s)${bulles}`;
  if (q.format === "placer") return `${ligne} ; poisson « ${q.answer} » à poser`;
  if (q.format === "estimer") return `${ligne} ; poser ${q.answer} (±${q.tolerance})`;
  return `${ligne} ; dictée`;
}
const voixLigne = (R, q, { guide, lesson }) => {
  const v = { n: q.answer, a: q.format === "sauter" ? q.min + q.start * q.step : q.min, sauts: q.jumps === 1 ? T.unSaut : `${q.jumps} ${T.sauts}` };
  const L = lesson && lecons[lesson];
  const s = L ? (L.aToiDepuisZero && q.format === "lire" && q.min === 0 && q.step === 1 ? L.aToiDepuisZero : `${L.aToi} ${pickT(R, q.format, v)}`) : `${guide ? `${pickT(R, "aToi")} ` : ""}${pickT(R, q.format, v)}`;
  return (guide && !lesson ? "[exemple guidé : la tortue montre la méthode] " : q.premierSaut ? "[la tortue montre le premier saut] " : "") + s;
};
const fait = (q) => { const f = q.forme ?? "directe", op = q.op === "-" ? "−" : "+"; return f === "trouDroite" ? `${q.a} ${op} ? = ${q.op === "-" ? q.a - q.b : q.a + q.b}` : f === "trouGauche" ? `? ${op} ${q.b} = ${q.a + q.b}` : `${q.a} ${op} ${q.b} = ?`; };
const voixFait = (R, q) => {
  const v = { a: q.a, b: q.b, n: q.a + q.b };
  if (q.rappel && (q.forme ?? "directe") === "directe") return `${fill(pickT(R, "fait"), v)} ${fill(T.rappelDouble, { ...v, d: q.rappel.d })}`;
  return q.forme === "trouDroite" ? fill(T.faitTrouDroite, v) : q.forme === "trouGauche" ? fill(T.faitTrouGauche, v) : fill(pickT(R, "fait"), v);
};
const aidKind = (q) => { const fam = module2.familles.find((f) => f.id === q.famille)?.aide, k = q.appui ?? (fam && fam !== "fait" ? fam : aidFor(q.a, q.b)); return k === "reflet" && q.a > 10 ? "grandDouble" : k; }; // (lot « Sommes jusqu'à 30 » : comme facts/screen.js, aidKind)
// (lot « Sommes jusqu'à 30 » : ce que dit l'appui, repris de l'écran lui-même, facts/screen.js : les deux boîtes, le grand double…)
const FS = Object.setPrototypeOf({ app: { text: { data: T } }, c: module2 }, FactsScreen.prototype);
const FM = Object.setPrototypeOf({ app: { text: { data: T } } }, MultScreen.prototype); // (lot « Multiplication »)
const aidSpeech = (q, solved = true) => { const kind = FS.aidKind(q); return kind === "ligne" ? `[aide ligne] ${fill(T.aideLigne, { a: Math.max(q.a, q.b), sauts: Math.min(q.a, q.b) === 1 ? T.unSaut : `${Math.min(q.a, q.b)} ${T.sauts}` })}` : FS.aidSpeech(q, kind, solved); };
const consigneCalc = (q) => (q.pont ? fill(q.op === "-" ? T.calcPont.moins : T.calcPont.plus, { k: q.b }).replace(/\.$/, " ?") : q.forme === "trouDroite" ? fill(q.op === "-" ? T.calcTrouMoins : T.calcTrouPlus, { a: q.a, n: q.n }) : fill(q.op === "-" ? T.calcMoins : T.calcPlus, { a: q.a, b: q.b }));
const cheminTxt = (q) => `${q.a} ${q.chemin.map((s) => `${s.op === "-" ? "−" : "+"}${s.k}→${s.a}`).join(" ")}`;
const answerCalc = (q) => (q.forme === "trouDroite" ? q.b : q.n);

// ---------------------------------------------------------------- la réponse de l'enfant simulée
// renvoie { value, nsp } ; `R` : son hasard (seed de la séquence)
function reponseLigne(R, C, q) {
  const good = q.answer, faux = !C.hasard && R() < C.erreur;
  if (!C.hasard && !faux) return { value: good };
  if (faux && R() < C.nsp) return { value: null, nsp: true };
  if (q.choices) { const pool = C.hasard ? q.choices : q.choices.filter((c) => c.value !== good); return { value: any(R, pool).value }; }
  if (q.format === "placer") {
    const ticks = Array.from({ length: q.n }, (_, i) => q.min + i * q.step);
    if (C.hasard) return { value: any(R, ticks) };
    const c = [q.min + q.max - good, good - q.step, good + q.step, TRAPS.E5?.(q), ...e6Values(good)].filter((v) => v !== good && ticks.includes(v));
    return { value: c.length ? any(R, c) : any(R, ticks.filter((v) => v !== good)) };
  }
  if (q.format === "estimer") {
    if (C.hasard) return { value: q.min + Math.floor(R() * (q.max - q.min + 1)) };
    const sym = q.min + q.max - good, off = (q.tolerance + 3 + Math.floor(R() * 12)) * (R() < 0.5 ? -1 : 1);
    return { value: Math.abs(sym - good) > q.tolerance && R() < 0.4 ? sym : Math.max(q.min, Math.min(q.max, good + off)) };
  }
  if (q.format === "ecrire") {
    if (C.hasard) return { value: Math.floor(R() * 1000) };
    const c = [...e6Values(good), e7Value(good), good + 1, good - 1].filter((v) => v != null && v !== good && v >= 0);
    return { value: any(R, c) };
  }
  return { value: good + 1 };
}
function reponseNombre(R, C, good, { max = 20, pieges = [] } = {}) {
  if (C.hasard) return { value: Math.floor(R() * (max + 1)) };
  if (R() >= C.erreur) return { value: good };
  if (R() < C.nsp) return { value: null, nsp: true };
  const c = [...pieges, good + 1, good - 1].filter((v) => v != null && v !== good && v >= 0);
  return { value: any(R, c) };
}
const piegesCalc = (q) => { if (q.forme === "trouDroite") return [q.n, q.b + 1]; const out = []; for (let v = 0; v <= 110; v++) if (classifyCalc({ ...q, forme: "directe" }, v) && classifyCalc({ ...q, forme: "directe" }, v) !== "autre") out.push(v); return out; };

// ---------------------------------------------------------------- la base de départ
let dumpMois = null;
function baseMois() {
  if (dumpMois) return dumpMois;
  // (la même sauvegarde que les parties A, C et D : tests/recette-fonctionnelle/out/sauvegarde-un-mois.json)
  const f = join(OUT, "..", "sauvegarde-un-mois.json");
  if (!existsSync(f)) execFileSync("node", ["tools/sauvegarde-test.mjs", "reel", "2", "4", "--sortie", f], { cwd: ROOT });
  return (dumpMois = JSON.parse(readFileSync(f, "utf8")));
}
async function openBase(base) {
  const store = await Store.open(new IDBFactory());
  if (base === "mois") await store.restore(baseMois(), []);
  return store;
}

// ---------------------------------------------------------------- une séance
async function uneSeance({ base, choix, cran, comp }) {
  const C = COMPORTEMENTS[comp], key = `${base}-${choix.module}-${choix.niveau ?? choix.famille}-${cran}-${comp}`, R = rng(hash(key)), RV = rng(hash(key + "voix"));
  const store = await openBase(base);
  const today = new Date(); today.setHours(18, 0, 0, 0);
  let t = today.getTime(); const clock = () => t, add = (ms) => { t += ms; };
  const realNow = Date.now; Date.now = () => Math.round(t);
  const rows = [], lessons = {}, extra = [];
  let cur = null, etape = null, nq = 0;
  const row = (r) => { cur = { n: ++nq, etape, ...r, suite: [] }; rows.push(cur); return cur; };
  const suite = (s) => { if (cur) cur.suite.push(s); else extra.push(s); };
  try {
    const rewards = await new Rewards(store, cartes, calendrier).load(t);
    const [n1, n2, n3] = await Promise.all([1, 2, 3].map((k) => store.get("niveaux", k)));
    const mast = { 1: ((n1?.niveau ?? 1) - 1) / module1.niveaux.length, 2: (n2?.acquises?.length ?? 0) / module2.familles.length, 3: calcMastery(module3, n3) };
    const depart = { ligne: n1?.niveau ?? 1, familles: n2?.ouvertes ?? [1, 2], acquises: n2?.acquises ?? [], calcAcquis: n3?.acquis ?? [] };
    // ---- l'échauffement (et le défi) : l'écran des additions
    const warmScreen = { show() {}, keys() {}, leave() {}, abandon() {}, ask: async (q) => {
      const good = expected(q), r = q.base && !C.hasard ? { value: good } : reponseNombre(R, C, good, { max: 20, pieges: [q.a + q.b === good ? null : q.a + q.b] });
      const ok = r.value === good;
      const x = row({ forme: fait(q) + (q.base ? " (temps de base)" : "") + (q.nouveau ? " (fait nouveau)" : ""), voix: voixFait(RV, q), attendue: good, donnee: r.nsp ? "je ne sais pas" : r.value });
      add(D.consigne + C.ms + (ok ? D.bravo : D.correction));
      if (!ok) x.suite.push(`correction : « ${r.nsp ? T.faitNSP + " " : ""}${fill(T.faitCorrection, { a: q.a, b: q.b, n: q.a + q.b })} »`);
      return { value: r.value, ms: q.base ? C.ms : C.ms, listens: 1, aide: false, nsp: !!r.nsp };
    } };
    const defiScreen = { show() {}, keys() {}, leave() {}, blank() {}, cancel() {}, askDefi: async (q) => {
      const good = expected(q), r = reponseNombre(R, C, good, { max: 20 }), ok = r.value === good;
      const x = row({ forme: fait(q), voix: "(aucune : le défi ne lit pas les calculs)", attendue: good, donnee: r.nsp ? "je ne sais pas" : r.value });
      add(C.ms + (ok ? D.defiApres : seance.etapes.find((e) => e.id === "defi").apresErreurMs)); if (!ok) x.suite.push("la bonne réponse montrée un instant");
      return { value: r.value, ms: C.ms, listens: 0, aide: false, nsp: !!r.nsp, after: Promise.resolve() };
    } };
    const lesson = async (id, raison) => { lessons[id] = (lessons[id] ?? 0) + 1; cur = null; row({ forme: `LEÇON ${id}`, voix: `(leçon animée ${id}, raison : ${raison === "niveau" ? "entrée du niveau" : raison === "difficulte" ? "difficulté persistante" : `erreur ${raison} répétée`})`, attendue: "", donnee: "regardée jusqu'au bout" }); add(D.lecon); return { vue: true }; };
    const wrapRunner = (runner) => { const rec = runner.record.bind(runner); runner.record = async (r, cfg) => { const res = await rec(r, cfg); for (const e of res.events ?? []) suite(e.type === "montee" ? `MONTÉE (${e.de ? `niveau ${e.de} → ${e.a}` : e.niveau ? `niveau ${e.niveau} acquis` : `famille ${e.famille} acquise`})` : e.type === "lecon" ? `leçon ${e.id} relancée` : e.type === "difficulte" ? "difficulté persistante" : e.type === "plusBas" ? "niveau inférieur jusqu'à la fin (leçon déjà jouée)" : e.type); return res; }; return runner; };
    const s = new Session({ store, content: seance, rewards, clock, choix, mastery: (m) => mast[m] ?? 0, onCranDown: async (de, a) => { suite(`le cran redescend : ${CRAN_NOM[de]} → ${CRAN_NOM[a]} (« ${T.cranDescente} »)`); add(3000); }, handlers: {
      accueil: async ({ session }) => { etape = "accueil"; add(D.accueil); await session.setCran(cran); add(D.selecteur); },
      echauffement: async (ctx) => { etape = "échauffement"; const w = await new Warmup({ store, content: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, dejaNouveaux: ctx.session.nouveaux }).load(); await runWarmup({ ...ctx, warmup: w, screen: warmScreen, rnd: R }); cur = null; },
      notion: async (ctx) => {
        etape = "notion"; const m = ctx.session.rec.module;
        if (m === 1) {
          const lineScreen = { ask: async (q, cfg, o = {}) => {
            const r = o.guide ? { value: q.answer } : reponseLigne(R, C, q), code = r.nsp ? "NSP" : classify(q, r.value), ok = code === null;
            const x = row({ forme: formeLigne(q) + (q.revient ? " (revient)" : "") + (q.cran && q.cran !== "conseille" ? "" : ""), voix: voixLigne(RV, q, { guide: o.guide, lesson: o.lesson }), cle: questionKey(q), attendue: q.answer, donnee: o.guide ? `${q.answer} (guidé)` : r.nsp ? "je ne sais pas" : r.value });
            add(D.consigne + (o.guide && !o.lesson ? D.demo : 0) + C.ms + (ok ? D.bravo : D.correction));
            if (!ok) { const key0 = q.format === "sauter" && code === "E3" ? "E3sauter" : code, n = q.answer; x.suite.push(`correction ${code} : « ${key0 && T.erreur[key0] ? fill(T.erreur[key0], { a: q.format === "sauter" ? q.min + q.start * q.step : q.min, n, ...(n >= 100 ? hundredsWords(T, n) : decompose(T, n)) }) : T.erreur.autre} … ${fill(T.bonneReponse, { n })} »`); }
            return { q, value: r.value, ok, code, ms: C.ms, listens: 1 };
          }, generate: (cfg, r, o = {}) => (o.format === "ecrire" ? makeWrite(cfg, r, o) : o.format === "sauter" ? makeJump(cfg, r) : o.format === "placer" ? makePlace(cfg, r, o) : o.format === "estimer" ? makeEstimate(cfg, r, o) : makeRead(cfg, r, o)) };
          const runner = wrapRunner(await new Module1Runner({ screen: lineScreen, store, content: module1, rnd: R, seance: ctx.session.id, variete: seance.variete, offset: () => ctx.session.offset, cran: () => ctx.session.cran, choix: ctx.session.choix?.niveau ?? null }).load());
          await runNotion({ ...ctx, runner, screen: lineScreen, rnd: R, lesson }); cur = null; return;
        }
        if (m === 2) {
          const runner = wrapRunner(await new Module2Runner({ store, content: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, dejaNouveaux: ctx.session.nouveaux, choix: ctx.session.choix?.famille ?? null }).load());
          const scr = { ask: async (q, cfg, o = {}) => {
            const good = expected(q), guide = !!(o.guide || q.guide), r = guide ? { value: good } : reponseNombre(R, C, good, { max: 20, pieges: q.forme !== "directe" ? [q.a + q.b] : [] }), ok = r.value === good;
            const pre = q.guide ? `[exemple guidé : ${aidSpeech(q)} ${fill(T.faitCorrection, { a: q.a, b: q.b, n: q.a + q.b })} ${T.aToiFait}] ` : q.aideDEmblee ? `[aide d'emblée : ${aidSpeech(q, false)}] ` : "";
            const x = row({ cle: `fait:${q.fait}`, forme: `${fait(q)} (famille ${q.famille}${q.revient ? ", revient" : ""})`, voix: pre + voixFait(RV, q), attendue: good, donnee: guide ? `${good} (guidé)` : r.nsp ? "je ne sais pas" : r.value });
            add(D.consigne + (q.guide ? D.demo : 0) + (q.aideDEmblee ? 6000 : 0) + C.ms + (ok ? D.bravo : D.correction));
            if (!ok) x.suite.push(`correction : « ${r.nsp ? T.faitNSP + " " : ""}${aidSpeech(q)} ${fill(T.faitCorrection, { a: q.a, b: q.b, n: q.a + q.b })} »`);
            return { q, value: r.value, ok, code: ok ? null : r.nsp ? "NSP" : "autre", ms: C.ms, listens: 1, aide: false, nsp: !!r.nsp };
          } };
          const res = await runNotion({ ...ctx, step: { ...ctx.step, ...(ctx.step.module2 ?? {}) }, runner, screen: scr, rnd: R, lesson });
          cur = null;
          for (const e of res?.events ?? []) { if (e.type === "acquise" && !e.parent && !runner.events.some((x) => x.famille === e.famille)) await ctx.session.levelUp(); suite(`fin de la notion : ${e.type} famille ${e.famille}`); }
          ctx.session.nouveaux = runner.nouveaux; return;
        }
        // lot « Les voiliers » : un bateau par question ; la « réponse » est le passage (au double encadrement, 10 × celui des
        // centaines + celui des dizaines) ; deux essais au calme et au vent, un seul avec les pirates
        if (m === 4) {
          const runner = wrapRunner(await new Module4Runner({ store, content: module4, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, choix: ctx.session.choix?.niveau ?? null }).load());
          const dire = (e, v) => fill(T.voiliersErreur[e.cle], { b: e.b, n: v });
          const scr = { ask: async (q) => {
            const att = q.double ? q.k * 10 + q.k2 : q.k, mer = { calme: "calme", vent: "vent", pirates: "pirates" }[q.mer];
            const voix = `${q.annonce ? `${T.voiliersMer[q.annonce]} ` : ""}${q.premier ? `${T.voiliersConsigne} ` : ""}${q.num}`;
            if (q.guide) { const x = row({ cle: `exemple:${q.num}`, forme: `EXEMPLE GUIDÉ : ${q.num} entre ${q.bouees.join(" · ")}`, voix: `${voix} ${T.voiliersExemple[q.niveau]}`, attendue: "", donnee: "(le bateau va seul)" }); add(D.demo); void x; return { q, ok: true, ms: 0, listens: 1 }; }
            // une rangée : le passage choisi au premier essai, puis au second (calme, vent)
            const rangee = (b, k) => { const n = b.length + 1, essai = () => (C.hasard ? Math.floor(R() * n) : R() < C.erreur ? (R() < C.nsp ? null : Math.max(0, Math.min(n - 1, k + (R() < 0.5 ? -1 : 1)))) : k); const c1 = essai(); return c1 === k || c1 === null || q.mer === "pirates" ? [c1] : [c1, essai()]; };
            // (comme l'écran : la rangée des dizaines suit, même après deux erreurs sur les centaines ; pas après un naufrage)
            const r1 = rangee(q.bouees, q.k), ok1 = r1[0] === q.k, fin1 = r1.at(-1) === q.k, r2 = q.double && r1[0] !== null && (fin1 || q.mer !== "pirates") ? rangee(q.rangee2, q.k2) : [], ok2 = r2[0] === q.k2, fin2 = r2.at(-1) === q.k2;
            const nsp = r1[0] === null || (q.double && r2[0] === null), ok = !nsp && ok1 && (!q.double || ok2), fin = !nsp && fin1 && (!q.double || fin2);
            const demi = q.double && !ok && fin && (ok1 || ok2), corrigee = !ok && fin && q.mer !== "pirates";
            const code = ok ? null : nsp ? "NSP" : q.double ? (ok1 ? "V3" : "V4") : codeErreur(r1[0], q.k);
            const x = row({ cle: String(q.num), forme: `${q.num} entre ${q.bouees.join(" · ")}${q.double ? ` puis ${q.rangee2.join(" · ")}` : ""} (niveau ${q.niveau}, mer ${mer}${q.revient ? ", revient" : ""})`, voix, attendue: att, donnee: nsp ? "je ne sais pas" : [passageTexte(q.bouees, r1[0]), ...r1.slice(1).map((c) => `puis ${passageTexte(q.bouees, c)}`), ...r2.map((c, i) => `${i ? "puis " : "dizaines : "}${passageTexte(q.rangee2, c)}`)].join(", ") });
            add(2200 + D.consigne + C.ms * (r1.length + r2.length) + (ok ? 2400 : corrigee ? D.correction : D.correction + 3000));
            if (!ok && !nsp) for (const [b, rr, k] of [[q.bouees, r1, q.k], ...(q.double ? [[q.rangee2, r2, q.k2]] : [])]) for (const c of rr) if (c !== k && c != null) x.suite.push(`erreur ${code} : « ${dire(explication(b, c, q.num), q.num)} »${q.mer === "vent" ? ` « ${T.voiliersMer.repousse} »` : q.mer === "pirates" ? ` « ${T.voiliersMer.rattrape} »` : ""}`);
            if (nsp) x.suite.push(`« ${T.erreur.NSP} » puis le bateau va seul : « ${dire(pourquoi(q.bouees, q.num), q.num)} »${q.double ? ` ; puis les dizaines : « ${dire(pourquoi(q.rangee2, q.num), q.num)} »` : ""}`);
            else if (!fin && q.mer !== "pirates") for (const [b, rr, k] of [[q.bouees, r1, q.k], ...(q.double ? [[q.rangee2, r2, q.k2]] : [])]) if (rr.length > 1 && rr.at(-1) !== k) x.suite.push(`deuxième erreur : le bateau va seul : « ${dire(pourquoi(b, q.num), q.num)} »`);
            if (ok || corrigee) { const b = q.double ? q.rangee2 : q.bouees, e = entre(b, q.double ? q.k2 : q.k), en = e && fill(T.voiliersBravoEntre, { a: e[0], b: e[1] }); x.suite.push(q.mer === "pirates" ? `« ${en ? `${T.voiliersMer.loin} ${en}` : pickT(RV, "voiliersBravoPirates")} »` : en ? `« ${en} »` : "« Bravo ! »"); }
            return { q, ok, corrigee, demi, code, nsp, choisi: r1[0], ms: C.ms, listens: 1, essais: r1.length + r2.length };
          } };
          await runNotion({ ...ctx, step: { ...ctx.step, ...(ctx.step.module4 ?? {}) }, runner, screen: scr, rnd: R, lesson }); cur = null; return;
        }
        // lot « L'étal du pêcheur » : un achat par question ; la « réponse » est le prix (au niveau 1, la valeur à poser ; au
        // niveau 7, ce que le pêcheur rend) ; deux essais (compléter, ou valider après qu'il a rendu ce qui était en trop)
        if (m === 6) {
          const runner = wrapRunner(await new Module6Runner({ store, content: module6, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, choix: ctx.session.choix?.module === 6 ? ctx.session.choix.niveau : null }).load());
          let dernier = null;
          const P = (n) => T.etalProduit[n], M = (c) => montantDit(T, c);
          const scr = { ask: async (q) => {
            const cfg = module6.niveaux[q.niveau - 1], k = `${q.type}${q.niveau >= 9}`, cons = q.premier || dernier !== k ? `${q.niveau >= 9 ? T.etalConsigne.centimes : T.etalConsigne[q.type]} ` : ""; dernier = k;
            const phrase = q.type === "poser" ? T.etalPoser[q.valeur] : q.type === "deux" ? `${fill(T.etalPaire, { a: module6.articles[q.produits[0]], b: module6.articles[q.produits[1]] })} ${P(q.produits[0]).nom} ${M(q.prixProduits[0])} ${P(q.produits[1]).nom} ${M(q.prixProduits[1])} ${T.etalPaieLesDeux}` : `${P(q.produits[0]).achete} ${P(q.produits[0]).coute} ${M(q.prix)}${q.type === "rendre" ? ` ${T.etalRendre[q.billet]}` : ""}`;
            const att = q.type === "poser" ? q.valeur : q.type === "rendre" ? q.billet - q.prix : q.prix, sol = solution(cfg, q.prix ?? 0, q.portefeuille, q.valeur) ?? [];
            const forme = `${q.type === "poser" ? `poser ${montantEcrit(q.valeur)}` : q.type === "rendre" ? `${montantEcrit(q.prix)} payés avec ${montantEcrit(q.billet)}` : `${q.produits.join(" et ")} à ${montantEcrit(q.prix)}`} (niveau ${q.niveau}${q.revient ? ", revient" : ""}) · portefeuille ${q.portefeuille.map(montantEcrit).join(" ")}`;
            if (q.guide) { row({ cle: `exemple:${att}`, forme: `EXEMPLE GUIDÉ : ${forme}`, voix: `${cons}${phrase} ${T.etalExemple}`, attendue: "", donnee: `(le pêcheur paie : ${soucoupeTexte(sol)})` }); add(D.demo + 8000); return { q, ok: true, ms: 0, listens: 1 }; }
            const faux = C.hasard || R() < C.erreur, nsp = faux && R() < C.nsp;
            let ok = !faux, corrigee = false, code = null, donnee;
            if (nsp) { code = "NSP"; donnee = "je ne sais pas"; }
            else if (q.type === "rendre") { const v = ok ? att / 100 : q.prix / 100; donnee = v; if (!ok) code = "M5"; }
            else if (!ok) { const vs = q.type === "poser" ? [q.portefeuille.find((v) => v !== q.valeur)] : sol.length > 1 ? sol.slice(0, -1) : [Math.min(...q.portefeuille)]; const j = juger(cfg, q, vs); code = j.code ?? "M1"; donnee = soucoupeTexte(vs); corrigee = ["M1", "M2", "M3"].includes(code) && R() < 0.6; }
            else donnee = soucoupeTexte(sol);
            const x = row({ cle: runner.cand(q).cle, forme, voix: `${cons}${phrase}`, attendue: att, donnee });
            add(D.consigne + 4000 + C.ms * 2 + (ok ? D.bravo + 3000 : corrigee ? D.correction : D.correction + 6000));
            if (code === "M1") x.suite.push(`« ${T.etalManque} ${M(Math.max(10, (q.prix ?? 0) - sol.slice(0, -1).reduce((a, b) => a + b, 0)))} ${T.etalComplete} »`);
            if (code === "M5") x.suite.push(`« ${T.etalRendPrix} » puis la ligne : « ${q.prix / 100} … ${q.billet / 100} », « ${T.etalCaFait} ${M(att)} »`);
            if (code === "M7") x.suite.push(`« ${T.etalCestUn[q.portefeuille.find((v) => v !== q.valeur)]} » puis « ${T.etalCestCeluiLa[q.valeur]} »`);
            if (nsp) x.suite.push(`« ${T.erreur.NSP} » « ${T.etalCorrection} » ${soucoupeTexte(sol)}`);
            return { q, ok, corrigee, code, nsp, soucoupe: [], ms: C.ms * 2, listens: 1, essais: ok ? 1 : 2 };
          } };
          await runNotion({ ...ctx, step: { ...ctx.step, ...(ctx.step.module6 ?? {}) }, runner, screen: scr, rnd: R, lesson }); cur = null; return;
        }
        // lot « Multiplication » : la consigne et la correction de l'écran lui-même (mult/screen.js)
        if (m === 5) {
          const baseMs5 = median((await store.setting("tempsDeBase"))?.mesures ?? []) ?? module2.base.defautS * 1000;
          const runner = wrapRunner(await new Module5Runner({ store, content: module5, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, choix: ctx.session.choix?.module === 5 ? ctx.session.choix.niveau : null, baseMs: baseMs5 }).load());
          const scr = { ask: async (q) => {
            const good = multAnswer(q), guide = !!q.guide, r = guide ? { value: good } : reponseNombre(R, C, good, { max: 100, pieges: (q.forme ?? "directe") === "directe" ? [q.a + q.b, q.n - q.b, q.n + q.b] : [q.n] }), ok = r.value === good;
            const image = q.image === "toujours" ? "rangées affichées" : q.aideDEmblee ? "rangées comptées d'emblée" : q.image === "non" ? "sans image" : "rangées au coquillage";
            const pre = guide ? `[exemple guidé : ${FM.rangees(q.a, q.b)} … ${q.n} ; ${fill(T.multCorrection, { a: q.a, b: q.b, n: q.n })} ${T.aToiFait}] ` : "";
            const x = row({ cle: multKey(q), forme: `${multQuestion(q)}${(q.forme ?? "directe") === "directe" && !q.addition ? " = ?" : ""} (niveau ${q.niveau}, ${image}${q.revient ? ", revient" : ""})`, voix: pre + FM.consigne(q), attendue: good, donnee: guide ? `${good} (guidé)` : r.nsp ? "je ne sais pas" : r.value });
            add(D.consigne + (guide ? D.demo : 0) + (q.aideDEmblee ? 6000 : 0) + C.ms + (ok ? D.bravo : D.correction));
            const code = r.nsp ? "NSP" : ok ? null : classifyMult(q, r.value);
            if (!ok) x.suite.push(`correction ${code} : « ${r.nsp ? T.faitNSP : code === "M1" && !q.addition ? T.erreurMult.M1 : T.erreur.autre} ${FM.rangees(q.a, q.b)} [les rangées comptées] ${fill(T.multCorrection, { a: q.a, b: q.b, n: q.n })} »`);
            return { q, value: r.value, ok, code, ms: C.ms, listens: 1, aide: !!q.aideDEmblee, nsp: !!r.nsp };
          } };
          await runNotion({ ...ctx, step: { ...ctx.step, ...(ctx.step.module5 ?? {}) }, runner, screen: scr, rnd: R, lesson }); cur = null; return;
        }
        const baseMs = median((await store.setting("tempsDeBase"))?.mesures ?? []) ?? module2.base.defautS * 1000;
        const runner = wrapRunner(await new Module3Runner({ store, content: module3, content2: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, choix: ctx.session.choix?.module === 3 ? ctx.session.choix.niveau : null, baseMs }).load());
        const scr = { ask: async (q) => {
          const good = answerCalc(q), mode = q.remplir ? "calcul guidé (l'enfant remplit chaque caillou)" : q.aideDEmblee ? "chemin affiché d'emblée" : q.cheminMode === "non" ? "sans chemin" : "chemin au coquillage";
          let r, ok;
          if (q.remplir) {
            const pas = q.chemin.map((st) => { const rr = reponseNombre(R, C, st.a, { max: 100 }); return { st, rr }; });
            ok = pas.every((p) => p.rr.value === p.st.a); r = { value: ok ? good : null, detail: pas.map((p) => `${p.st.op === "-" ? "−" : "+"}${p.st.k}→${p.rr.nsp ? "?" : p.rr.value}${p.rr.value === p.st.a ? "" : "✗"}`).join(" ") };
          } else { r = reponseNombre(R, C, good, { max: 99, pieges: piegesCalc(q) }); ok = r.value === good; }
          const x = row({ cle: calcKey(q), forme: `${fait({ ...q, forme: q.forme })} (niveau ${q.niveau}, ${q.support}, ${mode}${q.revient ? ", revient" : ""}) · chemin ${cheminTxt(q)}`, voix: q.remplir ? `${consigneCalc({ ...q, remplir: false })} ${T.calcGuide} [puis, caillou par caillou : ${q.chemin.map((st) => fill(st.op === "-" ? T.calcPont.moins : T.calcPont.plus, { k: st.k })).join(" ")}]` : consigneCalc(q), attendue: good, donnee: q.remplir ? r.detail : r.nsp ? "je ne sais pas" : r.value });
          add(D.consigne + C.ms * (q.remplir ? q.chemin.length : 1) + (ok ? D.bravo : D.correctionCalc) + (q.aideDEmblee ? 4000 : 0));
          const code = r.nsp ? "NSP" : ok ? null : q.remplir ? "autre" : classifyCalc({ ...q, forme: q.forme === "trouDroite" ? "trou" : "directe" }, r.value);
          if (!ok && !q.remplir) { const E = T.erreurCalc, first = r.nsp ? T.faitNSP : code === "C1" ? (q.op === "-" ? E.C1moins : E.C1) : code === "C4" ? fill(E.C4, { u: q.a % 10, b: q.b }) : code === "C5" ? fill(E.C5, { b: q.b, u: q.a % 10 }) : code === "C3" ? E.C3 : E.autre; x.suite.push(`correction ${code} : « ${first} » + la procédure ${q.support === "mur" ? "sur le mur (le poisson)" : "sur le chemin"} : ${cheminTxt(q)} ; « ${fill(T.bonneReponse, { n: good })} »`); }
          if (!ok && q.remplir) x.suite.push("les cailloux faux : « C'était … » à chaque caillou");
          return { q, value: r.value, ok, code, ms: C.ms, listens: 1, aide: !!q.aideDEmblee, nsp: !!r.nsp };
        } };
        await runNotion({ ...ctx, step: { ...ctx.step, ...(ctx.step.module3 ?? {}) }, runner, screen: scr, rnd: R, lesson }); cur = null;
      },
      defi: async (ctx) => {
        etape = "défi"; cur = null;
        const w = await new Warmup({ store, content: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => "conseille" }).load(); w.defi = true;
        const view = { show() {}, start() {}, stop() {}, pearl() {}, record() {} };
        const r = await runChallenge({ ...ctx, warmup: w, screen: defiScreen, view, store, rnd: R, stars: seance.etoiles, say: async () => add(D.consigne), now: clock, pause: async (ms) => add(ms), timer: () => new Promise(() => {}) });
        cur = null; suite(`défi : ${r.score} bonne(s) réponse(s)${r.nouveau ? ", nouveau record (+5 étoiles)" : ""}`);
      },
      recompense: async ({ session }) => {
        etape = "récompense"; cur = null;
        await session.stars(seance.etoiles.seanceTerminee, "fin"); const b = await rewards.endOfSession(session.rec.debut); if (b) await session.stars(b, "série");
        const others = (await store.all("seances")).filter((x) => x.terminee && !x.libre && x.id !== session.id).map((x) => x.debut);
        if (goldenStar([...others, session.rec.debut], session.rec.debut, cartes.semaine)) { await rewards.special("dorees"); suite("étoile dorée"); }
        await rewards.collectFree();
        const zone = async () => { const z = await rewards.openZone(t); if (z) suite(`zone ouverte : ${z.id}`); };
        const won = (g, dore = false) => suite(`carte ${g.carte.id}${dore ? " (coquillage doré)" : ""}${g.nouvelle ? " (nouvelle)" : " (rendue brillante)"}${g.brillante && (g.parTirage || g.devientBrillante) ? " (brillante)" : ""}`);
        await zone();
        if (rewards.goldenCard(t)) won(await rewards.openGolden(R, t), true);
        for (let k = 0; k < cartes.coquillage.parSeance && rewards.canOpen(); k++) { if (k) await zone(); const g = await rewards.openShell(R, t); if (!g) break; won(g); }
        await zone();
      },
    } });
    // chaque gain d'étoiles, attaché à la question qui le donne
    const stars0 = s.stars.bind(s);
    s.stars = async (n, raison) => { const before = s.rec?.etoiles ?? 0; await stars0(n, raison); const d = (s.rec?.etoiles ?? 0) - before; if (d) suite(`+${d}★${raison === "bonne réponse" ? "" : ` (${raison})`}`); };
    const lvl0 = s.levelUp.bind(s); s.levelUp = async () => { await lvl0(); suite("étoile arc-en-ciel (niveau franchi)"); };
    const rec = await s.run();
    return { rows, lessons, extra, rec, depart, reserve: rewards.total, cartes: rewards.count };
  } finally { Date.now = realNow; }
}

// ---------------------------------------------------------------- les mesures en tête de séquence
function mesures(res) {
  const q = res.rows.filter((r) => r.etape === "notion" && typeof r.attendue === "number"), a = q.map((r) => r.attendue);
  const distinct = new Set(a).size, same = a.slice(1).filter((v, i) => v === a[i]).length;
  // la plus longue suite prévisible : même réponse, ou des réponses qui avancent d'un même pas (±1, ±le pas de la ligne, ±10)
  let best = { n: a.length ? 1 : 0, from: 0, pas: 0 };
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
    const d = a[i + 1] - a[i]; if (j === i + 1 && !(d === 0 || Math.abs(d) <= 10)) break;
    if (a[j] - a[j - 1] !== d) break;
    if (j - i + 1 > best.n) best = { n: j - i + 1, from: i, pas: d };
  }
  return { n: a.length, distinct, same: a.length > 1 ? same / (a.length - 1) : 0, suite: best.n >= 2 ? `${best.n} (${a.slice(best.from, best.from + best.n).join(", ")} : ${best.pas === 0 ? "même réponse" : `pas de ${best.pas > 0 ? "+" : ""}${best.pas}`})` : "aucune" };
}
const cell = (s) => String(s ?? "").replace(/\|/g, "/").replace(/\n/g, " ");
function texteSequence(title, comp, res, m, cmp) {
  const L = [];
  L.push(`### ${title} · ${COMPORTEMENTS[comp].nom}`, "");
  L.push(`- comportement : ${COMPORTEMENTS[comp].dit}`);
  L.push(`- notion du jour : ${m.n} questions ; **${m.distinct} réponses attendues différentes** ; même réponse que la précédente : **${Math.round(m.same * 100)} %** ; plus longue suite prévisible : **${m.suite}**`);
  L.push(`- leçons jouées : ${Object.entries(res.lessons).map(([k, v]) => `${k} × ${v}`).join(", ") || "aucune"}`);
  L.push(`- étoiles de la séance : **${res.rec.etoiles}** (appliquée ${cmp.appliquee}, réelle ${cmp.reelle}, pressée ${cmp.pressee}) ; cran à la fin : ${CRAN_NOM[res.rec.cran] ?? res.rec.cran} ; réussite ${Math.round((res.rec.reussite ?? 0) * 100)} % sur ${res.rec.questions} réponses ; durée simulée ${Math.round(res.rec.dureeS / 6) / 10} min ; étapes : ${res.rec.etapes.map((e) => `${e.id}${e.sautee ? ` (sautée : ${e.sautee})` : ""}`).join(", ")}`);
  L.push("", "| n° | étape | forme affichée | voix | attendue | donnée | ce qui suit |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const r of res.rows) L.push(`| ${r.n} | ${r.etape} | ${cell(r.forme)} | ${cell(r.voix)} | ${cell(r.attendue)} | ${cell(r.donnee)} | ${cell(r.suite.join(" ; "))} |`);
  if (res.extra.length) L.push("", `Récompense et fin : ${res.extra.join(" ; ")}`);
  L.push("");
  return L.join("\n");
}

// ---------------------------------------------------------------- tout
const EXOS = [
  ...module1.niveaux.map((c) => ({ id: `ligne-${String(c.niveau).padStart(2, "0")}`, choix: { module: 1, niveau: c.niveau }, nom: `Ligne graduée, niveau ${c.niveau}` })),
  ...module2.familles.map((f) => ({ id: `additions-famille-${f.id}`, choix: { module: 2, famille: f.id }, nom: `Additions, famille ${f.id} (${f.nom})` })),
  ...module3.niveaux.map((c) => ({ id: `calcul-${c.niveau}`, choix: { module: 3, niveau: c.niveau }, nom: `Calcul rapide, niveau ${c.niveau} (${c.type}, ${c.support})` })),
  ...module5.niveaux.map((c) => ({ id: `multiplication-${c.niveau}`, choix: { module: 5, niveau: c.niveau }, nom: `Multiplication, niveau ${c.niveau} (${c.type}${c.table ? ` ${c.table}` : ""})` })),
  ...module6.niveaux.map((c) => ({ id: `etal-${String(c.niveau).padStart(2, "0")}`, choix: { module: 6, niveau: c.niveau }, nom: `Étal du pêcheur, niveau ${c.niveau} (${c.type})`, passages: c.type === "poser" ? c.valeurs.length : undefined })),
  ...module4.niveaux.map((c) => ({ id: `voiliers-${c.niveau}`, choix: { module: 4, niveau: c.niveau }, nom: `Voiliers, niveau ${c.niveau} (${c.bouees} bouées, ${c.ecart}, ${c.place})`, passages: c.ecart === "double" ? 12 : c.bouees + 1 })),
].filter((e) => !only || (e.choix.module === only[0] && (only[1] == null || (e.choix.niveau ?? e.choix.famille) === only[1]))); // (--seulement 4 : tout le module 4)
if (TEST) {
  const fails = [], combos = new Set(), courtes = []; let n = 0;
  for (const base of ["neuve", "mois"]) for (const ex of EXOS) for (const cran of CRANS) for (const comp of ["appliquee", "reelle"]) {
    const res = await uneSeance({ base, choix: ex.choix, cran, comp }), seq = res.rows.filter((r) => r.etape === "notion" && typeof r.attendue === "number").map((r) => ({ cle: r.cle, reponse: r.attendue }));
    // (lot « Les voiliers » : avec 3 bouées, il n'y a que 4 passages : la réponse prend au moins autant de valeurs qu'il y en a)
    const bad = checkSequence(seq, { ...seance.variete, valeursMin: Math.min(seance.variete.valeursMin, ex.passages ?? Infinity) }); n++; combos.add(`${ex.id}:${cran}`); courtes.push([seq.length, `${base} · ${ex.nom} · ${CRAN_NOM[cran]} · ${COMPORTEMENTS[comp].nom} (${Math.round(res.rec.dureeS / 6) / 10} min simulées)`]);
    if (bad.length) fails.push(`${base} · ${ex.nom} · ${CRAN_NOM[cran]} · ${COMPORTEMENTS[comp].nom} (${seq.length} questions) : ${bad.join(" ; ")}`);
  }
  console.log(`${combos.size} combinaisons exercice × niveau × cran, ${n} séances simulées ; ${fails.length} en défaut`);
  // les mesures du tableau « Recette du lot 3 bis » (docs/SPEC-LOT3BIS.md) qui se lisent sur les séquences
  const M = [];
  for (const base of ["neuve", "mois"]) {
    // A1 : amis de 10, la part des questions à trou (faits de la règle, notion du jour), à chaque cran
    for (const cran of CRANS) { const r = await uneSeance({ base, choix: { module: 2, famille: 3 }, cran, comp: "appliquee" }), f3 = r.rows.filter((x) => x.etape === "notion" && /famille/.test(x.forme ?? "") && (() => { const m = /^(\d+|\?) \+ (\d+|\?) = (\d+|\?)/.exec(x.forme); return m && (m[3] === "10" || (m[1] !== "?" && m[2] !== "?" && +m[1] + +m[2] === 10)); })()); M.push(`A1 · ${base} · famille 3 · ${CRAN_NOM[cran]} : ${f3.filter((x) => /\?/.test(x.forme.split(" (")[0].replace(/= \?$/, ""))).length} questions à trou sur ${f3.length}`); }
    // A2 : calcul « très dur » aux niveaux à pas fixe : réponses différentes, étoiles de « pressée » comparées à « appliquée »
    for (const niv of [1, 2, 3, 6]) { const ap = await uneSeance({ base, choix: { module: 3, niveau: niv }, cran: "tresdur", comp: "appliquee" }), pr = await uneSeance({ base, choix: { module: 3, niveau: niv }, cran: "tresdur", comp: "pressee" }), rep = new Set(ap.rows.filter((x) => x.etape === "notion" && typeof x.attendue === "number").map((x) => x.attendue)).size; M.push(`A2 · ${base} · calcul ${niv} très dur : ${rep} réponses différentes ; étoiles pressée ${pr.rec.etoiles} / appliquée ${ap.rec.etoiles} = ${Math.round((pr.rec.etoiles / ap.rec.etoiles) * 100)} %`); }
    // A3 : ligne « plus facile » des niveaux 2, 5, 9 : cibles différentes, et l'ordre de deux tours consécutifs
    for (const niv of [2, 5, 9]) { const r = await uneSeance({ base, choix: { module: 1, niveau: niv }, cran: "facile", comp: "appliquee" }), a = r.rows.filter((x) => x.etape === "notion" && typeof x.attendue === "number").map((x) => x.attendue), k = new Set(a).size, tours = []; for (let i = 0; i + k <= a.length; i += k) tours.push(a.slice(i, i + k).join(" ")); M.push(`A3 · ${base} · ligne ${niv} plus facile : ${k} cibles ; tours ${tours.join(" | ")} ; même ordre deux tours de suite : ${tours.some((t, i) => i && t === tours[i - 1]) ? "OUI" : "jamais"}`); }
  }
  console.log("mesures de la recette du lot 3 bis :"); for (const m of M) console.log(`  ${m}`);
  for (const f of fails) console.log(`  ✗ ${f}`);
  console.log("les notions du jour les plus courtes :"); for (const [k, t] of courtes.sort((x, y) => x[0] - y[0]).slice(0, 8)) console.log(`  ${k} questions : ${t}`);
  process.exit(fails.length ? 1 : 0);
}
const BASES = { neuve: "base neuve (premier lancement)", mois: "un mois (tools/sauvegarde-test.mjs reel 2 4)" };
const synth = ["| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"];
const star = { neuve: [], mois: [] };
for (const [base, baseNom] of Object.entries(BASES)) {
  mkdirSync(join(OUT, base), { recursive: true });
  for (const ex of EXOS) {
    const parts = [`# ${ex.nom} · ${baseNom}`, "", "Texte des séances générées par le moteur (tests/recette-fonctionnelle/b-sequences.mjs). Chaque ligne : une question (ou une leçon). « ce qui suit » : correction (avec son code d'erreur), leçon relancée, montée, étoiles gagnées (+1★ : une bonne réponse, au multiplicateur du cran). Les mesures d'en-tête portent sur la notion du jour (l'exercice choisi).", ""];
    let depart = null;
    for (const cran of CRANS) {
      const res = {}; for (const comp of Object.keys(COMPORTEMENTS)) res[comp] = await uneSeance({ base, choix: ex.choix, cran, comp });
      depart ??= res.appliquee.depart;
      const cmp = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.rec.etoiles]));
      star[base].push({ ex: ex.nom, cran, ...cmp });
      parts.push(`## Cran « ${CRAN_NOM[cran]} »`, "");
      for (const comp of Object.keys(COMPORTEMENTS)) {
        const m = mesures(res[comp]); parts.push(texteSequence(`${ex.nom}, cran « ${CRAN_NOM[cran]} »`, comp, res[comp], m, cmp));
        synth.push(`| ${base} | ${ex.nom} | ${CRAN_NOM[cran]} | ${COMPORTEMENTS[comp].nom} | ${m.n} | ${m.distinct} | ${Math.round(m.same * 100)} % | ${m.suite} | ${Object.entries(res[comp].lessons).map(([k, v]) => `${k}×${v}`).join(" ") || "–"} | ${res[comp].rec.etoiles} | ${Math.round((res[comp].rec.reussite ?? 0) * 100)} % | ${CRAN_NOM[res[comp].rec.cran] ?? res[comp].rec.cran} |`);
      }
    }
    parts.splice(2, 0, `Point de départ de la base : ligne graduée niveau conseillé ${depart.ligne} ; familles ouvertes ${depart.familles.join(", ")}, acquises ${depart.acquises.join(", ") || "aucune"} ; calcul rapide, niveaux acquis ${depart.calcAcquis.join(", ") || "aucun"}.`, "");
    writeFileSync(join(OUT, base, `${ex.id}.md`), parts.join("\n"));
    console.log(base, ex.id);
  }
}
const starTable = (b) => ["| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |", "| --- | --- | --- | --- | --- | --- |", ...star[b].map((s) => `| ${s.ex} | ${CRAN_NOM[s.cran]} | ${s.appliquee} | ${s.reelle} | ${s.pressee} | ${s.appliquee ? Math.round((s.pressee / s.appliquee) * 100) : "–"} % |`)].join("\n");
writeFileSync(join(OUT, "SYNTHESE.md"), [
  "# Partie B · synthèse des séquences", "",
  "Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).", "",
  "Comportements : " + Object.values(COMPORTEMENTS).map((c) => `**${c.nom}** : ${c.dit}`).join(" ; ") + ". Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.", "",
  "Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.", "",
  "## Étoiles : pressée comparée à appliquée", "", "### Base neuve", "", starTable("neuve"), "", "### Un mois", "", starTable("mois"), "",
  "## Toutes les séquences", "", ...synth, "",
].join("\n"));
// l'index de la partie (INDEX.md le rassemble avec les autres : tests/recette-fonctionnelle/commun.mjs, ecrireIndex)
const lignes = [["SYNTHESE.md", "une ligne par séance simulée (base × exercice × cran × comportement) : réponses différentes, répétitions, suites prévisibles, leçons, étoiles ; et le tableau des étoiles « pressée » comparées à « appliquée »"]];
for (const base of Object.keys(BASES)) for (const f of readdirSync(join(OUT, base)).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }))) lignes.push([`${base}/${f}`, `${BASES[base]} : ${f.replace(/\.md$/, "").replace(/-/g, " ")}, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun`]);
writeFileSync(join(OUT, "_index.json"), JSON.stringify({ titre: "Partie B · les séquences de questions", intro: "Le texte des séances telles que le moteur les génère (runners de l'application, sans navigateur) : pour chaque exercice × niveau (ou famille) × cran, en base neuve et en « un mois », avec trois comportements de l'enfant. Commencer par `SYNTHESE.md`.", lignes }, null, 1));
console.log("fini");
