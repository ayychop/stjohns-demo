# Images

## Logo

`logo.png` is the shop's logo and the master file. Replace it and restart
`npm run dev` (or rebuild): the header and footer copies are regenerated from it
automatically at three screen densities.

If `logo.png` is removed, the site shows a text "FOOD & WINE" wordmark instead.

## Photos

The photos are stock photos from Unsplash, saved in this folder so the site
loads nothing from anyone else's servers. They stand in until the shop's own
photos are taken. To replace one, save the new photo over it with the same file
name, then run `npm run images` to shrink it for the web.

| File | Where it shows | Unsplash photo id |
| --- | --- | --- |
| `produce-crate.jpg` | polaroid | `1599660869952-3852916ff82b` |
| `plantain.jpg` | polaroid | `1781125694557-bb263b24f902` |
| `polish-deli.jpg` | polaroid | `1460122109654-7e46ab4fc9b9` |
| `spices.jpg` | polaroid | `1580116270858-8a0d62b15426` |
| `fresh-bread.jpg` | polaroid | `1535912562650-f95ddac3f4a7` |
| `tropical-fruit.jpg` | polaroid | `1574661062600-4a3cd81d2375` |
| `shop-aisle.jpg` | polaroid | `1534723452862-4c874018d66d` |
| `caribbean-shelf.jpg` | Caribbean shelf card | `1757283961582-ab596b0ca595` |
| `polish-shelf.jpg` | Polish shelf card | `1769170849458-2d739ccc1a57` |
| `fresh-produce.jpg` | Fresh every morning card | `1632776350300-11016768b521` |
| `shop-interior.jpg` | Why shop with us | `1719427129658-95dcc15f2977` |

The polaroids are listed in `POLAROIDS` (`src/extras.jsx`) and the cards in
`SHELVES` (`src/App.jsx`). If a photo is missing, a warm block in the brand
colours shows instead.

`shop-front.jpg` is not here yet. When a photo of the shop itself is added
under that name, it sits behind the baby-blue veil in the hero. Restart
`npm run dev` after adding it.
