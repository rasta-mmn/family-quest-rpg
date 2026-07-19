# Family Quest RPG

> The digital grimoire of an adventuring family — turning discipline into legend.

A real-life RPG where each family member is a hero with personal goals. Quests are completed in the real world, checked off on printed PDF sheets, and logged in this repository — the **game database as Markdown files**.

## How It Works

| Element | Rule |
|---|---|
| Classes | Warrior, Bard, Mage, Rogue |
| Daily objectives | 3 fixed objectives per day (Mon–Sun), set per hero each month |
| Points per objective | 30 |
| Extra activities | +2.5 points per extra completed |
| Weekly BOSS | 1 per week, **collective** — the family completes it together; +30 for everyone |
| Weekly target | 100 points |
| Monthly XP bar | 400 points (4 weeks × 100) |
| Upgrades | 12 per year (1 per completed month), class-specific |
| Weekly reward | Real personal prize (redacted in-game) |
| Monthly reward (400 XP) | Avatar upgrade + real perk (€10 per week hit) |

## Game Cycle

```
MONTH START (ADMIN)
  1. Admin panel: set month weeks, each hero's objectives, and theme
  2. System auto-picks 4 collective BOSSes from the bestiary
  3. Save setup to docs/config/months/YYYY-MM.md
  4. Generate monthly PDFs (1 page per hero, month visual theme)
  5. Print and hand out to the family

DURING THE WEEK (paper)
  - Each hero checks the 3 daily objectives and notes extras on the PDF
  - The family faces the collective BOSS together

WEEK END
  - Transfer marks from paper into docs/[Heroi]/weekly/YYYY-WXX.md
  - Frontend updates XP, squares, and ranking automatically

MONTH END (400 XP)
  - Level-up: apply the class upgrade for that month
  - Update profile.md, skills.md, appearance.md, and rewards.md
  - Record the real-world reward
```

## Repository Layout

```
docs/                      ← DATABASE (Markdown + YAML frontmatter)
  config/
    game-config.md         ← Players, classes, points, current month
    classes.md             ← 4 classes × 12 yearly upgrades
    bestiary.md            ← Enemies by theme (auto BOSS selection)
    months/YYYY-MM.md      ← Monthly setup: theme, objectives, 4 BOSSes
  Heroi1..Heroi4/          ← Hero folders (IDs kept for compatibility)
    profile.md             ← Profile, class, level, XP
    objectives.md          ← Month objectives (player-editable)
    skills.md              ← Skills / upgrades earned
    appearance.md          ← Equipment by slot
    rewards.md             ← Reward history
    weekly/YYYY-WXX.md     ← Weekly log (from the printed PDF)
  assets/
    photos/                ← Real player photos (for PDFs)
    avatars/               ← Class avatars
    enemies/               ← Enemy art
    backgrounds/           ← Themed backgrounds
pdfs/
  scripts/generate_monthly_pdf.py  ← Monthly sheet generator
  YYYY-MM/                 ← Generated PDFs for the month
frontend/                  ← Grimoire web UI (Vite + React)
```

## Frontend

Grimoire panel in `frontend/` (Vite + React 19 + Tailwind 4 + Wouter). Dev reads local `docs/`; production uses GitHub Raw.

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173/family-quest-rpg/
```

**Live panel:** [https://rasta-mmn.github.io/family-quest-rpg/](https://rasta-mmn.github.io/family-quest-rpg/)  
(Deploy via GitHub Pages — `.github/workflows/deploy-pages.yml`. Enable Pages → Source: GitHub Actions.)

## Generate Monthly PDFs

```bash
cd pdfs/scripts
pip install -r requirements.txt
python3 generate_monthly_pdf.py --month 2026-08              # Portuguese (default)
python3 generate_monthly_pdf.py --month 2026-08 --locale en  # English
```

Writes 1 PDF per hero + 1 combined PDF under `pdfs/2026-08/`. Prefers WeasyPrint; if system libs are missing (pango/cairo on macOS), falls back to reportlab (`--engine reportlab` to force).

## Privacy

Real objectives, real names, and real prizes are **redacted** in game files (`"Mission Alpha"`, `"Legendary Reward"`). Real meanings stay with the family only.

## Contributing

Issues and PRs welcome. Keep player-identifying details redacted. See [`docs/README.md`](docs/README.md) for the data model and [`.cursor/skills/family-quest-game/`](.cursor/skills/family-quest-game/) for the agent skill used while building the game.

**Game content is bilingual (EN + PT):** every display string has a paired `*_pt` field. The grimoire UI toggles language with **EN | PT**.
