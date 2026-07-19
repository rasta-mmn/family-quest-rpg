# Family Quest — Mechanics

## Constants (source: `docs/config/game-config.md`)

| Key | Value |
|---|---|
| Classes | guerreiro, bardo, mago, ladino |
| Points / daily objective | 30 |
| Points / extra | 2.5 |
| Collective BOSS / week | 30 (all heroes) |
| Weekly target | 100 |
| Monthly XP (bar) | 400 (≈ 4 × 100) |
| Upgrades / year | 12 (1 per completed month) |
| € / week hit | 10 (real reward, redacted in-game) |

## Weekly calculation

```
base = count(obj true) × 30
extras = sum(extras) × 2.5
boss = 30 if boss.completed else 0
total = base + extras + boss
```

Theoretical max without extras: `7×3×30 + 30 = 660`. Practical target: fill ≥100 pts → 1 XP square.

## XP and level-up

- 1 XP square = 100 pts in the week (PDF ↔ frontend mirror).
- Full month ≈ 400 XP → level-up: apply class upgrade `month N` from `docs/config/classes.md`.
- Update: `profile.md`, `skills.md` (if type skill), `appearance.md` (if weapon/armor), `rewards.md`.

## BOSS by theme

ADM sets month's dominant theme → `bossSelector` pulls 4 enemies from `docs/config/bestiary.md` (1/week). ADM may swap.

Themes: `alimentacao`, `treino`, `estudo`, `organizacao`, `saude`, `financas`.

## Operational cycle

1. **Month start (ADM):** weeks + objectives/hero + theme → `months/YYYY-MM.md` → generate PDFs
2. **Week (paper):** mark 3 obj/day + extras + collective BOSS
3. **Week end:** transfer to `docs/[Heroi]/weekly/YYYY-WXX.md`
4. **Month end (400 XP):** upgrade + reward

## Critical files

| File | Role |
|---|---|
| `docs/config/game-config.md` | players, ADM PIN, points, current month/week |
| `docs/config/classes.md` | 4×12 upgrade tree |
| `docs/config/bestiary.md` | enemies + palettes by theme |
| `docs/config/months/YYYY-MM.md` | month setup |
| `docs/[Heroi]/weekly/YYYY-WXX.md` | record transferred from PDF |
