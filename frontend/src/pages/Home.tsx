import { Layout } from '../components/Layout'
import { AvatarCard } from '../components/AvatarCard'
import { BossCard } from '../components/BossCard'
import { XPGrid } from '../components/XPGrid'
import { filledSquares } from '../lib/gameLogic'
import { useGameData } from '../hooks/useGameData'

export function Home() {
  const { data, error, loading } = useGameData()

  if (loading) {
    return (
      <Layout>
        <p className="opacity-70">Abrindo o grimório…</p>
      </Layout>
    )
  }
  if (error || !data) {
    return (
      <Layout title="Erro">
        <p className="text-red-300">{error || 'Sem dados'}</p>
      </Layout>
    )
  }

  const { config, month, heroes, themes } = data
  const week = config.current_week
  const bossMeta = month.bosses?.find((b) => b.week === week) || month.bosses?.[0]
  const theme = themes[month.theme]
  const bossDesc = theme?.enemies?.find((e) => e.id === bossMeta?.id)?.description
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
          A jornada desta semana aguarda, heróis. Semana {week} · {month.month}
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
                description: bossDesc,
                image:
                  bossMeta.image ||
                  theme?.enemies?.find((e) => e.id === bossMeta.id)?.image ||
                  `docs/assets/enemies/${bossMeta.type}.svg`,
              }}
            />
          )}
          <div className="panel p-4">
            <XPGrid filled={sampleSquares} label="Espelho XP (semana atual · herói 1)" />
            <p className="mt-2 text-sm opacity-70">
              Tema do mês: {theme?.name || month.theme}. Meta semanal:{' '}
              {config.points.weekly_target} pts.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-sm text-[var(--color-gold)]">Heróis</h2>
          {heroes.map((h) => (
            <AvatarCard
              key={h.id}
              profile={h.profile}
              weekPoints={h.weekPoints}
              href={`/player/${h.id}`}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
