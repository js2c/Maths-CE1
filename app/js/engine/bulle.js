// LA BULLE DE LA MASCOTTE (lot « Mascotte », docs/SPEC.md, section 11 ; maquette : art/mascotte/README.md, section 5.5).
// Ce que dit la voix s'écrit mot à mot dans une bulle de BD, à côté de la mascotte, la pointe vers sa bouche. Elle n'est là
// que le temps de parler, puis 1,5 s (décision du parent du 6 octobre 2026) ; « réécouter » la refait (la voix redit la
// consigne). C'est la seule exception à « pas de texte long à l'écran » : elle reprend la voix, elle ne la remplace pas.
//  - Forme : celle de la maquette des voiliers (`balloonPath`, art/voiliers/index.html) : un ovale (superellipse d'exposant
//    2,7) qui contient le texte, au léger tremblé, et une pointe effilée qui se courbe d'un seul trait vers la bouche ; trait
//    qui s'épaissit du côté de l'ombre, ombre portée. Police Shantell Sans (graisse 600, nombres en 700 et en rouge).
//  - Place : elle ne couvre JAMAIS ce que l'enfant touche pour répondre (boutons, pavé, bulles-réponses, poisson à placer,
//    tuiles) ni la bande de la ligne graduée quand une ligne est affichée (les obstacles « durs ») ; elle peut couvrir un
//    moment la carte de la question (l'ardoise) ou le décor, mais l'évite quand elle peut, comme ce que dessine une leçon ou
//    une aide sur le calque des aides (les obstacles « souples », relevés sur une grille de 40 px). Elle essaie, dans
//    l'ordre, les places de `PLACES` (à droite de la tête, au-dessus de la ligne ; plus étroite ; à hauteur de la bouche,
//    entre l'ardoise et le pavé ; sous la tête) et prend la première qui ne touche rien (sinon la première qui ne touche
//    aucun obstacle dur). Si aucune ne laisse libre ce que l'enfant touche (l'album, couvert de cartes), elle ne s'affiche
//    pas : la voix parle seule. Tant qu'elle est là, elle vérifie quatre fois par seconde qu'un bouton n'est pas apparu
//    dessous ; sinon elle change de place, ou s'efface.
//  - Fonctions pures exportées (testées : tests/unit/mascotte.test.mjs) : `balloonPath`, `ovale`, `choisirPlace`, `mots`.
export const MASCOTTE = { x: 22, y: 136, w: 210, h: 280 }; // la tête, en px logiques (en haut à gauche, sous la maison)
// devant la joue droite (bord du visage mesuré à 82,4 % de la largeur du clip, à hauteur de la bouche : 71,5 %), 12 px de marge
export const BOUCHE = [MASCOTTE.x + MASCOTTE.w * 0.824 + 12, MASCOTTE.y + MASCOTTE.h * 0.715];
// sous le menton, pour une bulle posée sous la tête
export const MENTON = [MASCOTTE.x + MASCOTTE.w * 0.5, MASCOTTE.y + MASCOTTE.h * 0.93];
export const BAL_N = 2.7, BAL_K = Math.pow(2, 1 / BAL_N); // forme : entre l'ellipse (2) et le rectangle arrondi (4)
export const POLICE = { taille: 30, interligne: 1.16 };
// le texte ne dépasse pas 540 px de large : au-delà, l'ovale s'aplatit en losange (la maquette des voiliers : 440 px)
export const TEXTE_MAX = 540;
// les places essayées, dans l'ordre : une boîte où l'ovale doit tenir ([gauche, haut, droite, bas] en px logiques), la pointe
// vers la bouche ou sous le menton, et l'ovale collé en bas de la boîte, au plus près de la bouche
export const PLACES = [
  { nom: "droite", boite: [BOUCHE[0] + 34, 92, 1128, 292], pointe: BOUCHE },
  { nom: "droite-moyenne", boite: [BOUCHE[0] + 34, 92, 900, 292], pointe: BOUCHE },
  { nom: "droite-etroite", boite: [BOUCHE[0] + 34, 92, 690, 330], pointe: BOUCHE },
  { nom: "milieu", boite: [BOUCHE[0] + 34, 338, 1128, 484], pointe: BOUCHE }, // (entre l'ardoise, ombre comprise, et le pavé des additions)
  { nom: "dessous", boite: [8, MASCOTTE.y + MASCOTTE.h + 34, 404, 792], pointe: MENTON, haut: true }, // (à gauche des tuiles de « choisir », x 421)
  { nom: "droite-haute", boite: [BOUCHE[0] + 34, 92, 1128, 420], pointe: BOUCHE },
];

