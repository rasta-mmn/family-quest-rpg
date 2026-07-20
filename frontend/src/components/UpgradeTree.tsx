import type { ClassDef } from '../lib/types'
import { pickL, StableT, useLocale } from '../lib/i18n'

type Props = {
  classDef?: ClassDef
  monthsCompleted?: number
}

export function UpgradeTree({ classDef, monthsCompleted = 0 }: Props) {
  const { locale, t } = useLocale()
  if (!classDef) {
    return <p className="sheet-muted">{t('treeUnavailable')}</p>
  }
  const earned = classDef.upgrades.filter((u) => monthsCompleted >= u.month)
  const className = pickL(classDef as Record<string, unknown>, 'name', locale)

  return (
    <div className="sheet-panel border border-[var(--sheet-accent,#A87900)]/40 p-3">
      <h3 className="sheet-title mb-2 font-display text-xs tracking-widest">
        <StableT k="earnedUpgrades" align="start" /> — {className}
      </h3>
      {earned.length === 0 ? (
        <p className="sheet-muted text-sm">
          <StableT k="noUpgradesYet" align="start" />
        </p>
      ) : (
        <ol className="space-y-2">
          {earned.map((u) => (
            <li
              key={u.month}
              className="flex gap-3 border-l-2 border-[var(--sheet-fg-muted,#c4c4c4)] pl-3"
            >
              <span className="sheet-label font-display text-xs">M{u.month}</span>
              <div>
                <div className="font-body font-semibold">
                  {pickL(u as Record<string, unknown>, 'name', locale)}
                </div>
                <div className="sheet-muted text-sm">
                  {pickL(u as Record<string, unknown>, 'description', locale)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
