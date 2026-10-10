// L'ÉCRAN DE DÉMARRAGE (lot « Correctifs de la tablette », décision du parent du 8 octobre 2026 ; docs/SPEC.md, section 2).
// (Lot « Correctifs : passage de l'échauffement aux voiliers », point 9 ; décision du parent du 10 octobre 2026.) LE LOGO EST CELUI
// DE LA MAQUETTE art/logo/ (validée par le parent ; son README.md donne les mouvements) : le texte « Maths CE1 », l'étoile et
// l'ombre, des images découpées dans l'image du parent (art/logo/decoupe.py), copiées dans assets/logo/ par
// art/tools/export-logo.mjs, et posées à leurs places (position.json). Les mouvements sont ceux de la maquette, avec ses
// valeurs : le va-et-vient du logo et de son ombre (CSS), le tour de l'étoile puis 2 s d'arrêt (CSS), les faisceaux du lagon
// (redessinés 20 fois par seconde, à la résolution 1x), les bulles qui montent et les étincelles (à chaque image), le fond
// d'eau. Chargement fini, « Toucher pour continuer » apparaît sous la barre, et avance et recule doucement.
// Sans changement : la barre de chargement, qui avance réellement (chaque tâche annoncée, `tache(promesse, poids)` : les
// contenus, l'index de la voix, les planches du premier écran, les vidéos de la mascotte, la fait avancer quand elle se
// termine ; planche « demarrage », dessinée dans l'atelier) ; la ligne « 2026 · js2c · version » (sa place seule change : 744
// px) ; le toucher qui ferme l'écran et autorise la voix (`attendreToucher`) ; le fondu de sortie. À la fermeture, la boucle
// d'animation s'arrête et les images sont libérées. Le temps d'image est mesuré (`mesure`) : au-delà de 20 ms en moyenne,
// moins de bulles, puis faisceaux figés (CLAUDE.md).
// Pour les parcours de test (tests/e2e/navigateur.mjs pose `window.__demarrageAuto`) : il s'efface seul, chargement fini.
import * as R from "../art/runtime.js";

// la barre (px de la scène) : son centre, la taille de son dessin (planche « demarrage », barre vide et pleine)
export const BARRE_AT = [640, 600], BARRE = { w: 550, h: 74 };
// la ligne d'information : sous « Toucher pour continuer » (maquette : 744 px)
export const INFO_Y = 744;
// la part chargée, de 0 à 1, à partir des poids des tâches finies (fonction pure, testée)
export const avancement = (fait, total) => (total > 0 ? Math.max(0, Math.min(1, fait / total)) : 1);
// les petites lignes d'information : « 2026 », « js2c », « version 1a2b3c4 » (pas de prénom d'enfant : le dépôt est public)
export const lignesInfo = (version) => ["2026", "js2c", version ? `version ${String(version).slice(0, 7)}` : null].filter(Boolean);
// l'allègement (fonction pure, testée) : le niveau suivant selon l'intervalle moyen des dernières images (au moins 20 images) ;
// 1 : moins de bulles ; 2 : faisceaux figés aussi. On ne remonte pas : l'écran ne dure que quelques secondes.
export const allegement = (niveau, intervalles) => {
  if (intervalles.length < 20 || niveau >= 2) return niveau;
  const m = intervalles.reduce((a, b) => a + b, 0) / intervalles.length;
  return m > 20 ? niveau + 1 : niveau;
};

// LES IMAGES DU LOGO, chargées les toutes premières (main.js, avant l'atlas) : la résolution de l'écran (@1x ou @2x, comme les
// planches), leurs places (position.json) ; résolu quand elles sont décodées (un logo à moitié dessiné ne s'affiche jamais)
export async function chargerLogo(px, racine = "assets/logo/") {
  const pos = await (await fetch(`${racine}position.json`)).json(), r = px > 1.2 ? 2 : 1;
  const img = (f) => { const i = new Image(); i.decoding = "async"; i.draggable = false; i.alt = ""; i.src = racine + f; return i; };
  const images = { ombre: img("ombre.webp"), texte: img(`texte@${r}x.webp`), etoile: img(`etoile@${r}x.webp`) };
  images.texte.alt = "Maths CE1";
  await Promise.all(Object.values(images).map((i) => i.decode().catch(() => {})));
  return { pos, images };
}

