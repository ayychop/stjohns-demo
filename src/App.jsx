import { useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation, m, useMotionValueEvent, useScroll } from 'framer-motion'
import {
  ArrowRight,
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
import { Counter, Magnetic, MaskLines, Reveal, ShopImage, useSmoothScroll } from './motion.jsx'
import { CookieBanner, Faq, FloatingActions, MobileBar, PolaroidMarquee, Reviews } from './extras.jsx'
import { INTRO_DELAY, SHOP, WRAP, btn, eyebrow, useCookieConsent, useShopClock } from './shop.js'

// If you add dedicated shelf photos, point `src` at them here.
const SHELVES = [
  {
    title: 'Caribbean shelf',
    list: 'Rice, peas, plantain, seasoning, spice',
    text: 'Everything for Sunday dinner, the way it is meant to be made.',
    src: '/images/aisle.jpg',
    crop: 'object-left',
    alt: 'Caribbean groceries on the shelves',
    aspect: 'aspect-[4/5]',
    offset: '',
  },
  {
    title: 'Polish shelf',
    list: 'Deli, sweets, breads, pickles, cured meats',
    text: 'A proper taste of home, a few doors from yours.',
    src: '/images/aisle.jpg',
    crop: 'object-right',
    alt: 'Polish foods on the shelves',
    aspect: 'aspect-[4/5] lg:aspect-[3/4]',
    offset: 'lg:mt-28',
  },
  {
    title: 'Fresh every morning',
    list: 'Fruit, veg, herbs picked daily',
    text: 'Set out front before most of the street is awake.',
    src: '/images/produce.jpg',
    crop: '',
    alt: 'Fresh fruit and vegetables on display outside the shop',
    aspect: 'aspect-[4/5]',
    offset: 'lg:mt-12',
  },
]

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
  { href: '#neighbourhood', label: 'The Shelves' },
  { href: '#what-we-sell', label: 'What We Sell' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#hours', label: 'Hours' },
  { href: '#find-us', label: 'Find Us' },
]

// A restrained scatter of carnival-coloured dots: [x, y, radius, colour].
const CONFETTI = [
  [182, 14, 3.5, 'fill-clay'],
  [150, 30, 2, 'fill-saffron'],
  [196, 46, 2.5, 'fill-forest'],
  [164, 62, 3, 'fill-saffron'],
  [120, 12, 2, 'fill-carnival'],
  [134, 52, 1.5, 'fill-clay'],
  [188, 82, 2, 'fill-[#5b3260]'],
  [98, 34, 1.5, 'fill-forest'],
  [152, 92, 1.5, 'fill-clay'],
  [76, 16, 2.5, 'fill-saffron'],
  [110, 70, 2, 'fill-carnival'],
  [172, 116, 1.5, 'fill-saffron'],
  [48, 28, 1.5, 'fill-clay'],
  [196, 132, 2, 'fill-clay'],
  // The one dot of sign blue.
  [136, 104, 2.5, 'fill-sign'],
]

// A few thin diagonal strokes beside the dots: [x, y, colour].
const HATCH = [
  [58, 96, 'stroke-carnival'],
  [70, 96, 'stroke-saffron'],
  [82, 96, 'stroke-clay'],
  [94, 96, 'stroke-carnival'],
]

function Confetti() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 140"
      className="pointer-events-none absolute -top-7 right-5 w-24 sm:-top-2 sm:right-8 sm:w-52 lg:top-4 lg:w-64"
    >
      {CONFETTI.map(([cx, cy, r, colour], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} className={colour} />
      ))}
      {HATCH.map(([x, y, colour]) => (
        <line key={x} x1={x} y1={y + 22} x2={x + 16} y2={y} strokeWidth="2" strokeLinecap="round" className={colour} />
      ))}
    </svg>
  )
}

/** Pulsing dot: green while the shop is open, red while it is closed. */
function StatusDot({ open }) {
  const colour = open ? 'bg-[#3ddc84]' : 'bg-[#ff5a4d]'
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden ${colour}`}
      />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colour}`} />
    </span>
  )
}

