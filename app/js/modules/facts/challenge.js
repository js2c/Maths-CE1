// MODULE 2 · LE DÉFI RECORD (lot 2, étape 7 ; docs/SPEC.md, « Défi record » ; docs/SPEC-LOT2.md, sections 2 et 3).
// Une minute de faits d'addition, seulement ceux que l'enfant sait déjà (boîte 3 ou plus), mélangés, au pavé
// numérique ; le score (les bonnes réponses) est comparé à son propre record, jamais à une norme ; un nouveau
// record rapporte 5 étoiles. Le seul chronomètre visible de l'application : une bulle qui se vide, sans
// chiffre de secondes (modules/facts/challengeView.js). Les réponses suivent la révision espacée comme
// ailleurs (une boîte au plus par séance, échauffement, notion du jour et défi confondus) et sont notées
// `defi: true`. Le record est rangé dans le magasin « recompenses » (fiche « defi »). Réglages : étape
// « defi » de content/seance.json (dureeS, boiteMin, apresErreurMs) et etoiles.nouveauRecord.
// Fonctions pures en haut (tests : tests/unit/defi.test.mjs), le déroulement dans la séance en bas.
import { clock, wait } from "../../engine/clock.js";

// les faits du défi : ceux qui sont en boîte `boiteMin` ou plus
export const challengeFacts = (facts, boiteMin = 3) => facts.filter((f) => f.boite >= boiteMin);
// l'ordre des questions : les faits mélangés, puis de nouveau mélangés quand ils ont tous été posés, sans
// jamais le même fait deux fois de suite ; `n` questions au plus (bien plus qu'on n'en fait en une minute)
export function challengeQueue(facts, rnd = Math.random, n = 80) {
  const out = [];
  if (!facts.length) return out;
  while (out.length < n) {
    const deck = [...facts];
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    if (out.length && deck.length > 1 && deck[0].fait === out.at(-1).fait) deck.push(deck.shift());
    out.push(...deck);
  }
  return out.slice(0, n);
}
// la fiche du record après un défi de score `score` : { st, premier, nouveau, egal, ancien }. Le premier défi
// fait le premier record (s'il a au moins une bonne réponse) ; ensuite, seul un score plus haut le bat.
export function nextRecord(prev, score, { now = Date.now(), seance = null } = {}) {
  const ancien = prev?.record ?? null, premier = ancien == null && score > 0, nouveau = premier || (ancien != null && score > ancien);
  const st = { id: "defi", ...(prev ?? {}), record: nouveau ? score : ancien, ...(nouveau ? { date: now, seance } : {}), scores: [...(prev?.scores ?? []), { t: now, score, seance }] };
  return { st, premier, nouveau, egal: ancien != null && score === ancien && score > 0, ancien };
}

// ---------------------------------------------------------------- le défi dans la séance
// warmup : le moteur des faits (warmup.js, marqué `defi`), pour la forme des questions et l'enregistrement ;
// screen : l'écran des additions (askDefi, cancel) ; view : la bulle-sablier et les perles ;
// say(clé, valeurs) : ce que dit la voix ; octo : la pieuvre ; now, pause, timer : l'horloge (active) ; la
// simulation (tests/sim-recette.mjs) en donne une virtuelle, où le temps n'avance qu'avec les réponses
const minuteur = (now) => (end) => new Promise((res) => { const tick = () => (now() >= end ? res("fin") : wait(Math.min(250, Math.max(20, end - now()))).then(tick)); tick(); });
export async function runChallenge({ session, step, warmup, screen, view, say, octo, store, rnd = Math.random, stars = {}, now = () => clock.now(), pause = wait, timer = minuteur(now) }) {
  const facts = challengeFacts(warmup.facts, step.boiteMin ?? 3), queue = challengeQueue(facts, rnd), dur = (step.dureeS ?? 60) * 1000;
  const prev = (await store.get("recompenses", "defi")) ?? null;
  screen.show(true); screen.keys(false);
  view.show(true, { record: prev?.record ?? null });
  await say(prev ? "defiIntro" : "defiIntroPremier");
  await say("defiPartez");
  screen.keys(true);
  let score = 0, posees = 0; const t0 = now(), left = () => dur - (now() - t0);
  view.start(t0, dur);
  const fin = timer(t0 + dur);
  for (const f of queue) {
    if (left() <= 0) break;
    const q = warmup.prepare({ ...f, fait: f.fait, a: f.a, b: f.b });
    const r = await Promise.race([screen.askDefi(q, { apresErreurMs: step.apresErreurMs }), fin]);
    if (r === "fin" || r?.timeout) { screen.cancel(); break; }
    posees++;
    const res = await warmup.record(q, r, []);
    if (res.juste) { score++; view.pearl(score); }
    await session.answered(res.juste, { protect: false });
    if (res.juste) await session.stars(1, "bonne réponse");
    // le petit retour (bulle claire, ou la bonne réponse montrée un instant) ; le temps continue de couler
    if (await Promise.race([r.after, fin]) === "fin") break;
  }
  view.stop(); screen.keys(false); screen.blank?.();
  // le score et le record
  const { st, premier, nouveau, egal, ancien } = nextRecord(prev, score, { now: Date.now(), seance: session.id });
  await store.put("recompenses", st);
  session.rec.defi = { score, questions: posees, record: st.record, ancien, nouveauRecord: nouveau }; await session.save();
  // (lot 3 bis, B6 ; R14) la fin est dite et montrée : le pavé est rangé, les perles avancent jusqu'au score, le drapeau du
  // record est planté ; « Nouveau record ! 12 perles ! », « Record égalé ! », ou « Presque ! Tu as fait 9 perles. »
  const fini = say("defiFini");
  const shown = view.finale?.(score, nouveau ? score : ancien ?? null);
  await fini; await shown;
  const un = score === 1;
  if (nouveau) {
    octo?.play("rejouir"); view.record(score, true);
    await say(un ? "defiNouveauRecordUn" : "defiNouveauRecord", { n: score });
    if (premier) await say("defiPremierRecord");
    await session.stars(stars.nouveauRecord ?? 5, "nouveau record");
  } else if (score === 0) await say("defiZero");
  else {
    octo?.play(egal ? "rejouir" : "encourager");
    await say(egal ? (un ? "defiEgalUn" : "defiEgal") : (un ? "defiPresqueUn" : "defiPresque"), { n: score });
  }
  await pause(600);
  view.show(false); screen.leave();
  return { score, nouveau };
}
