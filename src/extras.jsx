import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowUp, MessageCircle, Navigation, Phone, Plus } from 'lucide-react'
import { Reveal, scrollToTop } from './motion.jsx'
import { SHOP, WRAP, btnOutline, btnPrimary, eyebrow, heading } from './shop.js'

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
    <section id="faq" className="bg-cream py-16 sm:py-24">
      <div className={`${WRAP} grid gap-10 lg:grid-cols-12 lg:gap-14`}>
        <Reveal className="lg:col-span-4">
          <p className={eyebrow}>Before you pop in</p>
          <h2 className={`${heading} mt-3`}>The questions we always get</h2>
          <p className="mt-4 max-w-sm leading-relaxed text-navy/75">
            Something else on your mind? Ask at the counter, or give us a ring on{' '}
            <a
              href={SHOP.tel}
              className="font-bold text-burgundy underline underline-offset-4 transition-colors hover:text-navy"
            >
              {SHOP.phone}
            </a>
            .
          </p>
        </Reveal>

        <Reveal as="ul" className="space-y-3 lg:col-span-8">
          {FAQS.map((faq, i) => {
            const open = openIndex === i
            return (
              <li
                key={faq.q}
                className={`rounded-2xl border bg-offwhite transition-colors duration-300 ${
                  open ? 'border-burgundy/40' : 'border-navy/10 hover:border-navy/30'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="font-display group flex w-full cursor-pointer items-center justify-between gap-5 rounded-2xl px-5 py-4 text-left text-lg font-semibold leading-snug sm:px-6 sm:py-5 sm:text-xl"
                  >
                    {faq.q}
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        open
                          ? 'rotate-45 bg-burgundy text-cream'
                          : 'bg-navy/5 text-navy group-hover:bg-burgundy group-hover:text-cream'
                      }`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
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
                      <p className="max-w-2xl px-5 pb-5 leading-relaxed text-navy/80 sm:px-6 sm:pb-6">{faq.a}</p>
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
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2.5 border-t border-navy/15 bg-offwhite p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-lift md:hidden"
        >
          <a href={SHOP.tel} className={`${btnPrimary} !px-4`}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call Now
          </a>
          <a href={SHOP.directions} target="_blank" rel="noopener noreferrer" className={`${btnOutline} !px-4`}>
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
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
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
            className="pointer-events-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-navy/15 bg-offwhite p-3.5 shadow-lift md:flex-row md:items-center md:gap-6 md:px-5"
          >
            <p className="text-[0.8rem] leading-snug md:flex-1 md:text-sm">
              <strong>We use cookies.</strong> Only for the Google map, and only if you say yes. See
              our{' '}
              <a
                href="/privacy.html"
                className="font-bold text-burgundy underline underline-offset-2 hover:text-navy"
              >
                privacy policy
              </a>
              .
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConsent('accepted')}
                className={`${btnPrimary} !min-h-11 flex-1 cursor-pointer !px-6`}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => setConsent('declined')}
                className={`${btnOutline} !min-h-11 flex-1 cursor-pointer whitespace-nowrap !px-6`}
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
