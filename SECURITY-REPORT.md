# Security review: taif.codes (2026-11-05)

Scope: the live site www.taif.codes, its 10 hosted sub-sites, the `/api` OAuth functions, `/admin` (Decap CMS) and this repository. This was a black-box probe of the live site plus a code, dependency and git-history audit. It was non-destructive: no load testing and no attacks on third parties.

## Fixed (deployed in 8f66296 and later)
| Sev | Finding | Fix |
|---|---|---|
| High | **GitHub token pasted in chat** during this work session | **Owner must revoke it** (GitHub → Settings → Developer settings → Tokens). It is not stored in the repo or history. |
| Medium | No Content-Security-Policy | Strict CSP on portfolio pages: scripts and styles from self only (plus Google Fonts), `object-src 'none'`, `base-uri 'self'`, `form-action 'self' mailto:`, `frame-ancestors 'self'`. A separate, looser CSP on `/sites/*` (they need CDNs) still blocks plugins, `<base>` hijack, cross-site form posts and third-party framing. |
| Medium | OAuth origin built from `X-Forwarded-Host` / `Host`, so a spoofed host could steer where the token is posted | Origin pinned to `SITE_URL` or `https://www.taif.codes`. Verified: a spoofed header no longer changes it. |
| Medium | OAuth scope `repo,user` (full private-repo access) | Reduced to `public_repo`. |
| Low | `/api/*` leaked config state ("Missing OAUTH_GITHUB_CLIENT_ID…") and raw exception text | Generic 503/502 messages; details go to server logs only. |
| Low | HSTS without `includeSubDomains; preload` | Added. You can now submit at hstspreload.org. |
| Low | No Permissions-Policy / COOP | Camera, mic, geolocation, payment and USB denied; `Cross-Origin-Opener-Policy: same-origin`. |
| Low | CampusEdge shipped dev artifacts (`SKILL.md`, `_ds_manifest.json`, sources, `.d.ts`) | Removed. Only the page and its assets remain. |
| Low | Third-party links without `rel=noopener` (reverse tabnabbing) | All `target=_blank` links carry `noopener noreferrer`. |
| Info | Production dependency advisories | `npm audit fix` applied. |

## Verified safe
- `.git/`, `.env*`, `package.json`, source files, `CLAUDE.md`: all 404 on the live site. No source maps shipped.
- No secrets in the repo or the full git history (scanned for GitHub, AWS, OpenAI and Web3Forms key patterns).
- OAuth CSRF `state` cookie is checked; postMessage is pinned to the site origin and never posts to `*`.
- HTTP → HTTPS 308 redirect; `TRACE` is rejected (405); clickjacking is blocked (`X-Frame-Options SAMEORIGIN` + `frame-ancestors`).
- Booking form: `mailto:` only, no server endpoint to abuse; React escapes all rendered text.

## Accepted / owner decisions
- **`'unsafe-inline'` scripts in the CSP.** The static build injects per-build inline hydration data, so hashes can't be pinned in `vercel.json`. Risk is low: there is no user-generated content, and there are no third-party script origins.
- **Guides render CMS markdown as HTML.** Only GitHub-authorised editors can write content (stored XSS needs repo write access). Add `rehype-sanitize` if editors are ever untrusted.
- **Remaining advisories:**
  - vite and esbuild issues affect the local dev server only, not the built site.
  - React Router's open-redirect issue needs user-controlled `<Link>` targets, which this site doesn't use.
  - Fixing either needs major upgrades (vite 8, react-router 7); schedule separately.
- **`/admin` sign-in is not configured** (no OAuth env vars in Vercel). Either set `OAUTH_GITHUB_CLIENT_ID/SECRET` or remove `/admin` and `/api` entirely to shrink the attack surface.
- **The public CV PDF includes your phone number and a referee's personal phone number.** Consider a public version without references, because publishing a third party's number needs their consent.
- DoS and volumetric attacks are handled by Vercel's edge; nothing is app-side.
