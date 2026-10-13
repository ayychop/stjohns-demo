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

The palette is locked to four colours, defined once in `src/index.css`: baby
blue `#5FB4E0`, cream `#F5EFE0`, burgundy `#6B1E2E` and deep navy `#1A2340`.
Lighter shades (such as the off-white used for cards) are tints of those; there
is no brown, orange, yellow or red anywhere. Two motifs tie the pages together,
both in `src/brand.jsx`: the grape line drawings, and `KentePattern`, a faint
texture that borrows the geometry of Ghanaian Kente cloth in burgundy lines
only. The pattern is deliberately limited to one section: What We Sell.

## Where things live

- `index.html`: meta tags, LocalBusiness schema, the storefront opening sequence.
- `src/shop.js`: shop details (phone, address, hours), shared button and heading styles, the open/closed clock and the cookie choice.
- `src/brand.jsx`: the logo (with its text fallback), the grape illustrations and the Kente pattern.
- `src/App.jsx`: the main page sections.
- `src/extras.jsx`: polaroid strip, reviews, FAQ, cookie banner, mobile bar and floating buttons.
- `src/motion.jsx`: shared animation helpers.
- `src/index.css`: colours, fonts, the awning stripe and polaroid washes.
