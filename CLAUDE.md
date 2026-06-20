# CLAUDE.md

Context for Claude Code working in this repo. (Auto-loaded each session.)

## What this is
**Taif Ur Rahman's** personal portfolio — an "editorial gallery" React/Vite site.
**Live: https://taif.codes**. Repo: https://github.com/Taif6612/MYPORTFOLIOWEBSITE (public, `main`).

## Stack & commands
- React + Vite (plain JS/JSX), GSAP + ScrollTrigger, Lenis smooth scroll, three / react-three-fiber (WebGL "detection-field" hero).
- `npm run dev` — local dev · `npm run build` — production build → `dist/` · `npm run preview` — serve the build.

## Architecture
- **`src/data/projects.js`** — single source of truth for the Work section + `profile` (name, contact, socials, about, `publications`). Edit data here, not in components.
- **`src/components/ProjectPlate.jsx`** — renders each project "plate" and its preview (see rules below).
- `src/components/` — Hero, HeroCanvas (WebGL), Header, About, Footer, WorkIndex, SignalRail, Cursor, Preloader.
- `src/styles/global.css` (tokens, resets) + `src/styles/components.css` (component styles).
- Design language: warm museum-plaster canvas, warm-black ink, one ultramarine accent (`--signal`). Fonts: Fraunces / Hanken Grotesk / Space Mono.

## Project preview rules (important — easy to break)
Each plate's preview is driven by fields on the project object:
- **`url` set** → live `<iframe>`, rendered at 1440px desktop width then **scaled to fill the box on both axes** (measures `.plate-screen` w+h). Loads on IntersectionObserver (all devices) so plates fill **before** hover.
- **GOTCHA:** `global.css` has `img, iframe { max-width: 100% }`. `.plate-screen iframe { max-width: none }` overrides it — **don't remove that**, or previews shrink to ~half width ("doesn't fit the box").
- **no `url` but `logo` set** → branded **logo card** (`logoTone: "light" | "dark"`) instead of an empty placeholder. Used for Chrome extensions (can't be iframed). Images live in `public/projects/`.
- **no `url` and no `logo`** → styled "live URL coming soon" placeholder.

## Content status
- All 13 plates have real content. Plates 04–13 are live GitHub Pages sites. **ProctorLess (01)** previews its live site `https://proctorless-app.netlify.app/` (marketing landing; dashboards are behind login with no demo account). **Extensions 02 (ProctorLess Integrity) & 03 (Senior Mode)** show logo cards.
- About → "Selected research" lists 2 IEEE publications, both linking to IEEE Xplore.

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
