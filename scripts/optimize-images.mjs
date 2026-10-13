// Shrinks the photos in public/images to sensible web sizes, in place.
// Run with `npm run images` after dropping in new photos.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const DIR = 'public/images'
// The hero is shown full-bleed; everything else is at most half the screen wide.
const MAX_WIDTH = { 'shop-front.jpg': 1920 }
const DEFAULT_MAX_WIDTH = 1200

for (const file of await readdir(DIR)) {
  if (!/\.jpe?g$/i.test(file)) continue
  const path = join(DIR, file)
  const input = await readFile(path)
  const output = await sharp(input)
    .rotate() // apply the camera's orientation before it is stripped
    .resize({ width: MAX_WIDTH[file] ?? DEFAULT_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true })
    .toBuffer()
  if (output.length < input.length) {
    await writeFile(path, output)
    console.log(`${file}: ${Math.round(input.length / 1024)} KB -> ${Math.round(output.length / 1024)} KB`)
  } else {
    console.log(`${file}: already small enough (${Math.round(input.length / 1024)} KB)`)
  }
}
