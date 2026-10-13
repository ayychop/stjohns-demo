import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import {
  ArrowUp,
  Banana,
  Carrot,
  Flame,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  ShoppingBasket,
  Soup,
  Star,
  Sunrise,
  Wheat,
} from 'lucide-react'
import { Counter, MaskLines, Reveal, scrollToTop } from './motion.jsx'
import { SHOP, WRAP, btn, eyebrow, introRemaining } from './shop.js'

// Seven photos from /public/images, cropped square. If one fails to load, the polaroid shows
// a warm colour wash and a small line icon instead.
const POLAROIDS = [
  { src: '/images/produce-crate.jpg', caption: 'Fresh in today', wash: 'wash-red', icon: Carrot, tilt: -4, drop: 6 },
  { src: '/images/plantain.jpg', caption: 'Plantain, yam, green banana', wash: 'wash-cream', icon: Banana, tilt: 3, drop: -4 },
  { src: '/images/polish-deli.jpg', caption: 'Polish deli', wash: 'wash-burgundy', icon: Soup, tilt: -2, drop: 10 },
  { src: '/images/spices.jpg', caption: 'Seasoning and spice', wash: 'wash-cream', icon: Flame, tilt: 5, drop: 0 },
  { src: '/images/fresh-bread.jpg', caption: 'Bread, baked fresh', wash: 'wash-red', icon: Wheat, tilt: -3, drop: -6 },
  { src: '/images/tropical-fruit.jpg', caption: 'A taste of home', wash: 'wash-burgundy', icon: Sunrise, tilt: 2, drop: 8 },
  { src: '/images/shop-aisle.jpg', caption: 'Aisle by aisle', wash: 'wash-cream', icon: ShoppingBasket, tilt: -5, drop: 2 },
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
    <figure className="w-36 bg-offwhite p-2 pb-2.5 shadow-[0_16px_32px_-12px_rgb(26_35_64/0.6)] sm:w-48 sm:p-2.5">
      <div className={`wash ${shot.wash} relative aspect-square w-full overflow-hidden`}>
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
 * Strip of tilted, overlapping polaroids that hangs off the bottom of the hero.
 * The first time it is on screen the polaroids land one by one (fade, rotate,
 * rise); that never replays. After that the strip drifts slowly sideways and
 * pauses under the mouse.
 */
export function PolaroidMarquee() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  // Fixed the moment it first comes into view: wait for the loading screen to lift.
  const wait = useRef(null)
  if (inView && wait.current === null) wait.current = introRemaining()
  const Card = reduced ? 'div' : m.div
  return (
    <div ref={ref} aria-hidden="true" className="marquee relative z-10 -mt-20 overflow-x-clip pb-6 sm:-mt-24">
      <m.div
        className="marquee-track"
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        transition={{ staggerChildren: 0.1, delayChildren: wait.current ?? 0 }}
      >
        {/* Four identical runs: the track slides by exactly one run, then repeats. */}
        {[...POLAROIDS, ...POLAROIDS, ...POLAROIDS, ...POLAROIDS].map((shot, i) => (
          <Card
            key={i}
            className="-mr-3 shrink-0"
            {...(reduced
              ? { style: { transform: `translateY(${shot.drop}px) rotate(${shot.tilt}deg)` } }
              : { variants: landing, custom: shot })}
          >
            <Polaroid shot={shot} />
          </Card>
        ))}
      </m.div>
    </div>
  )
}

