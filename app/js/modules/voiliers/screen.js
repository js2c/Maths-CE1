// MODULE 4 · L'ÉCRAN DES VOILIERS (docs/SPEC.md, section 7 bis). La scène est la maquette validée, transportée telle quelle
// par l'atelier (art/tools/export-voiliers.mjs -> js/voiliers/voiliers-scene.js, images dans assets/voiliers/) ; ce fichier
// en est le raccord avec l'application :
//  - la scène : ses trois canvas (la mer en WebGL, les bateaux et les bouées, les effets) au-dessus du lagon, qui se met en
//    pause (c'est une scène de surface), sous la mascotte et les boutons ; son temps est celui de la séance (tout s'arrête
//    pendant la pause) ; la qualité de la mer baisse quand le temps d'image moyen dépasse 20 ms, et remonte ;
//  - un bateau par question (`ask`) : il arrive, la voix dit son nombre (au premier bateau, la consigne d'abord ; quand la
//    mer change, l'annonce) et la bulle l'écrit en chiffres et en lettres ; au calme, il attend à droite du centre et se
//    touche aussitôt ; avec le vent et les pirates, ils ne partent qu'une fois le nombre dit ;
//  - le geste : le bateau lâché dans un passage (ou poussé par le vent, ou rattrapé par les pirates). Bon passage : il
//    passe (« Bravo ! », ou « C'est entre 40 et 50 ! » entre deux bouées rondes voisines) ; mauvais : la ou les bouées
//    s'allument et la voix explique (voiliers.js, `explication`), puis au calme le bateau revient attendre, au vent une
//    rafale le repousse, avec les pirates il est rattrapé et coule ; au deuxième échec (calme, vent), il va seul au bon
//    passage pendant que la voix dit pourquoi ;
//  - le double encadrement (niveau 9) : la bonne centaine franchie, la caméra recule, « Et maintenant, entre quelles
//    dizaines ? » ; chaque rangée a ses deux essais ;
//  - « je ne sais pas » (en bas à droite) : le bateau va seul au bon passage, la voix rassure et explique ; « passer »
//    (en haut à droite) sur les explications et l'exemple guidé : la voix se tait, le bateau finit vite son geste ;
//    « réécouter » redit la consigne et le nombre ;
//  - la mascotte : petite joie au bon passage, déception bienveillante puis encouragement à l'erreur ; sa bulle ne couvre
//    jamais le bateau (main.js : `obstacles`).
// Renvoie, pour chaque bateau, { q, ok, corrigee, demi, code, nsp, rattrape, choisi, ms, listens, essais, correctionPassee }.
import { clock } from "../../engine/clock.js";
import { fill, ecritEnLettres } from "../../engine/phrases.js";
import { onBrief, pop, skipKey, spriteBox } from "../../engine/ui.js";
import { NSP_AT } from "../numberline/screen.js";
import { startVoiliers } from "../../voiliers/voiliers-scene.js";
import { codeErreur, entre, explication, passage, pourquoi } from "./voiliers.js";

// le point d'attente du bateau (la maquette : 430, 410 ; décision du parent du 6 octobre 2026 : à droite du centre, pour que
// la bulle de la mascotte, en haut à gauche, ne cache jamais la voile) ; avec le vent et les pirates, le bateau s'arrête
// au-dessus d'un passage dont le centre est à droite de ATTENTE_X_MIN quand il y en a un
export const ATTENTE = { x: 880, y: 410 }, ATTENTE_X_MIN = 600;
// la bande des bouées : ce que l'enfant vise (la bulle ne la couvre jamais)
export const BANDE_BOUEES = [0, 600, 1280, 800];
// le nombre du bateau, dans la bulle : en chiffres et en lettres (« 347 « trois-cent-quarante-sept » »)
export const bulleNombre = (t) => t.replace(/(^|\s)(\d{1,3})$/, (m, sp, n) => `${sp}${n} « ${ecritEnLettres(Number(n))} »`);
// la qualité de la mer : un cran de moins si l'intervalle moyen des dernières images dépasse 20 ms (au moins 10 images, et
// 3 s à ce cran), un de plus s'il passe sous `remonteSousMs` (au moins 30 images et 4 s à ce cran) ; `gaps` : les
// intervalles retenus (ms ; une image très lente compte : sur une tablette lente, c'est elle qu'il faut alléger), `depuis` :
// ms à ce cran
export function qualiteSuivante(q, gaps, depuis, { remonteSousMs = 14, max = 2 } = {}) {
  if (gaps.length < 10 || depuis < 3000) return q;
  const m = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  if (m > 20 && q > 0) return q - 1;
  if (m < remonteSousMs && q < max && gaps.length >= 30 && depuis >= 4000) return q + 1;
  return q;
}

