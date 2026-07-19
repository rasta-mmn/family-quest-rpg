#!/usr/bin/env python3
"""Seed the docs/ database with hero files (profile, objectives, skills, appearance, rewards, weekly)."""
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

HEROES = {
    "Heroi1": {
        "name": "Brasa de Ferro", "cls": "guerreiro", "cls_name": "Guerreiro",
        "theme": "treino",
        "daily": ["Missão Alpha", "Missão Beta", "Missão Gama"],
        "avatar_desc": "Guerreiro de armadura de ferro com capa carmesim e espada ao ombro",
    },
    "Heroi2": {
        "name": "Melodia Errante", "cls": "bardo", "cls_name": "Bardo",
        "theme": "alimentacao",
        "daily": ["Missão Delta", "Missão Épsilon", "Missão Zeta"],
        "avatar_desc": "Bardo de gibão verde com alaúde às costas e chapéu emplumado",
    },
    "Heroi3": {
        "name": "Véu Arcano", "cls": "mago", "cls_name": "Mago",
        "theme": "estudo",
        "daily": ["Missão Eta", "Missão Teta", "Missão Iota"],
        "avatar_desc": "Mago de túnica azul-noite estrelada com cajado de aprendiz",
    },
    "Heroi4": {
        "name": "Sombra Ligeira", "cls": "ladino", "cls_name": "Ladino",
        "theme": "organizacao",
        "daily": ["Missão Kapa", "Missão Lambda", "Missão Mi"],
        "avatar_desc": "Ladino de capuz roxo-escuro com adagas gêmeas na cintura",
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
photo: "docs/assets/photos/{hid_lower}.jpg"
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

# {name} — Perfil

**Classe:** {cls_name} | **Nível:** 1 | **XP Total:** 0

A jornada de {name} começou em agosto de 2026. Esta página é a crônica viva do herói: cada level-up, cada mês completado e cada façanha ficam registados aqui.

## Histórico de Níveis

| Nível | XP Acumulado | Data |
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

# Objetivos de {name} — Agosto 2026

Os 3 objetivos diários deste mês (redactados). O significado real de cada missão é conhecido apenas pela família.

| Objetivo | Pontos | Frequência |
|---|---|---|
| {o1} | 30 | Diária (seg–dom) |
| {o2} | 30 | Diária (seg–dom) |
| {o3} | 30 | Diária (seg–dom) |
| Extras | 2,5 cada | Livre |

> **Editável pelo jogador:** no início de cada mês, atualize os nomes das missões e o tema junto com o ADM.
"""

SKILLS = """---
skills: []
---

# Skills de {name}

Nenhuma skill desbloqueada ainda. As skills são ganhas ao completar meses (400 XP) cujo upgrade da classe {cls_name} seja do tipo `skill`.

## Como registar uma skill

Adicione ao frontmatter `skills:` um item como:

```yaml
skills:
  - {{ id: skill_001, name: "Golpe Poderoso", month: 3, unlocked_date: "2026-10-31", description: "Um ataque devastador que rompe qualquer preguiça.", real_benefit_redacted: "Vantagem Real I" }}
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

# Aparência de {name}

O avatar de {name}: *{avatar_desc}*.

Os equipamentos são desbloqueados ao completar meses (400 XP) conforme a árvore de upgrades da classe {cls_name} em `docs/config/classes.md`.

## Como registar um equipamento

Preencha o slot correspondente no frontmatter:

```yaml
slots:
  weapon: {{ name: "Espada de Ferro", month: 1, unlocked_date: "2026-08-31" }}
```
"""

REWARDS = """---
rewards: []
---

# Recompensas de {name}

Histórico de prémios semanais e mensais (redactados). Nenhuma recompensa registada ainda.

## Como registar

```yaml
rewards:
  - {{ type: weekly, week: "2026-W32", points_earned: 120, reward_redacted: "Recompensa Lendária I", status: received, date: "2026-08-09" }}
  - {{ type: monthly, month: "2026-08", xp_earned: 400, reward_redacted: "Tesouro do Mês I", real_value_euros: 40, status: pending }}
```

| Tipo | Regra |
|---|---|
| Semanal | Ganho ao atingir 100 pontos na semana |
| Mensal | Ganho ao completar 400 XP no mês — upgrade do avatar + 10 € por semana atingida |
"""

WEEKLY = """---
week: "2026-W32"
player: {hid}
month: "2026-08"
boss: {{ id: dragao_preguica, name: "Dragão da Preguiça", completed: false, points: 30 }}
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

# Semana 2026-W32 — {name}

Registo da primeira semana da jornada (3 a 9 de agosto de 2026). Transfira as marcações do PDF impresso para o bloco `days:` acima: `true` para objetivo cumprido, e o número de extras realizadas em `extras`.

O `total_points` é calculado automaticamente pelo painel; preencha manualmente apenas se quiser sobrepor o cálculo.
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
