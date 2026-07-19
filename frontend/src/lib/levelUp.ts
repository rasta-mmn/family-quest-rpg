import type { ClassDef, Profile } from './types'

export type UpgradePick = {
  month: number
  type: string
  name: string
  name_pt?: string
  description?: string
  description_pt?: string
}

export function pickUpgrade(classDef: ClassDef | undefined, monthNumber: number): UpgradePick | null {
  if (!classDef?.upgrades?.length) return null
  return classDef.upgrades.find((u) => u.month === monthNumber) || null
}

export type LevelUpResult = {
  profileMd: string
  skillsMd: string
  appearanceMd: string
  rewardsMd: string
  upgrade: UpgradePick
  newLevel: number
}

type AppearanceSlots = {
  weapon: { name: string; month?: number } | null
  armor: { name: string; month?: number } | null
  appearance: { name: string; month?: number } | null
  head?: { name: string; month?: number } | null
  cape?: { name: string; month?: number } | null
  accessory?: { name: string; month?: number } | null
}

/** Build markdown files after applying class upgrade for journey month N. */
export function buildLevelUpPack(opts: {
  profile: Profile
  skills: { id: string; name: string; name_pt?: string; description?: string }[]
  slots: AppearanceSlots
  rewards: Record<string, unknown>[]
  classDef: ClassDef
  monthNumber: number
  monthId: string
  rewardLabel: string
  rewardLabelPt: string
  weeksHit: number
  eurosPerWeek: number
}): LevelUpResult | null {
  const upgrade = pickUpgrade(opts.classDef, opts.monthNumber)
  if (!upgrade) return null

  const newLevel = (opts.profile.level || 1) + 1
  const monthsCompleted = Math.max(opts.profile.months_completed || 0, opts.monthNumber)
  const date = new Date().toISOString().slice(0, 10)
  const stats = opts.profile.stats || {}
  const photo = opts.profile.photo || ''
  const avatar = opts.profile.avatar || ''

  const profileMd = `---
id: ${opts.profile.id}
character_name: "${opts.profile.character_name}"
character_name_pt: "${opts.profile.character_name_pt || opts.profile.character_name}"
class: ${opts.profile.class}
level: ${newLevel}
xp_total: ${(opts.profile.xp_total || 0) + (opts.profile.xp_this_month || 0)}
xp_this_month: 0
months_completed: ${monthsCompleted}
photo: "${photo}"
avatar: "${avatar}"
avatar_description: "${opts.profile.avatar_description || ''}"
avatar_description_pt: "${opts.profile.avatar_description_pt || ''}"
stats:
  forca: ${stats.forca ?? 10}
  agilidade: ${stats.agilidade ?? 10}
  sabedoria: ${stats.sabedoria ?? 10}
  carisma: ${stats.carisma ?? 10}
level_history:
  - { level: ${newLevel}, xp: ${opts.profile.xp_this_month || 0}, date: "${date}", month: "${opts.monthId}" }
---

# ${opts.profile.character_name} — Profile

Level-up month ${opts.monthNumber}: ${upgrade.name} / ${upgrade.name_pt || upgrade.name}
`

  const skills = [...opts.skills]
  if (upgrade.type === 'skill') {
    skills.push({
      id: `skill_m${opts.monthNumber}`,
      name: upgrade.name,
      name_pt: upgrade.name_pt,
      description: upgrade.description,
    })
  }
  const skillsYaml = skills
    .map(
      (s) =>
        `  - { id: ${s.id}, name: "${s.name}"${s.name_pt ? `, name_pt: "${s.name_pt}"` : ''}${s.description ? `, description: "${s.description}"` : ''} }`,
    )
    .join('\n')
  const skillsMd = `---
skills:
${skillsYaml || '  []'}
---

# ${opts.profile.character_name} Skills
`

  const slots = { ...opts.slots }
  const gear = { name: upgrade.name, month: opts.monthNumber }
  if (upgrade.type === 'weapon') slots.weapon = gear
  else if (upgrade.type === 'armor') slots.armor = gear
  else if (upgrade.type === 'appearance') slots.appearance = gear

  const appearanceMd = `---
class: ${opts.profile.class}
slots:
  weapon: ${slots.weapon ? `{ name: "${slots.weapon.name}", month: ${slots.weapon.month} }` : 'null'}
  armor: ${slots.armor ? `{ name: "${slots.armor.name}", month: ${slots.armor.month} }` : 'null'}
  appearance: ${slots.appearance ? `{ name: "${slots.appearance.name}", month: ${slots.appearance.month} }` : 'null'}
unlocked_appearances: []
---

# ${opts.profile.character_name} Appearance
`

  const euros = opts.weeksHit * opts.eurosPerWeek
  const rewards = [
    ...opts.rewards,
    {
      month: opts.monthId,
      type: 'monthly',
      name: opts.rewardLabel,
      name_pt: opts.rewardLabelPt,
      upgrade: upgrade.name,
      upgrade_pt: upgrade.name_pt,
      weeks_hit: opts.weeksHit,
      euros,
      date,
      real_meaning_redacted: true,
    },
  ]
  const rewardsYaml = rewards
    .map((r) => {
      const entries = Object.entries(r)
        .map(([k, v]) => {
          if (typeof v === 'string') return `${k}: "${v}"`
          if (typeof v === 'boolean' || typeof v === 'number') return `${k}: ${v}`
          return `${k}: ${JSON.stringify(v)}`
        })
        .join(', ')
      return `  - { ${entries} }`
    })
    .join('\n')

  const rewardsMd = `---
rewards:
${rewardsYaml || '  []'}
---

# ${opts.profile.character_name} Rewards
`

  return { profileMd, skillsMd, appearanceMd, rewardsMd, upgrade, newLevel }
}
