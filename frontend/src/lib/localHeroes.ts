import { emptyDay, normalizeWeeklyLog, WEEKDAYS } from './dayLog'
import { bodyAssetPath } from './sheetStyle'
import type { DayLog, HeroObjectives, PlayerConfig, Profile, WeeklyLog } from './types'

const STORAGE_KEY = 'family-quest-local-heroes'

export type AppearanceSlots = {
  weapon: { name: string; month?: number } | null
  armor: { name: string; month?: number } | null
  appearance?: { name: string; month?: number } | null
  head: { name: string; month?: number } | null
  cape: { name: string; month?: number } | null
  accessory: { name: string; month?: number } | null
}

export type LocalHeroRecord = {
  id: string
  player: PlayerConfig
  profile: Profile
  objectives: HeroObjectives
  skills: { id: string; name: string; description?: string }[]
  appearance: { class: string; slots: AppearanceSlots }
  weekly: WeeklyLog | null
  local: true
  createdAt: string
}

const AVATAR_DESC: Record<string, string> = {
  guerreiro: '80s adventure-cartoon warrior (Caverna do Dragão style), crimson accents',
  bardo: '80s adventure-cartoon bard (Caverna do Dragão style), green tunic and lute',
  mago: '80s adventure-cartoon mage (Caverna do Dragão style), blue robe and staff',
  ladino: '80s adventure-cartoon rogue (Caverna do Dragão style), purple cloak and daggers',
}

