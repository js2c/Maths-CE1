// JOUER COMME UNE ENFANT (partagé par l'enfant imprévisible, tests/e2e/enfant.mjs, et la journée d'usage, tests/e2e/journee.mjs ;
// lot « Banc Android et recette en conditions réelles »). Des fonctions évaluées DANS la page :
//  - CIBLES : ce qui se touche à l'écran (boutons visibles et scènes), avec leur centre ;
//  - REPONDRE(juste) : répondre à la question en cours, quelle qu'elle soit (pavé, bulles, ligne, voiliers, étal), juste ou faux ;
//  - ATTEND : une question attend-elle sa réponse ?
// les cibles possibles : boutons visibles (avec leur boîte) et scènes à toucher
export const CIBLES = () => {
  const vis = (e) => e.isConnected && !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true });
  return [...document.querySelectorAll("#ui button, .pa button, .pa input, canvas.recif-dessin, .demarrage, .etal-scene .etal-objet")].filter(vis).map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, quoi: (e.getAttribute("aria-label") || e.className || e.tagName).toString().slice(0, 40), cls: String(e.className) }; }).filter((t) => t.w > 4 && t.h > 4 && t.x > 0 && t.y > 0 && t.x < innerWidth && t.y < innerHeight);
};
// répondre comme une enfant qui joue : juste (le plus souvent) ou faux, à la question en cours, quelle qu'elle soit
export const REPONDRE = async (juste) => {
  const a = window.__app, f = a.facts, s = a.screen, r = (n) => (juste ? n : n + 1 + Math.floor(Math.random() * 3));
  const taper = async (n) => { for (const d of String(n)) { document.querySelector(`.key[data-key="${d}"]:not(.etal-key)`)?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await new Promise((x) => setTimeout(x, 180)); } const v = document.querySelector('.key[data-key="valider"]:not(.etal-key)'); v?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); v?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); };
  if (f?.q && f.resolve && !f.locked) {
    const q = f.q;
    let n = q.dictee ? q.answer : q.forme === "trouDroite" || q.forme === "trou" ? q.b : q.forme === "trouGauche" ? q.a : q.module === 5 ? q.a * q.b : q.op ? (await import("./js/modules/calc/calc.js")).answerOf(q) : q.a + q.b;
    await taper(r(n)); return "pavé";
  }
  if (s?.q && s.resolve && !s.locked) { const q = s.q; if (q.choices) { const v = juste ? q.answer : q.choices.find((c) => c.value !== q.answer)?.value ?? q.answer; document.querySelector(`.answer[data-value="${v}"]`)?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); return "bulle"; } s.aimed = juste ? q.answer : q.answer + 1; s.answer(s.aimed, null); return "ligne"; }
  if (a.voiliers?.attend && a.voiliers.q) { const q = a.voiliers.q; a.voiliers.api.deposer(juste ? q.k : (q.k + 1) % Math.max(2, (q.bouees?.length ?? 3) + 1)); return "voiliers"; }
  if (a.etal?.attend && a.etal.q) {
    const e = a.etal, q = e.q;
    if (q.type === "rendre") { const { rendu } = await import("./js/modules/etal/etal.js"); for (const d of String(Math.round((juste ? rendu(q) : rendu(q) + 100) / 100))) { document.querySelector(`.etal-key[data-key="${d}"]`)?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await new Promise((x) => setTimeout(x, 180)); } }
    else { const { solution } = await import("./js/modules/etal/etal.js"), cfg = a.module6.niveaux[q.niveau - 1], sol = solution(cfg, q.type === "poser" ? 0 : q.prix, q.portefeuille, q.valeur); for (const v of juste ? sol : sol.slice(0, -1)) { await e.api.deposer(v); await new Promise((x) => setTimeout(x, 120)); } }
    const c = document.querySelector(".etal-coche"); if (c && getComputedStyle(c).visibility === "visible") { c.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); c.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); }
    return "étal";
  }
  return null;
};

// une question attend sa réponse
export const ATTEND = () => { const a = window.__app; return !!((a.facts?.q && a.facts.resolve && !a.facts.locked) || (a.screen?.q && a.screen.resolve && !a.screen.locked) || a.voiliers?.attend || a.etal?.attend); };
// l'écran en cours, en quelques mots (pour le journal des parcours)
export const ECRAN = () => { const a = window.__app; if (!a) return "chargement"; return [a.modeEcran?.() ?? "accueil", a.session?.progress?.etape, a.enPause && "en pause", a.reef?.open && "récif", a.album?.open && "album", a.boutique?.open && "boutique", a.parent?.root?.isConnected && "parent"].filter(Boolean).join(" · "); };
