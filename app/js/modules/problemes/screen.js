// MODULE 7 · L'ÉCRAN DES PROBLÈMES (lot « Problèmes », docs/LOTS.md, fiche 20 ; lot « Mise en scène des problèmes », fiche 23 ;
// docs/SPEC.md, section 7 quinquies ; les maquettes : art/problemes/index.html, art/problemes/mise-en-scene/). Le pavé, le coquillage
// et « je ne sais pas » sont ceux de l'écran des additions (modules/facts/screen.js), à leur place ; l'ardoise n'y est pas : à sa place,
//  - LA SCÈNE (scene.js, CADRE : 884 × 374, de x 244 à 1128 et de y 106 à 480 : juste à droite de la mascotte, à gauche des réserves
//    d'étoiles, au-dessus du pavé) : l'image du lieu (assets/problemes/<lieu>@1x|2x.webp, 860 × 350, art/tools/export-problemes.mjs),
//    ou, sans image, le papier du cadre ; LES OBJETS DE L'HISTOIRE (le champ `scene` de l'énoncé ; assets/problemes/objets/), posés
//    de gauche à droite, le pied sur le sol, chacun avec la phrase qui le nomme ; les groupes en nombre exact, FERMÉS tant qu'il faut
//    trouver le compte (ouverts à la correction, au partage, au niveau 3) ; un objet sans image n'est pas dessiné (son étiquette seule) ;
//  - UNE ÉTIQUETTE PAR DONNÉE (le nombre et l'objet) SUR L'OBJET QU'ELLE DÉCRIT (sur chaque objet d'un groupe, le nombre d'un groupe
//    au-dessus de sa rangée, l'écart d'une comparaison entre les deux, sinon sur le sol) : elle apparaît et s'allume quand sa phrase
//    est dite ; la toucher redit sa phrase ; LA PLAQUE DE LA RÉPONSE sur le dépôt de la réponse (« ? » rouge, puis ce qui est tapé,
//    verte quand c'est juste) ; rien de tout cela dans la bande de la bulle (en haut à gauche de la scène) ;
//  - LES UNITÉS (ce qu'on compte) : cachées tant qu'il faut les trouver ; au cran « plus facile », une collection par étiquette sur le
//    sol (au-delà de 20, des paquets de dix) ; à la correction, montrées là où elles sont, jusqu'à 20 (module7.json, scene.unitesMax) ;
//  - L'AIDE (le coquillage ; après une erreur) à la place du pavé : le schéma en barres, la comparaison, les deux schémas numérotés ;
//    les étiquettes de la scène y prennent la couleur de leur barre ; aux groupes, les objets de la scène comptés par bonds (leurs
//    totaux dessous) ; puis la correction dite dans l'histoire et le calcul sur une plaque ;
//  - LE PARTAGE MANIPULÉ (niveau 3) : à la place du pavé, les objets en tas ; l'enfant les fait glisser un à un dans les contenants
//    de la scène (un contenant déjà à sa part refuse l'objet : « Mets-en autant dans chaque … ») ; tout rangé, le pavé revient.
//    Sans image des contenants, les contenants dessinés par l'atelier, à la place du pavé, comme avant.
// Tout ce qui est dessiné l'est une fois par question (ou à chaque phrase, à chaque objet posé), dans des canvas mis en cache ; rien
// n'est redessiné à chaque image (CLAUDE.md, « Animation »). La bulle de la mascotte évite les étiquettes, la plaque de la réponse,
// les objets du partage et l'aide (bulle.eviter) ; elle peut couvrir le haut du décor.
import * as D from "../../art/problemes.js";
import { clock, wait } from "../../engine/clock.js";
import { onBrief, skipKey, spriteBox } from "../../engine/ui.js";
import { calculDe, classer, enObjets } from "./problemes.js";
import { CADRE, PLAQUE, composer, ouvert, zoneSol } from "./scene.js";

export { CADRE };
// la zone de l'aide et du partage, à la place du pavé
export const ZONE_AIDE = { x: 300, y: 492, w: 760, h: 300 };
// les calques (avec la place de l'ombre portée) : le cadre et son image ; les objets de la scène ; les étiquettes et la plaque
const ZONE_CADRE = { x: CADRE.x - 6, y: CADRE.y - 6, w: CADRE.w + 22, h: CADRE.h + 24 };
const SKIPPED = Symbol("passé"), QUITTE = Symbol("quitté"), fige = () => new Promise(() => {});
const say = (app, t, o) => (t ? app.voice.say(t, o) : Promise.resolve());
const LIT = "#ffe45c";

