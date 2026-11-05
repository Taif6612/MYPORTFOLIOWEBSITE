import { useEffect } from "react";
import { projects } from "./data/projects.js";
import { profile } from "./data/profile.js";
import { useReducedMotion } from "./lib/usePrefs.js";
import { useReveals } from "./lib/useReveals.js";
import Booking from "./components/Booking.jsx";
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
    role: "Software Engineering Intern",
    when: "Sep 2026 – now",
    text: "Took the in-house Asset & Hardware Management System from PRD to working V1: database design, 18 backend modules, 37 screens. FastAPI, PostgreSQL, Vue 3, live notifications over SSE, shipped behind 148 pytest and 66 Playwright tests.",
  },
  {
    org: "Team GY6",
    role: "Full-Stack Developer Intern · remote",
    when: "Feb – Jul 2026",
    text: "Built and maintained Next.js sites and a full WooCommerce store for clients in Australia and the UK, plus n8n automations for their operations. Term extended by a month.",
  },
];

const tools = [
  { name: "Senior Mode", what: "Chrome extension that re-renders any site for elderly and low-vision readers: contrast, text scale, link highlighting.", href: "https://github.com/Taif6612/senior-mode-extension" },
  { name: "ProctorLess Integrity", what: "Companion extension that streams session-integrity signals to ProctorLess during an exam.", href: "https://github.com/Taif6612/proctorless-app" },
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

function Browser({ p, eager }) {
  return (
    <div className="lv-browser">
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

export default function App() {
  const reduced = useReducedMotion();
  useReveals(reduced, true);
  useScenes(reduced);

  return (
    <div className="lv">
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
            <div className="lv-hero-copy">
              <h1 id="hero-title" className="lv-display">
                I ship complete websites.
                <span className="lv-hero-sub">Open any of them.</span>
              </h1>
              <p className="lv-lead">
                Full-stack engineer and CS graduate. Ten finished sites below are live on this domain, plus production work for clients in Australia and the UK.
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
                    <Browser p={p} />
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
