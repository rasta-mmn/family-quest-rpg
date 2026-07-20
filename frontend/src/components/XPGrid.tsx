import { useLocale } from '../lib/i18n'

type Props = {
  filled: boolean[]
  label?: string
  /** Compact squares for week header */
  size?: 'md' | 'sm'
  hideLabel?: boolean
}

export function XPGrid({ filled, label, size = 'md', hideLabel }: Props) {
  const { t } = useLocale()
  const box = size === 'sm' ? 'h-5 w-5 border' : 'h-9 w-9 border-2'
  return (
    <div className={size === 'sm' ? 'flex items-center gap-2' : ''}>
      {!hideLabel && (
        <div
          className={`font-display tracking-widest text-[var(--sheet-gold,var(--color-gold))] ${
            size === 'sm' ? 'mb-0 text-[9px]' : 'mb-2 text-xs'
          }`}
        >
          {label || t('xpSquares')}
        </div>
      )}
      <div className={`flex ${size === 'sm' ? 'gap-1' : 'gap-2'}`}>
        {filled.map((on, i) => (
          <div
            key={i}
            className={`${box} border-[var(--sheet-gold,var(--color-gold))] transition-colors duration-150 ${
              on
                ? 'bg-[var(--sheet-gold,var(--color-gold))]'
                : 'bg-black/40'
            }`}
            aria-label={
              on ? t('squareFilled', { n: i + 1 }) : t('squareEmpty', { n: i + 1 })
            }
          />
        ))}
      </div>
    </div>
  )
}
