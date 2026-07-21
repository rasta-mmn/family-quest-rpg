import { useEffect, useState } from 'react'
import { AdminCampaignMapEditor } from './AdminCampaignMapEditor'
import { BestiaryRosterPicker } from './BestiaryRosterPicker'
import {
  applyCampaignToMonth,
  buildCampaignMd,
  campaignDominantTheme,
  campaignIdFromMonthNumber,
  CITY_MAP_CATALOG,
  creatureArt,
  emptyCampaign,
  emptyVassal,
  isLoreCustomFlag,
  mergeCampaignDraft,
  normalizeCampaign,
  seasonMetaForMonth,
  vassalSlotsForWeeks,
} from '../lib/campaign'
import { applyGeneratedLore } from '../lib/campaignLore'
import { commitCampaign } from '../lib/commitDocs'
import { loadAdminEdits, patchAdminEdits } from '../lib/editsStore'
import { assetUrl, downloadMarkdown, fetchDoc, hasGithubToken } from '../lib/githubApi'
import { pickL, useLocale } from '../lib/i18n'
import { parseMarkdown } from '../lib/mdParser'
import { themeKeys } from '../lib/bossSelector'
import type { Campaign, CampaignVassal } from '../lib/types'
import type { GameData } from '../hooks/useGameData'

type Props = {
  data: GameData
  busy: boolean
  setBusy: (v: boolean) => void
  setMsg: (v: string) => void
  reload: () => void
}

