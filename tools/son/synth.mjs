// Primitives de synthèse sonore, en JavaScript pur, sans banque de sons ni enregistrement.
// Déterministe : tout le hasard vient de rng(graine) ; une même source donne les mêmes échantillons.
// Les tampons sont des Float32Array à SR échantillons par seconde. Les fonctions « circulaires »
// traitent un tampon comme une boucle (la fin se raccorde au début) : c'est ce qui rend les musiques
// bouclables sans raccord audible.

export const SR = 48000;

export function rng(graine) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
export const db = (x) => 10 ** (x / 20);
export const tampon = (s) => new Float32Array(Math.max(1, Math.round(s * SR)));

// ajoute src dans buf à partir de l'échantillon debut ; en boucle, ce qui dépasse revient au début
export function ajouter(buf, src, debut, gain = 1, boucle = false) {
  const n = buf.length;
  for (let i = 0; i < src.length; i++) {
    let j = debut + i;
    if (boucle) j = ((j % n) + n) % n;
    else if (j < 0 || j >= n) continue;
    buf[j] += src[i] * gain;
  }
}

// ---- filtres (formules de R. Bristow-Johnson) ----
export function biquad(type, f, q = 0.707, gainDb = 0) {
  const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR, c = Math.cos(w), s = Math.sin(w), al = s / (2 * q), A = 10 ** (gainDb / 40);
  let b0, b1, b2, a0, a1, a2;
  if (type === "passe-bas") [b0, b1, b2, a0, a1, a2] = [(1 - c) / 2, 1 - c, (1 - c) / 2, 1 + al, -2 * c, 1 - al];
  else if (type === "passe-haut") [b0, b1, b2, a0, a1, a2] = [(1 + c) / 2, -(1 + c), (1 + c) / 2, 1 + al, -2 * c, 1 - al];
  else if (type === "passe-bande") [b0, b1, b2, a0, a1, a2] = [al, 0, -al, 1 + al, -2 * c, 1 - al];
  else if (type === "plateau-aigu") {
    const r = 2 * Math.sqrt(A) * al;
    [b0, b1, b2] = [A * (A + 1 + (A - 1) * c + r), -2 * A * (A - 1 + (A + 1) * c), A * (A + 1 + (A - 1) * c - r)];
    [a0, a1, a2] = [A + 1 - (A - 1) * c + r, 2 * (A - 1 - (A + 1) * c), A + 1 - (A - 1) * c - r];
  } else throw new Error(`filtre inconnu : ${type}`);
  return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
}

// filtre en place ; en boucle, un premier passage installe l'état du filtre (régime périodique)
export function filtrer(buf, k, boucle = false) {
  const [b0, b1, b2, a1, a2] = k;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const passe = (ecrire) => {
    for (let i = 0; i < buf.length; i++) {
      const x = buf[i], y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
      if (ecrire) buf[i] = y;
    }
  };
  if (boucle) passe(false);
  passe(true);
  return buf;
}

// passe-bas à fréquence variable (filtre d'état à topologie « TPT », 12 dB/octave), fc : fonction de l'indice
export function passeBasVariable(buf, fc, q = 0.6, boucle = false) {
  let s1 = 0, s2 = 0;
  const k = 1 / q, passe = (ecrire) => {
    for (let i = 0; i < buf.length; i++) {
      const g = Math.tan((Math.PI * Math.min(fc(i), SR * 0.45)) / SR), a1 = 1 / (1 + g * (g + k));
      const v1 = a1 * (s1 + g * (buf[i] - s2)), v2 = s2 + g * v1;
      s1 = 2 * v1 - s1; s2 = 2 * v2 - s2;
      if (ecrire) buf[i] = v2;
    }
  };
  if (boucle) passe(false);
  passe(true);
  return buf;
}

// ---- réverbération (Freeverb de Jezar, domaine public), stéréo ; en boucle : régime périodique ----
const COMBS = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => Math.round((n * SR) / 44100));
const PASSE_TOUT = [556, 441, 341, 225].map((n) => Math.round((n * SR) / 44100));
export function reverb([g, d], { taille = 0.84, amorti = 0.35, humide = 0.3, boucle = false } = {}) {
  const sortie = [new Float32Array(g.length), new Float32Array(g.length)];
  for (let c = 0; c < 2; c++) {
    const ecart = c ? 23 : 0;
    const combs = COMBS.map((n) => ({ b: new Float32Array(n + ecart), i: 0, f: 0 }));
    const pts = PASSE_TOUT.map((n) => ({ b: new Float32Array(n + ecart), i: 0 }));
    const out = sortie[c], passe = (ecrire) => {
      for (let i = 0; i < g.length; i++) {
        const x = (g[i] + d[i]) * 0.015;
        let y = 0;
        for (const cb of combs) {
          const o = cb.b[cb.i];
          cb.f = o * (1 - amorti) + cb.f * amorti;
          cb.b[cb.i] = x + cb.f * taille;
          if (++cb.i >= cb.b.length) cb.i = 0;
          y += o;
        }
        for (const p of pts) {
          const o = p.b[p.i];
          p.b[p.i] = y + o * 0.5;
          if (++p.i >= p.b.length) p.i = 0;
          y = o - y;
        }
        if (ecrire) out[i] = y;
      }
    };
    if (boucle) passe(false);
    passe(true);
  }
  for (let c = 0; c < 2; c++) {
    const src = c ? d : g, out = sortie[c];
    for (let i = 0; i < out.length; i++) out[i] = src[i] + out[i] * humide * 3;
  }
  return sortie;
}

