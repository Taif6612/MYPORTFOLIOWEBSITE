import { useEffect, useRef, useState } from "react";

/* A short, calm page-load sequence: a count ticks to 100 while a signal line
   draws across the wordmark, then the panel lifts away. Reduced motion skips
   straight to done, and so does any repeat view in the same browser session
   (the intro is a first impression, not a toll on every reload). */

const DURATION_MS = 700; // count-up length; the hero starts revealing right after
const EXIT_MS = 600; // matches .preloader transition in components.css
const SEEN_KEY = "tur:intro-seen";

function seenThisSession() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage blocked — the intro just plays again next time */
  }
}

export default function Preloader({ profile, reduced, onDone }) {
  // Decided once, before first paint, so a skipped intro never flashes.
  const [skip] = useState(() => reduced || seenThisSession());
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(skip);
  const raf = useRef(0);
  // onDone is an inline arrow in App (new every render); read it through a ref
  // so re-renders don't restart the sequence.
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (skip) {
      done.current?.();
      return;
    }
    markSeen();

    let exitTimer = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        done.current?.();
        exitTimer = setTimeout(() => setGone(true), EXIT_MS);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(exitTimer);
    };
  }, [skip]);

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
