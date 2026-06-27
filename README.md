# HUMACH Research Website

**HUMACH Research** stands for:

> **Human-centered Ubiquitous Machine intelligence for Advanced Computing and Health**

This is the finalized static website package for HUMACH Research. The site is designed as a modern research, development, internship, project, team, publication, and collaboration platform for a computer-science-focused research group.

---

## Main Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Main landing page and brand introduction |
| Research | `research.html` | Research areas and topic map |
| Projects | `projects.html` | Project directory and project workflow |
| Development | `development.html` | Software, prototypes, dashboards, and tools |
| Opportunities | `opportunities.html` | Internships, thesis topics, RA roles, and collaboration pathways |
| Team | `team.html` | People, roles, and contribution structure |
| Publications | `publications.html` | Publications, outputs, reports, datasets, and software papers |
| News | `news.html` | Updates, calls, releases, and announcements |
| Contact | `contact.html` | Contact and collaboration gateway |

---

## Data-Driven Content

The site uses JSON files inside the `data/` folder. Update these files to change most public content without editing large HTML sections.

```text
data/contact.json
data/development.json
data/news.json
data/opportunities.json
data/projects.json
data/publications.json
data/research.json
data/team.json
```

---

## Important Folders

```text
assets/css/         Main and HUMACH-specific CSS
assets/js/          Main UI, data loader, and visual polish scripts
assets/img/         Logos and images
data/               JSON content files
docs/steps/         Step-by-step implementation notes
forms/              Optional PHP form endpoints from the original template base
```

---

## How to Preview Locally

Because the site loads JSON files, preview it through a local web server.

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## Deployment

This project can be deployed on:

- GitHub Pages
- Netlify
- Vercel
- cPanel/static hosting
- Any standard web server

For GitHub Pages or other static hosting, connect the contact form to a static form service such as Google Forms, Formspree, Netlify Forms, or a custom API endpoint.

---

## Final Development Status

Completed phases:

1. Brand foundation
2. Homepage redesign
3. Global navigation and layout system
4. Data-driven structure
5. Research page
6. Projects page
7. Development page
8. Opportunities page
9. Team page
10. Publications page
11. News page
12. Contact page
13. Mobile responsiveness and accessibility
14. Animation and visual polish
15. Final cleanup and packaging

---

## Notes

The final package keeps the original static-site nature while adding a stronger HUMACH identity, modern research-lab visual design, JSON-driven content, reusable page structures, responsive layouts, accessibility improvements, and lightweight visual polish.


## Member CV Details

This version adds a printable member CV page:

```text
member-details.html#<member-name-slug>
```

Example:

```text
http://localhost:8000/member-details.html#emran-ali
```

The CV page is fully JSON-driven and combines data from:

- `data/team.json`
- `data/member-cv.json`
- `data/projects.json`
- `data/publications.json`

Team cards include a **Details / CV** link. The CV page includes a **Print CV** button, print-specific styling, and an **Awards and Achievements** section.


## Emran Ali CV JSON Update

The printable member CV for Emran Ali is populated from the public personal website content. Preview it at `member-details.html#emran-ali`. The CV combines `data/team.json`, `data/member-cv.json`, `data/projects.json`, and `data/publications.json`.


## Logo Assets

The project includes optimized HUMACH Research logo variants under `assets/img/brand/`.

- Header logo: `assets/img/brand/humach-logo-square-256.png`
- Favicon: `assets/img/brand/humach-favicon-64.png`
- Apple touch icon: `assets/img/brand/humach-apple-touch-icon.png`
- Footer logo: `assets/img/brand/humach-logo-footer.png`

See `HUMACH_LOGO_ASSET_UPDATE.md` for details.


## Latest Update: Content Cleanup and Experience Affiliation

This version refines public website copy after the team CV and logo updates.

- Current-role entries on member CV pages now show contributor group and organisation together, for example: `Leadership, HUMACH Research`.
- Team records now include an `organization` field in `data/team.json`.
- Public pages no longer show implementation messages such as `Data-driven directory`, `Maintained from data/*.json`, or local-server guidance.
- Technical notes are kept in Markdown documentation and code comments instead of public page content.

Preview Emran Ali's CV page with:

```text
member-details.html#emran-ali
```


## Latest Update: Case, Mobile Menu, and Cache

The full lab name now uses the selected case-sensitive wording: **Human-centered Ubiquitous Machine intelligence for Advanced Computing and Health**.

The mobile navigation has been stabilised as an overlay menu for tablet and mobile screens. The data loader now caches JSON content in the browser and refreshes it every 30 minutes, using cached data as fallback if a refresh is unavailable.

See `HUMACH_CASE_MENU_CACHE_UPDATE.md` for implementation details.