// ---- sources ----
export function bruit(n, r) {
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) b[i] = r() * 2 - 1;
  return b;
}

// enveloppe : montée (s), puis décroissance exponentielle (t60 : temps pour perdre 60 dB)
export function env(n, montee, t60) {
  const e = new Float32Array(n), m = Math.max(1, montee * SR), k = Math.log(1000) / (t60 * SR);
  for (let i = 0; i < n; i++) e[i] = (i < m ? 0.5 - 0.5 * Math.cos((Math.PI * i) / m) : 1) * Math.exp(-k * i);
  return e;
}

// fondu de sortie (cosinus) sur les dernières s secondes
export function fonduFin(b, s) {
  const m = Math.min(b.length, Math.round(s * SR));
  for (let i = 0; i < m; i++) b[b.length - 1 - i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / m);
  return b;
}

// corde pincée (Karplus-Strong) : la harpe. clarte (0 à 1) : excitation plus ou moins filtrée ; t60 en s
export function corde(f, duree, r, { clarte = 0.5, t60 = 3 } = {}) {
  const n = Math.round(duree * SR), out = new Float32Array(n);
  const periode = SR / f - 0.5, N = Math.floor(periode), fr = periode - N;
  const ligne = new Float32Array(N + 1); // lire p (retard N+1) et p+1 (retard N) : retard N + fr
  // excitation : la forme de la corde tirée par le doigt (un triangle dont la pointe est au tiers de la
  // corde), plus un peu de bruit adouci par une moyenne glissante ; recentrée (pas de composante continue)
  const lissage = Math.max(1, Math.round((1 - clarte) * 6)), pointe = 0.3 * (N + 1);
  let moy = 0;
  for (let i = 0; i < N + 1; i++) {
    let s = 0;
    for (let k = 0; k < lissage; k++) s += r() * 2 - 1;
    ligne[i] = 0.25 * (s / lissage) + 0.8 * (i < pointe ? i / pointe : (N + 1 - i) / (N + 1 - pointe));
    moy += ligne[i] / (N + 1);
  }
  for (let i = 0; i < N + 1; i++) ligne[i] -= moy;
  const rho = Math.exp(-Math.log(1000) / (t60 * f)); // perte par aller-retour
  let p = 0, prec = ligne[0];
  for (let i = 0; i < n; i++) {
    const a = ligne[p], b = ligne[(p + 1) % ligne.length];
    const v = a * fr + b * (1 - fr); // retard fractionnaire (interpolation linéaire)
    out[i] = v;
    const nv = rho * 0.5 * (v + prec);
    prec = v;
    ligne[p] = nv;
    p = (p + 1) % ligne.length;
  }
  const m = Math.round(0.002 * SR);
  for (let i = 0; i < m && i < n; i++) out[i] *= i / m; // pas de clic à l'attaque
  return out;
}

// son modal : somme de sinus amortis (marimba, cloches, perles). partiels : [rapport, amplitude, t60]
export function modal(f, duree, partiels, { montee = 0.002, phase = 0 } = {}) {
  const n = Math.round(duree * SR), out = new Float32Array(n);
  for (const [rap, amp, t60] of partiels) {
    const w = (2 * Math.PI * f * rap) / SR;
    if (f * rap > SR * 0.45) continue;
    const k = Math.log(1000) / (t60 * SR);
    for (let i = 0; i < n; i++) out[i] += amp * Math.sin(w * i + phase) * Math.exp(-k * i);
  }
  const m = Math.max(1, Math.round(montee * SR));
  for (let i = 0; i < m && i < n; i++) out[i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / m);
  return out;
}

export const MARIMBA = [[1, 1, 1.1], [3.98, 0.28, 0.32], [9.9, 0.06, 0.1]];
export const CLOCHE = [[1, 1, 1.6], [2.0, 0.25, 0.8], [3.0, 0.12, 0.4], [4.16, 0.08, 0.25], [5.43, 0.04, 0.15]];
export const PERLE = [[1, 1, 0.5], [2.76, 0.3, 0.2], [5.4, 0.12, 0.08]];

