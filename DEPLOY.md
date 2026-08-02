# Children of Hope — site guide

This site is built with **[Astro](https://astro.build)** (a modern static-site generator) and
designed to be hosted on **Cloudflare Pages** (free tier). It replaces the old Jekyll/Ruby setup.

- **No Ruby.** You only need Node.js 22+ (Astro 6 requires 22.12 or newer).
- **Output:** a folder of plain static HTML/CSS in `dist/` that Cloudflare serves worldwide.
- **Design:** the "Sunny Meadow" system (`src/styles/tokens.css`).

---

## 1. Run it locally

```bash
nvm use            # uses Node 22 (see .nvmrc), or install Node 22.12+ any way you like
npm install        # one time
npm run dev        # live preview at http://localhost:4321
npm run build      # produces the production site in dist/
npm run preview    # serves the built dist/ to double-check before deploying
```

---

## 2. Deploy to Cloudflare Pages (free)

This site uses Cloudflare Pages in **direct upload** mode: you build on your own machine and
upload the finished `dist/` folder. There is no Git integration, so **pushing to GitHub does not
deploy anything** — you deploy by running the command below.

The Pages project is `childrenofhope` (default URL: https://childrenofhope.pages.dev).

### Deploy the staging site
```bash
npm install                                   # first time only
PUBLIC_NOINDEX=true npm run build             # note the flag — see below
npx wrangler pages deploy dist --project-name=childrenofhope --branch=modernize-astro-cloudflare
```

**Why the `PUBLIC_NOINDEX=true` prefix matters.** Astro is a static site generator: it bakes
settings in at *build* time. Because the build runs here and not on Cloudflare, setting
`PUBLIC_NOINDEX` in the Cloudflare dashboard would do nothing. It has to be on the build command.
The flag makes every page emit `<meta name="robots" content="noindex, nofollow">` and serves a
`Disallow: /` robots.txt, so the staging copy never competes with the live site in search results.
Leave `PUBLIC_CF_BEACON_TOKEN` unset on staging so its traffic stays out of the analytics.

Wrangler authenticates via the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment
variables. The token needs **Account → Cloudflare Pages → Edit**; adding or changing DNS records
additionally needs **Zone → DNS → Edit** on `childrenofhopecdc.com`.

### Staging at new.childrenofhopecdc.com
The custom domain is already attached to the project. It needs one DNS record in the
`childrenofhopecdc.com` zone (Cloudflare dashboard → DNS → Records → Add record):

| Type  | Name  | Target                     | Proxy status   |
|-------|-------|----------------------------|----------------|
| CNAME | `new` | `childrenofhope.pages.dev` | Proxied (orange) |

SSL is issued automatically once the record exists. This only adds a new subdomain — the apex and
`www` records that serve the live site are untouched.

### DNS cutover (when staging looks right)
1. Merge the Astro branch into `master`.
2. Rebuild and redeploy **without** the noindex flag:
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=childrenofhope --branch=modernize-astro-cloudflare
   ```
3. In the Pages project → **Custom domains**, add `childrenofhopecdc.com` and `www`. Cloudflare
   repoints the existing proxied records away from GitHub Pages.
4. Turn off the GitHub Pages source in the repo settings, and delete the `new` CNAME once you no
   longer want the staging URL.

---

## 3. Free features to turn on

### Cloudflare Web Analytics (privacy-friendly, no cookie banner)
Option A (simplest): Pages project → **Metrics / Web Analytics → Enable**. Cloudflare auto-injects
the beacon — nothing else to do.

Option B (explicit): grab the beacon **token** from Cloudflare Web Analytics and pass it on the
build command (see the note in section 2 — dashboard environment variables have no effect in
direct upload mode, because the build happens on your machine):
```bash
PUBLIC_CF_BEACON_TOKEN=<your-token> npm run build
```
The site reads this in `src/layouts/BaseLayout.astro` and only emits the beacon when it's set.

### Contact form (optional — free, no backend)
The Contact page form uses [Web3Forms](https://web3forms.com) (free, unlimited, no account login —
you just get an access key tied to an email):
1. Get a free **access key** at web3forms.com (enter the email that should receive submissions).
2. Pass it on the build command, then redeploy:
   ```bash
   PUBLIC_WEB3FORMS_KEY=<your-access-key> npm run build
   ```
3. The form on `/contact` activates. Until then, the Contact page shows a "Reach us
   directly" panel with the phone number and email instead — so it's never broken.

Flags combine, so a full staging build with everything on looks like:
```bash
PUBLIC_NOINDEX=true PUBLIC_WEB3FORMS_KEY=<key> npm run build
```

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
