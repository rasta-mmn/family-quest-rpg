import { useState, type FormEvent } from 'react'
import { useLocation } from 'wouter'
import { Layout } from '../components/Layout'
import { addLocalHero, buildLocalHero } from '../lib/localHeroes'
import { downloadHeroPack } from '../lib/heroMarkdown'
import { useGameData } from '../hooks/useGameData'

const CLASS_OPTS = [
  { id: 'guerreiro', label: 'Warrior' },
  { id: 'bardo', label: 'Bard' },
  { id: 'mago', label: 'Mage' },
  { id: 'ladino', label: 'Rogue' },
]

export function CreateHero() {
  const { data, error, loading, reload } = useGameData()
  const [, setLoc] = useLocation()
  const [name, setName] = useState('')
  const [cls, setCls] = useState('guerreiro')
  const [role, setRole] = useState('Player')
  const [theme, setTheme] = useState('treino')
  const [m1, setM1] = useState('Mission Alpha')
  const [m2, setM2] = useState('Mission Beta')
  const [m3, setM3] = useState('Mission Gamma')
  const [formError, setFormError] = useState('')
  const [alsoDownload, setAlsoDownload] = useState(true)

  if (loading) return <Layout><p>Preparing the summoning…</p></Layout>
  if (error || !data) return <Layout title="Error"><p>{error}</p></Layout>

  const themes = Object.keys(data.themes)
  const week = data.config.current_week
  const bossMeta =
    data.month.bosses?.find((b) => b.week === week) || data.month.bosses?.[0]

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setFormError('Every hero needs a legendary name.')
      return
    }
    if (!bossMeta) {
      setFormError('No month BOSS — set up the month in Admin first.')
      return
    }
    const hero = buildLocalHero({
      character_name: name,
      class: cls,
      real_name_redacted: role,
      theme,
      missions: [m1, m2, m3],
      existingIds: data!.heroes.map((h) => h.id),
      month: data!.config.current_month,
      week,
      boss: { id: bossMeta.id || 'boss', name: bossMeta.name, points: bossMeta.points },
    })
    addLocalHero(hero)
    if (alsoDownload) downloadHeroPack(hero, data!.config.current_month)
    reload()
    setLoc(`/player/${hero.id}`)
  }

  return (
    <Layout title="Summon hero">
      <p className="mb-4 max-w-xl opacity-85">
        Create a new character. Lives in this browser’s grimoire; download the `.md`
        pack to commit into the repo.
      </p>
      <form onSubmit={onSubmit} className="panel grid max-w-xl gap-4 p-4">
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">Character name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Oakflame"
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
            autoFocus
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">Class</span>
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          >
            {CLASS_OPTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">Role (redacted)</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Player 5"
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">Mission theme</span>
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
        <fieldset className="space-y-2 border border-[var(--color-gold-dim)]/40 p-3">
          <legend className="px-1 font-display text-xs text-[var(--color-gold)]">
            3 daily missions (redacted)
          </legend>
          {[
            [m1, setM1],
            [m2, setM2],
            [m3, setM3],
          ].map(([val, set], i) => (
            <input
              key={i}
              value={val as string}
              onChange={(e) => (set as (v: string) => void)(e.target.value)}
              className="w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
            />
          ))}
        </fieldset>
        <label className="flex items-center gap-2 text-sm opacity-85">
          <input
            type="checkbox"
            checked={alsoDownload}
            onChange={(e) => setAlsoDownload(e.target.checked)}
          />
          Download `.md` pack for the repo
        </label>
        {formError && <p className="text-sm text-red-300">{formError}</p>}
        <button
          type="submit"
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)]"
        >
          Summon & open sheet
        </button>
      </form>
    </Layout>
  )
}
