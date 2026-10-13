import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUp,
  Banana,
  Carrot,
  Flame,
  Navigation,
  Phone,
  Plus,
  ShoppingBasket,
  Soup,
  Star,
  Sunrise,
  Wheat,
} from 'lucide-react'
import { Counter, Reveal, RevealLines, scrollToTop } from './motion.jsx'
import { SECTION, SHOP, WRAP, btn, eyebrow, introRemaining } from './shop.js'

// Seven photos from /public/images, cropped square. If one fails to load, the polaroid shows
// a warm colour wash and a small line icon instead.
const POLAROIDS = [
  { src: '/images/produce-crate.jpg', caption: 'Fresh fruit and veg', wash: 'wash-red', icon: Carrot, tilt: -4, drop: 6 },
  { src: '/images/plantain.jpg', caption: 'Plantain, yam, green banana', wash: 'wash-cream', icon: Banana, tilt: 3, drop: -4 },
  { src: '/images/polish-deli.jpg', caption: 'Polish deli', wash: 'wash-burgundy', icon: Soup, tilt: -2, drop: 10 },
  { src: '/images/spices.jpg', caption: 'Spices and seasoning', wash: 'wash-cream', icon: Flame, tilt: 5, drop: 0 },
  { src: '/images/fresh-bread.jpg', caption: 'Fresh bread', wash: 'wash-red', icon: Wheat, tilt: -3, drop: -6 },
  { src: '/images/tropical-fruit.jpg', caption: 'Tropical fruit', wash: 'wash-burgundy', icon: Sunrise, tilt: 2, drop: 8 },
  { src: '/images/shop-aisle.jpg', caption: 'Groceries', wash: 'wash-cream', icon: ShoppingBasket, tilt: -5, drop: 2 },
]

