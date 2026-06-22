/* =========================================================================
   PROJECT DATA
   -------------------------------------------------------------------------
   Single source of truth for the Work section. Edit objects below.

   Each project:
     id        unique slug (used as a DOM anchor)
     index     "01".."NN"  — the gallery plate number
     title     display name
     category  short label (also feeds the filter bar)
     year      string
     role      what you did ("Front-end UI", "Design + Build", ...)
     summary   1–2 sentence description (write from the visitor's side)
     stack     array of tech tags
     url       LIVE url. Powers the iframe preview AND the "Open live" link.
               Set to "" to show a styled placeholder.
     repo      optional source link ("" to hide)
     featured  true = large case plate near the top; false = standard plate
   ========================================================================= */

export const projects = [
  /* ---- Flagship engineering work (featured) --------------------------- */
  {
    id: "proctorless",
    index: "01",
    title: "ProctorLess",
    category: "Assessment Platform",
    year: "2025",
    role: "Full-stack · Front-end UI",
    summary:
      "A privacy-first online exam platform that keeps assessments secure without surveillance — role-based dashboards for students, professors, and admins, with seating-aware question distribution and AI-assisted grading.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    url: "https://proctorless-app.netlify.app/",
    repo: "https://github.com/Taif6612/proctorless-app",
    featured: true,
  },
  {
    id: "proctorless-extension",
    index: "02",
    title: "ProctorLess — Integrity Extension",
    category: "Browser Extension",
    year: "2025",
    role: "Front-end UI · Session integrity",
    summary:
      "The companion Chrome extension for ProctorLess: it watches for session-integrity signals during an exam and streams events back to the platform — real-time monitoring without invasive proctoring.",
    stack: ["Chrome Extension", "TypeScript", "Manifest V3"],
    url: "",
    // Chrome extensions can't be embedded live — show the product logo instead.
    logo: "/projects/proctorless.png",
    logoTone: "light",
    repo: "https://github.com/Taif6612/proctorless-app",
    featured: true,
  },
  {
    id: "senior-mode",
    index: "03",
    title: "Senior Mode",
    category: "Accessibility",
    year: "2025",
    role: "Front-end UI · Chrome extension",
    summary:
      "A Chrome extension that makes everyday websites usable for elderly and visually-impaired people — high-contrast mode, text scaling, and link highlighting, applied by overriding each site's styles on the fly.",
    stack: ["TypeScript", "React", "WXT", "Vite"],
    url: "",
    // Chrome extension — show the icon on a dark card (its own high-contrast motif).
    logo: "/projects/senior-mode.png",
    logoTone: "dark",
    repo: "https://github.com/Taif6612/senior-mode-extension",
    featured: true,
  },

  /* ---- Front-end showcase sites (live on GitHub Pages) ---------------- */
  {
    id: "autohub-marketplace",
    index: "04",
    title: "AutoHub Car Marketplace",
    category: "E-commerce",
    year: "2025",
    role: "Front-end UI",
    summary:
      "A browse-and-list marketplace for buying and selling cars — filterable listings, rich detail pages, and a clean buyer journey.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/autohub-car-marketplace/",
    repo: "https://github.com/Taif6612/autohub-car-marketplace",
    featured: false,
  },
  {
    id: "autohub-premium",
    index: "05",
    title: "AutoHub Premium Showcase",
    category: "Automotive",
    year: "2025",
    role: "Front-end UI",
    summary:
      "A premium automotive showcase — a cinematic hero, spec highlights, and a gallery that lets the cars carry the page.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/autohub-premium-showcase/",
    repo: "https://github.com/Taif6612/autohub-premium-showcase",
    featured: false,
  },
  {
    id: "property-rental",
    index: "06",
    title: "Property Rental Portfolio",
    category: "Real Estate",
    year: "2025",
    role: "Front-end UI",
    summary:
      "A rental-property portfolio with searchable listings, photo galleries, and enquiry-ready detail pages.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/PropertyRentalPortfolio/",
    repo: "https://github.com/Taif6612/PropertyRentalPortfolio",
    featured: false,
  },
  {
    id: "nestspace",
    index: "07",
    title: "NestSpace",
    category: "Web App",
    year: "2025",
    role: "Front-end · React",
    summary:
      "A React app for discovering and booking living spaces — interactive search, saved listings, and a componentised UI.",
    stack: ["React", "Vite"],
    url: "https://taif6612.github.io/nestspace/",
    repo: "https://github.com/Taif6612/nestspace",
    featured: false,
  },
  {
    id: "solar-panel",
    index: "08",
    title: "Solar Panel",
    category: "Landing Page",
    year: "2025",
    role: "Front-end UI",
    summary:
      "A clean-energy landing page for residential solar — benefits, savings framing, and a clear path to a quote.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/solar-panel/",
    repo: "https://github.com/Taif6612/solar-panel",
    featured: false,
  },
  {
    id: "campusedge-design-system",
    index: "09",
    title: "CampusEdge Design System",
    category: "Design System",
    year: "2025",
    role: "Design system · UI",
    summary:
      "A documented component library — tokens, type scale, buttons, and reusable UI patterns for a campus product.",
    stack: ["Design System", "CSS"],
    url: "https://taif6612.github.io/campusedge-design-system/",
    repo: "https://github.com/Taif6612/campusedge-design-system",
    featured: false,
  },
  {
    id: "interior-design",
    index: "10",
    title: "Interior Design Studio",
    category: "Studio",
    year: "2025",
    role: "Front-end UI",
    summary:
      "An interior-design studio site — a calm, editorial gallery of room transformations with a clear enquiry flow.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/interior-design/",
    repo: "https://github.com/Taif6612/interior-design",
    featured: false,
  },
  {
    id: "urban-bistro",
    index: "11",
    title: "Urban Bistro",
    category: "Restaurant",
    year: "2025",
    role: "Front-end UI",
    summary:
      "A neighbourhood café site — menu, story, and reservations in a single warm, photography-led page.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/urban-bistro-cafe/",
    repo: "https://github.com/Taif6612/urban-bistro-cafe",
    featured: false,
  },
  {
    id: "luxeglow-spa",
    index: "12",
    title: "LuxeGlow Salon & Spa",
    category: "Beauty & Spa",
    year: "2025",
    role: "Front-end UI",
    summary:
      "A beauty-spa site — services, pricing, and booking wrapped in a soft, luxurious visual language.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/luxeglow-beauty-spa/",
    repo: "https://github.com/Taif6612/luxeglow-beauty-spa",
    featured: false,
  },
  {
    id: "eduprime-academy",
    index: "13",
    title: "EduPrime Academy",
    category: "Education",
    year: "2025",
    role: "Front-end UI",
    summary:
      "A coaching-centre site — courses, faculty, and admissions, structured to convert enquiring students and parents.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://taif6612.github.io/eduprime-coaching-center/",
    repo: "https://github.com/Taif6612/eduprime-coaching-center",
    featured: false,
  },
];

