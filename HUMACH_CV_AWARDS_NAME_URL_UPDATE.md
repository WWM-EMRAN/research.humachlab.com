# HUMACH CV Awards and Name-Based URL Update

## Summary

This update adds an **Awards and Achievements** section to the printable member CV page and changes CV links so profiles are identified by a name-based URL hash instead of an internal role ID.

## Key changes

- Added `awardsAchievements` to `data/member-cv.json`.
- Populated Emran Ali’s awards and achievements from the previously supplied public profile source.
- Updated `member-details.html` rendering through `assets/js/humach-member-cv.js`.
- Added support for URL hashes such as:

```text
member-details.html#emran-ali
```

- Retained backward compatibility for older URLs such as:

```text
member-details.html?id=research-lead
```

- Added `slug` fields to `data/team.json` and `data/member-cv.json`.
- Updated team page card links to use name slugs.
- Updated the member CV sidebar to show the profile slug rather than the internal role-based ID.
- Bumped the JSON cache version so browsers refresh the updated data.

## Emran Ali awards added

- Bertelsmann Next Generation Tech Booster Scholarship
- AWS AI/ML Scholarship, Phase 2
- AWS AI/ML Scholarship, Phase 1
- Cotutelle Studentship
- Deakin University Postgraduate Research Scholarship (DUPRS)
- Best Presentation Award
- Science and Technology Fellowship (STF)
- Best Employee Award
- Country Topper (Bangladesh)
- Undergraduate Department Topper
- Intra-University Programming Contest Champion

## Preview

Run:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/member-details.html#emran-ali
```
