import { Link } from 'wouter'
import { useEffect, type ReactNode } from 'react'
import { BossCard } from './BossCard'
import { XPGrid } from './XPGrid'
import { pickL, useLocale } from '../lib/i18n'
import type { BossEntry, FamilyConfig } from '../lib/types'

type Props = {
  open: boolean
  onClose: () => void
  campLore?: string
  monthBoss: BossEntry | null
  weekBoss: BossEntry | null
  isBossWeek: boolean
  weekDone: boolean
  sampleSquares: boolean[]
  themeName?: string
  monthTheme: string
  weeklyTarget: number
  families: FamilyConfig[]
  activeFamilyId?: string
  onSwitchFamily: (id: string) => void
}

export function ChronicleDrawer({
  open,
  onClose,
  campLore,
  monthBoss,
  weekBoss,
  isBossWeek,
  weekDone,
  sampleSquares,
  themeName,
  monthTheme,
  weeklyTarget,
  families,
  activeFamilyId,
  onSwitchFamily,
}: Props) {
  const { locale, t } = useLocale()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="chronicle-drawer flex items-end justify-end md:items-stretch">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={t('closeGrimoire')}
        onClick={onClose}
      />
      <aside
        className="hud-panel relative flex max-h-[55vh] w-full flex-col overflow-hidden md:max-h-none md:w-[min(26rem,42vw)] md:border-l"
        role="dialog"
        aria-modal="true"
        aria-label={t('openGrimoire')}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-gold)]/30 px-4 py-3">
          <p className="font-display text-xs tracking-widest text-[var(--color-gold)]">
            {t('grimoireTag')}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="font-display text-xs tracking-widest text-[var(--color-gold)]/80 hover:text-[var(--color-gold)]"
          >
            {t('closeGrimoire')}
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <section>
            <p className="mb-2 font-display text-[10px] tracking-widest text-[var(--color-gold)]">
              {t('families')}
            </p>
            <div className="flex flex-wrap gap-2">
              {families.map((f) => {
                const active = f.id === activeFamilyId
                const label = pickL(f as unknown as Record<string, unknown>, 'name', locale)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onSwitchFamily(f.id)}
                    className={`border px-2.5 py-1 font-display text-[10px] tracking-wider ${
                      active
                        ? 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
                        : 'border-[var(--color-gold)]/40 text-[var(--color-ink)]/80 hover:border-[var(--color-gold)]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
              <Link
                href="/create-family"
                className="border border-dashed border-[var(--color-gold)]/50 px-2.5 py-1 font-display text-[10px] tracking-wider text-[var(--color-gold)]/90 hover:border-[var(--color-gold)]"
              >
                {t('createFamilyNav')}
              </Link>
            </div>
          </section>

          {campLore ? (
            <DrawerBlock title={t('campaignLore')}>
              <p className="font-read text-base leading-relaxed opacity-90">{campLore}</p>
            </DrawerBlock>
          ) : null}

          {monthBoss && !isBossWeek && <BossCard large boss={monthBoss} />}
          {weekBoss && (
            <BossCard
              large={isBossWeek}
              completed={weekDone}
              boss={{
                ...weekBoss,
                image:
                  weekBoss.image ||
                  `docs/assets/enemies/${weekBoss.type || 'monstro'}.svg`,
              }}
            />
          )}

          <DrawerBlock title={t('xpMirror')}>
            <XPGrid filled={sampleSquares} label={t('xpMirror')} />
            <p className="mt-2 text-sm opacity-70">
              {t('monthTheme')}: {themeName || monthTheme}. {t('weeklyTarget')}: {weeklyTarget}{' '}
              pts.
            </p>
          </DrawerBlock>
        </div>
      </aside>
    </div>
  )
}

function DrawerBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded border border-[var(--color-gold)]/25 bg-[var(--color-charcoal)]/35 p-3">
      <p className="mb-2 font-display text-[10px] tracking-widest text-[var(--color-gold)]">
        {title}
      </p>
      {children}
    </section>
  )
}
