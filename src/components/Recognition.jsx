import Clock from "./Clock.jsx";
import { stack } from "../data/recognition.js";

export default function Recognition() {

  return (
    <section className="section recognition" id="praise" aria-label="Availability, recognition and stack">
      {/* Clock band: availability · viewer's local clock · ship quote */}
      <div className="shell clock-band">
        <div className="avail-card reveal">
          <span className="avail-pip-row mono">
            <span className="avail-pip" aria-hidden="true" />
            Available for work
          </span>
          <h2 className="display avail-title">
            Have a vision?
            <br />
            <span className="avail-title-signal">Let&apos;s build it</span>{" "}
            <span className="avail-title-together">together.</span>
          </h2>
          <a className="avail-resume mono" href="/Taif-Ur-Rahman-CV.pdf" download>
            <span aria-hidden="true">↓</span> Resume
          </a>
        </div>

        <Clock />

        <figure className="ship-quote">
          <span className="ship-quote-mark" aria-hidden="true">
            &rdquo;
          </span>
          <blockquote className="display ship-quote-text">Real artists ship.</blockquote>
          <span className="ship-quote-rule" aria-hidden="true" />
          <figcaption className="ship-quote-cite mono">Steve Jobs</figcaption>
        </figure>
      </div>

      {/* Stack */}
      <div className="shell stack-wrap">
        <div className="stack-head">
          <h3 className="display stack-title">Stack</h3>
          <span className="stack-sub mono">Tools I reach for</span>
        </div>
        <div className="stack-grid">
          {stack.map((t) => (
            <div className="stack-cell" key={t.name} title={t.name}>
              <img src={t.icon} alt={t.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
