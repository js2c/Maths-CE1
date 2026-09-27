// Les bruitages (SPEC-LOT2, section 6), fabriqués par synthèse : bulles (modèle de Minnaert), cordes
// pincées, sons de cloche et de perle, souffles de bruit filtré. Mono, 48 kHz ; chacun renvoie un tampon brut,
// dont la sonie est réglée ensuite par fabriquer.mjs. Pour les deux bruitages les plus fréquents (bonne
// réponse, erreur), deux variantes (a, b) sont proposées au choix du parent.
import { SR, rng, hz, db, ajouter, biquad, filtrer, passeBasVariable, reverb, bruit, env, fonduFin, corde, modal, bulle, nappe, CLOCHE, PERLE, MARIMBA } from "./synth.mjs";

const t = (s) => Math.round(s * SR);
const mono = (b, o) => {
  const [g, d] = reverb([b, b], o);
  const m = new Float32Array(b.length);
  for (let i = 0; i < m.length; i++) m[i] = (g[i] + d[i]) / 2;
  return m;
};
const PENTA = [0, 2, 4, 7, 9]; // gamme de ré majeur pentatonique, comme la harpe du lagon
const note = (degre, base = 74) => base + PENTA[((degre % 5) + 5) % 5] + 12 * Math.floor(degre / 5);

