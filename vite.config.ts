import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { guidesPlugin } from "./src/cms/plugin";
import { loadGuides } from "./src/cms/load";
import { writeFeeds } from "./src/cms/feeds";

// The homepage is a lazy route, and vite-react-ssg preloads every chunk its
// module graph can reach — including the pixel room (three.js, ~500 KB), which
// Hero.jsx deliberately fetches only after the page has loaded. Dropping that
// preload keeps it from competing with the page's own scripts and fonts.
const CONDITIONAL_CHUNK_PRELOAD = /<link\b[^>]*\brel="modulepreload"[^>]*\/pixelRoom-[^>]*>\s*/g;

// vite-react-ssg writes `window.__VITE_REACT_SSG_HASH__ = '<random per build>'` into an
// inline script on every page (the client reads it on navigation to find the static
// loader-data manifest). A per-build random value can't be allowed by a CSP hash, so the
// placeholder script becomes an external /ssg-hash.js, written once the build knows the hash.
// The other inline script, react-router's hydration data, is the same on every page and every
// build, so vercel.json's CSP allows it by hash ('sha256-gOx3…'). If it ever changes (a route
// gains a loader, a router upgrade), the build stops here instead of shipping a page the CSP blocks.
const ROUTER_HYDRATION_SCRIPT = String.raw`<script>window.__staticRouterHydrationData = JSON.parse("{\"loaderData\":{},\"actionData\":null,\"errors\":null}");</script>`;
const SSG_HASH_PLACEHOLDER ="<script>/* SCRIPT_COMMENT_PLACEHOLDER */</script>";
const writeSsgHash = (outDir: string) => {
  const hash = fs.readdirSync(outDir).map((f) => /^static-loader-data-manifest-(\w+)\.json$/.exec(f)?.[1]).find(Boolean);
  if (!hash) throw new Error("vite-react-ssg loader-data manifest not found: can't write ssg-hash.js");
  fs.writeFileSync(path.join(outDir, "ssg-hash.js"), `window.__VITE_REACT_SSG_HASH__ = '${hash}';\n`);
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), guidesPlugin()],
  server: {
    port: 5173,
    open: true,
  },
  // Static-site-generation options (consumed by `vite-react-ssg build`).
  ssgOptions: {
    // /guides/foo -> dist/guides/foo.html, /404 -> dist/404.html (so Vercel
    // auto-serves it). cleanUrls in vercel.json serves these without the
    // extension.
    dirStyle: "flat",
    script: "async",
    // The homepage manages its own non-blocking font <head>; don't let the
    // critical-CSS inliner rewrite it.
    beastiesOptions: false,
    onPageRendered: (_route, html) => {
      if (!html.includes(ROUTER_HYDRATION_SCRIPT)) throw new Error("router hydration script changed: update its sha256 in vercel.json's CSP and ROUTER_HYDRATION_SCRIPT");
      if (!html.includes(SSG_HASH_PLACEHOLDER)) throw new Error("vite-react-ssg hash placeholder changed: update vite.config.ts");
      return html.replace(CONDITIONAL_CHUNK_PRELOAD, "").replace(SSG_HASH_PLACEHOLDER, '<script defer src="/ssg-hash.js"></script>');
    },
    // Feeds come from the same validated guides the pages were rendered from.
    onFinished: async (outDir) => {
      writeSsgHash(outDir);
      await writeFeeds(outDir, await loadGuides());
    },
  },
});
