import { Link } from "react-router-dom";
import { guidePath, tagPath } from "../cms/paths";
import type { Guide } from "../cms/types";
import { formatDate, machineDate } from "./format";

export default function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="guide-card">
      {guide.cover ? (
        <Link to={guidePath(guide.slug)} className="guide-card-cover" tabIndex={-1} aria-hidden="true">
          <img src={guide.cover} alt={guide.coverAlt || ""} loading="lazy" />
        </Link>
      ) : null}

      <div className="guide-card-body">
        <div className="guide-card-meta mono">
          <time dateTime={machineDate(guide.date)}>{formatDate(guide.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{guide.readingTime}</span>
        </div>

        <h2 className="guide-card-title">
          <Link to={guidePath(guide.slug)}>{guide.title}</Link>
        </h2>

        <p className="guide-card-desc">{guide.excerpt}</p>

        {guide.tags.length ? (
          <ul className="guide-card-tags mono" aria-label="Tags">
            {guide.tags.map((t) => (
              <li key={t}>
                <Link to={tagPath(t)}>#{t}</Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
