// HÔTE D'EXPORT. Page pilotée par `tools/export-app.mjs` : rend chaque image du catalogue, la
// recadre, multiplie le grain du papier dedans (comme la scène de référence le fait sur toute
// l'image), range les images en planches et les encode en WebP. Tout ce qui touche au DOM est ici ;
// les modules de dessin n'en savent rien.
import { Gfx, PENCIL, tile, type Ctx, type Env, type Layer } from "../canvas-core/core";
import { SPECS, type Spec } from "../canvas-core/sea/catalog";

type Frame = { c: OffscreenCanvas; x: number; y: number; w: number; h: number; hash: string; edges: number[] };
const surface = (w: number, h: number): Layer => { const c = new OffscreenCanvas(w, h); return { canvas: c, ctx: c.getContext("2d", { willReadFrequently: true }) as unknown as Ctx } as Layer; };
const fnv = (d: Uint8ClampedArray) => { let h = 0x811c9dc5; for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16).padStart(8, "0"); };
const PAPER = 0.05, EDGE_ALPHA = 24;

// une image : dessin sur un calque propre, grain du papier, recadrage au plus juste
// un environnement par taille de calque : la texture du papier et la réserve de calques de Gfx sont
// calculées une fois (elles sont des fonctions pures de leur clé, règle 5 du contrat)
const envs = new Map<string, Env>();
const envFor = (W: number, H: number, scale: number) => { const k = `${W}x${H}@${scale}`; let e = envs.get(k); if (!e) { e = { W, H, scale, cache: new Map(), canvas: surface }; envs.set(k, e); } return e; };
const scratch = new Map<string, Layer>();
const renderFrame = (s: Spec, f: number, scale: number): Frame => {
  const DW = Math.round(s.W * scale), DH = Math.round(s.H * scale), sk = `${DW}x${DH}`;
  let L = scratch.get(sk); if (!L) { L = surface(DW, DH); scratch.set(sk, L); }
  const ctx = L.ctx, env = envFor(s.W, s.H, scale);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.clearRect(0, 0, DW, DH);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  s.draw(g, f);
  // lot 3 : les pixels visibles (alpha >= EDGE_ALPHA) sur chaque bord du calque [haut, droite, bas, gauche] : un
  // dessin qui touche le bord de son calque y est coupé (contrôle tests/unit/bords.test.mjs)
  const edges = [ctx.getImageData(0, 0, DW, 1), ctx.getImageData(DW - 1, 0, 1, DH), ctx.getImageData(0, DH - 1, DW, 1), ctx.getImageData(0, 0, 1, DH)].map((d) => { let n = 0; for (let i = 3; i < d.data.length; i += 4) if (d.data[i] >= EDGE_ALPHA) n++; return n; });
  const r = s.full || !g.drawn ? [0, 0, DW, DH] : g.drawn, w = Math.max(1, r[2] - r[0]), h = Math.max(1, r[3] - r[1]);
  // grain : multiplié comme sur la référence (Gfx.paper, même motif ancré en 0,0), mais seulement dans
  // le rectangle utile ; puis l'alpha d'origine est remis (le papier ne doit pas teinter le transparent)
  const before = ctx.getImageData(r[0], r[1], w, h);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = PAPER;
  ctx.fillStyle = ctx.createPattern(tile(env, "paper").canvas as CanvasImageSource, "repeat")!; ctx.fillRect(r[0], r[1], w, h); ctx.restore();
  const after = ctx.getImageData(r[0], r[1], w, h);
  for (let i = 3; i < after.data.length; i += 4) after.data[i] = before.data[i];
  const out = new OffscreenCanvas(w, h), oc = out.getContext("2d")!;
  oc.putImageData(after, 0, 0);
  return { c: out, x: r[0], y: r[1], w, h, hash: fnv(after.data), edges };
};

// rangement en étagères : les plus hautes d'abord, pages de 4096 px au plus
const MAXW = 4096, PAD = 2;
const pack = (frames: { w: number; h: number }[]) => {
  const area = frames.reduce((a, f) => a + (f.w + PAD) * (f.h + PAD), 0), width = Math.min(MAXW, Math.max(...frames.map((f) => f.w + PAD * 2), Math.ceil(Math.sqrt(area) * 1.08)));
  const order = frames.map((_, i) => i).sort((a, b) => frames[b].h - frames[a].h || a - b);
  const pos: { page: number; x: number; y: number }[] = []; let page = 0, x = PAD, y = PAD, rowH = 0; const sizes: [number, number][] = [];
  for (const i of order) {
    const f = frames[i];
    if (x + f.w + PAD > width) { x = PAD; y += rowH + PAD; rowH = 0; }
    if (y + f.h + PAD > MAXW) { sizes.push([width, y + rowH + PAD]); page++; x = PAD; y = PAD; rowH = 0; }
    pos[i] = { page, x, y }; x += f.w + PAD; rowH = Math.max(rowH, f.h);
  }
  sizes.push([width, y + rowH + PAD]);
  return { pos, sizes };
};
const b64 = async (b: Blob) => { const u8 = new Uint8Array(await b.arrayBuffer()); let s = ""; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000)); return btoa(s); };

