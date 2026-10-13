import { useEffect, useRef, useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation, m, useMotionValue, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ListChecks,
  MapPin,
  Navigation,
  Phone,
  Smile,
  Sunrise,
  Users,
} from 'lucide-react'
import { GrapeWatermark, IMAGES, KenteLine, Logo } from './brand.jsx'
import { Counter, Magnetic, Reveal, RevealLines, ShopImage, WordReveal, useSmoothScroll } from './motion.jsx'
import {
  CookieBanner,
  Faq,
  FloatingActions,
  MarqueeBand,
  MiniNav,
  MobileBar,
  PolaroidMarquee,
  Reviews,
} from './extras.jsx'
import { Intro } from './intro.jsx'
import { INTRO_DELAY, SECTION, SHOP, WRAP, btn, eyebrow, useCookieConsent, useShopClock } from './shop.js'

// Stock photos for now, kept in /public/images. To use the shop's own, replace the files.
const SHELVES = [
  {
    title: 'Caribbean shelf',
    list: 'Rice, peas, plantain, seasoning, spice',
    text: 'Caribbean and African staples, in stock every day.',
    src: '/images/caribbean-shelf.jpg',
    crop: '',
    alt: 'A pile of fresh yams',
    aspect: 'aspect-square lg:aspect-[16/9]',
    offset: '',
  },
  {
    title: 'Polish shelf',
    list: 'Deli, sweets, breads, pickles, cured meats',
    text: 'Polish and European brands you know.',
    src: '/images/polish-shelf.jpg',
    crop: '',
    alt: 'A coil of smoked sausage with slices of dark rye bread',
    aspect: 'aspect-square lg:aspect-[5/3]',
    offset: 'lg:mt-10',
  },
  {
    title: 'Fresh fruit and veg',
    list: 'Fruit, vegetables, fresh herbs',
    text: 'Fresh in every day.',
    src: '/images/fresh-produce.jpg',
    crop: '',
    alt: 'Fresh vegetables and herbs set out in wooden crates',
    aspect: 'aspect-square lg:aspect-[16/9]',
    offset: 'lg:mt-5',
  },
]

// What We Sell: one photo-led card each. Stock photos, kept in /public/images.
const PRODUCTS = [
  { label: 'Off Licence', text: 'Drinks to take away', src: '/images/sell-off-licence.jpg' },
  { label: 'Beer, Wine & Spirits', text: 'Lager, cider, wine and spirits', src: '/images/sell-spirits.jpg' },
  // A plain picture on purpose: UK rules restrict showing tobacco products.
  { label: 'Cigarettes & Tobacco', text: 'Over 18s only. Please bring ID.', src: '/images/sell-tobacco.jpg' },
  { label: 'News Agents', text: 'Papers and magazines', src: '/images/sell-news.jpg' },
  { label: 'Groceries', text: 'Milk, bread, tins and household', src: '/images/sell-groceries.jpg' },
  { label: 'Polish Foods', text: 'Deli, breads and pickles', src: '/images/sell-polish.jpg' },
  { label: 'Caribbean Foods', text: 'Rice, seasoning and spices', src: '/images/sell-caribbean.jpg' },
  { label: 'Fruit & Veg', text: 'Fresh every day', src: '/images/sell-fruit-veg.jpg' },
  { label: 'PayPoint', text: 'Pay your bills at the till', src: '/images/sell-paypoint.jpg' },
  { label: 'Mobile Top Ups', text: 'All major networks', src: '/images/sell-top-ups.jpg' },
  { label: 'Gas & Electric Top Ups', text: 'Top up your key or card', src: '/images/sell-energy.jpg' },
  { label: 'Oyster & Bus Top Ups', text: 'Top up your travel card at the till', src: '/images/sell-oyster.jpg' },
  { label: 'Amazon Click & Collect', text: 'Collect your parcels here', src: '/images/sell-parcels.jpg' },
]

