import { useEffect, useState, type FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { selectBosses, themeKeys } from '../lib/bossSelector'
import { downloadMarkdown } from '../lib/githubApi'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'

function buildMonthMd(opts: {
  month: string
  monthNumber: number
  weeks: string[]
  theme: string
  bosses: ReturnType<typeof selectBosses>
  heroObjectives: Record<string, { theme: string; daily: string[]; daily_pt: string[] }>
}): string {
  const bossYaml = opts.bosses
    .map(
      (b) =>
        `  - { week: "${b.week}", id: ${b.id}, name: "${b.name}", name_pt: "${b.name_pt || b.name}", type: ${b.type}, collective: true, points: 30, mission_redacted: "${b.mission_redacted}", mission_redacted_pt: "${b.mission_redacted_pt || b.mission_redacted}" }`,
    )
    .join('\n')

  const objYaml = Object.entries(opts.heroObjectives)
    .map(([hid, o]) => {
      const daily = o.daily.map((d) => `"${d}"`).join(', ')
      const dailyPt = o.daily_pt.map((d) => `"${d}"`).join(', ')
      return `  ${hid}:\n    theme: ${o.theme}\n    daily: [${daily}]\n    daily_pt: [${dailyPt}]`
    })
    .join('\n')

  return `---
month: "${opts.month}"
month_number: ${opts.monthNumber}
weeks: [${opts.weeks.map((w) => `"${w}"`).join(', ')}]
theme: ${opts.theme}
bosses:
${bossYaml}
objectives:
${objYaml}
---

# Month Setup / Setup do Mês — ${opts.month}

**EN:** Dominant theme: **${opts.theme}**. Collective BOSSes from Admin (redacted).  
**PT:** Tema dominante: **${opts.theme}**. BOSS coletivos do painel ADM (redactados).
`
}

export function Admin() {
  const { data, error, loading } = useGameData()
  const { locale, t } = useLocale()
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinError, setPinError] = useState('')
  const [ready, setReady] = useState(false)

  const [month, setMonth] = useState('')
  const [monthNumber, setMonthNumber] = useState(1)
  const [theme, setTheme] = useState('treino')
  const [weeksRaw, setWeeksRaw] = useState('')
  const [objDraft, setObjDraft] = useState<
    Record<string, { theme: string; daily: string; daily_pt: string }>
  >({})

  useEffect(() => {
    if (!data || ready) return
    setMonth(data.config.current_month)
    setWeeksRaw((data.month.weeks || []).join(', '))
    setTheme(data.month.theme || 'treino')
    setMonthNumber(data.month.month_number || 1)
    const draft: Record<string, { theme: string; daily: string; daily_pt: string }> = {}
    for (const p of data.config.players) {
      const fromMonth = data.month.objectives?.[p.id]
      draft[p.id] = {
        theme: fromMonth?.theme || 'treino',
        daily: (fromMonth?.daily || ['Mission Alpha', 'Mission Beta', 'Mission Gamma']).join(', '),
        daily_pt: (fromMonth?.daily_pt || ['Missão Alpha', 'Missão Beta', 'Missão Gama']).join(', '),
      }
    }
    setObjDraft(draft)
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

  function handleDownload() {
    const bosses = selectBosses(data!.themes, theme, weekList)
    const heroObjectives: Record<
      string,
      { theme: string; daily: string[]; daily_pt: string[] }
    > = {}
    for (const [hid, o] of Object.entries(objDraft)) {
      heroObjectives[hid] = {
        theme: o.theme,
        daily: o.daily.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3),
        daily_pt: o.daily_pt.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3),
      }
    }
    const md = buildMonthMd({
      month,
      monthNumber,
      weeks: weekList,
      theme,
      bosses,
      heroObjectives,
    })
    downloadMarkdown(`${month}.md`, md)
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
      <p className="mb-4 opacity-85">{t('monthSetupHelp')}</p>
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
          <h3 className="font-display text-xs text-[var(--color-gold)]">{t('objectivesPerHero')}</h3>
          {data.config.players.map((p) => (
            <fieldset key={p.id} className="border border-[var(--color-gold-dim)]/40 p-3">
              <legend className="px-1 text-[var(--color-gold)]">
                {pickL(p as Record<string, unknown>, 'character_name', locale)}
              </legend>
              <label className="mb-2 block text-sm">
                {t('theme')}
                <select
                  value={objDraft[p.id]?.theme || 'treino'}
                  onChange={(e) =>
                    setObjDraft((d) => ({
                      ...d,
                      [p.id]: {
                        ...d[p.id],
                        theme: e.target.value,
                        daily: d[p.id]?.daily || '',
                        daily_pt: d[p.id]?.daily_pt || '',
                      },
                    }))
                  }
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                >
                  {themes.map((tk) => (
                    <option key={tk} value={tk}>
                      {tk}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mb-2 block text-sm">
                {t('threeMissions')}
                <input
                  value={objDraft[p.id]?.daily || ''}
                  onChange={(e) =>
                    setObjDraft((d) => ({
                      ...d,
                      [p.id]: {
                        ...d[p.id],
                        theme: d[p.id]?.theme || 'treino',
                        daily: e.target.value,
                        daily_pt: d[p.id]?.daily_pt || '',
                      },
                    }))
                  }
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                />
              </label>
              <label className="block text-sm">
                {t('threeMissionsPt')}
                <input
                  value={objDraft[p.id]?.daily_pt || ''}
                  onChange={(e) =>
                    setObjDraft((d) => ({
                      ...d,
                      [p.id]: {
                        ...d[p.id],
                        theme: d[p.id]?.theme || 'treino',
                        daily: d[p.id]?.daily || '',
                        daily_pt: e.target.value,
                      },
                    }))
                  }
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                />
              </label>
            </fieldset>
          ))}
        </div>

        <div className="panel bg-[var(--color-charcoal)] p-3 text-sm">
          <p className="mb-2 font-display text-xs text-[var(--color-gold)]">{t('plannedBosses')}</p>
          <ul className="list-disc pl-5">
            {previewBosses.map((b) => (
              <li key={b.id}>
                {b.week}: {pickL(b as Record<string, unknown>, 'name', locale)}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)]"
        >
          {t('download')} {month || 'YYYY-MM'}.md
        </button>
      </div>
    </Layout>
  )
}
