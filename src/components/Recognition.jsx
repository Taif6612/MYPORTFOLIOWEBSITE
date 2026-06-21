import Clock from "./Clock.jsx";
import { reviews, stack } from "../data/recognition.js";

function ReviewCard({ r, ariaHidden }) {
  return (
    <article className="review-card" aria-hidden={ariaHidden || undefined}>
      <p className="review-quote">{r.q}</p>
      <div className="review-by">
        <span className="review-avatar mono" style={{ background: r.c }}>
          {r.initials}
        </span>
        <span className="review-meta">
          <span className="review-name">
            {r.n}
            {r.v ? <span className="review-check" aria-label="verified">✓</span> : null}
          </span>
          <span className="review-role mono">{r.r}</span>
        </span>
      </div>
    </article>
  );
}

function Marquee({ list, dir }) {
  // Rendered twice for a seamless loop; the duplicate is hidden from a11y.
  return (
    <div className="marquee-row">
      <div className={`marquee marquee--${dir}`}>
        {list.map((r, i) => (
          <ReviewCard key={`a-${i}`} r={r} />
        ))}
        {list.map((r, i) => (
          <ReviewCard key={`b-${i}`} r={r} ariaHidden />
        ))}
      </div>
    </div>
  );
}

export default function Recognition() {
  const reviewsA = reviews.slice(0, 5);
  const reviewsB = reviews.slice(5);

  return (
    <section className="section recognition" id="praise" aria-label="Availability, recognition and stack">
      {/* Clock band: availability · live Dhaka clock · ship quote */}
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

      {/* Testimonials */}
      <div className="shell recognition-head">
        <p className="eyebrow">
          <span className="recognition-head-em">Signal</span> from the field
        </p>
      </div>
      <Marquee list={reviewsA} dir="left" />
      <Marquee list={reviewsB} dir="right" />

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
