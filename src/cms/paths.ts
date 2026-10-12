/* =========================================================================
   CMS — slugs, URLs and tag grouping (pure; safe in Node and the browser)
   -------------------------------------------------------------------------
   The one place guide/tag URLs are built and tags are grouped. The Node
   loader (post slugs from filenames), the route table (pre-rendered paths),
   every <Link>, and the sitemap all go through these, so a URL can't be
   spelled two ways and a tag can't have two pages.
   ========================================================================= */

import type { Guide, TagCount } from "./types";

/** "Front-End" → "front-end", " CI/CD " → "ci-cd", "C#" → "c". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export const GUIDES_PATH = "/guides";

export const guidePath = (slug: string): string => `${GUIDES_PATH}/${slug}`;

export const tagPath = (tag: string): string => `${GUIDES_PATH}/tag/${slugify(tag)}`;

/** Unique tags (one per slug, first-seen label) with post counts, most-used first. */
export function countTags(guides: readonly Guide[]): TagCount[] {
  const counts = new Map<string, TagCount>();
  for (const g of guides) {
    const seen = new Set<string>(); // a tag listed twice on one guide counts once
    for (const tag of g.tags) {
      const slug = slugify(tag);
      if (seen.has(slug)) continue;
      seen.add(slug);
      const entry = counts.get(slug);
      if (entry) entry.count += 1;
      else counts.set(slug, { tag, count: 1 });
    }
  }
  return Array.from(counts.values()).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag)
  );
}
