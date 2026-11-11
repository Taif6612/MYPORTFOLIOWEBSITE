import { useEffect, useRef, useState } from "react";
import { projects } from "./data/projects.js";
import { profile } from "./data/profile.js";
import { useReducedMotion } from "./lib/usePrefs.js";
import { useReveals } from "./lib/useReveals.js";
import Booking from "./components/Booking.jsx";
import Clock from "./components/Clock.jsx";
import { award, certificates } from "./data/awards.js";
import "./styles/live.css";

/* Live deck homepage. Story: hook → proof → range → depth → credibility → ask.
   Scroll scenes write a 0..1 progress into `--p` on their section; all motion
   is CSS reading that one variable, so reduced-motion just pins --p. */

const sites = projects.filter((p) => p.url && p.poster && p.id !== "proctorless");
const flagship = projects.find((p) => p.id === "proctorless");

const experience = [
  {
    org: "Riseup Labs",
    logo: "/logo-riseup.webp",
    role: "Software Engineering Intern",
    when: "Sep 2026 – now",
    text: "Took the in-house Asset & Hardware Management System from PRD to working V1: database design, 18 backend modules, 37 screens. FastAPI, PostgreSQL, Vue 3, live notifications over SSE, shipped behind 148 pytest and 66 Playwright tests.",
  },
  {
    org: "Team GY6",
    logo: "/logo-gy6.webp",
    role: "Full-Stack Developer Intern · remote",
    when: "Feb – Jul 2026",
    text: "Built and maintained Next.js sites and a full WooCommerce store for clients in Australia and the UK, plus n8n automations for their operations. Term extended by a month.",
  },
];

const tools = [
  { name: "Senior Mode", logo: "/projects/senior-mode.webp", tone: "dark", what: "Chrome extension that re-renders any site for elderly and low-vision readers: contrast, text scale, link highlighting.", href: "https://github.com/Taif6612/senior-mode-extension" },
  { name: "ProctorLess Integrity", logo: "/projects/proctorless.webp", tone: "light", what: "Companion extension that streams session-integrity signals to ProctorLess during an exam.", href: "https://github.com/Taif6612/proctorless-app" },
  { name: "Sticker Visa Autofiller", what: "Manifest V3 extension that fills visa-applicant forms from saved profiles in one click.", href: "https://github.com/Taif6612/sticker-visa-autofiller" },
  { name: "Care Operations Automation", what: "ClickUp + an 11-node n8n workflow running task boards, medication reminders and family briefs for an assisted-living facility.", href: null },
];

const stack = ["TypeScript", "React", "Next.js", "Vue 3", "Tailwind", "Node.js", "FastAPI", "PostgreSQL", "Supabase", "Redis", "Docker", "Playwright", "n8n"];