/* Screenshot posters (public/projects/shots/<id>.jpg) shown by default on each
   live plate; the interactive iframe fades in on hover. Add an id here when a
   new live site gets a captured screenshot. */
const SHOTS = new Set([
  "proctorless",
  "autohub-marketplace",
  "autohub-premium",
  "property-rental",
  "nestspace",
  "solar-panel",
  "campusedge-design-system",
  "interior-design",
  "urban-bistro",
  "luxeglow-spa",
  "eduprime-academy",
]);
projects.forEach((p) => {
  if (p.url && SHOTS.has(p.id)) p.poster = `/projects/shots/${p.id}.jpg`;
});

/* Distinct category list, in first-seen order — drives the filter bar. */
export const categories = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.category))),
];

export const profile = {
  name: "Taif Ur Rahman",
  role: "Front-End Engineer",
  // The one-line thesis for the hero. Edit freely.
  thesis: ["Interfaces that", "watch, adapt,", "and include."],
  // Subtitle under the hero headline — keep it plain and readable.
  tagline:
    "Front-end engineer. I design and build interfaces with a bias toward clarity and access — from exam-integrity tools to accessibility layers that open the web to everyone.",
  location: "Available worldwide · Remote",
  status: "Open to work",
  email: "taifurrahman66123@gmail.com",
  phone: "+880 1703 306577",
  socials: [
    { label: "GitHub", url: "https://github.com/Taif6612" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/taif-ur-r-1352451b7/" },
    { label: "Email", url: "mailto:taifurrahman66123@gmail.com" },
  ],
  about:
    "I'm a final-year Computer Science student building front-end interfaces with a bias toward clarity and access. My work runs from ProctorLess — a privacy-first exam platform that protects integrity without surveillance — to Senior Mode, an extension that re-renders the web for the people it usually leaves behind. I care about the moment an interface goes from confusing to obvious.",
  publications: [
    {
      title:
        "Drought-Sensitive Machine Learning for Robust Water-Level Forecasting in the Chitra and Nabaganga River Basins",
      venue: "IEEE ICSADL 2026",
      url: "https://ieeexplore.ieee.org/document/11452092",
    },
    {
      title:
        "Machine Learning Modeling for Predicting Water Level in the Nabaganga River",
      venue: "IEEE ICOIICS 2025",
      url: "https://ieeexplore.ieee.org/document/11390660",
    },
  ],
};
