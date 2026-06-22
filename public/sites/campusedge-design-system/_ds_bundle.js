/* @ds-bundle: {"format":3,"namespace":"CampusEdgeDesignSystem_cec608","components":[{"name":"FacultyCard","sourcePath":"components/cards/FacultyCard.jsx"},{"name":"FeatureCard","sourcePath":"components/cards/FeatureCard.jsx"},{"name":"ProgramCard","sourcePath":"components/cards/ProgramCard.jsx"},{"name":"StatCounter","sourcePath":"components/cards/StatCounter.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Accordion","sourcePath":"components/forms/Accordion.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/cards/FacultyCard.jsx":"3c58b1a4a34c","components/cards/FeatureCard.jsx":"da6786c81164","components/cards/ProgramCard.jsx":"71c21b8b2642","components/cards/StatCounter.jsx":"71b00e64be45","components/core/Badge.jsx":"860024f5b797","components/core/Button.jsx":"9f1fad40f36c","components/core/Eyebrow.jsx":"4203de83b8dc","components/forms/Accordion.jsx":"9f83bb0e03ba","components/forms/Input.jsx":"49b71d85e464","ui_kits/website/components.jsx":"120efc51eb12","ui_kits/website/faq-news-contact.jsx":"4572cae06869","ui_kits/website/hero-stats.jsx":"4fafa59d8488","ui_kits/website/programs-admissions.jsx":"2eefc16b1d4b","ui_kits/website/research-tour.jsx":"1986637da25d","ui_kits/website/shared.jsx":"3f316d8e5baf","ui_kits/website/site-app.jsx":"4ba1ea139b44","ui_kits/website/site-chrome.jsx":"36f9c81c843b","ui_kits/website/site-data.js":"2b5814a3e679","ui_kits/website/stories-events.jsx":"7c495cf007cf","ui_kits/website/why-campus-faculty.jsx":"1696f7edacf5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CampusEdgeDesignSystem_cec608 = window.CampusEdgeDesignSystem_cec608 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/FacultyCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Faculty member card: photo, name, department, qualification, research area. */
function FacultyCard({
  photo,
  name,
  role,
  department,
  qualification,
  research,
  socials = true,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-xs)',
      transition: 'box-shadow var(--dur-base) var(--ease-out)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      background: 'var(--slate-100)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: hover ? 'none' : 'saturate(0.92)',
      transform: hover ? 'scale(1.04)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out), filter var(--dur-base) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(10,26,63,0.78), rgba(10,26,63,0) 46%)'
    }
  }), department && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14,
      padding: '5px 11px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.02em',
      color: 'var(--navy-900)',
      background: 'var(--glass-light)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      border: '1px solid var(--glass-light-border)'
    }
  }, department), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 16,
      left: 18,
      right: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-lg)',
      color: '#fff',
      lineHeight: 1.15
    }
  }, name), role && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--blue-300)',
      marginTop: 2
    }
  }, role))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, qualification && /*#__PURE__*/React.createElement(Row, {
    icon: "fa-solid fa-user-graduate",
    label: "Qualification",
    value: qualification
  }), research && /*#__PURE__*/React.createElement(Row, {
    icon: "fa-solid fa-flask",
    label: "Research Area",
    value: research
  }), socials && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 4
    }
  }, ['fa-linkedin-in', 'fa-x-twitter', 'fa-google-scholar'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--slate-100)',
      color: 'var(--slate-600)',
      fontSize: 13,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: 'fa-brands ' + s
  }))))));
}
function Row({
  icon,
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      color: 'var(--blue-600)',
      fontSize: 13,
      marginTop: 3,
      width: 16,
      textAlign: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      fontWeight: 'var(--fw-medium)'
    }
  }, value)));
}
Object.assign(__ds_scope, { FacultyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FacultyCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/FeatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Why-choose-us / feature tile. Icon medallion, title, copy. */
function FeatureCard({
  icon = 'fa-solid fa-star',
  title,
  children,
  accent = false,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: accent ? 'var(--gold-100)' : 'var(--blue-100)',
      color: accent ? 'var(--gold-700)' : 'var(--blue-700)',
      transition: 'transform var(--dur-base) var(--ease-out)',
      transform: hover ? 'translateY(-3px) rotate(-4deg)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 22
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/StatCounter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Animated count-up statistic. Counts when scrolled into view. */
function StatCounter({
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
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(value * eased);
            if (p < 1) requestAnimationFrame(tick);else setDisplay(value);
          };
          requestAnimationFrame(tick);
        }
      });
    }, {
      threshold: 0.4
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  const shown = Number.isInteger(value) ? Math.round(display).toLocaleString() : display.toFixed(1);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref
  }, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-3xl)',
      lineHeight: 1,
      color: onDark ? '#fff' : 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, prefix, shown, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-500)'
    }
  }, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: '0.01em',
      color: onDark ? 'var(--text-ondark-muted)' : 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { StatCounter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatCounter.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small status / category label. Soft tinted pill. */
function Badge({
  children,
  tone = 'blue',
  soft = true,
  ...rest
}) {
  const tones = {
    blue: {
      fg: 'var(--blue-700)',
      bg: 'var(--blue-100)',
      solidBg: 'var(--blue-600)'
    },
    gold: {
      fg: 'var(--gold-700)',
      bg: 'var(--gold-100)',
      solidBg: 'var(--gold-500)'
    },
    navy: {
      fg: 'var(--navy-800)',
      bg: 'var(--slate-100)',
      solidBg: 'var(--navy-900)'
    },
    success: {
      fg: '#0f6b48',
      bg: '#dcf3e9',
      solidBg: 'var(--success)'
    },
    neutral: {
      fg: 'var(--slate-600)',
      bg: 'var(--slate-100)',
      solidBg: 'var(--slate-700)'
    }
  };
  const t = tones[tone] || tones.blue;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
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
      ...(rest.style || {})
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProgramCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Academic program card: image, degree type, duration, learn-more.
 * Image zoom + lift on hover, gold rule reveal.
 */
function ProgramCard({
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
  return /*#__PURE__*/React.createElement("article", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-6px)' : 'translateY(0)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16 / 10',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.06)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "gold"
  }, degree)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 14,
      right: 14,
      width: 46,
      height: 46,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--glass-light)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      border: '1px solid var(--glass-light-border)',
      color: 'var(--navy-900)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 18
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--leading-snug)'
    }
  }, title), blurb && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-normal)'
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      letterSpacing: '0.02em'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-clock"
  }), " ", duration), /*#__PURE__*/React.createElement("button", {
    onClick: onLearnMore,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-link)'
    }
  }, "Learn More", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right",
    style: {
      transition: 'transform var(--dur-fast) var(--ease-out)',
      transform: hover ? 'translateX(4px)' : 'translateX(0)'
    }
  })))));
}
Object.assign(__ds_scope, { ProgramCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProgramCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CampusEdge primary action. Calm royal-blue fill, gold accent, ghost & outline
 * variants. No bounce — confident ease-out lift on hover.
 */
function Button({
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
    sm: {
      padding: '0 16px',
      height: 38,
      font: 'var(--text-sm)'
    },
    md: {
      padding: '0 24px',
      height: 48,
      font: 'var(--text-base)'
    },
    lg: {
      padding: '0 32px',
      height: 56,
      font: 'var(--text-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--action-primary)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-md)'
    },
    accent: {
      background: 'var(--action-accent)',
      color: 'var(--navy-900)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-gold)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-default)',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-link)',
      border: '1px solid transparent',
      boxShadow: 'none'
    },
    glass: {
      background: 'var(--glass-light)',
      color: 'var(--text-strong)',
      border: '1px solid var(--glass-light-border)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      boxShadow: 'var(--shadow-sm)'
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    className: 'ce-btn ' + (rest.className || ''),
    style: {
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
      ...(rest.style || {})
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Uppercase mono eyebrow label that precedes a section heading. */
function Eyebrow({
  children,
  color = 'var(--action-primary)',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color,
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 2,
      background: 'currentColor',
      opacity: 0.6,
      display: 'inline-block'
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/forms/Accordion.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** FAQ accordion. Single-open. */
function Accordion({
  items = [],
  defaultOpen = 0,
  ...rest
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...(rest.style || {})
    }
  }), items.map((it, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        border: '1px solid ' + (isOpen ? 'var(--border-default)' : 'var(--border-subtle)'),
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
        overflow: 'hidden',
        transition: 'box-shadow var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '18px 22px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, it.q, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: isOpen ? 'var(--action-primary)' : 'var(--blue-100)',
        color: isOpen ? '#fff' : 'var(--blue-700)',
        transition: 'transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
        transform: isOpen ? 'rotate(45deg)' : 'rotate(0)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus",
      style: {
        fontSize: 13
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: isOpen ? 320 : 0,
        opacity: isOpen ? 1 : 0,
        transition: 'max-height var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        padding: '0 22px 20px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-body)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, it.a)));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled text field / textarea with focus ring. */
function Input({
  label,
  type = 'text',
  icon = null,
  hint,
  textarea = false,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || 'fld-' + Math.random().toString(36).slice(2, 8);
  const Field = textarea ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: textarea ? 'flex-start' : 'center',
      gap: 10,
      padding: textarea ? '12px 16px' : '0 16px',
      height: textarea ? 'auto' : 50,
      background: 'var(--surface-page)',
      border: '1px solid ' + (focus ? 'var(--focus-ring)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      color: 'var(--text-muted)',
      fontSize: 14,
      marginTop: textarea ? 4 : 0
    }
  }), /*#__PURE__*/React.createElement(Field, _extends({
    id: fieldId,
    type: textarea ? undefined : type,
    rows: textarea ? 4 : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest, {
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      resize: textarea ? 'vertical' : undefined,
      padding: textarea ? 0 : '14px 0',
      minHeight: textarea ? 88 : undefined,
      ...(rest.style || {})
    }
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/components.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* CampusEdge — standalone component definitions for the UI kit page.
   These mirror the DS components but are loaded via Babel (no import/export).
   The page does NOT depend on _ds_bundle.js. */

/* ── Button ─────────────────────────────────────────────── */
function Button({
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
    sm: {
      padding: '0 16px',
      height: 38,
      font: 'var(--text-sm)'
    },
    md: {
      padding: '0 24px',
      height: 48,
      font: 'var(--text-base)'
    },
    lg: {
      padding: '0 32px',
      height: 56,
      font: 'var(--text-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--action-primary)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-md)'
    },
    accent: {
      background: 'var(--action-accent)',
      color: 'var(--navy-900)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-gold)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-default)',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-link)',
      border: '1px solid transparent',
      boxShadow: 'none'
    },
    glass: {
      background: 'var(--glass-light)',
      color: 'var(--text-strong)',
      border: '1px solid var(--glass-light-border)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      boxShadow: 'var(--shadow-sm)'
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    style: {
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
      ...(rest.style || {})
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }), iconLeft, children, iconRight);
}

/* ── Badge ──────────────────────────────────────────────── */
function Badge({
  children,
  tone = 'blue',
  soft = true,
  ...rest
}) {
  const tones = {
    blue: {
      fg: 'var(--blue-700)',
      bg: 'var(--blue-100)',
      solidBg: 'var(--blue-600)'
    },
    gold: {
      fg: 'var(--gold-700)',
      bg: 'var(--gold-100)',
      solidBg: 'var(--gold-500)'
    },
    navy: {
      fg: 'var(--navy-800)',
      bg: 'var(--slate-100)',
      solidBg: 'var(--navy-900)'
    },
    success: {
      fg: '#0f6b48',
      bg: '#dcf3e9',
      solidBg: 'var(--success)'
    },
    neutral: {
      fg: 'var(--slate-600)',
      bg: 'var(--slate-100)',
      solidBg: 'var(--slate-700)'
    }
  };
  const t = tones[tone] || tones.blue;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
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
      ...(rest.style || {})
    }
  }), children);
}

/* ── Eyebrow ────────────────────────────────────────────── */
function Eyebrow({
  children,
  color = 'var(--action-primary)',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color,
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 2,
      background: 'currentColor',
      opacity: 0.6,
      display: 'inline-block'
    }
  }), children);
}

