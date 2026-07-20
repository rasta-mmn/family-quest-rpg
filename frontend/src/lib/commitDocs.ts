import {
  deleteDocsTree,
  deleteRepoFile,
  fetchDoc,
  hasGithubToken,
  putBinaryFromDataUrl,
  putDoc,
} from './githubApi'
import { isDataUrl } from './photoUpload'
import {
  buildMonthMdFromSetup,
  buildObjectivesMd,
  buildProfilePatchMd,
  buildWeeklyMd,
} from './exportMarkdown'
import { playerConfigYaml } from './heroMarkdown'
import type { HeroObjectives, MonthSetup, PlayerConfig, Profile, WeeklyLog } from './types'
import type { LevelUpResult } from './levelUp'
import { loadLocalHeroes } from './localHeroes'

export async function commitPlayerSheet(opts: {
  heroId: string
  characterName: string
  month: string
  theme: string
  monthObjective?: string
  weekly: WeeklyLog | null
  profile: Profile
}): Promise<string[]> {
  if (!hasGithubToken()) throw new Error('NO_TOKEN')
  const done: string[] = []
  const obj = buildObjectivesMd({
    heroId: opts.heroId,
    characterName: opts.characterName,
    month: opts.month,
    theme: opts.theme,
    monthObjective: opts.monthObjective,
  })
  await putDoc(
    `${opts.heroId}/objectives.md`,
    obj,
    `quest(${opts.heroId}): update objectives ${opts.month}`,
  )
  done.push('objectives.md')

  if (opts.weekly) {
    await putDoc(
      `${opts.heroId}/weekly/${opts.weekly.week}.md`,
      buildWeeklyMd(opts.weekly, opts.characterName),
      `quest(${opts.heroId}): week ${opts.weekly.week}`,
    )
    done.push(`weekly/${opts.weekly.week}.md`)
  }

  let profile = { ...opts.profile }
  if (isDataUrl(profile.photo)) {
    const photoPath = `assets/photos/${opts.heroId.toLowerCase()}.jpg`
    await putBinaryFromDataUrl(
      photoPath,
      profile.photo!,
      `quest(${opts.heroId}): photo`,
    )
    profile = { ...profile, photo: `docs/${photoPath}` }
    done.push(photoPath)
  }
  await putDoc(
    `${opts.heroId}/profile.md`,
    buildProfilePatchMd(profile),
    `quest(${opts.heroId}): profile`,
  )
  done.push('profile.md')
  return done
}

async function ensurePlayerInGameConfig(player: PlayerConfig): Promise<boolean> {
  const cfg = await fetchDoc('config/game-config.md')
  if (new RegExp(`^\\s*- id: ${player.id}\\s*$`, 'm').test(cfg)) return false
  const block = playerConfigYaml(player)
  let next: string
  if (/^players:\s*$/m.test(cfg) || /^players:\n/m.test(cfg)) {
    next = cfg.replace(/^(players:\s*\n)/m, `$1${block}\n`)
  } else {
    next = cfg.replace(/^---\n/, `---\nplayers:\n${block}\n`)
  }
  await putDoc('config/game-config.md', next, `admin: register player ${player.id}`)
  return true
}

/** Commit every hero sheet currently loaded (merged browser edits). */
export async function commitAllPlayerSheets(opts: {
  month: string
  heroes: {
    id: string
    local?: boolean
    profile: Profile
    objectives: HeroObjectives
    weekly: WeeklyLog | null
  }[]
}): Promise<{ heroId: string; files: string[] }[]> {
  if (!hasGithubToken()) throw new Error('NO_TOKEN')
  const localById = new Map(loadLocalHeroes().map((h) => [h.id, h]))
  const results: { heroId: string; files: string[] }[] = []

  for (const h of opts.heroes) {
    const files = await commitPlayerSheet({
      heroId: h.id,
      characterName: h.profile.character_name,
      month: opts.month,
      theme: h.objectives.theme || 'fisico',
      monthObjective: h.objectives.month_objective,
      weekly: h.weekly,
      profile: h.profile,
    })

    if (h.local || localById.has(h.id)) {
      const local = localById.get(h.id)
      const player: PlayerConfig = local?.player || {
        id: h.id,
        character_name: h.profile.character_name,
        character_name_pt: h.profile.character_name_pt,
        class: h.profile.class,
        photo: h.profile.photo,
        avatar: h.profile.avatar,
      }
      const added = await ensurePlayerInGameConfig(player)
      if (added) files.push('game-config.md')
    }

    results.push({ heroId: h.id, files })
  }
  return results
}