function Header({ frosted }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        frosted
          ? 'border-sign bg-burgundy/80 backdrop-blur-xl backdrop-saturate-150'
          : 'border-transparent'
      } text-cream`}
    >
      <div className={`${WRAP} flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]`}>
        <a href="#top" className="shrink-0 transition-opacity hover:opacity-85">
          <img
            src="/images/logo-header.webp"
            alt="St. John's Mini Market, Food & Wine"
            width="470"
            height="96"
            className="h-9 w-auto sm:h-11"
          />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="border-b-2 border-transparent py-1 text-xs font-extrabold uppercase tracking-[0.14em] transition-colors hover:border-parchment hover:text-parchment"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={SHOP.tel}
          className={`${btn} !min-h-11 shrink-0 bg-clay px-4 text-white hover:bg-clay-dark sm:px-5`}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Now
        </a>
      </div>
    </header>
  )
}

function Hero({ clock }) {
  return (
    <section id="top" className="dusk relative isolate overflow-hidden text-cream">
      <ShopImage
        src="/images/shop-front.jpg"
        alt="The shop front of St. John's Mini Market with its red awning"
        tone="dark"
        className="!absolute inset-0 -z-20"
        imgClassName="kenburns"
        eager
      />
      <div aria-hidden="true" className="dusk-veil absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="sun-glow absolute -right-[20%] -top-[12%] -z-10 aspect-square w-[95vw] max-w-[58rem] sm:-right-[8%]"
      />
      <div aria-hidden="true" className="grain-coarse absolute inset-0 -z-10" />

      {/* A touch short of the full screen so the polaroids peek over the fold. */}
      <div className={`${WRAP} flex min-h-[calc(100svh-2.5rem)] flex-col pt-24 sm:pt-28`}>
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: INTRO_DELAY + 0.5 }}
          className="flex flex-wrap gap-2 text-xs font-semibold tracking-wide sm:text-sm"
        >
          <p className="alive-border inline-flex">
            <span className="inline-flex items-center gap-2.5 bg-char px-3.5 py-2">
            <StatusDot open={clock.open} />
            <span className="font-bold uppercase tracking-[0.12em]">
              {clock.open ? 'Open now' : 'Closed'}
            </span>
            <span className="text-cream/80" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              <span className="sr-only">Time in London: </span>
              {clock.time}
            </span>
            </span>
          </p>
          <p className="inline-flex items-center gap-2 border border-parchment/50 bg-char/50 px-3.5 py-2 backdrop-blur-sm">
            <Star className="h-4 w-4 fill-mustard text-mustard" aria-hidden="true" />
            <span>
              <Counter to={SHOP.rating} decimals={1} /> on Google ·{' '}
              <Counter to={SHOP.reviewCount} /> reviews
            </span>
          </p>
        </m.div>

        <div className="mt-auto pb-8 pt-10 sm:pb-10">
          {/* No entrance animation here: the headline is in place the moment the preloader lifts,
              which also keeps Largest Contentful Paint early. */}
          <h1 className="font-display text-[clamp(2.6rem,min(11.5vw,15svh),9.5rem)] font-black uppercase leading-[0.88]">
            <span className="block">St. John's</span>
            <span className="block">Mini Market</span>
          </h1>
          <MaskLines
            as="p"
            immediate
            delay={INTRO_DELAY + 0.2}
            lines={['Food · Wine · Everything in between.']}
            className="font-display mt-5 text-[clamp(1.25rem,3.6vw,3rem)] font-medium italic leading-tight text-mustard"
          />

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: INTRO_DELAY + 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
              A corner shop in Harlesden since forever. Serving the NW10 community morning to night.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Magnetic>
                <a
                  href={SHOP.tel}
                  className={`${btn} w-full bg-clay px-7 py-4 text-white hover:bg-clay-dark sm:w-auto`}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {SHOP.phone}
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={SHOP.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn} w-full border-2 border-cream px-7 py-[0.875rem] text-cream hover:bg-cream hover:text-ink sm:w-auto`}
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Get Directions
                </a>
              </Magnetic>
            </div>
          </m.div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-parchment/40 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-parchment sm:text-xs">
          <p className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 bg-mustard" aria-hidden="true" />
            <span>
              Open <Counter to={7} duration={0.8} /> days · 7:00am–11:00pm
            </span>
          </p>
          <p className="hidden sm:block">90 St. Johns Ave · NW10 4EG</p>
        </div>
      </div>

      {/* Room for the top of the polaroid strip, which overlaps from below. */}
      <div aria-hidden="true" className="h-20 sm:h-24" />
      <div aria-hidden="true" className="awning h-3 sm:h-4" />
    </section>
  )
}