/* ── ProgramCard ────────────────────────────────────────── */
function ProgramCard({
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
  return /*#__PURE__*/React.createElement("article", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-6px)' : 'translateY(0)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16 / 10',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.06)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, degree)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 14,
      right: 14,
      width: 46,
      height: 46,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--glass-light)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      border: '1px solid var(--glass-light-border)',
      color: 'var(--navy-900)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 18
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--leading-snug)'
    }
  }, title), blurb && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-normal)'
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      letterSpacing: '0.02em'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-clock"
  }), " ", duration), /*#__PURE__*/React.createElement("button", {
    onClick: onLearnMore,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-link)'
    }
  }, "Learn More ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right",
    style: {
      transition: 'transform var(--dur-fast) var(--ease-out)',
      transform: hover ? 'translateX(4px)' : 'translateX(0)'
    }
  })))));
}

/* ── StatCounter ────────────────────────────────────────── */
function StatCounter({
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
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(value * eased);
            if (p < 1) requestAnimationFrame(tick);else setDisplay(value);
          };
          requestAnimationFrame(tick);
        }
      });
    }, {
      threshold: 0.4
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  const shown = Number.isInteger(value) ? Math.round(display).toLocaleString() : display.toFixed(1);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref
  }, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-3xl)',
      lineHeight: 1,
      color: onDark ? '#fff' : 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, prefix, shown, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-500)'
    }
  }, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: '0.01em',
      color: onDark ? 'var(--text-ondark-muted)' : 'var(--text-muted)'
    }
  }, label));
}

/* ── FeatureCard ─────────────────────────────────────────── */
function FeatureCard({
  icon = 'fa-solid fa-star',
  title,
  children,
  accent = false,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: accent ? 'var(--gold-100)' : 'var(--blue-100)',
      color: accent ? 'var(--gold-700)' : 'var(--blue-700)',
      transition: 'transform var(--dur-base) var(--ease-out)',
      transform: hover ? 'translateY(-3px) rotate(-4deg)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 22
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, children));
}

