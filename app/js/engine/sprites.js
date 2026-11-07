// LES SPRITES. `assets/art/atlas.json` (fabriqué par l'atelier) dit où se trouve chaque image dans les
// planches WebP, et son décalage par rapport au point d'ancrage du sprite. Les planches existent en @1x
// et @2x ; on prend la plus proche au-dessus de l'échelle d'affichage et, si elle ne tombe pas juste
// (écran à 1,5 pixel par pixel logique, par exemple), on la réduit UNE fois au chargement : ensuite chaque
// image est une copie pixel pour pixel, sans rééchantillonnage à chaque affichage.
// (lot « Nouveaux boutons, mascotte du récif et étoiles ») LES BOUTONS FAITS D'UNE IMAGE DU PARENT (engine/boutons.js, USAGES) se
// dessinent comme des sprites : un usage se charge et se libère avec sa planche ; son image (assets/boutons/<image>-<d>@1x|2x.webp,
// la plus proche au-dessus de l'échelle) est réduite UNE fois au chargement à son diamètre exact à l'écran, puis posée centrée sur
// l'ancrage, pixel pour pixel. Tant que l'image manque (pas encore générée, ou pas encore chargée), l'ancien dessin de l'atelier
// (`ancien`, à son échelle `k`) est posé à sa place.
import { clock } from "./clock.js";
import { USAGES, fichier, usagesDe } from "./boutons.js";

const BASE = "assets/art/", BOUTONS = "assets/boutons/";

