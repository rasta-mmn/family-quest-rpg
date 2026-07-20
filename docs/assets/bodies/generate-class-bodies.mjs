/**
 * Cartoon avatars lv-00…12 × male/female — gear stacks by classes.md.
 * Path: docs/assets/bodies/{class}/{male|female}/lv-XX.svg
 * Run: node docs/assets/bodies/generate-class-bodies.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const INK = '#1a1520'
const SKIN = '#F0C8A0'

/**
 * Body without head. Female = hourglass + separate legs (reads front-facing).
 * @param {'male'|'female'} sex
 * @param {{ shirt?: string, pants?: string, boot?: string, trim?: string }} opts
 */
function bodyOnly(sex, opts = {}) {
  const {
    shirt = '#8B7355',
    pants = '#5C5346',
    boot = '#3D2B1F',
    trim = '#6B4423',
  } = opts
  const f = sex === 'female'

  if (!f) {
    return `
  <ellipse cx="100" cy="298" rx="42" ry="7" fill="#000" opacity="0.18"/>
  <rect x="84" y="178" width="14" height="58" rx="5" fill="${pants}" stroke="${INK}" stroke-width="3"/>
  <rect x="102" y="178" width="14" height="58" rx="5" fill="${pants}" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="91" cy="240" rx="11" ry="6" fill="${boot}" stroke="${INK}" stroke-width="2.5"/>
  <ellipse cx="109" cy="240" rx="11" ry="6" fill="${boot}" stroke="${INK}" stroke-width="2.5"/>
  <path d="M74 98 L126 98 L120 175 L80 175 Z" fill="${shirt}" stroke="${INK}" stroke-width="3.5"/>
  <rect x="56" y="105" width="20" height="48" rx="9" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
  <rect x="124" y="105" width="20" height="48" rx="9" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
  `
  }

  // Female athletic hourglass — hips flare, waist cinch, legs separate
  return `
  <ellipse cx="100" cy="298" rx="44" ry="7" fill="#000" opacity="0.18"/>
  <rect x="80" y="178" width="13" height="56" rx="6" fill="${pants}" stroke="${INK}" stroke-width="3"/>
  <rect x="107" y="178" width="13" height="56" rx="6" fill="${pants}" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="87" cy="238" rx="12" ry="8" fill="${boot}" stroke="${INK}" stroke-width="2.5"/>
  <ellipse cx="113" cy="238" rx="12" ry="8" fill="${boot}" stroke="${INK}" stroke-width="2.5"/>
  <!-- hip flare -->
  <path d="M84 155 Q100 168 116 155 L122 178 L78 178 Z" fill="${pants}" stroke="${INK}" stroke-width="2.5"/>
  <!-- torso: shoulders → waist → hips -->
  <path d="M78 98 L122 98 L116 118 L104 140 L112 160 L88 160 L96 140 L84 118 Z" fill="${shirt}" stroke="${INK}" stroke-width="3.5"/>
  <path d="M86 108 Q100 120 114 108" fill="${shirt}" stroke="${INK}" stroke-width="2"/>
  <path d="M78 98 Q100 92 122 98" fill="none" stroke="${trim}" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="100" cy="158" rx="16" ry="5" fill="#D4AF37" stroke="${INK}" stroke-width="2"/>
  <rect x="58" y="102" width="14" height="42" rx="7" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
  <rect x="128" y="102" width="14" height="42" rx="7" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
  `
}

