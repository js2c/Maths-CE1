// LA NOTION DU JOUR (docs/SPEC.md, « Cadre d'une séance », étape 3) : la leçon animée si le niveau est
// nouveau, sinon deux exemples guidés ; puis 8 à 10 questions, dans la limite de la durée de l'étape et
// du plafond de la séance ; enfin, si la dernière réponse était fausse, une ou deux questions plus
// simples pour finir sur une réussite. Indépendant du module : `runner` choisit et enregistre les
// questions (next, record, entryLesson, finish), `screen.ask` les pose.
// lesson(id, raison) : joue une leçon animée, renvoie true si elle a été regardée jusqu'au bout. Toute
// leçon (celle du niveau, ou relancée par une erreur répétée ou une difficulté) finit par « À toi ! » et
// un premier exercice guidé, au format « lire » de la leçon.
export async function runNotion({ session, step, end, runner, screen, lesson = async () => false, rnd = Math.random }) {
  const [a, b] = step.questions, n = a + Math.floor(rnd() * (b - a + 1)), E = session.c.etoiles;
  // une question ; `after` : la leçon qui vient d'être jouée (le premier exercice guidé qui la suit)
  const one = async (guide = false, after = null) => {
    const { q, cfg } = runner.next({ guide, format: after ? "lire" : null }), r = await screen.ask(q, cfg, { guide, lesson: after }), { etoiles, events } = await runner.record(r, cfg);
    await session.answered(r.ok);
    await session.stars(etoiles, q.revient && r.ok ? "erreur corrigée" : "bonne réponse");
    for (const e of events) if (e.type === "lecon" && !session.over(end)) await watch(e.id, e.raison);
    return r;
  };
  // une leçon animée ; regardée jusqu'au bout : 3 étoiles, puis « À toi ! » et un premier exercice guidé
  const watch = async (id, raison) => {
    const seen = await lesson(id, raison);
    if (seen) { await runner.lessonSeen(id); await session.stars(E.lecon, `leçon ${id}`); if (!session.over(end)) await one(true, id); }
    return seen;
  };
  // la leçon du niveau la première fois, sinon deux exemples guidés
  const entry = runner.entryLesson(), seen = entry ? await watch(entry, "niveau") : false;
  for (let i = 0; i < (seen ? 0 : step.guides ?? 0) && !session.over(end); i++) await one(true);
  let last = null;
  for (let k = 0; k < n && !session.over(end); k++) last = await one();
  // finir sur une réussite
  for (let k = 0; last && !last.ok && k < session.c.finirSurReussite.essaisMax; k++) { runner.simpler = true; last = await one(); }
  return runner.finish();
}
