import { useEffect, useState } from 'react'
import { useRoute } from 'wouter'
import { Layout } from '../components/Layout'
import { ClassBadge } from '../components/ClassBadge'
import { XPBar } from '../components/XPBar'
import { TaskList } from '../components/TaskList'
import { UpgradeTree } from '../components/UpgradeTree'
import { ClassEvolutions } from '../components/ClassEvolutions'
import { BossCard } from '../components/BossCard'
import { assetUrl, hasGithubToken } from '../lib/githubApi'
import { useGameData } from '../hooks/useGameData'
import { pickL, StableT, useLocale } from '../lib/i18n'
import { patchPlayerHeroEdit } from '../lib/editsStore'
import { emptyWeekly } from '../lib/localHeroes'
import { downloadPlayerExports } from '../lib/exportMarkdown'
import { commitPlayerSheet } from '../lib/commitDocs'
import { fileToPhotoDataUrl } from '../lib/photoUpload'
import { normalizeWeeklyLog } from '../lib/dayLog'
import { weekFromLog } from '../lib/gameLogic'
import { resolveThemeId } from '../lib/themeAlias'
import {
  blockFill,
  bodyAssetPath,
  bodyStage,
  classBackgroundPath,
  classBackgroundPosition,
  clampBlockOpacity,
  defaultsFromPalette,
  resolveSheetColors,
} from '../lib/sheetStyle'
import type { DayLog, SheetColors, WeeklyLog } from '../lib/types'

