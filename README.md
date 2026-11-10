# HERMITAGE — Private Residence · Bedroom Interior

An interactive, mobile-first presentation of four rendered viewpoints of one bedroom.
Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lucide · yet-another-react-lightbox.

The site is a **static export**: `npm run build` produces a plain `out/` folder that can be hosted anywhere.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build + local preview:

```bash
npm run build        # writes ./out
npm start            # serves ./out (via `npx serve`)
```

## Configuration

Copy `.env.example` to `.env.local` (or set these in Vercel → Project → Settings → Environment Variables):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Studio WhatsApp number for **Discuss Your Project**, international format, digits only (e.g. `996555123456`). If empty, the button opens WhatsApp's share picker with the prefilled message. |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the deployment, e.g. `https://hermitage-bedroom.vercel.app`. Used for the WhatsApp/social link preview image. On Vercel, the production URL is detected automatically if this is empty. |

The prefilled WhatsApp message and studio text live in `src/config/site.ts`.

Environment variables are baked in at build time, so rebuild or redeploy after you change them.

## Deploy (Vercel)

Import the repository, keep the default settings, add the two environment variables above, and deploy.
Vercel detects `output: "export"` and serves the static files.

## Images

Original renders: `public/images/bedroom/angle-01.jpg … angle-04.jpg` (never modified).

```bash
npm run images
```

This regenerates the AVIF and WebP derivatives in `public/images/bedroom/optimized/` and the blur placeholders and srcsets in `src/data/image-manifest.json`. Images are never upscaled. If you replace the renders with higher-resolution exports (2400 px or wider is recommended), run this command again and larger sizes (1600 and 2400 px) are generated automatically.

Viewpoint titles, captions, crop focal points, walkthrough camera moves and hotspots are in `src/data/views.ts`. Hotspot positions are fractions (0–1) of image width and height. Hotspot texts only describe what is visible in the renders.

## Structure

```
src/
  app/            layout (fonts, metadata), page, global styles, icon
  components/
    Experience    page composition + shared state (view index, overlays)
    Hero          full-screen opening with loader hand-off
    ViewExplorer  four-view stage: crossfade/zoom transitions, swipe/drag, arrows,
                  keyboard, progress indicator, hotspots + detail panel
    Walkthrough   guided presentation: virtual camera pan/zoom inside each render + crossfades
    Gallery       featured image + thumbnail navigation
    RoomLightbox  fullscreen viewer (pinch / double-tap / wheel zoom, swipe), lazy-loaded
    ProjectInfo, ClosingCTA, SiteHeader, SiteFooter, Loader, Reveal, RoomImage
  data/           views + hotspots, generated image manifest
  lib/frame.ts    crop geometry (cover around a focal point, never distorts)
scripts/optimize-images.mjs
```
