// FICHIER GÉNÉRÉ par art/tools/export-recif.mjs depuis art/recif-vivant/index.html (empreinte c688585e2500) : ne pas
// modifier à la main. Le script de la maquette du récif vivant, tel quel, enveloppé dans startRecif ; ses raccords à
// l'application sont décrits dans l'outil (RETOUCHES). Les images sont dans assets/recif/ (donnees.json).
//
// OPTS : { cv, glc : les deux canvas ; donnees : assets/recif/donnees.json ; owned, brillantes : les créatures (noms de
// la maquette) possédées et brillantes ; size() : { w, h } de la scène en px CSS ; rect() : sa place à l'écran ; dpr() :
// la densité ; on(cible, type, f) : un écouteur à retirer en sortant ; onFiche(id) : une créature touchée ;
// scintille(ctx, c, x0, y0, t, k) : le scintillement d'une brillante ; mesure(t) : appelé à chaque image }
/* eslint-disable */
export function startRecif(OPTS) {
let VIVANT = true, RAF = 0;
const VW = () => OPTS.size().w, VH = () => OPTS.size().h;
const A = OPTS.donnees.A;
// le sous-marin : dessin détouré (phares éteints) et calque « phares allumés » ; lamps = lampes, helice = hélice (px du dessin)
const SUB = OPTS.donnees.SUB;
// les poissons des abysses, détourés à l'avance ; head = 1 si le dessin regarde à droite ; lure = leurre de la baudroie (px du dessin)
const ABYSS_FISH = OPTS.donnees.ABYSS_FISH;
// les créatures du lagon que l'enfant gagne : une image générée par créature, détourée à l'avance.
// m = marge vide autour du dessin (px de l'image) : elle laisse la place au liseré et au halo, calculés à la
// demande quand on survole la créature ou qu'on garde le doigt dessus.
const LAGON_SPR = OPTS.donnees.LAGON_SPR;
// les créatures du récif de corail que l'enfant gagne (mêmes principes que celles du lagon)
const CORAIL_SPR = OPTS.donnees.CORAIL_SPR;
// les créatures du grand large que l'enfant gagne
const LARGE_SPR = OPTS.donnees.LARGE_SPR;
// les créatures des abysses que l'enfant gagne
const ABYSSES_SPR = OPTS.donnees.ABYSSES_SPR;
// fiches des créatures (nom, zone, rareté, anecdote), reprises de app/content/cartes.json
const FICHES = {};
const W = A.W, H = A.H;
const cv = OPTS.cv, ctx = cv.getContext('2d');
const glc = OPTS.glc;
const loadImg = s => { const i = new Image(); i.src = s; return i; };
const tiles = A.tiles.map(t => ({x:t.x, w:t.w, img:loadImg(t.src), tex:null}));
const front = A.front.map(t => ({...t, mask:loadImg(t.mask), canvas:null}));
const algues = A.algues.map((a,i) => ({...a, img:loadImg(a.src), ph:i*2.1+0.7, ph2:i*1.3}));
const spr = {}; for (const k in A.fish) spr[k] = {img:loadImg(A.fish[k].src), w:A.fish[k].w, h:A.fish[k].h};
const TOP = A.top;
const topAt = x => x < 0 ? TOP[0] : (x >= 5800 ? H : TOP[Math.min(TOP.length-1, Math.round(x/20))]);
function ceilAhead(x, dir, span){ let m = H; for (let d = 0; d <= span; d += 40) m = Math.min(m, topAt(x + dir*d)); return m; }

// Le premier plan réutilise les tuiles du fond et un masque alpha léger :
// on évite ainsi d'embarquer une seconde copie JPEG/WebP du récif dans la maquette.
function frontCanvas(f){
  if (f.canvas) return f.canvas;
  const bg = tiles[f.tile];
  if (!bg || !bg.img.complete || !f.mask.complete || !bg.img.naturalWidth || !f.mask.naturalWidth) return null;
  const c = document.createElement('canvas'); c.width = f.w; c.height = H - f.y;
  const g = c.getContext('2d');
  g.drawImage(bg.img, 0, f.y, f.w, H-f.y, 0, 0, f.w, H-f.y);
  g.globalCompositeOperation = 'destination-in';
  g.drawImage(f.mask, 0, 0, f.w, H-f.y);
  f.canvas = c;
  return c;
}

const ZONES = [
  {name:'Le lagon', x0:0, x1:2600}, {name:'Le récif de corail', x0:2600, x1:5900},
  {name:'Le grand large', x0:5900, x1:8400}, {name:'Les abysses', x0:8400, x1:W}
];
const HEAD = {
  banc_poissons1_1:-1,banc_poissons1_2:-1,banc_poissons1_3:-1,banc_poissons1_4:-1,banc_poissons1_5:-1,
  banc_poissons2_1:-1,banc_poissons2_2:-1,banc_poissons3_1:-1,banc_poissons3_2:-1,
  banc_poissons3_3:1,banc_poissons3_4:1,banc_poissons3_5:1,
  banc_poissons4_1:-1,banc_poissons4_2:-1,banc_poissons4_3:-1,banc_poissons4_4:-1,banc_poissons4_5:-1,
  petit_poisson_lagon1_1:-1,petit_poisson_lagon2_1:1,petit_poisson_lagon3_1:-1,
  poisson_ombre1_1:1,poisson_ombre2_1:-1
};
const SOLOS = [['petit_poisson_lagon1_1',190],['petit_poisson_lagon2_1',140],['petit_poisson_lagon3_1',140],
  ['poisson_ombre1_1',200],['poisson_ombre2_1',150],['banc_poissons3_1',210],['banc_poissons3_2',220]];
const SCHOOLS = [
  {keys:['banc_poissons1_1','banc_poissons1_2','banc_poissons1_3','banc_poissons1_4','banc_poissons1_5'], len:105},
  {keys:['banc_poissons2_1','banc_poissons2_2'], len:160},
  {keys:['banc_poissons4_1','banc_poissons4_2','banc_poissons4_3','banc_poissons4_4','banc_poissons4_5'], len:155},
  {keys:['banc_poissons3_3','banc_poissons3_4','banc_poissons3_5'], len:100}
];

let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const R = (a,b) => a + (b-a)*rnd();
const pick = arr => arr[Math.floor(rnd()*arr.length)];
const pickWeighted = arr => { const total = arr.reduce((s,a) => s + (a.poids || 1), 0); let u = rnd()*total; for (const a of arr){ u -= (a.poids || 1); if (u <= 0) return a; } return arr[arr.length-1]; };
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const smooth = (a,b,x) => { const u = clamp((x-a)/(b-a),0,1); return u*u*(3-2*u); };
const noise = p => (Math.sin(p) + Math.sin(p*2.31+1.7)*0.5 + Math.sin(p*0.53+4.1)*0.8) / 2.3;

// dès la sortie du récif : les poissons rapetissent et s'estompent vers le grand large
const REEF_END = 5750, VANISH = 6900;
const distScale = x => 1 - 0.55*smooth(REEF_END - 150, VANISH, x);
const distFade  = x => 1 - smooth(REEF_END, VANISH, x);

// ---------- les nageurs ----------
const groups = [];
function newGroup(school, how, x){
  const g = { school, dir:1, x:0, y:0, vy:0, base: school ? R(55,85) : R(38,70), ph:R(0,100),
              ty:0, tyT:0, dive:null, rising:false, diving:false, members:[] };
  if (how === 'left'){ g.dir = 1;  g.x = x ?? R(-420,-260); g.y = R(340, 900); }
  else if (how === 'deep'){ g.dir = -1; g.x = x ?? R(6850, 7000); g.y = R(420, 820); }
  else if (how === 'here'){ g.dir = rnd()<0.5 ? -1 : 1; g.x = x; g.y = R(340, Math.max(360, Math.min(900, topAt(x) - 120))); }
  else { g.dir = rnd()<0.5 ? -1 : 1; g.x = x ?? R(3000, 5300); g.y = topAt(g.x) + 140; g.rising = true; }
  if (!g.rising && rnd() < 0.25){
    const lo = g.dir > 0 ? Math.max(g.x+600, 3000) : 3000, hi = g.dir > 0 ? 5300 : Math.min(g.x-600, 5300);
    if (hi > lo) g.dive = {x: R(lo, hi)};
  }
  g.ty = g.rising ? topAt(g.x) - R(180, 320) : g.y;
  if (school){
    const S = pick(SCHOOLS), slots = [];
    S.keys.forEach(k => {
      let ox, oy, ok = false, n = 0;
      while (!ok && n++ < 80){ ox = R(-170,170); oy = R(-100,100); ok = slots.every(s => Math.hypot(s.ox-ox, s.oy-oy) > S.len*0.8); }
      slots.push({ox, oy});
      g.members.push({key:k, len:S.len*R(0.88,1.08), ox, oy, k:R(1.4,2.4), x:g.x+ox, y:g.y+oy, vx:0, vy:0, tilt:0, ph:R(0,50), wph:R(0,6), hidden:false});
    });
  } else {
    const [k,len] = pick(SOLOS);
    g.members.push({key:k, len:len*R(0.9,1.1), ox:0, oy:0, k:0, x:g.x, y:g.y, vx:0, vy:0, tilt:0, ph:R(0,50), wph:0, hidden:false});
  }
  groups.push(g);
}
function stepGroup(g, dt, t){
  const s = distScale(g.x);
  const sp = g.base * (0.85 + 0.22*noise(t*0.21 + g.ph)) * (0.45 + 0.55*s);
  g.x += g.dir * sp * dt;
  g.tyT -= dt;
  const roof = 330, floor = Math.min(980, ceilAhead(g.x, g.dir, 500) - 110);
  if (g.rising){ if (g.y < g.ty + 30) g.rising = false; }
  else if (g.dive && (g.dir > 0 ? g.x > g.dive.x : g.x < g.dive.x)){ g.ty = topAt(g.x) + 320; g.diving = true; }
  else if (g.x > REEF_END && g.dir > 0){ g.ty += (560 - g.ty)*dt*0.3; }
  else if (g.tyT < 0){ g.ty = R(roof, Math.max(roof+40, floor)); g.tyT = R(4, 9); }
  if (!g.rising && !g.diving) g.ty = clamp(g.ty, roof, Math.max(roof, floor));
  const want = clamp((g.ty - g.y)*0.22, -24, 24) + 7*Math.sin(t*0.45 + g.ph);
  g.vy += (want - g.vy) * (1 - Math.exp(-0.9*dt));
  g.y += g.vy * dt;
  g.vx = g.dir * sp;
  const sc = distScale(g.x);
  for (const m of g.members){
    if (g.members.length === 1){ m.x = g.x; m.y = g.y; m.vx = g.vx; m.vy = g.vy; }
    else {
      const tx = g.x + m.ox*sc, ty = g.y + m.oy*sc + Math.sin(t*0.6 + m.wph)*10*sc;
      const k = 1 - Math.exp(-m.k*dt);
      const nx = m.x + (tx - m.x)*k, ny = m.y + (ty - m.y)*k;
      m.vx = (nx - m.x)/Math.max(dt,1e-3); m.vy = (ny - m.y)/Math.max(dt,1e-3);
      m.x = nx; m.y = ny;
    }
    const w = clamp(Math.atan2(m.vy, Math.abs(m.vx) + 25), -0.22, 0.22);
    m.tilt += (w - m.tilt) * (1 - Math.exp(-2*dt));
    m.ph += dt * (1.2 + Math.min(2.2, Math.hypot(m.vx, m.vy)/40)) * Math.PI;
    m.hidden = m.y - m.len*0.3*distScale(m.x) > topAt(m.x) + 20;
  }
}
function finished(g){
  if (g.dir < 0 && g.x < -700) return true;
  if (g.dir > 0 && g.x > VANISH + 250) return true;
  if (g.diving && g.members.every(m => m.hidden)) return true;
  return false;
}
// population : on garde du monde dans le lagon et dans le récif
const WANT_LAGON = 6, WANT_REEF = 7, MAX_SCHOOLS = 5;
function spawnTick(){
  const nLag = groups.filter(g => g.x < 2600).length;
  const nReef = groups.filter(g => g.x >= 2600 && g.x < 7100).length;
  const school = groups.filter(g => g.school).length < MAX_SCHOOLS && rnd() < 0.35;
  if (nLag < WANT_LAGON) newGroup(school, 'left');
  else if (nReef < WANT_REEF) newGroup(school, rnd() < 0.6 ? 'deep' : 'coral');
}
for (let i = 0; i < WANT_LAGON; i++) newGroup(rnd() < 0.3, 'here', R(150, 2450));
for (let i = 0; i < WANT_REEF; i++) newGroup(rnd() < 0.4, 'here', R(2800, 5500));
let spawnT = 0;

// ---------- poisson : il ondule, la tête toujours devant ----------
const STRIPS = 14;
function drawMember(m, dir, sc, camX){
  const sp = spr[m.key]; if (!sp.img.complete) return;
  const fade = distFade(m.x); if (fade <= 0.01) return;
  const len = m.len * distScale(m.x), hgt = len * sp.h / sp.w;
  const px = (m.x - camX)*sc, py = m.y*sc;
  if (px < -len*sc || px > cv.width + len*sc) return;
  const srcHead = HEAD[m.key], flip = dir * srcHead;
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(px, py); ctx.rotate(m.tilt * dir); ctx.scale(sc*flip, sc);
  const w = len, h = hgt, amp = h*0.06;
  for (let i = 0; i < STRIPS; i++){
    const u0 = i/STRIPS, u1 = (i+1)/STRIPS;
    const uh = srcHead < 0 ? (u0+u1)/2 : 1-(u0+u1)/2;
    const b = Math.max(0, uh-0.3)/0.7;
    const dy = amp * b*b * Math.sin(m.ph - uh*3.0);
    ctx.drawImage(sp.img, u0*sp.w, 0, (u1-u0)*sp.w + 0.8, sp.h, -w/2 + u0*w, -h/2 + dy, (u1-u0)*w + 0.8, h);
  }
  ctx.restore();
}

// ---------- algues : elles ondulent, le pied reste fixe ----------
function drawAlgues(t, sc, camX, viewW){
  for (const a of algues){
    if (!a.img.complete || a.x + a.w < camX - 40 || a.x > camX + viewW + 40) continue;
    const step = 3, A = a.h*0.075;
    for (let r = 0; r < a.h; r += step){
      const hb = 1 - (r + step/2)/a.h;                 // 0 au pied, 1 en haut
      const bend = Math.pow(smooth(0.42, 1, hb), 1.3);
      const dx = bend * (A*Math.sin(t*0.85 + a.ph - hb*1.4) + A*0.35*Math.sin(t*1.9 + a.ph2 - hb*2.2));
      ctx.drawImage(a.img, 0, r, a.w, Math.min(step, a.h - r) + 0.5,
        (a.x + dx - camX)*sc, (a.y + r)*sc, a.w*sc, (Math.min(step, a.h - r) + 0.5)*sc);
    }
  }
}

// ---------- flore du récif : gorgones, anémones, coraux ----------
// Implantation : chaque élément est posé par son pied à un point précis du panorama.
//  - « back »  : dessiné avant le premier plan ; le pied est caché derrière une roche ou un massif,
//                seule la partie qui dépasse du récif se voit (comme les coraux du fond).
//  - « front » : dessiné après le premier plan, posé sur le sable ou sur une roche visible.
// La houle est commune à tout le récif : chaque plante suit le même courant, avec un retard
// qui dépend de sa position (l'onde traverse le récif) et de sa hauteur (la cime suit le pied).
const HOULE_T = 6.8, HOULE_K = 0.0011;
const houle = (t, x) => 0.78*Math.sin(2*Math.PI*t/HOULE_T - x*HOULE_K) + 0.22*Math.sin(2*Math.PI*t/2.9 + 1.7 - x*0.0023);

const decorSpr = {};
for (const k in A.decorSprites){ const d = A.decorSprites[k]; decorSpr[k] = {...d, img:loadImg(d.src)}; }
const decorKind = k => k.startsWith('gorgone') ? 'gorgone' : (k.startsWith('anemone') ? 'anemone' : 'rigide');
// Géométrie des anémones en fractions du sprite : centre du disque oral, colonne (pied) qui reste
// immobile [v, u gauche, u droite], et pour l'une d'elles la limace de mer posée sur les tentacules.
const ANEMONE_GEO = {
  anemone_blanche:          {cx:0.495, cy:0.46, body:[[0.47,0.30,0.70],[1.0,0.26,0.73]]},
  anemone_rose_nudibranche: {cx:0.500, cy:0.55, body:[[0.58,0.27,0.80],[1.0,0.25,0.80]], slug:{cx:0.556, cy:0.165, rx:0.33, ry:0.15}}
};
const decor = A.decorItems.map((d,i) => {
  const sp = decorSpr[d.key], s = d.h / sp.by, flip = d.flip ? -1 : 1;
  const bx = flip < 0 ? sp.w - sp.bx : sp.bx;
  return {...d, kind:decorKind(d.key), s, flip, w:sp.w*s, hh:sp.h*s, left:d.x - bx*s, top:d.y - sp.by*s,
          ph:i*1.37 + 0.4, souple: d.h > 380 ? 0.028 : 0.036, cache:null, cacheSc:0, warp:null};
});

// Sprite mis à l'échelle de l'écran une fois (et à chaque changement de taille de la fenêtre).
function decorCanvas(d, sc){
  if (d.cache && d.cacheSc === sc) return d.cache;
  const sp = decorSpr[d.key]; if (!sp.img.complete || !sp.img.naturalWidth) return null;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(d.w*sc)); c.height = Math.max(1, Math.round(d.hh*sc));
  const g = c.getContext('2d');
  if (d.flip < 0){ g.translate(c.width, 0); g.scale(-1, 1); }
  g.drawImage(sp.img, 0, 0, c.width, c.height);
  d.cache = c; d.cacheSc = sc; d.warp = null;
  return c;
}

