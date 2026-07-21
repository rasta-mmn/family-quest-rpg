import { useEffect, useMemo, useState } from 'react'
import { CityMap } from './CityMap'
import { emptyCampaign, normalizeCampaign } from '../lib/campaign'
import { bossGatePerHero, emptyFamily } from '../lib/family'
import { assetUrl, fetchDoc } from '../lib/githubApi'
import { parseMarkdown } from '../lib/mdParser'
import { pickL, useLocale } from '../lib/i18n'
import type { Campaign, PointsConfig } from '../lib/types'

const CITIES: { id: string; slug: string; file: string }[] = [
  { id: '01', slug: 'termopolis', file: 'docs/assets/maps/01-termopolis.png' },
  { id: '02', slug: 'luzilia', file: 'docs/assets/maps/02-luzilia.png' },
  { id: '03', slug: 'verdeia', file: 'docs/assets/maps/03-verdeia.png' },
  { id: '04', slug: 'coparia', file: 'docs/assets/maps/04-coparia.png' },
  { id: '05', slug: 'rioporto', file: 'docs/assets/maps/05-rioporto.png' },
  { id: '06', slug: 'solaria', file: 'docs/assets/maps/06-solaria.png' },
  { id: '07', slug: 'cinzar', file: 'docs/assets/maps/07-cinzar.png' },
  { id: '08', slug: 'forjalia', file: 'docs/assets/maps/08-forjalia.png' },
  { id: '09', slug: 'douralia', file: 'docs/assets/maps/09-douralia.png' },
  { id: '10', slug: 'sombralia', file: 'docs/assets/maps/10-sombralia.png' },
  { id: '11', slug: 'pantanil', file: 'docs/assets/maps/11-pantanil.png' },
  { id: '12', slug: 'nevalia', file: 'docs/assets/maps/12-nevalia.png' },
]

type Props = {
  points: PointsConfig
  crest?: string
  heroFaces?: { id: string; name: string; avatar?: string; photo?: string }[]
}

export function CityMapsLab({ points, crest, heroFaces }: Props) {
  const { locale, t } = useLocale()
  const [cityId, setCityId] = useState('01')
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [heroCount, setHeroCount] = useState(4)
  const [fakePool, setFakePool] = useState(0)
  const [bossDone, setBossDone] = useState(false)
  const [showLabels, setShowLabels] = useState(true)

  const gate = bossGatePerHero(points) * Math.max(1, heroCount)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    ;(async () => {
      try {
        const text = await fetchDoc(`config/campaigns/${cityId}.md`)
        if (cancelled) return
        const camp = normalizeCampaign(parseMarkdown<Campaign>(text).data, cityId)
        const meta = CITIES.find((c) => c.id === cityId)
        if (meta) camp.map = meta.file
        setCampaign(camp)
        setFakePool((p) => Math.min(p, bossGatePerHero(points) * heroCount))
      } catch (e) {
        if (!cancelled) {
          setError(String(e))
          const fallback = emptyCampaign(cityId)
          const meta = CITIES.find((c) => c.id === cityId)
          if (meta) fallback.map = meta.file
          setCampaign(fallback)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [cityId, heroCount, points])

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

  const pct = gate > 0 ? Math.round((fakePool / gate) * 100) : 0

  function setPct(p: number) {
    setFakePool(Math.round((Math.min(100, Math.max(0, p)) / 100) * gate))
  }

  return (
    <section className="panel mt-6 space-y-4 p-3 md:p-4">
      <div>
        <h2 className="font-display text-sm tracking-widest text-[var(--color-gold)]">
          {t('cityMapsLab')}
        </h2>
        <p className="mt-1 text-sm opacity-80">{t('cityMapsLabHelp')}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {CITIES.map((c) => {
          const active = c.id === cityId
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCityId(c.id)}
              className={`overflow-hidden border text-left ${
                active
                  ? 'border-[var(--color-gold)] ring-1 ring-[var(--color-gold)]'
                  : 'border-[var(--color-gold)]/30 hover:border-[var(--color-gold)]/70'
              }`}
            >
              <img src={assetUrl(c.file)} alt="" className="aspect-video w-full object-cover" />
              <p className="truncate px-1 py-0.5 font-display text-[10px] tracking-wider text-[var(--color-gold)]">
                {c.id} · {c.slug}
              </p>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3 border border-[var(--color-gold)]/30 p-3">
        <label className="text-sm">
          <span className="font-display text-[10px] tracking-wider text-[var(--color-gold)]">
            {t('fakeXpPool')}
          </span>
          <input
            type="range"
            min={0}
            max={gate}
            step={10}
            value={fakePool}
            onChange={(e) => setFakePool(Number(e.target.value))}
            className="mt-1 block w-48 accent-[var(--color-gold)]"
          />
          <span className="text-xs opacity-80">
            {fakePool} / {gate} ({pct}%)
          </span>
        </label>

        <div className="flex flex-wrap gap-1">
          {[0, 25, 50, 75, 100].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPct(p)}
              className="border border-[var(--color-gold)]/50 px-2 py-1 font-display text-[10px] text-[var(--color-gold)] hover:border-[var(--color-gold)]"
            >
              {p}%
            </button>
          ))}
        </div>

        <label className="text-sm">
          <span className="font-display text-[10px] tracking-wider text-[var(--color-gold)]">
            N {t('heroes')}
          </span>
          <input
            type="number"
            min={1}
            max={8}
            value={heroCount}
            onChange={(e) => {
              const n = Math.max(1, Math.min(8, Number(e.target.value) || 1))
              setHeroCount(n)
              setFakePool((p) => Math.min(p, bossGatePerHero(points) * n))
            }}
            className="mt-1 block w-16 border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bossDone}
            onChange={(e) => setBossDone(e.target.checked)}
          />
          {t('familyBossDone')}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          {t('mapShowLabels')}
        </label>
      </div>

      {loading && <p className="text-sm opacity-70">{t('opening')}</p>}
      {error && <p className="text-sm text-amber-300">{error}</p>}

      {campaign && (
        <>
          <p className="font-decorative text-lg text-[var(--color-gold)]">
            {pickL(campaign as unknown as Record<string, unknown>, 'city', locale) || cityId}
          </p>
          <CityMap
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
          />
        </>
      )}
    </section>
  )
}
