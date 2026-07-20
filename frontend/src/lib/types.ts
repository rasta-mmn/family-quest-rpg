export type PointsConfig = {
  per_task: number
  per_extra: number
  boss: number
  weekly_target: number
  monthly_xp: number
  weekly_reward_euros?: number
}

export type PlayerConfig = {
  id: string
  character_name: string
  character_name_pt?: string
  class: string
  real_name_redacted?: string
  real_name_redacted_pt?: string
  photo?: string
  avatar?: string
}

export type GameConfig = {
  game_name: string
  admin_pin: string
  journey_start?: string
  current_month: string
  current_week: string
  players: PlayerConfig[]
  points: PointsConfig
}

export type DayObjective = {
  text: string
  done: boolean
}

export type DayExtra = {
  text: string
}

export type DayLog = {
  objectives: DayObjective[]
  extras: DayExtra[]
}

export type WeeklyLog = {
  week: string
  player: string
  month: string
  boss: {
    id: string
    name: string
    name_pt?: string
    completed: boolean
    points: number
  }
  days: Record<string, DayLog>
  total_points?: number
  reward_status?: string
}

export type SheetColors = {
  text: string
  block: string
  block_opacity: number
}

export type Profile = {
  id: string
  character_name: string
  character_name_pt?: string
  class: string
  level: number
  xp_total: number
  xp_this_month: number
  months_completed: number
  sex?: 'male' | 'female'
  photo?: string
  avatar?: string
  avatar_description?: string
  avatar_description_pt?: string
  sheet_colors?: SheetColors
  stats?: Record<string, number>
}

export type Objective = {
  id: string
  name: string
  name_pt?: string
  points: number
  real_meaning_redacted?: boolean
}

export type HeroObjectives = {
  theme?: string
  month_objective?: string
  /** @deprecated kept for legacy YAML reads */
  daily_objectives?: Objective[]
}

export type BossEntry = {
  id: string
  name: string
  name_pt?: string
  type?: string
  /** Dominant objective theme for this week enemy. */
  theme?: string
  description?: string
  description_pt?: string
  image?: string
  week?: string
  collective?: boolean
  points?: number
  mission_redacted?: string
  mission_redacted_pt?: string
  completed?: boolean
}

/** Monthly campaign: 1 BOSS (last calendar week) + N−1 vassals (earlier weeks). */
export type CampaignBoss = {
  id: string
  name: string
  name_pt?: string
  /** Dominant objective theme for this BOSS week. */
  theme?: string
  /** Animated bestiary SVG — used for campaign/map characters. */
  avatar?: string
  /** Optional uploaded portrait (ADM photo field). */
  photo?: string
  /** @deprecated use avatar; kept for legacy YAML */
  image?: string
  lore?: string
  lore_pt?: string
  points: number
}

export type CampaignVassal = {
  id: string
  week_index: number
  name: string
  name_pt?: string
  /** Dominant objective theme for this vassal week. */
  theme?: string
  avatar?: string
  photo?: string
  /** @deprecated use avatar */
  image?: string
  objective?: string
  objective_pt?: string
  lore?: string
  lore_pt?: string
  points: number
}

/** Meteorological season id (Spain order) on Solstícia. */
export type CampaignSeasonId = 'primavera' | 'verao' | 'outono' | 'inverno'

export type Campaign = {
  id: string
  month_number: number
  /** @deprecated use boss.theme; kept as fallback / month default */
  theme: string
  /** World name EN — default Solstice */
  world?: string
  world_pt?: string
  /** Season id: primavera | verao | outono | inverno */
  season?: CampaignSeasonId | string
  /** Kid-friendly season display name EN (e.g. Ice Night) */
  season_name?: string
  season_name_pt?: string
  city?: string
  city_pt?: string
  title: string
  title_pt?: string
  lore?: string
  lore_pt?: string
  /** When false/absent, lore (+ boss/vassal blurbs, month_objective) auto-sync from templates. */
  lore_custom?: boolean
  map?: string
  month_objective?: string
  month_objective_pt?: string
  boss: CampaignBoss
  vassals: CampaignVassal[]
}

export type ThemeSubarea = {
  id: string
  name: string
  name_pt?: string
}

export type MonthSetup = {
  month: string
  month_number?: number
  /** Links to docs/config/campaigns/NN.md */
  campaign?: string
  weeks: string[]
  theme: string
  bosses: BossEntry[]
  objectives?: Record<
    string,
    { theme: string; month_objective?: string; daily?: string[]; daily_pt?: string[] }
  >
}

export type BestiaryTheme = {
  name: string
  name_pt?: string
  palette: string[]
  environment?: string
  environment_pt?: string
  background?: string
  subareas?: ThemeSubarea[]
  enemies: BossEntry[]
}

/** Curated avatar roster (Admin bestiary) — separate from theme enemy lists. */
export type BestiaryRosterVassal = {
  id: string
  role?: 'vassal'
  name: string
  name_pt?: string
  type?: string
  image: string
  /** Extra selectable portraits (alt pose, dark variant, etc.) */
  avatars?: string[]
  lore?: string
  lore_pt?: string
}

export type BestiaryRosterBoss = {
  id: string
  role?: 'boss'
  name: string
  name_pt?: string
  type?: string
  /** Strong/default BOSS display art */
  image: string
  /** Optional single friendly/alternate selectable avatar */
  avatar?: string
  /** Extra selectable portraits (friendly avatar, dark variant, etc.) */
  avatars?: string[]
  lore?: string
  lore_pt?: string
  vassals: BestiaryRosterVassal[]
}

export type BestiaryRoster = {
  roster: BestiaryRosterBoss[]
}

export type ClassDef = {
  name: string
  name_pt?: string
  description: string
  description_pt?: string
  color: string
  icon?: string
  upgrades: {
    month: number
    type: string
    name: string
    name_pt?: string
    description: string
    description_pt?: string
  }[]
}
