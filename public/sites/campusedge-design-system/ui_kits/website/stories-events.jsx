/* CampusEdge — Success Stories + Upcoming Events + Testimonials */

function SuccessStories() {
  return (
    <section style={{ ...SECTION_PAD, background: 'var(--surface-page)' }}>
      <div style={WRAP}>
        <SectionHead center eyebrow="Student Success" title="Where our graduates go"
          intro="From startups to global enterprises — CampusEdge alumni lead across every industry." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
          {window.SITE.stories.map((s) => (
            <div data-reveal key={s.name} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-xs)', position: 'relative' }}>
              <i className="fa-solid fa-quote-left" style={{ fontSize: 26, color: 'var(--blue-100)' }} />
              <p style={{ margin: '12px 0 22px', fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontStyle: 'italic',
                color: 'var(--text-body)', lineHeight: 1.55 }}>{s.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, borderTop: '1px solid var(--border-subtle)', paddingTop: 18 }}>
                <img src={s.img} alt={s.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{s.name}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-link)' }}>{s.position} · {s.org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events() {
  return (
    <section style={{ ...SECTION_PAD, background: 'var(--surface-subtle)' }}>
      <div style={WRAP}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <SectionHead eyebrow="What's On" title="Upcoming events" intro="Meet us in person — open houses, fairs, seminars and workshops." />
          <Button variant="ghost" iconRight={<i className="fa-solid fa-arrow-right" />} style={{ marginBottom: 'var(--space-7)' }}>Full calendar</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {window.SITE.events.map((e) => (
            <div data-reveal key={e.title} style={{ display: 'flex', gap: 16, padding: 'var(--space-5)', background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)',
              transition: 'box-shadow var(--dur-base), transform var(--dur-base)' }}
              onMouseEnter={(ev) => { ev.currentTarget.style.boxShadow = 'var(--shadow-md)'; ev.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(ev) => { ev.currentTarget.style.boxShadow = 'var(--shadow-xs)'; ev.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ flexShrink: 0, width: 58, textAlign: 'center', borderRadius: 'var(--radius-md)', padding: '10px 0',
                background: 'var(--navy-900)', color: '#fff' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-xl)', lineHeight: 1 }}>{e.date.d}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--gold-300)', marginTop: 3 }}>{e.date.m}</div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-link)' }}>
                  <i className={e.icon} style={{ marginRight: 6 }} />{e.type}
                </span>
                <h3 style={{ margin: '7px 0 8px', fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 1.2 }}>{e.title}</h3>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-location-dot" style={{ marginRight: 6 }} />{e.place}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section style={{ ...SECTION_PAD, background: 'var(--surface-page)' }}>
      <div style={WRAP}>
        <SectionHead center eyebrow="In Their Words" title="Trusted by students, alumni & parents" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
          {window.SITE.testimonials.map((t) => (
            <div data-reveal key={t.name} style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 4, color: 'var(--gold-500)', marginBottom: 14 }}>
                {[0,1,2,3,4].map(i => <i key={i} className="fa-solid fa-star" style={{ fontSize: 13 }} />)}
              </div>
              <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-body)', lineHeight: 1.65 }}>“{t.text}”</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={t.img} alt={t.name} style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontSize: 'var(--text-sm)' }}>{t.name}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.who}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { SuccessStories, Events, Testimonials });
