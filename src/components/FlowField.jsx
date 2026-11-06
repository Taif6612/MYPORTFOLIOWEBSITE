import { useEffect, useRef, useState } from "react";

/* Hero art: particles drift through a curl of sine waves, leaving ink trails.
   The pointer bends the field. SOURCE below is shown typing itself beside the
   canvas: it is the real core of draw(), kept in sync by hand. */
export const SOURCE = `for (const p of particles) {
  const a = Math.sin(p.x * k) * 2 + Math.cos(p.y * k) * 2
          + t * 0.0003 + pull(p, mouse);
  p.x += Math.cos(a) * speed;
  p.y += Math.sin(a) * speed;
  ink.lineTo(p.x, p.y);   // the trail is the art
}`;

const LIGHT = { bg: "241,237,228", colors: ["#e8501e", "#f08a4b", "#14171a", "#b33a0f", "#f6c58f"], alpha: 0.42 };
// Dark variant: glowing threads for the gallery hall.
export const DARK = { bg: "20,23,26", colors: ["#e8501e", "#ff8a5c", "#f6c58f", "#7a2c10", "#ffd9b8"], alpha: 0.3, max: 450, every: 2 };

export default function FlowField({ reduced, theme = LIGHT, className = "lv-art" }) {
  const COLORS = theme.colors;
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, t = 0, visible = true;
    const mouse = { x: -9999, y: -9999 };
    let parts = [];

    const k = 0.0045, speed = 1.3;
    const seed = () => ({ x: Math.random() * w, y: Math.random() * h, c: (Math.random() * COLORS.length) | 0, life: 200 + Math.random() * 500 });
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${theme.bg})`; ctx.fillRect(0, 0, w, h);
      const n = Math.round(Math.min(theme.max || 900, (w * h) / 1300));
      parts = Array.from({ length: n }, seed);
    };
    const pull = (p) => {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      return d2 < 32000 ? Math.atan2(dy, dx) + Math.PI / 2 : 0; // swirl around the cursor
    };
    const step = () => {
      ctx.fillStyle = `rgba(${theme.bg},0.012)`; // very slow fade: long silky trails
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.globalAlpha = theme.alpha;
      // One path per colour: ~5 strokes a frame instead of one per particle.
      for (let c = 0; c < COLORS.length; c++) {
        ctx.strokeStyle = COLORS[c];
        ctx.beginPath();
        for (const p of parts) {
          if (p.c !== c) continue;
          const a = Math.sin(p.x * k) * 2 + Math.cos(p.y * k) * 2 + t * 0.0003 + pull(p);
          const nx = p.x + Math.cos(a) * speed, ny = p.y + Math.sin(a) * speed;
          ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny);
          p.x = nx; p.y = ny;
          if (--p.life < 0 || nx < 0 || ny < 0 || nx > w || ny > h) Object.assign(p, seed(), { c });
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      t += 16;
    };
    let f = 0;
    const loop = () => { if (visible && ++f % (theme.every || 1) === 0) step(); raf = requestAnimationFrame(loop); };

    resize();
    for (let i = 0; i < 320; i++) step(); // arrive already painted, not blank
    if (reduced) { for (let i = 0; i < 170; i++) step(); return; } // a still painting

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting && !document.hidden));
    io.observe(cv);
    const onMove = (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onVis = () => (visible = !document.hidden);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    // Only repaint when the size really changes; the observer's initial call
    // would otherwise wipe the pre-painted canvas.
    const ro = new ResizeObserver(() => {
      const r = cv.getBoundingClientRect();
      if (Math.abs(r.width - w) > 1 || Math.abs(r.height - h) > 1) { resize(); for (let i = 0; i < 320; i++) step(); }
    });
    ro.observe(cv);
    loop();
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, theme]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

/* The code panel types SOURCE out once, then idles with a blinking caret. */
export function TypedSource({ reduced }) {
  const [n, setN] = useState(reduced ? SOURCE.length : 0);
  useEffect(() => {
    if (reduced || n >= SOURCE.length) return;
    const id = setTimeout(() => setN(n + 1), SOURCE[n] === "\n" ? 140 : 22);
    return () => clearTimeout(id);
  }, [n, reduced]);
  return (
    <figure className="lv-code" aria-label="The code drawing the background">
      <figcaption>flow-field.js · drawing this page, live</figcaption>
      <pre><code>{SOURCE.slice(0, n)}<span className="lv-caret" /></code></pre>
    </figure>
  );
}
