// LA FLÈCHE (lot « Mascotte », docs/SPEC.md, section 11) : là où la pieuvre montrait du bras (la cible de la consigne sur
// la ligne graduée, la tortue, l'étoile ou la loupe d'une leçon, le petit poisson du mur, le nombre décomposé d'une
// correction), une flèche se pose au-dessus de ce qui est montré. Elle est dessinée dans l'atelier, en style A (sprite
// « fleche », art/src/canvas-core/sea/fleche.ts, ancrée à sa pointe) ; ici, un acteur du premier plan qu'on déplace :
//  - l'arrivée : elle tombe de 46 px en 0,42 s, avec un petit rebond (dépassement puis retour), et apparaît en fondu ;
//  - ensuite elle respire : un balancement vertical de 4 px, toutes les 1,6 s (« rien n'est jamais figé ») ;
//  - `montrer([x, y], { angle })` : la pointe en (x, y) logiques (déjà posée ailleurs : elle y retombe) ; `angle` : 0, elle
//    pointe vers le bas ; 90, vers la gauche (posée à droite de ce qu'elle montre) ; la cible peut être une fonction, appelée à
//    chaque image (la flèche suit le poisson qu'on fait glisser) ; `cacher()`.
export const ARRIVEE = { chute: 46, ms: 420, balancement: 4, periode: 1.6 };
// la courbe de l'arrivée : u de 0 à 1 → décalage (1 : tout en haut, 0 : posée), avec un léger dépassement
export function arrivee(u) {
  if (u >= 1) return 0;
  const c = 1.9, v = u - 1; // « easeOutBack » retourné
  return -(1 + (c + 1) * v * v * v + c * v * v) + 1;
}
export class Fleche {
  constructor(ocean) {
    this.o = ocean; this.a = null; this.cible = null; this.t0 = 0;
    ocean.front.push((t) => this.tick(t));
  }
  get acteur() {
    if (!this.a && this.o.sp.atlas.sprites.fleche) { this.a = this.o.spriteActor(this.o.frontEl, "fleche"); this.a.draw(0); this.a.show(false); }
    return this.a;
  }
  montrer(cible, { angle = 0 } = {}) {
    if (!this.acteur) return;
    this.source = cible; this.angle = angle; this.t0 = performance.now(); this.a.show(true); this.tick();
  }
  cacher() { this.source = null; this.cible = null; this.a?.show(false); }
  get visible() { return !!this.source; }
  tick() {
    if (!this.source || !this.a) return;
    const p = typeof this.source === "function" ? this.source() : this.source;
    if (!p) return this.cacher();
    this.cible = p;
    const now = performance.now(), u = Math.min(1, (now - this.t0) / ARRIVEE.ms), [x, y] = p;
    const bob = u < 1 ? 0 : ARRIVEE.balancement * Math.sin((2 * Math.PI * (now - this.t0 - ARRIVEE.ms)) / 1000 / ARRIVEE.periode);
    // le recul le long de la flèche (vers le haut quand elle pointe vers le bas, vers la droite quand elle pointe à gauche)
    const d = ARRIVEE.chute * arrivee(u) + Math.max(0, bob), r = (this.angle * Math.PI) / 180;
    this.a.moveTo(x + d * Math.sin(r), y - d * Math.cos(r), 1, Math.min(1, u * 2.5), this.angle);
  }
}
