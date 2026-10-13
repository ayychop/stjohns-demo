import { useEffect, useState } from 'react'

export const SHOP = {
  name: "St. John's Mini Market",
  phone: '020 8965 9565',
  tel: 'tel:+442089659565',
  // PLACEHOLDER: swap for the shop's real WhatsApp number, in international
  // format with no plus sign or spaces (e.g. 447911123456).
  whatsapp: '440000000000',
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
export const eyebrow = 'flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em]'

// The preloader stays up until 800ms after the page started loading. On a slow
// connection that moment has already passed by the time the app arrives, so
// nobody waits longer than they have to.
export const PRELOADER_MS = document.documentElement.classList.contains('skip-preloader')
  ? 0
  : Math.max(0, 800 - performance.now())

// Seconds to hold the hero entrance while the preloader is on screen.
export const INTRO_DELAY = PRELOADER_MS / 1000

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
