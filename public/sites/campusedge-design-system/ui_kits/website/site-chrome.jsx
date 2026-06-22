/* CampusEdge — site chrome: loader, nav, theme toggle, floating CTA, back-to-top */
const { useState, useEffect } = React;

function Loader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'grid', placeItems: 'center',
      background: 'var(--navy-900)', transition: 'opacity .6s var(--ease-out), visibility .6s',
      opacity: gone ? 0 : 1, visibility: gone ? 'hidden' : 'visible',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <img src="../../assets/mark-campusedge.svg" alt="" style={{ width: 64, animation: 'ce-pulse 1.4s var(--ease-in-out) infinite' }} />
        <div style={{ width: 160, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.15)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--gold-500)', animation: 'ce-load 1.1s var(--ease-out) forwards' }} />
        </div>
      </div>
    </div>
  );
}

function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const dark = theme === 'dark';

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'all var(--dur-base) var(--ease-out)',
      background: scrolled ? 'var(--glass-light)' : 'transparent',
      backdropFilter: scrolled ? 'blur(var(--blur-lg))' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(var(--blur-lg))' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--gutter)',
        height: scrolled ? 70 : 86, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'height var(--dur-base) var(--ease-out)',
      }}>
        <a href="#home" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={scrolled && !dark ? '../../assets/logo-campusedge.svg' : '../../assets/logo-campusedge-light.svg'}
               alt="CampusEdge Institute" style={{ height: 40 }} />
        </a>

        <nav className="ce-navlinks" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {window.SITE.nav.map((item) => (
            <a key={item} href={'#' + item.toLowerCase().replace(/ /g, '-')} style={{
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)',
              textDecoration: 'none', letterSpacing: '0.01em',
              color: scrolled ? 'var(--text-body)' : 'rgba(255,255,255,.9)',
              transition: 'color var(--dur-fast)',
            }}>{item}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onToggleTheme} aria-label="Toggle theme" style={{
            width: 40, height: 40, borderRadius: '50%', border: '1px solid',
            borderColor: scrolled ? 'var(--border-default)' : 'rgba(255,255,255,.3)',
            background: 'transparent', cursor: 'pointer',
            color: scrolled ? 'var(--text-body)' : '#fff', fontSize: 15,
          }}><i className={dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} /></button>

          <span className="ce-apply-desktop">
            <Button variant={scrolled ? 'primary' : 'glass'} size="sm"
                    iconRight={<i className="fa-solid fa-arrow-right" />}>Apply Now</Button>
          </span>

          {/* Hamburger — visible only ≤960px via CSS */}
          <button className="ce-hamburger" onClick={() => setOpen(!open)} aria-label="Open menu" style={{
            display: 'none', width: 42, height: 42, borderRadius: 'var(--radius-sm)',
            border: '1px solid', cursor: 'pointer', fontSize: 18,
            borderColor: scrolled ? 'var(--border-default)' : 'rgba(255,255,255,.3)',
            background: 'transparent', color: scrolled ? 'var(--text-body)' : '#fff',
          }}><i className={open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} /></button>
        </div>
      </div>

      {/* Mobile slide-down drawer */}
      <div className="ce-mobile-drawer" style={{
        overflow: 'hidden', maxHeight: open ? 600 : 0,
        transition: 'max-height var(--dur-slow) var(--ease-out)',
        background: 'var(--surface-card)', borderTop: open ? '1px solid var(--border-subtle)' : 'none',
      }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '16px var(--gutter) 24px',
          display: 'flex', flexDirection: 'column', gap: 6 }}>
          {window.SITE.nav.map((item) => (
            <a key={item} href={'#' + item.toLowerCase().replace(/ /g, '-')}
               onClick={() => setOpen(false)}
               style={{
                 fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', fontWeight: 'var(--fw-medium)',
                 textDecoration: 'none', color: 'var(--text-body)', padding: '12px 0',
                 borderBottom: '1px solid var(--border-subtle)',
               }}>{item}</a>
          ))}
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="lg" full iconRight={<i className="fa-solid fa-arrow-right" />}>Apply Now</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a href="#admissions" style={{
      position: 'fixed', right: 24, bottom: 88, zIndex: 900,
      display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 22px',
      borderRadius: 'var(--radius-pill)', background: 'var(--gold-500)', color: 'var(--navy-900)',
      fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-sm)',
      textDecoration: 'none', boxShadow: 'var(--shadow-gold)',
      transition: 'transform var(--dur-base) var(--ease-out), opacity var(--dur-base)',
      transform: show ? 'translateY(0)' : 'translateY(30px)', opacity: show ? 1 : 0,
      pointerEvents: show ? 'auto' : 'none',
    }}>
      <i className="fa-solid fa-graduation-cap" /> Apply Now
    </a>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" style={{
      position: 'fixed', right: 24, bottom: 24, zIndex: 900, width: 48, height: 48,
      borderRadius: '50%', border: '1px solid var(--border-default)', background: 'var(--surface-card)',
      color: 'var(--text-strong)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', fontSize: 15,
      transition: 'transform var(--dur-base) var(--ease-out), opacity var(--dur-base)',
      transform: show ? 'translateY(0)' : 'translateY(30px)', opacity: show ? 1 : 0,
      pointerEvents: show ? 'auto' : 'none',
    }}><i className="fa-solid fa-arrow-up" /></button>
  );
}

Object.assign(window, { Loader, Nav, FloatingCTA, BackToTop });
