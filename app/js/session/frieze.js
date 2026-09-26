// LA FRISE D'AVANCEMENT (docs/SPEC.md, « Navigation pendant la séance ») : en haut de l'écran, une bulle
// par étape de la séance (accueil, échauffement, notion du jour, récompense ; les étapes désactivées ne
// sont pas montrées) et, dans l'étape en cours, une rangée de petites bulles qui se remplissent à chaque
// question. Pas de chiffre, pas de chronomètre. Un seul calque, repeint quand la séance avance.
import * as R from "../art/runtime.js";
import { spriteBox } from "../engine/ui.js";

const X0 = 150, X1 = 950, Y = 60, STEP = 64, DOT = 22, GAP = 14;

export class Frieze {
  // steps : les étapes actives de seance.json (leurs id ont chacun un pictogramme « frise.<id> »)
  constructor(app, steps) {
    this.app = app; this.steps = steps.filter((s) => app.sprites.atlas.sprites[`frise.${s}`]); this.p = { etape: null, faites: 0, prevues: 0 };
    this.el = spriteBox(app, { x: X0, y: Y - 44, w: X1 - X0, h: 88, cls: "hud frieze", still: true, paint: (ctx, px) => this.paint(ctx, px) });
    this.show(false);
  }
  show(v) { this.el.style.visibility = v ? "visible" : "hidden"; }
  set(p) { this.p = { ...p }; this.el.repaint(); }
  paint(ctx, px) {
    const { sprites } = this.app, cur = this.steps.indexOf(this.p.etape), dots = cur >= 0 ? this.p.prevues : 0;
    // la place des bulles de questions : elles se serrent s'il y en a beaucoup
    const room = X1 - X0 - this.steps.length * STEP - 2 * GAP, d = dots ? Math.min(DOT, room / dots) : 0, k = Math.min(1, d / DOT);
    let x = (X1 - X0 - (this.steps.length * STEP + (dots ? dots * d + GAP : 0))) / 2;
    this.steps.forEach((id, i) => {
      const cx = x + STEP / 2, done = cur < 0 ? false : i < cur;
      sprites.draw(ctx, `frise.${id}`, 0, cx, 44, i > cur && cur >= 0 ? 0.42 : cur < 0 ? 0.42 : 1);
      if (i === cur || done) { ctx.save(); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawRing(ctx, cx, 44, 31, i === cur ? "#ffd23a" : "#bff3ee", i === cur ? 5 : 3); ctx.restore(); }
      x += STEP;
      if (i === cur && dots) {
        x += GAP / 2;
        for (let j = 0; j < dots; j++) {
          const q = sprites.frame("frise.point", j < this.p.faites ? 1 : 0), X = Math.round((x + d / 2) * px + q.dx * k), Yp = Math.round(44 * px + q.dy * k);
          ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, X, Yp, Math.round(q.w * k), Math.round(q.h * k));
          x += d;
        }
        x += GAP / 2;
      }
    });
  }
}