export const BRUITAGES = {
  // bonne réponse, a : deux bulles claires qui montent, et une petite perle (la, puis ré au-dessus)
  "bonne-a": {
    nom: "Bonne réponse (a) : deux bulles et une perle",
    fabriquer(r) {
      const b = new Float32Array(t(0.75));
      ajouter(b, bulle(820, { duree: 0.1, montee: 1.7, t60: 0.08 }), 0, 0.8);
      ajouter(b, bulle(1150, { duree: 0.1, montee: 1.6, t60: 0.08 }), t(0.075), 0.8);
      ajouter(b, modal(hz(note(3, 81)), 0.6, PERLE), t(0.13), 0.35);
      ajouter(b, modal(hz(note(5, 81)), 0.55, PERLE), t(0.2), 0.3);
      return fonduFin(mono(b, { taille: 0.6, humide: 0.12 }), 0.12);
    },
  },
  // bonne réponse, b : trois petites bulles qui montent (seulement de l'eau, sans note)
  "bonne-b": {
    nom: "Bonne réponse (b) : trois bulles",
    fabriquer(r) {
      const b = new Float32Array(t(0.5));
      [[640, 0], [860, 0.06], [1120, 0.12]].forEach(([f, d], i) => ajouter(b, bulle(f, { duree: 0.11, montee: 1.8, t60: 0.09 }), t(d), 0.75 + 0.1 * i));
      return fonduFin(mono(b, { taille: 0.55, humide: 0.1 }), 0.1);
    },
  },
  // erreur, a : une bulle grave et ronde, lente, et une note de marimba douce (jamais un son d'échec :
  // ni descente, ni intervalle mineur, ni bourdonnement)
  "erreur-a": {
    nom: "Erreur (a) : une bulle grave et douce",
    fabriquer(r) {
      const b = new Float32Array(t(0.6));
      ajouter(b, bulle(300, { duree: 0.22, montee: 1.35, t60: 0.2, attaque: 0.006 }), 0, 0.9);
      ajouter(b, modal(hz(note(0, 62)), 0.5, MARIMBA, { montee: 0.004 }), t(0.03), 0.18);
      filtrer(b, biquad("passe-bas", 1400, 0.7));
      return fonduFin(mono(b, { taille: 0.6, humide: 0.1 }), 0.15);
    },
  },
  // erreur, b : deux bulles graves étouffées, « bloub-bloub »
  "erreur-b": {
    nom: "Erreur (b) : deux bulles étouffées",
    fabriquer(r) {
      const b = new Float32Array(t(0.55));
      ajouter(b, bulle(270, { duree: 0.18, montee: 1.4, t60: 0.15, attaque: 0.005 }), 0, 0.9);
      ajouter(b, bulle(340, { duree: 0.16, montee: 1.4, t60: 0.13, attaque: 0.005 }), t(0.14), 0.75);
      filtrer(b, biquad("passe-bas", 1100, 0.7));
      return fonduFin(mono(b, { taille: 0.55, humide: 0.08 }), 0.12);
    },
  },
  // l'étoile vole vers le compteur : un filet de perles qui monte (pentatonique) et un souffle léger
  etoile: {
    nom: "L'étoile vole vers le compteur",
    fabriquer(r) {
      const b = new Float32Array(t(0.85));
      for (let i = 0; i < 6; i++) ajouter(b, modal(hz(note(i + 2, 81)), 0.45, PERLE), t(0.045 * i), 0.5 - 0.05 * i);
      const souffle = bruit(t(0.35), r);
      const e = env(souffle.length, 0.12, 0.3);
      for (let i = 0; i < souffle.length; i++) souffle[i] *= e[i];
      passeBasVariable(souffle, (i) => 2500 + 5000 * (i / souffle.length), 1.2);
      filtrer(souffle, biquad("passe-haut", 1800, 0.7));
      ajouter(b, souffle, 0, 0.18);
      return fonduFin(mono(b, { taille: 0.7, humide: 0.18 }), 0.2);
    },
  },
  // le coquillage s'ouvre : souffle grave qui s'ouvre, quelques bulles, puis la perle brille (arpège de harpe
  // et cloche) ; le seul bruitage de plus d'une seconde
  coquillage: {
    nom: "Le coquillage s'ouvre",
    fabriquer(r) {
      const b = new Float32Array(t(2.0));
      const s = bruit(t(0.7), r);
      for (let i = 0; i < s.length; i++) s[i] *= Math.sin((Math.PI * i) / s.length) ** 2;
      passeBasVariable(s, (i) => 250 + 900 * (i / s.length), 0.9);
      ajouter(b, s, 0, 0.5);
      [[380, 0.22], [520, 0.36], [450, 0.5]].forEach(([f, d]) => ajouter(b, bulle(f, { duree: 0.12, montee: 1.5, t60: 0.1 }), t(d), 0.35));
      [0, 2, 4, 5, 7].forEach((d, i) => ajouter(b, corde(hz(note(d, 62)), 1.4, r, { clarte: 0.55, t60: 2 }), t(0.62 + 0.07 * i), 0.4));
      ajouter(b, modal(hz(note(10, 62)), 1.1, CLOCHE), t(1.0), 0.25);
      return fonduFin(mono(b, { taille: 0.8, humide: 0.22 }), 0.35);
    },
  },
  // la carte se retourne : un souffle bref (bruit filtré qui monte) et un petit claquement de carton
  carte: {
    nom: "La carte se retourne",
    fabriquer(r) {
      const b = new Float32Array(t(0.4));
      const s = bruit(t(0.26), r);
      for (let i = 0; i < s.length; i++) s[i] *= Math.sin((Math.PI * i) / s.length) ** 1.5;
      filtrer(s, biquad("passe-haut", 500, 0.7));
      passeBasVariable(s, (i) => 900 + 3500 * (i / s.length), 1.4);
      ajouter(b, s, 0, 0.7);
      const clic = bruit(t(0.02), r);
      const e = env(clic.length, 0.0008, 0.015);
      for (let i = 0; i < clic.length; i++) clic[i] *= e[i];
      filtrer(clic, biquad("passe-bande", 1800, 1.2));
      ajouter(b, clic, t(0.24), 0.9);
      return fonduFin(mono(b, { taille: 0.5, humide: 0.06 }), 0.08);
    },
  },
  // la carte est brillante : une poignée d'étincelles aiguës (perles) éparpillées
  brillante: {
    nom: "La carte est brillante",
    fabriquer(r) {
      const b = new Float32Array(t(0.95));
      let d = 0;
      for (let i = 0; i < 12; i++) {
        ajouter(b, modal(hz(note(10 + Math.floor(r() * 6), 74)), 0.3, [[1, 1, 0.25], [2.76, 0.25, 0.1]]), t(d), 0.25 + 0.2 * r());
        d += 0.025 + 0.05 * r() * (1 + i / 6);
      }
      return fonduFin(mono(b, { taille: 0.75, humide: 0.2 }), 0.25);
    },
  },
  // toucher d'un bouton : une toute petite bulle
  bouton: {
    nom: "Toucher d'un bouton",
    fabriquer(r) {
      const b = new Float32Array(t(0.09));
      ajouter(b, bulle(1050, { duree: 0.05, montee: 1.4, t60: 0.035 }), 0, 1);
      return fonduFin(b, 0.03);
    },
  },
  // une zone s'ouvre : glissando de harpe qui monte et un accord qui s'épanouit, en moins d'une seconde
  zone: {
    nom: "Une zone du récif s'ouvre",
    fabriquer(r) {
      const b = new Float32Array(t(0.98));
      for (let i = 0; i < 9; i++) ajouter(b, corde(hz(note(i, 62)), 0.9, r, { clarte: 0.6, t60: 1.6 }), t(0.04 * i), 0.24);
      const n = t(0.7), accord = new Float32Array(n);
      for (const m of [62, 69, 76, 78]) ajouter(accord, nappe(hz(m), n, r, { desaccord: 5 }), 0, 0.2);
      for (let i = 0; i < n; i++) accord[i] *= Math.sin((Math.PI * i) / n) ** 2;
      ajouter(b, accord, t(0.25), 1);
      return fonduFin(mono(b, { taille: 0.78, humide: 0.2 }), 0.3);
    },
  },
};

export const fabriquerBruitage = (cle, graine) => BRUITAGES[cle].fabriquer(rng((graine ^ [...cle].reduce((h, c) => Math.imul(h, 31) + c.charCodeAt(0), 7)) >>> 0));
