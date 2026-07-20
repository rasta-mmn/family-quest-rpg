import { fetchDoc } from './githubApi'
import { parseMarkdown } from './mdParser'
import type { BestiaryRoster, BestiaryRosterBoss } from './types'

export async function loadBestiaryRoster(): Promise<BestiaryRosterBoss[]> {
  const raw = await fetchDoc('config/bestiary-roster.md')
  const { data } = parseMarkdown<BestiaryRoster>(raw)
  return data.roster || []
}
