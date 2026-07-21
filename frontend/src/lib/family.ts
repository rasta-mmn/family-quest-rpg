import { calcWeeklyPoints } from './gameLogic'
import type {
  BossOutcome,
  Campaign,
  FamilyConfig,
  FamilyWeeklySession,
  MapLandmark,
  PointsConfig,
  WeeklyLog,
} from './types'

export const DEFAULT_BOSS_GATE_PER_HERO = 400

export function bossGatePerHero(points?: Partial<PointsConfig>): number {
  return points?.boss_gate_per_hero ?? points?.monthly_xp ?? DEFAULT_BOSS_GATE_PER_HERO
}

export function familyGateThreshold(family: FamilyConfig, points?: Partial<PointsConfig>): number {
  const n = Math.max(1, family.hero_ids?.length || 1)
  return bossGatePerHero(points) * n
}

/** Week points for map pool — base + extras only (no BOSS activity pts). */
export function weekPointsExcludingBoss(
  log: WeeklyLog | null | undefined,
  points?: Partial<PointsConfig>,
): number {
  if (!log?.days) return 0
  return calcWeeklyPoints(log.days, false, points)
}

/**
 * Points that count toward individual level-up (≥400).
 * After family boss victory, include BOSS activity pts (30/20/50).
 */
export function heroLevelUpPoints(
  log: WeeklyLog | null | undefined,
  familyBossDone: boolean,
  points?: Partial<PointsConfig>,
): number {
  if (!log?.days) return 0
  const base = calcWeeklyPoints(log.days, false, points)
  // After family victory, add BOSS activity pts (30/20/50) so hero can reach 400 post-win
  if (!familyBossDone) return base
  const bossPts =
    typeof log.boss?.points === 'number' ? log.boss.points : (points?.boss ?? 30)
  return base + bossPts
}

export function heroEligibleForLevelUp(
  log: WeeklyLog | null | undefined,
  familyBossDone: boolean,
  points?: Partial<PointsConfig>,
): boolean {
  return heroLevelUpPoints(log, familyBossDone, points) >= bossGatePerHero(points)
}

export function familyPointsPool(
  family: FamilyConfig,
  heroWeekPoints: Record<string, number>,
): number {
  return (family.hero_ids || []).reduce((sum, id) => sum + (heroWeekPoints[id] || 0), 0)
}

/** 0..1 along route toward boss. */
export function familyMapProgress(
  family: FamilyConfig,
  heroWeekPoints: Record<string, number>,
  points?: Partial<PointsConfig>,
): number {
  const gate = familyGateThreshold(family, points)
  if (gate <= 0) return 0
  return Math.min(1, familyPointsPool(family, heroWeekPoints) / gate)
}

export function nextCampaignId(id: string): string {
  const n = Math.min(12, (Number(id) || 1) + 1)
  return String(n).padStart(2, '0')
}

export function applyBossDone(
  family: FamilyConfig,
  bossDone: boolean,
): FamilyConfig {
  if (bossDone) {
    return {
      ...family,
      boss_outcome: 'victory',
      map_campaign_id: nextCampaignId(family.map_campaign_id || '01'),
      map_stop: 0,
      family_points_pool: 0,
    }
  }
  return {
    ...family,
    boss_outcome: 'defeat',
  }
}

export function outcomeFromSession(
  session: FamilyWeeklySession | null | undefined,
): BossOutcome {
  if (!session) return null
  return session.boss_done ? 'victory' : null
}

export type RoutePoint = { id: string; x: number; y: number; kind: 'start' | 'vassal' | 'boss' }

/** Ordered route: city_start → vassals → boss landmark. */
export function campaignRoute(campaign: Campaign): RoutePoint[] {
  const landmarks = campaign.map_landmarks || []
  const byId = new Map(landmarks.map((l) => [l.id, l]))
  const startId = campaign.map_city_start || landmarks[0]?.id
  const out: RoutePoint[] = []
  if (startId && byId.has(startId)) {
    const l = byId.get(startId)!
    out.push({ id: l.id, x: l.x, y: l.y, kind: 'start' })
  }
  const vassals = [...(campaign.vassals || [])].sort((a, b) => a.week_index - b.week_index)
  for (const v of vassals) {
    const id = v.landmark_id
    if (!id || !byId.has(id)) continue
    if (out.some((p) => p.id === id)) continue
    const l = byId.get(id)!
    out.push({ id: l.id, x: l.x, y: l.y, kind: 'vassal' })
  }
  const bossId = campaign.boss?.landmark_id
  if (bossId && byId.has(bossId) && !out.some((p) => p.id === bossId)) {
    const l = byId.get(bossId)!
    out.push({ id: l.id, x: l.x, y: l.y, kind: 'boss' })
  }
  if (!out.length && landmarks.length) {
    return landmarks.map((l, i) => ({
      id: l.id,
      x: l.x,
      y: l.y,
      kind: i === 0 ? 'start' : i === landmarks.length - 1 ? 'boss' : 'vassal',
    }))
  }
  return out
}

/** Interpolate position along route by progress 0..1. */
export function positionOnRoute(
  route: RoutePoint[],
  progress: number,
): { x: number; y: number } {
  if (!route.length) return { x: 50, y: 80 }
  if (route.length === 1) return { x: route[0].x, y: route[0].y }
  const t = Math.min(1, Math.max(0, progress))
  const seg = t * (route.length - 1)
  const i = Math.min(route.length - 2, Math.floor(seg))
  const f = seg - i
  const a = route[i]
  const b = route[i + 1]
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
}

export function defaultLandmarks(): MapLandmark[] {
  return [
    { id: 'city_square', name: 'City Square', name_pt: 'Praça', x: 18, y: 78 },
    { id: 'road_camp', name: 'Road Camp', name_pt: 'Acampamento', x: 38, y: 62 },
    { id: 'mid_ruins', name: 'Ruins', name_pt: 'Ruínas', x: 55, y: 48 },
    { id: 'boss_keep', name: 'Keep', name_pt: 'Castelo', x: 72, y: 28 },
  ]
}

export function emptyFamily(id: string, partial?: Partial<FamilyConfig>): FamilyConfig {
  return {
    id,
    name: partial?.name || 'New House',
    name_pt: partial?.name_pt || 'Nova Casa',
    crest: partial?.crest || 'docs/assets/crests/casa_inicial.svg',
    hero_ids: partial?.hero_ids || [],
    map_campaign_id: partial?.map_campaign_id || '01',
    map_stop: partial?.map_stop ?? 0,
    boss_outcome: partial?.boss_outcome ?? null,
    family_points_pool: partial?.family_points_pool ?? 0,
  }
}

export function slugFamilyId(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 24)
  return base || `casa_${Date.now().toString(36)}`
}

export function familiesOnSameCity(
  families: FamilyConfig[],
  campaignId: string,
): FamilyConfig[] {
  return families.filter((f) => (f.map_campaign_id || '01') === campaignId)
}
