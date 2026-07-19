---
name: family-quest-game
description: >-
  Builds and extends Family Quest RPG — a real-life family gamification system
  with Markdown YAML database, printable monthly PDFs, and a React grimoire
  frontend. Use when working on family-quest, family-code, docs/ heroes, PDF
  generator, bestiary, classes, ADM panel, XP/boss logic, or frontend pages
  (Home, Player, Weekly, Leaderboard, Admin).
---

# Family Quest — Game Creation Agent

Implementation agent for **Family Quest RPG**. Database = `.md` files with YAML frontmatter. Paper (PDF) feeds digital (repo + frontend).

## Before coding

1. Read current repo state (`README.md`, `docs/`, what's missing vs phases).
2. Read only what the task needs:
   - Full plan → [docs/planning/plan.md](../../../docs/planning/plan.md)
   - Visual design → [docs/planning/ideas.md](../../../docs/planning/ideas.md)
   - React/Tailwind stack → [docs/planning/webdev-skill.md](../../../docs/planning/webdev-skill.md)
   - Scoring rules → [mechanics.md](mechanics.md)
3. Confirm active phase with the user if ambiguous. Don't skip phases unless asked.

## Phases (canonical order)

| Phase | Deliverable | Folder |
|---|---|---|
| 1 ✅ | DB `.md` + hero seed | `docs/` |
| 2 | Assets (avatars, enemies, backgrounds, photos) | `docs/assets/` |
| 3 | Monthly PDF generator | `pdfs/scripts/generate_monthly_pdf.py` |
| 4 | Grimoire frontend | `frontend/` |
| 5 | GitHub API integration + deploy + README link | — |

**Typical state:** Phase 1 done. Next = 2 → 3 → 4 → 5 (or 3/4 if user asks).

## Architecture (don't reinvent)

```
docs/           ← DB (single source of truth)
pdfs/           ← printable sheets + Python scripts
frontend/       ← React 19 + Tailwind 4 + Wouter + shadcn
```

- Frontend **reads** `.md` (GitHub Raw or local fetch in dev).
- ADM writes: GitHub Contents API (token in localStorage) **or** download `.md` for manual commit.
- Privacy: real objectives/prizes/names always **redacted** (`Mission Alpha`, `Player 1`).

## Implementation rules

### DB (`docs/`)
- Never delete the `---` frontmatter block.
- YAML: 2 spaces. Dates `YYYY-MM-DD`, weeks `YYYY-WXX`.
- **Bilingual game strings:** every display field has English + `*_pt` (e.g. `name` / `name_pt`, `daily` / `daily_pt`). UI locale toggle picks one. Keep IDs language-neutral (`Heroi1`, `guerreiro`, `seg`).
- Schemas and examples: `docs/planning/plan.md` + live files in `docs/config/`, `docs/Heroi*/`.
- New hero: copy `HeroiN/` folder, register in `game-config.md` with both name fields, photo in `assets/photos/`.

### PDF (Phase 3)
- Script: `pdfs/scripts/generate_monthly_pdf.py`
- Reads: `game-config.md`, `months/YYYY-MM.md`, `profile.md`, `skills.md`, objectives.
- 1 page/hero: photo + avatar + class/level/skills + 3 objectives + collective BOSS + XP squares (100 pts) + 7×3 grid + extras; repeat per week of the month.
- Bestiary visual theme (palette/background per theme).
- Output: `pdfs/YYYY-MM/HeroiN.pdf` + `family-quest-YYYY-MM.pdf`.
- Stack: WeasyPrint + PyYAML (or reportlab if WeasyPrint blocks).

### Frontend (Phase 4)
- Path: `frontend/` (Vite React). UI conventions: `docs/planning/webdev-skill.md`.
- **Required** design: Parchment Grimoire (`ideas.md`) — Cinzel + Crimson Pro, gold `oklch(0.75 0.12 85)`, warm charcoal background. No generic SaaS UI / purple glow.
- `lib/`: `mdParser.ts`, `githubApi.ts`, `gameLogic.ts`, `bossSelector.ts`
- Pages: Home, Player, Weekly, Leaderboard, Admin (PIN from `game-config.md`)
- Components: XPBar/XPGrid, AvatarCard, BossCard, TaskList, ClassBadge, UpgradeTree
- Microcopy: RPG dungeon-master voice (see `ideas.md`).

### Assets (Phase 2)
- Store in `docs/assets/{avatars,enemies,backgrounds,photos}/`
- Fantasy style consistent with the grimoire (not pixel, not flat corporate).
- Placeholders OK until final art; paths in `.md` must match.

## Workflow per user request

```
User asks for a feature
  → Identify phase + files touched
  → Read mechanics + relevant planning
  → Implement the minimum that unblocks
  → Validate scoring/schemas if touching XP/BOSS/weekly
  → Don't commit without an explicit ask
```

Quick checklist:
- [ ] Valid YAML frontmatter
- [ ] Real data redacted
- [ ] Calculations aligned with `mechanics.md`
- [ ] Grimoire design if UI
- [ ] Coherent asset paths

## What NOT to do

- Invent a second DB (SQLite, Firebase, etc.) without being asked.
- Write real objectives/prizes into `.md` files.
- SaaS cards / Inter / purple gradient on the frontend.
- Generate PDFs without reading month setup in `docs/config/months/`.
- Expand scope beyond the requested phase (YAGNI).

## References

- [mechanics.md](mechanics.md) — scoring, BOSS, upgrades
- [docs/planning/plan.md](../../../docs/planning/plan.md) — phase plan + schemas
- [docs/planning/ideas.md](../../../docs/planning/ideas.md) — design system
- [docs/planning/webdev-skill.md](../../../docs/planning/webdev-skill.md) — React template
- [docs/README.md](../../../docs/README.md) — who edits what
