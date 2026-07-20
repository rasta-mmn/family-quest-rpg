/**
 * Validate all body PNGs: lv-00…12 × 4 classes × 2 sexes = 104.
 * Run: node docs/assets/bodies/sync-png-gaps.mjs
 */
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const CLASSES = ['guerreiro', 'bardo', 'mago', 'ladino']
const SEXES = ['male', 'female']

function pad(n) {
  return String(n).padStart(2, '0')
}

let ok = 0
let missing = 0
for (const cls of CLASSES) {
  for (const sex of SEXES) {
    for (let lv = 0; lv <= 12; lv++) {
      const p = join(root, cls, sex, `lv-${pad(lv)}.png`)
      if (existsSync(p)) ok++
      else {
        missing++
        console.warn(`missing ${cls}/${sex}/lv-${pad(lv)}.png`)
      }
    }
  }
}
console.log(`body PNGs: ${ok}/104 ok${missing ? `, ${missing} missing` : ''}`)
process.exit(missing ? 1 : 0)
