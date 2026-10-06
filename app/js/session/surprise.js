// LA SURPRISE (docs/SPEC.md, « Règles de protection » ; docs/SPEC-LOT2.md, « Autres règles ») : environ une
// séance sur cinq, jamais deux séances de suite, à l'accueil :
// un visiteur traverse la scène (des personnages déjà dessinés : la tortue, un banc de poissons). Les cadeaux pour le
// récif (corail, gorgone, étoile de mer, coquille) sont supprimés depuis le 5 octobre 2026 (décision du parent).
// Elle ne rapporte pas d'étoiles. Le tirage vient de content/cartes.json (surprise.hasard) ; la règle
// « jamais deux de suite » regarde la séance précédente (champ `surprise` de son enregistrement).
import { wait } from "../engine/clock.js";

export const VISITORS = ["tortue", "poissons"];
// la surprise de cette séance, ou null. `previous` : l'enregistrement de la séance précédente
export function drawSurprise(rnd, { hasard }, previous) {
  if (previous?.surprise) return null;
  if (rnd() >= hasard) return null;
  return { type: "visite", id: VISITORS[Math.floor(rnd() * VISITORS.length)] };
}
// la séance précédente (hors entraînement libre) d'après les enregistrements
export const previousSession = (seances, id) => seances.filter((s) => !s.libre && s.id !== id).sort((a, b) => b.debut - a.debut)[0] ?? null;

// joue la surprise pendant que la voix la dit ; la promesse se résout quand la voix a fini et que le visiteur
// a traversé (4,5 s, dont la phrase occupe l'essentiel : il ne passe jamais devant la question suivante)
export async function playSurprise(app, s) {
  const { voice, text, ocean } = app;
  if (s.type === "visite" && VISITORS.includes(s.id)) {
    // dans le calque du décor, derrière la pieuvre, à mi-hauteur de l'eau
    const actors = s.id === "tortue" ? [{ name: "tortue.nage", y: 470, dx: 0, s: 1 }] : [0, 1, 2, 1, 0].map((k, i) => ({ name: `poisson.${k}.d`, y: 420 + (i % 3) * 44 + (i > 2 ? 22 : 0), dx: -Math.abs(i - 2) * 70 - (i > 2 ? 40 : 0), s: 0.8 }));
    const list = actors.map((v) => ({ ...v, a: ocean.spriteActor(ocean.backEl, v.name) })), t0 = performance.now() / 1000, dur = 4.5;
    let crossed; const gone = new Promise((r) => { crossed = r; });
    const tick = (t) => {
      const u = (t - t0) / dur;
      for (const v of list) {
        if (u >= 1) { v.a.show(false); continue; }
        const n = app.sprites.atlas.sprites[v.name].frames ?? 12;
        v.a.draw(Math.floor((t - t0) * 12) % n); v.a.moveTo(-200 + v.dx + 1700 * u, v.y + 10 * Math.sin((t - t0) * 2 + v.dx), v.s);
      }
      if (u >= 1) { ocean.front.splice(ocean.front.indexOf(tick), 1); for (const v of list) { v.a.remove(); ocean.actors.splice(ocean.actors.indexOf(v.a), 1); } crossed(); }
    };
    ocean.front.push(tick);
    await wait(600);
    ocean.mascotte.play("saluer");
    await Promise.all([voice.say(text.data.surpriseVisite), gone]);
    return;
  }
}
