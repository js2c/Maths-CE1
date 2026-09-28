// LE TOUCHER (lot 3 bis, docs/SPEC-LOT3BIS.md, A5), sans DOM : testé par tests/unit/lot3bis-toucher.test.mjs.
//  - `TapGate` : un second toucher sur la même touche en moins de `doubleMs` (content/seance.json, toucher.doubleMs :
//    150 ms) est ignoré (un doigt qui rebondit ne tape pas « 77 ») ; `close()` ferme la porte pendant un retour (« bravo »,
//    correction) : tout toucher est ignoré jusqu'à `open()`, à l'affichage de la question suivante.
export class TapGate {
  constructor({ doubleMs = 150 } = {}) { this.doubleMs = doubleMs; this.last = null; this.closed = false; }
  close() { this.closed = true; }
  open() { this.closed = false; this.last = null; }
  // le toucher de la touche `key` à l'instant `t` (ms) compte-t-il ?
  accept(key, t) {
    if (this.closed) return false;
    if (this.last && this.last.key === key && t - this.last.t < this.doubleMs) return false;
    this.last = { key, t };
    return true;
  }
}
// la reprise après une pause (bouton « maison », puis « continuer ») : si la séance attendait une réponse, la consigne est
// redite, précédée de « On continue ! », dans les trois modules (lot 3 bis, A5) ; sinon rien de plus (une correction
// coupée reprend sa phrase, puis la question suivante dit sa consigne)
export const repriseText = ({ attend, consigne, reprise }) => (attend && consigne ? `${reprise} ${consigne}` : null);
