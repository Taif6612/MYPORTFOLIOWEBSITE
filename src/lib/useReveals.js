import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * Reveal engine, driven by IntersectionObserver (not ScrollTrigger) so it is
 * immune to layout shifts from late-loading iframes/images and to the
 * cross-machine timing races that left text stuck hidden.
 *
 *   .reveal            → add `.is-in` when it enters view (CSS fades/rises it)
 *   .line-mask > span  → clip-reveal each line via a short gsap tween
 *
 * Robustness:
 *   - Hidden initial state lives behind `.reveals-on`, added before paint and
 *     only when motion is allowed. If JS never runs, nothing hides.
 *   - Setup runs once, after the preloader (`ready`).
 *   - A watchdog shows everything if the hero never revealed on this device.
 */
export function useReveals(reduced, ready = true) {
  // Arm the hidden state before paint, so there's no flash.
  useLayoutEffect(() => {
    if (reduced) return;
    document.documentElement.classList.add("reveals-on");
  }, [reduced]);

  useEffect(() => {
    if (reduced || !ready) return;

    const revealLines = (group) => {
      const spans = group.querySelectorAll(".line-mask > span");
      gsap.to(spans, {
        yPercent: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        overwrite: "auto",
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          if (el.hasAttribute("data-lines")) revealLines(el);
          else el.classList.add("is-in");
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );

    const targets = [
      ...document.querySelectorAll(".reveal"),
      ...document.querySelectorAll("[data-lines]"),
    ];
    targets.forEach((el) => io.observe(el));

    // Watchdog: if the above-the-fold hero never revealed, the system failed on
    // this device — show everything rather than leave it invisible.
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
      if (Math.abs(ty) > 4) {
        document.documentElement.classList.remove("reveals-on");
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
        document.querySelectorAll(".line-mask > span").forEach((el) => {
          el.style.transform = "none";
        });
      }
    }, 3000);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, [reduced, ready]);
}
