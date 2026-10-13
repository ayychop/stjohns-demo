# stjohns-demo

Marketing site for St. John's Mini Market (Food & Wine), 90 St. Johns Ave, London NW10 4EG.

React + Vite + Tailwind CSS, with Framer Motion and Lenis for the animations.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run images   # shrink the photos in public/images to web sizes
```

`dev` and `build` first regenerate the logo files from `public/images/logo.png`.

## Before going live

- **Domain:** set `VITE_SITE_URL` in `.env`. It feeds the canonical URL, the Open Graph and Twitter tags and the LocalBusiness schema.
- **Logo and photos:** see `public/images/README.md`.
- **Share image:** the Open Graph image in `index.html` is the logo until a shop-front photo exists.
- **WhatsApp:** `whatsapp` in `src/shop.js` is a placeholder number.
- **Map pin:** the `geo` coordinates in `index.html` are approximate.
- **Legal:** `privacy.html` and `terms.html` are starting-point copy and should be checked by the shop owner.

## Design system

The palette is five colours taken from the logo, defined once in `src/index.css`:
baby blue, cream, burgundy, navy and warm off-white. Nothing else is used.
Two motifs tie the pages together: the grape line drawings in `src/brand.jsx`,
and the faint African textile weave (`.textile` in `src/index.css`), which is
deliberately limited to two places.

## Where things live

- `index.html`: meta tags, LocalBusiness schema, preloader.
- `src/shop.js`: shop details (phone, address, hours), shared button and heading styles, the open/closed clock and the cookie choice.
- `src/brand.jsx`: the logo (with its text fallback) and the grape illustrations.
- `src/App.jsx`: the main page sections.
- `src/extras.jsx`: FAQ, cookie banner, mobile bar and floating buttons.
- `src/motion.jsx`: shared animation helpers.
- `src/index.css`: colours, fonts, the textile pattern and scalloped edge.
