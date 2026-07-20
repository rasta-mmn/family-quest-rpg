/**
 * Seed curated bestiary roster: 12 bosses × 3 vassals = 48 animated SVGs.
 * Run: node docs/assets/bestiary/generate-bestiary.mjs
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { creatureSvg } from './art.mjs'

const root = dirname(fileURLToPath(import.meta.url))

/** Prefer painted .png when present (Grok/realistic art); else SVG. */
function artPath(bossId, file) {
  const localPng = join(root, bossId, `${file}.png`)
  if (existsSync(localPng)) return `docs/assets/bestiary/${bossId}/${file}.png`
  return `docs/assets/bestiary/${bossId}/${file}.svg`
}

/**
 * @typedef {{ id: string, name: string, name_pt: string, type: string, shape: string, lore: string, lore_pt: string, accent: string, bg: string, vassals: Array<{id:string,name:string,name_pt:string,type:string,shape:string,lore:string,lore_pt:string}> }} BossDef
 */

/** @type {BossDef[]} */
const BOSSES = [
  {
    id: 'lich',
    name: 'Bone Lich',
    name_pt: 'Lich dos Ossos',
    type: 'lich',
    shape: 'lich',
    lore: 'Crowned in frost and bone — drains warmth from the living.',
    lore_pt: 'Coroado de gelo e osso — drena o calor dos vivos.',
    accent: '#7048E8',
    bg: '#1E1B2E',
    vassals: [
      {
        id: 'bone_skeleton',
        name: 'Bone Skeleton',
        name_pt: 'Esqueleto de Osso',
        type: 'morto_vivo',
        shape: 'skeleton',
        lore: 'Rattles forward with a rusted blade.',
        lore_pt: 'Avança chocalhando com lâmina enferrujada.',
      },
      {
        id: 'crypt_wight',
        name: 'Crypt Wight',
        name_pt: 'Wight da Cripta',
        type: 'morto_vivo',
        shape: 'wight',
        lore: 'Guards tombs that should stay shut.',
        lore_pt: 'Guarda túmulos que deveriam ficar fechados.',
      },
      {
        id: 'soul_thrall',
        name: 'Soul Thrall',
        name_pt: 'Servo da Alma',
        type: 'morto_vivo',
        shape: 'thrall',
        lore: 'A bound spirit that echoes the lich will.',
        lore_pt: 'Espirito preso que ecoa a vontade do lich.',
      },
    ],
  },
  {
    id: 'dragon',
    name: 'Crimson Wyrm',
    name_pt: 'Serpe Carmesim',
    type: 'dragao',
    shape: 'dragon',
    lore: 'Hoards fire and fear beneath cracked mountains.',
    lore_pt: 'Acumula fogo e medo sob montanhas rachadas.',
    accent: '#C92A2A',
    bg: '#3D2B1F',
    vassals: [
      {
        id: 'fire_cultist',
        name: 'Fire Cultist',
        name_pt: 'Cultista do Fogo',
        type: 'mago_mau',
        shape: 'cultist',
        lore: 'Chants until the scales glow.',
        lore_pt: 'Canta até as escamas brilharem.',
      },
      {
        id: 'ash_drake',
        name: 'Ash Drake',
        name_pt: 'Dragãozinho de Cinza',
        type: 'dragao',
        shape: 'drake',
        lore: 'Small wings, hot temper.',
        lore_pt: 'Asas pequenas, temperamento quente.',
      },
      {
        id: 'scale_acolyte',
        name: 'Scale Acolyte',
        name_pt: 'Acólito das Escamas',
        type: 'mago_mau',
        shape: 'acolyte',
        lore: 'Wears stolen dragon scales as prayer.',
        lore_pt: 'Usa escamas roubadas como oração.',
      },
    ],
  },
  {
    id: 'mad_king',
    name: 'Mad King',
    name_pt: 'Rei Louco',
    type: 'rei_mau',
    shape: 'king',
    lore: 'Issues decrees that only madness obeys.',
    lore_pt: 'Emite decretos que só a loucura obedece.',
    accent: '#996515',
    bg: '#1C1917',
    vassals: [
      {
        id: 'templar_zealot',
        name: 'Templar Zealot',
        name_pt: 'Templário Zelote',
        type: 'rei_mau',
        shape: 'templar',
        lore: 'Shield first, mercy never.',
        lore_pt: 'Escudo primeiro, misericórdia nunca.',
      },
      {
        id: 'court_mage',
        name: 'Court Mage',
        name_pt: 'Mago da Corte',
        type: 'mago_mau',
        shape: 'mage',
        lore: 'Turns royal whims into hexes.',
        lore_pt: 'Transforma caprichos reais em maldições.',
      },
      {
        id: 'crown_guard',
        name: 'Crown Guard',
        name_pt: 'Guarda da Coroa',
        type: 'rei_mau',
        shape: 'knight',
        lore: 'Halberd polished on dissenters.',
        lore_pt: 'Alabarda polida em dissidentes.',
      },
    ],
  },
  {
    id: 'elemental',
    name: 'Storm Elemental',
    name_pt: 'Elemental da Tempestade',
    type: 'elemental',
    shape: 'elemental',
    lore: 'A walking thunderhead with a temper.',
    lore_pt: 'Uma tempestade ambulante de mau génio.',
    accent: '#2563EB',
    bg: '#0F172A',
    vassals: [
      {
        id: 'spark_wisp',
        name: 'Spark Wisp',
        name_pt: 'Fogo-Fátuo da Faísca',
        type: 'elemental',
        shape: 'wisp',
        lore: 'Zips, snaps, vanishes.',
        lore_pt: 'Zune, estala, some.',
      },
      {
        id: 'stone_shard',
        name: 'Stone Shard',
        name_pt: 'Lasca de Pedra',
        type: 'elemental',
        shape: 'shard',
        lore: 'Earth fragment that refuses to settle.',
        lore_pt: 'Fragmento de terra que se recusa a assentar.',
      },
      {
        id: 'tide_sprite',
        name: 'Tide Sprite',
        name_pt: 'Duende da Maré',
        type: 'elemental',
        shape: 'tide',
        lore: 'Pulls heroes off balance with every wave.',
        lore_pt: 'Desequilibra heróis a cada onda.',
      },
    ],
  },
  {
    id: 'beast',
    name: 'Dire Beast',
    name_pt: 'Besta Dire',
    type: 'besta',
    shape: 'beast',
    lore: 'Claws carved from hunger itself.',
    lore_pt: 'Garras talhadas da própria fome.',
    accent: '#A87900',
    bg: '#2A2118',
    vassals: [
      {
        id: 'claw_pup',
        name: 'Claw Pup',
        name_pt: 'Filhote de Garra',
        type: 'besta',
        shape: 'pup',
        lore: 'Small, loud, all teeth.',
        lore_pt: 'Pequeno, barulhento, só dentes.',
      },
      {
        id: 'horn_brute',
        name: 'Horn Brute',
        name_pt: 'Bruto de Chifre',
        type: 'besta',
        shape: 'brute',
        lore: 'Charges first, thinks never.',
        lore_pt: 'Investe primeiro, nunca pensa.',
      },
      {
        id: 'shell_crab',
        name: 'Shell Crab',
        name_pt: 'Caranguejo de Concha',
        type: 'besta',
        shape: 'crab',
        lore: 'Armor that pinches back.',
        lore_pt: 'Armadura que belisca de volta.',
      },
    ],
  },
  {
    id: 'demon',
    name: 'Infernal Demon',
    name_pt: 'Demônio Infernal',
    type: 'demonio',
    shape: 'demon',
    lore: 'Bargains in ash and broken promises.',
    lore_pt: 'Negocia em cinza e promessas partidas.',
    accent: '#B91C1C',
    bg: '#1C0A0A',
    vassals: [
      {
        id: 'imp_ember',
        name: 'Ember Imp',
        name_pt: 'Diabrete de Brasa',
        type: 'demonio',
        shape: 'imp',
        lore: 'Tiny horns, big smirk.',
        lore_pt: 'Chifres minúsculos, sorriso enorme.',
      },
      {
        id: 'brimstone_hound',
        name: 'Brimstone Hound',
        name_pt: 'Cão de Enxofre',
        type: 'demonio',
        shape: 'hound',
        lore: 'Tracks fear by scent.',
        lore_pt: 'Fareja o medo.',
      },
      {
        id: 'horned_thrall',
        name: 'Horned Thrall',
        name_pt: 'Servo Cornudo',
        type: 'demonio',
        shape: 'horned',
        lore: 'Bound by a seal that still burns.',
        lore_pt: 'Preso por um selo que ainda queima.',
      },
    ],
  },
  {
    id: 'specter',
    name: 'Wailing Specter',
    name_pt: 'Espectro Uivante',
    type: 'morto_vivo',
    shape: 'specter',
    lore: 'Sings unfinished goodbyes through fog.',
    lore_pt: 'Canta adeuses inacabados através da névoa.',
    accent: '#94A3B8',
    bg: '#0F172A',
    vassals: [
      {
        id: 'mist_shade',
        name: 'Mist Shade',
        name_pt: 'Sombra da Névoa',
        type: 'morto_vivo',
        shape: 'shade',
        lore: 'Half-seen, fully chilling.',
        lore_pt: 'Meio vista, totalmente gelada.',
      },
      {
        id: 'chain_ghost',
        name: 'Chain Ghost',
        name_pt: 'Fantasma das Correntes',
        type: 'morto_vivo',
        shape: 'chain',
        lore: 'Drags iron regrets behind it.',
        lore_pt: 'Arrasta arrependimentos de ferro.',
      },
      {
        id: 'echo_wraith',
        name: 'Echo Wraith',
        name_pt: 'Espectro do Eco',
        type: 'morto_vivo',
        shape: 'wraith',
        lore: 'Repeats your worst thought louder.',
        lore_pt: 'Repete o teu pior pensamento mais alto.',
      },
    ],
  },
  {
    id: 'golem',
    name: 'Ruin Golem',
    name_pt: 'Golem das Ruínas',
    type: 'monstro',
    shape: 'golem',
    lore: 'Built from fallen walls and stubborn rock.',
    lore_pt: 'Feito de muros caídos e pedra teimosa.',
    accent: '#78716C',
    bg: '#1C1917',
    vassals: [
      {
        id: 'rubble_chunk',
        name: 'Rubble Chunk',
        name_pt: 'Pedaço de Entulho',
        type: 'monstro',
        shape: 'rubble',
        lore: 'Walks like a landslide.',
        lore_pt: 'Anda como um deslizamento.',
      },
      {
        id: 'rune_core',
        name: 'Rune Core',
        name_pt: 'Núcleo de Runas',
        type: 'monstro',
        shape: 'rune',
        lore: 'Heart of stone, lit with glyphs.',
        lore_pt: 'Coração de pedra, aceso com glifos.',
      },
      {
        id: 'iron_fist',
        name: 'Iron Fist',
        name_pt: 'Punho de Ferro',
        type: 'monstro',
        shape: 'fist',
        lore: 'One purpose: smash.',
        lore_pt: 'Um propósito: esmagar.',
      },
    ],
  },
  {
    id: 'evil_mage',
    name: 'Void Mage',
    name_pt: 'Mago do Vazio',
    type: 'mago_mau',
    shape: 'void_mage',
    lore: 'Reads tomes that erase the reader first.',
    lore_pt: 'Lê tomos que apagam primeiro o leitor.',
    accent: '#7C3AED',
    bg: '#1E1B2E',
    vassals: [
      {
        id: 'apprentice_shade',
        name: 'Apprentice Shade',
        name_pt: 'Aprendiz Sombra',
        type: 'mago_mau',
        shape: 'apprentice',
        lore: 'Still learning which hexes explode.',
        lore_pt: 'Ainda a aprender quais hexes explodem.',
      },
      {
        id: 'tome_familiar',
        name: 'Tome Familiar',
        name_pt: 'Familiar do Tomo',
        type: 'mago_mau',
        shape: 'familiar',
        lore: 'A book with teeth and opinions.',
        lore_pt: 'Um livro com dentes e opiniões.',
      },
      {
        id: 'hex_puppet',
        name: 'Hex Puppet',
        name_pt: 'Marioneta do Hex',
        type: 'mago_mau',
        shape: 'puppet',
        lore: 'Strings of violet curse-thread.',
        lore_pt: 'Fios de maldição violeta.',
      },
    ],
  },
  {
    id: 'forest_spirit',
    name: 'Thorn Spirit',
    name_pt: 'Espírito do Espinho',
    type: 'espirito',
    shape: 'forest',
    lore: 'Roots remember every axe wound.',
    lore_pt: 'As raízes lembram cada ferida de machado.',
    accent: '#15803D',
    bg: '#14532D',
    vassals: [
      {
        id: 'moss_sprite',
        name: 'Moss Sprite',
        name_pt: 'Duende do Musgo',
        type: 'espirito',
        shape: 'moss',
        lore: 'Soft steps, sharp thorns.',
        lore_pt: 'Passos suaves, espinhos afiados.',
      },
      {
        id: 'vine_wisp',
        name: 'Vine Wisp',
        name_pt: 'Fogo-Fátuo de Vinha',
        type: 'espirito',
        shape: 'vine',
        lore: 'Coils around ankles mid-step.',
        lore_pt: 'Enrola-se nos tornozelos a meio do passo.',
      },
      {
        id: 'root_guardian',
        name: 'Root Guardian',
        name_pt: 'Guardião das Raízes',
        type: 'espirito',
        shape: 'root',
        lore: 'Ancient bark, patient rage.',
        lore_pt: 'Casca antiga, raiva paciente.',
      },
    ],
  },
  {
    id: 'yokai',
    name: 'Masked Yokai',
    name_pt: 'Yokai Mascarado',
    type: 'yokai',
    shape: 'yokai',
    lore: 'Smiles with a mask that never blinks.',
    lore_pt: 'Sorri com uma máscara que nunca pisca.',
    accent: '#EA580C',
    bg: '#431407',
    vassals: [
      {
        id: 'fox_trickster',
        name: 'Fox Trickster',
        name_pt: 'Raposa Trapaceira',
        type: 'yokai',
        shape: 'fox',
        lore: 'Three tails of mischief.',
        lore_pt: 'Três caudas de travessura.',
      },
      {
        id: 'lantern_spirit',
        name: 'Lantern Spirit',
        name_pt: 'Espírito da Lanterna',
        type: 'yokai',
        shape: 'lantern',
        lore: 'Leads wanderers off the path.',
        lore_pt: 'Leva andarilhos para fora do caminho.',
      },
      {
        id: 'paper_oni',
        name: 'Paper Oni',
        name_pt: 'Oni de Papel',
        type: 'yokai',
        shape: 'oni',
        lore: 'Folded rage, sharp corners.',
        lore_pt: 'Raiva dobrada, cantos afiados.',
      },
    ],
  },
  {
    id: 'cockatrice',
    name: 'Cockatrice',
    name_pt: 'Cocatriz',
    type: 'monstro',
    shape: 'cockatrice',
    lore: 'A glance that turns courage to stone.',
    lore_pt: 'Um olhar que transforma coragem em pedra.',
    accent: '#CA8A04',
    bg: '#292524',
    vassals: [
      {
        id: 'basilisk_chick',
        name: 'Basilisk Chick',
        name_pt: 'Pintainho Basilisco',
        type: 'monstro',
        shape: 'chick',
        lore: 'Tiny stare, growing danger.',
        lore_pt: 'Olhar minúsculo, perigo crescente.',
      },
      {
        id: 'stone_gaze_imp',
        name: 'Stone-Gaze Imp',
        name_pt: 'Diabrete do Olhar de Pedra',
        type: 'monstro',
        shape: 'gaze',
        lore: 'Practices petrify on beetles.',
        lore_pt: 'Treina petrificar em escaravelhos.',
      },
      {
        id: 'plume_harpy',
        name: 'Plume Harpy',
        name_pt: 'Harpia de Penas',
        type: 'monstro',
        shape: 'harpy',
        lore: 'Screeches the hunt into motion.',
        lore_pt: 'Guinchando, põe a caça em movimento.',
      },
    ],
  },
]

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/** Optional selectable extras when painted files exist on disk. */
function avatarYaml(bossId, stems, indent = 2) {
  const pad = ' '.repeat(indent)
  const paths = stems
    .map((stem) => {
      const local = join(root, bossId, `${stem}.png`)
      if (!existsSync(local)) return null
      return `docs/assets/bestiary/${bossId}/${stem}.png`
    })
    .filter(Boolean)
  if (paths.length === 0) return ''
  return `${pad}avatars:\n${paths.map((p) => `${pad}- "${p}"`).join('\n')}\n`
}

