/* =========================================================================
   CMS — sitemap.xml, rss.xml and robots.txt (Node only)
   -------------------------------------------------------------------------
   Written into the build output by the SSG build's `onFinished` hook (see
   vite.config.ts) from the same validated guides the pages were rendered
   from — so the feeds can never list a URL the build didn't produce, and
   the site URL / paths come from the same helpers as the pages.
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";
import { SITE, absUrl } from "../blog/site";
import { GUIDES_PATH, countTags, guidePath, tagPath } from "./paths";
import type { Guide } from "./types";

const xmlEscape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function sitemap(guides: Guide[]): string {
  const urls: { loc: string; lastmod?: string; priority: string }[] = [
    { loc: absUrl("/"), priority: "1.0" },
    { loc: absUrl(GUIDES_PATH), priority: "0.9" },
    ...guides.map((g) => ({
      loc: absUrl(guidePath(g.slug)),
      lastmod: (g.updated || g.date).slice(0, 10),
      priority: "0.8",
    })),
    ...countTags(guides).map((t) => ({ loc: absUrl(tagPath(t.tag)), priority: "0.5" })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>` +
        (u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "") +
        `\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function rss(guides: Guide[]): string {
  const items = guides
    .map((g) => {
      const url = xmlEscape(absUrl(guidePath(g.slug)));
      return (
        `    <item>\n` +
        `      <title>${xmlEscape(g.title)}</title>\n` +
        `      <link>${url}</link>\n` +
        `      <guid isPermaLink="true">${url}</guid>\n` +
        `      <pubDate>${new Date(g.date).toUTCString()}</pubDate>\n` +
        `      <description>${xmlEscape(g.description)}</description>\n` +
        g.tags.map((t) => `      <category>${xmlEscape(t)}</category>\n`).join("") +
        `    </item>`
      );
    })
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>${xmlEscape(`${SITE.blogTitle} — ${SITE.name}`)}</title>\n` +
    `    <link>${absUrl(GUIDES_PATH)}</link>\n` +
    `    <description>${xmlEscape(SITE.blogDescription)}</description>\n` +
    `    <language>en</language>\n` +
    `    <atom:link href="${absUrl("/rss.xml")}" rel="self" type="application/rss+xml" />\n` +
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
    items +
    `\n  </channel>\n</rss>\n`
  );
}

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${absUrl("/sitemap.xml")}\n`;

export function writeFeeds(outDir: string, guides: Guide[]): void {
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap(guides));
  fs.writeFileSync(path.join(outDir, "rss.xml"), rss(guides));
  fs.writeFileSync(path.join(outDir, "robots.txt"), robots());
  console.log(`[feeds] Wrote sitemap.xml, rss.xml, robots.txt (${guides.length} guides).`);
}
