# HUMACH Research — Step 4: Data-Driven Structure

## Step Goal

Step #4 introduces a structured data layer for the HUMACH Research static website. The goal is to make future content updates easier by storing research areas, development categories, projects, opportunities, publications, team profiles, and news updates in JSON files.

This keeps the website maintainable as HUMACH Research grows.

---

## Implemented Data Layer

A new `data/` folder has been added with the following files:

```text
data/
  README.md
  research.json
  development.json
  projects.json
  opportunities.json
  publications.json
  team.json
  news.json
```

---

## JSON Files and Purpose

### `data/research.json`

Stores HUMACH research areas, including:

- title
- icon
- summary
- tags
- topics
- status

Current research areas include:

```text
Machine Learning & Data Science
Deep Learning & Multimodal AI
Biomedical & Health AI
NLP, Generative AI & Agents
Software Engineering Research
AI for Education & Training
```

---

### `data/development.json`

Stores the practical development categories of HUMACH Research.

Current development categories include:

```text
Research Dashboards
AI Prototypes
Data Pipelines
Open Tools
```

---

### `data/projects.json`

Stores project cards and metadata.

Current project directions include:

```text
AI-Based Health Signal Analysis
Research Dashboard Platform
AI Research Assistant Workflows
```

Each project can include:

```text
id
title
status
statusClass
category
type
summary
tags
relatedResearch
links
```

---

### `data/opportunities.json`

Stores internship, training, and collaboration options.

Current opportunities include:

```text
Research Internship
Development Internship
Collaboration
```

Each opportunity can include:

```text
id
title
icon
summary
highlights
mode
status
featured
```

---

### `data/publications.json`

Stores publication records.

Each publication can include:

```text
id
title
authors
year
type
venue
summary
tags
links
```

This file is currently prepared with placeholder records so future papers can be added easily.

---

### `data/team.json`

Stores team profile cards.

Each member profile can include:

```text
id
name
role
image
summary
interests
links
```

Current placeholders include:

```text
Research Lead
Researchers & Collaborators
Interns & Students
```

---

### `data/news.json`

Stores news, updates, and announcements.

Possible future news items include:

```text
New publications
New projects
Internship calls
Team achievements
Workshop/seminar announcements
Collaboration news
Software release updates
```

---

## New JavaScript File

A new JavaScript helper has been added:

```text
assets/js/humach-data-loader.js
```

This script loads JSON files and renders preview content into the homepage.

---

## Homepage Data Render Targets

The homepage now includes data render targets using `data-humach-render` attributes.

```text
data-humach-render="research-areas"
data-humach-render="development-items"
data-humach-render="projects-preview"
data-humach-render="opportunities-preview"
data-humach-render="publications-preview"
data-humach-render="team-preview"
data-humach-render="news-preview"
```

These targets allow the homepage sections to be rendered from JSON files.

---

## Progressive Fallback Behaviour

The implementation is backward-compatible.

If the JSON files load correctly, the homepage preview cards are rendered from the data files.

If the site is opened directly using `file://` and browser security blocks JSON loading, the existing static fallback cards remain visible.

This means the homepage still works even without a local server.

---

## Recommended Way to Preview Data Loading

For full JSON loading, serve the website folder with a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## Updated Files

The main files changed in this step are:

```text
index.html
starter-page.html
service-details.html
portfolio-details.html
assets/css/humach-theme.css
assets/js/humach-data-loader.js
data/*.json
data/README.md
README.md
```

---

## New Homepage Addition

A new homepage preview section has been added:

```text
News / Updates Preview
```

This is connected to `data/news.json` and prepares the site for the future full News page.

---

## Why This Step Matters

Before building separate pages, the content structure should be stable. This step prepares the website for:

```text
Research page
Projects page
Development page
Opportunities page
Team page
Publications page
News page
Contact page
```

Each future page can now use the same JSON files instead of hard-coded repeated HTML.

---

## Next Step

The next recommended step is:

```text
Step #5 — Research Page
```

In Step #5, a dedicated `research.html` page should be created using `data/research.json`. It should include research-area cards, topic details, related projects, and future publication links.
