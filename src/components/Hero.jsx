import { useEffect, useRef, useState } from "react";

/* Hero = tagline in front of the pixel room (pixelRoom.js, loaded after first paint).
   The section is tall with a sticky stage: scrolling pulls the camera back until the
   room is one lit corner of an apartment block. The sky colour follows the visitor's
   clock and is mirrored into --hero-bg / --hero-fg (first set by the inline script in
   index.html so there is no flash before three.js arrives). */
/* WebGL present AND hardware-accelerated. Under software rasterizers (SwiftShader /
   llvmpipe: headless Chromium, blocklisted GPUs) the room renders on the CPU and
   blocks the page for seconds, so those devices keep the plain tagline-on-sky hero
   and never download three.js. Same gate the old shader hero used (0528297). */
function gpuIsHardware() {
  if (location.search.includes("noroom")) return false; // A/B and escape hatch
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || c.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|software|llvmpipe|basic render|microsoft basic/i.test(renderer);
  } catch {
    return false;
  }
}

export default function Hero({ reduced }) {
  const sec = useRef(null), stage = useRef(null), cv = useRef(null), hud = useRef(null), dive = useRef(null), roomRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState("room");
  const [time, setTime] = useState("");
  const [watch, setWatch] = useState("");
  const [toast, setToast] = useState(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const h = setTimeout(() => setToast(null), 1700);
    return () => clearTimeout(h);
  }, [toast]);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
    const root = document.documentElement, s = sec.current, st = stage.current;
    let room = null, dead = false;
    const hm = { hour: "numeric", minute: "2-digit" };

    const onScroll = () => {
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - st.offsetHeight)));
      room?.setScroll(p);
      hud.current.style.opacity = String(Math.min(1, Math.max(0, 1 - p * 3.5)));
      st.style.setProperty("--hint", String(Math.max(0, 1 - p * 6)));
      root.classList.toggle("on-hero", r.bottom > 72);
    };

    // The dive: the camera has flown into the monitor. Resolve its picture from big
    // blocks to sharp, land on the real About section underneath, then fade away.
    const land = () => {
      const el = dive.current, c = el.firstChild, ctx = c.getContext("2d"), img = new Image();
      img.src = "/hero-screen.webp";
      const tmp = document.createElement("canvas"), tc = tmp.getContext("2d");
      const finish = () => {
        const about = document.getElementById("about");
        const head = document.querySelector(".lv-head")?.offsetHeight || 0;
        window.scrollTo({ top: about.getBoundingClientRect().top + window.scrollY - head + 8, behavior: "instant" });
        room?.reset();
        el.classList.add("is-out");
        setTimeout(() => el.classList.remove("is-on", "is-out"), 500);
      };
      img.decode().then(() => {
        el.classList.add("is-on"); c.width = innerWidth; c.height = innerHeight; ctx.imageSmoothingEnabled = false;
        const t0 = performance.now();
        const f = () => {
          const k = Math.min(1, (performance.now() - t0) / (reduced ? 1 : 650)), b = Math.max(1, Math.round(24 * Math.pow(1 - k, 2.2)));
          tmp.width = Math.ceil(innerWidth / b); tmp.height = Math.ceil(innerHeight / b);
          tc.drawImage(img, 0, 0, tmp.width, tmp.height); ctx.drawImage(tmp, 0, 0, innerWidth, innerHeight);
          if (k < 1) requestAnimationFrame(f); else setTimeout(finish, 120);
        };
        f();
      }, finish);
    };

    const ui = {
      env: ({ bg, fg, time: d }) => { root.style.setProperty("--hero-bg", bg); root.style.setProperty("--hero-fg", fg); setTime(d.toLocaleTimeString([], hm)); },
      mode: setMode,
      toast: (text) => setToast({ text, n: performance.now() }),
      watch: (d) => { const t = d.toLocaleTimeString([], { ...hm, second: "2-digit" }); setWatch((w) => (w === t ? w : t)); },
      dive: land,
      ready: () => setReady(true),
    };

    // The room is an enhancement on top of a finished hero: fetch and build it only once
    // the page has loaded and the main thread is idle. No WebGL: the hero stays tagline-on-sky.
    const ac = new AbortController();
    let idle = 0;
    const start = () => import("./pixelRoom.js")
      .then(({ createPixelRoom }) => (dead ? null : createPixelRoom({ canvas: cv.current, stage: st, reduced, screenSrc: "/hero-screen.webp", ui, signal: ac.signal })))
      .then((r) => {
        if (!r) return;
        if (dead) { r.dispose(); return; }
        room = roomRef.current = r;
        if (location.search.includes("roomdebug")) window.__room = r; // for automated click tests
        onScroll();
      })
      .catch(() => {});
    const later = () => { if (gpuIsHardware()) idle = window.requestIdleCallback ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 200); };
    if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });

    const ro = new ResizeObserver(() => room?.resize());
    const io = new IntersectionObserver(([e]) => room?.setActive(e.isIntersecting));
    const esc = (e) => { if (e.key === "Escape") room?.leaveWatch(); };
    ro.observe(st); io.observe(s);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", esc);
    onScroll();
    return () => {
      dead = true; ac.abort();
      window.removeEventListener("load", later);
      (window.cancelIdleCallback || clearTimeout)(idle);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", esc);
      root.classList.remove("on-hero");
      room?.dispose(); roomRef.current = null;
    };
  }, [reduced]);

  return (
    <section id="hero" className="lv-hero" ref={sec} aria-labelledby="hero-title">
      <div className="lv-stage" ref={stage} data-mode={mode}>
        <canvas ref={cv} className={`lv-room${ready ? " is-on" : ""}`} aria-hidden="true" />
        <div className="lv-hud" ref={hud}>
          <p className="lv-hero-intro">I’m Taif, a full-stack engineer. I design it, build it, and keep it running.</p>
          <h1 id="hero-title" className="lv-display">
            <span>I build what you see</span>
            <span>and everything</span>
            <span>you don’t.</span>
          </h1>
          <div className="lv-ctas">
            <a className="lv-btn" href="#booking">Book a project</a>
            <a className="lv-btn lv-btn--ghost" href="#work">See the work</a>
          </div>
        </div>
        {ready && (
          <>
            <p className="lv-room-cap">Set to your time, {time}.<br />{touch ? "Tap" : "Click"} around the room.</p>
            {!reduced && <p className="lv-room-hint" aria-hidden="true">Scroll to step outside</p>}
          </>
        )}
        <p className={`lv-toast${toast ? " is-on" : ""}`} role="status">{toast?.text}</p>
        {mode === "watch" && (
          <div className="lv-watchcap"><b>{watch}</b><span>Your time, right now. {touch ? "Tap" : "Click"} to go back.</span></div>
        )}
      </div>
      <div className="lv-dive" ref={dive} aria-hidden="true"><canvas /></div>
    </section>
  );
}
