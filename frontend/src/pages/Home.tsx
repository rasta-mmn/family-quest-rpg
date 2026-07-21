import { useState } from 'react'
import { Layout } from '../components/Layout'
import { CityMap } from '../components/CityMap'
import { ChronicleDrawer } from '../components/ChronicleDrawer'
import { CinematicPlaySlot } from '../components/CinematicPlaySlot'
import { LoreCinematic, type LoreCinematicPayload } from '../components/LoreCinematic'
import { MapHud } from '../components/MapHud'
import { PartyBar } from '../components/PartyBar'
import { campaignBossAsEntry, creatureArt } from '../lib/campaign'
import { familyGateThreshold, familyPointsPool, type RoutePoint } from '../lib/family'
import { filledSquares } from '../lib/gameLogic'
import { setActiveFamilyId } from '../lib/familyStore'
import { useGameData } from '../hooks/useGameData'
import { pickL, useLocale } from '../lib/i18n'

export function Home() {
  const { data, error, loading, reload } = useGameData()
  const { locale, t } = useLocale()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cine, setCine] = useState<LoreCinematicPayload | null>(null)
  const [playOpen, setPlayOpen] = useState(false)
  const [playTitle, setPlayTitle] = useState('')

  const campaign = data?.campaign ?? null
  const activeFamily = data?.activeFamily ?? null
  const campCity = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'city', locale)
    : ''
  const campSeason = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'season_name', locale) ||
      campaign.season ||
      ''
    : ''
  const campLore = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'lore', locale)
    : ''

  const partyFaces =
    data && activeFamily
      ? data.heroes
          .filter((h) => activeFamily.hero_ids?.includes(h.id))
          .map((h) => ({
            id: h.id,
            name:
              pickL(h.profile as unknown as Record<string, unknown>, 'character_name', locale) ||
              h.id,
            avatar: h.profile.avatar,
            photo: h.profile.photo,
          }))
      : []

  if (loading) {
    return (
      <Layout variant="map">
        <div className="flex h-full items-center justify-center">
          <p className="hud-panel px-4 py-3 opacity-90">{t('opening')}</p>
        </div>
      </Layout>
    )
  }
  if (error || !data) {
    return (
      <Layout variant="map">
        <div className="flex h-full items-center justify-center p-4">
          <p className="hud-panel px-4 py-3 text-red-300">{error || t('noData')}</p>
        </div>
      </Layout>
    )
  }

  const { config, month, heroes, themes, classes, families, familySession, mapWeekPoints } = data
  const week = config.current_week
  const weekBoss = month.bosses?.find((b) => b.week === week) || month.bosses?.[0]
  const isBossWeek = weekBoss?.type === 'boss'
  const monthBoss = campaign
    ? campaignBossAsEntry(campaign, month.weeks?.[month.weeks.length - 1])
    : null
  const theme = themes[month.theme]
  const weekDone = heroes.every((h) => h.weekly?.boss?.completed)
  const sampleSquares = filledSquares(
    heroes[0] ? [heroes[0].weekPoints] : [],
    config.points.weekly_target,
  )
  const campTitle = campaign
    ? pickL(campaign as unknown as Record<string, unknown>, 'title', locale)
    : ''

  const familyHeroes = activeFamily
    ? heroes.filter((h) => activeFamily.hero_ids?.includes(h.id))
    : heroes

  const pool = activeFamily ? familyPointsPool(activeFamily, mapWeekPoints) : 0
  const gate = activeFamily ? familyGateThreshold(activeFamily, config.points) : 0
  const familyName = activeFamily
    ? pickL(activeFamily as unknown as Record<string, unknown>, 'name', locale)
    : ''

  function switchFamily(id: string) {
    setActiveFamilyId(id)
    reload()
  }

  const heroFaces = heroes.map((h) => ({
    id: h.id,
    name:
      pickL(h.profile as unknown as Record<string, unknown>, 'character_name', locale) || h.id,
    avatar: h.profile.avatar,
    photo: h.profile.photo,
    classLabel: pickL(
      (classes[h.profile.class] || {}) as Record<string, unknown>,
      'name',
      locale,
    ),
  }))

  function openMarkerLore(p: RoutePoint) {
    if (!campaign) return
    if (p.kind === 'start') {
      const lm = (campaign.map_landmarks || []).find((l) => l.id === p.id)
      const startName =
        pickL(lm as unknown as Record<string, unknown>, 'name', locale) ||
        campCity ||
        campaign.id
      setPlayTitle(campCity || campaign.id)
      setCine({
        kind: 'city',
        title: startName,
        subtitle: campSeason,
        lore: campLore || '',
        mapSrc: campaign.map,
        heroFaces: partyFaces,
      })
      return
    }
    const name =
      pickL({ name: p.name, name_pt: p.name_pt } as Record<string, unknown>, 'name', locale) ||
      p.id
    let lore = ''
    let avatar = p.avatar
    if (p.kind === 'boss') {
      lore = pickL(campaign.boss as unknown as Record<string, unknown>, 'lore', locale) || ''
      avatar = creatureArt(campaign.boss) || avatar
    } else {
      const v = (campaign.vassals || []).find((x) => x.id === p.creatureId)
      if (v) {
        lore = pickL(v as unknown as Record<string, unknown>, 'lore', locale) || ''
        avatar = creatureArt(v) || avatar
      }
    }
    setPlayTitle(name)
    setCine({
      kind: 'enemy',
      title: name,
      subtitle: p.weekIndex ? `${t('week')} ${p.weekIndex}` : '',
      lore: lore || name,
      mapSrc: campaign.map,
      enemyAvatar: avatar,
      heroFaces: partyFaces,
    })
  }

  return (
    <Layout variant="map">
      <div className={`map-stage ${cine || playOpen ? 'z-50' : ''}`}>
        {campaign && activeFamily ? (
          <CityMap
            variant="stage"
            campaign={campaign}
            activeFamily={activeFamily}
            families={families}
            heroFaces={heroFaces}
            mapWeekPoints={mapWeekPoints}
            points={config.points}
            bossDone={Boolean(familySession?.boss_done)}
            bossOutcome={activeFamily.boss_outcome}
            weekCount={month.weeks?.length}
            onMarkerSelect={openMarkerLore}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <p className="hud-panel max-w-sm px-4 py-3 text-sm opacity-90">{t('noFamilyMap')}</p>
          </div>
        )}
        {cine ? <LoreCinematic {...cine} onDone={() => setCine(null)} /> : null}
        <CinematicPlaySlot
          open={playOpen}
          onClose={() => setPlayOpen(false)}
          title={playTitle || campCity}
        />
      </div>

      {!cine && !playOpen && (
        <div className="hud-layer">
          <MapHud
            city={campCity}
            season={campSeason}
            weekLabel={`${t('week')} ${week} · ${month.month}`}
            campaignTitle={campTitle}
            familyName={familyName}
            pool={pool}
            gate={gate}
            onOpenGrimoire={() => setDrawerOpen(true)}
          />

          <div className="absolute bottom-[5.5rem] left-1/2 w-[min(100%-1.5rem,36rem)] -translate-x-1/2 pb-[env(safe-area-inset-bottom,0px)] md:bottom-4 md:left-[5.5rem] md:right-[7.5rem] md:w-auto md:max-w-none md:translate-x-0 md:pb-0">
            <PartyBar
              heroes={familyHeroes.map((h) => ({
                id: h.id,
                profile: h.profile,
                weekPoints: h.weekPoints,
                classLabel: pickL(
                  (classes[h.profile.class] || {}) as Record<string, unknown>,
                  'name',
                  locale,
                ),
              }))}
            />
          </div>

          {campaign ? (
            <button
              type="button"
              className="cine-play-fab"
              onClick={() => {
                setPlayTitle(campCity || campaign.id)
                setPlayOpen(true)
              }}
              aria-label={t('cinePlayTitle')}
            >
              PLAY
            </button>
          ) : null}
        </div>
      )}

      <ChronicleDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        campLore={campLore}
        monthBoss={monthBoss}
        weekBoss={weekBoss || null}
        isBossWeek={isBossWeek}
        weekDone={weekDone}
        sampleSquares={sampleSquares}
        themeName={pickL((theme || {}) as Record<string, unknown>, 'name', locale)}
        monthTheme={month.theme}
        weeklyTarget={config.points.weekly_target}
        families={families}
        activeFamilyId={activeFamily?.id}
        onSwitchFamily={switchFamily}
      />
    </Layout>
  )
}
