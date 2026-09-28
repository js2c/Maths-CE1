// LE SERVICE WORKER : l'application entière est mise en cache à l'installation, puis servie depuis le
// cache, même sans réseau. La liste des fichiers et la version viennent de sw-files.json, produit par
// `node tools/precache.mjs` (la ligne VERSION ci-dessous est réécrite par le même outil : quand un
// fichier change, ce script change aussi, et le navigateur installe la nouvelle version).
const VERSION = "5a797414cef6";
const CACHE = `ocean-${VERSION}`;
// la résolution des planches d'images de cet écran (main.js : sw.js?r=1 ou ?r=2) : on ne met en cache que
// celle-là (une planche qui n'existe qu'en @1x, comme les rayons, est toujours gardée)
const RES = new URL(location.href).searchParams.get("r");
// (une planche peut avoir plusieurs pages : pieuvre-gestes@2x-0.webp, pieuvre-gestes@2x-1.webp)
const useful = (f, all) => { const m = /^(assets\/art\/.+)@([12])x(-\d+)?\.webp$/.exec(f); return !m || !RES || m[2] === RES || ![...all].some((g) => g.startsWith(`${m[1]}@${RES}x`) && g.endsWith(".webp")); };

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const list = await (await fetch("sw-files.json", { cache: "no-store" })).json(), all = new Set(list.files);
    list.files = list.files.filter((f) => useful(f, all));
    const cache = await caches.open(CACHE);
    // les fichiers son sont nommés par l'empreinte de leur contenu : déjà dans le cache d'une version
    // précédente, ils sont repris tels quels (une mise à jour ne retélécharge pas toute la voix)
    const immuable = (f) => /^assets\/voix\/[0-9a-f]{12}\.ogg$/.test(f) || /^assets\/son\/[a-z-]+-[0-9a-f]{8}\.ogg$/.test(f), reseau = [];
    for (const f of list.files) { const old = immuable(f) && (await caches.match(f)); if (old) await cache.put(f, old); else reseau.push(f); }
    await cache.addAll(reseau.map((f) => new Request(f, { cache: "reload" })));
    await self.skipWaiting();
  })());
});
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
