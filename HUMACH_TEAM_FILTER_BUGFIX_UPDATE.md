# HUMACH Team Page and Filter Bugfix Update

## Purpose

This update fixes the Team page rendering and filtering issues reported after the case/menu/cache update.

## Bugs found

1. **Team page showed only 3 profiles by default**
   - Cause: the static fallback inside `team.html` contained only 3 profile cards.
   - Impact: if JSON rendering did not complete, the page showed only the fallback cards.

2. **Team page dynamic rendering stopped before replacing the fallback**
   - Cause: `assets/js/humach-data-loader.js` called `formatAffiliation()` from the team renderer, but that helper existed only in `assets/js/humach-member-cv.js`, not in the data loader.
   - Impact: a runtime `ReferenceError` stopped the team page renderer, leaving only the 3 fallback cards visible.

3. **Team filters did not work correctly**
   - Cause 1: because the dynamic renderer stopped, filter initialization was not reached.
   - Cause 2: static fallback cards did not have `data-team-tokens`.
   - Cause 3: the filter tokens included the organization value `HUMACH Research`, which added the word `research` to every team card. That made the Research filter match too many cards.

4. **Data loading was too all-or-nothing**
   - Cause: one failed JSON fetch could prevent the full rendering pipeline from completing.
   - Fix: data files are now loaded independently. Missing/unavailable data files are skipped gracefully, and available sections still render.

5. **Old cached data could keep the bug visible**
   - Fix: the data cache version was bumped so browsers ignore the older cached JSON values.

## Files updated

- `team.html`
- `assets/js/humach-data-loader.js`
- `VALIDATION_REPORT.md`
- `FINAL_PACKAGE_MANIFEST.md`

## Main fixes applied

### Team fallback now includes all profiles

The static fallback in `team.html` now contains all 6 team records from `data/team.json`.

### Team fallback cards now include filter tokens

Each fallback card includes `data-team-tokens`, so filters can still work when the JSON layer is not available.

### Dynamic team renderer now includes `formatAffiliation()`

The team page renderer can now show entries such as:

```text
Leadership, HUMACH Research
```

instead of failing at runtime.

### Team filter tokens are now role-focused

The filter tokens no longer use the organization name, so `HUMACH Research` no longer causes every profile to match the `research` filter.

Expected team filter counts:

| Filter | Expected visible profiles |
|---|---:|
| All | 6 |
| Leadership | 1 |
| Research | 3 |
| Development | 2 |
| Interns | 3 |
| Alumni | 1 |

### Rendering is more fault tolerant

The rendering pipeline now wraps section renderers safely, so one section error does not prevent the rest of the website from loading.

## Preview

Run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/team.html
```

## Verification

Verification was performed for:

- JavaScript syntax
- JSON syntax
- internal asset/page links
- dynamic team rendering
- static fallback team profile count
- team filter tokens and expected filter counts
