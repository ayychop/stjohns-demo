import { useEffect, useState } from 'react'

export const SHOP = {
  name: "St. John's Mini Market",
  phone: '020 8965 9565',
  tel: 'tel:+442089659565',
  address: '90 St. Johns Ave, London NW10 4EG',
  openHour: 7,
  closeHour: 23,
  rating: 4.2,
  reviewCount: 27,
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=90+St.+Johns+Ave%2C+London+NW10+4EG',
  mapEmbed: 'https://www.google.com/maps?q=90+St.+Johns+Ave%2C+London+NW10+4EG&z=16&output=embed',
}

export const WRAP = 'mx-auto max-w-7xl px-5 sm:px-8'
export const btn =
  'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[3px] text-sm font-bold uppercase tracking-[0.08em] transition-colors duration-200'
// Every section has the same breathing room: 48px on phones, 72px on desktop.
export const SECTION = 'py-12 md:py-18'
export const eyebrow = 'flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em]'

// The opening sequence (src/intro.jsx) lasts 2.5 seconds. For the first 1.8 the
// shop's lights come on (1 second, already lit, for visitors who prefer reduced
// motion); this is that part, in milliseconds. The view then moves in through
// the open shopfront and the screen fades over the remaining 0.7.
const LIGHTS_MS = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1000 : 1800
export const PRELOADER_MS = document.documentElement.classList.contains('skip-preloader') ? 0 : LIGHTS_MS

// Seconds to hold the hero entrance while the preloader is on screen.
export const INTRO_DELAY = PRELOADER_MS / 1000

const INTRO_END = performance.now() + PRELOADER_MS
/** Seconds until the loading screen lifts (0 once it has), so nothing animates behind it. */
export const introRemaining = () => Math.max(0, INTRO_END - performance.now()) / 1000

const londonClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** The current time in London as "HH:MM", and whether the shop is open right now. */
export function useShopClock() {
  const [time, setTime] = useState(() => londonClock.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setTime(londonClock.format(new Date())), 10_000)
    return () => clearInterval(id)
  }, [])
  const hour = Number(time.slice(0, 2))
  return { time, open: hour >= SHOP.openHour && hour < SHOP.closeHour }
}

const CONSENT_KEY = 'sj-cookie-consent'

/**
 * The visitor's cookie choice: 'accepted', 'declined', or null if not yet asked.
 * It is kept in localStorage, which is not itself a cookie.
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState(() => {
    try {
      return localStorage.getItem(CONSENT_KEY)
    } catch {
      return null
    }
  })
  const update = (value) => {
    try {
      if (value) localStorage.setItem(CONSENT_KEY, value)
      else localStorage.removeItem(CONSENT_KEY)
    } catch {
      // Storage can be blocked; the choice then lasts for this page view only.
    }
    setConsent(value)
  }
  return [consent, update]
}
