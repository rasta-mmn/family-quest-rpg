# Database Guide (`docs/`)

This folder is the **game database**. All data lives in Markdown files with a **YAML frontmatter** block at the top (between `---`). The frontend reads these files and builds the panel automatically.

## Bilingual game content (EN + PT)

Display strings for the game are stored in **both English and Portuguese**:

| English field | Portuguese field |
|---|---|
| `name` | `name_pt` |
| `description` | `description_pt` |
| `character_name` | `character_name_pt` |
| `mission_redacted` | `mission_redacted_pt` |
| `daily` (list) | `daily_pt` (list) |

The UI has an **EN | PT** toggle (saved in `localStorage`). It picks `*_pt` when locale is `pt`, otherwise the English field. Keys/IDs (`Heroi1`, `guerreiro`, `seg`, theme keys) stay language-neutral.

Contributor docs (README, planning) stay primarily English; in-game labels stay bilingual.

Planning (not runtime game data):

| File | Contents |
|---|---|
| `planning/plan.md` | Implementation plan (phases 1–5) |
| `planning/ideas.md` | Chosen visual design (Parchment Grimoire) |
| `planning/webdev-skill.md` | React/Tailwind template guide (frontend) |

Cursor agent skill: `.cursor/skills/family-quest-game/` — use when continuing the game (PDF, frontend, assets, mechanics).

## Editing Rules

1. **Never delete the `---` … `---` block** at the top — that is where structured data lives.
2. Keep YAML indentation (2 spaces).
3. Text after the second `---` is free-form: notes, stories, family chronicles.
4. Dates: `YYYY-MM-DD`; weeks: ISO `YYYY-WXX`.
5. Commit after each update — git history is the game’s chronicle book.

## Who Edits What

| File | Who edits | Frontend |
|---|---|---|
| `config/game-config.md` (calendar, PIN, players) | **ADMIN** | `/admin` — month + current week |
| `config/months/YYYY-MM.md` (weeks, theme, BOSS) | **ADMIN** | `/admin` — collective missions |
| `config/classes.md` / `bestiary.md` | ADMIN | (repo only, rare) |
| `[Heroi]/objectives.md` (3 daily missions + theme) | **Player** | `/player/:id` |
| `[Heroi]/weekly/YYYY-WXX.md` (marks + BOSS flag) | **Player** | `/player/:id` grid |
| `[Heroi]/profile.md` (names, photo) | **Player** (display) / ADMIN (level-up) | `/player/:id` |
| `[Heroi]/skills.md` / `appearance.md` / `rewards.md` | ADMIN | End of month (repo / future ADM) |

Edits in the UI save to **browser localStorage** and can **download `.md` packs** for commit into `docs/`.

> Folder IDs stay as `Heroi1`…`HeroiN` for compatibility. Display names are English in content.

## How to Log a Week (from the PDF)

1. Copy a previous `weekly/` template (or create `YYYY-WXX.md`)
2. Fill `days:` with `true`/`false` per objective and the `extras` count
3. Set `boss.completed` if the family defeated the collective BOSS
4. `total_points` may stay `0` — the frontend computes it; if set, it is treated as a manual override

## How to Add a New Hero

1. Copy the `Heroi1/` folder to a new name (e.g. `Heroi5/`)
2. Add the hero under `players` in `config/game-config.md`
3. Add a real photo under `assets/photos/`
4. Add the hero’s objectives in the month setup under `config/months/`

## Redaction (Privacy)

Real objectives and prizes are **never** written here. Use fantasy labels:
- Objectives → `"Mission Alpha"`, `"Mission Beta"`, `"Dawn Challenge"`…
- Prizes → `"Legendary Reward"`, `"Dragon’s Treasure"`…

The family keeps a private table (outside the repo) mapping each label to its real meaning.
