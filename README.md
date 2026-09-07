# S Escapes — Astro + TinaCMS

The S Escapes travel-planning website is now a static Astro site with a TinaCMS admin. The public design is preserved, while business content lives in structured JSON files that a non-technical client can edit safely.

## What the client can edit

- **Réglages du site** — brand name, phone, e-mail, hours, response promise, Instagram, navigation, footer, legal identity, and default SEO.
- **Page d’accueil** — hero imagery and copy, travel section, bespoke-planning steps, Hajj/Omra promotion, approach, proof points, travel stories intro, advisor note, testimonial, contact copy, and confirmation text.
- **Voyages & destinations** — publish/draft/archive status, home-page visibility and order, category, price, duration, images, ideal period, inclusions, preparation checklist, full itinerary, related trips, and SEO.
- **Carnets de voyage** — small editorial cards shown on the home page.
- **Page Hajj & Omra** — hero, Hajj/Omra comparison, preparation stages, practical information, packages, FAQs, callback copy, and SEO.
- **Politique de confidentialité** — page title, update date, sections, and SEO.
- **Media Manager** — upload and select images in `public/images`.

The lead delivery endpoint and any CRM credentials intentionally remain developer-controlled in `public/lead-config.js`; secrets must never be entered in TinaCMS or committed to the browser bundle.

## Local editing

```bash
npm install
npm run dev
```

Open:

- Website: `http://localhost:4321`
- Admin: `http://localhost:4321/admin/index.html`

The local admin saves directly to the JSON files in `content/`. Use the collection menu in the top-left corner, choose a document, edit the structured fields, and click **Save**.

## Checks and builds

```bash
npm run check
npm run build
npm run preview
```

`npm run build` creates a local Tina admin and builds the static Astro site into `dist/`. The Astro output keeps `.html` files for compatibility, while all internal links use clean URLs; Firebase Hosting’s existing `cleanUrls` setting serves both correctly.

## Connect TinaCloud for the client

1. Put this project in the Git repository used for production.
2. Create a TinaCloud project and connect that repository and its production branch.
3. Copy `.env.example` to `.env` locally and set:

   ```env
   TINA_PUBLIC_CLIENT_ID=your_tina_project_client_id
   TINA_TOKEN=your_read_only_token
   PUBLIC_SITE_URL=https://s-escapes.com
   ```

4. Add the same variables to the deployment environment.
5. Use `npm run build:cloud` as the production build command.
6. Invite the client as a TinaCloud user and give them the production `/admin/index.html` URL.

The default `main` branch can be overridden with `TINA_BRANCH` or `GITHUB_BRANCH` for previews.

## Firebase deployment

The existing `firebase.json` already deploys `dist/` with clean URLs and long-lived asset caching.

```bash
npm run build:cloud
firebase deploy --only hosting
```

Before accepting real enquiries, change `public/lead-config.js` from `demo` to `endpoint` and provide a secure HTTPS endpoint. The endpoint must accept the structured `s-escapes.lead.v1` payload and handle e-mail/CRM credentials server-side.

## Project map

```text
content/                  Client-managed content
  trips/                 Voyages & séjours (TinaCMS collection)
  destinations/          Destinations & voyages
  pages/                  Home, Hajj/Omra, privacy
  settings/               Global site settings
  stories/                Home-page travel stories
src/
  components/             Shared Astro UI
  layouts/                SEO and document shell
  lib/content.ts          Typed content loading and sorting
  pages/                  Astro routes
tina/config.ts            French-labelled client admin schema
public/images/            Tina media library
```

## Launch checklist

1. Complete the legal entity, registration, address, data retention, hosting, and processor information in **Réglages du site** and **Politique de confidentialité**.
2. Confirm current dates, prices, availability, and Hajj/Omra conditions.
3. Replace the demo testimonial with approved client words or switch it off.
4. Connect and test the secure lead endpoint.
5. Confirm the production domain and TinaCloud environment variables.
6. Invite the client and run a supervised first edit/publish session.
