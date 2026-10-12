/* =========================================================================
   CMS — Vite plugin exposing `virtual:guides`
   -------------------------------------------------------------------------
   Parses + compiles the guides in Node and serves them to the app as a
   plain data module. The browser bundle therefore never ships gray-matter,
   remark, or rehype. Drafts are included in dev (so you can preview them)
   and excluded from the production build.

   HMR: editing/adding/removing a file in content/guides triggers a reload.
   ========================================================================= */

import type { Plugin } from "vite";
import { loadGuides, CONTENT_DIR } from "./load";

const VIRTUAL_ID = "virtual:guides";
const RESOLVED_ID = "\0virtual:guides";

const norm = (p: string) => p.replace(/\\/g, "/");

export function guidesPlugin(): Plugin {
  let isBuild = false;

  return {
    name: "cms-guides",

    configResolved(config) {
      isBuild = config.command === "build";
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return null;
      const guides = await loadGuides({ includeDrafts: !isBuild });
      return `export const guides = ${JSON.stringify(guides)};`;
    },

    configureServer(server) {
      const contentDir = norm(CONTENT_DIR);
      const affected = (file: string) => norm(file).startsWith(contentDir);

      const invalidate = (file: string) => {
        if (!affected(file)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.add(CONTENT_DIR);
      server.watcher.on("add", invalidate);
      server.watcher.on("change", invalidate);
      server.watcher.on("unlink", invalidate);
    },
  };
}
