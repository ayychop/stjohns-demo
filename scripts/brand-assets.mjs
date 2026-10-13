// Builds the web-ready logo files and the favicons from public/images/logo.png.
// Run with `npm run brand` whenever the logo file is replaced.
import sharp from 'sharp'

const LOGO = 'public/images/logo.png'
const CREAM = '#f5efe4'

// Full-size logo for the footer and the background watermark.
await sharp(LOGO).webp({ quality: 84 }).toFile('public/images/logo.webp')
// The header shows the logo at most 48px tall, so twice that covers sharp screens.
await sharp(LOGO).resize({ height: 96 }).webp({ quality: 86 }).toFile('public/images/logo-header.webp')

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
