/* CampusEdge — standalone component definitions for the UI kit page.
   These mirror the DS components but are loaded via Babel (no import/export).
   The page does NOT depend on _ds_bundle.js. */

/* ── Button ─────────────────────────────────────────────── */
function Button({ children, variant = 'primary', size = 'md', iconLeft = null, iconRight = null, full = false, as = 'button', ...rest }) {
  const sizes = { sm: { padding: '0 16px', height: 38, font: 'var(--text-sm)' }, md: { padding: '0 24px', height: 48, font: 'var(--text-base)' }, lg: { padding: '0 32px', height: 56, font: 'var(--text-md)' } };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: { background: 'var(--action-primary)', color: '#fff', border: '1px solid transparent', boxShadow: 'var(--shadow-md)' },
    accent: { background: 'var(--action-accent)', color: 'var(--navy-900)', border: '1px solid transparent', boxShadow: 'var(--shadow-gold)' },
    outline: { background: 'transparent', color: 'var(--text-strong)', border: '1px solid var(--border-default)', boxShadow: 'none' },
    ghost: { background: 'transparent', color: 'var(--text-link)', border: '1px solid transparent', boxShadow: 'none' },
    glass: { background: 'var(--glass-light)', color: 'var(--text-strong)', border: '1px solid var(--glass-light-border)', backdropFilter: 'blur(var(--blur-md))', WebkitBackdropFilter: 'blur(var(--blur-md))', boxShadow: 'var(--shadow-sm)' },
  };
  const Tag = as;
  return (
    <Tag {...rest} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: full ? '100%' : 'auto', height: s.height, padding: s.padding, fontFamily: 'var(--font-sans)', fontSize: s.font, fontWeight: 'var(--fw-semibold)', letterSpacing: '0.01em', lineHeight: 1, borderRadius: 'var(--radius-pill)', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out)', ...variants[variant], ...(rest.style || {}) }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
      {iconLeft}{children}{iconRight}
    </Tag>
  );
}

/* ── Badge ──────────────────────────────────────────────── */
function Badge({ children, tone = 'blue', soft = true, ...rest }) {
  const tones = {
    blue: { fg: 'var(--blue-700)', bg: 'var(--blue-100)', solidBg: 'var(--blue-600)' },
    gold: { fg: 'var(--gold-700)', bg: 'var(--gold-100)', solidBg: 'var(--gold-500)' },
    navy: { fg: 'var(--navy-800)', bg: 'var(--slate-100)', solidBg: 'var(--navy-900)' },
    success: { fg: '#0f6b48', bg: '#dcf3e9', solidBg: 'var(--success)' },
    neutral: { fg: 'var(--slate-600)', bg: 'var(--slate-100)', solidBg: 'var(--slate-700)' },
  };
  const t = tones[tone] || tones.blue;
  return (
    <span {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: '0.02em', lineHeight: 1, borderRadius: 'var(--radius-pill)', color: soft ? t.fg : '#fff', background: soft ? t.bg : t.solidBg, ...(rest.style || {}) }}>
      {children}
    </span>
  );
}

/* ── Eyebrow ────────────────────────────────────────────── */
function Eyebrow({ children, color = 'var(--action-primary)', ...rest }) {
  return (
    <span {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color, ...(rest.style || {}) }}>
      <span style={{ width: 26, height: 2, background: 'currentColor', opacity: 0.6, display: 'inline-block' }} />{children}
    </span>
  );
}

/* ── ProgramCard ────────────────────────────────────────── */
function ProgramCard({ image, title, degree = 'Bachelor', duration = '4 Years', blurb, icon = 'fa-solid fa-graduation-cap', onLearnMore, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article {...rest} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)', transform: hover ? 'translateY(-6px)' : 'translateY(0)', transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)', ...(rest.style || {}) }}>
      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform var(--dur-slow) var(--ease-out)' }} />
        <div style={{ position: 'absolute', top: 14, left: 14 }}><Badge tone="gold">{degree}</Badge></div>
        <div style={{ position: 'absolute', bottom: 14, right: 14, width: 46, height: 46, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--glass-light)', backdropFilter: 'blur(var(--blur-md))', WebkitBackdropFilter: 'blur(var(--blur-md))', border: '1px solid var(--glass-light-border)', color: 'var(--navy-900)' }}>
          <i className={icon} style={{ fontSize: 18 }} />
        </div>
      </div>
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-lg)', color: 'var(--text-strong)', lineHeight: 'var(--leading-snug)' }}>{title}</h3>
        {blurb && <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-normal)' }}>{blurb}</p>}
        <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.02em' }}><i className="fa-regular fa-clock" /> {duration}</span>
          <button onClick={onLearnMore} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-link)' }}>
            Learn More <i className="fa-solid fa-arrow-right" style={{ transition: 'transform var(--dur-fast) var(--ease-out)', transform: hover ? 'translateX(4px)' : 'translateX(0)' }} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── StatCounter ────────────────────────────────────────── */
function StatCounter({ value, suffix = '', prefix = '', label, onDark = false, duration = 1600, ...rest }) {
  const ref = React.useRef(null);
  const [display, setDisplay] = React.useState(0);
  const started = React.useRef(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting && !started.current) { started.current = true; const start = performance.now();
        const tick = (now) => { const p = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - p, 3); setDisplay(value * eased); if (p < 1) requestAnimationFrame(tick); else setDisplay(value); };
        requestAnimationFrame(tick); } });
    }, { threshold: 0.4 }); io.observe(el); return () => io.disconnect();
  }, [value, duration]);
  const shown = Number.isInteger(value) ? Math.round(display).toLocaleString() : display.toFixed(1);
  return (
    <div ref={ref} {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 6, ...(rest.style || {}) }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-3xl)', lineHeight: 1, color: onDark ? '#fff' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{shown}<span style={{ color: 'var(--gold-500)' }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', letterSpacing: '0.01em', color: onDark ? 'var(--text-ondark-muted)' : 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

