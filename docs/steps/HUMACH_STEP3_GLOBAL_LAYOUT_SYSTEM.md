# HUMACH Research — Step 3: Global Navigation and Layout System

## Purpose

Step #3 prepares the website for the upcoming internal pages by creating a reusable global layout system. The homepage from Step #2 remains the main public-facing page, but the surrounding structure has now been made more scalable.

## Completed Updates

### 1. Global Header

The header now uses a more scalable navigation system:

- Home
- About
- Research & Build dropdown
  - Research Areas
  - Development
  - Projects
  - Research Detail Template
  - Project Detail Template
- People & Outputs dropdown
  - Publications
  - Team
  - Standard Page Template
- Opportunities
- Collaborate
- Join HUMACH call-to-action button

The navigation is now prepared for the future multi-page structure while still linking safely to the existing homepage sections.

### 2. Mobile Navigation Readiness

The mobile navigation keeps the BootstrapMade mobile menu behavior, but now includes grouped navigation items and a keyboard-accessible toggle button.

### 3. Accessibility Improvement

A `Skip to main content` link has been added to improve keyboard navigation.

### 4. Shared Footer

The footer has been rebuilt into reusable groups:

- Explore
- Outputs
- Opportunities
- Build System

It now links to the homepage sections and the reusable template pages.

### 5. Reusable Inner Page Hero

A new page hero layout has been added for internal pages. It includes:

- Breadcrumb
- Section kicker
- Large page title
- Short page summary
- Optional side summary card

### 6. Reusable Page Components

The CSS now includes reusable components for future pages:

- `.humach-page-hero`
- `.humach-breadcrumb`
- `.humach-page-summary-card`
- `.humach-side-panel`
- `.humach-content-card`
- `.humach-system-card`
- `.humach-component-grid`
- `.humach-chip-row`
- `.humach-mini-cta`

### 7. Template Pages Prepared

The old generic detail/starter pages have been converted into useful HUMACH templates:

- `starter-page.html` → Standard Inner Page Template
- `service-details.html` → Research Detail Template
- `portfolio-details.html` → Project Detail Template

These pages are not final content pages yet. They are reusable layout references for upcoming steps.

### 8. Global UI Helper Script

A new script has been added:

```text
assets/js/humach-ui.js
```

It currently handles:

- Current year in footer
- Active navigation state
- Dropdown parent highlighting
- Keyboard support for the mobile menu toggle

## Main Files Modified

```text
index.html
starter-page.html
service-details.html
portfolio-details.html
assets/css/humach-theme.css
assets/js/humach-ui.js
```

## Why This Step Matters

Before building separate pages for Research, Projects, Team, Publications, Opportunities, News, and Contact, the shared structure must be stable. This step prevents duplicated design work and ensures that every future page will look and behave consistently.

## Next Step

The next planned stage is:

```text
Step #4 — Data-Driven Structure
```

This will introduce JSON files such as:

```text
data/research.json
data/projects.json
data/team.json
data/publications.json
data/opportunities.json
data/news.json
```

After that, future pages can be generated from structured data instead of hard-coded HTML blocks.
