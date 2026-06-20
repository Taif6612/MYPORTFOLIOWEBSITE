import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "../lib/useSmoothScroll.js";

/* -------------------------------------------------------------------------
   SIGNATURE ELEMENT — the signal line.
   A fixed left rail that behaves like a monitoring minimap: the page maps
   onto its height, a node sits at each project, the progress line fills as
   you scroll, and the node nearest your view pulses like a live trace.
   ------------------------------------------------------------------------- */

export default function SignalRail({ projects }) {
  const [nodes, setNodes] = useState([]); // { id, index, title, top (0..1) }
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const frame = useRef(0);

  // Measure each project's position as a fraction of the document height.
  useEffect(() => {
    const measure = () => {
      const docH = document.documentElement.scrollHeight || 1;
      const next = projects
        .map((p) => {
          const el = document.getElementById(p.id);
          if (!el) return null;
          const top = (el.offsetTop + el.offsetHeight * 0.4) / docH;
          return { id: p.id, index: p.index, title: p.title, top };
        })
        .filter(Boolean);
      setNodes(next);
    };

    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    const t1 = setTimeout(measure, 600); // after fonts/layout settle
    const t2 = setTimeout(measure, 1800); // after previews load
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [projects]);

  // Track scroll progress + nearest active node.
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

        const mid = window.scrollY + window.innerHeight * 0.45;
        let best = null;
        let bestD = Infinity;
        projects.forEach((p) => {
          const el = document.getElementById(p.id);
          if (!el) return;
          const c = el.offsetTop + el.offsetHeight / 2;
          const d = Math.abs(c - mid);
          if (d < bestD) {
            bestD = d;
            best = p.id;
          }
        });
        setActiveId(best);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, [projects]);

  return (
    <aside className="rail" aria-hidden="true">
      <div className="rail-track" />
      <div className="rail-progress" style={{ transform: `scaleY(${progress})` }} />
      {nodes.map((n) => (
        <button
          key={n.id}
          type="button"
          tabIndex={-1}
          className={`rail-node ${activeId === n.id ? "is-active" : ""}`}
          style={{ top: `${n.top * 100}%` }}
          onClick={() => scrollToTarget(`#${n.id}`)}
        >
          <span className="rail-node-dot" />
          <span className="rail-node-label mono">
            {n.index} · {n.title}
          </span>
        </button>
      ))}
    </aside>
  );
}
