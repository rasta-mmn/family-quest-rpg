import type { DayLog, Objective } from '../lib/types'
import { DAY_LABELS, pickL, useLocale } from '../lib/i18n'

const DAY_ORDER = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const

type Props = {
  days?: Record<string, DayLog>
  objectives: Objective[]
}

export function TaskList({ days, objectives }: Props) {
  const { locale, t } = useLocale()
  const objs = objectives.slice(0, 3)
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
            const day = days?.[d]
            return (
              <tr key={d} className="border-t border-[var(--color-gold-dim)]/30">
                <td className="p-1 text-[var(--color-gold)]">{DAY_LABELS[d][locale]}</td>
                {(['obj1', 'obj2', 'obj3'] as const).map((k) => (
                  <td key={k} className="p-1 text-center">
                    <span
                      className={`inline-block h-4 w-4 border border-[var(--color-gold)] ${
                        day?.[k] ? 'rotate-3 bg-[var(--color-gold)]' : 'bg-transparent'
                      }`}
                      aria-label={day?.[k] ? t('done') : t('pending')}
                    />
                  </td>
                ))}
                <td className="p-1 text-center tabular-nums opacity-80">{day?.extras ?? 0}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
