import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires up the two reveal primitives across the whole page:
 *   .reveal            → fade + rise once on enter
 *   .line-mask > span  → clip-reveal each line, staggered by group
 *
 * Robustness model (fixes "text goes missing on some machines"):
 *   - Hidden initial state lives behind `.reveals-on`, added before paint and
 *     only when motion is allowed. If React/JS never runs, nothing hides.
 *   - Setup runs ONCE, after the preloader (`ready`) — no revert churn.
 *   - ScrollTrigger.refresh() is deferred to after the scroll-lock is released
 *     and layout has settled, so the above-the-fold hero trigger actually fires
 *     (the previous code refreshed while still locked → hero stayed hidden).
 *   - A watchdog shows everything if the hero never revealed on this device.
 */
export function useReveals(reduced, ready = true) {
  // Arm the hidden state before the browser paints, so there's no flash.
  useLayoutEffect(() => {
    if (reduced) return;
    document.documentElement.classList.add("reveals-on");
  }, [reduced]);

  useEffect(() => {
    if (reduced || !ready) return;

    const forceRevealAll = () => {
      // Drop the gate (CSS no longer hides) and clear any inline gsap transforms.
      document.documentElement.classList.remove("reveals-on");
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      document.querySelectorAll(".line-mask > span").forEach((el) => {
        el.style.transform = "none";
      });
    };

    const ctx = gsap.context(() => {
      // Fade + rise (below-the-fold blocks reveal on scroll)
      ScrollTrigger.batch(".reveal", {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          batch.forEach(
            (el, i) =>
              el.style.setProperty("transition-delay", `${i * 70}ms`) ||
              el.classList.add("is-in")
          ),
      });

      // Clip-reveal text lines, grouped by their [data-lines] container
      gsap.utils.toArray("[data-lines]").forEach((group) => {
        const spans = group.querySelectorAll(".line-mask > span");
        gsap.to(spans, {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 90%", once: true },
        });
      });
    });

    // Refresh AFTER this commit (scroll lock released, layout settled) so the
    // above-the-fold triggers evaluate against the real page and fire.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const settle = setTimeout(() => ScrollTrigger.refresh(), 220);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // Watchdog: if the hero headline never animated in, the reveal system did
    // not run on this device — show everything rather than leave it invisible.
    const failsafe = setTimeout(() => {
      const probe = document.querySelector(".hero-title .line-mask > span");
      if (!probe) return;
      const tr = getComputedStyle(probe).transform;
      let ty = 0;
      if (tr && tr !== "none") {
        try {
          ty = new DOMMatrixReadOnly(tr).m42;
        } catch {
          ty = 0;
        }
      }
      if (Math.abs(ty) > 4) forceRevealAll();
    }, 3000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, [reduced, ready]);
}
