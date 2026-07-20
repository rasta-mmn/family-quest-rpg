import { assetUrl } from '../lib/githubApi'
import { bodyAssetPath, bodyStage } from '../lib/sheetStyle'
import { useLocale } from '../lib/i18n'

type Props = {
  classId?: string
  sex?: 'male' | 'female'
  monthsCompleted?: number
  compact?: boolean
}

export function BodyProgress({
  classId,
  sex = 'male',
  monthsCompleted = 0,
  compact,
}: Props) {
  const { t } = useLocale()
  const stage = bodyStage(monthsCompleted)
  const src = assetUrl(bodyAssetPath(classId, monthsCompleted, sex))
  return (
    <div
      className={`sheet-panel border border-[var(--sheet-accent,#A87900)]/40 text-center ${
        compact ? 'p-2' : 'p-3'
      }`}
    >
      <h3 className="mb-1 font-display text-[10px] text-[var(--sheet-gold,#C9A227)]">
        {t('bodyProgress')}
      </h3>
      <img
        src={src}
        alt=""
        className={`mx-auto w-auto object-contain drop-shadow-md ${compact ? 'h-28' : 'h-36 md:h-40'}`}
      />
      <p className="sheet-dim mt-1 text-[10px]">
        {t('bodyStage')} {stage} · {monthsCompleted} {t('monthsShort')}
      </p>
    </div>
  )
}
