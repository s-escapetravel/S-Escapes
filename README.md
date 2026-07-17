# S Escapes website

Production-ready, two-part website for S Escapes:

- `index.html`: ready-made journeys and bespoke travel planning
- `hajj-omra.html`: dedicated Hajj and Omra experience
- `voyages/*.html`: dedicated, shareable pages for every featured voyage

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

The deployable files are generated in `dist/`. Both pages are included in the build.

## Lead delivery and forms

Every lead form submits the same structured `s-escapes.lead.v1` payload through `src/lead-service.js`. It includes the travel brief, page/source context, the exact CTA, consent, an internal-team brief, and a branded customer-confirmation template. The Netlify `leads` function turns this into a formatted, reply-ready e-mail for the agency and sends the traveller confirmation.

The public configuration layer targets the same-site Netlify Functions:

```js
window.S_ESCAPES_LEAD_CONFIG = {
  mode: 'endpoint',
  endpoint: '/.netlify/functions/leads',
  reviewEndpoint: '/.netlify/functions/reviews',
  method: 'POST',
  headers: {},
  internalEmail: 'escapes.travelplanner@gmail.com',
  responseTime: 'Réponse sous 24 h ouvrées'
}
```

Set these Netlify environment variables before the first production deploy:

- `RESEND_API_KEY`: server-side Resend API key.
- `RESEND_FROM_EMAIL`: a verified sender, for example `S Escapes <bonjour@your-domain.fr>`.
- `LEAD_RECIPIENT`: the agency inbox; defaults to `escapes.travelplanner@gmail.com` if omitted.
- `SITE_URL`: the canonical production URL, used by the moderation e-mail.
- `GITHUB_CONTENTS_TOKEN`: fine-grained GitHub token with Contents read/write permission for this repository.
- `GITHUB_REPOSITORY`: `owner/repository` for this site.
- `GITHUB_BRANCH`: the content branch (defaults to `main`).
- `SITE_ORIGIN`: optional strict browser-origin allowlist, for example `https://s-escapes.fr`.

Never place any of these values in `public/lead-config.js`, Tina public variables, or the repository.

## Traveller reviews and TinaCMS moderation

The testimonial area now has a review CTA and a photo-aware submission flow. A submitted review is stored as a pending JSON document in `content/testimonials/`; attached photos are stored in `public/uploads/reviews/`. The customer only sees reviews whose `status` is `approved`.

1. Add the repository to TinaCloud and configure the Tina variables required by its project (`NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and `NEXT_PUBLIC_TINA_BRANCH`).
2. Deploy through Netlify. Tina creates its editor at `/admin/` during `npm run build`.
3. The agency receives an e-mail for each new review and opens `/admin/`.
4. In **Avis voyageurs**, change **Décision** from `pending` to `approved` to publish it, or to `rejected` to keep it private. Save the document; Tina commits the change and the linked Netlify deploy rebuilds the site.

Customer e-mails remain private in Tina and are never included in the public review API. Photos require separate consent before they can be uploaded and only render after approval.

## Content updates

- Destination and voyage-page content lives in `src/trip-data.js`.
- Travel styling lives in `src/travel.css`.
- Hajj and Omra styling lives in `src/spiritual.css`.
- Budget indications come from the supplied S Escapes flyers and should be reviewed before each campaign.

## SEO, analytics and media

- Replace the placeholder `https://s-escapes.fr` domain in canonical tags and `public/sitemap.xml` with the final production domain before launch.
- `public/analytics.js` is a consent-ready, provider-neutral event queue. It captures atlas filters, voyage views, planner starts/completions, formula requests, and contact clicks without storing credentials in the browser.
- New or replacement imagery should be delivered in AVIF or WebP variants where available. Hero images should be sized to their rendered context and checked on mobile before publishing.

## Deployment checklist

1. Confirm current offer dates, prices, and availability.
2. Confirm the e-mail address, phone number, Instagram URL, and office hours.
3. Add the Netlify and TinaCMS environment variables listed above, then send a real test enquiry and test review.
4. Complete `confidentialite.html` with the legal entity, hosting, retention, legal basis, processors, and official contact details.
5. Add the final production domain to the canonical and sitemap configuration.
