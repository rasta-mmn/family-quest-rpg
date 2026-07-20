import { useEffect, useState } from 'react'
import type { DayLog } from '../lib/types'
import { emptyDay, WEEKDAYS } from '../lib/dayLog'
import { DAY_LABELS, StableT, useLocale } from '../lib/i18n'

type Props = {
  days?: Record<string, DayLog>
  editable?: boolean
  onChange?: (days: Record<string, DayLog>) => void
}

function cloneDays(days?: Record<string, DayLog>): Record<string, DayLog> {
  const next: Record<string, DayLog> = {}
  for (const d of WEEKDAYS) {
    const day = days?.[d] || emptyDay()
    next[d] = {
      objectives: [0, 1, 2].map((i) => ({
        text: day.objectives[i]?.text || '',
        done: Boolean(day.objectives[i]?.done),
      })),
      extras: (day.extras || []).map((e) => ({ text: e.text || '' })),
    }
  }
  return next
}

function dayDoneCount(day: DayLog): number {
  return day.objectives.filter((o) => o.done).length
}

export function TaskList({ days, editable, onChange }: Props) {
  const { locale, t } = useLocale()
  const [local, setLocal] = useState(() => cloneDays(days))
  const [active, setActive] = useState<(typeof WEEKDAYS)[number]>('seg')
  const [expandAll, setExpandAll] = useState(false)

  useEffect(() => {
    setLocal(cloneDays(days))
  }, [days])

  function update(
    dayKey: string,
    mutator: (day: DayLog) => DayLog,
    save: boolean,
  ) {
    if (WEEKDAYS.includes(dayKey as (typeof WEEKDAYS)[number])) {
      setActive(dayKey as (typeof WEEKDAYS)[number])
    }
    setLocal((prev) => {
      const next = cloneDays(prev)
      next[dayKey] = mutator(next[dayKey] || emptyDay())
      if (save) onChange?.(next)
      return next
    })
  }

  function renderDay(d: (typeof WEEKDAYS)[number], compact?: boolean) {
    const day = local[d] || emptyDay()
    const objectives = [0, 1, 2].map((i) => day.objectives[i] || { text: '', done: false })
    return (
      <div
        key={d}
        className={`sheet-panel border border-[var(--sheet-accent,#A87900)]/40 ${
          compact ? 'p-2' : 'p-3'
        }`}
      >
        {expandAll && (
          <h3 className="sheet-label mb-1.5 font-display text-[10px] tracking-widest">
            {DAY_LABELS[d][locale]}
          </h3>
        )}
        <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-center gap-2">
              {editable ? (
                <button
                  type="button"
                  onClick={() =>
                    update(
                      d,
                      (cur) => ({
                        ...cur,
                        objectives: [0, 1, 2].map((idx) => {
                          const o = cur.objectives[idx] || { text: '', done: false }
                          return idx === i ? { ...o, done: !o.done } : o
                        }),
                      }),
                      true,
                    )
                  }
                  className={`inline-block h-5 w-5 shrink-0 border border-[var(--sheet-fg-muted,#c4c4c4)] ${
                    obj.done ? 'rotate-3 bg-[var(--sheet-fg,#ececec)]' : 'bg-transparent'
                  }`}
                  aria-label={obj.done ? t('done') : t('pending')}
                  aria-pressed={obj.done}
                />
              ) : (
                <span
                  className={`inline-block h-4 w-4 shrink-0 border border-[var(--sheet-fg-muted,#c4c4c4)] ${
                    obj.done ? 'rotate-3 bg-[var(--sheet-fg,#ececec)]' : 'bg-transparent'
                  }`}
                />
              )}
              {editable ? (
                <input
                  value={obj.text}
                  placeholder={`${t('objective')} ${i + 1}`}
                  onChange={(e) => {
                    const text = e.target.value
                    update(
                      d,
                      (cur) => ({
                        ...cur,
                        objectives: [0, 1, 2].map((idx) => {
                          const o = cur.objectives[idx] || { text: '', done: false }
                          return idx === i ? { ...o, text } : o
                        }),
                      }),
                      false,
                    )
                  }}
                  onBlur={() => update(d, (cur) => cur, true)}
                  className="min-w-0 flex-1 border border-[var(--sheet-fg-dim,#a8a8a8)] px-2 py-1 text-sm"
                />
              ) : (
                <span className="text-sm">{obj.text || `—`}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 space-y-1.5 border-t border-[var(--sheet-fg-dim,#a8a8a8)]/40 pt-2">
          <div className="flex items-center justify-between">
            <span className="sheet-label font-display text-[10px] tracking-widest">
              {t('extras')}
              {!editable && day.extras.length > 0 ? ` · ${day.extras.length}` : ''}
            </span>
            {editable && (
              <button
                type="button"
                onClick={() =>
                  update(
                    d,
                    (cur) => ({ ...cur, extras: [...cur.extras, { text: '' }] }),
                    true,
                  )
                }
                className="border border-[var(--sheet-fg-muted,#c4c4c4)] px-2 py-0.5 text-[10px] uppercase tracking-widest hover:border-[var(--sheet-fg,#ececec)]"
              >
                + {t('extra')}
              </button>
            )}
          </div>
          {day.extras.map((ex, i) => (
            <div key={i} className="flex items-center gap-2">
              {editable ? (
                <>
                  <input
                    value={ex.text}
                    placeholder={`${t('extra')} ${i + 1}`}
                    onChange={(e) => {
                      const text = e.target.value
                      update(
                        d,
                        (cur) => ({
                          ...cur,
                          extras: cur.extras.map((x, idx) => (idx === i ? { text } : x)),
                        }),
                        false,
                      )
                    }}
                    onBlur={() => update(d, (cur) => cur, true)}
                    className="min-w-0 flex-1 border border-[var(--sheet-fg-dim,#a8a8a8)] px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        d,
                        (cur) => ({
                          ...cur,
                          extras: cur.extras.filter((_, idx) => idx !== i),
                        }),
                        true,
                      )
                    }
                    className="px-1 text-xs"
                    aria-label={t('remove')}
                  >
                    ×
                  </button>
                </>
              ) : (
                <span className="text-sm">{ex.text || `—`}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const visibleDays = expandAll ? WEEKDAYS : [active]

  return (
    <div className="space-y-2">
      <div className="sheet-panel flex flex-wrap items-center gap-1.5 border border-[var(--sheet-accent,#A87900)]/35 px-2 py-1.5">
        <div className="sheet-day-tabs" role="tablist" aria-label={t('weekProgress')}>
          {WEEKDAYS.map((d) => {
            const n = dayDoneCount(local[d] || emptyDay())
            const on = !expandAll && active === d
            return (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={on}
                disabled={expandAll}
                title={`${DAY_LABELS[d][locale]} ${n}/3`}
                onClick={() => {
                  setExpandAll(false)
                  setActive(d)
                }}
                className={`sheet-day-tab border py-1 font-display text-[10px] tracking-wide ${
                  on
                    ? 'border-[var(--sheet-fg,#ececec)] bg-black/50'
                    : 'border-[var(--sheet-fg-dim,#a8a8a8)]'
                } ${expandAll ? 'cursor-default' : ''}`}
              >
                <span className="block truncate">{DAY_LABELS[d][locale]}</span>
                <span className="sheet-muted block tabular-nums leading-none">{n}/3</span>
              </button>
            )
          })}
        </div>
        {editable && (
          <button
            type="button"
            onClick={() => setExpandAll((v) => !v)}
            className={`shrink-0 border px-1.5 py-1 text-center font-display text-[10px] tracking-widest ${
              expandAll
                ? 'border-[var(--sheet-fg,#ececec)]'
                : 'border-[var(--sheet-fg-muted,#c4c4c4)]'
            }`}
          >
            <StableT
              k={expandAll ? 'collapseDays' : 'editAllDays'}
              also={['editAllDays', 'collapseDays']}
            />
          </button>
        )}
      </div>

      {expandAll ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {visibleDays.map((d) => renderDay(d, true))}
        </div>
      ) : (
        renderDay(active)
      )}
    </div>
  )
}
