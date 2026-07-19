import { downloadMarkdown } from './githubApi'
import type { LocalHeroRecord } from './localHeroes'
import type { PlayerConfig } from './types'

export function profileMd(h: LocalHeroRecord): string {
  const p = h.profile
  const stats = p.stats || {}
  return `---
id: ${h.id}
character_name: "${p.character_name}"
class: ${p.class}
level: ${p.level}
xp_total: ${p.xp_total}
xp_this_month: ${p.xp_this_month}
months_completed: ${p.months_completed}
photo: "${p.photo || ''}"
avatar: "${p.avatar || ''}"
avatar_description: "${p.avatar_description || ''}"
stats:
  forca: ${stats.forca ?? 10}
  agilidade: ${stats.agilidade ?? 10}
  sabedoria: ${stats.sabedoria ?? 10}
  carisma: ${stats.carisma ?? 10}
level_history:
  - { level: 1, xp: 0, date: "${h.createdAt.slice(0, 10)}" }
---

# ${p.character_name} — Profile

**Class:** ${p.class} | **Level:** ${p.level}
`
}

export function objectivesMd(h: LocalHeroRecord, month: string): string {
  const objs = h.objectives.daily_objectives
    .map(
      (o) =>
        `  - { id: ${o.id}, name: "${o.name}", points: ${o.points}, real_meaning_redacted: true }`,
    )
    .join('\n')
  return `---
month: "${month}"
theme: ${h.objectives.theme}
daily_objectives:
${objs}
extras_allowed: true
extras_points: 2.5
---

# ${h.profile.character_name} Objectives — ${month}
`
}

export function skillsMd(h: LocalHeroRecord): string {
  return `---
skills: []
---

# ${h.profile.character_name} Skills
`
}

export function appearanceMd(h: LocalHeroRecord): string {
  return `---
class: ${h.appearance.class}
slots:
  weapon: null
  armor: null
  head: null
  cape: null
  accessory: null
unlocked_appearances: []
---

# ${h.profile.character_name} Appearance
`
}

export function rewardsMd(h: LocalHeroRecord): string {
  return `---
weekly_rewards: []
monthly_rewards: []
---

# ${h.profile.character_name} Rewards
`
}

export function weeklyMd(h: LocalHeroRecord): string {
  const w = h.weekly
  if (!w) return ''
  const dayLines = Object.entries(w.days)
    .map(
      ([d, day]) =>
        `  ${d}: { obj1: ${day.obj1}, obj2: ${day.obj2}, obj3: ${day.obj3}, extras: ${day.extras} }`,
    )
    .join('\n')
  return `---
week: "${w.week}"
player: ${w.player}
month: "${w.month}"
boss: { id: ${w.boss.id}, name: "${w.boss.name}", completed: ${w.boss.completed}, points: ${w.boss.points} }
days:
${dayLines}
total_points: ${w.total_points ?? 0}
reward_status: ${w.reward_status || 'pending'}
---

# ${h.profile.character_name} — ${w.week}
`
}

export function playerConfigYaml(p: PlayerConfig): string {
  return `  - id: ${p.id}
    character_name: "${p.character_name}"
    class: ${p.class}
    real_name_redacted: "${p.real_name_redacted || 'Jogador'}"
    photo: "${p.photo || ''}"
    avatar: "${p.avatar || ''}"`
}

/** Download hero .md pack + game-config players snippet for manual commit. */
export function downloadHeroPack(h: LocalHeroRecord, month: string): void {
  const week = h.weekly?.week
  downloadMarkdown(`${h.id}__profile.md`, profileMd(h))
  downloadMarkdown(`${h.id}__objectives.md`, objectivesMd(h, month))
  downloadMarkdown(`${h.id}__skills.md`, skillsMd(h))
  downloadMarkdown(`${h.id}__appearance.md`, appearanceMd(h))
  downloadMarkdown(`${h.id}__rewards.md`, rewardsMd(h))
  if (week && h.weekly) {
    downloadMarkdown(`${h.id}__weekly-${week}.md`, weeklyMd(h))
  }
  downloadMarkdown(
    `${h.id}__ADD-TO-game-config.txt`,
    `# Add under players: in docs/config/game-config.md\n\n${playerConfigYaml(h.player)}\n\n# Then create folder docs/${h.id}/ and rename files:\n#   ${h.id}__profile.md → docs/${h.id}/profile.md\n#   ${h.id}__objectives.md → docs/${h.id}/objectives.md\n#   … etc.\n`,
  )
}
