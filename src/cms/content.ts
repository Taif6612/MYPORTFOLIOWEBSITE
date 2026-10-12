/* =========================================================================
   CMS — content accessors (client-safe)
   -------------------------------------------------------------------------
   Thin, typed helpers over the `virtual:guides` data. Import these from
   pages/components instead of touching the virtual module directly.
   Tags are matched by their URL slug (see ./paths), so "Front-End",
   "front-end" and " front end " are one tag with one page.
   ========================================================================= */

import { guides } from "virtual:guides";
import { countTags, slugify } from "./paths";
import type { Guide, TagCount } from "./types";

export type { Guide, TagCount, GuideHeading } from "./types";
export { guidePath, slugify, tagPath } from "./paths";

/** All published guides, newest first. */
export const allGuides: Guide[] = guides;

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getFeatured(): Guide[] {
  return guides.filter((g) => g.featured);
}

/** Guides carrying the tag whose slug is `tagSlug`. */
export function getGuidesByTag(tagSlug: string): Guide[] {
  return guides.filter((g) => g.tags.some((t) => slugify(t) === tagSlug));
}

/** Unique tags with post counts, most-used first. */
export function getAllTags(): TagCount[] {
  return countTags(guides);
}

/** Up to `n` related guides sharing the most tags with `guide`. */
export function getRelated(guide: Guide, n = 3): Guide[] {
  const tags = new Set(guide.tags.map(slugify));
  return guides
    .filter((g) => g.slug !== guide.slug)
    .map((g) => ({ g, score: g.tags.filter((t) => tags.has(slugify(t))).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.g);
}
