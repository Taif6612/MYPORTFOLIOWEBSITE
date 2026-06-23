import { useEffect, useRef } from "react";

/* A small ultramarine ring that tracks the pointer 1:1 and swells over anything
   interactive. Pointer devices only (App gates this); native cursor hidden.
   No lerp/trail — the position is written straight from the pointer event so
   the ring never lags behind the real cursor. The write is throttled to one
   rAF per frame so a burst of pointermove events can't thrash style writes, and
   no rAF runs while the pointer is idle. */

export default function Cursor() {
  const ring = useRef(null);

  useEffect(() => {
    document.body.dataset.cursor = "on";

    let frame = 0;
    let x = -100;
    let y = -100;

    const render = () => {
      frame = 0;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    };
    const over = (e) => {
      const el = e.target.closest("a, button, .is-interactive, iframe");
      ring.current?.classList.toggle("is-hover", !!el);
    };
    const down = () => ring.current?.classList.add("is-down");
    const up = () => ring.current?.classList.remove("is-down");

    render(); // park it off-screen until the first pointer move

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      delete document.body.dataset.cursor;
      if (frame) cancelAnimationFrame(frame);
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
