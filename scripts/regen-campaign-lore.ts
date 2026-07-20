/**
 * Rewrite docs/config/campaigns/01–12.md with generated lore (lore_custom: false).
 * Run from repo root: npx --yes tsx scripts/regen-campaign-lore.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCampaignMd, normalizeCampaign } from '../frontend/src/lib/campaign.ts'
import { parseMarkdown } from '../frontend/src/lib/mdParser.ts'
import type { Campaign } from '../frontend/src/lib/types.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'docs/config/campaigns')

for (let n = 1; n <= 12; n++) {
  const id = String(n).padStart(2, '0')
  const file = path.join(dir, `${id}.md`)
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = parseMarkdown<Campaign>(raw)
  // Solstícia campaigns use docs/assets/campaigns/{id}/… (restore if prior regen masked them).
  const bossArt = `docs/assets/campaigns/${id}/boss.svg`
  if (data.boss) {
    data.boss = { ...data.boss, avatar: bossArt, image: bossArt }
  }
  if (data.vassals) {
    data.vassals = data.vassals.map((v, i) => {
      const art = `docs/assets/campaigns/${id}/vassal-0${i + 1}.svg`
      return { ...v, avatar: art, image: art }
    })
  }
  const camp = normalizeCampaign({ ...data, lore_custom: false }, id)
  fs.writeFileSync(file, buildCampaignMd(camp), 'utf8')
  console.log('ok', id, camp.city, '—', (camp.lore || '').slice(0, 60) + '…')
}
