# HUMACH Data Layer

This folder contains the structured content files for the HUMACH Research static website.

## Files

- `research.json` — Research areas and topics
- `development.json` — Development categories and tools
- `projects.json` — Project cards and metadata
- `opportunities.json` — Internship, training, and collaboration options
- `publications.json` — Publication records
- `team.json` — Team and collaborator profiles
- `news.json` — Updates and announcements

## Editing Notes

1. Keep valid JSON syntax.
2. Do not leave trailing commas after the last item in an array or object.
3. Keep each item’s `id` unique.
4. Use Bootstrap Icons class names for `icon`, such as `bi bi-cpu`.
5. The homepage renders preview sections from these files using `assets/js/humach-data-loader.js`.
6. If the site is opened directly from the file system and browser fetch blocks JSON loading, the static fallback cards remain visible. For full data loading, serve the folder with a local server, such as:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in the browser.


## Step 11 News Page

`news.json` now powers the dedicated `news.html` page and the homepage news preview. Add new records with `title`, `date`, `type`, `category`, `status`, `summary`, `details`, `tags`, and optional `links`.

- `contact.json` — contact methods, inquiry types, collaboration routes, message checklist, and contact workflow.

## Member CV Details Update

- `member-cv.json` — additional CV-style data for member profile pages.

The printable member CV page is `member-details.html#<member-name-slug>`. It combines:

1. `data/team.json` for the member's public profile, role, status, interests, summary, and image.
2. `data/member-cv.json` for additional CV-specific sections such as academic information, awards and achievements, certificates, courses, and extracurricular activities.
3. `data/projects.json` for linked project cards using `projectIds` inside `member-cv.json`.
4. `data/publications.json` for linked publication cards using `publicationIds` inside `member-cv.json`.

Required CV sections currently supported:

- Academic Info
- Professional Experience
- Awards and Achievements
- Projects
- Publications
- Certificates and Courses
- Extracurricular Activity

Use the same `memberId` value in `member-cv.json` as the internal `id` value in `team.json`. Public member CV URLs should use the name-based `slug` value, for example `member-details.html#emran-ali`.
