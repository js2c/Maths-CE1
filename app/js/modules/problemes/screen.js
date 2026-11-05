// MODULE 7 · L'ÉCRAN DES PROBLÈMES (lot « Problèmes », docs/LOTS.md, fiche 20 ; docs/SPEC.md, section 7 quinquies ; la maquette :
// art/problemes/index.html). Le pavé, le coquillage et « je ne sais pas » sont ceux de l'écran des additions
// (modules/facts/screen.js), à leur place, comme pour la multiplication ; l'ardoise n'y est pas : à sa place,
//  - L'ILLUSTRATION du lieu dans un cadre de nacre (CADRE, 620 × 350, de x 496 à 1116 et de y 116 à 466 : à gauche des réserves
//    d'étoiles, qui commencent à x 1136) : l'image du lieu (assets/problemes/<lieu>@1x|2x.webp, art/tools/export-problemes.mjs),
//    ou, sans image, le papier du cadre (un fond neutre, sans texte) ;
//  - au bas de l'illustration, UNE ÉTIQUETTE PAR DONNÉE (le nombre et l'objet) : elle apparaît et s'allume quand sa phrase est
//    dite ; la toucher redit sa phrase ; et LA PLAQUE DE LA RÉPONSE (« ? » rouge, puis ce qui est tapé, verte quand c'est juste) ;
//  - au-dessus des étiquettes, sur une plaque de nacre posée sur l'image : les données en objets (cran « plus facile » ; au-delà
//    de 20, des paquets de dix), les groupes formés (niveau 3, groupes égaux), les contenants remplis (niveau 3, partage, une fois
//    les objets rangés) ;
//  - L'AIDE (le coquillage ; après une erreur) à la place du pavé : le schéma en barres, la comparaison, les deux schémas numérotés
//    des deux étapes, ou les objets groupés comptés par bonds ; puis la correction dite dans l'histoire et le calcul sur une plaque ;
//  - LE PARTAGE MANIPULÉ (niveau 3) : à la place du pavé, les objets en tas et les contenants vides ; l'enfant les fait glisser un à
//    un (un contenant déjà à sa part refuse l'objet : « Mets-en autant dans chaque … ») ; tout rangé, les contenants remplis montent
//    sur l'illustration et le pavé revient.
// Tout ce qui est dessiné l'est par le code de l'atelier (art/js/art/problemes.js, généré depuis sea/problemes.ts), une fois par
// question (ou à chaque objet posé), dans des canvas mis en cache ; rien n'est redessiné à chaque image (CLAUDE.md, « Animation »).
// La bulle de la mascotte évite les étiquettes, la plaque de la réponse, la plaque des objets et l'aide (bulle.eviter) ; elle peut
// couvrir le haut de l'illustration (le décor).
import * as D from "../../art/problemes.js";
import { clock, wait } from "../../engine/clock.js";
import { onBrief, skipKey, spriteBox } from "../../engine/ui.js";
import { calculDe, classer, enObjets } from "./problemes.js";

export const CADRE = { x: 496, y: 116, w: 620, h: 350 };
// la plaque des objets, sur l'image, au-dessus des étiquettes ; la zone de l'aide et du partage, à la place du pavé
export const PLAQUE_OBJETS = { x: 520, y: 136, w: 572, h: 226 }, ZONE_AIDE = { x: 300, y: 492, w: 760, h: 300 };
// les calques (avec la place de l'ombre portée) : le cadre et son image ; les étiquettes et la plaque de la réponse ; les objets
const ZONE_CADRE = { x: CADRE.x - 6, y: CADRE.y - 6, w: CADRE.w + 22, h: CADRE.h + 24 }, ZONE_OBJETS = { x: PLAQUE_OBJETS.x - 6, y: PLAQUE_OBJETS.y - 6, w: PLAQUE_OBJETS.w + 16, h: PLAQUE_OBJETS.h + 16 };
const ETIQ_Y = CADRE.y + CADRE.h - 26 - D.ETIQ_H, REP_H = 84;
const SKIPPED = Symbol("passé"), QUITTE = Symbol("quitté"), fige = () => new Promise(() => {});
const say = (app, t, o) => (t ? app.voice.say(t, o) : Promise.resolve());

