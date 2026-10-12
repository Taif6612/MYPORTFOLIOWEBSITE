/* 404 — emitted as dist/404.html and shown on unknown client routes. */

import { Link } from "react-router-dom";
import Seo from "../blog/Seo";
import { BlogHeader, BlogFooter } from "../blog/BlogChrome";

export default function NotFound() {
  return (
    <div className="blog">
      <Seo
        title="Page not found"
        description="The page you're looking for doesn't exist."
        path="/404"
        noindex
      />
      <BlogHeader />

      <main className="blog-shell blog-main blog-404">
        <p className="eyebrow mono">404</p>
        <h1 className="guides-hero-title">This page wandered off.</h1>
        <p className="guides-hero-lede">
          The link may be broken or the page may have moved.
        </p>
        <div className="blog-404-actions mono">
          <Link to="/guides">Read the guides →</Link>
          <Link to="/">Back to portfolio →</Link>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}

// Lazy-route entry: react-router reads `Component` from the imported module.
export { NotFound as Component };