export class VoiliersScreen {
  constructor(app, content) { this.app = app; this.c = content; this.api = null; this.tok = 0; this.attend = false; this.locked = true; this.resolve = null; }
  get actif() { return !!this.api; }
  // la scène s'installe (au début de la notion du jour, ou de l'entraînement libre)
  async enter() {
    const { app } = this, { stage } = app;
    this.donnees ??= await (await fetch("assets/voiliers/donnees.json")).json();
    const mk = (cls) => { const c = document.createElement("canvas"); c.className = `voiliers ${cls}`; return c; };
    this.cv = { gl: mk("voiliers-mer"), gs: mk("voiliers-bateaux"), fx: mk("voiliers-effets") };
    const line = stage.root.querySelector("#line");
    for (const c of Object.values(this.cv)) stage.root.insertBefore(c, line);
    app.lagon?.pause(true);
    this.ecoute = [];
    const gaps = []; let last = 0, t0 = 0, depuis = 0;
    const Q = this.c.qualite ?? {};
    this.api = startVoiliers({
      racine: stage.root, ...this.cv, donnees: this.donnees,
      echelle: () => stage.k, temps: () => clock.now() / 1000, fige: () => !!app.enPause || clock.paused,
      toucher: (e) => this.attend && !app.enPause && !e.target?.closest?.("button"),
      on: (cible, type, f, o) => { cible.addEventListener(type, f, o); this.ecoute.push([cible, type, f, o]); },
      attente: ATTENTE, attenteXMin: ATTENTE_X_MIN, ventMs: (this.c.mer?.ventS ?? 7) * 1000, piratesK: this.c.mer?.piratesPlusRapides ?? 1.3,
      qualite: this.qual ?? Q.depart ?? 1,
      // l'allègement : la qualité de la mer suit le temps d'image (les 3 premières secondes, et un intervalle de plus de 3 s,
      // onglet caché, ne comptent pas ; pendant la pause, la scène ne mesure rien)
      mesure: (t) => {
        t0 ||= t; depuis ||= t; if (last && t - last > 0 && t - last < 3000) gaps.push(t - last); last = t; if (gaps.length > 60) gaps.shift();
        if (t - t0 < 3000 || !this.api) return;
        const q = this.api.qual, n = qualiteSuivante(q, gaps, t - depuis, { remonteSousMs: Q.remonteSousMs ?? 14 });
        if (n !== q) { this.api.qualite(n); this.qual = n; depuis = t; gaps.length = 0; (window.__voiliersQualite ??= []).push({ t: Math.round(t), de: q, a: n }); }
      },
      sansWebGL: () => { this.sansWebGL = true; },
    });
    if (!this.api) { this.leave(); return false; }
    // « je ne sais pas », à sa place habituelle ; visible tant qu'un bateau attend le geste
    this.nsp = spriteBox(app, { x: NSP_AT[0] - 75, y: NSP_AT[1] - 75, w: 150, h: 150, cls: "bubble nsp voiliers-nsp", label: "je ne sais pas", paint: (ctx) => app.sprites.draw(ctx, "nsp", 0, 75, 75) });
    this.nsp.style.visibility = "hidden";
    onBrief(app, this.nsp, () => { if (!this.attend) return; pop(this.nsp); this.onNsp?.(); }, "nsp");
    // la bulle écrit le nombre du bateau en lettres
    app.bulleTexte = bulleNombre;
    await this.api.pret();
    return true;
  }
  // la scène s'en va (fin de la notion du jour, maison de l'entraînement libre, séance terminée par le parent)
  leave() {
    const { app } = this, etait = !!this.cv;
    this.tok++; this.attend = false; this.resolve = null; this.locked = true;
    this.api?.stop(); this.api = null;
    for (const [cible, type, f, o] of this.ecoute ?? []) cible.removeEventListener(type, f, o);
    this.ecoute = [];
    for (const c of Object.values(this.cv ?? {})) { c.width = c.height = 0; c.remove(); }
    this.cv = null;
    this.nsp?.remove(); this.nsp = null; this.skip?.remove(); this.skip = null;
    if (app.bulleTexte === bulleNombre) app.bulleTexte = null;
    if (etait) app.lagon?.pause(false);
  }
  // pour la bulle : la bande des bouées et le bateau qui arrive ou attend le geste (jamais couverts) ; le bateau qui se
  // déplace seul (correction, exemple), là où il est et là où il va (évité si possible)
  bouge() { const m = this.api?.etat().mode; return !["enter", "wait", "tenu", "drag"].includes(m); }
  obstacles() { if (!this.api) return []; const b = this.bouge() ? null : this.api.zoneBateau(); return b ? [b, BANDE_BOUEES] : [BANDE_BOUEES]; }
  souples() { return this.api && this.bouge() ? this.api.zonesBateau() : []; }

