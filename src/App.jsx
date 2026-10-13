import { useRef } from 'react'
import { MotionConfig, motion, useInView } from 'framer-motion'
import {
  Apple,
  Bus,
  CalendarCheck,
  Clock,
  CreditCard,
  Heart,
  MapPin,
  Navigation,
  Newspaper,
  Package,
  Phone,
  Receipt,
  ShoppingBasket,
  Smartphone,
  Star,
  Store,
  Sun,
  Tv,
  Users,
  Utensils,
  Wine,
} from 'lucide-react'
import { Counter, Magnetic, Reveal, ShopImage, useSmoothScroll } from './motion.jsx'

const SHOP = {
  name: "St. John's Mini Market",
  tagline: 'Food & Wine',
  phone: '020 8965 9565',
  tel: 'tel:+442089659565',
  address: '90 St. Johns Ave, London NW10 4EG',
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=90+St.+Johns+Ave%2C+London+NW10+4EG',
  mapEmbed: 'https://www.google.com/maps?q=90+St.+Johns+Ave%2C+London+NW10+4EG&z=16&output=embed',
}

const PRODUCTS = [
  { icon: Wine, label: 'Off Licence' },
  { icon: Newspaper, label: 'News Agents' },
  { icon: ShoppingBasket, label: 'Groceries' },
  { icon: Utensils, label: 'Polish Foods' },
  { icon: Sun, label: 'Caribbean Foods' },
  { icon: Apple, label: 'Fruit & Veg' },
  { icon: CreditCard, label: 'PayPoint' },
  { icon: Smartphone, label: 'Mobile Top-ups' },
]

const REASONS = [
  {
    icon: CalendarCheck,
    title: (
      <>
        Open <Counter to={7} duration={0.8} /> days a week
      </>
    ),
    text: 'Early mornings to late nights, 7am to 11pm, every single day.',
  },
  {
    icon: Store,
    title: 'Everything under one roof',
    text: 'Groceries, drinks, papers, bills and top-ups in one quick trip.',
  },
  {
    icon: Users,
    title: 'Serving the NW10 community',
    text: 'A proper local shop for Church End, Roundwood and the streets around.',
  },
  {
    icon: Heart,
    title: 'Friendly local service',
    text: 'Familiar faces behind the counter who are always happy to help.',
  },
]

const SERVICES = [
  { icon: CreditCard, label: 'PayPoint', text: 'Pay bills and top up gas and electric.' },
  { icon: Bus, label: 'Bus Tickets', text: 'Grab your bus pass on the way.' },
  { icon: Tv, label: 'TV Licence', text: 'Pay your TV licence over the counter.' },
  { icon: Smartphone, label: 'Mobile Top-ups', text: 'All the major UK networks.' },
  { icon: Receipt, label: 'Oyster Top-ups', text: 'Add credit before you travel.' },
  { icon: Package, label: 'Amazon Click & Collect', text: 'Pick up parcels when it suits you.' },
]

const NAV = [
  { href: '#what-we-sell', label: 'What We Sell' },
  { href: '#services', label: 'Services' },
  { href: '#hours', label: 'Hours' },
  { href: '#find-us', label: 'Find Us' },
]

const btn =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-200'
const btnRed = `${btn} bg-accent text-white shadow-soft hover:bg-accent-dark`
const btnBlue = `${btn} bg-brand text-white shadow-soft hover:bg-brand-dark`

function SectionHeading({ eyebrow, title, intro, center = true }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
    </Reveal>
  )
}

function Header({ frosted }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        frosted
          ? 'border-brand/10 bg-cream/70 shadow-soft backdrop-blur-xl backdrop-saturate-150'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-sm font-extrabold text-cream">
            SJ
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-extrabold text-brand sm:text-lg">
              {SHOP.name}
            </span>
            <span className="hidden text-xs font-semibold text-accent sm:block">{SHOP.tagline}</span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink/80 transition-colors hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href={SHOP.tel} className={`${btnRed} shrink-0 px-4 py-2.5 text-sm sm:px-5`}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Now
        </a>
      </div>
    </header>
  )
}

