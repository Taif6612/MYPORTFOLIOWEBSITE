import React from 'react';

/**
 * CampusEdge primary action. Calm royal-blue fill, gold accent, ghost & outline
 * variants. No bounce — confident ease-out lift on hover.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  full = false,
  as = 'button',
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 16px', height: 38, font: 'var(--text-sm)' },
    md: { padding: '0 24px', height: 48, font: 'var(--text-base)' },
    lg: { padding: '0 32px', height: 56, font: 'var(--text-md)' },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: 'var(--action-primary)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-md)',
    },
    accent: {
      background: 'var(--action-accent)',
      color: 'var(--navy-900)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-gold)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-default)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-link)',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
    glass: {
      background: 'var(--glass-light)',
      color: 'var(--text-strong)',
      border: '1px solid var(--glass-light-border)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      boxShadow: 'var(--shadow-sm)',
    },
  };

  const Tag = as;
  return (
    <Tag
      {...rest}
      className={'ce-btn ' + (rest.className || '')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: full ? '100%' : 'auto',
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-sans)',
        fontSize: s.font,
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: '0.01em',
        lineHeight: 1,
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        ...variants[variant],
        ...(rest.style || {}),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}
