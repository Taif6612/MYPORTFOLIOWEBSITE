import React from 'react';
import { Badge } from '../core/Badge.jsx';

/**
 * Academic program card: image, degree type, duration, learn-more.
 * Image zoom + lift on hover, gold rule reveal.
 */
export function ProgramCard({
  image,
  title,
  degree = 'Bachelor',
  duration = '4 Years',
  blurb,
  icon = 'fa-solid fa-graduation-cap',
  onLearnMore,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        ...(rest.style || {}),
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
        <img
          src={image}
          alt={title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform var(--dur-slow) var(--ease-out)',
          }}
        />
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <Badge tone="gold">{degree}</Badge>
        </div>
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          width: 46, height: 46, borderRadius: 'var(--radius-md)',
          display: 'grid', placeItems: 'center',
          background: 'var(--glass-light)', backdropFilter: 'blur(var(--blur-md))',
          WebkitBackdropFilter: 'blur(var(--blur-md))',
          border: '1px solid var(--glass-light-border)', color: 'var(--navy-900)',
        }}>
          <i className={icon} style={{ fontSize: 18 }} />
        </div>
      </div>

      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        <h3 style={{
          margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--text-lg)', color: 'var(--text-strong)', lineHeight: 'var(--leading-snug)',
        }}>{title}</h3>
        {blurb && (
          <p style={{
            margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)', lineHeight: 'var(--leading-normal)',
          }}>{blurb}</p>
        )}
        <div style={{
          marginTop: 'auto', paddingTop: 14, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)', letterSpacing: '0.02em',
          }}>
            <i className="fa-regular fa-clock" /> {duration}
          </span>
          <button
            onClick={onLearnMore}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-semibold)', color: 'var(--text-link)',
            }}
          >
            Learn More
            <i className="fa-solid fa-arrow-right" style={{
              transition: 'transform var(--dur-fast) var(--ease-out)',
              transform: hover ? 'translateX(4px)' : 'translateX(0)',
            }} />
          </button>
        </div>
      </div>
    </article>
  );
}
