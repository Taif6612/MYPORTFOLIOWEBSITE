import { useEffect, useRef } from "react";

/* A small ultramarine ring that trails the pointer and swells over anything
   interactive. Pointer devices only (App gates this); native cursor hidden. */

export default function Cursor() {
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    document.body.dataset.cursor = "on";

    const move = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    const over = (e) => {
      const el = e.target.closest("a, button, .is-interactive, iframe");
      ring.current?.classList.toggle("is-hover", !!el);
    };
    const down = () => ring.current?.classList.add("is-down");
    const up = () => ring.current?.classList.remove("is-down");

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      delete document.body.dataset.cursor;
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="cursor" ref={ring} aria-hidden="true">
      <span className="cursor-ring" />
    </div>
  );
}
