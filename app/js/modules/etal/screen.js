// MODULE 6 · L'ÉCRAN DE L'ÉTAL DU PÊCHEUR (docs/SPEC.md, section 7 quater). La scène est la maquette validée, transportée telle
// quelle par l'atelier (art/tools/export-etal.mjs -> js/etal/etal-scene.js, images dans assets/etal/) ; ce fichier en est le
// raccord avec l'application :
//  - la scène : le décor (le ciel, la mer, les bateaux, le phare, la lampe, l'étal et la pêche du jour) sous la mascotte, à la
//    place du lagon (qui se met en pause) ; la caisse (le portefeuille, l'argent, la soucoupe), la pluie et les voiles du
//    mauvais temps dans le calque des boutons, sous eux ; le temps qu'il fait est tiré à l'entrée (etal.json, orageDepart),
//    l'orage peut arriver en cours de partie (orageProba, entre orageMin et orageMax minutes), toujours entre deux questions,
//    avec une réplique de la mascotte ; la mascotte est abaissée et rognée au rebord de la fenêtre de la cabane (etal.json,
//    mascotte), le voile de l'orage sur elle ;
//  - un achat par question (`ask`) : le produit s'allume (soulevé, un halo, son ardoise avec lui), la voix dit le produit puis
//    son prix (au premier achat, la consigne d'abord) ; l'enfant ouvre son portefeuille, pose l'argent dans la soucoupe
//    (toucher ou glisser), en reprend, puis touche la coche ; le pêcheur compte, objet par objet, du plus gros au plus petit,
//    avec un halo sur l'objet compté ; juste : il prend l'argent, rend la monnaie s'il le faut (comptée à partir du prix),
//    le produit est emballé ; « pas assez » : il dit ce qui manque, l'enfant complète une fois ; « trop » (compte juste
//    possible) ou une pièce de trop (niveau 6) : il rend ce qui est en trop, l'enfant valide une seconde fois ; sinon la
//    correction : l'argent revient au portefeuille, puis une bonne façon de payer glisse dans la soucoupe pendant qu'il compte ;
//  - niveau 1 : poser la pièce ou le billet demandé ; niveau 7 : le billet est déjà dans la soucoupe, « Combien je te rends ? »
//    au pavé (et au clavier), la correction est le saut sur une ligne graduée, du prix au billet ;
//  - les crans : « plus facile » : le total affiché et dit à chaque objet posé, la valeur écrite sur l'argent, au niveau 7 la
//    ligne d'emblée ; « conseillé » : le total montré au compte, le coquillage (la même aide) ; « plus dur » et « très dur » :
//    ni total ni coquillage ;
//  - « je ne sais pas », « passer » (les corrections et l'exemple guidé), « réécouter » (toucher la mascotte), la pause : comme
//    partout ; la bulle de la mascotte ne couvre jamais la caisse ni les produits allumés (main.js, `obstacles`).
// Renvoie, pour chaque achat, { q, ok, corrigee, code, soucoupe, soucoupe2, rendu, tape, ms, listens, nsp, essais, aide,
// aideDEmblee, correctionPassee, exemplePasse }.
import * as R from "../../art/runtime.js";
import { clock, wait } from "../../engine/clock.js";
import { fill } from "../../engine/phrases.js";
import { onBrief, onTap, pop, skipKey, spriteBox } from "../../engine/ui.js";
import { startEtal, STYLE } from "../../etal/etal-scene.js";
import { compteDit, comptes, enTrop, juger, jugerRendu, montantDit, PRODUITS, rendu, solution } from "./etal.js";

// les boutons de l'étal, posés sur la cabane et le décor (la caisse occupe le bas de l'écran, les produits le milieu) :
// la coche (« J'ai payé »), grande, près de la soucoupe ; le coquillage d'aide sur le mur de la cabane, sous la fenêtre ;
// « je ne sais pas » dans le ciel, sous les étoiles
export const COCHE = [158, 700, 160], AIDE = [150, 528, 130], NSP = [1062, 192, 132];
// les zones que la bulle de la mascotte ne couvre jamais (la caisse : le portefeuille, ouvert ou fermé, la soucoupe ; l'argent
// sorti ; le pavé du niveau 7) et celles qu'elle évite si possible (la glace et ses produits)
export const ZONES = { soucoupe: [276, 556, 660, 800], ferme: [960, 580, 1240, 770], ouvert: [650, 452, 1250, 780], pave: [650, 440, 1250, 780] };
export const GLACE = [300, 318, 1280, 505];
// le pavé du niveau 7 : deux rangées de cinq touches, à la place du portefeuille ; l'ardoise du nombre tapé au-dessus
const KEY = 104, PAD_X = [716, 822, 928, 1034, 1140], PAD_Y = [612, 722], PAD_SLATE = [930, 512];
// la ligne graduée du niveau 7 (correction, aide), sur une plaque claire posée sur la glace
export const LIGNE = { x0: 330, x1: 1170, y: 452 }, PLAQUE = [284, 352, 1216, 584];
const SKIPPED = Symbol("correction passée");

