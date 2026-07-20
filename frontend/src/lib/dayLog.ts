import type { DayExtra, DayLog, DayObjective, WeeklyLog } from './types'

export const WEEKDAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const

export function emptyDay(): DayLog {
  return {
    objectives: [
      { text: '', done: false },
      { text: '', done: false },
      { text: '', done: false },
    ],
    extras: [],
  }
}

function asObj(raw: unknown): DayObjective {
  if (!raw || typeof raw !== 'object') return { text: '', done: false }
  const o = raw as Record<string, unknown>
  return {
    text: typeof o.text === 'string' ? o.text : '',
    done: Boolean(o.done),
  }
}

function asExtra(raw: unknown): DayExtra {
  if (!raw || typeof raw !== 'object') return { text: '' }
  const o = raw as Record<string, unknown>
  return { text: typeof o.text === 'string' ? o.text : String(o.text ?? '') }
}

/** Normalize legacy `{ obj1, obj2, obj3, extras: N }` or new shape. */
export function normalizeDayLog(raw: unknown): DayLog {
  if (!raw || typeof raw !== 'object') return emptyDay()
  const d = raw as Record<string, unknown>

  if (Array.isArray(d.objectives)) {
    const rawObjs = d.objectives as unknown[]
    const objectives = [0, 1, 2].map((i) => asObj(rawObjs[i]))
    const extras = Array.isArray(d.extras) ? d.extras.map(asExtra) : []
    return { objectives, extras }
  }

  // Legacy boolean flags + numeric extras count (no text labels).
  const objectives: DayObjective[] = [
    { text: '', done: Boolean(d.obj1) },
    { text: '', done: Boolean(d.obj2) },
    { text: '', done: Boolean(d.obj3) },
  ]
  const n = Math.max(0, Math.floor(Number(d.extras) || 0))
  const extras: DayExtra[] = Array.from({ length: n }, () => ({ text: '' }))
  return { objectives, extras }
}

export function normalizeWeeklyDays(
  days: Record<string, unknown> | undefined | null,
): Record<string, DayLog> {
  const out: Record<string, DayLog> = {}
  for (const key of WEEKDAYS) {
    out[key] = normalizeDayLog(days?.[key])
  }
  return out
}

export function normalizeWeeklyLog(log: WeeklyLog): WeeklyLog {
  return {
    ...log,
    days: normalizeWeeklyDays(log.days as unknown as Record<string, unknown>),
  }
}

export function countDoneObjectives(day: DayLog): number {
  return day.objectives.filter((o) => o.done).length
}

export function yamlEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export function dayLogToYaml(day: DayLog): string {
  const objs = day.objectives
    .slice(0, 3)
    .map((o) => `{ text: "${yamlEscape(o.text)}", done: ${o.done} }`)
    .join(', ')
  const extras =
    day.extras.length === 0
      ? '[]'
      : `[${day.extras.map((e) => `{ text: "${yamlEscape(e.text)}" }`).join(', ')}]`
  return `{ objectives: [${objs}], extras: ${extras} }`
}
