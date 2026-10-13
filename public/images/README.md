# Shop photos

The three JPGs here are coloured placeholders. Replace them with real photos,
keeping these exact file names:

- `shop-front.jpg`: hero background, polaroids and the social share image. Landscape, the red awning shot.
- `aisle.jpg`: Why Shop With Us, the Caribbean and Polish shelves, and polaroids. Portrait works best.
- `produce.jpg`: Fresh every morning, and polaroids. Portrait works best.

Then run `npm run images` from the project root. It resizes the hero to at most
1920px wide and the others to 1200px, and recompresses them.

If you have a dedicated photo for the Caribbean or Polish shelf, add it here and
point the matching `src` in the `SHELVES` list in `src/App.jsx` at it.

## Logo

`logo.png` is the shop's logo and the master file. Everything else is generated
from it by `npm run brand`:

- `logo-header.webp`, `-2x`, `-3x`: the header logo at 44px tall for each screen density.
- `logo-footer.webp`, `-2x`, `-3x`: the footer logo at 96px tall.
- `logo.webp`: full size, for the background watermark.
- the favicons in `public/`, which are the big "F" cropped from the logo.

The master is 1062x217, so the 3x footer file is enlarged past its source size.
A larger master would make it crisper. If the logo's layout changes, update the
favicon crop numbers in `scripts/brand-assets.mjs`.
