import { useEffect, useMemo, useState } from 'react'
import { assetUrl } from '../lib/githubApi'
import {
  campaignRoute,
  familiesOnSameCity,
  familyGateThreshold,
  familyMapProgress,
  familyPointsPool,
  positionOnRoute,
} from '../lib/family'
import { pickL, useLocale } from '../lib/i18n'
import type { Campaign, FamilyConfig, PointsConfig } from '../lib/types'

type HeroFace = { id: string; name: string; avatar?: string; photo?: string }

type Props = {
  campaign: Campaign
  activeFamily: FamilyConfig
  families: FamilyConfig[]
  heroFaces: HeroFace[]
  mapWeekPoints: Record<string, number>
  points: PointsConfig
  bossDone: boolean
  bossOutcome?: FamilyConfig['boss_outcome']
  /** Lab: override collective pool (fake XP). */
  forcePool?: number
  /** Lab: show landmark names for layout check. */
  showLandmarkLabels?: boolean
}

export function CityMap({
  campaign,
  activeFamily,
  families,
  heroFaces,
  mapWeekPoints,
  points,
  bossDone,
  bossOutcome,
  forcePool,
  showLandmarkLabels = false,
}: Props) {
  const { locale, t } = useLocale()
  const route = useMemo(() => campaignRoute(campaign), [campaign])
  const gate = familyGateThreshold(activeFamily, points)
  const pool =
    typeof forcePool === 'number' ? forcePool : familyPointsPool(activeFamily, mapWeekPoints)
  const progress =
    typeof forcePool === 'number'
      ? Math.min(1, gate > 0 ? forcePool / gate : 0)
      : familyMapProgress(activeFamily, mapWeekPoints, points)
  const target = positionOnRoute(route, progress)
  const [pos, setPos] = useState(positionOnRoute(route, 0))

  useEffect(() => {
    setPos(positionOnRoute(route, 0))
    const id = requestAnimationFrame(() => setPos(target))
    return () => cancelAnimationFrame(id)
  }, [route, target.x, target.y, activeFamily.id, campaign.id, forcePool])

  const mapSrc = assetUrl(campaign.map || 'docs/assets/maps/01-termopolis.png')
  const landmarkName = (id: string) => {
    const l = (campaign.map_landmarks || []).find((x) => x.id === id)
    if (!l) return id
    return pickL(l as unknown as Record<string, unknown>, 'name', locale) || id
  }
  const crestSrc = assetUrl(activeFamily.crest)
  const others = familiesOnSameCity(families, activeFamily.map_campaign_id || '01').filter(
    (f) => f.id !== activeFamily.id,
  )
  const cityName = pickL(campaign as unknown as Record<string, unknown>, 'city', locale) || ''
  const faces = heroFaces.filter((h) => activeFamily.hero_ids?.includes(h.id))

  const pathD = route.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[var(--color-gold)]/30 px-3 py-2">
        <div>
          <p className="font-display text-xs tracking-widest text-[var(--color-gold)]">
            {t('cityMap')}
          </p>
          <p className="font-decorative text-xl text-[var(--color-gold)]">{cityName}</p>
        </div>
        <p className="text-sm opacity-85">
          {t('familyStrength')}:{' '}
          <span className="text-[var(--color-gold)]">
            {Math.round(pool)} / {gate}
          </span>
        </p>
      </div>

      <div className="relative aspect-[8/5] w-full bg-[var(--color-charcoal)]">
        <img src={mapSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke="rgba(201,162,39,0.35)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={pathD}
            fill="none"
            stroke="rgba(201,162,39,0.85)"
            strokeWidth="1.6"
            strokeDasharray={`${Math.max(0.01, progress) * 100} 100`}
            pathLength={100}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Landmark pins */}
        {route.map((p) => {
          const isBoss = p.kind === 'boss'
          const sealed = isBoss && !bossDone && bossOutcome !== 'victory'
          return (
            <div
              key={p.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              title={`${landmarkName(p.id)} (${p.x},${p.y})`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-display ${
                  isBoss
                    ? sealed
                      ? 'border-amber-700/80 bg-stone-800 text-amber-200'
                      : bossOutcome === 'victory'
                        ? 'border-emerald-400 bg-emerald-900 text-emerald-100'
                        : 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)] animate-pulse'
                    : p.kind === 'start'
                      ? 'border-[var(--color-gold)]/70 bg-[var(--color-charcoal)] text-[var(--color-gold)]'
                      : 'border-stone-400 bg-stone-700/90 text-stone-100'
                }`}
              >
                {isBoss ? (sealed ? 'S' : bossOutcome === 'victory' ? 'OK' : 'B') : p.kind === 'start' ? 'C' : '?'}
              </div>
              {showLandmarkLabels && (
                <p className="mt-0.5 max-w-[5.5rem] truncate rounded bg-black/70 px-1 text-center text-[9px] text-[var(--color-gold)]">
                  {landmarkName(p.id)}
                  <span className="block opacity-60">
                    {p.x},{p.y}
                  </span>
                </p>
              )}
            </div>
          )
        })}

        {/* Other families — mini crests at city start */}
        {others.map((f, i) => {
          const start = route[0] || { x: 18, y: 78 }
          return (
            <div
              key={f.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${start.x + 3 + i * 4}%`, top: `${start.y + 4}%` }}
              title={pickL(f as unknown as Record<string, unknown>, 'name', locale)}
            >
              <img
                src={assetUrl(f.crest)}
                alt=""
                className="h-6 w-6 rounded border border-[var(--color-gold)]/50 object-cover opacity-80"
              />
            </div>
          )
        })}

        {/* Active party: carriage + crest + faces */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-[70%] transition-all duration-700 ease-out"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={assetUrl('docs/assets/maps/carriage.svg')}
                alt=""
                className="h-10 w-16 drop-shadow-md md:h-12 md:w-20"
              />
              <img
                src={crestSrc}
                alt=""
                className="absolute -right-1 -top-2 h-6 w-6 rounded border border-[var(--color-gold)] bg-[var(--color-charcoal)] object-cover"
              />
            </div>
            <div className="mt-0.5 flex -space-x-1.5">
              {faces.slice(0, 4).map((h) => (
                <img
                  key={h.id}
                  src={assetUrl(h.avatar || h.photo || '')}
                  alt={h.name}
                  title={h.name}
                  className="h-5 w-5 rounded-full border border-[var(--color-gold)] object-cover bg-[var(--color-charcoal)]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-3 py-2 text-xs opacity-75">
        <span>
          {pickL(activeFamily as unknown as Record<string, unknown>, 'name', locale)}
        </span>
        {bossOutcome === 'defeat' && <span className="text-amber-300">{t('bossDefeatRetry')}</span>}
        {bossDone && <span className="text-emerald-300">{t('bossDoneLabel')}</span>}
      </div>
    </div>
  )
}
