import { useEffect, useState } from "react";
import { projects, profile } from "./data/projects.js";
import { useReducedMotion, useIsTouch } from "./lib/usePrefs.js";
import { useSmoothScroll } from "./lib/useSmoothScroll.js";
import { useReveals } from "./lib/useReveals.js";

import Preloader from "./components/Preloader.jsx";
import Cursor from "./components/Cursor.jsx";
import SignalRail from "./components/SignalRail.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import WorkIndex from "./components/WorkIndex.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const [ready, setReady] = useState(false); // preloader finished

  useSmoothScroll(!reduced);
  useReveals(reduced, ready);

  // Lock scroll while the preloader runs.
  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", !ready);
  }, [ready]);

  return (
    <>
      <Preloader profile={profile} reduced={reduced} onDone={() => setReady(true)} />
      {!isTouch && !reduced && <Cursor />}

      <SignalRail projects={projects} />

      <Header profile={profile} ready={ready} />

      <main id="top">
        <Hero profile={profile} ready={ready} reduced={reduced} />
        <WorkIndex projects={projects} reduced={reduced} isTouch={isTouch} />
        <About profile={profile} />
      </main>

      <Footer profile={profile} />
    </>
  );
}