function Hero({ heroRef }) {
  return (
    <section id="top" ref={heroRef} className="relative overflow-hidden pt-24 sm:pt-32">
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-soft blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent-soft blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 sm:px-8 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-soft">
            <Star className="h-4 w-4 fill-sun text-sun" aria-hidden="true" />
            <span>
              <Counter to={4.2} decimals={1} /> stars · <Counter to={27} /> reviews
            </span>
            <span className="font-medium text-muted">on Google</span>
          </div>

          <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[1.02] tracking-tight text-brand sm:text-6xl lg:text-7xl">
            St. John's
            <br />
            Mini Market
          </h1>
          <p className="mt-4 text-2xl font-extrabold text-accent sm:text-3xl">{SHOP.tagline}</p>
          <p className="mt-5 max-w-lg text-lg text-muted">
            Your friendly corner shop on St. Johns Avenue, proudly serving the NW10 community with
            fresh food, cold drinks and everyday essentials, from early morning until late.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Magnetic>
              <a href={SHOP.tel} className={`${btnRed} w-full px-7 py-4 text-base sm:w-auto`}>
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call Us
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={SHOP.directions}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnBlue} w-full px-7 py-4 text-base sm:w-auto`}
              >
                <Navigation className="h-5 w-5" aria-hidden="true" />
                Get Directions
              </a>
            </Magnetic>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink/80">
            <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
            Open every day, 7:00am to 11:00pm
          </p>
        </motion.div>

        <div className="relative">
          <ShopImage
            src="/images/shop-front.jpg"
            alt="The shop front of St. John's Mini Market on St. Johns Avenue"
            label="Shop front photo"
            className="aspect-[4/3] rounded-[2rem] shadow-lift lg:aspect-[4/5]"
            scaleIn
            eager
          />
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift sm:left-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-extrabold text-brand">90 St. Johns Ave</span>
              <span className="text-muted">London NW10 4EG</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatWeSell() {
  return (
    <section id="what-we-sell" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What we sell"
          title="All your everyday essentials"
          intro="From the weekly basics to a taste of home, the shelves are stocked for the whole neighbourhood."
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-4">
          {PRODUCTS.map(({ icon: Icon, label }, i) => (
            <Reveal as="li" key={label} delay={(i % 4) * 0.06}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="group flex h-full flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-soft transition-shadow duration-300 hover:shadow-glow sm:p-8"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white sm:h-16 sm:w-16">
                  <Icon className="h-7 w-7" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span className="text-base font-bold text-ink sm:text-lg">{label}</span>
              </motion.div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function WhyShop() {
  return (
    <section id="why-us" className="bg-cream-deep px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="grid grid-cols-5 items-end gap-4">
          <ShopImage
            src="/images/aisle.jpg"
            alt="Well stocked aisle inside the shop"
            label="Aisle photo"
            className="col-span-3 aspect-[3/4] rounded-[2rem] shadow-lift"
          />
          <ShopImage
            src="/images/produce.jpg"
            alt="Fresh fruit and vegetables on display"
            label="Produce photo"
            className="col-span-2 aspect-square rounded-[1.5rem] shadow-soft"
          />
        </Reveal>

        <div>
          <SectionHeading
            center={false}
            eyebrow="Why shop with us"
            title="Your local, done properly"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {REASONS.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={i} delay={i * 0.07} className="rounded-3xl bg-white p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-brand">{title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Services"
          title="More than just a shop"
          intro="Sort the errands while you pick up the milk."
        />
        <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, label, text }, i) => (
            <Reveal
              as="li"
              key={label}
              delay={(i % 3) * 0.06}
              className="flex items-center gap-4 rounded-3xl border border-brand/10 bg-white p-5 shadow-soft"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                <Icon className="h-6 w-6" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-extrabold text-ink">{label}</span>
                <span className="text-sm text-muted">{text}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Hours() {
  return (
    <section id="hours" className="px-5 pb-16 sm:px-8 sm:pb-24">
      <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-brand px-6 py-12 text-center text-white shadow-lift sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/40 blur-2xl"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-bold">
            <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
            Open <Counter to={7} duration={0.8} /> days
          </span>
          <h2 className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-white/70">
            Opening hours
          </h2>
          <p className="mt-3 text-2xl font-bold text-white/90 sm:text-3xl">Monday to Sunday</p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            7:00am to 11:00pm
          </p>
          <p className="mx-auto mt-5 max-w-md text-white/75">
            Same hours every day of the week, so we are here whenever you need us.
          </p>
        </div>
      </Reveal>
    </section>
  )
}

function FindUs() {
  return (
    <section id="find-us" className="bg-cream-deep px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Location & contact"
          title="Come and say hello"
          intro="Find us on St. Johns Avenue, in the Church End and Roundwood area."
        />
        <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-[0.9fr_1.4fr]">
          <Reveal className="flex flex-col gap-7 rounded-[2rem] bg-white p-7 shadow-soft sm:p-9">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call us
              </p>
              <a
                href={SHOP.tel}
                className="mt-2 block text-4xl font-extrabold tracking-tight text-brand transition-colors hover:text-accent sm:text-[2.75rem]"
              >
                {SHOP.phone}
              </a>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Visit us
              </p>
              <address className="mt-2 text-xl font-bold not-italic leading-snug text-ink">
                90 St. Johns Ave,
                <br />
                London NW10 4EG
              </address>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Hours
              </p>
              <p className="mt-2 text-lg font-bold text-ink">Mon to Sun, 7:00am to 11:00pm</p>
            </div>
            <a
              href={SHOP.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnBlue} mt-auto px-6 py-4 text-base`}
            >
              <Navigation className="h-5 w-5" aria-hidden="true" />
              Get Directions
            </a>
          </Reveal>

          {/* data-lenis-prevent lets the map handle its own wheel and touch gestures */}
          <Reveal
            delay={0.08}
            data-lenis-prevent
            className="min-h-[22rem] overflow-hidden rounded-[2rem] bg-brand-soft shadow-soft lg:min-h-[30rem]"
          >
            <iframe
              title="Map showing St. John's Mini Market, 90 St. Johns Ave, London NW10 4EG"
              src={SHOP.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-[22rem] w-full border-0 lg:min-h-[30rem]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-brand-dark px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-2xl font-extrabold">{SHOP.name}</p>
          <p className="font-semibold text-white/70">{SHOP.tagline}</p>
          <p className="mt-4 max-w-sm text-white/70">
            Proud to be part of the NW10 community. Thank you for shopping local.
          </p>
        </div>
        <div className="sm:text-right">
          <a href={SHOP.tel} className="text-2xl font-extrabold transition-colors hover:text-sun">
            {SHOP.phone}
          </a>
          <p className="mt-2 text-white/70">{SHOP.address}</p>
          <p className="text-white/70">Open 7 days, 7:00am to 11:00pm</p>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SHOP.name}
        </p>
        <p>Website by BOA Network</p>
      </div>
    </footer>
  )
}

export default function App() {
  useSmoothScroll()
  const heroRef = useRef(null)
  // Header turns frosted once the hero has scrolled out from under it.
  const heroVisible = useInView(heroRef, { margin: '-72px 0px 0px 0px', initial: true })

  return (
    <MotionConfig reducedMotion="user">
      <Header frosted={!heroVisible} />
      <main>
        <Hero heroRef={heroRef} />
        <WhatWeSell />
        <WhyShop />
        <Services />
        <Hours />
        <FindUs />
      </main>
      <Footer />
    </MotionConfig>
  )
}
