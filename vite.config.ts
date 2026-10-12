import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { guidesPlugin } from "./src/cms/plugin";
import { loadGuides } from "./src/cms/load";
import { writeFeeds } from "./src/cms/feeds";

// The homepage is a lazy route, and vite-react-ssg preloads every chunk its
// module graph can reach — including the WebGL mesh shader, which Hero.jsx
// deliberately downloads only on hardware-accelerated GPUs. Dropping that one
// preload keeps software-GPU devices (and Lighthouse) from fetching it.
const CONDITIONAL_CHUNK_PRELOAD = /<link\b[^>]*\brel="modulepreload"[^>]*\/HeroShader-[^>]*>\s*/g;

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
    onPageRendered: (_route, html) => html.replace(CONDITIONAL_CHUNK_PRELOAD, ""),
    // Feeds come from the same validated guides the pages were rendered from.
    onFinished: async (outDir) => writeFeeds(outDir, await loadGuides()),
  },
});
