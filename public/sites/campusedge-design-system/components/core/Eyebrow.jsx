import React from 'react';

/** Uppercase mono eyebrow label that precedes a section heading. */
export function Eyebrow({ children, color = 'var(--action-primary)', ...rest }) {
  return (
    <span
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: 'var(--tracking-eyebrow)',
        textTransform: 'uppercase',
        color,
        ...(rest.style || {}),
      }}
    >
      <span style={{ width: 26, height: 2, background: 'currentColor', opacity: 0.6, display: 'inline-block' }} />
      {children}
    </span>
  );
}
