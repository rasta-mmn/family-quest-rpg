import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import { assetUrl } from '../lib/githubApi'
import { useLocale } from '../lib/i18n'

export type LoreCinematicPayload = {
  kind: 'city' | 'enemy'
  title: string
  subtitle?: string
  lore: string
  mapSrc?: string
  enemyAvatar?: string
  heroFaces: { id: string; name: string; avatar?: string; photo?: string }[]
}

type Props = LoreCinematicPayload & {
  onDone: () => void
}

const EXIT_MS = 420
const AUTO_NEXT_MS = 1600
const BASE_MS = 26
const COMMA_MS = 140
const PERIOD_MS = 260
const NEWLINE_MS = 90

function delayAfter(ch: string): number {
  if (ch === '\n') return NEWLINE_MS
  if (ch === ',' || ch === ';' || ch === ':') return COMMA_MS
  if (ch === '.' || ch === '!' || ch === '?' || ch === '…') return PERIOD_MS
  return BASE_MS
}

function TypewriterFlow({ text, onFinished }: { text: string; onFinished: () => void }) {
  const { t } = useLocale()
  const boxRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState('')
  const [exiting, setExiting] = useState<string | null>(null)
  const [cursor, setCursor] = useState(0)
  const [awaitingNext, setAwaitingNext] = useState(false)
  const [done, setDone] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const cursorRef = useRef(0)
  const visibleRef = useRef('')
  const pausedRef = useRef(false)
  const flippingRef = useRef(false)

  useEffect(() => {
    cursorRef.current = 0
    visibleRef.current = ''
    pausedRef.current = false
    flippingRef.current = false
    setVisible('')
    setExiting(null)
    setCursor(0)
    setAwaitingNext(false)
    setDone(false)
    setFlipping(false)
  }, [text])

  const fits = (candidate: string): boolean => {
    const box = boxRef.current
    const probe = measureRef.current
    if (!box || !probe) return true
    probe.style.width = `${box.clientWidth}px`
    probe.textContent = candidate || '\u00a0'
    return probe.scrollHeight <= box.clientHeight + 1
  }

  const advancePage = useEffectEvent(() => {
    if (flippingRef.current || !pausedRef.current) return
    if (!visibleRef.current && cursorRef.current >= text.length) return
    flippingRef.current = true
    setFlipping(true)
    setExiting(visibleRef.current)
    visibleRef.current = ''
    setVisible('')
    setAwaitingNext(false)
    window.setTimeout(() => {
      setExiting(null)
      pausedRef.current = false
      flippingRef.current = false
      setFlipping(false)
      if (cursorRef.current >= text.length) {
        setDone(true)
        onFinished()
      }
    }, EXIT_MS)
  })

  useLayoutEffect(() => {
    if (!text || done || flipping || awaitingNext) return
    if (cursor >= text.length) {
      setDone(true)
      onFinished()
      return
    }

    const ch = text[cursor]
    const next = visible + ch
    if (!fits(next) && visible.length > 0) {
      pausedRef.current = true
      setAwaitingNext(true)
      return
    }

    const pauseFor = delayAfter(ch === ' ' && cursor > 0 ? text[cursor - 1] : ch)
    const id = window.setTimeout(() => {
      visibleRef.current = next
      cursorRef.current = cursor + 1
      setVisible(next)
      setCursor(cursor + 1)
    }, pauseFor)

    return () => window.clearTimeout(id)
  }, [text, cursor, visible, awaitingNext, flipping, done, onFinished])

  useEffect(() => {
    if (!awaitingNext || flipping || done) return
    const id = window.setTimeout(() => advancePage(), AUTO_NEXT_MS)
    return () => window.clearTimeout(id)
  }, [awaitingNext, flipping, done])

  return (
    <div className="lore-cine-flow">
      <div ref={boxRef} className="lore-cine-flow-box" aria-live="polite">
        {exiting != null ? (
          <p className="lore-cine-flow-text lore-cine-flow-exit" aria-hidden>
            {exiting}
          </p>
        ) : null}
        <p className="lore-cine-flow-text">
          {visible}
          {!done && !awaitingNext && !flipping ? (
            <span className="lore-cine-caret" aria-hidden />
          ) : null}
        </p>
      </div>
      {/* Off-screen height probe — same typography, never scrolled */}
      <div ref={measureRef} className="lore-cine-flow-measure" aria-hidden />
      {awaitingNext && !done ? (
        <button
          type="button"
          className="lore-cine-next font-display text-[var(--color-gold)]"
          onClick={(e) => {
            e.stopPropagation()
            advancePage()
          }}
        >
          {t('cineNext')}
        </button>
      ) : null}
    </div>
  )
}

export function LoreCinematic({
  kind,
  title,
  subtitle,
  lore,
  mapSrc,
  enemyAvatar,
  heroFaces,
  onDone,
}: Props) {
  const { t } = useLocale()
  const [loreDone, setLoreDone] = useState(false)

  useEffect(() => {
    setLoreDone(!lore)
  }, [lore])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDone()
        return
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (loreDone) onDone()
        else {
          const nextBtn = document.querySelector<HTMLButtonElement>('.lore-cine-next')
          nextBtn?.click()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loreDone, onDone])

  const bg = mapSrc ? assetUrl(mapSrc) : ''
  const foe = enemyAvatar ? assetUrl(enemyAvatar) : ''

  return (
    <div
      className="lore-cine"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => {
        if (loreDone) onDone()
      }}
    >
      {bg ? (
        <div
          className="lore-cine-bg"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
      ) : (
        <div className="lore-cine-bg lore-cine-bg-plain" aria-hidden />
      )}
      <div className="lore-cine-wash" aria-hidden />

      <div className="lore-cine-stage" onClick={(e) => e.stopPropagation()}>
        {kind === 'enemy' && foe ? (
          <img src={foe} alt="" className="lore-cine-foe" />
        ) : null}

        <div className="lore-cine-copy">
          <p className="font-display text-[10px] tracking-widest text-[var(--color-gold)]">
            {kind === 'city' ? t('cineCityTag') : t('cineEnemyTag')}
          </p>
          <h2 className="font-decorative text-2xl text-[var(--color-gold)] md:text-3xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-1 text-sm opacity-75">{subtitle}</p> : null}
          <div className="mt-4">
            <TypewriterFlow text={lore} onFinished={() => setLoreDone(true)} />
          </div>
        </div>

        <div className="lore-cine-party">
          {heroFaces.slice(0, 4).map((h) => (
            <img
              key={h.id}
              src={assetUrl(h.avatar || h.photo || '')}
              alt={h.name}
              title={h.name}
              className="h-10 w-10 rounded-full border-2 border-[var(--color-gold)] object-cover bg-[var(--color-charcoal)] md:h-12 md:w-12"
            />
          ))}
        </div>

        <button
          type="button"
          className="lore-cine-skip font-display text-xs tracking-widest text-[var(--color-gold)]"
          onClick={onDone}
        >
          {loreDone ? t('cineContinue') : t('cineSkip')}
        </button>
      </div>
    </div>
  )
}