/* ── FacultyCard ─────────────────────────────────────────── */
function FacultyCardRow({
  icon,
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      color: 'var(--blue-600)',
      fontSize: 13,
      marginTop: 3,
      width: 16,
      textAlign: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      fontWeight: 'var(--fw-medium)'
    }
  }, value)));
}
function FacultyCard({
  photo,
  name,
  role,
  department,
  qualification,
  research,
  socials = true,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-xs)',
      transition: 'box-shadow var(--dur-base) var(--ease-out)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      background: 'var(--slate-100)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: hover ? 'none' : 'saturate(0.92)',
      transform: hover ? 'scale(1.04)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out), filter var(--dur-base) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(10,26,63,0.78), rgba(10,26,63,0) 46%)'
    }
  }), department && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14,
      padding: '5px 11px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.02em',
      color: 'var(--navy-900)',
      background: 'var(--glass-light)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      border: '1px solid var(--glass-light-border)'
    }
  }, department), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 16,
      left: 18,
      right: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-lg)',
      color: '#fff',
      lineHeight: 1.15
    }
  }, name), role && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--blue-300)',
      marginTop: 2
    }
  }, role))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, qualification && /*#__PURE__*/React.createElement(FacultyCardRow, {
    icon: "fa-solid fa-user-graduate",
    label: "Qualification",
    value: qualification
  }), research && /*#__PURE__*/React.createElement(FacultyCardRow, {
    icon: "fa-solid fa-flask",
    label: "Research Area",
    value: research
  }), socials && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 4
    }
  }, ['fa-linkedin-in', 'fa-x-twitter', 'fa-google-scholar'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--slate-100)',
      color: 'var(--slate-600)',
      fontSize: 13,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: 'fa-brands ' + s
  }))))));
}

/* ── Input ───────────────────────────────────────────────── */
function Input({
  label,
  type = 'text',
  icon = null,
  hint,
  textarea = false,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || 'fld-' + Math.random().toString(36).slice(2, 8);
  const Field = textarea ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: textarea ? 'flex-start' : 'center',
      gap: 10,
      padding: textarea ? '12px 16px' : '0 16px',
      height: textarea ? 'auto' : 50,
      background: 'var(--surface-page)',
      border: '1px solid ' + (focus ? 'var(--focus-ring)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      color: 'var(--text-muted)',
      fontSize: 14,
      marginTop: textarea ? 4 : 0
    }
  }), /*#__PURE__*/React.createElement(Field, _extends({
    id: fieldId,
    type: textarea ? undefined : type,
    rows: textarea ? 4 : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest, {
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      resize: textarea ? 'vertical' : undefined,
      padding: textarea ? 0 : '14px 0',
      minHeight: textarea ? 88 : undefined,
      ...(rest.style || {})
    }
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, hint));
}

/* ── Accordion ──────────────────────────────────────────── */
function Accordion({
  items = [],
  defaultOpen = 0,
  ...rest
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...(rest.style || {})
    }
  }), items.map((it, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        border: '1px solid ' + (isOpen ? 'var(--border-default)' : 'var(--border-subtle)'),
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
        overflow: 'hidden',
        transition: 'box-shadow var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '18px 22px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, it.q, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: isOpen ? 'var(--action-primary)' : 'var(--blue-100)',
        color: isOpen ? '#fff' : 'var(--blue-700)',
        transition: 'transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
        transform: isOpen ? 'rotate(45deg)' : 'rotate(0)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus",
      style: {
        fontSize: 13
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: isOpen ? 320 : 0,
        opacity: isOpen ? 1 : 0,
        transition: 'max-height var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        padding: '0 22px 20px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-body)',
        lineHeight: 'var(--leading-relaxed)'
      }
    }, it.a)));
  }));
}

