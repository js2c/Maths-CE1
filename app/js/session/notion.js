// LA NOTION DU JOUR (docs/SPEC.md, « Cadre d'une séance », étape 3) : la leçon animée si le niveau est
// nouveau, sinon deux exemples guidés ; puis 8 à 10 questions, dans la limite de la durée de l'étape et
// du plafond de la séance ; enfin, si la dernière réponse était fausse, une ou deux questions plus
// simples pour finir sur une réussite. Indépendant du module : `runner` choisit et enregistre les
// questions (next, record, entryLesson, finish), `screen.ask` les pose.
// lesson(id, raison) : joue une leçon animée, renvoie { vue, passee, … } (noté dans la séance) : vue si elle a été regardée
// jusqu'au bout (3 étoiles), passee si l'enfant l'a passée (bouton « passer », dès la première vue :
// pas d'étoiles). Toute leçon (celle du niveau, ou relancée par une erreur répétée ou une
// difficulté), regardée ou passée, finit par « À toi ! » et un premier exercice guidé, au format « lire ».
// (décision du parent du 17 octobre 2026) LA REPRISE À LA QUESTION PRÈS : après chaque question, et dès qu'une question est posée,
// l'étape écrit son point de reprise dans la fiche de la séance (session.notePoint) : ses compteurs (questions prévues et faites,
// exemples guidés faits, leçon d'entrée vue, essais pour finir sur une réussite), l'état de l'exercice (session/instantane.js) et
// la question en cours. La réponse de l'enfant y est ajoutée à l'instant où elle est donnée, avant la correction
// (session.noteReponse, appelé par l'écran : `app.surReponse`). Après un rechargement, la séance reprise (session.point) : une
// question en cours sans réponse est reposée telle quelle ; une réponse donnée (la correction était peut-être à l'écran) est
// enregistrée comme si la correction avait fini, et c'est la question suivante ; une leçon en cours est rejouée.
// `screen.finaliser(q, brute)` : la réponse telle que `screen.ask` l'aurait rendue (les écrans des additions, du calcul rapide
// et de la multiplication la complètent après coup : bonne ou non, code d'erreur).
import { instantane, restaurer, enDonnees, donnees } from "./instantane.js";
export async function runNotion({ session, step, end, runner, screen, lesson = async () => ({ vue: false }), rnd = Math.random }) {
  const P = session.point?.(step.id) ?? null, E = session.c.etoiles;
  const [a, b] = step.questions;
  // l'avancement de l'étape : `n` questions prévues, `k` faites, `g` exemples guidés faits, `entree` (la leçon d'entrée jouée),
  // `fin` (essais pour finir sur une réussite), `last` (la dernière réponse)
  const S = P ? { n: P.n, k: P.k, g: P.g, entree: P.entree, fin: P.fin, last: P.last, fini: false } : { n: a + Math.floor(rnd() * (b - a + 1)), k: 0, g: 0, entree: false, fin: 0, last: null, fini: false };
  if (P?.runner) restaurer(runner, P.runner);
  let reprise = P?.encours ?? null;
  const point = (encours, o) => session.notePoint?.({ etape: step.id, n: S.n, k: S.k, g: S.g, entree: S.entree, fin: S.fin, last: S.last ? { ok: !!S.last.ok } : null, runner: instantane(runner), encours }, o);
  // une question ; `after` : la leçon qui vient d'être jouée (le premier exercice guidé qui la suit) ; `phase` : ce qu'elle
  // fait avancer (« guide », « question », « fin », ou rien : l'exercice guidé qui suit une leçon)
  // (lot 3 bis, docs/SPEC-LOT3BIS.md, §0 : `next` renvoie null quand plus aucune question ne peut être posée sans reposer une
  // question déjà posée assez de fois ; la notion du jour s'arrête là)
  const one = async (guide = false, after = null, phase = null) => {
    // (lot « Recette de l'enfant », point 2) la séance interrompue (la pause, puis un autre exercice) : plus aucune question,
    // le déroulement reste figé (comme une attente abandonnée, engine/clock.js) ; sans quoi une suite qui n'attendait pas
    // l'horloge (l'enregistrement d'une réponse) posait encore la question suivante sur l'écran quitté
    if (session.stopped) return new Promise(() => {});
    let nx, brute = null;
    if (reprise?.q && (reprise.phase ?? null) === phase) {
      nx = { q: donnees(reprise.q), cfg: donnees(reprise.cfg) }; brute = reprise.reponse ? donnees(reprise.reponse) : null; reprise = null;
      // (la question reprise : l'écran redit sa consigne entière, comme à la première question ; non énumérable, pour ne pas être
      // enregistré avec la réponse)
      Object.defineProperty(nx.q, "repris", { value: true });
    }
    else {
      nx = runner.next({ guide, format: after ? "lire" : null });
      if (!nx) { S.fini = true; return null; }
      await point({ q: enDonnees(nx.q), cfg: enDonnees(nx.cfg), guide, after, phase });
    }
    const { q, cfg } = nx;
    session.enCours = q; // (la question posée, pour les parcours de test)
    let r;
    if (brute) r = screen.finaliser ? screen.finaliser(q, brute) : brute;
    else {
      session.surReponse = (x) => session.noteReponse?.(enDonnees(x));
      try { r = await screen.ask(q, cfg, { guide, lesson: after }); } finally { session.surReponse = null; }
    }
    const { etoiles, events } = await runner.record(r, cfg);
    if (phase === "guide") S.g++; else if (phase === "question") S.k++; else if (phase === "fin") S.fin++;
    if (phase === "question" || phase === "fin") S.last = r;
    await point(null, { sauver: false }); // (il part avec la réponse comptée, juste après)
    await session.answered(r.ok);
    await session.stars(etoiles, q.revient && r.ok ? "erreur corrigée" : "bonne réponse");
    for (const e of events) if (e.type === "montee") await session.levelUp();
    for (const e of events) if (e.type === "lecon" && !session.over(end)) await watch(e.id, e.raison);
    return r;
  };
  // une leçon animée ; regardée jusqu'au bout : 3 étoiles, puis « À toi ! » et un premier exercice guidé
  const watch = async (id, raison) => {
    runner.lessonPlayed?.(id); // une même leçon au plus une fois par séance
    await point({ lecon: id, raison });
    const r = await lesson(id, raison), seen = r === true || !!r?.vue;
    // notée dans l'enregistrement de la séance (historique du parent), vue, passée ou arrêtée
    if (r && typeof r === "object" && session.rec) { (session.rec.lecons ??= []).push({ id, raison, ...r }); await session.save(); }
    if (raison === "niveau") S.entree = seen || !!r?.passee;
    if (seen || r?.passee) {
      await runner.lessonSeen(id);
      if (seen) await session.stars(E.lecon, `leçon ${id}`);
      if (!session.over(end)) { if (raison !== "niveau") session.expect?.(session.progress.prevues + 1); await one(true, id); }
    }
    await point(null);
    return seen || !!r?.passee;
  };
  // la reprise d'une leçon en cours au rechargement : elle est rejouée ; l'exercice guidé qui suivait une leçon : reposé
  if (reprise?.lecon) { const l = reprise; reprise = null; await watch(l.lecon, l.raison); }
  // (et, relecture des demandes, constat 5 : une réponse donnée avant le rechargement est enregistrée même si le temps de l'étape est
  // écoulé ; les boucles, qui s'arrêtent sur le temps, ne la verraient pas)
  else if (reprise?.q && (!reprise.phase || (reprise.reponse && session.over(end)))) await one(reprise.phase ? reprise.phase === "guide" : true, reprise.after ?? null, reprise.phase ?? null);
  // la leçon du niveau la première fois, sinon deux exemples guidés
  const entry = P ? null : runner.entryLesson(), guides = step.guides ?? 0;
  if (!P) session.expect?.((entry ? 1 : guides) + S.n);
  const seen = P ? S.entree : entry ? await watch(entry, "niveau") : false;
  if (!seen && !P) session.expect?.(session.progress.faites + guides + S.n);
  for (; S.g < (seen ? 0 : guides) && !session.over(end) && !S.fini; ) if ((await one(true, null, "guide")) === null) break;
  for (; S.k < S.n && !session.over(end) && !S.fini; ) S.last = (await one(false, null, "question")) ?? S.last;
  // finir sur une réussite
  for (; S.last && !S.last.ok && !S.fini && S.fin < session.c.finirSurReussite.essaisMax; ) { runner.simpler = true; S.last = (await one(false, null, "fin")) ?? S.last; }
  reprise = null;
  return runner.finish();
}
