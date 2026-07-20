import { Layout } from '../components/Layout'
import { BossCard } from '../components/BossCard'
import { TaskList } from '../components/TaskList'
import { AvatarCard } from '../components/AvatarCard'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'

export function Weekly() {
  const { data, error, loading } = useGameData()
  const { locale, t } = useLocale()

  if (loading)
    return (
      <Layout>
        <p>{t('loadingWeek')}</p>
      </Layout>
    )
  if (error || !data)
    return (
      <Layout title={t('error')}>
        <p>{error}</p>
      </Layout>
    )

  const { config, month, heroes, themes, classes } = data
  const week = config.current_week
  const bossMeta = month.bosses?.find((b) => b.week === week)
  const themeKey = bossMeta?.theme || month.theme
  const theme = themes[themeKey]
  const enemy = theme?.enemies?.find((e) => e.id === bossMeta?.id)
  const bossCompleted = heroes.some((h) => h.weekly?.boss?.completed)

  return (
    <Layout title={`${t('week')} ${week}`}>
      <p className="mb-4 opacity-85">{t('weekIntro')}</p>
      {bossMeta && (
        <div className="mb-6">
          <BossCard
            large
            completed={bossCompleted}
            boss={{
              ...bossMeta,
              description: bossMeta.description || enemy?.description,
              description_pt: bossMeta.description_pt || enemy?.description_pt,
              name_pt: bossMeta.name_pt || enemy?.name_pt,
              image:
                bossMeta.image ||
                enemy?.image ||
                `docs/assets/enemies/${bossMeta.type || 'monstro'}.png`,
            }}
          />
        </div>
      )}
      <div className="space-y-8">
        {heroes.map((h) => (
          <section key={h.id} className="space-y-3">
            <AvatarCard
              profile={h.profile}
              weekPoints={h.weekPoints}
              href={`/player/${h.id}`}
              classLabel={pickL(
                (classes[h.profile.class] || {}) as Record<string, unknown>,
                'name',
                locale,
              )}
            />
            {h.weekly ? (
              <TaskList days={h.weekly.days} />
            ) : (
              <p className="opacity-60 text-sm">{t('noWeekly', { week })}</p>
            )}
          </section>
        ))}
      </div>
    </Layout>
  )
}
