/* /guides/:slug — a single student guide. */

import { Link, useParams } from "react-router-dom";
import Seo from "../blog/Seo";
import { SITE, absUrl } from "../blog/site";
import { BlogHeader, BlogFooter } from "../blog/BlogChrome";
import { formatDate, machineDate } from "../blog/format";
import { getGuide, getRelated, guidePath, tagPath } from "../cms/content";
import NotFound from "./NotFound";

export default function GuidePost() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuide(slug) : undefined;

  // Pre-rendered slugs always resolve; this only fires on client-side
  // navigation to an unknown URL.
  if (!guide) return <NotFound />;

  const path = guidePath(guide.slug);
  const img = guide.cover || SITE.ogImage;
  const related = getRelated(guide, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.date,
      dateModified: guide.updated || guide.date,
      author: { "@type": "Person", name: guide.author, url: SITE.url },
      publisher: { "@type": "Person", name: SITE.name, url: SITE.url },
      mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(path) },
      image: absUrl(img),
      keywords: guide.tags.join(", "),
      url: absUrl(path),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: absUrl("/guides") },
        { "@type": "ListItem", position: 3, name: guide.title, item: absUrl(path) },
      ],
    },
  ];

  return (
    <div className="blog">
      <Seo
        title={guide.title}
        description={guide.description}
        path={path}
        image={img}
        type="article"
        publishedTime={guide.date}
        modifiedTime={guide.updated || guide.date}
        tags={guide.tags}
        jsonLd={jsonLd}
      />
      <BlogHeader />

      <main className="blog-shell blog-main">
        <nav className="post-crumbs mono" aria-label="Breadcrumb">
          <Link to="/guides">Guides</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{guide.title}</span>
        </nav>

        <article className="post">
          <header className="post-head">
            <div className="post-meta mono">
              <time dateTime={machineDate(guide.date)}>{formatDate(guide.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{guide.readingTime}</span>
              <span aria-hidden="true">·</span>
              <span>{guide.author}</span>
            </div>
            <h1 className="post-title">{guide.title}</h1>
            <p className="post-lede">{guide.description}</p>
            {guide.tags.length ? (
              <ul className="post-tags mono" aria-label="Tags">
                {guide.tags.map((t) => (
                  <li key={t}>
                    <Link to={tagPath(t)}>#{t}</Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          {guide.cover ? (
            <figure className="post-cover">
              <img src={guide.cover} alt={guide.coverAlt || guide.title} />
            </figure>
          ) : null}

          <div className="post-layout">
            {guide.headings.length > 2 ? (
              <aside className="post-toc mono" aria-label="On this page">
                <p className="post-toc-title">On this page</p>
                <ul>
                  {guide.headings.map((h) => (
                    <li key={h.id} data-depth={h.depth}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            <div
              className="post-body"
              // Content is authored by the site owner and compiled at build time.
              dangerouslySetInnerHTML={{ __html: guide.html }}
            />
          </div>
        </article>

        {related.length ? (
          <section className="post-related" aria-label="Related guides">
            <h2 className="post-related-title">Keep reading</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={guidePath(r.slug)}>{r.title}</Link>
                  <span className="post-related-meta mono">{r.readingTime}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <BlogFooter />
    </div>
  );
}

// Lazy-route entry: react-router reads `Component` from the imported module.
export { GuidePost as Component };
