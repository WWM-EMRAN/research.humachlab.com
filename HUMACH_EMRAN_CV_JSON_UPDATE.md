# Emran Ali CV JSON Population Update

This update fills the HUMACH printable member CV JSON for **Emran Ali** using information from the public website `https://emran.humachlab.com`.

## Updated Files

- `data/team.json`
  - Replaced the generic `research-lead` profile with Emran Ali's leadership profile.
  - Kept the existing ID `research-lead` so existing CV links continue to work.

- `data/member-cv.json`
  - Filled academic information.
  - Filled professional experience.
  - Filled certificates and courses.
  - Filled extracurricular / membership / volunteering / event activity.
  - Linked projects and publications using IDs.

- `data/projects.json`
  - Added Emran Ali's research and development project records.

- `data/publications.json`
  - Added Emran Ali's journal, conference, and poster publication records listed on the source website.

## CV Preview

Run:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/member-details.html#emran-ali
```

Use the **Print CV** button on the page to print or save as PDF.
