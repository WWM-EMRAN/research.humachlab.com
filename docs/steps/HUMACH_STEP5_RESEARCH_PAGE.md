# HUMACH Step 5 — Research Page

## Purpose

Step #5 creates the first dedicated internal content page for HUMACH Research: `research.html`.

This page expands the homepage research preview into a full research directory, using the structured JSON data layer introduced in Step #4.

---

## Completed Work

### 1. Added Dedicated Page

Created:

```text
research.html
```

The page includes:

- HUMACH global header and footer
- Inner-page hero section
- Breadcrumb navigation
- Research summary card
- Research philosophy section
- Research areas directory
- Research topic map
- Research-to-output pathway
- Final call-to-action section

---

### 2. Connected to JSON Data

The research page reads from:

```text
data/research.json
```

The page uses these dynamic render targets:

```html
[data-humach-render="research-page-summary"]
[data-humach-render="research-page-grid"]
[data-humach-render="research-topic-map"]
```

If the project is opened directly using `file://`, static fallback cards remain visible. When served through a local server, the content is rendered from JSON.

---

### 3. Updated JavaScript

Updated:

```text
assets/js/humach-data-loader.js
```

Added page-specific render functions:

```text
renderResearchPageGrid()
renderResearchTopicMap()
renderResearchPageSummary()
```

These functions render detailed research cards, topic groups, and summary metrics from the research JSON file.

---

### 4. Updated Navigation Links

Updated the global navigation so **Research Areas** now points to:

```text
research.html
```

The homepage still keeps its preview section, but the dedicated page is now the main research destination.

---

### 5. Added Research Page Styling

Updated:

```text
assets/css/humach-theme.css
```

Added styles for:

- Research page hero
- Research summary metrics
- Research principle cards
- Research toolbar
- Research detail cards
- Topic map grid
- Research pathway cards
- Responsive layouts

---

## Preview Instructions

Use a local server so JSON data loads correctly:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/research.html
```

---

## Next Step

The next planned step is:

```text
Step #6 — Projects Page
```

That step will create `projects.html` using `data/projects.json`, with project cards, project status, filters, tags, and links to future project detail pages.
