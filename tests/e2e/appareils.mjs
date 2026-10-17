// LE BANC ANDROID (lot « Banc Android et recette en conditions réelles », docs/LOTS.md, fiche 13). Les défauts vus sur la
// tablette le 16 octobre 2026 ne pouvaient pas apparaître sur l'ancien banc : sans service worker, sans voix ni son, la lecture
// automatique permise, dans le Chromium d'un ordinateur, avec un enfant qui touche sans arrêt. Ce module reproduit un vrai
// Android, le plus fidèlement que Chromium le permet, et c'est le banc par défaut de tous les parcours (navigateur.mjs lui
// prend ses réglages) :
//
//  1. LES APPAREILS (un seul endroit : PROFILS) : la tablette de référence (Galaxy Tab S5e), une tablette d'entrée de gamme, un
//     smartphone récent, un petit smartphone ancien ; écran tactile seulement, l'identifiant d'un Chrome Android, la fenêtre
//     et la densité de l'application installée (plein écran, paysage), le processeur ralenti. Pour les smartphones, aussi en
//     portrait : la page ouverte dans un onglet, avant l'installation.
//  2. LES CONDITIONS PAR DÉFAUT (`Appareil`) : un profil de navigateur persistant (l'application installée, son service worker
//     actif, le cache plein), fermé puis rouvert à chaque relance, ou TUÉ (le processus arrêté net, comme Android ferme
//     Chrome) ; la vraie voix et le vrai son, aux vraies durées ; la lecture automatique refusée (c'est le toucher de l'écran
//     de démarrage qui l'autorise, touché pour de vrai) ; 8 lecteurs de médias au plus ; la page cachée puis montrée, gelée
//     puis dégelée ; le réseau coupé ou lent (`serveurBanc`) ; un quota de stockage limité.
//  3. CE QUI NE S'ÉMULE PAS (la mémoire graphique, les décodeurs vidéo, la mémoire réelle) : des BUDGETS, mesurés par le même
//     code que le journal technique de la tablette (app/js/engine/etat-page.js, `window.__etatPage`) ; `budgets()` et
//     `depasse()`. Les valeurs : BUDGETS ci-dessous, et docs/ARCHITECTURE.md, « Le banc Android ».
//
// Ce que le banc ne reproduit pas (et qui reste à l'essai sur la tablette) : la mémoire graphique et les décodeurs vidéo réels
// (Chromium les prend sur l'ordinateur), la mémoire totale de l'appareil (aucune limite : seule la croissance est mesurée), le
// processeur graphique (SwiftShader, logiciel), la vraie sortie du son (le son est joué vers une sortie muette), l'écran de
// lancement d'Android (la page est ouverte directement), les gestes du système (retour, barre des tâches).
import { chromium, demarrageReel, accueilReel, finReelle } from "./navigateur.mjs";
import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve } from "node:path";

// ---------------------------------------------------------------- 1. les appareils
// (les identifiants de navigateur : la forme réduite qu'envoie Chrome sur Android depuis 2023, « Android 10; K ») ; `diagonale`
// en pouces, pour la taille réelle des cibles (mm par pixel CSS : 25,4 × densité / points par pouce)
const CHROME = "141.0.0.0";
const UA_TABLETTE = `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME} Safari/537.36`;
const UA_TELEPHONE = `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME} Mobile Safari/537.36`;
export const PROFILS = {
  // Galaxy Tab S5e (SM-T720) : 10,5 pouces, 2 560 × 1 600, Snapdragon 670, 4 Go ; sortie avec Android 9, sa dernière mise à jour
  // est Android 11 (One UI 3.1) ; plein écran, paysage : 2 560 / 2,25 = 1 138 px CSS
  s5e: { nom: "Galaxy Tab S5e (référence)", largeur: 1138, hauteur: 711, densite: 2.25, ralenti: 4, diagonale: 10.5, pixels: [2560, 1600], ua: UA_TABLETTE, telephone: false },
  "tablette-entree": { nom: "tablette Android d'entrée de gamme", largeur: 1280, hauteur: 800, densite: 1.5, ralenti: 6, diagonale: 10.1, pixels: [1920, 1200], ua: UA_TABLETTE, telephone: false },
  smartphone: { nom: "smartphone récent, en paysage", largeur: 915, hauteur: 412, densite: 2.625, ralenti: 2, diagonale: 6.4, pixels: [2400, 1080], ua: UA_TELEPHONE, telephone: true, encoche: 32 },
  "petit-smartphone": { nom: "petit smartphone ancien, en paysage", largeur: 640, hauteur: 360, densite: 2, ralenti: 6, diagonale: 5.0, pixels: [1280, 720], ua: UA_TELEPHONE, telephone: true },
};
export const REFERENCE = "s5e";
// la taille d'un pixel CSS, en millimètres, sur l'appareil
export const mmParPx = (p) => { const [w, h] = p.pixels, ppp = Math.hypot(w, h) / p.diagonale; return (25.4 * p.densite) / ppp; };
// les options d'un contexte de navigateur pour ce profil (`portrait` : la page dans un onglet, téléphone tenu droit)
export const optionsProfil = (nom = REFERENCE, { portrait = false } = {}) => {
  const p = PROFILS[nom]; if (!p) throw new Error(`profil inconnu : ${nom} (${Object.keys(PROFILS).join(", ")})`);
  const [w, h] = portrait ? [p.hauteur, p.largeur] : [p.largeur, p.hauteur];
  return { viewport: { width: w, height: h }, screen: { width: w, height: h }, deviceScaleFactor: p.densite, isMobile: true, hasTouch: true, userAgent: p.ua, locale: "fr-FR" };
};

