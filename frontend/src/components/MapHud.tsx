import { useLocale } from '../lib/i18n'

type Props = {
  brand?: string
  city?: string
  season?: string
  weekLabel: string
  campaignTitle?: string
  familyName?: string
  pool: number
  gate: number
  onOpenGrimoire: () => void
}

export function MapHud({
  brand = 'Family Quest',
  city,
  season,
  weekLabel,
  campaignTitle,
  familyName,
  pool,
  gate,
  onOpenGrimoire,
}: Props) {
  const { t } = useLocale()
  const place = [city, season].filter(Boolean).join(' · ')

  return (
    <>
      <div className="absolute left-3 top-3 z-10 flex max-w-[min(100%-6rem,20rem)] flex-col gap-2 md:left-[5.5rem]">
        <div className="hud-panel px-3 py-2">
          <p className="font-decorative text-lg leading-tight text-[var(--color-gold)] md:text-xl">
            {brand}
          </p>
          {place ? <p className="mt-0.5 truncate text-sm opacity-90">{place}</p> : null}
          <p className="mt-0.5 truncate text-xs opacity-70">
            {weekLabel}
            {campaignTitle ? ` · ${campaignTitle}` : ''}
          </p>
        </div>
      </div>

      <div className="absolute right-3 top-3 z-10 flex max-w-[min(100%-1.5rem,16rem)] flex-col items-end gap-2">
        <div className="hud-panel px-3 py-2 text-right">
          <p className="font-display text-[10px] tracking-widest text-[var(--color-gold)]">
            {t('familyStrength')}
          </p>
          <p className="font-decorative text-xl tabular-nums text-[var(--color-gold)]">
            {Math.round(pool)} / {gate}
          </p>
          {familyName ? <p className="mt-0.5 truncate text-xs opacity-75">{familyName}</p> : null}
        </div>
        <button
          type="button"
          onClick={onOpenGrimoire}
          className="hud-panel px-3 py-2 font-display text-[11px] tracking-widest text-[var(--color-gold)] transition duration-150 hover:border-[var(--color-gold)]"
        >
          {t('openGrimoire')}
        </button>
      </div>
    </>
  )
}
