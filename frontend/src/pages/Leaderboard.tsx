import { Layout } from '../components/Layout'
import { ClassBadge } from '../components/ClassBadge'
import { rankPlayers } from '../lib/gameLogic'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'

export function Leaderboard() {
  const { data, error, loading } = useGameData()
  const { locale, t } = useLocale()

  if (loading)
    return (
      <Layout>
        <p>{t('countingDeeds')}</p>
      </Layout>
    )
  if (error || !data)
    return (
      <Layout title={t('error')}>
        <p>{error}</p>
      </Layout>
    )

  const ranked = rankPlayers(
    data.heroes.map((h) => ({
      id: h.id,
      name: pickL(h.profile as Record<string, unknown>, 'character_name', locale),
      points: h.weekPoints,
      className: h.profile.class,
    })),
  )

  return (
    <Layout title={t('rankings')}>
      <p className="mb-4 opacity-85">
        {t('weekGlory')} {data.config.current_week}.
      </p>
      <ol className="panel divide-y divide-[var(--color-gold-dim)]/30">
        {ranked.map((r, i) => (
          <li key={r.id} className="flex items-center gap-4 p-4">
            <span className="font-display w-8 text-2xl text-[var(--color-gold)]">{i + 1}</span>
            <ClassBadge className={r.className} size="sm" />
            <div className="flex-1">
              <div className="font-display text-sm normal-case tracking-wide text-[var(--color-gold)]">
                {r.name}
              </div>
              <div className="text-sm opacity-70">
                {pickL(
                  (data.classes[r.className] || {}) as Record<string, unknown>,
                  'name',
                  locale,
                ) || r.className}
              </div>
            </div>
            <div className="font-body text-xl tabular-nums text-[var(--color-gold)]">
              {r.points}
            </div>
          </li>
        ))}
      </ol>
    </Layout>
  )
}
