export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact" aria-label="Contact">
      <div className="shell footer-inner">
        <p className="eyebrow footer-eyebrow">Contact</p>

        <a className="display footer-cta" href={`mailto:${profile.email}`}>
          Let's build
          <br />
          something clear.
        </a>

        <div className="footer-row mono">
          <div className="footer-contact">
            <a className="link footer-mail" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            {profile.phone ? (
              <a className="link footer-phone" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                {profile.phone}
              </a>
            ) : null}
          </div>
          <nav className="footer-socials" aria-label="Social">
            {profile.socials.map((s) => (
              <a key={s.label} className="link" href={s.url} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-base mono">
          <span>© {year} {profile.name}</span>
          <span className="footer-base-mid">Interfaces that watch, adapt, and include</span>
          <a className="link" href="#top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
