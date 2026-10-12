/* =========================================================================
   Blog/site constants used for SEO (absolute URLs, defaults).
   Keep `url` in sync with the production domain — the www host, since the
   apex 308-redirects there and canonicals/sitemaps must not point at a redirect.
   ========================================================================= */

export const SITE = {
  url: "https://www.taif.codes",
  name: "Taif Ur Rahman",
  /** Title of the guides hub. */
  blogTitle: "Student Guides",
  blogDescription:
    "Practical, no-fluff guides for computer-science and design students — portfolios, internships, Git, front-end engineering, and shipping real projects.",
  author: "Taif Ur Rahman",
  /** Fallback social-share image (root-relative). */
  ogImage: "/taif-portrait.jpeg",
  /** Optional Twitter/X handle without the @ (leave empty to omit). */
  twitter: "",
  /** Base path for the guides section. */
  base: "/guides",
} as const;

export const absUrl = (pathname: string): string =>
  SITE.url + (pathname.startsWith("/") ? pathname : `/${pathname}`);
