import { useEffect, useState, type FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { selectBosses, themeKeys } from '../lib/bossSelector'
import { downloadMarkdown } from '../lib/githubApi'
import { useGameData } from '../hooks/useGameData'

function buildMonthMd(opts: {
  month: string
  monthNumber: number
  weeks: string[]
  theme: string
  bosses: ReturnType<typeof selectBosses>
  heroObjectives: Record<string, { theme: string; daily: string[] }>
}): string {
  const bossYaml = opts.bosses
    .map(
      (b) =>
        `  - { week: "${b.week}", id: ${b.id}, name: "${b.name}", type: ${b.type}, collective: true, points: 30, mission_redacted: "${b.mission_redacted}" }`,
    )
    .join('\n')

  const objYaml = Object.entries(opts.heroObjectives)
    .map(([hid, o]) => {
      const daily = o.daily.map((d) => `"${d}"`).join(', ')
      return `  ${hid}:\n    theme: ${o.theme}\n    daily: [${daily}]`
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

# Setup do Mês — ${opts.month}

Tema dominante: **${opts.theme}**. BOSS coletivos gerados pelo painel ADM (redactados).
`
}

export function Admin() {
  const { data, error, loading } = useGameData()
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinError, setPinError] = useState('')
  const [ready, setReady] = useState(false)

  const [month, setMonth] = useState('')
  const [monthNumber, setMonthNumber] = useState(1)
  const [theme, setTheme] = useState('treino')
  const [weeksRaw, setWeeksRaw] = useState('')
  const [objDraft, setObjDraft] = useState<Record<string, { theme: string; daily: string }>>({})

  useEffect(() => {
    if (!data || ready) return
    setMonth(data.config.current_month)
    setWeeksRaw((data.month.weeks || []).join(', '))
    setTheme(data.month.theme || 'treino')
    setMonthNumber(data.month.month_number || 1)
    const draft: Record<string, { theme: string; daily: string }> = {}
    for (const p of data.config.players) {
      const fromMonth = data.month.objectives?.[p.id]
      draft[p.id] = {
        theme: fromMonth?.theme || 'treino',
        daily: (fromMonth?.daily || ['Missão Alpha', 'Missão Beta', 'Missão Gama']).join(', '),
      }
    }
    setObjDraft(draft)
    setReady(true)
  }, [data, ready])

  if (loading) return <Layout><p>Carregando painel…</p></Layout>
  if (error || !data) return <Layout title="Erro"><p>{error}</p></Layout>

  const themes = themeKeys(data.themes)
  const weekList = weeksRaw.split(/[,\s]+/).map((w) => w.trim()).filter(Boolean)
  const previewBosses = selectBosses(data.themes, theme, weekList)

  function tryAuth(e: FormEvent) {
    e.preventDefault()
    if (pin === data!.config.admin_pin) {
      setAuthed(true)
      setPinError('')
    } else {
      setPinError('PIN incorreto. O grimório permanece selado.')
    }
  }

  function handleDownload() {
    const bosses = selectBosses(data!.themes, theme, weekList)
    const heroObjectives: Record<string, { theme: string; daily: string[] }> = {}
    for (const [hid, o] of Object.entries(objDraft)) {
      heroObjectives[hid] = {
        theme: o.theme,
        daily: o.daily.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3),
      }
    }
    const md = buildMonthMd({ month, monthNumber, weeks: weekList, theme, bosses, heroObjectives })
    downloadMarkdown(`${month}.md`, md)
  }

  if (!authed) {
    return (
      <Layout title="Painel ADM">
        <p className="mb-4 opacity-85">Só o guardião do grimório passa daqui.</p>
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
            Entrar
          </button>
        </form>
      </Layout>
    )
  }

  return (
    <Layout title="Setup Mensal">
      <p className="mb-4 opacity-85">
        Gera months/YYYY-MM.md para commit manual. Objetivos ficam redactados.
      </p>
      <div className="panel grid max-w-2xl gap-4 p-4">
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">Mês (YYYY-MM)</span>
          <input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">Nº do mês na jornada</span>
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
          <span className="font-display text-xs text-[var(--color-gold)]">Semanas (vírgula)</span>
          <input
            value={weeksRaw}
            onChange={(e) => setWeeksRaw(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">Tema dominante</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          >
            {themes.map((t) => (
              <option key={t} value={t}>
                {data.themes[t]?.name || t}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-3">
          <h3 className="font-display text-xs text-[var(--color-gold)]">Objetivos por herói</h3>
          {data.config.players.map((p) => (
            <fieldset key={p.id} className="border border-[var(--color-gold-dim)]/40 p-3">
              <legend className="px-1 text-[var(--color-gold)]">{p.character_name}</legend>
              <label className="mb-2 block text-sm">
                Tema
                <select
                  value={objDraft[p.id]?.theme || 'treino'}
                  onChange={(e) =>
                    setObjDraft((d) => ({
                      ...d,
                      [p.id]: { ...d[p.id], theme: e.target.value, daily: d[p.id]?.daily || '' },
                    }))
                  }
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                >
                  {themes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                3 missões (redactadas, vírgula)
                <input
                  value={objDraft[p.id]?.daily || ''}
                  onChange={(e) =>
                    setObjDraft((d) => ({
                      ...d,
                      [p.id]: { ...d[p.id], theme: d[p.id]?.theme || 'treino', daily: e.target.value },
                    }))
                  }
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                />
              </label>
            </fieldset>
          ))}
        </div>

        <div className="panel bg-[var(--color-charcoal)] p-3 text-sm">
          <p className="mb-2 font-display text-xs text-[var(--color-gold)]">BOSS previstos</p>
          <ul className="list-disc pl-5">
            {previewBosses.map((b) => (
              <li key={b.id}>
                {b.week}: {b.name}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)]"
        >
          Descarregar {month || 'YYYY-MM'}.md
        </button>
      </div>
    </Layout>
  )
}