// PLACEHOLDER REVIEWS: these are sample quotes, not real customers. Replace
// them with genuine Google reviews (quote and name), then set `sample: false`
// to remove the "Sample review" tag. Do not publish invented reviews as real.
const REVIEWS = [
  {
    quote:
      'Open late, always a friendly hello, and they stock the seasoning I cannot find anywhere else round here. Proper local shop.',
    name: 'Reviewer name',
    when: 'Date of review',
    sample: true,
  },
  {
    quote:
      'Real Polish bread and pickles on the shelf, which saves me a trip across town. The lads behind the counter always remember you.',
    name: 'Reviewer name',
    when: 'Date of review',
    sample: true,
  },
  {
    quote:
      'Popped in for milk and came out having paid the gas and topped up my phone as well. Fruit and veg out front is always fresh.',
    name: 'Reviewer name',
    when: 'Date of review',
    sample: true,
  },
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
    <section id="reviews" className="py-20 sm:py-28">
      <div className={WRAP}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <Reveal as="p" className={eyebrow}>
              <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
              Word on the street
            </Reveal>
            <MaskLines
              lines={['What the', 'neighbourhood says']}
              className="font-display mt-5 text-[clamp(1.9rem,8vw,5.5rem)] font-black uppercase leading-[0.92]"
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

        <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {REVIEWS.map((review, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className={i === 1 ? 'md:mt-10' : ''}>
              <m.figure
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative h-full border border-navy/20 bg-offwhite p-6 transition-shadow duration-300 hover:shadow-lift sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <Stars />
                  {review.sample && (
                    <span className="bg-navy px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-cream">
                      Sample review
                    </span>
                  )}
                </div>
                <blockquote className="font-display mt-5 text-xl font-medium leading-snug sm:text-2xl">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-navy/20 pt-5">
                  <span
                    aria-hidden="true"
                    className="font-display grid h-10 w-10 place-items-center rounded-full bg-navy text-lg font-bold text-cream"
                  >
                    {review.name[0]}
                  </span>
                  <span className="text-sm leading-tight">
                    <span className="block font-bold">{review.name}</span>
                    <span className="text-navy/75">{review.when} · Google</span>
                  </span>
                </figcaption>
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
    a: 'Seven in the morning, every day of the week, and we do not shut until eleven at night. Weekends are exactly the same as weekdays.',
  },
  {
    q: 'Do you deliver?',
    a: `Not at the moment. Everything is on the shelf, though, and we are a short walk from most of Harlesden. If you want to check we have something before you set off, ring us on ${SHOP.phone}.`,
  },
  {
    q: 'Can I top up my Oyster or phone here?',
    a: 'Yes to both. We top up Oyster cards for TfL and do mobile top-ups for all the major networks, right at the counter.',
  },
  {
    q: 'Do you sell Caribbean and Polish foods?',
    a: 'Yes, and not just a token row of each. There is a dedicated Caribbean shelf (rice, peas, plantain, seasoning, spice) and a dedicated Polish shelf (deli, breads, pickles, sweets, cured meats).',
  },
  {
    q: 'Do you take card payments?',
    a: 'Yes, all major cards are accepted. Cash is always welcome too.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <section id="faq">
      <div aria-hidden="true" className="carnival-stripe" />
      <div className={`${WRAP} grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:gap-14`}>
        <div className="lg:col-span-5">
          <Reveal as="p" className={eyebrow}>
            <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
            Before you pop in
          </Reveal>
          <MaskLines
            lines={['The questions', 'we always get']}
            className="font-display mt-5 text-[clamp(1.9rem,8vw,4.5rem)] font-black uppercase leading-[0.92]"
          />
          <Reveal as="p" delay={0.1} className="mt-6 max-w-sm leading-relaxed text-navy/75">
            Something else on your mind? Ask at the counter, or give us a ring on{' '}
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
                    className="font-display group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-2xl font-bold leading-tight transition-colors hover:text-burgundy sm:py-6 sm:text-3xl"
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

/**
 * WhatsApp and back-to-top buttons. On phones they sit in opposite corners,
 * just above the bottom bar; on desktop they sit side by side, bottom right.
 */
export function FloatingActions({ show }) {
  const fab =
    'fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 grid h-13 w-13 cursor-pointer place-items-center rounded-full shadow-lift transition-colors duration-200 md:bottom-6'
  const pop = {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.6 },
    whileHover: { y: -4 },
  }
  return (
    <AnimatePresence>
      {show && (
        <m.a
          key="whatsapp"
          {...pop}
          href={`https://wa.me/${SHOP.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on WhatsApp"
          className={`${fab} left-4 border-2 border-cream bg-burgundy text-cream hover:bg-navy md:left-auto md:right-[5.5rem]`}
        >
          <MessageCircle className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
        </m.a>
      )}
      {show && (
        <m.button
          key="top"
          {...pop}
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`${fab} right-4 border-2 border-cream bg-navy text-cream hover:bg-burgundy md:right-6`}
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
