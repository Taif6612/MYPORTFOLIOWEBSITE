import { useEffect, useRef, useState } from "react";

/* Hero = tagline in front of the pixel room. The room (pixelRoom.js) is three.js and
   never runs during first paint: after the page has loaded it starts inside a worker
   on an OffscreenCanvas (pixelRoom.worker.js), so building and drawing it cannot block
   the page; browsers without worker WebGL run the same module on the main thread.
   This component owns everything DOM: pointer and scroll input, the caption, labels,
   toasts and the dive overlay. The section is tall with a sticky stage: scrolling pulls
   the camera back until the room is one lit corner of an apartment block. The sky
   follows the visitor's clock and is mirrored into --hero-bg / --hero-fg (first set by
   the inline script in index.html so there is no flash before the room arrives). */

const SCREEN = "/hero-screen.webp"; // screenshot of #about: on the monitor, and what the dive resolves into
const FRAMES = ["proctorless", "autohub-premium", "luxeglow-spa", "solar-panel"].map((id) => `/projects/shots/${id}-800.webp`);
const COPY = { trophy: "Winner, Algorithm Project Showcase · TechFest", degree: "B.Sc. in Computer Science, 2026" };
const LABELS = { screen: "Step inside", watch: "Your time", mug: "Coffee", lamp: "Lamp", plant: "Plant", me: "Say hi", trophy: "Trophy", degree: "Degree", frames: "See my work", phone: "Call me" };
const greet = (h) => (h >= 5 && h < 12 ? "Good morning" : h >= 12 && h < 17 ? "Good afternoon" : h >= 17 && h < 23 ? "Good evening" : "You’re up late");

/* WebGL present AND hardware-accelerated. Under software rasterizers (SwiftShader /
   llvmpipe: headless Chromium, blocklisted GPUs) the room would render on the CPU,
   so those devices keep the plain tagline-on-sky hero and never download three.js.
   Same gate the old shader hero used (0528297). */
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

/* Can a worker draw the room? Needs a transferable canvas and WebGL on OffscreenCanvas
   (Safari before 17 has the canvas but not the WebGL). `?roommain` forces the fallback. */
