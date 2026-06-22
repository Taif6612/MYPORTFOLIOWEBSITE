import { Suspense, lazy, useMemo } from "react";
import { scrollToTarget } from "../lib/useSmoothScroll.js";
import CanvasErrorBoundary from "./CanvasErrorBoundary.jsx";

// Defer the shader bundle so first paint stays instant.
const HeroShader = lazy(() => import("./HeroShader.jsx"));

// One-time check: does this browser/GPU actually have WebGL?
function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function Hero({ profile, ready, reduced }) {
  // Render the mesh whenever WebGL exists; freeze it under reduced motion.
  const canRenderField = useMemo(() => webglSupported(), []);

  return (
    <section className="hero" aria-label="Introduction">
      {/* Soft animated mesh, over a CSS gradient fallback. */}
      <div className="hero-field" aria-hidden="true">
        <div className="hero-field-fallback" />
        {canRenderField && (
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <HeroShader animate={!reduced} />
            </Suspense>
          </CanvasErrorBoundary>
        )}
      </div>
      {/* Readability scrim: paper backdrop under the text, fading into the mesh. */}
      <div className="hero-scrim" aria-hidden="true" />

      <div className="shell hero-inner">
        <p className={`eyebrow hero-eyebrow ${ready ? "is-in" : ""}`}>
          <span className="hero-eyebrow-pip" aria-hidden="true" />
          <span>{profile.role}</span>
          <span className="hero-eyebrow-dot">/</span>
          <span>Available · Portfolio ’26</span>
        </p>

        <h1 className="display hero-title" data-lines>
          {profile.thesis.map((line, i) => (
            <span className="line-mask" key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>

        {profile.tagline && (
          <p className={`hero-sub ${ready ? "is-in" : ""}`}>{profile.tagline}</p>
        )}

        <div className={`hero-cta ${ready ? "is-in" : ""}`}>
          <button type="button" className="btn btn--primary" onClick={() => scrollToTarget("#work")}>
            View work <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => scrollToTarget("#booking")}>
            Book a project
          </button>
        </div>

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
        <span>Scroll</span>
        <span className="hero-scroll-line" aria-hidden="true" />
      </button>
    </section>
  );
}
