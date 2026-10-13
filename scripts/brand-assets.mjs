// Builds the web-ready logo files from public/images/logo.png, and the phone
// home-screen icon from public/favicon.svg. Runs automatically before
// `npm run dev` and `npm run build`, so replacing logo.png is all it takes.
import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import sharp from 'sharp'

const LOGO = 'public/images/logo.png'
// Near-lossless: small lettering in a logo shows compression artefacts quickly.
const WEBP = { quality: 96, alphaQuality: 100, effort: 4, smartSubsample: true }
const VARIANTS = [
  ['logo-header', 44], // shown 44px tall in the header
  ['logo-footer', 96], // shown up to 96px tall in the footer
]
// The home page header shows the logo 180px wide (120px on phones). One file for
// each of those at 1x, 2x and 3x screen density.
const NAV_WIDTHS = [120, 180, 240, 360, 540]
const navFile = (width) => `public/images/logo-nav-${width}.webp`
const fileFor = (name, density) => `public/images/${name}${density === 1 ? '' : `-${density}x`}.webp`

await sharp('public/favicon.svg', { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png')

if (!existsSync(LOGO)) {
  // No logo yet: clear out stale copies so the site falls back to its text wordmark.
  for (const [name] of VARIANTS) for (const d of [1, 2, 3]) await rm(fileFor(name, d), { force: true })
  for (const width of NAV_WIDTHS) await rm(navFile(width), { force: true })
  console.log('brand: no public/images/logo.png, using the text wordmark')
} else {
  const sourceHeight = (await sharp(LOGO).metadata()).height
  // One file per screen density, each rendered at exactly the pixels it will
  // occupy, so the browser never has to rescale the logo itself.
  for (const [name, cssHeight] of VARIANTS) {
    for (const density of [1, 2, 3]) {
      const height = cssHeight * density
      await sharp(LOGO)
        .resize({ height, kernel: 'lanczos3' })
        // A firmer sharpening pass when the file is enlarged past its source size.
        .sharpen(height > sourceHeight ? { sigma: 1.1 } : { sigma: 0.5 })
        .webp(WEBP)
        .toFile(fileFor(name, density))
    }
  }
  for (const width of NAV_WIDTHS) {
    await sharp(LOGO).resize({ width, kernel: 'lanczos3' }).sharpen({ sigma: 0.5 }).webp(WEBP).toFile(navFile(width))
  }
}
