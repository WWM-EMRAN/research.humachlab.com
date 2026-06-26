# HUMACH Research — Step #10: Publications Page

## Purpose

Step #10 adds a dedicated **Publications** page to the HUMACH Research static website.

The page is designed to act as a structured research-output directory for journal articles, conference papers, preprints, technical reports, software papers, dataset papers, posters, student outputs, and development documentation.

## New Page Added

```text
publications.html
```

## Data File Expanded

```text
data/publications.json
```

The publications data file now supports:

```text
section metadata
publication/output records
publication types
publication workflow steps
links to related projects, research pages, or external resources
```

## Main Features Added

- Publications hero section
- Publication summary card loaded from JSON
- Output philosophy section
- Data-driven publication directory
- Publication filters by type, year, status, and tags
- Publication cards with:
  - title
  - authors
  - year
  - type
  - venue
  - status
  - summary
  - abstract/description
  - tags
  - related projects
  - optional links
- Output types section
- Publication workflow section
- Final “Publish With HUMACH” CTA

## JavaScript Updates

Updated:

```text
assets/js/humach-data-loader.js
```

New rendering functions added:

```text
renderPublicationsPageSummary()
renderPublicationFilters()
renderPublicationsPageGrid()
renderPublicationTypes()
renderPublicationWorkflow()
initPublicationFilters()
```

The page uses progressive enhancement. If JSON loading fails, static fallback content remains visible.

## CSS Updates

Updated:

```text
assets/css/humach-theme.css
```

New style groups added for:

```text
publications page hero
publication principle cards
publication directory cards
publication filter bar
publication output type grid
publication workflow grid
publication CTA
responsive publication layouts
```

## Navigation Updates

The global navigation and footer now link to:

```text
publications.html
```

instead of only the homepage publication preview anchor.

## Important Content Note

The current publication records are planning-ready placeholders. They are intentionally written as templates and planned outputs rather than fabricated real publications.

When real publication metadata becomes available, update `data/publications.json` with:

```text
actual title
authors
year
publication type
venue
DOI
paper URL
preprint URL
code URL
dataset URL
related project
related team member
```

## Preview Instructions

Because this page loads JSON data, preview it using a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/publications.html
```

## Next Planned Step

```text
Step #11 — News / Updates Page
```
