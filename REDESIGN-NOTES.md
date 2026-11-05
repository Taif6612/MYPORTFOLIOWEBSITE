# Redesign Notes — 2026-11-05

Order of work: **1. sub-sites → 2. portfolio redesign (storyline) → 3. performance → 4. red-team security**.
Skills in use: impeccable (audit/redesign/polish), unslop (de-AI the look), ui-ux-pro-max (palettes/type data), frontend-design, ponytail (minimal diffs).
Deploy: Vercel auto-deploys every push to `main` (verified).

## 1. Sub-sites audit (live, taif.codes/sites/*)
| Site | Dead `#` links | Mobile overflow (375px) | Page weight | Other |
|---|---|---|---|---|
| autohub-marketplace | 15 | **+68px sideways scroll** | 1.3 MB | |
| autohub-premium | 0 | ok | 0.6 MB | 2× `<h1>` |
| campusedge-design-system | 23 | **+147px** | 6.5 MB on disk | ships dev files (SKILL.md, manifest, .d.ts, prompt.md) publicly |
| eduprime-academy | 20 | ok | 0.4 MB | |
| interior-design | 14 | ok | **3.0 MB** | `alert()` on form |
| luxeglow-spa | **30** | ok | 1.0 MB | 1 broken image |
| nestspace | 0 | **+97px** | 0.7 MB | |
| property-rental | 17 | ok | 1.1 MB | |
| solar-panel | 10 | **+45px** | 0.8 MB | 2× `alert()` |
| urban-bistro | 12 | ok | 0.6 MB | 1 broken image |

All sites hotlink Unsplash (6–40 images each) → slow, can break anytime.
**Amateur tells to fix first:** sideways scroll on phones, dead nav/footer links, `alert()` popups, broken images, heavy unoptimised images.

Plan: fix overflow + dead links (point to real sections or remove), replace `alert()` with inline success message, fix broken images, add `loading="lazy"` + sized Unsplash URLs (`w=800&q=70&auto=format`), strip dev files from campusedge. Vite apps (autohub×2, nestspace) are pre-built bundles → fix via CSS overrides in their `index.html` unless source is rebuilt.

### Phase 1 status — DONE 2026-11-05 (commit 1412d31 + each source repo)
- Zero sideways scroll at 375px on all 10 sites (overflow clip + form min-width; CampusEdge also got its missing viewport meta, injected after its bundler unpacks).
- Dead links: 77 → 0 on the static sites (socials → real platforms, legal → plain text, services → #services). AutoHub footer links are intentional demo toasts, so left as they are.
- `alert()` popups → inline button confirmation / native field validation.
- Lazy-loading on all below-the-fold images.
- CampusEdge dev files removed from the portfolio copy.
- **Still open:** CampusEdge `index.html` is a 6.4 MB self-unpacking bundle (needs unbundling, phase 3). SolarTech logo is tight on very small phones. 2 empty-src `<img>` placeholders (luxeglow, urban-bistro lightbox) are harmless.

## 2. Portfolio redesign — storyline
Proposed narrative flow (one scroll = one story):
1. **Hook** — who I am + what I make, one line.
2. **Proof** — flagship case study (ProctorLess): problem → what I built → result.
3. **Range** — the gallery of client-style sites, grouped by industry.
4. **Craft** — tools/extensions (Senior Mode, Integrity, Visa Autofiller): accessibility + automation angle.
5. **Credibility** — IEEE research, stack.
6. **Ask** — booking CTA.
Direction to be confirmed with owner (see questions).

## 3. Performance (to measure after redesign)
- Plate iframes load full sub-sites (up to 3 MB each) → load only on hover/click, poster otherwise.
- Stack icons from jsDelivr CDN → self-host as one SVG sprite.

## 4. Security (initial findings, full red-team at end)
- **Missing headers:** no Content-Security-Policy, no Permissions-Policy, HSTS lacks `includeSubDomains; preload`. (Medium)
- `/api/auth` returns 500 "Missing OAUTH_GITHUB_CLIENT_ID" → info leak + broken CMS login. (Low)
- OAuth scope `repo,user` is broad: `public_repo` is enough for a public repo. (Medium)
- Public dev artifacts in `/sites/campusedge-design-system/` (SKILL.md, manifests). (Low)
- OAuth callback: state check + pinned postMessage origin already in place ✔.
- **The GitHub token pasted in chat must be revoked.** (High)
