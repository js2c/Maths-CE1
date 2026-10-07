// HÔTE DE LA MAQUETTE DU LOT « LES LEÇONS » (art/lecons/). Empaqueté par `tools/maquette-lecons.mjs` en
// `art/lecons/dessins.js` (module ES) : la page de maquette y prend les dessins nouveaux du lot (sea/lecons.ts, le chalut
// corrigé de hundreds.ts, la table d'addition de runtime.ts), rendus comme l'export de l'application les rend (même
// échelle de pixels, même grain du papier). Ce qui existe déjà dans l'application (boutons, aides, fond) est pris dans
// ses planches par la page elle-même.
import { Gfx, PENCIL, tile, type Ctx, type Env, type Layer } from "../canvas-core/core";
import { drawAToiKey, drawBigHomeKey, drawLessonMenuTile, drawLessonsKey, drawReservedTile, drawRowIcon, drawTableTile } from "../canvas-core/sea/lecons";
import { drawTrawl, drawFishNet } from "../canvas-core/sea/hundreds";
import { drawTurtle, TURTLE_REST } from "../canvas-core/sea/turtle";
import { addTableCell, addTableSize, drawAddTable, drawJumpArc, drawLine, drawNumber, drawTileRing, drawWord, tickP, type AddTableSpec, type LineSpec, wordWidth, drawPanel } from "../canvas-core/sea/runtime";

const surface = (w: number, h: number): Layer => { const c = new OffscreenCanvas(w, h); return { canvas: c, ctx: c.getContext("2d", { willReadFrequently: true }) as unknown as Ctx } as Layer; };
const PAPER = 0.05;
const envs = new Map<string, Env>();
const envFor = (W: number, H: number, scale: number) => { const k = `${W}x${H}@${scale}`; let e = envs.get(k); if (!e) { e = { W, H, scale, cache: new Map(), canvas: surface }; envs.set(k, e); } return e; };

type Fn = (g: Gfx, ctx: CanvasRenderingContext2D, ...a: never[]) => void;
// la ligne des aides « + 1 » et « + 2 » de la table : la corde de a à a + b, la tortue arrivée, ses sauts numérotés
const lineAid = (g: Gfx, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, a: number, b: number) => {
  const n = b + 2, L: LineSpec = { x0: x, x1: x + w, y, n, labels: Array.from({ length: n }, (_, i) => (i <= b ? String(a + i) : null)), k: 0 };
  drawLine(ctx, L);
  for (let i = 0; i < b; i++) drawJumpArc(ctx, tickP(L, i), tickP(L, i + 1), 1, { h: 44, label: String(i + 1), labelColor: "#fffaf0" });
  const [tx, ty] = tickP(L, b); g.push(tx - 4, ty - 5, 0.9); drawTurtle(g, TURTLE_REST, 0, 0); g.pop();
};
const FNS: Record<string, Fn> = {
  lessonsKey: (g, _c, cx: number, cy: number) => drawLessonsKey(g, cx, cy),
  menuTile: (g, _c, cx: number, cy: number, id: string) => drawLessonMenuTile(g, cx, cy, id),
  tableTile: (g, _c, cx: number, cy: number, op: "+" | "×") => drawTableTile(g, cx, cy, op),
  reserved: (g, _c, cx: number, cy: number) => drawReservedTile(g, cx, cy),
  rowIcon: (g, _c, cx: number, cy: number, ex: "ligne" | "additions" | "calcul") => drawRowIcon(g, cx, cy, ex),
  aToi: (g, _c, cx: number, cy: number, ex: "ligne" | "additions" | "calcul", level: number) => drawAToiKey(g, cx, cy, ex, level),
  bigHome: (g, _c, cx: number, cy: number) => drawBigHomeKey(g, cx, cy),
  trawl: (g, _c, cx: number, top: number, k: number, s: number) => { g.push(cx, top, s); drawTrawl(g, 0, 0, k); g.pop(); },
  fishNet: (g, _c, x: number, y: number, s: number) => { g.push(x, y, s); drawFishNet(g, 0, 0); g.pop(); },
  addTable: (_g, c, spec: AddTableSpec) => drawAddTable(c, spec),
  tileRing: (_g, c, cx: number, cy: number, w: number, h: number) => drawTileRing(c, cx, cy, w, h),
  number: (_g, c, t: string, cx: number, top: number, em: number, color?: string) => drawNumber(c, t, cx, top, em, { color, w: em * 0.14 }),
  word: (_g, c, t: string, cx: number, top: number, em: number, color?: string) => drawWord(c, t, cx, top, em, { color, w: em * 0.14 }),
  panel: (_g, c, x: number, y: number, w: number, h: number) => drawPanel(c, x, y, w, h),
  lineAid: (g, c, x: number, y: number, w: number, a: number, b: number) => lineAid(g, c, x, y, w, a, b),
};

declare global { interface Window { DESSINS: unknown } }
export const DESSINS = {
  // peint dans `canvas` (W × H px logiques, densité px) ; `grain` : le papier, comme l'export de l'application
  peindre(canvas: HTMLCanvasElement, W: number, H: number, px: number, nom: string, ...args: unknown[]) {
    canvas.width = Math.round(W * px); canvas.height = Math.round(H * px);
    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as unknown as Ctx, env = envFor(W, H, px);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    const g = new Gfx(ctx, env, 0, PENCIL);
    (FNS[nom] as (...a: unknown[]) => void)(g, ctx, ...args);
    // le grain du papier, multiplié dans ce qui est dessiné (l'alpha d'origine est gardé)
    const c2 = ctx as unknown as CanvasRenderingContext2D, w = canvas.width, h = canvas.height, before = c2.getImageData(0, 0, w, h);
    c2.save(); c2.setTransform(1, 0, 0, 1, 0, 0); c2.globalCompositeOperation = "multiply"; c2.globalAlpha = PAPER;
    c2.fillStyle = c2.createPattern(tile(env, "paper").canvas as CanvasImageSource, "repeat")!; c2.fillRect(0, 0, w, h); c2.restore();
    const after = c2.getImageData(0, 0, w, h); for (let i = 3; i < after.data.length; i += 4) after.data[i] = before.data[i]; c2.putImageData(after, 0, 0);
  },
  addTableCell, addTableSize, wordWidth,
};
