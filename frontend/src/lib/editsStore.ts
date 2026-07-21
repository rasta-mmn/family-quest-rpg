import type { Campaign, HeroObjectives, MonthSetup, Profile, WeeklyLog } from './types'

const PLAYER_KEY = 'family-quest-player-edits'
const ADMIN_KEY = 'family-quest-admin-edits'
const REMOVED_KEY = 'family-quest-removed-heroes'
/** Bump to wipe Admin local drafts after docs/config campaign art changes. */
const ADMIN_DATA_VER_KEY = 'family-quest-admin-data-ver'
const ADMIN_DATA_VER = 'bestiary-habits-1'

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

/** Snap Admin calendar draft if it jumped ahead of the civil month (stale August preview, etc.). */
function migrateAdminCalendar(edits: AdminEdits): AdminEdits {
  const now = new Date()
  const civil = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const draftMonth = edits.current_month
  if (!draftMonth || draftMonth <= civil) return edits

  const monthNumber = Number(civil.slice(5, 7)) || 1
  const campaign = String(monthNumber).padStart(2, '0')
  // ISO week of "today" — good enough for current_week reset
  const utc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  const dayNum = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  const current_week = `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`

  return {
    ...edits,
    current_month: civil,
    current_week,
    month: {
      ...(edits.month || {}),
      month: civil,
      month_number: monthNumber,
      campaign,
    },
  }
}

function wipeStaleAdminDrafts(): void {
  try {
    if (localStorage.getItem(ADMIN_DATA_VER_KEY) === ADMIN_DATA_VER) return
    localStorage.removeItem(ADMIN_KEY)
    localStorage.setItem(ADMIN_DATA_VER_KEY, ADMIN_DATA_VER)
  } catch {
    /* ignore */
  }
}

export function loadAdminEdits(): AdminEdits {
  wipeStaleAdminDrafts()
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as AdminEdits
    if (!parsed || typeof parsed !== 'object') return {}
    const migrated = migrateAdminCalendar(parsed)
    if (migrated.current_month !== parsed.current_month) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(migrated))
    }
    return migrated
  } catch {
    return {}
  }
}

export function saveAdminEdits(edits: AdminEdits): void {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(edits))
}

/** Drop Admin drafts so game reads docs/config campaigns + calendar again. */
export function clearAdminEdits(): void {
  localStorage.removeItem(ADMIN_KEY)
  localStorage.setItem(ADMIN_DATA_VER_KEY, ADMIN_DATA_VER)
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
