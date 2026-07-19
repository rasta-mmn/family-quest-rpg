---
game_name: "Family Quest RPG"
admin_pin: "1234"
journey_start: "2026-08-01"
current_month: "2026-08"
current_week: "2026-W32"
players:
  - id: Heroi1
    character_name: "Iron Ember"
    character_name_pt: "Brasa de Ferro"
    class: guerreiro
    real_name_redacted: "Player 1"
    real_name_redacted_pt: "Jogador 1"
    photo: "docs/assets/photos/heroi1.svg"
    avatar: "docs/assets/avatars/guerreiro.svg"
  - id: Heroi2
    character_name: "Wandering Melody"
    character_name_pt: "Melodia Errante"
    class: bardo
    real_name_redacted: "Player 2"
    real_name_redacted_pt: "Jogador 2"
    photo: "docs/assets/photos/heroi2.svg"
    avatar: "docs/assets/avatars/bardo.svg"
  - id: Heroi3
    character_name: "Arcane Veil"
    character_name_pt: "Véu Arcano"
    class: mago
    real_name_redacted: "Player 3"
    real_name_redacted_pt: "Jogador 3"
    photo: "docs/assets/photos/heroi3.svg"
    avatar: "docs/assets/avatars/mago.svg"
  - id: Heroi4
    character_name: "Swift Shade"
    character_name_pt: "Sombra Ligeira"
    class: ladino
    real_name_redacted: "Player 4"
    real_name_redacted_pt: "Jogador 4"
    photo: "docs/assets/photos/heroi4.svg"
    avatar: "docs/assets/avatars/ladino.svg"
points:
  per_task: 30
  per_extra: 2.5
  boss: 30
  weekly_target: 100
  monthly_xp: 400
  weekly_reward_euros: 10
---

# Game Configuration / Configuração do Jogo

**EN:** Registered heroes, journey calendar, and scoring constants.  
**PT:** Heróis registados, calendário da jornada e constantes de pontuação.

- Display strings use `field` (English) + `field_pt` (Portuguese). The UI locale toggle picks one.
- Strings de exibição: `field` (inglês) + `field_pt` (português). O toggle do UI escolhe uma.
