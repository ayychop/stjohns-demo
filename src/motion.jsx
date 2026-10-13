import { useEffect, useRef, useState } from 'react'
import { animate, m, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import Lenis from 'lenis'

const EASE = [0.22, 1, 0.36, 1]

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

/** Fades in and rises slightly the first time it enters the viewport. */
export function Reveal({ as = 'div', delay = 0, className, children, ...rest }) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

const maskLine = {
  hidden: { y: '108%', opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: EASE } },
}

/**
 * Headline whose lines rise out from behind a mask, one after another.
 * `immediate` plays on page load instead of waiting for scroll.
 */
export function MaskLines({ as = 'h2', lines, className, delay = 0, immediate = false }) {
  const Tag = m[as]
  const trigger = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }
  return (
    <Tag
      className={className}
      initial="hidden"
      transition={{ staggerChildren: 0.1, delayChildren: delay }}
      {...trigger}
    >
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

/** Counts up from 0 once, when scrolled into view. */
export function Counter({ to, decimals = 0, duration = 1.1 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(to)
      return
    }
    const controls = animate(0, to, { duration, ease: 'easeOut', onUpdate: setValue })
    return () => controls.stop()
  }, [inView, reduced, to, duration])

  // The final value stays in the DOM for screen readers; the ticking number is visual only.
  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{to.toFixed(decimals)}</span>
      <span aria-hidden="true">{value.toFixed(decimals)}</span>
    </span>
  )
}

/** Wraps a button so it pulls gently toward the mouse cursor. */
export function Magnetic({ strength = 0.3, className, children }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  )
}

/**
 * Shop photo that fills its container. Give the container an aspect ratio so
 * nothing shifts while the photo loads. If the file is missing, a hatched
 * stand-in shows the file name to drop into /public/images.
 */
export function ShopImage({ src, alt, className = '', imgClassName = '', tone = 'light', eager = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={`relative overflow-hidden ${tone === 'dark' ? 'placeholder-dark' : 'placeholder-light'} ${className}`}
    >
      {failed ? (
        <span
          aria-hidden="true"
          className={`absolute right-3 top-3 font-mono text-[0.65rem] uppercase tracking-widest ${
            tone === 'dark' ? 'hidden' : 'text-ink/70'
          }`}
        >
          Photo: {src.split('/').pop()}
        </span>
      ) : (
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
