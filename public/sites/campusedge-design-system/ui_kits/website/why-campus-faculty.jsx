/* CampusEdge — Why Choose Us + Campus Life + Faculty */

function WhyChooseUs() {
  return (
    <section style={{ ...SECTION_PAD, background: 'var(--surface-subtle)' }}>
      <div style={WRAP}>
        <SectionHead center eyebrow="Why CampusEdge" title="An education built to launch careers"
          intro="Everything you need to thrive — accredited teaching, real-world partners, and support at every step." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
          {window.SITE.why.map((w) => (
            <div data-reveal key={w.title}>
              <FeatureCard icon={w.icon} title={w.title} accent={w.accent}>{w.desc}</FeatureCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CampusLife() {
  const items = window.SITE.campus;
  return (
    <section id="campus-life" style={{ ...SECTION_PAD, background: 'var(--surface-page)' }}>
      <div style={WRAP}>
        <SectionHead eyebrow="Campus Life" title="A campus that never stops moving"
          intro="Clubs, sport, labs and lifelong friendships — life at CampusEdge extends far beyond the lecture hall." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '210px', gap: 'var(--space-4)' }} className="ce-campus-grid">
          {items.map((c) => (
            <div data-reveal key={c.title} style={{
              gridColumn: c.span === 'wide' ? 'span 2' : 'span 1', position: 'relative', borderRadius: 'var(--radius-lg)',
              overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
              onMouseEnter={(e) => { e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'; }}
              onMouseLeave={(e) => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}>
              <img src={c.img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--dur-slow) var(--ease-out)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,26,63,.85), rgba(10,26,63,0) 55%)' }} />
              <div style={{ position: 'absolute', left: 18, bottom: 16, display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center',
                  background: 'var(--glass-light)', backdropFilter: 'blur(var(--blur-md))', WebkitBackdropFilter: 'blur(var(--blur-md))',
                  border: '1px solid var(--glass-light-border)', color: 'var(--navy-900)' }}><i className={c.icon} /></span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--fw-semibold)', color: '#fff' }}>{c.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faculty() {
  return (
    <section id="faculty" style={{ ...SECTION_PAD, background: 'var(--surface-subtle)' }}>
      <div style={WRAP}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <SectionHead eyebrow="Faculty" title="Learn from people who lead their fields"
            intro="Researchers, practitioners and mentors devoted to your success." />
          <Button variant="ghost" iconRight={<i className="fa-solid fa-arrow-right" />} style={{ marginBottom: 'var(--space-7)' }}>View all faculty</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-5)' }}>
          {window.SITE.faculty.map((f) => (
            <div data-reveal key={f.name}>
              <FacultyCard photo={f.photo} name={f.name} role={f.role} department={f.department}
                qualification={f.qualification} research={f.research} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WhyChooseUs, CampusLife, Faculty });