function rosterMd(bosses) {
  const blocks = bosses
    .map((b) => {
      const bossImg = artPath(b.id, 'boss')
      const bossAvatars = avatarYaml(b.id, ['boss-avatar', 'boss-dark'], 2)
      const vassalYaml = b.vassals
        .map((v, i) => {
          const n = String(i + 1).padStart(2, '0')
          const img = artPath(b.id, `vassal-${n}`)
          const vAvatars = avatarYaml(b.id, [`vassal-${n}-alt`, `vassal-${n}-dark`], 4)
          return `  - id: ${v.id}
    role: vassal
    name: "${esc(v.name)}"
    name_pt: "${esc(v.name_pt)}"
    type: ${v.type}
    image: "${img}"
${vAvatars}    lore: "${esc(v.lore)}"
    lore_pt: "${esc(v.lore_pt)}"`
        })
        .join('\n')
      return `- id: ${b.id}
  role: boss
  name: "${esc(b.name)}"
  name_pt: "${esc(b.name_pt)}"
  type: ${b.type}
  image: "${bossImg}"
${bossAvatars}  lore: "${esc(b.lore)}"
  lore_pt: "${esc(b.lore_pt)}"
  vassals:
${vassalYaml}`
    })
    .join('\n')

  return `---
roster:
${blocks}
---

# Bestiary Roster

12 BOSS + 3 vassals. Painted \`.png\` preferred when present; SVG fallback.
Active display: \`image\` → main png. Selectable extras: \`avatars\` (2 per slot: alt/avatar + dark) — never delete.
Admin → Bestiário / Campanha → Escolher avatar.
Regen SVG silhouettes: \`node docs/assets/bestiary/generate-bestiary.mjs\`
`
}

function main() {
  const configPath = join(root, '../../config/bestiary-roster.md')
  mkdirSync(dirname(configPath), { recursive: true })

  for (const b of BOSSES) {
    const dir = join(root, b.id)
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'boss.svg'),
      creatureSvg({
        label: b.id,
        accent: b.accent,
        bg: b.bg,
        shape: b.shape,
        crown: true,
      }),
    )
    b.vassals.forEach((v, i) => {
      writeFileSync(
        join(dir, `vassal-${String(i + 1).padStart(2, '0')}.svg`),
        creatureSvg({
          label: v.id,
          accent: b.accent,
          bg: b.bg,
          shape: v.shape,
          crown: false,
        }),
      )
    })
    console.log(`bestiary ${b.id} (+${b.vassals.length} vassals)`)
  }

  writeFileSync(configPath, rosterMd(BOSSES))
  console.log(`wrote ${configPath}`)
  console.log(`total creatures: ${BOSSES.length * 4}`)
}

main()
