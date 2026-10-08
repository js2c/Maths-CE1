// L'ÉCRAN DE DÉMARRAGE (lot « Correctifs de la tablette », décision du parent du 8 octobre 2026 ; docs/SPEC.md, section 2).
// Au lieu de l'écran bleu du chargement : le logo « Maths CE1 » (dessiné dans l'atelier, art/src/canvas-core/sea/demarrage.ts,
// planche « demarrage », chargée la toute première), dessous de petites lignes d'information (l'année, js2c, la version de
// l'application : celle du mode hors ligne, app/version.json), et une barre de chargement qui avance réellement : chaque
// tâche annoncée (`tache(promesse, poids)` : les contenus, l'index de la voix, les planches du premier écran, les vidéos de
// la mascotte) la fait avancer quand elle se termine. Quand tout est chargé, le logo invite au toucher ; un toucher sur
// l'écran le fait disparaître, et ce toucher est aussi le premier toucher qui autorise la voix (`attendreToucher`).
// Pour les parcours de test (tests/e2e/navigateur.mjs pose `window.__demarrageAuto`) : il s'efface seul, chargement fini.
import * as R from "../art/runtime.js";

// la barre (px de la scène) : son centre, la taille de son dessin (planche « demarrage », barre vide et pleine)
export const LOGO_AT = [640, 318], BARRE_AT = [640, 600], BARRE = { w: 550, h: 74 };
// la part chargée, de 0 à 1, à partir des poids des tâches finies (fonction pure, testée)
export const avancement = (fait, total) => (total > 0 ? Math.max(0, Math.min(1, fait / total)) : 1);
// les petites lignes d'information : « 2026 », « js2c », « version 1a2b3c4 » (pas de prénom d'enfant : le dépôt est public)
export const lignesInfo = (version) => ["2026", "js2c", version ? `version ${String(version).slice(0, 7)}` : null].filter(Boolean);

export class Demarrage {
  constructor(stage, sprites) {
    this.st = stage; this.sp = sprites; this.total = 0; this.fait = 0; this.pret = false;
    const el = (this.el = document.createElement("div")); el.className = "demarrage";
    stage.ui.append(el);
    // les dessins de l'atelier, posés sur des canvas à l'échelle de l'écran
    const toile = (cls, cx, cy, w, h, paint) => {
      const c = document.createElement("canvas"); c.className = cls;
      c.width = Math.round(w * stage.px); c.height = Math.round(h * stage.px);
      Object.assign(c.style, { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px` });
      const ctx = c.getContext("2d"); paint(ctx, stage.px); el.append(c); return c;
    };
    const sprite = (ctx, name, x, y) => { try { sprites.draw(ctx, name, 0, x, y); } catch { /* planche absente : le fond suffit */ } };
    this.logo = toile("demarrage-logo", LOGO_AT[0], LOGO_AT[1], 720, 440, (ctx) => sprite(ctx, "demarrage.logo", 360, 220));
    this.vide = toile("demarrage-barre", BARRE_AT[0], BARRE_AT[1], BARRE.w, BARRE.h, (ctx) => sprite(ctx, "demarrage.barre.vide", BARRE.w / 2, BARRE.h / 2));
    this.plein = toile("demarrage-barre plein", BARRE_AT[0], BARRE_AT[1], BARRE.w, BARRE.h, (ctx) => sprite(ctx, "demarrage.barre.pleine", BARRE.w / 2, BARRE.h / 2));
    this.montrer(0);
  }
  // les petites lignes, sous la barre, écrites au feutre en bleu clair (la version n'est connue qu'un peu plus tard)
  infos(version) {
    this.info?.remove();
    const lignes = lignesInfo(version), em = 18, gap = 36, ws = lignes.map((l) => R.wordWidth(l) * em), w = ws.reduce((a, b) => a + b, 0) + gap * (lignes.length - 1) + 20, h = 34;
    const c = document.createElement("canvas"); c.className = "demarrage-info";
    c.width = Math.round(w * this.st.px); c.height = Math.round(h * this.st.px);
    Object.assign(c.style, { left: `${640 - w / 2}px`, top: `${700}px`, width: `${w}px`, height: `${h}px` });
    const ctx = c.getContext("2d"); ctx.setTransform(this.st.px, 0, 0, this.st.px, 0, 0);
    let x = 10;
    lignes.forEach((l, i) => { R.drawWord(ctx, l, x + ws[i] / 2, 8, em, { color: "#a9dfe3", w: 2.2, seed: 9500 + i * 7 }); x += ws[i] + gap; });
    this.el.append(c); this.info = c;
  }
  // une tâche de chargement : la barre avance quand elle se termine (réussie ou non : rien ne doit bloquer le démarrage)
  tache(p, poids = 1) {
    this.total += poids;
    const fin = () => { this.fait += poids; this.montrer(avancement(this.fait, this.total)); };
    Promise.resolve(p).then(fin, fin);
    return p;
  }
  // des tâches annoncées d'avance, terminées une à une (`un()`) : les vidéos de la mascotte
  annoncer(n, poids = 1) { this.total += n * poids; return () => { this.fait += poids; this.montrer(avancement(this.fait, this.total)); }; }
  // le plein de la barre, dévoilé de gauche à droite (son bord gauche, 12 px, est là dès le début ; tout, chargement fini)
  montrer(p) {
    this.part = p; const marge = 12 / BARRE.w, droite = (1 - marge) * (1 - p) * 100;
    this.plein.style.clipPath = `inset(0 ${droite.toFixed(2)}% 0 0)`;
  }
  // tout est chargé : le logo invite au toucher ; renvoie une promesse résolue au premier toucher (ou tout de suite en mode
  // automatique des tests)
  attendreToucher() {
    this.pret = true; this.montrer(1); this.el.classList.add("pret");
    if (window.__demarrageAuto) return Promise.resolve(false);
    return new Promise((res) => {
      const go = (e) => { e.preventDefault(); this.el.removeEventListener("pointerdown", go); res(true); };
      this.el.addEventListener("pointerdown", go);
    });
  }
  // il disparaît en fondu (0,4 s), puis la planche est libérée
  fermer() {
    this.el.classList.add("partir");
    return new Promise((res) => setTimeout(() => { this.el.remove(); this.sp.unload("demarrage"); res(); }, window.__demarrageAuto ? 0 : 400));
  }
}
