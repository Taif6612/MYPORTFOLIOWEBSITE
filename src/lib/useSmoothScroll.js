import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll, synced to the GSAP ticker and ScrollTrigger.
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

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
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
