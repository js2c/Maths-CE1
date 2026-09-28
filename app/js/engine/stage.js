// LA SCÈNE. Tout est pensé dans un repère logique de 1280 × 800 (la tablette en paysage), agrandi ou
// réduit pour remplir l'écran sans déformation. `px` = pixels de l'écran par pixel logique : c'est
// l'échelle à laquelle les images sont affichées (et donc choisies).
//
// Couches, de bas en haut (voir docs/ARCHITECTURE.md). Le moins possible de calques plein écran : sans
// processeur graphique, le navigateur doit les superposer lui-même à chaque image.
//   #bg     le fixe : eau, rayons, sable, rochers (une image, composée une fois)
//   #line   la ligne graduée de la question, dessinée par un Worker dans une bande (line.js)
//   #back   le décor mobile : reflets, algues, poissons, bulles (des acteurs, voir actor.js)
//   #octo   la pieuvre, recomposée 12 fois/s, inclinée et déplacée par le compositeur (transform CSS)
//   #front  le premier plan : étoile de mer, tortue, surbrillances (des acteurs)
//   #ui     les boutons (réponses, réécouter), en éléments HTML
export const W = 1280, H = 800;

export class Stage {
  constructor(root) {
    this.root = root;
    this.bg = root.querySelector("#bg"); this.ui = root.querySelector("#ui");
    this.listeners = new Set(); this.ticks = new Set();
    this.perf = { frames: 0, work: [], gaps: [], level: 0 };
    this.resize();
    addEventListener("resize", () => { this.resize(); this.listeners.forEach((f) => f()); });
  }
  resize() {
    const vw = innerWidth, vh = innerHeight, k = Math.min(vw / W, vh / H), dpr = devicePixelRatio || 1;
    this.k = k; this.px = k * dpr;
    Object.assign(this.root.style, { width: `${W * k}px`, height: `${H * k}px`, left: `${(vw - W * k) / 2}px`, top: `${(vh - H * k) / 2}px` });
    this.ui.style.transform = `scale(${k})`;
    for (const c of [this.bg]) { c.width = Math.round(W * this.px); c.height = Math.round(H * this.px); }
  }
  onResize(f) { this.listeners.add(f); }
  // la boucle d'animation : chaque rappel reçoit (t en s, dt en s). On mesure le temps de travail de
  // chaque image et l'intervalle entre deux images ; si la moyenne dépasse 20 ms, on allège (niveau 1
  // puis 2 : voir scene.js), et on remonte quand tout redevient fluide.
  start() {
    let last = performance.now();
    // l'horodatage de requestAnimationFrame peut, rarement, être plus ancien que celui de l'image précédente : le temps
    // donné aux animations ne recule jamais (sinon, indice d'image négatif : lot 3, étape 5)
    const loop = (stamp) => {
      const now = Math.max(stamp, last), dt = Math.min(0.1, (now - last) / 1000); last = now;
      requestAnimationFrame(loop);
      // en pause (espace parent ouvert par-dessus) : rien n'est dessiné ni mesuré
      if (this.paused) { this.resumed = true; return; }
      const t0 = performance.now();
      for (const f of this.ticks) f(now / 1000, dt);
      this.measure(performance.now() - t0, dt * 1000);
    };
    requestAnimationFrame(loop);
  }
  measure(work, gap) {
    const p = this.perf; p.frames++;
    if (this.resumed) { this.resumed = false; return; } // l'image qui suit une pause ne compte pas
    // les 3 premières secondes (chargement, décodage) et les onglets cachés ne comptent pas
    if (performance.now() < 3000 + (this.t0 ??= performance.now()) || document.hidden) return;
    p.work.push(work); p.gaps.push(gap); if (p.work.length > 120) { p.work.shift(); p.gaps.shift(); }
    if (p.frames % 60 === 0 && p.gaps.length >= 60) {
      const avg = p.gaps.reduce((a, b) => a + b, 0) / p.gaps.length;
      if (avg > 20 && p.level < 2) { p.level++; p.work.length = p.gaps.length = 0; }
      else if (avg < 17.5 && p.level > 0 && p.frames % 600 === 0) p.level--;
    }
  }
}
