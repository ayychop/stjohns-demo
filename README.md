# stjohns-demo

Marketing site for St. John's Mini Market (Food & Wine), 90 St. Johns Ave, London NW10 4EG.

React + Vite + Tailwind CSS, with Framer Motion and Lenis for the animations.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run images   # shrink the photos in public/images to web sizes
```

## Before going live

- **Domain:** set `VITE_SITE_URL` in `.env`. It feeds the canonical URL, the Open Graph and Twitter tags and the LocalBusiness schema.
- **Photos:** replace the three placeholder files in `public/images/` (see the README there), then run `npm run images`.
- **Reviews:** the three reviews in `src/extras.jsx` are samples and are labelled "Sample review" on the page. Swap in real ones and set `sample: false`.
- **WhatsApp:** `whatsapp` in `src/shop.js` is a placeholder number.
- **Map pin:** the `geo` coordinates in `index.html` are approximate.
- **Legal:** `privacy.html` and `terms.html` are starting-point copy and should be checked by the shop owner.

## Where things live

- `index.html`: meta tags, LocalBusiness schema, preloader.
- `src/shop.js`: shop details (phone, address, hours), the open/closed clock and the cookie choice.
- `src/App.jsx`: the main page sections.
- `src/extras.jsx`: polaroid strip, reviews, FAQ, cookie banner, mobile bar and floating buttons.
- `src/motion.jsx`: shared animation helpers.
- `src/index.css`: colours, fonts, grain, scrollbar and keyframes.
