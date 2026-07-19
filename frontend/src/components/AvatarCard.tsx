import { Link } from 'wouter'
import { assetUrl } from '../lib/githubApi'
import { ClassBadge } from './ClassBadge'
import type { Profile } from '../lib/types'

type Props = {
  profile: Profile
  weekPoints?: number
  href?: string
}

export function AvatarCard({ profile, weekPoints, href }: Props) {
  const inner = (
    <article className="panel group flex gap-3 p-3 transition duration-150 hover:border-[var(--color-gold)]">
      <div className="relative shrink-0">
        <img
          src={assetUrl(profile.photo || '')}
          alt=""
          className="h-16 w-14 object-cover border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)]"
        />
        <div className="absolute -bottom-2 -right-2">
          <ClassBadge className={profile.class} size="sm" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-sm text-[var(--color-gold)] normal-case tracking-wide">
          {profile.character_name}
        </h3>
        <p className="text-sm opacity-80">
          {profile.class} · Nível {profile.level}
        </p>
        {typeof weekPoints === 'number' && (
          <p className="mt-1 font-body text-sm tabular-nums text-[var(--color-gold)]">
            {weekPoints} pts esta semana
          </p>
        )}
      </div>
    </article>
  )
  if (href) {
    return <Link href={href}>{inner}</Link>
  }
  return inner
}
