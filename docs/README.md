# Guia da Base de Dados (`docs/`)

Esta pasta é a **base de dados do jogo**. Todos os dados vivem em arquivos `.md` com um bloco de **frontmatter YAML** no topo (entre `---`). O frontend lê estes arquivos e monta o painel automaticamente.

Planejamento (fora do runtime do jogo):

| Arquivo | Conteúdo |
|---|---|
| `planning/plan.md` | Plano de implementação (fases 1–5) |
| `planning/ideas.md` | Design visual escolhido (Grimório de Pergaminho) |
| `planning/webdev-skill.md` | Guia do template React/Tailwind (frontend) |

Agente Cursor: `.cursor/skills/family-quest-game/` — invocar ao continuar o jogo (PDF, frontend, assets, mecânicas).

## Regras Gerais de Edição

1. **Nunca apague o bloco `---` ... `---`** no topo dos arquivos — é onde os dados estruturados vivem.
2. Edite os valores mantendo a indentação YAML (2 espaços).
3. Texto após o segundo `---` é livre: use para notas, histórias e crônicas da família.
4. Datas no formato `YYYY-MM-DD`; semanas no formato ISO `YYYY-WXX`.
5. Faça commit após cada atualização — o histórico do git é o "livro de crônicas" do jogo.

## Quem Edita o Quê

| Arquivo | Quem edita | Quando |
|---|---|---|
| `config/game-config.md` | ADM | Setup inicial e mudanças de jogadores |
| `config/classes.md` | ADM | Raramente (árvore de upgrades) |
| `config/bestiary.md` | ADM | Raramente (novos inimigos/temas) |
| `config/months/YYYY-MM.md` | ADM | Início de cada mês |
| `[Heroi]/objectives.md` | **Jogador** | Início de cada mês (seus 3 objetivos) |
| `[Heroi]/weekly/YYYY-WXX.md` | Jogador ou ADM | Fim de cada semana (transferir do PDF) |
| `[Heroi]/profile.md` | ADM | Fim do mês (level-up) |
| `[Heroi]/skills.md` | ADM | Fim do mês (novo upgrade tipo skill) |
| `[Heroi]/appearance.md` | ADM | Fim do mês (novo equipamento) |
| `[Heroi]/rewards.md` | ADM | Fim de semana/mês (recompensas) |

## Como Registar uma Semana (transferir do PDF)

1. Copie o template de `weekly/` de uma semana anterior (ou crie `YYYY-WXX.md`)
2. Preencha `days:` com `true`/`false` para cada objetivo e o número de `extras`
3. Marque `boss.completed` se a família derrotou o BOSS coletivo
4. O `total_points` pode ficar a 0 — o frontend calcula automaticamente; se preencher, será usado como valor manual

## Como Adicionar um Novo Herói

1. Copie a pasta `Heroi1/` com o novo nome (ex: `Heroi5/`)
2. Adicione o herói em `config/game-config.md` na lista `players`
3. Adicione a foto real em `assets/photos/`
4. Adicione os objetivos do herói no setup do mês em `config/months/`

## Redação (Privacidade)

Os objetivos e prémios reais **nunca** são escritos aqui. Use nomes de fantasia:
- Objetivos → "Missão Alpha", "Missão Beta", "Desafio do Amanhecer"…
- Prémios → "Recompensa Lendária", "Tesouro do Dragão"…

A família guarda uma tabela privada (fora do repositório) com o significado real de cada nome.