/* Expose all to window for section scripts */
Object.assign(window, {
  Button,
  Badge,
  Eyebrow,
  ProgramCard,
  StatCounter,
  FeatureCard,
  FacultyCard,
  Input,
  Accordion
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/faq-news-contact.jsx
try { (() => {
/* CampusEdge — FAQ + News & Blog + Contact + Footer */

function Faq() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 'var(--space-8)',
      alignItems: 'start'
    },
    className: "ce-faq-grid"
  }, /*#__PURE__*/React.createElement("div", {
    "data-reveal": true
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Questions",
    title: "Frequently asked",
    intro: "Can't find what you're looking for? Our admissions team is one message away."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-headset"
    })
  }, "Contact Admissions")), /*#__PURE__*/React.createElement("div", {
    "data-reveal": true
  }, /*#__PURE__*/React.createElement(Accordion, {
    items: window.SITE.faqs
  }))));
}
function News() {
  const [feat, ...rest] = window.SITE.news;
  return /*#__PURE__*/React.createElement("section", {
    id: "news",
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "News & Blog",
    title: "Latest from campus"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right"
    }),
    style: {
      marginBottom: 'var(--space-7)'
    }
  }, "All stories")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 'var(--space-5)'
    },
    className: "ce-news-grid"
  }, /*#__PURE__*/React.createElement("a", {
    "data-reveal": true,
    href: "#news",
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      minHeight: 380,
      display: 'flex',
      alignItems: 'flex-end',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: feat.img,
    alt: feat.title,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(6,15,36,.92), rgba(6,15,36,0) 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "gold",
    soft: false
  }, feat.cat), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '14px 0 8px',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-xl)',
      color: '#fff',
      lineHeight: 1.15,
      maxWidth: 460
    }
  }, feat.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'rgba(255,255,255,.7)'
    }
  }, feat.date))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, rest.map(n => /*#__PURE__*/React.createElement("a", {
    "data-reveal": true,
    href: "#news",
    key: n.title,
    style: {
      display: 'flex',
      gap: 16,
      textDecoration: 'none',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'box-shadow var(--dur-base)'
    },
    onMouseEnter: e => e.currentTarget.style.boxShadow = 'var(--shadow-md)',
    onMouseLeave: e => e.currentTarget.style.boxShadow = 'none'
  }, /*#__PURE__*/React.createElement("img", {
    src: n.img,
    alt: n.title,
    style: {
      width: 120,
      height: 110,
      objectFit: 'cover',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 14px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--text-link)'
    }
  }, n.cat), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '6px 0 6px',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)',
      lineHeight: 1.25
    }
  }, n.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, n.date))))))));
}
function Contact() {
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-7)',
      alignItems: 'stretch'
    },
    className: "ce-contact-grid"
  }, /*#__PURE__*/React.createElement("div", {
    "data-reveal": true
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Get in Touch",
    title: "Begin your CampusEdge journey",
    intro: "Have a question about programs, admissions or visiting? Send us a note."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      marginTop: 8
    }
  }, [['fa-solid fa-location-dot', 'Campus Address', '120 University Avenue, Edgewater, CA 94000'], ['fa-solid fa-envelope', 'Admissions Email', 'admissions@campusedge.edu'], ['fa-solid fa-phone', 'Phone', '+1 (415) 555-0142']].map(([ic, k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--blue-100)',
      color: 'var(--blue-700)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: ic
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-strong)'
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      position: 'relative',
      height: 180,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80",
    alt: "Campus map",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: 'saturate(0.85)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '10px 18px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--glass-light)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      border: '1px solid var(--glass-light-border)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-sm)',
      color: 'var(--navy-900)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-map-location-dot",
    style: {
      marginRight: 8
    }
  }), "View interactive map")))), /*#__PURE__*/React.createElement("form", {
    "data-reveal": true,
    onSubmit: e => e.preventDefault(),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "First Name",
    placeholder: "Jane"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Last Name",
    placeholder: "Doe"
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    icon: "fa-solid fa-envelope",
    placeholder: "jane@email.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Program of Interest",
    icon: "fa-solid fa-graduation-cap",
    placeholder: "e.g. Computer Science"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Message",
    textarea: true,
    placeholder: "Tell us how we can help\u2026"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    full: true,
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paper-plane"
    })
  }, "Send Inquiry"))));
}
function Footer() {
  const cols = [{
    h: 'Quick Links',
    items: ['Home', 'About', 'Programs', 'Campus Life', 'News']
  }, {
    h: 'Academics',
    items: ['Engineering', 'Computer Science', 'Business', 'Architecture', 'Law']
  }, {
    h: 'Admissions',
    items: ['Apply Now', 'Tuition & Fees', 'Scholarships', 'Visit Campus', 'International']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--navy-950)',
      color: 'rgba(255,255,255,.7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      padding: 'var(--space-8) var(--gutter) var(--space-6)',
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
      gap: 'var(--space-6)'
    },
    className: "ce-footer-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-campusedge-light.svg",
    alt: "CampusEdge Institute",
    style: {
      height: 42
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 20px',
      maxWidth: 280,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.7
    }
  }, "Empowering future leaders through excellence in education, research and leadership since 1962."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, ['fa-facebook-f', 'fa-x-twitter', 'fa-instagram', 'fa-linkedin-in', 'fa-youtube'].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(255,255,255,.08)',
      color: '#fff',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: 'fa-brands ' + s
  }))))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 16px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-bold)',
      color: '#fff',
      letterSpacing: '0.02em'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, c.items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'rgba(255,255,255,.65)',
      textDecoration: 'none'
    }
  }, it))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      padding: '0 var(--gutter) var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(100deg, var(--navy-800), var(--navy-700))',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 18,
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--fw-bold)',
      color: '#fff'
    }
  }, "Stay in the loop"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'rgba(255,255,255,.7)'
    }
  }, "Get admissions deadlines and campus news in your inbox.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => e.preventDefault(),
    style: {
      display: 'flex',
      gap: 10,
      flex: '1 1 320px',
      maxWidth: 440
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Your email address",
    style: {
      flex: 1,
      height: 50,
      padding: '0 18px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid rgba(255,255,255,.2)',
      background: 'rgba(255,255,255,.08)',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent"
  }, "Subscribe")))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      padding: '22px var(--gutter)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'space-between',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      color: 'rgba(255,255,255,.55)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 CampusEdge Institute. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Terms of Use"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Accessibility")))));
}
Object.assign(window, {
  Faq,
  News,
  Contact,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/faq-news-contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/hero-stats.jsx
try { (() => {
/* CampusEdge — Hero + Stats */

function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    id: "home",
    style: {
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1800&q=80",
    alt: "CampusEdge campus",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(105deg, rgba(6,15,36,.92) 0%, rgba(10,26,63,.78) 42%, rgba(10,26,63,.35) 100%)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      paddingTop: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 16px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--glass-dark)',
      border: '1px solid var(--glass-dark-border)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      letterSpacing: '0.08em',
      color: '#fff',
      textTransform: 'uppercase'
    }
  }, "Empowering Future Leaders")), /*#__PURE__*/React.createElement("h1", {
    "data-reveal": true,
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'clamp(2.6rem, 6.2vw, 4.75rem)',
      lineHeight: 1.02,
      letterSpacing: '-0.02em',
      color: '#fff'
    }
  }, "Where Education", /*#__PURE__*/React.createElement("br", null), "Meets ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--gold-300)'
    }
  }, "Innovation")), /*#__PURE__*/React.createElement("p", {
    "data-reveal": true,
    style: {
      margin: '26px 0 0',
      maxWidth: 560,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'rgba(255,255,255,.82)'
    }
  }, "Preparing students for global success through world-class education, research, and leadership development."), /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 14,
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#programs",
    variant: "accent",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right"
    })
  }, "Explore Programs"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#admissions",
    variant: "glass",
    size: "lg"
  }, "Apply Now")), /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 26,
      marginTop: 48
    }
  }, [['fa-solid fa-medal', 'Top 1% Accredited'], ['fa-solid fa-earth-americas', '80+ Countries'], ['fa-solid fa-star', '4.9 Student Rating']].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: 'rgba(255,255,255,.85)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: ic,
    style: {
      color: 'var(--gold-500)',
      fontSize: 16
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)'
    }
  }, t)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 30,
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'rgba(255,255,255,.6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.2em'
    }
  }, "SCROLL"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-down",
    style: {
      animation: 'ce-bob 1.8s var(--ease-in-out) infinite'
    }
  })));
}
function Stats() {
  const items = [{
    value: 15000,
    suffix: '+',
    label: 'Students Enrolled'
  }, {
    value: 500,
    suffix: '+',
    label: 'Faculty Members'
  }, {
    value: 100,
    suffix: '+',
    label: 'Academic Programs'
  }, {
    value: 95,
    suffix: '%',
    label: 'Graduate Employment'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--navy-900)',
      position: 'relative',
      marginTop: -1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--gutter)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 'var(--space-6)'
    }
  }, items.map((s, i) => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: s.label,
    style: {
      borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,.12)',
      paddingLeft: i === 0 ? 0 : 24
    }
  }, /*#__PURE__*/React.createElement(StatCounter, {
    value: s.value,
    suffix: s.suffix,
    label: s.label,
    onDark: true
  })))));
}
Object.assign(window, {
  Hero,
  Stats
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/hero-stats.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/programs-admissions.jsx
try { (() => {
/* CampusEdge — Programs (with live search/filter) + Admissions */
const {
  useState
} = React;
function Programs() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const all = window.SITE.programs;
  const tags = ['All', ...Array.from(new Set(all.map(p => p.tag)))];
  const list = all.filter(p => (filter === 'All' || p.tag === filter) && (p.title.toLowerCase().includes(q.toLowerCase()) || p.blurb.toLowerCase().includes(q.toLowerCase())));
  return /*#__PURE__*/React.createElement("section", {
    id: "programs",
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Academic Programs",
    title: "Find the path that fits your ambition",
    intro: "Eight faculties, one hundred-plus programs \u2014 search and explore where your future begins."
  }), /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      position: 'relative',
      minWidth: 280,
      marginBottom: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass",
    style: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search programs\u2026",
    style: {
      width: '100%',
      height: 50,
      padding: '0 16px 0 44px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      outline: 'none'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 'var(--space-6)'
    }
  }, tags.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setFilter(t),
    style: {
      padding: '9px 18px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      border: '1px solid',
      transition: 'all var(--dur-fast) var(--ease-out)',
      borderColor: filter === t ? 'var(--action-primary)' : 'var(--border-default)',
      background: filter === t ? 'var(--action-primary)' : 'transparent',
      color: filter === t ? '#fff' : 'var(--text-body)'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--space-5)'
    }
  }, list.map(p => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: p.title
  }, /*#__PURE__*/React.createElement(ProgramCard, {
    image: p.img,
    title: p.title,
    degree: p.degree,
    duration: p.duration,
    blurb: p.blurb,
    icon: p.icon
  }))), list.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, "No programs match \u201C", q, "\u201D."))));
}
function Admissions() {
  const steps = window.SITE.admissions;
  return /*#__PURE__*/React.createElement("section", {
    id: "admissions",
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement(SectionHead, {
    center: true,
    eyebrow: "Admissions",
    title: "Five steps to your place at CampusEdge",
    intro: "A clear, supportive process \u2014 our admissions team guides you at every stage."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 0,
      marginTop: 'var(--space-6)',
      position: 'relative'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: s.n,
    style: {
      position: 'relative',
      padding: '0 14px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 68,
      height: 68,
      margin: '0 auto 18px',
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--surface-card)',
      border: '2px solid var(--blue-200, var(--blue-100))',
      boxShadow: 'var(--shadow-sm)',
      color: 'var(--action-primary)',
      fontSize: 22,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: s.icon
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -6,
      right: -6,
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: 'var(--gold-500)',
      color: 'var(--navy-900)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700
    }
  }, s.n)), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 34,
      left: '60%',
      width: '80%',
      height: 2,
      background: 'repeating-linear-gradient(90deg, var(--border-default) 0 6px, transparent 6px 12px)',
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, s.desc)))), /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 14,
      marginTop: 'var(--space-7)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paper-plane"
    })
  }, "Apply Now"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-download"
    })
  }, "Download Prospectus"))));
}
Object.assign(window, {
  Programs,
  Admissions
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/programs-admissions.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/research-tour.jsx
try { (() => {
/* CampusEdge — Research & Innovation + Virtual Campus Tour */

function Research() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...SECTION_PAD,
      background: 'var(--navy-900)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.12,
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.6) 1px, transparent 0)',
      backgroundSize: '34px 34px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...WRAP,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    dark: true,
    eyebrow: "Research & Innovation",
    title: "Discovery that changes the world",
    intro: "From AI to climate, our researchers and students turn bold ideas into real impact."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 'var(--space-5)'
    }
  }, window.SITE.research.map(r => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: r.k,
    style: {
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(255,255,255,.05)',
      border: '1px solid rgba(255,255,255,.1)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: r.icon,
    style: {
      fontSize: 24,
      color: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-2xl)',
      color: '#fff',
      marginTop: 16
    }
  }, r.v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--blue-300)',
      marginTop: 2
    }
  }, r.k), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'rgba(255,255,255,.65)',
      lineHeight: 1.55
    }
  }, r.d))))));
}
function VirtualTour() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 var(--gutter) var(--section-y)',
      background: 'var(--navy-900)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      ...WRAP,
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      minHeight: 420,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=80",
    alt: "Virtual campus tour",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(6,15,36,.9), rgba(6,15,36,.4))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 'clamp(2rem, 5vw, 4rem)',
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--gold-300)'
    }
  }, "Virtual Campus Tour"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '14px 0 14px',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
      color: '#fff',
      lineHeight: 1.1
    }
  }, "Explore campus from anywhere"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 28px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      color: 'rgba(255,255,255,.8)',
      lineHeight: 1.6
    }
  }, "Walk through lecture halls, labs and residences in an immersive 360\xB0 experience."), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 66,
      height: 66,
      borderRadius: '50%',
      background: 'var(--gold-500)',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--navy-900)',
      boxShadow: 'var(--shadow-gold)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-play",
    style: {
      fontSize: 20,
      marginLeft: 3
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-md)'
    }
  }, "Start the tour")))));
}
Object.assign(window, {
  Research,
  VirtualTour
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/research-tour.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/shared.jsx
try { (() => {
/* CampusEdge — shared section helpers */

function SectionHead({
  eyebrow,
  title,
  intro,
  center,
  dark,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    style: {
      maxWidth: center ? 720 : 760,
      margin: center ? '0 auto' : 0,
      textAlign: center ? 'center' : 'left',
      marginBottom: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      justifyContent: center ? 'center' : 'flex-start',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: accent ? 'var(--gold-600)' : dark ? 'var(--blue-400)' : 'var(--action-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 2,
      background: 'currentColor',
      opacity: 0.6
    }
  }), eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '16px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
      color: dark ? '#fff' : 'var(--text-strong)'
    }
  }, title), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px auto 0',
      maxWidth: 620,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      lineHeight: 'var(--leading-relaxed)',
      color: dark ? 'rgba(255,255,255,.72)' : 'var(--text-muted)'
    }
  }, intro));
}
const SECTION_PAD = {
  padding: 'var(--section-y) var(--gutter)'
};
const WRAP = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto'
};
Object.assign(window, {
  SectionHead,
  SECTION_PAD,
  WRAP
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/shared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/site-app.jsx
try { (() => {
/* CampusEdge — App composition: theme, scroll reveal, smooth scrolling */
const {
  useState: useStateApp,
  useEffect: useEffectApp
} = React;
function useScrollReveal(deps) {
  useEffectApp(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.ce-revealed)');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('ce-revealed');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    els.forEach((el, i) => {
      el.style.transitionDelay = i % 4 * 70 + 'ms';
      io.observe(el);
    });
    return () => io.disconnect();
  }, deps);
}
function SiteApp() {
  const [theme, setTheme] = useStateApp(() => document.documentElement.getAttribute('data-theme') || 'light');
  useEffectApp(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Re-scan for reveal targets after first paint (covers async program filtering)
  useScrollReveal([]);
  useEffectApp(() => {
    const id = setInterval(() => {
      document.querySelectorAll('[data-reveal]:not(.ce-revealed)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 40) el.classList.add('ce-revealed');
      });
    }, 600);
    return () => clearInterval(id);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Loader, null), /*#__PURE__*/React.createElement(Nav, {
    theme: theme,
    onToggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  }), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Stats, null), /*#__PURE__*/React.createElement(Programs, null), /*#__PURE__*/React.createElement(Admissions, null), /*#__PURE__*/React.createElement(WhyChooseUs, null), /*#__PURE__*/React.createElement(CampusLife, null), /*#__PURE__*/React.createElement(Faculty, null), /*#__PURE__*/React.createElement(Research, null), /*#__PURE__*/React.createElement(VirtualTour, null), /*#__PURE__*/React.createElement(SuccessStories, null), /*#__PURE__*/React.createElement(Events, null), /*#__PURE__*/React.createElement(Testimonials, null), /*#__PURE__*/React.createElement(Faq, null), /*#__PURE__*/React.createElement(News, null), /*#__PURE__*/React.createElement(Contact, null)), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(FloatingCTA, null), /*#__PURE__*/React.createElement(BackToTop, null));
}

