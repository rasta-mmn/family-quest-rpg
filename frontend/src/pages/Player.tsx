import { useEffect, useState } from 'react'
import { useRoute } from 'wouter'
import { Layout } from '../components/Layout'
import { ClassBadge } from '../components/ClassBadge'
import { XPBar } from '../components/XPBar'
import { XPGrid } from '../components/XPGrid'
import { TaskList } from '../components/TaskList'
import { UpgradeTree } from '../components/UpgradeTree'
import { BossCard } from '../components/BossCard'
import { assetUrl } from '../lib/githubApi'
import { filledSquares } from '../lib/gameLogic'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'
import { patchPlayerHeroEdit } from '../lib/editsStore'
import { emptyWeekly } from '../lib/localHeroes'
import { downloadPlayerExports } from '../lib/exportMarkdown'
import { fileToPhotoDataUrl } from '../lib/photoUpload'
import type { DayLog, Objective, WeeklyLog } from '../lib/types'

export function Player() {
  const [, params] = useRoute('/player/:id')
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const id = params?.id

  const [nameEn, setNameEn] = useState('')
  const [namePt, setNamePt] = useState('')
  const [theme, setTheme] = useState('treino')
  const [missions, setMissions] = useState<[Objective, Objective, Objective] | null>(null)
  const [weekly, setWeekly] = useState<WeeklyLog | null>(null)
  const [photo, setPhoto] = useState('')
  const [savedMsg, setSavedMsg] = useState('')
  const [ready, setReady] = useState(false)

  const hero = data?.heroes.find((h) => h.id === id)

  useEffect(() => {
    if (!hero || !data) return
    setNameEn(hero.profile.character_name || '')
    setNamePt(hero.profile.character_name_pt || hero.profile.character_name || '')
    setTheme(hero.objectives.theme || data.month.theme || 'treino')
    const objs = [...(hero.objectives.daily_objectives || [])]
    while (objs.length < 3) {
      objs.push({
        id: `obj${objs.length + 1}`,
        name: `Mission ${['Alpha', 'Beta', 'Gamma'][objs.length]}`,
        name_pt: `Missão ${['Alpha', 'Beta', 'Gama'][objs.length]}`,
        points: 30,
        real_meaning_redacted: true,
      })
    }
    setMissions([objs[0], objs[1], objs[2]])
    const week = data.config.current_week
    const bossMeta = data.month.bosses?.find((b) => b.week === week) || data.month.bosses?.[0]
    const baseWeekly =
      hero.weekly && hero.weekly.week === week
        ? hero.weekly
        : emptyWeekly({
            id: hero.id,
            week,
            month: data.config.current_month,
            boss: {
              id: bossMeta?.id || 'boss',
              name: bossMeta?.name || 'BOSS',
              points: bossMeta?.points || 30,
            },
          })
    if (bossMeta && baseWeekly.boss) {
      baseWeekly.boss = {
        ...baseWeekly.boss,
        id: bossMeta.id || baseWeekly.boss.id,
        name: bossMeta.name,
        name_pt: bossMeta.name_pt,
        points: bossMeta.points || 30,
      }
    }
    setWeekly(baseWeekly)
    setPhoto(hero.profile.photo || '')
    setReady(true)
  }, [hero, data])

  if (loading)
    return (
      <Layout>
        <p>{t('loadingSheet')}</p>
      </Layout>
    )
  if (error || !data)
    return (
      <Layout title={t('error')}>
        <p>{error}</p>
      </Layout>
    )

  if (!hero || !missions || !weekly || !ready) {
    return (
      <Layout title={t('hero')}>
        <p>{t('heroMissing')}</p>
      </Layout>
    )
  }

  const { profile, weekPoints, skills } = hero
  const classDef = data.classes[profile.class]
  const squares = filledSquares([weekPoints], data.config.points.weekly_target)
  const className = pickL((classDef || {}) as Record<string, unknown>, 'name', locale)
  const themes = Object.keys(data.themes)

  function persist(next?: {
    missions?: Objective[]
    weekly?: WeeklyLog
    photo?: string
    nameEn?: string
    namePt?: string
    theme?: string
  }) {
    const m = (next?.missions || missions!) as Objective[]
    const w = next?.weekly || weekly!
    const ph = next?.photo ?? photo
    const ne = next?.nameEn ?? nameEn
    const np = next?.namePt ?? namePt
    const th = next?.theme ?? theme
    patchPlayerHeroEdit(hero!.id, {
      objectives: { theme: th, daily_objectives: m },
      weekly: w,
      profile: {
        character_name: ne,
        character_name_pt: np,
        photo: ph,
      },
    })
    setSavedMsg(t('savedLocal'))
    reload()
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return
    try {
      const url = await fileToPhotoDataUrl(file)
      setPhoto(url)
      persist({ photo: url })
    } catch {
      setSavedMsg(t('photoFail'))
    }
  }

  function setMission(i: number, field: 'name' | 'name_pt', value: string) {
    const next = missions!.map((o, idx) =>
      idx === i ? { ...o, [field]: value } : o,
    ) as [Objective, Objective, Objective]
    setMissions(next)
  }

  function onDays(days: Record<string, DayLog>) {
    const next = { ...weekly!, days }
    setWeekly(next)
    persist({ weekly: next })
  }

  function toggleBoss() {
    const next: WeeklyLog = {
      ...weekly!,
      boss: { ...weekly!.boss, completed: !weekly!.boss.completed },
    }
    setWeekly(next)
    persist({ weekly: next })
  }

  return (
    <Layout title={pickL({ character_name: nameEn, character_name_pt: namePt }, 'character_name', locale) || nameEn}>
      <p className="mb-4 max-w-2xl text-sm opacity-80">{t('playerEditHelp')}</p>

      <div className="mb-6 flex flex-wrap items-start gap-4">
        <label className="cursor-pointer">
          <img
            src={assetUrl(photo || '')}
            alt=""
            className="h-28 w-24 border-2 border-[var(--color-gold)] object-cover bg-[var(--color-charcoal)]"
          />
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => void onPhoto(e.target.files?.[0])}
          />
          <span className="mt-1 block text-center text-[10px] uppercase tracking-widest text-[var(--color-gold-dim)]">
            {t('photoField')}
          </span>
        </label>
        <img
          src={assetUrl(profile.avatar || '')}
          alt=""
          className="h-20 w-20 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-charcoal)]"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <ClassBadge className={profile.class} />
            <p className="opacity-80">
              {className || profile.class} · {t('level')} {profile.level}
            </p>
          </div>
          <label className="block text-sm">
            <span className="font-display text-xs text-[var(--color-gold)]">{t('charName')} (EN)</span>
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              onBlur={() => persist()}
              className="mt-1 w-full max-w-md border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
            />
          </label>
          <label className="block text-sm">
            <span className="font-display text-xs text-[var(--color-gold)]">{t('charName')} (PT)</span>
            <input
              value={namePt}
              onChange={(e) => setNamePt(e.target.value)}
              onBlur={() => persist()}
              className="mt-1 w-full max-w-md border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
            />
          </label>
          <div className="mt-2 w-64 max-w-full">
            <XPBar value={profile.xp_this_month || weekPoints} max={data.config.points.monthly_xp} />
          </div>
          <div className="mt-3">
            <XPGrid filled={squares} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-sm text-[var(--color-gold)]">{t('monthMissions')}</h2>
          <p className="text-xs opacity-70">{t('missionsPlayerOnly')}</p>
          <label className="block text-sm">
            <span className="font-display text-xs text-[var(--color-gold)]">{t('missionTheme')}</span>
            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value)
                persist({ theme: e.target.value })
              }}
              className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
            >
              {themes.map((th) => (
                <option key={th} value={th}>
                  {pickL((data.themes[th] || {}) as Record<string, unknown>, 'name', locale) || th}
                </option>
              ))}
            </select>
          </label>
          <div className="panel space-y-3 p-4">
            {missions.map((o, i) => (
              <div key={o.id} className="grid gap-2 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="opacity-70">EN {i + 1}</span>
                  <input
                    value={o.name}
                    onChange={(e) => setMission(i, 'name', e.target.value)}
                    onBlur={() => persist()}
                    className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                  />
                </label>
                <label className="text-sm">
                  <span className="opacity-70">PT {i + 1}</span>
                  <input
                    value={o.name_pt || ''}
                    onChange={(e) => setMission(i, 'name_pt', e.target.value)}
                    onBlur={() => persist()}
                    className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                  />
                </label>
              </div>
            ))}
          </div>

          <h2 className="font-display text-sm text-[var(--color-gold)]">
            {t('week')} {weekly.week}
          </h2>
          <TaskList
            objectives={missions}
            days={weekly.days}
            editable
            onChange={onDays}
          />
          <p className="text-sm text-[var(--color-gold)] tabular-nums">
            {t('total')}: {weekPoints} pts
          </p>

          {skills.length > 0 && (
            <div className="panel p-4">
              <h3 className="mb-2 font-display text-sm text-[var(--color-gold)]">{t('skills')}</h3>
              <ul>
                {skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <BossCard boss={weekly.boss} completed={weekly.boss.completed} />
            <button
              type="button"
              onClick={toggleBoss}
              className="border border-[var(--color-gold-dim)] px-3 py-2 text-xs font-display tracking-widest text-[var(--color-gold)] hover:border-[var(--color-gold)]"
            >
              {weekly.boss.completed ? t('bossUnmark') : t('bossMark')}
            </button>
          </div>
          <UpgradeTree classDef={classDef} monthsCompleted={profile.months_completed} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => persist()}
              className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-2 font-display text-xs tracking-widest text-[var(--color-gold)]"
            >
              {t('saveSheet')}
            </button>
            <button
              type="button"
              onClick={() =>
                downloadPlayerExports({
                  heroId: hero.id,
                  characterName: nameEn,
                  month: data.config.current_month,
                  theme,
                  daily: missions,
                  weekly,
                  profile: {
                    ...profile,
                    character_name: nameEn,
                    character_name_pt: namePt,
                    photo,
                  },
                })
              }
              className="border border-[var(--color-gold-dim)] px-4 py-2 font-display text-xs tracking-widest text-[var(--color-gold)]"
            >
              {t('downloadSheet')}
            </button>
          </div>
          {savedMsg && <p className="text-sm text-[var(--color-gold)]">{savedMsg}</p>}
        </div>
      </div>
    </Layout>
  )
}
