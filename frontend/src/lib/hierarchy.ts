/** Redacted family ranks — no real names. */
export type RankOption = {
  id: string
  en: string
  pt: string
  /** Short redacted label for YAML `real_name_redacted` */
  redacted_en: string
  redacted_pt: string
}

export const RANK_OPTIONS: RankOption[] = [
  {
    id: 'rank1',
    en: 'Rank I — Elder',
    pt: 'Rank I — Ancião',
    redacted_en: 'Player 1',
    redacted_pt: 'Jogador 1',
  },
  {
    id: 'rank2',
    en: 'Rank II — Consort',
    pt: 'Rank II — Consorte',
    redacted_en: 'Player 2',
    redacted_pt: 'Jogador 2',
  },
  {
    id: 'rank3',
    en: 'Rank III — Heir',
    pt: 'Rank III — Herdeiro',
    redacted_en: 'Player 3',
    redacted_pt: 'Jogador 3',
  },
  {
    id: 'rank4',
    en: 'Rank IV — Scout',
    pt: 'Rank IV — Batedor',
    redacted_en: 'Player 4',
    redacted_pt: 'Jogador 4',
  },
  {
    id: 'rank5',
    en: 'Rank V — Initiate',
    pt: 'Rank V — Iniciado',
    redacted_en: 'Player 5',
    redacted_pt: 'Jogador 5',
  },
]

export function rankById(id: string): RankOption {
  return RANK_OPTIONS.find((r) => r.id === id) || RANK_OPTIONS[RANK_OPTIONS.length - 1]
}
