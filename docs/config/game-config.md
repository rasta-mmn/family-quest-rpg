---
game_name: "Family Quest RPG"
admin_pin: "Migmol@882025"
journey_start: "2026-07-01"
current_month: "2026-07"
current_week: "2026-W30"
active_family: casa_inicial
families:
  - id: casa_inicial
    name: "Starting House"
    name_pt: "Casa Inicial"
    crest: "docs/assets/crests/casa_inicial.svg"
    hero_ids: [Heroi1, Heroi2, Heroi3, Heroi4]
    map_campaign_id: "07"
    map_stop: 0
    boss_outcome: null
    family_points_pool: 0
players:
  - id: Heroi1
    character_name: "Iron Ember"
    character_name_pt: "Brasa de Ferro"
    class: guerreiro
    family_id: casa_inicial
    real_name_redacted: "Rank I — Elder"
    real_name_redacted_pt: "Rank I — Ancião"
    photo: "docs/assets/photos/heroi1.svg"
    avatar: "docs/assets/avatars/guerreiro.png"
  - id: Heroi2
    character_name: "Wandering Melody"
    character_name_pt: "Melodia Errante"
    class: bardo
    family_id: casa_inicial
    real_name_redacted: "Rank II — Consort"
    real_name_redacted_pt: "Rank II — Consorte"
    photo: "docs/assets/photos/heroi2.svg"
    avatar: "docs/assets/avatars/bardo.png"
  - id: Heroi3
    character_name: "Arcane Veil"
    character_name_pt: "Véu Arcano"
    class: mago
    family_id: casa_inicial
    real_name_redacted: "Rank III — Heir"
    real_name_redacted_pt: "Rank III — Herdeiro"
    photo: "docs/assets/photos/heroi3.svg"
    avatar: "docs/assets/avatars/mago.png"
  - id: Heroi4
    character_name: "Swift Shade"
    character_name_pt: "Sombra Ligeira"
    class: ladino
    family_id: casa_inicial
    real_name_redacted: "Rank IV — Scout"
    real_name_redacted_pt: "Rank IV — Batedor"
    photo: "docs/assets/photos/heroi4.svg"
    avatar: "docs/assets/avatars/ladino.png"
points:
  per_task: 30
  per_extra: 2.5
  boss: 30
  weekly_target: 100
  monthly_xp: 400
  boss_gate_per_hero: 400
  weekly_reward_euros: 10
---

# Game Configuration / Configuração do Jogo

**EN:** Registered heroes, families, journey calendar, and scoring constants.  
**PT:** Heróis, famílias, calendário da jornada e constantes de pontuação.

- Display strings use `field` (English) + `field_pt` (Portuguese). The UI locale toggle picks one.
- Strings de exibição: `field` (inglês) + `field_pt` (português). O toggle do UI escolhe uma.
- Families share the calendar; map position (`map_campaign_id`) is per family.
- Famílias partilham o calendário; posição no mapa é por família.
