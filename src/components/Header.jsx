import { useEffect, useState } from "react";
import { scrollToTarget } from "../lib/useSmoothScroll.js";

export default function Header({ profile, ready }) {
  const [hidden, setHidden] = useState(false);

  // Hide on scroll-down, reveal on scroll-up — quietly, no jitter.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (sel) => (e) => {
    e.preventDefault();
    scrollToTarget(sel);
  };

  return (
    <header className={`site-head ${ready ? "is-ready" : ""} ${hidden ? "is-hidden" : ""}`}>
      <div className="shell">
        <div className="site-head-bar">
          <a href="#top" onClick={go("#top")} className="site-mark mono">
            {profile.name}
            <span className="site-mark-sub">— Front-End</span>
          </a>

          <nav className="site-nav mono" aria-label="Primary">
            <a href="#work" onClick={go("#work")} className="site-nav-link">
              Work
            </a>
            <a href="#about" onClick={go("#about")} className="site-nav-link">
              About
            </a>
            <a href="#booking" onClick={go("#booking")} className="site-nav-link">
              Booking
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
