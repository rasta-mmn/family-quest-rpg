import { Link } from 'wouter'
import { assetUrl } from '../lib/githubApi'
import { pickL, useLocale } from '../lib/i18n'
import { ClassBadge } from './ClassBadge'
import type { Profile } from '../lib/types'

export type PartyHero = {
  id: string
  profile: Profile
  weekPoints: number
  classLabel?: string
}

type Props = {
  heroes: PartyHero[]
}

export function PartyBar({ heroes }: Props) {
  const { locale, t } = useLocale()

  if (!heroes.length) return null

  return (
    <div
      className="hud-panel flex max-w-full gap-2 overflow-x-auto px-2 py-2"
      role="list"
      aria-label={t('heroes')}
    >
      {heroes.map((h) => {
        const name = pickL(h.profile as Record<string, unknown>, 'character_name', locale)
        return (
          <Link
            key={h.id}
            href={`/player/${h.id}`}
            role="listitem"
            title={name}
            className="group flex min-w-[4.5rem] max-w-[5.5rem] shrink-0 flex-col items-center gap-1 rounded px-1.5 py-1 transition duration-150 hover:bg-[var(--color-parchment-deep)]/80"
          >
            <div className="relative">
              <img
                src={assetUrl(h.profile.photo || h.profile.avatar || '')}
                alt=""
                className="h-12 w-12 rounded-full border-2 border-[var(--color-gold)] object-cover bg-[var(--color-charcoal)] md:h-14 md:w-14"
              />
              <div className="absolute -bottom-1 -right-1 scale-75">
                <ClassBadge className={h.profile.class} size="sm" />
              </div>
            </div>
            <p className="w-full truncate text-center font-display text-[9px] tracking-wide text-[var(--color-gold)] normal-case">
              {name}
            </p>
            <p className="text-[10px] tabular-nums opacity-80">
              {h.weekPoints} {t('ptsThisWeek')}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
