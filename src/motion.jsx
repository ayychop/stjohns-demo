import { Fragment, useEffect, useRef, useState } from 'react'
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Lenis from 'lenis'
import { INTRO_DELAY, introRemaining } from './shop.js'

const EASE = [0.22, 1, 0.36, 1]
const HIDDEN = { opacity: 0, y: 20 }
const SHOWN = { opacity: 1, y: 0 }

let lenis = null

/** Buttery page scrolling. Skipped for visitors who prefer reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ autoRaf: true, anchors: { offset: -80 }, lerp: 0.1 })
    return () => {
      lenis.destroy()
      lenis = null
    }
  }, [])
}

/** Glides back to the top, through Lenis when it is running. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 })
  else window.scrollTo({ top: 0 })
}

/**
 * Fades in and rises 20px the first time it enters the viewport, and never
 * again. Anything already on screen at page load waits for the loading screen
 * to lift first.
 */
export function Reveal({ as = 'div', delay = 0, className, children, ...rest }) {
  const Tag = m[as]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  // Fixed at the moment it first comes into view.
  const wait = useRef(null)
  if (inView && wait.current === null) wait.current = delay + introRemaining()
  return (
    <Tag
      ref={ref}
      className={className}
      initial={HIDDEN}
      animate={inView ? SHOWN : HIDDEN}
      transition={{ duration: 0.7, delay: wait.current ?? 0, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

const ONCE = { once: true, margin: '0px 0px -10% 0px' }

const word = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

/**
 * A line of text whose words fade in and rise one after another, 0.06s apart.
 * Plays once when it enters the viewport; `immediate` plays it on page load
 * instead, as soon as the loading screen lifts. Only opacity and transform are
 * animated. With reduced motion it is plain static text.
 */
export function WordReveal({ as = 'p', text, className, immediate = false, delay = 0 }) {
  const reduced = useReducedMotion()
  if (reduced) {
    const Plain = as
    return <Plain className={className}>{text}</Plain>
  }
  const Tag = m[as]
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: ONCE }
  return (
    <Tag
      className={className}
      initial="hidden"
      transition={{ staggerChildren: 0.06, delayChildren: delay + (immediate ? INTRO_DELAY : 0) }}
      {...trigger}
    >
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <m.span className="inline-block" variants={word}>
            {w}
          </m.span>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}

const maskLine = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { duration: 0.8, ease: EASE } },
}

/**
 * A heading that slides up from behind a mask, once, when it enters the
 * viewport. Pass `lines` to reveal several lines one after another. With
 * reduced motion it is a plain static heading.
 */
export function MaskHeading({ as = 'h2', className, lines, children }) {
  const reduced = useReducedMotion()
  const rows = lines ?? [children]
  if (reduced) {
    const Plain = as
    return (
      <Plain className={className}>
        {rows.map((row, i) => (
          <span key={i} className="block">
            {row}
          </span>
        ))}
      </Plain>
    )
  }
  const Tag = m[as]
  return (
    // The trigger sits on the heading itself: the moving text starts out fully clipped
    // by its mask, so it could never report itself as visible.
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={ONCE}
      transition={{ staggerChildren: 0.1 }}
    >
      {rows.map((row, i) => (
        // Padding keeps descenders from being cut off by the mask.
        <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <m.span className="block will-change-transform" variants={maskLine}>
            {row}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}

/**
 * Counts up from 0 the first time it scrolls into view, then stays put.
 *
 * It runs exactly once. The ticking number is written straight to the page
 * rather than held in React state, and once started the count is never stopped
 * or restarted, so re-renders and scrolling back and forth cannot make it
 * flicker or replay. The final value is laid out invisibly underneath, so the
 * surrounding text does not shift as the digits change.
 */
export function Counter({ to, decimals = 0, duration = 1.1 }) {
  const ref = useRef(null)
  const out = useRef(null)
  const started = useRef(false)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const final = to.toFixed(decimals)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const node = out.current
    if (reduced) {
      node.textContent = final
      return
    }
    animate(0, to, {
      duration,
      delay: introRemaining(),
      ease: 'easeOut',
      onUpdate: (v) => {
        node.textContent = v.toFixed(decimals)
      },
      onComplete: () => {
        node.textContent = final
      },
    })
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <span ref={out} aria-hidden="true" className="col-start-1 row-start-1">
        {(0).toFixed(decimals)}
      </span>
    </span>
  )
}

/** Wraps a button so it pulls gently toward the mouse cursor, by `max` pixels at most. */
export function Magnetic({ strength = 0.25, max = 6, className, children }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const reduced = useReducedMotion()

  const pull = (offset) => Math.max(-max, Math.min(max, offset * strength))
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || reduced) return
    const rect = ref.current.getBoundingClientRect()
    x.set(pull(e.clientX - (rect.left + rect.width / 2)))
    y.set(pull(e.clientY - (rect.top + rect.height / 2)))
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div ref={ref} className={className} style={{ x, y }} onPointerMove={onPointerMove} onPointerLeave={reset}>
      {children}
    </m.div>
  )
}

/**
 * Layered depth: returns a ref for a section and a `y` for a decoration inside
 * it, which drifts by `distance` pixels either way as the section scrolls past.
 */
export function useParallax(distance = 40) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])
  return [ref, reduced ? 0 : y]
}

/**
 * Headline whose lines rise out from behind a mask, one after another, once.
 * `immediate` plays on page load instead of waiting for scroll. With reduced
 * motion it is a plain static headline.
 */
export function MaskLines({ as = 'h2', lines, className, delay = 0, immediate = false }) {
  const reduced = useReducedMotion()
  if (reduced) {
    const Plain = as
    return (
      <Plain className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Plain>
    )
  }
  const Tag = m[as]
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: ONCE }
  return (
    <Tag className={className} initial="hidden" transition={{ staggerChildren: 0.1, delayChildren: delay }} {...trigger}>
      {lines.map((line, i) => (
        // Padding keeps descenders from being cut off by the mask.
        <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <m.span className="block" variants={maskLine}>
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}

/**
 * Shop photo that fills its container. Give the container an aspect ratio so
 * nothing shifts while the photo loads. A warm block in the brand colours
 * shows while it loads, and stays if it cannot be loaded.
 */
export function ShopImage({ src, alt, className = '', imgClassName = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`photo-warm relative overflow-hidden ${className}`}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  )
}
