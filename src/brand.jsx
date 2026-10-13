import { useState } from 'react'

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
