import { Link } from 'wouter'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { ClassEvolutions } from '../components/ClassEvolutions'
import { CityMapsLab } from '../components/CityMapsLab'
import { assetUrl } from '../lib/githubApi'
import { useGameData } from '../hooks/useGameData'
import { useLocale } from '../lib/i18n'
import { bodyAssetPath } from '../lib/sheetStyle'
import {
  clearTestLevelHeroes,
  countTestLevelHeroes,
  isTestLevelHeroId,
  loadLocalHeroes,
  seedTestLevelHeroesForce,
  testLevelHeroId,
} from '../lib/localHeroes'

const CLASSES = ['guerreiro', 'bardo', 'mago', 'ladino'] as const
const LEVELS = Array.from({ length: 13 }, (_, i) => i) // 0…12

function bossOpts(data: ReturnType<typeof useGameData>['data']) {
  const bossMeta = data?.month.bosses?.[0]
  return {
    month: data?.config.current_month || '2026-08',
    week: data?.config.current_week || '2026-W32',
    boss: {
      id: bossMeta?.id || 'boss',
      name: bossMeta?.name || 'BOSS',
      name_pt: bossMeta?.name_pt,
      points: bossMeta?.points || 30,
    },
  }
}

/** Gallery + temporary test sheets (delete when done). */
export function Avatars() {
  const { t } = useLocale()
  const { data, reload } = useGameData()
  const [nTest, setNTest] = useState(() => countTestLevelHeroes())
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [sex, setSex] = useState<'male' | 'female'>('female')

  // Re-read on nTest change (seed/clear) so cards match localStorage.
  const testIds = new Set(
    loadLocalHeroes()
      .filter((h) => isTestLevelHeroId(h.id))
      .map((h) => h.id),
  )

  function doSeed() {
    if (busy) return
    setBusy(true)
    try {
      const seeded = seedTestLevelHeroesForce(bossOpts(data))
      const n = seeded.length
      setNTest(n)
      setMsg(t('testSheetsSeeded', { n }))
      reload()
    } catch (e) {
      setMsg(String(e))
    } finally {
      setBusy(false)
    }
  }

  function doClear() {
    if (busy) return
    setBusy(true)
    try {
      const n = clearTestLevelHeroes()
      setNTest(countTestLevelHeroes())
      setMsg(t('testSheetsCleared', { n }))
      reload()
    } catch (e) {
      setMsg(String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout title={t('classEvolutions')}>
      <p className="mb-3 max-w-2xl text-sm opacity-85">{t('classEvolutionsHelp')}</p>
      <p className="mb-3 max-w-2xl text-sm text-[var(--color-gold)]">{t('testSheetsHelp')}</p>

      <div className="relative z-20 mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={doSeed}
          className="cursor-pointer border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-3 py-2 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)] disabled:opacity-50"
        >
          {busy ? '…' : t('testSheetsSeed')}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={doClear}
          className="cursor-pointer border border-red-400/70 px-3 py-2 font-display text-xs tracking-widest text-red-300 hover:border-red-300 disabled:opacity-50"
        >
          {busy ? '…' : t('testSheetsClear')}
        </button>
        <span className="self-center text-xs opacity-70">
          {nTest} {t('testSheetsCount')}
        </span>
      </div>
      {msg && <p className="mb-3 text-sm text-[var(--color-gold)]">{msg}</p>}

      <div className="mb-4 grid max-w-xs grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setSex('male')}
          className={`border px-2 py-1.5 font-display text-[11px] tracking-wider ${
            sex === 'male'
              ? 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
              : 'border-[var(--color-gold)]/40 text-[var(--color-gold)]/70'
          }`}
        >
          {t('sexMale')}
        </button>
        <button
          type="button"
          onClick={() => setSex('female')}
          className={`border px-2 py-1.5 font-display text-[11px] tracking-wider ${
            sex === 'female'
              ? 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
              : 'border-[var(--color-gold)]/40 text-[var(--color-gold)]/70'
          }`}
        >
          {t('sexFemale')}
        </button>
      </div>

      {nTest > 0 && (
        <div className="mb-6 space-y-6">
          {CLASSES.map((cls) => {
            const levels = LEVELS.filter((lv) => testIds.has(testLevelHeroId(cls, lv, sex)))
            if (levels.length === 0) return null
            return (
              <section key={cls} className="panel p-3">
                <h2 className="mb-3 font-display text-sm tracking-widest text-[var(--color-gold)] uppercase">
                  {cls} · {sex === 'female' ? t('sexFemale') : t('sexMale')} — Lv 0…12
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                  {levels.map((lv) => {
                    const id = testLevelHeroId(cls, lv, sex)
                    const img = assetUrl(bodyAssetPath(cls, lv, sex))
                    return (
                      <Link
                        key={id}
                        href={`/player/${id}`}
                        className="block border border-[var(--color-gold)]/40 bg-[var(--color-charcoal)]/40 p-2 text-center hover:border-[var(--color-gold)]"
                      >
                        <img src={img} alt="" className="mx-auto h-28 w-auto object-contain" />
                        <p className="mt-1 truncate font-display text-[10px] tracking-wider text-[var(--color-gold)]">
                          Lv {lv}
                          {lv === 0 ? ` · ${t('avatarPlain')}` : ''}
                        </p>
                        <p className="text-[9px] opacity-60">{id}</p>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <div className="panel p-3 md:p-4">
        <ClassEvolutions allClasses monthsCompleted={12} classId="guerreiro" sex={sex} />
      </div>

      <CityMapsLab
        initialCityId={data?.month.campaign || data?.campaign?.id || '01'}
        weekCount={data?.month.weeks?.length}
        points={
          data?.config.points || {
            per_task: 30,
            per_extra: 2.5,
            boss: 30,
            weekly_target: 100,
            monthly_xp: 400,
            boss_gate_per_hero: 400,
          }
        }
        crest={data?.activeFamily?.crest}
        heroFaces={(data?.heroes || []).slice(0, 4).map((h) => ({
          id: h.id,
          name: h.profile.character_name,
          avatar: h.profile.avatar,
          photo: h.profile.photo,
        }))}
      />
    </Layout>
  )
}
