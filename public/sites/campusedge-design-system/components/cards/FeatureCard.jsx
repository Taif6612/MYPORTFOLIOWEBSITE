import React from 'react';

/** Why-choose-us / feature tile. Icon medallion, title, copy. */
export function FeatureCard({ icon = 'fa-solid fa-star', title, children, accent = false, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 14,
        padding: 'var(--space-6)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        ...(rest.style || {}),
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--radius-md)',
        display: 'grid', placeItems: 'center',
        background: accent ? 'var(--gold-100)' : 'var(--blue-100)',
        color: accent ? 'var(--gold-700)' : 'var(--blue-700)',
        transition: 'transform var(--dur-base) var(--ease-out)',
        transform: hover ? 'translateY(-3px) rotate(-4deg)' : 'none',
      }}>
        <i className={icon} style={{ fontSize: 22 }} />
      </div>
      <h3 style={{
        margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)',
      }}>{title}</h3>
      <p style={{
        margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)',
      }}>{children}</p>
    </div>
  );
}