/** Face always drawn AFTER hair so cara never covered. */
function face(sex) {
  const f = sex === 'female'
  const cy = f ? 66 : 72
  const r = f ? 21 : 22
  return `
  <circle cx="100" cy="${cy}" r="${r}" fill="${SKIN}" stroke="${INK}" stroke-width="3.5"/>
  <ellipse cx="93" cy="${cy - 2}" rx="5" ry="6" fill="#fff" stroke="${INK}" stroke-width="2"/>
  <ellipse cx="107" cy="${cy - 2}" rx="5" ry="6" fill="#fff" stroke="${INK}" stroke-width="2"/>
  <circle cx="94" cy="${cy - 1}" r="2.3" fill="${INK}"/>
  <circle cx="108" cy="${cy - 1}" r="2.3" fill="${INK}"/>
  ${
    f
      ? `<path d="M88 ${cy - 6} Q92 ${cy - 10} 96 ${cy - 6}" stroke="${INK}" stroke-width="1.5" fill="none"/>
  <path d="M104 ${cy - 6} Q108 ${cy - 10} 112 ${cy - 6}" stroke="${INK}" stroke-width="1.5" fill="none"/>`
      : ''
  }
  <path d="M92 ${cy + 10} Q100 ${cy + 16} 108 ${cy + 10}" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `
}

/** Side curls — drawn under face. */
function hairFemaleSides(color) {
  return `
  <path d="M78 62 Q60 78 58 110 Q56 140 70 155 Q78 148 80 120 Q82 90 78 62" fill="${color}" stroke="${INK}" stroke-width="2"/>
  <path d="M122 62 Q140 78 142 110 Q144 140 130 155 Q122 148 120 120 Q118 90 122 62" fill="${color}" stroke="${INK}" stroke-width="2"/>
  `
}

/** Bangs + band — drawn ON TOP of forehead after face. */
function hairFemaleCrown(color, opts = {}) {
  const { band = '#D4AF37', gem = '#C23B2E', showBand = true } = opts
  return `
  <path d="M84 44 Q100 34 116 44 Q110 48 100 46 Q90 48 84 44" fill="${color}" stroke="${INK}" stroke-width="2"/>
  ${
    showBand
      ? `<rect x="82" y="44" width="36" height="5" rx="2.5" fill="${band}" stroke="${INK}" stroke-width="1.8"/>
  <circle cx="100" cy="46.5" r="2.8" fill="${gem}" stroke="${INK}" stroke-width="1.4"/>`
      : ''
  }
  `
}

const FEMALE_HAIR = {
  guerreiro: { color: '#5C3A1E', band: '#D4AF37', gem: '#C23B2E' },
  bardo: { color: '#E8C84A', band: '#2F9E62', gem: '#E85D4C' },
  mago: { color: '#3D2B1F', band: '#F0D78C', gem: '#3B6FB2' },
  ladino: { color: '#C23B2E', band: '#7C4DB2', gem: '#E8A0D0' },
}

/** Hair under face (sides / male fringe). */
function hair(cls, sex) {
  if (sex !== 'female') {
    if (cls === 'guerreiro') {
      return `<path d="M80 58 Q100 44 120 58" fill="#5C3A1E" stroke="${INK}" stroke-width="2"/>`
    }
    if (cls === 'bardo') {
      return `<path d="M80 55 Q100 40 122 55" fill="#E8C84A" stroke="${INK}" stroke-width="2"/>`
    }
    if (cls === 'mago') {
      return `<path d="M82 58 Q100 48 118 58" fill="#3D2B1F" stroke="${INK}" stroke-width="2" opacity="0.85"/>`
    }
    return `<path d="M82 58 Q100 42 118 58" fill="#C23B2E" stroke="${INK}" stroke-width="2"/>`
  }
  return hairFemaleSides(FEMALE_HAIR[cls].color)
}

/** Crown after face — ♀ only. */
function hairCrown(cls, sex) {
  if (sex !== 'female') return ''
  const h = FEMALE_HAIR[cls]
  return hairFemaleCrown(h.color, { band: h.band, gem: h.gem, showBand: true })
}

/** Thin pony at nape only — never a plate over the head. */
function hairBehind(cls, sex) {
  if (sex !== 'female') return ''
  const color =
    cls === 'guerreiro'
      ? '#5C3A1E'
      : cls === 'bardo'
        ? '#E8C84A'
        : cls === 'mago'
          ? '#3D2B1F'
          : '#C23B2E'
  return `
  <path d="M96 88 Q100 140 98 185" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
  `
}

