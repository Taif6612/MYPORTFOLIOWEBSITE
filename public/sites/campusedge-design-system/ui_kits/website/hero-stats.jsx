/* CampusEdge — Hero + Stats */

function Hero() {
  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1800&q=80" alt="CampusEdge campus"
             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background:
          'linear-gradient(105deg, rgba(6,15,36,.92) 0%, rgba(10,26,63,.78) 42%, rgba(10,26,63,.35) 100%)' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--gutter)', width: '100%' }}>
        <div style={{ maxWidth: 760, paddingTop: 100 }}>
          <div data-reveal style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px',
            borderRadius: 'var(--radius-pill)', background: 'var(--glass-dark)', border: '1px solid var(--glass-dark-border)',
            backdropFilter: 'blur(var(--blur-md))', WebkitBackdropFilter: 'blur(var(--blur-md))', marginBottom: 26 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold-500)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.08em', color: '#fff', textTransform: 'uppercase' }}>
              Empowering Future Leaders
            </span>
          </div>

          <h1 data-reveal style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
            fontSize: 'clamp(2.6rem, 6.2vw, 4.75rem)', lineHeight: 1.02, letterSpacing: '-0.02em', color: '#fff' }}>
            Where Education<br />Meets <span style={{ fontStyle: 'italic', color: 'var(--gold-300)' }}>Innovation</span>
          </h1>

          <p data-reveal style={{ margin: '26px 0 0', maxWidth: 560, fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', color: 'rgba(255,255,255,.82)' }}>
            Preparing students for global success through world-class education, research,
            and leadership development.
          </p>

          <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36 }}>
            <Button as="a" href="#programs" variant="accent" size="lg" iconRight={<i className="fa-solid fa-arrow-right" />}>Explore Programs</Button>
            <Button as="a" href="#admissions" variant="glass" size="lg">Apply Now</Button>
          </div>

          <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 26, marginTop: 48 }}>
            {[['fa-solid fa-medal', 'Top 1% Accredited'], ['fa-solid fa-earth-americas', '80+ Countries'], ['fa-solid fa-star', '4.9 Student Rating']].map(([ic, t]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,.85)' }}>
                <i className={ic} style={{ color: 'var(--gold-500)', fontSize: 16 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,.6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em' }}>SCROLL</span>
        <i className="fa-solid fa-chevron-down" style={{ animation: 'ce-bob 1.8s var(--ease-in-out) infinite' }} />
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: 15000, suffix: '+', label: 'Students Enrolled' },
    { value: 500, suffix: '+', label: 'Faculty Members' },
    { value: 100, suffix: '+', label: 'Academic Programs' },
    { value: 95, suffix: '%', label: 'Graduate Employment' },
  ];
  return (
    <section style={{ background: 'var(--navy-900)', position: 'relative', marginTop: -1 }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-8) var(--gutter)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-6)' }}>
        {items.map((s, i) => (
          <div data-reveal key={s.label} style={{ borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,.12)', paddingLeft: i === 0 ? 0 : 24 }}>
            <StatCounter value={s.value} suffix={s.suffix} label={s.label} onDark />
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Stats });