export function AdminCampaignTab({ data, busy, setBusy, setMsg, reload }: Props) {
  const { locale, t } = useLocale()
  const themes = themeKeys(data.themes)
  const initialId =
    data.month.campaign ||
    campaignIdFromMonthNumber(data.month.month_number || 1)

  const [campId, setCampId] = useState(initialId)
  const [camp, setCamp] = useState<Campaign>(
    normalizeCampaign(data.campaign || emptyCampaign(initialId), initialId),
  )
  const [loadingCamp, setLoadingCamp] = useState(false)
  const [loreFlash, setLoreFlash] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [picker, setPicker] = useState<null | { mode: 'boss' | 'vassal'; vassalIndex?: number }>(
    null,
  )
  const weeks = data.month.weeks || []
  const vassalSlots = vassalSlotsForWeeks(weeks)
  const lastWeek = weeks[weeks.length - 1] || '—'
  const visibleVassals = (camp.vassals || []).slice(0, vassalSlots)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingCamp(true)
      try {
        const raw = await fetchDoc(`config/campaigns/${campId}.md`)
        if (cancelled) return
        const parsed = normalizeCampaign(parseMarkdown<Campaign>(raw).data, campId)
        const draft = loadAdminEdits().campaigns?.[campId]
        setCamp(draft ? mergeCampaignDraft(parsed, draft, campId) : parsed)
        setDirty(false)
      } catch {
        if (!cancelled) {
          const draft = loadAdminEdits().campaigns?.[campId]
          setCamp(draft ? normalizeCampaign(draft, campId) : emptyCampaign(campId))
          setDirty(false)
        }
      } finally {
        if (!cancelled) setLoadingCamp(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [campId])

  // Pad pool when Calendar adds weeks (e.g. 4 → 5 unlocks 4th vassal slot).
  useEffect(() => {
    setCamp((c) => {
      const list = [...(c.vassals || [])].sort((a, b) => a.week_index - b.week_index)
      if (list.length >= vassalSlots) return c
      const fallback = campaignDominantTheme(c)
      while (list.length < vassalSlots) list.push(emptyVassal(list.length + 1, fallback))
      return { ...c, vassals: list }
    })
  }, [vassalSlots])

  /** Sync template lore when structured names change (unless lore_custom). */
  function withLoreSync(c: Campaign): Campaign {
    return isLoreCustomFlag(c.lore_custom)
      ? c
      : applyGeneratedLore({ ...c, id: campId, lore_custom: false })
  }

  function markDirty() {
    setDirty(true)
  }

  function patchMeta(p: Partial<Campaign>) {
    markDirty()
    setCamp((c) => withLoreSync({ ...c, ...p, id: campId }))
  }

  /** Map art / landmarks — local only until Save. */
  function patchMap(p: Partial<Campaign>) {
    markDirty()
    setCamp((c) => ({ ...c, ...p, id: campId }))
  }

  /** Write campaign draft to localStorage (only from Save / Commit / Download). */
  function persistDraft(next: Campaign) {
    const normalized = normalizeCampaign(
      { ...next, id: campId, month_number: Number(campId) || next.month_number },
      campId,
    )
    const applied = applyCampaignToMonth(data.month, normalized)
    patchAdminEdits({
      campaigns: { [campId]: normalized },
      month: {
        campaign: campId,
        month_number: normalized.month_number,
        theme: applied.theme,
        bosses: applied.bosses,
      },
    })
    return normalized
  }

  function patchBoss(p: Partial<Campaign['boss']>) {
    markDirty()
    setCamp((c) => {
      const boss = { ...c.boss, ...p }
      const next = {
        ...c,
        id: campId,
        boss,
        theme: boss.theme || c.theme,
      }
      const nameTouched = 'name' in p || 'name_pt' in p
      return nameTouched ? withLoreSync(next) : next
    })
  }

  function patchVassal(index: number, p: Partial<CampaignVassal>) {
    markDirty()
    setCamp((c) => {
      const vassals = [...(c.vassals || [])]
      while (vassals.length <= index) vassals.push(emptyVassal(vassals.length + 1))
      vassals[index] = { ...vassals[index], ...p }
      const next = { ...c, id: campId, vassals }
      const nameTouched = 'name' in p || 'name_pt' in p
      return nameTouched ? withLoreSync(next) : next
    })
  }

  function applyRosterPick(
    mode: 'boss' | 'vassal',
    pick: {
      id: string
      name: string
      name_pt?: string
      avatar: string
      lore?: string
      lore_pt?: string
    },
    vassalIndex?: number,
  ) {
    const creatureId = pick.id.replace(/_avatar_\d+$/, '')
    const patch = {
      id: creatureId,
      name: pick.name,
      name_pt: pick.name_pt || pick.name,
      avatar: pick.avatar,
      image: pick.avatar,
      lore: pick.lore,
      lore_pt: pick.lore_pt,
    }
    markDirty()
    if (mode === 'boss') {
      const boss = { ...camp.boss, ...patch }
      setCamp(
        withLoreSync({
          ...camp,
          id: campId,
          boss,
          theme: boss.theme || camp.theme,
        }),
      )
    } else {
      const vassals = [...(camp.vassals || [])]
      const i = vassalIndex ?? 0
      while (vassals.length <= i) vassals.push(emptyVassal(vassals.length + 1))
      vassals[i] = { ...vassals[i], ...patch }
      setCamp(withLoreSync({ ...camp, id: campId, vassals }))
    }
  }

  /** Always force template regen — clears lore_custom and rewrites all derived fields. */
  function regenerateLore() {
    markDirty()
    setCamp((c) => {
      const next = applyGeneratedLore({
        ...c,
        id: campId,
        month_number: Number(campId) || c.month_number,
        lore_custom: false,
      })
      return { ...next, lore_custom: false }
    })
    setLoreFlash(true)
    setMsg(t('loreRegenerated') + ' — ' + t('saveAdminHint'))
    window.setTimeout(() => setLoreFlash(false), 2500)
  }

  function saveLocal() {
    const next = persistDraft(camp)
    setCamp(next)
    setDirty(false)
    setMsg(t('savedLocal'))
    reload()
  }

  async function handleCommit() {
    setBusy(true)
    setMsg('')
    try {
      const next = { ...camp, id: campId, month_number: Number(campId) || camp.month_number }
      saveLocal()
      if (!hasGithubToken()) throw new Error('NO_TOKEN')
      const files = await commitCampaign(next)
      setMsg(`${t('committed')} ${files.join(', ')}`)
      reload()
    } catch (e) {
      setMsg(e instanceof Error && e.message === 'NO_TOKEN' ? t('needToken') : String(e))
    } finally {
      setBusy(false)
    }
  }

  function handleDownload() {
    const next = { ...camp, id: campId }
    saveLocal()
    downloadMarkdown(`campaign-${campId}.md`, buildCampaignMd(next))
  }

  const imgSrc = (path?: string) => {
    if (!path) return ''
    if (path.startsWith('data:')) return path
    return assetUrl(path)
  }

  if (loadingCamp) return <p className="opacity-70">{t('loadingAdmin')}</p>

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm opacity-70">{t('campaignTabHelp')}</p>

      <label className="block text-sm">
        <span className="font-display text-xs text-[var(--color-gold)]">{t('campaignPick')}</span>
        <select
          value={campId}
          onChange={(e) => setCampId(e.target.value)}
          className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
        >
          {CITY_MAP_CATALOG.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id} — {m.city} ({m.season})
            </option>
          ))}
        </select>
      </label>

      <div className="panel space-y-3 p-4">
        <h3 className="font-display text-xs text-[var(--color-gold)]">{t('campaignMeta')}</h3>
        <label className="block text-sm">
          {t('campaignWorld')} EN
          <input
            value={camp.world || ''}
            onChange={(e) => patchMeta({ world: e.target.value })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <label className="block text-sm">
          {t('campaignWorld')} PT
          <input
            value={camp.world_pt || ''}
            onChange={(e) => patchMeta({ world_pt: e.target.value })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <div className="space-y-1 text-sm">
          <p className="font-display text-xs text-[var(--color-gold)]">{t('campaignSeason')}</p>
          <p className="opacity-90">
            {camp.season_name_pt || camp.season_name || camp.season}{' '}
            <span className="opacity-60">
              ({seasonMetaForMonth(Number(campId) || 1).season})
            </span>
          </p>
          <p className="text-xs opacity-70">{t('campaignSeasonHelp')}</p>
          <p className="text-xs opacity-60">{t('campaignSeasonLocked')}</p>
        </div>
        <label className="block text-sm">
          {t('campaignCity')} EN
          <input
            value={camp.city || ''}
            onChange={(e) => patchMeta({ city: e.target.value })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <label className="block text-sm">
          {t('campaignCity')} PT
          <input
            value={camp.city_pt || ''}
            onChange={(e) => patchMeta({ city_pt: e.target.value })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <label className="block text-sm">
          {t('campaignTitle')} EN
          <input
            value={camp.title}
            onChange={(e) => {
              markDirty()
              setCamp((c) => ({ ...c, title: e.target.value }))
            }}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <label className="block text-sm">
          {t('campaignTitle')} PT
          <input
            value={camp.title_pt || ''}
            onChange={(e) => {
              markDirty()
              setCamp((c) => ({ ...c, title_pt: e.target.value }))
            }}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <div className="space-y-2 border border-[var(--color-gold-dim)]/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-display text-xs text-[var(--color-gold)]">
              {t('campaignLore')}
            </h4>
            <button
              type="button"
              onClick={regenerateLore}
              disabled={busy || loadingCamp}
              className="border border-[var(--color-gold)] px-3 py-1.5 font-display text-[10px] tracking-widest text-[var(--color-gold)] disabled:opacity-50"
            >
              {t('regenerateLore')}
            </button>
          </div>
          <p className="text-xs opacity-70">{t('campaignLoreHelp')}</p>
          <p className="text-xs text-[var(--color-gold)]">{t('loreRegenHint')}</p>
          {loreFlash ? (
            <p className="text-xs font-display tracking-wide text-[var(--color-gold)]">
              {t('loreRegenerated')}
            </p>
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isLoreCustomFlag(camp.lore_custom)}
              onChange={(e) => {
                const on = e.target.checked
                markDirty()
                setCamp((c) =>
                  on
                    ? { ...c, id: campId, lore_custom: true }
                    : {
                        ...applyGeneratedLore({ ...c, id: campId, lore_custom: false }),
                        lore_custom: false,
                      },
                )
              }}
            />
            {t('loreCustom')}
          </label>
          {isLoreCustomFlag(camp.lore_custom) ? (
            <>
              <label className="block text-sm">
                {t('campaignLore')} EN
                <textarea
                  value={camp.lore || ''}
                  onChange={(e) => {
                    markDirty()
                    setCamp((c) => ({ ...c, lore: e.target.value }))
                  }}
                  rows={6}
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                />
              </label>
              <label className="block text-sm">
                {t('campaignLore')} PT
                <textarea
                  value={camp.lore_pt || ''}
                  onChange={(e) => {
                    markDirty()
                    setCamp((c) => ({ ...c, lore_pt: e.target.value }))
                  }}
                  rows={6}
                  className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
                />
              </label>
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-sm border border-[var(--color-gold-dim)]/30 bg-[var(--color-charcoal)]/60 px-3 py-3 text-sm leading-relaxed">
                <p className="mb-1 font-display text-[10px] tracking-widest text-[var(--color-gold)]">
                  EN
                </p>
                <p className="whitespace-pre-wrap opacity-90">{camp.lore}</p>
              </div>
              <div className="rounded-sm border border-[var(--color-gold-dim)]/30 bg-[var(--color-charcoal)]/60 px-3 py-3 text-sm leading-relaxed">
                <p className="mb-1 font-display text-[10px] tracking-widest text-[var(--color-gold)]">
                  PT
                </p>
                <p className="whitespace-pre-wrap opacity-90">{camp.lore_pt}</p>
              </div>
            </div>
          )}
        </div>
        <label className="block text-sm">
          {t('monthObjectiveField')} EN
          <input
            value={camp.month_objective || ''}
            onChange={(e) => {
              if (!isLoreCustomFlag(camp.lore_custom)) return
              markDirty()
              setCamp((c) => ({ ...c, month_objective: e.target.value }))
            }}
            readOnly={!isLoreCustomFlag(camp.lore_custom)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 read-only:opacity-70"
          />
        </label>
        <label className="block text-sm">
          {t('monthObjectiveField')} PT
          <input
            value={camp.month_objective_pt || ''}
            onChange={(e) => {
              if (!isLoreCustomFlag(camp.lore_custom)) return
              markDirty()
              setCamp((c) => ({ ...c, month_objective_pt: e.target.value }))
            }}
            readOnly={!isLoreCustomFlag(camp.lore_custom)}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 read-only:opacity-70"
          />
        </label>
      </div>

      <AdminCampaignMapEditor camp={camp} onChange={patchMap} />

      <div className="panel space-y-3 p-4">
        <h3 className="font-display text-xs text-[var(--color-gold)]">{t('monthBoss')}</h3>
        <p className="text-xs opacity-70">
          {t('lastWeekBoss')}: <span className="tabular-nums">{lastWeek}</span>
        </p>
        <div className="space-y-1">
          <p className="text-[10px] font-display tracking-widest text-[var(--color-gold)]">
            {t('avatarField')}
          </p>
          {creatureArt(camp.boss) ? (
            <img
              src={imgSrc(creatureArt(camp.boss))}
              alt=""
              className="bestiary-avatar h-28 w-28 border border-[var(--color-gold)] bg-[var(--color-charcoal)]"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center border border-dashed border-[var(--color-gold-dim)] text-[10px] opacity-50">
              —
            </div>
          )}
          <button
            type="button"
            onClick={() => setPicker({ mode: 'boss' })}
            className="mt-1 border border-[var(--color-gold)] px-3 py-1.5 font-display text-[10px] tracking-widest text-[var(--color-gold)]"
          >
            {t('pickAvatar')}
          </button>
        </div>
        <p className="text-xs opacity-60">{t('avatarVsPhotoHelp')}</p>
        <label className="block text-sm">
          {t('bossName')} EN
          <input
            value={camp.boss.name}
            onChange={(e) => patchBoss({ name: e.target.value })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <label className="block text-sm">
          {t('bossName')} PT
          <input
            value={camp.boss.name_pt || ''}
            onChange={(e) => patchBoss({ name_pt: e.target.value })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
        <label className="block text-sm">
          {t('dominantTheme')}
          <select
            value={camp.boss.theme || camp.theme || 'fisico'}
            onChange={(e) => patchBoss({ theme: e.target.value })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          >
            {themes.map((tk) => (
              <option key={tk} value={tk}>
                {pickL((data.themes[tk] || {}) as Record<string, unknown>, 'name', locale) || tk}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          {t('bossLore')} EN
          <textarea
            value={camp.boss.lore || ''}
            onChange={(e) =>
              isLoreCustomFlag(camp.lore_custom)
                ? patchBoss({ lore: e.target.value })
                : undefined
            }
            readOnly={!isLoreCustomFlag(camp.lore_custom)}
            rows={2}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 read-only:opacity-70"
          />
        </label>
        <label className="block text-sm">
          {t('bossLore')} PT
          <textarea
            value={camp.boss.lore_pt || ''}
            onChange={(e) =>
              isLoreCustomFlag(camp.lore_custom)
                ? patchBoss({ lore_pt: e.target.value })
                : undefined
            }
            readOnly={!isLoreCustomFlag(camp.lore_custom)}
            rows={2}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 read-only:opacity-70"
          />
        </label>
        <label className="block text-sm">
          {t('victoryPoints')}
          <input
            type="number"
            min={0}
            value={camp.boss.points}
            onChange={(e) => patchBoss({ points: Number(e.target.value) })}
            className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
          />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-xs text-[var(--color-gold)]">{t('weeklyVassals')}</h3>
        <p className="text-xs opacity-70">{t('vassalSlotsHelp')}</p>
        {visibleVassals.map((v, i) => (
          <fieldset
            key={v.id + i}
            className="panel space-y-2 border border-[var(--color-gold-dim)]/40 p-3"
          >
            <legend className="px-1 text-[var(--color-gold)]">
              {t('vassal')} {v.week_index}
              {weeks[i] ? ` · ${weeks[i]}` : ''}
            </legend>
            <div className="space-y-1">
              <p className="text-[10px] opacity-70">{t('avatarField')}</p>
              {creatureArt(v) ? (
                <img
                  src={imgSrc(creatureArt(v))}
                  alt=""
                  className="bestiary-avatar h-20 w-20 border border-[var(--color-gold)] bg-[var(--color-charcoal)]"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center border border-dashed border-[var(--color-gold-dim)] text-[9px] opacity-50">
                  —
                </div>
              )}
              <button
                type="button"
                onClick={() => setPicker({ mode: 'vassal', vassalIndex: i })}
                className="border border-[var(--color-gold-dim)] px-2 py-1 font-display text-[9px] tracking-widest text-[var(--color-gold)]"
              >
                {t('pickAvatar')}
              </button>
            </div>
            <label className="block text-sm">
              {t('bossName')} EN
              <input
                value={v.name}
                onChange={(e) => patchVassal(i, { name: e.target.value })}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
            <label className="block text-sm">
              {t('bossName')} PT
              <input
                value={v.name_pt || ''}
                onChange={(e) => patchVassal(i, { name_pt: e.target.value })}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
            <label className="block text-sm">
              {t('dominantTheme')}
              <select
                value={v.theme || camp.theme || 'fisico'}
                onChange={(e) => patchVassal(i, { theme: e.target.value })}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              >
                {themes.map((tk) => (
                  <option key={tk} value={tk}>
                    {pickL((data.themes[tk] || {}) as Record<string, unknown>, 'name', locale) ||
                      tk}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              {t('weekObjective')} EN
              <input
                value={v.objective || ''}
                onChange={(e) => patchVassal(i, { objective: e.target.value })}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
            <label className="block text-sm">
              {t('weekObjective')} PT
              <input
                value={v.objective_pt || ''}
                onChange={(e) => patchVassal(i, { objective_pt: e.target.value })}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
            <label className="block text-sm">
              {t('vassalLore')} EN
              <textarea
                value={v.lore || ''}
                onChange={(e) =>
                  isLoreCustomFlag(camp.lore_custom)
                    ? patchVassal(i, { lore: e.target.value })
                    : undefined
                }
                readOnly={!isLoreCustomFlag(camp.lore_custom)}
                rows={2}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 read-only:opacity-70"
              />
            </label>
            <label className="block text-sm">
              {t('vassalLore')} PT
              <textarea
                value={v.lore_pt || ''}
                onChange={(e) =>
                  isLoreCustomFlag(camp.lore_custom)
                    ? patchVassal(i, { lore_pt: e.target.value })
                    : undefined
                }
                readOnly={!isLoreCustomFlag(camp.lore_custom)}
                rows={2}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1 read-only:opacity-70"
              />
            </label>
            <label className="block text-sm">
              {t('victoryPoints')}
              <input
                type="number"
                min={0}
                value={v.points}
                onChange={(e) => patchVassal(i, { points: Number(e.target.value) })}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
          </fieldset>
        ))}
      </div>

      {picker && (
        <BestiaryRosterPicker
          prefer={picker.mode}
          onClose={() => setPicker(null)}
          onPick={(pick) => {
            if (picker.mode === 'boss') {
              applyRosterPick('boss', pick)
            } else if (picker.vassalIndex != null) {
              applyRosterPick('vassal', pick, picker.vassalIndex)
            }
            setPicker(null)
          }}
        />
      )}

      <div className="flex flex-wrap gap-2 pb-20">
        <button
          type="button"
          disabled={busy || !dirty}
          onClick={saveLocal}
          className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] disabled:opacity-50"
        >
          {t('saveAdmin')}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleCommit()}
          className="border border-[var(--color-gold)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] disabled:opacity-50"
        >
          {t('commitCampaign')}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={handleDownload}
          className="border border-[var(--color-gold-dim)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] disabled:opacity-50"
        >
          {t('download')} campaign-{campId}.md
        </button>
      </div>

      <button
        type="button"
        disabled={busy || !dirty}
        onClick={saveLocal}
        className="admin-save-fab"
        title={dirty ? t('saveAdmin') : t('saveAdminClean')}
      >
        <span className="font-display text-[10px] tracking-widest">{t('saveAdminFloat')}</span>
        {dirty ? <span className="admin-save-fab-dot" aria-hidden /> : null}
      </button>
    </div>
  )
}
