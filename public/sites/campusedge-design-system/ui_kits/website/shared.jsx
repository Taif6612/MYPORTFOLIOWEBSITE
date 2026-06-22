/* CampusEdge — shared section helpers */

function SectionHead({ eyebrow, title, intro, center, dark, accent }) {
  return (
    <div data-reveal style={{ maxWidth: center ? 720 : 760, margin: center ? '0 auto' : 0,
      textAlign: center ? 'center' : 'left', marginBottom: 'var(--space-7)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: center ? 'center' : 'flex-start',
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)',
        letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase',
        color: accent ? 'var(--gold-600)' : (dark ? 'var(--blue-400)' : 'var(--action-primary)') }}>
        <span style={{ width: 26, height: 2, background: 'currentColor', opacity: 0.6 }} />{eyebrow}
      </span>
      <h2 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
        fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em',
        color: dark ? '#fff' : 'var(--text-strong)' }}>{title}</h2>
      {intro && <p style={{ margin: '18px auto 0', maxWidth: 620, fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)',
        color: dark ? 'rgba(255,255,255,.72)' : 'var(--text-muted)' }}>{intro}</p>}
    </div>
  );
}

const SECTION_PAD = { padding: 'var(--section-y) var(--gutter)' };
const WRAP = { maxWidth: 'var(--container-max)', margin: '0 auto' };

Object.assign(window, { SectionHead, SECTION_PAD, WRAP });
