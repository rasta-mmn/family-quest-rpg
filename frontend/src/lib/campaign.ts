import { applyGeneratedLore } from './campaignLore'
import { bindLandmarkIds, defaultLandmarks } from './family'
import type { BossEntry, Campaign, CampaignVassal, MonthSetup } from './types'

export function campaignIdFromMonthNumber(n: number): string {
  const clamped = Math.min(12, Math.max(1, Math.round(n) || 1))
  return String(clamped).padStart(2, '0')
}

/** Painted city maps — Admin can swap art when season/lore don't match. */
export const CITY_MAP_CATALOG: {
  id: string
  slug: string
  file: string
  city: string
  season: 'inverno' | 'primavera' | 'verao' | 'outono'
}[] = [
  { id: '01', slug: 'termopolis', file: 'docs/assets/maps/01-termopolis.png', city: 'Termópolis', season: 'inverno' },
  { id: '02', slug: 'luzilia', file: 'docs/assets/maps/02-luzilia.png', city: 'Luzília', season: 'inverno' },
  { id: '03', slug: 'verdeia', file: 'docs/assets/maps/03-verdeia.png', city: 'Verdéia', season: 'primavera' },
  { id: '04', slug: 'coparia', file: 'docs/assets/maps/04-coparia.png', city: 'Copária', season: 'primavera' },
  { id: '05', slug: 'rioporto', file: 'docs/assets/maps/05-rioporto.png', city: 'Rioporto', season: 'primavera' },
  { id: '06', slug: 'solaria', file: 'docs/assets/maps/06-solaria.png', city: 'Solária', season: 'verao' },
  { id: '07', slug: 'cinzar', file: 'docs/assets/maps/07-cinzar.png', city: 'Cinzar', season: 'verao' },
  { id: '08', slug: 'forjalia', file: 'docs/assets/maps/08-forjalia.png', city: 'Forjália', season: 'verao' },
  { id: '09', slug: 'douralia', file: 'docs/assets/maps/09-douralia.png', city: 'Dourália', season: 'outono' },
  { id: '10', slug: 'sombralia', file: 'docs/assets/maps/10-sombralia.png', city: 'Sombrália', season: 'outono' },
  { id: '11', slug: 'pantanil', file: 'docs/assets/maps/11-pantanil.png', city: 'Pantanil', season: 'outono' },
  { id: '12', slug: 'nevalia', file: 'docs/assets/maps/12-nevalia.png', city: 'Nevália', season: 'inverno' },
]

export function mapFileForCampaignId(id: string): string {
  return (
    CITY_MAP_CATALOG.find((c) => c.id === id)?.file ||
    'docs/assets/maps/01-termopolis.png'
  )
}

export function cityMetaForCampaignId(id: string) {
  return CITY_MAP_CATALOG.find((c) => c.id === (id || '01').padStart(2, '0'))
}

/** Spain meteo seasons → kid display names (month 1–12). */
export function seasonMetaForMonth(monthNumber: number): {
  season: 'inverno' | 'primavera' | 'verao' | 'outono'
  season_name: string
  season_name_pt: string
} {
  const n = Math.min(12, Math.max(1, Math.round(monthNumber) || 1))
  if (n === 12 || n <= 2) {
    return { season: 'inverno', season_name: 'Ice Night', season_name_pt: 'Noite de Gelo' }
  }
  if (n <= 5) {
    return { season: 'primavera', season_name: 'Living Green', season_name_pt: 'Verde Vivo' }
  }
  if (n <= 8) {
    return { season: 'verao', season_name: 'Fire Sun', season_name_pt: 'Sol de Fogo' }
  }
  return { season: 'outono', season_name: 'Golden Leaves', season_name_pt: 'Folhas de Ouro' }
}

/** True when map path is the painted art for this campaign id (e.g. …/08-forjalia.png). */
export function mapMatchesCampaignId(mapPath: string | undefined, campaignId: string): boolean {
  if (!mapPath) return false
  const m = /(?:^|\/)maps\/(\d{2})-/.exec(mapPath)
  if (!m) return false
  return m[1] === (campaignId || '01').padStart(2, '0')
}

