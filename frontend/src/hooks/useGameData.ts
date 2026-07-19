import { useEffect, useState } from 'react'
import { parseMarkdown } from '../lib/mdParser'
import { fetchDoc } from '../lib/githubApi'
import { weekFromLog } from '../lib/gameLogic'
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
  weekly: WeeklyLog | null
  weekPoints: number
}

export type GameData = {
  config: GameConfig
  month: MonthSetup
  themes: Record<string, BestiaryTheme>
  classes: Record<string, ClassDef>
  heroes: HeroBundle[]
}

export function useGameData() {
  const [data, setData] = useState<GameData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const configText = await fetchDoc('config/game-config.md')
        const { data: config } = parseMarkdown<GameConfig>(configText)
        const monthId = config.current_month
        const weekId = config.current_week

        const [monthText, bestiaryText, classesText] = await Promise.all([
          fetchDoc(`config/months/${monthId}.md`),
          fetchDoc('config/bestiary.md'),
          fetchDoc('config/classes.md'),
        ])

        const { data: month } = parseMarkdown<MonthSetup>(monthText)
        const { data: bestiary } = parseMarkdown<{ themes: Record<string, BestiaryTheme> }>(bestiaryText)
        const { data: classesFile } = parseMarkdown<{ classes: Record<string, ClassDef> }>(classesText)

        const heroes: HeroBundle[] = await Promise.all(
          (config.players || []).map(async (p) => {
            const [profileText, objText, skillsText, weeklyText] = await Promise.all([
              fetchDoc(`${p.id}/profile.md`),
              fetchDoc(`${p.id}/objectives.md`),
              fetchDoc(`${p.id}/skills.md`),
              fetchDoc(`${p.id}/weekly/${weekId}.md`).catch(() => null),
            ])
            const { data: profile } = parseMarkdown<Profile>(profileText)
            const { data: objectives } = parseMarkdown<{
              daily_objectives: Objective[]
              theme?: string
            }>(objText)
            const { data: skillsData } = parseMarkdown<{ skills: HeroBundle['skills'] }>(skillsText)
            const weekly = weeklyText
              ? parseMarkdown<WeeklyLog>(weeklyText).data
              : null
            const weekPoints = weekly ? weekFromLog(weekly, config.points) : 0
            return {
              id: p.id,
              profile: { ...profile, photo: profile.photo || p.photo, avatar: profile.avatar || p.avatar },
              objectives: {
                daily_objectives: objectives.daily_objectives || [],
                theme: objectives.theme,
              },
              skills: skillsData.skills || [],
              weekly,
              weekPoints,
            }
          }),
        )

        if (!cancelled) {
          setData({
            config,
            month,
            themes: bestiary.themes || {},
            classes: classesFile.classes || {},
            heroes,
          })
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
  }, [])

  return { data, error, loading }
}
