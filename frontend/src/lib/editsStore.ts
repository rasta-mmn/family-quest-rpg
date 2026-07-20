import type { Campaign, HeroObjectives, MonthSetup, Profile, WeeklyLog } from './types'

const PLAYER_KEY = 'family-quest-player-edits'
const ADMIN_KEY = 'family-quest-admin-edits'
const REMOVED_KEY = 'family-quest-removed-heroes'

/** Player-owned fields (edited on character sheet). */
export type PlayerHeroEdit = {
  objectives?: HeroObjectives
  weekly?: WeeklyLog
  profile?: Partial<
    Pick<
      Profile,
      | 'character_name'
      | 'character_name_pt'
      | 'photo'
      | 'sex'
      | 'sheet_colors'
      | 'avatar_description'
      | 'avatar_description_pt'
    >
  >
}

export type PlayerEdits = Record<string, PlayerHeroEdit>

/** Admin-owned fields (edited in ADM panel). */
export type AdminEdits = {
  current_month?: string
  current_week?: string
  month?: {
    month?: string
    month_number?: number
    campaign?: string
    weeks?: string[]
    theme?: string
    bosses?: MonthSetup['bosses']
  }
  /** Draft campaigns keyed by id ("01"…"12") */
  campaigns?: Record<string, Campaign>
}

export function loadPlayerEdits(): PlayerEdits {
  try {
    const raw = localStorage.getItem(PLAYER_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as PlayerEdits
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function savePlayerEdits(edits: PlayerEdits): void {
  localStorage.setItem(PLAYER_KEY, JSON.stringify(edits))
}

export function getPlayerHeroEdit(heroId: string): PlayerHeroEdit {
  return loadPlayerEdits()[heroId] || {}
}

export function patchPlayerHeroEdit(heroId: string, patch: PlayerHeroEdit): PlayerHeroEdit {
  const all = loadPlayerEdits()
  const prev = all[heroId] || {}
  const next: PlayerHeroEdit = {
    ...prev,
    ...patch,
    objectives: patch.objectives ?? prev.objectives,
    weekly: patch.weekly ?? prev.weekly,
    profile: patch.profile ? { ...prev.profile, ...patch.profile } : prev.profile,
  }
  all[heroId] = next
  savePlayerEdits(all)
  return next
}

export function loadAdminEdits(): AdminEdits {
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as AdminEdits
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveAdminEdits(edits: AdminEdits): void {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(edits))
}

export function patchAdminEdits(patch: AdminEdits): AdminEdits {
  const prev = loadAdminEdits()
  const next: AdminEdits = {
    ...prev,
    ...patch,
    month: patch.month ? { ...prev.month, ...patch.month } : prev.month,
    campaigns: patch.campaigns
      ? { ...prev.campaigns, ...patch.campaigns }
      : prev.campaigns,
  }
  saveAdminEdits(next)
  return next
}

export function clearPlayerHeroEdit(heroId: string): void {
  const all = loadPlayerEdits()
  if (!(heroId in all)) return
  delete all[heroId]
  savePlayerEdits(all)
}

export function loadRemovedHeroIds(): string[] {
  try {
    const raw = localStorage.getItem(REMOVED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function markHeroRemoved(heroId: string): string[] {
  const next = [...new Set([...loadRemovedHeroIds(), heroId])]
  localStorage.setItem(REMOVED_KEY, JSON.stringify(next))
  return next
}
