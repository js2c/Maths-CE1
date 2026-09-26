// Petit serveur statique pour les tests : sert app/ comme GitHub Pages le fera (sous un sous-chemin,
// pour vérifier que tous les chemins sont relatifs). node tests/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../app/", import.meta.url)), PREFIX = "/Maths-CE1/";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".ogg": "audio/ogg" };
export const serve = (port = 0) => new Promise((res) => {
  const srv = createServer(async (req, rsp) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!url.startsWith(PREFIX)) { rsp.writeHead(302, { location: PREFIX }); return rsp.end(); }
    let p = normalize(join(ROOT, url.slice(PREFIX.length)));
    if (!p.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
    try { if ((await stat(p)).isDirectory()) p = join(p, "index.html"); const body = await readFile(p); rsp.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream", "cache-control": "no-cache" }); rsp.end(body); }
    catch { rsp.writeHead(404); rsp.end("introuvable"); }
  });
  srv.listen(port, "127.0.0.1", () => res({ srv, url: `http://127.0.0.1:${srv.address().port}${PREFIX}` }));
});
if (import.meta.url === `file://${process.argv[1]}`) { const { url } = await serve(Number(process.argv[2] ?? 8080)); console.log(`app servie sur ${url}`); }
