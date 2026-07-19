import type { DayLog, Objective } from '../lib/types'
import { DAY_LABELS, pickL, useLocale } from '../lib/i18n'

const DAY_ORDER = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const

type Props = {
  days?: Record<string, DayLog>
  objectives: Objective[]
  editable?: boolean
  onChange?: (days: Record<string, DayLog>) => void
}

function emptyDay(): DayLog {
  return { obj1: false, obj2: false, obj3: false, extras: 0 }
}

export function TaskList({ days, objectives, editable, onChange }: Props) {
  const { locale, t } = useLocale()
  const objs = objectives.slice(0, 3)

  function setDay(dayKey: string, patch: Partial<DayLog>) {
    if (!editable || !onChange) return
    const next: Record<string, DayLog> = {}
    for (const d of DAY_ORDER) {
      next[d] = { ...(days?.[d] || emptyDay()) }
    }
    next[dayKey] = { ...next[dayKey], ...patch }
    onChange(next)
  }

  return (
    <div className="panel overflow-x-auto p-3">
      <table className="w-full min-w-[320px] border-collapse text-sm">
        <thead>
          <tr className="font-display text-xs tracking-widest text-[var(--color-gold)]">
            <th className="p-1 text-left">{t('day')}</th>
            {objs.map((o) => (
              <th key={o.id} className="p-1 text-center normal-case tracking-normal">
                {pickL(o as Record<string, unknown>, 'name', locale)}
              </th>
            ))}
            <th className="p-1 text-center">Ex</th>
          </tr>
        </thead>
        <tbody>
          {DAY_ORDER.map((d) => {
            const day = days?.[d] || emptyDay()
            return (
              <tr key={d} className="border-t border-[var(--color-gold-dim)]/30">
                <td className="p-1 text-[var(--color-gold)]">{DAY_LABELS[d][locale]}</td>
                {(['obj1', 'obj2', 'obj3'] as const).map((k) => (
                  <td key={k} className="p-1 text-center">
                    {editable ? (
                      <button
                        type="button"
                        onClick={() => setDay(d, { [k]: !day[k] })}
                        className={`inline-block h-5 w-5 border border-[var(--color-gold)] ${
                          day[k] ? 'rotate-3 bg-[var(--color-gold)]' : 'bg-transparent'
                        }`}
                        aria-label={day[k] ? t('done') : t('pending')}
                        aria-pressed={day[k]}
                      />
                    ) : (
                      <span
                        className={`inline-block h-4 w-4 border border-[var(--color-gold)] ${
                          day[k] ? 'rotate-3 bg-[var(--color-gold)]' : 'bg-transparent'
                        }`}
                        aria-label={day[k] ? t('done') : t('pending')}
                      />
                    )}
                  </td>
                ))}
                <td className="p-1 text-center tabular-nums opacity-80">
                  {editable ? (
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={day.extras}
                      onChange={(e) =>
                        setDay(d, { extras: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="w-12 border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-1 py-0.5 text-center"
                    />
                  ) : (
                    day.extras
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
