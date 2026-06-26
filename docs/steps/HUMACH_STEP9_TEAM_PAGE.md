# HUMACH Research — Step 9: Team Page

## Purpose

Step #9 creates a dedicated **Team Page** for HUMACH Research. The goal is to move beyond a simple homepage preview and provide a scalable structure for leadership, researchers, collaborators, developers, interns, students, and future alumni.

## New Page Added

```text
team.html
```

## Data File Updated

```text
data/team.json
```

The team data now includes:

- `section` metadata
- `groups` for contributor categories
- `items` for individual or placeholder profiles
- profile status
- role and category
- research/development interests
- connected work
- possible outputs

## JavaScript Updated

```text
assets/js/humach-data-loader.js
```

New rendering functions added:

```text
renderTeamPageSummary()
renderTeamFilters()
renderTeamPageGrid()
renderTeamGroups()
initTeamFilters()
```

These functions allow the team page to load content from `data/team.json` and support interactive filtering.

## CSS Updated

```text
assets/css/humach-theme.css
```

New styles added for:

- team page hero
- team philosophy section
- team directory toolbar
- team filter buttons
- team profile cards
- placeholder profiles
- team group cards
- contribution pathway cards
- responsive team layouts

## Navigation Updated

The navigation and footer now link to:

```text
team.html
```

instead of only linking to the homepage team preview anchor.

## Homepage Updated

The homepage team preview now includes a **View Full Team** button that links to `team.html`.

## Preview Instructions

Run the project using a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/team.html
```

## Next Step

The next planned step is:

```text
Step #10 — Publications Page
```

This will create a dedicated `publications.html` page using `data/publications.json` with searchable/filterable publication outputs.
