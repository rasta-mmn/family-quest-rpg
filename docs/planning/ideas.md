# Family Quest RPG — Design Brainstorm

## Three Stylistic Approaches

### 1. Parchment Grimoire (Illuminated Manuscript)
Interface as an illuminated medieval chronicle book: aged parchment, golden drop caps, hand-ornamented borders. Feeling of flipping through the family's adventure diary.
**Probability:** 0.04

### 2. Dark Fantasy Tavern (Baldur's Gate / Diablo UI)
Dark tavern panel: wood, stone, forged metal, torches. Gold on charcoal, carved frames. Feeling of an AAA RPG menu.
**Probability:** 0.08

### 3. Pixel Quest Retro (16-bit JRPG)
SNES aesthetic: pixel art, blue dialog boxes, bitmap fonts. Fun Final Fantasy IV nostalgia.
**Probability:** 0.02

---

## Chosen Approach: **Parchment Grimoire** (with dark fantasy panel structure)

Chosen because it perfectly unites the physical world (hand-filled printed PDFs) and the digital: the site IS the family grimoire, the same object that lives on paper. Deep dark background with parchment panels — the best of worlds 1 and 2.

### Design Movement
Illuminated Manuscript × Dark Fantasy Game UI (references: Pillars of Eternity, Divinity Original Sin 2, medieval codices)

### Core Principles
1. **The site is an artifact**: every panel looks like parchment, leather, or stone — never "SaaS cards"
2. **Gold tells the progress story**: XP, level-ups, and achievements always in illuminated gold
3. **Codex asymmetry**: layouts with uneven margins, drop caps, side columns like margin notes
4. **Ornament with purpose**: frames and flourishes only at celebration moments (level-up, boss defeated)

### Color Philosophy
Background: deep warm charcoal (almost dark brown, like an old book cover leather) — `oklch(0.16 0.015 60)`. Panels: darkened parchment `oklch(0.28 0.02 75)` with subtle texture. Gold `oklch(0.75 0.12 85)` is the Signature Color — reserved for XP, titles, and achievements. Class accents: Warrior iron-red, Bard emerald-green, Mage arcane-blue, Rogue shadow-purple. Emotionally: tavern coziness + arcane library reverence.

### Layout Paradigm
Codex structure: narrow left sidebar as "book spine" (navigation with class icons), main content as grimoire page with ornamented header. Dashboard uses asymmetric grid: week's BOSS large on the left (2/3), hero column on the right as stacked sheets. Never centered-symmetric.

### Signature Elements
1. **Carved XP squares** — grid of squares that fill with liquid gold (exact mirror of the printed PDF)
2. **Class wax seal** — circular badge with embossed class icon, used on every hero sheet
3. **Flourish dividers** — thin ornamental line (stylized ❦) separating sections, as in manuscripts

### Interaction Philosophy
Interactions have physical weight: checking an objective "stamps" the check with a slight rotation; opening a hero sheet slides like turning a page; a defeated boss gets an animated red-ink "X".

### Animation
- XP fill: gold flows left to right, 600ms ease-out, with a glow at the end
- Page entrances: fade + translateY(8px), 250ms, 50ms stagger between sheets
- Level-up: burst of gold particles (only exuberant animation allowed)
- Card hover: subtle lift + gold border lighting (150ms)
- No animations on keyboard navigation

### Typography System
- **Display/Titles:** "Cinzel" (Roman lapidary serif — carved in stone)
- **Subtitles/Character names:** "Cinzel Decorative" for special moments
- **Body/UI:** "Crimson Pro" (readable book serif)
- **Data/numbers:** "Crimson Pro" semibold tabular
- Hierarchy: titles in spaced Cinzel caps (tracking 0.08em), body in Crimson Pro 16-17px

### Brand Essence
The digital grimoire of the adventuring family — for families who turn discipline into legend. Adjectives: epic, warm, handcrafted.

### Brand Voice
Tone of an RPG dungeon master narrating the family chronicle. Headlines sound like adventure summons; microcopy uses fantasy vocabulary (missions, deeds, bestiary).
- Ex. 1: "This week's journey awaits, heroes."
- Ex. 2: "The Dragon of Laziness has been defeated. +30 glory for all."

### Wordmark & Logo
Symbol: heraldic shield split into 4 quarters (sword, lute, staff, dagger — the 4 classes), engraved in gold on a dark field. Wordmark "FAMILY QUEST" in Cinzel with an ornamented Q.

### Signature Brand Color
Illuminated Gold — `oklch(0.75 0.12 85)` (#D4A945 approx.) — the gold of illuminated manuscripts, used exclusively for progress and glory.
