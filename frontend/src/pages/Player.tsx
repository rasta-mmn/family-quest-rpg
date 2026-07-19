import { useRoute } from 'wouter'
import { Layout } from '../components/Layout'
import { ClassBadge } from '../components/ClassBadge'
import { XPBar } from '../components/XPBar'
import { XPGrid } from '../components/XPGrid'
import { TaskList } from '../components/TaskList'
import { UpgradeTree } from '../components/UpgradeTree'
import { BossCard } from '../components/BossCard'
import { assetUrl } from '../lib/githubApi'
import { filledSquares } from '../lib/gameLogic'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'

export function Player() {
  const [, params] = useRoute('/player/:id')
  const { data, error, loading } = useGameData()
  const { locale, t } = useLocale()
  const id = params?.id

  if (loading)
    return (
      <Layout>
        <p>{t('loadingSheet')}</p>
      </Layout>
    )
  if (error || !data)
    return (
      <Layout title={t('error')}>
        <p>{error}</p>
      </Layout>
    )

  const hero = data.heroes.find((h) => h.id === id)
  if (!hero) {
    return (
      <Layout title={t('hero')}>
        <p>{t('heroMissing')}</p>
      </Layout>
    )
  }

  const { profile, objectives, weekly, weekPoints, skills } = hero
  const classDef = data.classes[profile.class]
  const squares = filledSquares([weekPoints], data.config.points.weekly_target)
  const name = pickL(profile as Record<string, unknown>, 'character_name', locale)
  const className = pickL((classDef || {}) as Record<string, unknown>, 'name', locale)
  const avatarDesc = pickL(profile as Record<string, unknown>, 'avatar_description', locale)

  return (
    <Layout title={name}>
      <div className="mb-6 flex flex-wrap items-start gap-4">
        <img
          src={assetUrl(profile.photo || '')}
          alt=""
          className="h-28 w-24 border-2 border-[var(--color-gold)] object-cover bg-[var(--color-charcoal)]"
        />
        <img
          src={assetUrl(profile.avatar || '')}
          alt=""
          className="h-20 w-20 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-charcoal)]"
        />
        <div>
          <div className="flex items-center gap-3">
            <ClassBadge className={profile.class} />
            <div>
              <p className="opacity-80">
                {className || profile.class} · {t('level')} {profile.level}
              </p>
              <p className="text-sm italic opacity-70">{avatarDesc}</p>
            </div>
          </div>
          <div className="mt-4 w-64 max-w-full">
            <XPBar value={profile.xp_this_month || weekPoints} max={data.config.points.monthly_xp} />
          </div>
          <div className="mt-3">
            <XPGrid filled={squares} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-sm text-[var(--color-gold)]">{t('monthMissions')}</h2>
          <ul className="panel space-y-2 p-4">
            {objectives.daily_objectives.map((o) => (
              <li key={o.id}>
                <strong>{pickL(o as Record<string, unknown>, 'name', locale)}</strong>{' '}
                <span className="opacity-70">({o.points} pts)</span>
              </li>
            ))}
          </ul>
          {weekly && (
            <>
              <h2 className="font-display text-sm text-[var(--color-gold)]">
                {t('week')} {weekly.week}
              </h2>
              <TaskList objectives={objectives.daily_objectives} days={weekly.days} />
              <p className="text-sm text-[var(--color-gold)] tabular-nums">
                {t('total')}: {weekPoints} pts
              </p>
            </>
          )}
          {skills.length > 0 && (
            <div className="panel p-4">
              <h3 className="mb-2 font-display text-sm text-[var(--color-gold)]">{t('skills')}</h3>
              <ul>
                {skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {weekly?.boss && (
            <BossCard boss={weekly.boss} completed={weekly.boss.completed} />
          )}
          <UpgradeTree classDef={classDef} monthsCompleted={profile.months_completed} />
        </div>
      </div>
    </Layout>
  )
}