const REASONS = [
  {
    icon: Sunrise,
    title: 'Open early, open late',
    text: 'We are open from 7am to 11pm, every day of the week.',
  },
  {
    icon: ListChecks,
    title: 'Everything in one place',
    text: 'Shopping, newspapers, bill payments, top ups and parcel collection, all in one trip.',
  },
  {
    icon: Smile,
    title: 'Friendly service',
    text: 'We know our regulars, and we are happy to help you find what you need.',
  },
  {
    icon: Users,
    title: 'Food from around the world',
    text: 'Caribbean, African, Polish, and European food, alongside the everyday basics.',
  },
]

// The two ticker bands that break up the page.
const BAND_TODAY = ['Fresh in today', 'Open 7 days', 'Serving NW10', 'Fruit & veg daily', '7am to 11pm']
const BAND_SHELVES = ['Caribbean', 'Polish', 'European', 'Fresh produce', 'Off licence', 'PayPoint']

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
    <header className="fixed inset-x-0 top-0 z-50 text-navy">
      <KenteLine />
      {/* Two backgrounds that cross-fade. Over the hero, cream that thins out into the sky so the
          header and hero are one canvas; once the hero has scrolled away, frosted cream glass that
          runs straight into the section bar beneath it. */}
      <div
        aria-hidden="true"
        className={`header-fuse absolute inset-0 -z-10 transition-opacity duration-500 ${frosted ? 'opacity-0' : ''}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-cream/85 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500 ${
          frosted ? '' : 'opacity-0'
        }`}
      />
      {/* With the 12px Kente line, the header is 80px tall on phones and 96px on desktop. */}
      <div className={`${WRAP} flex h-[calc(5rem-12px)] items-center justify-between gap-4 sm:h-[calc(6rem-12px)]`}>
        {/* A flex box, so the logo sits on the same centre line as the Call Now button. */}
        <a href="#top" className="flex min-w-0 items-center transition-opacity hover:opacity-85">
          {/* The whole sign as one badge: 260px wide on desktop, 200px on phones (a little less on the
              narrowest). A cream edge and a soft shadow keep it clear of the blue behind it. */}
          <Logo className="block h-auto w-[200px] max-w-full rounded-[4px] shadow-[0_0_0_2px_var(--color-cream),0_10px_20px_-10px_rgb(26_35_64/0.55)] sm:w-[260px]" />
        </a>

        <Magnetic className="shrink-0">
          <a href={SHOP.tel} className={`${btn} !min-h-11 bg-burgundy px-4 text-cream hover:bg-navy sm:px-5`}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            {/* The wide logo leaves room for one word on phones. */}
            <span>
              Call<span className="max-sm:hidden"> Now</span>
            </span>
          </a>
        </Magnetic>
      </div>
    </header>
  )
}

