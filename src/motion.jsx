import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import Lenis from 'lenis'

const EASE = [0.22, 1, 0.36, 1]

/** Buttery page scrolling. Skipped for visitors who prefer reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -80 }, lerp: 0.1 })
    return () => lenis.destroy()
  }, [])
}

/** Fades in and rises slightly the first time it enters the viewport. */
export function Reveal({ as = 'div', delay = 0, className, children, ...rest }) {
  const Tag = motion[as]
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
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}

/**
 * Shop photo with a friendly placeholder behind it, so the layout still looks
 * finished until the real file is dropped into /public/images.
 */
export function ShopImage({ src, alt, label, className = '', scaleIn = false, eager = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-brand-soft via-cream-deep to-accent-soft ${className}`}
    >
      <div className="absolute inset-0 grid place-items-center p-6 text-center" aria-hidden="true">
        <span className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-brand">
          {label}
        </span>
      </div>
      {!failed && (
        <motion.img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          initial={scaleIn ? { scale: 1.05 } : false}
          animate={scaleIn ? { scale: 1 } : undefined}
          transition={{ duration: 1.5, ease: EASE }}
        />
      )}
    </div>
  )
}
