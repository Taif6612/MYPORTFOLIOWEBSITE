import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { scrollToTarget } from "../lib/useSmoothScroll.js";
import CanvasErrorBoundary from "./CanvasErrorBoundary.jsx";
import RotatingWord from "./RotatingWord.jsx";

// Defer the shader bundle so first paint stays instant.
const HeroShader = lazy(() => import("./HeroShader.jsx"));

// One-time check: WebGL present AND hardware-accelerated. Under software
// rasterizers (SwiftShader / llvmpipe — what headless Chromium and blocklisted
// GPUs fall back to) animating a full-screen mesh gradient runs frame-by-frame
// on the CPU and is brutally expensive — this is what tanked Lighthouse's TBT.
// Those environments get the static CSS gradient instead (and skip downloading
// the shader bundle entirely). Real GPUs keep the full animation.
function webglIsHardware() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
      : "";
    return !/swiftshader|software|llvmpipe|basic render|microsoft basic/i.test(
      renderer
    );
  } catch {
    return false;
  }
}

const CRAFTS = ["landing pages", "dashboards", "web apps", "design systems"];

export default function Hero({ profile, ready, reduced }) {
  const canRenderField = useMemo(() => webglIsHardware(), []);
  const heroRef = useRef(null);
  const [heroInView, setHeroInView] = useState(true);

  // Freeze the GPU-bound mesh shader once the hero scrolls out of view, so it
  // stops animating (and competing with scroll compositing) while the viewer is
  // reading the rest of the page. Resumes seamlessly when scrolled back up.
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([entry]) =>
      setHeroInView(entry.isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className="hero" aria-label="Introduction" ref={heroRef}>
      {/* Soft animated mesh, over a CSS gradient fallback. */}
      <div className="hero-field" aria-hidden="true">
        <div className="hero-field-fallback" />
        {canRenderField && (
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <HeroShader animate={!reduced && heroInView} />
            </Suspense>
          </CanvasErrorBoundary>
        )}
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="shell hero-inner">
        <p className={`eyebrow hero-eyebrow ${ready ? "is-in" : ""}`}>
          <span className="hero-eyebrow-pip" aria-hidden="true" />
          <span>{profile.role}</span>
          <span className="hero-eyebrow-dot">/</span>
          <span>Available for freelance</span>
        </p>

        <h1 className="display hero-title" data-lines>
          <span className="line-mask">
            <span>Turning your ideas into</span>
          </span>
          <span className="line-mask">
            <span>
              <span className="fx-pixel">pixel</span>{" "}
              <span className="fx-magic">perfect realities</span>.
            </span>
          </span>
        </h1>

        <p className={`hero-sub ${ready ? "is-in" : ""}`}>
          Front-end engineer crafting{" "}
          <RotatingWord words={CRAFTS} reduced={reduced} /> that load fast, work for
          everyone, and convert.
        </p>

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
