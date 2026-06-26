# Validation Report

## Latest validation: Team page and filter bugfix

The following checks were completed after the team page/filter update.

### JavaScript syntax

Validated with `node --check`:

- `assets/js/humach-data-loader.js`
- `assets/js/humach-member-cv.js`
- `assets/js/humach-polish.js`
- `assets/js/humach-ui.js`
- `assets/js/main.js`

### JSON syntax

Validated all files in `data/*.json` with Python JSON parsing.

### Team page rendering

Confirmed:

- static fallback team cards: **6**
- dynamic renderer produces team cards: **6**
- dynamic renderer includes `Leadership, HUMACH Research`
- `formatAffiliation()` is available inside `humach-data-loader.js`

### Team filter verification

Confirmed token-based expected counts:

| Filter | Visible cards |
|---|---:|
| All | 6 |
| Leadership | 1 |
| Research | 3 |
| Development | 2 |
| Interns | 3 |
| Alumni | 1 |

### Link and asset check

Checked internal HTML links, script references, stylesheet references, and image references. No missing internal references were found.

### Public-facing technical text check

Checked HTML pages for unwanted visible implementation text such as:

- `Data-driven`
- `Maintained from`
- `Loaded from`
- local-server guidance text

No unwanted public-facing implementation text was found in HTML pages.

---

# HUMACH Content Cleanup Validation Report

**Status:** Passed

## Checks Performed

- JSON syntax validation for files in `data/`.
- JavaScript syntax validation for HUMACH scripts.
- Website-facing HTML scan for technical JSON/data-loader messages.
- Confirmed member CV current-role affiliation now supports `Group, Organisation` display.

## Notes

- Technical maintenance instructions remain in documentation and code where appropriate, but not in public website copy.
- `data/team.json` now includes an `organization` field for team members.

## Result

- No validation issues detected.

## Case, Mobile Menu, and Cache Update Validation

- Confirmed JavaScript syntax with `node --check` for all files in `assets/js/`.
- Confirmed all JSON files in `data/` parse successfully.
- Confirmed local HTML `href` and `src` references resolve to existing files where applicable.
- Confirmed public HTML no longer displays technical JSON-loader guidance.
- Confirmed the case-sensitive full lab name is applied across public HTML pages.
