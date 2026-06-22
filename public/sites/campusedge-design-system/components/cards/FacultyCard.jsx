import React from 'react';

/** Faculty member card: photo, name, department, qualification, research area. */
export function FacultyCard({ photo, name, role, department, qualification, research, socials = true, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-xs)',
        transition: 'box-shadow var(--dur-base) var(--ease-out)',
        ...(rest.style || {}),
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: 'var(--slate-100)' }}>
        <img src={photo} alt={name} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: hover ? 'none' : 'saturate(0.92)',
          transform: hover ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform var(--dur-slow) var(--ease-out), filter var(--dur-base) var(--ease-out)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,26,63,0.78), rgba(10,26,63,0) 46%)',
        }} />
        {department && (
          <span style={{
            position: 'absolute', top: 14, left: 14, padding: '5px 11px',
            borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)', letterSpacing: '0.02em', color: 'var(--navy-900)',
            background: 'var(--glass-light)', backdropFilter: 'blur(var(--blur-md))',
            WebkitBackdropFilter: 'blur(var(--blur-md))', border: '1px solid var(--glass-light-border)',
          }}>{department}</span>
        )}
        <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-lg)', color: '#fff', lineHeight: 1.15 }}>{name}</div>
          {role && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--blue-300)', marginTop: 2 }}>{role}</div>}
        </div>
      </div>
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {qualification && (
          <Row icon="fa-solid fa-user-graduate" label="Qualification" value={qualification} />
        )}
        {research && (
          <Row icon="fa-solid fa-flask" label="Research Area" value={research} />
        )}
        {socials && (
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {['fa-linkedin-in', 'fa-x-twitter', 'fa-google-scholar'].map((s) => (
              <span key={s} style={{
                width: 34, height: 34, borderRadius: 'var(--radius-sm)', display: 'grid',
                placeItems: 'center', background: 'var(--slate-100)', color: 'var(--slate-600)',
                fontSize: 13, cursor: 'pointer',
              }}><i className={'fa-brands ' + s} /></span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Row({ icon, label, value }) {
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
