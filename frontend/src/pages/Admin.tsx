import { useEffect, useState, type FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { selectBosses, themeKeys } from '../lib/bossSelector'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'
import { patchAdminEdits } from '../lib/editsStore'
import { downloadAdminExports } from '../lib/exportMarkdown'
import type { BossEntry, MonthSetup } from '../lib/types'

export function Admin() {
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinError, setPinError] = useState('')
  const [ready, setReady] = useState(false)
  const [msg, setMsg] = useState('')

  const [month, setMonth] = useState('')
  const [monthNumber, setMonthNumber] = useState(1)
  const [theme, setTheme] = useState('treino')
  const [weeksRaw, setWeeksRaw] = useState('')
  const [currentWeek, setCurrentWeek] = useState('')
  const [bossMissions, setBossMissions] = useState<
    Record<string, { en: string; pt: string }>
  >({})

  useEffect(() => {
    if (!data || ready) return
    setMonth(data.config.current_month)
    setWeeksRaw((data.month.weeks || []).join(', '))
    setTheme(data.month.theme || 'treino')
    setMonthNumber(data.month.month_number || 1)
    setCurrentWeek(data.config.current_week)
    const bm: Record<string, { en: string; pt: string }> = {}
    for (const b of data.month.bosses || []) {
      if (!b.week) continue
      bm[b.week] = {
        en: b.mission_redacted || '',
        pt: b.mission_redacted_pt || b.mission_redacted || '',
      }
    }
    setBossMissions(bm)
    setReady(true)
  }, [data, ready])

  if (loading)
    return (
      <Layout>
        <p>{t('loadingAdmin')}</p>
      </Layout>
    )
  if (error || !data)
    return (
      <Layout title={t('error')}>
        <p>{error}</p>
      </Layout>
    )

  const themes = themeKeys(data.themes)
  const weekList = weeksRaw.split(/[,\s]+/).map((w) => w.trim()).filter(Boolean)
  const previewBosses = selectBosses(data.themes, theme, weekList)

  function tryAuth(e: FormEvent) {
    e.preventDefault()
    if (pin === data!.config.admin_pin) {
      setAuthed(true)
      setPinError('')
    } else {
      setPinError(t('badPin'))
    }
  }

  function buildMonthSetup(): MonthSetup {
    const bosses: BossEntry[] = previewBosses.map((b) => {
      const week = b.week || ''
      return {
        ...b,
        mission_redacted: bossMissions[week]?.en || b.mission_redacted,
        mission_redacted_pt:
          bossMissions[week]?.pt || b.mission_redacted_pt || b.mission_redacted,
      }
    })
    const objectives: MonthSetup['objectives'] = {}
    for (const h of data!.heroes) {
      const daily = h.objectives.daily_objectives || []
      objectives[h.id] = {
        theme: h.objectives.theme || theme,
        daily: daily.map((o) => o.name),
        daily_pt: daily.map((o) => o.name_pt || o.name),
      }
    }
    return {
      month,
      month_number: monthNumber,
      weeks: weekList,
      theme,
      bosses,
      objectives,
    }
  }

  function saveAdmin() {
    const setup = buildMonthSetup()
    patchAdminEdits({
      current_month: month,
      current_week: currentWeek || weekList[0] || data!.config.current_week,
      month: {
        month: setup.month,
        month_number: setup.month_number,
        weeks: setup.weeks,
        theme: setup.theme,
        bosses: setup.bosses,
      },
    })
    setMsg(t('savedLocal'))
    reload()
  }

  function handleDownload() {
    saveAdmin()
    const setup = buildMonthSetup()
    downloadAdminExports({
      config: {
        current_month: month,
        current_week: currentWeek || weekList[0] || '',
      },
      month: setup,
    })
  }

  if (!authed) {
    return (
      <Layout title={t('adminTitle')}>
        <p className="mb-4 opacity-85">{t('adminGate')}</p>
        <form onSubmit={tryAuth} className="panel max-w-sm space-y-3 p-4">
          <label className="block font-display text-xs text-[var(--color-gold)]">
            PIN
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2 font-body text-[var(--color-ink)]"
              autoComplete="off"
            />
          </label>
          {pinError && <p className="text-sm text-red-300">{pinError}</p>}
          <button
            type="submit"
            className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-2 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)]"
          >
            {t('enter')}
          </button>
        </form>
      </Layout>
    )
  }

  return (
    <Layout title={t('monthSetup')}>
      <p className="mb-2 opacity-85">{t('adminScopeHelp')}</p>
      <p className="mb-4 text-sm opacity-70">{t('adminPlayerMissionsNote')}</p>
      <div className="panel grid max-w-2xl gap-4 p-4">
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('monthField')}</span>
          <input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('currentWeek')}</span>
          <input
            value={currentWeek}
            onChange={(e) => setCurrentWeek(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('monthNumber')}</span>
          <input
            type="number"
            min={1}
            max={12}
            value={monthNumber}
            onChange={(e) => setMonthNumber(Number(e.target.value))}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('weeksComma')}</span>
          <input
            value={weeksRaw}
            onChange={(e) => setWeeksRaw(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('dominantTheme')}</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          >
            {themes.map((tk) => (
              <option key={tk} value={tk}>
                {pickL((data.themes[tk] || {}) as Record<string, unknown>, 'name', locale) || tk}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-3">
          <h3 className="font-display text-xs text-[var(--color-gold)]">{t('collectiveMissions')}</h3>
          {previewBosses.map((b) => {
            const week = b.week || b.id
            return (
            <fieldset key={b.id} className="border border-[var(--color-gold-dim)]/40 p-3">
              <legend className="px-1 text-[var(--color-gold)]">
                {week}: {pickL(b as Record<string, unknown>, 'name', locale)}
              </legend>
              <label className="mb-2 block text-sm">
                EN
                <input
                  value={bossMissions[week]?.en || ''}
                  onChange={(e) =>
                    setBossMissions((m) => ({
                      ...m,
                      [week]: { en: e.target.value, pt: m[week]?.pt || '' },
                    }))
                  }
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                />
              </label>
              <label className="block text-sm">
                PT
                <input
                  value={bossMissions[week]?.pt || ''}
                  onChange={(e) =>
                    setBossMissions((m) => ({
                      ...m,
                      [week]: { en: m[week]?.en || '', pt: e.target.value },
                    }))
                  }
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                />
              </label>
            </fieldset>
            )
          })}
        </div>

        <div className="panel bg-[var(--color-charcoal)] p-3 text-sm">
          <p className="mb-2 font-display text-xs text-[var(--color-gold)]">{t('missionsFromSheets')}</p>
          <ul className="list-disc pl-5">
            {data.heroes.map((h) => (
              <li key={h.id}>
                {pickL(h.profile as Record<string, unknown>, 'character_name', locale)}:{' '}
                {(h.objectives.daily_objectives || [])
                  .map((o) => pickL(o as Record<string, unknown>, 'name', locale))
                  .join(', ') || '—'}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveAdmin}
            className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)]"
          >
            {t('saveAdmin')}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="border border-[var(--color-gold-dim)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:border-[var(--color-gold)]"
          >
            {t('download')} {month || 'YYYY-MM'}.md
          </button>
        </div>
        {msg && <p className="text-sm text-[var(--color-gold)]">{msg}</p>}
      </div>
    </Layout>
  )
}
