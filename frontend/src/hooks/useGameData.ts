import { useCallback, useEffect, useRef, useState } from 'react'
import { parseMarkdown } from '../lib/mdParser'
import { fetchDoc } from '../lib/githubApi'
import { weekFromLog } from '../lib/gameLogic'
import {
  ensureTestLevelHeroes,
  loadLocalHeroes,
  type AppearanceSlots,
  type LocalHeroRecord,
} from '../lib/localHeroes'
import {
  applyCampaignToMonth,
  campaignIdFromMonthNumber,
  emptyCampaign,
  normalizeCampaign,
} from '../lib/campaign'
import { loadAdminEdits, loadPlayerEdits, loadRemovedHeroIds } from '../lib/editsStore'
import { normalizeWeeklyLog } from '../lib/dayLog'
import { resolveThemeId } from '../lib/themeAlias'
import type {
  BestiaryTheme,
  Campaign,
  ClassDef,
  GameConfig,
  HeroObjectives,
  MonthSetup,
  Profile,
  WeeklyLog,
} from '../lib/types'

export type HeroBundle = {
  id: string
  profile: Profile
  objectives: HeroObjectives
  skills: { id: string; name: string; description?: string }[]
  appearance: { class?: string; slots: AppearanceSlots } | null
  weekly: WeeklyLog | null
  weekPoints: number
  local?: boolean
}

export type GameData = {
  config: GameConfig
  month: MonthSetup
  campaign: Campaign | null
  themes: Record<string, BestiaryTheme>
  classes: Record<string, ClassDef>
  heroes: HeroBundle[]
}

const EMPTY_SLOTS: AppearanceSlots = {
  weapon: null,
  armor: null,
  appearance: null,
  head: null,
  cape: null,
  accessory: null,
}

function localToBundle(h: LocalHeroRecord, points: GameConfig['points']): HeroBundle {
  const weekly = h.weekly ? normalizeWeeklyLog(h.weekly) : null
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
  const hydrated = useRef(false)

  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Soft reload after first paint — keep sheet mounted (selected day stays).
        if (!hydrated.current) setLoading(true)
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
        month.theme = resolveThemeId(month.theme)

        const campaignKey =
          month.campaign ||
          campaignIdFromMonthNumber(month.month_number || 1)
        month.campaign = campaignKey
        let campaign: Campaign | null = null
        try {
          const campText = await fetchDoc(`config/campaigns/${campaignKey}.md`)
          campaign = normalizeCampaign(parseMarkdown<Campaign>(campText).data, campaignKey)
        } catch {
          campaign = emptyCampaign(campaignKey)
        }
        const draftCamp = adminEditsEarly.campaigns?.[campaignKey]
        if (draftCamp && campaign) {
          campaign = normalizeCampaign(
            {
              ...campaign,
              ...draftCamp,
              boss: { ...campaign.boss, ...draftCamp.boss },
              vassals: draftCamp.vassals?.length ? draftCamp.vassals : campaign.vassals,
            },
            campaignKey,
          )
        }
        if (campaign) {
          Object.assign(month, applyCampaignToMonth(month, campaign))
          month.theme = resolveThemeId(month.theme)
        }

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
            const { data: objectives } = parseMarkdown<HeroObjectives>(objText)
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
            const weeklyRaw = weeklyText ? parseMarkdown<WeeklyLog>(weeklyText).data : null
            const weekly = weeklyRaw ? normalizeWeeklyLog(weeklyRaw) : null
            const weekPoints = weekly ? weekFromLog(weekly, config.points) : 0
            return {
              id: p.id,
              profile: {
                ...profile,
                photo: profile.photo || p.photo,
                avatar: profile.avatar || p.avatar,
              },
              objectives: {
                theme: resolveThemeId(objectives.theme),
                month_objective: objectives.month_objective || '',
                daily_objectives: objectives.daily_objectives,
              },
              skills: skillsData.skills || [],
              appearance,
              weekly,
              weekPoints,
            }
          }),
        )

        const bossMeta = month.bosses?.[0]
        ensureTestLevelHeroes({
          month: monthId,
          week: weekId,
          boss: {
            id: bossMeta?.id || 'boss',
            name: bossMeta?.name || 'BOSS',
            name_pt: bossMeta?.name_pt,
            points: bossMeta?.points || 30,
          },
        })

        const repoIds = new Set(repoHeroes.map((h) => h.id))
        const localHeroes = loadLocalHeroes()
          .filter((h) => !repoIds.has(h.id))
          .map((h) => localToBundle(h, config.points))

        const removed = new Set(loadRemovedHeroIds())
        let heroes = [...repoHeroes, ...localHeroes].filter((h) => !removed.has(h.id))
        const playerEdits = loadPlayerEdits()
        heroes = heroes.map((h) => {
          const edit = playerEdits[h.id]
          if (!edit) return h
          const weekly = edit.weekly ? normalizeWeeklyLog(edit.weekly) : h.weekly
          return {
            ...h,
            profile: edit.profile ? { ...h.profile, ...edit.profile } : h.profile,
            objectives: edit.objectives
              ? {
                  theme: resolveThemeId(edit.objectives.theme ?? h.objectives.theme),
                  month_objective:
                    edit.objectives.month_objective ?? h.objectives.month_objective ?? '',
                }
              : h.objectives,
            weekly,
            weekPoints: weekly ? weekFromLog(weekly, config.points) : 0,
          }
        })

        month.objectives = month.objectives || {}
        for (const h of heroes) {
          month.objectives[h.id] = {
            theme: h.objectives.theme || month.theme,
            month_objective: h.objectives.month_objective || '',
          }
        }

        if (!cancelled) {
          setData({
            config,
            month,
            campaign,
            themes: bestiary.themes || {},
            classes: classesFile.classes || {},
            heroes,
          })
          setError(null)
          hydrated.current = true
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