// Gorgone : éventail souple fixé par un pied rigide. Il plie d'un bloc dans la houle (flexion
// croissante vers la cime, avec retard) et les extrémités frémissent.
// Rendu : chaque ligne de pixels est décalée horizontalement, une seule fois et à hauteur entière
// (aucun recouvrement, aucun rééchantillonnage vertical : pas de bandes qui scintillent). Le
// résultat est gardé dans un canvas et recalculé 30 fois par seconde.
function drawGorgone(d, t, sc){
  const c = decorCanvas(d, sc); if (!c) return;
  const Hc = c.height, Wc = c.width, A1 = d.souple*Hc, A2 = 0.006*Hc;
  if (!d.gw || d.gwSc !== sc){
    d.gpad = Math.ceil(1.2*(A1 + A2)) + 2;
    d.gw = document.createElement('canvas'); d.gw.width = Wc + 2*d.gpad; d.gw.height = Hc;
    d.gg = d.gw.getContext('2d'); d.gwSc = sc; d.gT = -1;
  }
  // une seule gorgone recalculée par image (la charge reste régulière)
  if (d.gT < 0 || (t - d.gT > 1/30 && (!gorgoneBusy || t - d.gT > 1/12))){
    gorgoneBusy = true;
    const g = d.gg, pad = d.gpad;
    g.clearRect(0, 0, d.gw.width, Hc);
    for (let r = 0; r < Hc; r++){
      const hb = 1 - (r + 0.5)/Hc;                     // 0 au pied, 1 à la cime
      const dx = A1*Math.pow(hb, 1.7)*houle(t - 0.5*hb, d.x) + A2*hb*hb*hb*Math.sin(t*2.9 + d.ph + hb*5.0);
      g.drawImage(c, 0, r, Wc, 1, pad + dx, r, Wc, 1);
    }
    d.gT = t;
  }
  ctx.drawImage(d.gw, Math.round((d.left - camX)*sc) - d.gpad, Math.round(d.top*sc));
}

// Anémone : la colonne reste plantée ; les tentacules suivent la houle (les pointes davantage et
// en retard), ondulent chacun à leur rythme (onde qui tourne autour du disque) et la couronne
// « respire » lentement. Déformation calculée pixel par pixel sur un petit sprite, 30 fois par seconde.
function anemoneSetup(d, sc){
  const sp = decorSpr[d.key], geo = ANEMONE_GEO[d.key]; if (!sp.img.complete || !sp.img.naturalWidth) return null;
  const w = Math.max(8, Math.round(d.w*sc)), h = Math.max(8, Math.round(d.hh*sc));
  const pad = Math.ceil(0.09*Math.max(w, h)), W2 = w + 2*pad, H2 = h + 2*pad, n = W2*H2;
  const src = document.createElement('canvas'); src.width = W2; src.height = H2;
  const g = src.getContext('2d', {willReadFrequently:true});
  if (d.flip < 0){ g.translate(W2, 0); g.scale(-1, 1); }
  g.drawImage(sp.img, pad, pad, w, h);
  const px = g.getImageData(0, 0, W2, H2).data;
  const pm = new Float32Array(n*4);                        // couleurs prémultipliées (bords propres)
  for (let i = 0; i < n; i++){ const o = i*4, a = px[o+3]/255; pm[o] = px[o]*a; pm[o+1] = px[o+1]*a; pm[o+2] = px[o+2]*a; pm[o+3] = px[o+3]; }
  const U = x => (d.flip < 0 ? W2 - x : x) - pad;          // abscisse dans le sprite d'origine (px)
  const cx = pad + (d.flip < 0 ? 1 - geo.cx : geo.cx)*w, cy = pad + geo.cy*h, R = 0.5*w;
  const f = () => new Float32Array(n);
  const sx1 = f(), sx2 = f(), t1c = f(), t1s = f(), t2c = f(), t2s = f(), sphi = f(), cphi = f(), aR = f(), moving = new Uint8Array(n);
  const rowBend = new Float32Array(H2);
  const [b0, b1] = geo.body;
  for (let y = 0; y < H2; y++){
    const v = (y - pad)/h;
    rowBend[y] = 0.012*h*Math.pow(clamp(1 - v, 0, 1), 2);
    for (let x = 0; x < W2; x++){
      const i = y*W2 + x, ddx = x - cx, ddy = y - cy;
      const r = Math.hypot(ddx, ddy)/R, phi = Math.atan2(ddy, ddx), u = U(x)/w;
      let wt = smooth(0.10, 0.80, r);
      if (v > b0[0] - 0.04){
        const k = clamp((v - b0[0])/(b1[0] - b0[0]), 0, 1);
        const ul = b0[1] + (b1[1] - b0[1])*k, ur = b0[2] + (b1[2] - b0[2])*k;
        const inside = smooth(ul - 0.025, ul + 0.02, u) * (1 - smooth(ur - 0.02, ur + 0.025, u)) * smooth(b0[0] - 0.04, b0[0] + 0.04, v);
        wt *= 1 - inside;
      }
      if (geo.slug){
        const e = ((u - geo.slug.cx)/geo.slug.rx)**2 + ((v - geo.slug.cy)/geo.slug.ry)**2;
        wt *= smooth(1.0, 1.7, e);
      }
      if (wt < 0.004) continue;
      moving[i] = 1;
      const rr = Math.min(r, 1.3);
      const aS = wt*(0.45 + 0.55*rr)*0.045*h, lag = 0.9*rr;
      sx1[i] = aS*Math.cos(lag); sx2[i] = aS*Math.sin(lag);
      const aT = wt*0.024*h*rr, p1 = 6*phi + 5*r, p2 = -9*phi + 3*r + 1.3;
      t1c[i] = aT*Math.cos(p1); t1s[i] = aT*Math.sin(p1); t2c[i] = 0.5*aT*Math.cos(p2); t2s[i] = 0.5*aT*Math.sin(p2);
      sphi[i] = Math.sin(phi); cphi[i] = Math.cos(phi); aR[i] = wt*0.02*h*rr;
    }
  }
  // seuls les pixels proches d'une partie visible peuvent changer : on ne calcule qu'eux
  const reach = Math.ceil(0.075*h) + 1, near = new Uint8Array(n), tmp = new Uint8Array(n);
  for (let y = 0; y < H2; y++){ let last = -1e9; for (let x = 0; x < W2; x++){ if (px[(y*W2+x)*4+3]) last = x; tmp[y*W2+x] = x - last <= reach; } last = 1e9; for (let x = W2-1; x >= 0; x--){ if (px[(y*W2+x)*4+3]) last = x; if (last - x <= reach) tmp[y*W2+x] = 1; } }
  for (let x = 0; x < W2; x++){ let last = -1e9; for (let y = 0; y < H2; y++){ if (tmp[y*W2+x]) last = y; near[y*W2+x] = y - last <= reach; } last = 1e9; for (let y = H2-1; y >= 0; y--){ if (tmp[y*W2+x]) last = y; if (last - y <= reach) near[y*W2+x] = 1; } }
  let cnt = 0; for (let i = 0; i < n; i++) if (near[i]) cnt++;
  const idx = new Uint32Array(cnt); cnt = 0; for (let i = 0; i < n; i++) if (near[i]) idx[cnt++] = i;
  const out = document.createElement('canvas'); out.width = W2; out.height = H2;
  const og = out.getContext('2d'), img = og.createImageData(W2, H2);
  return {W2, H2, pad, pm, sx1, sx2, t1c, t1s, t2c, t2s, sphi, cphi, aR, moving, rowBend, idx, out, og, img, lastT:-1};
}
function anemoneWarp(d, t){
  const q = d.warp, {W2, pm, sx1, sx2, t1c, t1s, t2c, t2s, sphi, cphi, aR, moving, rowBend, idx} = q, od = q.img.data;
  const O = 2*Math.PI/HOULE_T, sO = Math.sin(O*t - d.x*HOULE_K), cO = Math.cos(O*t - d.x*HOULE_K);
  const S0 = houle(t, d.x);
  const w1 = 2*Math.PI/3.4, w2 = -2*Math.PI/5.3, sb = Math.sin(2*Math.PI*t/8.5 + d.ph);
  const s1 = Math.sin(w1*t + d.ph), c1 = Math.cos(w1*t + d.ph), s2 = Math.sin(w2*t), c2 = Math.cos(w2*t);
  const H2 = q.H2;
  for (let j = 0; j < idx.length; j++){
    const i = idx[j], y = (i / W2) | 0, x = i - y*W2;
    let dx = rowBend[y]*S0, dy = 0;
    if (moving[i]){
      const T = t1c[i]*s1 + t1s[i]*c1 + t2c[i]*s2 + t2s[i]*c2, Rr = aR[i]*sb;
      dx += sx1[i]*sO - sx2[i]*cO - sphi[i]*T + cphi[i]*Rr;
      dy += cphi[i]*T + sphi[i]*Rr;
    }
    // échantillonnage bilinéaire à l'envers (où était ce pixel avant le déplacement)
    const fx = x - dx, fy = y - dy, o = i*4;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), ax = fx - x0, ay = fy - y0;
    if (x0 < 0 || y0 < 0 || x0 >= W2 - 1 || y0 >= H2 - 1){ od[o+3] = 0; continue; }
    const p = (y0*W2 + x0)*4, p2 = p + W2*4;
    const w00 = (1-ax)*(1-ay), w10 = ax*(1-ay), w01 = (1-ax)*ay, w11 = ax*ay;
    const a = pm[p+3]*w00 + pm[p+7]*w10 + pm[p2+3]*w01 + pm[p2+7]*w11;
    if (a < 0.5){ od[o+3] = 0; continue; }
    const k = 255/a;
    od[o]   = (pm[p]  *w00 + pm[p+4]*w10 + pm[p2]  *w01 + pm[p2+4]*w11)*k;
    od[o+1] = (pm[p+1]*w00 + pm[p+5]*w10 + pm[p2+1]*w01 + pm[p2+5]*w11)*k;
    od[o+2] = (pm[p+2]*w00 + pm[p+6]*w10 + pm[p2+2]*w01 + pm[p2+6]*w11)*k;
    od[o+3] = a;
  }
  q.og.putImageData(q.img, 0, 0);
}
function drawAnemone(d, t, sc){
  if (!d.warp || d.cacheSc !== sc){ d.warp = anemoneSetup(d, sc); d.cacheSc = sc; if (!d.warp) return; }
  const q = d.warp;
  // 25 images/s suffisent à ce mouvement lent ; une seule anémone recalculée par image pour lisser la charge
  const late = t - q.lastT;
  if (q.lastT < 0 || (late > 1/25 && (!anemoneBusy || late > 1/10))){ anemoneWarp(d, t); q.lastT = t; anemoneBusy = true; }
  ctx.drawImage(q.out, Math.round((d.left - camX)*sc) - q.pad, Math.round(d.top*sc) - q.pad);
}
let anemoneBusy = false, gorgoneBusy = false;
function drawDecor(layer, t, sc, camX, viewW){
  if (layer === 'back'){ anemoneBusy = false; gorgoneBusy = false; }
  for (const d of decor){
    if (d.layer !== layer) continue;
    if (d.left + d.w < camX - 60 || d.left > camX + viewW + 60) continue;
    if (d.kind === 'gorgone') drawGorgone(d, t, sc);
    else if (d.kind === 'anemone') drawAnemone(d, t, sc);
    else { const c = decorCanvas(d, sc); if (c) ctx.drawImage(c, Math.round((d.left - camX)*sc), Math.round(d.top*sc)); }   // les coraux durs ne bougent pas
  }
}

