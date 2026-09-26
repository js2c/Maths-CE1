// LES SPRITES. `assets/art/atlas.json` (fabriqué par l'atelier) dit où se trouve chaque image dans les
// planches WebP, et son décalage par rapport au point d'ancrage du sprite. Les planches existent en @1x
// et @2x ; on prend la plus proche au-dessus de l'échelle d'affichage et, si elle ne tombe pas juste
// (écran à 1,5 pixel par pixel logique, par exemple), on la réduit UNE fois au chargement : ensuite chaque
// image est une copie pixel pour pixel, sans rééchantillonnage à chaque affichage.
const BASE = "assets/art/";

export class Sprites {
  constructor(atlas, px) {
    this.atlas = atlas; this.px = px;
    this.src = px > 1.2 ? 2 : 1; // planche source
    this.r = px / this.src; // réduction appliquée au chargement (1 si l'échelle tombe juste)
    this.pages = new Map(); // "planche@échelle" -> ImageBitmap[]
    this.loading = new Map();
  }
  sheetOf(name) { const s = this.atlas.sprites[name]; if (!s) throw new Error(`sprite inconnu : ${name}`); return s.sheet; }
  // charge une planche (toutes ses pages) ; les appels répétés partagent la même promesse
  load(sheet) {
    const scale = this.atlas.sheets[`${sheet}@${this.src}`] ? this.src : 1, key = `${sheet}@${scale}`;
    if (!this.loading.has(key)) this.loading.set(key, (async () => {
      const r = this.px / scale, pages = await Promise.all(this.atlas.sheets[key].map(async (p) => {
        const blob = await (await fetch(BASE + p.file)).blob();
        return Math.abs(r - 1) < 0.01 ? createImageBitmap(blob) : createImageBitmap(blob, { resizeWidth: Math.round(p.w * r), resizeHeight: Math.round(p.h * r), resizeQuality: "high" });
      }));
      this.pages.set(sheet, { pages, r });
    })());
    return this.loading.get(key);
  }
  ready(sheet) { return this.pages.has(sheet); }
  // libère une grande planche dont on n'a plus besoin (récif, cartes) : la mémoire décodée est rendue
  unload(sheet) {
    const p = this.pages.get(sheet); if (!p) return;
    p.pages.forEach((b) => b.close?.()); this.pages.delete(sheet);
    for (const k of [...this.loading.keys()]) if (k.startsWith(`${sheet}@`)) this.loading.delete(k);
  }
  // une image : la page, le rectangle source et le décalage depuis l'ancrage, en pixels d'écran
  frame(name, f = 0) {
    const s = this.atlas.sprites[name], sheet = this.pages.get(s.sheet);
    if (!sheet) return null;
    const scale = s.rects[this.src] ? this.src : 1, q = s.rects[scale][f % s.rects[scale].length], r = sheet.r;
    return { img: sheet.pages[q[0]], sx: q[1] * r, sy: q[2] * r, w: q[3] * r, h: q[4] * r, dx: q[5] * r, dy: q[6] * r };
  }
  // pose l'image f du sprite avec son ancrage en (x, y) logiques ; renvoie le rectangle touché (pixels d'écran)
  draw(ctx, name, f, x, y, alpha = 1) {
    const q = this.frame(name, f); if (!q) return null;
    const X = Math.round(x * this.px + q.dx), Y = Math.round(y * this.px + q.dy);
    ctx.globalAlpha = alpha; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, X, Y, q.w, q.h); ctx.globalAlpha = 1;
    return [X, Y, q.w, q.h];
  }
}

export const loadAtlas = async () => (await fetch(BASE + "atlas.json")).json();
