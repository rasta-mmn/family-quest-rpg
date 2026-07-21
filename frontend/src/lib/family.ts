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

export type RoutePoint = {
  id: string
  x: number
  y: number
  kind: 'start' | 'vassal' | 'boss'
  /** 1-based week slot along the month path (vassal or month BOSS). */
  weekIndex?: number
  creatureId?: string
  avatar?: string
  name?: string
  name_pt?: string
}

function creatureAvatar(c: {
  avatar?: string
  image?: string
  photo?: string
}): string {
  return c.avatar || c.image || c.photo || ''
}

/**
 * Ensure start / vassal stops / boss keep have unique landmark ids.
 * Fills missing or duplicate vassal landmark_id from the stop pool (order = week).
 */
export function bindLandmarkIds(campaign: Campaign): Campaign {
  const landmarks = campaign.map_landmarks?.length
    ? campaign.map_landmarks
    : defaultLandmarks()
  const startId =
    (campaign.map_city_start && landmarks.some((l) => l.id === campaign.map_city_start)
      ? campaign.map_city_start
      : null) ||
    landmarks.find((l) => l.id === 'city_square')?.id ||
    landmarks[0]?.id ||
    'city_square'
  const bossId =
    (campaign.boss?.landmark_id && landmarks.some((l) => l.id === campaign.boss.landmark_id)
      ? campaign.boss.landmark_id
      : null) ||
    landmarks.find((l) => l.id === 'boss_keep')?.id ||
    landmarks[landmarks.length - 1]?.id ||
    'boss_keep'
  const stops = landmarks.filter((l) => l.id !== startId && l.id !== bossId)
  const used = new Set<string>()
  const vassals = [...(campaign.vassals || [])]
    .sort((a, b) => a.week_index - b.week_index)
    .map((v, i) => {
      let id = v.landmark_id
      const invalid =
        !id ||
        !landmarks.some((l) => l.id === id) ||
        used.has(id) ||
        id === startId ||
        id === bossId
      if (invalid) {
        id = stops.find((s) => !used.has(s.id))?.id || stops[i]?.id || stops[stops.length - 1]?.id
      }
      if (id) used.add(id)
      return { ...v, week_index: i + 1, landmark_id: id }
    })
  return {
    ...campaign,
    map_landmarks: landmarks,
    map_city_start: startId,
    boss: { ...campaign.boss, landmark_id: bossId },
    vassals,
  }
}

/**
 * Ordered route: city_start → one marker per vassal week → month BOSS.
 * @param weekCount calendar weeks in month; vassal slots = weekCount − 1 (last = BOSS).
 */
export function campaignRoute(campaign: Campaign, weekCount?: number): RoutePoint[] {
  const bound = bindLandmarkIds(campaign)
  const landmarks = bound.map_landmarks || defaultLandmarks()
  const byId = new Map(landmarks.map((l) => [l.id, l]))
  const startId = bound.map_city_start || landmarks[0]?.id
  const bossId = bound.boss.landmark_id || 'boss_keep'
  const vassalSlots =
    typeof weekCount === 'number' && weekCount > 0
      ? Math.max(0, weekCount - 1)
      : (bound.vassals || []).length
  const vassals = [...(bound.vassals || [])]
    .sort((a, b) => a.week_index - b.week_index)
    .slice(0, vassalSlots)

  const out: RoutePoint[] = []
  if (startId && byId.has(startId)) {
    const l = byId.get(startId)!
    out.push({ id: l.id, x: l.x, y: l.y, kind: 'start' })
  }
  for (let i = 0; i < vassals.length; i++) {
    const v = vassals[i]
    const id = v.landmark_id
    if (!id || !byId.has(id)) continue
    if (out.some((p) => p.id === id)) continue
    const l = byId.get(id)!
    out.push({
      id: l.id,
      x: l.x,
      y: l.y,
      kind: 'vassal',
      weekIndex: i + 1,
      creatureId: v.id,
      avatar: creatureAvatar(v),
      name: v.name,
      name_pt: v.name_pt || v.name,
    })
  }
  if (bossId && byId.has(bossId)) {
    const l = byId.get(bossId)!
    if (!out.some((p) => p.id === l.id)) {
      out.push({
        id: l.id,
        x: l.x,
        y: l.y,
        kind: 'boss',
        weekIndex: vassals.length + 1,
        creatureId: bound.boss.id,
        avatar: creatureAvatar(bound.boss),
        name: bound.boss.name,
        name_pt: bound.boss.name_pt || bound.boss.name,
      })
    }
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

/** start + 4 vassal stops + boss keep (covers 4- and 5-week months). */
export function defaultLandmarks(): MapLandmark[] {
  return [
    { id: 'city_square', name: 'City Square', name_pt: 'Praça', x: 16, y: 68 },
    { id: 'stop_1', name: 'First Gate', name_pt: 'Primeiro Portão', x: 38, y: 52 },
    { id: 'stop_2', name: 'Mid Road', name_pt: 'Estrada do Meio', x: 55, y: 42 },
    { id: 'stop_3', name: 'High Path', name_pt: 'Alto Caminho', x: 64, y: 34 },
    { id: 'stop_4', name: 'Outer Yard', name_pt: 'Pátio Exterior', x: 70, y: 30 },
    { id: 'boss_keep', name: 'Keep', name_pt: 'Castelo', x: 74, y: 26 },
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
