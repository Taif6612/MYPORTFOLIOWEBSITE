/* /guides/tag/:tag — guides filtered by a single tag. */

import { Link, useParams } from "react-router-dom";
import Seo from "../blog/Seo";
import { SITE, absUrl } from "../blog/site";
import { BlogHeader, BlogFooter } from "../blog/BlogChrome";
import GuideCard from "../blog/GuideCard";
import { getGuidesByTag, slugify, tagPath } from "../cms/content";

export default function TagPage() {
  const { tag = "" } = useParams<{ tag: string }>();
  const slug = slugify(tag);
  const path = tagPath(slug);
  const guides = getGuidesByTag(slug);
  const label = guides[0]?.tags.find((t) => slugify(t) === slug) || slug;

  const title = `#${label}`;
  const description = `Student guides tagged "${label}" — ${guides.length} ${
    guides.length === 1 ? "guide" : "guides"
  }.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} — ${SITE.blogTitle}`,
    description,
    url: absUrl(path),
  };

  return (
    <div className="blog">
      <Seo
        title={title}
        description={description}
        path={path}
        type="website"
        noindex={guides.length === 0}
        jsonLd={jsonLd}
      />
      <BlogHeader />

      <main className="blog-shell blog-main">
        <header className="guides-hero">
          <p className="eyebrow mono">
            <Link to="/guides">Guides</Link> / tag
          </p>
          <h1 className="guides-hero-title">#{label}</h1>
          <p className="guides-hero-lede">{description}</p>
        </header>

        {guides.length ? (
          <div className="guides-grid">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        ) : (
          <p className="guides-empty">
            Nothing here yet. <Link to="/guides">Browse all guides →</Link>
          </p>
        )}
      </main>

      <BlogFooter />
    </div>
  );
}

// Lazy-route entry: react-router reads `Component` from the imported module.
export { TagPage as Component };
