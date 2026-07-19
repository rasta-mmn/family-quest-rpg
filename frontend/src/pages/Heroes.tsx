import { Link } from 'wouter'
import { Layout } from '../components/Layout'
import { AvatarCard } from '../components/AvatarCard'
import { useGameData } from '../hooks/useGameData'
import { useLocale } from '../lib/i18n'

export function Heroes() {
  const { data, error, loading } = useGameData()
  const { t } = useLocale()

  if (loading) return <Layout><p>{t('opening')}</p></Layout>
  if (error || !data) return <Layout title={t('error')}><p>{error}</p></Layout>

  return (
    <Layout title={t('heroes')}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-lg opacity-85">{t('heroesHelp')}</p>
        <Link
          href="/create"
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-2 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)]"
        >
          {t('summonHeroBtn')}
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.heroes.map((h) => (
          <div key={h.id} className="relative">
            <AvatarCard
              profile={h.profile}
              weekPoints={h.weekPoints}
              href={`/player/${h.id}`}
            />
            {h.local && (
              <span className="absolute right-2 top-2 text-[10px] uppercase tracking-widest text-[var(--color-gold-dim)]">
                local
              </span>
            )}
          </div>
        ))}
      </div>
    </Layout>
  )
}
