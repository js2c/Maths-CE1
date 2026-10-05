// LE GRAND LARGE DU RÉCIF VIVANT : les profondeurs des nageuses (art/tools/export-recif.mjs, PROFONDEURS). Les quinze
// nageuses de la maquette font leur ronde de 5 950 à 8 380 px du panorama ; neuf tournaient entre 175 et 900 px, là où croise
// le sous-marin, et se croisaient en grappe devant lui (relevé du 5 octobre 2026). Cet outil les simule, avec les formules de
// la maquette (position dans la ronde, rapetissement aux deux bouts, aller-retour du sous-marin), pendant une heure à raison
// d'une mesure par seconde, et compte :
//   - francs : les paires de nageuses visibles qui se recouvrent de plus de 25 % de l'aire de la plus petite (en moyenne) ;
//   - sousMarin : les nageuses recouvertes ainsi par le sous-marin quand il passe dans le grand large (en moyenne) ;
//   - grappes : la part du temps où au moins trois nageuses sont liées par de tels recouvrements ; pire : la plus grosse.
// La profondeur est la seule chose qui change (la ronde, la vitesse, le sens et la taille restent ceux de la maquette).
//
//   node tools/grand-large.mjs              # la mesure, maquette et profondeurs retenues
//   node tools/grand-large.mjs --chercher   # la recherche des profondeurs (une dizaine de minutes)
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const ROOT = new URL("../../", import.meta.url);
const html = readFileSync(new URL("art/recif-vivant/index.html", ROOT), "utf8");
const A = JSON.parse(html.match(/^const LARGE_SPR = (\{.*\});$/m)[1]);
const re = /\{id:'([^']*)', x:\d+, y:(\d+), len:(\d+), ph:([\d.]+), ronde:\{x0:5950, x1:8380, v:(\d+), dir:(-?1)\}/g;
// les nageuses du grand large, telles que la maquette les décrit (h : la hauteur dessinée, d'après l'image)
export const NAGEUSES = [...html.matchAll(re)].map(([, id, y, len, ph, v, dir]) => { const s = A[id], m = s.m || 0, k = +len / (s.w - 2 * m); return { id, y0: +y, w: +len, h: (s.h - 2 * m) * k, ph: +ph, v: +v, dir: +dir }; });
const C = NAGEUSES, X0 = 5950, X1 = 8380, SPAN = X1 - X0;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const SUBW = 600, SUBH = ((419 * 600) / 639) * 0.75, T = Array.from({ length: 3600 }, (_, t) => t);
const P = T.map((t) => C.map((c) => { const u = (((c.ph / 6.2832 + (t * c.v) / SPAN) % 1) + 1) % 1, x = c.dir > 0 ? X0 + u * SPAN : X1 - u * SPAN, far = 1 - smooth(0, 320, Math.min(x - X0, X1 - x)); return { x, kf: 1 - 0.4 * far, vis: far < 0.6 }; }));
const SUB = T.map((t) => { const L = 2 * (10874 - 5240), s = (t * 66) % L; return { x: s < L / 2 ? 5240 + s : 10874 - (s - L / 2), y: 700 + 150 * Math.sin((t * 0.045 * 6.28) / 10) }; });
const inter = (ax, ay, aw, ah, bx, by, bw, bh) => Math.max(0, Math.min(ax + aw / 2, bx + bw / 2) - Math.max(ax - aw / 2, bx - bw / 2)) * Math.max(0, Math.min(ay + ah / 2, by + bh / 2) - Math.max(ay - ah / 2, by - bh / 2));
// la mesure d'une répartition (`prof` : { id: profondeur }, les absentes à leur place de la maquette)
export function mesure(prof = {}) {
  const Y = C.map((c) => prof[c.id] ?? c.y0);
  let francs = 0, sub = 0, grappes = 0, pire = 0;
  for (let n = 0; n < T.length; n++) {
    const p = P[n], lies = C.map(() => []);
    for (let i = 0; i < C.length; i++) {
      if (!p[i].vis) continue;
      const wi = C[i].w * p[i].kf, hi = C[i].h * p[i].kf, s = SUB[n];
      if (s.x > X0 - 300 && s.x < X1 + 300 && inter(p[i].x, Y[i], wi, hi, s.x, s.y, SUBW, SUBH) > 0.25 * wi * hi) sub++;
      for (let j = i + 1; j < C.length; j++) {
        if (!p[j].vis) continue;
        const wj = C[j].w * p[j].kf, hj = C[j].h * p[j].kf;
        if (inter(p[i].x, Y[i], wi, hi, p[j].x, Y[j], wj, hj) > 0.25 * Math.min(wi * hi, wj * hj)) { francs++; lies[i].push(j); lies[j].push(i); }
      }
    }
    const vu = new Set();
    for (let i = 0; i < C.length; i++) {
      if (vu.has(i) || !lies[i].length) continue;
      const pile = [i]; let k = 0; vu.add(i);
      while (pile.length) { const a = pile.pop(); k++; for (const b of lies[a]) if (!vu.has(b)) { vu.add(b); pile.push(b); } }
      if (k >= 3) grappes++; pire = Math.max(pire, k);
    }
  }
  return { francs: +(francs / T.length).toFixed(2), sousMarin: +(sub / T.length).toFixed(2), grappes: +(grappes / T.length).toFixed(3), pire };
}
// la recherche : le poisson volant et le dauphin gardent leur place près de la surface ; les treize autres vont dans des
// couloirs réguliers de 340 à 1 570 px (pas de 103 px, sur toute la hauteur) ; l'affectation des couloirs est cherchée
// par échanges deux à deux, depuis 40 départs tirés au hasard (graine fixe), pour le score
// francs + 2 × sousMarin + 3 × grappes + 0,3 × pire. (Couloirs essayés aussi : 320–1 560, 360–1 580, 300–1 540 : moins bons.)
export function chercher({ TOP = 340, BAS = 1570, departs = 40 } = {}) {
  const FIX = new Set(["poisson-volant", "dauphin"]), lo = (c) => Math.max(c.h / 2 + 90, 150), hi = (c) => 1690 - c.h / 2;
  const score = (m) => m.francs + 2 * m.sousMarin + 3 * m.grappes + 0.3 * m.pire;
  let rnd = 20261005; const R = () => ((rnd = (rnd * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const libres = C.map((c, i) => i).filter((i) => !FIX.has(C[i].id)), L = libres.map((_, k) => TOP + (k * (BAS - TOP)) / (libres.length - 1));
  const build = (perm) => Object.fromEntries(C.map((c, i) => [c.id, Math.round((FIX.has(c.id) ? c.y0 : L[perm[libres.indexOf(i)]]) / 5) * 5]));
  const valid = (perm) => libres.every((i, k) => L[perm[k]] >= lo(C[i]) - 1 && L[perm[k]] <= hi(C[i]) + 1);
  let best = null, bs = Infinity;
  for (let r = 0; r < departs; r++) {
    const perm = libres.map((_, k) => k); for (let k = perm.length - 1; k > 0; k--) { const j = Math.floor(R() * (k + 1)); [perm[k], perm[j]] = [perm[j], perm[k]]; }
    if (!valid(perm)) { r--; continue; }
    let cur = score(mesure(build(perm))), moved = true;
    while (moved) { moved = false; for (let a = 0; a < perm.length; a++) for (let b = a + 1; b < perm.length; b++) { [perm[a], perm[b]] = [perm[b], perm[a]]; const s = valid(perm) ? score(mesure(build(perm))) : Infinity; if (s < cur - 1e-9) { cur = s; moved = true; } else [perm[a], perm[b]] = [perm[b], perm[a]]; } }
    if (cur < bs) { bs = cur; best = build(perm); }
  }
  return best;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { PROFONDEURS } = await import("./export-recif.mjs");
  console.log("maquette  ", mesure());
  console.log("retenues  ", mesure(PROFONDEURS));
  if (process.argv.includes("--chercher")) { const p = chercher(); console.log("cherchées ", mesure(p)); console.log(JSON.stringify(p)); }
}
