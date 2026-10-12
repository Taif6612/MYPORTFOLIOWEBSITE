/* Local production preview that mirrors Vercel's static behaviour:
   cleanUrls (serve /foo via foo.html), directory index, and a 404.html
   fallback. Useful for sanity-checking the built site + hydration locally.
       node scripts/serve-dist.mjs [port]
*/

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "dist");
const PORT = Number(process.argv[2]) || 4180;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".yml": "text/yaml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const send = (res, status, body, type) => {
  res.writeHead(status, { "Content-Type": type || "text/plain" });
  res.end(body);
};

const tryFile = (p) => (fs.existsSync(p) && fs.statSync(p).isFile() ? p : null);

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const rel = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    const base = path.join(ROOT, rel);

    // candidate resolution order ~ Vercel cleanUrls + directory index
    const candidate =
      tryFile(base) ||
      tryFile(`${base}.html`) ||
      tryFile(path.join(base, "index.html")) ||
      (urlPath === "/" ? tryFile(path.join(ROOT, "index.html")) : null);

    if (candidate) {
      const ext = path.extname(candidate);
      send(res, 200, fs.readFileSync(candidate), TYPES[ext] || "application/octet-stream");
      return;
    }

    const notFound = tryFile(path.join(ROOT, "404.html"));
    if (notFound) {
      send(res, 404, fs.readFileSync(notFound), TYPES[".html"]);
      return;
    }
    send(res, 404, "Not found");
  })
  .listen(PORT, () => {
    console.log(`Serving dist/ (Vercel-style) at http://localhost:${PORT}`);
  });
