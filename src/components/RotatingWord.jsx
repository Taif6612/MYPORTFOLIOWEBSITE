import { useEffect, useState } from "react";

/* The animated-hero signature: a single word that cycles with a soft
   slide+fade. Sized to the widest word so the line never reflows.
   Static (first word only) under reduced motion. */
export default function RotatingWord({ words, reduced, interval = 2200 }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [reduced, words.length, interval]);

  return (
    <span className="rotw" aria-live="polite">
      {/* reserve width with the longest word */}
      <span className="rotw-ghost" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      {words.map((w, idx) => (
        <span
          key={w}
          className={`rotw-item ${idx === i ? "is-active" : ""}`}
          aria-hidden={idx !== i}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
