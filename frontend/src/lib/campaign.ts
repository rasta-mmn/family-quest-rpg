import { applyGeneratedLore } from './campaignLore'
import type { BossEntry, Campaign, CampaignVassal, MonthSetup } from './types'

export function campaignIdFromMonthNumber(n: number): string {
  const clamped = Math.min(12, Math.max(1, Math.round(n) || 1))
  return String(clamped).padStart(2, '0')
}

/** Vassal slots = calendar weeks − 1 (last week is Month BOSS). */
export function vassalSlotsForWeeks(weeks: string[]): number {
  return Math.max(0, (weeks?.length || 0) - 1)
}

/** Display art: avatar (bestiary) preferred; legacy `image` fallback. Photo is separate. */
export function creatureArt(c: {
  avatar?: string
  image?: string
  photo?: string
}): string {
  return c.avatar || c.image || ''
}

/** Theme on creature, else campaign/month fallback. */
export function creatureTheme(
  c: { theme?: string },
  fallback = 'fisico',
): string {
  return c.theme || fallback
}

/** Month dominant theme = Month BOSS theme (legacy campaign.theme fallback). */
export function campaignDominantTheme(campaign: Campaign): string {
  return creatureTheme(campaign.boss, campaign.theme || 'fisico')
}

export function emptyVassal(weekIndex: number, theme = 'fisico'): CampaignVassal {
  return {
    id: `vassal_${weekIndex}`,
    week_index: weekIndex,
    name: `Vassal ${weekIndex}`,
    name_pt: `Súdito ${weekIndex}`,
    theme,
    avatar: '',
    photo: '',
    objective: `Week ${weekIndex} challenge`,
    objective_pt: `Desafio semana ${weekIndex}`,
    lore: '',
    lore_pt: '',
    points: 30,
  }
}

/** Pad/trim vassals to slot count; reindex week_index 1..n. */
export function resizeVassals(
  vassals: CampaignVassal[] | undefined,
  slots: number,
  fallbackTheme = 'fisico',
): CampaignVassal[] {
  const sorted = [...(vassals || [])].sort((a, b) => a.week_index - b.week_index)
  const out: CampaignVassal[] = []
  for (let i = 0; i < slots; i++) {
    const prev = sorted[i]
    out.push(
      prev
        ? { ...prev, week_index: i + 1, theme: creatureTheme(prev, fallbackTheme) }
        : emptyVassal(i + 1, fallbackTheme),
    )
  }
  return out
}

/** Prefer explicit avatar; fall back to legacy `image` (ignore empty defaults). */
function coalesceArt(
  raw: { avatar?: string; image?: string } | undefined,
  fallback = '',
): string {
  return raw?.avatar || raw?.image || fallback
}

/** Normalize legacy campaign YAML (theme only at root) → per-creature themes. */
export function normalizeCampaign(raw: Campaign, id?: string): Campaign {
  const campId = id || raw.id || '01'
  const base = emptyCampaign(campId)
  const fallback = raw.theme || base.theme
  const rawBoss = raw.boss || {}
  const boss = {
    ...base.boss,
    ...rawBoss,
    // Legacy YAML used `image`; don't let emptyCampaign avatar mask it.
    avatar: coalesceArt(rawBoss, base.boss.avatar),
    theme: creatureTheme(rawBoss, fallback),
  }
  const vassals = (raw.vassals || base.vassals).map((v, i) => {
    const empty = emptyVassal(v.week_index || i + 1, fallback)
    return {
      ...empty,
      ...v,
      avatar: coalesceArt(v, empty.avatar),
      theme: creatureTheme(v, fallback),
    }
  })
  const loreCustom = isLoreCustomFlag(raw.lore_custom)
  const merged: Campaign = {
    ...base,
    ...raw,
    id: campId,
    theme: boss.theme,
    lore_custom: loreCustom,
    boss,
    vassals,
  }
  return loreCustom ? merged : applyGeneratedLore(merged)
}

/** Only explicit true / "true" locks custom lore (avoids Boolean("false") === true). */
export function isLoreCustomFlag(v: unknown): boolean {
  return v === true || v === 'true' || v === 1 || v === '1'
}

export function emptyCampaign(id = '01'): Campaign {
  const n = Number(id) || 1
  return {
    id: campaignIdFromMonthNumber(n),
    month_number: n,
    theme: 'fisico',
    world: 'Solstice',
    world_pt: 'Solstícia',
    season: 'inverno',
    season_name: 'Ice Night',
    season_name_pt: 'Noite de Gelo',
    city: '',
    city_pt: '',
    title: 'New Campaign',
    title_pt: 'Nova Campanha',
    lore: '',
    lore_pt: '',
    lore_custom: false,
    map: 'docs/assets/backgrounds/fisico.jpg',
    month_objective: '',
    month_objective_pt: '',
    boss: {
      id: `boss_${id}`,
      name: 'Month BOSS',
      name_pt: 'BOSS do Mês',
      theme: 'fisico',
      avatar: `docs/assets/bestiary/dragon/boss.svg`,
      photo: '',
      lore: '',
      lore_pt: '',
      points: 50,
    },
    // Default 3 vassals (4-week month). 5-week months use a 4th slot.
    vassals: [1, 2, 3].map((i) => emptyVassal(i)),
  }
}

