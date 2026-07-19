import { useCallback, useEffect, useState } from 'react'
import { parseMarkdown } from '../lib/mdParser'
import { fetchDoc } from '../lib/githubApi'
import { weekFromLog } from '../lib/gameLogic'
import { loadLocalHeroes, type AppearanceSlots, type LocalHeroRecord } from '../lib/localHeroes'
import { loadAdminEdits, loadPlayerEdits } from '../lib/editsStore'
import type {
  BestiaryTheme,
  ClassDef,
  GameConfig,
  MonthSetup,
  Profile,
  WeeklyLog,
  Objective,
} from '../lib/types'

export type HeroBundle = {
  id: string
  profile: Profile
  objectives: { daily_objectives: Objective[]; theme?: string }
  skills: { id: string; name: string; description?: string }[]
  appearance: { class?: string; slots: AppearanceSlots } | null
  weekly: WeeklyLog | null
  weekPoints: number
  local?: boolean
}

export type GameData = {
  config: GameConfig
  month: MonthSetup
  themes: Record<string, BestiaryTheme>
  classes: Record<string, ClassDef>
  heroes: HeroBundle[]
}

const EMPTY_SLOTS: AppearanceSlots = {
  weapon: null,
  armor: null,
  head: null,
  cape: null,
  accessory: null,
}

function localToBundle(h: LocalHeroRecord, points: GameConfig['points']): HeroBundle {
  const weekly = h.weekly
  return {
    id: h.id,
    profile: h.profile,
    objectives: h.objectives,
    skills: h.skills,
    appearance: h.appearance,
    weekly,
    weekPoints: weekly ? weekFromLog(weekly, points) : 0,
    local: true,
  }
}

export function useGameData() {
  const [data, setData] = useState<GameData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const configText = await fetchDoc('config/game-config.md')
        const { data: config } = parseMarkdown<GameConfig>(configText)
        const adminEditsEarly = loadAdminEdits()
        if (adminEditsEarly.current_month) config.current_month = adminEditsEarly.current_month
        if (adminEditsEarly.current_week) config.current_week = adminEditsEarly.current_week
        const monthId = config.current_month
        const weekId = config.current_week

        const [monthText, bestiaryText, classesText] = await Promise.all([
          fetchDoc(`config/months/${monthId}.md`),
          fetchDoc('config/bestiary.md'),
          fetchDoc('config/classes.md'),
        ])

        const { data: month } = parseMarkdown<MonthSetup>(monthText)
        if (adminEditsEarly.month) Object.assign(month, adminEditsEarly.month)
        const { data: bestiary } = parseMarkdown<{ themes: Record<string, BestiaryTheme> }>(
          bestiaryText,
        )
        const { data: classesFile } = parseMarkdown<{ classes: Record<string, ClassDef> }>(
          classesText,
        )

        const repoHeroes: HeroBundle[] = await Promise.all(
          (config.players || []).map(async (p) => {
            const [profileText, objText, skillsText, appearanceText, weeklyText] =
              await Promise.all([
                fetchDoc(`${p.id}/profile.md`),
                fetchDoc(`${p.id}/objectives.md`),
                fetchDoc(`${p.id}/skills.md`),
                fetchDoc(`${p.id}/appearance.md`).catch(() => null),
                fetchDoc(`${p.id}/weekly/${weekId}.md`).catch(() => null),
              ])
            const { data: profile } = parseMarkdown<Profile>(profileText)
            const { data: objectives } = parseMarkdown<{
              daily_objectives: Objective[]
              theme?: string
            }>(objText)
            const { data: skillsData } = parseMarkdown<{ skills: HeroBundle['skills'] }>(
              skillsText,
            )
            let appearance: HeroBundle['appearance'] = {
              class: profile.class,
              slots: { ...EMPTY_SLOTS },
            }
            if (appearanceText) {
              const { data: app } = parseMarkdown<{
                class?: string
                slots?: AppearanceSlots
              }>(appearanceText)
              appearance = {
                class: app.class || profile.class,
                slots: { ...EMPTY_SLOTS, ...(app.slots || {}) },
              }
            }
            const weekly = weeklyText ? parseMarkdown<WeeklyLog>(weeklyText).data : null
            const weekPoints = weekly ? weekFromLog(weekly, config.points) : 0
            return {
              id: p.id,
              profile: {
                ...profile,
                photo: profile.photo || p.photo,
                avatar: profile.avatar || p.avatar,
              },
              objectives: {
                daily_objectives: objectives.daily_objectives || [],
                theme: objectives.theme,
              },
              skills: skillsData.skills || [],
              appearance,
              weekly,
              weekPoints,
            }
          }),
        )

        const repoIds = new Set(repoHeroes.map((h) => h.id))
        const localHeroes = loadLocalHeroes()
          .filter((h) => !repoIds.has(h.id))
          .map((h) => localToBundle(h, config.points))

        let heroes = [...repoHeroes, ...localHeroes]
        const playerEdits = loadPlayerEdits()
        heroes = heroes.map((h) => {
          const edit = playerEdits[h.id]
          if (!edit) return h
          const weekly = edit.weekly ?? h.weekly
          return {
            ...h,
            profile: edit.profile ? { ...h.profile, ...edit.profile } : h.profile,
            objectives: edit.objectives
              ? {
                  daily_objectives: edit.objectives.daily_objectives,
                  theme: edit.objectives.theme ?? h.objectives.theme,
                }
              : h.objectives,
            weekly,
            weekPoints: weekly ? weekFromLog(weekly, config.points) : 0,
          }
        })

        // Month rollup mirrors player-owned mission labels (for PDF / ADM export).
        month.objectives = month.objectives || {}
        for (const h of heroes) {
          const daily = h.objectives.daily_objectives || []
          month.objectives[h.id] = {
            theme: h.objectives.theme || month.theme,
            daily: daily.map((o) => o.name),
            daily_pt: daily.map((o) => o.name_pt || o.name),
          }
        }

        if (!cancelled) {
          setData({
            config,
            month,
            themes: bestiary.themes || {},
            classes: classesFile.classes || {},
            heroes,
          })
          setError(null)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [tick])

  return { data, error, loading, reload }
}