// ------------------------------------------------ la maquette art/logo/index.html : hasard reproductible, bruit lisse
function parkMiller(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const W = 1280, H = 800, TAILLES = [3, 5, 8, 12, 17, 24];
// pendant le chargement : l'intervalle minimal entre deux images (ms), et le repos après une image, en multiples de son temps
// de dessin (`suivante`)
const CHARGEMENT_MS = 66, REPOS = 2;
// ce que la maquette fabrique une fois (dans son ordre de tirage, pour les mêmes faisceaux et les mêmes bulles)
function fabriquer() {
  const rnd = parkMiller(97), Rr = (a, b) => a + (b - a) * rnd();
  const TAB = Array.from({ length: 256 }, () => rnd() * 2 - 1);
  const noise = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return TAB[i & 255] * (1 - u) + TAB[(i + 1) & 255] * u; };
  // les faisceaux de lumière (le code du lagon : textures, souffle, dérive)
  const makeShaft = () => {
    const w = 96, h = 512, c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"), im = g.createImageData(w, h);
    const n = 3 + Math.floor(rnd() * 4), comps = [];
    for (let i = 0; i < n; i++) comps.push({ c: Rr(0.2, 0.8), s: Rr(0.03, 0.13), a: Rr(0.4, 1) });
    const prof = new Float32Array(w); let mx = 0;
    for (let x = 0; x < w; x++) { const u = x / (w - 1); let v = 0; for (const q of comps) v += q.a * Math.exp(-((u - q.c) ** 2) / (2 * q.s * q.s)); prof[x] = v; mx = Math.max(mx, v); }
    const ph = Rr(0, 10);
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1), vert = smooth(0, 0.06, v) * Math.pow(1 - v, 1.6) * (0.85 + 0.15 * Math.sin(v * 23 + ph));
      for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; im.data[o] = 255; im.data[o + 1] = 250; im.data[o + 2] = 226; im.data[o + 3] = Math.round((prof[x] / mx) * vert * 255); }
    }
    g.putImageData(im, 0, 0); return c;
  };
  const shafts = Array.from({ length: 6 }, makeShaft), rays = [];
  for (let x = -380; x < 1420; x += Rr(55, 130)) {
    // plus vifs au milieu, là où la lumière tombe dans la référence
    const centre = 1 - 0.45 * smooth(250, 760, Math.abs(x + 160 - 640));
    rays.push({ x, tex: Math.floor(rnd() * shafts.length), w: Rr(70, 240), len: Rr(850, 1250), a: Rr(0.13, 0.27) * centre,
      ang: 0.2 + Rr(-0.035, 0.035), sw: Rr(0.012, 0.03), drift: Rr(15, 45), sp: Rr(0.05, 0.12), fl: Rr(0.12, 0.3), ph: Rr(0, 20) });
  }
  // les bulles d'air : une colonne à droite du « s », quelques-unes de l'étoile, et dans toute l'eau
  const nouvelle = (type, y) => {
    const b = { type, ph: Rr(0, 6.28), f: Rr(1.2, 2.4) };
    if (type === "colonne") { b.ti = 2 + Math.floor(rnd() * 4); b.x0 = 1004 + Rr(-14, 14); b.amp = Rr(4, 10); b.y = y ?? Rr(560, 640); b.v = Rr(55, 80) + TAILLES[b.ti] * 2; }
    else if (type === "etoile") { b.ti = Math.floor(rnd() * 3); b.x0 = 550 + Rr(-40, 40); b.amp = Rr(3, 7); b.y = y ?? Rr(470, 520); b.v = Rr(30, 50); }
    else { b.ti = Math.floor(rnd() * 4); b.x0 = Rr(20, W - 20); b.amp = Rr(4, 14); b.y = y ?? H + Rr(10, 120); b.v = Rr(18, 40) + TAILLES[b.ti] * 2.5; }
    b.r = TAILLES[b.ti]; return b;
  };
  const bulles = [];
  for (let i = 0; i < 9; i++) bulles.push(nouvelle("colonne", Rr(-20, 640)));
  for (let i = 0; i < 4; i++) bulles.push(nouvelle("etoile", Rr(150, 520)));
  for (let i = 0; i < 22; i++) bulles.push(nouvelle("eau", Rr(0, H)));
  // petites étincelles dorées qui scintillent près des lettres (elles étaient fixes dans la référence)
  const etincelles = [[694, 158, 9], [376, 245, 6], [529, 469, 5], [967, 400, 7], [1042, 474, 5], [258, 359, 4], [452, 498, 4], [858, 166, 4]].map(([x, y, r], i) => ({ x, y, r, ph: i * 1.7, f: Rr(0.5, 0.9) }));
  return { noise, shafts, rays, nouvelle, bulles, etincelles };
}
// une bulle, dessinée une fois en petite image (une bulle est un reflet, pas une boule)
function spriteBulle(r) {
  const s = Math.ceil(r * 2 + 4), c = document.createElement("canvas"); c.width = c.height = s;
  const g = c.getContext("2d"), m = s / 2;
  const gr = g.createRadialGradient(m - r * 0.25, m - r * 0.3, r * 0.1, m, m, r);
  gr.addColorStop(0, "rgba(220,250,250,0.05)"); gr.addColorStop(0.72, "rgba(190,240,240,0.10)"); gr.addColorStop(1, "rgba(235,255,255,0.42)");
  g.fillStyle = gr; g.beginPath(); g.arc(m, m, r, 0, Math.PI * 2); g.fill();
  // liseré irisé : rose en bas à droite, vert d'eau en haut à gauche, comme les bulles de la référence
  g.lineWidth = Math.max(1, r * 0.09);
  g.strokeStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.arc(m, m, r - g.lineWidth / 2, 0, Math.PI * 2); g.stroke();
  g.strokeStyle = "rgba(255,170,200,0.35)"; g.beginPath(); g.arc(m, m, r - g.lineWidth, 0.1 * Math.PI, 0.6 * Math.PI); g.stroke();
  g.strokeStyle = "rgba(150,255,210,0.35)"; g.beginPath(); g.arc(m, m, r - g.lineWidth, 1.1 * Math.PI, 1.45 * Math.PI); g.stroke();
  // reflets : un arc vif en haut à gauche, un point en bas à droite
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineCap = "round"; g.lineWidth = Math.max(1.2, r * 0.16);
  g.beginPath(); g.arc(m, m, r * 0.62, 1.12 * Math.PI, 1.42 * Math.PI); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.arc(m + r * 0.45, m + r * 0.42, Math.max(0.8, r * 0.09), 0, Math.PI * 2); g.fill();
  return c;
}