/** Pick map art: Admin draft > file > catalog default for this city. */
export function resolveCampaignMap(
  campaignId: string,
  fileMap?: string,
  draftMap?: string,
): string {
  const id = (campaignId || '01').padStart(2, '0')
  return draftMap || fileMap || mapFileForCampaignId(id)
}

/** `2026-08` → 8. Used so Admin stale month_number cannot point August at Termópolis. */
export function monthNumberFromMonthId(monthId: string): number {
  const m = /^(\d{4})-(\d{2})$/.exec((monthId || '').trim())
  if (!m) return 1
  return Math.min(12, Math.max(1, Number(m[2]) || 1))
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

/** Unique stop ids — must match defaultLandmarks() (not start, not boss_keep). */
const DEFAULT_VASSAL_LANDMARKS = ['stop_1', 'stop_2', 'stop_3', 'stop_4']

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
    landmark_id: DEFAULT_VASSAL_LANDMARKS[weekIndex - 1] || 'mid_ruins',
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

/** Prefer bestiary PNG/SVG over legacy campaign placeholder SVGs when merging drafts. */
export function preferCreatureArt(draftArt: string | undefined, fileArt: string | undefined): string {
  const d = draftArt || ''
  const f = fileArt || ''
  const draftIsLegacyCamp = /\/campaigns\/\d{2}\//.test(d)
  const fileIsBestiary = /\/bestiary\//.test(f)
  if (fileIsBestiary && (!d || draftIsLegacyCamp)) return f
  return d || f
}

/** Merge Admin draft onto repo campaign without losing bestiary art from file. */
export function mergeCampaignDraft(file: Campaign, draft: Campaign, id: string): Campaign {
  const boss = {
    ...file.boss,
    ...draft.boss,
    avatar: preferCreatureArt(
      coalesceArt(draft.boss),
      coalesceArt(file.boss),
    ),
  }
  const fileV = [...(file.vassals || [])].sort((a, b) => a.week_index - b.week_index)
  const draftV = [...(draft.vassals || [])].sort((a, b) => a.week_index - b.week_index)
  const vassals = (draftV.length ? draftV : fileV).map((v, i) => {
    const fromFile = fileV[i] || fileV.find((x) => x.week_index === v.week_index)
    return {
      ...fromFile,
      ...v,
      avatar: preferCreatureArt(coalesceArt(v), coalesceArt(fromFile)),
    }
  })
  return normalizeCampaign(
    {
      ...file,
      ...draft,
      id,
      boss,
      vassals,
      map: resolveCampaignMap(id, file.map, draft.map),
      map_city_start: draft.map_city_start || file.map_city_start,
      map_landmarks: draft.map_landmarks?.length ? draft.map_landmarks : file.map_landmarks,
    },
    id,
  )
}

/**
 * Family is on city map A; Admin configured month roster on campaign B.
 * Keep city art + landmarks; put month BOSS/vassals (bestiary avatars) on the path.
 */
export function mapCampaignWithMonthRoster(
  cityCampaign: Campaign,
  monthCampaign: Campaign,
  weeks: string[],
): Campaign {
  const city = bindLandmarkIds(cityCampaign)
  const slots = vassalSlotsForWeeks(weeks)
  const monthVassals = resizeVassals(
    monthCampaign.vassals,
    slots,
    campaignDominantTheme(monthCampaign),
  )
  const startId = city.map_city_start || city.map_landmarks?.[0]?.id || 'city_square'
  const bossKeep =
    city.boss.landmark_id ||
    city.map_landmarks?.find((l) => l.id === 'boss_keep')?.id ||
    city.map_landmarks?.[city.map_landmarks.length - 1]?.id ||
    'boss_keep'
  const stops = (city.map_landmarks || []).filter(
    (l) => l.id !== startId && l.id !== bossKeep,
  )
  const vassals = monthVassals.map((v, i) => ({
    ...v,
    landmark_id: stops[i]?.id || stops[stops.length - 1]?.id || v.landmark_id,
  }))
  return bindLandmarkIds({
    ...city,
    title: monthCampaign.title || city.title,
    title_pt: monthCampaign.title_pt || city.title_pt,
    lore: monthCampaign.lore || city.lore,
    lore_pt: monthCampaign.lore_pt || city.lore_pt,
    month_objective: monthCampaign.month_objective || city.month_objective,
    month_objective_pt: monthCampaign.month_objective_pt || city.month_objective_pt,
    theme: campaignDominantTheme(monthCampaign),
    boss: {
      ...monthCampaign.boss,
      landmark_id: bossKeep,
    },
    vassals,
  })
}

/** Normalize legacy campaign YAML (theme only at root) → per-creature themes. */
export function normalizeCampaign(raw: Campaign, id?: string): Campaign {
  const campId = (id || raw.id || '01').padStart(2, '0')
  const monthNum = Number(campId) || raw.month_number || 1
  const base = emptyCampaign(campId)
  const season = seasonMetaForMonth(monthNum)
  const cityMeta = cityMetaForCampaignId(campId)
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
  const landmarks =
    raw.map_landmarks?.length ? raw.map_landmarks : base.map_landmarks
  const merged: Campaign = {
    ...base,
    ...raw,
    id: campId,
    month_number: monthNum,
    theme: boss.theme,
    lore_custom: loreCustom,
    // Month number owns season (Admin cannot desync Sol de Fogo onto a winter city).
    season: season.season,
    season_name: season.season_name,
    season_name_pt: season.season_name_pt,
    city: raw.city || cityMeta?.city || base.city,
    city_pt: raw.city_pt || raw.city || cityMeta?.city || base.city_pt,
    map: resolveCampaignMap(campId, raw.map),
    map_city_start: raw.map_city_start || base.map_city_start,
    map_landmarks: landmarks,
    boss: {
      ...boss,
      landmark_id: rawBoss.landmark_id || boss.landmark_id || 'boss_keep',
    },
    vassals,
  }
  const withRoute = bindLandmarkIds(merged)
  return loreCustom ? withRoute : applyGeneratedLore(withRoute)
}

/** Only explicit true / "true" locks custom lore (avoids Boolean("false") === true). */
export function isLoreCustomFlag(v: unknown): boolean {
  return v === true || v === 'true' || v === 1 || v === '1'
}

export function emptyCampaign(id = '01'): Campaign {
  const n = Number(id) || 1
  const campId = campaignIdFromMonthNumber(n)
  const season = seasonMetaForMonth(n)
  const cityMeta = cityMetaForCampaignId(campId)
  return {
    id: campId,
    month_number: n,
    theme: 'fisico',
    world: 'Solstice',
    world_pt: 'Solstícia',
    season: season.season,
    season_name: season.season_name,
    season_name_pt: season.season_name_pt,
    city: cityMeta?.city || '',
    city_pt: cityMeta?.city || '',
    title: 'New Campaign',
    title_pt: 'Nova Campanha',
    lore: '',
    lore_pt: '',
    lore_custom: false,
    map: mapFileForCampaignId(campId),
    map_city_start: 'city_square',
    map_landmarks: defaultLandmarks(),
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
      landmark_id: 'boss_keep',
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
    landmark_id: ${v.landmark_id || 'mid_ruins'}
    points: ${v.points ?? 30}`,
    )
    .join('\n')

  const landmarksYaml = (c.map_landmarks || defaultLandmarks())
    .map(
      (l) =>
        `  - { id: ${l.id}, name: "${yamlEscape(l.name)}", name_pt: "${yamlEscape(l.name_pt || l.name)}", x: ${l.x}, y: ${l.y} }`,
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
map_city_start: ${c.map_city_start || 'city_square'}
map_landmarks:
${landmarksYaml}
month_objective: "${yamlEscape(c.month_objective || '')}"
month_objective_pt: "${yamlEscape(c.month_objective_pt || c.month_objective || '')}"
boss:
  id: ${c.boss.id}
  name: "${yamlEscape(c.boss.name)}"
  name_pt: "${yamlEscape(c.boss.name_pt || c.boss.name)}"
  theme: ${creatureTheme(c.boss, theme)}
  avatar: "${yamlEscape(creatureArt(c.boss))}"
  photo: "${yamlEscape(c.boss.photo || '')}"
  landmark_id: ${c.boss.landmark_id || 'boss_keep'}
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
