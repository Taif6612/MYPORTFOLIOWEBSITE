import React from 'react';

/** FAQ accordion. Single-open. */
export function Accordion({ items = [], defaultOpen = 0, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...(rest.style || {}) }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{
            border: '1px solid ' + (isOpen ? 'var(--border-default)' : 'var(--border-subtle)'),
            borderRadius: 'var(--radius-md)', background: 'var(--surface-card)',
            boxShadow: isOpen ? 'var(--shadow-sm)' : 'none', overflow: 'hidden',
            transition: 'box-shadow var(--dur-base) var(--ease-out)',
          }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)',
                fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)',
              }}
            >
              {it.q}
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%', display: 'grid',
                placeItems: 'center', background: isOpen ? 'var(--action-primary)' : 'var(--blue-100)',
                color: isOpen ? '#fff' : 'var(--blue-700)',
                transition: 'transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
                transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
              }}><i className="fa-solid fa-plus" style={{ fontSize: 13 }} /></span>
            </button>
            <div style={{
              maxHeight: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0,
              transition: 'max-height var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out)',
            }}>
              <p style={{
                margin: 0, padding: '0 22px 20px', fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-base)', color: 'var(--text-body)', lineHeight: 'var(--leading-relaxed)',
              }}>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
