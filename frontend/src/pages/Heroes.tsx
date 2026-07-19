import { Link } from 'wouter'
import { Layout } from '../components/Layout'
import { AvatarCard } from '../components/AvatarCard'
import { useGameData } from '../hooks/useGameData'

export function Heroes() {
  const { data, error, loading } = useGameData()

  if (loading) return <Layout><p>Summoning heroes…</p></Layout>
  if (error || !data) return <Layout title="Error"><p>{error}</p></Layout>

  return (
    <Layout title="Heroes">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-lg opacity-85">
          Open a sheet for full details. Local heroes live in this browser until you
          commit their `.md` files.
        </p>
        <Link
          href="/create"
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-2 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)]"
        >
          + Summon hero
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
