/**
 * LEGACY SVG generator (replaced by Grok PNG — see README.md).
 * Kept for reference / emergency fallback only.
 * Live assets: docs/assets/bodies/{class}/{male|female}/lv-XX.png
 * Run: node docs/assets/bodies/generate-class-bodies.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

/** Warm adventure-cartoon palette */
const INK = '#3D2A1F'
const SKIN = '#F5C9A8'
const SKIN_SHADE = '#E8A878'
const SKIN_LIGHT = '#FFE4CC'
const CHEEK = '#F4A08A'

function defs(accent) {
  return `
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#F5E6C8" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.12"/>
    </radialGradient>
    <linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${SKIN_LIGHT}"/>
      <stop offset="55%" stop-color="${SKIN}"/>
      <stop offset="100%" stop-color="${SKIN_SHADE}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <ellipse cx="100" cy="168" rx="78" ry="118" fill="url(#bg)"/>
`
}

/**
 * Body without head. Soft rounded limbs + cel shade.
 * @param {'male'|'female'} sex
 * @param {{ shirt?: string, shirtDark?: string, pants?: string, boot?: string, trim?: string }} opts
 */
function bodyOnly(sex, opts = {}) {
  const {
    shirt = '#C4A06A',
    shirtDark = '#A67C52',
    pants = '#6B7A8F',
    boot = '#5C3A28',
    trim = '#8B6914',
  } = opts
  const f = sex === 'female'

  if (!f) {
    return `
  <ellipse cx="100" cy="292" rx="40" ry="8" fill="#3D2A1F" opacity="0.12"/>
  <!-- legs -->
  <path d="M82 176 Q84 230 86 248 L96 248 Q94 200 94 176 Z" fill="${pants}" stroke="${INK}" stroke-width="2.8"/>
  <path d="M106 176 Q106 200 104 248 L114 248 Q116 230 118 176 Z" fill="${pants}" stroke="${INK}" stroke-width="2.8"/>
  <ellipse cx="90" cy="250" rx="13" ry="8" fill="${boot}" stroke="${INK}" stroke-width="2.4"/>
  <ellipse cx="110" cy="250" rx="13" ry="8" fill="${boot}" stroke="${INK}" stroke-width="2.4"/>
  <!-- torso -->
  <path d="M72 100 Q100 94 128 100 L124 178 Q100 186 76 178 Z" fill="${shirt}" stroke="${INK}" stroke-width="3"/>
  <path d="M80 108 Q100 102 120 108 L118 140 Q100 136 82 140 Z" fill="url(#shine)"/>
  <path d="M76 150 Q100 162 124 150" fill="none" stroke="${shirtDark}" stroke-width="3" opacity="0.35"/>
  <!-- arms -->
  <path d="M72 108 Q52 118 50 152 Q48 168 58 172 Q66 168 68 152 Q70 128 76 116 Z" fill="url(#skinG)" stroke="${INK}" stroke-width="2.6"/>
  <path d="M128 108 Q148 118 150 152 Q152 168 142 172 Q134 168 132 152 Q130 128 124 116 Z" fill="url(#skinG)" stroke="${INK}" stroke-width="2.6"/>
  <ellipse cx="100" cy="102" rx="22" ry="5" fill="${trim}" opacity="0.55"/>
  `
  }

  return `
  <ellipse cx="100" cy="292" rx="42" ry="8" fill="#3D2A1F" opacity="0.12"/>
  <path d="M78 178 Q80 230 84 246 L96 246 Q94 200 92 178 Z" fill="${pants}" stroke="${INK}" stroke-width="2.8"/>
  <path d="M108 178 Q106 200 104 246 L116 246 Q120 230 122 178 Z" fill="${pants}" stroke="${INK}" stroke-width="2.8"/>
  <ellipse cx="88" cy="248" rx="13" ry="9" fill="${boot}" stroke="${INK}" stroke-width="2.4"/>
  <ellipse cx="112" cy="248" rx="13" ry="9" fill="${boot}" stroke="${INK}" stroke-width="2.4"/>
  <!-- hip flare -->
  <path d="M82 158 Q100 172 118 158 L124 182 Q100 190 76 182 Z" fill="${pants}" stroke="${INK}" stroke-width="2.4"/>
  <!-- hourglass torso -->
  <path d="M76 98 Q100 90 124 98 L118 122 Q108 138 114 162 L86 162 Q92 138 82 122 Z" fill="${shirt}" stroke="${INK}" stroke-width="3"/>
  <path d="M86 106 Q100 98 114 106 L112 128 Q100 124 88 128 Z" fill="url(#shine)"/>
  <path d="M78 98 Q100 90 122 98" fill="none" stroke="${trim}" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="100" cy="160" rx="15" ry="4.5" fill="#E8C84A" stroke="${INK}" stroke-width="1.8"/>
  <path d="M76 106 Q56 116 54 148 Q52 162 62 166 Q70 162 72 148 Q74 124 80 114 Z" fill="url(#skinG)" stroke="${INK}" stroke-width="2.6"/>
  <path d="M124 106 Q144 116 146 148 Q148 162 138 166 Q130 162 128 148 Q126 124 120 114 Z" fill="url(#skinG)" stroke="${INK}" stroke-width="2.6"/>
  `
}

