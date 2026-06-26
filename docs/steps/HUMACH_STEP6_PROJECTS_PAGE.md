# HUMACH Research — Step #6: Projects Page

## Purpose

Step #6 adds a dedicated `projects.html` page for HUMACH Research. The page presents research, development, training, and collaboration projects using the structured data file `data/projects.json`.

## Files Added

```text
projects.html
HUMACH_STEP6_PROJECTS_PAGE.md
```

## Files Updated

```text
data/projects.json
assets/js/humach-data-loader.js
assets/css/humach-theme.css
index.html
research.html
portfolio-details.html
service-details.html
starter-page.html
README.md
```

## Main Features Added

- Dedicated Projects page.
- Data-driven project cards loaded from `data/projects.json`.
- Project summary metrics.
- Project filter buttons generated from categories, types, statuses, and tags.
- Project cards with:
  - title
  - status
  - category
  - type
  - summary
  - tags
  - related research areas
  - expected outputs
  - opportunity pathway
- Project workflow section: Define → Build → Evaluate → Share.
- Project CTA section for students, developers, researchers, and collaborators.
- Navigation and footer links updated from homepage project anchors to `projects.html`.

## Preview Instructions

For JSON-driven rendering, run the project with a local web server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/projects.html
```

## Notes

The Projects page keeps fallback cards in the HTML, so it remains readable if opened directly as a file. Full dynamic rendering and filtering work best through a local server.

## Next Step

Step #7 should create the dedicated **Development Page** using `data/development.json`.
