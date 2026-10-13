# stjohns-demo

Marketing site for St. John's Mini Market (Food & Wine), 90 St. Johns Ave, London NW10 4EG.

React + Vite + Tailwind CSS, with Framer Motion and Lenis for the animations.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run images   # shrink the photos in public/images to web sizes
npm run logo     # redraw the logo after editing scripts/logo-paths.mjs
```

`dev` and `build` first rebuild `public/logo.svg`, the share image and the phone icon from the logo.

## Before going live

- **Domain:** set `VITE_SITE_URL` in `.env`. It feeds the canonical URL, the Open Graph and Twitter tags and the LocalBusiness schema.
- **Logo and photos:** see `public/images/README.md`.
- **Share image:** the Open Graph image in `index.html` is the logo on a baby-blue card (`public/og-image.png`) until a shop-front photo exists.
- **Reviews:** the three quotes in `REVIEWS` (`src/extras.jsx`) are shown with a "Google review" tag. Each must be a real review, word for word, from the shop's Google listing.
- **Map pin:** the `geo` coordinates in `index.html` are approximate.
- **Legal:** `privacy.html` and `terms.html` are starting-point copy and should be checked by the shop owner.

## Design system

The palette is locked to four colours, defined once in `src/index.css`: baby
blue `#5FB4E0`, cream `#F5EFE0`, burgundy `#6B1E2E` and deep navy `#1A2340`.
Lighter and deeper shades (the off-white used for cards, the sand under What We
Sell, the deeper sky at the top of the hero) are tints of those. The one
exception is gold `#D4A017`, used only in `KenteLine` (`src/brand.jsx`): a 12px
ribbon of thin vertical stripes in the four brand colours and gold, after the
stripes of Kente cloth. It is the signature divider and appears four times,
always the same: across the top of the page, under the hero, above
Why Shop With Us and under the footer.

The page is meant to read as one continuous piece, not stacked blocks:

- Sections never meet at a hard edge. Where the colour changes, an 80px `Fade`
  (`src/App.jsx`) or the section's own gradient melts one into the next.
- Every section uses the same padding, `SECTION` in `src/shop.js`: 48px on
  phones, 72px on desktop.
- Every photo gets the same warm grade and vignette from the `photo` class in
  `src/index.css`.
- `GrapeWatermark` (`src/brand.jsx`) is the logo's bunch of grapes, used very
  large and faint (about 13% strength) behind the hero, What We Sell and the footer.
- There are three layouts: mobile under 768px, tablet from 768px to 1024px and
  desktop above 1024px (the `desk` breakpoint in `src/index.css`). The polaroid
  strip and the What We Sell strip are swiped on mobile and tablet; the grape
  watermark is 150px, 250px and 400px wide.

The logo is an SVG drawn from outlines, so it is sharp at any size and needs no
font. `scripts/logo-paths.mjs` holds its wording, layout and colours and writes
the shapes to `src/logo-paths.js`; `Logo` and `Wordmark` in `src/brand.jsx` draw
them. The lettering is Archivo Black, which is free to use under the Open Font
Licence.

## Where things live

- `index.html`: meta tags, LocalBusiness schema, the storefront opening sequence.
- `src/shop.js`: shop details (phone, address, hours), shared button and heading styles, the open/closed clock and the cookie choice.
- `src/brand.jsx`: the logo, the grape watermark and the Kente line.
- `src/App.jsx`: the main page sections.
- `src/extras.jsx`: polaroid strip, reviews, FAQ, cookie banner, mobile bar and floating buttons.
- `src/motion.jsx`: shared animation helpers.
- `src/index.css`: colours, fonts, the awning stripe and polaroid washes.