/** Expressive cartoon face — always after hair base. */
function face(sex) {
  const f = sex === 'female'
  const cy = f ? 64 : 70
  const r = f ? 23 : 24
  return `
  <circle cx="100" cy="${cy}" r="${r}" fill="url(#skinG)" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="90" cy="${cy + 4}" rx="7" ry="4" fill="${CHEEK}" opacity="0.45"/>
  <ellipse cx="110" cy="${cy + 4}" rx="7" ry="4" fill="${CHEEK}" opacity="0.45"/>
  <!-- eyes -->
  <ellipse cx="91" cy="${cy - 2}" rx="6.5" ry="7.5" fill="#fff" stroke="${INK}" stroke-width="2"/>
  <ellipse cx="109" cy="${cy - 2}" rx="6.5" ry="7.5" fill="#fff" stroke="${INK}" stroke-width="2"/>
  <circle cx="92.5" cy="${cy - 1}" r="3" fill="#2A4A6E"/>
  <circle cx="110.5" cy="${cy - 1}" r="3" fill="#2A4A6E"/>
  <circle cx="93.5" cy="${cy - 2.5}" r="1.2" fill="#fff"/>
  <circle cx="111.5" cy="${cy - 2.5}" r="1.2" fill="#fff"/>
  ${
    f
      ? `<path d="M84 ${cy - 8} Q90 ${cy - 13} 96 ${cy - 8}" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M104 ${cy - 8} Q110 ${cy - 13} 116 ${cy - 8}" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      : `<path d="M84 ${cy - 9} Q91 ${cy - 12} 97 ${cy - 9}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M103 ${cy - 9} Q109 ${cy - 12} 116 ${cy - 9}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
  }
  <ellipse cx="100" cy="${cy + 4}" rx="2.2" ry="1.6" fill="${SKIN_SHADE}" opacity="0.55"/>
  <path d="M91 ${cy + 11} Q100 ${cy + 17} 109 ${cy + 11}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  `
}

function hairFemaleSides(color) {
  return `
  <path d="M76 58 Q58 72 56 108 Q54 142 70 160 Q80 150 82 118 Q84 86 78 60 Z" fill="${color}" stroke="${INK}" stroke-width="2"/>
  <path d="M124 58 Q142 72 144 108 Q146 142 130 160 Q120 150 118 118 Q116 86 122 60 Z" fill="${color}" stroke="${INK}" stroke-width="2"/>
  `
}

function hairFemaleCrown(color, opts = {}) {
  const { band = '#E8C84A', gem = '#E85D4C', showBand = true } = opts
  return `
  <path d="M78 48 Q100 28 122 48 Q116 56 100 54 Q84 56 78 48 Z" fill="${color}" stroke="${INK}" stroke-width="2"/>
  <path d="M82 42 Q100 34 118 42" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
  ${
    showBand
      ? `<rect x="80" y="44" width="40" height="5.5" rx="2.5" fill="${band}" stroke="${INK}" stroke-width="1.6"/>
  <circle cx="100" cy="46.5" r="3" fill="${gem}" stroke="${INK}" stroke-width="1.3"/>`
      : ''
  }
  `
}

const FEMALE_HAIR = {
  guerreiro: { color: '#6B3E22', band: '#E8C84A', gem: '#E85D4C' },
  bardo: { color: '#E8C84A', band: '#3CB878', gem: '#E85D4C' },
  mago: { color: '#4A3428', band: '#F0D78C', gem: '#5B8DEF' },
  ladino: { color: '#C94B5A', band: '#9B6BC9', gem: '#F0B8D8' },
}

