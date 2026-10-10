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
const VERSION = "85b1b8e2a3b1";
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
    const list = await (await chercher("sw-files.json", { cache: "no-store" })).json(), all = new Set(list.files);
    const files = list.files.filter((f) => useful(f, all));
    // (le cache de cette version peut déjà contenir une partie des fichiers : une tentative précédente interrompue)
    const cache = await caches.open(CACHE), deja = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));
    const base = new URL("./", location.href).pathname, reste = files.filter((f) => !deja.has(base + (f === "./" ? "" : f)));
    for (let i = 0; i < reste.length; i += PAQUET) {
      await Promise.all(reste.slice(i, i + PAQUET).map(async (f) => {
        const old = immuable(f) && (await caches.match(f));
        await cache.put(f, old || (await chercher(f)));
      }));
    }
  })());
});
// la version prend la main : au lancement suivant (plus aucune page de l'ancienne), ou quand la page le demande, pendant
// l'écran de démarrage, avant le toucher (« activer » : main.js, engine/miseajour.js) ; elle seule reste en cache
self.addEventListener("message", (e) => { if (e.data === "activer") self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("ocean-") && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
// d'abord le cache ; à défaut le réseau (et ce qui arrive est gardé pour la prochaine fois)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE), hit = await cache.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    const r = await fetch(e.request);
    if (r.ok) cache.put(e.request, r.clone());
    return r;
  })());
});
