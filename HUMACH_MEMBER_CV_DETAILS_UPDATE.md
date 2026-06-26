# HUMACH Member CV Details Update

## Purpose

This update adds a printable, CV-style details page for HUMACH team members. Each team card can now link to a dedicated profile page that is generated from structured JSON data.

## New Page

```text
member-details.html?id=<member-id>
```

Example:

```text
member-details.html?id=research-lead
```

The page includes a **Print CV** button and print-specific CSS so the CV can be printed or saved as a PDF from the browser.

## New Data File

```text
data/member-cv.json
```

This file stores the additional CV-specific data that does not belong directly inside the team card.

## Data Sources Used by the Member CV Page

The member CV page combines data from multiple JSON files:

| CV Section | Source |
|---|---|
| Member name, role, status, summary, image, interests | `data/team.json` |
| Academic Info | `data/member-cv.json` |
| Professional Experience | Current role from `data/team.json` plus extra entries from `data/member-cv.json` |
| Projects | Linked by `projectIds` in `data/member-cv.json`, displayed from `data/projects.json` |
| Publications | Linked by `publicationIds` in `data/member-cv.json`, displayed from `data/publications.json` |
| Certificates and Courses | `data/member-cv.json` |
| Extracurricular Activity | `data/member-cv.json` |

## New JavaScript

```text
assets/js/humach-member-cv.js
```

This script does two things:

1. Adds **Details / CV** links to team cards and homepage team preview cards.
2. Renders `member-details.html` using the selected member ID from the URL query string.

## New CSS

The update extends:

```text
assets/css/humach-theme.css
```

Added styles include:

- member CV hero layout
- member photo block
- CV sidebar
- CV section cards
- linked project/publication cards
- print-friendly CSS
- mobile layout adjustments

## Supported CV Sections

The printable profile page currently supports:

```text
Academic Info
Professional Experience
Projects
Publications
Certificates and Courses
Extracurricular Activity
```

## Editing Instructions

To add a real member CV:

1. Add or update the member record in `data/team.json`.
2. Use the same member `id` in `data/member-cv.json` as `memberId`.
3. Add academic, professional, certificate/course, and extracurricular entries to `member-cv.json`.
4. Add project IDs in `projectIds` that match records in `data/projects.json`.
5. Add publication IDs in `publicationIds` that match records in `data/publications.json`.
6. Open the member page using:

```text
member-details.html?id=<member-id>
```

## Preview Requirement

Because the page loads JSON files with `fetch`, preview through a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/member-details.html?id=research-lead
```