// ---------- grande faune du large : silhouettes lointaines ----------
// Échelle commune : une longueur réelle en mètres donne une longueur à l'écran, puis l'éloignement
// (0,55 à 1) réduit la taille, la netteté, l'opacité et la vitesse apparente de la même façon pour
// tous. Les proportions entre espèces restent donc justes : une baleine bleue (23 m) fait près de dix
// fois un dauphin (2,4 m). Les vitesses sont réelles mais ralenties (animaux lointains, ambiance
// calme) ; la fréquence de battement en découle (distance parcourue par battement propre à chaque nage).
const PX_M = 80, PX_S = 36;
const LARGE = {x0:5500, x1:8800};
const ESPECES = {
  baleine:        {sprites:['baleine'],  m:23,  nage:'cetace',   foulee:0.40, amp:0.028, vit:[1.3,2.0], y:[480,1020], tangage:0.10, plongee:0.35, groupe:[1,1], poids:0.30, vie:[45,65]},
  orque:          {sprites:['orque'],    m:7.5, nage:'cetace',   foulee:0.60, amp:0.034, vit:[1.8,3.0], y:[330,880],  tangage:0.20, plongee:0.45, groupe:[1,3], poids:0.75, vie:[26,40]},
  dauphins:       {sprites:['dauphin1','dauphin2','dauphin3','dauphin4'], m:2.4, nage:'cetace', foulee:0.80, amp:0.032, vit:[3.0,4.4], y:[260,620], tangage:0.18, plongee:0.50, groupe:[3,6], poids:1.20, vie:[18,30]},
  requin_blanc:   {sprites:['requin_blanc'],   m:5.0, nage:'requin', foulee:0.60, amp:0.22, vit:[1.0,1.8], y:[450,1080], tangage:0.16, plongee:0.40, groupe:[1,1], poids:0.85, vie:[26,40]},
  requin_marteau: {sprites:['requin_marteau'], m:4.2, nage:'requin', foulee:0.60, amp:0.24, vit:[1.0,1.7], y:[420,1040], tangage:0.16, plongee:0.40, groupe:[1,5], poids:0.80, vie:[26,40]},
  requins_gris:   {sprites:['requin_gris'],    m:1.9, nage:'requin', foulee:0.60, amp:0.22, vit:[1.0,1.6], y:[500,1120], tangage:0.20, plongee:0.45, groupe:[3,5], poids:1.00, vie:[22,34]},
  marlin:         {sprites:['marlin'],   m:3.6, nage:'thon',     foulee:0.80, amp:0.12, vit:[2.0,3.2], y:[300,760],  tangage:0.18, plongee:0.50, groupe:[1,1], poids:0.80, vie:[16,26], sprint:true},
  anguille:       {sprites:['anguille'], m:1.8, nage:'anguille', foulee:0.45, amp:0.028, vit:[0.35,0.7], y:[950,1300], tangage:0.30, plongee:0.50, groupe:[1,1], poids:0.55, vie:[26,38]}
};
// Peuplement : cinq présences visées (quatre au minimum), jamais deux fois la même espèce.
// La baleine est la plus rare au tirage, mais elle revient au plus tard 100 s après être partie.
const FAUNE_CIBLE = 5, FAUNE_MIN = 4, BALEINE_MAX = 100;
const largeSpr = {};
for (const k in A.largeSprites){ const s = A.largeSprites[k]; largeSpr[k] = {img:loadImg(s.src), w:s.w, h:s.h, tex:null}; }
const FILTER_OK = 'filter' in CanvasRenderingContext2D.prototype;
// Une texture adoucie par silhouette (flou fait une fois au chargement) : à l'écran le flou suit la
// taille, donc un animal qui s'approche devient à la fois plus grand et plus net, sans saut.
function faunaTex(key){
  const sp = largeSpr[key]; if (sp.tex) return sp.tex;
  if (!sp.img.complete || !sp.img.naturalWidth) return null;
  const sig = 0.009*sp.w, pad = Math.ceil(3*sig) + 2, c = document.createElement('canvas');
  c.width = sp.w + 2*pad; c.height = sp.h + 2*pad;
  const g = c.getContext('2d'); if (FILTER_OK) g.filter = `blur(${sig.toFixed(1)}px)`;
  g.drawImage(sp.img, pad, pad);
  return sp.tex = {c, pad, bw:sp.w};
}
const faune = [];
let depuisBaleine = 40;
const depthFade = y => 1 - smooth(1050, 1550, y);                                   // plonge : se perd dans le bleu sombre
const edgeFade = x => smooth(LARGE.x0, LARGE.x0 + 650, x) * (1 - smooth(LARGE.x1 - 650, LARGE.x1, x));
function nouvelleFaune(first, force){
  const present = new Set(faune.map(e => e.k));
  const libres = Object.keys(ESPECES).filter(k => !present.has(k));
  if (!libres.length && !force) return;
  let k = force;
  if (!k) k = (depuisBaleine > BALEINE_MAX && libres.includes('baleine')) ? 'baleine'
            : pickWeighted(libres.map(k => ({k, poids:ESPECES[k].poids}))).k;
  if (k === 'baleine') depuisBaleine = 0;
  const cfg = ESPECES[k];
  // éloignement : une partie des animaux s'approche (ils grossissent), quelques-uns s'éloignent
  const d0 = R(0.55, 0.9), u = rnd();
  const d1 = u < 0.5 ? Math.min(1, d0 + R(0.12, 0.25)) : (u < 0.7 ? Math.max(0.5, d0 - R(0.08, 0.15)) : d0);
  const e = {k, cfg, d0, d1, d:d0, dir: rnd() < 0.5 ? -1 : 1, members:[], age:0, life:R(cfg.vie[0], cfg.vie[1]),
             vm:R(cfg.vit[0], cfg.vit[1])*PX_S, v:0, vy:0, ph:R(0, 100), yT:R(cfg.y[0], cfg.y[1]), tyT:R(6, 14),
             entree:'brume', fin:null, finAge:0, boost:1, sprintT:0, gone:false, fIn:0, fOut:1};
  e.v = e.vm*e.d;
  const Lm = cfg.m*PX_M;                                  // longueur à l'éloignement 1
  const mode = first ? 'brume' : pick(['brume', 'brume', 'remonte', 'bord']);
  e.entree = mode;
  if (mode === 'remonte'){ e.x = R(6200, 8000); e.y = 1720 + 0.3*Lm*e.d; }        // monte des profondeurs
  else if (mode === 'bord'){                                                     // sort de l'obscurité des abysses ou de la brume côté récif
    e.x = e.dir < 0 ? LARGE.x1 + 2.0*Lm*e.d : LARGE.x0 - 2.0*Lm*e.d; e.y = e.yT;
  } else { e.x = R(6150, 8150); e.y = e.yT; }
  if (first){ e.age = R(3, e.life*0.4); }
  // composition du groupe (décalages exprimés à l'éloignement 1)
  let n = Math.round(R(cfg.groupe[0], cfg.groupe[1] + 0.49));
  if (k === 'requin_marteau' && rnd() < 0.55) n = 1;                            // souvent seul, parfois en banc
  const spread = k === 'dauphins' ? [1.5, 0.5] : [1.6, 0.6];
  for (let i = 0; i < n; i++){
    let ox = 0, oy = 0, ok = i === 0, tries = 0;
    while (!ok && tries++ < 60){
      ox = R(-spread[0], spread[0])*Lm; oy = R(-spread[1], spread[1])*Lm;
      ok = e.members.every(m => Math.hypot(m.ox - ox, (m.oy - oy)/0.45) > 0.95*Lm);
    }
    e.members.push(membre(e, cfg.sprites[i % cfg.sprites.length], Lm*R(0.9, 1.08), ox, oy));
  }
  if (k === 'baleine' && rnd() < 0.4) e.members.push(membre(e, 'baleine', Lm*0.32, 0.12*Lm, -0.21*Lm, true));   // baleineau contre sa mère
  faune.push(e);
}
function membre(e, key, Lm, ox, oy, calf){
  const m = {key, Lm, L:Lm*e.d, ox, oy, wph:R(0, 50), calf:!!calf,
          dyT:R(9, 16), dyPh:R(0, 2*Math.PI), dyA:0,
          x:0, y:0, pitch:0, phase:R(0, 2*Math.PI)};
  // dérive propre à chacun, assez faible pour que la pente reste celle d'une nage tranquille
  m.dyA = Math.min(R(0.04, 0.09)*Lm, 0.5*e.vm*Math.tan(e.cfg.tangage)*m.dyT/(2*Math.PI));
  return m;
}
let fauneT = 2;
nouvelleFaune(true); nouvelleFaune(true); nouvelleFaune(true);
function stepFaune(dt, t){
  depuisBaleine = faune.some(e => e.k === 'baleine') ? 0 : depuisBaleine + dt;
  for (const e of faune){
    const cfg = e.cfg;
    e.age += dt;
    // l'éloignement évolue doucement pendant toute la présence de l'animal
    e.d = e.d0 + (e.d1 - e.d0)*smooth(0, e.life + 8, e.age);
    let v = e.vm*e.d*(0.88 + 0.24*(0.5 + 0.5*noise(t*0.11 + e.ph)));
    if (cfg.sprint){                                                             // le marlin accélère par à-coups
      e.sprintT -= dt;
      if (e.sprintT < -4 && rnd() < dt*0.12) e.sprintT = R(1.2, 2.0);
      e.boost += ((e.sprintT > 0 ? 2.0 : 1) - e.boost)*(1 - Math.exp(-2.2*dt));
      v *= e.boost;
    }
    if (e.fin === 'plonge') v *= 1.12;
    e.v += (v - e.v)*(1 - Math.exp(-1.5*dt));
    e.x += e.dir*e.v*dt;
    if (!e.fin && e.age > e.life){ e.fin = rnd() < 0.55 ? 'plonge' : 'brume'; e.finAge = 0; }
    if (e.fin){
      e.finAge += dt;
      if (e.fin === 'plonge'){ e.yT = 1950; if (e.finAge > 30){ e.fin = 'brume'; e.finAge = 0; } }   // plongée trop longue : il se perd dans le bleu
    }
    else if ((e.tyT -= dt) < 0){ e.yT = R(cfg.y[0], cfg.y[1]); e.tyT = R(8, 18); }
    // remontée depuis le fond ou plongée : pente plus forte qu'en croisière
    const monte = e.entree === 'remonte' && e.y > cfg.y[1] + 40;
    const pente = (e.fin === 'plonge' || monte) ? cfg.plongee : cfg.tangage;
    const maxVy = e.v*Math.tan(pente);
    const want = clamp((e.yT - e.y)*0.22, -maxVy, maxVy);
    e.vy += (want - e.vy)*(1 - Math.exp(-0.7*dt));
    e.y += e.vy*dt;
    e.fIn = smooth(0, e.entree === 'brume' ? 5 : 2, e.age);
    e.fOut = e.fin === 'brume' ? 1 - smooth(0, 5, e.finAge) : 1;
    const Ld = cfg.m*PX_M*e.d;
    const beyond = e.dir > 0 ? e.x - 2.2*Ld > LARGE.x1 : e.x + 2.2*Ld < LARGE.x0;
    if (e.fOut <= 0 || (e.fin === 'plonge' && e.y > 1620) || beyond) e.gone = true;
    for (const m of e.members){
      m.L = m.Lm*e.d;
      // place dans le groupe : la formation respire, chacun dérive lentement en profondeur
      // (pas d'ondulation de saut : sous l'eau, le corps reste dans l'axe de la nage)
      const lx = m.ox + 0.06*m.Lm*Math.sin(t*0.13 + m.wph);
      const w = 2*Math.PI/m.dyT, py = m.dyA*Math.sin(w*t + m.dyPh), pvy = m.dyA*w*Math.cos(w*t + m.dyPh);
      m.x = e.x + e.dir*lx*e.d; m.y = e.y + (m.oy + py)*e.d;
      const target = clamp(Math.atan2(e.vy + pvy*e.d, Math.max(e.v, 1)), -cfg.plongee, cfg.plongee);
      m.pitch += (target - m.pitch)*(1 - Math.exp(-1.5*dt));
      // battement : la queue avance d'une « foulée » de corps par cycle
      m.phase += 2*Math.PI*e.v/(cfg.foulee*m.L)*dt*(m.calf ? 1.5 : 1);
    }
  }
  for (let i = faune.length - 1; i >= 0; i--) if (faune[i].gone) faune.splice(i, 1);
  fauneT -= dt;
  if (faune.length < FAUNE_MIN && fauneT > 2.5) fauneT = R(0.5, 2.5);
  if (fauneT < 0){ if (faune.length < FAUNE_CIBLE) nouvelleFaune(false); fauneT = R(3, 8); }
}
// Déformation par bandes le long du corps, sur un canvas de travail opaque, puis une seule pose
// avec l'opacité voulue (pas de raccords visibles entre bandes).
const scr = document.createElement('canvas'), sg = scr.getContext('2d');
function silhouette(tex, L, nage, amp, phase, sc){
  const N = clamp(Math.round(L*sc/(nage === 'anguille' ? 6 : 9)), 14, 64);
  const k = L/tex.bw*sc, Wt = tex.c.width*k, Ht = tex.c.height*k, marge = Math.ceil(0.08*L*sc) + 2;
  const needW = Math.ceil(Wt) + 4, needH = Math.ceil(Ht + 2*marge);
  if (scr.width < needW || scr.height < needH){ scr.width = Math.max(scr.width, needW); scr.height = Math.max(scr.height, needH); }
  sg.setTransform(1,0,0,1,0,0); sg.clearRect(0, 0, needW, needH);
  const sw = tex.c.width/N;
  let right = needW - 2;                                                         // la tête (à droite) reste en place
  for (let i = N - 1; i >= 0; i--){
    const sx = i*sw, xc = sx + sw*0.5;
    const u = clamp(1 - (xc - tex.pad)/tex.bw, 0, 1);                             // 0 = museau, 1 = bout de la queue
    let f = 1, dy = 0;
    if (nage === 'cetace'){
      // nageoire caudale horizontale : le battement se voit de haut en bas, amplifié vers la queue
      const env = Math.pow(smooth(0.3, 1, u), 1.6);
      dy = amp*L*(env*Math.sin(phase - 1.6*u) - 0.15*(1 - u)*(1 - u)*Math.sin(phase));
    } else if (nage === 'requin' || nage === 'thon'){
      // nageoire caudale verticale : de profil, la queue balaie vers nous puis au loin, elle se raccourcit
      const env = Math.pow(smooth(0.5, 1, u), 1.3);
      f = 1 - amp*env*(0.5 - 0.5*Math.cos(2*phase));
      dy = 0.01*L*env*Math.sin(phase);
    } else {
      // anguille : l'onde parcourt tout le corps
      dy = amp*L*(0.25 + 0.75*u)*Math.sin(phase - 2*Math.PI*0.9*u);
    }
    const dw = Wt/N*f;
    sg.drawImage(tex.c, sx, 0, sw + 0.6, tex.c.height, right - dw, marge + dy*sc, dw + 0.9, Ht);
    right -= dw;
  }
  return {w:needW, h:needH, cx:needW - 2 - Wt/2, cy:marge + Ht/2};
}
function drawFaune(t, sc, camX, viewW){
  if (camX + viewW < LARGE.x0 - 1200 || camX > LARGE.x1 + 200) return;
  const list = [];
  for (const e of faune) for (const m of e.members) list.push([e, m]);
  list.sort((a, b) => a[0].d - b[0].d);                                           // les plus lointains d'abord
  for (const [e, m] of list){
    const half = m.L*0.6;
    if (m.x + half < camX - 50 || m.x - half > camX + viewW + 50) continue;
    const alpha = clamp(0.20 + 0.20*(e.d - 0.55)/0.45, 0.18, 0.40) * e.fIn * e.fOut * depthFade(m.y) * edgeFade(m.x);
    if (alpha < 0.01) continue;
    const tex = faunaTex(m.key); if (!tex) continue;
    const box = silhouette(tex, m.L, e.cfg.nage, e.cfg.amp*(m.calf ? 1.2 : 1), m.phase, sc);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate((m.x - camX)*sc, m.y*sc);
    ctx.scale(e.dir, 1);
    ctx.rotate(m.pitch);
    ctx.drawImage(scr, 0, 0, box.w, box.h, -box.cx, -box.cy, box.w, box.h);
    ctx.restore();
  }
}

