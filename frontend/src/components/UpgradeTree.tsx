import type { ClassDef } from '../lib/types'
import { pickL, useLocale } from '../lib/i18n'

type Props = {
  classDef?: ClassDef
  monthsCompleted?: number
}

export function UpgradeTree({ classDef, monthsCompleted = 0 }: Props) {
  const { locale, t } = useLocale()
  if (!classDef) {
    return <p className="opacity-70">{t('treeUnavailable')}</p>
  }
  const className = pickL(classDef as Record<string, unknown>, 'name', locale)
  return (
    <div className="panel p-4">
      <h3 className="mb-3 font-display text-sm text-[var(--color-gold)]">
        {t('upgradeTree')} — {className}
      </h3>
      <ol className="space-y-2">
        {classDef.upgrades.map((u) => {
          const unlocked = monthsCompleted >= u.month
          return (
            <li
              key={u.month}
              className={`flex gap-3 border-l-2 pl-3 ${
                unlocked ? 'border-[var(--color-gold)]' : 'border-[var(--color-gold-dim)]/40 opacity-55'
              }`}
            >
              <span className="font-display text-xs text-[var(--color-gold)]">M{u.month}</span>
              <div>
                <div className="font-body font-semibold">
                  {pickL(u as Record<string, unknown>, 'name', locale)}
                </div>
                <div className="text-sm opacity-75">
                  {pickL(u as Record<string, unknown>, 'description', locale)}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
