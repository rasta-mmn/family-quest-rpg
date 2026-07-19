import { Layout } from '../components/Layout'
import { BossCard } from '../components/BossCard'
import { TaskList } from '../components/TaskList'
import { AvatarCard } from '../components/AvatarCard'
import { useGameData } from '../hooks/useGameData'

export function Weekly() {
  const { data, error, loading } = useGameData()

  if (loading) return <Layout><p>Consultando a semana…</p></Layout>
  if (error || !data) return <Layout title="Erro"><p>{error}</p></Layout>

  const { config, month, heroes, themes } = data
  const week = config.current_week
  const bossMeta = month.bosses?.find((b) => b.week === week)
  const theme = themes[month.theme]
  const enemy = theme?.enemies?.find((e) => e.id === bossMeta?.id)
  const bossCompleted = heroes.some((h) => h.weekly?.boss?.completed)

  return (
    <Layout title={`Semana ${week}`}>
      <p className="mb-4 opacity-85">
        Marcações transferidas do papel. Objetivos permanecem redactados no grimório.
      </p>
      {bossMeta && (
        <div className="mb-6">
          <BossCard
            large
            completed={bossCompleted}
            boss={{
              ...bossMeta,
              description: enemy?.description,
              image: enemy?.image || `docs/assets/enemies/${bossMeta.type}.svg`,
            }}
          />
        </div>
      )}
      <div className="space-y-8">
        {heroes.map((h) => (
          <section key={h.id} className="space-y-3">
            <AvatarCard profile={h.profile} weekPoints={h.weekPoints} href={`/player/${h.id}`} />
            {h.weekly ? (
              <TaskList
                objectives={h.objectives.daily_objectives}
                days={h.weekly.days}
              />
            ) : (
              <p className="opacity-60 text-sm">Sem registo weekly/{week}.md ainda.</p>
            )}
          </section>
        ))}
      </div>
    </Layout>
  )
}
