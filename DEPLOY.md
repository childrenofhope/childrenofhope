# Children of Hope — site guide

This site is built with **[Astro](https://astro.build)** (a modern static-site generator) and
designed to be hosted on **Cloudflare Pages** (free tier). It replaces the old Jekyll/Ruby setup.

- **No Ruby.** You only need Node.js 20+.
- **Output:** a folder of plain static HTML/CSS in `dist/` that Cloudflare serves worldwide.
- **Design:** the "Sunny Meadow" system (`src/styles/tokens.css`).

---

## 1. Run it locally

```bash
nvm use            # uses Node 20 (see .nvmrc), or install Node 20+ any way you like
npm install        # one time
npm run dev        # live preview at http://localhost:4321
npm run build      # produces the production site in dist/
npm run preview    # serves the built dist/ to double-check before deploying
```

---

## 2. Deploy to Cloudflare Pages (free)

1. Push this repo to GitHub (or GitLab).
2. In the **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION = 20`
4. Save & Deploy. Every push to the main branch auto-deploys; every branch/PR gets its own
   **preview URL** so changes can be checked before going live.

### Custom domain + DNS cutover
1. In the Pages project → **Custom domains → Set up a custom domain** → `childrenofhopecdc.com`
   (and `www` if desired).
2. Point DNS at Cloudflare. Easiest: move the domain's **nameservers** to Cloudflare (free plan),
   then the custom domain attaches automatically with free SSL. (The `public/CNAME` file is a
   leftover from GitHub Pages and is harmless — Cloudflare ignores it.)
3. Verify the site on the Pages preview URL **before** repointing DNS, so there's zero downtime.

---

## 3. Free features to turn on

### Cloudflare Web Analytics (privacy-friendly, no cookie banner)
Option A (simplest): Pages project → **Metrics / Web Analytics → Enable**. Cloudflare auto-injects
the beacon — nothing else to do.

Option B (explicit): grab the beacon **token** from Cloudflare Web Analytics and add an environment
variable to the Pages project:
```
PUBLIC_CF_BEACON_TOKEN = <your-token>
```
The site reads this in `src/layouts/BaseLayout.astro` and only emits the beacon when it's set.

### Contact form (optional — free, no backend)
The Contact page form uses [Web3Forms](https://web3forms.com) (free, unlimited, no account login —
you just get an access key tied to an email):
1. Get a free **access key** at web3forms.com (enter the email that should receive submissions).
2. Add an environment variable to the Pages project:
   ```
   PUBLIC_WEB3FORMS_KEY = <your-access-key>
   ```
3. Redeploy. The form on `/contact` activates. Until then, the Contact page shows a "Reach us
   directly" panel with the phone number and email instead — so it's never broken.

---

## 4. How to update content (no coding required for most of this)

### Add a monthly newsletter
1. Drop the PDF in `public/assets/newsletters/<school-year>/` (e.g. `2025-2026/COH_June_2026_Newsletter.pdf`).
   Use underscores, no spaces.
2. Add one line at the top of that year's list in **`src/data/newsletters.json`**:
   ```json
   { "label": "June 2026", "href": "/assets/newsletters/2025-2026/COH_June_2026_Newsletter.pdf" }
   ```
   This automatically updates the Newsletter page, the Announcements archive, and the home page.

### Post an announcement
Add an entry to **`src/data/announcements.json`** (newest shows first; it also feeds the home page
and the RSS feed):
```json
{ "date": "2026-08-01", "title": "First day of school is August 4", "summary": "...", "href": "/calendar" }
```
Add `"featured": true` to highlight one at the top of the Announcements page.

### Update the calendar
Edit the `events` array in **`src/pages/calendar.astro`**, and drop the new calendar PDF in
`public/assets/forms/<year>/`.

### Update teacher bios / forms
- Teachers: edit the `staff` array in **`src/pages/about/teachers-and-staff.astro`**; put photos in
  `public/assets/images/teachers/`.
- Forms: edit the `docs` array in **`src/pages/forms.astro`**; put PDFs in `public/assets/forms/<year>/`.

### Add real photos (hero / faith / philosophy)
These currently show tasteful placeholders. To use a real photo, drop an image in
`public/assets/images/` and pass it to the `<ImageSlot src="/assets/images/your-photo.jpg" ... />`
in the relevant page (`src/pages/index.astro`, `src/pages/about/philosophy.astro`).

---

## 5. Notes

- **SEO/URLs preserved.** All old page URLs (`/about/philosophy`, `/about/teachers-and-staff`,
  `/calendar`, `/forms`, `/newsletter`, `/announcements`, `/contact`) and every `/assets/...` PDF and
  image link still work. The old `/feed.xml` redirects to the new `/rss.xml` (see `public/_redirects`).
- **Two long-broken links fixed.** The August 2015 and April 2017 newsletter PDFs had filenames that
  didn't match their links on the old site (a space vs. underscore); both were renamed and now work.
- **Removed:** jQuery, Semantic UI (~600 KB), all Ruby/Jekyll files. Fonts (Inter, Archivo Black,
  Permanent Marker) are now self-hosted via Fontsource — no Google Fonts CDN call.
