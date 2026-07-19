import type { ClassDef } from '../lib/types'

type Props = {
  classDef?: ClassDef
  monthsCompleted?: number
}

export function UpgradeTree({ classDef, monthsCompleted = 0 }: Props) {
  if (!classDef) {
    return <p className="opacity-70">Árvore de upgrades indisponível.</p>
  }
  return (
    <div className="panel p-4">
      <h3 className="mb-3 font-display text-sm text-[var(--color-gold)]">
        Árvore — {classDef.name}
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
                <div className="font-body font-semibold">{u.name}</div>
                <div className="text-sm opacity-75">{u.description}</div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
