import { useEffect, useState, type FormEvent } from 'react'
import { AdminBestiaryTab } from '../components/AdminBestiaryTab'
import { AdminCampaignTab } from '../components/AdminCampaignTab'
import { Layout } from '../components/Layout'
import {
  applyCampaignToMonth,
  campaignDominantTheme,
  campaignIdFromMonthNumber,
  emptyCampaign,
  normalizeCampaign,
} from '../lib/campaign'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'
import { loadAdminEdits, patchAdminEdits } from '../lib/editsStore'
import { downloadAdminExports } from '../lib/exportMarkdown'
import {
  downloadMarkdown,
  fetchDoc,
  getGithubToken,
  hasGithubToken,
  setGithubToken,
} from '../lib/githubApi'
import { commitAdminMonth, commitAllPlayerSheets, commitLevelUp } from '../lib/commitDocs'
import {
  applyBossDone,
  familyGateThreshold,
  familyPointsPool,
  heroEligibleForLevelUp,
  heroLevelUpPoints,
  bossGatePerHero,
} from '../lib/family'
import {
  getFamilySession,
  setFamilyBossDone,
  upsertLocalFamily,
} from '../lib/familyStore'
import { buildLevelUpPack, pickUpgrade } from '../lib/levelUp'
import { parseMarkdown } from '../lib/mdParser'
import type { Campaign, MonthSetup } from '../lib/types'

type AdminTab = 'calendar' | 'campaign' | 'bestiary' | 'families'

