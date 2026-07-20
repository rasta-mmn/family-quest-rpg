type Props = { value: number; max?: number; label?: string }

export function XPBar({ value, max = 400, label }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full">
      {(label || true) && (
        <div className="sheet-label mb-1 flex justify-between font-display text-xs tracking-widest">
          <span>{label || 'XP'}</span>
          <span className="sheet-title font-body tabular-nums">
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-3 overflow-hidden border border-[var(--sheet-fg-muted,var(--color-gold))] bg-black/60">
        <div
          className="xp-fill h-full bg-[var(--sheet-fg,var(--color-gold))]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