// ---------- faisceaux de lumière ----------
function makeShaft(){
  const w = 96, h = 512, c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'), im = g.createImageData(w, h);
  const n = 3 + Math.floor(rnd()*4), comps = [];
  for (let i = 0; i < n; i++) comps.push({c:R(0.2,0.8), s:R(0.03,0.13), a:R(0.4,1)});
  const prof = new Float32Array(w); let mx = 0;
  for (let x = 0; x < w; x++){ const u = x/(w-1); let v = 0; for (const k of comps) v += k.a*Math.exp(-((u-k.c)**2)/(2*k.s*k.s)); prof[x] = v; mx = Math.max(mx, v); }
  const ph = R(0,10);
  for (let y = 0; y < h; y++){
    const v = y/(h-1);
    const vert = smooth(0, 0.06, v) * Math.pow(1-v, 1.6) * (0.85 + 0.15*Math.sin(v*23 + ph));
    for (let x = 0; x < w; x++){
      const a = prof[x]/mx * vert, o = (y*w + x)*4;
      im.data[o] = 255; im.data[o+1] = 250; im.data[o+2] = 226; im.data[o+3] = Math.round(a*255);
    }
  }
  g.putImageData(im, 0, 0); return c;
}
const shafts = Array.from({length:6}, makeShaft);
const rays = [];
for (let x = -500; x < 8400; x += R(55, 130)){
  rays.push({x, tex:Math.floor(rnd()*shafts.length), w:R(70,240), len:R(850,1550), a:R(0.10,0.21),
             ang:0.24 + R(-0.035,0.035), sw:R(0.012,0.03), drift:R(15,45), sp:R(0.05,0.12), fl:R(0.12,0.3), ph:R(0,20)});
}
const lightAt = x => x < 2600 ? 1 : (x < 5900 ? 0.85 : 0.55*(1 - smooth(7300, 8300, x)));
function drawRays(t, sc, camX, viewW){
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const r of rays){
    const I = lightAt(r.x + r.len*0.12); if (I <= 0.01) continue;
    const reach = r.len*Math.sin(r.ang) + r.w + r.drift;
    if (r.x + reach < camX || r.x - r.w - r.drift > camX + viewW) continue;
    // plages de lumière qui voyagent le long de la surface + respiration propre à chaque faisceau
    const band = 0.3 + 0.95*(0.5 + 0.5*noise(r.x*0.0011 + t*0.07));
    const breath = 0.35 + 0.65*(0.5 + 0.5*noise(t*r.fl + r.ph));
    ctx.globalAlpha = clamp(r.a * I * band * breath, 0, 1);
    const x0 = r.x + r.drift*noise(t*r.sp*0.8 + r.ph*1.7);
    ctx.save();
    ctx.translate((x0 - camX)*sc, 0);
    ctx.rotate(-(r.ang + r.sw*noise(t*r.sp + r.ph)));
    ctx.drawImage(shafts[r.tex], -r.w*sc/2, -20*sc, r.w*sc, r.len*sc);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- fond en WebGL : la surface ondule ----------
let gl = null, prog = null, buf = null, U = {};
try {
  gl = glc.getContext('webgl', {premultipliedAlpha:false, antialias:false});
  const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
  const fs = `precision highp float;
    uniform sampler2D tex; uniform vec2 res; uniform float camX, sc, tileX, tileW, H, t;
    void main(){
      float sy = res.y - gl_FragCoord.y;
      float wx = camX + gl_FragCoord.x/sc, wy = sy/sc;
      float amp = (1.0 - smoothstep(170.0, 430.0, wy)) * (1.0 - smoothstep(8100.0, 8700.0, wx));
      float dx = amp*(7.0*sin(wx*0.010 + wy*0.034 + t*1.15) + 3.5*sin(wx*0.023 - wy*0.05 - t*0.8));
      float dy = amp*(4.5*sin(wx*0.016 + wy*0.02 + t*0.9) + 2.0*sin(wx*0.031 - t*1.35));
      float sx = max(wx + dx, 6.0);
      vec2 uv = vec2((sx - tileX)/tileW, (wy + dy)/H);
      vec4 c = texture2D(tex, clamp(uv, vec2(0.0), vec2(1.0)));
      gl_FragColor = vec4(c.rgb, 1.0);
    }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; };
  prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw 'link';
  gl.useProgram(prog);
  buf = gl.createBuffer();
  for (const n of ['tex','res','camX','sc','tileX','tileW','H','t']) U[n] = gl.getUniformLocation(prog, n);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
} catch(e){ gl = null; }
function tileTex(tl){
  if (tl.tex || !tl.img.complete) return tl.tex;
  const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tl.img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tl.tex = tx;
}
function drawBackground(t){
  if (!gl){ // secours sans WebGL : fond fixe
    for (const tl of tiles){
      if (tl.x + tl.w < camX || tl.x > camX + viewW || !tl.img.complete) continue;
      ctx.drawImage(tl.img, Math.floor((tl.x - camX)*sc), 0, Math.ceil(tl.w*sc) + 1, cv.height);
    }
    return;
  }
  gl.viewport(0, 0, glc.width, glc.height);
  gl.clearColor(0.06, 0.11, 0.23, 1); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(U.res, glc.width, glc.height); gl.uniform1f(U.camX, camX); gl.uniform1f(U.sc, sc);
  gl.uniform1f(U.H, H); gl.uniform1f(U.t, t); gl.uniform1i(U.tex, 0);
  for (const tl of tiles){
    if (tl.x + tl.w < camX || tl.x > camX + viewW) continue;
    const tx = tileTex(tl); if (!tx) continue;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.uniform1f(U.tileX, tl.x); gl.uniform1f(U.tileW, tl.w);
    const x0 = ((tl.x - camX)*sc)/glc.width*2 - 1, x1 = ((tl.x + tl.w - camX)*sc)/glc.width*2 - 1;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x0,-1, x1,-1, x0,1, x0,1, x1,-1, x1,1]), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

// ---------- particules lumineuses des abysses ----------
// Points discrets : ils dérivent très lentement, apparaissent, s'estompent puis renaissent ailleurs.
const ABYSS_SPEED = 1.3;
const abyssParticles = [];
function resetAbyssParticle(p, first=false){
  p.x = R(8460, W-90); p.y = R(410, 1190);
  p.vx = R(-2.4, 2.4); p.vy = R(-1.4, 0.8);
  p.r = R(0.9, 2.5); p.maxA = R(0.18, 0.55);
  p.life = R(5.5, 13.5); p.age = first ? R(0, p.life) : 0;
  p.ph = R(0, Math.PI*2); p.tw = R(0.45, 1.1);
}
for (let i=0;i<72;i++){ const p={}; resetAbyssParticle(p,true); abyssParticles.push(p); }
function stepAbyssParticles(dt){
  for (const p of abyssParticles){
    p.age += dt*ABYSS_SPEED; p.x += p.vx*dt*ABYSS_SPEED; p.y += p.vy*dt*ABYSS_SPEED;
    if (p.age >= p.life || p.x < 8400 || p.x > W || p.y < 330 || p.y > 1260) resetAbyssParticle(p);
  }
}
function drawAbyssParticles(t, sc, camX, viewW){
  if (camX + viewW < 8350) return;
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (const p of abyssParticles){
    if (p.x < camX-20 || p.x > camX+viewW+20) continue;
    const u = p.age/p.life;
    // apparition douce, présence irrégulière, extinction plus longue
    const env = smooth(0,0.18,u) * (1-smooth(0.55,1,u));
    if (env <= 0.01) continue;
    const pulse = 0.82 + 0.18*Math.sin(t*p.tw + p.ph);
    const a = p.maxA*env*pulse, x=(p.x-camX)*sc, y=p.y*sc, r=p.r*sc;
    ctx.fillStyle = `rgba(105,214,232,${(a*0.16).toFixed(3)})`;
    ctx.beginPath(); ctx.arc(x,y,r*3.0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = `rgba(155,236,245,${a.toFixed(3)})`;
    ctx.beginPath(); ctx.arc(x,y,Math.max(0.65,r),0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// ---------- cheminées hydrothermales et fumerolles des abysses ----------
// Les cheminées sont dessinées en code, une fois, dans un canvas mis en cache (main « BD au marqueur » :
// aplat, une ombre nette, contour d'encre, coulées claires sous les bouches), dans des tons assombris
// pour rester dans la nuit des abysses. Le massif recouvre les anciens petits « volcans » du panorama.
// La fumée, elle, est dessinée en direct : voir drawFumeroles.
const prng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const hash1 = n => { const s = Math.sin(n*127.1 + 311.7)*43758.5453; return s - Math.floor(s); };
const CH = {x0:10250, y0:690, x1:W, y1:1380};
const CH_INK = '#050c18';
const mixRGB = (a, b, k) => `rgb(${a.map((v,i) => Math.round(v + (b[i]-v)*k)).join(',')})`;
// de l'arrière vers l'avant ; smoke = hauteur du panache (0 : cheminée éteinte)
const SPIRES = [
  {x:10400, by:1262, h:170, bw:50, tw:10, lean:0.10,  tone:0.20, smoke:0,   seed:2},
  {x:10458, by:1262, h:290, bw:80, tw:17, lean:-0.05, tone:0.30, smoke:300, seed:3},
  {x:10822, by:1266, h:255, bw:58, tw:12, lean:0.07,  tone:0.25, smoke:0,   seed:11},
  {x:10562, by:1255, h:390, bw:76, tw:17, lean:0.04,  tone:0.40, smoke:0,   seed:5},
  {x:10632, by:1258, h:480, bw:96, tw:22, lean:-0.03, tone:0.55, smoke:520, seed:8},
  {x:10768, by:1268, h:372, bw:86, tw:20, lean:0.05,  tone:0.45, smoke:400, seed:13},
  {x:10706, by:1270, h:205, bw:50, tw:11, lean:-0.08, tone:0.50, smoke:0,   seed:14},
  {socle:true},
  {x:10372, by:1306, h:128, bw:44, tw:10, lean:0.07,  tone:0.90, smoke:0,   seed:21},
  {x:10522, by:1308, h:190, bw:54, tw:13, lean:-0.05, tone:0.90, smoke:190, seed:34},
  {x:10560, by:1312, h:92,  bw:34, tw:8,  lean:0.10,  tone:1.00, smoke:0,   seed:35},
  {x:10690, by:1314, h:236, bw:62, tw:15, lean:0.04,  tone:1.00, smoke:0,   seed:55},
  {x:10852, by:1306, h:150, bw:50, tw:12, lean:-0.04, tone:0.90, smoke:0,   seed:89}
];
function pathThrough(g, pts, start){
  if (start) g.moveTo(pts[0][0], pts[0][1]); else g.lineTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) g.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0]+pts[i+1][0])/2, (pts[i][1]+pts[i+1][1])/2);
  g.lineTo(pts[pts.length-1][0], pts[pts.length-1][1]);
}
function drawSpire(g, S, lw){
  const r = prng(S.seed*7919 + 17), n = 7 + Math.round(S.h/55), L = [], Rg = [], C = [];
  let stepL = 1, stepR = 1;
  for (let i = 0; i <= n; i++){
    const t = i/n, y = S.by - S.h*t, edge = (i === 0 || i === n);
    const c = S.x + S.lean*S.h*t + (edge ? 0 : (r() - 0.5)*S.bw*0.10);
    const hw = S.tw + (S.bw - S.tw)*Math.pow(1 - t, 1.55);
    // épaulements : par endroits un bord rentre d'un coup, comme des concrétions empilées
    if (!edge && r() < 0.30) stepL = 0.72 + 0.5*r(); else stepL += (1 - stepL)*0.5;
    if (!edge && r() < 0.30) stepR = 0.72 + 0.5*r(); else stepR += (1 - stepR)*0.5;
    const jl = edge ? 1 : stepL*(1 + (r() - 0.5)*0.22), jr = edge ? 1 : stepR*(1 + (r() - 0.5)*0.22);
    L.push([c - hw*jl, y]); Rg.push([c + hw*jr, y]); C.push([c, y, hw]);
  }
  const far = [17, 38, 58], body = mixRGB(far, [34, 60, 80], 0.45 + 0.55*S.tone), shade = mixRGB(far, [14, 28, 44], 0.5 + 0.5*S.tone),
        light = mixRGB(far, [58, 100, 116], 0.45 + 0.55*S.tone), bright = mixRGB(far, [98, 150, 160], 0.4 + 0.6*S.tone);
  const outline = () => { g.beginPath(); pathThrough(g, L, true); pathThrough(g, Rg.slice().reverse(), false); g.closePath(); };
  outline(); g.fillStyle = body; g.fill();
  g.save(); outline(); g.clip();
  // ombre nette, côté droit (lumière en haut à gauche)
  const inner = C.map(([c, y, hw], i) => [c + hw*(0.22 + 0.16*Math.sin(i*1.7 + S.seed)), y]);
  g.beginPath(); pathThrough(g, inner, true); g.lineTo(Rg[n][0] + 40, Rg[n][1] - 10); g.lineTo(Rg[0][0] + 40, Rg[0][1]); g.closePath();
  g.fillStyle = shade; g.fill();
  // coulées claires sous la bouche
  const drip = (off, len, wid, col) => {
    const P = [], Q = [], m = 9;
    for (let j = 0; j <= m; j++){
      const v = j/m, t = 1 - 0.03 - len*v, i = Math.min(n - 1, Math.floor(t*n)), k = t*n - i;
      const c = C[i][0] + (C[i+1][0] - C[i][0])*k, hw = C[i][2] + (C[i+1][2] - C[i][2])*k, y = S.by - S.h*t;
      const w = hw*wid*Math.pow(Math.sin(Math.PI*Math.min(1, 0.12 + 0.88*v)), 0.7)*(1 + 0.25*Math.sin(v*9 + S.seed));
      const cx = c + hw*(off + 0.10*Math.sin(v*5 + S.seed*2));
      P.push([cx - w, y]); Q.push([cx + w, y]);
    }
    g.beginPath(); pathThrough(g, P, true); pathThrough(g, Q.reverse(), false); g.closePath(); g.fillStyle = col; g.fill();
  };
  drip(-0.26, 0.6 + 0.25*r(), 0.36, light);
  drip(0.28, 0.25 + 0.15*r(), 0.16, light);
  drip(-0.32, 0.3 + 0.15*r(), 0.15, bright);
  // cannelures : longues lignes qui descendent le long du fût
  g.strokeStyle = CH_INK; g.lineCap = 'round'; g.lineWidth = lw*0.5; g.globalAlpha = 0.75;
  for (const u of [-0.52 + 0.2*r(), 0.02 + 0.2*r(), 0.55 + 0.15*r()]){
    const i0 = 1 + Math.floor(r()*2), i1 = n - 1 - Math.floor(r()*3), pts = [];
    for (let i = i1; i >= i0; i--) pts.push([C[i][0] + C[i][2]*(u + 0.07*Math.sin(i*2.3 + S.seed)), C[i][1]]);
    if (pts.length > 2){ g.beginPath(); pathThrough(g, pts, true); g.stroke(); }
  }
  g.globalAlpha = 1;
  // fissures et grain
  g.strokeStyle = CH_INK; g.lineWidth = lw*0.55; g.lineCap = 'round';
  for (let q = 0, m = 3 + Math.round(S.h/90); q < m; q++){
    const t = 0.08 + 0.72*r(), i = Math.min(n - 1, Math.floor(t*n)), u = (r() - 0.45)*1.5, len = (14 + 26*r());
    const x = C[i][0] + C[i][2]*u, y = S.by - S.h*t, slope = (u*(S.bw - S.tw)/S.h)*1.2;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + slope*len*0.5 + 3*(r() - 0.5), y + len*0.5, x + slope*len, y + len); g.stroke();
  }
  g.restore();
  outline(); g.strokeStyle = CH_INK; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke();
  // la bouche
  const [tx, ty] = C[n];
  g.beginPath(); g.ellipse(tx, ty, S.tw*1.05, S.tw*0.40, S.lean*2, 0, Math.PI*2);
  g.fillStyle = '#03080f'; g.fill(); g.lineWidth = lw*0.9; g.stroke();
  g.beginPath(); g.ellipse(tx, ty, S.tw*1.05, S.tw*0.40, S.lean*2, Math.PI*1.08, Math.PI*1.62);
  g.strokeStyle = bright; g.lineWidth = lw*0.5; g.stroke();
}
function drawSocle(g, lw){
  const r = prng(4242), top = [];
  for (let x = CH.x0 + 30; x <= W + 30; x += 42){
    const u = (x - CH.x0 - 30)/(W - CH.x0), rise = smooth(0, 0.16, u);
    top.push([x + (r() - 0.5)*14, 1326 - 80*rise + (r() - 0.5)*22]);
  }
  const grad = g.createLinearGradient(0, 1296, 0, 1368);
  grad.addColorStop(0, 'rgba(15,29,46,1)'); grad.addColorStop(1, 'rgba(15,29,46,0)');
  g.beginPath(); pathThrough(g, top, true); g.lineTo(W + 30, 1380); g.lineTo(CH.x0, 1380); g.closePath();
  g.fillStyle = grad; g.fill();
  g.beginPath(); pathThrough(g, top, true); g.strokeStyle = CH_INK; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke();
}
function drawRock(g, x, y, w, h, seed, lw){
  const r = prng(seed), pts = [], m = 7;
  for (let i = 0; i < m; i++){
    const a = Math.PI + Math.PI*i/(m - 1), k = 0.78 + 0.34*r();
    pts.push([x + Math.cos(a)*w*k, y + Math.sin(a)*h*k*(i === 0 || i === m - 1 ? 0.15 : 1)]);
  }
  const shape = () => { g.beginPath(); g.moveTo(pts[0][0], y + 4); pts.forEach(p => g.lineTo(p[0], p[1])); g.lineTo(pts[m-1][0], y + 4); g.closePath(); };
  shape(); g.fillStyle = '#1c2140'; g.fill();
  g.save(); shape(); g.clip();
  g.beginPath(); g.moveTo(pts[1][0], pts[1][1]); g.lineTo(pts[2][0], pts[2][1]); g.lineTo(pts[3][0], pts[3][1]); g.lineTo(x - w*0.1, y + 4); g.lineTo(pts[0][0], y + 4); g.closePath();
  g.fillStyle = '#2c3157'; g.fill();
  g.restore();
  shape(); g.strokeStyle = CH_INK; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke();
}
let chemCanvas = null, chemSc = 0;
function chimneys(sc){
  if (chemCanvas && chemSc === sc) return chemCanvas;
  const c = chemCanvas || document.createElement('canvas');
  c.width = Math.ceil((CH.x1 - CH.x0)*sc); c.height = Math.ceil((CH.y1 - CH.y0)*sc);
  const g = c.getContext('2d');
  g.setTransform(sc, 0, 0, sc, -CH.x0*sc, -CH.y0*sc);
  const lw = Math.max(4.5, 1.5/sc);
  // halo bleuté derrière le massif
  const halo = g.createRadialGradient(10620, 1050, 30, 10620, 1050, 330);
  halo.addColorStop(0, 'rgba(52,120,168,0.26)'); halo.addColorStop(1, 'rgba(52,120,168,0)');
  g.fillStyle = halo; g.fillRect(CH.x0, CH.y0, CH.x1 - CH.x0, CH.y1 - CH.y0);
  for (const S of SPIRES){ if (S.socle) drawSocle(g, lw); else drawSpire(g, S, lw); }
  [[10312,1332,30,24,1],[10440,1340,52,46,2],[10478,1352,26,18,8],[10618,1346,58,58,3],[10776,1344,40,50,4],[10812,1358,34,24,5],[10690,1366,22,14,7]]
    .forEach(([x, y, w, h, s]) => drawRock(g, x, y, w, h, s*101, lw));
  chemCanvas = c; chemSc = sc; return c;
}

// La fumée : chaque panache est un chapelet de bouffées qui sortent de la bouche, montent en ralentissant,
// gonflent, se décalent les unes des autres puis se défont en haut. Le contour d'encre entoure l'ensemble
// (toutes les bouffées sont d'abord posées en encre, puis recouvertes par l'aplat) ; le volume vient d'un
// reflet par bouffée et de petites volutes à l'encre. Tout est fonction du temps : rien n'est une image.
const FUM_INK = '#050c18', FUM_FILL = '#22364a', FUM_LIGHT = '#3a586f', FUM_DARK = '#172736';
const FUMEROLES = SPIRES.filter(S => S.smoke).map(S => ({
  x: S.x + S.lean*S.h, y: S.by - S.h + 2, r: S.tw*0.62, h: S.smoke, lean: -0.085, amp: S.smoke*0.085,
  T: S.smoke/40 + 3, N: Math.round(S.smoke/17) + 8, ph: S.seed*0.37, puffs: []
}));
for (const f of FUMEROLES) for (let i = 0; i < f.N; i++) f.puffs.push({x:0, y:0, r:0, id:0});
function drawFumeroles(t, sc, camX, viewW){
  if (camX + viewW < CH.x0 - 60) return;
  ctx.drawImage(chimneys(sc), Math.round((CH.x0 - camX)*sc), Math.round(CH.y0*sc));
  ctx.save();
  // lueur qui respire à chaque bouche
  ctx.globalCompositeOperation = 'screen';
  for (const f of FUMEROLES){
    const x = (f.x - camX)*sc, y = (f.y - f.r)*sc, r = f.r*7*sc, a = 0.16 + 0.07*noise(t*0.7 + f.ph*2);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(110,200,220,${a.toFixed(3)})`); g.addColorStop(1, 'rgba(110,200,220,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2*r, 2*r);
  }
  ctx.globalCompositeOperation = 'source-over';
  const lw = Math.max(1.3, 4.2*sc), TAU = Math.PI*2;
  for (const f of FUMEROLES){
    for (let i = 0; i < f.N; i++){
      const q = t/f.T + i/f.N + f.ph, cyc = Math.floor(q), u = q - cyc, id = i*7.13 + cyc*3.77 + f.ph*11;
      const h1 = hash1(id), h2 = hash1(id + 1.3), h3 = hash1(id + 2.9);
      const rise = 1 - Math.pow(1 - u, 1.3);                                   // la fumée jaillit puis ralentit
      const grow = f.r*(0.9 + 3.1*Math.pow(rise, 0.8))*(0.62 + 0.7*h1*h1);
      const r = grow*smooth(0, 0.04, u)*(1 - smooth(0.38 + 0.42*h2, 0.80 + 0.2*h2, u)); // elle se défait en haut, chaque bouffée à son heure
      const p = f.puffs[i];
      p.x = f.x + f.lean*f.h*rise*rise*1.6 + (h3 - 0.5)*(grow*1.5 + f.r*3.2*rise*rise)*Math.min(1, rise*3)
          + f.amp*rise*noise(t*0.22 - rise*2.6 + f.ph) + 0.05*grow*Math.sin(t*1.1 + id);
      p.y = f.y - f.h*rise + 0.05*grow*Math.cos(t*0.9 + id*1.7);
      p.r = r; p.id = id;
    }
    const X = p => (p.x - camX)*sc, Y = p => p.y*sc;
    ctx.fillStyle = FUM_INK; ctx.beginPath();
    for (const p of f.puffs) if (p.r > 1){ ctx.moveTo(X(p) + p.r*sc + lw, Y(p)); ctx.arc(X(p), Y(p), p.r*sc + lw, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = FUM_FILL; ctx.beginPath();
    for (const p of f.puffs) if (p.r > 1){ ctx.moveTo(X(p) + p.r*sc, Y(p)); ctx.arc(X(p), Y(p), p.r*sc, 0, TAU); }
    ctx.fill();
    // ombre propre (bas droite) puis reflet (haut gauche) de chaque bouffée
    ctx.fillStyle = FUM_DARK; ctx.beginPath();
    for (const p of f.puffs) if (p.r > 9){ const r = p.r*0.38*sc, x = X(p) + p.r*0.40*sc, y = Y(p) + p.r*0.42*sc; ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = FUM_LIGHT; ctx.beginPath();
    for (const p of f.puffs) if (p.r > 3){ const r = p.r*0.55*sc, x = X(p) - p.r*0.24*sc, y = Y(p) - p.r*0.27*sc; ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
    ctx.fill();
    // volutes à l'encre
    ctx.strokeStyle = FUM_INK; ctx.lineWidth = lw*0.62; ctx.lineCap = 'round'; ctx.beginPath();
    for (const p of f.puffs) if (p.r > 8 && hash1(p.id + 9.7) < 0.6){
      const a0 = -0.25 + 1.1*hash1(p.id + 5.1), r = p.r*0.74*sc;
      ctx.moveTo(X(p) + r*Math.cos(a0), Y(p) + r*Math.sin(a0)); ctx.arc(X(p), Y(p), r, a0, a0 + 1.5 + 0.8*hash1(p.id + 6.3));
    }
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- le sous-marin ----------
// Il traverse le grand large et les abysses sans jamais faire demi-tour. Vers la droite, il sort par le
// bord droit du panorama ; vers la gauche, il s'éloigne dans le fond en approchant du récif (il rapetisse,
// s'estompe, descend) et disparaît derrière le tombant. Phares allumés dans les abysses, éteints au large.
const subImg = loadImg(SUB.src), subOnImg = loadImg(SUB.on.src);
const SUB_L = 600, SUB_K = SUB_L/SUB.w, SUB_H = SUB.h*SUB_K;        // longueur à l'écran (px du panorama)
const SUB_FAR0 = 5450, SUB_FAR1 = 6250, SUB_DIVE1 = 7000, SUB_MIN = 0.5, SUB_ON = 8380;   // il ne rapetisse (jusqu'à SUB_MIN) qu'entre FAR1 et FAR0, peu avant le récif ; la descente vers le pied du tombant commence à DIVE1 ; seuil des phares
const subLocal = (px, py) => [(px - SUB.w/2)*SUB_K, (py - SUB.h/2)*SUB_K];
// faisceaux : lampe (indice dans SUB.lamps), angle dans le repère du dessin (le sous-marin regarde à gauche,
// 180° = droit devant, moins = vers le bas), portée, demi-ouverture, intensité, délai d'allumage
const DEG = Math.PI/180;
const SUB_BEAMS = [
  {lamp:0, ang:177*DEG, len:1500, half:6.5*DEG, a:0.85, delay:0.00},   // projecteur du toit : long et étroit
  {lamp:4, ang:168*DEG, len:1000, half:17*DEG,  a:0.50, delay:0.22},   // gros phare rond : large et doux
  {lamp:1, ang:154*DEG, len:1050, half:10*DEG,  a:0.62, delay:0.45},   // les trois spots : en éventail vers le bas
  {lamp:2, ang:145*DEG, len:1080, half:10*DEG,  a:0.62, delay:0.58},
  {lamp:3, ang:136*DEG, len:1000, half:10*DEG,  a:0.56, delay:0.71}
].map(b => { const [lx, ly] = subLocal(SUB.lamps[b.lamp][0] - (b.lamp ? 6 : 8), SUB.lamps[b.lamp][1] + (b.lamp && b.lamp < 4 ? 5 : 0)); return {...b, lx, ly, lum:0, ox:0, oy:0, dx:0, dy:0}; });
// texture d'un faisceau : cône à bords doux, cœur plus vif, lumière qui s'épuise avec la distance, fines stries
const beamTex = (() => {
  const w = 384, h = 192, c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'), im = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
    const u = x/(w - 1), v = (y + 0.5)/h*2 - 1, hwf = 0.05 + 0.95*u, q = v/hwf, o = (y*w + x)*4;
    let I = 0;
    if (Math.abs(q) < 1){
      const edge = (1 - q*q);
      I = (0.55*Math.exp(-2.4*q*q) + 0.45*Math.exp(-11*q*q)) * edge
        * Math.pow(0.05/hwf, 0.5) * smooth(0, 0.012, u) * (1 - smooth(0.4, 1, u))
        * (0.88 + 0.12*Math.sin(q*8.3 + 1.1)*Math.sin(q*21.7 + 0.4));
    }
    // blanc chaud près de la lampe, qui tire vers le bleu-vert de l'eau en s'éloignant
    im.data[o] = 255 - 70*u; im.data[o+1] = 248 - 8*u; im.data[o+2] = 214 + 34*u; im.data[o+3] = Math.round(255*Math.min(1, I*1.6));
  }
  g.putImageData(im, 0, 0); return c;
})();
const srnd = prng(20261003);
const sub = {dir:1, x:7000, y:640, vy:0, pitch:0, ph:srnd()*50, wait:0, on:false, swT:-99, scale:1, alpha:1, bubT:0};
function subSpawn(dir){
  sub.dir = dir; sub.ph = srnd()*50; sub.vy = 0; sub.pitch = 0;
  if (dir > 0){ sub.x = 5240; sub.on = false; sub.swT = -99; }
  else { sub.x = W + SUB_L*0.75; sub.on = true; sub.swT = -99; }
  sub.y = subCruise(sub.x, 0);
}
// profondeur de croisière : libre au large, basse au-dessus de la plaine des abysses, puis il remonte
// pour passer au-dessus des cheminées ; près du récif il plonge vers le pied du tombant
function subCruise(x, t){
  const w = noise(t*0.045 + sub.ph);
  const large = 700 + 150*w, plaine = 800 + 60*w, massif = 440 + 40*w;
  let y = large + (plaine - large)*smooth(8100, 8900, x);
  y += (massif - y)*smooth(9550, 10250, x);
  const dive = 1 - smooth(SUB_FAR0, SUB_DIVE1, x);
  return y + (1175 - y)*Math.pow(dive, 1.15);
}
const bubbles = [];
function stepSub(dt, t){
  if (sub.wait > 0){ sub.wait -= dt; if (sub.wait <= 0) subSpawn(srnd() < 0.5 ? 1 : -1); return; }
  const far = 1 - smooth(SUB_FAR0, SUB_FAR1, sub.x);
  sub.scale = 1 - (1 - SUB_MIN)*far;
  sub.alpha = (1 - 0.4*far) * smooth(5230, 5330, sub.x);
  const v = 66*(0.3 + 0.7*sub.scale)*(0.9 + 0.14*noise(t*0.13 + sub.ph));
  sub.x += sub.dir*v*dt;
  const ty = subCruise(sub.x, t) + 7*sub.scale*Math.sin(t*0.8 + sub.ph);
  const vy = clamp((ty - sub.y)*0.9, -v*0.4, v*0.4);
  sub.vy += (vy - sub.vy)*Math.min(1, dt*1.5); sub.y += sub.vy*dt;
  sub.pitch += (Math.atan2(sub.vy, v)*0.4 - sub.pitch)*Math.min(1, dt*1.2);
  const want = sub.x > SUB_ON;
  if (want !== sub.on){ sub.on = want; sub.swT = t; }
  for (const b of SUB_BEAMS){
    const tau = t - sub.swT - (sub.on ? b.delay : b.delay*0.4);
    // allumage : deux hésitations puis plein feu ; extinction : simple fondu
    b.lum = sub.on ? (tau < 0 ? 0 : tau < 0.07 ? 0.9 : tau < 0.15 ? 0.15 : tau < 0.24 ? 0.8 : tau < 0.31 ? 0.35 : Math.min(1, 0.6 + (tau - 0.31)*2))
                   : clamp(1 - tau/0.35, 0, 1);
  }
  // bulles de l'hélice
  sub.bubT -= dt;
  if (sub.bubT <= 0 && sub.alpha > 0.3){
    sub.bubT = 0.16 + 0.2*srnd();
    const [lx, ly] = subLocal(SUB.helice[0] + 18, SUB.helice[1] + (srnd() - 0.5)*70), p = subWorld(lx, ly);
    bubbles.push({x:p[0], y:p[1], vx:-sub.dir*v*0.25, vy:-(26 + 30*srnd()), r:(2.2 + 4.2*srnd())*sub.scale, age:0, life:2.2 + 2*srnd(), ph:srnd()*6});
  }
  for (let i = bubbles.length - 1; i >= 0; i--){
    const b = bubbles[i]; b.age += dt; b.vx *= Math.exp(-1.6*dt); b.x += (b.vx + 9*Math.sin(t*3 + b.ph))*dt; b.y += b.vy*dt;
    if (b.age > b.life) bubbles.splice(i, 1);
  }
  if (sub.dir > 0 ? sub.x > W + SUB_L*0.8 : sub.x < 5225) sub.wait = 7 + 9*srnd();
}
// repère du dessin -> panorama (le dessin regarde à gauche ; vers la droite, on le retourne)
function subWorld(lx, ly){
  const c = Math.cos(-sub.pitch), s = Math.sin(-sub.pitch), fx = sub.dir > 0 ? -1 : 1, k = sub.scale;
  return [sub.x + fx*k*(lx*c - ly*s), sub.y + k*(lx*s + ly*c)];
}
// poussières en suspension : invisibles, sauf quand un faisceau les traverse
const MOTES = Array.from({length:280}, () => ({x:8250 + srnd()*(W - 8250), y:330 + srnd()*980, ph:srnd()*6.3, r:1 + 1.9*srnd(), sp:0.15 + 0.3*srnd()}));
const FLOOR_Y = 1215;
function drawSub(t, sc, camX, viewW){
  if (sub.wait > 0) return;
  const lit = SUB_BEAMS.some(b => b.lum > 0.01);
  if (sub.alpha > 0.01 && bubbles.length){
    ctx.save(); ctx.lineWidth = Math.max(1, 1.6*sc);
    for (const b of bubbles){
      const k = 1 - smooth(0.6, 1, b.age/b.life);
      ctx.globalAlpha = 0.55*k*sub.alpha; ctx.strokeStyle = '#a9d6e6'; ctx.fillStyle = 'rgba(169,214,230,0.16)';
      ctx.beginPath(); ctx.arc((b.x - camX)*sc, b.y*sc, Math.max(0.8, b.r*sc), 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
  const reach = SUB_L + (lit ? 1550 : 0);
  if (sub.x + reach < camX || sub.x - reach > camX + viewW || sub.alpha <= 0.01 || !subImg.complete) return;
  const fx = sub.dir > 0 ? -1 : 1;
  // origine et direction de chaque faisceau dans le panorama
  if (lit) for (const b of SUB_BEAMS){
    const o = subWorld(b.lx, b.ly), e = subWorld(b.lx + Math.cos(b.ang)*100, b.ly + Math.sin(b.ang)*100), l = Math.hypot(e[0]-o[0], e[1]-o[1]) || 1;
    b.ox = o[0]; b.oy = o[1]; b.dx = (e[0]-o[0])/l; b.dy = (e[1]-o[1])/l;
  }
  ctx.save();
  // taches de lumière sur le fond, là où les faisceaux le touchent
  if (lit){
    ctx.globalCompositeOperation = 'screen';
    for (const b of SUB_BEAMS){
      if (b.lum < 0.02 || b.dy < 0.08) continue;
      const d = (FLOOR_Y - b.oy)/b.dy, L = b.len*sub.scale; if (d <= 0 || d > L*0.97) continue;
      const px = b.ox + b.dx*d; if (px < 8900) continue;
      const k = Math.pow(1 - d/L, 1.1), spot = d*Math.tan(b.half), rx = Math.min(520, spot/Math.max(0.3, b.dy))*1.15, ry = Math.max(14, spot*0.42);
      ctx.save();
      ctx.translate((px - camX)*sc, FLOOR_Y*sc); ctx.scale(rx*sc, ry*sc);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1), a = clamp(b.a*b.lum*k*1.5, 0, 0.7);
      g.addColorStop(0, `rgba(214,236,214,${a.toFixed(3)})`); g.addColorStop(0.55, `rgba(150,206,214,${(a*0.45).toFixed(3)})`); g.addColorStop(1, 'rgba(150,206,214,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // le sous-marin
  ctx.save();
  ctx.translate((sub.x - camX)*sc, sub.y*sc); ctx.scale(fx*sc*sub.scale, sc*sub.scale); ctx.rotate(-sub.pitch);
  ctx.globalAlpha = sub.alpha;
  ctx.drawImage(subImg, -SUB_L/2, -SUB_H/2, SUB_L, SUB_H);
  if (lit){
    const glow = Math.max(...SUB_BEAMS.map(b => b.lum));
    ctx.globalAlpha = sub.alpha*glow;
    ctx.drawImage(subOnImg, -SUB_L/2 + SUB.on.x*SUB_K, -SUB_H/2 + SUB.on.y*SUB_K, SUB.on.w*SUB_K, SUB.on.h*SUB_K);
    // faisceaux, puis halo et éclat de chaque lampe
    ctx.globalCompositeOperation = 'screen';
    { // voile diffus : l'eau éclairée devant la proue
      const [vx, vy] = subLocal(SUB.lamps[2][0] - 150, SUB.lamps[2][1] + 70), VR = 520, g = ctx.createRadialGradient(vx, vy, 0, vx, vy, VR);
      g.addColorStop(0, 'rgba(200,236,232,0.20)'); g.addColorStop(0.5, 'rgba(170,222,230,0.07)'); g.addColorStop(1, 'rgba(170,222,230,0)');
      ctx.globalAlpha = sub.alpha*glow; ctx.fillStyle = g; ctx.fillRect(vx - VR, vy - VR, 2*VR, 2*VR);
    }
    for (const b of SUB_BEAMS){
      if (b.lum < 0.01) continue;
      const flick = 0.93 + 0.07*noise(t*2.3 + b.lamp*4.1), he = b.len*Math.tan(b.half);
      ctx.save(); ctx.translate(b.lx, b.ly); ctx.rotate(b.ang + 0.012*noise(t*0.5 + b.lamp));
      ctx.globalAlpha = clamp(sub.alpha*b.a*b.lum*flick, 0, 1);
      ctx.drawImage(beamTex, 0, -he, b.len, 2*he);
      ctx.restore();
    }
    for (const b of SUB_BEAMS){
      if (b.lum < 0.01) continue;
      const R0 = b.lamp === 4 ? 64 : 46, g = ctx.createRadialGradient(b.lx, b.ly, 0, b.lx, b.ly, R0);
      g.addColorStop(0, 'rgba(255,250,222,0.95)'); g.addColorStop(0.16, 'rgba(255,240,180,0.55)'); g.addColorStop(0.5, 'rgba(255,232,160,0.14)'); g.addColorStop(1, 'rgba(255,232,160,0)');
      ctx.globalAlpha = sub.alpha*b.lum; ctx.fillStyle = g; ctx.fillRect(b.lx - R0, b.ly - R0, 2*R0, 2*R0);
    }
  }
  ctx.restore();
  // poussières prises dans les faisceaux
  if (lit){
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = '#fff3cf';
    for (const m of MOTES){
      const mx = m.x + 14*Math.sin(t*m.sp + m.ph), my = m.y + 10*Math.cos(t*m.sp*0.8 + m.ph*1.7);
      if (mx < camX - 10 || mx > camX + viewW + 10) continue;
      let I = 0;
      for (const b of SUB_BEAMS){
        if (b.lum < 0.05) continue;
        const rx = mx - b.ox, ry = my - b.oy, al = rx*b.dx + ry*b.dy, L = b.len*sub.scale; if (al < 20 || al > L*0.8) continue;
        const ac = Math.abs(rx*b.dy - ry*b.dx), wdt = al*Math.tan(b.half) + 6; if (ac > wdt) continue;
        I = Math.max(I, b.lum*(1 - (ac/wdt)*(ac/wdt))*(1 - al/(L*0.8))*(0.6 + 0.4*Math.sin(t*1.7 + m.ph*3)));
      }
      if (I < 0.03) continue;
      ctx.globalAlpha = Math.min(0.95, I*1.9);
      ctx.beginPath(); ctx.arc((mx - camX)*sc, my*sc, Math.max(0.7, m.r*sc), 0, Math.PI*2); ctx.fill();
    }
  }
  ctx.restore();
}

// ---------- poissons des abysses ----------
// Même principe que les nageurs du récif : la tête toujours devant, le corps qui ondule, la vitesse et la
// profondeur qui varient lentement, jamais de demi-tour. Ils restent dans les abysses : vers la droite ils
// peuvent sortir par le bord du panorama ; vers la gauche ils n'atteignent jamais le grand large, ils
// s'éloignent dans le fond (ils rapetissent et se fondent dans le bleu sombre). Certains surgissent de même
// du fond. Ils passent derrière les cheminées et leur fumée.
const abSpr = {}; for (const k in ABYSS_FISH) abSpr[k] = {...ABYSS_FISH[k], img: loadImg(ABYSS_FISH[k].src)};
const AB_SPECIES = [
  {key:'baudroie', len:[175,220], sp:[13,20], amp:0.030, wave:2.2, poids:1.2, max:1},   // trapue, lente, son leurre luit
  {key:'abysse2',  len:[220,270], sp:[22,34], amp:0.050, wave:3.0, poids:2,   max:2},
  {key:'abysse3',  len:[285,345], sp:[24,38], amp:0.055, wave:3.4, poids:2,   max:2},
  {key:'abysse4',  len:[350,430], sp:[17,27], amp:0.075, wave:4.4, poids:1.5, max:1}    // longue, ondule comme une anguille
];
const AB_TOP = 150, AB_BOT = 1620, AB_LIMIT = 8900, AB_WANT = 5, AB_ALPHA = 0.9;   // AB_LIMIT : au plus tard ici, un poisson qui va à gauche s'éloigne
const arnd = prng(77003), AR = (a, b) => a + (b - a)*arnd();
const abFish = [];
// profondeur d'arrivée : parmi quelques tirages sur toute la hauteur, celui qui est le plus loin des poissons présents
function abFreeY(){
  let best = AR(AB_TOP, AB_BOT), bd = -1;
  for (let k = 0; k < 6; k++){
    const y = AR(AB_TOP, AB_BOT), dmin = abFish.reduce((m, f) => Math.min(m, Math.abs(f.y - y)), 1e9);
    if (dmin > bd){ bd = dmin; best = y; }
  }
  return best;
}
// taille et opacité d'après l'éloignement (near : il arrive du fond ; away : il y repart)
function abDepth(f){
  f.scale = 1 - 0.55*smooth(0, 1, Math.max(f.away, 1 - f.near));
  f.alpha = AB_ALPHA*smooth(0, 0.9, f.near)*(1 - smooth(0.12, 1, f.away));
}
function abSpawn(how, x){
  const ok = AB_SPECIES.filter(S => abFish.filter(f => f.S === S).length < S.max); if (!ok.length) return;
  let u = arnd()*ok.reduce((s, S) => s + S.poids, 0), S = ok[ok.length - 1];
  for (const c of ok){ u -= c.poids; if (u <= 0){ S = c; break; } }
  const f = {S, len:AR(S.len[0], S.len[1]), base:AR(S.sp[0], S.sp[1]), dir:arnd() < 0.5 ? -1 : 1, x:0, y:abFreeY(), vy:0, tilt:0, scale:1, alpha:0,
             ph:AR(0, 50), sw:AR(0, 6.3), near:1, away:0, leaving:false, leaveX:null, ty:0, tyT:0};
  if (how === 'bord'){ f.dir = -1; f.x = W + f.len*0.6; }
  else if (how === 'fond'){ f.near = 0; f.x = f.dir > 0 ? AR(8800, 9900) : AR(9700, 10600); }
  else f.x = x;
  f.ty = f.y; abDepth(f);
  if (f.dir < 0) f.leaveX = AR(AB_LIMIT + 50, Math.max(AB_LIMIT + 60, Math.min(9900, f.x - 450)));
  else if (arnd() < 0.3 && f.x + 500 < 10500) f.leaveX = AR(f.x + 500, 10500);     // les autres sortent par le bord droit
  abFish.push(f);
}
function stepAbFish(dt, t){
  for (let i = abFish.length - 1; i >= 0; i--){
    const f = abFish[i];
    f.near = Math.min(1, f.near + dt/7);
    if (!f.leaving && ((f.leaveX !== null && (f.dir < 0 ? f.x < f.leaveX : f.x > f.leaveX)) || (f.dir < 0 && f.x < AB_LIMIT))) f.leaving = true;
    if (f.leaving) f.away = Math.min(1, f.away + dt/9);
    abDepth(f);
    const v = f.base*(0.8 + 0.25*noise(t*0.17 + f.ph))*(0.35 + 0.65*f.scale);
    f.x += f.dir*v*dt;
    f.tyT -= dt;
    if (f.tyT < 0){ f.ty = clamp(f.y + AR(-330, 330), AB_TOP, AB_BOT); f.tyT = AR(7, 14); }
    const want = clamp((f.ty - f.y)*0.12, -13, 13) + 4*Math.sin(t*0.4 + f.ph);
    f.vy += (want - f.vy)*(1 - Math.exp(-0.7*dt)); f.y += f.vy*dt;
    f.tilt += (clamp(Math.atan2(f.vy, v + 12), -0.2, 0.2) - f.tilt)*(1 - Math.exp(-1.6*dt));
    f.sw += dt*(0.75 + v/34)*Math.PI;
    if (f.away >= 1 || (f.dir > 0 && f.x > W + f.len*0.7)) abFish.splice(i, 1);
  }
  abSpawnT -= dt;
  if (abSpawnT < 0){ abSpawnT = AR(2.5, 6); if (abFish.length < AB_WANT) abSpawn(arnd() < 0.35 ? 'bord' : 'fond'); }
}
let abSpawnT = 3;
for (let i = 0; i < AB_WANT - 1; i++) abSpawn('ici', 8950 + i*430 + AR(0, 300));
const AB_STRIPS = 16;
function drawAbFish(t, sc, camX, viewW){
  if (camX + viewW < 8500) return;
  const list = abFish.slice().sort((a, b) => a.scale - b.scale);                     // les plus lointains d'abord
  for (const f of list){
    const sp = abSpr[f.S.key]; if (!sp.img.complete || !(f.alpha > 0.01) || !(f.scale > 0)) continue;
    const w = f.len*f.scale, h = w*sp.h/sp.w;
    if (f.x + w < camX || f.x - w > camX + viewW) continue;
    const flip = f.dir*sp.head;                                                     // sp.head : 1 si le dessin regarde à droite
    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.translate((f.x - camX)*sc, f.y*sc); ctx.rotate(f.tilt*f.dir); ctx.scale(sc*flip, sc);
    const A = w*f.S.amp;
    for (let i = 0; i < AB_STRIPS; i++){
      const u0 = i/AB_STRIPS, u1 = (i + 1)/AB_STRIPS, uh = sp.head < 0 ? (u0 + u1)/2 : 1 - (u0 + u1)/2;   // 0 à la tête, 1 à la queue
      const b = Math.max(0, uh - 0.22)/0.78, dy = A*Math.pow(b, 1.5)*Math.sin(f.sw - uh*f.S.wave);
      ctx.drawImage(sp.img, u0*sp.w, 0, (u1 - u0)*sp.w + 0.8, sp.h, -w/2 + u0*w, -h/2 + dy, (u1 - u0)*w + 0.8, h);
    }
    if (sp.lure){   // le leurre de la baudroie : une lueur qui palpite
      const lx = (sp.lure[0]/sp.w - 0.5)*w, ly = (sp.lure[1]/sp.h - 0.5)*h, pulse = 0.72 + 0.28*Math.sin(t*1.5 + f.ph)*Math.sin(t*0.37 + f.ph*2);
      ctx.globalCompositeOperation = 'screen';
      for (const [rad, a] of [[w*0.95, 0.16], [w*0.36, 0.5], [w*0.09, 0.9]]){
        const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, rad);
        g.addColorStop(0, `rgba(255,246,196,${(a*pulse).toFixed(3)})`); g.addColorStop(1, 'rgba(255,240,170,0)');
        ctx.fillStyle = g; ctx.fillRect(lx - rad, ly - rad, 2*rad, 2*rad);
      }
    }
    ctx.restore();
  }
}

// ---------- créatures du lagon (celles que l'enfant gagne) ----------
// Une seule image par créature (générée, détourée à l'avance) ; tout le mouvement vient du code. Chaque
// créature est dessinée en deux passes de déformation : par colonnes (décalage vertical : ondulation d'un
// corps, bras) ou par lignes (décalage horizontal : pattes, tentacules, queue), les deux à la suite pour
// l'oursin et l'anémone (piquants et tentacules bougent tout autour), plus une pose d'ensemble (position,
// inclinaison, respiration). Les résidentes restent à leur place.
Object.assign(LAGON_SPR, CORAIL_SPR, LARGE_SPR, ABYSSES_SPR);
const lagImg = {}; for (const k in LAGON_SPR) if (OPTS.owned.has(k)) lagImg[k] = loadImg(LAGON_SPR[k].src);
const TAU2 = Math.PI*2, edge2 = x => { const e = Math.abs(x - 0.5)*2; return e*e; };
// x, y : pied de la créature posée, centre de la nageuse ; len : largeur à l'écran (px du panorama, avant perspective).
// Les tailles suivent la taille réelle des animaux, mais adoucie (largeur proportionnelle à la taille réelle
// puissance 0,55) pour que la raie ne remplisse pas l'écran, et avec un plancher pour les plus petits :
// limace, moule, bernard-l'ermite, crevette, poisson-clown et hippocampe sont un peu grossis.
// col(u, t) : décalage vertical de la colonne u (0 à gauche, 1 à droite), en fraction de la hauteur
// row(v, t) : décalage horizontal de la ligne v (0 en haut, 1 en bas), en fraction de la largeur
// pose(t)   : {dx, dy, rot, sx, sy} en px du panorama et radians
const LAGON = [
  {id:'moule', x:668, y:1402, len:125, sol:true, ph:0.4,
    pose:(t, c) => ({sy:1 + 0.008*Math.sin(t*0.9 + c.ph)}), bulles:true},
  {id:'anemone', x:930, y:1362, len:220, sol:true, ph:1.3,
    col:(u, t) => 0.030*edge2(u)*Math.sin(t*1.0 + u*7),
    row:(v, t) => 0.030*edge2(v)*Math.sin(t*0.8 + v*6 + 1),
    pose:(t, c) => ({sx:1 + 0.014*Math.sin(t*0.7), sy:1 + 0.014*Math.sin(t*0.7 + 1.2)})},
  {id:'poisson-clown', x:1085, y:1205, len:165, flip:true, ph:2.1,
    col:(u, t) => 0.075*Math.pow(Math.max(0, 0.72 - u)/0.72, 1.5)*Math.sin(t*5.2 + u*3.2),
    pose:(t, c) => ({dx:26*Math.sin(t*0.31 + c.ph), dy:16*Math.sin(t*0.53 + c.ph), rot:0.05*Math.sin(t*0.53 + c.ph + 1.2)})},
  {id:'limace-de-mer', x:1400, y:1300, len:125, sol:true, ph:3.0,
    row:(v, t) => 0.032*Math.pow(1 - v, 1.6)*Math.sin(t*1.2 + v*5),
    pose:(t, c) => ({dx:16*Math.sin(t*0.09 + c.ph), sx:1 + 0.018*Math.sin(t*0.75)})},
  {id:'oursin', x:2205, y:1345, len:165, sol:true, ph:4.2,
    col:(u, t) => 0.022*edge2(u)*Math.sin(t*1.25 + u*9),
    row:(v, t) => 0.022*edge2(v)*Math.sin(t*1.05 + v*8 + 2),
    pose:(t, c) => ({rot:0.012*Math.sin(t*0.4)})},
  {id:'etoile-de-mer', x:430, y:1590, len:215, sol:true, ph:5.0,
    col:(u, t) => 0.018*edge2(u)*Math.sin(t*0.8 + u*4),
    pose:(t, c) => ({rot:0.035*Math.sin(t*0.22 + c.ph), sx:1 + 0.012*Math.sin(t*0.6), sy:1 + 0.012*Math.sin(t*0.6 + 1.5)})},
  {id:'crabe', x:1180, y:1570, len:265, sol:true, ph:0.9,
    row:(v, t, c) => 0.013*c.pas*smooth(0.5, 1, v)*Math.sin(t*8 + v*11),
    pose:(t, c) => { const w = Math.sin(t*0.32 + c.ph); c.pas = Math.pow(Math.abs(Math.cos(t*0.32 + c.ph)), 0.6);   // il marche de côté : c.pas vaut 1 en pleine marche, 0 aux arrêts
      return {dx:95*w, dy:-3*c.pas*Math.abs(Math.sin(t*8)), rot:0.018*c.pas*Math.sin(t*8)}; }},
  {id:'crevette', x:1480, y:1440, len:150, ph:1.7, ombre:1484,
    row:(v, t) => 0.014*smooth(0.5, 1, v)*Math.sin(t*9 + v*12),
    pose:(t, c) => ({dx:18*Math.sin(t*0.4 + c.ph), dy:10*Math.sin(t*1.1 + c.ph), rot:0.045*Math.sin(t*0.8 + c.ph)})},
  {id:'bernard-l-ermite', x:1840, y:1560, len:150, sol:true, ph:2.6,
    row:(v, t, c) => 0.011*c.pas*smooth(0.55, 1, v)*Math.sin(t*7 + v*10),
    pose:(t, c) => { const a = t*0.21 + c.ph; c.pas = smooth(0.15, 0.6, Math.abs(Math.cos(a)));                    // il avance par à-coups et s'arrête
      return {dx:32*Math.sin(a), dy:-2*c.pas*Math.abs(Math.sin(t*7)), rot:0.022*c.pas*Math.sin(t*3.5)}; }},
  {id:'coquille-saint-jacques', x:830, y:1715, len:165, sol:true, ph:3.3,
    pose:(t, c) => { const u = ((t + c.ph*3) % 9)/9, j = u < 0.085 ? Math.sin(Math.PI*u/0.085) : 0;                  // un petit bond toutes les 9 s
      return {dy:-34*j, dx:-10*j, sy:1 + 0.07*j - 0.05*Math.max(0, Math.sin(Math.PI*(u - 0.085)/0.03))*(u > 0.085 && u < 0.115 ? 1 : 0), rot:0.012*Math.sin(t*0.5) - 0.05*j}; }},
  {id:'concombre-de-mer', x:2110, y:1725, len:250, sol:true, ph:4.4,
    col:(u, t) => 0.030*Math.sin(t*1.3 + u*7),
    pose:(t, c) => ({dx:30*Math.sin(t*0.07 + c.ph), sx:1 + 0.028*Math.sin(t*0.65)})},
  {id:'hippocampe', x:1935, y:1010, len:106, ph:5.5,
    row:(v, t) => 0.060*Math.pow(v, 1.5)*Math.sin(t*1.3 + v*2.6),
    pose:(t, c) => ({dy:14*Math.sin(t*0.7 + c.ph), dx:8*Math.sin(t*0.37), rot:0.07*Math.sin(t*0.7 + c.ph + 1.4)})},
  {id:'poisson-chirurgien', x:560, y:790, len:250, ph:0.2,
    col:(u, t) => 0.060*Math.pow(Math.max(0, u - 0.3)/0.7, 1.5)*Math.sin(t*4.4 - u*3.2),
    pose:(t, c) => ({dx:40*Math.sin(t*0.23 + c.ph), dy:22*Math.sin(t*0.41 + c.ph), rot:0.05*Math.sin(t*0.41 + c.ph + 1.3)})},
  {id:'poisson-ballon', x:2080, y:650, len:320, ph:1.1,
    col:(u, t) => 0.040*Math.pow(Math.max(0, u - 0.45)/0.55, 1.4)*Math.sin(t*5.5 - u*3),
    pose:(t, c) => ({dx:24*Math.sin(t*0.19 + c.ph), dy:18*Math.sin(t*0.47 + c.ph), rot:0.04*Math.sin(t*0.47 + c.ph + 1), sx:1 + 0.012*Math.sin(t*1.1), sy:1 + 0.012*Math.sin(t*1.1 + 0.6)})},
  {id:'raie-pastenague', x:1340, y:930, len:540, ph:2.9,
    col:(u, t) => 0.050*(0.35 + 0.65*u)*Math.sin(t*1.9 - u*3.4),
    pose:(t, c) => ({dx:110*Math.sin(t*0.11 + c.ph), dy:26*Math.sin(t*0.29 + c.ph), rot:0.05*Math.sin(t*0.29 + c.ph + 1.2)})},
  // ----- récif de corail -----
  {id:'murene', x:2700, y:1425, len:480, sol:true, ph:0.7,
    col:(u, t) => 0.014*Math.sin(t*1.3 - u*6),
    pose:(t, c) => ({sx:1 + 0.012*Math.sin(t*0.9 + c.ph), sy:1 + 0.016*Math.sin(t*0.9 + c.ph + 1.4), rot:0.012*Math.sin(t*0.45)})},
  {id:'benitier', x:3240, y:1600, len:460, sol:true, ph:1.9,
    pose:(t, c) => { const u = ((t + c.ph*4) % 11)/11, snap = u < 0.03 ? Math.sin(Math.PI*u/0.03) : 0;                 // il respire, et se referme d'un coup de temps en temps
      return {sy:1 + 0.018*Math.sin(t*0.6 + c.ph) - 0.07*snap, sx:1 + 0.008*Math.sin(t*0.6 + c.ph + 1.5)}; }},
  {id:'crevette-mante', x:3760, y:1530, len:190, sol:true, ph:2.4,
    row:(v, t, c) => 0.012*c.pas*smooth(0.6, 1, v)*Math.sin(t*8 + v*10),
    pose:(t, c) => { const a = t*0.27 + c.ph; c.pas = smooth(0.2, 0.7, Math.abs(Math.cos(a)));
      return {dx:60*Math.sin(a), dy:-2*c.pas*Math.abs(Math.sin(t*8)), rot:0.02*c.pas*Math.sin(t*4)}; }},
  {id:'poulpe', x:3960, y:1215, len:430, sol:true, ph:3.6,
    col:(u, t) => 0.030*edge2(u)*Math.sin(t*0.9 + u*6),
    row:(v, t) => 0.026*edge2(v)*Math.sin(t*0.75 + v*5 + 1.5),
    pose:(t, c) => ({sx:1 + 0.012*Math.sin(t*0.8), sy:1 + 0.020*Math.sin(t*0.8 + 1.3)})},
  {id:'langouste', x:4440, y:1445, len:430, sol:true, ph:4.8,
    row:(v, t, c) => 0.014*edge2(v)*Math.sin(t*1.5 + v*6) + 0.008*c.pas*smooth(0.6, 1, v)*Math.sin(t*7 + v*9),
    pose:(t, c) => { const a = t*0.17 + c.ph; c.pas = smooth(0.2, 0.7, Math.abs(Math.cos(a)));
      return {dx:45*Math.sin(a), dy:-2*c.pas*Math.abs(Math.sin(t*7)), rot:0.012*Math.sin(t*0.5)}; }},
  {id:'raie-leopard', x:2640, y:640, len:600, ph:0.5, ronde:{x0:2450, x1:5750, v:23, dir:-1},
    col:(u, t) => 0.050*(0.35 + 0.65*u)*Math.sin(t*1.7 - u*3.4),
    pose:(t, c) => ({dy:28*Math.sin(t*0.27 + c.ph), rot:0.05*Math.sin(t*0.27 + c.ph + 1.2)})},
  {id:'tortue-verte', x:3160, y:400, len:540, ph:1.4, ronde:{x0:2600, x1:5800, v:19, dir:-1},
    row:(v, t) => 0.040*edge2(v)*Math.sin(t*1.4 + (v < 0.5 ? 0 : 2.6)),                                                  // les nageoires du haut et du bas rament à contretemps
    pose:(t, c) => ({dy:26*Math.sin(t*0.7 + c.ph), rot:0.06*Math.sin(t*0.7 + c.ph + 1.3)})},
  {id:'poisson-coffre', x:3640, y:360, len:230, ph:2.2,
    col:(u, t) => 0.04*Math.pow(Math.max(0, u - 0.6)/0.4, 1.5)*Math.sin(t*7.5 - u*3),
    pose:(t, c) => ({dx:20*Math.sin(t*0.3 + c.ph), dy:14*Math.sin(t*0.6 + c.ph), rot:0.05*Math.sin(t*0.6 + c.ph + 1)})},
  {id:'poisson-perroquet', x:3700, y:640, len:340, ph:3.1,
    col:(u, t) => 0.055*Math.pow(Math.max(0, u - 0.35)/0.65, 1.5)*Math.sin(t*4.2 - u*3.2),
    pose:(t, c) => ({dx:34*Math.sin(t*0.22 + c.ph), dy:18*Math.sin(t*0.43 + c.ph), rot:0.045*Math.sin(t*0.43 + c.ph + 1.2)})},
  {id:'poisson-mandarin', x:4075, y:495, len:135, ph:4.0,
    col:(u, t) => 0.050*Math.pow(Math.max(0, 0.4 - u)/0.4, 1.4)*Math.sin(t*6 + u*3),
    pose:(t, c) => ({dx:16*Math.sin(t*0.5 + c.ph), dy:10*Math.sin(t*0.9 + c.ph), rot:0.06*Math.sin(t*0.9 + c.ph + 1)})},
  {id:'requin-pointes-noires', x:4360, y:235, len:640, ph:5.2, ronde:{x0:2650, x1:5850, v:34, dir:-1},
    col:(u, t) => 0.070*Math.pow(Math.max(0, u - 0.25)/0.75, 1.5)*Math.sin(t*2.6 - u*3.5),
    pose:(t, c) => ({dy:20*Math.sin(t*0.26 + c.ph), rot:0.035*Math.sin(t*0.26 + c.ph + 1.3)})},
  {id:'poisson-papillon', x:4290, y:690, len:205, ph:0.3,
    col:(u, t) => 0.05*Math.pow(Math.max(0, u - 0.45)/0.55, 1.5)*Math.sin(t*5.5 - u*3),
    pose:(t, c) => ({dx:22*Math.sin(t*0.33 + c.ph), dy:13*Math.sin(t*0.58 + c.ph), rot:0.05*Math.sin(t*0.58 + c.ph + 1.1)})},
  {id:'seiche', x:4990, y:320, len:300, ph:1.0,
    col:(u, t) => u < 0.4 ? 0.035*Math.pow((0.4 - u)/0.4, 1.3)*Math.sin(t*1.7 + u*7) : 0.014*smooth(0.4, 0.55, u)*Math.sin(t*5.5 - u*16),   // les bras ondulent, la nageoire frémit
    pose:(t, c) => ({dx:22*Math.sin(t*0.21 + c.ph), dy:14*Math.sin(t*0.5 + c.ph), rot:0.04*Math.sin(t*0.5 + c.ph + 1), sx:1 + 0.014*Math.sin(t*1.2)})},
  {id:'poisson-lion', x:5290, y:800, len:300, ph:2.0,
    col:(u, t) => 0.045*Math.pow(Math.max(0, 0.45 - u)/0.45, 1.4)*Math.sin(t*2.6 + u*3) + 0.010*Math.sin(t*1.3 + u*9),
    pose:(t, c) => ({dx:18*Math.sin(t*0.17 + c.ph), dy:16*Math.sin(t*0.36 + c.ph), rot:0.04*Math.sin(t*0.36 + c.ph + 1.2)})},
  {id:'napoleon', x:5400, y:560, len:580, ph:3.0, ronde:{x0:2700, x1:5850, v:15, dir:-1},
    col:(u, t) => 0.04*Math.pow(Math.max(0, u - 0.4)/0.6, 1.5)*Math.sin(t*2.3 - u*3),
    pose:(t, c) => ({dy:22*Math.sin(t*0.24 + c.ph), rot:0.03*Math.sin(t*0.24 + c.ph + 1.2)})},
  // ----- grand large : toutes font leur ronde -----
  {id:'baleine-a-bosse', x:7000, y:520, len:720, ph:0.4, ronde:{x0:5950, x1:8380, v:14, dir:-1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, u - 0.5)/0.5, 1.5)*Math.sin(t*1.0 - u*2.5),
    pose:(t, c) => ({dy:30*Math.sin(t*0.18 + c.ph), rot:0.03*Math.sin(t*0.18 + c.ph + 1.2)})},
  {id:'requin-baleine', x:7000, y:1190, len:660, ph:2.3, ronde:{x0:5950, x1:8380, v:16, dir:-1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, u - 0.4)/0.6, 1.5)*Math.sin(t*1.3 - u*3),
    pose:(t, c) => ({dy:24*Math.sin(t*0.2 + c.ph), rot:0.025*Math.sin(t*0.2 + c.ph + 1.2)})},
  {id:'orque', x:7000, y:900, len:610, ph:4.6, ronde:{x0:5950, x1:8380, v:22, dir:-1},
    col:(u, t) => 0.055*Math.pow(Math.max(0, u - 0.45)/0.55, 1.5)*Math.sin(t*1.8 - u*3),
    pose:(t, c) => ({dy:30*Math.sin(t*0.3 + c.ph), rot:0.04*Math.sin(t*0.3 + c.ph + 1.2)})},
  {id:'grand-requin-blanc', x:7000, y:300, len:560, ph:1.2, ronde:{x0:5950, x1:8380, v:26, dir:-1},
    col:(u, t) => 0.06*Math.pow(Math.max(0, u - 0.3)/0.7, 1.5)*Math.sin(t*2.4 - u*3.5),
    pose:(t, c) => ({dy:20*Math.sin(t*0.25 + c.ph), rot:0.03*Math.sin(t*0.25 + c.ph + 1.2)})},
  {id:'raie-manta', x:7000, y:1050, len:560, ph:0.9, ronde:{x0:5950, x1:8380, v:18, dir:1},
    col:(u, t) => 0.065*Math.pow(Math.max(0, 0.7 - u)/0.7, 1.5)*Math.sin(t*1.5 + u*2.5),
    pose:(t, c) => ({dy:34*Math.sin(t*0.75 + c.ph), rot:0.04*Math.sin(t*0.75 + c.ph + 1.4)})},
  {id:'requin-marteau', x:7000, y:1470, len:520, ph:3.4, ronde:{x0:5950, x1:8380, v:24, dir:-1},
    col:(u, t) => 0.065*Math.pow(Math.max(0, u - 0.3)/0.7, 1.5)*Math.sin(t*2.6 - u*3.5),
    pose:(t, c) => ({dy:18*Math.sin(t*0.27 + c.ph), rot:0.03*Math.sin(t*0.27 + c.ph + 1.2)})},
  {id:'requin-bleu', x:7000, y:700, len:500, ph:5.5, ronde:{x0:5950, x1:8380, v:28, dir:-1},
    col:(u, t) => 0.065*Math.pow(Math.max(0, u - 0.3)/0.7, 1.5)*Math.sin(t*2.5 - u*3.5),
    pose:(t, c) => ({dy:20*Math.sin(t*0.24 + c.ph), rot:0.03*Math.sin(t*0.24 + c.ph + 1.2)})},
  {id:'espadon', x:7000, y:420, len:500, ph:2.9, ronde:{x0:5950, x1:8380, v:34, dir:1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, 0.3 - u)/0.3, 1.5)*Math.sin(t*4.0 + u*3),
    pose:(t, c) => ({dy:16*Math.sin(t*0.33 + c.ph), rot:0.025*Math.sin(t*0.33 + c.ph + 1.2)})},
  {id:'dauphin', x:7000, y:235, len:470, ph:4.4, ronde:{x0:5950, x1:8380, v:30, dir:1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, 0.5 - u)/0.5, 1.5)*Math.sin(t*2.6 + u*3),
    pose:(t, c) => ({dy:38*Math.sin(t*0.9 + c.ph), rot:0.09*Math.sin(t*0.9 + c.ph + 1.57)})},
  {id:'thon-rouge', x:7000, y:820, len:470, ph:0.1, ronde:{x0:5950, x1:8380, v:32, dir:1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, 0.35 - u)/0.35, 1.5)*Math.sin(t*5.0 + u*3),
    pose:(t, c) => ({dy:16*Math.sin(t*0.36 + c.ph), rot:0.025*Math.sin(t*0.36 + c.ph + 1.2)})},
  {id:'otarie', x:7000, y:620, len:440, ph:1.8, ronde:{x0:5950, x1:8380, v:24, dir:1},
    col:(u, t) => 0.045*Math.pow(Math.max(0, 0.6 - u)/0.6, 1.5)*Math.sin(t*2.2 + u*3),
    pose:(t, c) => ({dy:30*Math.sin(t*0.6 + c.ph), rot:0.07*Math.sin(t*0.6 + c.ph + 1.5)})},
  {id:'tortue-luth', x:7000, y:1270, len:440, ph:3.9, ronde:{x0:5950, x1:8380, v:13, dir:1},
    row:(v, t) => 0.038*edge2(v)*Math.sin(t*1.2 + (v < 0.5 ? 0 : 2.6)),
    pose:(t, c) => ({dy:24*Math.sin(t*0.6 + c.ph), rot:0.05*Math.sin(t*0.6 + c.ph + 1.3)})},
  {id:'poisson-lune', x:7000, y:1330, len:430, ph:5.9, ronde:{x0:5950, x1:8380, v:9, dir:-1},
    row:(v, t) => 0.050*edge2(v)*Math.sin(t*1.9 + (v < 0.5 ? 0 : 3.1)),                                 // il godille avec ses deux grandes nageoires
    pose:(t, c) => ({dy:18*Math.sin(t*0.3 + c.ph), rot:0.04*Math.sin(t*0.95 + c.ph)})},
  {id:'meduse', x:7000, y:1480, len:430, ph:2.0, ronde:{x0:5950, x1:8380, v:6, dir:1},
    col:(u, t) => 0.030*Math.pow(1 - u, 1.2)*Math.sin(t*1.3 + u*5),
    row:(v, t) => 0.032*Math.pow(v, 1.3)*Math.sin(t*1.1 + v*5),
    pose:(t, c) => { const p = Math.sin(t*1.6 + c.ph);                                                                 // l'ombrelle se contracte, la méduse avance par à-coups
      return {dy:26*Math.sin(t*0.21 + c.ph) - 7*p, sx:1 + 0.030*p, sy:1 - 0.030*p, rot:0.03*Math.sin(t*0.4 + c.ph)}; }},
  {id:'poisson-volant', x:7000, y:175, len:200, ph:3.0, ronde:{x0:5950, x1:8380, v:40, dir:-1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, u - 0.55)/0.45, 1.5)*Math.sin(t*7.0 - u*3),
    pose:(t, c) => ({dy:12*Math.sin(t*0.8 + c.ph), rot:0.04*Math.sin(t*0.8 + c.ph + 1.3)})},
  // ----- abysses : les grandes font leur ronde, les petites restent à leur place -----
  {id:'narval', x:9000, y:180, len:620, ph:0.8, ronde:{x0:8480, x1:10820, v:22, dir:-1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, u - 0.6)/0.4, 1.5)*Math.sin(t*1.8 - u*3),
    pose:(t, c) => ({dy:18*Math.sin(t*0.3 + c.ph), rot:0.03*Math.sin(t*0.3 + c.ph + 1.2)})},
  {id:'baleine-bleue', x:9000, y:420, len:800, ph:2.7, ronde:{x0:8480, x1:10820, v:12, dir:1},
    col:(u, t) => 0.045*Math.pow(Math.max(0, 0.5 - u)/0.5, 1.5)*Math.sin(t*0.9 + u*2.5),
    pose:(t, c) => ({dy:28*Math.sin(t*0.17 + c.ph), rot:0.025*Math.sin(t*0.17 + c.ph + 1.2)})},
  {id:'beluga', x:9000, y:650, len:560, ph:4.9, ronde:{x0:8480, x1:10820, v:20, dir:1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, 0.45 - u)/0.45, 1.5)*Math.sin(t*1.8 + u*3),
    pose:(t, c) => ({dy:22*Math.sin(t*0.35 + c.ph), rot:0.035*Math.sin(t*0.35 + c.ph + 1.2)})},
  {id:'cachalot', x:9000, y:890, len:730, ph:1.5, ronde:{x0:8480, x1:10820, v:13, dir:-1},
    col:(u, t) => 0.045*Math.pow(Math.max(0, u - 0.55)/0.45, 1.5)*Math.sin(t*1.1 - u*2.5),
    pose:(t, c) => ({dy:24*Math.sin(t*0.19 + c.ph), rot:0.025*Math.sin(t*0.19 + c.ph + 1.2)})},
  {id:'calmar-geant', x:9000, y:1110, len:660, nc:90, ph:3.6, ronde:{x0:8480, x1:10820, v:16, dir:1},
    col:(u, t) => 0.045*Math.pow(Math.max(0, 0.6 - u)/0.6, 1.2)*Math.sin(t*1.6 + u*5),                              // les bras et les tentacules traînent et ondulent
    pose:(t, c) => ({dy:20*Math.sin(t*0.3 + c.ph), rot:0.03*Math.sin(t*0.3 + c.ph + 1.2), sx:1 + 0.018*Math.sin(t*1.5)})},
  {id:'requin-du-groenland', x:9000, y:1290, len:570, ph:5.7, ronde:{x0:8480, x1:10820, v:8, dir:-1},
    col:(u, t) => 0.05*Math.pow(Math.max(0, u - 0.35)/0.65, 1.5)*Math.sin(t*1.2 - u*3.2),
    pose:(t, c) => ({dy:14*Math.sin(t*0.15 + c.ph), rot:0.02*Math.sin(t*0.15 + c.ph + 1.2)})},
  {id:'requin-lutin', x:9000, y:1510, len:520, ph:0.2, ronde:{x0:8480, x1:10820, v:15, dir:-1},
    col:(u, t) => 0.06*Math.pow(Math.max(0, u - 0.35)/0.65, 1.5)*Math.sin(t*2.0 - u*3.5),
    pose:(t, c) => ({dy:14*Math.sin(t*0.22 + c.ph), rot:0.025*Math.sin(t*0.22 + c.ph + 1.2)})},
  {id:'poisson-lanterne', x:8900, y:300, len:190, ph:1.1, lueur:[0.143, 0.375, '190,255,170'],
    col:(u, t) => 0.04*Math.pow(Math.max(0, u - 0.6)/0.4, 1.5)*Math.sin(t*3.6 - u*3),
    pose:(t, c) => ({dx:22*Math.sin(t*0.27 + c.ph), dy:14*Math.sin(t*0.5 + c.ph), rot:0.05*Math.sin(t*0.5 + c.ph + 1.1)})},
  {id:'baudroie-abyssale', x:9620, y:1010, len:300, ph:2.2, lueur:[0.117, 0.353, '255,226,120'],
    col:(u, t) => 0.035*Math.pow(Math.max(0, u - 0.6)/0.4, 1.5)*Math.sin(t*3.0 - u*3),
    pose:(t, c) => ({dx:18*Math.sin(t*0.27 + c.ph), dy:14*Math.sin(t*0.5 + c.ph), rot:0.045*Math.sin(t*0.5 + c.ph + 1.1)})},
  {id:'poisson-vipere', x:9180, y:740, len:275, ph:3.3,
    col:(u, t) => 0.030*(0.25 + 0.75*u)*Math.sin(t*2.2 - u*6),
    pose:(t, c) => ({dx:26*Math.sin(t*0.27 + c.ph), dy:16*Math.sin(t*0.5 + c.ph), rot:0.05*Math.sin(t*0.5 + c.ph + 1.1)})},
  {id:'pieuvre-dumbo', x:10060, y:560, len:270, ph:4.4,
    col:(u, t) => 0.040*edge2(u)*Math.sin(t*2.3),                                                                  // les deux « oreilles » battent ensemble
    row:(v, t) => 0.022*smooth(0.5, 1, v)*Math.sin(t*1.3 + v*6),
    pose:(t, c) => ({dx:14*Math.sin(t*0.2 + c.ph), dy:30*Math.sin(t*0.6 + c.ph) - 6*Math.sin(t*2.3), rot:0.05*Math.sin(t*0.4 + c.ph)})},
  {id:'calmar-vampire', x:8760, y:1160, len:270, ph:5.5,
    row:(v, t) => 0.032*Math.pow(v, 1.4)*Math.sin(t*1.2 + v*4),
    pose:(t, c) => { const p = Math.sin(t*1.1 + c.ph); return {dx:16*Math.sin(t*0.23 + c.ph), dy:18*Math.sin(t*0.45 + c.ph) - 5*p, sx:1 + 0.02*p, sy:1 - 0.02*p, rot:0.04*Math.sin(t*0.3 + c.ph)}; }},
  {id:'ctenophore', x:9720, y:330, len:200, ph:0.6,
    row:(v, t) => 0.035*Math.pow(v, 1.5)*Math.sin(t*1.5 + v*6),
    pose:(t, c) => ({dx:20*Math.sin(t*0.17 + c.ph), dy:22*Math.sin(t*0.33 + c.ph), rot:0.16*Math.sin(t*0.21 + c.ph)})},
  {id:'isopode-geant', x:9350, y:1440, len:290, sol:true, ph:1.9,
    row:(v, t, c) => 0.012*c.pas*smooth(0.6, 1, v)*Math.sin(t*8 + v*10),
    pose:(t, c) => { const a = t*0.15 + c.ph; c.pas = smooth(0.2, 0.7, Math.abs(Math.cos(a)));
      return {dx:50*Math.sin(a), dy:-2*c.pas*Math.abs(Math.sin(t*8)), rot:0.012*c.pas*Math.sin(t*4)}; }},
  {id:'ver-tubicole', x:10225, y:1335, len:275, sol:true, ph:2.9,
    row:(v, t) => 0.045*Math.pow(Math.max(0, 0.46 - v)/0.46, 1.2)*Math.sin(t*1.1 + v*5),                              // le panache ondule, le tube reste droit
    pose:(t, c) => ({rot:0.012*Math.sin(t*0.5 + c.ph)})}
];
const LAG_NC = 18, LAG_NR = 18, lagPersp = y => 0.80 + 0.32*clamp((y - 1150)/580, 0, 1);       // les créatures posées plus bas sont plus près : plus grandes
for (const c of LAGON){
  const sp = LAGON_SPR[c.id]; c.w = sp.w; c.h = sp.h; c.pad = Math.ceil(Math.max(sp.w, sp.h)*0.09);
  if (c.col && c.row){ c.cv = document.createElement('canvas'); c.cv.width = sp.w + 2*c.pad; c.cv.height = sp.h + 2*c.pad; c.g = c.cv.getContext('2d'); }
  c.m = sp.m || 0; c.k = c.len*(c.sol ? lagPersp(c.y) : 1)/(sp.w - 2*c.m); c.pas = 0; c.x0 = c.x; c.halo = 0; c.vis = false; c.dragX = null;
}
const lagOrder = LAGON.filter((c) => OPTS.owned.has(c.id)).slice().sort((a, b) => (a.sol ? 1e6 + a.y : -a.len) - (b.sol ? 1e6 + b.y : -b.len));   // les nageuses d'abord (les plus grandes derrière), puis les posées, du fond vers l'avant
let showCreatures = true, hoverC = null, holdC = null, lagT = 0;
// dessine l'image src (l'image de la créature ou son halo, de mêmes dimensions) avec la déformation de la créature
// rec = recouvrement entre bandes voisines : il évite les jours dans l'image, mais doit être nul pour le halo
// (translucide, il se rayerait là où deux bandes se superposent)
function lagBlit(c, src, t, X0, Y0, rec){
  const pad = c.pad, NC = c.nc || LAG_NC, NR = c.nr || LAG_NR;
  if (c.col && c.row){
    // deux passes : colonnes dans un canvas de travail, puis lignes vers l'écran
    const g = c.g; g.clearRect(0, 0, c.cv.width, c.cv.height);
    for (let i = 0; i < NC; i++){
      const x0 = i*c.w/NC, sw = c.w/NC;
      g.drawImage(src, x0, 0, sw, c.h, pad + x0, pad + c.col((i + 0.5)/NC, t, c)*c.h, sw + rec, c.h);
    }
    const sh = c.cv.height/NR;
    for (let j = 0; j < NR; j++){
      const v = clamp(((j + 0.5)*sh - pad)/c.h, 0, 1);
      ctx.drawImage(c.cv, 0, j*sh, c.cv.width, sh, X0 - pad + c.row(v, t, c)*c.w, Y0 - pad + j*sh, c.cv.width, sh + rec);
    }
  } else if (c.col){
    for (let i = 0; i < NC; i++){
      const x0 = i*c.w/NC, sw = c.w/NC;
      ctx.drawImage(src, x0, 0, sw, c.h, X0 + x0, Y0 + c.col((i + 0.5)/NC, t, c)*c.h, sw + rec, c.h);
    }
  } else if (c.row){
    for (let j = 0; j < NR; j++){
      const y0 = j*c.h/NR, sh = c.h/NR;
      ctx.drawImage(src, 0, y0, c.w, sh, X0 + c.row((j + 0.5)/NR, t, c)*c.w, Y0 + y0, c.w, sh + rec);
    }
  } else ctx.drawImage(src, X0, Y0, c.w, c.h);
}
// opacité de l'image, pixel par pixel : sert au halo et à savoir si le doigt touche vraiment la créature
function lagAlpha(c){
  if (c.alpha) return c.alpha;
  const cv2 = document.createElement('canvas'); cv2.width = c.w; cv2.height = c.h;
  const g = cv2.getContext('2d', {willReadFrequently:true}); g.drawImage(lagImg[c.id], 0, 0);
  const d = g.getImageData(0, 0, c.w, c.h).data, a = new Uint8Array(c.w*c.h);
  for (let i = 0; i < a.length; i++) a[i] = d[i*4 + 3];
  return c.alpha = a;
}
// liseré clair et halo doux autour de la silhouette, calculés une seule fois par créature, à la première demande
const HALO_LISERE = 5, HALO_FLOU = 10, HALO_ALPHA = 0.55;                       // en px du panorama
function lagHalo(c){
  if (c.haloCv) return c.haloCv;
  const w = c.w, h = c.h, a = lagAlpha(c), D = new Float32Array(w*h), INF = 1e6;
  for (let i = 0; i < D.length; i++) D[i] = a[i] > 127 ? 0 : INF;
  // distance à la silhouette (deux balayages, pas 1 et 1,414)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
    const i = y*w + x; let d = D[i]; if (d === 0) continue;
    if (x > 0) d = Math.min(d, D[i-1] + 1); if (y > 0){ d = Math.min(d, D[i-w] + 1); if (x > 0) d = Math.min(d, D[i-w-1] + 1.414); if (x < w-1) d = Math.min(d, D[i-w+1] + 1.414); }
    D[i] = d;
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--){
    const i = y*w + x; let d = D[i]; if (d === 0) continue;
    if (x < w-1) d = Math.min(d, D[i+1] + 1); if (y < h-1){ d = Math.min(d, D[i+w] + 1); if (x < w-1) d = Math.min(d, D[i+w+1] + 1.414); if (x > 0) d = Math.min(d, D[i+w-1] + 1.414); }
    D[i] = d;
  }
  const r = HALO_LISERE/c.k, gl = HALO_FLOU/c.k*0.9, cv2 = document.createElement('canvas'); cv2.width = w; cv2.height = h;
  const g = cv2.getContext('2d'), im = g.createImageData(w, h), px = im.data;
  for (let i = 0; i < D.length; i++){
    const d = D[i], ring = clamp(r + 0.5 - d, 0, 1)*0.96, e = (d - r)/gl, glow = d > r ? HALO_ALPHA*Math.exp(-0.5*e*e) : HALO_ALPHA;
    px[i*4] = 255; px[i*4+1] = 250; px[i*4+2] = 236; px[i*4+3] = Math.round(255*Math.max(ring, glow));
  }
  g.putImageData(im, 0, 0);
  return c.haloCv = cv2;
}
// la créature sous le pointeur (la plus en avant d'abord) ; tol = tolérance en px du panorama (le doigt est plus gros que la souris)
function creatureAt(clientX, clientY, tol){
  if (!showCreatures) return null;
  const wx = camX + clientX*(cv.width/VW())/sc, wy = clientY*(cv.height/VH())/sc;
  for (let n = lagOrder.length - 1; n >= 0; n--){
    const c = lagOrder[n]; if (!c.vis) continue;
    const lx = (wx - c.cx)/c.kd*(c.flip ? -1 : 1) + c.w/2, ly = (wy - c.cy)/c.kd + (c.sol ? c.h - c.m : c.h/2), rt = tol/c.kd;
    if (lx < -rt || ly < -rt || lx > c.w + rt || ly > c.h + rt) continue;
    const a = lagAlpha(c);
    for (const [ox, oy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[0.7,0.7],[-0.7,0.7],[0.7,-0.7],[-0.7,-0.7]]){
      const x = Math.round(lx + ox*rt), y = Math.round(ly + oy*rt);
      if (x >= 0 && y >= 0 && x < c.w && y < c.h && a[y*c.w + x] > 60) return c;
    }
  }
  return null;
}
function drawLagon(t, sc, camX, viewW){
  lagT = t;
  for (const c of lagOrder){
    c.vis = false;
    const img = lagImg[c.id]; if (!img.complete || !img.naturalWidth) continue;
    // les grandes nageuses font leur ronde : toujours dans le sens où elles regardent, d'un bout à l'autre de
    // leur zone ; aux deux bouts elles s'éloignent dans le fond (plus petites, estompées) puis reviennent de même
    let far = 0;
    if (c.ronde){
      const R = c.ronde, span = R.x1 - R.x0, u = (((c.ph/6.2832 + t*R.v/span) % 1) + 1) % 1;
      c.x = c.dragX !== null ? clamp(c.dragX, R.x0, R.x1) : (R.dir > 0 ? R.x0 + u*span : R.x1 - u*span);   // tenue au doigt, elle suit le doigt
      far = 1 - smooth(0, R.bord || 320, Math.min(c.x - R.x0, R.x1 - c.x));
    }
    const kf = 1 - 0.4*far, Wd = (c.w - 2*c.m)*c.k*kf, Hd = (c.h - 2*c.m)*c.k*kf;
    if (far > 0.985 || c.x + Wd + 150 < camX || c.x - Wd - 150 > camX + viewW) continue;
    const P = c.pose ? c.pose(t, c) : {}, dx = P.dx || 0, dy = P.dy || 0, rot = P.rot || 0, sx = (P.sx || 1)*kf, sy = (P.sy || 1)*kf;
    c.cx = c.x + dx; c.cy = c.y + dy; c.kd = c.k*kf; c.vis = far < 0.6;
    // ombre au sol
    const ox = (c.x + dx - camX)*sc, oy = (c.ombre || c.y)*sc;
    if ((c.sol || c.ombre) && c.x0 < 8400){
      const lift = c.sol ? clamp(-dy/60, 0, 1) : 0.5;
      ctx.save(); ctx.translate(ox, oy - (c.sol ? Hd*0.06*sc : 0)); ctx.scale(Wd*0.5*sc*(1 - 0.25*lift), Wd*0.085*sc*(1 - 0.25*lift));
      const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      sh.addColorStop(0, `rgba(70,48,20,${(0.30*(1 - 0.5*lift)).toFixed(3)})`); sh.addColorStop(0.6, `rgba(70,48,20,${(0.16*(1 - 0.5*lift)).toFixed(3)})`); sh.addColorStop(1, 'rgba(70,48,20,0)');
      ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU2); ctx.fill(); ctx.restore();
    }
    // le dessin, dans la pose d'ensemble. Une créature posée s'étire à partir de son pied.
    ctx.save();
    if (far > 0) ctx.globalAlpha = 1 - smooth(0.25, 1, far);
    ctx.translate((c.x + dx - camX)*sc, (c.y + dy)*sc); ctx.rotate(rot); ctx.scale(sc*c.k*sx*(c.flip ? -1 : 1), sc*c.k*sy);
    const X0 = -c.w/2, Y0 = c.sol ? -(c.h - c.m) : -c.h/2;
    // le halo d'abord (seulement si la créature est survolée ou tenue), puis l'image, avec la même déformation
    c.halo += ((c === hoverC || c === holdC ? 1 : 0) - c.halo)*0.2;
    if (c.halo > 0.02){
      const a0 = ctx.globalAlpha; ctx.globalAlpha = a0*c.halo; lagBlit(c, lagHalo(c), t, X0, Y0, 0); ctx.globalAlpha = a0;
    }
    lagBlit(c, img, t, X0, Y0, 0.7);
    if (OPTS.brillantes.has(c.id)) OPTS.scintille(ctx, c, X0, Y0, t, sc*c.k);
    if (c.lueur){
      const lx = X0 + c.lueur[0]*c.w, ly = Y0 + c.lueur[1]*c.h, pulse = 0.72 + 0.28*Math.sin(t*1.5 + c.ph)*Math.sin(t*0.37 + c.ph*2);
      ctx.globalCompositeOperation = 'screen';
      for (const [rad, a] of [[c.w*0.62, 0.20], [c.w*0.24, 0.50], [c.w*0.07, 0.85]]){
        const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, rad);
        g.addColorStop(0, `rgba(${c.lueur[2]},${(a*pulse).toFixed(3)})`); g.addColorStop(1, `rgba(${c.lueur[2]},0)`);
        ctx.fillStyle = g; ctx.fillRect(lx - rad, ly - rad, 2*rad, 2*rad);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    // la moule lâche de temps en temps un chapelet de petites bulles
    if (c.bulles){
      ctx.save(); ctx.lineWidth = Math.max(1, 1.5*sc); ctx.strokeStyle = 'rgba(235,250,255,0.75)'; ctx.fillStyle = 'rgba(235,250,255,0.18)';
      for (let b = 0; b < 3; b++){
        const u = ((t*0.16 + b*0.07 + c.ph) % 1); if (u > 0.5) continue;
        const k = u/0.5, bx = c.x + Wd*0.28 + 10*Math.sin(k*9 + b*2), by = c.y - Hd*0.55 - k*(220 + b*35), r = (2.6 + 1.4*b)*(0.6 + 0.4*k);
        ctx.globalAlpha = 1 - smooth(0.7, 1, k);
        ctx.beginPath(); ctx.arc((bx - camX)*sc, by*sc, r*sc, 0, TAU2); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }
  }
}

// ---------- caméra ----------
let camX = 0, vel = 0, dragging = false, lastX = 0, lastT = 0, sc = 1, viewW = 1;
let showRays = true, showFish = true;
function resize(){
  const dpr = OPTS.dpr();
  cv.width = glc.width = Math.round(VW()*dpr); cv.height = glc.height = Math.round(VH()*dpr);
  sc = cv.height / H; viewW = cv.width / sc; clampCam();
}
function clampCam(){ camX = Math.max(0, Math.min(W - viewW, camX)); }
OPTS.on(window, 'resize', resize); resize();
const hint = { classList: { add() {} } };
// Sur une créature : un appui simple ouvre sa fiche ; la souris qui passe dessus, ou le doigt qui reste posé,
// allume son halo ; doigt (ou bouton) enfoncé, on la déplace. Partout ailleurs, on fait glisser l'écran.
let press = null;
const TENIR_MS = 260, BOUGE_PX = 9;
const panStart = e => { dragging = true; vel = 0; lastX = (e.clientX - OPTS.rect().left); lastT = performance.now(); cv.classList.add('drag'); };
const worldAt = e => [camX + (e.clientX - OPTS.rect().left)*(cv.width/VW())/sc, (e.clientY - OPTS.rect().top)*(cv.height/VH())/sc];
cv.addEventListener('pointerdown', e => {
  hint.classList.add('off'); try { cv.setPointerCapture(e.pointerId); } catch (err) {}
  const souris = e.pointerType === 'mouse', c = creatureAt((e.clientX - OPTS.rect().left), (e.clientY - OPTS.rect().top), souris ? 8 : 26);
  if (!c){ press = {mode:'ecran'}; panStart(e); return; }
  const [wx, wy] = worldAt(e);
  press = {mode:'attente', c, x0:(e.clientX - OPTS.rect().left), y0:(e.clientY - OPTS.rect().top), souris, ox:wx - c.x, oy:wy - c.y, timer:0};
  if (souris) holdC = c;                                   // à la souris, le halo est déjà là (survol)
  else press.timer = setTimeout(() => { if (press && press.mode === 'attente'){ press.mode = 'tenu'; holdC = c; } }, TENIR_MS);
});
cv.addEventListener('pointermove', e => {
  if (!press){                                             // souris sans bouton : survol
    if (e.pointerType === 'mouse'){ hoverC = creatureAt((e.clientX - OPTS.rect().left), (e.clientY - OPTS.rect().top), 8); cv.style.cursor = hoverC ? 'pointer' : ''; }
    return;
  }
  if (press.mode === 'attente' || press.mode === 'tenu'){
    if (Math.hypot((e.clientX - OPTS.rect().left) - press.x0, (e.clientY - OPTS.rect().top) - press.y0) < BOUGE_PX) return;
    if (press.mode === 'tenu' || press.souris){ press.mode = 'deplace'; holdC = press.c; cv.classList.add('drag'); }
    else { clearTimeout(press.timer); press.mode = 'ecran'; holdC = null; panStart(e); }     // un glissé vif qui part d'une créature fait glisser l'écran
  }
  if (press.mode === 'deplace'){
    const c = press.c, [wx, wy] = worldAt(e), x = clamp(wx - press.ox, 40, W - 40);
    if (c.ronde) c.dragX = x; else c.x = x;
    c.y = clamp(wy - press.oy, 90, H - 50);
    return;
  }
  if (!dragging) return;
  const now = performance.now(), dx = (e.clientX - OPTS.rect().left) - lastX, k = (cv.width/VW())/sc;
  camX -= dx*k; clampCam();
  const v = -dx*k / Math.max(1, now-lastT) * 1000; vel = vel*0.6 + v*0.4;
  lastX = (e.clientX - OPTS.rect().left); lastT = now;
});
const endDrag = e => {
  if (press){
    clearTimeout(press.timer);
    const c = press.c;
    if (press.mode === 'attente' && e.type === 'pointerup') ouvreFiche(c);
    if (press.mode === 'deplace' && c.ronde){               // elle reprend sa ronde depuis l'endroit où on la lâche
      const R = c.ronde, span = R.x1 - R.x0, x = clamp(c.dragX, R.x0, R.x1), u = R.dir > 0 ? (x - R.x0)/span : (R.x1 - x)/span;
      c.ph = 6.2832*(u - lagT*R.v/span); c.dragX = null;
    }
  }
  press = null; holdC = null; dragging = false; cv.classList.remove('drag');
};
cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
cv.addEventListener('pointerleave', () => { hoverC = null; });
// la fiche : ici une simple fenêtre (image, nom, zone, rareté, anecdote) ; dans l'application, c'est la carte de la collection
const ficheEl = { classList: { add() {}, remove() {} }, addEventListener() {} };
const ZONE_NOM = {lagon:'Le lagon', corail:'Le récif de corail', large:'Le grand large', abysses:'Les abysses'}, RARETE_NOM = {commune:'Commune', rare:'Rare', legendaire:'Légendaire'};
function ouvreFiche(c){ hoverC = null; vel = 0; OPTS.onFiche(c.id); }
ficheEl.addEventListener('click', () => ficheEl.classList.remove('on'));
OPTS.on(window, 'keydown', e => { if (e.key === 'Escape') ficheEl.classList.remove('on'); });
cv.addEventListener('wheel', e => { e.preventDefault(); camX += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY)*1.6/sc*(cv.width/VW()); clampCam(); hint.classList.add('off'); }, {passive:false});
OPTS.on(window, 'keydown', e => { if (e.key === 'ArrowRight') vel = 1800; if (e.key === 'ArrowLeft') vel = -1800; });
const bR = {}, bF = {};
bR.onclick = () => { showRays = !showRays; bR.setAttribute('aria-pressed', showRays); };
bF.onclick = () => { showFish = !showFish; bF.setAttribute('aria-pressed', showFish); };
const bC = {}; bC.onclick = () => { showCreatures = !showCreatures; bC.setAttribute('aria-pressed', showCreatures); };
setTimeout(() => hint.classList.add('off'), 4500);