export function Player() {
  const [, params] = useRoute('/player/:id')
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const id = params?.id

  const [name, setName] = useState('')
  const [theme, setTheme] = useState('fisico')
  const [monthObjective, setMonthObjective] = useState('')
  const [weekly, setWeekly] = useState<WeeklyLog | null>(null)
  const [photo, setPhoto] = useState('')
  const [sheetColors, setSheetColors] = useState<SheetColors>(defaultsFromPalette())
  const [draftColors, setDraftColors] = useState<SheetColors>(defaultsFromPalette())
  const [savedMsg, setSavedMsg] = useState('')
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)

  const hero = data?.heroes.find((h) => h.id === id)
  const themeDef = data?.themes[theme]

  useEffect(() => {
    if (!hero || !data) return
    setName(hero.profile.character_name || '')
    const th = resolveThemeId(hero.objectives.theme || data.month.theme || 'fisico')
    setTheme(th)
    setMonthObjective(hero.objectives.month_objective || '')
    const week = data.config.current_week
    const bossMeta = data.month.bosses?.find((b) => b.week === week) || data.month.bosses?.[0]
    const baseWeekly =
      hero.weekly && hero.weekly.week === week
        ? normalizeWeeklyLog(hero.weekly)
        : emptyWeekly({
            id: hero.id,
            week,
            month: data.config.current_month,
            boss: {
              id: bossMeta?.id || 'boss',
              name: bossMeta?.name || 'BOSS',
              name_pt: bossMeta?.name_pt,
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
    const colors = resolveSheetColors(hero.profile.sheet_colors, data.themes[th])
    setSheetColors(colors)
    setDraftColors(colors)
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

  if (!hero || !weekly || !ready) {
    return (
      <Layout title={t('hero')}>
        <p>{t('heroMissing')}</p>
      </Layout>
    )
  }

  const { profile, skills } = hero
  const weekPoints = weekly
    ? weekFromLog(weekly, data.config.points)
    : hero.weekPoints
  const classDef = data.classes[profile.class]
  const className = pickL((classDef || {}) as Record<string, unknown>, 'name', locale)
  const themes = Object.keys(data.themes)
  const classBgUrl = assetUrl(classBackgroundPath(profile.class))
  const classBgPos = classBackgroundPosition(profile.class)
  const bodySrc = assetUrl(
    bodyAssetPath(profile.class, profile.months_completed, profile.sex),
  )
  const stage = bodyStage(profile.months_completed)

  function persist(
    next?: {
      weekly?: WeeklyLog
      photo?: string
      name?: string
      theme?: string
      monthObjective?: string
      sheetColors?: SheetColors
    },
    opts?: { refresh?: boolean },
  ) {
    const w = next?.weekly || weekly!
    const ph = next?.photo ?? photo
    const ne = next?.name ?? name
    const th = next?.theme ?? theme
    const mo = next?.monthObjective ?? monthObjective
    const sc = next?.sheetColors ?? sheetColors
    patchPlayerHeroEdit(hero!.id, {
      objectives: { theme: th, month_objective: mo },
      weekly: w,
      profile: {
        character_name: ne,
        character_name_pt: ne,
        photo: ph,
        sex: profile.sex,
        sheet_colors: sc,
      },
    })
    setSavedMsg(t('savedLocal'))
    if (opts?.refresh) reload()
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

  function onDays(days: Record<string, DayLog>) {
    const next = { ...weekly!, days }
    setWeekly(next)
    persist({ weekly: next }) // no full refresh — keep selected weekday
  }

  function toggleBoss() {
    const next: WeeklyLog = {
      ...weekly!,
      boss: { ...weekly!.boss, completed: !weekly!.boss.completed },
    }
    setWeekly(next)
    persist({ weekly: next })
  }

  function patchDraftColors(patch: Partial<SheetColors>) {
    setDraftColors((prev) => ({
      ...prev,
      ...patch,
      block_opacity:
        patch.block_opacity != null
          ? clampBlockOpacity(patch.block_opacity)
          : prev.block_opacity,
    }))
  }

  function commitDraftColors() {
    setSheetColors(draftColors)
    persist({ sheetColors: draftColors })
  }

  const sheetVars = {
    ['--sheet-text' as string]: sheetColors.text,
    ['--sheet-fg' as string]: sheetColors.text,
    ['--sheet-block' as string]: blockFill(sheetColors.block, sheetColors.block_opacity),
    ['--sheet-block-alpha' as string]: String(clampBlockOpacity(sheetColors.block_opacity)),
    ['--sheet-accent' as string]: themeDef?.palette?.[0] || '#A87900',
    ['--sheet-gold' as string]: themeDef?.palette?.[1] || '#C9A227',
    ['--sheet-deep' as string]: themeDef?.palette?.[2] || '#1C1917',
  }

  return (
    <Layout>
      <div className="sheet-root" style={sheetVars}>
        <div
          className="sheet-bg-theme"
          style={{
            backgroundImage: `url("${classBgUrl}")`,
            backgroundPosition: classBgPos,
          }}
          aria-hidden
        />
        <div className="sheet-bg-wash" aria-hidden />

        <div className="sheet-content">
          {/* Header = extensão da ficha: foto + nome (clique edita, sem caixa) */}
          <header className="sheet-identity">
            <label className="sheet-identity-photo" title={t('photoField')}>
              <img src={assetUrl(photo || profile.avatar || '')} alt="" />
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => void onPhoto(e.target.files?.[0])}
              />
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => persist()}
              aria-label={t('charName')}
              placeholder={t('charName')}
              className="sheet-identity-name"
            />
          </header>

          <div className="sheet-layout p-3 md:p-4">
            <div className="sheet-stack">
              {/* Banner: corpo em destaque + foco do mês */}
              <section className="sheet-panel sheet-epic border border-[var(--sheet-accent)]/35 px-3 py-3">
                <div className="sheet-epic-body">
                  <img src={bodySrc} alt="" />
                  <p className="sheet-dim mt-1 text-[10px]">
                    {t('bodyStage')} {stage}/12
                    {stage === 0 ? ` · ${t('avatarPlain')}` : ''}
                  </p>
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <ClassBadge className={profile.class} />
                    <span className="sheet-muted text-[11px]">
                      {className || profile.class} · {t('level')} {profile.level}
                    </span>
                  </div>
                  <div className="max-w-[260px]">
                    <XPBar
                      value={profile.xp_this_month || weekPoints}
                      max={data.config.points.monthly_xp}
                    />
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    <label className="block min-w-0 text-sm">
                      <span
                        className="sheet-label sheet-label-row font-display text-[9px] uppercase tracking-widest"
                        title={t('dimension')}
                      >
                        <StableT k="dimension" align="start" />
                      </span>
                      <select
                        value={theme}
                        onChange={(e) => {
                          const th = e.target.value
                          setTheme(th)
                          persist({ theme: th })
                        }}
                        className="mt-0.5 w-full border border-[var(--sheet-fg-dim)] px-1.5 py-0.5 text-xs"
                      >
                        {themes.map((th) => (
                          <option key={th} value={th}>
                            {pickL(
                              (data.themes[th] || {}) as Record<string, unknown>,
                              'name',
                              locale,
                            ) || th}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block min-w-0 text-sm">
                      <span
                        className="sheet-label sheet-label-row font-display text-[9px] uppercase tracking-widest"
                        title={t('monthObjective')}
                      >
                        <StableT k="monthObjective" align="start" />
                      </span>
                      <input
                        value={monthObjective}
                        onChange={(e) => setMonthObjective(e.target.value)}
                        onBlur={() => persist()}
                        className="mt-0.5 w-full border border-[var(--sheet-fg-dim)] px-1.5 py-0.5 text-xs"
                      />
                    </label>
                  </div>
                </div>
              </section>

              <details className="sheet-panel border border-[var(--sheet-accent)]/35 p-2">
                <summary className="sheet-title cursor-pointer font-display text-[11px] tracking-widest">
                  {t('seeAllEvolutions')}
                </summary>
                <div className="mt-2">
                  <ClassEvolutions
                    classId={profile.class}
                    monthsCompleted={profile.months_completed}
                    sex={profile.sex === 'female' ? 'female' : 'male'}
                  />
                </div>
              </details>

              <section className="space-y-2">
                <div className="sheet-panel sheet-week-head border border-[var(--sheet-accent)]/35 px-3 py-2">
                  <h2 className="sheet-title font-display text-[11px] tracking-widest">
                    <StableT k="weekProgress" align="start" /> · {weekly.week}
                  </h2>
                  <span className="sheet-title text-sm tabular-nums">{weekPoints} pts</span>
                </div>
                <TaskList days={weekly.days} editable onChange={onDays} />
              </section>

              {skills.length > 0 && (
                <section className="sheet-panel border border-[var(--sheet-accent)]/35 px-3 py-2">
                  <h3 className="sheet-label mb-0.5 font-display text-[10px] tracking-widest">
                    {t('skills')}
                  </h3>
                  <p className="text-sm">{skills.map((s) => s.name).join(' · ')}</p>
                </section>
              )}
            </div>

            {/* Rail: BOSS, upgrades, ações */}
            <aside className="sheet-rail">
              <div className="sheet-panel space-y-2 border border-[var(--sheet-accent)]/35 p-3">
                <BossCard boss={weekly.boss} completed={weekly.boss.completed} />
                <button
                  type="button"
                  onClick={toggleBoss}
                  className="sheet-lang-stable w-full border border-[var(--sheet-fg-muted)] px-2 py-2 text-[11px] font-display tracking-wide hover:border-[var(--sheet-fg)]"
                >
                  <StableT
                    k={weekly.boss.completed ? 'bossUnmark' : 'bossMark'}
                    also={['bossMark', 'bossUnmark']}
                  />
                </button>
              </div>
              <UpgradeTree classDef={classDef} monthsCompleted={profile.months_completed} />

              <details
                className="sheet-panel border border-[var(--sheet-accent)]/35 p-3"
                onToggle={(e) => {
                  if ((e.currentTarget as HTMLDetailsElement).open) {
                    setDraftColors(sheetColors)
                  }
                }}
              >
                <summary className="sheet-title cursor-pointer font-display text-xs tracking-widest">
                  <StableT k="sheetColors" align="start" />
                </summary>
                <div className="mt-3 grid gap-3 text-sm">
                  <div className="grid grid-cols-[auto_auto_1fr] items-end gap-3">
                    <label className="min-w-0">
                      <span
                        className="sheet-label sheet-label-row text-[10px]"
                        title={t('textColor')}
                      >
                        <StableT k="textColor" align="start" />
                      </span>
                      <input
                        type="color"
                        value={draftColors.text}
                        onChange={(e) => patchDraftColors({ text: e.target.value })}
                        className="mt-1 h-8 w-10 cursor-pointer bg-transparent"
                      />
                    </label>
                    <label className="min-w-0">
                      <span
                        className="sheet-label sheet-label-row text-[10px]"
                        title={t('blockColor')}
                      >
                        <StableT k="blockColor" align="start" />
                      </span>
                      <input
                        type="color"
                        value={draftColors.block}
                        onChange={(e) => patchDraftColors({ block: e.target.value })}
                        className="mt-1 h-8 w-10 cursor-pointer bg-transparent"
                      />
                    </label>
                    <label className="min-w-0">
                      <span
                        className="sheet-label sheet-label-row text-[10px]"
                        title={`${t('blockOpacity')} (${Math.round(draftColors.block_opacity * 100)}%)`}
                      >
                        <StableT k="blockOpacity" align="start" /> (
                        {Math.round(draftColors.block_opacity * 100)}%)
                      </span>
                      <input
                        type="range"
                        min={0.05}
                        max={0.85}
                        step={0.05}
                        value={draftColors.block_opacity}
                        onChange={(e) =>
                          patchDraftColors({ block_opacity: Number(e.target.value) })
                        }
                        className="mt-2 w-full"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      title={t('resetSheetColors')}
                      onClick={() => setDraftColors(defaultsFromPalette(themeDef?.palette))}
                      className="border border-[var(--sheet-fg-muted)] px-1 py-1.5 text-[10px] uppercase tracking-widest"
                    >
                      <StableT k="resetSheetColors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftColors(sheetColors)}
                      className="border border-[var(--sheet-fg-muted)] px-1 py-1.5 text-[10px] uppercase tracking-widest"
                    >
                      <StableT k="cancelSheetColors" />
                    </button>
                    <button
                      type="button"
                      onClick={commitDraftColors}
                      className="border border-[var(--sheet-fg)] bg-black/40 px-1 py-1.5 text-[10px] uppercase tracking-widest"
                    >
                      <StableT k="applySheetColors" />
                    </button>
                  </div>
                </div>
              </details>

              <div className="sheet-panel space-y-2 border border-[var(--sheet-accent)]/35 p-3">
                <h3
                  className="sheet-title truncate font-display text-xs tracking-widest"
                  title={t('sheetActions')}
                >
                  <StableT k="sheetActions" align="start" />
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => persist()}
                    className="sheet-lang-stable border border-[var(--sheet-fg)] bg-black/40 px-2 py-2 font-display text-[11px] tracking-wide"
                  >
                    <StableT k="saveSheet" />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      void (async () => {
                        persist()
                        if (!hasGithubToken()) {
                          setSavedMsg(t('needToken'))
                          return
                        }
                        setBusy(true)
                        try {
                          const files = await commitPlayerSheet({
                            heroId: hero.id,
                            characterName: name,
                            month: data.config.current_month,
                            theme,
                            monthObjective,
                            weekly,
                            profile: {
                              ...profile,
                              character_name: name,
                              character_name_pt: name,
                              photo,
                              sheet_colors: sheetColors,
                            },
                          })
                          setSavedMsg(`${t('committed')} ${files.join(', ')}`)
                          reload()
                        } catch (e) {
                          setSavedMsg(String(e))
                        } finally {
                          setBusy(false)
                        }
                      })()
                    }}
                    className="sheet-lang-stable border border-[var(--sheet-fg-muted)] px-2 py-2 font-display text-[11px] tracking-wide"
                  >
                    <StableT k="commitGithub" />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      downloadPlayerExports({
                        heroId: hero.id,
                        characterName: name,
                        month: data.config.current_month,
                        theme,
                        monthObjective,
                        weekly,
                        profile: {
                          ...profile,
                          character_name: name,
                          character_name_pt: name,
                          photo,
                          sheet_colors: sheetColors,
                        },
                      })
                    }
                    className="sheet-lang-stable border border-[var(--sheet-fg-dim)] px-2 py-2 font-display text-[11px] tracking-wide"
                  >
                    <StableT k="downloadSheet" />
                  </button>
                </div>
                {savedMsg && <p className="sheet-muted text-xs">{savedMsg}</p>}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  )
}
