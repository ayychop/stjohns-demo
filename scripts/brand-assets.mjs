// Builds the files that are made from the logo and the favicon: a standalone
// logo.svg (used by the Privacy and Terms pages), the share image for social
// media, and the phone home-screen icon. Runs automatically before
// `npm run dev` and `npm run build`.
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { LOGO } from '../src/logo-paths.js'
import { logoSvg } from './logo-svg.mjs'

await sharp('public/favicon.svg', { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png')

const svg = logoSvg()
await writeFile('public/logo.svg', svg)

// Social networks do not accept SVG, so the share image is the logo drawn onto a 1200x630 baby-blue card.
const logo = await sharp(Buffer.from(svg), { density: 300 }).resize({ width: 1080 }).png().toBuffer()
await sharp({ create: { width: 1200, height: 630, channels: 3, background: LOGO.plate } })
  .composite([{ input: logo }])
  .png({ compressionLevel: 9, palette: true })
  .toFile('public/og-image.png')
