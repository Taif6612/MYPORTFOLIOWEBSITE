/* CampusEdge — FAQ + News & Blog + Contact + Footer */

function Faq() {
  return (
    <section style={{ ...SECTION_PAD, background: 'var(--surface-subtle)' }}>
      <div style={{ ...WRAP, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 'var(--space-8)', alignItems: 'start' }} className="ce-faq-grid">
        <div data-reveal>
          <SectionHead eyebrow="Questions" title="Frequently asked"
            intro="Can't find what you're looking for? Our admissions team is one message away." />
          <Button variant="primary" iconLeft={<i className="fa-solid fa-headset" />}>Contact Admissions</Button>
        </div>
        <div data-reveal>
          <Accordion items={window.SITE.faqs} />
        </div>
      </div>
    </section>
  );
}

function News() {
  const [feat, ...rest] = window.SITE.news;
  return (
    <section id="news" style={{ ...SECTION_PAD, background: 'var(--surface-page)' }}>
      <div style={WRAP}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <SectionHead eyebrow="News & Blog" title="Latest from campus" />
          <Button variant="ghost" iconRight={<i className="fa-solid fa-arrow-right" />} style={{ marginBottom: 'var(--space-7)' }}>All stories</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-5)' }} className="ce-news-grid">
          <a data-reveal href="#news" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 380, display: 'flex', alignItems: 'flex-end', textDecoration: 'none' }}>
            <img src={feat.img} alt={feat.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,36,.92), rgba(6,15,36,0) 60%)' }} />
            <div style={{ position: 'relative', padding: 'var(--space-6)' }}>
              <Badge tone="gold" soft={false}>{feat.cat}</Badge>
              <h3 style={{ margin: '14px 0 8px', fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-xl)', color: '#fff', lineHeight: 1.15, maxWidth: 460 }}>{feat.title}</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{feat.date}</span>
            </div>
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {rest.map((n) => (
              <a data-reveal href="#news" key={n.title} style={{ display: 'flex', gap: 16, textDecoration: 'none',
                background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                transition: 'box-shadow var(--dur-base)' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <img src={n.img} alt={n.title} style={{ width: 120, height: 110, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ padding: '14px 16px 14px 0' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-link)' }}>{n.cat}</span>
                  <h4 style={{ margin: '6px 0 6px', fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 1.25 }}>{n.title}</h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{n.date}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" style={{ ...SECTION_PAD, background: 'var(--surface-subtle)' }}>
      <div style={{ ...WRAP, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-7)', alignItems: 'stretch' }} className="ce-contact-grid">
        <div data-reveal>
          <SectionHead eyebrow="Get in Touch" title="Begin your CampusEdge journey"
            intro="Have a question about programs, admissions or visiting? Send us a note." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8 }}>
            {[['fa-solid fa-location-dot', 'Campus Address', '120 University Avenue, Edgewater, CA 94000'],
              ['fa-solid fa-envelope', 'Admissions Email', 'admissions@campusedge.edu'],
              ['fa-solid fa-phone', 'Phone', '+1 (415) 555-0142']].map(([ic, k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--blue-100)', color: 'var(--blue-700)', flexShrink: 0 }}><i className={ic} /></span>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{k}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 'var(--fw-medium)', color: 'var(--text-strong)' }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, position: 'relative', height: 180, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80" alt="Campus map" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <span style={{ padding: '10px 18px', borderRadius: 'var(--radius-pill)', background: 'var(--glass-light)', backdropFilter: 'blur(var(--blur-md))', WebkitBackdropFilter: 'blur(var(--blur-md))', border: '1px solid var(--glass-light-border)', fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--navy-900)' }}>
                <i className="fa-solid fa-map-location-dot" style={{ marginRight: 8 }} />View interactive map
              </span>
            </div>
          </div>
        </div>

        <form data-reveal onSubmit={(e) => e.preventDefault()} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="First Name" placeholder="Jane" />
            <Input label="Last Name" placeholder="Doe" />
          </div>
          <Input label="Email" type="email" icon="fa-solid fa-envelope" placeholder="jane@email.com" />
          <Input label="Program of Interest" icon="fa-solid fa-graduation-cap" placeholder="e.g. Computer Science" />
          <Input label="Message" textarea placeholder="Tell us how we can help…" />
          <Button variant="primary" size="lg" full iconRight={<i className="fa-solid fa-paper-plane" />}>Send Inquiry</Button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { h: 'Quick Links', items: ['Home', 'About', 'Programs', 'Campus Life', 'News'] },
    { h: 'Academics', items: ['Engineering', 'Computer Science', 'Business', 'Architecture', 'Law'] },
    { h: 'Admissions', items: ['Apply Now', 'Tuition & Fees', 'Scholarships', 'Visit Campus', 'International'] },
  ];
  return (
    <footer style={{ background: 'var(--navy-950)', color: 'rgba(255,255,255,.7)' }}>
      <div style={{ ...WRAP, padding: 'var(--space-8) var(--gutter) var(--space-6)', display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 'var(--space-6)' }} className="ce-footer-grid">
        <div>
          <img src="../../assets/logo-campusedge-light.svg" alt="CampusEdge Institute" style={{ height: 42 }} />
          <p style={{ margin: '18px 0 20px', maxWidth: 280, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
            Empowering future leaders through excellence in education, research and leadership since 1962.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {['fa-facebook-f', 'fa-x-twitter', 'fa-instagram', 'fa-linkedin-in', 'fa-youtube'].map(s => (
              <a key={s} href="#" style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center',
                background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14 }}><i className={'fa-brands ' + s} /></a>
            ))}
          </div>
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <h4 style={{ margin: '0 0 16px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: '#fff', letterSpacing: '0.02em' }}>{c.h}</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.items.map(it => <li key={it}><a href="#" style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,.65)', textDecoration: 'none' }}>{it}</a></li>)}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ ...WRAP, padding: '0 var(--gutter) var(--space-7)' }}>
        <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(100deg, var(--navy-800), var(--navy-700))',
          display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', color: '#fff' }}>Stay in the loop</h3>
            <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,.7)' }}>Get admissions deadlines and campus news in your inbox.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 10, flex: '1 1 320px', maxWidth: 440 }}>
            <input placeholder="Your email address" style={{ flex: 1, height: 50, padding: '0 18px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', outline: 'none' }} />
            <Button variant="accent">Subscribe</Button>
          </form>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ ...WRAP, padding: '22px var(--gutter)', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,.55)' }}>
          <span>© 2026 CampusEdge Institute. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Use</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Accessibility</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Faq, News, Contact, Footer });
