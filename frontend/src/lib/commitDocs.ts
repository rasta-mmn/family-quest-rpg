import {
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
import type { MonthSetup, Objective, Profile, WeeklyLog } from './types'
import type { LevelUpResult } from './levelUp'

export async function commitPlayerSheet(opts: {
  heroId: string
  characterName: string
  month: string
  theme: string
  daily: Objective[]
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
    daily: opts.daily,
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