function Hero({ clock }) {
  // A faint spotlight that follows the mouse. It moves by transform only, and never on touch
  // screens, phones or for visitors who prefer reduced motion.
  const glowX = useMotionValue(-1000)
  const glowY = useMotionValue(-1000)
  const reduced = useReducedMotion()
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || reduced) return
    const box = e.currentTarget.getBoundingClientRect()
    glowX.set(e.clientX - box.left)
    glowY.set(e.clientY - box.top)
  }
  return (
    <section id="top" onPointerMove={onPointerMove} className="hero-sky relative isolate overflow-hidden bg-blue text-navy">
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
          <div aria-hidden="true" className="hero-sky absolute inset-0 -z-10 opacity-85" />
        </>
      )}
      {/* Three sizes: 150px on phones (a touch fainter), 250px on tablets, 400px on desktop. */}
      <GrapeWatermark className="absolute -right-10 top-24 -z-10 w-[150px] text-burgundy opacity-[0.11] md:-right-16 md:top-20 md:w-[250px] md:opacity-[0.13] desk:-right-28 desk:top-16 desk:w-[400px]" />
      <div
        aria-hidden="true"
        className="wine-glow absolute -left-[18%] bottom-[14%] -z-10 h-[62%] w-[120%] sm:-left-[10%] sm:w-[78%]"
      />
      <div
        aria-hidden="true"
        className="sun-glow absolute -right-[20%] -top-[12%] -z-10 aspect-square w-[95vw] max-w-[58rem] sm:-right-[8%]"
      />
      <div aria-hidden="true" className="grain-coarse absolute inset-0 -z-10" />
      <m.div
        aria-hidden="true"
        style={{ x: glowX, y: glowY }}
        className="cursor-glow pointer-events-none absolute -left-[300px] -top-[300px] -z-10 hidden h-[600px] w-[600px] will-change-transform lg:block"
      />

      {/* A touch short of the full screen so the ticker band peeks over the fold. On a tablet held
          upright the screen is very tall, so the height is capped to keep the headline near the top. */}
      <div className={`${WRAP} flex min-h-[calc(100svh-2.5rem)] flex-col pt-28 sm:pt-34 md:max-desk:min-h-[min(calc(100svh-2.5rem),46rem)]`}>
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: INTRO_DELAY + 0.2 }}
          className="flex justify-center"
        >
          {/* The hero badge: solid burgundy so it stands out on the blue. The time is London's, live. */}
          <p className="inline-flex items-center gap-2.5 rounded-full bg-burgundy px-4 py-2 text-xs font-bold text-cream shadow-[0_10px_24px_-10px_rgb(26_35_64/0.7)] sm:px-5 sm:py-2.5 sm:text-base">
            <StatusDot open={clock.open} size="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
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
          <RevealLines
            as="p"
            immediate
            delay={INTRO_DELAY + 0.2}
            lines={['Food · Wine · Everything in between.']}
            className="font-display mt-5 text-[clamp(1.25rem,3.6vw,3rem)] font-medium italic leading-tight text-burgundy"
          />

          <WordReveal
            immediate
            delay={0.45}
            text="Open 7 days a week from 7am to 11pm. Your local shop in Harlesden, NW10."
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
              Open <Counter to={7} duration={0.8} /> days · 7am to 11pm
            </span>
          </p>
          <p className="hidden sm:block">90 St. Johns Ave · NW10 4EG</p>
        </div>
      </div>
    </section>
  )
}

/** A stretch where one section's colour melts into the next, so sections never meet at a hard edge. */
function Fade({ className }) {
  return <div aria-hidden="true" className={`h-20 bg-linear-to-b ${className}`} />
}

