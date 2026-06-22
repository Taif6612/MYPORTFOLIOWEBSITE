# CLAUDE.md

Context for Claude Code working in this repo. (Auto-loaded each session.)

## What this is
**Taif Ur Rahman's** personal portfolio — an "editorial gallery" React/Vite site.
**Live: https://taif.codes**. Repo: https://github.com/Taif6612/MYPORTFOLIOWEBSITE (public, `main`).

## Stack & commands
- React + Vite (plain JS/JSX), GSAP + ScrollTrigger, Lenis smooth scroll, `@paper-design/shaders-react` (`MeshGradient`) for the soft animated hero background. (The old three.js "detection-field" hero was removed — don't re-add three unless needed.)
- `npm run dev` — local dev · `npm run build` — production build → `dist/` · `npm run preview` — serve the build.

## Architecture
- **`src/data/projects.js`** — single source of truth for the Work section + `profile` (name, contact, socials, about, `publications`). Edit data here, not in components.
- **`src/components/ProjectPlate.jsx`** — renders each project "plate" and its preview (see rules below).
- `src/components/` — Hero (paper-shader bg + headline/subtitle/CTAs), **HeroShader** (`MeshGradient`), Header (floating **glass nav** — `.site-head-bar`), About, Footer, WorkIndex, SignalRail, Cursor, Preloader, **Recognition** (clock band + testimonials + Stack), **Clock** (live Dhaka analog clock), **CanvasErrorBoundary**.
- **`src/data/recognition.js`** — testimonials + tech-stack icon list for the Recognition section. The testimonials are **design-tool placeholders** (illustrative, not real endorsements) — replace or remove before relying on them.
- Page order (in `App.jsx`): Hero → WorkIndex → Recognition (`#praise`) → About (`#about`) → Footer.
- **Reveal engine** (`src/lib/useReveals.js`): IntersectionObserver, not ScrollTrigger — immune to layout shift from late-loading iframes/images. Hidden initial state is gated behind `html.reveals-on` (added pre-paint only when motion allowed) so a JS/animation failure can never leave text invisible; a hero watchdog force-reveals as a last resort. **Don't reintroduce the ScrollTrigger reveal** — it caused cross-machine "missing text".
- `src/styles/global.css` (tokens, resets) + `src/styles/components.css` (component styles).
- Design language: warm museum-plaster canvas, warm-black ink, one ultramarine accent (`--signal`). Fonts: **Newsreader** (display, was Fraunces) / Hanken Grotesk / Space Mono. Portrait at `public/taif-portrait.jpeg`; resume at `public/Taif-Ur-Rahman-CV.pdf`.
- **Booking** section (`#booking`, `Booking.jsx`): Name/Email/message form. Submits via `mailto:` out of the box; set `WEB3FORMS_KEY` in the file for inline submission. Hero "Book a project" CTA + nav point here.
- **Location-neutral** for Upwork — no Dhaka/Bangladesh anywhere. The clock (`Clock.jsx`) shows the **viewer's** local time + their timezone city, not a fixed zone.

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
- Hero thesis is "Interfaces that watch, adapt, and include." (an earlier Claude-design pass used "read the room, and let everyone in" — repo keeps the former).

## Deploy & domain
- Hosted on **Vercel**: project `taif-portfolio`, team `taifurrahman66123-7850s-projects`.
- **Custom domain `taif.codes`** (registrar **name.com**, its own nameservers host DNS). `www.taif.codes` is primary; apex `taif.codes` 308-redirects to www. DNS records: apex `A → 216.198.79.1` + `64.29.17.1`; `www CNAME → 47e378f092038531.vercel-dns-017.com`. Vercel auto-SSL.
- **NOT connected to GitHub auto-deploy** — a `git push` does **not** update the live site. Deploy manually: `vercel deploy --prod` (requires the owner's Vercel login/token + `--scope taifurrahman66123-7850s-projects`). To make pushes auto-deploy, connect the repo in Vercel → project → Settings → Git.
- **Secrets:** never commit tokens/keys. The owner provides credentials at runtime and rotates them afterward. Don't store them in this repo or in code.

## Pending / next steps
- Add short **GIFs** demoing: ProctorLess **student** + **teacher** dashboards, and the two **extensions in action**. When supplied, add a media slot in `projects.js` / `ProjectPlate.jsx`.
- Optionally connect GitHub ↔ Vercel for auto-deploy.
- `public/projects/proctorless.png` is a 398 KB 2048px source — downscale when an image tool is available.

## Recent work (2026-06-21)
Fixed preview box-fit (the `max-width` cap), switched previews to in-view loading, wired the ProctorLess live preview, added extension logo cards, linked the IEEE papers, removed the duplicated name in the hero. Connected and verified `taif.codes` (name.com DNS + Vercel), then deployed to production.

Later same day: fixed the cross-machine bug (text vanishing / animation invisible) by gating reveals behind `html.reveals-on` + a watchdog and adding a WebGL error boundary + capability check; the detection field now also renders frozen under reduced-motion. Then ported the missing Claude-design sections into React: the Recognition section (live Dhaka clock, availability/resume card, testimonial marquees, Stack grid) and the About portrait, and swapped the reveal engine from ScrollTrigger to IntersectionObserver. **Committed locally; not yet pushed/redeployed at time of writing.**
