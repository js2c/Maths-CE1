// Les musiques de fond (SPEC-LOT2, section 6) : calmes, lentes, gamme pentatonique, un instrument
// (harpe, marimba ou cloches douces) sur une nappe légère, des vagues lointaines. Composition générative
// déterministe (rng) : une marche au hasard sur la gamme, à petits pas, avec des silences ; aucun motif
// répété, pour que rien n'attire l'attention.
//
// Boucle sans raccord : tout est rendu dans un tampon circulaire de la longueur exacte de la boucle. Ce qui
// dépasse la fin (queue d'une note, d'un accord) revient au début ; les filtres, la réverbération et les
// vagues sont calculés en régime périodique. La fin se raccorde donc au début comme n'importe quel autre
// instant de la musique.
import { SR, rng, hz, db, ajouter, biquad, filtrer, passeBasVariable, reverb, bruit, corde, modal, nappe, sonie, gain, MARIMBA, CLOCHE } from "./synth.mjs";

// l'instrument de la mélodie : une note de hauteur midi, de force v (0 à 1)
const INSTRUMENTS = {
  harpe: (m, v, r) => corde(hz(m), 4, r, { clarte: 0.35 + 0.25 * v, t60: 3.6 - (m - 60) / 20 }),
  marimba: (m, v) => modal(hz(m), 2.2, MARIMBA.map(([k, a, t60], i) => [k, a * (i ? 0.55 + 0.3 * v : 1), t60 * 1.2]), { montee: 0.004 }),
  cloche: (m, v) => modal(hz(m), 4, CLOCHE.map(([k, a, t60]) => [k, a * (k > 1 ? 0.6 : 1), t60 * 1.8]), { montee: 0.006 }),
};

export function duree(cfg, mesures = cfg.mesures) {
  return Math.round((mesures * 4 * 60 * SR) / cfg.tempo); // en échantillons
}

// compose : la liste des notes de la mélodie et des accords (sert aussi aux tests : gamme, tempo)
export function composer(cfg, r, mesures = cfg.mesures) {
  const temps = 60 / cfg.tempo, mesure = 4 * temps, accords = [], notes = [];
  const nAcc = Math.ceil(mesures / cfg.mesuresParAccord);
  for (let c = 0; c < nAcc; c++) accords.push({ debut: c * cfg.mesuresParAccord * mesure, duree: cfg.mesuresParAccord * mesure, intervalles: cfg.accords[c % cfg.accords.length] });
  const G = cfg.gamme, midi = (d) => cfg.tonique + G[((d % 5) + 5) % 5] + 12 * Math.floor(d / 5);
  const bas = cfg.instrument === "marimba" ? 5 : 3, haut = bas + 9;
  let d = bas + 4;
  for (let m = 0; m < mesures; m++) {
    const accord = accords[Math.floor(m / cfg.mesuresParAccord)], silence = m % 4 === 3 || r() < 0.18; // souffles
    for (let croche = 0; croche < 8; croche++) {
      const p = cfg.densite * (croche % 2 ? 0.3 : 1) * (croche === 0 ? 1.4 : 1) * (silence ? 0.15 : 1);
      if (r() >= p) continue;
      d += [-2, -1, -1, 0, 1, 1, 2][Math.floor(r() * 7)];
      if (d < bas) d = bas + 1; else if (d > haut) d = haut - 1;
      let h = midi(d);
      if (croche === 0) { // premier temps : une note de l'accord, la plus proche
        const cibles = accord.intervalles.map((x) => cfg.tonique + x).flatMap((x) => [x - 12, x, x + 12]);
        const proche = cibles.filter((x) => G.includes((((x - cfg.tonique) % 12) + 12) % 12)).sort((a, b) => Math.abs(a - h) - Math.abs(b - h))[0];
        if (proche != null && Math.abs(proche - h) <= 3) h = proche;
      }
      notes.push({ t: m * mesure + (croche * temps) / 2 + (r() - 0.5) * 0.016, midi: h, force: 0.55 + 0.35 * r(), pan: (r() - 0.5) * 0.6 });
    }
  }
  return { accords, notes, mesure };
}

const panoramique = (p) => [Math.cos(((p + 1) * Math.PI) / 4), Math.sin(((p + 1) * Math.PI) / 4)];

