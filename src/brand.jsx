import { useId, useState } from 'react'

// Set in vite.config.js: which optional images exist in public/images.
export const IMAGES = __IMAGES__

/**
 * The shop's logo. If public/images/logo.png is missing (or fails to load),
 * a "FOOD & WINE" wordmark in the brand colours stands in for it.
 * `onDark` switches the wordmark's small print to cream for dark backgrounds.
 */
export function Logo({ variant = 'header', onDark = false, className = '' }) {
  const [failed, setFailed] = useState(!IMAGES.logo)
  const footer = variant === 'footer'

  if (failed) {
    return (
      <span className={`inline-block leading-none ${className}`}>
        <span
          className={`block font-bold uppercase tracking-[0.22em] ${footer ? 'text-xs' : 'text-[0.6rem]'} ${
            onDark ? 'text-cream' : 'text-navy'
          }`}
        >
          St. John's Mini Market
        </span>
        <span className={`font-display sign-lettering mt-1 block font-black ${footer ? 'text-5xl' : 'text-[1.75rem]'}`}>
          FOOD <span className="text-burgundy [text-shadow:none]">&amp;</span> WINE
        </span>
      </span>
    )
  }

  const file = footer ? 'logo-footer' : 'logo-header'
  const height = footer ? 96 : 44
  return (
    <img
      src={`/images/${file}.webp`}
      srcSet={`/images/${file}.webp 1x, /images/${file}-2x.webp 2x, /images/${file}-3x.webp 3x`}
      alt="St. John's Mini Market, Food & Wine"
      // Height is fixed and width follows the logo's own proportions, so it is never stretched.
      width={Math.round(height * IMAGES.logoAspect)}
      height={height}
      loading={footer ? 'lazy' : 'eager'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${footer ? 'h-auto max-h-24 w-auto max-w-full' : 'h-9 w-auto min-[420px]:h-11'} ${className}`}
    />
  )
}

/**
 * Line drawing of a bunch of grapes with a leaf and tendril, after the grapes
 * in the logo. Inherits its colour from the text colour.
 */
export function GrapeCluster({ className = '', strokeWidth = 2.5 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* stem, tendril and leaf */}
      <path d="M60 44C58 32 60 20 68 8" />
      <path d="M59 30C44 28 34 16 42 9c7-5 13 4 6 8" />
      <path d="M66 26c8-18 34-18 40 0-6 16-28 18-40 0Z" />
      <path d="M66 26c12-3 26-3 40 0" />
      {/* grapes, four rows */}
      <circle cx="21" cy="58" r="13" />
      <circle cx="47" cy="58" r="13" />
      <circle cx="73" cy="58" r="13" />
      <circle cx="99" cy="58" r="13" />
      <circle cx="34" cy="81" r="13" />
      <circle cx="60" cy="81" r="13" />
      <circle cx="86" cy="81" r="13" />
      <circle cx="47" cy="104" r="13" />
      <circle cx="73" cy="104" r="13" />
      <circle cx="60" cy="127" r="13" />
    </svg>
  )
}

/** A thin vine with a small bunch of grapes at its centre, used as a section divider. */
export function VineDivider({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mx-auto block h-auto w-full max-w-sm ${className}`}
    >
      {/* vine, left and right */}
      <path d="M4 22c30-14 58 14 88 0s52-12 78-2" />
      <path d="M396 22c-30-14-58 14-88 0s-52-12-78-2" />
      {/* leaves */}
      <path d="M58 20c2-10 14-12 18-4-4 8-12 10-18 4ZM122 22c4 9 15 9 18 1-5-7-13-7-18-1Z" />
      <path d="M342 20c-2-10-14-12-18-4 4 8 12 10 18 4ZM278 22c-4 9-15 9-18 1 5-7 13-7 18-1Z" />
      {/* grapes */}
      <path d="M200 4v6" />
      <circle cx="189" cy="15" r="5" />
      <circle cx="200" cy="15" r="5" />
      <circle cx="211" cy="15" r="5" />
      <circle cx="194.5" cy="25" r="5" />
      <circle cx="205.5" cy="25" r="5" />
      <circle cx="200" cy="35" r="5" />
    </svg>
  )
}

/**
 * Kente-inspired texture. It borrows the geometry of Ghanaian Kente cloth, not
 * its colours: four woven "blocks" (stepped pyramid, thin diagonal stripes,
 * nested diamonds, small triangles) drawn as thin line-work in the shop's own
 * burgundy and baby blue. Alternate rows are shifted by two blocks, the way
 * Kente strips are sewn side by side.
 *
 * It fills its nearest `relative` parent. Keep `opacity` between 0.05 and 0.08
 * so it reads as texture, and use it sparingly: it is on the band under the
 * hero and behind What We Sell, and nowhere else.
 */
export function KentePattern({ opacity = 0.05, className = '' }) {
  const id = useId()
  const blocks = `${id}-blocks`
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    >
      <defs>
        {/* One row of four 60x60 blocks. */}
        <g id={blocks} fill="none" strokeWidth="1.5" strokeLinejoin="miter">
          <g stroke="#6B1E2E">
            {/* edges of the woven band, and the seams between blocks */}
            <path d="M0 4H240M0 56H240M0 8V52M60 8V52M120 8V52M180 8V52" />
            {/* stepped pyramid, with a smaller one inside it */}
            <path d="M4 50H10V42H18V34H24V26H36V34H42V42H50V50H56" />
            <path d="M20 50V44H26V38H34V44H40V50" />
            {/* nested diamonds */}
            <path d="M150 10 170 30 150 50 130 30ZM150 20 160 30 150 40 140 30Z" />
          </g>
          <g stroke="#5FB4E0">
            {/* a small diamond over the pyramid's peak */}
            <path d="M30 10 36 16 30 22 24 16Z" />
            {/* thin diagonal stripes */}
            <path d="M64 50 88 10M72 50 96 10M80 50 104 10M88 50 112 10M96 50 116 17" />
            {/* corner marks around the diamonds */}
            <path d="M124 14 130 8M176 14 170 8M124 46 130 52M176 46 170 52" />
            {/* two rows of small triangles, point up then point down */}
            <path d="M186 28 194 14 202 28ZM206 28 214 14 222 28ZM196 34 204 48 212 34ZM216 34 224 48 232 34Z" />
          </g>
        </g>
        <pattern id={id} width="240" height="120" patternUnits="userSpaceOnUse">
          <use href={`#${blocks}`} />
          {/* second row, shifted along by two blocks */}
          <use href={`#${blocks}`} x="-120" y="60" />
          <use href={`#${blocks}`} x="120" y="60" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
