import { useState, type FormEvent } from 'react'
import { useLocation } from 'wouter'
import { Layout } from '../components/Layout'
import { createLocalFamily } from '../lib/familyStore'
import { fileToPhotoDataUrl } from '../lib/photoUpload'
import { useGameData } from '../hooks/useGameData'
import { useLocale } from '../lib/i18n'

export function CreateFamily() {
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const [, setLoc] = useLocation()
  const [name, setName] = useState('')
  const [namePt, setNamePt] = useState('')
  const [crest, setCrest] = useState('docs/assets/crests/casa_inicial.svg')
  const [crestPreview, setCrestPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  if (loading)
    return (
      <Layout>
        <p>{t('opening')}</p>
      </Layout>
    )
  if (error || !data)
    return (
      <Layout title={t('error')}>
        <p>{error}</p>
      </Layout>
    )

  async function onCrest(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setFormError('')
    try {
      const url = await fileToPhotoDataUrl(file, 256, 0.88)
      setCrestPreview(url)
      setCrest(url)
    } catch {
      setFormError(t('photoFail'))
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setFormError(t('needFamilyName'))
      return
    }
    createLocalFamily({
      name: name.trim(),
      name_pt: namePt.trim() || name.trim(),
      crest: crestPreview || crest,
      existingIds: (data!.families || []).map((f) => f.id),
    })
    reload()
    setLoc('/')
  }

  return (
    <Layout title={t('createFamilyTitle')}>
      <p className="mb-4 max-w-xl opacity-85">{t('createFamilyHelp')}</p>
      <form onSubmit={onSubmit} className="panel grid max-w-xl gap-4 p-4">
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('familyNameEn')}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={locale === 'pt' ? 'ex: Casa Brasa' : 'e.g. House Ember'}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
            autoFocus
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('familyNamePt')}</span>
          <input
            value={namePt}
            onChange={(e) => setNamePt(e.target.value)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-xs text-[var(--color-gold)]">{t('familyCrest')}</span>
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => void onCrest(e.target.files?.[0])}
            className="mt-1 w-full text-sm file:mr-3 file:border file:border-[var(--color-gold-dim)] file:bg-[var(--color-charcoal)] file:px-2 file:py-1 file:text-[var(--color-gold)]"
          />
          <span className="mt-1 block text-xs opacity-70">{t('familyCrestHelp')}</span>
          {(crestPreview || crest) && (
            <img
              src={crestPreview || crest}
              alt=""
              className="mt-2 h-16 w-16 border border-[var(--color-gold-dim)] object-cover"
            />
          )}
        </label>
        {formError && <p className="text-sm text-red-300">{formError}</p>}
        <button
          type="submit"
          disabled={busy}
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)] disabled:opacity-50"
        >
          {t('createFamilyCta')}
        </button>
      </form>
    </Layout>
  )
}