export function fabriquerMusique(cfg, graine, { mesures = cfg.mesures } = {}) {
  const r = rng(graine), L = duree(cfg, mesures), { accords, notes, mesure } = composer(cfg, r, mesures);
  const couche = () => [new Float32Array(L), new Float32Array(L)];
  const s = (x) => Math.round(x * SR);

  // mélodie (et, pour la harpe, une corde grave à chaque accord)
  const melodie = couche(), jouer = INSTRUMENTS[cfg.instrument];
  for (const n of notes) {
    const son = jouer(n.midi, n.force, r), [pg, pd] = panoramique(n.pan);
    ajouter(melodie[0], son, s(n.t), n.force * pg, true);
    ajouter(melodie[1], son, s(n.t), n.force * pd, true);
  }
  if (cfg.graves) for (const a of accords) {
    const son = INSTRUMENTS.harpe(cfg.tonique + a.intervalles[0] - 12, 0.4, r);
    ajouter(melodie[0], son, s(a.debut), 0.45, true);
    ajouter(melodie[1], son, s(a.debut), 0.45, true);
  }

  // nappe : chaque accord monte pendant une mesure et s'efface pendant la suivante (sin² + cos² = 1)
  const tapis = couche(), xf = mesure;
  for (const a of accords) {
    const n = s(a.duree + xf), m = s(xf);
    a.intervalles.forEach((iv, k) => {
      const v = nappe(hz(cfg.tonique + iv), n, r);
      for (let i = 0; i < n; i++) v[i] *= i < m ? Math.sin((Math.PI * i) / (2 * m)) ** 2 : i >= n - m ? Math.cos((Math.PI * (i - n + m)) / (2 * m)) ** 2 : 1;
      const [pg, pd] = panoramique(k % 2 ? 0.35 : -0.35);
      ajouter(tapis[0], v, s(a.debut - xf / 2), pg, true);
      ajouter(tapis[1], v, s(a.debut - xf / 2), pd, true);
    });
  }
  for (const c of tapis) filtrer(c, biquad("passe-bas", 1300, 0.6), true);

  // vagues lointaines : bruit filtré, houle faite de deux ondes dont les périodes divisent la boucle
  const vagues = couche(), duS = L / SR;
  const k1 = Math.max(1, Math.round(duS / 9.5)), k2 = Math.max(1, Math.round(duS / 14.5));
  for (let c = 0; c < 2; c++) {
    const b = bruit(L, r), dec = c * 0.23;
    const houle = (i) => {
      const w1 = (0.5 + 0.5 * Math.sin(2 * Math.PI * (k1 * i / L + dec))) ** 2, w2 = (0.5 + 0.5 * Math.sin(2 * Math.PI * (k2 * i / L + 0.4 + dec))) ** 2;
      return 0.6 * w1 + 0.4 * w2;
    };
    for (let i = 0; i < L; i++) b[i] *= 0.12 + 0.88 * houle(i);
    passeBasVariable(b, (i) => 280 + 650 * houle(i), 0.7, true);
    filtrer(b, biquad("passe-haut", 90, 0.7), true);
    vagues[c] = b;
  }

  // dosage des couches par leur sonie (la mélodie sert de référence)
  const ref = sonie(melodie).integree;
  const doser = (x, ecartDb) => gain(x, db(ref + ecartDb - sonie(x).integree));
  doser(tapis, -6 + 20 * Math.log10(cfg.nappe));
  doser(vagues, -10 + 20 * Math.log10(cfg.vagues));

  const humide = couche();
  for (let c = 0; c < 2; c++) for (let i = 0; i < L; i++) humide[c][i] = melodie[c][i] + tapis[c][i] * 0.6;
  const rev = reverb(humide, { taille: 0.86, amorti: 0.4, humide: cfg.reverb, boucle: true });
  for (let c = 0; c < 2; c++) for (let i = 0; i < L; i++) rev[c][i] += tapis[c][i] * 0.4 + vagues[c][i];
  for (const c of rev) filtrer(c, biquad("plateau-aigu", 5000, 0.7, -3), true); // un peu plus doux dans l'aigu
  return { canaux: rev, notes, accords };
}
