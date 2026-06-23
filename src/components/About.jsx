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

          <div className="about-social reveal">
            <a
              className="about-social-btn is-interactive"
              href={profile.socials?.find((s) => s.label === "GitHub")?.url}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
            >
              <svg className="about-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              className="about-social-btn is-interactive"
              href={profile.socials?.find((s) => s.label === "LinkedIn")?.url}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
            >
              <svg className="about-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
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