export class ProblemesScreen {
  constructor(app, facts) { this.app = app; this.facts = facts; this.gardes = new Set(); this.els = []; this.images = new Map(); this.indexP = null; }
  get fs() { const fs = this.facts(); fs.prob = this; return fs; }
  get T() { return this.app.text.data; }
  get px() { return this.app.stage.px; }
  get reglages() { return this.app.module7?.scene ?? {}; }
  // un Gfx sur le canvas d'un calque posé en (Z.x, Z.y) : on y dessine en coordonnées de la scène (ses calques de travail ont la
  // taille du calque, jamais celle de l'écran entier)
  gl(ctx, Z) { const g = D.gfx(ctx, Z.w, Z.h, this.px); g.push(-Z.x, -Z.y, 1); return g; }
  // un calque de l'écran (créé à la première peinture, repeint ensuite) : `nom` -> spriteBox
  calque(nom, Z, paint, cls = nom) {
    this.calques ??= new Map(); let b = this.calques.get(nom);
    const peindre = (ctx) => { const g = this.gl(ctx, Z); paint(g, ctx); };
    if (!b) { b = spriteBox(this.app, { x: Z.x, y: Z.y, w: Z.w, h: Z.h, cls: `hud ${cls}`, still: true, paint: peindre }); this.calques.set(nom, b); this.els.push(b); }
    else b.repaint(peindre);
    return b;
  }
  retirer(nom) { const b = this.calques?.get(nom); if (b) { b.remove(); this.calques.delete(nom); } }
  garde() {
    let abort = null; const p = new Promise((_, rej) => { abort = (e = SKIPPED) => rej(e); }); p.catch(() => {});
    const quitter = () => abort(QUITTE); this.gardes.add(quitter);
    return { g: (x) => Promise.race([x, p]), abort: () => abort(), fin: () => this.gardes.delete(quitter) };
  }
  // ---------------------------------------------------------------- les images : le lieu, les objets de l'histoire
  async index() {
    if (!this.indexP) this.indexP = fetch("assets/problemes/index.json").then((r) => r.json()).catch(() => ({ lieux: [], objets: {} }));
    const I = await this.indexP; return { lieux: new Set(I.lieux ?? []), objets: I.objets ?? {} };
  }
  charger(src) {
    if (!this.images.has(src)) this.images.set(src, new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; }));
    return this.images.get(src);
  }
  async lieu(id) { const I = await this.index(); return I.lieux.has(id) ? this.charger(`assets/problemes/${id}@${this.px > 1.2 ? 2 : 1}x.webp`) : null; }
  // les images des objets d'une composition (et de sa variante ouverte), chargées avant d'être montrées : { cle: Image }
  async objetsDe(...Ls) {
    const cles = new Set(Ls.flatMap((L) => L.pieces.flatMap((p) => p.copies.map((c) => c.cle)))), k = this.px > 1.2 ? 2 : 1, out = {};
    await Promise.all([...cles].map(async (c) => { const i = await this.charger(`assets/problemes/objets/${c}@${k}x.webp`); if (i) out[c] = i; }));
    return out;
  }
  paintCadre(g, ctx, img) {
    const { x, y, w, h } = CADRE, px = this.px, Z = ZONE_CADRE;
    D.drawCadre(g, x, y, w, h, "fond");
    const inn = D.cadreInterieur(x, y, w, h), ix = x + D.CADRE_BORD, iy = y + D.CADRE_BORD, iw = w - 2 * D.CADRE_BORD, ih = h - 2 * D.CADRE_BORD;
    ctx.save(); ctx.setTransform(px, 0, 0, px, -Z.x * px, -Z.y * px); ctx.beginPath(); inn.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.clip();
    if (img) { const s = Math.max(iw / img.width, ih / img.height); ctx.drawImage(img, ix + (iw - img.width * s) / 2, iy + (ih - img.height * s) / 2, img.width * s, img.height * s); }
    else { ctx.fillStyle = "#f3ead6"; ctx.fillRect(ix, iy, iw, ih); ctx.strokeStyle = "#e9dcc0"; ctx.lineWidth = 3; for (let i = -20; i < 40; i++) { ctx.beginPath(); ctx.moveTo(ix + i * 26, iy + ih); ctx.lineTo(ix + i * 26 + ih, iy); ctx.stroke(); } }
    ctx.restore();
    D.drawCadre(g, x, y, w, h, "devant");
  }
  // ---------------------------------------------------------------- la composition (scene.js) : objets, étiquettes, plaque
  // (calculée une fois par question, contenants fermés : les étiquettes ne bougent plus ; la variante ouverte, pour les objets seuls)
  composer(q, images, ouverts = false) {
    const R = this.reglages, D0 = q.etiquettes.map((t) => t.n), larg = q.etiquettes.map((t) => D.largeurEtiquette(String(t.n), 38, t.objet));
    return composer(q.e, D0, larg, D.ETIQ_H, images, { pied: R.pieds?.[q.e.contexte] ?? R.pied ?? 462, piedActeurs: R.pied ?? 462, solX: R.sols?.[q.e.contexte] ?? 0, rangeeMax: R.rangeeMax, ecart: R.ecart, echelleMin: R.echelleMin, ouverts });
  }
  layout() { return this.L; }
  // la teinte d'une étiquette pendant l'aide et la correction (décision du parent du 6 novembre 2026, 10) : la couleur de sa barre
  teinteDe(q, i) {
    if (!this.teintes) return null;
    const n = q.etiquettes[i]?.n, e = q.e;
    if (q.aide === "barres" && e.barres) return n === e.barres.parties[0] ? "a" : n === e.barres.parties[1] ? "b" : null;
    if (q.aide === "comparaison" && e.comparaison) return n === e.comparaison.grand ? "a" : n === e.comparaison.petit ? "b" : null;
    return null;
  }
  paintDonnees(g, ctx) {
    const q = this.q, L = this.L; if (!q || !L) return;
    // les accolades des groupes, sous le nombre de groupes
    for (const t of L.etiquettes) if (t.accolade && this.vues.has(t.i)) { const a = t.accolade, m = (a.x0 + a.x1) / 2; ctx.save(); ctx.setTransform(this.px, 0, 0, this.px, -ZONE_CADRE.x * this.px, -ZONE_CADRE.y * this.px); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 5; ctx.strokeStyle = "#fffaf0"; ctx.beginPath(); ctx.moveTo(a.x0, a.y + 10); ctx.quadraticCurveTo(a.x0, a.y, a.x0 + 14, a.y); ctx.lineTo(m - 12, a.y); ctx.quadraticCurveTo(m, a.y, m, t.y + t.h); ctx.quadraticCurveTo(m, a.y, m + 12, a.y); ctx.lineTo(a.x1 - 14, a.y); ctx.quadraticCurveTo(a.x1, a.y, a.x1, a.y + 10); ctx.stroke(); ctx.restore(); }
    for (const t of L.etiquettes) if (this.vues.has(t.i)) { const it = q.etiquettes[t.i]; D.drawEtiquette(g, t.x, t.y, String(it.n), it.objet, { lit: this.lit === t.i, seed: t.i + 1, em: 38, teinte: this.teinteDe(q, t.i) }); }
    const t = (q.lecon ? "" : this.fs.typed) || (this.montre ? String(q.e.reponse) : "?");
    D.drawReponse(g, L.plaque.x, L.plaque.y, PLAQUE.w, t, q.e.objet, { juste: !!this.juste });
  }
  repaint() { if (this.q && this.L) this.calque("donnees", ZONE_CADRE, (g, ctx) => this.paintDonnees(g, ctx), "probleme-donnees"); }
  // ---------------------------------------------------------------- les objets de la scène
  // ce qui est montré : les objets des phrases déjà dites (`phrase`), fermés ou ouverts ; dans les contenants, `dans[k]` unités (le
  // partage, la correction, les groupes du niveau 3) ; un tas d'unités (`tas` : la correction) ; les collections du cran « plus facile »
  paintScene(g, ctx) {
    const q = this.q, L = this.ouverts && this.Lo ? this.Lo : this.L; if (!q || !L) return;
    const px = this.px, Z = ZONE_CADRE;
    ctx.save(); ctx.setTransform(px, 0, 0, px, -Z.x * px, -Z.y * px);
    const inn = D.cadreInterieur(CADRE.x, CADRE.y, CADRE.w, CADRE.h); ctx.beginPath(); inn.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.clip();
    for (const p of L.pieces) {
      if (p.manque || p.p > this.phrase) continue;
      p.copies.forEach((c, j) => {
        const im = this.imgs?.[c.cle]; if (!im) return;
        // l'ombre au sol, nette (comme les objets de l'application)
        ctx.fillStyle = "rgba(10, 40, 50, 0.2)"; ctx.beginPath(); ctx.ellipse(c.x + c.w / 2 + c.w * 0.06, c.y + c.h - 2, c.w * 0.46, Math.max(4, c.w * 0.07), 0, 0, Math.PI * 2); ctx.fill();
        if (c.retourne) { ctx.save(); ctx.translate(c.x + c.w, c.y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, c.w, c.h); ctx.restore(); } else ctx.drawImage(im, c.x, c.y, c.w, c.h);
        if (this.litCopies?.has(`${p.k}:${j}`)) { ctx.save(); ctx.strokeStyle = LIT; ctx.lineWidth = 7; ctx.globalAlpha = 0.95; ctx.beginPath(); ctx.roundRect(c.x - 8, c.y - 8, c.w + 16, c.h + 12, 16); ctx.stroke(); ctx.restore(); }
      });
    }
    ctx.restore();
    // les unités dans les contenants, en tas, en collections (dessinées par l'atelier)
    const o = q.e.objet;
    for (const [k, n] of Object.entries(this.dans ?? {})) { const p = L.pieces.find((x) => x.k === Number(k)); if (!p || p.manque) continue; p.copies.forEach((c, j) => this.unitesDans(g, o, c, Array.isArray(n) ? n[j] : n, k * 13 + j)); }
    if (this.tas) this.dessinerTas(g, o, this.tas);
    // (sans image des contenants) les groupes de l'atelier, au-dessus du sol de la scène
    if (this.groupesCode) { const G = q.e.groupes; this.groupesDans({ x: 470, y: 126, w: 640, h: 220 }, q.e.contenant ?? "anneau", o, G.nombre, G.taille, { plein: this.groupesCode.plein })(g); }
    if (this.collections) for (const col of this.collections) this.dessinerTas(g, col.objet, col);
  }
  repaintScene() { if (this.q && this.L) this.calque("scene", ZONE_CADRE, (g, ctx) => this.paintScene(g, ctx), "probleme-scene"); }
  // `n` unités dans un contenant (dans son haut, comme posées dedans)
  unitesDans(g, objet, c, n, seed = 0) {
    if (!n) return;
    const cols = n <= 2 ? n : n <= 4 ? 2 : n <= 9 ? 3 : 5, p = Math.max(12, Math.min(30, (c.w - 8) / cols, (c.h * 0.7) / Math.ceil(n / cols) / 0.86));
    D.placesGroupe(c.x + c.w / 2, c.y + Math.min(c.h * 0.45, (Math.ceil(n / cols) * p * 0.86) / 2 + 10), n, p, cols).forEach(([x, y], i) => D.drawObjet(g, objet, x, y, p / 46, 700 + seed * 7 + i, i));
  }
  // un tas d'unités (au-delà de 20 : des paquets de dix et les unités seules)
  dessinerTas(g, objet, z) {
    const { dizaines, unites } = enObjets(z.n, this.app.module7?.objetsDizainesAuDela ?? 20);
    if (dizaines) { for (let i = 0; i < dizaines; i++) D.drawGroupe(g, "anneau", objet, z.x + 34 + i * 64, z.y + z.h / 2 - 8, 10, 0.42, { seed: 60 + i }); if (unites) D.placesGroupe(z.x + 34 + dizaines * 64 + 12, z.y + z.h / 2, unites, 22, 5).forEach(([x, y], i) => D.drawObjet(g, objet, x, y, 0.42, 700 + i, i)); return; }
    D.placesGroupe(z.x + z.w / 2, z.y + z.h / 2, z.n, z.p, z.cols).forEach(([x, y], i) => D.drawObjet(g, objet, x, y, z.p / 50, 700 + (z.seed ?? 0) + i, i));
  }
  // la place d'un tas de `n` unités au sol, près d'une boîte (au-delà de 20, la largeur des paquets de dix)
  zoneTas(n, pres, eviter = []) {
    const { dizaines, unites } = enObjets(n, this.app.module7?.objetsDizainesAuDela ?? 20);
    if (dizaines) { const z = zoneSol(this.L, 1, 1, pres, eviter, { w: dizaines * 64 + (unites ? 76 : 8), h: 90 }); return z && { ...z, n }; }
    for (const p of [32, 26, 21, 17]) { const z = zoneSol(this.L, n, p, pres, eviter); if (z) return { ...z, n, p }; }
    return null;
  }
  // des groupes dessinés par l'atelier (sans image des contenants : comme avant le lot) : `n` contenants de `t` objets (les `plein`
  // premiers remplis), en une rangée, centrés dans la zone Z ; `bonds` : le total écrit sous les groupes allumés
  groupesDans(Z, c, objet, n, t, { plein = null, lit = -1, bonds = 0 } = {}) {
    return (g) => {
      const pitchMax = Z.w / n, k = Math.max(0.34, Math.min(0.95, pitchMax / (D.tailleGroupe(t, 44)[0] + 70), (Z.h - 70) / (D.tailleGroupe(t, 44)[1] + 80)));
      for (let i = 0; i < n; i++) {
        const cx = Z.x + pitchMax * (i + 0.5), cy = Z.y + Z.h / 2 - (bonds ? 18 : 0);
        D.drawGroupe(g, c, objet, cx, cy, t, k, { seed: i + 1, lit: i === lit, plein: plein ? plein[i] : t });
        if (i < bonds) D.drawCalcul(g, cx, cy + D.tailleGroupe(t, 44 * k)[1] / 2 + 34, String((i + 1) * t), 28);
      }
    };
  }
  // la rangée des groupes de la scène (si ses contenants ont leur image) : la pièce de la composition
  rangee(q) { const S = q.e.scene?.objets ?? [], k = S.findIndex((x) => x.n != null); const p = k >= 0 ? this.L?.pieces.find((x) => x.k === k) : null; return p && !p.manque && p.copies.length ? p : null; }
  // ---------------------------------------------------------------- poser la question
  async askNotion(q) { return this.finaliser(q, await this.ask(q)); }
  finaliser(q, r) { const code = r.nsp ? "NSP" : classer(q.e, r.value); return { ...r, q, ok: code === null, code, aide: !!r.aide }; }
  // la scène d'une question : la composition (fermée, puis ouverte), le lieu et les images des objets, chargés avant d'être montrés
  async preparer(q, tok) {
    const I = await this.index();
    const L = this.composer(q, I.objets), Lo = this.composer(q, I.objets, true);
    const [img, imgs] = await Promise.all([this.lieu(q.e.contexte), this.objetsDe(L, Lo)]);
    if (tok !== this.tok) return false;
    // (une image annoncée mais illisible : l'objet est traité comme sans image, son étiquette seule)
    const vues = Object.fromEntries(Object.entries(I.objets).filter(([c]) => imgs[c] || ![...L.pieces, ...Lo.pieces].some((p) => p.copies.some((x) => x.cle === c))));
    this.L = Object.keys(vues).length === Object.keys(I.objets).length ? L : this.composer(q, vues); this.Lo = Object.keys(vues).length === Object.keys(I.objets).length ? Lo : this.composer(q, vues, true);
    this.imgs = imgs;
    this.calque("cadre", ZONE_CADRE, (g, ctx) => this.paintCadre(g, ctx, img), "probleme-cadre");
    this.repaintScene(); this.repaint();
    return true;
  }
  async ask(q) {
    const fs = this.fs, { voice } = this.app;
    if (fs.detruit) return fige();
    this.leaveQuestion();
    this.q = q; this.vues = new Set(); this.lit = -1; this.juste = false; this.montre = false; this.phrase = -1; this.tok = (this.tok ?? 0) + 1; const tok = this.tok;
    fs.q = q; fs.typed = ""; fs.ring = false; fs.aide = false; fs.locked = false; fs.gate.open(); fs.slate.style.visibility = "hidden";
    fs.onTyped = () => this.repaint();
    if (!(await this.preparer(q, tok)) || fs.detruit) return fige();
    const L = this.L; this.app.starFrom = [L.plaque.x + PLAQUE.w / 2, L.plaque.y + PLAQUE.h / 2];
    // les étiquettes se touchent (elles redisent leur phrase), dès qu'elles sont montrées
    this.boutons = q.etiquettes.map((it, i) => {
      const t = L.etiquettes.find((x) => x.i === i && !x.echo);
      const b = document.createElement("button"); b.className = "bubble probleme-etiquette"; b.setAttribute("aria-label", `étiquette ${it.n}`); b.dataset.n = String(it.n);
      Object.assign(b.style, { left: `${t.x}px`, top: `${t.y}px`, width: `${t.w}px`, height: `${t.h}px`, visibility: "hidden" });
      this.app.stage.ui.append(b);
      onBrief(this.app, b, () => { if (!this.q || this.q !== q || this.occupe) return; this.allumer(i); voice.stop(); voice.say(q.e.enonce[it.phrase]).then(() => { if (this.q === q && this.lit === i) this.allumer(-1); }); }, "etiquette");
      this.els.push(b); return b;
    });
    // (relecture du lot « Problèmes », R5 : toucher la plaque de la réponse redit la question seule)
    { const b = document.createElement("button"); b.className = "bubble probleme-plaque"; b.setAttribute("aria-label", "redire la question"); Object.assign(b.style, { left: `${L.plaque.x}px`, top: `${L.plaque.y}px`, width: `${PLAQUE.w}px`, height: `${PLAQUE.h}px` }); this.app.stage.ui.append(b); this.els.push(b);
      onBrief(this.app, b, () => { if (this.q !== q || this.occupe) return; voice.stop(); voice.say(q.e.question); }, "plaque"); }
    this.app.bulle?.eviter("probleme", () => (this.q ? [...this.boutons.filter((b) => b.style.visibility !== "hidden"), [L.plaque.x, L.plaque.y, L.plaque.x + PLAQUE.w, L.plaque.y + PLAQUE.h], ...(this.aideVisible ? [[ZONE_AIDE.x, ZONE_AIDE.y, ZONE_AIDE.x + ZONE_AIDE.w, ZONE_AIDE.y + ZONE_AIDE.h]] : [])] : null));
    fs.help.style.visibility = q.coquillage ? "visible" : "hidden";
    const p = new Promise((res) => { fs.resolve = res; });
    fs.t0 = clock.now();
    // le niveau 3 : les groupes égaux (et le partage en nombre de parts) montrés formés ; le partage, manipulé (le pavé attend que les
    // objets soient rangés) ; le cran « plus facile » : les données en objets, une collection par étiquette, sur le sol
    const G = q.e.groupes;
    if (q.manipuler && (q.e.structure === "groupes-egaux" || (q.e.structure === "partage" && G.inconnue === "nombre"))) this.former(q, G.taille);
    if (q.objets && !q.manipuler) this.poserCollections(q);
    const partage = q.manipuler && q.e.structure === "partage" && G.inconnue === "taille";
    if (partage) fs.keys(false); else { fs.keys(true); fs.help.style.visibility = q.coquillage ? "visible" : "hidden"; }
    if (q.guide) { this.demo(q, tok).catch(() => {}); return p; }
    this.raconter(q, tok, { partage }).catch(() => {});
    return p;
  }
  // les groupes montrés formés (le niveau 3) : les contenants de la scène ouverts, `t` objets dans chacun ; sans leur image, les
  // groupes dessinés par l'atelier, au-dessus du sol de la scène
  former(q, t) {
    const R = this.rangee(q), G = q.e.groupes;
    if (R) { this.ouverts = true; this.dans = { ...this.dans, [R.k]: t }; }
    else this.groupesCode = { plein: Array(G.nombre).fill(t) };
    this.repaintScene();
  }
  poserCollections(q) {
    const cols = [], deja = [];
    q.etiquettes.forEach((it, i) => {
      if (!it.objet) return;
      const t = this.L.etiquettes.find((x) => x.i === i && !x.echo), z = this.zoneTas(it.n, t, deja);
      if (z) { cols.push({ ...z, objet: it.objet, seed: i * 31 }); deja.push(z); }
    });
    this.collections = cols; this.repaintScene();
  }
  // (la leçon L19, lessons/problemes.js) la scène seule : le lieu, ses objets, les étiquettes (montrées quand elles sont allumées) et la
  // plaque de la réponse, sans pavé ni voix
  async scene(q) {
    this.leaveQuestion(); this.q = q; this.vues = new Set(); this.lit = -1; this.juste = false; this.montre = false; this.phrase = 99; this.tok = (this.tok ?? 0) + 1;
    if (!(await this.preparer(q, this.tok))) return;
    const L = this.L;
    this.boutons = q.etiquettes.map(() => ({ style: {} }));
    this.app.bulle?.eviter("probleme", () => (this.q ? [...L.etiquettes.map((t) => [t.x, t.y, t.x + t.w, t.y + t.h]), [L.plaque.x, L.plaque.y, L.plaque.x + PLAQUE.w, L.plaque.y + PLAQUE.h], ...(this.aideVisible ? [[ZONE_AIDE.x, ZONE_AIDE.y, ZONE_AIDE.x + ZONE_AIDE.w, ZONE_AIDE.y + ZONE_AIDE.h]] : [])] : null));
    this.repaint();
  }
  allumer(i) { this.lit = i; if (i >= 0) { this.vues.add(i); if (this.boutons[i]) this.boutons[i].style.visibility = "visible"; } this.repaint(); }
  // la phrase `j` est dite : ses objets apparaissent (décision du parent du 6 novembre 2026, 11)
  montrerPhrase(j) { if (j > (this.phrase ?? -1)) { this.phrase = j; this.repaintScene(); } }
  // l'histoire, phrase par phrase : chaque étiquette s'allume avec sa phrase ; puis la question (la consigne que la mascotte redit :
  // l'histoire entière et la question) ; au cran « plus facile », l'histoire redite avec ses étiquettes
  // (lot « Correctifs du 5 novembre », constat du parent du 5 novembre 2026 : au partage manipulé, la mascotte touchée redisait la
  // consigne de l'écran précédent, « Choisis ton niveau… » : la consigne n'était posée qu'après le partage) LA CONSIGNE EST POSÉE DÈS LE
  // DÉBUT DE L'HISTOIRE, pour toutes les formes : la mascotte touchée redit l'histoire entière et la question. Touchée pendant
  // l'histoire, elle l'a redite en entier : l'histoire ne reprend pas où elle en était (elle serait dite deux fois), la suite enchaîne.
  async raconter(q, tok, { partage = false, redire = q.redire } = {}) {
    const { voice } = this.app, T = this.T, e = q.e, vivant = () => tok === this.tok && this.q === q, consigne = [...e.enonce, e.question].join(" ");
    voice.stop();
    voice.instruction = consigne; voice.listens = 1;
    const ecoutes0 = voice.listens, redite = () => voice.listens !== ecoutes0;
    const premiere = !this.app.store ? false : !(await this.app.store.setting("problemesConsigne"));
    if (!vivant()) return;
    if (premiere && !q.repris) { await say(this.app, T.problemeConsigne); await this.app.store.setSetting("problemesConsigne", true); }
    const histoire = async () => {
      for (const [j, s] of e.enonce.entries()) {
        if (!vivant() || redite()) return;
        const its = q.etiquettes.map((t, i) => ({ ...t, i })).filter((t) => t.phrase === j);
        this.montrerPhrase(j);
        if (its.length) this.allumer(its.at(-1).i); for (const t of its) this.vues.add(t.i), (this.boutons[t.i].style.visibility = "visible");
        this.repaint();
        await voice.say(s);
      }
      if (vivant()) this.allumer(-1);
    };
    await histoire();
    if (!vivant()) return;
    // (l'histoire finie, ou redite en entier par la mascotte touchée : tous ses objets et toutes ses étiquettes sont là)
    this.montrerPhrase(99); for (const [i] of q.etiquettes.entries()) { this.vues.add(i); if (this.boutons[i]?.style) this.boutons[i].style.visibility = "visible"; } this.repaint();
    const dejaRedite = redite();
    if (partage) { await this.partager(q, tok); if (!vivant()) return; }
    // (la mascotte touchée redit l'histoire entière et la question : `voice.instruction`, compté comme une écoute ; touchée pendant
    // l'histoire, la question vient d'être dite : elle n'est redite qu'après le partage)
    if (!dejaRedite || partage) { const dit = voice.say(e.question, { instruction: true }); voice.instruction = consigne; await dit; }
    else this.app.ocean?.mascotte?.ambiance?.("ecoute"); // (la question attend sa réponse : la mascotte écoute, comme après une consigne)
    voice.instruction = consigne;
    if (premiere && vivant()) await say(this.app, T.problemeReecouter);
    if (redire && vivant() && !redite()) { const n = voice.listens; await histoire(); if (vivant() && voice.listens === n) await voice.say(e.question); voice.instruction = consigne; }
  }
  // ---------------------------------------------------------------- le partage manipulé (niveau 3)
  // les objets en tas à la place du pavé ; les contenants qui les reçoivent : CEUX DE LA SCÈNE (le contenant suivant allumé, les
  // objets posés dedans) ; sans leur image, ceux de l'atelier, à droite du tas, comme avant le lot
  async partager(q, tok) {
    const { voice, stage } = this.app, e = q.e, G = e.groupes, n = G.nombre, t = G.taille, total = n * t, c = e.contenant ?? "anneau", T = this.T, Z = ZONE_AIDE;
    const dans = Array(n).fill(0), vivant = () => tok === this.tok && this.q === q, R = this.rangee(q);
    this.occupe = true;
    // ce que dit la mascotte : « Mets-en autant dans chaque pot. » (le contenant de la scène, sinon celui de l'énoncé)
    const mettre = T.problemeMettre[R?.o ?? e.scene?.objets?.find((x) => x.n != null)?.o] ?? T.problemeMettre[c] ?? T.problemeMettre.anneau;
    let cont, peindre, places;
    if (R) {
      this.ouverts = true; this.dans = { ...this.dans, [R.k]: dans };
      const C = this.Lo.pieces.find((p) => p.k === R.k)?.copies ?? R.copies;
      cont = C.map((x) => [x.x - 24, x.y - 40, x.x + x.w + 24, x.y + x.h + 24]);
      peindre = () => { const i = dans.findIndex((v) => v < t); this.litCopies = new Set(i >= 0 ? [`${R.k}:${i}`] : []); this.repaintScene(); };
      const cols = Math.min(total, 6); places = D.placesGroupe(Z.x + Z.w / 2 - 40, Z.y + 112, total, 72, cols);
    } else {
      const CW = Math.min(200, (Z.w - 200) / n), zoneC = { x: Z.x + 200, y: Z.y + 40, w: CW * n, h: Z.h - 60 };
      const Zc = { x: zoneC.x - 10, y: zoneC.y - 50, w: zoneC.w + 20, h: zoneC.h + 60 };
      peindre = () => this.calque("contenants", Zc, (g) => this.groupesDans(zoneC, c, e.objet, n, t, { plein: dans })(g), "probleme-contenants");
      cont = Array.from({ length: n }, (_, i) => [zoneC.x + CW * i, zoneC.y - 40, zoneC.x + CW * (i + 1), zoneC.y + zoneC.h]);
      places = D.placesGroupe(Z.x + 80, Z.y + Z.h / 2, total, 40, total <= 6 ? 2 : 3);
    }
    peindre();
    let restants = total, ditMettre = false;
    await new Promise((fini) => {
      const objs = places.map(([x, y], i) => {
        const S = 64, Zo = { x: x - S / 2, y: y - S / 2, w: S, h: S }, b = spriteBox(this.app, { ...Zo, cls: "bubble probleme-objet", label: "objet", paint: (ctx) => D.drawObjet(this.gl(ctx, Zo), e.objet, x, y, 0.95, 70 + i, i) });
        b.style.touchAction = "none"; this.els.push(b);
        let d = null;
        const pos = (ev) => { const r = stage.ui.getBoundingClientRect(), k = stage.k; return [(ev.clientX - r.left) / k, (ev.clientY - r.top) / k]; };
        b.addEventListener("pointerdown", (ev) => { if (!vivant()) return; ev.preventDefault(); b.setPointerCapture?.(ev.pointerId); d = { p0: pos(ev) }; b.classList.add("tenu"); });
        b.addEventListener("pointermove", (ev) => { if (!d) return; const [px, py] = pos(ev); b.style.transform = `translate(${px - d.p0[0]}px, ${py - d.p0[1]}px)`; });
        const lacher = (ev) => {
          if (!d) return; const [px, py] = pos(ev); d = null; b.classList.remove("tenu"); b.style.transform = "";
          const i2 = cont.findIndex(([x0, y0, x1, y1]) => px >= x0 && px <= x1 && py >= y0 && py <= y1);
          if (i2 < 0 || !vivant()) return;
          if (dans[i2] >= t) { this.app.sound?.play("erreur"); if (!ditMettre) { ditMettre = true; voice.stop(); voice.say(mettre); } return; }
          dans[i2]++; restants--; this.app.sound?.play("bouton"); b.remove(); peindre();
          if (!restants) fini();
        };
        b.addEventListener("pointerup", lacher); b.addEventListener("pointercancel", () => { d = null; b.style.transform = ""; b.classList.remove("tenu"); });
        return b;
      });
      this.partageObjs = objs; this.cibles = cont;
      this.app.bulle?.eviter("probleme-partage", () => (vivant() && restants ? [[Z.x, Z.y, Z.x + Z.w, Z.y + Z.h], ...cont] : null));
      voice.say(T.problemeAide.faisGroupes); voice.say(mettre);
    });
    this.app.bulle?.eviter("probleme-partage", null);
    if (!vivant()) return;
    // tout est rangé : les contenants pleins restent sur la scène (sans image : ceux de l'atelier montent sur la scène) ; le pavé revient
    this.litCopies = null;
    if (!R) { this.retirer("contenants"); this.groupesCode = { plein: dans }; }
    this.repaintScene();
    this.occupe = false; this.fs.keys(true); this.fs.help.style.visibility = q.coquillage ? "visible" : "hidden"; this.fs.t0 = clock.now();
  }
  // ---------------------------------------------------------------- l'aide (à la place du pavé)
  // `voir` (la leçon L19) : « tout » ne montre que la grande barre (le schéma se dessine en deux temps)
  paintAide(q, { montre = false, voir = null } = {}) {
    const e = q.e, Z = ZONE_AIDE, R = q.aide === "groupes" ? this.rangee(q) : null;
    this.aideVisible = true;
    // les étiquettes de la scène aux couleurs de leurs barres (décision du parent du 6 novembre 2026, 10)
    if (!this.teintes && (q.aide === "barres" || q.aide === "comparaison")) { this.teintes = true; this.repaint(); }
    this.calque("aide", Z, (g, ctx) => {
      if (voir === "tout") { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, Z.w * this.px, (520 + D.BARRE_H + 10 - Z.y) * this.px); ctx.clip(); }
      if (q.aide === "barres") D.drawBarres(g, 360, 520, 640, e.barres, e.objet, { montre });
      else if (q.aide === "comparaison") D.drawComparaison(g, 360, 520, 640, e.comparaison, e.objet, { montre });
      else if (q.aide === "etapes") e.etapes.forEach((s, i) => D.drawBarres(g, i ? 700 : 318, 530, 340, s.barres, e.objet, { montre: montre || i === 0, seed: i + 1 }));
      else if (R) {
        // les groupes de la scène comptés par bonds : le total écrit sous chaque objet compté (sur deux lignes s'ils sont serrés)
        const G = e.groupes, nb = montre ? G.nombre : this.bonds ?? 0, serre = R.copies.length > 1 && R.copies[1].x - R.copies[0].x < 118;
        R.copies.slice(0, nb).forEach((c, j) => D.drawCalcul(g, c.x + c.w / 2, 498 + (serre && j % 2 ? 62 : 0), String((j + 1) * G.taille), 30));
      } else { const G = e.groupes; this.groupesDans({ x: Z.x, y: Z.y, w: Z.w, h: 200 }, e.contenant ?? "anneau", e.objet, G.nombre, G.taille, { bonds: montre ? G.nombre : this.bonds ?? 0, lit: this.litGroupe ?? -1 })(g); }
      // les deux étapes : leurs numéros sous les schémas
      // (les numéros des deux étapes pendant l'aide ; à la correction, les deux calculs prennent leur place)
      if (q.aide === "etapes" && !montre) [["1", 488], ["2", 870]].forEach(([t, x]) => D.drawCalcul(g, x, 700, t, 30));
      if (voir === "tout") ctx.restore();
    }, "probleme-aide");
  }
  effacerAide() { this.aideVisible = false; this.retirer("aide"); this.retirer("calcul"); if (this.teintes) { this.teintes = false; this.repaint(); } if (this.litCopies) { this.litCopies = null; this.repaintScene(); } }
  // ce que dit l'aide, avant la correction : le schéma, ce qu'on connaît, ce qu'on cherche
  phrasesAide(q) {
    const A = this.T.problemeAide, e = q.e;
    if (q.aide === "barres") return [A.regarde, e.barres.inconnue === "tout" ? A.ajoute : A.enleve];
    if (q.aide === "comparaison") return [A.regarde, A.grand, A.ecart, A.cherche];
    if (q.aide === "etapes") return [A.etape1, A.etape2];
    return [A.groupes, e.groupes.inconnue === "nombre" ? A.compteGroupes : A.compteObjets];
  }
  // les groupes comptés par bonds (5, 10, 15, 20) : les objets de la scène allumés l'un après l'autre (sans leur image, les groupes de
  // l'atelier à la place du pavé) ; `reponse` faux : le dernier total n'est ni dit ni écrit (l'aide ne donne pas la réponse)
  async compterGroupes(q, g, { reponse = true } = {}) {
    const G = q.e.groupes, k = this.app.vitesse ?? 1, R = this.rangee(q);
    for (let i = 1; i <= G.nombre; i++) {
      this.bonds = reponse || i < G.nombre ? i : i - 1; this.litGroupe = i - 1;
      if (R) { this.litCopies = new Set(Array.from({ length: Math.min(i, R.copies.length) }, (_, j) => `${R.k}:${j}`)); this.repaintScene(); }
      this.paintAide(q); this.app.sound?.play("bouton");
      if (reponse || i < G.nombre) await g(this.app.voice.say(String(i * G.taille))); else await g(wait(700 / k));
      await g(wait(150 / k));
    }
    this.litGroupe = -1;
  }
  async showHelp(q) {
    const fs = this.fs, { voice } = this.app;
    if (!q.coquillage || this.occupe) return;
    fs.locked = true; voice.stop(); fs.keys(false);
    await fs.skippable("passer l'aide", async (g) => {
      this.paintAide(q);
      if (q.aide === "groupes") { await g(voice.say(this.phrasesAide(q)[0])); await this.compterGroupes(q, g, { reponse: false }); }
      else for (const s of this.phrasesAide(q)) await g(voice.say(s));
      await g(wait(1600));
    });
    if (fs.detruit || fs.q !== q) return;
    this.bonds = 0; this.effacerAide(); fs.keys(true); fs.help.style.visibility = q.coquillage ? "visible" : "hidden"; fs.locked = false;
    voice.say(q.e.question);
    voice.instruction = [...q.e.enonce, q.e.question].join(" ");
  }
  // ---------------------------------------------------------------- la correction : les unités montrées là où elles sont
  // (décision du parent du 6 novembre 2026, 3) jusqu'à `unitesMax` (20) : dans les contenants de la scène, ouverts (les groupes, le
  // partage), dans le dépôt de la réponse ou à côté (la gamelle, le seau), sinon au sol près de la plaque ; au-delà, rien
  montrerUnites(q) {
    this.avantUnites ??= { ouverts: this.ouverts, dans: this.dans, tas: this.tas };
    const e = q.e, max = this.reglages.unitesMax ?? 20, R = this.rangee(q), G = e.groupes, L = this.Lo ?? this.L;
    const S = e.scene?.objets ?? [], kr = S.findIndex((x) => x.rep), dep = kr >= 0 && S[kr].n == null ? L.pieces.find((p) => p.k === kr && !p.manque) : null;
    this.ouverts = true;
    if (G && R && !(e.structure === "groupes-egaux" && dep)) { if (G.taille <= 10) this.dans = { ...this.dans, [R.k]: G.taille }; }
    else if (e.reponse <= max) {
      const c = dep?.copies[0], n = e.reponse;
      // dans le dépôt (sur son ouverture), s'il y a la place ; sinon au sol, au plus près
      if (c) { const cols = n <= 4 ? 2 : n <= 9 ? 3 : n <= 12 ? 4 : 6, p = 22, w = cols * p + 8, h = Math.ceil(n / cols) * p * 0.86 + 8, z = { x: c.x + c.w / 2 - w / 2, y: c.y + c.h * 0.45 - h, w, h, n, p, cols };
        const libre = ![...this.L.etiquettes, { ...this.L.plaque, w: PLAQUE.w, h: PLAQUE.h }].some((t) => z.x < t.x + t.w && t.x < z.x + z.w && z.y < t.y + t.h && t.y < z.y + z.h);
        this.tas = libre ? z : this.zoneTas(n, c); }
      else this.tas = this.zoneTas(n, { ...this.L.plaque, w: PLAQUE.w, h: PLAQUE.h });
    }
    this.repaintScene();
  }
  // (l'exemple guidé fini) la scène redevient celle de la question
  annulerUnites() { if (!this.avantUnites) return; Object.assign(this, this.avantUnites); this.avantUnites = null; this.repaintScene(); }
  // ---------------------------------------------------------------- l'exemple guidé (après une leçon) : l'histoire, l'aide résolue, la correction
  async demo(q, tok) {
    const fs = this.fs, { voice } = this.app, T = this.T;
    fs.locked = true; fs.keys(false);
    const { g, abort, fin } = this.garde(), skip = skipKey(this.app, () => abort(), "passer l'exemple");
    try {
      await g(this.raconter(q, tok, { redire: false }));
      this.paintAide(q, { montre: true }); this.montre = true; this.repaint(); this.montrerUnites(q);
      await g(voice.say(q.e.correction)); await g(wait(500)); await g(voice.say(T.aToiFait));
    } catch (e) { if (e === QUITTE) { skip.remove(); return fige(); } if (e !== SKIPPED) throw e; voice.stop(); q.passe = true; } finally { fin(); }
    skip.remove(); this.montre = false; this.effacerAide(); this.annulerUnites(); this.repaint();
    if (tok !== this.tok) return;
    fs.typed = ""; fs.locked = false; fs.keys(true); fs.help.style.visibility = q.coquillage ? "visible" : "hidden"; fs.t0 = clock.now();
    voice.say(q.e.question, { instruction: true }); voice.instruction = [...q.e.enonce, q.e.question].join(" ");
  }
  // ---------------------------------------------------------------- après la réponse (FactsScreen.submit)
  async feedback(q, r) {
    const fs = this.fs, { voice, text, ocean, sound } = this.app, T = this.T, k = this.app.vitesse ?? 1, e = q.e;
    // (jugée ici : l'écran des additions ne sait pas ce qu'attend un problème)
    const ok = classer(e, r.value, r.nsp) === null;
    this.tok++; // (l'histoire en cours s'arrête là)
    ocean.mascotte.play(ok ? "rejouir" : "encourager");
    if (ok) { sound?.play("bonne"); this.juste = true; this.repaint(); await voice.say(text.pick("bravo")); await wait(350); return; }
    if (!r.nsp) sound?.play("erreur");
    const { g, abort, fin } = this.garde(), skip = skipKey(this.app, () => abort(), "passer la correction");
    let quitte = false;
    // (relecture du lot, R4 : à la correction, la réponse s'écrit sur la plaque restée neutre ; le vert est pour sa propre bonne réponse)
    const montrer = () => { this.montre = true; fs.typed = ""; this.juste = false; this.repaint(); };
    try {
      fs.keys(false);
      const code = r.nsp ? "NSP" : classer(e, r.value);
      // le code d'erreur, sa phrase s'il en a une (P1 : seulement pour une comparaison, le schéma montre le reste)
      // (relecture du lot, R6 : à une comparaison, la phrase du mot que dit l'histoire, et seulement s'il a trompé l'enfant : « de plus »
      // quand elle a ajouté, « de moins » quand elle a enlevé)
      const texte = [...e.enonce, e.question].join(" "), ajoute = !r.nsp && r.value === e.donnees?.[0] + e.donnees?.[1];
      const dit = r.nsp ? T.faitNSP : code === "P1" ? (e.structure !== "comparaison" ? null : ajoute && /de plus/.test(texte) ? T.erreurProbleme.P1comparaison : !ajoute && /de moins/.test(texte) ? T.erreurProbleme.P1comparaisonMoins : null) : T.erreurProbleme[code] ?? T.erreur.autre;
      if (dit) await g(voice.say(dit));
      // l'aide, puis la correction dans l'histoire et le calcul écrit
      this.paintAide(q);
      if (q.aide === "groupes") { await g(voice.say(this.phrasesAide(q)[0])); await this.compterGroupes(q, g); }
      else { for (const s of this.phrasesAide(q).slice(0, 2)) await g(voice.say(s)); this.paintAide(q, { montre: true }); }
      montrer();
      this.calculPlaque(e); this.montrerUnites(q);
      await g(voice.say(e.correction));
      await g(wait(900 / k));
    } catch (x) {
      if (x === QUITTE) quitte = true;
      else { if (x !== SKIPPED) throw x; voice.stop(); r.correctionPassee = true; montrer(); this.paintAide(q, { montre: true }); this.calculPlaque(e); this.montrerUnites(q); await wait(1000); }
    } finally { fin(); skip.remove(); }
    if (quitte) return fige();
  }
  // la plaque du calcul (« 23 − 9 = 14 » ; deux étapes : les deux), sous l'aide
  calculPlaque(e) {
    const L = calculDe(e), Z = { x: 300, y: 694, w: 760, h: 100 };
    this.calque("calcul", Z, (g) => L.forEach((t, i) => D.drawCalcul(g, L.length > 1 ? (i ? 870 : 490) : 680, 700, t, L.length > 1 ? 34 : 42)), "probleme-calcul");
  }
  // ---------------------------------------------------------------- la sortie
  leaveQuestion() {
    for (const el of this.els) el.remove(); this.els = []; this.calques?.clear(); this.aideVisible = false; this.boutons = []; this.occupe = false; this.bonds = 0;
    this.L = this.Lo = this.imgs = null; this.phrase = -1; this.ouverts = false; this.dans = null; this.tas = null; this.collections = null; this.groupesCode = null; this.litCopies = null; this.teintes = false; this.cibles = null; this.avantUnites = null;
    this.app.bulle?.eviter("probleme", null); this.app.bulle?.eviter("probleme-partage", null);
  }
  leave() { for (const q of [...this.gardes]) q(); this.gardes.clear(); this.tok = (this.tok ?? 0) + 1; this.leaveQuestion(); this.q = null; this.app.facts?.leave(); }
}
