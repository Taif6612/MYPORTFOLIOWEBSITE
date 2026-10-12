# CLAUDE.md

Context for Claude Code working in this repo. (Auto-loaded each session.)

## What this is
**Taif Ur Rahman's** personal portfolio — an "editorial gallery" React/Vite site.
**Live: https://taif.codes**. Repo: https://github.com/Taif6612/MYPORTFOLIOWEBSITE (public, `main`).

## Stack & commands
- React + Vite. Homepage is **plain JS/JSX**; the blog/CMS is **TypeScript** (the two coexist — Vite compiles both). GSAP + ScrollTrigger, Lenis smooth scroll, `@paper-design/shaders-react` (`MeshGradient`) for the soft animated hero background. (The old three.js "detection-field" hero was removed — don't re-add three unless needed.)
- **Routing + SSG:** `vite-react-ssg` (+ `react-router-dom`) pre-renders every route to static HTML. The app entry is **`src/main.tsx`** (exports `createRoot`), routes in **`src/routes.tsx`**. `index.html` is the shared template — its per-page SEO `<head>` is set by React, **not** the template (don't re-add `<title>`/description there or you get duplicates on every page).
- `npm run dev` — local dev (CSR, drafts visible) · `npm run build` — **`vite-react-ssg build` → `dist/`** (feeds are written by its `onFinished` hook) · `npm run preview` — `scripts/serve-dist.mjs` on :4173, mimics Vercel cleanUrls · `npm run typecheck` (must pass) · `npm run images` — regenerate WebP images (see below).
- **Routes are lazy** (`src/routes.tsx`): each page module exports `Component`; keep every `lazy` a bare inline `import("./pages/…")` (the SSG build reads that text to emit the page's modulepreload). `vite.config.ts` `onPageRendered` strips the HeroShader preload — the shader must stay a GPU-only download.

## Architecture
- **`src/data/projects.js`** — single source of truth for the Work section. **`src/data/profile.js`** — `profile` (name, contact, socials, about, `publications`); separate so the blog chrome doesn't bundle the project list. Edit data there, not in components.
- **Images:** originals live in **`assets-src/`** (not deployed); `npm run images` (Python + Pillow, `scripts/optimize-images.py`) writes the served WebP sizes into `public/` — posters `public/projects/shots/<id>-800|1440.webp`, logo cards `public/projects/<name>.webp`, portrait `public/taif-portrait-480|960.webp`. `public/taif-portrait.jpeg` stays: it's the og:image. Commit the generated WebP files (Vercel's build has no Python).
- **`src/components/ProjectPlate.jsx`** — renders each project "plate" and its preview (see rules below).
- `src/components/` — Hero (paper-shader bg + headline/subtitle/CTAs), **HeroShader** (`MeshGradient`), Header (floating **glass nav** — `.site-head-bar`), About, Footer, WorkIndex, SignalRail, Cursor, Preloader, **Recognition** (clock band + testimonials + Stack), **Clock** (live Dhaka analog clock), **CanvasErrorBoundary**.
- **`src/data/recognition.js`** — testimonials + tech-stack icon list for the Recognition section. The testimonials are **design-tool placeholders** (illustrative, not real endorsements) — replace or remove before relying on them.
- Page order (in `App.jsx`): Hero → WorkIndex → Recognition (`#praise`) → About (`#about`) → Footer.
- **Reveal engine** (`src/lib/useReveals.js`): IntersectionObserver, not ScrollTrigger — immune to layout shift from late-loading iframes/images. Hidden initial state is gated behind `html.reveals-on` (added pre-paint only when motion allowed) so a JS/animation failure can never leave text invisible; a hero watchdog force-reveals as a last resort. **Don't reintroduce the ScrollTrigger reveal** — it caused cross-machine "missing text".
- `src/styles/global.css` (tokens, resets) + `src/styles/components.css` (component styles).
- Design language: warm museum-plaster canvas, warm-black ink, one ultramarine accent (`--signal`). Fonts: **Newsreader** (display, was Fraunces) / Hanken Grotesk / Space Mono. Portrait at `public/taif-portrait.jpeg`; resume at `public/Taif-Ur-Rahman-CV.pdf`.
- **Booking** section (`#booking`, `Booking.jsx`): Name/Email/message form. Submits via `mailto:` out of the box; set `WEB3FORMS_KEY` in the file for inline submission. Hero "Book a project" CTA + nav point here.
- **Location-neutral** for Upwork — no Dhaka/Bangladesh anywhere. The clock (`Clock.jsx`) shows the **viewer's** local time + their timezone city, not a fixed zone.

## Student Guides CMS (`/guides`, `/admin`) — TypeScript, SEO-first
File-based blog for student-guide content. Full docs: **`docs/CMS.md`**.
- **Content:** `content/guides/*.md` — frontmatter (validated by `src/cms/schema.ts`, zod) + markdown body. Drafts (`draft: true`) show in dev, excluded from the build.
- **Pipeline:** `src/cms/load.ts` (Node: gray-matter + remark/rehype → HTML, runs **only** at build/dev) → `src/cms/plugin.ts` exposes a `virtual:guides` module → `src/cms/content.ts` typed accessors. The browser bundle ships **no** markdown parser.
- **Pages:** `src/pages/` = `HomeRoute` (the `/` portfolio, wrapped in `<ClientOnly>` so shaders/Lenis/reveal engine never run in SSR — **keep it ClientOnly**, that's the no-regression guarantee), `GuidesIndex`, `GuidePost`, `TagPage`, `NotFound`. Blog chrome + styles: `src/blog/`, `src/styles/blog.css` (scoped under `.blog`, reuses the global tokens).
- **Dynamic routes** pre-render via per-route `getStaticPaths()` in `routes.tsx`, derived from `virtual:guides`. `dirStyle: "flat"` so `/404` → `dist/404.html` (Vercel's not-found) and posts → `foo.html`; `vercel.json` `cleanUrls` serves them extensionless. `ssgOptions.beastiesOptions: false` (don't let critical-CSS inlining rewrite the tuned font head).
- **SEO:** `src/blog/Seo.tsx` (vite-react-ssg `<Head>`) emits title/desc/canonical/OG/Twitter + JSON-LD (`BlogPosting` + `BreadcrumbList`; hub = `Blog`). **JSON-LD must be a string child** of `<script>`, not `dangerouslySetInnerHTML` (helmet ignores the latter). `src/cms/feeds.ts` writes `sitemap.xml`/`rss.xml`/`robots.txt` to `dist/` from the same `loadGuides()` result (via `ssgOptions.onFinished`). All guide/tag URLs come from `src/cms/paths.ts` (`slugify`, `guidePath`, `tagPath`, `countTags`) — never build them inline. Canonical host is **`https://www.taif.codes`** (`SITE.url` in `src/blog/site.ts`).
- **Editor `/admin`:** Decap CMS (`public/admin/`), GitHub backend, commits to `content/guides`. OAuth via serverless `api/auth.js` + `api/callback.js` — needs a GitHub OAuth App + `OAUTH_GITHUB_CLIENT_ID/SECRET` in Vercel (see `.env.example` / `docs/CMS.md`). Decap fields in `public/admin/config.yml` must stay in sync with `schema.ts`.

## Project preview rules (important — easy to break)
Each plate's preview is driven by fields on the project object:
- **`url` set** → live `<iframe>`, rendered at 1440px desktop width then **scaled to fill the box on both axes** (measures `.plate-screen` w+h). Loads on IntersectionObserver (all devices) so plates fill **before** hover.
- **GOTCHA:** `global.css` has `img, iframe { max-width: 100% }`. `.plate-screen iframe { max-width: none }` overrides it — **don't remove that**, or previews shrink to ~half width ("doesn't fit the box").
- **no `url` but `logo` set** → branded **logo card** (`logoTone: "light" | "dark"`) instead of an empty placeholder. Used for Chrome extensions (can't be iframed). Images live in `public/projects/`.
- **no `url` and no `logo`** → styled "live URL coming soon" placeholder.

## Self-hosted previews (important)
- Plates 04–13 are **self-hosted**, not iframed from GitHub Pages. Each site's files live in **`public/sites/<id>/`** and the `EMBEDDED` map in `projects.js` points each `url` to the clean dir path **`/sites/<id>/`** (served first-party from taif.codes → fast, professional, no external dep). `ProjectPlate` computes the iframe src as `/sites/<id>/index.html` while the shareable "Open live" link stays the clean dir url.
- The 7 static sites were copied as-is; the 3 Vite apps (autohub-marketplace, autohub-premium, nestspace) were **built with `vite build --base=/sites/<id>/`** (use `MSYS_NO_PATHCONV=1` in Git Bash or the base gets mangled) and their `dist/` copied into `public/sites/<id>/`. Source projects live in `D:\Github\WebsitePortfolio`. To refresh one: rebuild with that base and re-copy.

## Content status
- All 13 plates have real content. Plates 04–13 are self-hosted (above). **ProctorLess (01)** previews its live site `https://proctorless-app.netlify.app/` (still external; marketing landing). **Extensions 02 (ProctorLess Integrity) & 03 (Senior Mode)** show logo cards.
- **Recognition (`#praise`)** has: an availability card with a Resume download, a live Dhaka analog clock, a "Real artists ship." quote, two testimonial marquees (**placeholder quotes — swap for real ones**), and a Stack grid (18 devicon icons from jsDelivr CDN).
- About has the portrait photo + "Selected research" listing 2 IEEE publications, both linking to IEEE Xplore.
- Hero headline is **"Turning your ideas into pixel perfect realities."** with two interactive hovers (hardcoded in `Hero.jsx`, not `profile.thesis`): `.fx-pixel` ("pixel") pixelates via the `#px-filter` SVG filter in `index.html`; `.fx-magic` ("perfect realities") does a gradient shimmer + ✦ sparkles. Subtitle has a rotating word (`RotatingWord.jsx`, animated-hero style). `profile.thesis` is now unused.

## Deploy & domain
- Hosted on **Vercel**: project `taif-portfolio`, team `taifurrahman66123-7850s-projects`.
- **Custom domain `taif.codes`** (registrar **name.com**, its own nameservers host DNS). `www.taif.codes` is primary; apex `taif.codes` 308-redirects to www. DNS records: apex `A → 216.198.79.1` + `64.29.17.1`; `www CNAME → 47e378f092038531.vercel-dns-017.com`. Vercel auto-SSL.
- **NOT connected to GitHub auto-deploy** — a `git push` does **not** update the live site. Deploy manually: `vercel deploy --prod` (requires the owner's Vercel login/token + `--scope taifurrahman66123-7850s-projects`). To make pushes auto-deploy, connect the repo in Vercel → project → Settings → Git.
- **Secrets:** never commit tokens/keys. The owner provides credentials at runtime and rotates them afterward. Don't store them in this repo or in code.

## Pending / next steps
- Add short **GIFs** demoing: ProctorLess **student** + **teacher** dashboards, and the two **extensions in action**. When supplied, add a media slot in `projects.js` / `ProjectPlate.jsx`.
- Optionally connect GitHub ↔ Vercel for auto-deploy.
- **Caching / headers** (`vercel.json`): hashed `/assets/*` and the 3 Vite sites' `/sites/<id>/assets/*` are `immutable`; other images/PDF get 1 day + SWR; HTML keeps Vercel's revalidate-always default. The cache rules are written to never overlap (don't rely on rule order). Global nosniff / Referrer-Policy / X-Frame-Options SAMEORIGIN; `/admin` also gets `frame-ancestors 'none'` and a script-src CSP meta. Decap is pinned with an SRI hash in `public/admin/index.html` — recompute when upgrading.

## Recent work (2026-06-21)
Fixed preview box-fit (the `max-width` cap), switched previews to in-view loading, wired the ProctorLess live preview, added extension logo cards, linked the IEEE papers, removed the duplicated name in the hero. Connected and verified `taif.codes` (name.com DNS + Vercel), then deployed to production.

Later same day: fixed the cross-machine bug (text vanishing / animation invisible) by gating reveals behind `html.reveals-on` + a watchdog and adding a WebGL error boundary + capability check; the detection field now also renders frozen under reduced-motion. Then ported the missing Claude-design sections into React: the Recognition section (live Dhaka clock, availability/resume card, testimonial marquees, Stack grid) and the About portrait, and swapped the reveal engine from ScrollTrigger to IntersectionObserver. **Committed locally; not yet pushed/redeployed at time of writing.**
