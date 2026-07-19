import type { DayLog, Objective } from '../lib/types'

const DAY_ORDER = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const
const DAY_LABEL: Record<string, string> = {
  seg: 'Seg',
  ter: 'Ter',
  qua: 'Qua',
  qui: 'Qui',
  sex: 'Sex',
  sab: 'Sáb',
  dom: 'Dom',
}

type Props = {
  objectives: Objective[]
  days?: Record<string, DayLog>
  readOnly?: boolean
}

export function TaskList({ objectives, days }: Props) {
  const objs = objectives.slice(0, 3)
  return (
    <div className="panel overflow-x-auto p-3">
      <table className="w-full min-w-[320px] border-collapse text-sm">
        <thead>
          <tr className="font-display text-xs tracking-widest text-[var(--color-gold)]">
            <th className="p-1 text-left">Dia</th>
            {objs.map((o) => (
              <th key={o.id} className="p-1 text-center normal-case tracking-normal">
                {o.name}
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
                <td className="p-1 text-[var(--color-gold)]">{DAY_LABEL[d]}</td>
                {(['obj1', 'obj2', 'obj3'] as const).map((k) => (
                  <td key={k} className="p-1 text-center">
                    <span
                      className={`inline-block h-4 w-4 border border-[var(--color-gold)] ${
                        day?.[k] ? 'rotate-3 bg-[var(--color-gold)]' : 'bg-transparent'
                      }`}
                      aria-label={day?.[k] ? 'cumprido' : 'pendente'}
                    />
                  </td>
                ))}
                <td className="p-1 text-center tabular-nums">{day?.extras ?? 0}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