// ---------------------------------------------------------------- 2. les conditions par défaut
export const LECTEURS_MAX = 8;
// (WebGL par SwiftShader, logiciel : sans carte graphique, comme les autres parcours ; `--enable-precise-memory-info` : la mémoire
// de la page au kilo-octet près, au lieu d'arrondis de plusieurs mégaoctets)
export const ARGS_ANDROID = (limite = LECTEURS_MAX) => ["--autoplay-policy=user-gesture-required", `--max-web-media-player-count=${limite}`,
  "--enable-precise-memory-info", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
export const CHROMIUM = process.env.CHROMIUM ?? "/opt/pw-browsers/chromium";

// LE SITE : l'application servie comme GitHub Pages (sous /Maths-CE1/), en une ou deux versions (une mise à jour publiée), et un
// réseau qu'on peut couper (« coupe » : la connexion est fermée aussitôt, comme sans Wi-Fi), ralentir (« lent » : chaque
// fichier attend `latence` ms et passe à `debit` Ko/s) ou rendre instable (« instable » : une requête sur `perte` échoue)
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".ogg": "audio/ogg", ".webm": "video/webm", ".woff2": "font/woff2" };
export async function serveurBanc({ racine = process.env.RACINE_APP ?? "app", prefixe = "/Maths-CE1/" } = {}) {
  const ROOT = resolve(racine) + "/";
  const SW = readFileSync(join(ROOT, "sw.js"), "utf8"), LISTE = JSON.parse(readFileSync(join(ROOT, "sw-files.json"), "utf8"));
  const versionDe = (v) => ({ v, sw: SW.replace(/^const VERSION = ".*";$/m, `const VERSION = "${v}";`), liste: JSON.stringify({ ...LISTE, version: v }), version: JSON.stringify({ version: v }) });
  const VERSIONS = { A: versionDe("aaaaaaaaaaaa"), B: versionDe("bbbbbbbbbbbb"), C: versionDe("cccccccccccc") };
  const s = { pub: VERSIONS.A, reseau: "ok", latence: 400, debit: 200, perte: 3, demandes: 0, coupees: 0, n: 0 };
  const srv = createServer((req, rsp) => {
    if (s.reseau === "coupe" || (s.reseau === "instable" && ++s.n % s.perte === 0)) { s.coupees++; return req.socket.destroy(); }
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!url.startsWith(prefixe)) { rsp.writeHead(302, { location: prefixe }); return rsp.end(); }
    const f = url.slice(prefixe.length) || "index.html"; s.demandes++;
    const envoyer = (body, type) => {
      const go = () => { rsp.writeHead(200, { "content-type": type, "cache-control": "no-cache", "content-length": body.length }); rsp.end(body); };
      if (s.reseau !== "lent") return go();
      setTimeout(go, s.latence + (body.length / 1024 / s.debit) * 1000);
    };
    if (f === "sw.js") return envoyer(Buffer.from(s.pub.sw), TYPES[".js"]);
    if (f === "sw-files.json") return envoyer(Buffer.from(s.pub.liste), TYPES[".json"]);
    if (f === "version.json") return envoyer(Buffer.from(s.pub.version), TYPES[".json"]);
    let p = normalize(join(ROOT, f)); if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
    try { if (statSync(p).isDirectory()) p = join(p, "index.html"); envoyer(readFileSync(p), TYPES[extname(p)] ?? "application/octet-stream"); } catch { rsp.writeHead(404); rsp.end(); }
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const origine = `http://127.0.0.1:${srv.address().port}`;
  return {
    url: origine + prefixe, origine, etat: s, versions: VERSIONS,
    // une nouvelle version publiée (B, C) : son service worker diffère d'un octet, le navigateur l'installe
    publier(v) { s.pub = VERSIONS[v]; },
    // le réseau : "ok", "coupe", "lent" ou "instable"
    reseau(e, o = {}) { s.reseau = e; Object.assign(s, o); },
    fermer: () => new Promise((r) => { srv.closeAllConnections?.(); srv.close(r); }),
  };
}

// ce qui est posé dans chaque page du banc, avant tout script : les lectures de médias réussies et refusées (une phrase « bien
// jouée par un vrai lecteur » : un élément Audio dont play() a réussi et qui a joué jusqu'au bout)
const ESPIONS = () => {
  const l = (window.__lectures = { essais: 0, jouees: 0, finies: 0, refusees: 0, erreurs: [] });
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (...a) {
    const audio = this.tagName === "AUDIO"; if (audio) { l.essais++; this.addEventListener("ended", () => l.finies++, { once: true }); }
    const r = play.apply(this, a);
    if (audio) r?.then?.(() => l.jouees++, (e) => { if (e?.name !== "AbortError") { l.refusees++; l.erreurs.push(e?.name ?? String(e)); } });
    return r;
  };
};

// UN APPAREIL : un profil de navigateur persistant, ouvert, fermé, tué, relancé ; l'application installée
export class Appareil {
  // `profil` : un nom de PROFILS ; `serveur` : serveurBanc() ; `portrait` : la page dans un onglet, en portrait ; `ralenti` : le
  // processeur ralenti du profil (false : non ralenti) ; `limite` : les lecteurs de médias ; `quota` : octets de stockage
  // (Storage.overrideQuotaForOrigin), remis à chaque ouverture ; `journal` : une fonction qui reçoit chaque ligne à écrire
  constructor(profil = REFERENCE, { serveur, portrait = false, ralenti = true, limite = LECTEURS_MAX, quota = null, args = [], dossier = null, journal = null, scripts = [] } = {}) {
    this.nom = profil; this.p = PROFILS[profil]; this.serveur = serveur; this.portrait = portrait;
    this.ralenti = ralenti === true ? this.p.ralenti : ralenti || 1; this.limite = limite; this.quota = quota; this.args = args;
    this.dossier = dossier ?? mkdtempSync(join(tmpdir(), `banc-${profil}-`)); this.propre = !dossier;
    this.scripts = scripts; this.erreurs = []; this.refusLecteurs = 0; this.lancements = []; this.log = journal ?? (() => {});
    this.ctx = null; this.page = null; this.cdp = null;
  }
  get url() { return this.serveur.url; }
  // un appareil neuf qui part d'une copie de ce profil (l'application déjà installée : son cache, son service worker, ses données)
  copier(opts = {}) { const d = mkdtempSync(join(tmpdir(), `banc-${this.nom}-`)); cpSync(this.dossier, d, { recursive: true }); for (const f of ["SingletonLock", "SingletonSocket", "SingletonCookie"]) rmSync(join(d, f), { force: true }); const a = new Appareil(this.nom, { serveur: this.serveur, ralenti: this.ralenti, limite: this.limite, quota: this.quota, args: this.args, scripts: this.scripts, ...opts, dossier: d }); a.propre = true; return a; }
  // ouvre le navigateur sur le profil et l'application ; `toucher` : l'écran de démarrage touché pour de vrai (ce qui autorise
  // la voix) ; `q` : des paramètres d'adresse ; renvoie les temps du lancement (première image, prêt, application prête)
  async ouvrir({ q = "", toucher = true, attente = 180000, accueil = true } = {}) {
    const t0 = Date.now();
    this.ctx = await chromium.launchPersistentContext(this.dossier, { executablePath: CHROMIUM, ...optionsProfil(this.nom, { portrait: this.portrait }), args: [...ARGS_ANDROID(this.limite), ...this.args], serviceWorkers: "allow" });
    // (les conditions réelles : l'écran de démarrage attend un vrai toucher, l'accueil est en deux touchers, la récompense a
    // son bouton de fin)
    await demarrageReel(this.ctx); if (accueil) await accueilReel(this.ctx); await finReelle(this.ctx); await this.ctx.addInitScript(ESPIONS); for (const sc of this.scripts) await this.ctx.addInitScript(sc);
    this.page = this.ctx.pages()[0] ?? (await this.ctx.newPage());
    this.page.on("pageerror", (e) => this.erreurs.push(e.message));
    this.page.on("console", (m) => { if (/too many WebMediaPlayers|WebMediaPlayer/i.test(m.text())) this.refusLecteurs++; });
    this.cdp = await this.ctx.newCDPSession(this.page);
    if (this.ralenti > 1) await this.cdp.send("Emulation.setCPUThrottlingRate", { rate: this.ralenti });
    if (this.quota != null) await this.cdp.send("Storage.overrideQuotaForOrigin", { origin: this.serveur.origine, quotaSize: this.quota });
    // (l'application installée s'affiche en plein écran ; dans un onglet, en mode navigateur)
    if (!this.portrait) await this.cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "display-mode", value: "fullscreen" }] }).catch(() => {});
    if (this.p.encoche && !this.portrait) await this.cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { left: this.p.encoche, right: 0, top: 0, bottom: 0 } }).catch(() => {});
    const r = { profil: this.nom };
    try {
      await this.page.goto(this.url + q, { timeout: attente });
      // (une nouvelle version qui prend la main pendant l'écran de démarrage recharge la page : on suit la page qui reste)
      const fin = Date.now() + attente;
      const lire = () => this.page.evaluate(() => {
        const m = (n) => Math.round(performance.getEntriesByName(n)[0]?.startTime ?? NaN);
        return { pret: performance.getEntriesByName("demarrage-pret").length > 0, ready: window.__ready !== undefined, touche: !!window.__bancTouche,
          image: m("demarrage-visible"), pretMs: m("demarrage-pret"), app: m("app-ready"), controle: !!navigator.serviceWorker?.controller, recharge: performance.getEntriesByType("navigation")[0]?.type === "reload" };
      }).catch(() => null);
      for (;;) {
        const e = await lire();
        if (e?.pret) Object.assign(r, { image: e.image, pret: e.pretMs, controle: e.controle, recharge: e.recharge || r.recharge || false });
        if (e?.ready || (e?.pret && !toucher)) { if (e.ready) r.app = e.app; break; }
        if (e?.pret && !e.touche) { await this.page.evaluate(() => { window.__bancTouche = true; }).catch(() => {}); await this.toucher(".demarrage.pret").catch(() => {}); }
        if (Date.now() > fin) throw new Error(`pas prête en ${attente / 1000} s`);
        await this.page.waitForTimeout(100).catch(() => {});
      }
    } catch (e) { r.echec = e.message.split("\n")[0]; }
    r.total = Date.now() - t0; this.lancements.push(r);
    this.log(`     ${this.nom} : lancement ${this.lancements.length} : ${r.echec ? `ÉCHEC (${r.echec})` : `première image ${r.image} ms, prête ${r.pret} ms${r.app ? `, accueil ${r.app} ms` : ""}${r.controle ? " (service worker)" : ""}`}`);
    return r;
  }
  // l'état du service worker de la page
  etatSW() { return this.page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); const n = (w) => (w ? w.state : null); const k = await caches.keys(); return { controle: !!navigator.serviceWorker.controller, actif: n(r?.active), attente: n(r?.waiting), installe: n(r?.installing), caches: k }; }); }
  // l'installation : attendre que le service worker de la version publiée par le serveur ait tout mis en cache, et soit actif ou
  // attende le lancement suivant (`v` : une autre version attendue)
  async installer(maxMs = 900000, v = this.serveur.etat.pub.v) {
    const t0 = Date.now(), cache = `ocean-${v}`;
    for (;;) {
      const e = await this.etatSW().catch(() => null);
      const fini = e && !e.installe && e.caches.includes(cache) && (e.attente === "installed" || (e.actif === "activated" && !e.attente && e.caches.length === 1));
      if (fini) return { ...e, dureeS: Math.round((Date.now() - t0) / 1000) };
      if (Date.now() - t0 > maxMs) throw new Error(`installation pas finie en ${maxMs / 1000} s (${JSON.stringify(e)})`);
      await this.page.waitForTimeout(1000);
    }
  }
  async fermer() { if (this.ctx) await this.ctx.close().catch(() => {}); this.ctx = this.page = this.cdp = null; }
  async relancer(o) { await this.fermer(); return this.ouvrir(o); }
  // Android ferme Chrome sans prévenir : le processus du navigateur est tué net (rien n'est enregistré à la fermeture)
  async tuer() {
    try { execFileSync("pkill", ["-9", "-f", `user-data-dir=${this.dossier}`]); } catch { /* déjà arrêté */ }
    await this.ctx?.close().catch(() => {}); this.ctx = this.page = this.cdp = null;
    // (le verrou du profil laissé par le processus tué)
    for (const f of ["SingletonLock", "SingletonSocket", "SingletonCookie"]) rmSync(join(this.dossier, f), { force: true });
  }
  async tuerEtRelancer(o) { await this.tuer(); return this.ouvrir(o); }
  // « Tout effacer » : les données de l'application (la base, le journal, le stockage local), pas le cache de l'application
  // installée ; la page est rechargée par la relance suivante
  async effacerDonnees() { await this.cdp.send("Storage.clearDataForOrigin", { origin: this.serveur.origine, storageTypes: "indexeddb,local_storage" }); }
  // la page cachée (l'écran éteint, une autre application), `geler` : gelée aussi (Android gèle les onglets en arrière-plan),
  // pendant `ms`, puis montrée
  async cacher(ms, { geler = true } = {}) {
    await this.page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); document.dispatchEvent(new Event("visibilitychange")); });
    if (geler) await this.cdp.send("Page.setWebLifecycleState", { state: "frozen" });
    await this.page.waitForTimeout(ms);
    if (geler) await this.cdp.send("Page.setWebLifecycleState", { state: "active" });
    await this.page.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event("visibilitychange")); });
    await this.page.waitForTimeout(500);
  }
  async geler(ms) { await this.cdp.send("Page.setWebLifecycleState", { state: "frozen" }); await this.page.waitForTimeout(ms); await this.cdp.send("Page.setWebLifecycleState", { state: "active" }); await this.page.waitForTimeout(300); }
  // (la poignée rendue par Playwright est libérée aussitôt : gardée, elle retient l'élément qu'elle désigne, et tout ce qui s'y
  // rattache, dans la mémoire de la page ; le banc mesurait alors des « fuites » qui étaient les siennes)
  async attendre(f, ms = 30000, arg) { const h = await this.page.waitForFunction(f, arg, { timeout: ms, polling: 200 }); const v = await h.jsonValue().catch(() => true); await h.dispose().catch(() => {}); return v; }
  // un toucher réel (événements tactiles, qui comptent comme un geste de l'utilisateur) au centre d'un élément, ou en (x, y)
  async toucher(cible, { ms = 70 } = {}) {
    let x, y;
    if (typeof cible === "string") {
      const b = await this.page.waitForFunction((s) => { const e = [...document.querySelectorAll(s)].find((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true })); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, cible, { timeout: 30000, polling: 100 });
      [x, y] = await b.jsonValue(); await b.dispose().catch(() => {});
    } else [x, y] = cible;
    // (l'heure du contact et du lever, comme les donne l'écran tactile d'une tablette : sans elle, Chromium date l'événement quand il
    // le traite, et un navigateur saturé par le rendu graphique logiciel faisait d'un toucher de 70 ms un appui de 0,8 s, que
    // l'application ignore : la maison des voiliers « ne répondait plus » sur le banc, jamais sur une vraie tablette)
    const t0 = Date.now() / 1000;
    await this.cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }], timestamp: t0 });
    await this.page.waitForTimeout(ms);
    await this.cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], timestamp: Math.max(t0 + ms / 1000, Date.now() / 1000 - 0.001) });
  }
  // deux touchers (les écrans de choix et l'accueil : le premier montre et dit, le second ouvre)
  async deuxTouchers(cible, ecart = 600) { await this.toucher(cible); await this.page.waitForTimeout(ecart); await this.toucher(cible); }
  // les lectures de médias de la page (ESPIONS) et l'état de la voix
  lectures() { return this.page.evaluate(() => ({ ...window.__lectures, fichiers: window.__app?.voice?.files ?? 0, manquees: window.__app ? [...window.__app.voice.misses] : [], refus: window.__app?.voice?.refus ?? 0 })); }
  // ---------------------------------------------------------------- 3. les budgets
  // l'état de la page (app/js/engine/etat-page.js, le code du journal technique) après un passage du ramasse-miettes : ce qui
  // n'est plus référencé n'est pas compté
  async budgets() {
    await this.cdp.send("HeapProfiler.collectGarbage").catch(() => {});
    await this.page.waitForTimeout(100);
    return this.page.evaluate(() => window.__etatPage?.() ?? null);
  }
  // la part de pixels noirs de l'écran (une scène qui ne s'est pas peinte)
  async noir() {
    const buf = await this.page.screenshot({ timeout: 30000 });
    return this.page.evaluate(async (b64) => {
      const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob()), w = 160, h = Math.round((160 * bmp.height) / bmp.width);
      const c = new OffscreenCanvas(w, h), x = c.getContext("2d"); x.drawImage(bmp, 0, 0, w, h); bmp.close();
      const d = x.getImageData(0, 0, w, h).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 18 && d[i + 1] < 18 && d[i + 2] < 18) n++;
      c.width = c.height = 0; return n / (w * h);
    }, buf.toString("base64"));
  }
  // le journal technique de la page (engine/journal.js), lu dans sa base
  journalTechnique() { return this.page.evaluate(async () => (await import("./js/engine/journal.js")).lire()); }
  async detruire() { await this.fermer(); if (this.propre) rmSync(this.dossier, { recursive: true, force: true }); }
}