/* One rAF-throttled scroll listener drives every scene. */
function useScenes(reduced) {
  useEffect(() => {
    const scenes = [...document.querySelectorAll("[data-scene]")];
    if (reduced) {
      scenes.forEach((s) => s.style.setProperty("--p", s.dataset.scene === "deck" ? "1" : "0"));
      return;
    }
    const cards = [...document.querySelectorAll(".lv-site")];
    const rail = document.querySelector(".lv-rail");
    const bar = document.querySelector(".lv-progress");
    const wideQ = window.matchMedia("(min-width: 861px)");
    // Chrome/Edge/Safari 26+: CSS moves the strip on the compositor, locked to the
    // scroll. JS only falls back where scroll-driven animations aren't supported.
    const cssDriven = CSS.supports("animation-timeline: view()");
    let raf = 0, on_ = -1, pitch = 0, c0 = 0;
    // Rail geometry is read once per resize, never per frame (offsetLeft ignores transforms).
    const measure = () => {
      if (!wideQ.matches) { rail.style.transform = ""; return; }
      c0 = cards[0].offsetLeft + cards[0].offsetWidth / 2;
      pitch = cards[1].offsetLeft - cards[0].offsetLeft;
    };
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rects = scenes.map((s) => s.getBoundingClientRect()); // all reads first, then writes
      scenes.forEach((s, k) => {
        const r = rects[k];
        if (s.dataset.scene !== "page" && (r.bottom < -vh || r.top > 2 * vh)) return; // off-screen scenes cost nothing
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        // Page progress: write the bar's transform directly. Setting --p on the page
        // root would make every element on the page restyle on every scroll frame.
        if (s.dataset.scene === "page") { if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`; return; }
        if (s.dataset.scene !== "rail") { s.style.setProperty("--p", p.toFixed(4)); return; }
        // Rail: write the transform straight onto the strip (compositor only, no
        // inherited custom property invalidating every descendant's style).
        if (!wideQ.matches) return;
        if (!cssDriven) {
          const x = innerWidth / 2 - c0 - p * (cards.length - 1) * pitch;
          rail.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
        }
        const i = Math.round(p * (cards.length - 1));
        if (i !== on_) {
          on_ = i;
          cards.forEach((c, n) => { c.dataset.pos = n < i ? "before" : n > i ? "after" : "on"; c.classList.toggle("is-on", n === i); });
        }
      });
    };
    const on = () => raf || (raf = requestAnimationFrame(tick));
    const onResize = () => { measure(); on(); };
    if (rail && cards.length > 1) measure();
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
}

const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Real site in a 1440px iframe scaled to the frame. Mounted only on hover/focus
   so the page never pays for ten sites up front. */
function LivePreview({ src }) {
  const box = useRef(null);
  const [size, setSize] = useState({ s: 0.3, h: 900 });
  useEffect(() => {
    // Desktop-width site scaled into the card; its height matches the card so
    // the site scrolls *inside* the frame with the mouse wheel.
    const ro = new ResizeObserver(([e]) => {
      const s = e.contentRect.width / 1440;
      setSize({ s, h: e.contentRect.height / s });
    });
    ro.observe(box.current);
    // Wheel over the card scrolls the site inside it; at the site's top or
    // bottom the wheel falls through to the page again.
    const card = box.current.parentElement;
    const frame = box.current.querySelector("iframe");
    const onWheel = (e) => {
      const win = frame.contentWindow;
      if (!win) return;
      const doc = win.document.scrollingElement || win.document.documentElement;
      const atTop = doc.scrollTop <= 0 && e.deltaY < 0;
      const atEnd = doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atEnd) return;
      e.preventDefault();
      win.scrollBy(0, e.deltaY);
    };
    card.addEventListener("wheel", onWheel, { passive: false });
    return () => { ro.disconnect(); card.removeEventListener("wheel", onWheel); };
  }, []);
  return (
    <div className="lv-live" ref={box}>
      <iframe src={src} title="Live preview, scroll to explore" loading="lazy" style={{ height: size.h, transform: `scale(${size.s})` }} />
    </div>
  );
}

function Browser({ p, eager, live }) {
  const [on, setOn] = useState(false);
  const wake = live && canHover ? { onPointerEnter: () => setOn(true), onFocus: () => setOn(true) } : {};
  return (
    <div className={`lv-browser${on ? " is-live" : ""}`} {...wake}>
      <div className="lv-chrome" aria-hidden="true">
        <i /><i /><i />
        <span className="lv-url">taif.codes{p.url}</span>
      </div>
      <img
        src={p.poster}
        srcSet={p.posterSrcSet}
        sizes="(max-width: 800px) 85vw, 40vw"
        alt={`${p.title} homepage`}
        width="1440"
        height="900"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {on && <LivePreview src={`${p.url}index.html`} />}
      {live && canHover && !on && <span className="lv-hint">Hover, then scroll inside to explore</span>}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="lv-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/* HOOK: the finished page on top; a lens that follows the pointer shows the same
   page as it's built (boxes, live sizes, grid, the real CSS). Both copies share one
   layout, so moving the lens is two opposite translates per frame: compositor only. */
function HeroLayer({ x }) {
  const H = x ? "div" : "h1";
  const A = x ? "span" : "a";
  return (
    <div className="lv-hero-in">
      {x && <div className="lv-x-cols">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>}
      {x && (
        <pre className="lv-x-note lv-x-note--lens">{`// you're looking through
// a lens made of
lens.translate( x,  y)
page.translate(-x, -y)
// two transforms a frame,
// nothing repaints`}</pre>
      )}
      <div className="lv-hero-top">
        <p className="lv-hero-intro" data-ins="p.intro">I’m Taif, a full-stack engineer.<br />I design it, build it, and keep it running.</p>
        <p className="lv-hero-hint" data-ins="p.hint">
          <span className="lv-hint-hover">Move your cursor to look under the page.</span>
          <span className="lv-hint-touch">Tap anywhere to look under the page.</span>
        </p>
      </div>
      <div className="lv-hero-foot">
        {x && (
          <pre className="lv-x-note lv-x-note--css">{`h1 {
  font: 800 min(11vw, 15.5vh)/.9 "Bricolage Grotesque";
  letter-spacing: -.045em;
}
h1 > span { display: block; white-space: nowrap; }`}</pre>
        )}
        <H id={x ? undefined : "hero-title"} className="lv-display" data-ins="h1">
          <span>I build what you see</span>
          <span>and everything</span>
          <span>you don’t.</span>
        </H>
        <div className="lv-ctas">
          <A className="lv-btn" href={x ? undefined : "#booking"} data-ins="a.cta"><span>Book a project</span></A>
          <A className="lv-btn lv-btn--ghost" href={x ? undefined : "#work"} data-ins="a.cta"><span>See the work</span></A>
        </div>
      </div>
    </div>
  );
}

function Hero({ reduced }) {
  const stage = useRef(null), lens = useRef(null), view = useRef(null);
  useEffect(() => {
    const s = stage.current, l = lens.current, v = view.current;
    const touch = window.matchMedia("(hover: none)").matches;
    const drift = touch && !reduced;
    const k = reduced ? 1 : 0.14;
    let R = 0, rx = 0, ry = 0, hx = 0, hy = 0, hw = 0, hh = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, live = true, hold = 0, ready = false;
    const t0 = performance.now();
    const place = () => {
      l.style.transform = `translate3d(${(cx - R).toFixed(1)}px,${(cy - R).toFixed(1)}px,0)`;
      v.style.transform = `translate3d(${(R - cx).toFixed(1)}px,${(R - cy).toFixed(1)}px,0)`;
    };
    const tick = (now) => {
      raf = 0;
      if (drift && now > hold) {
        const p = (now - t0) / 1000;
        tx = hx + hw * (0.5 + 0.36 * Math.sin(p * 0.42));
        ty = hy + hh * (0.5 + 0.4 * Math.sin(p * 0.77));
      }
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      place();
      if (live && (drift || Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2)) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (live && !raf) raf = requestAnimationFrame(tick); };
    const measure = () => {
      const r = s.getBoundingClientRect();
      v.style.width = `${r.width}px`; v.style.height = `${r.height}px`;
      const top = s.querySelector(".lv-hero-top").getBoundingClientRect();
      const h1 = s.querySelector(".lv-display").getBoundingClientRect();
      const word = s.querySelector(".lv-display > span:nth-child(2)").getBoundingClientRect();
      const pad = h1.left - r.left, band = h1.top - top.bottom, inBand = band >= 176;
      // rest in the open band above the headline (sized to fit it) when there's room,
      // otherwise on "everything", the word the lens is about
      l.style.removeProperty("--R");
      R = l.offsetWidth / 2;
      if (inBand) { R = Math.min(R, band / 2 + 12); l.style.setProperty("--R", `${R}px`); rx = r.width - pad - R; ry = top.bottom - r.top + band / 2; }
      else { rx = Math.min(r.width - R, word.right - r.left - R * 0.55); ry = word.top - r.top + word.height / 2; }
      v.dataset.rest = inBand ? "band" : "word";
      v.style.setProperty("--rx", `${rx}px`); v.style.setProperty("--ry", `${ry}px`);
      // touch drift covers the band and the headline
      hx = pad; hy = top.bottom - r.top; hw = h1.width; hh = h1.bottom - top.bottom;
      // labels show the real rendered size of each box
      v.querySelectorAll("[data-ins]").forEach((el) => { el.dataset.label = `${el.dataset.ins} ${el.offsetWidth}×${el.offsetHeight}`; });
      if (!ready) { cx = tx = rx; cy = ty = ry; ready = true; }
      place(); kick();
    };
    const at = (e) => { const r = s.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; kick(); };
    const move = (e) => { if (e.pointerType !== "touch") at(e); };
    const down = (e) => { if (e.pointerType === "touch") { hold = performance.now() + 2600; at(e); } };
    const leave = (e) => { if (e.pointerType !== "touch") { tx = rx; ty = ry; kick(); } };
    const focus = (e) => {
      const r = s.getBoundingClientRect(), q = e.target.getBoundingClientRect();
      tx = q.left - r.left + q.width / 2; ty = q.top - r.top + q.height / 2; hold = performance.now() + 2600; kick();
    };
    const ro = new ResizeObserver(measure);
    const io = new IntersectionObserver(([en]) => { live = en.isIntersecting; if (live) kick(); else { cancelAnimationFrame(raf); raf = 0; } });
    ro.observe(s); io.observe(s);
    document.fonts?.ready.then(measure);
    s.addEventListener("pointermove", move, { passive: true });
    s.addEventListener("pointerdown", down, { passive: true });
    s.addEventListener("pointerleave", leave);
    s.addEventListener("focusin", focus);
    return () => {
      ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf);
      s.removeEventListener("pointermove", move);
      s.removeEventListener("pointerdown", down);
      s.removeEventListener("pointerleave", leave);
      s.removeEventListener("focusin", focus);
    };
  }, [reduced]);

  return (
    <section className="lv-hero" ref={stage} aria-labelledby="hero-title">
      <HeroLayer />
      <div className="lv-lens" ref={lens} aria-hidden="true">
        <div className="lv-x" ref={view}><HeroLayer x /></div>
      </div>
    </section>
  );
}

/* Small cursor ring that swells over anything clickable (fine pointers only). */
function Cursor() {
  const dot = useRef(null);
  useEffect(() => {
    let x = 0, y = 0, cx = 0, cy = 0, raf;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      dot.current.classList.toggle("is-link", !!e.target.closest("a, button, input, textarea, .lv-browser"));
      dot.current.classList.toggle("is-off", !!e.target.closest(".lv-hero")); // the lens is the cursor there
    };
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      dot.current.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    loop();
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div className="lv-cursor" ref={dot} aria-hidden="true" />;
}

export default function App() {
  const reduced = useReducedMotion();
  useReveals(reduced, true);
  useScenes(reduced);

  return (
    <div className="lv" data-scene="page">
      <div className="lv-progress" aria-hidden="true" />
      {canHover && !reduced && <Cursor />}
      <a className="lv-skip" href="#work">Skip to work</a>
      <header className="lv-head">
        <a href="#top" className="lv-mark">Taif Ur Rahman</a>
        <nav aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#booking">Contact</a>
          <a className="lv-btn lv-btn--small" href="/Taif-Ur-Rahman-CV.pdf" download>CV</a>
        </nav>
      </header>

      <main id="top">
        <Hero reduced={reduced} />


        {/* WHO — portrait + about */}
        <section id="about" className="lv-about lv-wrap" aria-labelledby="about-title">
          <figure className="lv-portrait reveal">
            <img src="/taif-portrait-480.webp" srcSet="/taif-portrait-480.webp 480w, /taif-portrait-960.webp 960w" sizes="(max-width: 860px) 70vw, 380px" alt="Portrait of Taif Ur Rahman" width="480" height="600" loading="lazy" decoding="async" />
            <figcaption>Taif Ur Rahman · Full-stack engineer</figcaption>
          </figure>
          <div className="reveal">
            <h2 id="about-title" className="lv-h2">Hi, I'm Taif. I build the whole thing.</h2>
            <p className="lv-lead">
              Design, front end, back end, deploy. I graduated in Computer Science in 2026 and have since shipped client sites for Australia and the UK, an asset-management system used in-house at Riseup Labs, and a privacy-first exam platform.
            </p>
            <p className="lv-about-more">
              I care about the small details that make software feel effortless, and about the people software usually leaves behind. That's why I built Senior Mode.
            </p>
          </div>
        </section>

        {/* PROOF — the flagship product */}
        <section className="lv-proof lv-wrap" aria-labelledby="proof-title">
          <div className="lv-proof-media reveal">
            <Browser p={{ ...flagship, url: "/proctorless" }} />
          </div>
          <div className="lv-proof-copy reveal">
            <h2 id="proof-title" className="lv-h2">ProctorLess: secure exams without watching students.</h2>
            <dl className="lv-case">
              <dt>Problem</dt>
              <dd>Online exams either trust everyone or film everyone. Universities needed integrity without surveillance.</dd>
              <dt>Built</dt>
              <dd>Next.js + Supabase platform with student, professor and admin dashboards, seating-aware question distribution, AI-assisted grading, and a companion Chrome extension for session integrity.</dd>
              <dt>Stack</dt>
              <dd>{flagship.stack.join(" · ")}</dd>
            </dl>
            <div className="lv-ctas">
              <a className="lv-btn" href={flagship.url} target="_blank" rel="noopener noreferrer">Open live <Arrow /></a>
              <a className="lv-btn lv-btn--ghost" href={flagship.repo} target="_blank" rel="noopener noreferrer">Source</a>
            </div>
          </div>
        </section>

        {/* RANGE — pinned horizontal rail of every live site */}
        <section id="work" className="lv-range" data-scene="rail" style={{ "--count": sites.length }} aria-labelledby="work-title">
          <div className="lv-range-pin">
            <div className="lv-wrap lv-range-head">
              <h2 id="work-title" className="lv-h2">Ten sites, ten industries, all live.</h2>
              <p className="lv-muted">Every one is a complete build you can click through, not a screenshot.</p>
            </div>
            <ol className="lv-rail">
              {sites.map((p) => (
                <li key={p.id} className="lv-site">
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <Browser p={p} live />
                  </a>
                  <div className="lv-site-meta">
                    <h3>{p.title}</h3>
                    <span className="lv-muted">{p.category}</span>
                  </div>
                  <p className="lv-site-sum">{p.summary}</p>
                  <p className="lv-tags">{p.stack.join(" · ")}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* DEPTH — real experience and tools */}
        <section id="experience" className="lv-depth lv-wrap" aria-labelledby="exp-title">
          <h2 id="exp-title" className="lv-h2 reveal">Beyond the landing page.</h2>
          <ol className="lv-timeline">
            {experience.map((e) => (
              <li key={e.org} className="reveal">
                <div className="lv-when">{e.when}</div>
                <div>
                  <div className="lv-org">
                    {e.logo ? <img className="lv-co" src={e.logo} alt="" width="52" height="52" loading="lazy" /> : <span className="lv-co lv-co--mono" aria-hidden="true">{e.mono}</span>}
                    <div>
                      <h3>{e.org}</h3>
                      <p className="lv-role">{e.role}</p>
                    </div>
                  </div>
                  <p>{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="lv-h3 reveal">Tools and automations</h3>
          <ul className="lv-tools">
            {tools.map((t) => (
              <li key={t.name} className="reveal">
                {t.logo && <img className={`lv-logo lv-logo--${t.tone}`} src={t.logo} alt="" width="56" height="56" loading="lazy" />}
                {t.href ? (
                  <a href={t.href} target="_blank" rel="noopener noreferrer"><strong>{t.name}</strong><Arrow /></a>
                ) : (
                  <strong>{t.name}</strong>
                )}
                <p>{t.what}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* RECOGNITION — award photo + certificates (slots until filled in data/awards.js) */}
        <section id="awards" className="lv-awards lv-wrap" aria-labelledby="awards-title">
          <figure className={`lv-award reveal${award.photo ? "" : " is-empty"}`}>
            {award.photo ? (
              <img src={award.photo} alt={award.alt} loading="lazy" decoding="async" />
            ) : (
              <div className="lv-slot" aria-hidden="true">Award photo</div>
            )}
          </figure>
          <div className="lv-award-copy reveal">
            <h2 id="awards-title" className="lv-h2">{award.title}.</h2>
            <p className="lv-muted">{award.event}</p>
            <ul className="lv-certs">
              {[...certificates, ...Array(Math.max(0, 3 - certificates.length)).fill(null)].map((c, k) => (
                <li key={k} className={c ? "" : "is-empty"}>
                  {c ? (
                    <a href={c.url || c.image} target="_blank" rel="noopener noreferrer">
                      {c.image && <img src={c.image} alt="" loading="lazy" />}
                      <strong>{c.name}</strong>
                      <span className="lv-muted">{c.issuer}{c.year ? ` · ${c.year}` : ""}</span>
                    </a>
                  ) : (
                    <div className="lv-slot lv-slot--cert" aria-hidden="true">Certificate</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* AVAILABILITY — clock band */}
        <section className="lv-band" aria-label="Availability">
          <div className="lv-wrap lv-band-grid">
            <div className="reveal">
              <p className="lv-avail"><span className="lv-pip" aria-hidden="true" />Available for work</p>
              <h2 className="lv-band-title">Have a vision? <span>Let's build it together.</span></h2>
              <a className="lv-btn lv-btn--light" href="/Taif-Ur-Rahman-CV.pdf" download>Download CV</a>
            </div>
            <div className="lv-clock reveal"><Clock /></div>
            <figure className="lv-quote reveal">
              <blockquote>Real artists ship.</blockquote>
              <figcaption>Steve Jobs</figcaption>
            </figure>
          </div>
        </section>

        {/* CREDIBILITY */}
        <section className="lv-cred lv-wrap" aria-labelledby="cred-title">
          <div className="reveal">
            <h2 id="cred-title" className="lv-h2">Research and grounding.</h2>
            <p className="lv-lead">
              B.Sc. in Computer Science (minor in Communications), Independent University Bangladesh, 2026. Winner of the Algorithm Project Showcase at TechFest.
            </p>
          </div>
          <ul className="lv-papers reveal">
            {profile.publications.map((p) => (
              <li key={p.url}>
                <a href={p.url} target="_blank" rel="noopener noreferrer">{p.title}<Arrow /></a>
                <span className="lv-muted">{p.venue}</span>
              </li>
            ))}
          </ul>
          <p className="lv-stack reveal" aria-label="Technical stack">{stack.join(" / ")}</p>
        </section>

        {/* ASK */}
        <Booking profile={profile} />
      </main>

      <footer className="lv-foot lv-wrap">
        <span>© {new Date().getFullYear()} Taif Ur Rahman</span>
        <nav aria-label="Elsewhere">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} target={s.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{s.label}</a>
          ))}
          <a href="/guides">Guides</a>
        </nav>
      </footer>
    </div>
  );
}
