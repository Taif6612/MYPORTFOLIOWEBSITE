# Student Guides — CMS & Blog

An SEO-first, file-based content system for the **Student Guides** section, built
in TypeScript on top of the existing Vite + React site. Posts are Markdown files
with typed frontmatter, validated at build time and **pre-rendered to static HTML**
so search engines and social scrapers see real content (not an empty SPA shell).

- **Hub:** `/guides` · **Post:** `/guides/<slug>` · **Tag:** `/guides/tag/<tag>`
- **Editor:** `/admin` (Decap CMS, commits to this repo)
- **Feeds:** `/sitemap.xml`, `/rss.xml`, `/robots.txt` (generated at build)

---

## How it fits together

```
content/guides/*.md          ← the content (frontmatter + markdown body)
        │
src/cms/schema.ts            ← zod schema: validates frontmatter
src/cms/paths.ts             ← slugify + guidePath/tagPath + tag grouping (pure; the only URL builders)
src/cms/load.ts              ← Node: parse + compile markdown → HTML (remark/rehype)
src/cms/plugin.ts            ← Vite plugin → exposes `virtual:guides`
        │
src/cms/content.ts           ← typed accessors (getGuide, getAllTags, …)
src/pages/*.tsx              ← GuidesIndex / GuidePost / TagPage / NotFound
src/blog/Seo.tsx             ← per-route <head> (OG, Twitter, JSON-LD, canonical)
src/routes.tsx               ← route table (getStaticPaths for dynamic routes)
        │
vite-react-ssg build         ← pre-renders every route to dist/*.html
src/cms/feeds.ts             ← onFinished hook: sitemap.xml / rss.xml / robots.txt from the same guides
```

The browser bundle never ships a Markdown parser: parsing/validation/compilation
all run in Node, and the app imports the finished data through `virtual:guides`.

---

## Writing a guide (two ways)

### A. In the browser — `/admin`

Go to **https://www.taif.codes/admin**, sign in with GitHub, and use the editor. Saving
commits a new `content/guides/<slug>.md` to `main`. (One-time setup below.)

### B. In code

Create `content/guides/my-slug.md`:

```markdown
---
title: "My Guide Title"
description: "120–160 char summary — this is the SEO meta description + card text."
date: 2026-06-25
tags: ["Career", "Front-End"]
author: "Taif Ur Rahman"
featured: false
draft: false
---

Your markdown body. GitHub-flavoured markdown is supported: **bold**, lists,
tables, `code`, fenced code blocks (with syntax highlighting), blockquotes, etc.

## Headings become the table of contents

H2/H3 headings get anchor ids and feed the "On this page" TOC automatically.
```

`npm run dev` → open `/guides`. Drafts (`draft: true`) show in dev and are
excluded from the production build.

### Frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Post title |
| `description` | yes | ≤ 300 chars; used as meta description + card text |
| `date` | yes | Publish date (ISO `YYYY-MM-DD`) |
| `updated` | no | Last-updated date |
| `tags` | no | Array of strings; each becomes a `/guides/tag/<slug>` page ("Front-End" → `front-end`). Tags with the same slug are one tag. |
| `cover` | no | Image path, e.g. `/uploads/guides/cover.jpg` |
| `coverAlt` | no | Alt text for the cover |
| `author` | no | Defaults to "Taif Ur Rahman" |
| `featured` | no | Marks a flagship post (`getFeatured()`) |
| `draft` | no | `true` = hidden from the live build |
| `slug` | no | Override the URL (lowercase letters, digits, dashes); defaults to the filename. Must be unique. |

Validation lives in `src/cms/schema.ts` — keep it in sync with the Decap fields
in `public/admin/config.yml`.

---

## Commands

```bash
npm run dev        # local dev (CSR) — drafts visible, HMR on content edits
npm run build      # SSG build → dist/*.html  +  sitemap/rss/robots
npm run preview    # serve dist/ like Vercel does (cleanUrls, 404.html) on :4173
npm run typecheck  # tsc --noEmit
```

---

## SEO that ships in the HTML

Every guide's static `.html` contains, in `<head>`:

- `<title>` + meta description + `<link rel="canonical">`
- OpenGraph (`og:*`) + Twitter card (`summary_large_image`)
- `article:published_time` / `modified_time` / `tag`
- JSON-LD `BlogPosting` **and** `BreadcrumbList`

The hub adds JSON-LD `Blog`; tag pages add `CollectionPage`. `sitemap.xml`,
`rss.xml`, and `robots.txt` are written to `dist/` after the build.

---

## One-time setup for the `/admin` editor (Decap + GitHub OAuth)

Vercel has no built-in Git Gateway, so two small serverless functions handle the
GitHub OAuth handshake: `api/auth.js` and `api/callback.js`.

1. **Create a GitHub OAuth App** — https://github.com/settings/developers → *New OAuth App*
   - Homepage URL: `https://www.taif.codes`
   - Authorization callback URL: `https://www.taif.codes/api/callback`
   - Use the **www** host exactly. The apex `taif.codes` redirects to www, so
     `/api/auth` always runs on www and sends a www `redirect_uri`; GitHub
     rejects it if the registered callback host differs. `base_url` in
     `public/admin/config.yml` must be the same origin — Decap ignores the
     login reply from any other origin.
2. **Add env vars in Vercel** (Project → Settings → Environment Variables, Production + Preview):
   - `OAUTH_GITHUB_CLIENT_ID`
   - `OAUTH_GITHUB_CLIENT_SECRET`
3. Redeploy. Visit `https://www.taif.codes/admin` → **Login with GitHub**.

See `.env.example`. The repo/branch the editor writes to is set in
`public/admin/config.yml` (`Taif6612/MYPORTFOLIOWEBSITE`, `main`).

> Tip: to edit in the browser **locally**, uncomment `local_backend: true` in
> `config.yml` and run `npx decap-server` alongside `npm run dev`.

---

## Notes & gotchas

- **Homepage is untouched.** `/` renders the existing portfolio via `<ClientOnly>`,
  so its shaders / Lenis / reveal engine never run during SSR — zero hydration risk.
- **Clean URLs / 404.** `dirStyle: "flat"` + `vercel.json` `cleanUrls` serve
  `/guides/foo` from `foo.html`; `dist/404.html` is Vercel's not-found page.
- **TypeScript is additive.** Only the CMS/blog is TS; the existing `.jsx` is
  unchanged (Vite compiles both).
- **Uploaded images** go to `public/uploads/guides/` (referenced as `/uploads/guides/...`).
