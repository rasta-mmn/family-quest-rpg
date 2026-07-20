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
import { patchAdminEdits } from '../lib/editsStore'
import { downloadAdminExports } from '../lib/exportMarkdown'
import {
  downloadMarkdown,
  fetchDoc,
  getGithubToken,
  hasGithubToken,
  setGithubToken,
} from '../lib/githubApi'
import { commitAdminMonth, commitAllPlayerSheets, commitLevelUp } from '../lib/commitDocs'
import { buildLevelUpPack, pickUpgrade } from '../lib/levelUp'
import { parseMarkdown } from '../lib/mdParser'
import type { Campaign, MonthSetup } from '../lib/types'

type AdminTab = 'calendar' | 'campaign' | 'bestiary'

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

  async function resolveCampaign(): Promise<Campaign> {
    const id = campaignId || campaignIdFromMonthNumber(monthNumber)
    if (data!.campaign?.id === id) return normalizeCampaign(data!.campaign, id)
    try {
      const raw = await fetchDoc(`config/campaigns/${id}.md`)
      return normalizeCampaign(parseMarkdown<Campaign>(raw).data, id)
    } catch {
      return emptyCampaign(id)
    }
  }

  async function buildMonthSetup(): Promise<MonthSetup> {
    const camp = await resolveCampaign()
    const theme = campaignDominantTheme(camp)
    const base: MonthSetup = {
      month,
      month_number: monthNumber,
      campaign: camp.id,
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

  async function levelUpHero(heroId: string) {
    setBusy(true)
    setMsg('')
    try {
      const hero = data!.heroes.find((h) => h.id === heroId)
      if (!hero) throw new Error('Hero missing')
      const classDef = data!.classes[hero.profile.class]
      if (!classDef) throw new Error('Class missing')
      const up = pickUpgrade(classDef, monthNumber)
      if (!up) throw new Error(`No upgrade for month ${monthNumber}`)

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
        monthNumber,
        monthId: month,
        rewardLabel: rewardEn,
        rewardLabelPt: rewardPt,
        weeksHit,
        eurosPerWeek: data!.config.points.weekly_reward_euros || 10,
      })
      if (!pack) throw new Error('Level-up pack failed')

      if (hasGithubToken()) {
        const files = await commitLevelUp(heroId, pack)
        setMsg(`${t('levelUpOk')} ${heroId} → lv ${pack.newLevel} (${pack.upgrade.name}). ${files.join(', ')}`)
      } else {
        downloadMarkdown(`${heroId}__profile.md`, pack.profileMd)
        downloadMarkdown(`${heroId}__skills.md`, pack.skillsMd)
        downloadMarkdown(`${heroId}__appearance.md`, pack.appearanceMd)
        downloadMarkdown(`${heroId}__rewards.md`, pack.rewardsMd)
        setMsg(`${t('levelUpOk')} ${heroId} — ${t('download')} (no token)`)
      }
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
      ) : (
        <>
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
                onChange={(e) => {
                  const n = Number(e.target.value)
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
                onChange={(e) => setWeeksRaw(e.target.value)}
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

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
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
                return (
                  <li
                    key={h.id}
                    className="flex flex-wrap items-center justify-between gap-2 border border-[var(--color-gold-dim)]/40 px-3 py-2"
                  >
                    <span>
                      {pickL(h.profile as Record<string, unknown>, 'character_name', locale)} · lv{' '}
                      {h.profile.level}
                      {up && (
                        <span className="ml-2 opacity-70">
                          → {pickL(up as Record<string, unknown>, 'name', locale)}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      disabled={busy || !up}
                      onClick={() => void levelUpHero(h.id)}
                      className="border border-[var(--color-gold)] px-3 py-1 font-display text-[10px] tracking-widest text-[var(--color-gold)] disabled:opacity-40"
                    >
                      {t('applyLevelUp')}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}

      {msg && <p className="mt-4 max-w-2xl text-sm text-[var(--color-gold)]">{msg}</p>}
    </Layout>
  )
}
