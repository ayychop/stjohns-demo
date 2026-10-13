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
const fileFor = (name, density) => `public/images/${name}${density === 1 ? '' : `-${density}x`}.webp`

await sharp('public/favicon.svg', { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png')

if (!existsSync(LOGO)) {
  // No logo yet: clear out stale copies so the site falls back to its text wordmark.
  for (const [name] of VARIANTS) for (const d of [1, 2, 3]) await rm(fileFor(name, d), { force: true })
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
}
