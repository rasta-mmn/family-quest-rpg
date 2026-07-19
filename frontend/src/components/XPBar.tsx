type Props = { value: number; max?: number; label?: string }

export function XPBar({ value, max = 400, label }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full">
      {(label || true) && (
        <div className="mb-1 flex justify-between font-display text-xs tracking-widest text-[var(--color-gold)]">
          <span>{label || 'XP'}</span>
          <span className="font-body tabular-nums">
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-3 overflow-hidden border border-[var(--color-gold)] bg-[var(--color-charcoal)]">
        <div
          className="xp-fill h-full bg-[var(--color-gold)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
