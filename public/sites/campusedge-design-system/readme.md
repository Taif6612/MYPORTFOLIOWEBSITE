# CampusEdge Institute — Design System

> *"Empowering Future Leaders Through Excellence in Education."*

A premium design system for **CampusEdge Institute**, a (fictional) international university. It powers trustworthy, modern academic interfaces — marketing pages, program catalogs, admissions flows, faculty directories and campus storytelling — in a deep-navy / royal-blue palette with a heritage-gold accent.

This system was authored **from scratch** (no codebase, Figma, or brand kit was provided). Everything here — palette, type pairing, logo, components — is an original interpretation of the brief. **If CampusEdge has real brand assets, share them and they will replace these placeholders.**

---

## Sources
- **None provided.** Brief supplied as a written spec (premium university website, blue/white, glassmorphism, 16 marketing sections). No GitHub repo, Figma file, or existing codebase was attached.

---

## Content Fundamentals
How CampusEdge writes:
- **Voice:** confident, warm, aspirational — never stuffy or corporate. It sells a future, not a brochure.
- **Person:** speaks to *you* (the prospective student / parent), about *our* faculty and campus. "Where **you** belong," "**our** researchers."
- **Headlines:** short, declarative, often a serif italic flourish on the key word — *"Where Education Meets **Innovation**."* Title Case for nav and buttons; sentence case for body and sub-headers.
- **Eyebrows:** mono, UPPERCASE, tracked wide, often led by a short rule — `— ACADEMIC PROGRAMS`.
- **Numbers as proof:** stats are load-bearing and specific (15,000+ students, 95% employment, est. 1962). Use real-feeling figures, never vague ("many", "lots").
- **CTAs:** action verbs — "Apply Now", "Explore Programs", "Download Prospectus", "Start the tour".
- **Emoji:** never. Iconography is Font Awesome glyphs, always.
- **Tone examples:** "Preparing students for global success." / "Discovery that changes the world." / "An education built to launch careers."

---

## Visual Foundations
- **Color vibe:** authoritative + optimistic. Deep navy (`--navy-900 #0a1a3f`) anchors; royal blue (`--blue-600 #1f5bdb`) is the action color; heritage gold (`--gold-500 #e0b443`) is the prestige accent — used sparingly (one gold CTA, stat suffixes, badges). Warm-cool slate neutrals, true white surfaces.
- **Type:** **Spectral** (high-contrast scholarly serif) for all display/headings, with an *italic* accent for the hero keyword; **Plus Jakarta Sans** for UI and body; **IBM Plex Mono** for eyebrows, stats, and metadata. Headlines are tight (`-0.02em`, line-height ~1.05); body is generous (1.7).
- **Imagery:** real campus / education photography, cool-leaning, lightly desaturated until hover. Full-bleed hero with a navy left-to-transparent protection gradient. Cards crop 16:10 (programs) or 1:1 (faculty).
- **Glassmorphism:** frosted surfaces (`--glass-light`, blur 16px, hairline white border) over imagery — used for the scrolled nav, hero chips, image-corner icon medallions, and map overlay. Never on plain white sections.
- **Backgrounds:** mostly white / `--surface-subtle`. Two dark moments — the navy **stats band** and the navy **Research** section (with a faint dotted grid texture). Alternate white / subtle-gray between sections for rhythm.
- **Animation:** calm and confident. Scroll-reveal = 26px rise + fade, 0.7s `ease-out`, lightly staggered. Hover = 2–6px lift + soft shadow bloom + image zoom (scale 1.06). **No bounces, no springy overshoot.** Counters ease-out over ~1.6s on first view. A loader bar wipes once on entry.
- **Hover / press:** lift + deepen shadow for cards/buttons; arrow icons nudge 4px; medallions tilt -4°. Links shift to `--text-link`. No aggressive scale-down on press.
- **Borders:** hairline `--border-subtle` (#dde4ee) on cards; `--border-default` on inputs and active states.
- **Shadows:** soft and **cool-tinted** (navy rgba, never black) across 5 elevations + a dedicated `--shadow-gold` glow for the accent CTA and `--shadow-focus` ring.
- **Radii:** generous — cards `--radius-lg` (22px), inputs/medallions `--radius-md` (16px), pills/buttons fully rounded.
- **Layout:** 1240px max container, `clamp()` gutters and section padding, 8px spacing rhythm. Fixed glass nav, floating gold "Apply Now" pill (bottom-right) and a back-to-top button appear after 700px of scroll.
- **Dark mode:** full token override (`[data-theme="dark"]`) — navy-950 page, lighter blues for action, retained gold.

---

## Iconography
- **System:** [Font Awesome 6.5.2](https://fontawesome.com) (Free), loaded from CDN. Solid style for most UI glyphs; brand icons (`fa-brands`) for social. Stroke/fill matches FA's default weight throughout.
- **Why CDN:** no proprietary icon set was provided; Font Awesome is the substitute and is documented as such. Swap for a licensed/custom set if CampusEdge has one.
- **Logo / mark:** original SVGs in `assets/` — `logo-campusedge.svg` (full lockup, light bg), `logo-campusedge-light.svg` (reversed, for navy / imagery), `mark-campusedge.svg` (square mark — a rising "edge" double-chevron in gold + blue on navy). Used in nav, footer, and the loader.
- **Emoji / unicode:** never used as icons.

---

## Font substitution note ⚠️
Fonts load from **Google Fonts** (Spectral, Plus Jakarta Sans, IBM Plex Mono) via CDN `@import` — **no local font binaries are shipped**, so the compiler reports 0 `@font-face` files. For production / offline use, self-host the licensed binaries and add real `@font-face` rules in `tokens/fonts.css`. These three are the intended families, not stand-ins.

---

## Index / Manifest
**Foundations**
- `styles.css` — entry point (consumers link this); `@import`s the tokens below.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `effects.css` · `fonts.css`
- `guidelines/*.html` — foundation specimen cards (Design System tab).
- `assets/` — logos + mark.

**Components** (`window.CampusEdgeDesignSystem_cec608`)
- `components/core/` — **Button**, **Badge**, **Eyebrow**
- `components/cards/` — **ProgramCard**, **FeatureCard**, **StatCounter**, **FacultyCard**
- `components/forms/` — **Input**, **Accordion**

**UI Kit**
- `ui_kits/website/` — the full CampusEdge marketing site (16 sections), factored into JSX section files composed by `index.html`. Demonstrates dark mode, search/filter, scroll reveal, animated counters, loader, floating CTA, back-to-top.

**Other**
- `SKILL.md` — Agent-Skill front matter for use in Claude Code.

---

## Using it
Consumers link one file:
```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script>const { Button, ProgramCard } = window.CampusEdgeDesignSystem_cec608;</script>
```
All styling references CSS custom properties — change a token, everything follows.