function workerCanRender() {
  if (location.search.includes("roommain")) return false;
  try {
    if (typeof Worker === "undefined" || !("transferControlToOffscreen" in HTMLCanvasElement.prototype)) return false;
    const gl = new OffscreenCanvas(1, 1).getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export default function Hero({ reduced }) {
  const sec = useRef(null), stage = useRef(null), cv = useRef(null), hud = useRef(null), dive = useRef(null), tip = useRef(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState("room");
  const [time, setTime] = useState("");
  const [hello, setHello] = useState("");
  const [watch, setWatch] = useState("");
  const [toast, setToast] = useState(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const h = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(h);
  }, [toast]);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
    const root = document.documentElement, s = sec.current, st = stage.current, canvas = cv.current;
    const hm = { hour: "numeric", minute: "2-digit" };
    const ac = new AbortController(), probes = new Map();
    // `room(method, ...args)` reaches the room wherever it runs; null until it exists
    let room = null, worker = null, mainRoom = null, dead = false, idle = 0, modeNow = "room", ptrRaf = 0, ptrEvt = null, probeId = 0;

    const sync = () => {
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - st.offsetHeight)));
      room?.("setScroll", p);
      hud.current.style.opacity = String(Math.min(1, Math.max(0, 1 - p * 3.5)));
      st.style.setProperty("--hint", String(Math.max(0, 1 - p * 6)));
      root.classList.toggle("on-hero", r.bottom > 72);
    };
    // NDC on the canvas (x right, y up): what the room picks with
    const ndc = (x, y) => { const c = canvas.getBoundingClientRect(); return [((x - c.left) / c.width) * 2 - 1, 1 - ((y - c.top) / c.height) * 2]; };

    // The dive: the camera has flown into the monitor. Resolve its picture from big
    // blocks to sharp, land on the real About section underneath, then fade away.
    const land = () => {
      const el = dive.current, c = el.firstChild, ctx = c.getContext("2d"), img = new Image();
      img.src = SCREEN;
      const tmp = document.createElement("canvas"), tc = tmp.getContext("2d");
      const finish = () => {
        const about = document.getElementById("about");
        const head = document.querySelector(".lv-head")?.offsetHeight || 0;
        window.scrollTo({ top: about.getBoundingClientRect().top + window.scrollY - head + 8, behavior: "instant" });
        room?.("reset");
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

    // everything the room tells the page (plain data: it may come from a worker)
    const ui = {
      env: ({ bg, fg, time: ms }) => { const d = new Date(ms); root.style.setProperty("--hero-bg", bg); root.style.setProperty("--hero-fg", fg); setTime(d.toLocaleTimeString([], hm)); setHello(greet(d.getHours())); },
      size: ({ w, h }) => { canvas.style.width = `${w}px`; canvas.style.height = `${h}px`; },
      mode: (m) => { modeNow = m; setMode(m); },
      toast: (text) => setToast({ text, n: performance.now() }),
      watch: (ms) => { const t = new Date(ms).toLocaleTimeString([], { ...hm, second: "2-digit" }); setWatch((w) => (w === t ? w : t)); },
      hover: (name) => { st.style.cursor = name ? "pointer" : ""; const el = tip.current; if (name) el.textContent = LABELS[name] || ""; el.classList.toggle("is-on", !!name); },
      go: (hash) => document.querySelector(hash)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }),
      dive: land,
      ready: () => setReady(true),
      probe: (id, name) => { probes.get(id)?.(name); probes.delete(id); },
    };

    const options = () => ({ width: st.clientWidth, height: st.clientHeight, reduced, query: location.search, screenSrc: SCREEN, frames: FRAMES, copy: COPY });
    const up = () => {
      sync(); room("setActive", !document.hidden);
      if (location.search.includes("roomdebug")) window.__room = { // for automated click tests
        pick: (x, y) => new Promise((res) => { probes.set(++probeId, res); room("probe", probeId, ...ndc(x, y)); }),
        get mode() { return modeNow; }, worker: !!worker,
      };
    };
    const start = () => {
      if (dead) return;
      if (workerCanRender()) {
        try { worker = new Worker(new URL("./pixelRoom.worker.js", import.meta.url), { type: "module" }); } catch { worker = null; }
      }
      if (worker) {
        worker.onmessage = ({ data }) => ui[data.ui]?.(...data.a);
        const off = canvas.transferControlToOffscreen(); // from here the canvas belongs to the worker
        worker.postMessage({ init: { ...options(), canvas: off } }, [off]);
        room = (method, ...a) => worker.postMessage({ call: method, a });
        up();
        return;
      }
      import("./pixelRoom.js")
        .then(({ createPixelRoom }) => (dead ? null : createPixelRoom({ ...options(), canvas, ui, signal: ac.signal })))
        .then((r) => {
          if (!r) return;
          if (dead) { r.dispose(); return; }
          mainRoom = r; room = (method, ...a) => r[method]?.(...a);
          up();
        })
        .catch(() => {}); // no WebGL after all: the hero stays tagline-on-sky
    };
    // The room is an enhancement on top of a finished hero: start it only once the page has loaded and is idle.
    const later = () => { if (gpuIsHardware()) idle = window.requestIdleCallback ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 200); };
    if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });

    // pointer: coalesced to one message a frame
    const flush = () => {
      ptrRaf = 0; const e = ptrEvt; if (!e || !room) return;
      const r = st.getBoundingClientRect();
      room("pointer", ((e.x - r.left) / r.width) * 2 - 1, ((e.y - r.top) / r.height) * 2 - 1, ...ndc(e.x, e.y), e.ui);
      tip.current.style.transform = `translate(${Math.round(e.x - r.left + 14)}px, ${Math.round(e.y - r.top + 18)}px)`;
    };
    const onMove = (e) => { if (e.pointerType === "touch") return; ptrEvt = { x: e.clientX, y: e.clientY, ui: !!e.target.closest("a, button, h1, p") }; if (!ptrRaf) ptrRaf = requestAnimationFrame(flush); };
    const onLeave = () => { ptrEvt = null; room?.("leave"); };
    const onClick = (e) => { if (!e.target.closest("a, button")) room?.("click", ...ndc(e.clientX, e.clientY)); };
    const onKey = (e) => { if (e.key === "Escape") room?.("leaveWatch"); };
    const onVis = () => room?.("setActive", !document.hidden && inView);
    let inView = true;
    const ro = new ResizeObserver(() => room?.("resize", st.clientWidth, st.clientHeight));
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; onVis(); });
    ro.observe(st); io.observe(s);
    st.addEventListener("pointermove", onMove, { passive: true });
    st.addEventListener("pointerleave", onLeave);
    st.addEventListener("click", onClick);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);
    sync();
    return () => {
      dead = true; ac.abort();
      window.removeEventListener("load", later);
      (window.cancelIdleCallback || clearTimeout)(idle);
      cancelAnimationFrame(ptrRaf);
      ro.disconnect(); io.disconnect();
      st.removeEventListener("pointermove", onMove);
      st.removeEventListener("pointerleave", onLeave);
      st.removeEventListener("click", onClick);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
      root.classList.remove("on-hero");
      worker?.terminate(); mainRoom?.dispose();
      setReady(false);
    };
  }, [reduced]);

  return (
    <section id="hero" className="lv-hero" ref={sec} aria-labelledby="hero-title">
      <div className="lv-stage" ref={stage} data-mode={mode}>
        {/* keyed: a canvas handed to a worker can't be reused, so a new run gets a new element */}
        <canvas key={reduced ? "still" : "live"} ref={cv} className={`lv-room${ready ? " is-on" : ""}`} aria-hidden="true" />
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
            <p className="lv-room-cap">{hello}. It’s {time} where you are.<br />{touch ? "Tap" : "Click"} around the room.</p>
            {!reduced && <p className="lv-room-hint" aria-hidden="true">Scroll to step outside</p>}
          </>
        )}
        <span className="lv-tip" ref={tip} aria-hidden="true" />
        <p className={`lv-toast${toast ? " is-on" : ""}`} role="status">{toast?.text}</p>
        {mode === "watch" && (
          <div className="lv-watchcap"><b>{watch}</b><span>Your time, right now. {touch ? "Tap" : "Click"} to go back.</span></div>
        )}
      </div>
      <div className="lv-dive" ref={dive} aria-hidden="true"><canvas /></div>
    </section>
  );
}
