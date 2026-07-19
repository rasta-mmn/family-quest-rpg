import { assetUrl } from '../lib/githubApi'
import type { BossEntry } from '../lib/types'

type Props = {
  boss: BossEntry
  completed?: boolean
  large?: boolean
}

export function BossCard({ boss, completed, large }: Props) {
  const img = boss.image || `docs/assets/enemies/${boss.type || 'monstro'}.svg`
  return (
    <article
      className={`panel relative overflow-hidden ${large ? 'p-5' : 'p-3'} ${
        completed ? 'opacity-80' : ''
      }`}
    >
      {completed && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-6xl text-red-700/80"
          aria-hidden
        >
          ✕
        </div>
      )}
      <div className={`flex ${large ? 'gap-5' : 'gap-3'} items-start`}>
        <img
          src={assetUrl(img)}
          alt=""
          className={`${large ? 'h-24 w-24' : 'h-14 w-14'} border border-[var(--color-gold)] bg-[var(--color-charcoal)]`}
        />
        <div>
          <p className="font-display text-xs tracking-widest text-[var(--color-gold-dim)]">
            BOSS coletivo
          </p>
          <h2 className={`font-display text-[var(--color-gold)] ${large ? 'text-2xl' : 'text-base'} normal-case tracking-wide`}>
            {boss.name}
          </h2>
          {boss.description && (
            <p className="mt-2 max-w-prose text-sm opacity-85">{boss.description}</p>
          )}
          {boss.mission_redacted && (
            <p className="mt-2 text-sm italic opacity-70">{boss.mission_redacted}</p>
          )}
          <p className="mt-2 font-body tabular-nums text-[var(--color-gold)]">
            +{boss.points ?? 30} de glória para todos
          </p>
        </div>
      </div>
    </article>
  )
}