export class Demarrage {
  // `logo` : ce que rend chargerLogo (ses images, décodées, et leurs places)
  constructor(stage, sprites, logo = null) {
    this.st = stage; this.sp = sprites; this.total = 0; this.fait = 0; this.pret = false; this.logo = logo;
    const el = (this.el = document.createElement("div")); el.className = "demarrage";
    const div = (cls) => { const d = document.createElement("div"); d.className = cls; el.append(d); return d; };
    const toileScene = (cls, k) => { const c = document.createElement("canvas"); c.className = `demarrage-couche ${cls}`; c.width = Math.round(W * k); c.height = Math.round(H * k); c.k = k; el.append(c); return c; };
    // le fond d'eau et la lumière, les faisceaux (1x : ils sont flous), les bulles, le voile des bords, puis le logo
    div("demarrage-couche demarrage-fond");
    this.cRay = toileScene("demarrage-rayons", Math.min(1, stage.px));
    this.cBul = toileScene("demarrage-bulles", stage.px);
    div("demarrage-couche demarrage-voile");
    if (logo) {
      const { pos, images } = logo, t = pos.texte;
      const g = (this.groupe = div("demarrage-logo"));
      Object.assign(g.style, { left: `${t.x}px`, top: `${t.y}px`, width: `${t.w}px`, height: `${t.h}px` });
      for (const [k, cls] of [["ombre", "demarrage-ombre"], ["texte", "demarrage-texte"], ["etoile", "demarrage-etoile"]]) {
        const p = pos[k], i = images[k]; i.className = cls;
        Object.assign(i.style, { left: `${p.x - t.x}px`, top: `${p.y - t.y}px`, width: `${p.w}px`, height: `${p.h}px` });
        g.append(i);
      }
    }
    // la barre de chargement : les dessins de l'atelier, posés sur des canvas à l'échelle de l'écran
    const toile = (cls, cx, cy, w, h, paint) => {
      const c = document.createElement("canvas"); c.className = cls;
      c.width = Math.round(w * stage.px); c.height = Math.round(h * stage.px);
      Object.assign(c.style, { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px` });
      const ctx = c.getContext("2d"); paint(ctx, stage.px); el.append(c); return c;
    };
    const sprite = (ctx, name, x, y) => { try { sprites.draw(ctx, name, 0, x, y); } catch { /* planche absente : le fond suffit */ } };
    this.vide = toile("demarrage-barre", BARRE_AT[0], BARRE_AT[1], BARRE.w, BARRE.h, (ctx) => sprite(ctx, "demarrage.barre.vide", BARRE.w / 2, BARRE.h / 2));
    this.plein = toile("demarrage-barre plein", BARRE_AT[0], BARRE_AT[1], BARRE.w, BARRE.h, (ctx) => sprite(ctx, "demarrage.barre.pleine", BARRE.w / 2, BARRE.h / 2));
    // chargement fini : « Toucher pour continuer » (demande du parent du 10 octobre, midi)
    this.continuer = div("demarrage-continuer"); this.continuer.textContent = "Toucher pour continuer";
    stage.ui.append(el);
    this.montrer(0);
    // l'animation : la maquette, ses bulles à la taille de l'écran
    this.anim = fabriquer(); this.bulleImgs = TAILLES.map((r) => spriteBulle(r * this.cBul.k));
    this.mesure = { niveau: 0, images: 0, intervalles: [], moyenneMs: null };
    this.t0 = performance.now(); this.last = this.t0; this.lastRay = -1;
    this.raf = requestAnimationFrame((n) => this.boucle(n));
  }
  // la boucle : faisceaux 20 fois par seconde, bulles à chaque image ; le temps d'image est mesuré (après 0,5 s)
  boucle(now) {
    if (!this.raf) return;
    const w0 = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000), t = (now - this.t0) / 1000, M = this.mesure;
    // (pendant le chargement, l'intervalle entre deux images mesure surtout le chargement : il est noté à part, et l'allègement
    // ne se décide qu'une fois tout chargé, quand l'écran attend le toucher)
    if (t > 0.5) {
      const l = this.pret ? M.intervalles : (M.pendantChargement ??= []);
      l.push(now - this.last); if (l.length > 60) l.shift(); M.images++;
      M.moyenneMs = M.intervalles.length ? +(M.intervalles.reduce((a, b) => a + b, 0) / M.intervalles.length).toFixed(1) : null;
      M.chargementMs = M.pendantChargement?.length ? +(M.pendantChargement.reduce((a, b) => a + b, 0) / M.pendantChargement.length).toFixed(1) : null;
    }
    this.last = now;
    const n = this.pret ? allegement(M.niveau, M.intervalles) : M.niveau;
    if (n !== M.niveau) { M.niveau = n; M.intervalles = []; if (n === 1) this.anim.bulles = this.anim.bulles.filter((b, i) => b.type !== "eau" || i % 2 === 0); }
    // (allègement de niveau 2 : les faisceaux figés)
    if (t - this.lastRay >= 0.05 && (M.niveau < 2 || this.lastRay < 0)) { this.rayons(t); this.lastRay = t; }
    this.bulles(t, dt);
    this.suivante(performance.now() - w0);
    window.__demarrageMesure = { niveau: M.niveau, images: M.images, moyenneMs: M.moyenneMs, chargementMs: M.chargementMs, bulles: this.anim.bulles.length };
  }
  // l'image suivante. (Recette du lot : une boucle d'animation redemandée à chaque rafraîchissement de l'écran oblige la page
  // à fabriquer une image complète à chaque fois ; pendant le chargement, cela retardait tout le reste : démarrage mesuré à 10
  // à 13 s au lieu de 5 à 6 s, processeur ralenti 4 fois. Tant que tout n'est pas chargé, l'image suivante est donc demandée
  // après un repos : au moins `CHARGEMENT_MS`, et deux fois le temps de dessin de la dernière. Chargement fini, à chaque
  // rafraîchissement.)
  suivante(travail) {
    const go = () => { if (this.raf) this.raf = requestAnimationFrame((n) => this.boucle(n)); };
    if (this.pret) return go();
    clearTimeout(this.minuterie); this.minuterie = setTimeout(go, Math.max(CHARGEMENT_MS, REPOS * travail));
  }
  rayons(t) {
    const c = this.cRay, ctx = c.getContext("2d"), rk = c.k, { noise, shafts, rays } = this.anim;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); ctx.setTransform(rk, 0, 0, rk, 0, 0);
    ctx.globalCompositeOperation = "screen";
    for (const q of rays) {
      const band = 0.3 + 0.95 * (0.5 + 0.5 * noise(q.x * 0.0011 + t * 0.07));
      const breath = 0.35 + 0.65 * (0.5 + 0.5 * noise(t * q.fl + q.ph));
      ctx.globalAlpha = clamp(q.a * band * breath, 0, 1);
      const x0 = q.x + q.drift * noise(t * q.sp * 0.8 + q.ph * 1.7);
      ctx.save(); ctx.translate(x0, 0); ctx.rotate(-(q.ang + q.sw * noise(t * q.sp + q.ph)));
      ctx.drawImage(shafts[q.tex], -q.w / 2, -20, q.w, q.len); ctx.restore();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  bulles(t, dt) {
    const c = this.cBul, ctx = c.getContext("2d"), s = c.k, { bulles, nouvelle, etincelles } = this.anim;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < bulles.length; i++) {
      const b = bulles[i];
      b.y -= b.v * dt;
      // la bulle accélère un peu en montant, et se dandine
      const x = b.x0 + b.amp * Math.sin(t * b.f + b.ph) + 0.4 * b.amp * Math.sin(t * b.f * 2.3 + b.ph * 2);
      const fin = b.type === "etoile" ? 260 : -40;
      if (b.y < fin) { bulles[i] = nouvelle(b.type); continue; }
      let a = smooth(fin, fin + 90, b.y); // s'efface en arrivant en haut
      if (b.type === "etoile") a *= 0.85;
      const sp = this.bulleImgs[b.ti], sx = x * s - sp.width / 2, sy = b.y * s - sp.height / 2;
      // légère respiration de la forme (une bulle n'est jamais tout à fait ronde)
      const sq = 1 + 0.05 * Math.sin(t * b.f * 3 + b.ph);
      ctx.globalAlpha = a;
      ctx.drawImage(sp, sx - (sp.width * (sq - 1)) / 2, sy + (sp.height * (sq - 1)) / 2, sp.width * sq, sp.height / sq);
    }
    // étincelles : une croix à quatre branches qui grandit et s'éteint
    ctx.globalCompositeOperation = "lighter";
    for (const e of etincelles) {
      const p = 0.5 + 0.5 * Math.sin(t * e.f * 2.2 + e.ph), r = e.r * s * (0.35 + 0.9 * p * p);
      ctx.globalAlpha = 0.25 + 0.75 * p * p;
      const x = e.x * s, y = e.y * s;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.1);
      g.addColorStop(0, "rgba(255,248,200,0.95)"); g.addColorStop(1, "rgba(255,210,90,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,246,205,0.9)";
      ctx.beginPath(); ctx.moveTo(x, y - r * 2); ctx.quadraticCurveTo(x, y, x + r * 2, y); ctx.quadraticCurveTo(x, y, x, y + r * 2); ctx.quadraticCurveTo(x, y, x - r * 2, y); ctx.quadraticCurveTo(x, y, x, y - r * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  }
  // les petites lignes, sous la barre, écrites au feutre en bleu clair (la version n'est connue qu'un peu plus tard)
  infos(version) {
    this.info?.remove();
    const lignes = lignesInfo(version), em = 18, gap = 36, ws = lignes.map((l) => R.wordWidth(l) * em), w = ws.reduce((a, b) => a + b, 0) + gap * (lignes.length - 1) + 20, h = 34;
    const c = document.createElement("canvas"); c.className = "demarrage-info";
    c.width = Math.round(w * this.st.px); c.height = Math.round(h * this.st.px);
    Object.assign(c.style, { left: `${640 - w / 2}px`, top: `${INFO_Y}px`, width: `${w}px`, height: `${h}px` });
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
  // tout est chargé : « Toucher pour continuer » ; renvoie une promesse résolue au premier toucher (ou tout de suite en mode
  // automatique des tests)
  attendreToucher() {
    this.pret = true; this.montrer(1); this.el.classList.add("pret");
    if (window.__demarrageAuto) return Promise.resolve(false);
    return new Promise((res) => {
      const go = (e) => { e.preventDefault(); this.el.removeEventListener("pointerdown", go); res(true); };
      this.el.addEventListener("pointerdown", go);
    });
  }
  // il disparaît en fondu (0,4 s), puis la boucle s'arrête, les images et la planche sont libérées
  fermer() {
    this.el.classList.add("partir");
    return new Promise((res) => setTimeout(() => {
      cancelAnimationFrame(this.raf); clearTimeout(this.minuterie); this.raf = 0;
      for (const c of this.el.querySelectorAll("canvas")) { c.width = c.height = 0; }
      for (const i of this.el.querySelectorAll("img")) i.removeAttribute("src");
      this.anim = null; this.bulleImgs = null; this.logo = null;
      this.el.remove(); this.sp.unload("demarrage"); res();
    }, window.__demarrageAuto ? 0 : 400));
  }
}
