#!/usr/bin/env python3
"""Seed the docs/ database with hero files (profile, objectives, skills, appearance, rewards, weekly)."""
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

HEROES = {
    "Heroi1": {
        "name": "Iron Ember", "cls": "guerreiro", "cls_name": "Warrior",
        "theme": "treino",
        "daily": ["Mission Alpha", "Mission Beta", "Mission Gamma"],
        "avatar_desc": "Warrior in iron armor with a crimson cloak and sword at the shoulder",
    },
    "Heroi2": {
        "name": "Wandering Melody", "cls": "bardo", "cls_name": "Bard",
        "theme": "alimentacao",
        "daily": ["Mission Delta", "Mission Epsilon", "Mission Zeta"],
        "avatar_desc": "Bard in a green doublet with a lute on the back and a plumed hat",
    },
    "Heroi3": {
        "name": "Arcane Veil", "cls": "mago", "cls_name": "Mage",
        "theme": "estudo",
        "daily": ["Mission Eta", "Mission Theta", "Mission Iota"],
        "avatar_desc": "Mage in a starry midnight-blue robe with an apprentice staff",
    },
    "Heroi4": {
        "name": "Swift Shade", "cls": "ladino", "cls_name": "Rogue",
        "theme": "organizacao",
        "daily": ["Mission Kappa", "Mission Lambda", "Mission Mu"],
        "avatar_desc": "Rogue in a dark purple hood with twin daggers at the belt",
    },
}

PROFILE = """---
id: {hid}
character_name: "{name}"
class: {cls}
level: 1
xp_total: 0
xp_this_month: 0
months_completed: 0
photo: "docs/assets/photos/{hid_lower}.svg"
avatar: "docs/assets/avatars/{cls}.png"
avatar_description: "{avatar_desc}"
stats:
  forca: 10
  agilidade: 10
  sabedoria: 10
  carisma: 10
level_history:
  - {{ level: 1, xp: 0, date: "2026-08-01" }}
---

# {name} — Profile

**Class:** {cls_name} | **Level:** 1 | **Total XP:** 0

{name}'s journey began in August 2026. This page is the hero's living chronicle: every level-up, every completed month, and every deed is recorded here.

## Level History

| Level | Cumulative XP | Date |
|---|---|---|
| 1 | 0 | 2026-08-01 |
"""

OBJECTIVES = """---
month: "2026-08"
theme: {theme}
daily_objectives:
  - {{ id: obj1, name: "{o1}", points: 30, real_meaning_redacted: true }}
  - {{ id: obj2, name: "{o2}", points: 30, real_meaning_redacted: true }}
  - {{ id: obj3, name: "{o3}", points: 30, real_meaning_redacted: true }}
extras_allowed: true
extras_points: 2.5
---

# {name} Objectives — August 2026

This month's 3 daily objectives (redacted). The real meaning of each mission is known only to the family.

| Objective | Points | Frequency |
|---|---|---|
| {o1} | 30 | Daily (Mon–Sun) |
| {o2} | 30 | Daily (Mon–Sun) |
| {o3} | 30 | Daily (Mon–Sun) |
| Extras | 2.5 each | Free |

> **Editable by the player:** at the start of each month, update mission names and theme together with ADM.
"""

SKILLS = """---
skills: []
---

# {name} Skills

No skills unlocked yet. Skills are earned by completing months (400 XP) whose {cls_name} class upgrade is type `skill`.

## How to record a skill

Add an item to the `skills:` frontmatter like:

```yaml
skills:
  - {{ id: skill_001, name: "Power Strike", month: 3, unlocked_date: "2026-10-31", description: "A devastating attack that shatters any laziness.", real_benefit_redacted: "Real Perk I" }}
```
"""

APPEARANCE = """---
class: {cls}
slots:
  weapon: null
  armor: null
  head: null
  cape: null
  accessory: null
unlocked_appearances: []
---

# {name} Appearance

{name}'s avatar: *{avatar_desc}*.

Equipment unlocks on completing months (400 XP) per the {cls_name} upgrade tree in `docs/config/classes.md`.

## How to record equipment

Fill the matching slot in the frontmatter:

```yaml
slots:
  weapon: {{ name: "Iron Sword", month: 1, unlocked_date: "2026-08-31" }}
```
"""

REWARDS = """---
rewards: []
---

# {name} Rewards

History of weekly and monthly prizes (redacted). No rewards recorded yet.

## How to record

```yaml
rewards:
  - {{ type: weekly, week: "2026-W32", points_earned: 120, prize_redacted: "Legendary Reward I", status: received, date: "2026-08-09" }}
  - {{ type: monthly, month: "2026-08", xp_earned: 400, prize_redacted: "Month Treasure I", real_value_euros: 40, status: pending }}
```

| Type | Rule |
|---|---|
| Weekly | Earned on reaching 100 points in the week |
| Monthly | Earned on completing 400 XP in the month — avatar upgrade + €10 per week hit |
"""

WEEKLY = """---
week: "2026-W32"
player: {hid}
month: "2026-08"
boss: {{ id: dragao_preguica, name: "Dragon of Laziness", completed: false, points: 30 }}
days:
  seg: {{ obj1: false, obj2: false, obj3: false, extras: 0 }}
  ter: {{ obj1: false, obj2: false, obj3: false, extras: 0 }}
  qua: {{ obj1: false, obj2: false, obj3: false, extras: 0 }}
  qui: {{ obj1: false, obj2: false, obj3: false, extras: 0 }}
  sex: {{ obj1: false, obj2: false, obj3: false, extras: 0 }}
  sab: {{ obj1: false, obj2: false, obj3: false, extras: 0 }}
  dom: {{ obj1: false, obj2: false, obj3: false, extras: 0 }}
total_points: 0
reward_status: pending
---

# Week 2026-W32 — {name}

Record of the first journey week (3–9 August 2026). Transfer marks from the printed PDF into the `days:` block above: `true` for a completed objective, and the count of extras done in `extras`.

`total_points` is calculated automatically by the panel; fill it manually only if you want to override the calculation.
"""


def main():
    for hid, h in HEROES.items():
        d = os.path.join(ROOT, "docs", hid)
        os.makedirs(os.path.join(d, "weekly"), exist_ok=True)
        ctx = dict(
            hid=hid, hid_lower=hid.lower(), name=h["name"], cls=h["cls"],
            cls_name=h["cls_name"], theme=h["theme"], avatar_desc=h["avatar_desc"],
            o1=h["daily"][0], o2=h["daily"][1], o3=h["daily"][2],
        )
        files = {
            "profile.md": PROFILE.format(**ctx),
            "objectives.md": OBJECTIVES.format(**ctx),
            "skills.md": SKILLS.format(**ctx),
            "appearance.md": APPEARANCE.format(**ctx),
            "rewards.md": REWARDS.format(**ctx),
            os.path.join("weekly", "2026-W32.md"): WEEKLY.format(**ctx),
        }
        for fname, content in files.items():
            path = os.path.join(d, fname)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print("wrote", path)


if __name__ == "__main__":
    main()
