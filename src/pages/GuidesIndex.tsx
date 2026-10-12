/* /guides — the student-guides hub (index + tag chips). */

import { Link } from "react-router-dom";
import Seo from "../blog/Seo";
import { SITE, absUrl } from "../blog/site";
import { BlogHeader, BlogFooter } from "../blog/BlogChrome";
import GuideCard from "../blog/GuideCard";
import { allGuides, getAllTags, guidePath, tagPath } from "../cms/content";

export default function GuidesIndex() {
  const guides = allGuides;
  const tags = getAllTags();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${SITE.blogTitle} — ${SITE.name}`,
      description: SITE.blogDescription,
      url: absUrl("/guides"),
      author: { "@type": "Person", name: SITE.author, url: SITE.url },
      blogPost: guides.map((g) => ({
        "@type": "BlogPosting",
        headline: g.title,
        description: g.description,
        datePublished: g.date,
        dateModified: g.updated || g.date,
        url: absUrl(guidePath(g.slug)),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: absUrl("/guides") },
      ],
    },
  ];

  return (
    <div className="blog">
      <Seo
        title={SITE.blogTitle}
        description={SITE.blogDescription}
        path="/guides"
        type="website"
        jsonLd={jsonLd}
      />
      <BlogHeader />

      <main className="blog-shell blog-main">
        <header className="guides-hero">
          <p className="eyebrow mono">Field notes</p>
          <h1 className="guides-hero-title">Student Guides</h1>
          <p className="guides-hero-lede">{SITE.blogDescription}</p>
        </header>

        {tags.length ? (
          <nav className="guides-tagbar mono" aria-label="Topics">
            <span className="guides-tagbar-label">Topics</span>
            {tags.map((t) => (
              <Link key={t.tag} to={tagPath(t.tag)}>
                #{t.tag} <span className="guides-tagbar-count">{t.count}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        {guides.length ? (
          <div className="guides-grid">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        ) : (
          <p className="guides-empty">No guides published yet — check back soon.</p>
        )}
      </main>

      <BlogFooter />
    </div>
  );
}

// Lazy-route entry: react-router reads `Component` from the imported module.
export { GuidesIndex as Component };
