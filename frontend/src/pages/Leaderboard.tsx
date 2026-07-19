import { Layout } from '../components/Layout'
import { ClassBadge } from '../components/ClassBadge'
import { rankPlayers } from '../lib/gameLogic'
import { useGameData } from '../hooks/useGameData'

export function Leaderboard() {
  const { data, error, loading } = useGameData()

  if (loading) return <Layout><p>Contando façanhas…</p></Layout>
  if (error || !data) return <Layout title="Erro"><p>{error}</p></Layout>

  const ranked = rankPlayers(
    data.heroes.map((h) => ({
      id: h.id,
      name: h.profile.character_name,
      points: h.weekPoints,
      className: h.profile.class,
    })),
  )

  return (
    <Layout title="Ranking">
      <p className="mb-4 opacity-85">Glória da semana {data.config.current_week}.</p>
      <ol className="panel divide-y divide-[var(--color-gold-dim)]/30">
        {ranked.map((r, i) => (
          <li key={r.id} className="flex items-center gap-4 p-4">
            <span className="font-display w-8 text-2xl text-[var(--color-gold)]">{i + 1}</span>
            <ClassBadge className={r.className} size="sm" />
            <div className="flex-1">
              <div className="font-display text-sm normal-case tracking-wide text-[var(--color-gold)]">
                {r.name}
              </div>
              <div className="text-sm opacity-70">{r.className}</div>
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
