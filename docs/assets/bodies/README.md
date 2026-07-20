# Class body avatars (Caverna do Dragão / Grok)

Style: 1980s Saturday-morning cartoon (cel shade, bold outlines), family-safe.
Path: `{class}/{male|female}/lv-00.png` … `lv-12.png` (13 stages × 4 classes × 2 sexes).

Frontend uses exact level via `bodyArtLevel()` (= `months_completed` clamped 0–12).

## Gear stack (matches `docs/config/classes.md`)

| Lv | Guerreiro | Bardo | Mago | Ladino |
|---:|-----------|-------|------|--------|
| 00 | starter tunic | starter tunic | apprentice robe | starter tunic |
| 01 | Iron Sword | Simple Lute | Apprentice Staff | Short Dagger |
| 02 | + Oak Shield | + Inspiring Song notes | + Basic Grimoire | + Shadow Cloak |
| 03 | + Power Strike glow | + Elven Flute | + Fireball | + Stealth Step |
| 04 | + Plate Armor | + Plumed Hat | + Starry Robe | + Twin Daggers |
| 05 | + Watchman's Helm | + Encouraging Verse | + Clairvoyance | + Mask of Enigma |
| 06 | + War Cry | + Velvet Doublet | + Crystal Orb | + True Strike |
| 07 | + Runic Axe | + Hypnotic Ballad | + Amulet of Mind | + Silent Boots |
| 08 | + Crimson Cloak | + Golden Harp | + Teleport | + Disarm Traps |
| 09 | + Unbreakable Wall | + Cloak of Tales | + Arcanist's Hat | + Repeating Crossbow |
| 10 | + Titan's Gauntlets | + Heroes' Chorus | + Runic Staff | + Master's Hood |
| 11 | + Clan Banner | + Wanderer's Boots | Archmage Mantle look* | + Living Shadow |
| 12 | Legendary Blade (epic) | Hymn of Heroes (epic) | Meteor finale* | New Moon Blade |

\* Mago lv-11/12 art swapped so finale (12) reads stronger than 11.

## Regenerate

1. Grok with prior level + face lock refs.
2. Save `{class}-{sex}-lv-XX.png` → copy into this tree.
3. `node docs/assets/bodies/sync-png-gaps.mjs` validates all 104 files.