  // « passer » pendant une explication ou un exemple : la voix se tait, les gestes finissent vite
  passable(on) {
    const { app } = this;
    this.skip?.remove(); this.skip = null; this.skipped = false;
    if (!on) return;
    this.skip = skipKey(app, () => { this.skipped = true; this.skippedOnce = true; app.voice.stop(); this.api?.vitesse(8); });
  }
  dire(t, o) { return this.skipped || !t ? Promise.resolve() : this.app.voice.say(t, o); }

  // un bateau ; o.guide : l'exemple guidé
  async ask(q) {
    const { app } = this, { voice, text, ocean, sound } = app, T = text.data, api = this.api, g = clock.hold(), tok = ++this.tok, vivant = () => tok === this.tok;
    this.q = q; this.locked = true; this.attend = false; this.passable(false); app.fleche?.cacher();
    api.vitesse(1);
    await api.bouees(q.bouees).then(g);
    if (!vivant()) return new Promise(() => {});
    api.mer(q.mer);
    const arrive = api.arrivee({ num: q.num }).then(g);
    // l'annonce de la mer, puis le nombre (la consigne d'abord au premier bateau) ; « réécouter » redit la consigne et le nombre
    if (q.annonce) voice.say(T.voiliersMer[q.annonce]);
    const consigne = `${T.voiliersConsigne} ${q.num}`;
    const dit = voice.say(q.premier ? consigne : String(q.num), { instruction: true }); voice.instruction = consigne;
    if (q.guide) return this.exemple(q, arrive, dit, vivant);
    this.locked = false;
    await arrive; if (!vivant()) return new Promise(() => {});
    let t0 = null; dit.then(() => { t0 ??= clock.now(); });
    // avec le vent et les pirates : rien ne bouge avant la fin du nombre dit
    if (q.mer !== "calme") { await dit.then(g); if (!vivant()) return new Promise(() => {}); t0 = clock.now(); api.partir(); }
    const res = { q, ok: false, corrigee: false, demi: false, code: null, nsp: false, rattrape: false, choisi: null, ms: 0, essais: 0 };
    const temps = () => { if (!res.ms) res.ms = t0 == null ? 0 : Math.max(0, Math.round(clock.now() - t0)); };
    // une rangée (la seule, ou l'une des deux du double encadrement) : { premier, fin, nsp, rattrape }
    const rangee = async (b, k, derniere) => {
      for (let essai = 1; ; essai++) {
        this.attend = true; this.nsp.style.visibility = "visible";
        const r = await Promise.race([api.attendreLacher(), new Promise((ok) => { this.onNsp = () => ok({ nsp: true }); })]).then(g);
        this.attend = false; this.onNsp = null; this.nsp.style.visibility = "hidden";
        if (!vivant()) return new Promise(() => {});
        temps(); voice.stop();
        if (r.nsp) { res.nsp = true; await this.montrer(b, k, q, { nsp: true, derniere }); return { premier: false, fin: false, nsp: true }; }
        if (r.rattrape) {
          res.rattrape = true; ocean.mascotte.play("encourager");
          await Promise.all([this.dire(T.voiliersMer.rattrape), api.couler()]).then(g);
          return { premier: false, fin: false, rattrape: true };
        }
        res.essais++; if (res.choisi === null) res.choisi = r.c;
        if (r.c === k) return { premier: essai === 1, fin: true };
        // une erreur : la bouée (ou les bouées du passage) s'allume, la voix explique
        if (!res.code) res.code = q.double ? (b === q.bouees ? "V4" : "V3") : codeErreur(r.c, k);
        sound?.play("erreur"); ocean.mascotte.play("encourager");
        const e = explication(b, r.c, q.num), phrase = fill(T.voiliersErreur[e.cle], { b: e.b });
        api.allumer(e.cle.endsWith("Bouee") ? [e.bouee] : [r.c - 1, r.c].filter((i) => i >= 0 && i < b.length));
        this.passable(true); api.vitesse(app.vitesse ?? 1);
        if (q.mer === "pirates") {
          await this.dire(phrase).then(g);
          await Promise.all([this.dire(T.voiliersMer.rattrape), api.couler()]).then(g);
          this.passable(false); api.vitesse(1);
          return { premier: false, fin: false };
        }
        if (essai >= (this.c.essais ?? 2)) {
          // deuxième erreur : le bateau va seul au bon passage, la voix dit pourquoi
          await this.dire(phrase).then(g);
          await this.montrer(b, k, q, { derniere });
          return { premier: false, fin: false };
        }
        await Promise.all([this.dire(q.mer === "vent" ? `${phrase} ${T.voiliersMer.repousse}` : phrase), q.mer === "vent" ? api.rafale() : api.revenir()]).then(g);
        this.passable(false); api.vitesse(1);
        if (!vivant()) return new Promise(() => {});
        api.allumer([]);
        if (q.mer === "vent") api.partir();
      }
    };
    const r1 = await rangee(q.bouees, q.k, !q.double);
    let r2 = null;
    if (q.double && !r1.nsp && !r1.rattrape && !(q.mer === "pirates" && !r1.fin)) {
      // la bonne centaine : « C'est entre 300 et 400 ! », la caméra recule, la rangée des dizaines
      if (r1.fin) { ocean.mascotte.play("rejouir"); sound?.play("bonne"); const e = entre(q.bouees, q.k); await Promise.all([this.dire(e ? fill(T.voiliersBravoEntre, { a: e[0], b: e[1] }) : null), api.traversee(q.rangee2)]).then(g); }
      else await api.traversee(q.rangee2).then(g);
      if (!vivant()) return new Promise(() => {});
      this.passable(false); api.vitesse(1);
      const d = `${T.voiliersDizaines} ${q.num}`;
      const dit2 = voice.say(d, { instruction: true });
      if (q.mer !== "calme") { await dit2.then(g); api.partir(); }
      r2 = await rangee(q.rangee2, q.k2, true);
    }
    // le bilan du bateau
    if (q.double) { res.ok = !!(r1.premier && r2?.premier); res.demi = !res.ok && !!(r1.fin && r2?.fin) && !!(r1.premier || r2?.premier); res.corrigee = !res.ok && !!(r1.fin && r2?.fin); }
    else { res.ok = !!r1.premier; res.corrigee = !res.ok && !!r1.fin; }
    const last = q.double ? r2 : r1;
    if (last?.fin) {
      // rangé : il passe ; « Bravo ! » (devant les pirates : « Bravo, tu as semé les pirates ! »), ou entre deux bouées rondes
      const b = q.double ? q.rangee2 : q.bouees, k = q.double ? q.k2 : q.k, e = entre(b, k);
      sound?.play("bonne"); ocean.mascotte.play("rejouir");
      const bravo = e ? fill(T.voiliersBravoEntre, { a: e[0], b: e[1] }) : q.mer === "pirates" ? text.pick("voiliersBravoPirates") : text.pick("bravo");
      app.starFrom = [api.centre(k), 700];
      await Promise.all([voice.say(bravo), api.passe(k)]).then(g);
    }
    if (res.nsp) res.code = "NSP"; else if (res.rattrape && !res.code) res.code = "rattrape";
    if (res.ok) res.code = null;
    res.listens = voice.listens; res.correctionPassee = !!this.skippedOnce;
    this.skippedOnce = false; this.passable(false); api.vitesse(1);
    return res;
  }
  // le bateau va seul au bon passage pendant que la voix dit pourquoi (après deux erreurs, ou « je ne sais pas »)
  async montrer(b, k, q, { nsp = false, derniere = true } = {}) {
    const { app } = this, { text } = app, T = text.data, api = this.api, g = clock.hold();
    this.passable(true); api.vitesse(app.vitesse ?? 1);
    const p = pourquoi(b, q.num);
    if (nsp) await this.dire(T.erreur.NSP).then(g);
    api.allumer(p.bouee == null ? [k - 1, k] : [p.bouee]);
    const phrase = p.cle === "entre" ? fill(T.voiliersBravoEntre, { a: p.a, b: p.b }) : fill(T.voiliersErreur[p.cle], { b: p.b });
    await Promise.all([this.dire(phrase), api.guider(k)]).then(g);
    // le double encadrement continue (la rangée des dizaines) ; sinon, le bateau passe
    if (derniere) await api.passe(k).then(g);
    api.allumer([]);
  }
  // l'exemple guidé : le bateau va seul au bon passage pendant que la voix explique ; « passer » l'arrête
  async exemple(q, arrive, dit, vivant) {
    const { app } = this, { text } = app, T = text.data, api = this.api, g = clock.hold();
    this.passable(true);
    await Promise.all([arrive, dit]).then(g); if (!vivant()) return new Promise(() => {});
    api.vitesse(this.skipped ? 8 : app.vitesse ?? 1);
    const geste = (async () => {
      api.allumer([q.k - 1, q.k]); await api.guider(q.k).then(g);
      if (q.double) { await api.traversee(q.rangee2).then(g); api.allumer([q.k2 - 1, q.k2]); await api.guider(q.k2).then(g); await api.passe(q.k2).then(g); }
      else await api.passe(q.k).then(g);
      api.allumer([]);
    })();
    await Promise.all([this.dire(T.voiliersExemple[q.niveau]), geste]).then(g);
    const passe = this.skippedOnce; this.skippedOnce = false; this.passable(false); api.vitesse(1);
    return { q, ok: true, ms: 0, listens: app.voice.listens, exemplePasse: passe, essais: 0 };
  }
}
// pour les tests : le passage d'un nombre
export { passage };
