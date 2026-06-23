import { useEffect, useRef, useState } from "react";

const DESIGN_W = 1440; // we render the live site at desktop width, then scale down
const HOVER_INTENT_MS = 160; // ignore quick fly-overs before mounting a live preview
const PREVIEW_HOLD_MS = 4000; // play the site's startup animation, then drop back to the static shot

export default function ProjectPlate({ project, isTouch }) {
  const { id, index, title, category, year, role, summary, stack, url, repo, poster, logo, logoTone, featured } =
    project;

  const frameRef = useRef(null);
  const hoverTimer = useRef(0); // hover-intent delay before mounting the iframe
  const revertTimer = useRef(0); // post-load delay before dropping back to the poster
  // Measure the actual screen box so the scaled site fills it exactly.
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [load, setLoad] = useState(false); // live iframe mounted (after hover)
  const [shown, setShown] = useState(false); // iframe finished loading → fade in
  const hasLive = Boolean(url);
  const hasPoster = hasLive && Boolean(poster);
  const hasLogo = !hasLive && Boolean(logo); // logo card stands in for non-embeddable work
  const frameHref = url || repo; // no live preview → let the frame open the source
  const cornerLabel = hasLive ? "Open live ↗" : repo ? "View source ↗" : null;
  // Label for the faux browser bar. Never derived from window.location (which
  // would read "localhost" in dev) — embedded sites show the custom domain,
  // external ones show their real host.
  const liveHost = (() => {
    if (!url) return "";
    if (url.startsWith("/")) return "taif.codes";
    try {
      return new URL(url).host;
    } catch {
      return "taif.codes";
    }
  })();
  // Embedded sites use a clean directory url (/sites/<id>/) for the shareable
  // link; the iframe needs the explicit index.html so it loads in dev too.
  const iframeSrc =
    url && url.startsWith("/sites/") && url.endsWith("/") ? `${url}index.html` : url;

  // Track the screen box size to keep the desktop render filling it (no gaps/clipping).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The live preview is non-interactive eye-candy. On hover (desktop only) it
  // mounts, plays the embedded site's startup animation, then drops back to the
  // static screenshot — and it unmounts the moment the pointer leaves. So at
  // most one iframe runs at a time, briefly, instead of every hovered plate
  // keeping a live document alive forever (which is what made the page laggy).
  // Touch users get the poster and tap the frame to open the real site.
  const clearTimers = () => {
    clearTimeout(hoverTimer.current);
    clearTimeout(revertTimer.current);
    hoverTimer.current = 0;
    revertTimer.current = 0;
  };
  const wake = () => {
    if (!hasLive || isTouch) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setLoad(true), HOVER_INTENT_MS);
  };
  const rest = () => {
    clearTimers();
    setShown(false);
    setLoad(false); // unmount the iframe → instantly reveals the poster underneath
  };
  // Once the iframe has loaded and its intro has had a moment to play, fall back
  // to the static poster so nothing keeps animating under the cursor.
  const onPreviewLoad = () => {
    setShown(true);
    clearTimeout(revertTimer.current);
    revertTimer.current = setTimeout(rest, PREVIEW_HOLD_MS);
  };

  // Drop any pending timers if the plate unmounts.
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(revertTimer.current);
    };
  }, []);

  // Render the site at desktop width, then scale so it fills the box on both axes.
  const scale = box.w ? box.w / DESIGN_W : 0.4;
  const frameH = box.w ? (box.h * DESIGN_W) / box.w : DESIGN_W * 0.625;

  return (
    <article className={`plate reveal ${featured ? "plate--featured" : ""}`} id={id}>
      <a
        className="plate-frame is-interactive"
        href={frameHref || undefined}
        target={frameHref ? "_blank" : undefined}
        rel="noreferrer"
        onPointerEnter={wake}
        onPointerLeave={rest}
        onFocus={wake}
        onBlur={rest}
        aria-label={
          hasLive
            ? `Open ${title} live in a new tab`
            : hasLogo
            ? `View ${title} source on GitHub`
            : `${title} preview coming soon`
        }
      >
        <div className="plate-frame-bar" aria-hidden="true">
          <span /> <span /> <span />
          <em className="mono">
            {hasLive ? liveHost : hasLogo ? "chrome web extension" : "preview.pending"}
          </em>
        </div>

        <div className="plate-screen" ref={frameRef}>
          {hasLive ? (
            <>
              {hasPoster && (
                <img
                  className="plate-poster"
                  src={poster}
                  alt={`${title} screenshot`}
                  loading="lazy"
                  draggable="false"
                />
              )}
              {load && (
                <iframe
                  className={`plate-live ${shown ? "is-shown" : ""}`}
                  title={`${title} live preview`}
                  src={iframeSrc}
                  loading="lazy"
                  tabIndex={-1}
                  scrolling="no"
                  onLoad={onPreviewLoad}
                  style={{
                    width: `${DESIGN_W}px`,
                    height: `${frameH}px`,
                    transform: `scale(${scale})`,
                  }}
                />
              )}
              {load && !shown && (
                <span className="plate-loading" aria-hidden="true">
                  <span className="plate-loading-ring" />
                </span>
              )}
              {hasPoster && (
                <span className="plate-live-hint mono" aria-hidden="true">
                  ▶ Live preview
                </span>
              )}
              {!hasPoster && !load && (
                <div className="plate-placeholder">
                  <span className="plate-placeholder-index display">{index}</span>
                  <span className="plate-placeholder-tag mono">hover to preview</span>
                </div>
              )}
            </>
          ) : hasLogo ? (
            <div className={`plate-logocard plate-logocard--${logoTone || "light"}`}>
              <img src={logo} alt={`${title} logo`} loading="lazy" />
              <span className="plate-logocard-tag mono">{category} · view source ↗</span>
            </div>
          ) : (
            <div className="plate-placeholder" style={{ "--scan": featured ? 1 : 0 }}>
              <span className="plate-placeholder-index display">{index}</span>
              <span className="plate-placeholder-tag mono">live URL coming soon</span>
            </div>
          )}
        </div>

        {cornerLabel && <span className="plate-open mono">{cornerLabel}</span>}
      </a>

      <div className="plate-meta">
        <div className="plate-meta-top mono">
          <span className="plate-index">{index}</span>
          <span className="plate-cat">{category}</span>
          <span className="plate-year">{year}</span>
        </div>

        <h3 className="display plate-name">{title}</h3>
        <p className="plate-role mono">{role}</p>
        <p className="plate-summary">{summary}</p>

        <ul className="plate-stack mono" aria-label="Tech">
          {stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <div className="plate-links mono">
          {hasLive ? (
            <a className="link" href={url} target="_blank" rel="noreferrer">
              Open live ↗
            </a>
          ) : (
            <span className="plate-links-muted">Coming soon</span>
          )}
          {repo ? (
            <a className="link" href={repo} target="_blank" rel="noreferrer">
              Source ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
