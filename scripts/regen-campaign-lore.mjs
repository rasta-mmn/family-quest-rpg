#!/usr/bin/env node
/**
 * Rewrite docs/config/campaigns/01–12.md lore from frontend templates.
 * Run: node --experimental-strip-types scripts/regen-campaign-lore.mjs
 *   or: npx tsx scripts/regen-campaign-lore.ts  (if using .ts twin)
 *
 * This mjs loads the built logic via dynamic import of the TS source through tsx.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const runner = path.join(root, 'scripts/regen-campaign-lore.ts')
const r = spawnSync('npx', ['--yes', 'tsx', runner], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})
process.exit(r.status ?? 1)
