// LE SERVICE WORKER : l'application entière est mise en cache à l'installation, puis servie depuis le
// cache, même sans réseau. La liste des fichiers et la version viennent de sw-files.json, produit par
// `node tools/precache.mjs` (la ligne VERSION ci-dessous est réécrite par le même outil : quand un
// fichier change, ce script change aussi, et le navigateur installe la nouvelle version).
const VERSION = "ab7c4349f7a0";
const CACHE = `ocean-${VERSION}`;

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const list = await (await fetch("sw-files.json", { cache: "no-store" })).json();
    const cache = await caches.open(CACHE);
    await cache.addAll(list.files.map((f) => new Request(f, { cache: "reload" })));
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
