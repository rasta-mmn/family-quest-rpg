---
game_name: "Family Quest RPG"
admin_pin: "1234"
journey_start: "2026-08-01"
current_month: "2026-08"
current_week: "2026-W32"
players:
  - id: Heroi1
    character_name: "Brasa de Ferro"
    class: guerreiro
    real_name_redacted: "Jogador 1"
    photo: "docs/assets/photos/heroi1.svg"
    avatar: "docs/assets/avatars/guerreiro.svg"
  - id: Heroi2
    character_name: "Melodia Errante"
    class: bardo
    real_name_redacted: "Jogador 2"
    photo: "docs/assets/photos/heroi2.svg"
    avatar: "docs/assets/avatars/bardo.svg"
  - id: Heroi3
    character_name: "Véu Arcano"
    class: mago
    real_name_redacted: "Jogador 3"
    photo: "docs/assets/photos/heroi3.svg"
    avatar: "docs/assets/avatars/mago.svg"
  - id: Heroi4
    character_name: "Sombra Ligeira"
    class: ladino
    real_name_redacted: "Jogador 4"
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

# Configuração do Jogo

Este arquivo define os heróis registados, o calendário da jornada e as constantes de pontuação.

- **`admin_pin`** — PIN de acesso ao painel ADM do frontend (troque o valor padrão!)
- **`journey_start`** — data de início da jornada dos heróis
- **`players`** — a lista de heróis; para adicionar um novo, copie um bloco e crie a pasta correspondente em `docs/`
- **`points`** — as constantes do jogo; alterá-las muda os cálculos em todo o sistema
