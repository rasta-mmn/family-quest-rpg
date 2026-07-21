import { useEffect, useMemo, useRef, useState } from 'react'
import { CityMap } from './CityMap'
import { CinematicPlaySlot } from './CinematicPlaySlot'
import { LoreCinematic, type LoreCinematicPayload } from './LoreCinematic'
import {
  CITY_MAP_CATALOG,
  emptyCampaign,
  mergeCampaignDraft,
  normalizeCampaign,
} from '../lib/campaign'
import { loadAdminEdits } from '../lib/editsStore'
import {
  bossGatePerHero,
  campaignRoute,
  emptyFamily,
  type RoutePoint,
} from '../lib/family'
import { fetchDoc } from '../lib/githubApi'
import { parseMarkdown } from '../lib/mdParser'
import { pickL, useLocale } from '../lib/i18n'
import type { Campaign, PointsConfig } from '../lib/types'

type Props = {
  points: PointsConfig
  crest?: string
  heroFaces?: { id: string; name: string; avatar?: string; photo?: string }[]
  /** Default city = current month campaign (e.g. "08" in August). */
  initialCityId?: string
  /** Calendar weeks in month — markers = weeks − 1 vassals + BOSS. */
  weekCount?: number
}

function stopIndexFromProgress(routeLen: number, progress: number): number {
  if (routeLen <= 1) return 0
  return Math.min(routeLen - 1, Math.round(Math.min(1, Math.max(0, progress)) * (routeLen - 1)))
}

