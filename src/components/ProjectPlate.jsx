import { useEffect, useRef, useState } from "react";

const DESIGN_W = 1440; // we render the live site at desktop width, then scale down

export default function ProjectPlate({ project, isTouch }) {
  const { id, index, title, category, year, role, summary, stack, url, repo, featured } =
    project;

  const frameRef = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [load, setLoad] = useState(false);
  const hasLive = Boolean(url);

  // Keep the scaled desktop screenshot sharp at any frame width.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(w / DESIGN_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Touch devices have no hover, so wake the preview when it nears the viewport.
  useEffect(() => {
    if (!isTouch || !hasLive) return;
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isTouch, hasLive]);

  const wake = () => hasLive && setLoad(true);

  const screenH = DESIGN_W * 0.625; // 16:10 design canvas

  return (
    <article className={`plate reveal ${featured ? "plate--featured" : ""}`} id={id}>
      <a
        className="plate-frame is-interactive"
        href={hasLive ? url : undefined}
        target={hasLive ? "_blank" : undefined}
        rel="noreferrer"
        onPointerEnter={wake}
        aria-label={hasLive ? `Open ${title} live in a new tab` : `${title} — preview coming soon`}
      >
        <div className="plate-frame-bar" aria-hidden="true">
          <span /> <span /> <span />
          <em className="mono">{hasLive ? new URL(url).host : "preview.pending"}</em>
        </div>

        <div className="plate-screen" ref={frameRef}>
          {load && hasLive ? (
            <iframe
              title={`${title} preview`}
              src={url}
              loading="lazy"
              tabIndex={-1}
              scrolling="no"
              style={{
                width: `${DESIGN_W}px`,
                height: `${screenH}px`,
                transform: `scale(${scale})`,
              }}
            />
          ) : (
            <div className="plate-placeholder" style={{ "--scan": featured ? 1 : 0 }}>
              <span className="plate-placeholder-index display">{index}</span>
              <span className="plate-placeholder-tag mono">
                {hasLive ? "hover to wake preview" : "live URL coming soon"}
              </span>
            </div>
          )}
        </div>

        {hasLive && <span className="plate-open mono">Open live ↗</span>}
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
