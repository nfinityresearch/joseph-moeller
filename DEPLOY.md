# Deploying to Cloudflare Pages

This app works on Cloudflare Pages (static hosting) with no backend required.

## Admin CMS (/admin)

The admin panel at `/admin` lets you edit site content (site settings, quotes, essays, biography). It **requires the Express server** to run — it will not work on Cloudflare Pages. Use it when running locally or on a server (e.g. Replit, VPS).

Set the `ADMIN_PASSWORD` environment variable/secret to protect the admin. Only users with that password can log in.

## Build

```bash
npm run build:pages
```

Output goes to `dist/public/`. Configure Cloudflare Pages to use:
- **Build command:** `npm run build:pages`
- **Build output directory:** `dist/public`

## Contact Form (Formspree)

On Cloudflare Pages there is no `/api/contact` backend. To enable the contact form:

1. Sign up at [formspree.io](https://formspree.io) (free tier available)
2. Create a new form and copy your form endpoint (e.g. `https://formspree.io/f/xxxxx`)
3. Edit `content/site.json` and replace `YOUR_FORM_ID` in `contactFormEndpoint` with your Formspree form ID

Example:
```json
"contactFormEndpoint": "https://formspree.io/f/abc123xyz"
```

## Images

Ensure these exist in `client/public/images/`:
- `enso.png` – homepage quote background
- `author-photo.jpg` – biography page
- `covers/*.jpg` – essay cover images (see `content/essays.json` for paths)
