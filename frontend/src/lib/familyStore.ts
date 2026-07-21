import type { FamilyConfig, FamilyWeeklySession } from './types'
import { emptyFamily, slugFamilyId } from './family'

const FAMILIES_KEY = 'family-quest-local-families'
const SESSIONS_KEY = 'family-quest-family-sessions'
const ACTIVE_KEY = 'family-quest-active-family'

export function loadLocalFamilies(): FamilyConfig[] {
  try {
    const raw = localStorage.getItem(FAMILIES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as FamilyConfig[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLocalFamilies(list: FamilyConfig[]): void {
  localStorage.setItem(FAMILIES_KEY, JSON.stringify(list))
}

export function upsertLocalFamily(family: FamilyConfig): FamilyConfig {
  const all = loadLocalFamilies()
  const i = all.findIndex((f) => f.id === family.id)
  if (i >= 0) all[i] = family
  else all.push(family)
  saveLocalFamilies(all)
  return family
}

export function patchLocalFamily(id: string, patch: Partial<FamilyConfig>): FamilyConfig | null {
  const all = loadLocalFamilies()
  const i = all.findIndex((f) => f.id === id)
  if (i < 0) {
    const created = emptyFamily(id, patch)
    all.push(created)
    saveLocalFamilies(all)
    return created
  }
  all[i] = { ...all[i], ...patch }
  saveLocalFamilies(all)
  return all[i]
}

export function createLocalFamily(input: {
  name: string
  name_pt?: string
  crest: string
  existingIds: string[]
}): FamilyConfig {
  let id = slugFamilyId(input.name)
  if (input.existingIds.includes(id) || loadLocalFamilies().some((f) => f.id === id)) {
    id = `${id}_${Date.now().toString(36).slice(-4)}`
  }
  const family = emptyFamily(id, {
    name: input.name,
    name_pt: input.name_pt || input.name,
    crest: input.crest,
  })
  upsertLocalFamily(family)
  setActiveFamilyId(id)
  return family
}

export type SessionMap = Record<string, FamilyWeeklySession>

function sessionKey(familyId: string, week: string): string {
  return `${familyId}::${week}`
}

export function loadFamilySessions(): SessionMap {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as SessionMap
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveFamilySessions(map: SessionMap): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(map))
}

export function getFamilySession(familyId: string, week: string): FamilyWeeklySession | null {
  return loadFamilySessions()[sessionKey(familyId, week)] || null
}

export function setFamilyBossDone(
  familyId: string,
  week: string,
  bossDone: boolean,
): FamilyWeeklySession {
  const map = loadFamilySessions()
  const session: FamilyWeeklySession = { family_id: familyId, week, boss_done: bossDone }
  map[sessionKey(familyId, week)] = session
  saveFamilySessions(map)
  return session
}

export function getActiveFamilyId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

export function setActiveFamilyId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id)
}

/** Merge repo families with local overrides (local wins on same id). */
export function mergeFamilies(repo: FamilyConfig[] | undefined, local: FamilyConfig[]): FamilyConfig[] {
  const byId = new Map<string, FamilyConfig>()
  for (const f of repo || []) byId.set(f.id, f)
  for (const f of local) {
    const prev = byId.get(f.id)
    byId.set(f.id, prev ? { ...prev, ...f, hero_ids: f.hero_ids?.length ? f.hero_ids : prev.hero_ids } : f)
  }
  return [...byId.values()]
}
