import { useEffect } from 'react'
import { useLocale } from '../lib/i18n'

type Props = {
  open: boolean
  onClose: () => void
  /** Optional context label (city / enemy name). */
  title?: string
}

/** Future video cinematic host — no media yet; slot is explicit. */
export function CinematicPlaySlot({ open, onClose, title }: Props) {
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

  return (
    <div
      className="cine-play-slot"
      role="dialog"
      aria-modal="true"
      aria-label={t('cinePlayTitle')}
      onClick={onClose}
    >
      <div className="cine-play-slot-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-gold)]/35 px-3 py-2">
          <div>
            <p className="font-display text-[10px] tracking-widest text-[var(--color-gold)]">
              {t('cinePlayTitle')}
            </p>
            {title ? (
              <p className="font-decorative text-lg text-[var(--color-gold)]">{title}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="font-display text-xs tracking-widest text-[var(--color-gold)]/80 hover:text-[var(--color-gold)]"
            onClick={onClose}
          >
            {t('closeGrimoire')}
          </button>
        </div>

        {/* FUTURE: mount <video> / stream here — keep this frame. */}
        <div
          className="cine-play-slot-stage"
          data-cine-video-slot="future"
          aria-label={t('cinePlaySlotAria')}
        >
          <div className="cine-play-slot-frame">
            <p className="font-display text-sm tracking-[0.35em] text-[var(--color-gold)]">
              PLAY
            </p>
            <p className="mt-2 max-w-xs text-center text-sm opacity-80">
              {t('cinePlaySlotHelp')}
            </p>
            <p className="mt-3 font-display text-[9px] tracking-widest opacity-50">
              {t('cinePlaySlotPath')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