// Guard against double-mount (Babel scripts may re-run)
if (!window.__ceRoot) {
  window.__ceRoot = ReactDOM.createRoot(document.getElementById('root'));
}
window.__ceRoot.render(/*#__PURE__*/React.createElement(SiteApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/site-app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/site-chrome.jsx
try { (() => {
/* CampusEdge — site chrome: loader, nav, theme toggle, floating CTA, back-to-top */
const {
  useState,
  useEffect
} = React;
function Loader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--navy-900)',
      transition: 'opacity .6s var(--ease-out), visibility .6s',
      opacity: gone ? 0 : 1,
      visibility: gone ? 'hidden' : 'visible'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mark-campusedge.svg",
    alt: "",
    style: {
      width: 64,
      animation: 'ce-pulse 1.4s var(--ease-in-out) infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 160,
      height: 3,
      borderRadius: 2,
      background: 'rgba(255,255,255,.15)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      background: 'var(--gold-500)',
      animation: 'ce-load 1.1s var(--ease-out) forwards'
    }
  }))));
}
function Nav({
  theme,
  onToggleTheme
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const dark = theme === 'dark';
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all var(--dur-base) var(--ease-out)',
      background: scrolled ? 'var(--glass-light)' : 'transparent',
      backdropFilter: scrolled ? 'blur(var(--blur-lg))' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(var(--blur-lg))' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      height: scrolled ? 70 : 86,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'height var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: scrolled && !dark ? '../../assets/logo-campusedge.svg' : '../../assets/logo-campusedge-light.svg',
    alt: "CampusEdge Institute",
    style: {
      height: 40
    }
  })), /*#__PURE__*/React.createElement("nav", {
    className: "ce-navlinks",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, window.SITE.nav.map(item => /*#__PURE__*/React.createElement("a", {
    key: item,
    href: '#' + item.toLowerCase().replace(/ /g, '-'),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      textDecoration: 'none',
      letterSpacing: '0.01em',
      color: scrolled ? 'var(--text-body)' : 'rgba(255,255,255,.9)',
      transition: 'color var(--dur-fast)'
    }
  }, item))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleTheme,
    "aria-label": "Toggle theme",
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '1px solid',
      borderColor: scrolled ? 'var(--border-default)' : 'rgba(255,255,255,.3)',
      background: 'transparent',
      cursor: 'pointer',
      color: scrolled ? 'var(--text-body)' : '#fff',
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'
  })), /*#__PURE__*/React.createElement("span", {
    className: "ce-apply-desktop"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: scrolled ? 'primary' : 'glass',
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right"
    })
  }, "Apply Now")), /*#__PURE__*/React.createElement("button", {
    className: "ce-hamburger",
    onClick: () => setOpen(!open),
    "aria-label": "Open menu",
    style: {
      display: 'none',
      width: 42,
      height: 42,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid',
      cursor: 'pointer',
      fontSize: 18,
      borderColor: scrolled ? 'var(--border-default)' : 'rgba(255,255,255,.3)',
      background: 'transparent',
      color: scrolled ? 'var(--text-body)' : '#fff'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ce-mobile-drawer",
    style: {
      overflow: 'hidden',
      maxHeight: open ? 600 : 0,
      transition: 'max-height var(--dur-slow) var(--ease-out)',
      background: 'var(--surface-card)',
      borderTop: open ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '16px var(--gutter) 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, window.SITE.nav.map(item => /*#__PURE__*/React.createElement("a", {
    key: item,
    href: '#' + item.toLowerCase().replace(/ /g, '-'),
    onClick: () => setOpen(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--fw-medium)',
      textDecoration: 'none',
      color: 'var(--text-body)',
      padding: '12px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, item)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    full: true,
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right"
    })
  }, "Apply Now")))));
}
function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("a", {
    href: "#admissions",
    style: {
      position: 'fixed',
      right: 24,
      bottom: 88,
      zIndex: 900,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 22px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--gold-500)',
      color: 'var(--navy-900)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-sm)',
      textDecoration: 'none',
      boxShadow: 'var(--shadow-gold)',
      transition: 'transform var(--dur-base) var(--ease-out), opacity var(--dur-base)',
      transform: show ? 'translateY(0)' : 'translateY(30px)',
      opacity: show ? 1 : 0,
      pointerEvents: show ? 'auto' : 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-graduation-cap"
  }), " Apply Now");
}
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }),
    "aria-label": "Back to top",
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 900,
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      color: 'var(--text-strong)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-md)',
      fontSize: 15,
      transition: 'transform var(--dur-base) var(--ease-out), opacity var(--dur-base)',
      transform: show ? 'translateY(0)' : 'translateY(30px)',
      opacity: show ? 1 : 0,
      pointerEvents: show ? 'auto' : 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-up"
  }));
}
Object.assign(window, {
  Loader,
  Nav,
  FloatingCTA,
  BackToTop
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/site-chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/site-data.js
try { (() => {
/* CampusEdge website — demo content. Plain JS, attached to window. */
window.SITE = {
  nav: ['Home', 'Programs', 'Admissions', 'Faculty', 'Campus Life', 'News', 'Contact'],
  programs: [{
    title: 'Engineering',
    degree: 'B.Eng',
    duration: '4 Years',
    icon: 'fa-solid fa-gears',
    tag: 'Engineering',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
    blurb: 'Civil, mechanical and electrical engineering with hands-on labs.'
  }, {
    title: 'Computer Science',
    degree: 'B.Sc',
    duration: '4 Years',
    icon: 'fa-solid fa-microchip',
    tag: 'Technology',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    blurb: 'Algorithms, AI and systems with a placement year in industry.'
  }, {
    title: 'Business Administration',
    degree: 'BBA',
    duration: '3 Years',
    icon: 'fa-solid fa-chart-line',
    tag: 'Business',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    blurb: 'Strategy, finance and entrepreneurship for global markets.'
  }, {
    title: 'Architecture',
    degree: 'B.Arch',
    duration: '5 Years',
    icon: 'fa-solid fa-compass-drafting',
    tag: 'Design',
    img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
    blurb: 'Design studios, sustainability and the built environment.'
  }, {
    title: 'Arts & Humanities',
    degree: 'B.A',
    duration: '3 Years',
    icon: 'fa-solid fa-feather',
    tag: 'Arts',
    img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
    blurb: 'Literature, history and philosophy that shape culture.'
  }, {
    title: 'Health Sciences',
    degree: 'B.Sc',
    duration: '4 Years',
    icon: 'fa-solid fa-heart-pulse',
    tag: 'Health',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    blurb: 'Clinical training, public health and biomedical research.'
  }, {
    title: 'Law',
    degree: 'LL.B',
    duration: '4 Years',
    icon: 'fa-solid fa-scale-balanced',
    tag: 'Law',
    img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    blurb: 'Constitutional, corporate and international legal practice.'
  }, {
    title: 'Social Sciences',
    degree: 'B.A',
    duration: '3 Years',
    icon: 'fa-solid fa-users-between-lines',
    tag: 'Social',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
    blurb: 'Economics, sociology and politics for a changing world.'
  }],
  admissions: [{
    n: '01',
    title: 'Application Submission',
    icon: 'fa-solid fa-file-lines',
    desc: 'Complete the online form and upload transcripts.'
  }, {
    n: '02',
    title: 'Entrance Evaluation',
    icon: 'fa-solid fa-pen-ruler',
    desc: 'Sit the aptitude assessment for your faculty.'
  }, {
    n: '03',
    title: 'Interview',
    icon: 'fa-solid fa-comments',
    desc: 'Meet faculty for a conversation about your goals.'
  }, {
    n: '04',
    title: 'Admission Decision',
    icon: 'fa-solid fa-envelope-circle-check',
    desc: 'Receive your offer within two weeks.'
  }, {
    n: '05',
    title: 'Enrollment',
    icon: 'fa-solid fa-graduation-cap',
    desc: 'Confirm your place and join orientation week.'
  }],
  why: [{
    icon: 'fa-solid fa-award',
    title: 'Accredited Programs',
    desc: 'Internationally recognised degrees across every faculty.'
  }, {
    icon: 'fa-solid fa-handshake-angle',
    title: 'Industry Partnerships',
    desc: '300+ partner organisations for placements and research.',
    accent: true
  }, {
    icon: 'fa-solid fa-building-columns',
    title: 'Modern Campus',
    desc: 'Smart classrooms, maker spaces and a 24/7 library.'
  }, {
    icon: 'fa-solid fa-flask-vial',
    title: 'Research Opportunities',
    desc: 'Undergraduate research from your very first year.'
  }, {
    icon: 'fa-solid fa-hand-holding-dollar',
    title: 'Scholarship Programs',
    desc: 'Merit and need-based awards up to full tuition.'
  }, {
    icon: 'fa-solid fa-briefcase',
    title: 'Career Development',
    desc: 'Dedicated coaching, fairs and a global alumni network.'
  }],
  campus: [{
    title: 'Student Clubs',
    icon: 'fa-solid fa-people-group',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80',
    span: 'wide'
  }, {
    title: 'Sports Facilities',
    icon: 'fa-solid fa-basketball',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80'
  }, {
    title: 'Innovation Labs',
    icon: 'fa-solid fa-lightbulb',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80'
  }, {
    title: 'Central Library',
    icon: 'fa-solid fa-book-open-reader',
    img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80'
  }, {
    title: 'Student Housing',
    icon: 'fa-solid fa-house-chimney',
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80'
  }, {
    title: 'Events & Activities',
    icon: 'fa-solid fa-calendar-star',
    img: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=700&q=80',
    span: 'wide'
  }],
  faculty: [{
    name: 'Dr. Amara Okafor',
    role: 'Professor of Robotics',
    department: 'Engineering',
    qualification: 'Ph.D, MIT',
    research: 'Autonomous Systems & Control',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80'
  }, {
    name: 'Prof. Daniel Reyes',
    role: 'Chair of Computer Science',
    department: 'Technology',
    qualification: 'Ph.D, Stanford',
    research: 'Machine Learning & NLP',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80'
  }, {
    name: 'Dr. Mei Lin',
    role: 'Professor of Public Health',
    department: 'Health Sciences',
    qualification: 'M.D, Ph.D',
    research: 'Epidemiology & Policy',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80'
  }, {
    name: 'Prof. Idris Haddad',
    role: 'Dean of Architecture',
    department: 'Design',
    qualification: 'M.Arch, AA London',
    research: 'Sustainable Urbanism',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&q=80'
  }],
  research: [{
    icon: 'fa-solid fa-microscope',
    k: 'Research Centers',
    v: '24',
    d: 'Dedicated institutes from AI to climate science.'
  }, {
    icon: 'fa-solid fa-file-lines',
    k: 'Publications / yr',
    v: '1,800+',
    d: 'Peer-reviewed work in leading journals.'
  }, {
    icon: 'fa-solid fa-industry',
    k: 'Industry Collabs',
    v: '120',
    d: 'Joint R&D with global enterprises.'
  }, {
    icon: 'fa-solid fa-rocket',
    k: 'Innovation Projects',
    v: '350',
    d: 'Student & faculty ventures funded annually.'
  }],
  stories: [{
    name: 'Sofia Marchetti',
    position: 'Product Lead',
    org: 'Northwind Robotics',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    quote: 'CampusEdge gave me a research foundation and a network that opened every door.'
  }, {
    name: 'Jamal Bright',
    position: 'Founder & CEO',
    org: 'Lumen Health',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    quote: 'I built my first prototype in the innovation lab. Two years later it was a company.'
  }, {
    name: 'Priya Anand',
    position: 'Architect',
    org: 'Studio Meridian',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    quote: 'The design studios pushed me to think bigger than I imagined possible.'
  }],
  events: [{
    date: {
      d: '12',
      m: 'SEP'
    },
    title: 'Autumn Open House',
    type: 'Open House',
    icon: 'fa-solid fa-door-open',
    place: 'Main Quad'
  }, {
    date: {
      d: '28',
      m: 'SEP'
    },
    title: 'Global Career Fair',
    type: 'Career Fair',
    icon: 'fa-solid fa-briefcase',
    place: 'Sports Arena'
  }, {
    date: {
      d: '09',
      m: 'OCT'
    },
    title: 'AI & Society Seminar',
    type: 'Seminar',
    icon: 'fa-solid fa-brain',
    place: 'Auditorium B'
  }, {
    date: {
      d: '21',
      m: 'OCT'
    },
    title: 'Design Thinking Workshop',
    type: 'Workshop',
    icon: 'fa-solid fa-pen-nib',
    place: 'Innovation Lab'
  }],
  testimonials: [{
    who: 'Final-year Student',
    name: 'Leah Thompson',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    text: 'The faculty genuinely invest in you. I never felt like just a number here.'
  }, {
    who: 'Alumna, Class of 2019',
    name: 'Carlos Mendez',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    text: 'My degree opened international doors I never thought possible.'
  }, {
    who: 'Parent',
    name: 'Fatima Al-Rashid',
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
    text: 'Knowing my daughter is supported academically and personally means everything.'
  }],
  news: [{
    cat: 'Research',
    title: 'CampusEdge team unveils breakthrough in solid-state batteries',
    img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=700&q=80',
    date: 'Jun 14, 2026',
    featured: true
  }, {
    cat: 'Achievement',
    title: 'Robotics squad wins the International Autonomy Challenge',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&q=80',
    date: 'Jun 02, 2026'
  }, {
    cat: 'Campus',
    title: 'New net-zero science building opens its doors',
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80',
    date: 'May 27, 2026'
  }, {
    cat: 'Students',
    title: 'Spring hackathon draws 900 builders across 12 countries',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80',
    date: 'May 19, 2026'
  }],
  faqs: [{
    q: 'What are the admission requirements?',
    a: 'A completed secondary diploma, official transcripts, and a personal statement. Some programs also require an entrance evaluation and interview.'
  }, {
    q: 'How much is tuition?',
    a: 'Tuition varies by program, from $9,800–$14,500 per year. Detailed fee schedules are included in the prospectus and reviewed annually.'
  }, {
    q: 'Do you offer scholarships?',
    a: 'Yes — merit, need-based and athletic awards cover up to 100% of tuition. Over 40% of our students receive some form of financial aid.'
  }, {
    q: 'What campus facilities are available?',
    a: 'A 24/7 library, innovation and maker labs, sports arena, health centre, and modern student housing — all within a connected campus.'
  }, {
    q: 'Can international students apply?',
    a: 'Absolutely. Our Global Office supports visa guidance, airport pickup, housing and a dedicated orientation for students from 80+ countries.'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/site-data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/stories-events.jsx
try { (() => {
/* CampusEdge — Success Stories + Upcoming Events + Testimonials */

function SuccessStories() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement(SectionHead, {
    center: true,
    eyebrow: "Student Success",
    title: "Where our graduates go",
    intro: "From startups to global enterprises \u2014 CampusEdge alumni lead across every industry."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'var(--space-5)'
    }
  }, window.SITE.stories.map(s => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: s.name,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-xs)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-quote-left",
    style: {
      fontSize: 26,
      color: 'var(--blue-100)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 22px',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontStyle: 'italic',
      color: 'var(--text-body)',
      lineHeight: 1.55
    }
  }, s.quote), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: s.img,
    alt: s.name,
    style: {
      width: 52,
      height: 52,
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-link)'
    }
  }, s.position, " \xB7 ", s.org))))))));
}
function Events() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "What's On",
    title: "Upcoming events",
    intro: "Meet us in person \u2014 open houses, fairs, seminars and workshops."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right"
    }),
    style: {
      marginBottom: 'var(--space-7)'
    }
  }, "Full calendar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 'var(--space-4)'
    }
  }, window.SITE.events.map(e => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: e.title,
    style: {
      display: 'flex',
      gap: 16,
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xs)',
      transition: 'box-shadow var(--dur-base), transform var(--dur-base)'
    },
    onMouseEnter: ev => {
      ev.currentTarget.style.boxShadow = 'var(--shadow-md)';
      ev.currentTarget.style.transform = 'translateY(-4px)';
    },
    onMouseLeave: ev => {
      ev.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      ev.currentTarget.style.transform = 'translateY(0)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      width: 58,
      textAlign: 'center',
      borderRadius: 'var(--radius-md)',
      padding: '10px 0',
      background: 'var(--navy-900)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--text-xl)',
      lineHeight: 1
    }
  }, e.date.d), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.1em',
      color: 'var(--gold-300)',
      marginTop: 3
    }
  }, e.date.m)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--text-link)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: e.icon,
    style: {
      marginRight: 6
    }
  }), e.type), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '7px 0 8px',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)',
      lineHeight: 1.2
    }
  }, e.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot",
    style: {
      marginRight: 6
    }
  }), e.place)))))));
}
function Testimonials() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement(SectionHead, {
    center: true,
    eyebrow: "In Their Words",
    title: "Trusted by students, alumni & parents"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'var(--space-5)'
    }
  }, window.SITE.testimonials.map(t => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: t.name,
    style: {
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-subtle)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      color: 'var(--gold-500)',
      marginBottom: 14
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: "fa-solid fa-star",
    style: {
      fontSize: 13
    }
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-body)',
      lineHeight: 1.65
    }
  }, "\u201C", t.text, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: t.img,
    alt: t.name,
    style: {
      width: 46,
      height: 46,
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      fontSize: 'var(--text-sm)'
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, t.who))))))));
}
Object.assign(window, {
  SuccessStories,
  Events,
  Testimonials
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/stories-events.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/why-campus-faculty.jsx
try { (() => {
/* CampusEdge — Why Choose Us + Campus Life + Faculty */

function WhyChooseUs() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement(SectionHead, {
    center: true,
    eyebrow: "Why CampusEdge",
    title: "An education built to launch careers",
    intro: "Everything you need to thrive \u2014 accredited teaching, real-world partners, and support at every step."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'var(--space-5)'
    }
  }, window.SITE.why.map(w => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: w.title
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    icon: w.icon,
    title: w.title,
    accent: w.accent
  }, w.desc))))));
}
function CampusLife() {
  const items = window.SITE.campus;
  return /*#__PURE__*/React.createElement("section", {
    id: "campus-life",
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Campus Life",
    title: "A campus that never stops moving",
    intro: "Clubs, sport, labs and lifelong friendships \u2014 life at CampusEdge extends far beyond the lecture hall."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridAutoRows: '210px',
      gap: 'var(--space-4)'
    },
    className: "ce-campus-grid"
  }, items.map(c => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: c.title,
    style: {
      gridColumn: c.span === 'wide' ? 'span 2' : 'span 1',
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)'
    },
    onMouseEnter: e => {
      e.currentTarget.querySelector('img').style.transform = 'scale(1.07)';
    },
    onMouseLeave: e => {
      e.currentTarget.querySelector('img').style.transform = 'scale(1)';
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: c.img,
    alt: c.title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(10,26,63,.85), rgba(10,26,63,0) 55%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 18,
      bottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-sm)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--glass-light)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      border: '1px solid var(--glass-light-border)',
      color: 'var(--navy-900)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: c.icon
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--fw-semibold)',
      color: '#fff'
    }
  }, c.title)))))));
}
function Faculty() {
  return /*#__PURE__*/React.createElement("section", {
    id: "faculty",
    style: {
      ...SECTION_PAD,
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: WRAP
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Faculty",
    title: "Learn from people who lead their fields",
    intro: "Researchers, practitioners and mentors devoted to your success."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right"
    }),
    style: {
      marginBottom: 'var(--space-7)'
    }
  }, "View all faculty")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: 'var(--space-5)'
    }
  }, window.SITE.faculty.map(f => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: f.name
  }, /*#__PURE__*/React.createElement(FacultyCard, {
    photo: f.photo,
    name: f.name,
    role: f.role,
    department: f.department,
    qualification: f.qualification,
    research: f.research
  }))))));
}
Object.assign(window, {
  WhyChooseUs,
  CampusLife,
  Faculty
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/why-campus-faculty.jsx", error: String((e && e.message) || e) }); }

__ds_ns.FacultyCard = __ds_scope.FacultyCard;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.ProgramCard = __ds_scope.ProgramCard;

__ds_ns.StatCounter = __ds_scope.StatCounter;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Input = __ds_scope.Input;

})();
