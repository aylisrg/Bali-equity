# Land Listings Admin Guide

The land catalog is managed through a built-in admin panel at
**https://equity-bali.com/admin** — no subscriptions, no external services.
Listings are stored as JSON files in this GitHub repository
(`content/land/*.json`), photos live in `public/images/land/`.

## How publishing works

1. Open `/admin` and sign in (see below).
2. Create or edit a listing in **Land Plots** and press **Publish**.
3. The change is committed to the `main` branch, and Vercel automatically
   rebuilds the site. **The update appears on the live site in ~2 minutes.**

## Signing in

The admin uses your GitHub account:

1. Open https://equity-bali.com/admin and choose **Sign in with GitHub** →
   **Use a personal access token**.
2. Follow the link in the dialog — GitHub opens the token page with the
   required `repo` scope pre-selected. Generate the token and paste it in.
3. The token is remembered in this browser. Treat it like a password —
   anyone with it can edit the repository.

Your GitHub account must have write access to `aylisrg/Bali-Equity`.

## Filling in a listing

- **Coordinates** — right-click the plot location in Google Maps and click the
  coordinates to copy them. First number is latitude, second is longitude.
- **Size** is in ares (1 are = 100 m²). Price per are is calculated
  automatically.
- **Photos** — first photo is the cover. Use WebP or JPEG, **max 1600 px wide
  and under 300 KB** — the site serves images exactly as uploaded, without
  resizing.
- **Draft** hides a listing from the site while you work on it.
- **Featured** pins a listing to the top of the catalog and shows it on the
  homepage.
- **Sold** listings stay on the site with a "Sold" badge — they build trust
  and rank in search. Don't delete them.

## Plot boundary polygons

Boundary polygons (the gold outline on the detail-page map) are optional and
not editable from the admin yet. To add one, edit the plot's JSON file in
`content/land/` and add a `boundary` array of `{ "lat": ..., "lng": ... }`
points (minimum 3, in walking order).

## Updating the admin itself

The admin app is a single vendored file, `public/admin/sveltia-cms.js`
([Sveltia CMS](https://github.com/sveltia/sveltia-cms), MIT). To upgrade:

```bash
npm run cms:update
git add public/admin/sveltia-cms.js package.json package-lock.json
git commit -m "Update Sveltia CMS"
```

Optional later upgrade: one-click OAuth login (instead of the token) by
deploying [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) to a
free Cloudflare Worker and adding `base_url` to `public/admin/config.yml`.
