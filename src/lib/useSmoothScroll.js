import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll, driven by a plain requestAnimationFrame loop.
 * (Previously synced to gsap.ticker + ScrollTrigger — but reveals moved to an
 * IntersectionObserver, so no ScrollTriggers exist and GSAP was ~47 KB of
 * unused JS. Native rAF does the same job for free.)
 * Disabled entirely when the user prefers reduced motion (native scroll wins).
 * Exposes window.__lenis so anchor links can scrollTo programmatically.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // `lerp` (per-frame chase toward the latest target) instead of
    // `duration`+easing: in duration mode every wheel tick restarts a ~1.1s
    // ease, so during continuous scrolling the view is always lagging the
    // input (the "laggy scroll" feel). lerp stays locked to the wheel while
    // still smoothing. ~0.12 is snappy but not jittery.
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    window.__lenis = lenis;

    // rAF passes a millisecond timestamp, which is exactly what lenis.raf wants.
    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [enabled]);
}

/** Smoothly scroll to a selector or element, respecting Lenis if present. */
export function scrollToTarget(target) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: 0, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
