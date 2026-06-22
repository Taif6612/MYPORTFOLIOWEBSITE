export default function About({ profile }) {
  return (
    <section className="section section--alt about" id="about" aria-label="About">
      <div className="shell about-grid">
        <div className="about-aside">
          <p className="eyebrow about-eyebrow">About</p>
          <figure className="about-portrait reveal">
            <div className="about-portrait-frame">
              <img src="/taif-portrait.jpeg" alt="Taif Ur Rahman" loading="lazy" />
              <span className="about-portrait-corner about-portrait-corner--tl" aria-hidden="true" />
              <span className="about-portrait-corner about-portrait-corner--br" aria-hidden="true" />
            </div>
            <figcaption className="about-portrait-cap mono">
              <span>Taif Ur Rahman</span>
              <span className="about-portrait-loc">Remote</span>
            </figcaption>
          </figure>
        </div>

        <div className="about-body" data-lines>
          <h2 className="display about-statement">
            <span className="line-mask">
              <span>I make the moment</span>
            </span>
            <span className="line-mask">
              <span>an interface goes from</span>
            </span>
            <span className="line-mask">
              <span className="about-em">confusing to obvious.</span>
            </span>
          </h2>

          <p className="about-para reveal">{profile.about}</p>

          <ul className="about-facts mono reveal">
            <li>
              <span className="about-facts-k">Focus</span>
              <span className="about-facts-v">Front-end · Interaction · Accessibility</span>
            </li>
            <li>
              <span className="about-facts-k">Based</span>
              <span className="about-facts-v">Remote · Available worldwide</span>
            </li>
            <li>
              <span className="about-facts-k">Studying</span>
              <span className="about-facts-v">BSc Computer Science · 2026</span>
            </li>
            <li>
              <span className="about-facts-k">Status</span>
              <span className="about-facts-v">{profile.status}</span>
            </li>
          </ul>

          {profile.publications?.length ? (
            <div className="about-pubs reveal">
              <p className="eyebrow about-pubs-label">Selected research</p>
              <ul className="about-pubs-list">
                {profile.publications.map((p) => (
                  <li key={p.title}>
                    {p.url ? (
                      <a
                        className="about-pubs-title about-pubs-link"
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {p.title} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="about-pubs-title">{p.title}</span>
                    )}
                    <span className="about-pubs-venue mono">{p.venue}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
