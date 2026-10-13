// The logo as a standalone SVG file, built from the same shapes as the React component in src/brand.jsx.
import { LOGO } from '../src/logo-paths.js'

export function logoSvg() {
  const { width, height, plate, layers } = LOGO
  const paths = layers.map(
    ({ d, fill, stroke, strokeWidth }) =>
      `<path d="${d}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke"` : ''}/>`,
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="St. John's Mini Market, Food &amp; Wine"><rect width="${width}" height="${height}" rx="14" fill="${plate}"/>${paths.join('')}</svg>`
}