// le contour de la bulle (repris de art/voiliers/index.html, `balloonPath`) : centre, demi-axes, graine du tremblé, pointe
export function balloonPath(cx, cy, a, b, seed, tip) {
  const at = (th, wob) => {
    const c = Math.cos(th), s = Math.sin(th), r = wob ? 1 + 0.008 * Math.sin(th * 3 + seed) + 0.004 * Math.sin(th * 7 + seed * 1.7) : 1;
    return [cx + a * r * Math.sign(c) * Math.pow(Math.abs(c), 2 / BAL_N), cy + b * r * Math.sign(s) * Math.pow(Math.abs(s), 2 / BAL_N)];
  };
  // base de la pointe : sur le bord, face à la bouche, large d'environ 44 px
  const ang = Math.atan2((tip[1] - cy) / b, (tip[0] - cx) / a); let half = 0.03;
  while (half < 0.7) { const p = at(ang - half, false), q = at(ang + half, false); if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= 44) break; half += 0.01; }
  const t1 = ang + half, t2 = ang - half + Math.PI * 2, N = 160; let d = "";
  for (let i = 0; i <= N; i++) { const p = at(t1 + ((t2 - t1) * i) / N, true); d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }
  const p1 = at(t1, true), p2 = at(t2, true), mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
  const dx = tip[0] - mx, dy = tip[1] - my, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, bend = Math.min(30, L * 0.3);
  // les deux flancs se courbent du même côté : la pointe « fouette » vers la bouche
  const c2 = [(p2[0] + tip[0]) / 2 + nx * bend, (p2[1] + tip[1]) / 2 + ny * bend], c1 = [(p1[0] + tip[0]) / 2 + nx * bend * 0.55, (p1[1] + tip[1]) / 2 + ny * bend * 0.55];
  d += `Q${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}Q${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}Z`;
  return d;
}
// l'ovale qui contient un bloc de texte w × h (comme la maquette des voiliers) : demi-axes
// (une ligne seule : l'ovale garde au moins un cinquième de sa largeur en hauteur, sinon il s'aplatit en pilule : relecture du lot)
export const ovale = (w, h) => { const a = (w / 2) * BAL_K + 8; return { a, b: Math.max((h / 2) * BAL_K + 6, a / 5) }; };
// des lignes équilibrées : un texte plus long que 420 px sur une ligne est coupé en lignes de longueurs voisines (au plus
// 420 px chacune, plus une marge) ; sinon l'ovale s'aplatit
export const largeurEquilibree = (naturel) => (naturel > 420 ? Math.ceil(naturel / Math.ceil(naturel / 420)) + 24 : Math.ceil(naturel) + 4);
// la largeur de texte la plus grande qui tient dans une boîte
export const largeurMax = (boite) => Math.min(TEXTE_MAX, Math.max(120, ((boite[2] - boite[0]) / 2 - 8) * 2 / BAL_K));
// l'ovale posé dans sa boîte : collé à gauche, au plus près de la hauteur de la pointe (en bas de la boîte si elle est plus
// bas ; en haut de la boîte pour une bulle sous la tête) ; renvoie centre, demi-axes et rectangle occupé (pointe comprise)
export function poser(place, w, h) {
  const { a, b } = ovale(w, h), [x0, y0, x1, y1] = place.boite, cx = x0 + a;
  const cy = place.haut ? y0 + b : Math.max(y0 + b, Math.min(place.pointe[1] - b * 0.35, y1 - b));
  const rect = [cx - a, cy - b, cx + a, cy + b];
  return { cx, cy, a, b, rect, deborde: rect[2] > x1 + 1 || rect[3] > y1 + 1 || rect[1] < y0 - 1 };
}
const aire = (r, o, m = 8) => Math.max(0, Math.min(r[2], o[2] + m) - Math.max(r[0], o[0] - m)) * Math.max(0, Math.min(r[3], o[3] + m) - Math.max(r[1], o[1] - m));
// la première place sans obstacle (les obstacles : rectangles [gauche, haut, droite, bas]) ; sinon la première qui ne couvre
// aucun obstacle dur et le moins d'obstacles souples ; sinon celle qui couvre le moins. `mesure(largeurMax)` donne la taille
// du texte mis en page à cette largeur : [w, h]. `couvre` : l'aire des obstacles durs couverts ; `gene` : des souples.
export function choisirPlace(obstacles, mesure, places = PLACES, souples = []) {
  let best = null;
  for (const place of places) {
    const [w, h] = mesure(largeurMax(place.boite)), p = poser(place, w, h);
    const couvre = obstacles.reduce((s, o) => s + aire(p.rect, o), 0) + (p.deborde ? 1e6 : 0), gene = souples.reduce((s, o) => s + aire(p.rect, o, 0), 0);
    const r = { place, w, h, ...p, couvre, gene, score: couvre * 1000 + gene };
    if (!r.score) return r;
    if (!best || r.score < best.score) best = r;
  }
  return best;
}
// le texte découpé en mots, les nombres à part (en rouge) ; les espaces insécables de la typographie française gardées
// (un mot d'une lettre, « À », « à », « a », n'est jamais seul en fin de ligne : relecture du lot)
export const mots = (texte) => texte.trim().replace(/ ([:;!?»])/g, " $1").replace(/« /g, "« ").replace(/(^| )([A-Za-zÀ-ÖØ-öø-ÿ]) /g, "$1$2\u00a0").split(/[ \t\n]+/).map((w) => w.split(/(\d+)/).filter(Boolean).map((t) => ({ t, nombre: /^\d+$/.test(t) })));

