// LA FRISE D'AVANCEMENT (docs/SPEC.md, « Navigation pendant la séance ») : en haut de l'écran, un
// pictogramme par étape de la séance (accueil, échauffement, notion du jour, récompense ; les étapes
// désactivées ne sont pas montrées) et, dans l'étape en cours, une rangée de petites bulles qui se
// remplissent à chaque question. Pas de chiffre, pas de chronomètre.
// Correctifs du 27 septembre 2026 : elle ne doit ressembler à aucun bouton. Les pictogrammes sont plats et
// petits (atelier, sea/ui.ts), sans disque ni contour épais, enfilés sur une corde fine (runtime.js,
// drawCord) ; l'étape en cours se reconnaît à sa lueur douce, les étapes à venir sont estompées. Aucune
// réaction au toucher (CSS : pointer-events: none). Un seul calque, repeint quand la séance avance.
import * as R from "../art/runtime.js";
import { spriteBox } from "../engine/ui.js";

const X0 = 150, X1 = 950, Y = 60, CY = 44, STEP = 52, DOT = 22, GAP = 12;

export class Frieze {
  // steps : les étapes actives de seance.json (leurs id ont chacun un pictogramme « frise.<id> »)
  constructor(app, steps) {
    this.app = app; this.steps = steps.filter((s) => app.sprites.atlas.sprites[`frise.${s}`]); this.p = { etape: null, faites: 0, prevues: 0 };
    this.el = spriteBox(app, { x: X0, y: Y - CY, w: X1 - X0, h: 2 * CY, cls: "hud frieze", still: true, paint: (ctx, px) => this.paint(ctx, px) });
    this.show(false);
  }
  show(v) { this.el.style.visibility = v ? "visible" : "hidden"; }
  set(p) { this.p = { ...p }; this.el.repaint(); }
  // où va chaque élément : [{ kind: "etape"|"point", id|j, x }], x au centre (px logiques du calque)
  layout() {
    const cur = this.steps.indexOf(this.p.etape), dots = cur >= 0 ? this.p.prevues : 0;
    // la place des bulles de questions : elles se serrent s'il y en a beaucoup
    const room = X1 - X0 - this.steps.length * STEP - 2 * GAP, d = dots ? Math.min(DOT, room / dots) : 0, out = [];
    let x = (X1 - X0 - (this.steps.length * STEP + (dots ? dots * d + GAP : 0))) / 2;
    this.steps.forEach((id, i) => {
      out.push({ kind: "etape", id, i, x: x + STEP / 2 }); x += STEP;
      if (i === cur && dots) { x += GAP / 2; for (let j = 0; j < dots; j++) { out.push({ kind: "point", j, x: x + d / 2 }); x += d; } x += GAP / 2; }
    });
    return { cur, k: d ? Math.min(1, d / DOT) : 1, items: out };
  }
  paint(ctx, px) {
    const { sprites } = this.app, { cur, k, items } = this.layout();
    // la corde, sous tout le reste
    ctx.save(); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawCord(ctx, items.map((e) => [e.x, CY])); ctx.restore();
    for (const e of items) {
      if (e.kind === "etape") {
        // en cours : la lueur derrière ; faite : pleine ; à venir (ou pas encore commencée) : estompée
        if (e.i === cur) sprites.draw(ctx, "frise.lueur", 0, e.x, CY);
        sprites.draw(ctx, `frise.${e.id}`, 0, e.x, CY, cur >= 0 && e.i <= cur ? 1 : 0.45);
      } else {
        const q = sprites.frame("frise.point", e.j < this.p.faites ? 1 : 0), X = Math.round(e.x * px + q.dx * k), Yp = Math.round(CY * px + q.dy * k);
        ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, X, Yp, Math.round(q.w * k), Math.round(q.h * k));
      }
    }
  }
}
