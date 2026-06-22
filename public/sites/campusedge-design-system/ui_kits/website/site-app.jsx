/* CampusEdge — App composition: theme, scroll reveal, smooth scrolling */
const { useState: useStateApp, useEffect: useEffectApp } = React;

function useScrollReveal(deps) {
  useEffectApp(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.ce-revealed)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('ce-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el, i) => {
      el.style.transitionDelay = ((i % 4) * 70) + 'ms';
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
      document.querySelectorAll('[data-reveal]:not(.ce-revealed)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 40) el.classList.add('ce-revealed');
      });
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <React.Fragment>
      <Loader />
      <Nav theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
      <main>
        <Hero />
        <Stats />
        <Programs />
        <Admissions />
        <WhyChooseUs />
        <CampusLife />
        <Faculty />
        <Research />
        <VirtualTour />
        <SuccessStories />
        <Events />
        <Testimonials />
        <Faq />
        <News />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
      <BackToTop />
    </React.Fragment>
  );
}

// Guard against double-mount (Babel scripts may re-run)
if (!window.__ceRoot) {
  window.__ceRoot = ReactDOM.createRoot(document.getElementById('root'));
}
window.__ceRoot.render(<SiteApp />);
