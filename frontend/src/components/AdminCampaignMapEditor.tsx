import { useState } from 'react'
import { CITY_MAP_CATALOG, mapFileForCampaignId, mapMatchesCampaignId } from '../lib/campaign'
import { defaultLandmarks } from '../lib/family'
import { assetUrl } from '../lib/githubApi'
import { useLocale } from '../lib/i18n'
import type { Campaign, MapLandmark } from '../lib/types'

type Props = {
  camp: Campaign
  onChange: (p: Partial<Campaign>) => void
}

function clampPct(n: number) {
  return Math.min(100, Math.max(0, Math.round(n)))
}

export function AdminCampaignMapEditor({ camp, onChange }: Props) {
  const { t } = useLocale()
  const landmarks = camp.map_landmarks?.length
    ? camp.map_landmarks
    : defaultLandmarks()
  const [selectedId, setSelectedId] = useState(landmarks[0]?.id || 'city_square')
  const mapPath = camp.map || mapFileForCampaignId(camp.id)

  function patchLandmark(id: string, p: Partial<MapLandmark>) {
    const next = landmarks.map((l) => (l.id === id ? { ...l, ...p } : l))
    onChange({ map_landmarks: next })
  }

  function onMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = clampPct(((e.clientX - rect.left) / rect.width) * 100)
    const y = clampPct(((e.clientY - rect.top) / rect.height) * 100)
    patchLandmark(selectedId, { x, y })
  }

  return (
    <div className="panel space-y-3 p-4">
      <h3 className="font-display text-xs text-[var(--color-gold)]">{t('campaignMap')}</h3>
      <p className="text-xs opacity-70">{t('campaignMapHelp')}</p>

      <label className="block text-sm">
        {t('campaignMapArt')}
        <select
          value={mapPath}
          onChange={(e) => onChange({ map: e.target.value })}
          className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
        >
          {CITY_MAP_CATALOG.map((m) => (
            <option key={m.id} value={m.file}>
              {m.id} — {m.city} ({m.season})
            </option>
          ))}
        </select>
      </label>
      {!mapMatchesCampaignId(mapPath, camp.id) ? (
        <p className="text-xs text-amber-300">{t('campaignMapMismatch')}</p>
      ) : null}
      <button
        type="button"
        onClick={() => onChange({ map: mapFileForCampaignId(camp.id) })}
        className="border border-[var(--color-gold-dim)] px-3 py-1.5 font-display text-[10px] tracking-widest text-[var(--color-gold)]"
      >
        {t('resetMapArt')}
      </button>

      <label className="block text-sm">
        {t('mapCityStart')}
        <select
          value={camp.map_city_start || 'city_square'}
          onChange={(e) => onChange({ map_city_start: e.target.value })}
          className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
        >
          {landmarks.map((l) => (
            <option key={l.id} value={l.id}>
              {l.id} — {l.name_pt || l.name}
            </option>
          ))}
        </select>
      </label>

      <p className="text-xs opacity-70">{t('campaignMapClickHelp')}</p>

      <div
        onClick={onMapClick}
        className="relative aspect-[8/5] w-full cursor-crosshair overflow-hidden border border-[var(--color-gold)] bg-[var(--color-charcoal)]"
      >
        <img
          src={assetUrl(mapPath)}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {landmarks.map((l) => {
          const active = l.id === selectedId
          return (
            <button
              key={l.id}
              type="button"
              title={`${l.name_pt || l.name} (${l.x},${l.y})`}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedId(l.id)
              }}
              className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                active
                  ? 'border-[var(--color-gold)] bg-[var(--color-gold)]'
                  : 'border-[var(--color-gold)] bg-[var(--color-charcoal)]'
              }`}
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
            />
          )
        })}
      </div>

      <div className="space-y-2">
        {landmarks.map((l) => {
          const active = l.id === selectedId
          return (
            <fieldset
              key={l.id}
              className={`space-y-1 border p-2 ${
                active
                  ? 'border-[var(--color-gold)]'
                  : 'border-[var(--color-gold-dim)]/40'
              }`}
            >
              <legend className="px-1 font-display text-[10px] tracking-widest text-[var(--color-gold)]">
                <button type="button" onClick={() => setSelectedId(l.id)}>
                  {l.id}
                </button>
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block text-xs">
                  {t('landmarkName')} EN
                  <input
                    value={l.name}
                    onChange={(e) => patchLandmark(l.id, { name: e.target.value })}
                    className="mt-0.5 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                  />
                </label>
                <label className="block text-xs">
                  {t('landmarkName')} PT
                  <input
                    value={l.name_pt || ''}
                    onChange={(e) => patchLandmark(l.id, { name_pt: e.target.value })}
                    className="mt-0.5 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                  />
                </label>
                <label className="block text-xs">
                  X %
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={l.x}
                    onChange={(e) =>
                      patchLandmark(l.id, { x: clampPct(Number(e.target.value)) })
                    }
                    className="mt-0.5 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 tabular-nums"
                  />
                </label>
                <label className="block text-xs">
                  Y %
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={l.y}
                    onChange={(e) =>
                      patchLandmark(l.id, { y: clampPct(Number(e.target.value)) })
                    }
                    className="mt-0.5 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 tabular-nums"
                  />
                </label>
              </div>
            </fieldset>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            map_landmarks: defaultLandmarks(),
            map_city_start: 'city_square',
          })
        }
        className="border border-[var(--color-gold-dim)] px-3 py-1.5 font-display text-[10px] tracking-widest text-[var(--color-gold)]"
      >
        {t('resetLandmarks')}
      </button>
    </div>
  )
}
