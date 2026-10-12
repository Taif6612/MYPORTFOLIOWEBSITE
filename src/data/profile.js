/* =========================================================================
   PROFILE — name, contact, socials, about, publications.
   -------------------------------------------------------------------------
   Kept separate from the project catalogue (projects.js) so the guides'
   header/footer can import it without shipping every project to the blog.
   ========================================================================= */

export const profile = {
  name: "Taif Ur Rahman",
  role: "Front-End Engineer",
  // The one-line thesis for the hero. Edit freely.
  thesis: ["Interfaces that", "watch, adapt,", "and include."],
  // Subtitle under the hero headline — keep it plain and readable.
  tagline:
    "Front-end engineer. I design and build interfaces with a bias toward clarity and access, from exam-integrity tools to accessibility layers that open the web to everyone.",
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
    "I'm a final-year Computer Science student building front-end interfaces with a bias toward clarity and access. My work runs from ProctorLess, a privacy-first exam platform that protects integrity without surveillance, to Senior Mode, an extension that re-renders the web for the people it usually leaves behind. Across both, I focus on the small details that make software feel effortless to use.",
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
