import { downloadMarkdown } from './githubApi'
import { dayLogToYaml, WEEKDAYS } from './dayLog'
import { downloadDataUrl, isDataUrl } from './photoUpload'
import type { GameConfig, MonthSetup, Profile, SheetColors, WeeklyLog } from './types'

function yamlEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export function buildObjectivesMd(opts: {
  heroId: string
  characterName: string
  month: string
  theme: string
  monthObjective?: string
}): string {
  return `---
month: "${opts.month}"
theme: ${opts.theme}
month_objective: "${yamlEscape(opts.monthObjective || '')}"
extras_allowed: true
extras_points: 2.5
---

# ${opts.characterName} Objectives — ${opts.month}
`
}

export function buildWeeklyMd(w: WeeklyLog, characterName: string): string {
  const dayLines = WEEKDAYS.map((d) => {
    const day = w.days[d] || { objectives: [], extras: [] }
    return `  ${d}: ${dayLogToYaml(day)}`
  }).join('\n')
  const namePt = w.boss.name_pt ? `, name_pt: "${yamlEscape(w.boss.name_pt)}"` : ''
  return `---
week: "${w.week}"
player: ${w.player}
month: "${w.month}"
boss: { id: ${w.boss.id}, name: "${yamlEscape(w.boss.name)}"${namePt}, completed: ${w.boss.completed}, points: ${w.boss.points} }
days:
${dayLines}
total_points: ${w.total_points ?? 0}
reward_status: ${w.reward_status || 'pending'}
---

# ${characterName} — ${w.week}
`
}

function sheetColorsYaml(c?: SheetColors): string {
  if (!c) return ''
  return `sheet_colors:
  text: "${c.text}"
  block: "${c.block}"
  block_opacity: ${c.block_opacity}
`
}

export function buildProfilePatchMd(p: Profile): string {
  const photo = isDataUrl(p.photo)
    ? `docs/assets/photos/${p.id.toLowerCase()}.jpg`
    : p.photo || ''
  const sex = p.sex === 'female' ? 'female' : p.sex === 'male' ? 'male' : ''
  return `---
id: ${p.id}
character_name: "${yamlEscape(p.character_name)}"
character_name_pt: "${yamlEscape(p.character_name_pt || p.character_name)}"
class: ${p.class}
level: ${p.level}
xp_total: ${p.xp_total}
xp_this_month: ${p.xp_this_month}
months_completed: ${p.months_completed}
${sex ? `sex: ${sex}\n` : ''}photo: "${photo}"
avatar: "${p.avatar || ''}"
avatar_description: "${yamlEscape(p.avatar_description || '')}"
avatar_description_pt: "${yamlEscape(p.avatar_description_pt || '')}"
${sheetColorsYaml(p.sheet_colors)}---

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
      return `  ${hid}:\n    theme: ${o.theme}\n    month_objective: "${yamlEscape(o.month_objective || '')}"`
    })
    .join('\n')
  const campaignLine = month.campaign ? `campaign: "${month.campaign}"\n` : ''
  return `---
month: "${month.month}"
month_number: ${month.month_number || 1}
${campaignLine}weeks: [${(month.weeks || []).map((w) => `"${w}"`).join(', ')}]
theme: ${month.theme}
bosses:
${bossYaml}
objectives:
${objYaml}
---

# Month Setup / Setup do Mês — ${month.month}

**ADM:** calendar + campaign link. Weekly vassals/BOSS live in campaigns/*.md.
`
}

export function downloadPlayerExports(opts: {
  heroId: string
  characterName: string
  month: string
  theme: string
  monthObjective?: string
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
      monthObjective: opts.monthObjective,
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
  campaignMd?: string
  campaignId?: string
}): void {
  downloadMarkdown(`${opts.month.month}.md`, buildMonthMdFromSetup(opts.month))
  downloadMarkdown(
    `game-config__calendar.txt`,
    buildGameConfigPatch({
      current_month: opts.config.current_month,
      current_week: opts.config.current_week,
    }),
  )
  if (opts.campaignMd && opts.campaignId) {
    downloadMarkdown(`campaign-${opts.campaignId}.md`, opts.campaignMd)
  }
}