const zoneEl = { textContent: '' }; let zoneName = '';
let prev = performance.now();
function frame(now){
  if (!VIVANT) return; RAF = requestAnimationFrame(frame); OPTS.mesure?.(now);
  const dt = Math.min(0.05, (now - prev)/1000); prev = now;
  const t = now/1000;
  if (!dragging && Math.abs(vel) > 1){ camX += vel*dt; vel *= Math.exp(-3.2*dt); clampCam(); if (camX <= 0 || camX >= W - viewW) vel = 0; }
  for (const g of groups) stepGroup(g, dt, t);
  for (let i = groups.length - 1; i >= 0; i--) if (finished(groups[i])) groups.splice(i, 1);
  spawnT -= dt; if (spawnT < 0){ spawnTick(); spawnT = R(0.8, 2.2); }
  stepFaune(dt, t);
  stepAbyssParticles(dt);
  stepSub(dt, t);
  stepAbFish(dt, t);
  // Caméra calée sur la grille des pixels de l'écran pendant le dessin : fond WebGL, premier plan
  // et décors avancent ensemble d'un nombre entier de pixels (pas de tremblement relatif quand la
  // glissade ralentit).
  const camVraie = camX; camX = Math.round(camX*sc)/sc;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, cv.width, cv.height);
  drawBackground(t);
  drawFaune(t, sc, camX, viewW);
  drawAbyssParticles(t, sc, camX, viewW);
  if (showFish) drawAbFish(t, sc, camX, viewW);
  drawFumeroles(t, sc, camX, viewW);
  drawDecor('back', t, sc, camX, viewW);
  if (showFish){
    const all = [];
    for (const g of groups) for (const m of g.members) all.push([m, g.dir]);
    all.sort((a,b) => distScale(a[0].x)*a[0].len - distScale(b[0].x)*b[0].len);
    for (const [m, d] of all) drawMember(m, d, sc, camX);
  }
  drawSub(t, sc, camX, viewW);
  for (const tl of front){
    if (tl.x + tl.w < camX || tl.x > camX + viewW) continue;
    const im = frontCanvas(tl); if (!im) continue;
    ctx.drawImage(im, Math.floor((tl.x - camX)*sc), Math.floor(tl.y*sc), Math.ceil(tl.w*sc) + 1, Math.ceil((H - tl.y)*sc) + 1);
  }
  drawDecor('front', t, sc, camX, viewW);
  if (showCreatures) drawLagon(t, sc, camX, viewW);
  drawAlgues(t, sc, camX, viewW);
  if (showRays) drawRays(t, sc, camX, viewW);
  const mid = camX + viewW/2, z = ZONES.find(z => mid >= z.x0 && mid < z.x1) || ZONES[3];
  if (z.name !== zoneName){ zoneName = z.name; zoneEl.textContent = z.name; }
  camX = camVraie;
}
RAF = requestAnimationFrame(frame);
return {
  stop() { VIVANT = false; cancelAnimationFrame(RAF); try { gl?.getExtension("WEBGL_lose_context")?.loseContext(); } catch (e) { void e; } },
  resize() { resize(); },
  get camX() { return camX; },
  set camX(x) { camX = x; clampCam(); },
  get vue() { return { sc, viewW, W, H }; },
  creatureAt(x, y, tol = 26) { return creatureAt(x, y, tol)?.id ?? null; },
  vivantes() { return lagOrder.map((c) => c.id); },
  aller(id) { const c = lagOrder.find((c) => c.id === id); if (c) { vel = 0; camX = c.x - viewW / 2; clampCam(); } },
  ou(id) { const c = lagOrder.find((c) => c.id === id); return c && c.vis ? { x: (c.cx - camX) * sc / (cv.width / VW()), y: c.cy * sc / (cv.height / VH()) } : null; },
};
}
