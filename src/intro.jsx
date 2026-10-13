import { useEffect, useLayoutEffect, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { PRELOADER_MS } from './shop.js'

// The opening sequence: the shop at 90 St. Johns Ave at dusk, drawn in SVG.
// It fades in dark on cream, the FOOD & WINE sign comes on, then the red
// awning under it, then the light inside, and the view moves in through the
// open shopfront as the page takes over. 2.5 seconds in all; the first part is
// PRELOADER_MS (see shop.js), the move through the front is ENTER below.
const ENTER = 0.7
// The sign's opacity as it comes on.
const FLICKER = [0, 0.8, 0.2, 0.95, 0.55, 1]

const RED = '#b8342e'
const BLUE = '#5fb4e0'
const CREAM = '#f5efe0'
const NAVY = '#1a2340'
const GREEN = '#2f7d4f' // the shop's green metal shelving
const PRODUCE = ['#e8912d', '#c8372d', '#7fb04a', '#e9c93a', '#6a2f55', '#d9542b', '#9cc25a']
const PACKETS = ['#f5efe0', '#b8342e', '#5fb4e0', '#e9c93a', '#2f7d4f', '#6b1e2e', '#f5efe0', '#e8912d']

// The awning's front edge sags a little in the middle: a point `t` of the way along it.
const awningEdge = (t) => [32 + 336 * t, 198 + 24 * t * (1 - t)]

/** The blue sign panel over the awning. */
function Sign() {
  const lettering = {
    textAnchor: 'middle',
    fontFamily: "'Fraunces Variable', Georgia, 'Times New Roman', serif",
    fontSize: 27,
    fontWeight: 900,
    textLength: 236,
    lengthAdjust: 'spacingAndGlyphs',
  }
  return (
    <g>
      <rect x="46" y="118" width="308" height="44" fill="url(#intro-sign)" />
      <rect x="49.5" y="121.5" width="301" height="37" fill="none" stroke={CREAM} strokeOpacity="0.7" strokeWidth="1" />
      <path d="M122 127.5h30M248 127.5h30" stroke={RED} strokeWidth="1.4" />
      <text
        x="200"
        y="130"
        textAnchor="middle"
        fontFamily="'Inter Variable', system-ui, sans-serif"
        fontSize="6.4"
        fontWeight="700"
        letterSpacing="1.1"
        fill={CREAM}
      >
        ST. JOHN&apos;S MINI MARKET
      </text>
      {/* Cream letters with a red drop shadow, as on the real sign. */}
      <text x="201.3" y="155.3" fill={RED} {...lettering}>
        FOOD &amp; WINE
      </text>
      <text x="200" y="154" fill="#faf7f0" {...lettering}>
        FOOD &amp; WINE
      </text>
    </g>
  )
}

/** The red awning: a canopy leaning out over the pavement, with a valance along its front edge. */
function Awning() {
  return (
    <g>
      <path d="M46 162H354L368 198Q200 210 32 198Z" fill="url(#intro-awning)" />
      {/* seams running down the canvas */}
      <g stroke="#7d201c" strokeOpacity="0.55" strokeWidth="0.8">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => {
          const [x, y] = awningEdge(i / 8)
          return <path key={i} d={`M${46 + (308 * i) / 8} 162L${x} ${y}`} />
        })}
      </g>
      <path d="M32 198Q200 210 368 198V207Q200 219 32 207Z" fill="#8f2620" />
      <path d="M32 198Q200 210 368 198" fill="none" stroke="#e0685c" strokeOpacity="0.6" strokeWidth="0.8" />
    </g>
  )
}

/** One bay of green mesh shelving, three tiers of fruit and veg. */
function Rack({ x, shift = 0 }) {
  return (
    <g>
      <rect x={x} y="218" width="52" height="68" fill="url(#intro-mesh)" />
      {[236, 254, 272].map((y, tier) => (
        <g key={y}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={i}
              cx={x + 6.5 + i * 7.8}
              cy={y - 4.4}
              r="4.4"
              fill={PRODUCE[(i + tier * 3 + shift) % PRODUCE.length]}
            />
          ))}
          <rect x={x} y={y} width="52" height="2.2" fill={GREEN} />
        </g>
      ))}
      <rect x={x} y="216" width="2.2" height="70" fill={GREEN} />
      <rect x={x + 49.8} y="216" width="2.2" height="70" fill={GREEN} />
    </g>
  )
}

/** A plastic crate on the pavement, heaped with produce. */
function Crate({ x, colour, shift = 0 }) {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={x + 4.5 + i * 5} cy="271.5" r="3.6" fill={PRODUCE[(i + shift) % PRODUCE.length]} />
      ))}
      <rect x={x} y="272" width="24" height="14" rx="1" fill={colour} />
      <path d={`M${x + 3} 276h18M${x + 3} 280h18`} stroke={NAVY} strokeOpacity="0.35" strokeWidth="1.2" />
    </g>
  )
}