// différence moyenne (0..255) entre deux images posées dans le calque de leur sprite, à l'échelle 1
const diff = (a: Frame, b: Frame, s: Spec) => {
  const W = s.W, H = s.H, put = (f: Frame) => { const c = new OffscreenCanvas(W, H), x = c.getContext("2d", { willReadFrequently: true })!; x.drawImage(f.c, f.x, f.y); return x.getImageData(0, 0, W, H).data; };
  const da = put(a), db = put(b); let sum = 0, n = 0;
  for (let i = 0; i < da.length; i += 4) { if (da[i + 3] || db[i + 3]) { sum += Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) + Math.abs(da[i + 3] - db[i + 3]); n++; } }
  return n ? sum / (n * 4) : 0;
};

declare global { interface Window { EXPORT: unknown } }
window.EXPORT = {
  specs: () => SPECS.map((s) => ({ name: s.name, sheet: s.sheet, frames: s.frames, fps: s.fps ?? 0, scales: s.scales ?? [1, 2], origin: s.origin, meta: s.meta ?? null, loop: s.loop ?? null })),
  // rend une planche : renvoie les WebP (base64), les rectangles et les empreintes de chaque image
  sheet: async (sheet: string, scale: number, encode = true, quality = 1) => {
    const specs = SPECS.filter((s) => s.sheet === sheet && (s.scales ?? [1, 2]).includes(scale));
    const t0 = performance.now(), all: { spec: Spec; f: number; fr: Frame }[] = [];
    specs.forEach((spec) => { for (let f = 0; f < spec.frames; f++) all.push({ spec, f, fr: renderFrame(spec, f, scale) }); });
    const drawMs = performance.now() - t0, { pos, sizes } = pack(all.map((a) => a.fr));
    const pages = sizes.map(([w, h]) => { const c = new OffscreenCanvas(w, h); return { c, x: c.getContext("2d")! }; });
    all.forEach((a, i) => pages[pos[i].page].x.drawImage(a.fr.c, pos[i].x, pos[i].y));
    const frames: Record<string, number[][]> = {}, hashes: Record<string, string[]> = {}, edges: Record<string, number[]> = {};
    all.forEach((a, i) => {
      const o = a.spec.origin, ox = a.fr.x - Math.round(o[0] * scale), oy = a.fr.y - Math.round(o[1] * scale);
      (frames[a.spec.name] ??= []).push([pos[i].page, pos[i].x, pos[i].y, a.fr.w, a.fr.h, ox, oy]);
      (hashes[a.spec.name] ??= []).push(a.fr.hash);
      const e = (edges[a.spec.name] ??= [0, 0, 0, 0]); a.fr.edges.forEach((n, k) => { e[k] = Math.max(e[k], n); });
    });
    const files = encode ? await Promise.all(pages.map(async (p) => b64(await p.c.convertToBlob({ type: "image/webp", quality })))) : [];
    return { frames, hashes, edges, files, sizes, drawMs, pixels: all.reduce((a, x) => a + x.fr.w * x.fr.h, 0) };
  },
  // contrôle des boucles (à l'échelle 1) : l'écart au raccord doit rester dans l'ordre des écarts
  // entre images voisines (lot « Mascotte » : plus de gestes de la pieuvre à contrôler)
  seams: () => {
    const out: Record<string, unknown> = {}, cache = new Map<string, Frame>();
    const fr = (s: Spec, f: number) => { const k = `${s.name}:${f}`; let v = cache.get(k); if (!v) { v = renderFrame(s, f, 1); cache.set(k, v); } return v; };
    SPECS.filter((s) => s.loop).forEach((s) => {
      const [a, b] = s.loop!, steps: number[] = [];
      for (let f = a; f < b - 1; f++) steps.push(diff(fr(s, f), fr(s, f + 1), s));
      out[s.name] = { seam: +diff(fr(s, b - 1), fr(s, a), s).toFixed(2), stepMax: +Math.max(...steps).toFixed(2), stepMean: +(steps.reduce((x, y) => x + y, 0) / steps.length).toFixed(2) };
    });
    return out;
  },
};
