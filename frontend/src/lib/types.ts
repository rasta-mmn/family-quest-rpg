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

export type ThemeSubarea = {
  id: string
  name: string
  name_pt?: string
}

export type MonthSetup = {
  month: string
  month_number?: number
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
