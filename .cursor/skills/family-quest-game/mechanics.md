# Family Quest — Mechanics

## Constants (source: `docs/config/game-config.md`)

| Key | Value |
|---|---|
| Classes | guerreiro, bardo, mago, ladino |
| Points / daily objective | 30 |
| Points / extra | 2.5 |
| BOSS activity pts (hero) | 30 default (or 20/50 per enemy) |
| Weekly target (XP square) | 100 |
| Level-up threshold per hero | 400 |
| Family map gate | `400 × N` heroes (collective pool; one may cover another) |
| Upgrades / year | 12 (1 per cleared city, only if hero hit 400) |
| € / week hit | 10 (real reward, redacted in-game) |

## Weekly calculation (hero)

```
base = count(obj true) × 30
extras = sum(extras) × 2.5
boss = enemy_pts if boss activity / after family victory
total = base + extras + boss
```

Map pool uses **base + extras only** (excludes BOSS pts).

## Families, map, victory

- Calendar (`current_month` / `current_week`) is **shared**.
- Map position (`map_campaign_id`) is **per family**.
- Collective pool advances the carriage: `progress = pool / (400 × N)`.
- **Victory / defeat** = family weekly `boss_done` → advances city (or retry).

## Level-up (per hero)

Requires family `boss_done: true`, **and** hero points ≥ 400:

```
eligible = base + extras
if family boss_done:
  eligible += boss_activity_points   # 30 / 20 / 50
level_up if eligible >= 400
```

Heroes below 400 after the bonus do **not** level up; family may still advance.

## BOSS by theme

ADM sets month's dominant theme → campaign vassals/boss. ADM may swap.

## Operational cycle

1. **Month start (ADM):** weeks + campaign → `months/YYYY-MM.md`
2. **Week:** hero sheets + family session `boss_done`
3. **Boss victory:** advance family map; level-up only heroes with ≥400
4. **Defeat:** stay on city; recover next week

## Critical files

| File | Role |
|---|---|
| `docs/config/game-config.md` | players, families, PIN, points, calendar |
| `docs/config/families/{id}/weekly/YYYY-WXX.md` | family `boss_done` |
| `docs/config/campaigns/NN.md` | city lore + map landmarks |
| `docs/config/classes.md` | 4×12 upgrade tree |
| `docs/[Heroi]/weekly/YYYY-WXX.md` | hero week log |
