import { useEffect, useState } from 'react'
import { loadBestiaryRoster } from '../lib/bestiaryRoster'
import { assetUrl } from '../lib/githubApi'
import { pickL, useLocale } from '../lib/i18n'
import type { BestiaryRosterBoss } from '../lib/types'

export function AdminBestiaryTab() {
  const { locale, t } = useLocale()
  const [roster, setRoster] = useState<BestiaryRosterBoss[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setErr('')
      try {
        const list = await loadBestiaryRoster()
        if (cancelled) return
        setRoster(list)
        setSelected(list[0]?.id ?? null)
      } catch (e) {
        if (!cancelled) setErr(String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p className="opacity-70">{t('loadingAdmin')}</p>
  if (err) return <p className="text-sm text-red-300">{err}</p>

  const boss = roster.find((b) => b.id === selected) || roster[0]
  const bossAvatars = boss
    ? [...(boss.avatar ? [boss.avatar] : []), ...(boss.avatars || [])].filter(
        (p, i, arr) => p && p !== boss.image && arr.indexOf(p) === i,
      )
    : []

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm opacity-70">{t('bestiaryTabHelp')}</p>
      <p className="text-xs opacity-60">{t('bestiaryRegenHint')}</p>

      <div className="flex flex-wrap gap-2">
        {roster.map((b) => {
          const name = pickL(b as Record<string, unknown>, 'name', locale)
          const active = b.id === boss?.id
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelected(b.id)}
              className={`flex items-center gap-2 border px-2 py-1.5 text-left ${
                active
                  ? 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)]'
                  : 'border-[var(--color-gold-dim)] opacity-75'
              }`}
            >
              <img
                src={assetUrl(b.image)}
                alt=""
                className="bestiary-avatar h-10 w-10 border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)]"
              />
              <span className="font-display text-[10px] tracking-wider text-[var(--color-gold)]">
                {name}
              </span>
            </button>
          )
        })}
      </div>

      {boss && (
        <div className="panel space-y-4 p-4">
          <div className="flex flex-wrap items-start gap-4">
            <img
              src={assetUrl(boss.image)}
              alt=""
              className="bestiary-avatar h-32 w-32 border border-[var(--color-gold)] bg-[var(--color-charcoal)]"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs tracking-widest text-[var(--color-gold)]">
                {t('monthBoss')}
              </p>
              <h3 className="font-display text-xl text-[var(--color-gold)]">
                {pickL(boss as Record<string, unknown>, 'name', locale)}
              </h3>
              <p className="mt-1 text-xs opacity-60">
                {boss.id} · {boss.type}
              </p>
              <p className="mt-2 text-sm opacity-85">
                {pickL(boss as Record<string, unknown>, 'lore', locale)}
              </p>
            </div>
          </div>

          {bossAvatars.length > 0 && (
            <div>
              <h4 className="mb-2 font-display text-xs tracking-widest text-[var(--color-gold)]">
                {t('pickAvatar')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {bossAvatars.map((path) => (
                  <img
                    key={path}
                    src={assetUrl(path)}
                    alt=""
                    className="bestiary-avatar h-16 w-16 border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)]"
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-2 font-display text-xs tracking-widest text-[var(--color-gold)]">
              {t('weeklyVassals')}
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              {(boss.vassals || []).map((v) => {
                const vAvatars = (v.avatars || []).filter(
                  (p, i, arr) => p && p !== v.image && arr.indexOf(p) === i,
                )
                return (
                  <div
                    key={v.id}
                    className="border border-[var(--color-gold-dim)]/40 bg-[var(--color-charcoal)]/40 p-3"
                  >
                    <img
                      src={assetUrl(v.image)}
                      alt=""
                      className="bestiary-avatar mx-auto mb-2 h-24 w-24 border border-[var(--color-gold-dim)]"
                    />
                    <p className="text-center font-display text-xs text-[var(--color-gold)]">
                      {pickL(v as Record<string, unknown>, 'name', locale)}
                    </p>
                    <p className="mt-1 text-center text-[11px] opacity-70">
                      {pickL(v as Record<string, unknown>, 'lore', locale)}
                    </p>
                    {vAvatars.length > 0 && (
                      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                        {vAvatars.map((path) => (
                          <img
                            key={path}
                            src={assetUrl(path)}
                            alt=""
                            className="bestiary-avatar h-12 w-12 border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)]"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
