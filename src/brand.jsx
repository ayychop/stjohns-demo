import { useId, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'

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

// Each stroke of the vine draws itself from `at` seconds, for `for` seconds.
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: ([at, duration]) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: at, duration, ease: 'easeInOut' },
      opacity: { delay: at, duration: 0.01 },
    },
  }),
}

/**
 * A thin vine with a small bunch of grapes at its centre, used as a section
 * divider. It draws itself in from left to right over about 1.2 seconds, once,
 * the first time it enters the viewport. With reduced motion it is simply there.
 */
export function VineDivider({ className = '' }) {
  const reduced = useReducedMotion()
  const Svg = reduced ? 'svg' : m.svg
  const Path = reduced ? 'path' : m.path
  const Circle = reduced ? 'circle' : m.circle
  const on = (at, duration) => (reduced ? {} : { variants: draw, custom: [at, duration] })
  return (
    <Svg
      aria-hidden="true"
      viewBox="0 0 400 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mx-auto block h-auto w-full max-w-sm ${className}`}
      {...(reduced ? {} : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
    >
      {/* left vine and its leaves */}
      <Path d="M4 22c30-14 58 14 88 0s52-12 78-2" {...on(0, 0.5)} />
      <Path d="M58 20c2-10 14-12 18-4-4 8-12 10-18 4Z" {...on(0.15, 0.3)} />
      <Path d="M122 22c4 9 15 9 18 1-5-7-13-7-18-1Z" {...on(0.3, 0.3)} />
      {/* grapes */}
      <Path d="M200 4v6" {...on(0.45, 0.15)} />
      <Circle cx="189" cy="15" r="5" {...on(0.45, 0.25)} />
      <Circle cx="200" cy="15" r="5" {...on(0.5, 0.25)} />
      <Circle cx="211" cy="15" r="5" {...on(0.55, 0.25)} />
      <Circle cx="194.5" cy="25" r="5" {...on(0.55, 0.25)} />
      <Circle cx="205.5" cy="25" r="5" {...on(0.6, 0.25)} />
      <Circle cx="200" cy="35" r="5" {...on(0.6, 0.25)} />
      {/* right vine and its leaves, drawn outwards from the grapes */}
      <Path d="M230 20C256 10 278 8 308 22C338 36 366 8 396 22" {...on(0.7, 0.5)} />
      <Path d="M278 22c-4 9-15 9-18 1 5-7 13-7 18-1Z" {...on(0.75, 0.3)} />
      <Path d="M342 20c-2-10-14-12-18-4 4 8 12 10 18 4Z" {...on(0.9, 0.3)} />
    </Svg>
  )
}

/**
 * Kente-inspired texture. It borrows the geometry of Ghanaian Kente cloth, not
 * its colours: four woven "blocks" (stepped pyramid, thin diagonal stripes,
 * nested diamonds, small triangles) drawn as thin line-work in the shop's own
 * burgundy only. Alternate rows are shifted by two blocks, the way Kente
 * strips are sewn side by side.
 *
 * It fills its nearest `relative` parent. Keep `opacity` between 0.05 and 0.08
 * so it reads as woven texture, barely visible. It is used on the What We Sell
 * section (the band above it and the texture behind it), and nowhere else.
 */
export function KentePattern({ opacity = 0.07, className = '' }) {
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
        <g id={blocks} fill="none" stroke="#6B1E2E" strokeWidth="1.5" strokeLinejoin="miter">
          {/* edges of the woven band, and the seams between blocks */}
          <path d="M0 4H240M0 56H240M0 8V52M60 8V52M120 8V52M180 8V52" />
          {/* stepped pyramid, with a smaller one inside it and a small diamond over its peak */}
          <path d="M4 50H10V42H18V34H24V26H36V34H42V42H50V50H56" />
          <path d="M20 50V44H26V38H34V44H40V50" />
          <path d="M30 10 36 16 30 22 24 16Z" />
          {/* thin diagonal stripes */}
          <path d="M64 50 88 10M72 50 96 10M80 50 104 10M88 50 112 10M96 50 116 17" />
          {/* nested diamonds, with corner marks around them */}
          <path d="M150 10 170 30 150 50 130 30ZM150 20 160 30 150 40 140 30Z" />
          <path d="M124 14 130 8M176 14 170 8M124 46 130 52M176 46 170 52" />
          {/* two rows of small triangles, point up then point down */}
          <path d="M186 28 194 14 202 28ZM206 28 214 14 222 28ZM196 34 204 48 212 34ZM216 34 224 48 232 34Z" />
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
