# Taif Ur Rahman — Portfolio

An editorial-gallery portfolio with a living "signal" identity: a calm museum
canvas threaded by one electric ultramarine signal line, a WebGL detection-field
hero, and live, interactive previews of every shipped site.

**Stack:** React + Vite · GSAP + ScrollTrigger · Lenis smooth scroll ·
three / react-three-fiber (WebGL hero) · plain CSS design tokens.

---

## Run it locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173.

```bash
npm run build     # production build → /dist
npm run preview   # preview the production build locally
```

---

## Add your projects (the only file you normally touch)

Everything in the **Work** section is driven by `src/data/projects.js`.
For each project, fill in:

```js
{
  id: "my-site",            // unique, used as the scroll anchor
  index: "04",              // gallery plate number
  title: "My Site",
  category: "Landing Page", // also feeds the filter bar
  year: "2025",
  role: "Front-end UI",
  summary: "One or two sentences, written from the visitor's side.",
  stack: ["React", "Tailwind"],
  url: "https://yourname.github.io/my-site/",  // ← LIVE url, powers the preview
  repo: "https://github.com/yourname/my-site",  // optional ("" hides it)
  featured: false,          // true = large case plate near the top
}
```

- Leave `url: ""` to show a styled placeholder until the site is ready.
- The first three are pre-seeded as **featured** flagships
  (ProctorLess, its integrity extension, and Senior Mode) — edit as needed.
- Edit your name, thesis line, socials, and about copy in the `profile`
  object at the bottom of the same file.

### Live preview note (important)

Previews embed each site in an `<iframe>`. A site can only be framed if it
**does not** send `X-Frame-Options: DENY/SAMEORIGIN` or a restrictive
`Content-Security-Policy: frame-ancestors`. Plain **GitHub Pages sites allow
framing by default**, so your standby sites should preview fine. If one refuses
to load, the plate still links out via "Open live" — or swap that plate to a
static screenshot.

---

## Accessibility & performance built in

- `prefers-reduced-motion` disables the WebGL field, smooth scroll, the custom
  cursor, and all reveals — the site drops to a calm static version.
- The custom cursor is pointer-device only; touch gets native behaviour.
- WebGL is lazy-loaded and capped at 1.75× DPR; previews load on hover (desktop)
  or as they near the viewport (touch), so you never load 13 sites at once.
- Visible keyboard focus, semantic landmarks, labelled controls.

---

## Deploy

**Vercel** — import the repo, framework preset **Vite**, build `npm run build`,
output `dist`. Done.

**Netlify** — build command `npm run build`, publish directory `dist`.

Both auto-deploy on every push once you connect the GitHub repo.
