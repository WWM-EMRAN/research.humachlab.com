# HUMACH Research — Step #8: Opportunities / Internships Page

## Step Objective

Step #8 creates a dedicated **Opportunities** page for HUMACH Research. The goal is to make internships, thesis/project supervision, volunteer contribution, and collaboration pathways easier to understand and easier to apply for.

This step builds on:

- Step #1: Brand foundation
- Step #2: Homepage redesign
- Step #3: Global layout system
- Step #4: Data-driven structure
- Step #5: Research page
- Step #6: Projects page
- Step #7: Development page

---

## New Page Added

```text
opportunities.html
```

The page introduces the main HUMACH participation pathways:

```text
Research Internship
Development Internship
Thesis / Project Supervision
Volunteer Research Assistant
Collaboration / Partnership
```

---

## Data File Updated

```text
data/opportunities.json
```

The previous basic opportunity data has been expanded into a richer structured content model.

Each opportunity now supports:

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
highlights
skills
outcomes
topics
mode
duration
commitment
idealFor
applicationNote
tags
featured
```

Additional data sections were added for:

```text
process
skillGroups
```

These support the application-flow section and the skill-pathways section.

---

## JavaScript Updated

Updated file:

```text
assets/js/humach-data-loader.js
```

New rendering functions were added:

```text
renderOpportunityPageSummary()
renderOpportunityFilters()
renderOpportunitiesPageGrid()
renderOpportunityProcess()
renderOpportunitySkillMatrix()
initOpportunityFilters()
```

New helper function:

```text
getOpportunityFilterTokens()
```

The page can now render the opportunities directory dynamically from `data/opportunities.json`.

---

## CSS Updated

Updated file:

```text
assets/css/humach-theme.css
```

New styles were added for:

```text
humach-opportunity-hero
humach-opportunity-intro
opportunity-detail-card
opportunity-filter-bar
opportunity-info-grid
opportunity-process-grid
opportunity-skill-grid
humach-opportunity-cta
```

Additional opportunity status styles were added:

```text
open
matching
selective
```

---

## Page Sections Added

The new Opportunities page includes:

1. **Opportunities hero**
   - Main introduction
   - Explore Pathways button
   - Apply / Express Interest button
   - Data-driven summary card

2. **Pathway philosophy**
   - Clear pathway
   - Milestone-based work
   - Evidence-first output
   - Collaborative participation

3. **Opportunity directory**
   - Dynamic opportunity cards
   - Data-driven filters
   - Application notes
   - Skills, outcomes, mode, duration, commitment, and ideal-user details

4. **Application flow**
   - Express Interest
   - Match a Pathway
   - Define Tasks
   - Build Evidence

5. **Skill pathways**
   - Research skills
   - Development skills
   - Data and AI skills
   - Professional skills

6. **Final call-to-action**
   - Apply / Express Interest
   - View Projects

---

## Navigation Updated

All main HTML pages now link to:

```text
opportunities.html
```

instead of only linking to the homepage opportunity preview section.

Updated links include:

```text
index.html
development.html
projects.html
research.html
starter-page.html
service-details.html
portfolio-details.html
opportunities.html
```

---

## Static Fallback Support

The new page includes static fallback content so it remains readable if opened directly using `file://`.

For full JSON-driven rendering, serve the project using a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/opportunities.html
```

---

## Files Modified or Added

```text
opportunities.html
assets/js/humach-data-loader.js
assets/css/humach-theme.css
data/opportunities.json
README.md
HUMACH_STEP8_OPPORTUNITIES_PAGE.md
```

Several existing HTML pages were also updated to point to the new opportunities page.

---

## Next Step

The next planned step is:

```text
Step #9 — Team Page
```

This will create a dedicated `team.html` page using `data/team.json`, with profile cards for the director/lead, researchers, developers, interns, students, collaborators, and alumni.