/**
 * Map campaign → week bosses for Weekly/Player UI.
 * weeks[0..n-2] → vassals (pad/trim to n-1); weeks[n-1] → Month BOSS.
 */
export function vassalsToWeekBosses(campaign: Campaign, weeks: string[]): BossEntry[] {
  if (!weeks.length) return []
  const fallback = campaignDominantTheme(campaign)
  const slots = vassalSlotsForWeeks(weeks)
  const vassals = resizeVassals(campaign.vassals, slots, fallback)
  const entries: BossEntry[] = vassals.map((v, i) => ({
    id: v.id,
    name: v.name,
    name_pt: v.name_pt || v.name,
    type: 'vassal',
    theme: creatureTheme(v, fallback),
    description: v.lore,
    description_pt: v.lore_pt || v.lore,
    image: creatureArt(v),
    week: weeks[i],
    collective: true,
    points: v.points ?? 30,
    mission_redacted: v.objective || '',
    mission_redacted_pt: v.objective_pt || v.objective || '',
  }))
  const b = campaign.boss
  entries.push({
    id: b.id,
    name: b.name,
    name_pt: b.name_pt || b.name,
    type: 'boss',
    theme: creatureTheme(b, fallback),
    description: b.lore,
    description_pt: b.lore_pt || b.lore,
    image: creatureArt(b),
    week: weeks[weeks.length - 1],
    collective: true,
    points: b.points ?? 50,
    mission_redacted: campaign.month_objective || '',
    mission_redacted_pt: campaign.month_objective_pt || campaign.month_objective || '',
  })
  return entries
}

export function applyCampaignToMonth(month: MonthSetup, campaign: Campaign): MonthSetup {
  const weeks = month.weeks || []
  const theme = campaignDominantTheme(campaign)
  return {
    ...month,
    campaign: campaign.id,
    month_number: campaign.month_number || month.month_number,
    theme,
    bosses: vassalsToWeekBosses(campaign, weeks),
  }
}

function yamlEscape(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
}

export function buildCampaignMd(c: Campaign): string {
  const theme = campaignDominantTheme(c)
  const vassalYaml = (c.vassals || [])
    .map(
      (v) => `  - id: ${v.id}
    week_index: ${v.week_index}
    name: "${yamlEscape(v.name)}"
    name_pt: "${yamlEscape(v.name_pt || v.name)}"
    theme: ${creatureTheme(v, theme)}
    avatar: "${yamlEscape(creatureArt(v))}"
    photo: "${yamlEscape(v.photo || '')}"
    objective: "${yamlEscape(v.objective || '')}"
    objective_pt: "${yamlEscape(v.objective_pt || v.objective || '')}"
    lore: "${yamlEscape(v.lore || '')}"
    lore_pt: "${yamlEscape(v.lore_pt || v.lore || '')}"
    points: ${v.points ?? 30}`,
    )
    .join('\n')

  return `---
id: "${c.id}"
month_number: ${c.month_number}
theme: ${theme}
world: "${yamlEscape(c.world || 'Solstice')}"
world_pt: "${yamlEscape(c.world_pt || c.world || 'Solstícia')}"
season: ${c.season || 'inverno'}
season_name: "${yamlEscape(c.season_name || '')}"
season_name_pt: "${yamlEscape(c.season_name_pt || c.season_name || '')}"
city: "${yamlEscape(c.city || '')}"
city_pt: "${yamlEscape(c.city_pt || c.city || '')}"
title: "${yamlEscape(c.title)}"
title_pt: "${yamlEscape(c.title_pt || c.title)}"
lore: "${yamlEscape(c.lore || '')}"
lore_pt: "${yamlEscape(c.lore_pt || c.lore || '')}"
lore_custom: ${c.lore_custom ? 'true' : 'false'}
map: "${yamlEscape(c.map || '')}"
month_objective: "${yamlEscape(c.month_objective || '')}"
month_objective_pt: "${yamlEscape(c.month_objective_pt || c.month_objective || '')}"
boss:
  id: ${c.boss.id}
  name: "${yamlEscape(c.boss.name)}"
  name_pt: "${yamlEscape(c.boss.name_pt || c.boss.name)}"
  theme: ${creatureTheme(c.boss, theme)}
  avatar: "${yamlEscape(creatureArt(c.boss))}"
  photo: "${yamlEscape(c.boss.photo || '')}"
  lore: "${yamlEscape(c.boss.lore || '')}"
  lore_pt: "${yamlEscape(c.boss.lore_pt || c.boss.lore || '')}"
  points: ${c.boss.points ?? 50}
vassals:
${vassalYaml}
---

# Campaign ${c.id} — ${c.title}

avatar = bestiary SVG (characters). photo = optional upload. Month BOSS = last week.
Each BOSS/vassal has its own dominant theme.
`
}

export function campaignBossAsEntry(campaign: Campaign, week?: string): BossEntry {
  const b = campaign.boss
  return {
    id: b.id,
    name: b.name,
    name_pt: b.name_pt || b.name,
    type: 'boss',
    theme: campaignDominantTheme(campaign),
    description: b.lore,
    description_pt: b.lore_pt || b.lore,
    image: creatureArt(b),
    week,
    collective: true,
    points: b.points ?? 50,
    mission_redacted: campaign.month_objective || '',
    mission_redacted_pt: campaign.month_objective_pt || campaign.month_objective || '',
  }
}
