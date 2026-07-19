import type { DayLog, Objective, PlayerConfig, Profile, WeeklyLog } from './types'

const STORAGE_KEY = 'family-quest-local-heroes'

export type AppearanceSlots = {
  weapon: { name: string; month?: number } | null
  armor: { name: string; month?: number } | null
  head: { name: string; month?: number } | null
  cape: { name: string; month?: number } | null
  accessory: { name: string; month?: number } | null
}

export type LocalHeroRecord = {
  id: string
  player: PlayerConfig
  profile: Profile
  objectives: { daily_objectives: Objective[]; theme: string }
  skills: { id: string; name: string; description?: string }[]
  appearance: { class: string; slots: AppearanceSlots }
  weekly: WeeklyLog | null
  local: true
  createdAt: string
}

const AVATAR_DESC: Record<string, string> = {
  guerreiro: 'Warrior in iron armor with a crimson cloak and sword at the shoulder',
  bardo: 'Bard in a green doublet with a lute on the back and a plumed hat',
  mago: 'Mage in a starry midnight-blue robe with an apprentice staff',
  ladino: 'Rogue in a dark purple hood with twin daggers at the belt',
}

const EMPTY_DAY: DayLog = { obj1: false, obj2: false, obj3: false, extras: 0 }

const WEEKDAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const

export function loadLocalHeroes(): LocalHeroRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LocalHeroRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLocalHeroes(heroes: LocalHeroRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(heroes))
}

export function nextHeroId(existingIds: string[]): string {
  let max = 0
  for (const id of existingIds) {
    const m = /^Heroi(\d+)$/i.exec(id)
    if (m) max = Math.max(max, Number(m[1]))
  }
  return `Heroi${max + 1}`
}

export function emptyWeekly(opts: {
  id: string
  week: string
  month: string
  boss: { id: string; name: string; points?: number }
}): WeeklyLog {
  const days: Record<string, DayLog> = {}
  for (const d of WEEKDAYS) days[d] = { ...EMPTY_DAY }
  return {
    week: opts.week,
    player: opts.id,
    month: opts.month,
    boss: {
      id: opts.boss.id,
      name: opts.boss.name,
      completed: false,
      points: opts.boss.points ?? 30,
    },
    days,
    total_points: 0,
    reward_status: 'pending',
  }
}

export type CreateHeroInput = {
  character_name: string
  character_name_pt?: string
  class: string
  real_name_redacted: string
  real_name_redacted_pt?: string
  theme: string
  missions: [string, string, string]
  missions_pt?: [string, string, string]
  /** data:image/... from UI upload; else class avatar */
  photoDataUrl?: string
  existingIds: string[]
  month: string
  week: string
  boss: { id: string; name: string; points?: number }
}

export function buildLocalHero(input: CreateHeroInput): LocalHeroRecord {
  const id = nextHeroId(input.existingIds)
  const cls = input.class
  const avatar = `docs/assets/avatars/${cls}.svg`
  const photoPath = input.photoDataUrl
    ? `docs/assets/photos/${id.toLowerCase()}.jpg`
    : avatar
  const photo = input.photoDataUrl || avatar
  const name = input.character_name.trim()
  const namePt = (input.character_name_pt || name).trim()
  const daily_objectives: Objective[] = input.missions.map((mission, i) => ({
    id: `obj${i + 1}`,
    name: mission.trim() || `Mission ${['Alpha', 'Beta', 'Gamma'][i]}`,
    name_pt: input.missions_pt?.[i]?.trim() || undefined,
    points: 30,
    real_meaning_redacted: true,
  }))

  const profile: Profile = {
    id,
    character_name: name,
    character_name_pt: namePt,
    class: cls,
    level: 1,
    xp_total: 0,
    xp_this_month: 0,
    months_completed: 0,
    photo,
    avatar,
    avatar_description: AVATAR_DESC[cls] || 'Family hero',
    stats: { forca: 10, agilidade: 10, sabedoria: 10, carisma: 10 },
  }

  const player: PlayerConfig = {
    id,
    character_name: name,
    character_name_pt: namePt,
    class: cls,
    real_name_redacted: input.real_name_redacted.trim() || 'Player',
    real_name_redacted_pt: (input.real_name_redacted_pt || input.real_name_redacted).trim(),
    // YAML path for commit; runtime display uses profile.photo (may be data URL)
    photo: photoPath,
    avatar,
  }

  return {
    id,
    player,
    profile,
    objectives: { daily_objectives, theme: input.theme },
    skills: [],
    appearance: {
      class: cls,
      slots: { weapon: null, armor: null, head: null, cape: null, accessory: null },
    },
    weekly: emptyWeekly({
      id,
      week: input.week,
      month: input.month,
      boss: input.boss,
    }),
    local: true,
    createdAt: new Date().toISOString(),
  }
}

export function addLocalHero(hero: LocalHeroRecord): LocalHeroRecord[] {
  const next = [...loadLocalHeroes().filter((h) => h.id !== hero.id), hero]
  saveLocalHeroes(next)
  return next
}

export function removeLocalHero(id: string): LocalHeroRecord[] {
  const next = loadLocalHeroes().filter((h) => h.id !== id)
  saveLocalHeroes(next)
  return next
}

export function updateLocalWeekly(id: string, weekly: WeeklyLog): LocalHeroRecord[] {
  const next = loadLocalHeroes().map((h) => (h.id === id ? { ...h, weekly } : h))
  saveLocalHeroes(next)
  return next
}
