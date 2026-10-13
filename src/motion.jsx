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

/**
 * Fades in and rises slightly the first time it enters the viewport.
 * `once: true` means it never plays again, however much the page is scrolled.
 */
export function Reveal({ as = 'div', delay = 0, className, children, ...rest }) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Counts up from 0 the first time it scrolls into view, then stays put.
 * Once it has finished it is locked: nothing re-runs it.
 */
export function Counter({ to, decimals = 0, duration = 1.1 }) {
  const ref = useRef(null)
  const finished = useRef(false)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || finished.current) return
    if (reduced) {
      finished.current = true
      setValue(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: setValue,
      onComplete: () => {
        finished.current = true
        setValue(to)
      },
    })
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
    <m.div ref={ref} className={className} style={{ x, y }} onPointerMove={onPointerMove} onPointerLeave={reset}>
      {children}
    </m.div>
  )
}
