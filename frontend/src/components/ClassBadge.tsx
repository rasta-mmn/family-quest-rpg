const CLASS_COLORS: Record<string, string> = {
  guerreiro: 'var(--color-warrior)',
  bardo: 'var(--color-bard)',
  mago: 'var(--color-mage)',
  ladino: 'var(--color-rogue)',
}

const CLASS_GLYPH: Record<string, string> = {
  guerreiro: '⚔',
  bardo: '♫',
  mago: '✧',
  ladino: '🗡',
}

type Props = { className: string; size?: 'sm' | 'md' }

export function ClassBadge({ className, size = 'md' }: Props) {
  const key = className.toLowerCase()
  const dim = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-12 w-12 text-base'
  return (
    <span
      className={`inline-flex ${dim} items-center justify-center rounded-full border-2 border-[var(--color-gold)] font-display text-[var(--color-gold)]`}
      style={{ background: CLASS_COLORS[key] || 'var(--color-parchment)' }}
      title={className}
      aria-label={className}
    >
      {CLASS_GLYPH[key] || className.slice(0, 1).toUpperCase()}
    </span>
  )
}

export function classColor(className: string): string {
  return CLASS_COLORS[className.toLowerCase()] || 'var(--color-gold)'
}