/* ── FeatureCard ─────────────────────────────────────────── */
function FeatureCard({ icon = 'fa-solid fa-star', title, children, accent = false, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div {...rest} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 'var(--space-6)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)', transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)', ...(rest.style || {}) }}>
      <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: accent ? 'var(--gold-100)' : 'var(--blue-100)', color: accent ? 'var(--gold-700)' : 'var(--blue-700)', transition: 'transform var(--dur-base) var(--ease-out)', transform: hover ? 'translateY(-3px) rotate(-4deg)' : 'none' }}>
        <i className={icon} style={{ fontSize: 22 }} />
      </div>
      <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{title}</h3>
      <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>{children}</p>
    </div>
  );
}

/* ── FacultyCard ─────────────────────────────────────────── */
function FacultyCardRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
      <i className={icon} style={{ color: 'var(--blue-600)', fontSize: 13, marginTop: 3, width: 16, textAlign: 'center' }} />
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontWeight: 'var(--fw-medium)' }}>{value}</div>
      </div>
    </div>
  );
}

function FacultyCard({ photo, name, role, department, qualification, research, socials = true, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article {...rest} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-xs)', transition: 'box-shadow var(--dur-base) var(--ease-out)', ...(rest.style || {}) }}>
      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: 'var(--slate-100)' }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hover ? 'none' : 'saturate(0.92)', transform: hover ? 'scale(1.04)' : 'scale(1)', transition: 'transform var(--dur-slow) var(--ease-out), filter var(--dur-base) var(--ease-out)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,26,63,0.78), rgba(10,26,63,0) 46%)' }} />
        {department && <span style={{ position: 'absolute', top: 14, left: 14, padding: '5px 11px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.02em', color: 'var(--navy-900)', background: 'var(--glass-light)', backdropFilter: 'blur(var(--blur-md))', WebkitBackdropFilter: 'blur(var(--blur-md))', border: '1px solid var(--glass-light-border)' }}>{department}</span>}
        <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-lg)', color: '#fff', lineHeight: 1.15 }}>{name}</div>
          {role && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--blue-300)', marginTop: 2 }}>{role}</div>}
        </div>
      </div>
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {qualification && <FacultyCardRow icon="fa-solid fa-user-graduate" label="Qualification" value={qualification} />}
        {research && <FacultyCardRow icon="fa-solid fa-flask" label="Research Area" value={research} />}
        {socials && <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {['fa-linkedin-in', 'fa-x-twitter', 'fa-google-scholar'].map((s) => (
            <span key={s} style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--slate-100)', color: 'var(--slate-600)', fontSize: 13, cursor: 'pointer' }}><i className={'fa-brands ' + s} /></span>
          ))}
        </div>}
      </div>
    </article>
  );
}

/* ── Input ───────────────────────────────────────────────── */
function Input({ label, type = 'text', icon = null, hint, textarea = false, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || 'fld-' + Math.random().toString(36).slice(2, 8);
  const Field = textarea ? 'textarea' : 'input';
  return (
    <label htmlFor={fieldId} style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
      {label && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{label}</span>}
      <span style={{ display: 'flex', alignItems: textarea ? 'flex-start' : 'center', gap: 10, padding: textarea ? '12px 16px' : '0 16px', height: textarea ? 'auto' : 50, background: 'var(--surface-page)', border: '1px solid ' + (focus ? 'var(--focus-ring)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', boxShadow: focus ? 'var(--shadow-focus)' : 'none', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}>
        {icon && <i className={icon} style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: textarea ? 4 : 0 }} />}
        <Field id={fieldId} type={textarea ? undefined : type} rows={textarea ? 4 : undefined} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} {...rest} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-strong)', resize: textarea ? 'vertical' : undefined, padding: textarea ? 0 : '14px 0', minHeight: textarea ? 88 : undefined, ...(rest.style || {}) }} />
      </span>
      {hint && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
  );
}

/* ── Accordion ──────────────────────────────────────────── */
function Accordion({ items = [], defaultOpen = 0, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...(rest.style || {}) }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ border: '1px solid ' + (isOpen ? 'var(--border-default)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', boxShadow: isOpen ? 'var(--shadow-sm)' : 'none', overflow: 'hidden', transition: 'box-shadow var(--dur-base) var(--ease-out)' }}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
              {it.q}
              <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', background: isOpen ? 'var(--action-primary)' : 'var(--blue-100)', color: isOpen ? '#fff' : 'var(--blue-700)', transition: 'transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}><i className="fa-solid fa-plus" style={{ fontSize: 13 }} /></span>
            </button>
            <div style={{ maxHeight: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0, transition: 'max-height var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out)' }}>
              <p style={{ margin: 0, padding: '0 22px 20px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-body)', lineHeight: 'var(--leading-relaxed)' }}>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Expose all to window for section scripts */
Object.assign(window, { Button, Badge, Eyebrow, ProgramCard, StatCounter, FeatureCard, FacultyCard, Input, Accordion });
