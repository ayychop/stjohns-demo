import { useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation, m, useMotionValueEvent, useScroll } from 'framer-motion'
import {
  Bus,
  Carrot,
  CreditCard,
  Flame,
  ListChecks,
  MapPin,
  Navigation,
  Newspaper,
  Package,
  Phone,
  Receipt,
  ShoppingBasket,
  Smartphone,
  Smile,
  Star,
  Sunrise,
  Tv,
  Users,
  Wheat,
  Wine,
} from 'lucide-react'
import { GrapeCluster, IMAGES, KentePattern, Logo, VineDivider } from './brand.jsx'
import { Counter, Magnetic, Reveal, useSmoothScroll } from './motion.jsx'
import { CookieBanner, Faq, FloatingActions, MobileBar } from './extras.jsx'
import {
  INTRO_DELAY,
  SHOP,
  WRAP,
  btnOutline,
  btnPrimary,
  eyebrow,
  heading,
  useCookieConsent,
  useShopClock,
} from './shop.js'

const PRODUCTS = [
  { icon: Wine, label: 'Off Licence', text: 'Beers, wines and spirits' },
  { icon: Newspaper, label: 'News Agents', text: 'Papers and magazines' },
  { icon: ShoppingBasket, label: 'Groceries', text: 'The everyday basics' },
  { icon: Wheat, label: 'Polish Foods', text: 'Deli, breads and pickles' },
  { icon: Flame, label: 'Caribbean Foods', text: 'Seasoning, spice and staples' },
  { icon: Carrot, label: 'Fruit & Veg', text: 'Fresh every morning' },
  { icon: CreditCard, label: 'PayPoint', text: 'Sorted at the counter' },
  { icon: Smartphone, label: 'Mobile Top-ups', text: 'Credit while you shop' },
]

const REASONS = [
  {
    icon: Sunrise,
    title: 'Open before the buses start, shut long after the last train',
    text: 'Seven in the morning until eleven at night, every day. If you have run out of something, we are probably open.',
  },
  {
    icon: ListChecks,
    title: 'One shop, every errand',
    text: 'Milk, a paper, the meter, a parcel to pick up. One trip and you are done.',
  },
  {
    icon: Smile,
    title: 'Faces you know behind the counter',
    text: 'We know our regulars, and it does not take long to become one.',
  },
  {
    icon: Users,
    title: 'Every neighbour, every shelf',
    text: 'Caribbean, Polish and everything in between, stocked for the people who actually live here.',
  },
]

const SERVICES = [
  { icon: CreditCard, label: 'PayPoint' },
  { icon: Bus, label: 'Bus Tickets' },
  { icon: Tv, label: 'TV Licence' },
  { icon: Smartphone, label: 'Mobile Top-ups' },
  { icon: Receipt, label: 'Oyster Top-ups' },
  { icon: Package, label: 'Amazon Click & Collect' },
]

const NAV = [
  { href: '#what-we-sell', label: 'What We Sell' },
  { href: '#services', label: 'Services' },
  { href: '#hours', label: 'Hours' },
  { href: '#find-us', label: 'Find Us' },
  { href: '#faq', label: 'FAQ' },
]

/**
 * "Open now" or "Closed", with a green dot that pulses while the shop is open.
 * `prominent` is the hero version: about a third larger, with a cream border and a soft glow.
 */
function OpenPill({ clock, showTime = false, prominent = false }) {
  const dot = prominent ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'
  return (
    <p
      className={`inline-flex items-center rounded-full bg-navy font-bold text-cream ${
        prominent
          ? 'gap-3 border-2 border-cream px-5 py-2.5 text-base shadow-[0_0_0_6px_rgb(245_239_224/0.3),0_10px_28px_-8px_rgb(26_35_64/0.6)] sm:px-6 sm:py-3 sm:text-lg'
          : 'gap-2.5 px-4 py-2 text-xs sm:text-sm'
      }`}
    >
      <span className={`relative flex ${dot}`}>
        {clock.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-75 motion-reduce:hidden" />
        )}
        <span
          className={`relative inline-flex rounded-full ${dot} ${
            clock.open ? 'bg-[#3ddc84]' : 'border-2 border-cream/70'
          }`}
        />
      </span>
      <span className="uppercase tracking-[0.1em]">{clock.open ? 'Open now' : 'Closed'}</span>
      {showTime && (
        <>
          <span className="text-cream/60" aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            <span className="sr-only">Time in London: </span>
            {clock.time}
          </span>
        </>
      )}
    </p>
  )
}