// Each polaroid lands one after another: a fade, a rise and a little rotation
// drift into its resting tilt. Only opacity and transform are animated.
const landing = {
  hidden: ({ tilt }) => ({ opacity: 0, y: 56, rotate: tilt - 12 }),
  show: ({ tilt, drop }) => ({
    opacity: 1,
    y: drop,
    rotate: tilt,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Polaroid({ shot }) {
  const [failed, setFailed] = useState(false)
  const Icon = shot.icon
  return (
    <figure className="w-[38vw] bg-offwhite p-2 shadow-[0_16px_32px_-12px_rgb(26_35_64/0.6)] md:w-[27vw] md:p-2.5 desk:w-48">
      <div className={`photo wash ${shot.wash} relative aspect-square w-full overflow-hidden`}>
        {/* Thin burgundy bars top and bottom, like a film still. */}
        <div className="absolute inset-0 z-10 border-y-2 border-burgundy" />
        {failed ? (
          <Icon
            strokeWidth={1.25}
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 opacity-45 sm:h-16 sm:w-16"
          />
        ) : (
          <img
            src={shot.src}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <figcaption className="font-display mt-2 truncate text-center text-sm italic text-burgundy sm:text-base">
        {shot.caption}
      </figcaption>
    </figure>
  )
}

/**
 * Strip of tilted polaroids under the hero. The first time it is on screen the
 * polaroids land one by one (fade, rotate, rise); that never replays. On desktop
 * (over 1024px) they overlap and the strip drifts slowly sideways at a constant
 * speed. On phones and tablets it is a single run to swipe through, snapping
 * from photo to photo, with a "swipe" hint and a row of dots underneath that
 * follow along. About two and a half polaroids show on a phone, and a little
 * over three, slightly larger, on a tablet.
 */
export function PolaroidMarquee() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  // Fixed the moment it first comes into view: wait for the loading screen to lift.
  const wait = useRef(null)
  if (inView && wait.current === null) wait.current = introRemaining()
  const Card = reduced ? 'div' : m.div
  // Which dot is lit on phones and tablets: how far along the strip has been swiped.
  const [dot, setDot] = useState(0)
  const onScroll = (e) => {
    const strip = e.currentTarget
    const furthest = strip.scrollWidth - strip.clientWidth
    if (furthest > 0) setDot(Math.round((strip.scrollLeft / furthest) * (POLAROIDS.length - 1)))
  }
  return (
    <div ref={ref} aria-hidden="true">
      <div
        onScroll={onScroll}
        className="marquee no-scrollbar relative py-7 max-desk:snap-x max-desk:snap-mandatory max-desk:overflow-x-auto max-desk:pb-5 desk:overflow-x-clip desk:py-8"
      >
        <m.div
          className="marquee-track px-5 md:px-8 desk:px-0"
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          transition={{ staggerChildren: 0.1, delayChildren: wait.current ?? 0 }}
        >
          {/* Two identical halves of two runs each: the track slides by exactly one half, then repeats. Phones and tablets show just the first run. */}
          {[...POLAROIDS, ...POLAROIDS, ...POLAROIDS, ...POLAROIDS].map((shot, i) => (
            <Card
              key={i}
              className={`mr-3 shrink-0 snap-center last:mr-0 md:mr-5 desk:-mr-3 desk:last:-mr-3 ${i >= POLAROIDS.length ? 'max-desk:hidden' : ''}`}
              {...(reduced
                ? { style: { transform: `translateY(${shot.drop}px) rotate(${shot.tilt}deg)` } }
                : { variants: landing, custom: shot })}
            >
              <Polaroid shot={shot} />
            </Card>
          ))}
        </m.div>
      </div>
      {/* Phones and tablets: a hint that the strip swipes, and where you are along it. */}
      <div className={`${WRAP} flex items-center justify-between pb-6 desk:hidden`}>
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-navy/75">
          Swipe <ArrowRight className="h-4 w-4" />
        </p>
        <div className="flex gap-1.5">
          {POLAROIDS.map((shot, i) => (
            <span
              key={shot.src}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === dot ? 'w-4 bg-burgundy' : 'w-1.5 bg-navy/25'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Thin ticker between sections, in burgundy lettering on whatever colour it is
 * given, so it belongs to the section around it. The track holds the same long
 * run of words twice and slides left by exactly half its width, so the loop is
 * seamless; the movement is one CSS transform animation, with no JavaScript.
 */
export function MarqueeBand({ items, className = '' }) {
  // Each half repeats the words three times, which is wider than any ordinary screen.
  const run = [...items, ...items, ...items]
  return (
    <div aria-hidden="true" className={`flex h-11 items-center overflow-hidden text-burgundy ${className}`}>
      <div className="ticker-track">
        {[0, 1].map((half) => (
          <p key={half} className="flex shrink-0 items-center text-xs font-bold uppercase tracking-[0.22em]">
            {run.map((item, i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                {item}
                <span className="mx-5 h-1.5 w-1.5 rotate-45 bg-current opacity-45" />
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  )
}

const SECTIONS = [
  { id: 'what-we-sell', label: 'What We Sell' },
  { id: 'visit', label: 'Visit Us' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
]

/**
 * Bar of section links that slides down from behind the header once the hero
 * has gone. It is the same frosted cream as the header, so the two read as one
 * sticky unit, with a shadow underneath. The link for the section on screen is
 * bold and underlined.
 */
export function MiniNav({ show }) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    // A section counts as current while it crosses a line two-fifths of the way down the screen.
    const onScreen = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target.id)
          else onScreen.delete(entry.target.id)
        }
        setActive(SECTIONS.find((section) => onScreen.has(section.id))?.id ?? null)
      },
      { rootMargin: '-40% 0px -60% 0px' },
    )
    for (const { id } of SECTIONS) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <m.nav
          aria-label="Sections"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-20 z-40 border-b-2 border-burgundy bg-cream/85 text-burgundy shadow-[0_14px_28px_-14px_rgb(26_35_64/0.45)] backdrop-blur-xl backdrop-saturate-150 sm:top-24"
        >
          {/* Evenly spaced across the width on phones, centred on desktop. */}
          <ul className={`${WRAP} flex h-12 items-center justify-between sm:justify-center sm:gap-14`}>
            {SECTIONS.map(({ id, label }) => {
              const current = active === id
              return (
                <li key={id} className="shrink-0">
                  <a
                    href={`#${id}`}
                    aria-current={current ? 'location' : undefined}
                    className={`flex min-h-8 items-center border-b-2 text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-200 md:text-xs ${
                      current ? 'border-burgundy font-extrabold' : 'border-transparent font-semibold hover:border-burgundy/40'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </m.nav>
      )}
    </AnimatePresence>
  )
}

// Real reviews from the shop's Google listing, word for word (checked by the shop).
// Each is shown with a "Google review" tag, so do not add invented ones.
const REVIEWS = [
  'This is the most frequently visited shop by people wearing slippers, and we love your attitude and your orange juice!',
  'Probably the best corner shop in NW London not gonna lie',
  'Off licence. Friendly staff. Polish. Caribbean. Fruit and vegetables. News agent. Groceries.',
  'Great staff and good products',
]

function Stars({ className = 'h-4 w-4' }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`${className} fill-burgundy text-burgundy`} aria-hidden="true" />
      ))}
    </span>
  )
}

export function Reviews() {
  return (
    <section id="reviews" className={SECTION}>
      <div className={WRAP}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <Reveal as="p" className={eyebrow}>
              <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
              Google reviews
            </Reveal>
            <RevealLines
              lines={['What customers', 'say']}
              className="font-display heading-depth mt-5 text-[clamp(1.9rem,8vw,5.5rem)] font-black uppercase leading-[0.92]"
            />
          </div>
          <Reveal className="mb-2 flex items-center gap-3 border-2 border-navy px-4 py-3">
            <Star className="h-6 w-6 fill-burgundy text-burgundy" aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-[0.08em]">
              <Counter to={SHOP.rating} decimals={1} /> on Google ·{' '}
              <Counter to={SHOP.reviewCount} /> reviews
            </p>
          </Reveal>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2 desk:grid-cols-4 desk:gap-6">
          {REVIEWS.map((quote, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className={i % 2 === 1 ? 'md:mt-6' : ''}>
              <m.figure
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative h-full border border-navy/20 bg-offwhite p-6 transition-shadow duration-300 hover:shadow-lift sm:p-8 desk:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <Stars />
                  <span className="bg-burgundy px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-cream">
                    Google review
                  </span>
                </div>
                <blockquote className="font-display mt-5 text-xl font-medium leading-snug sm:text-2xl desk:text-[1.375rem]">
                  “{quote}”
                </blockquote>
              </m.figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: 'What time do you open?',
    a: 'We open at 7am and close at 11pm, every day of the week, including weekends.',
  },
  {
    q: 'Do you deliver?',
    a: `No, we do not deliver. To check if we have something in stock, call us on ${SHOP.phone}.`,
  },
  {
    q: 'Can I top up my Oyster or phone here?',
    a: 'Yes. We top up Oyster cards and do mobile top ups for all major networks at the till.',
  },
  {
    q: 'Do you sell Caribbean and Polish foods?',
    a: 'Yes. We have a Caribbean shelf with rice, peas, plantain, seasoning, and spices, and a Polish shelf with deli, bread, pickles, sweets, and cured meats.',
  },
  {
    q: 'Do you take card payments?',
    a: 'Yes, we take all major cards. We take cash too.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <section id="faq">
      <div aria-hidden="true" className="carnival-stripe" />
      <div className={`${WRAP} ${SECTION} grid gap-10 lg:grid-cols-12 lg:gap-14`}>
        <div className="lg:col-span-5">
          <Reveal as="p" className={eyebrow}>
            <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
            FAQ
          </Reveal>
          <RevealLines
            lines={['Common', 'questions']}
            className="font-display heading-depth mt-5 text-[clamp(1.9rem,8vw,4.5rem)] font-black uppercase leading-[0.92]"
          />
          <Reveal as="p" delay={0.1} className="mt-6 max-w-sm leading-relaxed text-navy/75">
            Got another question? Ask at the till, or call us on{' '}
            <a
              href={SHOP.tel}
              className="font-bold text-navy underline decoration-burgundy decoration-2 underline-offset-4 hover:text-burgundy"
            >
              {SHOP.phone}
            </a>
            .
          </Reveal>
        </div>

        <Reveal as="ul" className="border-t-2 border-navy lg:col-span-7">
          {FAQS.map((faq, i) => {
            const open = openIndex === i
            return (
              <li key={faq.q} className="border-b border-navy/25">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="font-display group flex w-full cursor-pointer items-center justify-between gap-6 py-4 text-left text-2xl font-bold leading-tight transition-colors hover:text-burgundy sm:py-5 sm:text-3xl"
                  >
                    {faq.q}
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-navy transition-all duration-300 group-hover:border-burgundy ${
                        open ? 'rotate-45 bg-navy text-cream' : ''
                      }`}
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <m.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 pr-12 text-lg leading-relaxed text-navy/80">{faq.a}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

/** Phone-only bar pinned to the bottom of the screen once the hero buttons have scrolled away. */
export function MobileBar({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <m.nav
          aria-label="Quick contact"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2.5 border-t-2 border-navy bg-cream p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] md:hidden"
        >
          <a href={SHOP.tel} className={`${btn} bg-burgundy text-cream hover:bg-navy`}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call Now
          </a>
          <a
            href={SHOP.directions}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} border-2 border-navy text-navy active:bg-navy active:text-cream`}
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Directions
          </a>
        </m.nav>
      )}
    </AnimatePresence>
  )
}

/** Back-to-top button, bottom right. On phones it sits just above the bottom bar. */
export function FloatingActions({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <m.button
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ y: -4 }}
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-40 grid h-13 w-13 cursor-pointer place-items-center rounded-full border-2 border-cream bg-navy text-cream shadow-lift transition-colors duration-200 hover:bg-burgundy md:bottom-6 md:right-6"
        >
          <ArrowUp className="h-6 w-6" aria-hidden="true" />
        </m.button>
      )}
    </AnimatePresence>
  )
}

/** Small consent banner. The only cookies on the site come from the Google map, which waits for a yes. */
export function CookieBanner({ consent, setConsent }) {
  // Let the page settle before asking.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 1800)
    return () => clearTimeout(id)
  }, [])

  return (
    <AnimatePresence>
      {ready && !consent && (
        // The outer div only positions; clicks pass through it to the page beneath.
        <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex justify-center md:bottom-6">
          <m.aside
            aria-label="Cookie consent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto flex w-full max-w-3xl flex-col gap-3 border-2 border-navy bg-cream p-3 shadow-lift md:flex-row md:items-center md:gap-6 md:px-5 md:py-3"
          >
            <p className="text-[0.8rem] leading-snug md:flex-1 md:text-sm">
              <strong>We use cookies.</strong> Only for the Google map, and only if you say yes. See
              our{' '}
              <a href="/privacy.html" className="font-bold underline underline-offset-2 hover:text-burgundy">
                privacy policy
              </a>
              .
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConsent('accepted')}
                className={`${btn} !min-h-11 flex-1 cursor-pointer bg-burgundy px-6 text-cream hover:bg-navy`}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => setConsent('declined')}
                className={`${btn} !min-h-11 flex-1 cursor-pointer whitespace-nowrap border-2 border-navy px-6 hover:bg-navy hover:text-cream`}
              >
                No thanks
              </button>
            </div>
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
