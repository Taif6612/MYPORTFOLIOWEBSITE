/* =========================================================================
   CMS — public content types
   -------------------------------------------------------------------------
   The shape of a single student guide AFTER it has been parsed, validated,
   and compiled to HTML by the Node-side loader (src/cms/load.ts). This is
   the type the browser sees via the `virtual:guides` module — dates are ISO
   strings (JSON-serialisable), the markdown body is pre-rendered HTML.
   ========================================================================= */

export interface GuideHeading {
  depth: number; // 2 or 3
  id: string; // anchor id (matches rehype-slug)
  text: string; // plain-text heading
}

export interface Guide {
  /** URL slug — from frontmatter `slug` or the filename. */
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 publish date. */
  date: string;
  /** ISO 8601 last-updated date (optional). */
  updated?: string;
  tags: string[];
  /** Root-relative cover image path, e.g. /uploads/guides/x.jpg */
  cover?: string;
  coverAlt?: string;
  author: string;
  draft: boolean;
  featured: boolean;
  /** Human reading time, e.g. "6 min read". */
  readingTime: string;
  readingMinutes: number;
  /** Short summary used on cards (defaults to `description`). */
  excerpt: string;
  /** Pre-rendered HTML of the markdown body. */
  html: string;
  /** Extracted h2/h3 headings for the table of contents. */
  headings: GuideHeading[];
}

export interface TagCount {
  tag: string;
  count: number;
}
