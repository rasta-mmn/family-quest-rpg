import { Link } from 'wouter'
import { Layout } from '../components/Layout'
import { AvatarCard } from '../components/AvatarCard'
import { BossCard } from '../components/BossCard'
import { CityMap } from '../components/CityMap'
import { XPGrid } from '../components/XPGrid'
import { campaignBossAsEntry } from '../lib/campaign'
import { filledSquares } from '../lib/gameLogic'
import { setActiveFamilyId } from '../lib/familyStore'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'
import { useState } from 'react'

export function Home() {
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const [loreOpen, setLoreOpen] = useState(false)

  if (loading) {
    return (
      <Layout>
        <p className="opacity-70">{t('opening')}</p>
      </Layout>
    )
  }
  if (error || !data) {
    return (
      <Layout title={t('error')}>
        <p className="text-red-300">{error || t('noData')}</p>
      </Layout>
    )
  }

  const { config, month, campaign, heroes, themes, classes, families, activeFamily, familySession, mapWeekPoints } =
    data
  const week = config.current_week
  const weekBoss = month.bosses?.find((b) => b.week === week) || month.bosses?.[0]
  const isBossWeek = weekBoss?.type === 'boss'
  const monthBoss = campaign
    ? campaignBossAsEntry(campaign, month.weeks?.[month.weeks.length - 1])
    : null
  const theme = themes[month.theme]
  const weekDone = heroes.every((h) => h.weekly?.boss?.completed)
  const sampleSquares = filledSquares(
    heroes[0] ? [heroes[0].weekPoints] : [],
    config.points.weekly_target,
  )
  const campTitle = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'title', locale)
    : ''
  const campCity = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'city', locale)
    : ''
  const campSeason = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'season_name', locale) ||
      campaign.season ||
      ''
    : ''
  const campLore = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'lore', locale)
    : ''

  const familyHeroes = activeFamily
    ? heroes.filter((h) => activeFamily.hero_ids?.includes(h.id))
    : heroes

  function switchFamily(id: string) {
    setActiveFamilyId(id)
    reload()
  }

  return (
    <Layout>
      <header className="mb-4">
        <p className="font-decorative text-3xl text-[var(--color-gold)] md:text-4xl">
          Family Quest
        </p>
        <p className="mt-2 max-w-xl text-lg opacity-90">
          {t('journeyWeek')} {t('week')} {week} · {month.month}
          {campTitle ? ` · ${campTitle}` : ''}
        </p>
        {(campCity || campSeason) && (
          <p className="mt-1 text-sm opacity-70">
            {[campCity, campSeason].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="flourish mt-2">❦</div>
      </header>

      {/* Family switcher */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-display text-xs tracking-widest text-[var(--color-gold)]">
          {t('families')}
        </span>
        {families.map((f) => {
          const active = f.id === activeFamily?.id
          const label = pickL(f as unknown as Record<string, unknown>, 'name', locale)
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => switchFamily(f.id)}
              className={`border px-3 py-1.5 font-display text-[11px] tracking-wider ${
                active
                  ? 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
                  : 'border-[var(--color-gold)]/40 text-[var(--color-ink)]/80 hover:border-[var(--color-gold)]'
              }`}
            >
              {label}
              <span className="ml-1 opacity-60">· {f.map_campaign_id}</span>
            </button>
          )
        })}
        <Link
          href="/create-family"
          className="border border-dashed border-[var(--color-gold)]/50 px-3 py-1.5 font-display text-[11px] tracking-wider text-[var(--color-gold)]/90 hover:border-[var(--color-gold)]"
        >
          {t('createFamilyNav')}
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {campaign && activeFamily ? (
            <CityMap
              campaign={campaign}
              activeFamily={activeFamily}
              families={families}
              heroFaces={heroes.map((h) => ({
                id: h.id,
                name:
                  pickL(h.profile as unknown as Record<string, unknown>, 'character_name', locale) ||
                  h.id,
                avatar: h.profile.avatar,
                photo: h.profile.photo,
              }))}
              mapWeekPoints={mapWeekPoints}
              points={config.points}
              bossDone={Boolean(familySession?.boss_done)}
              bossOutcome={activeFamily.boss_outcome}
            />
          ) : (
            <div className="panel p-4 text-sm opacity-80">{t('noFamilyMap')}</div>
          )}

          {campLore ? (
            <div className="panel p-4 md:p-5">
              <button
                type="button"
                onClick={() => setLoreOpen((v) => !v)}
                className="font-display text-xs tracking-widest text-[var(--color-gold)]"
              >
                {t('campaignLore')} {loreOpen ? '▾' : '▸'}
              </button>
              {loreOpen && (
                <p className="mt-3 max-w-prose text-base leading-relaxed opacity-90">{campLore}</p>
              )}
            </div>
          ) : null}

          {monthBoss && !isBossWeek && <BossCard large boss={monthBoss} />}
          {weekBoss && (
            <BossCard
              large={isBossWeek}
              completed={weekDone}
              boss={{
                ...weekBoss,
                image:
                  weekBoss.image ||
                  `docs/assets/enemies/${weekBoss.type || 'monstro'}.svg`,
              }}
            />
          )}
          <div className="panel p-4">
            <XPGrid filled={sampleSquares} label={t('xpMirror')} />
            <p className="mt-2 text-sm opacity-70">
              {t('monthTheme')}:{' '}
              {pickL((theme || {}) as Record<string, unknown>, 'name', locale) || month.theme}.{' '}
              {t('weeklyTarget')}: {config.points.weekly_target} pts.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-sm text-[var(--color-gold)]">{t('heroes')}</h2>
          {familyHeroes.map((h) => (
            <AvatarCard
              key={h.id}
              profile={h.profile}
              weekPoints={h.weekPoints}
              href={`/player/${h.id}`}
              classLabel={pickL(
                (classes[h.profile.class] || {}) as Record<string, unknown>,
                'name',
                locale,
              )}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
