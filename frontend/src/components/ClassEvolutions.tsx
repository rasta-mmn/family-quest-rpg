import { useEffect, useState } from 'react'
import { assetUrl } from '../lib/githubApi'
import { bodyAssetPath, bodyStage } from '../lib/sheetStyle'
import { useLocale } from '../lib/i18n'

const CLASSES = ['guerreiro', 'bardo', 'mago', 'ladino'] as const
const LEVELS = Array.from({ length: 13 }, (_, i) => i) // 0…12

type Props = {
  classId?: string
  monthsCompleted?: number
  sex?: 'male' | 'female'
  /** Tabs for all 4 classes. */
  allClasses?: boolean
}

export function ClassEvolutions({
  classId = 'guerreiro',
  monthsCompleted = 0,
  sex: sexProp = 'male',
  allClasses = false,
}: Props) {
  const { t } = useLocale()
  const current = bodyStage(monthsCompleted)
  const [tab, setTab] = useState(() => classId)
  const [sex, setSex] = useState<'male' | 'female'>(sexProp)
  const cls = allClasses ? tab : classId

  useEffect(() => {
    setSex(sexProp)
  }, [sexProp])

  return (
    <div className="sheet-panel border border-[var(--sheet-accent,#A87900)]/35 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="sheet-title font-display text-xs tracking-widest">
          {t('classEvolutions')}
        </h3>
        <span className="sheet-dim text-[10px]">
          {t('bodyStage')} {current}/12
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setSex('male')}
          className={`border px-2 py-1 font-display text-[10px] tracking-wider ${
            sex === 'male'
              ? 'border-[var(--sheet-fg,#ececec)] bg-black/40'
              : 'border-[var(--sheet-fg-dim,#a8a8a8)]'
          }`}
        >
          {t('sexMale')}
        </button>
        <button
          type="button"
          onClick={() => setSex('female')}
          className={`border px-2 py-1 font-display text-[10px] tracking-wider ${
            sex === 'female'
              ? 'border-[var(--sheet-fg,#ececec)] bg-black/40'
              : 'border-[var(--sheet-fg-dim,#a8a8a8)]'
          }`}
        >
          {t('sexFemale')}
        </button>
      </div>

      {allClasses && (
        <div className="mb-3 grid grid-cols-4 gap-1">
          {CLASSES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTab(c)}
              className={`truncate border px-1 py-1 font-display text-[10px] uppercase tracking-wider ${
                tab === c
                  ? 'border-[var(--sheet-fg,#ececec)] bg-black/40'
                  : 'border-[var(--sheet-fg-dim,#a8a8a8)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {LEVELS.map((lv) => {
          const active = !allClasses && lv === current
          const img = assetUrl(bodyAssetPath(cls, lv, sex))
          return (
            <figure
              key={`${cls}-${sex}-${lv}`}
              className={`relative text-center ${
                active ? 'ring-2 ring-[var(--sheet-gold,#C9A227)]' : ''
              }`}
              title={`${cls} ${sex} Lv ${lv}`}
            >
              <img src={img} alt="" className="mx-auto h-24 w-auto object-contain sm:h-28" />
              <figcaption className="sheet-dim mt-0.5 text-[10px] tabular-nums">
                Lv {lv}
                {active ? ` · ${t('youAreHere')}` : ''}
              </figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}
