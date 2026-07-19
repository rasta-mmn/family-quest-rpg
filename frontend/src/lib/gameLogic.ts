import type { DayLog, PointsConfig, WeeklyLog } from './types'

const DEFAULT_POINTS: PointsConfig = {
  per_task: 30,
  per_extra: 2.5,
  boss: 30,
  weekly_target: 100,
  monthly_xp: 400,
}

/** Weekly score: base + extras + boss (mechanics.md). */
export function calcWeeklyPoints(
  days: Record<string, DayLog>,
  bossCompleted: boolean,
  points: Partial<PointsConfig> = {},
): number {
  const p = { ...DEFAULT_POINTS, ...points }
  let objCount = 0
  let extras = 0
  for (const day of Object.values(days || {})) {
    if (day.obj1) objCount++
    if (day.obj2) objCount++
    if (day.obj3) objCount++
    extras += Number(day.extras) || 0
  }
  return objCount * p.per_task + extras * p.per_extra + (bossCompleted ? p.boss : 0)
}

export function weekFromLog(log: WeeklyLog, points?: Partial<PointsConfig>): number {
  if (typeof log.total_points === 'number' && log.total_points > 0) {
    return log.total_points
  }
  return calcWeeklyPoints(log.days, Boolean(log.boss?.completed), points)
}

/** 1 XP square when weekly total ≥ target. */
export function xpSquaresFromWeek(total: number, weeklyTarget = 100): number {
  return total >= weeklyTarget ? 1 : 0
}

export function monthXpFromWeekTotals(totals: number[], weeklyTarget = 100): number {
  return totals.reduce((sum, t) => sum + xpSquaresFromWeek(t, weeklyTarget) * weeklyTarget, 0)
}

export function filledSquares(totals: number[], weeklyTarget = 100, max = 4): boolean[] {
  return Array.from({ length: max }, (_, i) =>
    i < totals.length ? totals[i] >= weeklyTarget : false,
  )
}

export function rankPlayers(
  rows: { id: string; name: string; points: number; className: string }[],
) {
  return [...rows].sort((a, b) => b.points - a.points)
}