export async function commitAdminMonth(opts: {
  current_month: string
  current_week: string
  month: MonthSetup
}): Promise<string[]> {
  if (!hasGithubToken()) throw new Error('NO_TOKEN')
  const done: string[] = []
  await putDoc(
    `config/months/${opts.month.month}.md`,
    buildMonthMdFromSetup(opts.month),
    `admin: month setup ${opts.month.month}`,
  )
  done.push(`months/${opts.month.month}.md`)

  const cfg = await fetchDoc('config/game-config.md')
  const next = cfg
    .replace(/current_month:\s*"[^"]*"/, `current_month: "${opts.current_month}"`)
    .replace(/current_week:\s*"[^"]*"/, `current_week: "${opts.current_week}"`)
  if (next !== cfg) {
    await putDoc(
      'config/game-config.md',
      next,
      `admin: calendar ${opts.current_month} ${opts.current_week}`,
    )
    done.push('game-config.md')
  }
  return done
}

/** Full delete: game-config entry + docs/HeroiN/** + photo assets. */
export async function commitDeleteHeroFully(
  heroId: string,
  currentMonth?: string,
): Promise<string[]> {
  if (!hasGithubToken()) throw new Error('NO_TOKEN')
  const done: string[] = []

  const cfg = await fetchDoc('config/game-config.md')
  const playerRe = new RegExp(`  - id: ${heroId}\\n(?:    [^\\n]*\\n)*`, 'm')
  if (playerRe.test(cfg)) {
    await putDoc(
      'config/game-config.md',
      cfg.replace(playerRe, ''),
      `admin: remove player ${heroId}`,
    )
    done.push('config/game-config.md')
  }

  if (currentMonth) {
    try {
      const monthPath = `config/months/${currentMonth}.md`
      const monthMd = await fetchDoc(monthPath)
      const objRe = new RegExp(
        `  ${heroId}:\\n(?:    [^\\n]*\\n)*`,
        'm',
      )
      if (objRe.test(monthMd)) {
        await putDoc(
          monthPath,
          monthMd.replace(objRe, ''),
          `admin: drop ${heroId} from ${currentMonth}`,
        )
        done.push(monthPath)
      }
    } catch {
      /* month file optional */
    }
  }

  const tree = await deleteDocsTree(heroId)
  done.push(...tree)

  const photoBase = `assets/photos/${heroId.toLowerCase()}`
  for (const ext of ['.jpg', '.jpeg', '.png', '.svg', '.webp']) {
    const p = `docs/${photoBase}${ext}`
    try {
      await deleteRepoFile(p, `admin: delete photo ${heroId}`)
      done.push(p)
    } catch {
      /* missing ok */
    }
  }

  return done
}

export async function commitLevelUp(heroId: string, pack: LevelUpResult): Promise<string[]> {
  if (!hasGithubToken()) throw new Error('NO_TOKEN')
  const done: string[] = []
  await putDoc(`${heroId}/profile.md`, pack.profileMd, `levelup(${heroId}): lv ${pack.newLevel}`)
  done.push('profile.md')
  await putDoc(`${heroId}/skills.md`, pack.skillsMd, `levelup(${heroId}): skills`)
  done.push('skills.md')
  await putDoc(`${heroId}/appearance.md`, pack.appearanceMd, `levelup(${heroId}): gear`)
  done.push('appearance.md')
  await putDoc(`${heroId}/rewards.md`, pack.rewardsMd, `levelup(${heroId}): rewards`)
  done.push('rewards.md')
  return done
}
