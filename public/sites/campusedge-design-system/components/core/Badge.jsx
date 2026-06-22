import React from 'react';

/** Small status / category label. Soft tinted pill. */
export function Badge({ children, tone = 'blue', soft = true, ...rest }) {
  const tones = {
    blue:   { fg: 'var(--blue-700)', bg: 'var(--blue-100)', solidBg: 'var(--blue-600)' },
    gold:   { fg: 'var(--gold-700)', bg: 'var(--gold-100)', solidBg: 'var(--gold-500)' },
    navy:   { fg: 'var(--navy-800)', bg: 'var(--slate-100)', solidBg: 'var(--navy-900)' },
    success:{ fg: '#0f6b48', bg: '#dcf3e9', solidBg: 'var(--success)' },
    neutral:{ fg: 'var(--slate-600)', bg: 'var(--slate-100)', solidBg: 'var(--slate-700)' },
  };
  const t = tones[tone] || tones.blue;
  return (
    <span
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: '0.02em',
        lineHeight: 1,
        borderRadius: 'var(--radius-pill)',
        color: soft ? t.fg : '#fff',
        background: soft ? t.bg : t.solidBg,
        ...(rest.style || {}),
      }}
    >
      {children}
    </span>
  );
}
