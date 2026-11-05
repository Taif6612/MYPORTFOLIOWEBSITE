import { useEffect, useRef, useState } from "react";
import { projects } from "./data/projects.js";
import { profile } from "./data/profile.js";
import { useReducedMotion } from "./lib/usePrefs.js";
import { useReveals } from "./lib/useReveals.js";
import Booking from "./components/Booking.jsx";
import Clock from "./components/Clock.jsx";
import "./styles/live.css";

/* Live deck homepage. Story: hook → proof → range → depth → credibility → ask.
   Scroll scenes write a 0..1 progress into `--p` on their section; all motion
   is CSS reading that one variable, so reduced-motion just pins --p. */

const sites = projects.filter((p) => p.url && p.poster && p.id !== "proctorless");
const flagship = projects.find((p) => p.id === "proctorless");
const deck = sites.slice(0, 5);

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
    mono: "GY6",
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
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const s of scenes) {
        const r = s.getBoundingClientRect();
        const span = Math.max(1, r.height - vh);
        const p = Math.min(1, Math.max(0, -r.top / span));
        s.style.setProperty("--p", p.toFixed(4));
      }
    };
    const on = () => raf || (raf = requestAnimationFrame(tick));
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
}

const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Real site in a 1440px iframe scaled to the frame. Mounted only on hover/focus
   so the page never pays for ten sites up front. */
function LivePreview({ src }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 1440));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="lv-live" ref={box}>
      <iframe src={src} title="Live preview" loading="lazy" tabIndex={-1} style={{ transform: `scale(${scale})` }} />
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
      {live && canHover && !on && <span className="lv-hint">Hover to play the live site</span>}
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

const WORDS = ["landing pages", "web apps", "online stores", "dashboards", "Chrome extensions", "automations"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="lv-rot" aria-live="off">
      <span key={i} className="lv-rot-word">{WORDS[i]}</span>
    </span>
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
        {/* HOOK — a stack of real sites fans out as you scroll */}
        <section className="lv-hero" data-scene="deck" aria-labelledby="hero-title">
          <div className="lv-hero-pin">
            <div className="lv-blobs" aria-hidden="true"><i /><i /><i /></div>
            <div className="lv-hero-copy">
              <h1 id="hero-title" className="lv-display">
                I ship <span className="fx-pixel">complete</span> websites.
                <span className="lv-hero-sub"><span className="fx-shine">Open any</span> <em>of them.</em></span>
              </h1>
              <p className="lv-lead">
                I build <RotatingWord /> end to end. Ten finished sites below are live on this domain, plus production work for clients in Australia and the UK.
              </p>
              <div className="lv-ctas">
                <a className="lv-btn" href="#booking">Book a project</a>
                <a className="lv-btn lv-btn--ghost" href="#work">See the work</a>
              </div>
            </div>
            <div className="lv-deck" aria-hidden="true">
              {deck.map((p, i) => (
                <div key={p.id} className="lv-card" style={{ "--i": i, "--n": deck.length }}>
                  <Browser p={p} eager={i < 2} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="lv-marquee" aria-hidden="true">
          <div>{Array.from({ length: 2 }, (_, k) => (
            <span key={k}>Landing pages ✺ Web apps ✺ E-commerce ✺ Dashboards ✺ Chrome extensions ✺ Automations ✺ Accessibility ✺ </span>
          ))}</div>
        </div>

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
                  <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} live site`}>
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
                <div className="lv-when">
                  {e.logo ? <img className="lv-co" src={e.logo} alt={`${e.org} logo`} width="56" height="56" loading="lazy" /> : <span className="lv-co lv-co--mono" aria-hidden="true">{e.mono}</span>}
                  {e.when}
                </div>
                <div>
                  <h3>{e.org}</h3>
                  <p className="lv-role">{e.role}</p>
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