export function Admin() {
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinError, setPinError] = useState('')
  const [ready, setReady] = useState(false)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [token, setToken] = useState('')
  const [tab, setTab] = useState<AdminTab>('calendar')

  const [month, setMonth] = useState('')
  const [monthNumber, setMonthNumber] = useState(1)
  const [campaignId, setCampaignId] = useState('01')
  const [weeksRaw, setWeeksRaw] = useState('')
  const [currentWeek, setCurrentWeek] = useState('')
  const [weeksHit, setWeeksHit] = useState(4)
  const [rewardEn, setRewardEn] = useState('Legendary Reward')
  const [rewardPt, setRewardPt] = useState('Recompensa Lendária')
  const [calendarDirty, setCalendarDirty] = useState(false)

  useEffect(() => {
    setToken(getGithubToken())
  }, [])

  useEffect(() => {
    if (!data || ready) return
    setMonth(data.config.current_month)
    setWeeksRaw((data.month.weeks || []).join(', '))
    setMonthNumber(data.month.month_number || 1)
    setCampaignId(
      data.month.campaign ||
        campaignIdFromMonthNumber(data.month.month_number || 1),
    )
    setCurrentWeek(data.config.current_week)
    setCalendarDirty(false)
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

  const weekList = weeksRaw.split(/[,\s]+/).map((w) => w.trim()).filter(Boolean)

  function tryAuth(e: FormEvent) {
    e.preventDefault()
    if (pin === data!.config.admin_pin) {
      setAuthed(true)
      setPinError('')
    } else {
      setPinError(t('badPin'))
    }
  }

  async function resolveCampaign(id?: string): Promise<Campaign> {
    const campId = id || campaignId || campaignIdFromMonthNumber(monthNumber)
    // Prefer in-memory draft for this id (Admin Campaign tab saves here).
    const draft = loadAdminEdits().campaigns?.[campId]
    if (draft) return normalizeCampaign(draft, campId)
    if (data!.campaign?.id === campId) return normalizeCampaign(data!.campaign, campId)
    try {
      const raw = await fetchDoc(`config/campaigns/${campId}.md`)
      return normalizeCampaign(parseMarkdown<Campaign>(raw).data, campId)
    } catch {
      return emptyCampaign(campId)
    }
  }

  async function buildMonthSetup(): Promise<MonthSetup> {
    // Keep month_number ↔ campaign id aligned (Aug → "08").
    const linkedId = campaignIdFromMonthNumber(monthNumber)
    if (campaignId !== linkedId) setCampaignId(linkedId)
    const camp = await resolveCampaign(linkedId)
    const theme = campaignDominantTheme(camp)
    const base: MonthSetup = {
      month,
      month_number: monthNumber,
      campaign: linkedId,
      weeks: weekList,
      theme,
      bosses: [],
      objectives: {},
    }
    for (const h of data!.heroes) {
      base.objectives![h.id] = {
        theme: h.objectives.theme || base.theme,
        month_objective: h.objectives.month_objective || '',
      }
    }
    return applyCampaignToMonth(base, camp)
  }

  async function saveAdmin() {
    const setup = await buildMonthSetup()
    patchAdminEdits({
      current_month: month,
      current_week: currentWeek || weekList[0] || data!.config.current_week,
      month: {
        month: setup.month,
        month_number: setup.month_number,
        campaign: setup.campaign,
        weeks: setup.weeks,
        theme: setup.theme,
        bosses: setup.bosses,
      },
    })
    setCalendarDirty(false)
    setMsg(t('savedLocal'))
    reload()
  }

  async function handleDownload() {
    await saveAdmin()
    const setup = await buildMonthSetup()
    downloadAdminExports({
      config: {
        current_month: month,
        current_week: currentWeek || weekList[0] || '',
      },
      month: setup,
    })
  }

  async function handleCommit() {
    setBusy(true)
    setMsg('')
    try {
      await saveAdmin()
      const setup = await buildMonthSetup()
      const files = await commitAdminMonth({
        current_month: month,
        current_week: currentWeek || weekList[0] || '',
        month: setup,
      })
      setMsg(`${t('committed')} ${files.join(', ')}`)
      reload()
    } catch (e) {
      setMsg(e instanceof Error && e.message === 'NO_TOKEN' ? t('needToken') : String(e))
    } finally {
      setBusy(false)
    }
  }

  async function handleCommitAllSheets() {
    setBusy(true)
    setMsg('')
    try {
      if (!hasGithubToken()) throw new Error('NO_TOKEN')
      const results = await commitAllPlayerSheets({
        month: month || data!.config.current_month,
        heroes: data!.heroes,
      })
      const summary = results.map((r) => `${r.heroId}(${r.files.length})`).join(', ')
      setMsg(`${t('committedAllSheets')} ${summary}`)
      reload()
    } catch (e) {
      setMsg(e instanceof Error && e.message === 'NO_TOKEN' ? t('needToken') : String(e))
    } finally {
      setBusy(false)
    }
  }

  function familyBossDoneForHero(heroId: string): boolean {
    const fam = data!.families.find((f) => f.hero_ids?.includes(heroId))
    if (!fam) return Boolean(data!.familySession?.boss_done)
    const sess =
      getFamilySession(fam.id, data!.config.current_week) ||
      (data!.activeFamily?.id === fam.id ? data!.familySession : null)
    return Boolean(sess?.boss_done || fam.boss_outcome === 'victory')
  }

  async function levelUpHero(
    heroId: string,
    opts?: { monthOverride?: number; skipBossCheck?: boolean; silent?: boolean },
  ) {
    if (!opts?.silent) {
      setBusy(true)
      setMsg('')
    }
    try {
      if (!opts?.skipBossCheck && !familyBossDoneForHero(heroId)) {
        throw new Error(t('levelUpNeedBoss'))
      }
      const hero = data!.heroes.find((h) => h.id === heroId)
      if (!hero) throw new Error('Hero missing')
      const familyWon = familyBossDoneForHero(heroId) || Boolean(opts?.skipBossCheck)
      if (!heroEligibleForLevelUp(hero.weekly, familyWon, data!.config.points)) {
        const pts = heroLevelUpPoints(hero.weekly, familyWon, data!.config.points)
        const need = bossGatePerHero(data!.config.points)
        throw new Error(`${t('levelUpNeed400')} (${Math.round(pts)} / ${need})`)
      }
      const classDef = data!.classes[hero.profile.class]
      if (!classDef) throw new Error('Class missing')
      const fam = data!.families.find((f) => f.hero_ids?.includes(heroId))
      const clearedMonth =
        opts?.monthOverride ?? Number(fam?.map_campaign_id) ?? monthNumber
      const up = pickUpgrade(classDef, clearedMonth)
      if (!up) throw new Error(`No upgrade for month ${clearedMonth}`)

      let rewards: Record<string, unknown>[] = []
      try {
        const raw = await fetchDoc(`${heroId}/rewards.md`)
        rewards = parseMarkdown<{ rewards: Record<string, unknown>[] }>(raw).data.rewards || []
      } catch {
        rewards = []
      }

      const slots = {
        weapon: hero.appearance?.slots?.weapon ?? null,
        armor: hero.appearance?.slots?.armor ?? null,
        appearance: hero.appearance?.slots?.appearance ?? null,
      }

      const pack = buildLevelUpPack({
        profile: hero.profile,
        skills: hero.skills,
        slots,
        rewards,
        classDef,
        monthNumber: clearedMonth,
        monthId: month,
        rewardLabel: rewardEn,
        rewardLabelPt: rewardPt,
        weeksHit,
        eurosPerWeek: data!.config.points.weekly_reward_euros || 10,
      })
      if (!pack) throw new Error('Level-up pack failed')

      if (hasGithubToken()) {
        const files = await commitLevelUp(heroId, pack)
        if (!opts?.silent) {
          setMsg(
            `${t('levelUpOk')} ${heroId} → lv ${pack.newLevel} (${pack.upgrade.name}). ${files.join(', ')}`,
          )
        }
      } else {
        downloadMarkdown(`${heroId}__profile.md`, pack.profileMd)
        downloadMarkdown(`${heroId}__skills.md`, pack.skillsMd)
        downloadMarkdown(`${heroId}__appearance.md`, pack.appearanceMd)
        downloadMarkdown(`${heroId}__rewards.md`, pack.rewardsMd)
        if (!opts?.silent) {
          setMsg(`${t('levelUpOk')} ${heroId} — ${t('download')} (no token)`)
        }
      }
      if (!opts?.silent) reload()
      return pack.newLevel
    } catch (e) {
      if (!opts?.silent) setMsg(String(e))
      throw e
    } finally {
      if (!opts?.silent) setBusy(false)
    }
  }

  async function applyFamilyVictory(familyId: string) {
    setBusy(true)
    setMsg('')
    try {
      const f = data!.families.find((x) => x.id === familyId)
      if (!f) throw new Error('Family missing')
      const clearedMonth = Number(f.map_campaign_id) || monthNumber
      setFamilyBossDone(f.id, data!.config.current_week, true)
      let leveled = 0
      let skipped = 0
      for (const hid of f.hero_ids || []) {
        const hero = data!.heroes.find((h) => h.id === hid)
        if (!heroEligibleForLevelUp(hero?.weekly, true, data!.config.points)) {
          skipped++
          continue
        }
        try {
          await levelUpHero(hid, {
            monthOverride: clearedMonth,
            skipBossCheck: true,
            silent: true,
          })
          leveled++
        } catch {
          skipped++
        }
      }
      const next = applyBossDone(f, true)
      upsertLocalFamily(next)
      const label = pickL(f as unknown as Record<string, unknown>, 'name', locale)
      setMsg(
        `${label}: victory → city ${next.map_campaign_id} · level-up ×${leveled}` +
          (skipped ? ` · skip ×${skipped} (<400)` : ''),
      )
      reload()
    } catch (e) {
      setMsg(String(e))
    } finally {
      setBusy(false)
    }
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

  const tabBtn = (id: AdminTab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`border px-4 py-2 font-display text-xs tracking-widest ${
        tab === id
          ? 'border-[var(--color-gold)] bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
          : 'border-[var(--color-gold-dim)] text-[var(--color-gold)] opacity-70'
      }`}
    >
      {label}
    </button>
  )

  return (
    <Layout title={t('monthSetup')}>
      <p className="mb-2 opacity-85">{t('adminScopeHelp')}</p>
      <p className="mb-4 text-sm opacity-70">{t('adminPlayerMissionsNote')}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabBtn('calendar', t('adminTabCalendar'))}
        {tabBtn('campaign', t('adminTabCampaign'))}
        {tabBtn('families', t('adminFamilies'))}
        {tabBtn('bestiary', t('adminTabBestiary'))}
      </div>

      <div className="panel mb-4 max-w-2xl space-y-2 p-4">
        <h3 className="font-display text-xs text-[var(--color-gold)]">{t('githubToken')}</h3>
        <p className="text-xs opacity-70">{t('githubTokenHelp')}</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_…"
          className="w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2 text-sm"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => {
            setGithubToken(token)
            setMsg(token.trim() ? t('tokenSaved') : t('tokenCleared'))
          }}
          className="border border-[var(--color-gold-dim)] px-3 py-2 text-xs font-display tracking-widest text-[var(--color-gold)]"
        >
          {t('saveToken')}
        </button>
      </div>

      {tab === 'bestiary' ? (
        <AdminBestiaryTab />
      ) : tab === 'campaign' ? (
        <AdminCampaignTab
          data={data}
          busy={busy}
          setBusy={setBusy}
          setMsg={setMsg}
          reload={reload}
        />
      ) : tab === 'families' ? (
        <div className="panel max-w-2xl space-y-4 p-4">
          <p className="text-sm opacity-80">{t('createFamilyHelp')}</p>
          {data.families.map((f) => {
            const sess =
              getFamilySession(f.id, data.config.current_week) ||
              (data.activeFamily?.id === f.id ? data.familySession : null)
            const bossDone = Boolean(sess?.boss_done)
            const pool = familyPointsPool(f, data.mapWeekPoints)
            const gate = familyGateThreshold(f, data.config.points)
            const label = pickL(f as unknown as Record<string, unknown>, 'name', locale)
            return (
              <div
                key={f.id}
                className="space-y-2 border border-[var(--color-gold-dim)]/50 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-sm text-[var(--color-gold)]">
                    {label}{' '}
                    <span className="opacity-60">
                      ({f.id}) · {t('familyMapCity')} {f.map_campaign_id}
                    </span>
                  </h3>
                  <span className="text-xs opacity-75">
                    {t('familyPoolLabel')}: {Math.round(pool)} / {gate}
                  </span>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={bossDone}
                    onChange={(e) => {
                      setFamilyBossDone(f.id, data.config.current_week, e.target.checked)
                      reload()
                    }}
                  />
                  {t('familyBossDone')} ({data.config.current_week})
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void applyFamilyVictory(f.id)}
                    className="border border-[var(--color-gold)] px-3 py-2 font-display text-[10px] tracking-widest text-[var(--color-gold)]"
                  >
                    {t('applyFamilyVictory')}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setFamilyBossDone(f.id, data.config.current_week, false)
                      upsertLocalFamily(applyBossDone(f, false))
                      setMsg(`${label}: defeat`)
                      reload()
                    }}
                    className="border border-[var(--color-gold-dim)] px-3 py-2 font-display text-[10px] tracking-widest text-[var(--color-gold)]"
                  >
                    {t('applyFamilyDefeat')}
                  </button>
                </div>
                <ul className="text-xs opacity-80">
                  {(f.hero_ids || []).map((hid) => {
                    const h = data.heroes.find((x) => x.id === hid)
                    return (
                      <li key={hid}>
                        {h
                          ? pickL(h.profile as unknown as Record<string, unknown>, 'character_name', locale)
                          : hid}{' '}
                        · {Math.round(data.mapWeekPoints[hid] || 0)} pts
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          <div className="panel grid max-w-2xl gap-4 p-4">
            <label className="block text-sm">
              <span className="font-display text-xs text-[var(--color-gold)]">{t('monthField')}</span>
              <input
                value={month}
                onChange={(e) => {
                  setCalendarDirty(true)
                  setMonth(e.target.value)
                }}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-xs text-[var(--color-gold)]">{t('currentWeek')}</span>
              <input
                value={currentWeek}
                onChange={(e) => {
                  setCalendarDirty(true)
                  setCurrentWeek(e.target.value)
                }}
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
                onChange={(e) => {
                  const n = Number(e.target.value)
                  setCalendarDirty(true)
                  setMonthNumber(n)
                  setCampaignId(campaignIdFromMonthNumber(n))
                }}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-xs text-[var(--color-gold)]">{t('linkCampaign')}</span>
              <select
                value={campaignId}
                onChange={(e) => {
                  setCalendarDirty(true)
                  setCampaignId(e.target.value)
                  setMonthNumber(Number(e.target.value) || monthNumber)
                }}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const id = String(i + 1).padStart(2, '0')
                  return (
                    <option key={id} value={id}>
                      {id} — {t('journeyMonth')} {i + 1}
                    </option>
                  )
                })}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-display text-xs text-[var(--color-gold)]">{t('weeksComma')}</span>
              <input
                value={weeksRaw}
                onChange={(e) => {
                  setCalendarDirty(true)
                  setWeeksRaw(e.target.value)
                }}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-3 py-2"
              />
            </label>
            <p className="text-xs opacity-60">{t('campaignTabHelp')}</p>

            {data.campaign && (
              <div className="panel bg-[var(--color-charcoal)] p-3 text-sm">
                <p className="mb-1 font-display text-xs text-[var(--color-gold)]">
                  {pickL(data.campaign as unknown as Record<string, unknown>, 'title', locale)}
                </p>
                <ul className="mt-2 list-disc pl-5 opacity-80">
                  {weekList.slice(0, -1).map((w, i) => {
                    const v = (data.campaign!.vassals || [])[i]
                    return (
                      <li key={w}>
                        {w} · {t('vassal')} {i + 1}:{' '}
                        {v
                          ? pickL(v as unknown as Record<string, unknown>, 'name', locale)
                          : '—'}
                      </li>
                    )
                  })}
                  {weekList.length > 0 && (
                    <li>
                      {weekList[weekList.length - 1]} · {t('monthBoss')}:{' '}
                      {pickL(
                        data.campaign.boss as unknown as Record<string, unknown>,
                        'name',
                        locale,
                      )}{' '}
                      (+{data.campaign.boss.points})
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="panel bg-[var(--color-charcoal)] p-3 text-sm">
              <p className="mb-2 font-display text-xs text-[var(--color-gold)]">
                {t('missionsFromSheets')}
              </p>
              <ul className="list-disc pl-5">
                {data.heroes.map((h) => (
                  <li key={h.id}>
                    {pickL(h.profile as Record<string, unknown>, 'character_name', locale)}:{' '}
                    {h.objectives.month_objective || h.objectives.theme || '—'}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pb-20">
              <button
                type="button"
                disabled={busy || !calendarDirty}
                onClick={() => void saveAdmin()}
                className="border border-[var(--color-gold)] bg-[var(--color-parchment-deep)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:bg-[var(--color-parchment)] disabled:opacity-50"
              >
                {t('saveAdmin')}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleCommit()}
                className="border border-[var(--color-gold)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] disabled:opacity-50"
              >
                {t('commitGithub')}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleCommitAllSheets()}
                className="border border-[var(--color-gold)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] disabled:opacity-50"
              >
                {t('commitAllSheets')}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDownload()}
                className="border border-[var(--color-gold-dim)] px-4 py-3 font-display text-xs tracking-widest text-[var(--color-gold)] hover:border-[var(--color-gold)] disabled:opacity-50"
              >
                {t('download')} {month || 'YYYY-MM'}.md
              </button>
            </div>
            <p className="text-xs opacity-70">{t('commitAllSheetsHelp')}</p>
          </div>

          <div className="panel mt-6 max-w-2xl space-y-3 p-4">
            <h3 className="font-display text-sm text-[var(--color-gold)]">{t('levelUpTitle')}</h3>
            <p className="text-xs opacity-70">{t('levelUpHelp')}</p>
            <label className="block text-sm">
              {t('weeksHit')}
              <input
                type="number"
                min={0}
                max={6}
                value={weeksHit}
                onChange={(e) => setWeeksHit(Number(e.target.value))}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
            <label className="block text-sm">
              {t('rewardLabel')} EN
              <input
                value={rewardEn}
                onChange={(e) => setRewardEn(e.target.value)}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
            <label className="block text-sm">
              {t('rewardLabel')} PT
              <input
                value={rewardPt}
                onChange={(e) => setRewardPt(e.target.value)}
                className="mt-1 w-full border border-[var(--color-gold-dim)] bg-[var(--color-charcoal)] px-2 py-1"
              />
            </label>
            <ul className="space-y-2">
              {data.heroes.map((h) => {
                const up = pickUpgrade(data.classes[h.profile.class], monthNumber)
                const won = familyBossDoneForHero(h.id)
                const eligible = heroEligibleForLevelUp(h.weekly, won, data.config.points)
                const pts = heroLevelUpPoints(h.weekly, won, data.config.points)
                const need = bossGatePerHero(data.config.points)
                return (
                  <li
                    key={h.id}
                    className="flex flex-wrap items-center justify-between gap-2 border border-[var(--color-gold-dim)]/40 px-3 py-2"
                  >
                    <span>
                      {pickL(h.profile as Record<string, unknown>, 'character_name', locale)} · lv{' '}
                      {h.profile.level}
                      <span className="ml-2 opacity-70">
                        {Math.round(pts)}/{need} pts
                      </span>
                      {up && (
                        <span className="ml-2 opacity-70">
                          → {pickL(up as Record<string, unknown>, 'name', locale)}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      disabled={busy || !up || !won || !eligible}
                      onClick={() => void levelUpHero(h.id)}
                      className="border border-[var(--color-gold)] px-3 py-1 font-display text-[10px] tracking-widest text-[var(--color-gold)] disabled:opacity-40"
                      title={
                        !won
                          ? t('levelUpNeedBoss')
                          : !eligible
                            ? t('levelUpNeed400')
                            : undefined
                      }
                    >
                      {t('applyLevelUp')}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <button
            type="button"
            disabled={busy || !calendarDirty}
            onClick={() => void saveAdmin()}
            className="admin-save-fab"
            title={calendarDirty ? t('saveAdmin') : t('saveAdminClean')}
          >
            <span className="font-display text-[10px] tracking-widest">{t('saveAdminFloat')}</span>
            {calendarDirty ? <span className="admin-save-fab-dot" aria-hidden /> : null}
          </button>
        </>
      )}

      {msg && <p className="mt-4 max-w-2xl text-sm text-[var(--color-gold)]">{msg}</p>}
    </Layout>
  )
}
