import { Link } from 'wouter'
import { Layout } from '../components/Layout'
import { AvatarCard } from '../components/AvatarCard'
import { useGameData } from '../hooks/useGameData'
import { useLocale } from '../lib/i18n'
import { clearPlayerHeroEdit } from '../lib/editsStore'
import { removeLocalHero } from '../lib/localHeroes'
import { commitDeleteHeroFully } from '../lib/commitDocs'
import { hasGithubToken } from '../lib/githubApi'
import { useState } from 'react'

export function Heroes() {
  const { data, error, loading, reload } = useGameData()
  const { t } = useLocale()
  const [msg, setMsg] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  if (loading) return <Layout><p>{t('opening')}</p></Layout>
  if (error || !data) return <Layout title={t('error')}><p>{error}</p></Layout>

  async function onRemove(heroId: string, isLocal: boolean) {
    if (!window.confirm(t('confirmRemoveHero'))) return
    setBusyId(heroId)
    setMsg('')
    try {
      clearPlayerHeroEdit(heroId)
      if (isLocal) {
        removeLocalHero(heroId)
        setMsg(t('heroRemovedLocal'))
      } else {
        if (!hasGithubToken()) {
          setMsg(t('needTokenToDelete'))
          return
        }
        const files = await commitDeleteHeroFully(heroId, data!.config.current_month)
        removeLocalHero(heroId)
        setMsg(`${t('heroRemovedFully')} ${files.length} ${t('filesDeleted')}`)
      }
      reload()
    } catch (e) {
      setMsg(e instanceof Error && e.message === 'NO_TOKEN' ? t('needTokenToDelete') : String(e))
    } finally {
      setBusyId(null)
    }
  }

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
      <p className="mb-3 text-xs opacity-70">{t('removeHeroHelp')}</p>
      {msg && <p className="mb-3 text-sm text-[var(--color-gold)]">{msg}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {data.heroes.map((h) => (
          <div key={h.id} className="relative">
            <AvatarCard
              profile={h.profile}
              weekPoints={h.weekPoints}
              href={`/player/${h.id}`}
            />
            {h.local && (
              <span className="absolute left-2 top-2 text-[10px] uppercase tracking-widest text-[var(--color-gold-dim)]">
                local
              </span>
            )}
            <button
              type="button"
              disabled={busyId === h.id}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void onRemove(h.id, !!h.local)
              }}
              className="absolute right-2 top-2 border border-red-400/60 bg-[var(--color-charcoal)]/90 px-2 py-1 text-[10px] uppercase tracking-widest text-red-300 hover:border-red-300 disabled:opacity-50"
            >
              {busyId === h.id ? '…' : t('removeHero')}
            </button>
          </div>
        ))}
      </div>
      {data.heroes.length === 0 && (
        <p className="mt-6 opacity-70">{t('noHeroes')}</p>
      )}
    </Layout>
  )
}
