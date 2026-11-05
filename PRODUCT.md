# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two equal audiences:
- **Freelance clients** (Upwork, small businesses, agencies in AU/UK/US) deciding whether to hire Taif to build their site or web app.
- **Employers / recruiters** screening a junior full-stack / front-end engineer.
Both arrive from a link (Upwork profile, CV, LinkedIn), skim on desktop or phone, and decide in under a minute.

## Product Purpose
Personal portfolio of Taif Ur Rahman. Success = a client books a project (`#booking`) or a recruiter downloads the CV / opens GitHub.

## Positioning
**Ships complete sites fast.** 10+ polished, fully built client-style sites, live and hosted on the portfolio itself, plus real products (ProctorLess, Senior Mode, AHMS) and real client work at Team GY6. Visitors can open and use every site, not just look at screenshots.

## Capabilities and Constraints
- React + Vite + vite-react-ssg, deployed on Vercel (auto-deploy from `main`). Embedded sub-sites are served from `public/sites/<id>/`.
- Location-neutral for Upwork: no city or country in the UI, and the phone number is not shown.
- Must stay fast: Lighthouse-grade performance is part of the pitch.

## Evidence on Hand
- **Graduated:** B.Sc. Computer Science, Independent University Bangladesh (2022–May 2026), Minor in Communications. Winner, Algorithm Project Showcase, TechFest.
- **Experience:** Software Engineering Intern, Riseup Labs (Sep 2026–present): took AHMS from PRD to V1, 18 backend modules, 37 screens, 148 pytest + 66 Playwright tests. Full-Stack Developer Intern, Team GY6 (Feb–Jul 2026, remote): Next.js + WooCommerce sites for clients in Australia and the UK, n8n automations; term extended by a month.
- **Projects:** ProctorLess, Senior Mode, ProctorLess Integrity extension, Sticker Visa Autofiller, Care Operations Automation System (n8n/ClickUp), AHMS, 10 showcase sites (`src/data/projects.js`).
- **Research:** 2 IEEE papers (ICSADL 2026, ICOIICS 2025).
- CV: `public/Taif-Ur-Rahman-CV.pdf` (latest). Portrait: `public/taif-portrait.jpeg`.
- **Absent, do not fabricate:** testimonials, client logos, revenue or traffic numbers.

## Product Principles
1. Show the work and let people use it; the sites are the proof.
2. Every claim is something a visitor can verify (link, live site, paper, CV).
3. Speed is part of the pitch: a slow portfolio disproves the claim.
4. Story over list: hook → proof → range → depth → credibility → ask.

## Accessibility & Inclusion
Accessibility is part of Taif's identity (Senior Mode). Target WCAG 2.2 AA, full keyboard use, and respect for `prefers-reduced-motion`, with the showpiece motion fully degradable.
