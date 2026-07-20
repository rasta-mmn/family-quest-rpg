/** Map legacy theme IDs → 7 life dimensions. */
const ALIASES: Record<string, string> = {
  treino: 'fisico',
  alimentacao: 'fisico',
  saude: 'fisico',
  estudo: 'profissional',
  organizacao: 'profissional',
  financas: 'financas',
  mental: 'mental',
  fisico: 'fisico',
  profissional: 'profissional',
  social: 'social',
  recreativo: 'recreativo',
  espiritual: 'espiritual',
}

export const DIMENSION_IDS = [
  'mental',
  'fisico',
  'profissional',
  'financas',
  'social',
  'recreativo',
  'espiritual',
] as const

export type DimensionId = (typeof DIMENSION_IDS)[number]

export function resolveThemeId(raw: string | undefined | null): string {
  if (!raw) return 'fisico'
  return ALIASES[raw] || raw
}
