# Images

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
| `fresh-produce.jpg` | Fresh fruit and veg card | `1632776350300-11016768b521` |
| `shop-interior.jpg` | Why shop with us | `1719427129658-95dcc15f2977` |
| `sell-off-licence.jpg` | What We Sell: Off Licence | `1578911373434-0cb395d2cbfb` |
| `sell-spirits.jpg` | What We Sell: Beer, Wine & Spirits | `1716719215097-a6a640fc3225` |
| `sell-tobacco.jpg` | What We Sell: Cigarettes & Tobacco | `1515446134809-993c501ca304` |
| `sell-news.jpg` | What We Sell: News Agents | `1523995462485-3d171b5c8fa9` |
| `sell-groceries.jpg` | What We Sell: Groceries | `1791598638224-3cd6c50a7a18` |
| `sell-polish.jpg` | What We Sell: Polish Foods | `1627861446476-42fd9925e151` |
| `sell-caribbean.jpg` | What We Sell: Caribbean Foods | `1552709607-08d00227833d` |
| `sell-fruit-veg.jpg` | What We Sell: Fruit & Veg | `1669154777196-aca4d45b581a` |
| `sell-paypoint.jpg` | What We Sell: PayPoint | `1556742031-c6961e8560b0` |
| `sell-top-ups.jpg` | What We Sell: Mobile Top Ups | `1592890288564-76628a30a657` |
| `sell-energy.jpg` | What We Sell: Gas & Electric Top Ups | `1555009784-ae7e7d1b97aa` |
| `sell-oyster.jpg` | What We Sell: Oyster & Bus Top Ups | `1527497171728-16dba07f59a1` |
| `sell-parcels.jpg` | What We Sell: Amazon Click & Collect | `1577705998148-6da4f3963bc8` |

The `sell-` photos are saved at 660 by 588 pixels, three times the size they are
shown, so they do not need `npm run images`. The Cigarettes & Tobacco card is a
plain picture of wood on purpose: UK rules restrict showing tobacco products.

The polaroids are listed in `POLAROIDS` (`src/extras.jsx`), the shelf cards in
`SHELVES` and the What We Sell cards in `PRODUCTS` (both `src/App.jsx`). If a photo is missing, a warm block in the brand
colours shows instead.

`shop-front.jpg` is not here yet. When a photo of the shop itself is added
under that name, it sits behind the baby-blue veil in the hero. Restart
`npm run dev` after adding it.