function Header({ scrolled }) {
  return (
    <header
      // Baby blue like the logo's own background, so the logo reads as part of the bar.
      // Solid at the top of the page, tinted frosted glass once the page scrolls.
      className={`fixed inset-x-0 top-0 z-50 border-b text-navy transition-colors duration-300 ${
        scrolled ? 'border-navy/15 bg-blue/85 backdrop-blur-xl backdrop-saturate-150' : 'border-transparent bg-blue'
      }`}
    >
      <div className={`${WRAP} flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]`}>
        <a href="#top" className="shrink-0 transition-opacity hover:opacity-85">
          <Logo />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="border-b-2 border-transparent py-1 text-sm font-bold transition-colors hover:border-burgundy hover:text-burgundy"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href={SHOP.tel} className={`${btnPrimary} !min-h-11 shrink-0 !px-5`}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Now
        </a>
      </div>
    </header>
  )
}

function Hero({ clock }) {
  return (
    <section id="top" className="relative overflow-hidden bg-blue">
      {/* On phones without a shop photo, the logo's grapes sit quietly in the corner. */}
      {!IMAGES.shopFront && (
        <GrapeCluster
          strokeWidth={1.8}
          className="pointer-events-none absolute -right-12 top-16 w-40 rotate-12 text-burgundy/30 sm:w-56 lg:hidden"
        />
      )}

      <div className={`${WRAP} relative grid items-center gap-12 pb-12 pt-28 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:pb-20`}>
        <div>
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: INTRO_DELAY + 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            <OpenPill clock={clock} showTime prominent />
            <p className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-bold sm:text-sm">
              <Star className="h-4 w-4 fill-burgundy text-burgundy" aria-hidden="true" />
              <span>
                <Counter to={SHOP.rating} decimals={1} /> on Google ·{' '}
                <Counter to={SHOP.reviewCount} /> reviews
              </span>
            </p>
          </m.div>

          {/* No entrance animation on the headline: it is in place the moment the preloader lifts. */}
          <h1 className="font-display sign-lettering mt-7 text-[clamp(2.75rem,9vw,5.75rem)] font-black leading-[0.98]">
            <span className="block">St. John's</span>
            <span className="block">Mini Market</span>
          </h1>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: INTRO_DELAY + 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display mt-4 text-[clamp(1.3rem,3vw,2rem)] font-medium italic leading-tight text-navy">
              Food · Wine · Everything in between.
            </p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-navy sm:text-lg">
              A corner shop in Harlesden since forever. Serving the NW10 community morning to night.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Magnetic>
                <a href={SHOP.tel} className={`${btnPrimary} w-full py-3.5 sm:w-auto`}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {SHOP.phone}
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={SHOP.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnOutline} w-full py-3 sm:w-auto`}
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Get Directions
                </a>
              </Magnetic>
            </div>

            <p className="mt-8 text-sm font-semibold text-navy">
              Open <Counter to={7} duration={0.8} /> days · 7:00am–11:00pm · 90 St. Johns Ave, NW10 4EG
            </p>
          </m.div>
        </div>

        {/* The photo block on the right. It shows the shop-front photo when there is one;
            until then it is a cream block carrying the logo's grapes in burgundy
            (desktop only, so phones are not handed an extra screen of decoration). */}
        <div className={`relative mx-auto w-full max-w-md ${IMAGES.shopFront ? '' : 'hidden lg:block'}`}>
          <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full rounded-[2rem] bg-burgundy" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
            {IMAGES.shopFront ? (
              <img
                src="/images/shop-front.jpg"
                alt="The shop front of St. John's Mini Market"
                decoding="async"
                className="kenburns absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-8 p-10 text-burgundy">
                <GrapeCluster strokeWidth={2} className="w-[62%]" />
                <p className="text-center text-xs font-bold uppercase tracking-[0.2em]">
                  90 St. Johns Ave · Harlesden NW10
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatWeSell() {
  return (
    <section id="what-we-sell" className="bg-cream">
      {/* The woven band: a strip of the Kente-inspired pattern running the full width under the hero. */}
      <div aria-hidden="true" className="scallop" />
      <div className="relative mt-2 h-[60px] border-y border-burgundy/20 bg-offwhite">
        <KentePattern opacity={0.08} />
      </div>

      {/* The same pattern, fainter, as a texture behind the section. */}
      <div className="relative pb-16 sm:pb-24">
        <KentePattern opacity={0.05} />
        <div className={`${WRAP} relative pt-14 sm:pt-20`}>
          <Reveal className="max-w-xl">
            <p className={eyebrow}>What we sell</p>
            <h2 className={`${heading} mt-3`}>Everything for the week, and a taste of home</h2>
            <p className="mt-4 leading-relaxed text-navy/75">
              Eight good reasons to pop in, and usually a ninth you had forgotten you needed.
            </p>
          </Reveal>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {PRODUCTS.map(({ icon: Icon, label, text }, i) => (
              <Reveal as="li" key={label} delay={(i % 4) * 0.05}>
                <m.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="group h-full rounded-2xl border border-navy/10 bg-offwhite p-4 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-burgundy/50 hover:shadow-lift sm:p-6"
                >
                  <Icon
                    className="h-8 w-8 text-navy transition-colors duration-300 group-hover:text-burgundy"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="font-display mt-5 text-lg font-semibold leading-tight sm:text-xl">{label}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-navy/70">{text}</p>
                </m.div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function WhyShop() {
  return (
    <section id="why-us" className="bg-offwhite py-16 sm:py-24">
      <div className={WRAP}>
        <VineDivider className="mb-14 text-burgundy sm:mb-20" />

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            {IMAGES.aisle ? (
              <div className="relative">
                <div aria-hidden="true" className="absolute -bottom-3 -left-3 h-full w-full rounded-[2rem] bg-blue" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
                  <img
                    src="/images/aisle.jpg"
                    alt="Well stocked aisle inside St. John's Mini Market"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : (
              // No photo yet: a solid burgundy block carrying the shop's own words.
              <figure className="rounded-[2rem] bg-burgundy p-8 text-cream sm:p-10">
                <GrapeCluster className="w-14 text-blue" />
                <blockquote className="font-display mt-6 text-2xl font-medium italic leading-snug sm:text-[1.75rem]">
                  Caribbean, African, Polish, Irish. Harlesden cooks in a lot of kitchens, and our
                  shelves are filled with all of them in mind.
                </blockquote>
                <figcaption className="mt-6 text-xs font-bold uppercase tracking-[0.2em]">
                  Stocked for the neighbourhood
                </figcaption>
              </figure>
            )}
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className={eyebrow}>Why shop with us</p>
              <h2 className={`${heading} mt-3`}>Your local, done properly</h2>
            </Reveal>
            <ul className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {REASONS.map(({ icon: Icon, title, text }, i) => (
                <Reveal as="li" key={title} delay={i * 0.06} className="flex gap-4">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-burgundy" strokeWidth={1.6} aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-snug">{title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-navy/75">{text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="bg-burgundy py-14 text-cream sm:py-20">
      <div className={WRAP}>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">Services</p>
            <h2 className={`${heading} mt-3`}>Also at the counter</h2>
          </div>
          <p className="text-cream/80">Sort the errands while you pick up the milk. Just ask.</p>
        </Reveal>
        {/* A plain vertical list on phones, one band of six on desktop. */}
        <Reveal as="ul" className="mt-8 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {SERVICES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-4 border-b border-cream/20 py-4 transition-colors duration-200 sm:flex-col sm:items-start sm:rounded-2xl sm:border sm:p-5 sm:hover:border-blue sm:hover:bg-cream/5"
            >
              <Icon className="h-7 w-7 shrink-0 text-blue" strokeWidth={1.5} aria-hidden="true" />
              <span className="font-bold leading-snug sm:text-[0.95rem]">{label}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Hours({ clock }) {
  return (
    <section id="hours" className="bg-cream py-16 sm:py-24">
      <div className={WRAP}>
        <Reveal className="grid gap-8 rounded-[2rem] bg-blue p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <OpenPill clock={clock} />
            <h2 className="mt-6">
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-navy">Opening hours</span>
              <span className="font-display sign-lettering mt-2 block text-[clamp(2.6rem,10vw,5.5rem)] font-black leading-none">
                7am – 11pm
              </span>
              <span className="font-display mt-3 block text-[clamp(1.4rem,3.4vw,2.25rem)] font-medium italic leading-tight text-burgundy">
                Every single day
              </span>
            </h2>
          </div>
          <div className="flex items-end gap-4 border-t border-navy/20 pt-6 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 lg:text-right">
            <span className="font-display text-7xl font-black leading-[0.8] text-navy sm:text-8xl">
              <Counter to={7} duration={0.9} />
            </span>
            <span className="pb-1 text-sm font-bold leading-snug text-navy">
              days a week
              <br />
              Monday to Sunday
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FindUs({ consent, setConsent }) {
  return (
    <section id="find-us" className="bg-offwhite py-16 sm:py-24">
      <div className={WRAP}>
        <Reveal>
          <p className={eyebrow}>Location &amp; contact</p>
          <h2 className={`${heading} mt-3`}>Find us on St Johns Avenue</h2>
          <p className="mt-4 text-navy/75">In the Church End and Roundwood part of Harlesden, NW10.</p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-7 rounded-[2rem] border border-navy/10 bg-cream p-7 sm:p-9 lg:col-span-5">
            <div>
              <p className={`${eyebrow} flex items-center gap-2`}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Give us a ring
              </p>
              <a
                href={SHOP.tel}
                className="font-display mt-2 block w-fit whitespace-nowrap text-[clamp(2.1rem,9vw,3.25rem)] font-black leading-none text-burgundy transition-colors hover:text-navy"
              >
                {SHOP.phone}
              </a>
            </div>
            <div>
              <p className={`${eyebrow} flex items-center gap-2`}>
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Walk in
              </p>
              <address className="font-display mt-2 text-2xl font-semibold not-italic leading-snug">
                90 St. Johns Ave,
                <br />
                London NW10 4EG
              </address>
              <p className="mt-2 text-navy/75">Open every day, 7:00am to 11:00pm.</p>
            </div>
            <Magnetic className="mt-auto w-full sm:w-fit">
              <a href={SHOP.directions} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} w-full`}>
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get Directions
              </a>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="h-[24rem] overflow-hidden rounded-[2rem] border border-navy/10 lg:h-full lg:min-h-[28rem]">
              {consent === 'accepted' ? (
                // data-lenis-prevent lets the map handle its own wheel and touch gestures
                <iframe
                  data-lenis-prevent
                  title="Map showing St. John's Mini Market, 90 St. Johns Ave, London NW10 4EG"
                  src={SHOP.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="block h-full w-full bg-cream"
                />
              ) : (
                // Google Maps sets cookies, so it only loads once the visitor agrees.
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-blue p-6 text-center">
                  <MapPin className="h-10 w-10 text-burgundy" strokeWidth={1.5} aria-hidden="true" />
                  <p className="font-display text-2xl font-semibold leading-tight">90 St. Johns Ave, NW10 4EG</p>
                  <p className="max-w-xs text-sm leading-relaxed">
                    The map comes from Google and uses cookies, so we wait for your say-so before
                    loading it.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={() => setConsent('accepted')} className={`${btnPrimary} cursor-pointer`}>
                      Show the map
                    </button>
                    <a href={SHOP.directions} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Footer({ onCookieSettings }) {
  const link = 'underline-offset-4 transition-colors hover:text-blue hover:underline'
  return (
    <footer className="bg-navy text-cream">
      {/* Extra room at the bottom on phones so the sticky bar and floating buttons never cover the credit. */}
      <div className={`${WRAP} pb-40 pt-12 md:pb-14`}>
        <VineDivider className="text-blue" />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <Logo variant="footer" onDark />
            <p className="mt-6 flex flex-col gap-1 text-cream/85 sm:flex-row sm:flex-wrap sm:gap-x-3">
              <span className="font-bold text-cream">{SHOP.name}</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span>{SHOP.address}</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span>Serving Harlesden, NW10</span>
            </p>
          </div>
          <div className="lg:text-right">
            <p className="font-display text-2xl font-semibold italic">See you at the shop.</p>
            <a
              href={SHOP.tel}
              className="font-display mt-2 inline-block text-4xl font-black text-blue transition-colors hover:text-cream sm:text-5xl"
            >
              {SHOP.phone}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-cream/20 pt-6 text-sm text-cream/80 sm:flex-row sm:items-center sm:justify-between md:pr-36">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            <li>
              <a href="/privacy.html" className={`${link} inline-block py-2`}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms.html" className={`${link} inline-block py-2`}>
                Terms
              </a>
            </li>
            <li>
              <button type="button" onClick={onCookieSettings} className={`${link} cursor-pointer py-2`}>
                Cookie settings
              </button>
            </li>
          </ul>
          <p>Website by BOA Network</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useSmoothScroll()
  const clock = useShopClock()
  const [consent, setConsent] = useCookieConsent()

  // The header frosts as soon as the page moves; the floating controls wait for the hero
  // buttons to scroll away. Fixed pixel thresholds, so a phone's collapsing address bar
  // cannot flip them back and forth.
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 32)
    setPastHero(y > 560)
  })

  return (
    // LazyMotion loads only the animation features the page uses, which keeps the bundle small.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Header scrolled={scrolled} />
        <main>
          <Hero clock={clock} />
          <WhatWeSell />
          <WhyShop />
          <Services />
          <Hours clock={clock} />
          <FindUs consent={consent} setConsent={setConsent} />
          <Faq />
        </main>
        <Footer onCookieSettings={() => setConsent(null)} />
        <MobileBar show={pastHero} />
        <FloatingActions show={pastHero} />
        <CookieBanner consent={consent} setConsent={setConsent} />
      </MotionConfig>
    </LazyMotion>
  )
}