function hair(cls, sex) {
  if (sex !== 'female') {
    if (cls === 'guerreiro') {
      return `
  <path d="M76 58 Q100 36 124 58 Q118 72 100 70 Q82 72 76 58 Z" fill="#6B3E22" stroke="${INK}" stroke-width="2"/>
  <path d="M78 56 Q88 48 94 58" fill="none" stroke="#8B5A30" stroke-width="3" stroke-linecap="round"/>`
    }
    if (cls === 'bardo') {
      return `
  <path d="M74 56 Q100 32 126 56 Q120 74 100 72 Q80 74 74 56 Z" fill="#E8C84A" stroke="${INK}" stroke-width="2"/>
  <path d="M70 62 Q66 90 72 110" fill="none" stroke="#E8C84A" stroke-width="5" stroke-linecap="round"/>
  <path d="M130 62 Q134 90 128 110" fill="none" stroke="#E8C84A" stroke-width="5" stroke-linecap="round"/>`
    }
    if (cls === 'mago') {
      return `
  <path d="M78 60 Q100 42 122 60 Q116 74 100 72 Q84 74 78 60 Z" fill="#4A3428" stroke="${INK}" stroke-width="2" opacity="0.92"/>`
    }
    return `
  <path d="M76 54 Q100 32 124 54 Q118 74 100 72 Q82 74 76 54 Z" fill="#C94B5A" stroke="${INK}" stroke-width="2"/>
  <path d="M72 58 Q64 88 70 118" fill="none" stroke="#C94B5A" stroke-width="4" stroke-linecap="round"/>`
  }
  return hairFemaleSides(FEMALE_HAIR[cls].color)
}

function hairCrown(cls, sex) {
  if (sex !== 'female') return ''
  const h = FEMALE_HAIR[cls]
  return hairFemaleCrown(h.color, { band: h.band, gem: h.gem, showBand: true })
}

function hairBehind(cls, sex) {
  if (sex !== 'female') return ''
  const color = FEMALE_HAIR[cls].color
  return `
  <path d="M94 86 Q98 150 96 190" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
  <path d="M104 86 Q106 145 108 185" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
  `
}

function label(lv, color, sex) {
  const tag = sex === 'female' ? '♀' : '♂'
  return `
  <rect x="54" y="298" width="92" height="18" rx="8" fill="${color}" stroke="${INK}" stroke-width="1.5" opacity="0.95"/>
  <text x="100" y="311" text-anchor="middle" font-family="Verdana, sans-serif" font-size="11" font-weight="700" fill="#FFFDF5">Lv ${lv} ${tag}</text>`
}

