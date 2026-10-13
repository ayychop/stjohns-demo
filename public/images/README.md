# Images

## Logo

`logo.png` is the shop's logo and the master file. Replace it and restart
`npm run dev` (or rebuild): the header and footer copies are regenerated from it
automatically at three screen densities.

If `logo.png` is removed, the site shows a text "FOOD & WINE" wordmark instead.

## Photos (optional)

There are two photo slots. Until a file exists, the site shows a brand colour
block in its place, so nothing looks broken without them.

- `shop-front.jpg`: fills the photo block on the right of the hero, replacing the cream block with the grapes. Portrait works best.
- `aisle.jpg`: appears in Why Shop With Us, replacing the burgundy quote block. Portrait works best.

After adding a photo, run `npm run images` to shrink it for the web, then
restart `npm run dev` so the site picks it up.
