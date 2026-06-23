import { useEffect, useLayoutEffect } from "react";

/**
 * Reveal engine — IntersectionObserver toggles an `.is-in` class; CSS does the
 * actual animation. No GSAP here: the previous gsap.to({yPercent}) read the
 * CSS-set transform ambiguously and could leave section titles stuck hidden.
 *
 *   .reveal            → fades/rises in via CSS on `.is-in`
 *   [data-lines]       → its `.line-mask > span` lines clip-reveal via CSS on `.is-in`
 *
 * Robustness:
 *   - Hidden initial state is gated behind `.reveals-on` (added pre-paint, only
 *     when motion is allowed). If JS never runs, nothing hides.
 *   - Setup runs once after the preloader (`ready`).
 *   - A watchdog reveals everything if the hero never revealed on this device.
 */
export function useReveals(reduced, ready = true) {
  // Arm the hidden state before paint, so there's no flash.
  useLayoutEffect(() => {
    if (reduced) return;
    document.documentElement.classList.add("reveals-on");
  }, [reduced]);

  useEffect(() => {
    if (reduced || !ready) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
    );

    const targets = [
      ...document.querySelectorAll(".reveal"),
      ...document.querySelectorAll("[data-lines]"),
    ];
    targets.forEach((el) => io.observe(el));

    // Watchdog: if the above-the-fold hero never revealed, reveal everything.
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
        document
          .querySelectorAll(".reveal, [data-lines]")
          .forEach((el) => el.classList.add("is-in"));
      }
    }, 2500);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, [reduced, ready]);
}