function wrap(inner, lv, color, sex, title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320" fill="none">
  <title>${title || `${sex} level ${lv}`}</title>
  ${defs(color)}
  ${inner}
  ${label(lv, color, sex)}
</svg>
`
}

function guerreiro(lv, sex) {
  const c = '#D45A4A'
  const metal = '#D8E0EA'
  const metalDark = '#9AA8B8'
  const wood = '#C4A04A'
  const gold = '#E8C84A'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('guerreiro', sex))

  if (lv >= 8) {
    layers.push(`
    <path d="M78 102 Q36 155 48 248 L92 195 Z" fill="${c}" stroke="${INK}" stroke-width="2.8"/>
    <path d="M122 102 Q164 155 152 248 L108 195 Z" fill="${c}" stroke="${INK}" stroke-width="2.8"/>
    <path d="M78 102 Q36 155 48 248" fill="none" stroke="#fff" stroke-width="2" opacity="0.2"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <rect x="168" y="36" width="6" height="128" rx="2" fill="${wood}" stroke="${INK}" stroke-width="2"/>
    <path d="M171 38 L198 54 L171 72 Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="182" cy="54" r="5" fill="${gold}" stroke="${INK}" stroke-width="1.5"/>
    <circle cx="182" cy="54" r="2" fill="#fff" opacity="0.5"/>`)
  }

  layers.push(
    bodyOnly(sex, {
      shirt: lv >= 4 ? metal : f ? '#D4A86A' : '#E0B070',
      shirtDark: lv >= 4 ? metalDark : '#C49050',
      pants: lv >= 4 ? '#5A6B80' : f ? '#7A5A48' : '#6B7A8F',
      boot: '#5C3A28',
      trim: f ? '#8B5A30' : '#A67C52',
    }),
  )

  if (lv >= 4) {
    layers.push(`
    <path d="M82 118 H118 M82 138 H118 M82 158 H118" stroke="${gold}" stroke-width="2.2" opacity="0.85"/>
    <path d="M86 112 Q100 108 114 112" fill="none" stroke="${metalDark}" stroke-width="2" opacity="0.5"/>`)
  }
  if (lv >= 2) {
    const glow = lv >= 9 ? '0.4' : '0'
    layers.push(`
    <g transform="translate(30,112)">
      <path d="M10 2 L36 8 L34 52 L20 66 L6 52 Z" fill="${wood}" stroke="${INK}" stroke-width="2.8"/>
      <path d="M14 10 L30 14 L28 46 L16 56 L10 46 Z" fill="#E8D090" opacity="0.45"/>
      <path d="M20 14 L24 32 L20 50 L16 32 Z" fill="${INK}" opacity="0.35"/>
      <circle cx="20" cy="34" r="24" fill="${c}" opacity="${glow}"/>
    </g>`)
  }
  if (lv >= 10) {
    layers.push(`
    <rect x="50" y="138" width="26" height="20" rx="5" fill="${metal}" stroke="${INK}" stroke-width="2.4"/>
    <rect x="124" y="138" width="26" height="20" rx="5" fill="${metal}" stroke="${INK}" stroke-width="2.4"/>
    <path d="M54 144 H72 M128 144 H146" stroke="${gold}" stroke-width="1.8"/>`)
  }
  if (lv >= 12) {
    layers.push(`
    <g transform="translate(148,92) rotate(-16)">
      <rect x="0" y="-74" width="9" height="74" rx="2" fill="${gold}" stroke="${INK}" stroke-width="2.4"/>
      <path d="M-5 -74 L14 -74 L4.5 -92 Z" fill="${gold}" stroke="${INK}" stroke-width="2"/>
      <path d="M1 -70 L8 -70 L8 -20 L1 -20 Z" fill="#fff" opacity="0.35"/>
      <rect x="-9" y="-4" width="26" height="11" rx="3" fill="${c}" stroke="${INK}" stroke-width="2"/>
      <circle cx="4.5" cy="-42" r="18" fill="${gold}" opacity="0.3"/>
    </g>`)
  } else if (lv >= 7) {
    layers.push(`
    <g transform="translate(150,98) rotate(-22)">
      <rect x="0" y="-18" width="9" height="52" rx="2" fill="${wood}" stroke="${INK}" stroke-width="2"/>
      <path d="M-16 -30 L24 -30 L20 -6 L-12 -6 Z" fill="${metal}" stroke="${INK}" stroke-width="2.4"/>
      <path d="M-10 -28 L-10 -34 M4 -28 L4 -36 M18 -28 L18 -34" stroke="#6BA3F0" stroke-width="2.2"/>
    </g>`)
  } else if (lv >= 1) {
    layers.push(`
    <g transform="translate(148,92) rotate(-18)">
      <rect x="0" y="-58" width="7" height="58" rx="1.5" fill="${metal}" stroke="${INK}" stroke-width="2.4"/>
      <path d="M1 -54 L6 -54 L6 -20 L1 -20 Z" fill="#fff" opacity="0.3"/>
      <rect x="-7" y="-3" width="20" height="9" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>
    </g>`)
  }
  if (lv >= 3 && lv < 7) {
    layers.push(`
    <circle cx="156" cy="68" r="10" fill="#F5A623" opacity="0.55"/>
    <circle cx="156" cy="68" r="5" fill="#FFE08A" opacity="0.7"/>`)
  }
  if (lv >= 6) {
    layers.push(`
    <circle cx="100" cy="${f ? 64 : 70}" r="36" fill="none" stroke="${c}" stroke-width="2.2" opacity="0.35"/>
    <circle cx="100" cy="${f ? 64 : 70}" r="44" fill="none" stroke="${gold}" stroke-width="1.5" opacity="0.25"/>`)
  }

  layers.push(hair('guerreiro', sex))
  layers.push(face(sex))
  layers.push(hairCrown('guerreiro', sex))
  if (lv >= 5) {
    layers.push(`
    <path d="M76 40 Q100 22 124 40 L120 52 Q100 46 80 52 Z" fill="${metal}" stroke="${INK}" stroke-width="2.8"/>
    <path d="M82 42 Q100 32 118 42" fill="none" stroke="#fff" stroke-width="2" opacity="0.35"/>
    <rect x="95" y="${f ? 18 : 20}" width="10" height="16" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex, `guerreiro ${sex} lv ${lv}`)
}

