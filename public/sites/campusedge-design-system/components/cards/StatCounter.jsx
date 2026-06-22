import React from 'react';

/** Animated count-up statistic. Counts when scrolled into view. */
export function StatCounter({
  value,
  suffix = '',
  prefix = '',
  label,
  onDark = false,
  duration = 1600,
  ...rest
}) {
  const ref = React.useRef(null);
  const [display, setDisplay] = React.useState(0);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(value * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setDisplay(value);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const shown = Number.isInteger(value) ? Math.round(display).toLocaleString() : display.toFixed(1);

  return (
    <div ref={ref} {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 6, ...(rest.style || {}) }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
        fontSize: 'var(--text-3xl)', lineHeight: 1,
        color: onDark ? '#fff' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {prefix}{shown}<span style={{ color: 'var(--gold-500)' }}>{suffix}</span>
      </div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)', letterSpacing: '0.01em',
        color: onDark ? 'var(--text-ondark-muted)' : 'var(--text-muted)',
      }}>{label}</div>
    </div>
  );
}