export function loadLocalHeroes(): LocalHeroRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LocalHeroRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((h) => ({
      ...h,
      weekly: h.weekly ? normalizeWeeklyLog(h.weekly) : null,
      objectives: {
        theme: h.objectives?.theme || 'fisico',
        month_objective: h.objectives?.month_objective || '',
      },
    }))
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
  boss: { id: string; name: string; name_pt?: string; points?: number }
}): WeeklyLog {
  const days: Record<string, DayLog> = {}
  for (const d of WEEKDAYS) days[d] = emptyDay()
  return {
    week: opts.week,
    player: opts.id,
    month: opts.month,
    boss: {
      id: opts.boss.id,
      name: opts.boss.name,
      name_pt: opts.boss.name_pt,
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
  class: string
  sex: 'male' | 'female'
  real_name_redacted: string
  real_name_redacted_pt?: string
  theme: string
  month_objective?: string
  photoDataUrl?: string
  existingIds: string[]
  month: string
  week: string
  boss: { id: string; name: string; name_pt?: string; points?: number }
}

export function buildLocalHero(input: CreateHeroInput): LocalHeroRecord {
  const id = nextHeroId(input.existingIds)
  const cls = input.class
  const avatar = `docs/assets/avatars/${cls}.png`
  const photoPath = input.photoDataUrl
    ? `docs/assets/photos/${id.toLowerCase()}.jpg`
    : avatar
  const photo = input.photoDataUrl || avatar
  const name = input.character_name.trim()

  const profile: Profile = {
    id,
    character_name: name,
    character_name_pt: name,
    class: cls,
    sex: input.sex,
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
    character_name_pt: name,
    class: cls,
    real_name_redacted: input.real_name_redacted.trim() || 'Player',
    real_name_redacted_pt: (input.real_name_redacted_pt || input.real_name_redacted).trim(),
    photo: photoPath,
    avatar,
  }

  return {
    id,
    player,
    profile,
    objectives: {
      theme: input.theme,
      month_objective: input.month_objective || '',
    },
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

const TEST_CLASSES = ['guerreiro', 'bardo', 'mago', 'ladino'] as const

export function isTestLevelHeroId(id: string): boolean {
  return (
    /^TestLv-(male|female)-(guerreiro|bardo|mago|ladino)-\d{2}$/.test(id) ||
    /^TestLv-(guerreiro|bardo|mago|ladino)-\d{2}$/.test(id)
  )
}

export function testLevelHeroId(
  cls: string,
  lv: number,
  sex: 'male' | 'female' = 'male',
): string {
  return `TestLv-${sex}-${cls}-${String(lv).padStart(2, '0')}`
}

/** Temporary sheets: 2 sexes × 4 classes × Lv 0…12 (104) — safe to delete. */
export function seedTestLevelHeroes(opts: {
  month: string
  week: string
  boss: { id: string; name: string; name_pt?: string; points?: number }
}): LocalHeroRecord[] {
  const kept = loadLocalHeroes().filter((h) => !isTestLevelHeroId(h.id))
  // Also drop legacy TestLv-{cls}-{lv} ids
  const keptClean = kept.filter(
    (h) => !/^TestLv-(guerreiro|bardo|mago|ladino)-\d{2}$/.test(h.id),
  )
  const seeded: LocalHeroRecord[] = []
  for (const sex of ['male', 'female'] as const) {
    for (const cls of TEST_CLASSES) {
      for (let lv = 0; lv <= 12; lv++) {
        const id = testLevelHeroId(cls, lv, sex)
        const pad = String(lv).padStart(2, '0')
        const body = bodyAssetPath(cls, lv, sex)
        const name = `[TEST] ${sex === 'female' ? '♀' : '♂'} ${cls} Lv${pad}`
        const base = buildLocalHero({
          character_name: name,
          class: cls,
          sex,
          real_name_redacted: `Test ${cls}`,
          theme: 'fisico',
          month_objective: `QA avatar ${cls} ${sex} lv ${lv}`,
          existingIds: [...keptClean, ...seeded].map((h) => h.id),
          month: opts.month,
          week: opts.week,
          boss: opts.boss,
        })
        seeded.push({
          ...base,
          id,
          player: {
            ...base.player,
            id,
            character_name: name,
            character_name_pt: name,
            photo: body,
            avatar: body,
          },
          profile: {
            ...base.profile,
            id,
            character_name: name,
            character_name_pt: name,
            sex,
            level: Math.max(1, lv),
            months_completed: lv,
            xp_this_month: Math.min(400, lv * 30),
            photo: body,
            avatar: body,
            avatar_description: `${cls} ${sex} cartoon lv ${lv}`,
          },
          weekly: base.weekly
            ? { ...base.weekly, player: id }
            : emptyWeekly({
                id,
                week: opts.week,
                month: opts.month,
                boss: opts.boss,
              }),
        })
      }
    }
  }
  const next = [...keptClean, ...seeded]
  saveLocalHeroes(next)
  return seeded
}

const TEST_CLEARED_KEY = 'fq-test-sheets-cleared'

export function clearTestLevelHeroes(): number {
  const before = loadLocalHeroes()
  const next = before.filter((h) => !isTestLevelHeroId(h.id))
  saveLocalHeroes(next)
  localStorage.setItem(TEST_CLEARED_KEY, '1')
  return before.length - next.length
}

export function countTestLevelHeroes(): number {
  return loadLocalHeroes().filter((h) => isTestLevelHeroId(h.id)).length
}

/** Auto-seed on game load unless user cleared test sheets. */
export function ensureTestLevelHeroes(opts: {
  month: string
  week: string
  boss: { id: string; name: string; name_pt?: string; points?: number }
}): number {
  if (localStorage.getItem(TEST_CLEARED_KEY) === '1') return countTestLevelHeroes()
  // Full set: 2 sexes × 4 classes × 13 levels = 104
  const n = countTestLevelHeroes()
  if (n >= 104) return n
  return seedTestLevelHeroes(opts).length
}

export function seedTestLevelHeroesForce(opts: {
  month: string
  week: string
  boss: { id: string; name: string; name_pt?: string; points?: number }
}): LocalHeroRecord[] {
  localStorage.removeItem(TEST_CLEARED_KEY)
  return seedTestLevelHeroes(opts)
}