function bardo(lv, sex) {
  const c = '#3CB878'
  const gold = '#F0D78C'
  const wood = '#D4B080'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('bardo', sex))

  if (lv >= 9) {
    layers.push(`
    <path d="M74 100 Q32 165 55 248 L94 188 Z" fill="#2A8F5A" stroke="${INK}" stroke-width="2.8"/>
    <path d="M126 100 Q168 165 145 248 L106 188 Z" fill="#2A8F5A" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="52" cy="158" r="3.5" fill="${gold}"/><circle cx="148" cy="176" r="3" fill="${gold}"/>`)
  }

  layers.push(
    bodyOnly(sex, {
      shirt: lv >= 6 ? '#3CB878' : f ? '#8EC9A0' : '#7AB890',
      shirtDark: lv >= 6 ? '#2A8F5A' : '#5A9A70',
      pants: f && lv < 6 ? '#E0C8A0' : '#C4A574',
      boot: lv >= 11 ? '#A05A28' : '#5C3A28',
      trim: gold,
    }),
  )

  if (f && lv < 6) {
    layers.push(`<path d="M88 160 Q100 174 112 160" fill="none" stroke="${INK}" stroke-width="2"/>`)
  }
  if (lv >= 6) {
    layers.push(`
    <path d="M80 112 H120 M100 112 V168" stroke="${gold}" stroke-width="2.6"/>
    <rect x="84" y="150" width="32" height="16" rx="4" fill="#8B5A30" stroke="${INK}" stroke-width="2"/>
    <circle cx="100" cy="158" r="3" fill="${gold}"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <rect x="80" y="222" width="18" height="24" rx="4" fill="#A05A28" stroke="${INK}" stroke-width="2.4"/>
    <rect x="102" y="222" width="18" height="24" rx="4" fill="#A05A28" stroke="${INK}" stroke-width="2.4"/>
    <path d="M83 230 H95 M105 230 H117" stroke="${gold}" stroke-width="2"/>`)
  }
  if (lv >= 8) {
    layers.push(`
    <g transform="translate(142,105)">
      <path d="M0 0 Q20 12 20 52 Q20 74 0 84 Q-8 42 0 0" fill="${lv >= 12 ? gold : wood}" stroke="${INK}" stroke-width="2.4"/>
      <path d="M2 8 Q14 18 14 52 Q14 68 2 76" fill="none" stroke="#fff" stroke-width="2" opacity="0.3"/>
      <line x1="5" y1="16" x2="5" y2="68" stroke="${INK}" stroke-width="1.2"/>
      <line x1="10" y1="20" x2="10" y2="64" stroke="${INK}" stroke-width="1.2"/>
      <line x1="15" y1="24" x2="15" y2="60" stroke="${INK}" stroke-width="1.2"/>
      ${lv >= 12 ? `<circle cx="10" cy="42" r="30" fill="${gold}" opacity="0.28"/>` : ''}
    </g>`)
  } else if (lv >= 1) {
    layers.push(`
    <g transform="translate(140,118)">
      <ellipse cx="14" cy="32" rx="15" ry="20" fill="${wood}" stroke="${INK}" stroke-width="2.4"/>
      <ellipse cx="14" cy="30" rx="8" ry="10" fill="#E8D0A8"/>
      <rect x="11" y="-10" width="6" height="42" rx="2" fill="${wood}" stroke="${INK}" stroke-width="2"/>
      <circle cx="14" cy="30" r="5" fill="#6B3E22"/>
    </g>`)
  }
  if (lv >= 3 && lv < 8) {
    layers.push(`
    <g transform="translate(44,122)">
      <rect x="0" y="0" width="6" height="40" rx="3" fill="#F0E0B8" stroke="${INK}" stroke-width="2"/>
      <circle cx="3" cy="0" r="5" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
    </g>`)
  }
  if (lv >= 2) layers.push(`<text x="38" y="88" font-size="16" fill="${gold}">♪</text>`)
  if (lv >= 5) layers.push(`<text x="152" y="82" font-size="14" fill="${gold}">♫</text>`)
  if (lv >= 7) layers.push(`<circle cx="100" cy="138" r="42" fill="${c}" opacity="0.12"/>`)
  if (lv >= 10) {
    layers.push(`
    <text x="32" y="108" font-size="12" fill="${gold}">♪</text>
    <text x="158" y="118" font-size="12" fill="${gold}">♪</text>`)
  }

  layers.push(hair('bardo', sex))
  layers.push(face(sex))
  layers.push(hairCrown('bardo', sex))
  if (lv >= 4) {
    layers.push(`
    <ellipse cx="100" cy="42" rx="26" ry="8" fill="${c}" stroke="${INK}" stroke-width="2.4"/>
    <ellipse cx="100" cy="40" rx="18" ry="4" fill="#5FD090" opacity="0.5"/>
    <path d="M120 40 Q146 20 140 52" fill="#E85D4C" stroke="${INK}" stroke-width="2"/>
    <path d="M138 28 Q148 24 144 40" fill="#FF8A70" opacity="0.7"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex, `bardo ${sex} lv ${lv}`)
}

function mago(lv, sex) {
  const c = '#5B8DEF'
  const trim = '#F0D78C'
  const wood = '#C4A04A'
  const robe = '#3A6BB5'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('mago', sex))

  if (lv >= 12) {
    layers.push(`
    <path d="M68 92 Q18 155 38 258 L100 198 L162 258 Q182 155 132 92 Z" fill="#2E5A9E" stroke="${INK}" stroke-width="2.8" opacity="0.92"/>
    <path d="M80 100 Q100 130 120 100" fill="none" stroke="${trim}" stroke-width="2" opacity="0.5"/>`)
  }

  if (lv >= 4) {
    const robePath = f
      ? `M82 98 L118 98 L114 130 L122 252 L78 252 L86 130 Z`
      : `M70 98 L48 252 L152 252 L130 98 Z`
    layers.push(`
    <ellipse cx="100" cy="292" rx="50" ry="8" fill="#3D2A1F" opacity="0.12"/>
    <path d="${robePath}" fill="${robe}" stroke="${INK}" stroke-width="3"/>
    <path d="${f ? 'M88 110 Q100 104 112 110 L110 200 Q100 208 90 200 Z' : 'M78 110 Q100 102 122 110 L140 230 L60 230 Z'}" fill="url(#shine)"/>
    <circle cx="84" cy="138" r="2.2" fill="${trim}"/><circle cx="112" cy="158" r="1.8" fill="${trim}"/>
    <circle cx="94" cy="188" r="2.2" fill="${trim}"/><circle cx="118" cy="128" r="1.8" fill="${trim}"/>
    <rect x="86" y="${f ? 142 : 152}" width="28" height="13" rx="4" fill="${trim}" stroke="${INK}" stroke-width="2"/>
    <path d="M${f ? 60 : 56} 110 Q${f ? 48 : 44} 130 ${f ? 52 : 48} 152 Q${f ? 58 : 54} 166 ${f ? 68 : 64} 162 Q${f ? 70 : 66} 140 ${f ? 74 : 70} 118 Z" fill="url(#skinG)" stroke="${INK}" stroke-width="2.6"/>
    <path d="M${f ? 140 : 144} 110 Q${f ? 152 : 156} 130 ${f ? 148 : 152} 152 Q${f ? 142 : 146} 166 ${f ? 132 : 136} 162 Q${f ? 130 : 134} 140 ${f ? 126 : 130} 118 Z" fill="url(#skinG)" stroke="${INK}" stroke-width="2.6"/>`)
  } else {
    layers.push(
      bodyOnly(sex, {
        shirt: f ? '#A8C0D8' : '#8AA8C4',
        shirtDark: '#6A88A4',
        pants: '#6B7A8F',
        boot: '#5C3A28',
        trim,
      }),
    )
  }

  const ey = f ? 62 : 68
  const glasses = `
    <circle cx="91" cy="${ey}" r="7" fill="#A8D4FF" fill-opacity="0.25" stroke="${INK}" stroke-width="2"/>
    <circle cx="109" cy="${ey}" r="7" fill="#A8D4FF" fill-opacity="0.25" stroke="${INK}" stroke-width="2"/>
    <line x1="98" y1="${ey}" x2="102" y2="${ey}" stroke="${INK}" stroke-width="2"/>`

  layers.push(hair('mago', sex))
  layers.push(face(sex))
  layers.push(hairCrown('mago', sex))
  layers.push(glasses)

  if (lv >= 2) {
    layers.push(`
    <g transform="translate(42,142)">
      <rect x="0" y="0" width="24" height="30" rx="3" fill="#8B5A30" stroke="${INK}" stroke-width="2.4"/>
      <rect x="3" y="4" width="18" height="22" rx="1" fill="#FFF4D8"/>
      <path d="M6 10 H18 M6 15 H16 M6 20 H14" stroke="${c}" stroke-width="1.5"/>
    </g>`)
  }
  if (lv >= 7) {
    layers.push(`
    <circle cx="100" cy="118" r="9" fill="${trim}" stroke="${INK}" stroke-width="2"/>
    <circle cx="100" cy="118" r="3.5" fill="${c}"/>
    <line x1="100" y1="98" x2="100" y2="110" stroke="${INK}" stroke-width="2"/>`)
  }
  if (lv >= 10) {
    layers.push(`
    <rect x="156" y="66" width="8" height="156" rx="3" fill="${wood}" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="160" cy="64" r="15" fill="#7EB8FF" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="160" cy="64" r="8" fill="#C8E4FF"/>
    <circle cx="160" cy="64" r="24" fill="#7EB8FF" opacity="0.28"/>`)
  } else if (lv >= 1) {
    layers.push(`
    <rect x="156" y="88" width="7" height="134" rx="2.5" fill="${wood}" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="159.5" cy="86" r="9" fill="${lv >= 6 ? '#A8D4FF' : wood}" stroke="${INK}" stroke-width="2.4"/>
    ${lv >= 6 ? `<circle cx="159.5" cy="86" r="4" fill="#fff" opacity="0.5"/>` : ''}`)
  }
  if (lv >= 6 && lv < 10) {
    layers.push(`
    <circle cx="48" cy="152" r="13" fill="#A8D4FF" stroke="${INK}" stroke-width="2.4" opacity="0.95"/>
    <circle cx="48" cy="152" r="6" fill="#fff" opacity="0.45"/>
    <circle cx="48" cy="152" r="20" fill="#A8D4FF" opacity="0.22"/>`)
  }
  if (lv >= 3) {
    layers.push(`
    <circle cx="38" cy="96" r="11" fill="#F5A623" opacity="0.75"/>
    <circle cx="38" cy="96" r="5" fill="#FFE08A" opacity="0.8"/>`)
  }
  if (lv >= 5) layers.push(`<circle cx="162" cy="52" r="7" fill="${trim}" opacity="0.85"/>`)
  if (lv >= 8) {
    layers.push(`
    <circle cx="68" cy="198" r="4.5" fill="${trim}" opacity="0.65"/>
    <circle cx="132" cy="208" r="4.5" fill="${trim}" opacity="0.65"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <circle cx="42" cy="56" r="6" fill="#E85D4C" opacity="0.85"/>
    <circle cx="168" cy="48" r="5" fill="#E85D4C" opacity="0.75"/>
    <circle cx="42" cy="56" r="2.5" fill="#FFD0A0"/>`)
  }
  if (lv >= 9) {
    const hatTip = f ? 10 : 6
    layers.push(`
    <path d="M78 48 L100 ${hatTip} L122 48 Z" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="100" cy="50" rx="26" ry="8" fill="${c}" stroke="${INK}" stroke-width="2.8"/>
    <ellipse cx="100" cy="50" rx="16" ry="3.5" fill="${trim}" opacity="0.9"/>
    <path d="M90 30 L100 ${hatTip + 4} L110 30" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.3"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex, `mago ${sex} lv ${lv}`)
}

function ladino(lv, sex) {
  // Warm plum — adventure rogue, not gothic
  const c = '#9B6BC9'
  const accent = '#F0B8D8'
  const steel = '#D0D8E4'
  const cloak = lv >= 10 ? '#6B5A8A' : '#8B6BB0'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('ladino', sex))

  if (lv >= 2) {
    layers.push(`
    <path d="M100 68 Q${42 - (lv >= 10 ? 6 : 0)} 125 52 248 Q100 208 148 248 Q${158 + (lv >= 10 ? 6 : 0)} 125 100 68"
      fill="${cloak}" stroke="${INK}" stroke-width="3" opacity="0.9"/>
    <path d="M100 80 Q70 130 62 200" fill="none" stroke="#fff" stroke-width="2" opacity="0.15"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <g opacity="0.28" transform="translate(-26,10)">
      <path d="M100 88 L86 168 L114 168 Z" fill="${c}"/>
      <circle cx="100" cy="76" r="13" fill="${c}"/>
    </g>`)
  }

  layers.push(
    bodyOnly(sex, {
      shirt: f ? '#8B6A9A' : '#7A5A8E',
      shirtDark: '#5A3A6E',
      pants: '#4A3A5C',
      boot: lv >= 7 ? '#2A2030' : '#5C3A28',
      trim: accent,
    }),
  )

  if (lv >= 7) {
    layers.push(`
    <ellipse cx="90" cy="250" rx="14" ry="8" fill="#2A2030" stroke="${accent}" stroke-width="2"/>
    <ellipse cx="110" cy="250" rx="14" ry="8" fill="#2A2030" stroke="${accent}" stroke-width="2"/>`)
  }

  if (lv >= 12) {
    layers.push(`
    <g transform="translate(148,108) rotate(-28)">
      <rect x="0" y="0" width="8" height="44" rx="2" fill="#4A4060" stroke="${accent}" stroke-width="2.4"/>
      <path d="M1 4 L7 4 L7 28 L1 28 Z" fill="#B8C0E0" opacity="0.4"/>
      <rect x="-5" y="40" width="18" height="9" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>
      <circle cx="4" cy="12" r="14" fill="${accent}" opacity="0.35"/>
    </g>`)
  } else if (lv >= 9) {
    layers.push(`
    <g transform="translate(148,118)">
      <rect x="0" y="10" width="30" height="9" rx="2" fill="#8B5A30" stroke="${INK}" stroke-width="2"/>
      <path d="M30 8 L52 14 L30 22 Z" fill="${steel}" stroke="${INK}" stroke-width="2"/>
    </g>`)
  } else if (lv >= 4) {
    layers.push(`
    <g transform="translate(148,108) rotate(-26)">
      <rect x="0" y="0" width="6" height="34" rx="1" fill="${steel}" stroke="${INK}" stroke-width="2"/>
      <rect x="-3" y="30" width="12" height="7" rx="2" fill="${accent}" stroke="${INK}" stroke-width="1.5"/>
    </g>
    <g transform="translate(46,108) rotate(26)">
      <rect x="0" y="0" width="6" height="34" rx="1" fill="${steel}" stroke="${INK}" stroke-width="2"/>
      <rect x="-3" y="30" width="12" height="7" rx="2" fill="${accent}" stroke="${INK}" stroke-width="1.5"/>
    </g>`)
  } else if (lv >= 1) {
    layers.push(`
    <g transform="translate(148,112) rotate(-26)">
      <rect x="0" y="0" width="6" height="30" rx="1" fill="${steel}" stroke="${INK}" stroke-width="2"/>
      <rect x="-3" y="26" width="12" height="7" rx="2" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
    </g>`)
  }
  if (lv >= 6 && lv < 12) layers.push(`<circle cx="156" cy="118" r="11" fill="${accent}" opacity="0.35"/>`)
  if (lv >= 3) layers.push(`<circle cx="100" cy="148" r="52" fill="${c}" opacity="0.08"/>`)
  if (lv >= 8) {
    layers.push(`
    <circle cx="42" cy="158" r="9" fill="none" stroke="${accent}" stroke-width="2.2"/>
    <circle cx="42" cy="158" r="3.5" fill="${accent}"/>`)
  }

  layers.push(hair('ladino', sex))
  layers.push(face(sex))
  layers.push(hairCrown('ladino', sex))
  if (lv >= 10) {
    layers.push(`
    <path d="M70 38 Q100 14 130 38 L126 54 Q100 48 74 54 Z" fill="#6B5A8A" stroke="${INK}" stroke-width="2.8"/>
    <path d="M74 76 Q68 112 76 152" fill="none" stroke="#6B5A8A" stroke-width="11" stroke-linecap="round" opacity="0.75"/>
    <path d="M126 76 Q132 112 124 152" fill="none" stroke="#6B5A8A" stroke-width="11" stroke-linecap="round" opacity="0.75"/>`)
  } else if (lv >= 2 && !f) {
    layers.push(`
    <path d="M76 56 Q100 34 124 56 L120 86 Q100 96 80 86 Z" fill="${c}" stroke="${INK}" stroke-width="2.4" opacity="0.88"/>
    <path d="M84 58 Q100 48 116 58" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.25"/>`)
  } else if (lv >= 2 && f) {
    layers.push(`
    <path d="M76 42 Q100 22 124 42" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" opacity="0.85"/>`)
  }
  if (lv >= 5) {
    layers.push(`
    <rect x="84" y="${f ? 58 : 62}" width="32" height="12" rx="4" fill="#3D2A1F" opacity="0.55"/>
    <circle cx="92" cy="${f ? 64 : 68}" r="2" fill="${accent}"/><circle cx="108" cy="${f ? 64 : 68}" r="2" fill="${accent}"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex, `ladino ${sex} lv ${lv}`)
}

const BUILDERS = { guerreiro, bardo, mago, ladino }
const SEXES = ['male', 'female']

for (const cls of Object.keys(BUILDERS)) {
  const classDir = join(root, cls)
  mkdirSync(classDir, { recursive: true })
  if (existsSync(classDir)) {
    for (const f of readdirSync(classDir)) {
      if (/^lv-\d+\.svg$/.test(f)) unlinkSync(join(classDir, f))
    }
  }
  for (const sex of SEXES) {
    const dir = join(classDir, sex)
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
    for (let lv = 0; lv <= 12; lv++) {
      const name = `lv-${String(lv).padStart(2, '0')}.svg`
      writeFileSync(join(dir, name), BUILDERS[cls](lv, sex), 'utf8')
    }
    console.log(`${cls}/${sex}: lv-00…12`)
  }
}

console.log('Done: 4 classes × 2 sexes × 13 levels (warm adventure cartoon).')
