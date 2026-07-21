import { useEffect, useMemo, useState } from 'react'
import { CarriagePartyModal } from './CarriagePartyModal'
import { assetUrl } from '../lib/githubApi'
import {
  campaignRoute,
  familiesOnSameCity,
  familyGateThreshold,
  familyMapProgress,
  familyPointsPool,
  positionOnRoute,
  type RoutePoint,
} from '../lib/family'
import { pickL, useLocale } from '../lib/i18n'
import type { Campaign, FamilyConfig, PointsConfig } from '../lib/types'

type HeroFace = {
  id: string
  name: string
  avatar?: string
  photo?: string
  classLabel?: string
}

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
  /** Lab: show landmark place names + coords. */
  showLandmarkLabels?: boolean
  /** Calendar weeks in month — vassal markers = weeks − 1, last = BOSS. */
  weekCount?: number
  /** boxed = panel in page; stage = full-bleed under HUD */
  variant?: 'boxed' | 'stage'
  /** Lab / cinematic: click route stop (vassal or BOSS). */
  onMarkerSelect?: (point: RoutePoint) => void
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
  weekCount,
  variant = 'boxed',
  onMarkerSelect,
}: Props) {
  const { locale, t } = useLocale()
  const [carriageOpen, setCarriageOpen] = useState(false)
  const route = useMemo(() => campaignRoute(campaign, weekCount), [campaign, weekCount])
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
  const stage = variant === 'stage'

  const mapCanvas = (
    <div
      className={
        stage
          ? 'absolute inset-0 bg-[var(--color-charcoal)]'
          : 'relative aspect-[8/5] w-full bg-[var(--color-charcoal)]'
      }
    >
      <img
        src={mapSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

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

      {route.map((p) => {
        const isBoss = p.kind === 'boss'
        const isStart = p.kind === 'start'
        const sealed = isBoss && !bossDone && bossOutcome !== 'victory'
        const creatureName = pickL(
          { name: p.name, name_pt: p.name_pt } as Record<string, unknown>,
          'name',
          locale,
        )
        const label = creatureName || landmarkName(p.id)
        const title = [
          creatureName,
          landmarkName(p.id),
          p.weekIndex ? `${t('week')} ${p.weekIndex}` : '',
          `(${p.x},${p.y})`,
        ]
          .filter(Boolean)
          .join(' · ')

        const clickable = Boolean(onMarkerSelect)
        return (
          <div
            key={`${p.kind}-${p.id}-${p.weekIndex || 0}`}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${
              clickable ? 'z-40 cursor-pointer' : 'z-10'
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            title={title}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => onMarkerSelect?.(p) : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onMarkerSelect?.(p)
                    }
                  }
                : undefined
            }
          >
            <div className="flex flex-col items-center">
              {isStart ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-gold)]/70 bg-[var(--color-charcoal)] text-[10px] font-display text-[var(--color-gold)]">
                  C
                </div>
              ) : p.avatar ? (
                <div
                  className={`relative rounded-full border-2 bg-[var(--color-charcoal)] ${
                    isBoss
                      ? sealed
                        ? 'border-amber-600'
                        : bossOutcome === 'victory'
                          ? 'border-emerald-400'
                          : 'border-[var(--color-gold)]'
                      : 'border-stone-300'
                  }`}
                >
                  <img
                    src={assetUrl(p.avatar)}
                    alt={label}
                    className={`rounded-full object-cover ${isBoss ? 'h-11 w-11' : 'h-9 w-9'}`}
                  />
                  {sealed && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[8px] font-display text-amber-200">
                      S
                    </span>
                  )}
                  {isBoss && bossOutcome === 'victory' && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-800 text-[8px] font-display text-emerald-100">
                      OK
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center rounded-full border-2 text-[10px] font-display ${
                    isBoss
                      ? sealed
                        ? 'h-9 w-9 border-amber-700/80 bg-stone-800 text-amber-200'
                        : 'h-9 w-9 border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
                      : 'h-8 w-8 border-stone-400 bg-stone-700/90 text-stone-100'
                  }`}
                >
                  {isBoss ? (sealed ? 'S' : 'B') : p.weekIndex || '?'}
                </div>
              )}
              <p className="mt-0.5 max-w-[6.5rem] truncate rounded bg-black/75 px-1 text-center text-[9px] leading-tight text-[var(--color-gold)]">
                {isStart ? landmarkName(p.id) || label : label}
                {p.weekIndex ? (
                  <span className="block opacity-70">
                    {t('week')} {p.weekIndex}
                  </span>
                ) : isStart ? (
                  <span className="block opacity-70">{t('mapStartPoint')}</span>
                ) : null}
              </p>
              {showLandmarkLabels && (
                <p className="mt-0.5 max-w-[5.5rem] truncate rounded bg-black/60 px-1 text-center text-[8px] opacity-80">
                  {landmarkName(p.id)}
                  <span className="block opacity-60">
                    {p.x},{p.y}
                  </span>
                </p>
              )}
            </div>
          </div>
        )
      })}

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

      <button
        type="button"
        className="carriage-marker absolute z-30 -translate-x-1/2 -translate-y-[70%] transition-all duration-700 ease-out"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        title={t('openCarriage')}
        aria-label={t('openCarriage')}
        onClick={(e) => {
          e.stopPropagation()
          setCarriageOpen(true)
        }}
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={assetUrl('docs/assets/maps/carriage.png')}
              alt=""
              className="carriage-bob h-12 w-auto max-w-[5.5rem] object-contain md:h-14 md:max-w-[6.5rem]"
            />
            <img
              src={crestSrc}
              alt=""
              className="pointer-events-none absolute -right-0.5 top-0 h-5 w-5 rounded-full object-cover md:h-6 md:w-6"
            />
          </div>
          <div className="mt-0.5 flex -space-x-1.5">
            {faces.slice(0, 4).map((h) => (
              <img
                key={h.id}
                src={assetUrl(h.photo || h.avatar || '')}
                alt={h.name}
                title={h.name}
                className="h-5 w-5 rounded-full border border-[var(--color-gold)] object-cover bg-[var(--color-charcoal)]"
              />
            ))}
          </div>
        </div>
      </button>
    </div>
  )

  const familyLabel = pickL(
    activeFamily as unknown as Record<string, unknown>,
    'name',
    locale,
  )

  const carriageModal = (
    <CarriagePartyModal
      open={carriageOpen}
      onClose={() => setCarriageOpen(false)}
      familyName={familyLabel}
      crest={activeFamily.crest}
      heroes={faces.slice(0, 4).map((h) => ({
        id: h.id,
        name: h.name,
        avatar: h.avatar,
        photo: h.photo,
        classLabel: h.classLabel,
      }))}
    />
  )

  if (stage) {
    return (
      <>
        <div className="absolute inset-0 overflow-hidden bg-[var(--color-charcoal)]">
          {mapCanvas}
        </div>
        {carriageModal}
      </>
    )
  }

  return (
    <>
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
        {mapCanvas}
        <div className="flex flex-wrap gap-2 px-3 py-2 text-xs opacity-75">
          <span>{familyLabel}</span>
          {bossOutcome === 'defeat' && (
            <span className="text-amber-300">{t('bossDefeatRetry')}</span>
          )}
          {bossDone && <span className="text-emerald-300">{t('bossDoneLabel')}</span>}
        </div>
      </div>
      {carriageModal}
    </>
  )
}
