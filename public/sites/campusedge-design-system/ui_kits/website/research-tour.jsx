/* CampusEdge — Research & Innovation + Virtual Campus Tour */

function Research() {
  return (
    <section style={{ ...SECTION_PAD, background: 'var(--navy-900)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.12,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.6) 1px, transparent 0)', backgroundSize: '34px 34px' }} />
      <div style={{ ...WRAP, position: 'relative' }}>
        <SectionHead dark eyebrow="Research & Innovation" title="Discovery that changes the world"
          intro="From AI to climate, our researchers and students turn bold ideas into real impact." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)' }}>
          {window.SITE.research.map((r) => (
            <div data-reveal key={r.k} style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
              <i className={r.icon} style={{ fontSize: 24, color: 'var(--gold-500)' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-2xl)', color: '#fff', marginTop: 16 }}>{r.v}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--blue-300)', marginTop: 2 }}>{r.k}</div>
              <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,.65)', lineHeight: 1.55 }}>{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VirtualTour() {
  return (
    <section style={{ padding: '0 var(--gutter) var(--section-y)', background: 'var(--navy-900)' }}>
      <div data-reveal style={{ ...WRAP, position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        minHeight: 420, display: 'flex', alignItems: 'center' }}>
        <img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=80" alt="Virtual campus tour"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,15,36,.9), rgba(6,15,36,.4))' }} />
        <div style={{ position: 'relative', padding: 'clamp(2rem, 5vw, 4rem)', maxWidth: 560 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-300)' }}>Virtual Campus Tour</span>
          <h2 style={{ margin: '14px 0 14px', fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#fff', lineHeight: 1.1 }}>
            Explore campus from anywhere
          </h2>
          <p style={{ margin: '0 0 28px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', color: 'rgba(255,255,255,.8)', lineHeight: 1.6 }}>
            Walk through lecture halls, labs and residences in an immersive 360° experience.
          </p>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <span style={{ width: 66, height: 66, borderRadius: '50%', background: 'var(--gold-500)', display: 'grid', placeItems: 'center', color: 'var(--navy-900)', boxShadow: 'var(--shadow-gold)' }}>
              <i className="fa-solid fa-play" style={{ fontSize: 20, marginLeft: 3 }} />
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-md)' }}>Start the tour</span>
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Research, VirtualTour });
