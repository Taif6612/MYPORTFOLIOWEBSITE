/* =========================================================================
   Route table
   -------------------------------------------------------------------------
   "/"                  the existing portfolio homepage (client-only — wrapped
                        in <ClientOnly> so its shaders / Lenis / reveal engine
                        never run during SSR, exactly preserving today's behaviour)
   "/guides"            student-guides index
   "/guides/tag/:tag"   posts filtered by tag (pre-rendered per tag)
   "/guides/:slug"      a single guide (pre-rendered per post)
   "/404"               emitted as dist/404.html for not-found pages

   Dynamic routes list their concrete paths via getStaticPaths(), which reads
   the already-validated `virtual:guides` data (drafts excluded in the build).

   Every page is a lazy route (each page module exports `Component`), so each
   page ships only its own code: the homepage never downloads the guides'
   rendered HTML, and the guides never download the portfolio (shader, Lenis,
   plates). vite-react-ssg resolves the matched lazy route before hydrating,
   so there's no hydration mismatch. `virtual:guides` is imported lazily in
   getStaticPaths for the same reason.

   Keep each `lazy` a bare inline `import("./pages/…")`: the SSG build finds a
   page's chunk (to emit its <link rel="modulepreload">) by reading the lazy
   function's source text.
   ========================================================================= */

import type { RouteRecord } from "vite-react-ssg";
import RouteError from "./pages/RouteError";

// files from an earlier deploy (an open tab, a back-button page) reload once instead of breaking: see RouteError
const errorElement = <RouteError />;

export const routes: RouteRecord[] = [
  { path: "/", errorElement, lazy: () => import("./pages/HomeRoute") },
  { path: "/guides", errorElement, lazy: () => import("./pages/GuidesIndex") },
  {
    path: "/guides/tag/:tag",
    errorElement,
    lazy: () => import("./pages/TagPage"),
    getStaticPaths: async () => {
      const { getAllTags, tagPath } = await import("./cms/content");
      return getAllTags().map((t) => tagPath(t.tag));
    },
  },
  {
    path: "/guides/:slug",
    errorElement,
    lazy: () => import("./pages/GuidePost"),
    getStaticPaths: async () => {
      const { allGuides, guidePath } = await import("./cms/content");
      return allGuides.map((g) => guidePath(g.slug));
    },
  },
  { path: "/404", errorElement, lazy: () => import("./pages/NotFound") },
  { path: "*", errorElement, lazy: () => import("./pages/NotFound") },
];
