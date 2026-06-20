import { useMemo, useState } from "react";
import { categories as allCategories } from "../data/projects.js";
import ProjectPlate from "./ProjectPlate.jsx";

export default function WorkIndex({ projects, isTouch }) {
  const [filter, setFilter] = useState("All");

  const shown = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects]
  );

  return (
    <section className="section work" id="work" aria-label="Selected work">
      <div className="shell">
        <div className="work-head" data-lines>
          <p className="eyebrow">
            <span className="work-head-count">{projects.length}</span> projects · live previews
          </p>
          <h2 className="display work-title line-mask">
            <span>Selected work</span>
          </h2>
          <p className="work-intro reveal">
            Each plate is the real site, running. Hover to wake it, click to open it
            full-screen. Built front-to-back across categories — monitoring tools,
            accessibility layers, and everyday web work.
          </p>
        </div>

        <div className="work-filter mono" role="tablist" aria-label="Filter by category">
          {allCategories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={filter === c}
              className={`work-filter-btn ${filter === c ? "is-active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="shell work-grid">
        {shown.map((p, i) => (
          <ProjectPlate key={p.id} project={p} order={i} isTouch={isTouch} />
        ))}
      </div>
    </section>
  );
}
