/* =========================================================================
   <Seo> — per-route <head> tags via vite-react-ssg's <Head>.
   -------------------------------------------------------------------------
   Renders title, meta description, canonical, OpenGraph, Twitter cards, and
   any JSON-LD structured data passed in. These are emitted into the static
   HTML at build time, so crawlers see them without running JS.
   ========================================================================= */

import { Head } from "vite-react-ssg";
import { SITE, absUrl } from "./site";

type JsonLd = Record<string, unknown>;

export interface SeoProps {
  title: string;
  description: string;
  /** Route path, e.g. "/guides/foo". Used for canonical + og:url. */
  path: string;
  /** Image (absolute or root-relative). Falls back to SITE.ogImage. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  jsonLd?: JsonLd | JsonLd[];
}

/** Escape `<` so a stray "</script>" in data can't break out of the tag. */
const safeJson = (obj: unknown) =>
  JSON.stringify(obj).replace(/</g, "\\u003c");

export default function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  noindex,
  jsonLd,
}: SeoProps) {
  const url = absUrl(path);
  const img = image
    ? image.startsWith("http")
      ? image
      : absUrl(image)
    : absUrl(SITE.ogImage);
  const fullTitle = `${title} — ${SITE.name}`;
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* OpenGraph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {SITE.twitter ? <meta name="twitter:site" content={`@${SITE.twitter}`} /> : null}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {/* Article extras */}
      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
      {type === "article" && tags
        ? tags.map((t) => <meta property="article:tag" content={t} key={t} />)
        : null}

      {/* Structured data — react-helmet-async reads the string child as the
          script's text content, so JSON-LD must be passed as children. */}
      {ld.map((obj, i) => (
        <script type="application/ld+json" key={i}>
          {safeJson(obj)}
        </script>
      ))}
    </Head>
  );
}