function Neighbourhood() {
  return (
    <section id="neighbourhood" className={`cream-to-blue relative overflow-x-clip ${SECTION}`}>
      {/* The shop's logo as a faint watermark behind the section. */}
      <Logo
        plate={false}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] top-28 h-auto w-[125%] max-w-none -rotate-6 opacity-[0.05] sm:top-20 sm:w-[90%] lg:-right-[4%] lg:top-10 lg:w-[72%]"
      />
      <div className={`${WRAP} relative`}>
        <Confetti />
        <Reveal as="p" className={eyebrow}>
          <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
          On our shelves
        </Reveal>
        <div className="relative w-fit">
          <RevealLines
            lines={['Stocked for the', 'neighbourhood']}
            className="font-display heading-depth mt-5 text-[clamp(1.9rem,8.7vw,5rem)] font-black uppercase leading-[0.92]"
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
        <Reveal as="p" delay={0.15} className="mt-8 max-w-md text-lg leading-relaxed text-navy/75 lg:ml-auto lg:mt-4">
          Caribbean, African, Polish, and European ingredients. Fresh fruit and veg daily.
        </Reveal>

        <ul className="mt-8 grid gap-7 lg:mt-6 lg:grid-cols-3 lg:gap-8">
          {SHELVES.map((shelf, i) => (
            <Reveal as="li" key={shelf.title} delay={i * 0.1} className={shelf.offset}>
              <m.article
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="flex items-start gap-4 lg:block"
              >
                <ShopImage
                  src={shelf.src}
                  alt={shelf.alt}
                  className={`${shelf.aspect} w-2/5 shrink-0 sm:w-1/3 lg:w-full`}
                  imgClassName={shelf.crop}
                />
                {/* Photo beside the copy on phones; on desktop the caption overlaps the bottom of the photo. */}
                <div className="relative lg:-mt-12 lg:ml-6 lg:mr-8 lg:bg-cream lg:p-6">
                  <p className="font-mono text-xs tracking-[0.2em]">0{i + 1}</p>
                  <h3 className="font-display mt-1.5 text-2xl font-bold leading-none sm:text-4xl lg:mt-2">
                    {shelf.title}
                  </h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] sm:text-sm lg:mt-3">{shelf.list}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/75 sm:text-base lg:mt-2">{shelf.text}</p>
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
  // The strip scrolls sideways: by swipe on touch screens, and by trackpad, the arrow buttons or
  // dragging with the mouse on desktop.
  const strip = useRef(null)
  const drag = useRef(null)
  const step = (direction) => strip.current.scrollBy({ left: direction * 472, behavior: 'smooth' })
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') drag.current = { x: e.clientX, left: strip.current.scrollLeft }
  }
  const onPointerMove = (e) => {
    if (drag.current) strip.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
  }
  const endDrag = () => {
    drag.current = null
  }
  const arrow =
    'grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 border-navy transition-colors duration-200 hover:bg-navy hover:text-cream'

  return (
    <section id="what-we-sell" className="relative isolate overflow-clip bg-linear-to-b from-cream to-sand">
      <div aria-hidden="true" className="carnival-stripe" />
      <GrapeWatermark className="absolute -bottom-8 -left-10 -z-10 w-[150px] text-burgundy opacity-[0.11] md:-bottom-12 md:-left-16 md:w-[250px] md:opacity-[0.13] desk:-bottom-20 desk:-left-28 desk:w-[400px]" />
      <div className={`${WRAP} pt-12 md:pt-16`}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <RevealLines
              lines={['What we sell']}
              className="font-display heading-depth text-[clamp(2rem,5.5vw,4rem)] font-black uppercase leading-[0.92]"
            />
            <Reveal delay={0.2} aria-hidden="true" className="mt-3 h-1 w-24 bg-burgundy sm:mt-4 sm:w-32" />
          </div>
          <Reveal as="p" className="flex items-center gap-2 pb-1 font-mono text-xs uppercase tracking-[0.2em] text-navy/75 md:hidden">
            Swipe along <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Reveal>
          <Reveal className="hidden items-center gap-6 md:flex">
            <p className="max-w-xs text-navy/75 max-lg:hidden">Everything you need from your local shop.</p>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => step(-1)} aria-label="Scroll back" className={arrow}>
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Scroll along" className={arrow}>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* One row of photo cards on every screen size. The strip's own padding leaves room for the
          card shadows, and its side padding lines the first card up with the heading and keeps the
          last one clear of the faded edge. */}
      <Reveal className="pb-4 md:pb-8">
        <ul
          ref={strip}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="sell-strip no-scrollbar flex scroll-px-5 gap-4 overflow-x-auto px-5 py-6 select-none max-desk:snap-x max-desk:snap-mandatory sm:scroll-px-8 sm:px-8 desk:cursor-grab desk:pl-[max(2rem,calc(50vw-38rem))] desk:pr-[max(5rem,calc(50vw-38rem))] desk:active:cursor-grabbing [&_img]:pointer-events-none"
        >
          {PRODUCTS.map(({ label, text, src }) => (
            // Floats on a warm shadow; lifts on hover as the shadow deepens.
            <m.li
              key={label}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="card-float flex h-[280px] w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-[4px] bg-cream"
            >
              {/* The photo stands in for an icon; the title beside it says what it is. */}
              <ShopImage src={src} alt="" className="h-[70%] w-full" />
              <div className="flex flex-1 flex-col justify-center px-3.5">
                <h3 className="font-display text-[1.05rem] font-bold leading-tight text-burgundy">{label}</h3>
                <p className="mt-1 text-xs leading-snug text-navy/60">{text}</p>
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
      <div className={`${WRAP} ${SECTION} grid gap-10 lg:grid-cols-12 lg:gap-14`}>
        <Reveal className="lg:col-span-5">
          <div className="relative">
            <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full bg-burgundy" />
            <ShopImage
              src="/images/shop-interior.jpg"
              alt="Well stocked grocery shelves"
              className="aspect-[16/9] w-full lg:aspect-[6/7]"
            />
          </div>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em]">Inside · 90 St. Johns Ave</p>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal as="p" className={eyebrow}>
            <span className="h-0.5 w-8 bg-navy" aria-hidden="true" />
            Your local shop
          </Reveal>
          <RevealLines
            lines={['Why shop', 'with us']}
            className="font-display heading-depth mt-5 text-[clamp(2.3rem,6.5vw,4.25rem)] font-black uppercase leading-[0.92]"
          />
          <WordReveal
            text="Four reasons to shop local."
            className="mt-5 text-lg font-medium"
          />
          <ol className="mt-7 border-t-2 border-navy">
            {REASONS.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.06}
                className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-navy/30 py-4 sm:gap-x-8"
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

function Visit({ clock, consent, setConsent }) {
  return (
    <section id="visit">
      <div aria-hidden="true" className="carnival-stripe" />
      <div className={`${WRAP} ${SECTION}`}>
        <Reveal as="p" className={eyebrow}>
          <span className="h-0.5 w-8 bg-burgundy" aria-hidden="true" />
          Church End &amp; Roundwood, NW10
        </Reveal>
        <RevealLines
          lines={['Visit us']}
          className="font-display heading-depth mt-5 text-[clamp(2.3rem,8.6vw,5rem)] font-black uppercase leading-[0.92]"
        />

        {/* Opening hours first on phones and on the left on desktop; where to find us beside it. */}
        <div className="mt-8 grid gap-9 lg:grid-cols-12 lg:gap-14">
          <Reveal className="relative lg:col-span-7">
            <div aria-hidden="true" className="absolute -bottom-3 -right-3 hidden h-full w-full bg-navy sm:block" />
            <div className="relative flex h-full flex-col justify-between gap-7 bg-blue px-6 py-8 text-navy sm:px-12 sm:py-11">
              <div>
                <p className="inline-flex items-center gap-2.5 bg-navy px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cream">
                  <StatusDot open={clock.open} />
                  {clock.open ? 'Open now' : 'Closed · Opens 7am'}
                </p>
                <h3 className="mt-6">
                  <span className="sr-only">Opening hours: </span>
                  <RevealLines
                    as="span"
                    lines={['7am to 11pm']}
                    className="font-display sign-lettering block text-[clamp(2rem,10.5vw,7.5rem)] font-black uppercase leading-[0.9] lg:text-[clamp(3rem,6vw,5.25rem)]"
                  />
                  <span className="font-display mt-2 block text-[clamp(1.6rem,4.5vw,3rem)] font-medium italic leading-tight text-burgundy">
                    Every day
                  </span>
                </h3>
              </div>
              <div className="flex items-end gap-4 border-t border-navy/30 pt-6">
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

          <Reveal delay={0.1} className="lg:col-span-5">
            <p className={eyebrow}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Address
            </p>
            <address className="font-display mt-3 text-3xl font-bold not-italic leading-tight sm:text-4xl">
              90 St. Johns Ave,
              <br />
              London NW10 4EG
            </address>

            <p className={`${eyebrow} mt-6`}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Phone
            </p>
            <a
              href={SHOP.tel}
              className="font-display mt-2 block w-fit whitespace-nowrap text-[clamp(2.4rem,11vw,4.5rem)] font-black leading-none text-burgundy transition-colors hover:text-navy lg:text-[clamp(2.5rem,4.2vw,3.5rem)]"
            >
              {SHOP.phone}
            </a>

            <Magnetic className="mt-6 w-full sm:w-fit">
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

            <div className="relative mt-8">
              <div aria-hidden="true" className="absolute -bottom-3 -left-3 h-full w-full bg-burgundy" />
              <div className="relative h-64 border-2 border-navy lg:h-60">
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
                  <div className="placeholder-light flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
                    <MapPin className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" />
                    <p className="max-w-xs text-sm leading-relaxed">
                      The map is from Google and uses cookies. Press the button to load it.
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Footer({ onCookieSettings }) {
  const link = 'underline-offset-4 transition-colors hover:text-cream hover:underline'
  return (
    <footer className="relative isolate overflow-hidden bg-navy text-cream">
      {/* Burgundy, like the other watermarks. It needs far more strength here than their 5%: burgundy
          and navy are both dark, so anything fainter cannot be seen at all. */}
      <GrapeWatermark className="absolute left-1/2 top-1/2 -z-10 w-[150px] -translate-x-1/2 -translate-y-1/2 text-burgundy opacity-25 md:w-[260px] md:opacity-30 desk:w-[420px] desk:opacity-35" />
      {/* Extra room at the bottom on phones so the floating buttons never cover the credit. */}
      <div className={`${WRAP} pb-24 pt-8 md:pb-12`}>
        <p className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.95]">
          See you at the shop.
        </p>
        <a
          href={SHOP.tel}
          className="font-display mt-6 inline-block text-4xl font-black text-blue transition-colors hover:text-cream sm:text-5xl"
        >
          {SHOP.phone}
        </a>
        <Logo className="mt-8 block h-auto w-full max-w-[470px]" />
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
      <KenteLine />
      {/* On phones the sticky Call and Directions bar covers the bottom of the screen: this keeps the line above it. */}
      <div aria-hidden="true" className="h-[calc(4.25rem+env(safe-area-inset-bottom))] md:hidden" />
    </footer>
  )
}

export default function App() {
  useSmoothScroll()
  const clock = useShopClock()
  const [consent, setConsent] = useCookieConsent()

  // The header turns to frosted glass, and the section bar and floating controls appear, once
  // the hero has scrolled up behind the header. An observer on the hero, not a scroll listener.
  const [pastHero, setPastHero] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: '-96px 0px 0px 0px',
    })
    observer.observe(document.getElementById('top'))
    return () => observer.disconnect()
  }, [])

  return (
    // LazyMotion loads only the animation features the page uses, which keeps the bundle small.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Intro />
        <Header frosted={pastHero} />
        <MiniNav show={pastHero} />
        <main>
          <Hero clock={clock} />
          <KenteLine />
          <MarqueeBand items={BAND_TODAY} />
          <PolaroidMarquee />
          <WhatWeSell />
          <Fade className="from-sand to-cream" />
          <Visit clock={clock} consent={consent} setConsent={setConsent} />
          <Neighbourhood />
          <KenteLine />
          <MarqueeBand items={BAND_SHELVES} className="bg-blue" />
          <WhyShop />
          <Fade className="from-blue to-cream" />
          <Reviews />
          <Faq />
          <Fade className="from-cream to-navy" />
        </main>
        <Footer onCookieSettings={() => setConsent(null)} />
        <MobileBar show={pastHero} />
        <FloatingActions show={pastHero} />
        <CookieBanner consent={consent} setConsent={setConsent} />
      </MotionConfig>
    </LazyMotion>
  )
}
