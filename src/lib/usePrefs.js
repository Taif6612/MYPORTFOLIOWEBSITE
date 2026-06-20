import { useEffect, useState } from "react";

/** Generic matchMedia hook (SSR-safe, listener-cleaned). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the user asked the system to reduce motion. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Coarse pointer = touch. Used to disable the custom cursor + heavy hover. */
export function useIsTouch() {
  return useMediaQuery("(pointer: coarse)");
}