// ce que l'enfant touche, visible, en px logiques (ce que la bulle ne doit jamais couvrir)
const TOUCHE = "button, .touchband, .fishhit, .shelltap, [data-bulle-evite]", CARTE = ".slate, .tally, .card, .special, [data-bulle-souple]"; // (l'ardoise, le bilan des étoiles, les cartes)
export function obstacles(ui, k, sel = TOUCHE) {
  const r0 = ui.getBoundingClientRect(), out = [];
  for (const el of ui.querySelectorAll(sel)) {
    if (el.closest(".bulle")) continue;
    const vis = el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : getComputedStyle(el).visibility !== "hidden" && el.offsetParent !== null;
    if (!vis || el.closest(".stash")) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    out.push([(r.left - r0.left) / k, (r.top - r0.top) / k, (r.right - r0.left) / k, (r.bottom - r0.top) / k]);
  }
  return out;
}

const SVG = "http://www.w3.org/2000/svg";
export class Bulle {
  // stage : la scène (son calque #ui, son échelle k)
  // stage : la scène ; `dures()` : d'autres zones à ne jamais couvrir (la bande de la ligne graduée affichée, main.js)
  constructor(stage, { dures = () => [] } = {}) {
    this.st = stage; this.dures = dures; this.grille = { gen: null, rects: [] };
    const el = (this.el = document.createElement("div"));
    el.className = "bulle keep cachee"; el.setAttribute("aria-hidden", "true");
    const svg = document.createElementNS(SVG, "svg"); svg.setAttribute("width", "1280"); svg.setAttribute("height", "800"); svg.setAttribute("viewBox", "0 0 1280 800");
    this.paths = ["ombre", "epais", "trait"].map((c) => { const p = document.createElementNS(SVG, "path"); p.setAttribute("class", c); svg.append(p); return p; });
    this.txt = document.createElement("div"); this.txt.className = "bulle-texte";
    el.append(svg, this.txt);
    stage.ui.prepend(el); // (au-dessus des autres éléments par son z-index : app.css)
    this.words = []; this.timers = []; this.shown = false; this.texte = ""; this.place = null;
    this.watch = setInterval(() => this.verifier(), 250);
    // la police d'abord (sinon la première mise en page se ferait avec une autre police)
    document.fonts?.load?.(`600 ${POLICE.taille}px "Shantell Sans"`).catch(() => {});
  }
  clear() { this.timers.forEach(clearTimeout); this.timers = []; clearInterval(this.reveal); }
  // la voix commence un texte de `ms` millisecondes
  dire(texte, ms) {
    this.clear();
    this.texte = texte; this.txt.textContent = "";
    this.words = mots(texte).map((parts, i) => {
      if (i) this.txt.append(" ");
      const s = document.createElement("span"); s.className = "m";
      for (const p of parts) { if (p.nombre) { const n = document.createElement("span"); n.className = "nb"; n.textContent = p.t; s.append(n); } else s.append(p.t); }
      this.txt.append(s); return s;
    });
    this.layout();
    if (this.place.couvre) { this.shown = false; this.el.classList.add("cachee"); return; } // nulle part sans couvrir une cible
    this.el.classList.remove("cachee", "pop"); void this.el.offsetWidth; this.el.classList.add("pop");
    this.shown = true;
    // les mots apparaissent au rythme de la phrase (poids : la longueur de chaque mot)
    const weights = this.words.map((w) => w.textContent.length + 2), sum = weights.reduce((a, b) => a + b, 0), span = Math.max(1, ms * 0.92), t0 = performance.now();
    const show = () => {
      const el = ((performance.now() - t0) / span) * sum; let acc = 0, n = 0;
      for (const w of weights) { if (acc <= el) n++; acc += w; }
      this.words.forEach((w, i) => w.classList.toggle("on", i < Math.max(1, n)));
      if (n >= this.words.length) clearInterval(this.reveal);
    };
    show(); this.reveal = setInterval(show, 40);
  }
  // la phrase est finie : tout le texte, puis la bulle s'efface 1,5 s plus tard
  silence() {
    if (!this.shown) return;
    clearInterval(this.reveal); this.words.forEach((w) => w.classList.add("on"));
    this.timers.push(setTimeout(() => this.cacher(), 1500));
  }
  cacher() { this.clear(); this.shown = false; this.el.classList.add("cachee"); }
  // la mise en page : mesurer le texte à une largeur donnée, choisir la place, tracer l'ovale
  mesure(maxW) {
    Object.assign(this.txt.style, { maxWidth: `${Math.round(maxW)}px`, left: "0px", top: "0px" });
    return [this.txt.offsetWidth, this.txt.offsetHeight];
  }
  // ce que dessinent les aides et les leçons (le calque des aides) : les cases occupées d'une grille de 40 px, relevées sur
  // une copie réduite du calque (32 × 20 pixels), seulement quand le calque a été redessiné
  dessins() {
    const cv = [...this.st.root.querySelectorAll("canvas.aid-board")].filter((c) => !c.classList.contains("stash") && c.__gen !== undefined), key = cv.map((c) => `${c.__gen}:${c.__used}`).join();
    if (key === this.grille.gen) return this.grille.rects;
    const rects = [];
    if (cv.some((c) => c.__used)) {
      const g = (this.mini ??= Object.assign(document.createElement("canvas"), { width: 32, height: 20 })), x = g.getContext("2d", { willReadFrequently: true });
      x.clearRect(0, 0, 32, 20); for (const c of cv) if (c.__used && c.width) x.drawImage(c, 0, 0, c.width, c.height, 0, 0, 32, 20);
      const d = x.getImageData(0, 0, 32, 20).data;
      for (let j = 0; j < 20; j++) for (let i = 0; i < 32; i++) if (d[(j * 32 + i) * 4 + 3] > 10) rects.push([i * 40, j * 40, i * 40 + 40, j * 40 + 40]);
    }
    this.grille = { gen: key, rects }; return rects;
  }
  obstacles() { return { durs: [...obstacles(this.st.ui, this.st.k), ...this.dures()], souples: [...obstacles(this.st.ui, this.st.k, CARTE), ...this.dessins()] }; }
  layout() {
    const cible = largeurEquilibree(this.mesure(4000)[0]), m = (w) => this.mesure(Math.min(w, cible));
    const { durs, souples } = this.obstacles(), p = choisirPlace(durs, m, PLACES, souples);
    m(largeurMax(p.place.boite));
    Object.assign(this.txt.style, { left: `${(p.cx - p.w / 2).toFixed(1)}px`, top: `${(p.cy - p.h / 2).toFixed(1)}px` });
    const d = balloonPath(p.cx, p.cy, p.a, p.b, (Math.round(p.w) * 7 + Math.round(p.h)) % 13, p.place.pointe);
    this.paths.forEach((e) => e.setAttribute("d", d));
    this.paths[0].setAttribute("transform", "translate(6 7)"); this.paths[1].setAttribute("transform", "translate(1.6 1.9)");
    this.el.style.transformOrigin = `${p.place.pointe[0]}px ${p.place.pointe[1]}px`; // elle naît de la bouche
    this.place = p; this.el.dataset.place = p.place.nom;
  }
  // un bouton apparu sous la bulle : elle change de place
  // (et un dessin de leçon apparu dessous, s'il y a mieux)
  verifier() {
    if (!this.shown || !this.place) return;
    const { durs, souples } = this.obstacles();
    if (durs.some((o) => aire(this.place.rect, o) > 0)) { this.layout(); if (this.place.couvre) this.cacher(); return; }
    if (this.place.gene || souples.some((o) => aire(this.place.rect, o, 0) > 0)) { const avant = this.place.place.nom; this.layout(); if (this.place.place.nom !== avant) { this.el.classList.remove("pop"); void this.el.offsetWidth; this.el.classList.add("pop"); } }
  }
  // pour les tests : où elle est, ce qu'elle dit, ce qu'elle couvre
  etat() {
    const o = this.shown && this.place ? this.obstacles() : { durs: [], souples: [] }, sur = (l) => l.filter((r) => aire(this.place.rect, r, 0) > 0).length;
    return { visible: this.shown, texte: this.texte, place: this.place?.place.nom ?? null, rect: this.place?.rect ?? null, couvre: sur(o.durs), gene: sur(o.souples) };
  }
}
