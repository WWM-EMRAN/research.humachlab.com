# HUMACH Content Cleanup and Experience Affiliation Update

## Summary

This update refines the website-facing content after the logo and CV integration update.

## Changes

- Updated the member CV current-role experience display so the organisation appears with the contributor group.
  - Example: `Leadership, HUMACH Research` instead of only `Leadership`.
- Added an `organization` field to team records in `data/team.json`.
- Updated team cards to show the contributor group together with the organisation where appropriate.
- Removed visitor-facing implementation messages such as:
  - `Data-driven team directory`
  - `Maintained from data/team.json`
  - `Loaded from data/*.json when served through a local server`
- Kept technical JSON/data-maintenance guidance in documentation and code comments instead of showing it on public pages.
- Replaced technical fallback messages with user-friendly website messages.

## Files Updated

- `data/team.json`
- `data/news.json`
- `assets/js/humach-member-cv.js`
- `assets/js/humach-data-loader.js`
- Main HTML pages including `team.html`, `member-details.html`, `research.html`, `projects.html`, `development.html`, `opportunities.html`, `publications.html`, `news.html`, `contact.html`, and `index.html`.

## Preview

Run the site with:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/member-details.html#emran-ali
```

The Professional Experience section should show the current role affiliation as `Leadership, HUMACH Research`.
