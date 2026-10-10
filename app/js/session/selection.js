// CHOISIR EN DEUX TOUCHERS (lot « Correctifs de la tablette », décision du parent du 8 octobre 2026 ; docs/SPEC.md,
// section 3) : elle remplace la validation simple en un toucher (décision du 28 septembre) sur les écrans de choix : l'écran
// « choisir » (exercices, puis niveaux), le menu des leçons (tables comprises) et les mêmes écrans de l'entraînement libre.
//  - premier toucher sur une tuile : elle est SÉLECTIONNÉE (bordure corail épaisse, distincte du halo doré du conseillé) ; la
//    mascotte dit son nom et une courte description (textes.json, choixDescription : la légende du parent dite à une enfant),
//    et le même texte s'écrit dans une bulle qui part d'un coin de la tuile (engine/bulle.js, placesTuile) ;
//  - second toucher sur la même tuile : elle se lance ; un toucher sur une autre tuile la sélectionne à la place ; un toucher
//    hors des tuiles désélectionne ;
//  - l'appui long ne lance rien, et ne montre rien de plus (lot « Correctifs : passage de l'échauffement aux voiliers », point 7 :
//    l'étiquette rectangulaire qu'il montrait doublait la bulle de la mascotte, avec un autre texte) ; le petit livre de la
//    légende reste, pour le parent.
// La règle seule (sans DOM) est `Selection` (testée : tests/unit/correctifs-tablette.test.mjs).
import { onBrief, pop } from "../engine/ui.js";
import { placesTuile } from "../engine/bulle.js";

// la règle : `toucher(clé)` renvoie « choisie » (premier toucher, ou une autre tuile), « lancee » (second toucher sur la même),
// `dehors()` renvoie « vide » s'il y avait une tuile sélectionnée
export class Selection {
  constructor() { this.cle = null; }
  toucher(cle) { if (this.cle !== null && this.cle === cle) return "lancee"; this.cle = cle; return "choisie"; }
  dehors() { const avant = this.cle; this.cle = null; return avant !== null ? "vide" : null; }
}

// les tuiles voisines d'une tuile (pour la bulle : à ne pas cacher si possible) : celles dont le centre est à moins de
// `portee` fois la taille de la tuile, dans les deux sens
export const voisines = (r, toutes, portee = 1.45) => {
  const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2, w = r[2] - r[0], h = r[3] - r[1];
  return toutes.filter((o) => o !== r && Math.abs((o[0] + o[2]) / 2 - cx) < w * portee && Math.abs((o[1] + o[3]) / 2 - cy) < h * portee);
};

// l'écran : `tuiles` (boutons, chacun avec dataset.key), `texte(clé)` (ce que dit la mascotte),
// `peindre(clé | null)` (la tuile sélectionnée est redessinée avec sa bordure). Renvoie une promesse : la clé lancée.
export function deuxTouchers(app, { tuiles, texte, peindre = () => {} }) {
  const { voice, bulle, stage } = app, sel = new Selection();
  // (la place d'un bouton : celle de son style, en px de la scène ; sa boîte à l'écran est réduite pendant son petit rebond)
  const rect = (b) => { const x = parseFloat(b.style.left), y = parseFloat(b.style.top); return [x, y, x + parseFloat(b.style.width), y + parseFloat(b.style.height)]; };
  let cur = null, fini = false, quand = 0;
  const vider = () => { if (sel.dehors() !== "vide") return; const b = cur; cur = null; peindre(null); b?.classList.remove("choisie"); b?.repaint(); voice.stop(); bulle.ancrer(null); };
  return new Promise((res) => {
    // un toucher hors des tuiles (pas sur un bouton de commande) désélectionne
    // (l'écran quitté sans rien lancer, par la maison ou le retour : ses tuiles ne sont plus là, l'écouteur s'en va)
    const dehors = (e) => { if (!tuiles.some((t) => t.isConnected)) { fini = true; document.removeEventListener("pointerdown", dehors, true); return; } if (fini || !cur) return; if (tuiles.includes(e.target.closest?.("button"))) return; if (e.target.closest?.(".legende, .legende-voile, .legende-panneau, .legende-fermer, .homekey, .session-home")) return; vider(); };
    document.addEventListener("pointerdown", dehors, true);
    const finir = (k) => { fini = true; document.removeEventListener("pointerdown", dehors, true); bulle.ancrer(null); res(k); };
    for (const b of tuiles) {
      onBrief(app, b, () => {
        if (fini) return;
        // (relecture du lot : un second toucher moins de 0,3 s après le premier, un doigt qui rebondit ou un double toucher
        // trop rapide, ne lance pas : la mascotte a le temps de commencer à dire ce que c'est)
        const k = b.dataset.key, t0 = performance.now();
        if (cur === b && t0 - quand < (app.toucher?.secondToucherMs ?? 300)) return;
        const r = sel.toucher(k); quand = t0;
        if (r === "lancee") { b.classList.remove("choisie"); pop(b); return finir(k); }
        const avant = cur; cur = b; peindre(k);
        avant?.classList.remove("choisie"); avant?.repaint(); b.repaint(); pop(b);
        // la tuile sélectionnée se balance doucement, comme la bulle « jouer » : elle invite au second toucher
        setTimeout(() => { if (cur === b && !fini) b.classList.add("choisie"); }, 450);
        // la bulle part d'un coin de la tuile ; elle évite la tuile, les boutons de commande, la tête de la mascotte, et si
        // possible les tuiles voisines (comptées deux fois), puis les autres
        const t = texte(k), r0 = rect(b), toutes = tuiles.filter((x) => x.checkVisibility?.({ visibilityProperty: true }) ?? true).map(rect);
        const proches = voisines(r0, toutes.filter((o) => o.join() !== r0.join()));
        // (le compteur d'étoiles : à éviter si possible, comme les tuiles voisines)
        const etoiles = [...stage.ui.querySelectorAll(".hud.stars")].map(rect);
        const fixes = [...stage.ui.querySelectorAll(".homekey, .session-home, .choix-retour, .legende, .mascotte-tap")].filter((e) => e.checkVisibility?.({ visibilityProperty: true }) ?? true).map(rect);
        bulle.ancrer({ texte: t, places: placesTuile(r0), obstacles: () => ({ durs: [r0.map((v, i) => v + (i < 2 ? -4 : 4)), ...fixes], souples: [...proches, ...proches, ...etoiles, ...toutes.filter((o) => o.join() !== r0.join())] }) });
        voice.stop(); voice.say(t);
      }, null); // (point 7 : sans étiquette)
    }
  });
}
