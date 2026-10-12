/* =========================================================================
   CMS — frontmatter schema (single source of truth for validation)
   -------------------------------------------------------------------------
   Every guide's YAML frontmatter is validated against this zod schema at
   build time. An invalid file is skipped with a clear warning rather than
   crashing the build. Keep this in sync with public/admin/config.yml
   (the Decap CMS field definitions).
   ========================================================================= */

import { z } from "zod";
import { slugify } from "./paths";

export const guideFrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z
    .string()
    .min(1, "description is required")
    .max(300, "description should be <= 300 chars (aim for ~150 for SEO)"),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  // Every tag becomes a /guides/tag/<slug> page, so it needs a usable slug.
  tags: z
    .array(z.string().refine((t) => slugify(t) !== "", "each tag needs a letter or digit"))
    .default([]),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  author: z.string().default("Taif Ur Rahman"),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  /** Optional explicit slug; falls back to the filename. Same rule as Decap's pattern. */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: lowercase letters, numbers and dashes only")
    .optional(),
});

export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;
