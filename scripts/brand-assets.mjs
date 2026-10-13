// Builds the web-ready logo files and the favicons from public/images/logo.png.
// Run with `npm run brand` whenever the logo file is replaced.
import sharp from 'sharp'

const LOGO = 'public/images/logo.png'
const CREAM = '#f5efe4'
// Near-lossless: the logo's small lettering shows compression artefacts quickly.
const WEBP = { quality: 96, alphaQuality: 100, effort: 6, smartSubsample: true }

const sourceHeight = (await sharp(LOGO).metadata()).height

// One file per screen density, each rendered at exactly the pixels it will occupy,
// so the browser never has to rescale the logo itself.
async function variants(name, cssHeight) {
  for (const density of [1, 2, 3]) {
    const height = cssHeight * density
    const suffix = density === 1 ? '' : `-${density}x`
    await sharp(LOGO)
      .resize({ height, kernel: 'lanczos3' })
      // A firmer sharpening pass when the file has to be enlarged past its source size.
      .sharpen(height > sourceHeight ? { sigma: 1.1 } : { sigma: 0.5 })
      .webp(WEBP)
      .toFile(`public/images/${name}${suffix}.webp`)
  }
}

await variants('logo-header', 44) // shown 44px tall in the header
await variants('logo-footer', 96) // shown up to 96px tall in the footer

// Full-size copy for the faint background watermark.
await sharp(LOGO).webp(WEBP).toFile('public/images/logo.webp')

// The whole wordmark is unreadable at favicon size, so the icon is the big
// burgundy "F" from FOOD, cropped out and centred on a cream square.
// These numbers are the F's position in the 1062x217 logo file.
const F = { left: 54, top: 8, width: 93, height: 136 }
const letter = await sharp(LOGO).extract(F).png().toBuffer()
for (const [file, size] of [
  ['public/favicon.png', 64],
  ['public/apple-touch-icon.png', 180],
]) {
  const inner = Math.round(size * 0.72)
  const glyph = await sharp(letter).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: CREAM } })
    .composite([{ input: glyph, gravity: 'centre' }])
    .png()
    .toFile(file)
}