function Neighbourhood() {
  return (
    <section id="neighbourhood" className="cream-to-clay relative overflow-x-clip pb-20 pt-10 sm:pb-28 sm:pt-14">
      {/* The shop's logo as a faint watermark behind the section. */}
      <img
        src="/images/logo.webp"
        alt=""
        aria-hidden="true"
        width="1062"
        height="217"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -right-[12%] top-28 w-[125%] max-w-none -rotate-6 opacity-[0.08] sm:top-20 sm:w-[90%] lg:-right-[4%] lg:top-10 lg:w-[72%]"
      />
      <div className={`${WRAP} relative`}>
        <Confetti />
        <Reveal as="p" className={eyebrow}>
          <span className="h-0.5 w-8 bg-clay" aria-hidden="true" />
          Who we stock for
        </Reveal>
        <div className="relative w-fit">
          <MaskLines
            lines={['Stocked for the', 'neighbourhood']}
            className="font-display mt-5 text-[clamp(1.9rem,8.7vw,6rem)] font-black uppercase leading-[0.92]"
          />
          {/* A loose, hand-drawn terracotta line that draws itself under the headline. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 500 18"
            fill="none"
            className="absolute left-0 top-full mt-1 w-[78%] overflow-visible text-clay sm:mt-2"
          >
            <m.path
              d="M4 11 C 38 3, 84 15, 142 8 S 236 3, 318 10 S 432 15, 496 5"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </div>
        <Reveal as="p" delay={0.15} className="mt-10 max-w-md text-lg leading-relaxed text-ink/75 lg:ml-auto lg:mt-4">
          Caribbean, African, Polish, Irish. Harlesden cooks in a lot of kitchens, and our shelves
          are filled with all of them in mind.
        </Reveal>

        <ul className="mt-12 grid gap-12 lg:-mt-6 lg:grid-cols-3 lg:gap-8">
          {SHELVES.map((shelf, i) => (
            <Reveal as="li" key={shelf.title} delay={i * 0.1} className={shelf.offset}>
              <m.article
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <ShopImage
                  src={shelf.src}
                  alt={shelf.alt}
                  className={`${shelf.aspect} w-full`}
                  imgClassName={shelf.crop}
                />
                {/* Photo on top and copy beneath on phones; the caption overlaps the photo on desktop. */}
                <div className="relative mt-5 lg:-mt-12 lg:ml-6 lg:mr-8 lg:bg-cream lg:p-6">
                  <p className="font-mono text-xs tracking-[0.2em]">0{i + 1}</p>
                  <h3 className="font-display mt-2 text-3xl font-bold leading-none sm:text-4xl">
                    {shelf.title}
                  </h3>
                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.08em]">{shelf.list}</p>
                  <p className="mt-2 leading-relaxed text-ink/75">{shelf.text}</p>
                </div>
              </m.article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function WhatWeSell() {
  return (
    <section id="what-we-sell" className="pb-24 sm:pb-36">
      <div aria-hidden="true" className="carnival-stripe" />
      <div className={`${WRAP} pt-14 sm:pt-20`}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <MaskLines
            lines={['What we sell']}
            className="font-display text-[clamp(2.3rem,7.5vw,6rem)] font-black uppercase leading-[0.92]"
          />
          <Reveal as="p" className="flex items-center gap-2 pb-2 font-mono text-xs uppercase tracking-[0.2em] text-ink/75 lg:hidden">
            Swipe along <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Reveal>
          <Reveal as="p" className="hidden max-w-xs pb-3 text-ink/75 lg:block">
            Eight good reasons to pop in, and usually a ninth you had forgotten you needed.
          </Reveal>
        </div>
      </div>

      {/* Swipeable strip on phones and tablets, an eight-up index on desktop. */}
      <Reveal className="mx-auto mt-10 max-w-7xl lg:px-8">
        <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-5 sm:px-8 lg:grid lg:grid-cols-4 lg:overflow-visible lg:border-l lg:border-t lg:border-ink/20 lg:px-0">
          {PRODUCTS.map(({ icon: Icon, label, text }, i) => (
            <m.li
              key={label}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="group relative flex min-h-60 w-[70vw] max-w-xs shrink-0 snap-start flex-col justify-between border-y border-r border-ink/20 bg-cream p-6 transition-colors duration-300 first:border-l hover:z-10 hover:bg-burgundy hover:text-cream hover:shadow-lift sm:w-64 lg:min-h-64 lg:w-auto lg:max-w-none lg:border-t-0 lg:p-7 lg:first:border-l-0"
            >
              <div className="flex items-start justify-between">
                <Icon
                  className="h-10 w-10 text-ink transition-colors duration-300 group-hover:text-saffron"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
                <span className="font-mono text-xs tracking-[0.2em] opacity-75" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-display text-[1.75rem] font-bold leading-none lg:text-3xl">{label}</h3>
                <p className="mt-2 text-sm opacity-80">{text}</p>
              </div>
            </m.li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

function WhyShop() {
  return (
    <section id="why-us" className="bg-mustard">
      <div className={`${WRAP} grid gap-10 pb-20 sm:pb-28 lg:grid-cols-12 lg:gap-14`}>
        {/* The photo climbs out of the top of the block into the section above. */}
        <Reveal className="-mt-12 sm:-mt-20 lg:col-span-5">
          <div className="relative">
            <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full bg-burgundy" />
            <ShopImage
              src="/images/aisle.jpg"
              alt="Well stocked aisle inside St. John's Mini Market"
              className="aspect-[4/3] w-full lg:aspect-[4/5]"
            />
          </div>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em]">Inside · 90 St. Johns Ave</p>
        </Reveal>

        <div className="lg:col-span-7 lg:pt-24">
          <Reveal as="p" className={eyebrow}>
            <span className="h-0.5 w-8 bg-ink" aria-hidden="true" />
            Why shop with us
          </Reveal>
          <MaskLines
            lines={['Your local,', 'done properly']}
            className="font-display mt-5 text-[clamp(2.3rem,6.5vw,5rem)] font-black uppercase leading-[0.92]"
          />
          <ol className="mt-10 border-t-2 border-ink">
            {REASONS.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.06}
                className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-ink/30 py-6 sm:gap-x-8 sm:py-7"
              >
                <span className="font-display text-4xl font-black italic leading-none sm:text-5xl" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display flex gap-3 text-2xl font-bold leading-[1.1] sm:text-[1.75rem]">
                    <span className="flex-1">{title}</span>
                    <Icon className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                  </h3>
                  <p className="mt-2 max-w-lg leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="bg-burgundy pb-36 pt-14 text-cream sm:pb-44 sm:pt-16">
      <div className={WRAP}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <MaskLines
            lines={['Also at the counter']}
            className="font-display text-3xl font-bold italic sm:text-4xl"
          />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cream/70">Just ask</p>
        </div>
        {/* A plain vertical list on phones, one band of six on desktop. */}
        <Reveal
          as="ul"
          className="mt-8 border-t border-cream/20 sm:grid sm:grid-cols-3 sm:border-l lg:grid-cols-6"
        >
          {SERVICES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-4 border-b border-cream/20 py-4 transition-colors duration-200 hover:bg-cream/5 sm:flex-col sm:items-start sm:border-r sm:px-5 sm:py-7"
            >
              <Icon className="h-7 w-7 shrink-0 text-saffron" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-base font-bold uppercase leading-snug tracking-[0.06em] sm:text-sm">
                {label}
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Hours({ clock }) {
  return (
    <section id="hours" className={`${WRAP} -mt-24 sm:-mt-28`}>
      <Reveal className="relative">
        <div aria-hidden="true" className="absolute -bottom-3 -right-3 hidden h-full w-full bg-saffron sm:block" />
        <div className="relative grid gap-8 bg-carnival px-6 py-10 text-white sm:px-12 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="alive-border inline-flex">
              <span className="inline-flex items-center gap-2.5 bg-char px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cream">
                <StatusDot open={clock.open} />
                {clock.open ? 'Open now' : 'Closed · Back at 7am'}
              </span>
            </p>
            <h2 className="mt-6">
              <span className="sr-only">Opening hours: </span>
              <MaskLines
                as="span"
                lines={['7am – 11pm']}
                className="font-display block text-[clamp(3.2rem,13vw,10rem)] font-black uppercase leading-[0.9] text-cream"
              />
              <span className="font-display mt-2 block text-[clamp(1.6rem,4.5vw,3.5rem)] font-medium italic leading-tight text-saffron">
                Every single day
              </span>
            </h2>
          </div>
          <div className="flex items-end gap-4 border-t border-white/40 pt-6 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 lg:text-right">
            <span className="font-display text-7xl font-black leading-[0.8] text-cream sm:text-9xl">
              <Counter to={7} duration={0.9} />
            </span>
            <span className="pb-1 text-sm font-bold uppercase leading-snug tracking-[0.14em]">
              days a week
              <br />
              Monday to Sunday
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function FindUs({ consent, setConsent }) {
  return (
    <section id="find-us" className="pb-20 pt-24 sm:pb-28 sm:pt-32">
      <div className={WRAP}>
        <Reveal as="p" className={eyebrow}>
          <span className="h-0.5 w-8 bg-clay" aria-hidden="true" />
          Church End &amp; Roundwood, NW10
        </Reveal>
        <MaskLines
          lines={['Find us on', 'St Johns Avenue']}
          className="font-display mt-5 text-[clamp(1.9rem,8.6vw,6.5rem)] font-black uppercase leading-[0.92]"
        />

        <Reveal className="mt-10 border-y-2 border-ink py-6 sm:py-8">
          <p className={eyebrow}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Give us a ring
          </p>
          <a
            href={SHOP.tel}
            className="font-display mt-2 block w-fit whitespace-nowrap text-[clamp(2.4rem,11vw,8.5rem)] font-black leading-none text-clay transition-colors hover:text-ink"
          >
            {SHOP.phone}
          </a>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="relative lg:col-span-7">
            <div aria-hidden="true" className="absolute -bottom-3 -left-3 h-full w-full bg-burgundy" />
            <div className="relative h-[24rem] border-2 border-ink sm:h-[28rem]">
              {consent === 'accepted' ? (
                // data-lenis-prevent lets the map handle its own wheel and touch gestures
                <iframe
                  data-lenis-prevent
                  title="Map showing St. John's Mini Market, 90 St. Johns Ave, London NW10 4EG"
                  src={SHOP.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="block h-full w-full bg-cream-deep"
                />
              ) : (
                // Google Maps sets cookies, so it only loads once the visitor agrees.
                <div className="placeholder-light flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <MapPin className="h-10 w-10" strokeWidth={1.4} aria-hidden="true" />
                  <p className="font-display text-2xl font-bold leading-tight sm:text-3xl">
                    90 St. Johns Ave, NW10 4EG
                  </p>
                  <p className="max-w-xs text-sm leading-relaxed">
                    The map comes from Google and uses cookies, so we wait for your say-so before
                    loading it.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConsent('accepted')}
                      className={`${btn} cursor-pointer bg-burgundy px-6 text-cream hover:bg-carnival`}
                    >
                      Show the map
                    </button>
                    <a
                      href={SHOP.directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${btn} border-2 border-ink px-6 hover:bg-ink hover:text-cream`}
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:self-center">
            <p className={eyebrow}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Walk in
            </p>
            <address className="font-display mt-3 text-3xl font-bold not-italic leading-tight sm:text-4xl">
              90 St. Johns Ave,
              <br />
              London NW10 4EG
            </address>
            <p className="mt-3 text-ink/75">Open every day, 7:00am to 11:00pm.</p>

            <Magnetic className="mt-8 w-full sm:w-fit">
              <a
                href={SHOP.directions}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} w-full bg-burgundy px-7 py-4 text-cream hover:bg-carnival`}
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get Directions
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Footer({ onCookieSettings }) {
  const link = 'underline-offset-4 transition-colors hover:text-cream hover:underline'
  return (
    <footer className="dusk-footer text-cream">
      <div aria-hidden="true" className="carnival-stripe" />
      {/* Extra room at the bottom on phones so the sticky bar and floating buttons never cover the credit. */}
      <div className={`${WRAP} pb-40 pt-14 sm:pt-16 md:pb-16`}>
        <p className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.95]">
          See you at the shop.
        </p>
        <a
          href={SHOP.tel}
          className="font-display mt-6 inline-block text-4xl font-black text-saffron transition-colors hover:text-cream sm:text-5xl"
        >
          {SHOP.phone}
        </a>
        <img
          src="/images/logo.webp"
          alt="St. John's Mini Market, Food & Wine"
          width="1062"
          height="217"
          loading="lazy"
          decoding="async"
          className="mt-10 h-auto w-full max-w-sm sm:max-w-md"
        />
        <p className="mt-6 flex flex-col gap-1 text-cream/85 sm:flex-row sm:flex-wrap sm:gap-x-3">
          <span className="font-bold text-cream">{SHOP.name}</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>{SHOP.address}</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>Serving Harlesden, NW10</span>
        </p>
        <div className="mt-10 flex flex-col gap-4 border-t border-parchment/30 pt-6 font-mono text-xs uppercase tracking-[0.16em] text-parchment sm:flex-row sm:items-center sm:justify-between">
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
              <button type="button" onClick={onCookieSettings} className={`${link} cursor-pointer py-2 uppercase`}>
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

  // The header frosts as soon as the page moves; the floating controls wait for the hero to pass.
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 32)
    setPastHero(y > window.innerHeight * 0.8)
  })

  return (
    // LazyMotion loads only the animation features the page uses, which keeps the bundle small.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Header frosted={scrolled} />
        <main>
          <Hero clock={clock} />
          <PolaroidMarquee />
          <Neighbourhood />
          <WhatWeSell />
          <WhyShop />
          <Reviews />
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
