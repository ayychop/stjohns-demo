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
  Sunrise,
  Tv,
  Users,
  Wheat,
  Wine,
} from 'lucide-react'
import { IMAGES, KentePattern } from './brand.jsx'
import { Counter, Magnetic, MaskLines, Reveal, ShopImage, WordReveal, useSmoothScroll } from './motion.jsx'
import { CookieBanner, Faq, FloatingActions, MobileBar, PolaroidMarquee, Reviews } from './extras.jsx'
import { Intro } from './intro.jsx'
import { INTRO_DELAY, SHOP, WRAP, btn, eyebrow, useCookieConsent, useShopClock } from './shop.js'

// Stock photos for now, kept in /public/images. To use the shop's own, replace the files.
const SHELVES = [
  {
    title: 'Caribbean shelf',
    list: 'Rice, peas, plantain, seasoning, spice',
    text: 'Everything for Sunday dinner, the way it is meant to be made.',
    src: '/images/caribbean-shelf.jpg',
    crop: '',
    alt: 'A pile of fresh yams',
    aspect: 'aspect-[4/5]',
    offset: '',
  },
  {
    title: 'Polish shelf',
    list: 'Deli, sweets, breads, pickles, cured meats',
    text: 'A proper taste of home, a few doors from yours.',
    src: '/images/polish-shelf.jpg',
    crop: '',
    alt: 'A coil of smoked sausage with slices of dark rye bread',
    aspect: 'aspect-[4/5] lg:aspect-[3/4]',
    offset: 'lg:mt-28',
  },
  {
    title: 'Fresh every morning',
    list: 'Fruit, veg, herbs picked daily',
    text: 'Set out front before most of the street is awake.',
    src: '/images/fresh-produce.jpg',
    crop: '',
    alt: 'Fresh vegetables and herbs set out in wooden crates',
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

// A restrained scatter of brand-coloured dots: [x, y, radius, colour].
const CONFETTI = [
  [182, 14, 3.5, 'fill-burgundy'],
  [150, 30, 2, 'fill-blue'],
  [196, 46, 2.5, 'fill-navy'],
  [164, 62, 3, 'fill-blue'],
  [120, 12, 2, 'fill-burgundy'],
  [134, 52, 1.5, 'fill-burgundy'],
  [188, 82, 2, 'fill-navy'],
  [98, 34, 1.5, 'fill-navy'],
  [152, 92, 1.5, 'fill-burgundy'],
  [76, 16, 2.5, 'fill-blue'],
  [110, 70, 2, 'fill-burgundy'],
  [172, 116, 1.5, 'fill-blue'],
  [48, 28, 1.5, 'fill-burgundy'],
  [196, 132, 2, 'fill-burgundy'],
  [136, 104, 2.5, 'fill-blue'],
]

// A few thin diagonal strokes beside the dots: [x, y, colour].
const HATCH = [
  [58, 96, 'stroke-burgundy'],
  [70, 96, 'stroke-blue'],
  [82, 96, 'stroke-burgundy'],
  [94, 96, 'stroke-burgundy'],
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

/** Green pulsing dot while the shop is open; a hollow ring while it is closed. */
function StatusDot({ open, size = 'h-2.5 w-2.5' }) {
  return (
    <span className={`relative flex ${size}`}>
      {open && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-75 motion-reduce:hidden" />
      )}
      <span className={`relative inline-flex rounded-full ${size} ${open ? 'bg-[#3ddc84]' : 'border-2 border-cream/70'}`} />
    </span>
  )
}

function Header({ frosted }) {
  return (
    <header
      // Baby blue, so the logo reads as part of the bar: solid over the hero, then
      // translucent frosted glass once the hero has scrolled away.
      className={`fixed inset-x-0 top-0 z-50 border-b text-navy transition-[background-color,border-color,box-shadow] duration-500 ${
        frosted
          ? 'border-navy/10 bg-blue/65 shadow-lift backdrop-blur-xl backdrop-saturate-150'
          : 'border-navy/15 bg-blue'
      }`}
    >
      <div className={`${WRAP} flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]`}>
        {/* A flex box, so the logo sits on the same centre line as the Call Now button. */}
        <a href="#top" className="flex shrink-0 items-center transition-opacity hover:opacity-85">
          <img
            // A file for each size and screen density, so the browser never has to rescale the logo.
            src="/images/logo-nav-180.webp"
            srcSet={[120, 180, 240, 360, 540].map((w) => `/images/logo-nav-${w}.webp ${w}w`).join(', ')}
            sizes="(min-width: 640px) 180px, 120px"
            alt="St. John's Mini Market, Food & Wine"
            width="180"
            height="37"
            // 180px wide on desktop, 120px on phones.
            className="logo-crisp block h-auto w-[120px] sm:w-[180px]"
          />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="border-b-2 border-transparent py-1 text-xs font-extrabold uppercase tracking-[0.14em] transition-colors hover:border-burgundy hover:text-burgundy"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Magnetic className="shrink-0">
          <a href={SHOP.tel} className={`${btn} !min-h-11 bg-burgundy px-4 text-cream hover:bg-navy sm:px-5`}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call Now
          </a>
        </Magnetic>
      </div>
    </header>
  )
}

function Hero({ clock }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-blue text-navy">
      {/* With a shop-front photo, it sits behind a baby-blue veil and settles from 105% to 100% on load. */}
      {IMAGES.shopFront && (
        <>
          <m.img
            src="/images/shop-front.jpg"
            alt=""
            decoding="async"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, delay: INTRO_DELAY, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blue/85" />
        </>
      )}
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
          transition={{ duration: 0.6, delay: INTRO_DELAY + 0.2 }}
          className="flex justify-center"
        >
          {/* The hero badge: large, with a cream border and a soft halo. The time is London's, live. */}
          <p className="inline-flex items-center gap-3.5 rounded-full border-2 border-cream bg-navy px-6 py-3 text-lg font-bold text-cream shadow-[0_0_0_6px_rgb(245_239_224/0.3),0_14px_32px_-10px_rgb(26_35_64/0.65)] sm:gap-4 sm:px-8 sm:py-4 sm:text-2xl">
            <StatusDot open={clock.open} size="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="uppercase tracking-[0.1em]">{clock.open ? 'Open now' : 'Closed'}</span>
            <span className="text-cream/60" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              <span className="sr-only">Time in London: </span>
              {clock.time}
            </span>
          </p>
        </m.div>

        <div className="mt-auto pb-8 pt-10 sm:pb-10">
          {/* No entrance animation here: the headline is in place the moment the preloader lifts,
              which also keeps Largest Contentful Paint early. */}
          <h1 className="font-display sign-lettering text-[clamp(2.6rem,min(11.5vw,15svh),9.5rem)] font-black uppercase leading-[0.88]">
            <span className="block">St. John's</span>
            <span className="block">Mini Market</span>
          </h1>
          <MaskLines
            as="p"
            immediate
            delay={INTRO_DELAY + 0.2}
            lines={['Food · Wine · Everything in between.']}
            className="font-display mt-5 text-[clamp(1.25rem,3.6vw,3rem)] font-medium italic leading-tight text-burgundy"
          />

          <WordReveal
            immediate
            delay={0.45}
            text="A corner shop in Harlesden since forever. Serving the NW10 community morning to night."
            className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          />

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: INTRO_DELAY + 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <Magnetic>
              <a href={SHOP.tel} className={`${btn} w-full bg-burgundy px-7 py-4 text-cream hover:bg-navy sm:w-auto`}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {SHOP.phone}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={SHOP.directions}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} w-full border-2 border-navy px-7 py-[0.875rem] hover:bg-navy hover:text-cream sm:w-auto`}
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get Directions
              </a>
            </Magnetic>
          </m.div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-navy/30 py-4 font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] sm:text-xs">
          <p className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 bg-burgundy" aria-hidden="true" />
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
    <section id="neighbourhood" className="cream-to-blue relative overflow-x-clip pb-20 pt-10 sm:pb-28 sm:pt-14">
      {/* The shop's logo as a faint watermark behind the section. */}
      <img
        src="/images/logo-footer-3x.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -right-[12%] top-28 w-[125%] max-w-none -rotate-6 opacity-[0.08] sm:top-20 sm:w-[90%] lg:-right-[4%] lg:top-10 lg:w-[72%]"
      />
      <div className={`${WRAP} relative`}>
        <Confetti />
        <Reveal as="p" className={eyebrow}>
          <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
          Who we stock for
        </Reveal>
        <div className="relative w-fit">
          <MaskLines
            lines={['Stocked for the', 'neighbourhood']}
            className="font-display mt-5 text-[clamp(1.9rem,8.7vw,6rem)] font-black uppercase leading-[0.92]"
          />
          {/* A loose, hand-drawn burgundy line that draws itself under the headline. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 500 18"
            fill="none"
            className="absolute left-0 top-full mt-1 w-[78%] overflow-visible text-burgundy sm:mt-2"
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
        <Reveal as="p" delay={0.15} className="mt-10 max-w-md text-lg leading-relaxed text-navy/75 lg:ml-auto lg:mt-4">
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
                  <p className="mt-2 leading-relaxed text-navy/75">{shelf.text}</p>
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
    <section id="what-we-sell" className="relative isolate pb-24 sm:pb-36">
      {/* A faint Kente-inspired weave behind this section only. */}
      <KentePattern opacity={0.06} className="-z-10" />
      <div aria-hidden="true" className="carnival-stripe" />
      <div className={`${WRAP} pt-14 sm:pt-20`}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <MaskLines
            lines={['What we sell']}
            className="font-display text-[clamp(2.3rem,7.5vw,6rem)] font-black uppercase leading-[0.92]"
          />
          <Reveal as="p" className="flex items-center gap-2 pb-2 font-mono text-xs uppercase tracking-[0.2em] text-navy/75 lg:hidden">
            Swipe along <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Reveal>
          <Reveal as="p" className="hidden max-w-xs pb-3 text-navy/75 lg:block">
            Eight good reasons to pop in, and usually a ninth you had forgotten you needed.
          </Reveal>
        </div>
      </div>

      {/* Swipeable strip on phones and tablets, an eight-up index on desktop. */}
      <Reveal className="mx-auto mt-10 max-w-7xl lg:px-8">
        <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-5 sm:px-8 lg:grid lg:grid-cols-4 lg:overflow-visible lg:border-l lg:border-t lg:border-navy/20 lg:px-0">
          {PRODUCTS.map(({ icon: Icon, label, text }, i) => (
            <m.li
              key={label}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="group relative flex min-h-60 w-[70vw] max-w-xs shrink-0 snap-start flex-col justify-between border-y border-r border-navy/20 bg-cream p-6 transition-shadow duration-300 first:border-l hover:z-10 hover:shadow-[0_0_0_2px_rgb(95_180_224/0.9),0_18px_40px_-10px_rgb(95_180_224/0.8)] sm:w-64 lg:min-h-64 lg:w-auto lg:max-w-none lg:border-t-0 lg:p-7 lg:first:border-l-0"
            >
              <div className="flex items-start justify-between">
                <Icon
                  className="h-10 w-10 text-navy transition-colors duration-300 group-hover:text-burgundy"
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
    <section id="why-us" className="bg-blue">
      <div className={`${WRAP} grid gap-10 pb-20 sm:pb-28 lg:grid-cols-12 lg:gap-14`}>
        {/* The photo climbs out of the top of the block into the section above. */}
        <Reveal className="-mt-12 sm:-mt-20 lg:col-span-5">
          <div className="relative">
            <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full bg-burgundy" />
            <ShopImage
              src="/images/shop-interior.jpg"
              alt="Well stocked grocery shelves"
              className="aspect-[4/3] w-full lg:aspect-[4/5]"
            />
          </div>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em]">Inside · 90 St. Johns Ave</p>
        </Reveal>

        <div className="lg:col-span-7 lg:pt-24">
          <Reveal as="p" className={eyebrow}>
            <span className="h-0.5 w-8 bg-navy" aria-hidden="true" />
            Why shop with us
          </Reveal>
          <MaskLines
            lines={['Your local,', 'done properly']}
            className="font-display mt-5 text-[clamp(2.3rem,6.5vw,5rem)] font-black uppercase leading-[0.92]"
          />
          <WordReveal
            text="Four reasons the neighbourhood keeps coming back."
            className="mt-5 text-lg font-medium"
          />
          <ol className="mt-10 border-t-2 border-navy">
            {REASONS.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.06}
                className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-navy/30 py-6 sm:gap-x-8 sm:py-7"
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
              <Icon className="h-7 w-7 shrink-0 text-blue" strokeWidth={1.5} aria-hidden="true" />
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
        <div aria-hidden="true" className="absolute -bottom-3 -right-3 hidden h-full w-full bg-navy sm:block" />
        <div className="relative grid gap-8 bg-blue px-6 py-10 text-navy sm:px-12 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2.5 bg-navy px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cream">
              <StatusDot open={clock.open} />
              {clock.open ? 'Open now' : 'Closed · Back at 7am'}
            </p>
            <h2 className="mt-6">
              <span className="sr-only">Opening hours: </span>
              <MaskLines
                as="span"
                lines={['7am – 11pm']}
                className="font-display sign-lettering block text-[clamp(3.2rem,13vw,10rem)] font-black uppercase leading-[0.9]"
              />
              <span className="font-display mt-2 block text-[clamp(1.6rem,4.5vw,3.5rem)] font-medium italic leading-tight text-burgundy">
                Every single day
              </span>
            </h2>
          </div>
          <div className="flex items-end gap-4 border-t border-navy/30 pt-6 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 lg:text-right">
            <span className="font-display text-7xl font-black leading-[0.8] sm:text-9xl">
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
          <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
          Church End &amp; Roundwood, NW10
        </Reveal>
        <MaskLines
          lines={['Find us on', 'St Johns Avenue']}
          className="font-display mt-5 text-[clamp(1.9rem,8.6vw,6.5rem)] font-black uppercase leading-[0.92]"
        />

        <Reveal className="mt-10 border-y-2 border-navy py-6 sm:py-8">
          <p className={eyebrow}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Give us a ring
          </p>
          <a
            href={SHOP.tel}
            className="font-display mt-2 block w-fit whitespace-nowrap text-[clamp(2.4rem,11vw,8.5rem)] font-black leading-none text-burgundy transition-colors hover:text-navy"
          >
            {SHOP.phone}
          </a>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="relative lg:col-span-7">
            <div aria-hidden="true" className="absolute -bottom-3 -left-3 h-full w-full bg-burgundy" />
            <div className="relative h-[24rem] border-2 border-navy sm:h-[28rem]">
              {consent === 'accepted' ? (
                // data-lenis-prevent lets the map handle its own wheel and touch gestures
                <iframe
                  data-lenis-prevent
                  title="Map showing St. John's Mini Market, 90 St. Johns Ave, London NW10 4EG"
                  src={SHOP.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="block h-full w-full bg-offwhite"
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
                      className={`${btn} cursor-pointer bg-burgundy px-6 text-cream hover:bg-navy`}
                    >
                      Show the map
                    </button>
                    <a
                      href={SHOP.directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${btn} border-2 border-navy px-6 hover:bg-navy hover:text-cream`}
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
            <p className="mt-3 text-navy/75">Open every day, 7:00am to 11:00pm.</p>

            <Magnetic className="mt-8 w-full sm:w-fit">
              <a
                href={SHOP.directions}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} w-full bg-burgundy px-7 py-4 text-cream hover:bg-navy`}
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
    <footer className="bg-navy text-cream">
      <div aria-hidden="true" className="carnival-stripe" />
      {/* Extra room at the bottom on phones so the sticky bar and floating buttons never cover the credit. */}
      <div className={`${WRAP} pb-40 pt-14 sm:pt-16 md:pb-16`}>
        <p className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.95]">
          See you at the shop.
        </p>
        <a
          href={SHOP.tel}
          className="font-display mt-6 inline-block text-4xl font-black text-blue transition-colors hover:text-cream sm:text-5xl"
        >
          {SHOP.phone}
        </a>
        <img
          src="/images/logo-footer.webp"
          srcSet="/images/logo-footer.webp 1x, /images/logo-footer-2x.webp 2x, /images/logo-footer-3x.webp 3x"
          alt="St. John's Mini Market, Food & Wine"
          width="470"
          height="96"
          loading="lazy"
          decoding="async"
          className="mt-10 h-auto w-full max-w-[470px]"
        />
        <p className="mt-6 flex flex-col gap-1 text-cream/85 sm:flex-row sm:flex-wrap sm:gap-x-3">
          <span className="font-bold text-cream">{SHOP.name}</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>{SHOP.address}</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>Serving Harlesden, NW10</span>
        </p>
        <div className="mt-10 flex flex-col gap-4 border-t border-cream/30 pt-6 font-mono text-xs uppercase tracking-[0.16em] text-cream sm:flex-row sm:items-center sm:justify-between">
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

  // The header turns to frosted glass, and the floating controls appear, once the hero has
  // scrolled up behind the header. The threshold is the hero's own height in page pixels, so
  // a phone's collapsing address bar cannot flip it back and forth.
  const [pastHero, setPastHero] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const hero = document.getElementById('top')
    setPastHero(y > (hero ? hero.offsetHeight - 72 : 600))
  })

  return (
    // LazyMotion loads only the animation features the page uses, which keeps the bundle small.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Intro />
        <Header frosted={pastHero} />
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
