// LE SERVICE WORKER : l'application entière est mise en cache à l'installation, puis servie depuis le
// cache, même sans réseau. La liste des fichiers et la version viennent de sw-files.json, produit par
// `node tools/precache.mjs` (la ligne VERSION ci-dessous est réécrite par le même outil : quand un
// fichier change, ce script change aussi, et le navigateur installe la nouvelle version).
// (Lot « Correctifs : passage de l'échauffement aux voiliers », point 12 : la voix de secours entendue sur la tablette. Avant,
// une nouvelle version s'installait en arrière-plan, prenait la main EN COURS DE PARTIE (skipWaiting, clients.claim) et
// supprimait l'ancien cache : la page, qui gardait l'ancien index de la voix, demandait des fichiers que la nouvelle version
// avait retirés ; introuvables, ils étaient lus par la synthèse du navigateur. Et l'installation mettait en cache plus de
// 10 000 fichiers d'un seul bloc (cache.addAll) : un seul échec réseau la faisait échouer entière. Désormais :)
//  - une page ne mélange jamais deux versions : la nouvelle version attend (pas de skipWaiting à l'installation) ; elle ne
//    prend la main qu'au lancement suivant, ou pendant l'écran de démarrage, avant le toucher (main.js lui envoie
//    « activer », puis recharge la page : engine/miseajour.js) ;
//  - l'installation se fait par paquets (PAQUET fichiers à la fois), chaque fichier avec des reprises (ESSAIS, attente
//    croissante) ; un échec n'est pas perdu : ce qui est déjà dans le cache de la nouvelle version y reste, et la tentative
//    suivante (le navigateur la refait à la prochaine ouverture) reprend là où elle s'est arrêtée ;
//  - l'ancien cache n'est supprimé qu'une fois la nouvelle version complète et active.
// (Lot « Correctifs de l'installation et de la veille », point 1 : l'application installée ne se relançait plus, l'écran de
// lancement d'Android restait sans fin. La cause : chaque requête cherchait son fichier dans le cache avec `ignoreSearch`, et
// avec cette option Chrome lit TOUTES les entrées du cache (plus de 11 800) à chaque recherche : 818 ms par fichier sur un
// ordinateur de bureau, contre moins de 3 ms sans elle, des centaines de fichiers au démarrage. Le premier lancement, que le
// service worker ne sert pas encore, y échappait. Désormais :)
//  - un fichier est cherché par son adresse exacte, sans ses paramètres (les fichiers sont rangés sans) ;
//  - la page de lancement ne peut plus rester sans réponse : si le cache ne répond pas en DELAI_CACHE ms, le réseau est
//    essayé en même temps, et sans l'un ni l'autre une page de secours, écrite ici, dit « Toucher pour réessayer » ;
//  - ce qui arrive au service worker (version, installation, activation, erreurs) est noté dans le journal technique de
//    l'espace parent (point 5 ; la même base que engine/journal.js).
const VERSION = "72c70a8d7079";
const CACHE = `ocean-${VERSION}`;
const PAQUET = 32, ESSAIS = 4;
// la résolution des planches d'images de cet écran (main.js : sw.js?r=1 ou ?r=2) : on ne met en cache que
// celle-là (une planche qui n'existe qu'en @1x, comme les rayons, est toujours gardée)
const RES = new URL(location.href).searchParams.get("r");
// (une planche peut avoir plusieurs pages : pieuvre-gestes@2x-0.webp, pieuvre-gestes@2x-1.webp)
const useful = (f, all) => { const m = /^(assets\/art\/.+)@([12])x(-\d+)?\.webp$/.exec(f); return !m || !RES || m[2] === RES || ![...all].some((g) => g.startsWith(`${m[1]}@${RES}x`) && g.endsWith(".webp")); };
// les fichiers son sont nommés par l'empreinte de leur contenu : déjà dans le cache d'une version précédente, ils sont repris
// tels quels (une mise à jour ne retélécharge pas toute la voix)
const immuable = (f) => /^assets\/voix\/[0-9a-f]{12}\.ogg$/.test(f) || /^assets\/son\/[a-z-]+-[0-9a-f]{8}\.ogg$/.test(f);
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const DELAI_CACHE = 3000;

