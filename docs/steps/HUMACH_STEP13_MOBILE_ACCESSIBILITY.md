# HUMACH Research — Step 13 Mobile Responsiveness and Accessibility

## Step Goal

Step 13 improves the HUMACH Research static website for practical use across desktop, tablet, and mobile devices. It also adds accessibility improvements so the site is easier to navigate with keyboard, screen-reader, reduced-motion, and high-contrast preferences.

This step builds on **Step 12 — Contact and Collaboration Page**.

---

## Main Files Updated

```text
assets/css/humach-theme.css
assets/js/humach-ui.js
index.html
research.html
projects.html
development.html
opportunities.html
team.html
publications.html
news.html
contact.html
starter-page.html
service-details.html
portfolio-details.html
README.md
```

---

## HTML Improvements

### 1. Mobile Menu Button

The previous mobile navigation trigger was an icon element with button-like behavior. It has now been replaced with a semantic button:

```html
<button class="mobile-nav-toggle d-xl-none bi bi-list"
        type="button"
        aria-label="Open mobile navigation"
        aria-controls="navmenu"
        aria-expanded="false"></button>
```

This improves keyboard and assistive-technology support.

### 2. Main Content Focus Target

The main content area now supports skip-link focus:

```html
<main id="main-content" class="main" tabindex="-1">
```

### 3. Scroll-to-Top Accessibility

The scroll-top button now has a clear accessible label:

```html
<a href="#" id="scroll-top" aria-label="Back to top">...</a>
```

### 4. Preloader Hidden From Screen Readers

The preloader is now hidden from assistive technologies:

```html
<div id="preloader" aria-hidden="true"></div>
```

### 5. Step Marker Updated

All main pages now include:

```text
humach-step13
```

in the body class for easier version tracking.

---

## CSS Improvements

### 1. Better Mobile Layout

Added responsive rules for:

```text
Hero sections
Page hero sections
Navigation overlay
Action buttons
Filter bars
Cards
Footer columns
Contact form
Content spacing
```

### 2. Mobile Navigation Refinement

The mobile menu now has:

```text
Better spacing
Rounded overlay panel
Scrollable menu area
Large touch targets
Improved dropdown spacing
Body scroll locking while open
```

### 3. Touch-Friendly Controls

Buttons and filter chips now use larger mobile-friendly touch targets.

### 4. Horizontal Filter Bars on Small Screens

Filter bars on projects, development, opportunities, publications, team, and news pages now scroll horizontally on small screens instead of wrapping into very tall blocks.

### 5. Focus Visibility

Added strong `:focus-visible` styles for:

```text
Links
Buttons
Inputs
Textareas
Select boxes
Mobile navigation
Scroll-top button
```

This improves keyboard navigation.

### 6. Reduced Motion Support

Added support for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) { ... }
```

This reduces or disables animations and transitions.

### 7. High-Contrast / Forced Colors Support

Added basic support for forced-color environments.

---

## JavaScript Improvements

Updated:

```text
assets/js/humach-ui.js
```

### 1. Mobile Navigation ARIA Sync

The mobile menu button now updates:

```text
aria-expanded
aria-label
```

when the menu opens and closes.

### 2. Escape Key Support

Users can now close the mobile menu using the **Escape** key.

### 3. Dropdown ARIA Support

Navigation dropdown links now receive:

```text
aria-haspopup="true"
aria-expanded="true/false"
```

### 4. Filter Button Accessibility

Dynamic filter buttons now receive:

```text
aria-pressed="true/false"
```

This applies to:

```text
Development filters
Project filters
Opportunity filters
Publication filters
Team filters
News filters
```

### 5. Dynamic Region Announcements

JSON-rendered regions now use polite live-region behavior where appropriate.

### 6. Lazy Image Loading

Non-hero images are enhanced with:

```text
loading="lazy"
decoding="async"
```

### 7. Dynamic Content Observer

A mutation observer now re-applies accessibility improvements after JSON content is rendered.

---

## Validation Performed

The following checks were performed:

```text
JavaScript syntax check for humach-ui.js
JSON validation for all data files
Confirmed semantic mobile nav button across all main HTML pages
Confirmed Step 13 body class across all main HTML pages
Confirmed no old icon-only mobile nav toggle remains in main pages
```

---

## Preview Instructions

Run a local server from the project directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Recommended manual checks:

```text
Open and close the mobile menu
Use keyboard Tab navigation
Use Escape to close the mobile menu
Test pages at mobile width
Test horizontal filter bars
Check contact form labels and focus outlines
Check project, publication, team, and news filtering
```

---

## Next Step

The next planned stage is:

```text
Step 14 — Animation and Visual Polish
```

That step should improve the final visual experience with refined animations, hover effects, subtle background motion, status badges, and polished micro-interactions while keeping the accessibility improvements from Step 13 intact.
