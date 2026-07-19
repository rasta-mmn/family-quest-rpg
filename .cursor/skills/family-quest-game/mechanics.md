# Family Quest — Mecânicas

## Constantes (fonte: `docs/config/game-config.md`)

| Chave | Valor |
|---|---|
| Classes | guerreiro, bardo, mago, ladino |
| Pontos / objetivo diário | 30 |
| Pontos / extra | 2.5 |
| BOSS coletivo / semana | 30 (todos os heróis) |
| Meta semanal | 100 |
| XP mensal (barra) | 400 (≈ 4 × 100) |
| Upgrades / ano | 12 (1 por mês completado) |
| € / semana atingida | 10 (recompensa real, redactada no jogo) |

## Cálculo semanal

```
base = count(obj true) × 30
extras = sum(extras) × 2.5
boss = 30 se boss.completed else 0
total = base + extras + boss
```

Máx. teórico sem extras: `7×3×30 + 30 = 660`. Meta prática: preencher ≥100 pts → 1 quadrado XP.

## XP e level-up

- 1 quadrado XP = 100 pts na semana (espelho PDF ↔ frontend).
- Mês completo ≈ 400 XP → level-up: aplicar upgrade `month N` da classe em `docs/config/classes.md`.
- Atualizar: `profile.md`, `skills.md` (se type skill), `appearance.md` (se weapon/armor), `rewards.md`.

## BOSS por tema

ADM define tema dominante do mês → `bossSelector` puxa 4 inimigos de `docs/config/bestiary.md` (1/semana). ADM pode trocar.

Temas: `alimentacao`, `treino`, `estudo`, `organizacao`, `saude`, `financas`.

## Ciclo operacional

1. **Início mês (ADM):** semanas + objetivos/herói + tema → `months/YYYY-MM.md` → gerar PDFs
2. **Semana (papel):** marcar 3 obj/dia + extras + BOSS coletivo
3. **Fim semana:** transferir para `docs/[Heroi]/weekly/YYYY-WXX.md`
4. **Fim mês (400 XP):** upgrade + recompensa

## Ficheiros críticos

| Ficheiro | Papel |
|---|---|
| `docs/config/game-config.md` | players, PIN ADM, pontos, mês/semana atual |
| `docs/config/classes.md` | árvore 4×12 upgrades |
| `docs/config/bestiary.md` | inimigos + paletas por tema |
| `docs/config/months/YYYY-MM.md` | setup do mês |
| `docs/[Heroi]/weekly/YYYY-WXX.md` | registo transferido do PDF |