function label(lv, color, sex) {
  const tag = sex === 'female' ? '♀' : '♂'
  return `
  <rect x="58" y="300" width="84" height="16" rx="6" fill="${color}" opacity="0.9"/>
  <text x="100" y="312" text-anchor="middle" font-family="Verdana, sans-serif" font-size="11" font-weight="700" fill="#FFF8E7">Lv ${lv} ${tag}</text>`
}

function wrap(inner, lv, color, sex) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320" fill="none">
  <title>${sex} level ${lv}</title>
  ${inner}
  ${label(lv, color, sex)}
</svg>
`
}

function guerreiro(lv, sex) {
  const c = '#B2453B'
  const metal = '#C0C8D4'
  const wood = '#8B6914'
  const gold = '#D4AF37'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('guerreiro', sex))

  if (lv >= 8) {
    layers.push(`
    <path d="M78 100 Q40 160 55 250 L90 200 Z" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <path d="M122 100 Q160 160 145 250 L110 200 Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <rect x="168" y="40" width="5" height="120" fill="${wood}" stroke="${INK}" stroke-width="2"/>
    <path d="M173 42 L198 55 L173 70 Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <circle cx="180" cy="55" r="4" fill="${gold}"/>`)
  }

  layers.push(bodyOnly(sex, {
    shirt: lv >= 4 ? metal : (f ? '#8B6914' : '#A67C52'),
    pants: lv >= 4 ? '#3D4A5C' : (f ? '#5C4030' : '#4A5568'),
    boot: '#3D2B1F',
    trim: f ? '#3D2B1F' : '#6B4423',
  }))

  if (lv >= 4) {
    layers.push(`<path d="M82 115 H118 M82 135 H118 M82 155 H118" stroke="${gold}" stroke-width="2" opacity="0.75"/>`)
  }
  if (lv >= 2) {
    const glow = lv >= 9 ? `opacity="0.35"` : `opacity="0"`
    layers.push(`
    <g transform="translate(36,115)">
      <path d="M8 0 L32 6 L30 48 L18 60 L6 48 Z" fill="${wood}" stroke="${INK}" stroke-width="3"/>
      <path d="M18 12 L22 28 L18 44 L14 28 Z" fill="${INK}" opacity="0.5"/>
      <circle cx="18" cy="30" r="22" fill="${c}" ${glow}/>
    </g>`)
  }
  if (lv >= 10) {
    layers.push(`
    <rect x="54" y="140" width="24" height="18" rx="4" fill="${metal}" stroke="${INK}" stroke-width="2.5"/>
    <rect x="122" y="140" width="24" height="18" rx="4" fill="${metal}" stroke="${INK}" stroke-width="2.5"/>`)
  }
  if (lv >= 12) {
    layers.push(`
    <g transform="translate(148,95) rotate(-18)">
      <rect x="0" y="-70" width="8" height="70" rx="1" fill="${gold}" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-4 -70 L12 -70 L4 -85 Z" fill="${gold}" stroke="${INK}" stroke-width="2"/>
      <rect x="-8" y="-4" width="24" height="10" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>
      <circle cx="4" cy="-40" r="16" fill="${gold}" opacity="0.35"/>
    </g>`)
  } else if (lv >= 7) {
    layers.push(`
    <g transform="translate(150,100) rotate(-25)">
      <rect x="0" y="-20" width="8" height="50" fill="${wood}" stroke="${INK}" stroke-width="2"/>
      <path d="M-14 -28 L22 -28 L18 -8 L-10 -8 Z" fill="${metal}" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-8 -26 L-8 -32 M4 -26 L4 -34 M16 -26 L16 -32" stroke="#5B8DEF" stroke-width="2"/>
    </g>`)
  } else if (lv >= 1) {
    layers.push(`
    <g transform="translate(148,95) rotate(-20)">
      <rect x="0" y="-55" width="6" height="55" rx="1" fill="${metal}" stroke="${INK}" stroke-width="2.5"/>
      <rect x="-6" y="-4" width="18" height="8" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>
    </g>`)
  }
  if (lv >= 3 && lv < 7) layers.push(`<circle cx="155" cy="70" r="8" fill="#F5A623" opacity="0.55"/>`)
  if (lv >= 6) {
    layers.push(`
    <circle cx="100" cy="${f ? 66 : 72}" r="34" fill="none" stroke="${c}" stroke-width="2" opacity="0.4"/>
    <circle cx="100" cy="${f ? 66 : 72}" r="42" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.25"/>`)
  }

  // hair then FACE on top — helm only on crown
  layers.push(hair('guerreiro', sex))
  layers.push(face(sex))
  layers.push(hairCrown('guerreiro', sex))
  if (lv >= 5) {
    layers.push(`
    <path d="M78 42 Q100 26 122 42 L118 52 Q100 46 82 52 Z" fill="${metal}" stroke="${INK}" stroke-width="3"/>
    <rect x="96" y="${f ? 22 : 24}" width="8" height="14" fill="${c}" stroke="${INK}" stroke-width="2"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex)
}

function bardo(lv, sex) {
  const c = '#2F9E62'
  const gold = '#F0D78C'
  const wood = '#C4A574'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('bardo', sex))

  if (lv >= 9) {
    layers.push(`
    <path d="M75 100 Q35 170 60 250 L95 190 Z" fill="#1E5C38" stroke="${INK}" stroke-width="3"/>
    <path d="M125 100 Q165 170 140 250 L105 190 Z" fill="#1E5C38" stroke="${INK}" stroke-width="3"/>
    <circle cx="55" cy="160" r="3" fill="${gold}"/><circle cx="145" cy="180" r="2.5" fill="${gold}"/>`)
  }

  layers.push(bodyOnly(sex, {
    shirt: lv >= 6 ? '#2F9E62' : (f ? '#7BAF8A' : '#6B8F71'),
    pants: f && lv < 6 ? '#D4B896' : '#C4A574',
    boot: lv >= 11 ? '#8B4513' : '#3D2B1F',
  }))

  if (f && lv < 6) {
    layers.push(`
    <path d="M88 158 Q100 172 112 158" fill="none" stroke="${INK}" stroke-width="2"/>`)
  }

  if (lv >= 6) {
    layers.push(`
    <path d="M80 110 H120 M100 110 V165" stroke="${gold}" stroke-width="2.5"/>
    <rect x="86" y="148" width="28" height="14" rx="3" fill="#6B4423" stroke="${INK}" stroke-width="2"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <rect x="82" y="220" width="16" height="22" rx="3" fill="#8B4513" stroke="${INK}" stroke-width="2.5"/>
    <rect x="102" y="220" width="16" height="22" rx="3" fill="#8B4513" stroke="${INK}" stroke-width="2.5"/>
    <path d="M84 228 H96 M104 228 H116" stroke="${gold}" stroke-width="2"/>`)
  }
  if (lv >= 8) {
    layers.push(`
    <g transform="translate(145,110)">
      <path d="M0 0 Q18 10 18 50 Q18 70 0 80 Q-6 40 0 0" fill="${lv >= 12 ? gold : wood}" stroke="${INK}" stroke-width="2.5"/>
      <line x1="4" y1="15" x2="4" y2="65" stroke="${INK}" stroke-width="1"/>
      <line x1="9" y1="18" x2="9" y2="62" stroke="${INK}" stroke-width="1"/>
      <line x1="14" y1="22" x2="14" y2="58" stroke="${INK}" stroke-width="1"/>
      ${lv >= 12 ? `<circle cx="8" cy="40" r="28" fill="${gold}" opacity="0.3"/>` : ''}
    </g>`)
  } else if (lv >= 1) {
    layers.push(`
    <g transform="translate(142,120)">
      <ellipse cx="12" cy="30" rx="14" ry="18" fill="${wood}" stroke="${INK}" stroke-width="2.5"/>
      <rect x="9" y="-8" width="6" height="40" rx="2" fill="${wood}" stroke="${INK}" stroke-width="2"/>
      <circle cx="12" cy="28" r="5" fill="#5C3A1E"/>
    </g>`)
  }
  if (lv >= 3 && lv < 8) {
    layers.push(`
    <g transform="translate(48,125)">
      <rect x="0" y="0" width="5" height="36" rx="2" fill="#E8D5A3" stroke="${INK}" stroke-width="2"/>
      <circle cx="2.5" cy="0" r="4" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
    </g>`)
  }
  if (lv >= 2) layers.push(`<text x="40" y="90" font-size="14" fill="${gold}">♪</text>`)
  if (lv >= 5) layers.push(`<text x="155" y="85" font-size="12" fill="${gold}">♫</text>`)
  if (lv >= 7) layers.push(`<circle cx="100" cy="140" r="40" fill="${c}" opacity="0.12"/>`)
  if (lv >= 10) {
    layers.push(`
    <text x="35" y="110" font-size="11" fill="${gold}">♪</text>
    <text x="160" y="120" font-size="11" fill="${gold}">♪</text>`)
  }

  layers.push(hair('bardo', sex))
  layers.push(face(sex))
  layers.push(hairCrown('bardo', sex))
  if (lv >= 4) {
    layers.push(`
    <ellipse cx="100" cy="44" rx="24" ry="7" fill="${c}" stroke="${INK}" stroke-width="2.5"/>
    <path d="M118 42 Q142 24 136 50" fill="#E85D4C" stroke="${INK}" stroke-width="2"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex)
}

