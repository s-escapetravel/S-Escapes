# S Escapes handoff runbook

This project is a Vite site deployed on Netlify. TinaCMS is used only for editorial administration; the public site remains a static build. Review submissions are written to `content/testimonials/` through a Netlify Function, then appear in Tina with a `pending` status.

## Before handing over

1. Confirm the GitHub repository is private and that the client has accepted access or the ownership transfer.
2. Create the TinaCloud project against the repository and the `main` branch. Copy the Tina client ID and build token into the client’s password manager.
3. Create a Netlify site from the GitHub repository. Do not upload `dist/` manually. Netlify reads `netlify.toml` and uses `npm run build`.
4. Add the variables from `.env.example` to Netlify **Site configuration → Environment variables**. Secrets must be entered in Netlify, never committed.
5. Run one production deploy. The build intentionally fails on Netlify if `NEXT_PUBLIC_TINA_CLIENT_ID` or `TINA_TOKEN` is missing, so `/admin/` cannot silently disappear.

## Netlify variables

| Variable | Type | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | build variable | Tina editor project ID |
| `NEXT_PUBLIC_TINA_BRANCH` | build variable | Usually `main` |
| `TINA_TOKEN` | secret build variable | Tina schema/content build access |
| `RESEND_API_KEY` | secret function variable | Sends lead and moderation e-mails |
| `RESEND_FROM_EMAIL` | function variable | Verified Resend sender |
| `LEAD_RECIPIENT` | function variable | Client inbox for project requests |
| `SITE_URL` | function variable | Links in moderation e-mails |
| `SITE_ORIGIN` | function variable | Optional strict browser-origin check |
| `GITHUB_CONTENTS_TOKEN` | secret function variable | Lets review submissions create repository content |
| `GITHUB_REPOSITORY` | function variable | `owner/S-Escapes` after transfer |
| `GITHUB_BRANCH` | function variable | Usually `main` |

The GitHub token should be a fine-grained token owned by the client, limited to this repository with Contents read/write permission. Rotate the current maintainer’s token after transfer.

## TinaCMS workflow

- Open `https://your-domain.example/admin/` and sign in through TinaCloud.
- Open **Avis voyageurs**.
- Change `Décision` from `pending` to `approved` to publish an avis, or `rejected` to keep it private.
- Save. Tina commits the JSON decision to GitHub; Netlify rebuilds the site from that commit.
- Keep the private e-mail field for internal verification. It is never returned by the public reviews function.

## GitHub ownership transfer

The current canonical repository is [Jeremy-Emebe/S-Escapes](https://github.com/Jeremy-Emebe/S-Escapes). When the client is ready:

1. GitHub repository → **Settings → General → Danger Zone → Transfer ownership**.
2. Enter the client’s GitHub username or organization and confirm the repository name.
3. Have the client accept the transfer and make themselves the administrator.
4. Update the Netlify site’s repository connection if GitHub shows a new owner.
5. Update `GITHUB_REPOSITORY` and create a new client-owned `GITHUB_CONTENTS_TOKEN`.
6. Confirm the TinaCloud project points to the transferred repository and `main` branch.
7. Remove the original maintainer’s repository access and revoke any old Netlify, Tina, Resend, or GitHub credentials.

Do not transfer a repository while a review submission is being processed. Wait for its GitHub commit and the following Netlify deploy to finish.

## First handoff test

1. Submit a test “Commencer mon projet” request and confirm the formatted e-mail arrives at `LEAD_RECIPIENT` with the customer e-mail as Reply-To.
2. Submit a test review without a photo, then with one photo and explicit photo consent.
3. Approve the review in Tina and confirm it appears in the testimonial section after the Netlify deploy.
4. Reject another review and confirm it does not appear publicly.
5. Delete test content from Tina and remove test e-mails from the inbox according to the client’s retention policy.

For local work, copy `.env.example` to `.env`, fill only development values, run `npm install`, then `npm run dev`. `npm run build` skips Tina locally when credentials are absent, but Netlify production builds fail clearly until Tina credentials are present.
