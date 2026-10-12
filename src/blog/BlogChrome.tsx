/* =========================================================================
   Shared chrome for the guides section — a light header + footer that match
   the editorial museum aesthetic but stay SSR-safe (no Lenis/shaders/cursor).
   ========================================================================= */

import { Link } from "react-router-dom";
import { profile } from "../data/profile.js";

export function BlogHeader() {
  return (
    <header className="blog-head">
      <div className="blog-shell blog-head-bar">
        <Link to="/" className="blog-mark mono">
          {profile.name}
          <span className="blog-mark-sub">· Guides</span>
        </Link>
        <nav className="blog-nav mono" aria-label="Primary">
          <Link to="/guides" className="blog-nav-link">Guides</Link>
          <a href="/#work" className="blog-nav-link">Work</a>
          <a href="/#about" className="blog-nav-link">About</a>
          <a href="/#booking" className="blog-nav-link">Booking</a>
        </nav>
      </div>
    </header>
  );
}

export function BlogFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="blog-foot">
      <div className="blog-shell blog-foot-inner mono">
        <a className="blog-foot-cta" href={`mailto:${profile.email}`}>
          Let's build something clear. ↗
        </a>
        <nav className="blog-foot-socials" aria-label="Social">
          {profile.socials.map((s: { label: string; url: string }) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              {s.label} ↗
            </a>
          ))}
        </nav>
        <div className="blog-foot-base">
          <span>© {year} {profile.name}</span>
          <Link to="/" className="blog-foot-home">Back to portfolio ↑</Link>
        </div>
      </div>
    </footer>
  );
}
