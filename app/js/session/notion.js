// LA NOTION DU JOUR (docs/SPEC.md, « Cadre d'une séance », étape 3) : la leçon animée si le niveau est
// nouveau, sinon deux exemples guidés ; puis 8 à 10 questions, dans la limite de la durée de l'étape et
// du plafond de la séance ; enfin, si la dernière réponse était fausse, une ou deux questions plus
// simples pour finir sur une réussite. Indépendant du module : `runner` choisit et enregistre les
// questions (next, record, entryLesson, finish), `screen.ask` les pose.
// lesson(id, raison) : joue une leçon animée, renvoie true si elle a été regardée jusqu'au bout.
export async function runNotion({ session, step, end, runner, screen, lesson = async () => false, rnd = Math.random }) {
  const [a, b] = step.questions, n = a + Math.floor(rnd() * (b - a + 1)), E = session.c.etoiles;
  const watch = async (id, raison) => { const seen = await lesson(id, raison); if (seen) { await runner.lessonSeen(id); await session.stars(E.lecon, `leçon ${id}`); } return seen; };
  const one = async (guide = false) => {
    const { q, cfg } = runner.next({ guide }), r = await screen.ask(q, cfg, { guide }), { etoiles, events } = await runner.record(r, cfg);
    await session.answered(r.ok);
    await session.stars(etoiles, q.revient && r.ok ? "erreur corrigée" : "bonne réponse");
    for (const e of events) if (e.type === "lecon") await watch(e.id, e.raison);
    return r;
  };
  // la leçon du niveau la première fois (elle finit par « À toi ! » et un exercice guidé), sinon deux
  // exemples guidés ; tant que les leçons ne sont pas construites (étape 9), lesson() renvoie false
  const entry = runner.entryLesson(), seen = entry ? await watch(entry, "niveau") : false;
  for (let i = 0; i < (seen ? 1 : step.guides ?? 0) && !session.over(end); i++) await one(true);
  let last = null;
  for (let k = 0; k < n && !session.over(end); k++) last = await one();
  // finir sur une réussite
  for (let k = 0; last && !last.ok && k < session.c.finirSurReussite.essaisMax; k++) { runner.simpler = true; last = await one(); }
  return runner.finish();
}