export class Sprites {
  constructor(atlas, px, boutons = null) {
    this.atlas = atlas; this.px = px;
    this.boutons = boutons?.images ?? {}; // les images de boutons qui existent (index.json : image -> diamètres)
    this.btn = new Map(); // fichier -> ImageBitmap (à son diamètre exact à l'écran ; null : en cours)
    this.src = px > 1.2 ? 2 : 1; // planche source
    this.r = px / this.src; // réduction appliquée au chargement (1 si l'échelle tombe juste)
    this.pages = new Map(); // "planche@échelle" -> ImageBitmap[]
    this.loading = new Map();
  }
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
    return Promise.all([this.loading.get(key), this.chargerBoutons(sheet)]).then(clock.hold()); // (lot 3, étape 5 : la porte de l'activité qui charge)
  }
  ready(sheet) { return this.pages.has(sheet); }
  // le fichier de l'image d'un usage, s'il existe
  fichierBouton(nom) { const u = USAGES[nom]; return u && this.boutons[u.image]?.includes(u.d) ? fichier(u.image, u.d) : null; }
  // les images des boutons d'une planche (celles qui existent), chacune décodée à son diamètre exact à l'écran ; une image
  // partagée par deux usages n'est chargée qu'une fois ; une image qui ne se charge pas laisse l'ancien dessin
  chargerBoutons(sheet) {
    const f = [...new Set(usagesDe(sheet).map((n) => this.fichierBouton(n)).filter(Boolean))].filter((x) => !this.btn.has(x));
    return Promise.all(f.map(async (x) => {
      const d = Number(x.split("-").pop()), n = Math.round(d * this.px);
      this.btn.set(x, null);
      try {
        const blob = await (await fetch(`${BOUTONS}${x}@${this.src}x.webp`)).blob();
        const b = await createImageBitmap(blob, n === d * this.src ? {} : { resizeWidth: n, resizeHeight: n, resizeQuality: "high" });
        if (this.btn.has(x)) this.btn.set(x, b); else b.close?.();
      } catch { this.btn.delete(x); }
    }));
  }
  // (lot « Correctifs : la carte graphique perdue ») après une perte de la carte graphique, les images décodées des planches
  // peuvent être abîmées (les poissons du lagon, redessinés depuis leur planche, restaient coupés net) : chaque planche chargée est
  // décodée à nouveau (depuis le cache), puis remplace l'ancienne. Une planche libérée pendant ce temps n'est pas
  // reprise. Renvoie le nombre de planches refaites.
  async recharger() {
    let n = 0;
    await Promise.all([...this.pages.entries()].map(async ([sheet, avant]) => {
      const scale = this.atlas.sheets[`${sheet}@${this.src}`] ? this.src : 1, r = avant.r;
      try {
        const pages = await Promise.all(this.atlas.sheets[`${sheet}@${scale}`].map(async (p) => {
          const blob = await (await fetch(BASE + p.file)).blob();
          return Math.abs(r - 1) < 0.01 ? createImageBitmap(blob) : createImageBitmap(blob, { resizeWidth: Math.round(p.w * r), resizeHeight: Math.round(p.h * r), resizeQuality: "high" });
        }));
        if (this.pages.get(sheet) !== avant) { pages.forEach((b) => b.close?.()); return; }
        // (les anciennes images ne sont pas fermées : un dessin en cours peut encore les tenir, et dessiner une image fermée échoue ;
        // le ramasse-miettes les rend)
        this.pages.set(sheet, { pages, r }); n++;
      } catch { /* la planche d'avant reste : mieux vaut une image peut-être abîmée que rien */ }
    }));
    // (lot « Nouveaux boutons… ») les boutons faits d'une image, de même : décodés à nouveau (les anciens restent jusque-là)
    const avant = new Map(this.btn), planches = [...this.pages.keys()];
    this.btn.clear(); await Promise.all(planches.map((p) => this.chargerBoutons(p)));
    for (const [x, b] of avant) if (!this.btn.get(x)) this.btn.set(x, b);
    return n;
  }
  // les planches chargées ou en cours de chargement
  held() { return new Set([...this.pages.keys(), ...[...this.loading.keys()].map((k) => k.split("@")[0])]); }
  // libère une grande planche dont on n'a plus besoin (récif, cartes) : la mémoire décodée est rendue
  // (lot 3, étape 5 : pendant une visite en pause, les planches de la séance sont épinglées, `pinned` : jamais libérées)
  // (correctif du 5 octobre 2026) les planches permanentes (`keep`, celles des boutons, du lagon, de la tortue : main.js,
  // ALWAYS) ne sont jamais libérées : le récif libérait « petits » quand un cadeau de la surprise y était posé, et les
  // boutons de l'accueil se redessinaient à vide (présents, cliquables, invisibles)
  unload(sheet) {
    if (this.pinned?.has(sheet) || this.keep?.has(sheet)) return;
    const p = this.pages.get(sheet); if (!p) return;
    p.pages.forEach((b) => b.close?.()); this.pages.delete(sheet);
    // (lot « Nouveaux boutons… ») les boutons de la planche, sauf ceux qu'une autre planche chargée partage
    const gardes = new Set([...this.pages.keys()].flatMap((k) => usagesDe(k).map((n) => this.fichierBouton(n))));
    for (const n of usagesDe(sheet)) { const x = this.fichierBouton(n); if (x && !gardes.has(x) && this.btn.has(x)) { this.btn.get(x)?.close?.(); this.btn.delete(x); } }
    for (const k of [...this.loading.keys()]) if (k.startsWith(`${sheet}@`)) this.loading.delete(k);
  }
  // une image : la page, le rectangle source et le décalage depuis l'ancrage, en pixels d'écran
  // (lot 3, étape 5 : l'indice est ramené dans la boucle, même négatif, non entier ou NaN, voir frameIndex ; si une image
  // manque quand même, `onMissing` journalise le contexte au lieu de faire planter l'animation)
  frame(name, f = 0) {
    // (un bouton fait d'une image : l'image, centrée, à sa taille exacte ; sinon l'ancien dessin à son échelle, `dw` × `dh`)
    const u = USAGES[name];
    if (u) {
      const b = this.btn.get(this.fichierBouton(name));
      if (b) return { img: b, sx: 0, sy: 0, w: b.width, h: b.height, dx: -b.width / 2, dy: -b.height / 2, bouton: true };
      const q = this.frame(u.ancien, f);
      return q && { ...q, dx: q.dx * u.k, dy: q.dy * u.k, dw: q.w * u.k, dh: q.h * u.k };
    }
    const s = this.atlas.sprites[name], sheet = this.pages.get(s.sheet);
    if (!sheet) return null;
    const scale = s.rects[this.src] ? this.src : 1, list = s.rects[scale], q = list?.[frameIndex(f, list.length)], r = sheet.r;
    if (!q) { this.onMissing?.({ sprite: name, image: f, images: list?.length ?? 0 }); return null; }
    return { img: sheet.pages[q[0]], sx: q[1] * r, sy: q[2] * r, w: q[3] * r, h: q[4] * r, dx: q[5] * r, dy: q[6] * r };
  }
  // pose l'image f du sprite avec son ancrage en (x, y) logiques ; renvoie le rectangle touché (pixels d'écran)
  draw(ctx, name, f, x, y, alpha = 1) {
    const q = this.frame(name, f); if (!q) return null;
    const X = Math.round(x * this.px + q.dx), Y = Math.round(y * this.px + q.dy);
    ctx.globalAlpha = alpha; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, X, Y, q.dw ?? q.w, q.dh ?? q.h); ctx.globalAlpha = 1;
    return [X, Y, q.dw ?? q.w, q.dh ?? q.h];
  }
}

// l'indice d'une image dans une boucle de n images : entier, de 0 à n - 1 (un temps qui recule donnait un indice négatif,
// d'où « Cannot read properties of undefined (reading '0') » ; tests/unit/erreur-image.test.mjs)
export const frameIndex = (f, n) => (n > 0 && Number.isFinite(f) ? ((Math.floor(f) % n) + n) % n : 0);

export const loadAtlas = async () => (await fetch(BASE + "atlas.json")).json();
// (lot « Nouveaux boutons… ») les images de boutons qui existent ; sans elles, chaque bouton garde son ancien dessin
export const loadBoutons = async () => { try { return await (await fetch(BOUTONS + "index.json")).json(); } catch { return null; } };
