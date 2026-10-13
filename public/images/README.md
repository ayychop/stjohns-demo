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
