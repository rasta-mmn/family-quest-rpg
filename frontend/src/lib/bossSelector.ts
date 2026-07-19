import type { BossEntry, BestiaryTheme } from './types'

/** Pick 4 bosses for a month theme (1 per week), from bestiary order. */
export function selectBosses(
  themes: Record<string, BestiaryTheme>,
  themeKey: string,
  weeks: string[] = [],
): BossEntry[] {
  const theme = themes[themeKey]
  const enemies = theme?.enemies?.slice(0, 4) ?? []
  return enemies.map((e, i) => ({
    ...e,
    week: weeks[i],
    collective: true,
    points: 30,
    mission_redacted: `Missão Coletiva ${['I', 'II', 'III', 'IV'][i] ?? i + 1}`,
  }))
}

export function themeKeys(themes: Record<string, BestiaryTheme>): string[] {
  return Object.keys(themes)
}