function mago(lv, sex) {
  const c = '#3B6FB2'
  const trim = '#F0D78C'
  const wood = '#8B6914'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('mago', sex))

  if (lv >= 12) {
    layers.push(`
    <path d="M70 95 Q20 160 40 260 L100 200 L160 260 Q180 160 130 95 Z" fill="#1A3A6E" stroke="${INK}" stroke-width="3" opacity="0.9"/>`)
  }

  if (lv >= 4) {
    const robe = f
      ? `M84 100 L116 100 L112 130 L118 250 L82 250 L88 130 Z`
      : `M72 100 L52 250 L148 250 L128 100 Z`
    layers.push(`
    <ellipse cx="100" cy="298" rx="48" ry="7" fill="#000" opacity="0.18"/>
    <path d="${robe}" fill="#1E3A6E" stroke="${INK}" stroke-width="3.5"/>
    <circle cx="85" cy="140" r="2" fill="${trim}"/><circle cx="110" cy="160" r="1.5" fill="${trim}"/>
    <circle cx="95" cy="190" r="2" fill="${trim}"/><circle cx="120" cy="130" r="1.5" fill="${trim}"/>
    <rect x="88" y="${f ? 145 : 155}" width="24" height="12" rx="3" fill="${trim}" stroke="${INK}" stroke-width="2"/>
    <rect x="${f ? 62 : 58}" y="112" width="${f ? 15 : 18}" height="40" rx="8" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
    <rect x="123" y="112" width="${f ? 15 : 18}" height="40" rx="8" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>`)
  } else {
    layers.push(bodyOnly(sex, { shirt: f ? '#9AABB8' : '#7A8B9A', pants: '#5C5346', boot: '#3D2B1F' }))
  }

  // glasses after face
  const glasses = `
    <circle cx="92" cy="${f ? 64 : 70}" r="6" fill="none" stroke="${INK}" stroke-width="2"/>
    <circle cx="108" cy="${f ? 64 : 70}" r="6" fill="none" stroke="${INK}" stroke-width="2"/>
    <line x1="98" y1="${f ? 64 : 70}" x2="102" y2="${f ? 64 : 70}" stroke="${INK}" stroke-width="2"/>`

  layers.push(hair('mago', sex))
  layers.push(face(sex))
  layers.push(hairCrown('mago', sex))
  layers.push(glasses)

  if (lv >= 2) {
    layers.push(`
    <g transform="translate(48,145)">
      <rect x="0" y="0" width="22" height="28" rx="2" fill="#5C3A1E" stroke="${INK}" stroke-width="2.5"/>
      <rect x="3" y="4" width="16" height="20" fill="#E8D5A3"/>
      <path d="M6 10 H16 M6 15 H14" stroke="${c}" stroke-width="1.5"/>
    </g>`)
  }
  if (lv >= 7) {
    layers.push(`
    <circle cx="100" cy="120" r="8" fill="${trim}" stroke="${INK}" stroke-width="2"/>
    <circle cx="100" cy="120" r="3" fill="${c}"/>
    <line x1="100" y1="100" x2="100" y2="112" stroke="${INK}" stroke-width="2"/>`)
  }
  if (lv >= 10) {
    layers.push(`
    <rect x="158" y="70" width="7" height="150" rx="2" fill="${wood}" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="161.5" cy="68" r="14" fill="#5B8DEF" stroke="${INK}" stroke-width="3"/>
    <circle cx="161.5" cy="68" r="22" fill="#5B8DEF" opacity="0.3"/>`)
  } else if (lv >= 1) {
    layers.push(`
    <rect x="158" y="90" width="6" height="130" rx="2" fill="${wood}" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="161" cy="88" r="8" fill="${lv >= 6 ? '#A8D4FF' : wood}" stroke="${INK}" stroke-width="2.5"/>`)
  }
  if (lv >= 6 && lv < 10) {
    layers.push(`
    <circle cx="50" cy="155" r="12" fill="#A8D4FF" stroke="${INK}" stroke-width="2.5" opacity="0.9"/>
    <circle cx="50" cy="155" r="18" fill="#A8D4FF" opacity="0.25"/>`)
  }
  if (lv >= 3) layers.push(`<circle cx="40" cy="100" r="10" fill="#F5A623" opacity="0.7"/>`)
  if (lv >= 5) layers.push(`<circle cx="160" cy="55" r="6" fill="${trim}" opacity="0.8"/>`)
  if (lv >= 8) {
    layers.push(`
    <circle cx="70" cy="200" r="4" fill="${trim}" opacity="0.6"/>
    <circle cx="130" cy="210" r="4" fill="${trim}" opacity="0.6"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <circle cx="45" cy="60" r="5" fill="#E85D4C" opacity="0.8"/>
    <circle cx="165" cy="50" r="4" fill="#E85D4C" opacity="0.7"/>`)
  }
  if (lv >= 9) {
    // pointed hat on crown only — face free
    const hatTip = f ? 12 : 8
    layers.push(`
    <path d="M80 50 L100 ${hatTip} L120 50 Z" fill="${c}" stroke="${INK}" stroke-width="3.5"/>
    <ellipse cx="100" cy="52" rx="24" ry="7" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="100" cy="52" rx="16" ry="3.5" fill="${trim}" opacity="0.85"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex)
}

function ladino(lv, sex) {
  const c = '#7C4DB2'
  const accent = '#E8A0D0'
  const steel = '#C0C8D4'
  const f = sex === 'female'
  const layers = []
  layers.push(hairBehind('ladino', sex))

  if (lv >= 2) {
    layers.push(`
    <path d="M100 70 Q${45 - (lv >= 10 ? 8 : 0)} 130 55 250 Q100 210 145 250 Q${155 + (lv >= 10 ? 8 : 0)} 130 100 70"
      fill="${lv >= 10 ? '#4A3A5C' : c}" stroke="${INK}" stroke-width="3.5" opacity="0.92"/>`)
  }
  if (lv >= 11) {
    layers.push(`
    <g opacity="0.35" transform="translate(-28,8)">
      <path d="M100 90 L85 170 L115 170 Z" fill="${INK}"/>
      <circle cx="100" cy="75" r="12" fill="${INK}"/>
    </g>`)
  }

  layers.push(bodyOnly(sex, {
    shirt: f ? '#6B4A7A' : '#5C3A6E',
    pants: '#3D2B4A',
    boot: lv >= 7 ? '#1A1520' : '#3D2B1F',
  }))

  if (lv >= 7) {
    layers.push(`
    <ellipse cx="91" cy="242" rx="13" ry="7" fill="#1A1520" stroke="${accent}" stroke-width="2"/>
    <ellipse cx="109" cy="242" rx="13" ry="7" fill="#1A1520" stroke="${accent}" stroke-width="2"/>`)
  }

  if (lv >= 12) {
    layers.push(`
    <g transform="translate(148,110) rotate(-30)">
      <rect x="0" y="0" width="7" height="40" rx="1" fill="#2A2A40" stroke="${accent}" stroke-width="2.5"/>
      <rect x="-4" y="36" width="15" height="8" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>
      <circle cx="3" cy="10" r="12" fill="${accent}" opacity="0.35"/>
    </g>`)
  } else if (lv >= 9) {
    layers.push(`
    <g transform="translate(150,120)">
      <rect x="0" y="10" width="28" height="8" rx="2" fill="#5C3A1E" stroke="${INK}" stroke-width="2"/>
      <path d="M28 8 L48 14 L28 20 Z" fill="${steel}" stroke="${INK}" stroke-width="2"/>
    </g>`)
  } else if (lv >= 4) {
    layers.push(`
    <g transform="translate(148,110) rotate(-28)">
      <rect x="0" y="0" width="5" height="32" fill="${steel}" stroke="${INK}" stroke-width="2"/>
      <rect x="-3" y="28" width="11" height="6" fill="${accent}" stroke="${INK}" stroke-width="1.5"/>
    </g>
    <g transform="translate(48,110) rotate(28)">
      <rect x="0" y="0" width="5" height="32" fill="${steel}" stroke="${INK}" stroke-width="2"/>
      <rect x="-3" y="28" width="11" height="6" fill="${accent}" stroke="${INK}" stroke-width="1.5"/>
    </g>`)
  } else if (lv >= 1) {
    layers.push(`
    <g transform="translate(148,115) rotate(-28)">
      <rect x="0" y="0" width="5" height="28" fill="${steel}" stroke="${INK}" stroke-width="2"/>
      <rect x="-3" y="24" width="11" height="6" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
    </g>`)
  }
  if (lv >= 6 && lv < 12) layers.push(`<circle cx="155" cy="120" r="10" fill="${accent}" opacity="0.4"/>`)
  if (lv >= 3) layers.push(`<circle cx="100" cy="150" r="50" fill="${c}" opacity="0.08"/>`)
  if (lv >= 8) {
    layers.push(`
    <circle cx="45" cy="160" r="8" fill="none" stroke="${accent}" stroke-width="2"/>
    <circle cx="45" cy="160" r="3" fill="${accent}"/>`)
  }

  layers.push(hair('ladino', sex))
  layers.push(face(sex))
  layers.push(hairCrown('ladino', sex))
  if (lv >= 10) {
    layers.push(`
    <path d="M72 40 Q100 18 128 40 L124 54 Q100 48 76 54 Z" fill="#4A3A5C" stroke="${INK}" stroke-width="3"/>
    <path d="M76 78 Q70 110 78 150" fill="none" stroke="#4A3A5C" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
    <path d="M124 78 Q130 110 122 150" fill="none" stroke="#4A3A5C" stroke-width="10" stroke-linecap="round" opacity="0.7"/>`)
  } else if (lv >= 2 && !f) {
    layers.push(`
    <path d="M78 58 Q100 38 122 58 L118 88 Q100 98 82 88 Z" fill="${c}" stroke="${INK}" stroke-width="2.5" opacity="0.85"/>`)
  } else if (lv >= 2 && f) {
    layers.push(`
    <path d="M78 44 Q100 26 122 44" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`)
  }
  if (lv >= 5) {
    layers.push(`
    <rect x="86" y="${f ? 62 : 66}" width="28" height="10" rx="3" fill="${INK}" opacity="0.65"/>
    <circle cx="93" cy="${f ? 67 : 71}" r="1.8" fill="${accent}"/><circle cx="107" cy="${f ? 67 : 71}" r="1.8" fill="${accent}"/>`)
  }

  return wrap(layers.join('\n'), lv, c, sex)
}

const BUILDERS = { guerreiro, bardo, mago, ladino }
const SEXES = ['male', 'female']

for (const cls of Object.keys(BUILDERS)) {
  const classDir = join(root, cls)
  mkdirSync(classDir, { recursive: true })
  // remove legacy flat lv-XX.svg
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
