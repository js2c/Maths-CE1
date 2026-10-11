// LA PORTÉE D'UNE ÉTAPE (lot « Correctifs : passage de l'échauffement aux voiliers », point 1). Une étape inscrit ici ce
// qu'elle pose et ce qu'elle lance : éléments de l'écran, minuteries, écouteurs, et ce qu'il faut faire pour ranger le reste
// (`fin`). `fermer()` retire tout, une seule fois, QUELLE QUE SOIT LA FAÇON DONT L'ÉTAPE FINIT : fin normale, « passer »,
// ou abandon (pause, puis un autre exercice choisi, « Terminer la séance » du parent), où le déroulement de l'étape reste
// figé et ne passe jamais par sa propre fin (engine/clock.js, `abandon`).
// Sans DOM ni horloge : testé par tests/unit/portee.test.mjs. Les portées ouvertes sont gardées dans un ensemble
// (`ouvertes`), que l'abandon d'une activité ferme toutes (main.js, abandonActivity).
export class Portee {
  constructor(nom = "", ouvertes = null) {
    this.nom = nom; this.ouvertes = ouvertes; this.rangements = []; this.fermee = false;
    ouvertes?.add(this);
  }
  // un élément posé : retiré à la fermeture ; rendu tel quel (pour enchaîner)
  el(e) { if (e) this.fin(() => e.remove?.()); return e; }
  // une minuterie (setTimeout ou setInterval) : arrêtée à la fermeture
  minuterie(id) { this.fin(() => { clearTimeout(id); clearInterval(id); }); return id; }
  // un écouteur posé sur une cible (document, fenêtre) : retiré à la fermeture
  ecoute(cible, type, f, o) { cible.addEventListener(type, f, o); this.fin(() => cible.removeEventListener(type, f, o)); return f; }
  // tout autre rangement ; une portée déjà fermée le fait aussitôt (rien de ce qui arrive en retard ne reste)
  fin(f) { if (this.fermee) { try { f(); } catch (e) { console.warn(e); } return; } this.rangements.push(f); }
  fermer() {
    if (this.fermee) return false;
    this.fermee = true; this.ouvertes?.delete(this);
    // dans l'ordre inverse : ce qui a été posé en dernier est rangé en premier
    for (const f of this.rangements.splice(0).reverse()) { try { f(); } catch (e) { console.warn(e); } }
    return true;
  }
}
// ferme toutes les portées ouvertes (l'activité en cours est abandonnée pour de bon)
export const fermerTout = (ouvertes) => { for (const p of [...ouvertes]) p.fermer(); };
