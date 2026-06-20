import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires up the two reveal primitives across the whole page:
 *   .reveal            → fade + rise once on enter
 *   .line-mask > span  → clip-reveal each line, staggered by group
 *
 * `deps` (e.g. a "ready" flag) re-runs setup after content mounts.
 * Reduced motion: skips entirely — CSS already shows everything.
 */
export function useReveals(reduced, deps = []) {
  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Fade + rise
      ScrollTrigger.batch(".reveal", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          batch.forEach((el, i) =>
            el.style.setProperty("transition-delay", `${i * 70}ms`) ||
            el.classList.add("is-in")
          ),
      });

      // Clip-reveal text lines, grouped by their .line-mask parent's container
      gsap.utils.toArray("[data-lines]").forEach((group) => {
        const spans = group.querySelectorAll(".line-mask > span");
        gsap.to(spans, {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 85%", once: true },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}