export class ProblemesScreen {
  constructor(app, facts) { this.app = app; this.facts = facts; this.gardes = new Set(); this.els = []; this.images = new Map(); this.lieux = null; }
  get fs() { const fs = this.facts(); fs.prob = this; return fs; }
  get T() { return this.app.text.data; }
  get px() { return this.app.stage.px; }
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
  // ---------------------------------------------------------------- l'illustration
  async lieu(id) {
    if (!this.lieux) { try { this.lieux = new Set((await (await fetch("assets/problemes/index.json")).json()).lieux); } catch { this.lieux = new Set(); } }
    if (!this.lieux.has(id)) return null;
    const k = this.px > 1.2 ? 2 : 1, src = `assets/problemes/${id}@${k}x.webp`;
    if (!this.images.has(src)) this.images.set(src, new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; }));
    return this.images.get(src);
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
  // ---------------------------------------------------------------- les étiquettes et la plaque de la réponse
  layout(q) {
    const n = q.etiquettes.length, em = n > 2 ? 32 : 38, pw = n > 2 ? 176 : 220, out = []; let x = CADRE.x + 28;
    for (const [i, t] of q.etiquettes.entries()) { const w = D.largeurEtiquette(String(t.n), em, t.objet); out.push({ ...t, i, x, y: ETIQ_Y, w, h: D.ETIQ_H }); x += w + 14; }
    return { items: out, em, rep: { x: CADRE.x + CADRE.w - 28 - pw, y: ETIQ_Y - 18, w: pw, h: REP_H } };
  }
  paintDonnees(g) {
    const q = this.q; if (!q) return;
    const L = this.layout(q);
    for (const it of L.items) if (this.vues.has(it.i)) D.drawEtiquette(g, it.x, it.y, String(it.n), it.objet, { lit: this.lit === it.i, seed: it.i + 1, em: L.em });
    const t = (q.lecon ? "" : this.fs.typed) || (this.montre ? String(q.e.reponse) : "?");
    D.drawReponse(g, L.rep.x, L.rep.y, L.rep.w, t, q.e.objet, { juste: !!this.juste });
  }
  repaint() { if (this.q) this.calque("donnees", ZONE_CADRE, (g) => this.paintDonnees(g), "probleme-donnees"); }
  // ---------------------------------------------------------------- la plaque des objets (sur l'illustration)
  paintObjets(g, ctx) {
    const P = PLAQUE_OBJETS; if (!this.q || !this.objets) return;
    // le panneau de nacre, posé sur l'image (le décor), sous les objets
    ctx.save(); ctx.setTransform(this.px, 0, 0, this.px, -ZONE_OBJETS.x * this.px, -ZONE_OBJETS.y * this.px); ctx.fillStyle = "rgba(255, 250, 240, 0.92)"; ctx.strokeStyle = "#111"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(P.x, P.y, P.w, P.h, 22); ctx.fill(); ctx.stroke(); ctx.restore();
    this.objets(g, P);
  }
  // les données en objets (cran « plus facile ») : une collection par étiquette qui a un objet, au-dessus d'elle ; au-delà de 20,
  // des paquets de dix (un anneau de dix) et les objets seuls ; sans disposition qui suggère l'opération (côte à côte, séparées)
  dessinerCollections(q) {
    const L = this.layout(q), avec = L.items.filter((it) => it.objet);
    return (g, P) => {
      const n = Math.max(1, avec.length), cw = P.w / n;
      avec.forEach((it, j) => {
        const cx = P.x + cw * (j + 0.5), cy = P.y + P.h / 2, { dizaines, unites } = enObjets(it.n, this.app.module7?.objetsDizainesAuDela ?? 20);
        if (dizaines) {
          const k = 0.42, d0 = cx - ((dizaines - 1) * 64 + (unites ? 70 : 0)) / 2;
          for (let i = 0; i < dizaines; i++) D.drawGroupe(g, "anneau", it.objet, d0 + i * 64, cy - 30, 10, k, { seed: 60 + j * 10 + i });
          if (unites) D.placesGroupe(d0 + dizaines * 64 + 14, cy + 50, unites, 22, 5).forEach(([x, y], i) => D.drawObjet(g, it.objet, x, y, 0.42, 700 + j * 31 + i, i));
        } else {
          const cols = it.n <= 6 ? 3 : 5, pitch = Math.min(40, (cw - 30) / cols, (P.h - 30) / Math.ceil(it.n / cols) / 0.86);
          D.placesGroupe(cx, cy, it.n, pitch, cols).forEach(([x, y], i) => D.drawObjet(g, it.objet, x, y, pitch / 50, 700 + j * 31 + i, i));
        }
      });
    };
  }
  // des groupes : `n` contenants de `t` objets (les `plein` premiers remplis), en une rangée, centrés dans la zone Z ; `bonds` : le
  // total écrit sous les groupes allumés
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
  // ---------------------------------------------------------------- poser la question
  async askNotion(q) { return this.finaliser(q, await this.ask(q)); }
  finaliser(q, r) { const code = r.nsp ? "NSP" : classer(q.e, r.value); return { ...r, q, ok: code === null, code, aide: !!r.aide }; }
  async ask(q) {
    const fs = this.fs, { voice } = this.app;
    if (fs.detruit) return fige();
    this.leaveQuestion();
    this.q = q; this.vues = new Set(); this.lit = -1; this.juste = false; this.montre = false; this.objets = null; this.tok = (this.tok ?? 0) + 1; const tok = this.tok;
    fs.q = q; fs.typed = ""; fs.ring = false; fs.aide = false; fs.locked = false; fs.gate.open(); fs.slate.style.visibility = "hidden";
    fs.onTyped = () => this.repaint();
    const L = this.layout(q); this.app.starFrom = [L.rep.x + L.rep.w / 2, L.rep.y + REP_H / 2];
    // l'illustration (chargée avant d'être montrée : l'image, ou le papier), les données, la plaque des objets
    const img = await this.lieu(q.e.contexte);
    if (tok !== this.tok || fs.detruit) return fige();
    this.calque("cadre", ZONE_CADRE, (g, ctx) => this.paintCadre(g, ctx, img), "probleme-cadre");
    this.repaint();
    // les étiquettes se touchent (elles redisent leur phrase), dès qu'elles sont montrées
    this.boutons = L.items.map((it) => {
      const b = document.createElement("button"); b.className = "bubble probleme-etiquette"; b.setAttribute("aria-label", `étiquette ${it.n}`); b.dataset.n = String(it.n);
      Object.assign(b.style, { left: `${it.x}px`, top: `${it.y}px`, width: `${it.w}px`, height: `${it.h}px`, visibility: "hidden" });
      this.app.stage.ui.append(b);
      onBrief(this.app, b, () => { if (!this.q || this.q !== q || this.occupe) return; this.allumer(it.i); voice.stop(); voice.say(q.e.enonce[it.phrase]).then(() => { if (this.q === q && this.lit === it.i) this.allumer(-1); }); }, "etiquette");
      this.els.push(b); return b;
    });
    // (relecture du lot, R5 : toucher la plaque de la réponse redit la question seule)
    { const b = document.createElement("button"); b.className = "bubble probleme-plaque"; b.setAttribute("aria-label", "redire la question"); Object.assign(b.style, { left: `${L.rep.x}px`, top: `${L.rep.y}px`, width: `${L.rep.w}px`, height: `${REP_H}px` }); this.app.stage.ui.append(b); this.els.push(b);
      onBrief(this.app, b, () => { if (this.q !== q || this.occupe) return; voice.stop(); voice.say(q.e.question); }, "plaque"); }
    this.app.bulle?.eviter("probleme", () => (this.q ? [...this.boutons.filter((b) => b.style.visibility !== "hidden"), [L.rep.x, L.rep.y, L.rep.x + L.rep.w, L.rep.y + REP_H], ...(this.objets ? [[PLAQUE_OBJETS.x, PLAQUE_OBJETS.y, PLAQUE_OBJETS.x + PLAQUE_OBJETS.w, PLAQUE_OBJETS.y + PLAQUE_OBJETS.h]] : []), ...(this.aideVisible ? [[ZONE_AIDE.x, ZONE_AIDE.y, ZONE_AIDE.x + ZONE_AIDE.w, ZONE_AIDE.y + ZONE_AIDE.h]] : [])] : null));
    fs.help.style.visibility = q.coquillage ? "visible" : "hidden";
    const p = new Promise((res) => { fs.resolve = res; });
    fs.t0 = clock.now();
    // le niveau 3 : les groupes égaux montrés formés ; le partage, manipulé (le pavé attend que les objets soient rangés)
    const G = q.e.groupes;
    if (q.manipuler && q.e.structure === "groupes-egaux") this.setObjets((g) => this.groupesDans(PLAQUE_OBJETS, q.e.contenant ?? "anneau", q.e.objet, G.nombre, G.taille)(g));
    if (q.manipuler && q.e.structure === "partage" && G.inconnue === "nombre") this.setObjets((g) => this.groupesDans(PLAQUE_OBJETS, q.e.contenant ?? "anneau", q.e.objet, G.nombre, G.taille)(g));
    if (q.objets && !q.manipuler) this.setObjets(this.dessinerCollections(q));
    const partage = q.manipuler && q.e.structure === "partage" && G.inconnue === "taille";
    if (partage) fs.keys(false); else { fs.keys(true); fs.help.style.visibility = q.coquillage ? "visible" : "hidden"; }
    if (q.guide) { this.demo(q, tok).catch(() => {}); return p; }
    this.raconter(q, tok, { partage }).catch(() => {});
    return p;
  }
  // (la leçon L19, lessons/problemes.js) la scène seule : l'illustration, les étiquettes (montrées quand elles sont allumées) et la plaque
  // de la réponse, sans pavé ni voix
  async scene(q) {
    this.leaveQuestion(); this.q = q; this.vues = new Set(); this.lit = -1; this.juste = false; this.montre = false; this.tok = (this.tok ?? 0) + 1;
    const img = await this.lieu(q.e.contexte), L = this.layout(q);
    this.calque("cadre", ZONE_CADRE, (g, ctx) => this.paintCadre(g, ctx, img), "probleme-cadre");
    this.boutons = L.items.map(() => ({ style: {} }));
    this.app.bulle?.eviter("probleme", () => (this.q ? [[CADRE.x, ETIQ_Y - 18, CADRE.x + CADRE.w, ETIQ_Y + D.ETIQ_H], ...(this.aideVisible ? [[ZONE_AIDE.x, ZONE_AIDE.y, ZONE_AIDE.x + ZONE_AIDE.w, ZONE_AIDE.y + ZONE_AIDE.h]] : [])] : null));
    this.repaint();
  }
  setObjets(f) { this.objets = f; this.calque("objets", ZONE_OBJETS, (g, ctx) => this.paintObjets(g, ctx), "probleme-objets"); }
  allumer(i) { this.lit = i; if (i >= 0) { this.vues.add(i); this.boutons[i].style.visibility = "visible"; } this.repaint(); }
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
        if (its.length) this.allumer(its.at(-1).i); for (const t of its) this.vues.add(t.i), (this.boutons[t.i].style.visibility = "visible");
        this.repaint();
        await voice.say(s);
      }
      if (vivant()) this.allumer(-1);
    };
    await histoire();
    if (!vivant()) return;
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
  async partager(q, tok) {
    const { voice, stage } = this.app, e = q.e, G = e.groupes, n = G.nombre, t = G.taille, total = n * t, c = e.contenant ?? "anneau", T = this.T, Z = ZONE_AIDE;
    const dans = Array(n).fill(0), vivant = () => tok === this.tok && this.q === q;
    this.occupe = true;
    // les contenants (à droite), redessinés à chaque objet posé ; le tas (à gauche)
    const CW = Math.min(200, (Z.w - 200) / n), cont = [];
    const zoneC = { x: Z.x + 200, y: Z.y + 40, w: CW * n, h: Z.h - 60 };
    const Zc = { x: zoneC.x - 10, y: zoneC.y - 50, w: zoneC.w + 20, h: zoneC.h + 60 }, peindre = () => this.calque("contenants", Zc, (g) => this.groupesDans(zoneC, c, e.objet, n, t, { plein: dans })(g), "probleme-contenants");
    peindre();
    for (let i = 0; i < n; i++) cont.push([zoneC.x + CW * i, zoneC.y, zoneC.x + CW * (i + 1), zoneC.y + zoneC.h]);
    const places = D.placesGroupe(Z.x + 80, Z.y + Z.h / 2, total, 40, total <= 6 ? 2 : 3);
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
          const i2 = cont.findIndex(([x0, y0, x1, y1]) => px >= x0 && px <= x1 && py >= y0 - 40 && py <= y1);
          if (i2 < 0 || !vivant()) return;
          if (dans[i2] >= t) { this.app.sound?.play("erreur"); if (!ditMettre) { ditMettre = true; voice.stop(); voice.say(T.problemeMettre[c] ?? T.problemeMettre.anneau); } return; }
          dans[i2]++; restants--; this.app.sound?.play("bouton"); b.remove(); peindre();
          if (!restants) fini();
        };
        b.addEventListener("pointerup", lacher); b.addEventListener("pointercancel", () => { d = null; b.style.transform = ""; b.classList.remove("tenu"); });
        return b;
      });
      this.partageObjs = objs;
      this.app.bulle?.eviter("probleme-partage", () => (vivant() && restants ? [[Z.x, Z.y, Z.x + Z.w, Z.y + Z.h]] : null));
      voice.say(T.problemeAide.faisGroupes); voice.say(T.problemeMettre[c] ?? T.problemeMettre.anneau);
    });
    this.app.bulle?.eviter("probleme-partage", null);
    if (!vivant()) return;
    // tout est rangé : les contenants remplis montent sur l'illustration ; le pavé revient
    this.retirer("contenants"); this.setObjets((g) => this.groupesDans(PLAQUE_OBJETS, c, e.objet, n, t)(g));
    this.occupe = false; this.fs.keys(true); this.fs.help.style.visibility = q.coquillage ? "visible" : "hidden"; this.fs.t0 = clock.now();
  }
  // ---------------------------------------------------------------- l'aide (à la place du pavé)
  // `voir` (la leçon L19) : « tout » ne montre que la grande barre (le schéma se dessine en deux temps)
  paintAide(q, { montre = false, voir = null } = {}) {
    const e = q.e, Z = ZONE_AIDE;
    this.aideVisible = true;
    this.calque("aide", Z, (g, ctx) => {
      if (voir === "tout") { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, Z.w * this.px, (520 + D.BARRE_H + 10 - Z.y) * this.px); ctx.clip(); }
      if (q.aide === "barres") D.drawBarres(g, 360, 520, 640, e.barres, e.objet, { montre });
      else if (q.aide === "comparaison") D.drawComparaison(g, 360, 520, 640, e.comparaison, e.objet, { montre });
      else if (q.aide === "etapes") e.etapes.forEach((s, i) => D.drawBarres(g, i ? 700 : 318, 530, 340, s.barres, e.objet, { montre: montre || i === 0, seed: i + 1 }));
      else { const G = e.groupes; this.groupesDans({ x: Z.x, y: Z.y, w: Z.w, h: 200 }, e.contenant ?? "anneau", e.objet, G.nombre, G.taille, { bonds: montre ? G.nombre : this.bonds ?? 0, lit: this.litGroupe ?? -1 })(g); }
      // les deux étapes : leurs numéros sous les schémas
      // (les numéros des deux étapes pendant l'aide ; à la correction, les deux calculs prennent leur place)
      if (q.aide === "etapes" && !montre) [["1", 488], ["2", 870]].forEach(([t, x]) => D.drawCalcul(g, x, 700, t, 30));
      if (voir === "tout") ctx.restore();
    }, "probleme-aide");
  }
  effacerAide() { this.aideVisible = false; this.retirer("aide"); this.retirer("calcul"); }
  // ce que dit l'aide, avant la correction : le schéma, ce qu'on connaît, ce qu'on cherche
  phrasesAide(q) {
    const A = this.T.problemeAide, e = q.e;
    if (q.aide === "barres") return [A.regarde, e.barres.inconnue === "tout" ? A.ajoute : A.enleve];
    if (q.aide === "comparaison") return [A.regarde, A.grand, A.ecart, A.cherche];
    if (q.aide === "etapes") return [A.etape1, A.etape2];
    return [A.groupes, e.groupes.inconnue === "nombre" ? A.compteGroupes : A.compteObjets];
  }
  // les groupes comptés par bonds (5, 10, 15, 20) ; `reponse` faux : le dernier total n'est ni dit ni écrit (l'aide ne donne pas la réponse)
  async compterGroupes(q, g, { reponse = true } = {}) {
    const G = q.e.groupes, k = this.app.vitesse ?? 1;
    for (let i = 1; i <= G.nombre; i++) { this.bonds = reponse || i < G.nombre ? i : i - 1; this.litGroupe = i - 1; this.paintAide(q); this.app.sound?.play("bouton"); if (reponse || i < G.nombre) await g(this.app.voice.say(String(i * G.taille))); else await g(wait(700 / k)); await g(wait(150 / k)); }
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
  // ---------------------------------------------------------------- l'exemple guidé (après une leçon) : l'histoire, l'aide résolue, la correction
  async demo(q, tok) {
    const fs = this.fs, { voice } = this.app, T = this.T;
    fs.locked = true; fs.keys(false);
    const { g, abort, fin } = this.garde(), skip = skipKey(this.app, () => abort(), "passer l'exemple");
    try {
      await g(this.raconter(q, tok, { redire: false }));
      this.paintAide(q, { montre: true }); this.montre = true; this.repaint();
      await g(voice.say(q.e.correction)); await g(wait(500)); await g(voice.say(T.aToiFait));
    } catch (e) { if (e === QUITTE) { skip.remove(); return fige(); } if (e !== SKIPPED) throw e; voice.stop(); q.passe = true; } finally { fin(); }
    skip.remove(); this.montre = false; this.effacerAide(); this.repaint();
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
      this.calculPlaque(e);
      await g(voice.say(e.correction));
      await g(wait(900 / k));
    } catch (x) {
      if (x === QUITTE) quitte = true;
      else { if (x !== SKIPPED) throw x; voice.stop(); r.correctionPassee = true; montrer(); this.paintAide(q, { montre: true }); this.calculPlaque(e); await wait(1000); }
    } finally { fin(); skip.remove(); }
    if (quitte) return fige();
  }
  // la plaque du calcul (« 23 − 9 = 14 » ; deux étapes : les deux), sous l'aide
  calculPlaque(e) {
    const L = calculDe(e), Z = { x: 300, y: 694, w: 760, h: 100 };
    this.calque("calcul", Z, (g) => L.forEach((t, i) => D.drawCalcul(g, L.length > 1 ? (i ? 870 : 490) : 680, 700, t, L.length > 1 ? 34 : 42)), "probleme-calcul");
  }
  // ---------------------------------------------------------------- la sortie
  leaveQuestion() { for (const el of this.els) el.remove(); this.els = []; this.calques?.clear(); this.aideVisible = false; this.boutons = []; this.objets = null; this.occupe = false; this.bonds = 0; this.app.bulle?.eviter("probleme", null); this.app.bulle?.eviter("probleme-partage", null); }
  leave() { for (const q of [...this.gardes]) q(); this.gardes.clear(); this.tok = (this.tok ?? 0) + 1; this.leaveQuestion(); this.q = null; this.app.facts?.leave(); }
}