/** What can be seen through the open front: shelves at the back, racks and crates at the entrance. */
function Stock() {
  return (
    <g>
      {/* shelves along the back wall, small with distance */}
      {[230, 246, 262].map((y, row) => (
        <g key={y}>
          {PACKETS.map((fill, i) => (
            <rect
              key={i}
              x={140 + i * 15.4 + ((i + row) % 2)}
              y={y - 9 - ((i * 3 + row) % 3)}
              width="11"
              height={9 + ((i * 3 + row) % 3)}
              fill={PACKETS[(i + row * 3) % PACKETS.length]}
              opacity="0.85"
            />
          ))}
          <rect x="136" y={y} width="128" height="1.6" fill="#3a4a2a" />
        </g>
      ))}
      <Rack x={66} />
      <Rack x={282} shift={2} />
      <Crate x={122} colour={GREEN} shift={1} />
      <Crate x={148} colour="#2b3350" shift={4} />
      <Crate x={228} colour="#2b3350" />
      <Crate x={254} colour={GREEN} shift={3} />
    </g>
  )
}

export function Intro() {
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(PRELOADER_MS ? 'lights' : 'gone')

  // Take over from the plain cream cover in index.html.
  useLayoutEffect(() => {
    document.getElementById('preloader')?.remove()
  }, [])

  useEffect(() => {
    if (stage !== 'lights') return
    const id = setTimeout(() => setStage('enter'), PRELOADER_MS)
    return () => clearTimeout(id)
  }, [stage])

  if (stage === 'gone') return null
  const entering = stage === 'enter'
  // With reduced motion the shop is simply there, lit, and then fades.
  const off = reduced ? false : { opacity: 0 }
  const on = (delay, duration) => ({ delay, duration, ease: 'easeOut' })
  const flicker = { delay: 0.45, duration: 0.5, times: [0, 0.14, 0.26, 0.42, 0.55, 1], ease: 'linear' }

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-cream"
      style={{ backgroundImage: 'radial-gradient(120% 90% at 50% 45%, #faf7f0, #f5efe0 62%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: entering ? 0 : 1 }}
      transition={{ duration: ENTER - 0.25, delay: 0.25, ease: 'easeIn' }}
      onAnimationComplete={() => entering && setStage('gone')}
    >
      {/* The camera: a slow drift towards the shop, then in through the open front. */}
      <m.div
        className="w-[min(94vw,40rem,112svh)]"
        style={{ transformOrigin: '50% 79%', willChange: 'transform' }}
        initial={{ scale: 1 }}
        animate={{ scale: entering ? 3.6 : 1.05 }}
        transition={
          entering
            ? { duration: ENTER, ease: [0.55, 0, 0.8, 0.3] }
            : { duration: PRELOADER_MS / 1000, ease: 'linear' }
        }
      >
        <svg viewBox="0 0 400 320" className="block h-auto w-full overflow-visible">
          <defs>
            <filter id="intro-soft" x="-20%" y="-80%" width="140%" height="260%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <filter id="intro-bloom" x="-40%" y="-60%" width="180%" height="220%">
              <feGaussianBlur stdDeviation="13" />
            </filter>
            {/* London stock brick: two courses, each brick a slightly different bake */}
            <pattern id="intro-brick" width="48" height="16" patternUnits="userSpaceOnUse">
              <rect width="48" height="16" fill="#cdbb9c" />
              <rect x="0.5" y="0.5" width="23" height="7" fill="#a47a52" />
              <rect x="24.5" y="0.5" width="23" height="7" fill="#96693f" />
              <rect x="-11.5" y="8.5" width="23" height="7" fill="#ad8259" />
              <rect x="12.5" y="8.5" width="23" height="7" fill="#9c7148" />
              <rect x="36.5" y="8.5" width="23" height="7" fill="#b08a62" />
            </pattern>
            <pattern id="intro-mesh" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M0 0H4M0 0V4" stroke={GREEN} strokeWidth="0.7" opacity="0.8" />
            </pattern>
            <linearGradient id="intro-sign" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#74c1e8" />
              <stop offset="1" stopColor="#4d9fcd" />
            </linearGradient>
            <linearGradient id="intro-awning" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9c2a25" />
              <stop offset="0.45" stopColor="#c43c35" />
              <stop offset="1" stopColor={RED} />
            </linearGradient>
            {/* the light inside: bright and warm at its heart, greener towards the walls */}
            <radialGradient id="intro-inside" gradientUnits="userSpaceOnUse" cx="200" cy="238" r="165">
              <stop offset="0" stopColor="#fffbe0" />
              <stop offset="0.35" stopColor="#f3eb9e" />
              <stop offset="0.7" stopColor="#bcc15e" />
              <stop offset="1" stopColor="#5f6f30" />
            </radialGradient>
            <linearGradient id="intro-spill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3eb9e" stopOpacity="0.85" />
              <stop offset="1" stopColor="#f3eb9e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="intro-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={NAVY} stopOpacity="0.7" />
              <stop offset="1" stopColor={NAVY} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="intro-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3b4a6b" />
              <stop offset="0.5" stopColor="#1f2947" />
              <stop offset="1" stopColor="#2f3c5c" />
            </linearGradient>
            <clipPath id="intro-opening">
              <rect x="62" y="162" width="276" height="124" />
            </clipPath>
            {/* the outline of the whole building, for the dusk that lies over it */}
            <clipPath id="intro-outline">
              <rect x="50" y="8" width="300" height="278" />
              <rect x="44" y="4" width="312" height="7" />
              <rect x="46" y="118" width="308" height="44" />
              <path d="M46 162H354L368 198V207Q200 219 32 207V198Z" />
            </clipPath>
          </defs>

          {/* THE SHOP, UNLIT */}
          <m.g initial={off} animate={{ opacity: 1 }} transition={on(0, 0.45)}>
            <ellipse cx="200" cy="289" rx="186" ry="8" fill={NAVY} opacity="0.35" filter="url(#intro-soft)" />
            {/* brick wall, with a stone coping along the top */}
            <rect x="50" y="8" width="300" height="278" fill="url(#intro-brick)" />
            <rect x="50" y="8" width="300" height="110" fill="url(#intro-shade)" opacity="0.45" />
            <rect x="44" y="4" width="312" height="7" fill="#d8ccb4" />
            {/* the flat upstairs: a sash window under a stone lintel */}
            <rect x="156" y="24" width="88" height="8" fill="#d8ccb4" />
            <rect x="162" y="32" width="76" height="70" fill="#efe7d6" />
            <rect x="166" y="36" width="68" height="62" fill="url(#intro-glass)" />
            <path d="M166 67h68M200 36v62" stroke="#efe7d6" strokeWidth="2.5" />
            <rect x="158" y="102" width="84" height="5" fill="#d8ccb4" />
            {/* the open front, dark inside */}
            <rect x="62" y="162" width="276" height="124" fill="#0f1528" />
            <g clipPath="url(#intro-opening)" opacity="0.5">
              <Stock />
            </g>
            <Awning />
            <Sign />
            {/* dusk over all of it */}
            <m.rect
              x="20"
              y="0"
              width="360"
              height="290"
              fill={NAVY}
              clipPath="url(#intro-outline)"
              initial={reduced ? false : { opacity: 0.86 }}
              animate={{ opacity: 0.36 }}
              transition={on(0.9, 0.85)}
            />
          </m.g>

          {/* 3. LIGHT INSIDE, spilling out across the pavement */}
          <m.g initial={off} animate={{ opacity: 1 }} transition={on(1.2, 0.55)}>
            <rect x="56" y="204" width="288" height="88" fill="#f3eb9e" opacity="0.5" filter="url(#intro-bloom)" />
            <g clipPath="url(#intro-opening)">
              <rect x="62" y="162" width="276" height="124" fill="url(#intro-inside)" />
              {/* side walls and floor running back to the far wall */}
              <path d="M62 162L128 214V266L62 286ZM338 162L272 214V266L338 286Z" fill="#4a5a26" opacity="0.4" />
              <path d="M62 286L128 266H272L338 286Z" fill="#fffbe0" opacity="0.45" />
              <rect x="128" y="214" width="144" height="52" fill="#fffbe0" opacity="0.4" />
              <rect x="150" y="216" width="100" height="2.2" fill="#fff" />
              <Stock />
              <rect x="62" y="205" width="276" height="16" fill="url(#intro-shade)" opacity="0.5" />
            </g>
            <path d="M62 286H338L386 314H14Z" fill="url(#intro-spill)" />
          </m.g>

          {/* the sign's blue glow on the brick around it */}
          <m.g initial={off} animate={{ opacity: reduced ? 1 : FLICKER }} transition={flicker}>
            <rect x="34" y="106" width="332" height="68" fill={BLUE} opacity="0.75" filter="url(#intro-bloom)" />
          </m.g>

          {/* 2. THE AWNING, catching the light from the sign above it */}
          <m.g initial={off} animate={{ opacity: 1 }} transition={on(0.9, 0.45)}>
            <path d="M40 166H360L370 204H30Z" fill={RED} opacity="0.4" filter="url(#intro-bloom)" />
            <Awning />
            <path d="M46 162H354L358 172Q200 178 42 172Z" fill={CREAM} opacity="0.16" />
          </m.g>

          {/* 1. THE SIGN, coming on like a tube: a flicker, then steady */}
          <m.g initial={off} animate={{ opacity: reduced ? 1 : FLICKER }} transition={flicker}>
            <Sign />
            <rect x="46" y="118" width="308" height="14" fill="#fff" opacity="0.12" />
          </m.g>
        </svg>
      </m.div>
    </m.div>
  )
}
