import { Suspense, lazy } from "react";
import { scrollToTarget } from "../lib/useSmoothScroll.js";

// Defer the WebGL bundle so first paint stays instant.
const HeroCanvas = lazy(() => import("./HeroCanvas.jsx"));

export default function Hero({ profile, ready, reduced }) {
  return (
    <section className="hero" aria-label="Introduction">
      {/* Field: animated detection shader, or a calm static wash. */}
      <div className="hero-field" aria-hidden="true">
        <div className="hero-field-fallback" />
        {!reduced && (
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        )}
      </div>

      <div className="shell hero-inner">
        <p className={`eyebrow hero-eyebrow ${ready ? "is-in" : ""}`}>
          <span>{profile.role}</span>
          <span className="hero-eyebrow-dot">/</span>
          <span>Portfolio ’26</span>
        </p>

        <h1 className="display hero-title" data-lines>
          {profile.thesis.map((line, i) => (
            <span className="line-mask" key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div className={`hero-meta ${ready ? "is-in" : ""}`}>
          <span className="hero-status mono">
            <span className="hero-status-pip" aria-hidden="true" />
            {profile.status}
          </span>
          <span className="hero-loc mono">{profile.location}</span>
        </div>
      </div>

      <button
        type="button"
        className={`hero-scroll mono ${ready ? "is-in" : ""}`}
        onClick={() => scrollToTarget("#work")}
        aria-label="Scroll to selected work"
      >
        <span>Selected work</span>
        <span className="hero-scroll-line" aria-hidden="true" />
      </button>
    </section>
  );
}