export function CityMapsLab({
  points,
  crest,
  heroFaces,
  initialCityId = '01',
  weekCount,
}: Props) {
  const { locale, t } = useLocale()
  const [cityId, setCityId] = useState(initialCityId)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const heroCount = 4
  const [fakePool, setFakePool] = useState(0)
  const [bossDone, setBossDone] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [cine, setCine] = useState<LoreCinematicPayload | null>(null)
  const [playOpen, setPlayOpen] = useState(false)
  const lastStopRef = useRef(0)

  useEffect(() => {
    setCityId(initialCityId)
  }, [initialCityId])

  const gate = bossGatePerHero(points) * Math.max(1, heroCount)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    lastStopRef.current = 0
    setFakePool(0)
    setCine(null)
    setPlayOpen(false)
    ;(async () => {
      try {
        const text = await fetchDoc(`config/campaigns/${cityId}.md`)
        if (cancelled) return
        const parsed = normalizeCampaign(parseMarkdown<Campaign>(text).data, cityId)
        const draft = loadAdminEdits().campaigns?.[cityId]
        setCampaign(draft ? mergeCampaignDraft(parsed, draft, cityId) : parsed)
      } catch (e) {
        if (!cancelled) {
          setError(String(e))
          const draft = loadAdminEdits().campaigns?.[cityId]
          setCampaign(
            draft ? normalizeCampaign(draft, cityId) : emptyCampaign(cityId),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [cityId])

  const mockFamily = useMemo(
    () =>
      emptyFamily('lab_house', {
        name: 'Lab House',
        name_pt: 'Casa Lab',
        crest: crest || 'docs/assets/crests/casa_inicial.svg',
        hero_ids: Array.from({ length: heroCount }, (_, i) => `Lab${i + 1}`),
        map_campaign_id: cityId,
        boss_outcome: bossDone ? 'victory' : null,
      }),
    [crest, heroCount, cityId, bossDone],
  )

  const faces = useMemo(() => {
    if (heroFaces?.length) {
      return mockFamily.hero_ids.map((id, i) => ({
        id,
        name: heroFaces[i % heroFaces.length]?.name || id,
        avatar: heroFaces[i % heroFaces.length]?.avatar,
        photo: heroFaces[i % heroFaces.length]?.photo,
      }))
    }
    return mockFamily.hero_ids.map((id) => ({
      id,
      name: id,
      avatar: 'docs/assets/avatars/guerreiro.png',
    }))
  }, [heroFaces, mockFamily.hero_ids])

  const markers = weekCount ?? (campaign ? (campaign.vassals?.length || 0) + 1 : 4)
  const route = useMemo(
    () => (campaign ? campaignRoute(campaign, markers) : []),
    [campaign, markers],
  )
  const progress = gate > 0 ? Math.min(1, fakePool / gate) : 0

  function loreForPoint(p: RoutePoint): string {
    if (!campaign) return ''
    if (p.kind === 'boss') {
      return pickL(campaign.boss as unknown as Record<string, unknown>, 'lore', locale) || ''
    }
    const v = (campaign.vassals || []).find((x) => x.id === p.creatureId)
    if (!v) return ''
    return pickL(v as unknown as Record<string, unknown>, 'lore', locale) || ''
  }

  function openCityCine(camp: Campaign) {
    const city = pickL(camp as unknown as Record<string, unknown>, 'city', locale) || cityId
    const season =
      pickL(camp as unknown as Record<string, unknown>, 'season_name', locale) || camp.season || ''
    const lore = pickL(camp as unknown as Record<string, unknown>, 'lore', locale) || ''
    setCine({
      kind: 'city',
      title: city,
      subtitle: season,
      lore,
      mapSrc: camp.map,
      heroFaces: faces,
    })
  }

  function openMarkerLore(p: RoutePoint) {
    if (!campaign) return
    if (p.kind === 'start') {
      openCityCine(campaign)
      return
    }
    const name =
      pickL({ name: p.name, name_pt: p.name_pt } as Record<string, unknown>, 'name', locale) ||
      p.id
    const weekLabel = p.weekIndex ? `${t('week')} ${p.weekIndex}` : ''
    setCine({
      kind: 'enemy',
      title: name,
      subtitle: weekLabel,
      lore: loreForPoint(p) || name,
      mapSrc: campaign.map,
      enemyAvatar: p.avatar,
      heroFaces: faces,
    })
  }

  // Lore when carriage reaches a new stop via fake XP (not start).
  useEffect(() => {
    if (!campaign || cine || playOpen || route.length < 2) return
    const idx = stopIndexFromProgress(route.length, progress)
    if (idx <= lastStopRef.current) return
    lastStopRef.current = idx
    const p = route[idx]
    if (p && p.kind !== 'start') openMarkerLore(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, route, campaign, cine, playOpen])

  return (
    <section className="panel space-y-3 p-3 md:p-4">
      <div>
        <h2 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
          {t('cityMapsLab')}
        </h2>
        <p className="mt-1 text-sm opacity-70">{t('cityMapsLabHelp')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CITY_MAP_CATALOG.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCityId(c.id)}
            className={`border px-2 py-1 font-display text-[10px] tracking-wider ${
              cityId === c.id
                ? 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
                : 'border-[var(--color-gold)]/40 text-[var(--color-ink)]/80 hover:border-[var(--color-gold)]'
            }`}
          >
            {c.id} {c.slug}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <span className="opacity-70">{t('fakeXpPool')}</span>
          <input
            type="range"
            min={0}
            max={gate || 1600}
            value={fakePool}
            onChange={(e) => setFakePool(Number(e.target.value))}
            className="w-40"
          />
          <span className="tabular-nums text-[var(--color-gold)]">
            {fakePool} / {gate}
          </span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bossDone}
            onChange={(e) => setBossDone(e.target.checked)}
          />
          {t('bossDoneLabel')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          {t('mapShowLabels')}
        </label>
        {campaign && (
          <button
            type="button"
            className="border border-[var(--color-gold)]/40 px-2 py-1 font-display text-[10px] tracking-wider text-[var(--color-gold)] hover:border-[var(--color-gold)]"
            onClick={() => openCityCine(campaign)}
          >
            {t('cineReplayCity')}
          </button>
        )}
      </div>

      {loading && <p className="text-sm opacity-70">{t('opening')}</p>}
      {error && <p className="text-sm text-amber-300">{error}</p>}

      {campaign && (
        <>
          <p className="font-decorative text-lg text-[var(--color-gold)]">
            {pickL(campaign as unknown as Record<string, unknown>, 'city', locale) || cityId}
          </p>
          <p className="text-xs opacity-60">
            {t('monthBoss')}:{' '}
            {pickL(campaign.boss as unknown as Record<string, unknown>, 'name', locale)}
            {' · '}
            {(campaign.vassals || [])
              .slice(0, Math.max(0, markers - 1))
              .map((v) => pickL(v as unknown as Record<string, unknown>, 'name', locale))
              .join(' · ')}
          </p>
          <p className="text-xs opacity-55">{t('cineClickHint')}</p>
          <div className="map-cine-host border border-[var(--color-gold)]/40">
            <CityMap
              variant="stage"
              campaign={campaign}
              activeFamily={mockFamily}
              families={[mockFamily]}
              heroFaces={faces}
              mapWeekPoints={{}}
              points={points}
              bossDone={bossDone}
              bossOutcome={bossDone ? 'victory' : null}
              forcePool={fakePool}
              showLandmarkLabels={showLabels}
              weekCount={markers}
              onMarkerSelect={openMarkerLore}
            />
            {cine ? <LoreCinematic {...cine} onDone={() => setCine(null)} /> : null}
            <CinematicPlaySlot
              open={playOpen}
              onClose={() => setPlayOpen(false)}
              title={pickL(campaign as unknown as Record<string, unknown>, 'city', locale)}
            />
            {!cine && !playOpen ? (
              <button
                type="button"
                className="cine-play-fab"
                style={{ position: 'absolute' }}
                onClick={() => setPlayOpen(true)}
                aria-label={t('cinePlayTitle')}
              >
                PLAY
              </button>
            ) : null}
          </div>
        </>
      )}
    </section>
  )
}
