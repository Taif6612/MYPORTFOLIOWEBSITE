# 🏠 NestSpace — Premium Student Housing & Rental Platform

> Find your perfect home near your university. A modern, fully responsive property-rental landing page built as a **single, dependency-free HTML file**.

NestSpace is a frontend demo for a student-first rental marketplace — the kind of product that could sit comfortably next to **Airbnb, Zillow, and Bproperty**. It showcases verified listings, a roommate finder, advanced filtering, and a premium 2026 UI with glassmorphism, dark mode, and smooth scroll animations.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![No Build](https://img.shields.io/badge/build-none-success)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

| Area | Highlights |
|------|-----------|
| **Navigation** | Sticky glass navbar, scroll-spy active links, mobile slide-in drawer |
| **Hero** | Crossfading image slideshow with one-directional Ken Burns pan, staggered entrance animations, live search bar |
| **Listings** | 12 data-driven property cards — price, location, type, beds/baths/area, rating, favorite toggle, "Load More" |
| **Advanced Filters** | City, area, university, budget slider, type, bedrooms, furnishing, gender preference |
| **Discovery** | Popular Locations (8 areas), Universities (8 campuses), Roommate Finder (6 profiles) |
| **Trust** | Why Choose Us, How It Works, Testimonials, expandable FAQ |
| **Engagement** | Contact form with success state, newsletter subscribe, toast notifications |
| **Extras** | 🌗 Dark/Light mode (persisted), animated counters, scroll-reveal, back-to-top, branded loading screen, smooth scrolling |

All content is driven by **sample data arrays** at the top of the script, so listings, locations, universities, roommates, and FAQs are trivial to edit or extend.

---

## 🛠 Tech Stack

- **HTML5** — semantic, SEO-friendly structure (Open Graph + meta tags)
- **CSS3** — custom properties / theming, glassmorphism, `IntersectionObserver`-driven reveals, fully responsive grid
- **Vanilla JavaScript** — no framework, no build step
- **CDN only** — [Font Awesome 6](https://fontawesome.com/) icons + [Google Fonts](https://fonts.google.com/) (Plus Jakarta Sans / Inter)
- **Imagery** — [Unsplash](https://unsplash.com/) (property/interior photos) & [randomuser.me](https://randomuser.me/) (avatars)

---

## 🚀 Getting Started

No installation, no dependencies, no build tools.

```bash
# 1. Clone the repo
git clone https://github.com/Taif6612/PropertyRentalPortfolio.git
cd PropertyRentalPortfolio

# 2. Open it
#    - Double-click index.html, OR
#    - Serve locally for the best experience:
npx serve .
#    then visit http://localhost:3000
```

> 💡 A local server (or VS Code's *Live Server*) is recommended so fonts, icons, and remote images load over HTTP.

---

## 📁 Project Structure

```
PropertyRentalPortfolio/
├── index.html        # The entire website — HTML + embedded CSS + JS
├── README.md         # You are here
├── LICENSE           # MIT
├── robots.txt        # SEO crawl directives
└── .gitignore
```

> **Why one file?** This was an intentional design constraint — a self-contained, portable demo that opens anywhere. The internal CSS and JS are organized with a numbered table of contents and section comments for easy navigation. Want it split into `/css` and `/js`? It's structured to make that a 5-minute job.

---

## 🎨 Design Notes

- **Palette** — premium teal/emerald (`#14b8a6 → #0ea5e9`) with a coral accent for favorites, giving NestSpace its own identity rather than mimicking Airbnb's red.
- **Glassmorphism** on the navbar, hero search bar, filter card, and price badges.
- **Responsive** — graceful 4 → 2 → 1 column collapses; nav becomes a slide-in drawer under 900px.
- **Accessibility** — honors `prefers-reduced-motion`, uses ARIA labels, and respects the OS color-scheme preference on first load.

---

## ⚠️ Demo Disclaimer

This is a **frontend demo only** — there is no backend, database, authentication, or live API.
Forms display success toasts, favorites/filters are visual, and "Load More" reshuffles the sample listings. All data is fictional.

---

## 📄 License

Released under the [MIT License](LICENSE). Feel free to use it as a portfolio reference or starter.

---

<p align="center">Crafted for students, by students. 🎓</p>