export class EtalScreen {
  constructor(app, content, conf) { this.app = app; this.c = content; this.conf = conf; this.x = null; this.tok = 0; this.attend = false; this.ecoute = []; }
  get actif() { return !!this.x; }
  get api() { return this.x?.api ?? null; }
  // la scène s'installe (au début de la notion du jour, ou de l'entraînement libre)
  async enter({ rnd = Math.random } = {}) {
    const { app } = this, { stage, ocean } = app, E = this.conf, Rg = E.reglages;
    if (!document.getElementById("etal-style")) { const s = document.createElement("style"); s.id = "etal-style"; s.textContent = STYLE; document.head.append(s); }
    this.rnd = rnd;
    // le temps du jour : mauvais une fois sur deux à l'entrée ; sinon, une fois sur deux, l'orage arrive en cours de partie
    // (?meteo=orage|beau|arrive : tests et captures)
    const forcee = new URLSearchParams(location.search).get("meteo");
    const orage = forcee ? forcee === "orage" : rnd() * 100 < Rg.orageDepart;
    this.orageA = orage ? null : forcee === "arrive" ? 8000 : forcee === "beau" ? null : rnd() * 100 < Rg.orageProba ? 60000 * (Rg.orageMin + rnd() * Math.max(0, Rg.orageMax - Rg.orageMin)) : null;
    this.t0 = clock.now(); this.meteoDepart = orage;
    // la pêche du jour : 8 produits sur 12, au hasard, avec des prix de décor (ceux de l'exercice sont posés à chaque question)
    const noms = [...PRODUITS].sort(() => rnd() - 0.5).slice(0, 8), prix = Object.fromEntries(noms.map((n) => [n, 100 * (2 + Math.floor(rnd() * 15))]));
    this.x = startEtal({
      images: "assets/etal/", police: "assets/polices/shantell-sans-600.woff2", reglages: Rg, meteo: orage, peche: [noms, prix],
      derniereReplique: (await app.store?.setting("etalReplique")) ?? -1,
      fige: () => !!app.enPause || clock.paused,
      toucher: () => !app.enPause && !this.verrou,
      on: (cible, type, f, o) => { cible.addEventListener(type, f, o); this.ecoute.push([cible, type, f, o]); },
      change: () => this.onChange?.(),
    });
    const { decor, scene } = this.x;
    stage.root.insertBefore(decor, stage.root.querySelector("#line"));
    // la plaque claire de la ligne graduée (niveau 7) : sous la ligne, sur le décor
    this.plaque = document.createElement("div"); this.plaque.className = "etal-plaque"; stage.root.insertBefore(this.plaque, stage.root.querySelector("#line"));
    Object.assign(this.plaque.style, { left: `${PLAQUE[0] / 12.8}%`, top: `${PLAQUE[1] / 8}%`, width: `${(PLAQUE[2] - PLAQUE[0]) / 12.8}%`, height: `${(PLAQUE[3] - PLAQUE[1]) / 8}%` });
    scene.classList.add("keep"); stage.ui.prepend(scene);
    app.lagon?.pause(true);
    // la mascotte dans la fenêtre de la cabane, abaissée et rognée au rebord (comme dans la maquette)
    ocean.poste?.(E.mascotte);
    this.boutons();
    await this.x.api.pret;
    return true;
  }
  // la scène s'en va (fin de la notion du jour, maison de l'entraînement libre, séance terminée par le parent)
  leave() {
    const { app } = this, etait = !!this.x;
    this.tok++; this.attend = false; this.verrou = true; this.resolve = null; this.onChange = null;
    this.x?.api.stop();
    for (const [cible, type, f, o] of this.ecoute) cible.removeEventListener(type, f, o);
    this.ecoute = [];
    if (this.x) { this.x.decor.width = this.x.decor.height = 0; this.x.decor.remove(); this.x.scene.remove(); }
    this.x = null; this.plaque?.remove(); this.plaque = null;
    for (const b of [this.coche, this.aideB, this.nsp, this.skip, this.slate, ...(this.keys ?? [])]) b?.remove();
    this.coche = this.aideB = this.nsp = this.skip = this.slate = null; this.keys = null;
    if (this.onKey) { removeEventListener("keydown", this.onKey); this.onKey = null; }
    if (etait) { app.ocean.poste?.(null); app.lagon?.pause(false); app.line.clear(); app.line.fxClear(); }
  }
  // ---------------------------------------------------------------- les boutons
  boutons() {
    const { app } = this, { sprites } = app;
    const bouton = ([x, y, s], cls, label, sprite, k = 1) => spriteBox(app, { x: x - s / 2, y: y - s / 2, w: s, h: s, cls: `bubble ${cls}`, label, paint: (ctx, px) => { const q = sprites.frame(sprite, 0), f = (s / 150) * k; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (s / 2) * px + q.dx * f, (s / 2) * px + q.dy * f, q.w * f, q.h * f); } });
    this.coche = bouton(COCHE, "etal-coche check", "j'ai payé", "valider", 1.25);
    this.aideB = bouton(AIDE, "etal-aide help", "aide", "aide");
    this.nsp = bouton(NSP, "etal-nsp nsp", "je ne sais pas", "nsp");
    for (const b of [this.coche, this.aideB, this.nsp]) b.style.visibility = "hidden";
    onBrief(app, this.coche, () => { if (!this.onCoche) return; pop(this.coche); this.onCoche(); }, "valider");
    onBrief(app, this.aideB, () => { if (!this.onAide) return; pop(this.aideB); this.onAide(); }, "aide");
    onBrief(app, this.nsp, () => { if (!this.onNsp) return; pop(this.nsp); this.onNsp(); }, "nsp");
  }
  // le pavé du niveau 7 (et le clavier de l'ordinateur) ; l'ardoise du nombre tapé
  pave(v) {
    const { app } = this, { sprites } = app;
    if (v && !this.keys) {
      this.keys = [];
      const small = (name, k) => (ctx, px) => { const q = sprites.frame(name, 0); ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (KEY / 2) * px + q.dx * k, (KEY / 2) * px + q.dy * k, q.w * k, q.h * k); };
      const tap = (d, b) => { if (!this.onTape) return; const t = performance.now(); if (b.__t && t - b.__t < (app.toucher?.doubleMs ?? 150)) return; b.__t = t; pop(b); this.onTape(d); };
      for (let d = 0; d <= 9; d++) {
        const b = spriteBox(app, { x: PAD_X[d % 5] - KEY / 2, y: PAD_Y[Math.floor(d / 5)] - KEY / 2, w: KEY, h: KEY, cls: "bubble key etal-key", label: String(d), paint: (ctx, px) => { small("reponse", 0.84)(ctx, px); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawNumber(ctx, String(d), KEY / 2, KEY / 2 - 23, 46, { w: 7, seed: 900 + d }); } });
        b.dataset.key = String(d); onTap(b, () => tap(String(d), b)); this.keys.push(b);
      }
      const del = spriteBox(app, { x: PAD_SLATE[0] + 170 - KEY / 2, y: PAD_SLATE[1] - KEY / 2, w: KEY, h: KEY, cls: "bubble key etal-key", label: "effacer", paint: small("effacer", 0.75) });
      del.dataset.key = "effacer"; onBrief(app, del, () => tap("effacer", del), "effacer", { first: true }); this.keys.push(del);
      this.slate = spriteBox(app, { x: PAD_SLATE[0] - 110, y: PAD_SLATE[1] - 42, w: 220, h: 84, cls: "hud etal-ardoise", still: true, paint: (ctx, px) => this.paintSlate(ctx, px) });
      this.onKey = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || app.parent?.root?.isConnected || app.enPause || !this.onTape) return;
        const k = /^[0-9]$/.test(e.key) ? e.key : /^Numpad[0-9]$/.test(e.code) ? e.code.slice(6) : e.key === "Backspace" ? "effacer" : e.key === "Enter" ? "valider" : null;
        if (!k) return; e.preventDefault();
        if (k === "valider") { if (this.coche.style.visibility === "visible") { pop(this.coche); this.onCoche?.(); } return; }
        tap(k, this.keys.find((b) => b.dataset.key === k));
      };
      addEventListener("keydown", this.onKey);
    }
    for (const b of [...(this.keys ?? []), this.slate]) if (b) b.style.visibility = v ? "visible" : "hidden";
  }
  paintSlate(ctx, px) {
    ctx.setTransform(px, 0, 0, px, 0, 0);
    R.drawPanel(ctx, 4, 4, 212, 76);
    const t = this.tape || "?", w = R.wordWidth?.(t) ?? t.length * 0.6, em = 46;
    R.drawNumber(ctx, t, 96, 18, em, { w: 6.5, seed: 77, ...(this.tape ? {} : { color: R.RED }) });
    ctx.font = '600 38px "Shantell Sans", "Comic Sans MS", cursive'; ctx.fillStyle = "#1b1612"; ctx.textBaseline = "middle";
    ctx.fillText("€", 96 + (w * em) / 2 + 12, 43);
  }
  // ---------------------------------------------------------------- pour la bulle de la mascotte
  obstacles() {
    if (!this.api) return [];
    const e = this.api.etat(), out = [ZONES.soucoupe];
    if (this.q?.type === "rendre") out.push(ZONES.pave); else out.push(e.pf === "ferme" ? ZONES.ferme : ZONES.ouvert);
    out.push(...this.api.boites()); // (l'argent sorti, au-dessus du portefeuille, et celui de la soucoupe)
    out.push(...this.api.allumes()); // (le produit allumé et son ardoise : la voix en parle)
    if (this.ligneVue) out.push(PLAQUE);
    return out;
  }
  souples() { return this.api ? [GLACE] : []; }
  // « passer » pendant une correction ou l'exemple guidé : la voix se tait, les gestes finissent vite
  passable(on) {
    const { app } = this;
    if (!on) { this.skip?.remove(); this.skip = null; return; }
    if (this.skipped || this.skip) return;
    this.skip = skipKey(app, () => { this.skipped = true; this.skippedOnce = true; app.voice.stop(); this.api?.vitesse(8); this.abortFix?.(); });
  }
  dire(t, o) { return this.skipped || !t ? Promise.resolve() : this.app.voice.say(t, o); }
  // ---------------------------------------------------------------- l'orage, entre deux questions
  async orage() {
    if (this.orageA == null || clock.now() - this.t0 < this.orageA || !this.api) return;
    this.orageA = null;
    const { app } = this, r = this.api.orage(), g = clock.hold();
    app.store?.setSetting("etalReplique", r.k);
    (window.__etalOrage ??= []).push({ t: Math.round(clock.now() - this.t0), k: r.k });
    await wait(700).then(g);
    app.ocean.mascotte.play("encourager");
    await app.voice.say(app.text.data.etalOrage[r.k]).then(g);
  }
  // ---------------------------------------------------------------- les produits de la question
  // le produit (ou les deux) de la question à l'étal, à son prix ; celui acheté à la question d'avant est remplacé
  installer(q) {
    const api = this.api, P = api.peche(), noms = P.map((p) => p.n), remplacer = [], prix = {}, allumes = [];
    const libres = () => PRODUITS.filter((n) => !noms.includes(n) && !(q.produits ?? []).includes(n));
    const decor = () => { const ps = this.c.niveaux[1].prix; return 100 * (Math.floor(ps[0] / 100) + Math.floor(this.rnd() * ((ps[1] - ps[0]) / 100 + 6))); };
    for (const i of this.vendus ?? []) { const n = libres()[Math.floor(this.rnd() * libres().length)]; if (n) { remplacer.push([i, n, decor()]); noms[i] = n; } }
    this.vendus = [];
    // le produit allumé est toujours dans une colonne des bords (places 0, 3, 4, 7) : l'argent sorti du portefeuille, au-dessus
    // de la glace, couvre les deux colonnes du milieu. Déjà au milieu, il change de place avec un autre produit.
    const bord = (j) => j % 4 === 0 || j % 4 === 3, demandes = q.produits ?? [];
    demandes.forEach((n, k) => {
      let i = noms.indexOf(n);
      if (i < 0 || !bord(i)) {
        const j = i, cible = [0, 3, 4, 7].filter((x) => !allumes.includes(x) && !demandes.includes(noms[x]));
        i = cible[Math.floor(this.rnd() * cible.length)];
        if (j >= 0) { const n2 = noms[i]; remplacer.push([j, n2, decor()]); noms[j] = n2; }
        remplacer.push([i, n, 0]); noms[i] = n;
      }
      prix[i] = q.prixProduits?.[k] ?? q.prix; allumes.push(i);
    });
    api.question({ remplacer, prix, allumes });
    this.allumes = allumes;
  }
  // ce que dit le pêcheur pour une question
  phrase(q) {
    const T = this.app.text.data, M = (c) => montantDit(T, c), P = (n) => T.etalProduit[n];
    if (q.type === "poser") return T.etalPoser[q.valeur];
    if (q.type === "deux") { const [a, b] = q.produits; return `${T.etalPaire} ${P(a).nom} ${M(q.prixProduits[0])} ${P(b).nom} ${M(q.prixProduits[1])} ${T.etalPaieLesDeux}`; }
    const base = `${P(q.produits[0]).achete} ${P(q.produits[0]).coute} ${M(q.prix)}`;
    return q.type === "rendre" ? `${base} ${T.etalRendre[q.billet]}` : base;
  }
  consigne(q) { const T = this.app.text.data.etalConsigne; return q.niveau >= 9 ? T.centimes : T[q.type]; }
  // ---------------------------------------------------------------- une question
  async ask(q) {
    const { app } = this, { voice, ocean } = app, api = this.api, g = clock.hold(), tok = ++this.tok, vivant = () => tok === this.tok, mort = () => new Promise(() => {});
    this.q = q; this.attend = false; this.verrou = true; api.verrou(true); this.passable(false); this.skipped = false; this.skippedOnce = false; app.fleche?.cacher();
    this.boutonsVus(false); this.ligne(null); api.vitesse(1);
    await this.orage(); if (!vivant()) return mort();
    const cfg = this.c.niveaux[q.niveau - 1], effet = this.c.crans[q.cran] ?? {};
    this.installer(q);
    api.visible(q.type !== "rendre");
    api.remplir(q.portefeuille ?? []);
    if (q.type === "rendre") await api.poserMonnaie(q.billet, { aussitot: true });
    const facile = effet.total === "toujours";
    api.totalVu(facile); api.etiquettes(!!effet.etiquettes); this.aide = false; this.direTotal = facile && q.type !== "poser" && q.type !== "rendre";
    app.starFrom = [468, 690];
    // la consigne au premier achat (et quand le genre de question change), puis le produit et son prix
    const nouv = q.premier || this.dernierType !== `${q.type}${q.niveau >= 9}`; this.dernierType = `${q.type}${q.niveau >= 9}`;
    const question = this.phrase(q), tout = nouv ? `${this.consigne(q)} ${question}` : question;
    voice.instruction = `${this.consigne(q)} ${question}`;
    if (q.guide) return this.exemple(q, cfg, voice.say(tout, { instruction: true }), vivant);
    const dit = voice.say(tout, { instruction: true });
    let t0 = null; dit.then(() => { t0 ??= clock.now(); });
    const res = { q, ok: false, corrigee: false, code: null, nsp: false, soucoupe: null, essais: 0, aide: false, aideDEmblee: facile };
    const temps = () => { if (!res.ms) res.ms = t0 == null ? 0 : Math.max(0, Math.round(clock.now() - t0)); };
    // le niveau 7 : le pavé, la ligne d'emblée au cran « plus facile »
    if (q.type === "rendre") {
      this.pave(true); this.tape = ""; this.slate.repaint();
      if (effet.ligneDEmblee) { await dit.then(g); if (!vivant()) return mort(); await this.ligne(q, { saut: false }); }
      const r = await this.attendre({ rendre: true, q, aideOk: effet.total === "compte" });
      if (!vivant()) return mort();
      temps(); res.essais = 1; res.aide = this.aide;
      if (r.nsp) { res.nsp = true; res.code = "NSP"; }
      else { res.tape = Number(this.tape); const j = jugerRendu(q, res.tape); res.ok = j.ok; res.code = j.code ?? null; }
      this.pave(false);
      await this.finRendre(q, res, g); if (!vivant()) return mort();
      return this.fin(res);
    }
    // payer : le portefeuille, la soucoupe, la coche ; deux essais
    for (let essai = 1; essai <= (this.c.essais ?? 2); essai++) {
      const r = await this.attendre({ q, aideOk: effet.total === "compte" });
      if (!vivant()) return mort();
      temps(); res.aide = res.aide || this.aide;
      if (r.nsp) { res.nsp = true; res.code = "NSP"; break; }
      res.essais = essai;
      const vs = api.soucoupe(); if (essai === 1) res.soucoupe = vs; else res.soucoupe2 = vs;
      await this.compter(effet, g); if (!vivant()) return mort();
      const j = juger(cfg, q, vs);
      if (j.ok) { res.ok = essai === 1; res.corrigee = essai > 1; if (j.rendu) res.rendu = j.rendu; await this.vendu(q, j, g); if (!vivant()) return mort(); return this.fin(res); }
      if (!res.code) res.code = j.code;
      app.sound?.play("erreur"); ocean.mascotte.play("encourager");
      const T = app.text.data;
      // deuxième essai : compléter (pas assez), ou valider de nouveau après que le pêcheur a rendu ce qui était en trop
      if (essai < (this.c.essais ?? 2) && ["M1", "M2", "M3"].includes(j.code)) {
        if (j.code === "M1") await voice.say(`${T.etalManque} ${montantDit(T, j.manque)} ${T.etalComplete}`).then(g);
        else {
          const objs = api.objets().sort((a, b) => a.ordre - b.ordre), idx = enTrop(cfg, q.prix, objs.map((o) => o.v)), rend = idx.map((i) => objs[i]);
          await voice.say(j.code === "M2" ? T.etalTrop : rend.length > 1 ? T.etalGardeLes : T.etalGardeLa).then(g);
          rend.forEach((o) => api.halo(o)); await wait(500).then(g); await api.rendre(rend).then(g);
          await voice.say(T.etalEssaieEncore).then(g);
        }
        if (!vivant()) return mort();
        api.sansHalo(); api.totalVu(facile || this.aide);
        continue;
      }
      break;
    }
    await this.correction(q, cfg, res, g); if (!vivant()) return mort();
    return this.fin(res);
  }
  fin(res) {
    const { app } = this;
    res.listens = app.voice.listens; res.correctionPassee = !!this.skippedOnce;
    this.skippedOnce = false; this.passable(false); this.api?.vitesse(1); this.boutonsVus(false); this.ligne(null);
    if (res.nsp) res.code = "NSP"; if (res.ok) res.code = null;
    return res;
  }
  boutonsVus(v, { coche = false, aide = false } = {}) {
    if (!this.coche) return;
    this.nsp.style.visibility = v ? "visible" : "hidden";
    this.coche.style.visibility = v && coche ? "visible" : "hidden";
    this.aideB.style.visibility = v && aide ? "visible" : "hidden";
  }
  // attendre le geste de l'enfant : la coche (la soucoupe n'est pas vide ; au niveau 7, un nombre est tapé), ou « je ne sais
  // pas » ; le coquillage (cran conseillé) montre le total et la valeur de l'argent, et le pêcheur compte à chaque objet posé
  attendre({ rendre = false, q, aideOk = false }) {
    const { app } = this, api = this.api, T = app.text.data;
    this.verrou = false; api.verrou(false); this.attend = true;
    const peutValider = () => (rendre ? !!this.tape : api.soucoupe().length > 0);
    const maj = () => this.boutonsVus(true, { coche: peutValider(), aide: aideOk && !this.aide });
    maj();
    return new Promise((res) => {
      const fini = (x) => { this.attend = false; this.verrou = true; api.verrou(true); this.onCoche = this.onNsp = this.onAide = this.onChange = this.onTape = null; this.boutonsVus(false); res(x); };
      this.onCoche = () => { if (peutValider()) { app.voice.stop(); fini({}); } };
      this.onNsp = () => { app.voice.stop(); fini({ nsp: true }); };
      this.onAide = () => {
        this.aide = true; maj(); app.voice.stop();
        if (rendre) { app.voice.say(fill(T.etalAideRendre, { a: q.prix / 100, b: q.billet / 100 })); this.ligne(q, { saut: false }); return; }
        api.totalVu(true); api.etiquettes(true); this.direTotal = true; app.voice.say(T.etalAide);
      };
      // la soucoupe a changé : la coche apparaît ; au cran « plus facile » et avec l'aide, le pêcheur dit le total
      this.onChange = () => { maj(); if (this.direTotal && !rendre) { const t = api.total(); app.voice.stop(); if (t) app.voice.say(montantDit(T, t)); } };
      this.onTape = !rendre ? null : (k) => { if (k === "effacer") this.tape = this.tape.slice(0, -1); else if (this.tape.length < 2) this.tape += k; this.slate.repaint(); maj(); };
    });
  }
  // le pêcheur compte ce qu'il y a dans la soucoupe, objet par objet, du plus gros au plus petit, un halo sur l'objet compté ;
  // au cran conseillé, le total s'écrit au-dessus de la soucoupe à la fin du compte
  async compter(effet, g) {
    const { app } = this, api = this.api, T = app.text.data, objs = api.objets(), sous = comptes(objs.map((o) => o.v));
    if (this.q.type === "poser") return;
    for (let i = 0; i < objs.length; i++) {
      api.halo(objs[i]);
      await Promise.all([app.voice.say(compteDit(T, sous[i], i === objs.length - 1)), wait(350)]).then(g);
      api.halo(objs[i], false);
    }
    if (effet.total === "compte") api.totalVu(true);
  }
  // juste : il prend l'argent, rend la monnaie (comptée à partir du prix), emballe le produit
  async vendu(q, j, g) {
    const { app } = this, api = this.api, T = app.text.data;
    app.sound?.play("bonne"); app.ocean.mascotte.play("rejouir");
    if (q.type === "poser") { await app.voice.say(app.text.pick("bravo")).then(g); await api.rendre().then(g); return; }
    await Promise.all([app.voice.say(app.text.pick("etalMerci")), api.prendre()]).then(g);
    if (j.rendu) await this.rendreMonnaie(q.prix, j.rendu, g);
    api.totalVu(false);
    await api.emballer().then(g);
    this.vendus = [...this.allumes];
  }
  // le pêcheur rend la monnaie en comptant à partir du prix (« 13… 15… 20 »), puis elle rejoint le portefeuille
  async rendreMonnaie(prix, montant, g) {
    const { app } = this, api = this.api, T = app.text.data, ps = rendu(montant), sous = comptes(ps, prix);
    await this.dire(T.etalJeRends).then(g);
    await this.dire(compteDit(T, prix)).then(g);
    for (let i = 0; i < ps.length; i++) { const it = await api.poserMonnaie(ps[i]).then(g); api.halo(it); await this.dire(compteDit(T, sous[i], i === ps.length - 1)).then(g); api.halo(it, false); }
    await this.dire(`${T.etalJeTeRends} ${montantDit(T, montant)}`).then(g);
    await api.rangerRendu().then(g);
  }
  // la correction : l'argent de l'enfant revient au portefeuille, puis une bonne façon de payer glisse dans la soucoupe
  // pendant que le pêcheur compte ; « passer » l'arrête
  async correction(q, cfg, res, g) {
    const { app } = this, api = this.api, T = app.text.data;
    this.passable(true); api.vitesse(this.skipped ? 8 : app.vitesse ?? 1);
    const vs = api.soucoupe();
    const pourquoi = res.nsp ? T.erreur.NSP : res.code === "M4" ? T.etalValeur : res.code === "M7" && vs.length === 1 ? T.etalCestUn[vs[0]] : T.erreur.autre;
    if (!res.nsp) app.ocean.mascotte.play("encourager");
    await this.dire(pourquoi).then(g);
    api.sansHalo(); await api.rendre().then(g);
    await this.payerPourToi(q, cfg, g, { phrase: q.type === "poser" ? T.etalCestCeluiLa[q.valeur] : T.etalCorrection });
    await wait(this.skipped ? 200 : 900).then(g);
    await api.rendre().then(g); api.totalVu(false); api.eteindre();
  }
  // une bonne façon de payer, posée objet par objet et comptée (correction, exemple guidé)
  async payerPourToi(q, cfg, g, { phrase }) {
    const { app } = this, api = this.api, T = app.text.data, sol = solution(cfg, q.prix ?? 0, q.portefeuille ?? [], q.valeur) ?? [];
    await this.dire(phrase).then(g);
    const tri = [...sol].sort((a, b) => b - a), sous = comptes(tri);
    for (let i = 0; i < tri.length; i++) {
      const it = await api.deposer(tri[i]).then(g); if (!it) continue;
      await wait(this.skipped ? 60 : 380).then(g);
      if (q.type !== "poser") { api.halo(it); await this.dire(compteDit(T, sous[i], i === tri.length - 1)).then(g); api.halo(it, false); }
    }
  }
  // le niveau 7 : juste, le pêcheur prend le billet et rend la monnaie en comptant ; faux (M5, M6, « je ne sais pas ») : le saut
  // sur la ligne, du prix au billet (« 13… 20, ça fait 7 euros. »)
  async finRendre(q, res, g) {
    const { app } = this, api = this.api, T = app.text.data, m = q.billet - q.prix;
    if (res.ok) {
      app.sound?.play("bonne"); app.ocean.mascotte.play("rejouir"); this.ligne(null);
      await Promise.all([app.voice.say(app.text.pick("bravo")), api.prendre()]).then(g);
      await this.rendreMonnaie(q.prix, m, g);
      await api.emballer().then(g); this.vendus = [...this.allumes];
      return;
    }
    if (!res.nsp) { app.sound?.play("erreur"); app.ocean.mascotte.play("encourager"); }
    this.passable(true);
    await this.dire(res.nsp ? T.erreur.NSP : res.code === "M5" ? T.etalRendPrix : T.erreur.autre).then(g);
    await this.ligne(q, { saut: true, g });
    await wait(this.skipped ? 200 : 900).then(g);
    this.ligne(null); api.eteindre();
  }
  // la ligne graduée du niveau 7, du prix au billet, de un en un, sur sa plaque claire ; `saut` : la tortue saute du prix au
  // billet (« 13… 20, ça fait 7 euros. ») ; null : rangée
  async ligne(q, { saut = false, g = (p) => p } = {}) {
    const { app } = this, { line } = app, nl = app.lineScreen();
    if (!q) { if (this.ligneVue) { nl.turtle.hide(); nl.arcs = []; line.fxClear(); line.clear(); this.plaque?.classList.remove("vue"); this.ligneVue = false; this.api?.cacher(false); this.api?.rallumer(); } return; }
    const a = q.prix / 100, b = q.billet / 100, n = b - a + 1, T = app.text.data;
    const spec = { x0: LIGNE.x0, x1: LIGNE.x1, y: LIGNE.y, n, labels: Array.from({ length: n }, (_, i) => (n <= 12 || i === 0 || i === n - 1 || (a + i) % 5 === 0 ? String(a + i) : "")), k: 0, lit: [0, n - 1] };
    const [bmp] = await line.render([spec]); line.show(bmp);
    this.plaque.classList.add("vue"); this.ligneVue = true; this.api.eteindre(); this.api.cacher(true);
    nl.spec = spec; nl.q = { min: a, max: b, step: 1 }; nl.arcs = []; nl.overlay = []; line.fxClear();
    nl.turtle.speed = app.vitesse ?? 1; nl.turtle.sitOn(spec, 0);
    if (!saut) return;
    await this.dire(String(a)).then(g);
    await this.sauter().then(g);
    await this.dire(String(b)).then(g);
    await this.dire(`${T.etalCaFait} ${montantDit(T, q.billet - q.prix)}`).then(g);
  }
  // la tortue saute d'un coup du prix au billet, un grand arc marqué « + 7 » (la ligne est à l'écran)
  async sauter() {
    const nl = this.app.lineScreen(), spec = nl.spec, n = spec.n, a = nl.q.min, b = nl.q.max;
    const p = nl.turtle.seat(0), r = nl.turtle.seat(n - 1), arc = { a: [p[0], p[1] + 4], b: [r[0], r[1] + 4], h: Math.min(70, 22 + Math.abs(r[0] - p[0]) * 0.45) - 4, label: `+${b - a}`, live: true, p: 0 };
    nl.arcs.push(arc);
    await nl.turtle.jump(n - 1);
    arc.live = false; arc.p = 1; nl.paintFx(true);
  }
  // l'exemple guidé : le pêcheur paie à la place de l'enfant en comptant (niveau 7 : le saut sur la ligne) ; « passer » l'arrête
  async exemple(q, cfg, dit, vivant) {
    const { app } = this, api = this.api, g = clock.hold(), T = app.text.data;
    this.passable(true);
    await dit.then(g); if (!vivant()) return new Promise(() => {});
    api.vitesse(app.vitesse ?? 1);
    if (q.type === "rendre") { await this.dire(T.etalExemple).then(g); await this.ligne(q, { saut: true, g }); }
    else {
      await this.payerPourToi(q, cfg, g, { phrase: q.type === "poser" ? T.etalCestCeluiLa[q.valeur] : T.etalExemple });
      if (q.type === "monnaie") { const s = api.total(); if (s > q.prix) { await api.prendre().then(g); await this.rendreMonnaie(q.prix, s - q.prix, g); } }
    }
    await wait(this.skipped ? 100 : 700).then(g);
    await api.rendre().then(g); this.ligne(null); api.eteindre();
    // (le portefeuille se referme : c'est à l'enfant de l'ouvrir)
    await api.fermer().then(g);
    if (!this.skipped) await app.voice.say(app.text.pick("aToi")).then(g);
    const passe = this.skippedOnce; this.skippedOnce = false; this.passable(false); api.vitesse(1);
    return { q, ok: true, ms: 0, listens: app.voice.listens, exemplePasse: passe, essais: 0 };
  }
}