// LES BUDGETS (point 3) : ce que la tablette ne dit pas, tenu par des plafonds. Les valeurs sont fixées d'après les mesures du
// banc (docs/ARCHITECTURE.md, « Le banc Android » : la mesure la plus haute vue sur la journée d'usage et l'enfant imprévisible,
// et la marge) ; `croissance` : ce qui doit revenir à son niveau de départ (mesuré sur l'accueil, au début et à la fin).
export const BUDGETS = {
  medias: 6,          // lecteurs de médias avec une source : 2 vidéos de la mascotte, 2 à 4 sons de la voix (mesuré : 2 au repos, 4 au plus)
  mediasVideo: 2,     // dont vidéos : les deux lecteurs de la mascotte
  webgl: 4,           // contextes WebGL : la mascotte et le miroitement du lagon (2), la mer des voiliers (2 de plus, aussi en pause)
  canvasMpx: 60,      // surface totale des canvas, en mégapixels (mesuré : 18,6 à l'accueil ; 31 avec la réserve de l'étal ; le récif ajoute
                      //   ses deux grands calques et son premier plan, environ 20)
  imagesMpx: 90,      // images en mémoire (<img> chargées et ImageBitmap), en mégapixels (mesuré : 16,8 à l'accueil ; 38 avec l'étal ; 51 au récif)
  memoireMo: 60,      // mémoire JavaScript de la page (mesuré : 7 à 13 Mo)
  // ce qui doit revenir à son niveau, une fois les réserves voulues remplies (l'étal garde ses pièces et billets dessinés, l'album
  // ses pages) ; mesuré au repos : 20 s sans toucher ni phrase, les minuteries courtes éteintes (tests/e2e/fuites.mjs, journee.mjs)
  croissance: { memoireMo: 15, intervalles: 1, minuteries: 6, ecouteurs: 8, canvas: 12, canvasMpx: 6, images: 4, imagesMpx: 6, elements: 60 },
};
// les budgets dépassés par une mesure (et, avec `depart`, ce qui n'est pas revenu à son niveau)
export function depasse(m, depart = null, b = BUDGETS) {
  if (!m) return ["état de la page illisible"];
  const d = [];
  for (const k of ["medias", "mediasVideo", "webgl", "canvasMpx", "imagesMpx", "memoireMo"]) if (m[k] != null && m[k] > b[k]) d.push(`${k} ${m[k]} > ${b[k]}`);
  if (depart) for (const [k, v] of Object.entries(b.croissance)) if (m[k] != null && depart[k] != null && m[k] - depart[k] > v) d.push(`${k} ${depart[k]} → ${m[k]} (+${m[k] - depart[k]} > ${v})`);
  return d;
}
export const resumeEtat = (m) => (m ? `médias ${m.medias} (vidéo ${m.mediasVideo}), canvas ${m.canvas} (${m.canvasMpx} Mpx, WebGL ${m.webgl}), images ${m.images} (${m.imagesMpx} Mpx), mémoire ${m.memoireMo} Mo, minuteries ${m.minuteries} (répétées ${m.intervalles}), écouteurs ${m.ecouteurs}, éléments ${m.elements}` : "?");
