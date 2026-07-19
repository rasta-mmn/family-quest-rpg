import { Layout } from '../components/Layout'
import { AvatarCard } from '../components/AvatarCard'
import { BossCard } from '../components/BossCard'
import { XPGrid } from '../components/XPGrid'
import { filledSquares } from '../lib/gameLogic'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'

export function Home() {
  const { data, error, loading } = useGameData()
  const { locale, t } = useLocale()

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

  const { config, month, heroes, themes, classes } = data
  const week = config.current_week
  const bossMeta = month.bosses?.find((b) => b.week === week) || month.bosses?.[0]
  const theme = themes[month.theme]
  const enemy = theme?.enemies?.find((e) => e.id === bossMeta?.id)
  const bossCompleted = heroes.every((h) => h.weekly?.boss?.completed)
  const sampleSquares = filledSquares(
    heroes[0] ? [heroes[0].weekPoints] : [],
    config.points.weekly_target,
  )

  return (
    <Layout>
      <header className="mb-6">
        <p className="font-decorative text-3xl text-[var(--color-gold)] md:text-4xl">
          Family Quest
        </p>
        <p className="mt-2 max-w-xl text-lg opacity-90">
          {t('journeyWeek')} {t('week')} {week} · {month.month}
        </p>
        <div className="flourish mt-3">❦</div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {bossMeta && (
            <BossCard
              large
              completed={bossCompleted}
              boss={{
                ...bossMeta,
                description: enemy?.description ?? bossMeta.description,
                description_pt: enemy?.description_pt ?? bossMeta.description_pt,
                name_pt: bossMeta.name_pt || enemy?.name_pt,
                image:
                  bossMeta.image ||
                  enemy?.image ||
                  `docs/assets/enemies/${bossMeta.type}.png`,
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
          {heroes.map((h) => (
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
