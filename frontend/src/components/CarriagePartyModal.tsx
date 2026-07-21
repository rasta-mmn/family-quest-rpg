import { Link } from 'wouter'
import { useEffect } from 'react'
import { assetUrl } from '../lib/githubApi'
import { useLocale } from '../lib/i18n'

export type CarriageHero = {
  id: string
  name: string
  avatar?: string
  photo?: string
  classLabel?: string
}

type Props = {
  open: boolean
  onClose: () => void
  familyName: string
  crest?: string
  heroes: CarriageHero[]
}

/** Seat slots as % of the interior scene (left → right on the bench). */
const SEAT_SLOTS = [
  { left: '16%', bottom: '10%' },
  { left: '38%', bottom: '8%' },
  { left: '60%', bottom: '8%' },
  { left: '82%', bottom: '10%' },
]

/** Prefer transparent cutout when class avatar PNG has a `-cutout` twin. */
function carriageHeroArt(avatar?: string, photo?: string): string {
  const src = avatar || photo || ''
  if (!src) return ''
  const cutout = src.replace(
    /^(docs\/assets\/avatars\/)([a-z]+)\.(png|webp)$/i,
    '$1$2-cutout.png',
  )
  return cutout !== src ? cutout : src
}

export function CarriagePartyModal({ open, onClose, familyName, crest, heroes }: Props) {
  const { t } = useLocale()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const party = heroes.slice(0, 4)

  return (
    <div className="carriage-zoom fixed inset-0 z-[40] flex items-center justify-center p-3 md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label={t('closeCarriage')}
        onClick={onClose}
      />
      <div
        className="hud-panel relative flex max-h-[min(96vh,48rem)] w-full max-w-5xl flex-col overflow-hidden page-enter"
        role="dialog"
        aria-modal="true"
        aria-label={t('carriageParty')}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-gold)]/30 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {crest ? (
              <img
                src={assetUrl(crest)}
                alt=""
                className="h-9 w-9 rounded border border-[var(--color-gold)] object-cover"
              />
            ) : null}
            <div className="min-w-0">
              <p className="font-display text-[10px] tracking-widest text-[var(--color-gold)]">
                {t('carriageParty')}
              </p>
              <p className="truncate font-decorative text-lg text-[var(--color-gold)]">
                {familyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 font-display text-xs tracking-widest text-[var(--color-gold)]/80 hover:text-[var(--color-gold)]"
          >
            {t('closeCarriage')}
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--color-charcoal)]">
          <img
            src={assetUrl('docs/assets/maps/carriage-interior.png')}
            alt=""
            className="h-full max-h-[min(78vh,40rem)] w-full object-cover object-center md:max-h-[min(80vh,42rem)]"
          />

          {/* Seated party — cutout sprites, no plate/background */}
          <div className="pointer-events-none absolute inset-0">
            {party.map((h, i) => {
              const slot = SEAT_SLOTS[i] || SEAT_SLOTS[SEAT_SLOTS.length - 1]
              const full = carriageHeroArt(h.avatar, h.photo)
              return (
                <Link
                  key={h.id}
                  href={`/player/${h.id}`}
                  onClick={onClose}
                  title={h.name}
                  aria-label={h.name}
                  className="pointer-events-auto absolute w-[38%] max-w-[18rem] -translate-x-1/2 transition duration-150 hover:scale-[1.05] focus-visible:scale-[1.05] md:w-[34%] md:max-w-[20rem]"
                  style={{ left: slot.left, bottom: slot.bottom }}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative flex h-[clamp(11rem,46vw,20rem)] w-full items-end justify-center">
                      {full ? (
                        <img
                          src={assetUrl(full)}
                          alt={h.name}
                          className="max-h-full w-auto object-contain object-bottom [filter:drop-shadow(0_10px_14px_rgba(0,0,0,0.5))]"
                        />
                      ) : (
                        <span className="mb-6 text-sm text-[var(--color-gold)]">?</span>
                      )}
                    </div>
                    <p className="mt-0.5 max-w-full truncate px-1 text-center font-display text-[10px] tracking-wide text-[var(--color-gold)] normal-case drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] md:text-xs">
                      {h.name}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

          <p className="pointer-events-none absolute bottom-2 left-1/2 max-w-[90%] -translate-x-1/2 px-2 py-1 text-center text-[10px] text-[var(--color-ink)]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] md:text-xs">
            {t('carriageZoomHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
