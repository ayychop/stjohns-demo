import { LOGO } from './logo-paths.js'

// Set in vite.config.js: which optional images exist in public/images.
export const IMAGES = __IMAGES__

/**
 * The shop's logo, drawn as SVG so it stays sharp at any size. Its width comes
 * from `className`; the height follows. `plate` is the baby-blue sign behind the
 * lettering: leave it off where the logo already sits on baby blue. The shapes
 * come from scripts/logo-paths.mjs.
 */
export function Logo({ plate = true, className = '', ...rest }) {
  const { width, height, layers } = LOGO
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="St. John's Mini Market, Food & Wine"
      className={className}
      {...rest}
    >
      {plate && <rect width={width} height={height} rx="14" fill={LOGO.plate} />}
      {layers.map(({ d, fill, stroke, strokeWidth }, i) => (
        <path key={i} d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" paintOrder="stroke" />
      ))}
    </svg>
  )
}

/**
 * The bunch of grapes from the logo, as a solid shape in the current text
 * colour. Used very large and very faint as a background watermark: give it a
 * size, a colour and an opacity of about 0.05 through `className`.
 */
export function GrapeWatermark({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 134" fill="currentColor" className={`pointer-events-none ${className}`}>
      {/* stem and leaf */}
      <path d="M56.5 4h7v32h-7ZM64 24c9-17 36-17 44 0-9 14-32 15-44 0Z" />
      {/* grapes: three, two, one */}
      <circle cx="24" cy="52" r="18.5" />
      <circle cx="60" cy="52" r="18.5" />
      <circle cx="96" cy="52" r="18.5" />
      <circle cx="42" cy="83" r="18.5" />
      <circle cx="78" cy="83" r="18.5" />
      <circle cx="60" cy="114" r="18.5" />
    </svg>
  )
}

/**
 * The site's signature divider: a 12px ribbon of thin vertical stripes in the
 * brand colours plus gold, after the stripes of Kente cloth. It is the same
 * every time: across the very top of the page, under the hero, above Why Shop
 * With Us and under the footer. The stripes are in `.kente-line` (src/index.css).
 */
export function KenteLine({ className = '' }) {
  return <div aria-hidden="true" className={`kente-line ${className}`} />
}
