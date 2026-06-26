# HUMACH Research — Step #7: Development Page

## Purpose

Step #7 adds a dedicated **Development** page to the HUMACH Research static website. The page presents HUMACH as a group that not only conducts research, but also builds practical software systems, AI prototypes, dashboards, research tools, health technology applications, and training platforms.

This step builds on:

- Step #1: Brand Foundation
- Step #2: Homepage Redesign
- Step #3: Global Navigation and Layout System
- Step #4: Data-Driven Structure
- Step #5: Research Page
- Step #6: Projects Page

---

## New Page Added

```text
development.html
```

The new page is connected to the global HUMACH navigation, footer, visual identity, and JSON data loader.

---

## Updated Data File

```text
data/development.json
```

The development data file was expanded from a simple homepage preview list into a full development directory with structured fields:

```text
id
title
icon
category
type
status
statusClass
summary
details
tags
tools
outputs
opportunity
```

A new `stack` section was also added to describe the technical ecosystem behind HUMACH development work.

---

## JavaScript Updates

Updated file:

```text
assets/js/humach-data-loader.js
```

New rendering functions were added for the development page:

```text
renderDevelopmentPageSummary()
renderDevelopmentFilters()
renderDevelopmentPageGrid()
renderDevelopmentStack()
initDevelopmentFilters()
getDevelopmentFilterTokens()
```

The development page can now dynamically render:

- summary metrics
- filter buttons
- development cards
- tools/methods
- expected outputs
- technical stack groups

---

## CSS Updates

Updated file:

```text
assets/css/humach-theme.css
```

Added styling for:

- development page hero
- development philosophy section
- development directory
- development cards
- development icons
- filtering behaviour
- technical stack grid
- build lifecycle pathway
- development CTA section
- responsive layouts

---

## Navigation Updates

The global navigation now points to the new dedicated page:

```text
Development → development.html
```

The homepage still keeps a development preview section, but visitors can now open the full Development page for details.

---

## Main Page Sections

The new `development.html` page includes:

```text
1. Development hero
2. Development philosophy
3. Data-driven development directory
4. Filterable development cards
5. Technical stack
6. Build lifecycle
7. Build with HUMACH CTA
```

---

## Development Directions Included

The current JSON data includes these development directions:

```text
Research Dashboard Platforms
AI Prototype Systems
Data Processing Pipelines
Open Research Tools
Health Technology Applications
Education and Training Platforms
```

---

## Technical Stack Groups Included

```text
Frontend
Data and Analysis
AI and Research
Collaboration
```

---

## Preview Instructions

Because the page loads JSON data using JavaScript, preview it through a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/development.html
```

Opening the page directly with `file://` may show only static fallback content because browsers often block local JSON loading.

---

## Result

Step #7 makes HUMACH more than a research-only website. It now has a clear development identity, showing how the group can produce:

- software tools
- AI prototypes
- dashboards
- data pipelines
- research automation systems
- open-source-ready assets
- health technology interfaces
- student training platforms

This prepares the website for the next step: **Opportunities / Internships Page**.
