import { assetUrl } from '../lib/githubApi'
import { pickL, StableT, useLocale } from '../lib/i18n'
import type { BossEntry } from '../lib/types'

type Props = {
  boss: BossEntry
  completed?: boolean
  large?: boolean
}

export function BossCard({ boss, completed, large }: Props) {
  const { locale, t } = useLocale()
  const img = boss.image || `docs/assets/enemies/${boss.type || 'monstro'}.png`
  const name = pickL(boss as Record<string, unknown>, 'name', locale)
  const description = pickL(boss as Record<string, unknown>, 'description', locale)
  const mission = pickL(boss as Record<string, unknown>, 'mission_redacted', locale)

  return (
    <article
      className={`relative overflow-hidden ${large ? 'panel p-5' : 'p-0'} ${
        completed ? 'ring-1 ring-[var(--sheet-fg-muted,#c4c4c4)]' : ''
      }`}
    >
      {completed && (
        <p className="sheet-label mb-1 font-display text-[10px] tracking-widest">
          {t('done').toUpperCase()}
        </p>
      )}
      <div className={`flex ${large ? 'gap-5' : 'gap-3'} items-start`}>
        <img
          src={assetUrl(img)}
          alt=""
          className={`${large ? 'h-24 w-24' : 'h-14 w-14'} border border-[var(--sheet-fg-muted,var(--color-gold))] bg-[var(--color-charcoal)]`}
        />
        <div>
          <p className="sheet-label font-display text-xs tracking-widest">
            <StableT k="collectiveBoss" align="start" />
          </p>
          <h2
            className={`sheet-title font-display ${large ? 'text-2xl' : 'text-base'} normal-case tracking-wide`}
          >
            {name}
          </h2>
          {description && <p className="sheet-muted mt-2 max-w-prose text-sm">{description}</p>}
          {mission && <p className="sheet-dim mt-2 text-sm italic">{mission}</p>}
          <p className="sheet-muted mt-2 font-body tabular-nums">
            +{boss.points ?? 30} <StableT k="gloryForAll" align="start" />
          </p>
        </div>
      </div>
    </article>
  )
}
