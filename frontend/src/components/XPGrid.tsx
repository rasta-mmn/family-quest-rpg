import { useLocale } from '../lib/i18n'

type Props = { filled: boolean[]; label?: string }

export function XPGrid({ filled, label }: Props) {
  const { t } = useLocale()
  return (
    <div>
      <div className="mb-2 font-display text-xs tracking-widest text-[var(--color-gold)]">
        {label || t('xpSquares')}
      </div>
      <div className="flex gap-2">
        {filled.map((on, i) => (
          <div
            key={i}
            className={`h-9 w-9 border-2 border-[var(--color-gold)] transition-colors duration-150 ${
              on
                ? 'bg-[var(--color-gold)] shadow-[0_0_12px_oklch(0.75_0.12_85_/_0.45)]'
                : 'bg-[var(--color-charcoal)]'
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
