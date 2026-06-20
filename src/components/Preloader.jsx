import { useEffect, useRef, useState } from "react";

/* A short, calm page-load sequence: a count ticks to 100 while a signal line
   draws across the wordmark, then the panel lifts away. Reduced motion skips
   straight to done. */

export default function Preloader({ profile, reduced, onDone }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      onDone?.();
      setGone(true);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        onDone?.();
        setTimeout(() => setGone(true), 900);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced, onDone]);

  if (gone) return null;

  return (
    <div className={`preloader ${leaving ? "is-leaving" : ""}`} aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-mark display">{profile.name}</div>
        <div className="preloader-bar">
          <span className="preloader-bar-fill" style={{ transform: `scaleX(${count / 100})` }} />
        </div>
        <div className="preloader-count mono">{String(count).padStart(3, "0")}</div>
      </div>
    </div>
  );
}
