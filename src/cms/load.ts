/* =========================================================================
   CMS — Node-side content loader
   -------------------------------------------------------------------------
   Runs ONLY in Node (inside the Vite plugin during dev + the SSG build).
   Reads content/guides/*.md, validates frontmatter (zod), compiles the
   markdown body to HTML (remark/rehype), and returns serialisable Guide
   objects. The browser never imports this file — it receives the result
   through the `virtual:guides` module.
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

import { slugify } from "./paths";
import { guideFrontmatterSchema } from "./schema";
import type { Guide, GuideHeading } from "./types";

export const CONTENT_DIR = path.resolve(process.cwd(), "content/guides");

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeHighlight, { detect: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

/** Pull h2/h3 headings (with rehype-slug ids) out of the compiled HTML. */
function extractHeadings(html: string): GuideHeading[] {
  const re = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  const out: GuideHeading[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push({
      depth: Number(m[1]),
      id: m[2],
      text: m[3].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return out;
}

async function compile(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}

export async function loadOneGuide(file: string): Promise<Guide | null> {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const parsed = guideFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    console.warn(
      `\n[cms] Skipping "${path.basename(file)}" — invalid frontmatter:\n${issues}\n`
    );
    return null;
  }

  const fm = parsed.data;
  const slug = fm.slug?.trim() || slugify(path.basename(file, path.extname(file)));
  const html = await compile(content);
  const rt = readingTime(content);

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date.toISOString(),
    updated: fm.updated ? fm.updated.toISOString() : undefined,
    tags: fm.tags,
    cover: fm.cover,
    coverAlt: fm.coverAlt,
    author: fm.author,
    draft: fm.draft,
    featured: fm.featured,
    readingTime: rt.text,
    readingMinutes: Math.max(1, Math.round(rt.minutes)),
    excerpt: fm.description,
    html,
    headings: extractHeadings(html),
  };
}

export async function loadGuides(
  opts: { includeDrafts?: boolean } = {}
): Promise<Guide[]> {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /\.mdx?$/i.test(f))
    .map((f) => path.join(CONTENT_DIR, f));

  const loaded = await Promise.all(files.map(loadOneGuide));

  // Two files resolving to one slug would share a URL (and a sitemap entry)
  // while only the first is reachable — keep the first, warn about the rest.
  const bySlug = new Map<string, Guide>();
  for (const g of loaded) {
    if (!g || (!opts.includeDrafts && g.draft)) continue;
    if (bySlug.has(g.slug)) {
      console.warn(`\n[cms] Skipping a second guide with slug "${g.slug}" — slugs must be unique.\n`);
      continue;
    }
    bySlug.set(g.slug, g);
  }

  return [...bySlug.values()].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
