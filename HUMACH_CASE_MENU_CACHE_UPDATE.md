# HUMACH Case, Mobile Menu, and Cache Update

## Requested fixes

This update applies three user-requested changes to the HUMACH Research static website.

## 1. Full lab name case update

The full lab name was updated across public pages and project documentation to use the selected case-sensitive version:

> Human-centered Ubiquitous Machine intelligence for Advanced Computing and Health

This was applied to page titles, header brand subtitles, hero text, footer descriptions, member details pages, and documentation references.

## 2. Mobile menu repair

The mobile navigation was stabilised so it opens as a full overlay instead of appearing underneath page content.

### Files updated

- `assets/js/main.js`
- `assets/js/humach-ui.js` remains compatible with the improved behaviour
- `assets/css/humach-theme.css`

### Improvements

- Mobile menu state is now controlled explicitly with `setMobileNavState()`.
- The toggle button updates `aria-expanded` and `aria-label` reliably.
- Dropdown arrow clicks no longer close the menu immediately.
- Mobile menu overlay is forced above page content using fixed positioning and z-index rules.
- The menu uses a fixed scrollable panel on small screens.

## 3. JSON data cache policy

The data loader now uses browser local storage to cache JSON data.

### Cache behaviour

- First visit: data is loaded from the JSON files and saved to cache.
- Within 30 minutes: cached data is used.
- After 30 minutes: fresh JSON data is requested again.
- If refresh fails: previously cached data is used as fallback when available.

### Files updated

- `assets/js/humach-data-loader.js`
- `assets/js/humach-member-cv.js`

### Notes

The cache is versioned through `DATA_CACHE_VERSION` in `humach-data-loader.js`. If a future deployment needs to force all visitors to refresh cached JSON, update this version string.

## 4. Public technical text cleanup

Public-facing technical notices about JSON/data-loader behaviour were removed from the visible website. Technical instructions remain in documentation and code comments only.

## Validation

The following checks were completed:

- JSON files parsed successfully.
- JavaScript files passed syntax checks with `node --check`.
- HTML local `href` and `src` references were checked for missing files.
- Public HTML pages were checked to confirm that implementation notes such as `data/*.json`, `Data-driven`, and `Maintained from` are not displayed.
