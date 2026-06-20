/* =========================================================================
   PROJECT DATA
   -------------------------------------------------------------------------
   This is the single source of truth for everything in the Work section.
   When your real sites are ready, just edit the objects below.

   Each project:
     id        unique slug (used as a DOM anchor)
     index     "01".."NN"  — the gallery plate number
     title     display name
     category  short label (Monitoring, Accessibility, E-commerce, ...)
     year      string
     role      what you did ("Front-end UI", "Design + Build", ...)
     summary   1–2 sentence description (write from the visitor's side)
     stack     array of tech tags
     url       LIVE url (GitHub Pages / Vercel). Used for the iframe preview
               AND the "Open live" link. Set to "" to show a placeholder.
     repo      optional source link ("" to hide)
     featured  true = large case plate near the top; false = standard plate
     accent    optional — leave undefined to use the global signal colour
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
    url: "", // add a live deployment (e.g. Vercel) here if you have one
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
    repo: "https://github.com/Taif6612/senior-mode-extension",
    featured: true,
  },

  /* ---- Front-end showcase sites (10 on standby) ----------------------- */
  /* Replace title/category/url for each as your real sites come in.       */
  {
    id: "work-04",
    index: "04",
    title: "Project Four",
    category: "Landing Page",
    year: "2025",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["HTML", "CSS", "JS"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-05",
    index: "05",
    title: "Project Five",
    category: "E-commerce",
    year: "2025",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["React", "Tailwind"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-06",
    index: "06",
    title: "Project Six",
    category: "Dashboard",
    year: "2024",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["React", "Charts"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-07",
    index: "07",
    title: "Project Seven",
    category: "Portfolio",
    year: "2024",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["HTML", "CSS", "GSAP"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-08",
    index: "08",
    title: "Project Eight",
    category: "SaaS",
    year: "2024",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["Next.js", "Tailwind"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-09",
    index: "09",
    title: "Project Nine",
    category: "Blog",
    year: "2024",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["Astro", "MDX"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-10",
    index: "10",
    title: "Project Ten",
    category: "Marketing",
    year: "2024",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["HTML", "CSS", "JS"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-11",
    index: "11",
    title: "Project Eleven",
    category: "Web App",
    year: "2023",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["Vue", "Pinia"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-12",
    index: "12",
    title: "Project Twelve",
    category: "Landing Page",
    year: "2023",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["HTML", "Tailwind"],
    url: "",
    repo: "",
    featured: false,
  },
  {
    id: "work-13",
    index: "13",
    title: "Project Thirteen",
    category: "Experimental",
    year: "2023",
    role: "Front-end UI",
    summary: "Short description of what this site is and what you built.",
    stack: ["WebGL", "Three.js"],
    url: "",
    repo: "",
    featured: false,
  },
];

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
  location: "Dhaka, Bangladesh · Open to remote",
  status: "Open to work",
  email: "taifurrahman66123@gmail.com",
  phone: "+880 1703 306577",
  socials: [
    { label: "GitHub", url: "https://github.com/Taif6612" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/taif-ur-r-1352451b7/" },
    { label: "Email", url: "mailto:taifurrahman66123@gmail.com" },
  ],
  about:
    "I'm a final-year Computer Science student at Independent University, Bangladesh, building front-end interfaces with a bias toward clarity and access. My work runs from ProctorLess — a privacy-first exam platform that protects integrity without surveillance — to Senior Mode, an extension that re-renders the web for the people it usually leaves behind. I care about the moment an interface goes from confusing to obvious.",
  publications: [
    {
      title:
        "Drought-Sensitive Machine Learning for Robust Water-Level Forecasting in the Chitra and Nabaganga River Basins",
      venue: "IEEE ICSADL 2026",
    },
    {
      title:
        "Machine Learning Modeling for Predicting Water Level in the Nabaganga River, Bangladesh",
      venue: "IEEE ICOIICS 2025",
    },
  ],
};
