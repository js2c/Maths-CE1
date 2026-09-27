// LA SURPRISE (docs/SPEC.md, « Règles de protection » ; docs/SPEC-LOT2.md, « Autres règles ») : environ une
// séance sur cinq, jamais deux séances de suite, à l'accueil :
//  - un visiteur traverse la scène (des personnages déjà dessinés : la tortue, un banc de poissons) ;
//  - ou un cadeau (un décor dessiné dans l'atelier : corail, gorgone, étoile de mer, coquille) rejoint le
//    récif et y reste (magasin « recompenses », fiche « cadeaux »).
// Elle ne rapporte pas d'étoiles. Le tirage vient de content/cartes.json (surprise.hasard) ; la règle
// « jamais deux de suite » regarde la séance précédente (champ `surprise` de son enregistrement).
import { wait } from "../engine/clock.js";
import { spriteBox } from "../engine/ui.js";

export const VISITORS = ["tortue", "poissons"];
export const GIFTS = ["corail", "gorgone", "etoile", "coquille"];
// la place de chaque cadeau dans le récif (le milieu de sa base, sur le sable ; scène de 1280 × 800)
export const GIFT_SPOTS = { corail: [470, 604], gorgone: [1175, 586], etoile: [320, 794], coquille: [1110, 792] };

// la surprise de cette séance, ou null. `previous` : l'enregistrement de la séance précédente ; `given` : les
// cadeaux déjà reçus (un cadeau n'est offert qu'une fois ; ensuite, seulement des visites)
export function drawSurprise(rnd, { hasard }, previous, given = []) {
  if (previous?.surprise) return null;
  if (rnd() >= hasard) return null;
  const left = GIFTS.filter((g) => !given.includes(g));
  if (left.length && rnd() < 0.5) return { type: "cadeau", id: left[Math.floor(rnd() * left.length)] };
  return { type: "visite", id: VISITORS[Math.floor(rnd() * VISITORS.length)] };
}
// la séance précédente (hors entraînement libre) d'après les enregistrements
export const previousSession = (seances, id) => seances.filter((s) => !s.libre && s.id !== id).sort((a, b) => b.debut - a.debut)[0] ?? null;

// joue la surprise pendant que la voix la dit ; la promesse se résout quand la voix a fini et que le visiteur
// a traversé (4,5 s, dont la phrase occupe l'essentiel : il ne passe jamais devant la question suivante)
export async function playSurprise(app, s) {
  const { voice, text, ocean, rewards } = app;
  if (s.type === "visite") {
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
    ocean.octo.play("saluer");
    await Promise.all([voice.say(text.data.surpriseVisite), gone]);
    return;
  }
  // un cadeau : il apparaît au milieu, scintille, puis descend rejoindre le récif
  const gift = spriteBox(app, { x: 640 - 100, y: 470 - 160, w: 200, h: 180, cls: "hud gift pop", still: true, paint: (ctx) => app.sprites.draw(ctx, `cadeau.${s.id}`, 0, 100, 160) });
  const glint = ocean.spriteActor(ocean.frontEl, "eclat"), g0 = performance.now() / 1000, tick = (t) => { const u = ((t - g0) / 1.4) % 1; glint.moveTo(700, 350, 0.3 + 0.7 * Math.sin(Math.PI * u), Math.round(Math.sin(Math.PI * u) * 20) / 20); };
  glint.draw(0); ocean.front.push(tick);
  ocean.octo.play("rejouir");
  await rewards.giveGift(s.id);
  await Promise.all([voice.say(text.data.surpriseCadeau), wait(2500)]);
  gift.classList.add("away"); await wait(1000);
  gift.remove(); ocean.front.splice(ocean.front.indexOf(tick), 1); glint.remove(); ocean.actors.splice(ocean.actors.indexOf(glint), 1);
}
