/* Awards & certificates. Fill these in later and the section updates itself.
   - Put images in public/awards/ (WebP or JPG, ~1200px wide is plenty).
   - Leave `photo` as "" (or a certificate's `image` as "") to keep showing the empty slot.
   - Add or remove certificate objects freely; empty slots fill the grid up to 3. */

export const award = {
  title: "Winner, Algorithm Project Showcase",
  event: "TechFest · Independent University, Bangladesh",
  photo: "/awards/techfest-win.webp",
  alt: "Taif and his team holding the champion cheque at TechFest Autumn 2023",
};

export const certificates = [
  { name: "Prompt Engineering 101", issuer: "KodeKloud", year: "2026", image: "/awards/cert-prompt-engineering.webp", url: "https://learn.kodekloud.com/certificate/7afde8f6-7530-48c2-8a1d-73958b59f8a4" },
  { name: "ChatGPT Solutions Practitioner", issuer: "OpenAI", group: "OpenAI", year: "2026", image: "/awards/cert-chatgpt-solutions.webp", url: "https://oaipartnernetwork.credential.net/d4fbec2d-5bcb-4b94-b294-e16516f5f178" },
  { name: "ChatGPT Deployment Practitioner", issuer: "OpenAI", group: "OpenAI", year: "2026", image: "/awards/cert-chatgpt-deployment.webp", url: "https://oaipartnernetwork.credential.net/0e9e5271-08e9-411d-b7fc-a21bd4d40f32" },
  { name: "OpenAI Technical Practitioner", issuer: "OpenAI", group: "OpenAI", year: "2026", image: "/awards/cert-openai-technical.webp", url: "https://oaipartnernetwork.credential.net/12ee27d6-fb83-45fd-ad64-98a69f32ecba" },
  { name: "OpenAI Foundational Knowledge", issuer: "OpenAI", group: "OpenAI", year: "2026", image: "/awards/cert-openai-foundational.webp", url: "https://oaipartnernetwork.credential.net/2780181a-b715-4f75-a8eb-c94a6d716604" },
  { name: "OpenAI Consultative Solutions Practitioner", issuer: "OpenAI", group: "OpenAI", year: "2026", image: "/awards/cert-openai-consultative.webp", url: "https://oaipartnernetwork.credential.net/a1830f7e-0d2c-4294-9270-ac1816d823af" },
  { name: "CCNA: Introduction to Networks", issuer: "Cisco", year: "2026", image: "/awards/cert-cisco-ccna.webp", url: "https://www.credly.com/badges/8d0e66ec-03ed-4cd5-a8f6-49d855e36026/linked_in_profile" },
  { name: "Foundations of User Experience (UX) Design", issuer: "Coursera", year: "2024", image: "/awards/cert-coursera-ux.webp", url: "https://www.coursera.org/account/accomplishments/verify/PKD2K67972DZ" },
];
