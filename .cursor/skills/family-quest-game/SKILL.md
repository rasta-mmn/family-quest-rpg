---
name: family-quest-game
description: >-
  Builds and extends Family Quest RPG — a real-life family gamification system
  with Markdown YAML database, printable monthly PDFs, and a React grimório
  frontend. Use when working on family-quest, family-code, docs/ heroes, PDF
  generator, bestiary, classes, ADM panel, XP/boss logic, or frontend pages
  (Home, Player, Weekly, Leaderboard, Admin).
---

# Family Quest — Agente de Criação de Jogos

Agente de implementação do **Family Quest RPG**. Base de dados = ficheiros `.md` com frontmatter YAML. Papel (PDF) alimenta digital (repo + frontend).

## Antes de codar

1. Ler estado atual do repo (`README.md`, `docs/`, o que falta vs fases).
2. Ler só o que a tarefa precisa:
   - Plano completo → [docs/planning/plan.md](../../../docs/planning/plan.md)
   - Design visual → [docs/planning/ideas.md](../../../docs/planning/ideas.md)
   - Stack React/Tailwind → [docs/planning/webdev-skill.md](../../../docs/planning/webdev-skill.md)
   - Regras de pontuação → [mechanics.md](mechanics.md)
3. Confirmar fase ativa com o utilizador se ambíguo. Não saltar fases sem pedido.

## Fases (ordem canónica)

| Fase | Entrega | Pasta |
|---|---|---|
| 1 ✅ | DB `.md` + seed heróis | `docs/` |
| 2 | Assets (avatars, enemies, backgrounds, photos) | `docs/assets/` |
| 3 | Gerador PDF mensal | `pdfs/scripts/generate_monthly_pdf.py` |
| 4 | Frontend grimório | `frontend/` |
| 5 | Integração GitHub API + deploy + link no README | — |

**Estado típico:** Fase 1 feita. Próximo = 2 → 3 → 4 → 5 (ou 3/4 se user pedir).

## Arquitetura (não reinventar)

```
docs/           ← DB (único source of truth)
pdfs/           ← fichas imprimíveis + scripts Python
frontend/       ← React 19 + Tailwind 4 + Wouter + shadcn
```

- Frontend **lê** `.md` (GitHub Raw ou fetch local em dev).
- Escrita ADM: GitHub Contents API (token em localStorage) **ou** download `.md` para commit manual.
- Privacidade: objetivos/prémios/nomes reais sempre **redactados** (`Missão Alpha`, `Jogador 1`).

## Regras de implementação

### DB (`docs/`)
- Nunca apagar bloco `---` frontmatter.
- YAML: 2 espaços. Datas `YYYY-MM-DD`, semanas `YYYY-WXX`.
- Schemas e exemplos: `docs/planning/plan.md` + ficheiros vivos em `docs/config/`, `docs/Heroi*/`.
- Novo herói: copiar pasta `HeroiN/`, registar em `game-config.md`, foto em `assets/photos/`.

### PDF (Fase 3)
- Script: `pdfs/scripts/generate_monthly_pdf.py`
- Lê: `game-config.md`, `months/YYYY-MM.md`, `profile.md`, `skills.md`, objetivos.
- 1 página/herói: foto + avatar + classe/level/skills + 3 objetivos + BOSS coletivo + XP squares (100 pts) + grelha 7×3 + extras; repetir por semana do mês.
- Tema visual do bestiário (paleta/fundo por tema).
- Saída: `pdfs/YYYY-MM/HeroiN.pdf` + `family-quest-YYYY-MM.pdf`.
- Stack: WeasyPrint + PyYAML (ou reportlab se WeasyPrint bloquear).

### Frontend (Fase 4)
- Path: `frontend/` (Vite React). Convenções UI: `docs/planning/webdev-skill.md`.
- Design **obrigatório**: Grimório de Pergaminho (`ideas.md`) — Cinzel + Crimson Pro, ouro `oklch(0.75 0.12 85)`, fundo carvão quente. Sem UI SaaS genérica / purple glow.
- `lib/`: `mdParser.ts`, `githubApi.ts`, `gameLogic.ts`, `bossSelector.ts`
- Páginas: Home, Player, Weekly, Leaderboard, Admin (PIN de `game-config.md`)
- Componentes: XPBar/XPGrid, AvatarCard, BossCard, TaskList, ClassBadge, UpgradeTree
- Microcopy: voz de mestre de RPG (ver `ideas.md`).

### Assets (Fase 2)
- Guardar em `docs/assets/{avatars,enemies,backgrounds,photos}/`
- Estilo fantasy consistente com grimório (não pixel, não flat corporate).
- Placeholders OK até artes finais; paths nos `.md` devem bater certo.

## Workflow por pedido do user

```
User pede feature
  → Identificar fase + ficheiros tocados
  → Ler mechanics + planning relevante
  → Implementar mínimo que desbloqueia
  → Validar pontuação/schemas se mexer em XP/BOSS/weekly
  → Não commitar sem pedido explícito
```

Checklist rápido:
- [ ] Frontmatter YAML válido
- [ ] Redação de dados reais
- [ ] Cálculos alinhados com `mechanics.md`
- [ ] Design grimório se UI
- [ ] Paths de assets coerentes

## O que NÃO fazer

- Inventar segunda DB (SQLite, Firebase, etc.) sem pedido.
- Escrever objetivos/prémios reais nos `.md`.
- Cards SaaS / Inter / purple gradient no frontend.
- Gerar PDFs sem ler setup do mês em `docs/config/months/`.
- Expandir scope além da fase pedida (YAGNI).

## Referências

- [mechanics.md](mechanics.md) — pontuação, BOSS, upgrades
- [docs/planning/plan.md](../../../docs/planning/plan.md) — plano fases + schemas
- [docs/planning/ideas.md](../../../docs/planning/ideas.md) — design system
- [docs/planning/webdev-skill.md](../../../docs/planning/webdev-skill.md) — template React
- [docs/README.md](../../../docs/README.md) — quem edita o quê
