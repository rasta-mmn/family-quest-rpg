import { downloadMarkdown } from './githubApi'
import { downloadDataUrl, isDataUrl } from './photoUpload'
import type { GameConfig, MonthSetup, Objective, Profile, WeeklyLog } from './types'

export function buildObjectivesMd(opts: {
  heroId: string
  characterName: string
  month: string
  theme: string
  daily: Objective[]
}): string {
  const objs = opts.daily
    .slice(0, 3)
    .map((o, i) => {
      const id = o.id || `obj${i + 1}`
      const pt = o.name_pt ? `, name_pt: "${o.name_pt}"` : ''
      return `  - { id: ${id}, name: "${o.name}"${pt}, points: ${o.points || 30}, real_meaning_redacted: true }`
    })
    .join('\n')
  return `---
month: "${opts.month}"
theme: ${opts.theme}
daily_objectives:
${objs}
extras_allowed: true
extras_points: 2.5
---

# ${opts.characterName} Objectives — ${opts.month}
`
}

export function buildWeeklyMd(w: WeeklyLog, characterName: string): string {
  const dayLines = Object.entries(w.days)
    .map(
      ([d, day]) =>
        `  ${d}: { obj1: ${day.obj1}, obj2: ${day.obj2}, obj3: ${day.obj3}, extras: ${day.extras} }`,
    )
    .join('\n')
  const namePt = w.boss.name_pt ? `, name_pt: "${w.boss.name_pt}"` : ''
  return `---
week: "${w.week}"
player: ${w.player}
month: "${w.month}"
boss: { id: ${w.boss.id}, name: "${w.boss.name}"${namePt}, completed: ${w.boss.completed}, points: ${w.boss.points} }
days:
${dayLines}
total_points: ${w.total_points ?? 0}
reward_status: ${w.reward_status || 'pending'}
---

# ${characterName} — ${w.week}
`
}

export function buildProfilePatchMd(p: Profile): string {
  const photo = isDataUrl(p.photo)
    ? `docs/assets/photos/${p.id.toLowerCase()}.jpg`
    : p.photo || ''
  return `---
id: ${p.id}
character_name: "${p.character_name}"
character_name_pt: "${p.character_name_pt || p.character_name}"
class: ${p.class}
level: ${p.level}
xp_total: ${p.xp_total}
xp_this_month: ${p.xp_this_month}
months_completed: ${p.months_completed}
photo: "${photo}"
avatar: "${p.avatar || ''}"
avatar_description: "${p.avatar_description || ''}"
avatar_description_pt: "${p.avatar_description_pt || ''}"
---

# ${p.character_name} — Profile

Commit this over docs/${p.id}/profile.md (merge stats/history from existing file if needed).
`
}

export function buildGameConfigPatch(opts: {
  current_month: string
  current_week: string
}): string {
  return `# Patch docs/config/game-config.md frontmatter:

current_month: "${opts.current_month}"
current_week: "${opts.current_week}"
`
}

export function buildMonthMdFromSetup(month: MonthSetup): string {
  const bossYaml = (month.bosses || [])
    .map(
      (b) =>
        `  - { week: "${b.week}", id: ${b.id}, name: "${b.name}", name_pt: "${b.name_pt || b.name}", type: ${b.type || 'monstro'}, collective: true, points: ${b.points || 30}, mission_redacted: "${b.mission_redacted || ''}", mission_redacted_pt: "${b.mission_redacted_pt || b.mission_redacted || ''}" }`,
    )
    .join('\n')
  const objYaml = Object.entries(month.objectives || {})
    .map(([hid, o]) => {
      const daily = (o.daily || []).map((d) => `"${d}"`).join(', ')
      const dailyPt = (o.daily_pt || []).map((d) => `"${d}"`).join(', ')
      return `  ${hid}:\n    theme: ${o.theme}\n    daily: [${daily}]\n    daily_pt: [${dailyPt}]`
    })
    .join('\n')
  return `---
month: "${month.month}"
month_number: ${month.month_number || 1}
weeks: [${(month.weeks || []).map((w) => `"${w}"`).join(', ')}]
theme: ${month.theme}
bosses:
${bossYaml}
objectives:
${objYaml}
---

# Month Setup / Setup do Mês — ${month.month}

**ADM:** calendar + BOSS. **Player:** mission labels live in each HeroiN/objectives.md.
`
}

export function downloadPlayerExports(opts: {
  heroId: string
  characterName: string
  month: string
  theme: string
  daily: Objective[]
  weekly: WeeklyLog | null
  profile: Profile
}): void {
  downloadMarkdown(
    `${opts.heroId}__objectives.md`,
    buildObjectivesMd({
      heroId: opts.heroId,
      characterName: opts.characterName,
      month: opts.month,
      theme: opts.theme,
      daily: opts.daily,
    }),
  )
  if (opts.weekly) {
    downloadMarkdown(
      `${opts.heroId}__weekly-${opts.weekly.week}.md`,
      buildWeeklyMd(opts.weekly, opts.characterName),
    )
  }
  downloadMarkdown(`${opts.heroId}__profile.md`, buildProfilePatchMd(opts.profile))
  if (isDataUrl(opts.profile.photo)) {
    downloadDataUrl(`${opts.heroId.toLowerCase()}.jpg`, opts.profile.photo!)
  }
}

export function downloadAdminExports(opts: {
  config: Pick<GameConfig, 'current_month' | 'current_week'>
  month: MonthSetup
}): void {
  downloadMarkdown(`${opts.month.month}.md`, buildMonthMdFromSetup(opts.month))
  downloadMarkdown(
    `game-config__calendar.txt`,
    buildGameConfigPatch({
      current_month: opts.config.current_month,
      current_week: opts.config.current_week,
    }),
  )
}
