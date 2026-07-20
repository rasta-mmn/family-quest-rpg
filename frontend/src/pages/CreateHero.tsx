import { useState, type FormEvent } from 'react'
import { useLocation } from 'wouter'
import { Layout } from '../components/Layout'
import { addLocalHero, buildLocalHero } from '../lib/localHeroes'
import { downloadHeroPack } from '../lib/heroMarkdown'
import { RANK_OPTIONS, rankById } from '../lib/hierarchy'
import { fileToPhotoDataUrl } from '../lib/photoUpload'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'

const CLASS_OPTS = [
  { id: 'guerreiro', en: 'Warrior', pt: 'Guerreiro' },
  { id: 'bardo', en: 'Bard', pt: 'Bardo' },
  { id: 'mago', en: 'Mage', pt: 'Mago' },
  { id: 'ladino', en: 'Rogue', pt: 'Ladino' },
]

export function CreateHero() {
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const [, setLoc] = useLocation()
  const [name, setName] = useState('')
  const [cls, setCls] = useState('guerreiro')
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [rankId, setRankId] = useState('rank5')
  const [theme, setTheme] = useState('fisico')
  const [monthObjective, setMonthObjective] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoBusy, setPhotoBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [alsoDownload, setAlsoDownload] = useState(true)

  if (loading)
    return (
      <Layout>
        <p>{t('summonPreparing')}</p>
      </Layout>
    )
  if (error || !data)
    return (
      <Layout title={t('error')}>
        <p>{error}</p>
      </Layout>
    )

  const themes = Object.keys(data.themes)
  const week = data.config.current_week
  const bossMeta = data.month.bosses?.find((b) => b.week === week) || data.month.bosses?.[0]
  const themeDef = data.themes[theme]

  async function onPhoto(file: File | undefined) {
    if (!file) return
    setPhotoBusy(true)
    setFormError('')
    try {
      const url = await fileToPhotoDataUrl(file)
      setPhotoPreview(url)
    } catch {
      setFormError(t('photoFail'))
    } finally {
      setPhotoBusy(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setFormError(t('needName'))
      return
    }
    if (!bossMeta) {
      setFormError(t('needBoss'))
      return
    }
    const rank = rankById(rankId)
    const hero = buildLocalHero({
      character_name: name,
      class: cls,
      sex,
      real_name_redacted: rank.en,
      real_name_redacted_pt: rank.pt,
      theme,
      month_objective: monthObjective,
      photoDataUrl: photoPreview || undefined,
      existingIds: data!.heroes.map((h) => h.id),
      month: data!.config.current_month,
      week,
      boss: {
        id: bossMeta.id || 'boss',
        name: bossMeta.name,
        name_pt: bossMeta.name_pt,
        points: bossMeta.points,
      },
    })
    addLocalHero(hero)
    if (alsoDownload) downloadHeroPack(hero, data!.config.current_month)
    reload()
    setLoc(`/player/${hero.id}`)
  }

  return (
    <Layout title={t('summonTitle')}>
      <p className="mb-4 max-w-xl opacity-85">{t('summonHelp')}</p>
      <form onSubmit={onSubmit} className="panel grid max-w-xl gap-4 p-4">
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('charName')}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={locale === 'pt' ? 'ex: Brasa de Carvalho' : 'e.g. Oakflame'}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
            autoFocus
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('classField')}</span>
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          >
            {CLASS_OPTS.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === 'pt' ? c.pt : c.en}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('sexField')}</span>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as 'male' | 'female')}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          >
            <option value="male">{t('sexMale')}</option>
            <option value="female">{t('sexFemale')}</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('rankField')}</span>
          <select
            value={rankId}
            onChange={(e) => setRankId(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          >
            {RANK_OPTIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {locale === 'pt' ? r.pt : r.en}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs opacity-70">{t('rankHelp')}</span>
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('photoField')}</span>
          <input
            type="file"
            accept="image/*"
            disabled={photoBusy}
            onChange={(e) => void onPhoto(e.target.files?.[0])}
            className="mt-1 w-full text-sm file:mr-3 file:border file:border-[var(--color-gold-dim)] file:bg-[var(--color-charcoal)] file:px-2 file:py-1 file:text-[var(--color-gold)]"
          />
          <span className="mt-1 block text-xs opacity-70">{t('photoHelp')}</span>
          {photoPreview && (
            <img
              src={photoPreview}
              alt=""
              className="mt-2 h-20 w-16 border border-[var(--color-gold-dim)] object-cover"
            />
          )}
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('dimension')}</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          >
            {themes.map((th) => (
              <option key={th} value={th}>
                {pickL((data.themes[th] || {}) as Record<string, unknown>, 'name', locale) || th}
              </option>
            ))}
          </select>
          {themeDef?.subareas && themeDef.subareas.length > 0 && (
            <span className="mt-1 block text-xs opacity-70">
              {themeDef.subareas
                .map((s) => pickL(s as Record<string, unknown>, 'name', locale) || s.id)
                .join(' · ')}
            </span>
          )}
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('monthObjective')}</span>
          <textarea
            value={monthObjective}
            onChange={(e) => setMonthObjective(e.target.value)}
            rows={2}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm opacity-85">
          <input
            type="checkbox"
            checked={alsoDownload}
            onChange={(e) => setAlsoDownload(e.target.checked)}
          />
          {t('downloadPack')}
        </label>
        {formError && <p className="text-sm text-red-300">{formError}</p>}
        <button
          type="submit"
          disabled={photoBusy}
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)] disabled:opacity-50"
        >
          {t('summonCta')}
        </button>
      </form>
    </Layout>
  )
}
