# HUMACH Research Website — Step 12 Contact and Collaboration Page

## Step Goal

Create a dedicated **Contact and Collaboration Page** for HUMACH Research so visitors can choose the right pathway for research collaboration, development work, internships, thesis supervision, publication/output contribution, or general questions.

## New Page Added

```text
contact.html
```

## New Data File Added

```text
data/contact.json
```

The contact data file contains:

```text
section metadata
summary metrics
inquiry pathways
contact methods
message checklist
collaboration routes
contact workflow
```

## Updated Files

```text
assets/js/humach-data-loader.js
assets/css/humach-theme.css
index.html
research.html
projects.html
development.html
opportunities.html
team.html
publications.html
news.html
starter-page.html
service-details.html
portfolio-details.html
data/news.json
data/README.md
README.md
```

## Contact Page Sections

The new page includes:

1. **Contact hero** — introduces HUMACH as a research, development, internship, and collaboration gateway.
2. **Communication principle** — explains why the page routes inquiries rather than acting only as a simple form.
3. **Contact gateway** — dynamic cards for research, development, internship, publication/output, and general inquiries.
4. **Contact methods** — email, join form, project directory, and opportunities page links.
5. **Message template** — a checklist and form layout showing what a visitor should include.
6. **Collaboration routes** — research partner, development partner, student contributor, and publication contributor routes.
7. **Contact workflow** — Choose Pathway → Share Context → Match Direction → Start Contribution.
8. **Final CTA** — encourages visitors to apply, join, or contact HUMACH.

## Data-Driven Rendering

The page uses the existing HUMACH data-loader pattern. When served through a local server, these areas render from `data/contact.json`:

```text
contact-page-summary
contact-inquiry-grid
contact-methods
contact-checklist
contact-routes
contact-process
```

Static fallback content is still available in the HTML if the JSON cannot load.

## Navigation and Footer Updates

The global navigation now includes:

```text
Contact
```

The footer now includes a dedicated contact block with links to:

```text
Contact HUMACH
Collaboration Gateway
Email HUMACH
```

## Form Note

The included contact form is a front-end layout. For live deployment, it should be connected to a working form service, email service, or backend endpoint. The existing project still contains the original `forms/contact.php`, but static hosting such as GitHub Pages will not process PHP.

## Preview Instructions

Run the project through a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/contact.html
```

## Next Step

The next development step is **Step 13 — Mobile Responsiveness and Accessibility**, where the complete site should be tested and refined across desktop, tablet, and mobile layouts.
