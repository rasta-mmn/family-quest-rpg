import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { loadBestiaryRoster } from '../lib/bestiaryRoster'
import { assetUrl } from '../lib/githubApi'
import { pickL, useLocale } from '../lib/i18n'
import type { BestiaryRosterBoss, BestiaryRosterVassal } from '../lib/types'

export type RosterPick = {
  id: string
  name: string
  name_pt?: string
  avatar: string
  lore?: string
  lore_pt?: string
  role: 'boss' | 'vassal'
}

type Props = {
  /** Hint only — all creatures stay pickable. */
  prefer?: 'boss' | 'vassal'
  onPick: (pick: RosterPick) => void
  onClose: () => void
}

type Flat = RosterPick & { family: string }

export function BestiaryRosterPicker({ prefer, onPick, onClose }: Props) {
  const { locale, t } = useLocale()
  const [items, setItems] = useState<Flat[]>([])
  const [loading, setLoading] = useState(true)
  const [family, setFamily] = useState<string>('all')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await loadBestiaryRoster()
        if (cancelled) return
        const flat: Flat[] = []
        for (const b of list) {
          flat.push({
            id: b.id,
            name: b.name,
            name_pt: b.name_pt,
            avatar: b.image,
            lore: b.lore,
            lore_pt: b.lore_pt,
            role: 'boss',
            family: b.id,
          })
          const extras = [
            ...(b.avatar ? [b.avatar] : []),
            ...(b.avatars || []),
          ].filter((p, i, arr) => p && p !== b.image && arr.indexOf(p) === i)
          extras.forEach((path, i) => {
            flat.push({
              id: `${b.id}_avatar_${i}`,
              name: b.name,
              name_pt: b.name_pt,
              avatar: path,
              lore: b.lore,
              lore_pt: b.lore_pt,
              role: 'boss',
              family: b.id,
            })
          })
          for (const v of b.vassals || []) {
            flat.push({
              id: v.id,
              name: v.name,
              name_pt: v.name_pt,
              avatar: v.image,
              lore: v.lore,
              lore_pt: v.lore_pt,
              role: 'vassal',
              family: b.id,
            })
            const vExtras = (v.avatars || []).filter(
              (p, i, arr) => p && p !== v.image && arr.indexOf(p) === i,
            )
            vExtras.forEach((path, i) => {
              flat.push({
                id: `${v.id}_avatar_${i}`,
                name: v.name,
                name_pt: v.name_pt,
                avatar: path,
                lore: v.lore,
                lore_pt: v.lore_pt,
                role: 'vassal',
                family: b.id,
              })
            })
          }
        }
        if (prefer === 'boss') {
          flat.sort((a, b) => Number(b.role === 'boss') - Number(a.role === 'boss'))
        } else if (prefer === 'vassal') {
          flat.sort((a, b) => Number(b.role === 'vassal') - Number(a.role === 'vassal'))
        }
        setItems(flat)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [prefer])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const families = ['all', ...new Set(items.map((i) => i.family))]
  const shown = family === 'all' ? items : items.filter((i) => i.family === family)

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3"
      role="dialog"
      aria-modal="true"
      aria-label={t('pickAvatar')}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl animate-[page-in_200ms_ease-out] overflow-y-auto border border-[var(--color-gold)] bg-[var(--color-charcoal)] p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-xs tracking-widest text-[var(--color-gold)]">
              {t('pickAvatar')}
            </h3>
            <p className="mt-1 text-xs opacity-70">{t('pickAvatarHelp')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-[var(--color-gold-dim)] px-2 py-1 text-xs text-[var(--color-gold)]"
          >
            {t('close')}
          </button>
        </div>

        {loading ? (
          <p className="text-sm opacity-70">{t('loadingAdmin')}</p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {families.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFamily(f)}
                  className={`border px-2 py-1 font-display text-[10px] ${
                    f === family
                      ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                      : 'border-[var(--color-gold-dim)] opacity-70'
                  }`}
                >
                  {f === 'all' ? t('allFamilies') : f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {shown.map((c) => (
                <button
                  key={`${c.family}-${c.id}`}
                  type="button"
                  onClick={() =>
                    onPick({
                      id: c.id,
                      name: c.name,
                      name_pt: c.name_pt,
                      avatar: c.avatar,
                      lore: c.lore,
                      lore_pt: c.lore_pt,
                      role: c.role,
                    })
                  }
                  className="flex flex-col items-center gap-1 border border-[var(--color-gold-dim)]/50 bg-[var(--color-parchment-deep)]/20 p-2 text-center hover:border-[var(--color-gold)]"
                >
                  <img
                    src={assetUrl(c.avatar)}
                    alt=""
                    className="bestiary-avatar h-24 w-24"
                  />
                  <span className="font-display text-[10px] leading-tight text-[var(--color-gold)]">
                    {pickL(c as Record<string, unknown>, 'name', locale)}
                  </span>
                  <span className="text-[9px] opacity-50">
                    {c.role === 'boss' ? t('monthBossLabel') : t('vassal')}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

/** @deprecated shape kept for type imports elsewhere */
export type { BestiaryRosterBoss, BestiaryRosterVassal }
