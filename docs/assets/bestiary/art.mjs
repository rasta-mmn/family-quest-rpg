/**
 * Character-style SVG bodies for bestiary (idle SMIL).
 * Inspired by fantasy refs — original vectors, not copies.
 */
export const GOLD = '#D4A945'
export const INK = '#1a1410'
export const BONE = '#e8e0d0'

export function bob(dur = '2.8s', amp = 2) {
  return `<animateTransform attributeName="transform" type="translate" values="0 0; 0 -${amp}; 0 0" dur="${dur}" repeatCount="indefinite"/>`
}

export function sway(dur = '3.2s', deg = 3) {
  return `<animateTransform attributeName="transform" type="rotate" values="-${deg} 64 70; ${deg} 64 70; -${deg} 64 70" dur="${dur}" repeatCount="indefinite"/>`
}

/** Full creature art by shape key — viewBox 0 0 128 128 */
export function shapeBody(shape, accent) {
  const A = accent
  switch (shape) {
    case 'dragon':
      return `
  <!-- crimson wyrm profile -->
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="3.2s" repeatCount="indefinite"/>
    <path d="M78 38 Q98 28 108 42 Q100 58 82 52 Z" fill="${A}" stroke="${INK}" stroke-width="2">
      <animateTransform attributeName="transform" type="rotate" values="0 82 45; -8 82 45; 0 82 45" dur="2.4s" repeatCount="indefinite"/>
    </path>
    <path d="M80 42 Q96 34 104 44" fill="none" stroke="#fbbf24" stroke-width="1.2" opacity="0.7"/>
    <path d="M36 78 Q20 96 28 110 Q48 118 70 108 Q92 96 88 78 Q70 88 52 86 Z" fill="${A}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M42 92 Q58 100 74 94" fill="none" stroke="#fbbf24" stroke-width="2"/>
    <path d="M42 98 Q58 106 72 100" fill="none" stroke="#fbbf24" stroke-width="1.4"/>
    <ellipse cx="58" cy="72" rx="22" ry="16" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M40 68 Q58 48 78 58 Q70 78 48 78 Z" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M48 62 Q58 54 68 60" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
    <path d="M72 52 Q88 28 96 22" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M88 26 Q100 18 108 28 Q102 36 90 34 Z" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M96 30 L112 34" stroke="${INK}" stroke-width="1.5">
      <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite"/>
    </path>
    <ellipse cx="100" cy="26" rx="2.2" ry="2.8" fill="#fbbf24">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.4s" repeatCount="indefinite"/>
    </ellipse>
    <path d="M92 20 L98 10 M100 18 L108 10" stroke="#7f1d1d" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M70 108 Q88 120 96 108 Q90 96 78 100" fill="${A}" stroke="${INK}" stroke-width="1.8">
      <animateTransform attributeName="transform" type="rotate" values="0 84 104; 6 84 104; 0 84 104" dur="2.8s" repeatCount="indefinite"/>
    </path>
    <circle cx="48" cy="86" r="3" fill="${INK}"/><circle cx="68" cy="84" r="3" fill="${INK}"/>
  </g>`

    case 'lich':
      return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.5; 0 0" dur="3s" repeatCount="indefinite"/>
    <!-- flayed undead -->
    <path d="M48 48 L40 110 H56 L70 110 L62 48 Z" fill="#2a2a2e" stroke="${INK}" stroke-width="1.8"/>
    <path d="M50 52 Q64 58 68 78 Q62 70 52 68 Z" fill="#3f3f46" stroke="${INK}" stroke-width="1.2"/>
    <path d="M52 54 Q40 60 36 80 Q44 72 52 68 Z" fill="#3f3f46" stroke="${INK}" stroke-width="1.2"/>
    <ellipse cx="56" cy="44" rx="16" ry="14" fill="#27272a" stroke="${INK}" stroke-width="2"/>
    <path d="M44 40 Q56 34 68 40" fill="none" stroke="#67e8f9" stroke-width="1" opacity="0.7">
      <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/>
    </path>
    <circle cx="56" cy="28" r="14" fill="#18181b" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="50" cy="28" rx="3" ry="4" fill="#09090b"/>
    <ellipse cx="62" cy="28" rx="3" ry="4" fill="#09090b"/>
    <path d="M48 34 H64" stroke="#a1a1aa" stroke-width="1.2"/>
    <circle cx="56" cy="20" r="4" fill="#f472b6">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite"/>
      <animate attributeName="r" values="3.5;5;3.5" dur="1.6s" repeatCount="indefinite"/>
    </circle>
    <path d="M70 50 Q92 44 98 56 Q90 68 72 62" fill="#27272a" stroke="${INK}" stroke-width="1.8"/>
    <path d="M42 50 Q24 56 22 70" fill="none" stroke="#27272a" stroke-width="5" stroke-linecap="round"/>
    <path d="M40 58 Q28 64 30 78" fill="none" stroke="#67e8f9" stroke-width="1" opacity="0.6"/>
    <path d="M72 58 Q84 52 90 60" fill="none" stroke="#67e8f9" stroke-width="1" opacity="0.6"/>
  </g>`

    case 'skeleton':
      return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="2.4s" repeatCount="indefinite"/>
    <circle cx="64" cy="28" r="14" fill="${BONE}" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="58" cy="26" rx="2.5" ry="3.5" fill="${INK}"/>
    <ellipse cx="70" cy="26" rx="2.5" ry="3.5" fill="${INK}"/>
    <path d="M56 34 Q64 38 72 34" fill="none" stroke="${INK}" stroke-width="1.5"/>
    <path d="M64 42 V70" stroke="${BONE}" stroke-width="6" stroke-linecap="round"/>
    <path d="M52 50 H76 M54 58 H74 M56 66 H72" stroke="${BONE}" stroke-width="2.5"/>
    <path d="M52 48 L36 62 M76 48 L92 62" stroke="${BONE}" stroke-width="4" stroke-linecap="round"/>
    <path d="M58 70 L48 98 M70 70 L78 98" stroke="${BONE}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="48" cy="100" r="4" fill="${BONE}" stroke="${INK}"/><circle cx="78" cy="100" r="4" fill="${BONE}" stroke="${INK}"/>
  </g>`

    case 'wight':
      return `
  <g opacity="0.92">
    <animateTransform attributeName="transform" type="translate" values="0 2; 0 -2; 0 2" dur="3.4s" repeatCount="indefinite"/>
    <path d="M40 36 Q64 18 88 36 L84 100 Q64 88 44 100 Z" fill="${A}" stroke="${GOLD}" stroke-width="1.8"/>
    <circle cx="54" cy="48" r="4" fill="#e0f2fe"/><circle cx="74" cy="48" r="4" fill="#e0f2fe"/>
    <path d="M52 62 H76" stroke="${INK}" stroke-width="2.5"/>
    <path d="M48 100 Q40 112 36 118 M80 100 Q88 112 92 118" stroke="${A}" stroke-width="3" opacity="0.6"/>
  </g>`

    case 'thrall':
      return `
  <g>
    <animate attributeName="opacity" values="0.65;0.95;0.65" dur="2.2s" repeatCount="indefinite"/>
    <ellipse cx="64" cy="58" rx="22" ry="30" fill="${A}" stroke="${GOLD}" stroke-width="1.5"/>
    <circle cx="56" cy="50" r="3.5" fill="#67e8f9"/><circle cx="72" cy="50" r="3.5" fill="#67e8f9"/>
    <circle cx="64" cy="24" r="6" fill="${GOLD}" opacity="0.8">
      <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/>
    </circle>
    <path d="M50 70 Q64 80 78 70" fill="none" stroke="${BONE}" stroke-width="1.5"/>
  </g>`

    case 'drake':
      return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="2.2s" repeatCount="indefinite"/>
    <ellipse cx="64" cy="70" rx="28" ry="18" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M40 62 Q64 40 88 62" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M36 58 Q24 48 28 38" fill="none" stroke="${A}" stroke-width="5"/>
    <path d="M92 58 Q104 48 100 38" fill="none" stroke="${A}" stroke-width="5">
      <animateTransform attributeName="transform" type="rotate" values="0 96 50; -12 96 50; 0 96 50" dur="1.8s" repeatCount="indefinite"/>
    </path>
    <circle cx="54" cy="62" r="2.5" fill="${INK}"/><circle cx="74" cy="62" r="2.5" fill="${INK}"/>
    <path d="M58 72 Q64 76 70 72" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
    <path d="M88 72 Q104 80 108 70" fill="${A}" stroke="${INK}" stroke-width="1.5"/>
  </g>`

    case 'cultist':
      return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.5; 0 0" dur="2.8s" repeatCount="indefinite"/>
    <path d="M64 20 L92 108 H36 Z" fill="#7f1d1d" stroke="${GOLD}" stroke-width="2"/>
    <path d="M50 36 Q64 28 78 36 L74 52 Q64 46 54 52 Z" fill="#450a0a" stroke="${INK}"/>
    <circle cx="64" cy="56" r="9" fill="${INK}" stroke="${GOLD}"/>
    <path d="M52 24 L64 8 L76 24" fill="#991b1b" stroke="${GOLD}" stroke-width="1.5"/>
    <circle cx="64" cy="56" r="3" fill="#fbbf24">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
    </circle>
  </g>`

    case 'acolyte':
      return `
  <g>
    ${bob('2.6s', 1.5)}
    <ellipse cx="64" cy="64" rx="20" ry="28" fill="#7f1d1d" stroke="${GOLD}" stroke-width="1.8"/>
    <path d="M48 42 Q64 30 80 42" fill="${A}" stroke="${GOLD}"/>
    <circle cx="64" cy="58" r="6" fill="#fbbf24" stroke="${INK}"/>
    <path d="M44 88 L64 100 L84 88" fill="none" stroke="${GOLD}" stroke-width="2"/>
  </g>`

    case 'king':
      return `
  <g>
    ${bob('3s', 1.8)}
    <path d="M64 36 L88 52 V100 H40 V52 Z" fill="${A}" stroke="${INK}" stroke-width="2.2"/>
    <rect x="52" y="60" width="24" height="14" fill="${INK}" stroke="${GOLD}"/>
    <path d="M40 38 L48 18 L64 28 L80 18 L88 38 Z" fill="${GOLD}" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="64" cy="16" r="5" fill="#ef4444">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <path d="M48 100 L40 118 M80 100 L88 118" stroke="${A}" stroke-width="4"/>
    <circle cx="56" cy="48" r="2" fill="${INK}"/><circle cx="72" cy="48" r="2" fill="${INK}"/>
  </g>`

    case 'templar':
      return `
  <g>
    ${bob('2.5s', 1.5)}
    <path d="M64 28 L86 46 V100 H42 V46 Z" fill="#44403c" stroke="${GOLD}" stroke-width="2"/>
    <path d="M52 58 H76 V72 H52 Z" fill="${INK}"/>
    <path d="M64 28 V14 M56 20 H72" stroke="${GOLD}" stroke-width="3"/>
    <circle cx="64" cy="42" r="6" fill="${A}" stroke="${INK}"/>
    <path d="M90 50 V90 M84 56 H96" stroke="${GOLD}" stroke-width="2.5"/>
  </g>`

    case 'mage':
      return `
  <g>
    ${bob('2.7s', 2)}
    <path d="M64 18 L96 108 H32 Z" fill="${A}" stroke="${GOLD}" stroke-width="2"/>
    <circle cx="64" cy="56" r="12" fill="${INK}" stroke="${GOLD}" stroke-width="1.5"/>
    <circle cx="64" cy="56" r="5" fill="#c4b5fd">
      <animate attributeName="r" values="4;7;4" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <path d="M64 18 V6" stroke="${GOLD}" stroke-width="2.5"/>
    <circle cx="64" cy="4" r="3" fill="#a78bfa"/>
  </g>`

    case 'knight':
      return `
  <g>
    ${bob('2.4s', 1.5)}
    <path d="M64 26 L84 42 V98 H44 V42 Z" fill="#57534e" stroke="${GOLD}" stroke-width="2"/>
    <rect x="52" y="54" width="24" height="12" fill="${INK}"/>
    <path d="M96 48 V88 M90 54 H102" stroke="${GOLD}" stroke-width="2.5"/>
    <circle cx="64" cy="40" r="5" fill="#a8a29e" stroke="${INK}"/>
  </g>`

    case 'elemental':
      return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="2.2s" repeatCount="indefinite"/>
    <path d="M64 16 Q96 44 84 104 Q64 88 44 104 Q32 44 64 16 Z" fill="${A}" stroke="${GOLD}" stroke-width="2"/>
    <path d="M52 48 L76 60 L52 72 Z" fill="#93c5fd" opacity="0.9"/>
    <circle cx="64" cy="52" r="8" fill="#e0f2fe">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
    </circle>
    <path d="M40 36 Q28 28 32 18 M88 36 Q100 28 96 18" stroke="#93c5fd" stroke-width="2" opacity="0.7">
      <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite"/>
    </path>
  </g>`

    case 'wisp':
      return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 4; 0 -4; 0 4" dur="2s" repeatCount="indefinite"/>
    <ellipse cx="64" cy="60" rx="18" ry="24" fill="#93c5fd" opacity="0.85" stroke="${GOLD}"/>
    <circle cx="64" cy="54" r="8" fill="#e0f2fe">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.3s" repeatCount="indefinite"/>
    </circle>
  </g>`

    case 'shard':
      return `
  <g>
    ${bob('2.8s', 1.5)}
    <path d="M64 16 L92 72 L64 108 L36 72 Z" fill="#78716c" stroke="${GOLD}" stroke-width="2"/>
    <path d="M64 32 L76 68 L64 88 L52 68 Z" fill="${A}" opacity="0.75"/>
  </g>`

    case 'tide':
      return `
  <g>
    <ellipse cx="64" cy="64" rx="30" ry="22" fill="#0ea5e9" opacity="0.9" stroke="${GOLD}" stroke-width="2"/>
    <path d="M36 60 Q50 48 64 60 Q78 72 92 60" fill="none" stroke="#e0f2fe" stroke-width="3">
      <animate attributeName="d" values="M36 60 Q50 48 64 60 Q78 72 92 60;M36 60 Q50 72 64 60 Q78 48 92 60;M36 60 Q50 48 64 60 Q78 72 92 60" dur="2s" repeatCount="indefinite"/>
    </path>
  </g>`

    case 'beast':
      return `
  <g>
    ${bob('2.3s', 2)}
    <ellipse cx="70" cy="72" rx="34" ry="22" fill="${A}" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="40" cy="56" r="18" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M28 44 L18 28 M36 42 L32 24" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="34" cy="54" r="3" fill="${INK}"/>
    <path d="M26 60 L14 66" stroke="${INK}" stroke-width="2"/>
    <path d="M48 88 L36 108 M80 88 L88 108 M96 80 L110 90" stroke="${A}" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 68 Q118 60 114 48" fill="none" stroke="${A}" stroke-width="4"/>
  </g>`

    case 'pup':
      return `
  <g>
    ${bob('2s', 2)}
    <ellipse cx="64" cy="74" rx="22" ry="16" fill="${A}" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="48" cy="56" r="14" fill="${A}" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="44" cy="54" r="2.5" fill="${INK}"/>
    <path d="M38 46 L32 34 M54 46 L58 34" stroke="${INK}" stroke-width="2.5"/>
    <path d="M80 74 Q96 68 94 56" fill="none" stroke="${A}" stroke-width="3"/>
  </g>`

    case 'brute':
      return `
  <g>
    ${bob('2.6s', 1.5)}
    <ellipse cx="64" cy="68" rx="32" ry="26" fill="#78350f" stroke="${GOLD}" stroke-width="2"/>
    <path d="M36 48 L20 28 M92 48 L108 28" stroke="${BONE}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="52" cy="62" r="3.5" fill="${INK}"/><circle cx="76" cy="62" r="3.5" fill="${INK}"/>
    <path d="M50 76 H78" stroke="${INK}" stroke-width="2"/>
  </g>`

    case 'crab':
      return `
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 2; 0 0" dur="1.2s" repeatCount="indefinite"/>
    <ellipse cx="64" cy="68" rx="28" ry="18" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <circle cx="52" cy="62" r="4" fill="${INK}"/><circle cx="76" cy="62" r="4" fill="${INK}"/>
    <path d="M36 64 Q16 48 22 36 M92 64 Q112 48 106 36" fill="none" stroke="${A}" stroke-width="5" stroke-linecap="round">
      <animate attributeName="d" values="M36 64 Q16 48 22 36 M92 64 Q112 48 106 36;M36 64 Q18 52 28 40 M92 64 Q110 52 100 40;M36 64 Q16 48 22 36 M92 64 Q112 48 106 36" dur="1.6s" repeatCount="indefinite"/>
    </path>
    <path d="M44 84 V96 M54 86 V100 M74 86 V100 M84 84 V96" stroke="${GOLD}" stroke-width="2.5"/>
  </g>`

    case 'demon':
      return `
  <g>
    ${bob('2.5s', 2)}
    <path d="M36 108 L44 36 L64 48 L84 36 L92 108 Z" fill="${A}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M44 36 L28 12 M84 36 L100 12" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="54" cy="58" r="4" fill="#fbbf24"/><circle cx="74" cy="58" r="4" fill="#fbbf24">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.4s" repeatCount="indefinite"/>
    </circle>
    <path d="M52 74 Q64 84 76 74" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <path d="M88 70 Q110 64 108 48" fill="none" stroke="${A}" stroke-width="4"/>
  </g>`

    case 'imp':
      return `
  <g>
    ${bob('1.8s', 2.5)}
    <ellipse cx="64" cy="64" rx="18" ry="22" fill="${A}" stroke="${GOLD}" stroke-width="1.8"/>
    <path d="M50 44 L40 26 M78 44 L88 26" stroke="${GOLD}" stroke-width="2.5"/>
    <circle cx="58" cy="60" r="2.5" fill="#fbbf24"/><circle cx="70" cy="60" r="2.5" fill="#fbbf24"/>
    <path d="M82 68 Q100 60 96 44" fill="none" stroke="${A}" stroke-width="3"/>
  </g>`

    case 'hound':
      return `
  <g>
    ${bob('2s', 2)}
    <ellipse cx="72" cy="72" rx="30" ry="16" fill="#7f1d1d" stroke="${GOLD}" stroke-width="1.8"/>
    <circle cx="40" cy="60" r="14" fill="#7f1d1d" stroke="${GOLD}"/>
    <circle cx="34" cy="58" r="2.5" fill="#fbbf24"/>
    <path d="M30 50 L22 38" stroke="${GOLD}" stroke-width="2"/>
    <path d="M96 70 Q112 62 110 50" fill="none" stroke="#7f1d1d" stroke-width="3"/>
  </g>`

    case 'horned':
      return `
  <g>
    ${bob('2.4s', 1.8)}
    <path d="M40 100 L48 36 L64 48 L80 36 L88 100 Z" fill="${A}" stroke="${GOLD}" stroke-width="2"/>
    <path d="M48 36 L38 14 M80 36 L90 14" stroke="${GOLD}" stroke-width="3"/>
    <circle cx="56" cy="58" r="3" fill="#fbbf24"/><circle cx="72" cy="58" r="3" fill="#fbbf24"/>
  </g>`

    case 'specter':
      return `
  <g opacity="0.85">
    <animateTransform attributeName="transform" type="translate" values="0 3; 0 -3; 0 3" dur="3.5s" repeatCount="indefinite"/>
    <path d="M40 30 Q64 12 88 30 L90 100 Q72 84 64 104 Q56 84 38 100 Z" fill="${A}" stroke="${GOLD}" stroke-width="1.8"/>
    <circle cx="54" cy="48" r="5" fill="${INK}"/><circle cx="74" cy="48" r="5" fill="${INK}"/>
    <path d="M50 64 Q64 74 78 64" fill="none" stroke="${INK}" stroke-width="2"/>
  </g>`

    case 'shade':
      return `
  <g>
    <animate attributeName="opacity" values="0.35;0.7;0.35" dur="2.8s" repeatCount="indefinite"/>
    <ellipse cx="64" cy="60" rx="20" ry="28" fill="${A}" stroke="${GOLD}"/>
    <circle cx="56" cy="52" r="3" fill="${INK}"/><circle cx="72" cy="52" r="3" fill="${INK}"/>
  </g>`

    case 'chain':
      return `
  <g>
    ${bob('2.8s', 1.5)}
    <path d="M42 28 Q64 14 86 28 L82 96 Q64 84 46 96 Z" fill="#64748b" stroke="${GOLD}" stroke-width="1.8"/>
    <path d="M64 96 V118 M54 104 H74 M50 112 H78" stroke="${GOLD}" stroke-width="2.5"/>
    <circle cx="56" cy="48" r="3" fill="${INK}"/><circle cx="72" cy="48" r="3" fill="${INK}"/>
  </g>`

    case 'wraith':
      return `
  <g opacity="0.55">
    <animateTransform attributeName="transform" type="translate" values="-2 0; 2 0; -2 0" dur="3s" repeatCount="indefinite"/>
    <path d="M42 32 Q64 16 86 32 L82 92 Q64 104 46 92 Z" fill="#cbd5e1" stroke="${GOLD}"/>
    <circle cx="56" cy="50" r="2.5" fill="${INK}"/><circle cx="72" cy="50" r="2.5" fill="${INK}"/>
  </g>`

    case 'golem':
      return `
  <g>
    ${bob('3.2s', 1.2)}
    <rect x="36" y="28" width="56" height="72" rx="6" fill="${A}" stroke="${GOLD}" stroke-width="2.2"/>
    <rect x="48" y="44" width="10" height="10" fill="${INK}"/><rect x="70" y="44" width="10" height="10" fill="${INK}"/>
    <rect x="54" y="68" width="20" height="6" fill="${INK}"/>
    <rect x="22" y="50" width="14" height="28" rx="3" fill="${A}" stroke="${GOLD}"/>
    <rect x="92" y="50" width="14" height="28" rx="3" fill="${A}" stroke="${GOLD}"/>
    <rect x="44" y="100" width="12" height="16" fill="${A}" stroke="${GOLD}"/>
    <rect x="72" y="100" width="12" height="16" fill="${A}" stroke="${GOLD}"/>
  </g>`

    case 'rubble':
      return `
  <g>
    ${bob('2.5s', 1)}
    <path d="M36 88 L48 32 L80 40 L96 88 Z" fill="#57534e" stroke="${GOLD}" stroke-width="2"/>
    <rect x="56" y="56" width="8" height="8" fill="${INK}"/><rect x="70" y="60" width="7" height="7" fill="${INK}"/>
  </g>`

    case 'rune':
      return `
  <g>
    ${bob('2.8s', 1.5)}
    <circle cx="64" cy="64" r="30" fill="#44403c" stroke="${GOLD}" stroke-width="2"/>
    <path d="M64 38 V90 M42 64 H86 M48 46 L80 82 M80 46 L48 82" stroke="#a78bfa" stroke-width="2.5">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
    </path>
  </g>`

    case 'fist':
      return `
  <g>
    ${bob('2.4s', 1.5)}
    <rect x="38" y="36" width="52" height="56" rx="10" fill="#57534e" stroke="${GOLD}" stroke-width="2"/>
    <rect x="48" y="48" width="10" height="28" fill="${INK}"/><rect x="70" y="48" width="10" height="28" fill="${INK}"/>
    <path d="M52 28 H76 V40 H52 Z" fill="${A}" stroke="${GOLD}"/>
  </g>`

    case 'void_mage':
      return `
  <g>
    ${bob('2.8s', 2)}
    <path d="M64 12 L100 108 H28 Z" fill="${A}" stroke="${GOLD}" stroke-width="2"/>
    <circle cx="64" cy="56" r="14" fill="${INK}" stroke="${GOLD}"/>
    <circle cx="64" cy="56" r="6" fill="#c4b5fd">
      <animate attributeName="r" values="4;9;4" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <path d="M64 12 V2" stroke="${GOLD}" stroke-width="2.5"/>
  </g>`

    case 'apprentice':
      return `
  <g>
    ${bob('2.5s', 1.5)}
    <path d="M64 24 L88 100 H40 Z" fill="#5b21b6" stroke="${GOLD}" stroke-width="1.8"/>
    <circle cx="64" cy="54" r="9" fill="${INK}" stroke="${GOLD}"/>
    <circle cx="64" cy="54" r="3.5" fill="#ddd6fe"/>
  </g>`

    case 'familiar':
      return `
  <g>
    ${bob('2.6s', 1.5)}
    <rect x="40" y="32" width="48" height="60" rx="4" fill="#4c1d95" stroke="${GOLD}" stroke-width="2"/>
    <path d="M48 50 H80 M48 64 H74 M48 78 H78" stroke="#c4b5fd" stroke-width="2"/>
    <circle cx="54" cy="40" r="2.5" fill="${INK}"/><circle cx="74" cy="40" r="2.5" fill="${INK}"/>
  </g>`

    case 'puppet':
      return `
  <g>
    ${bob('2.2s', 2)}
    <circle cx="64" cy="34" r="14" fill="#a78bfa" stroke="${GOLD}" stroke-width="1.8"/>
    <rect x="52" y="48" width="24" height="36" fill="#7c3aed" stroke="${GOLD}"/>
    <path d="M52 56 L34 74 M76 56 L94 74" stroke="${GOLD}" stroke-width="2.5"/>
    <path d="M64 14 V4 M54 10 H74" stroke="#c4b5fd" stroke-width="1.5"/>
    <circle cx="58" cy="34" r="2" fill="${INK}"/><circle cx="70" cy="34" r="2" fill="${INK}"/>
  </g>`

    case 'forest':
      return `
  <g>
    ${bob('3s', 2)}
    <path d="M64 14 Q92 48 80 108 Q64 96 48 108 Q36 48 64 14 Z" fill="${A}" stroke="${GOLD}" stroke-width="2"/>
    <circle cx="54" cy="56" r="4" fill="#bbf7d0"/><circle cx="74" cy="56" r="4" fill="#bbf7d0"/>
    <path d="M52 72 Q64 82 76 72" fill="none" stroke="#14532d" stroke-width="2"/>
    <path d="M44 36 L34 18 M84 36 L94 18" stroke="#86efac" stroke-width="2.5"/>
    <circle cx="64" cy="40" r="3" fill="#fbbf24" opacity="0.8">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
    </circle>
  </g>`

    case 'moss':
      return `
  <g>
    ${bob('2.8s', 1.5)}
    <ellipse cx="64" cy="68" rx="22" ry="24" fill="#4d7c0f" stroke="${GOLD}" stroke-width="1.8"/>
    <circle cx="56" cy="62" r="2.5" fill="${INK}"/><circle cx="72" cy="62" r="2.5" fill="${INK}"/>
    <path d="M46 46 Q64 34 82 46" fill="#86efac" stroke="${GOLD}"/>
  </g>`

    case 'vine':
      return `
  <g>
    <animateTransform attributeName="transform" type="rotate" values="-4 64 64; 4 64 64; -4 64 64" dur="3s" repeatCount="indefinite"/>
    <path d="M64 20 Q84 52 64 108 Q44 52 64 20" fill="#166534" stroke="${GOLD}" stroke-width="1.8"/>
    <path d="M50 44 Q70 56 50 68 Q70 80 50 92" fill="none" stroke="#86efac" stroke-width="2.5"/>
  </g>`

    case 'root':
      return `
  <g>
    ${bob('3s', 1.2)}
    <path d="M64 18 L88 48 L76 108 H52 L40 48 Z" fill="#3f6212" stroke="${GOLD}" stroke-width="2"/>
    <circle cx="54" cy="54" r="3" fill="#bbf7d0"/><circle cx="74" cy="54" r="3" fill="#bbf7d0"/>
    <path d="M48 100 Q36 114 28 118 M80 100 Q92 114 100 118" stroke="#365314" stroke-width="4"/>
  </g>`

    case 'yokai':
      return `
  <g>
    ${bob('2.6s', 2)}
    <ellipse cx="64" cy="64" rx="28" ry="32" fill="${A}" stroke="${GOLD}" stroke-width="2"/>
    <path d="M40 50 H88 V68 H40 Z" fill="${BONE}" stroke="${INK}" stroke-width="1.5"/>
    <circle cx="52" cy="58" r="4" fill="${INK}"/><circle cx="76" cy="58" r="4" fill="${INK}"/>
    <path d="M56 66 Q64 72 72 66" fill="none" stroke="${INK}" stroke-width="2"/>
    <path d="M44 36 L34 16 M84 36 L94 16" stroke="${GOLD}" stroke-width="3"/>
  </g>`

    case 'fox':
      return `
  <g>
    ${bob('2.2s', 2)}
    <ellipse cx="64" cy="72" rx="24" ry="18" fill="#ea580c" stroke="${INK}" stroke-width="2"/>
    <circle cx="52" cy="52" r="16" fill="#ea580c" stroke="${INK}" stroke-width="2"/>
    <path d="M40 40 L32 20 L48 36 M60 36 L68 18 L76 40" fill="#ea580c" stroke="${INK}"/>
    <circle cx="46" cy="52" r="2.5" fill="${INK}"/>
    <path d="M84 74 Q108 60 104 42" fill="none" stroke="#fb923c" stroke-width="4"/>
    <path d="M86 78 Q110 70 106 50" fill="none" stroke="#fdba74" stroke-width="3"/>
    <path d="M88 80 Q112 78 108 58" fill="none" stroke="#ffedd5" stroke-width="2"/>
  </g>`

    case 'lantern':
      return `
  <g>
    ${bob('2.4s', 2.5)}
    <rect x="46" y="40" width="36" height="44" rx="4" fill="#9a3412" stroke="${GOLD}" stroke-width="2"/>
    <rect x="52" y="48" width="24" height="28" fill="#fbbf24">
      <animate attributeName="opacity" values="0.45;1;0.45" dur="1.6s" repeatCount="indefinite"/>
    </rect>
    <path d="M64 40 V22 M52 28 H76" stroke="${GOLD}" stroke-width="2.5"/>
    <circle cx="64" cy="96" r="6" fill="#fdba74" opacity="0.75"/>
  </g>`

    case 'oni':
      return `
  <g>
    ${bob('2.3s', 1.8)}
    <path d="M38 36 H90 L84 100 H44 Z" fill="#b91c1c" stroke="${GOLD}" stroke-width="2"/>
    <path d="M48 36 L40 14 M80 36 L88 14" stroke="${BONE}" stroke-width="4"/>
    <circle cx="54" cy="58" r="4" fill="${INK}"/><circle cx="74" cy="58" r="4" fill="${INK}"/>
    <path d="M52 74 H76" stroke="${INK}" stroke-width="3"/>
  </g>`

    case 'cockatrice':
      return `
  <g>
    ${bob('2.4s', 2)}
    <ellipse cx="68" cy="72" rx="30" ry="20" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <circle cx="42" cy="52" r="18" fill="${A}" stroke="${INK}" stroke-width="2"/>
    <path d="M30 40 L22 18 L40 34 M48 34 L56 12 L62 34" fill="#ca8a04" stroke="${INK}"/>
    <path d="M28 54 L12 58 L28 62 Z" fill="#ef4444"/>
    <circle cx="40" cy="50" r="3.5" fill="#ef4444">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.3s" repeatCount="indefinite"/>
    </circle>
    <path d="M90 68 Q112 52 108 36" fill="none" stroke="${A}" stroke-width="4"/>
    <path d="M36 40 Q28 28 36 22" fill="#ef4444" stroke="${INK}"/>
  </g>`

    case 'chick':
      return `
  <g>
    ${bob('1.8s', 2)}
    <ellipse cx="64" cy="72" rx="18" ry="14" fill="#eab308" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="64" cy="50" r="14" fill="#eab308" stroke="${INK}"/>
    <circle cx="60" cy="48" r="2.5" fill="${INK}"/>
    <path d="M52 54 L42 58 L52 62 Z" fill="#ef4444"/>
    <path d="M56 38 L52 26 M70 38 L74 26" stroke="#ca8a04" stroke-width="2.5"/>
  </g>`

    case 'gaze':
      return `
  <g>
    ${bob('2.5s', 1.5)}
    <ellipse cx="64" cy="64" rx="22" ry="26" fill="#78716c" stroke="${GOLD}" stroke-width="1.8"/>
    <circle cx="64" cy="58" r="12" fill="#fef08a" stroke="${GOLD}"/>
    <circle cx="64" cy="58" r="5" fill="#ef4444">
      <animate attributeName="r" values="3;7;3" dur="1.8s" repeatCount="indefinite"/>
    </circle>
  </g>`

    case 'harpy':
      return `
  <g>
    ${bob('2.2s', 2.5)}
    <ellipse cx="64" cy="68" rx="18" ry="24" fill="#a8a29e" stroke="${INK}" stroke-width="1.8"/>
    <circle cx="64" cy="44" r="14" fill="#d6d3d1" stroke="${INK}"/>
    <path d="M46 56 Q22 44 28 24 M82 56 Q106 44 100 24" fill="#78716c" stroke="${INK}">
      <animateTransform attributeName="transform" type="rotate" values="0 64 50; 6 64 50; 0 64 50" dur="1.6s" repeatCount="indefinite"/>
    </path>
    <circle cx="58" cy="44" r="2.5" fill="${INK}"/><circle cx="70" cy="44" r="2.5" fill="${INK}"/>
    <path d="M58 52 L64 58 L70 52" fill="#ef4444"/>
  </g>`

    default:
      return `<circle cx="64" cy="64" r="28" fill="${A}" stroke="${GOLD}" stroke-width="2"/>`
  }
}

export function creatureSvg({ label, accent, bg, shape, crown }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}">
  <defs>
    <radialGradient id="g-${label}" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="128" height="128" rx="14" fill="${bg}"/>
  <circle cx="64" cy="64" r="50" fill="url(#g-${label})">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="3.2s" repeatCount="indefinite"/>
  </circle>
  ${
    crown
      ? `<path d="M44 18 L52 8 L64 14 L76 8 L84 18 Z" fill="${GOLD}" stroke="${INK}" stroke-width="1.2" opacity="0.95"/>`
      : ''
  }
  ${shapeBody(shape, accent)}
</svg>
`
}