// LE JOURNAL TECHNIQUE (point 5) : les 300 derniers événements, dans une base à part (la même que engine/journal.js, qui le
// lit pour l'espace parent) ; ne doit jamais rien empêcher
const JOURNAL = { base: "maths-ce1-journal", table: "evenements", max: 300 };
let journalDb = null;
const ouvrirJournal = () => (journalDb ??= new Promise((res, rej) => {
  const r = indexedDB.open(JOURNAL.base, 1);
  r.onupgradeneeded = () => r.result.createObjectStore(JOURNAL.table, { autoIncrement: true });
  r.onsuccess = () => res(r.result); r.onerror = () => { journalDb = null; rej(r.error); };
}));
async function noter(type, message, details = {}) {
  try {
    const db = await ouvrirJournal();
    await new Promise((res) => {
      const tx = db.transaction(JOURNAL.table, "readwrite"), st = tx.objectStore(JOURNAL.table);
      st.add({ t: Date.now(), source: "service worker", version: VERSION, type, message, ...details });
      const c = st.count();
      c.onsuccess = () => { let n = c.result - JOURNAL.max; if (n > 0) st.openCursor().onsuccess = (ev) => { const k = ev.target.result; if (k && n-- > 0) { k.delete(); k.continue(); } }; };
      tx.oncomplete = tx.onerror = tx.onabort = () => res();
    });
  } catch { /* le journal ne doit jamais rien empêcher */ }
}
// un fichier du réseau, avec des reprises (0,4 s, 0,8 s, 1,6 s) ; échoue après ESSAIS tentatives
async function chercher(f, opts = { cache: "reload" }) {
  let err = null;
  for (let i = 0; i < ESSAIS; i++) {
    try { const r = await fetch(new Request(f, opts)); if (r.ok) return r; err = new Error(`${f} : ${r.status}`); } catch (e) { err = e; }
    if (i < ESSAIS - 1) await attendre(400 * 2 ** i);
  }
  throw err;
}

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const t0 = Date.now();
    await noter("service worker", "installation commencée");
    try {
    const list = await (await chercher("sw-files.json", { cache: "no-store" })).json(), all = new Set(list.files);
    const files = list.files.filter((f) => useful(f, all));
    // (lot « Banc Android et recette en conditions réelles », point 2 : LE STOCKAGE) la place qu'il faut, comparée à celle que le
    // navigateur accorde : si l'application ne tient pas, rien n'est téléchargé (chaque lancement retéléchargerait 135 Mo pour
    // rien) ; c'est noté « stockage plein », que l'espace parent montre au parent (engine/stockage.js) ; l'application reste
    // utilisable tant que le réseau est là
    const besoin = list.octets?.[RES ?? "2"] ?? 0, est = await self.navigator?.storage?.estimate?.().catch(() => null);
    const deja0 = await caches.has(CACHE);
    if (besoin && est && est.quota - est.usage < besoin * 1.05 && !deja0) throw Object.assign(new Error(`il faut ${Math.round(besoin / 1e6)} Mo, il en reste ${Math.round((est.quota - est.usage) / 1e6)}`), { name: "QuotaExceededError", besoin, libre: est.quota - est.usage });
    // (le cache de cette version peut déjà contenir une partie des fichiers : une tentative précédente interrompue)
    const cache = await caches.open(CACHE), deja = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));
    const base = new URL("./", location.href).pathname, reste = files.filter((f) => !deja.has(base + (f === "./" ? "" : f)));
    for (let i = 0; i < reste.length; i += PAQUET) {
      await Promise.all(reste.slice(i, i + PAQUET).map(async (f) => {
        const old = immuable(f) && (await caches.match(f));
        await cache.put(f, old || (await chercher(f)));
      }));
    }
    await noter("service worker", "installation finie", { fichiers: files.length, nouveaux: reste.length, dureeMs: Date.now() - t0 });
    } catch (err) {
      // le stockage plein : le cache inachevé de cette version est effacé (la place va aux données de l'enfant, que la page
      // enregistre dans la même réserve), et c'est noté pour le parent
      if (err?.name === "QuotaExceededError" || /quota/i.test(String(err?.message))) {
        const est = await self.navigator?.storage?.estimate?.().catch(() => null);
        await caches.delete(CACHE).catch(() => {});
        await noter("service worker", "stockage plein", { erreur: String(err?.message ?? err), besoinMo: err.besoin ? Math.round(err.besoin / 1e6) : null, libreMo: est ? Math.round((est.quota - est.usage) / 1e6) : null, quotaMo: est ? Math.round(est.quota / 1e6) : null, dureeMs: Date.now() - t0 });
      } else await noter("service worker", "installation interrompue", { erreur: String(err?.message ?? err), dureeMs: Date.now() - t0 });
      throw err;
    }
  })());
});
// la version prend la main : au lancement suivant (plus aucune page de l'ancienne), ou quand la page le demande, pendant
// l'écran de démarrage, avant le toucher (« activer » : main.js, engine/miseajour.js) ; elle seule reste en cache
// (point 1 : effacer un cache entier est immédiat dans Chrome, 1 ms mesurée pour 11 000 fichiers : l'activation ne retient pas
// la page qui l'attend)
self.addEventListener("message", (e) => { if (e.data === "activer") self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const effaces = [];
    for (const k of await caches.keys()) if (k.startsWith("ocean-") && k !== CACHE) { await caches.delete(k); effaces.push(k); }
    await self.clients.claim();
    await noter("service worker", "version activée", { anciens: effaces.join(", ") || null });
  })());
});
// d'abord le cache, cherché par l'adresse exacte sans ses paramètres (point 1 : plus d'`ignoreSearch`) ; à défaut le réseau (et ce
// qui arrive est gardé pour la prochaine fois). La page de lancement : si le cache tarde, le réseau en même temps ; sans l'un ni
// l'autre, la page de secours.
const OPTIONS = { ignoreVary: true };
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  e.respondWith(repondre(e, u));
});
async function repondre(e, u) {
  const nav = e.request.mode === "navigate", cle = u.origin + u.pathname, base = new URL("./", location.href).href;
  const enCache = (async () => {
    const cache = await caches.open(CACHE);
    // (une page inconnue de l'application : la page d'accueil)
    return (await cache.match(cle, OPTIONS)) ?? (nav ? await cache.match(base, OPTIONS) : undefined) ?? null;
  })().catch((err) => { e.waitUntil(noter("service worker", "cache illisible", { adresse: u.pathname, erreur: String(err?.message ?? err) })); return null; });
  const lent = attendre(DELAI_CACHE).then(() => "lent");
  const hit = await Promise.race([enCache, lent]);
  if (hit && hit !== "lent") return hit;
  if (hit === "lent") e.waitUntil(noter("service worker", "cache lent", { adresse: u.pathname, delaiMs: DELAI_CACHE }));
  const reseau = fetch(e.request).then((r) => {
    if (r.ok && !u.search) e.waitUntil(caches.open(CACHE).then((c) => c.put(cle, r.clone())).catch(() => {}));
    return r;
  });
  try {
    // (le cache lent finit parfois par répondre : le premier des deux gagne)
    return await (hit === "lent" ? Promise.any([enCache.then((h) => h ?? Promise.reject(new Error("absent du cache"))), reseau]) : reseau);
  } catch (err) {
    if (nav) { e.waitUntil(noter("service worker", "page de secours", { adresse: u.pathname, erreur: String(err?.message ?? err) })); return secours(); }
    return Response.error();
  }
}
// LA PAGE DE SECOURS (point 1 : jamais un écran figé) : ni le cache ni le réseau n'ont donné la page de l'application. Un texte
// simple, sans rien d'autre à charger ; un toucher, ou 15 secondes, et la page est redemandée.
const secours = () => new Response(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Maths CE1</title>
<style>html,body{margin:0;height:100%;background:#0b5563;color:#fff;font:600 34px/1.4 system-ui,sans-serif}body{display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer}</style></head>
<body><div><div>Maths CE1</div><div style="font-size:26px;opacity:.85;margin-top:24px">L'application n'a pas pu s'ouvrir.<br>Vérifiez le Wi-Fi, puis touchez l'écran pour réessayer.</div><div style="font-size:20px;opacity:.6;margin-top:18px">(nouvel essai toutes les 15 secondes)</div></div>
<script>addEventListener("pointerdown",function(){location.reload()});setTimeout(function(){location.reload()},15000)</script></body></html>`, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