// bulle (modèle de Minnaert) : sinus amorti dont la fréquence monte pendant la vie de la bulle
export function bulle(f0, { duree = 0.12, montee = 1.6, t60 = 0.09, attaque = 0.0015 } = {}) {
  const n = Math.round(duree * SR), out = new Float32Array(n), k = Math.log(1000) / (t60 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n, f = f0 * (1 + (montee - 1) * t * (2 - t)); // la montée ralentit en fin de vie
    ph += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(ph) * Math.exp(-k * i);
  }
  const m = Math.max(1, Math.round(attaque * SR));
  for (let i = 0; i < m && i < n; i++) out[i] *= i / m;
  return out;
}

// nappe : table d'onde douce (harmoniques en 1/k²), deux copies légèrement désaccordées, enveloppe lente
const TABLE = (() => {
  const T = new Float32Array(4097);
  for (let i = 0; i <= 4096; i++) {
    let s = 0;
    for (let k = 1; k <= 7; k++) s += Math.sin((2 * Math.PI * k * i) / 4096) / (k * k);
    T[i] = s * 0.8;
  }
  return T;
})();
// (une voix juste et deux voix plus faibles, désaccordées : le battement reste léger, jamais un trémolo)
export function nappe(f, n, r, { desaccord = 3 } = {}) {
  const out = new Float32Array(n);
  for (const [cents, amp] of [[0, 1.2], [-desaccord, 0.4], [desaccord * 0.8, 0.4]]) {
    const inc = (4096 * f * 2 ** (cents / 1200)) / SR;
    let ph = r() * 4096;
    for (let i = 0; i < n; i++) {
      const j = ph | 0, fr = ph - j;
      out[i] += (TABLE[j] * (1 - fr) + TABLE[j + 1] * fr) * amp * 0.5;
      ph += inc;
      if (ph >= 4096) ph -= 4096;
    }
  }
  return out;
}

// ---- mesures ----
// sonie selon l'UIT-R BS.1770 (pondération K, coefficients pour 48 kHz) : intégrée (avec seuils),
// momentanée maximale (fenêtres de 400 ms), crête
export function sonie(canaux) {
  const K = [[1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585],
    [1, -2, 1, -1.99004745483398, 0.99007225036621]];
  const n = canaux[0].length, bloc = Math.round(0.4 * SR), pas = Math.round(0.1 * SR);
  const carres = canaux.map((c) => {
    const x = Float64Array.from(c);
    for (const k of K) {
      let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
      for (let i = 0; i < n; i++) {
        const v = x[i], y = k[0] * v + k[1] * x1 + k[2] * x2 - k[3] * y1 - k[4] * y2;
        x2 = x1; x1 = v; y2 = y1; y1 = y; x[i] = y;
      }
    }
    const cum = new Float64Array(n + 1);
    for (let i = 0; i < n; i++) cum[i + 1] = cum[i] + x[i] * x[i];
    return cum;
  });
  const L = (z) => -0.691 + 10 * Math.log10(Math.max(z, 1e-20));
  const blocs = [];
  if (n <= bloc) blocs.push(carres.reduce((s, c) => s + c[n] / bloc, 0));
  else for (let d = 0; d + bloc <= n; d += pas) blocs.push(carres.reduce((s, c) => s + (c[d + bloc] - c[d]) / bloc, 0));
  const g1 = blocs.filter((z) => L(z) > -70), moy = (a) => a.reduce((s, z) => s + z, 0) / Math.max(1, a.length);
  const seuil = L(moy(g1)) - 10, g2 = g1.filter((z) => L(z) > seuil);
  let crete = 0;
  for (const c of canaux) for (let i = 0; i < c.length; i++) crete = Math.max(crete, Math.abs(c[i]));
  return { integree: L(moy(g2)), momentaneeMax: Math.max(...blocs.map(L)), crete: 20 * Math.log10(crete || 1e-9) };
}

export function gain(canaux, g) {
  for (const c of canaux) for (let i = 0; i < c.length; i++) c[i] *= g;
  return canaux;
}

// limiteur de crête à anticipation (3 ms) et relâchement lent : écrête les attaques des cordes et des bulles
// sans distorsion audible, pour tenir la sonie visée sous la crête permise (seuil en dB)
export function limiter(canaux, seuilDb, { anticipation = 0.003, relachement = 0.08 } = {}) {
  const n = canaux[0].length, seuil = db(seuilDb), A = Math.round(anticipation * SR);
  const vise = new Float32Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    let p = 0;
    for (const c of canaux) p = Math.max(p, Math.abs(c[i]));
    if (p > seuil) { const g = seuil / p; for (let j = Math.max(0, i - A); j <= i; j++) vise[j] = Math.min(vise[j], g); }
  }
  const k = 1 - Math.exp(-1 / (relachement * SR)), ka = 1 - Math.exp(-1 / (A / 3 || 1));
  let g = 1;
  for (let i = 0; i < n; i++) {
    let m = 1;
    for (let j = i; j < Math.min(n, i + A); j++) m = Math.min(m, vise[j]);
    g = m < g ? g + (m - g) * ka : g + (m - g) * k;
    const gg = Math.min(g, vise[i]);
    for (const c of canaux) c[i] *= gg;
  }
  return canaux;
}
