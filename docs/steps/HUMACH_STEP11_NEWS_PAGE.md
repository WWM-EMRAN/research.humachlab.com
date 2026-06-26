# HUMACH Step 11 — News / Updates Page

## Objective

Step #11 adds a dedicated **News / Updates Page** to the HUMACH Research static website.

The page is designed to present research activity, development progress, publication notices, internship calls, team updates, software releases, workshops, collaboration news, and website development milestones.

---

## New Page Added

```text
news.html
```

The page follows the global HUMACH layout system and uses the same header, footer, page hero, cards, buttons, and responsive styling introduced in earlier steps.

---

## Main Data Source

```text
data/news.json
```

The news page and homepage news preview are now driven by this JSON file.

Each news item can include:

```text
id
title
date
type
category
status
statusClass
featured
summary
details
audience
tags
links
```

---

## Sections Added to news.html

```text
News hero
Why a News Page / activity philosophy
Dynamic update directory
News filter bar
Detailed news/update cards
Update channels
Publishing workflow
Final CTA section
```

---

## JavaScript Updates

Updated:

```text
assets/js/humach-data-loader.js
```

Added rendering support for:

```text
news-page-summary
news-filters
news-page-grid
news-channels
news-workflow
news filtering behavior
```

The page supports filtering by update type, category, status, and tags.

---

## CSS Updates

Updated:

```text
assets/css/humach-theme.css
```

Added styles for:

```text
news hero
news summary card
news principle grid
news filter bar
news detail cards
news channel cards
news workflow cards
news CTA section
responsive layouts
```

---

## Navigation Updates

Updated all main navigation and footer references from:

```text
index.html#news
```

to:

```text
news.html
```

The homepage still keeps a small News Preview section, but the full update archive now lives on `news.html`.

---

## Preview Instructions

Because the page uses JSON loading, preview with a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/news.html
```

---

## Notes

The current news items are planning and website-development updates for the HUMACH build process. Real future items can be added directly to `data/news.json` without editing the page HTML.
