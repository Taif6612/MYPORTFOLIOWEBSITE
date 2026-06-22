/* CampusEdge — Programs (with live search/filter) + Admissions */
const { useState } = React;

function Programs() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const all = window.SITE.programs;
  const tags = ['All', ...Array.from(new Set(all.map(p => p.tag)))];
  const list = all.filter(p =>
    (filter === 'All' || p.tag === filter) &&
    (p.title.toLowerCase().includes(q.toLowerCase()) || p.blurb.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <section id="programs" style={{ ...SECTION_PAD, background: 'var(--surface-subtle)' }}>
      <div style={WRAP}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <SectionHead eyebrow="Academic Programs" title="Find the path that fits your ambition"
            intro="Eight faculties, one hundred-plus programs — search and explore where your future begins." />
          <div data-reveal style={{ position: 'relative', minWidth: 280, marginBottom: 'var(--space-7)' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search programs…" style={{
              width: '100%', height: 50, padding: '0 16px 0 44px', borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-default)', background: 'var(--surface-card)',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-strong)', outline: 'none' }} />
          </div>
        </div>

        <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'var(--space-6)' }}>
          {tags.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '9px 18px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)',
              border: '1px solid', transition: 'all var(--dur-fast) var(--ease-out)',
              borderColor: filter === t ? 'var(--action-primary)' : 'var(--border-default)',
              background: filter === t ? 'var(--action-primary)' : 'transparent',
              color: filter === t ? '#fff' : 'var(--text-body)' }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
          {list.map((p) => (
            <div data-reveal key={p.title}>
              <ProgramCard image={p.img} title={p.title} degree={p.degree} duration={p.duration} blurb={p.blurb} icon={p.icon} />
            </div>
          ))}
          {list.length === 0 && (
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>No programs match “{q}”.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Admissions() {
  const steps = window.SITE.admissions;
  return (
    <section id="admissions" style={{ ...SECTION_PAD, background: 'var(--surface-page)' }}>
      <div style={WRAP}>
        <SectionHead center eyebrow="Admissions" title="Five steps to your place at CampusEdge"
          intro="A clear, supportive process — our admissions team guides you at every stage." />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0, marginTop: 'var(--space-6)', position: 'relative' }}>
          {steps.map((s, i) => (
            <div data-reveal key={s.n} style={{ position: 'relative', padding: '0 14px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 68, height: 68, margin: '0 auto 18px', borderRadius: '50%',
                display: 'grid', placeItems: 'center', background: 'var(--surface-card)',
                border: '2px solid var(--blue-200, var(--blue-100))', boxShadow: 'var(--shadow-sm)', color: 'var(--action-primary)', fontSize: 22, zIndex: 2 }}>
                <i className={s.icon} />
                <span style={{ position: 'absolute', top: -6, right: -6, width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--gold-500)', color: 'var(--navy-900)', display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{s.n}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', top: 34, left: '60%', width: '80%', height: 2,
                  background: 'repeating-linear-gradient(90deg, var(--border-default) 0 6px, transparent 6px 12px)', zIndex: 1 }} />
              )}
              <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{s.title}</h3>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div data-reveal style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 'var(--space-7)', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" iconLeft={<i className="fa-solid fa-paper-plane" />}>Apply Now</Button>
          <Button variant="outline" size="lg" iconLeft={<i className="fa-solid fa-download" />}>Download Prospectus</Button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Programs, Admissions });
