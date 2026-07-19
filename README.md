# Family Quest RPG

> O grimório digital da família aventureira — transformando disciplina em lenda.

Um RPG da vida real onde cada membro da família é um herói com objetivos pessoais. As missões são cumpridas no mundo real, marcadas em fichas de papel (PDF impresso) e registadas neste repositório, que funciona como a **base de dados do jogo em arquivos `.md`**.

## Como Funciona

| Elemento | Regra |
|---|---|
| Classes | Guerreiro, Bardo, Mago, Ladino |
| Objetivos diários | 3 objetivos fixos por dia (segunda a domingo), definidos por herói a cada mês |
| Pontos por objetivo | 30 pontos |
| Atividades extras | +2,5 pontos por extra realizada |
| BOSS semanal | 1 por semana, **coletivo** — a família cumpre junta; +30 pontos para todos |
| Meta semanal | 100 pontos |
| Barra de XP mensal | 400 pontos (4 semanas × 100) |
| Upgrades | 12 por ano (1 por mês completado), específicos por classe |
| Recompensa semanal | Prémio pessoal real (redactado no jogo) |
| Recompensa mensal (400 XP) | Upgrade do avatar + vantagem real (10 €/semana atingida) |

## O Ciclo do Jogo

```
INÍCIO DO MÊS (ADM)
  1. Painel ADM: definir semanas do mês, objetivos de cada herói e tema
  2. O sistema seleciona automaticamente os 4 BOSS coletivos do bestiário
  3. Guardar o setup em docs/config/months/YYYY-MM.md
  4. Gerar os PDFs mensais (1 página por herói, tema visual do mês)
  5. Imprimir e entregar à família

DURANTE A SEMANA (papel)
  - Cada herói marca os 3 objetivos diários e anota extras no PDF
  - A família enfrenta o BOSS coletivo em conjunto

FIM DA SEMANA
  - Transferir as marcações do papel para docs/[Heroi]/weekly/YYYY-WXX.md
  - O frontend atualiza XP, quadrados e ranking automaticamente

FIM DO MÊS (400 XP)
  - Level-up: aplicar o upgrade do mês da classe
  - Atualizar profile.md, skills.md, appearance.md e rewards.md
  - Registar a recompensa real
```

## Estrutura do Repositório

```
docs/                      ← BASE DE DADOS (arquivos .md com frontmatter YAML)
  config/
    game-config.md         ← Jogadores, classes, pontos, mês atual
    classes.md             ← 4 classes × 12 upgrades anuais
    bestiary.md            ← Inimigos por tema (seleção automática de BOSS)
    months/YYYY-MM.md      ← Setup mensal: tema, objetivos, 4 BOSS
  Heroi1..Heroi4/
    profile.md             ← Perfil, classe, nível, XP
    objectives.md          ← Objetivos do mês (editável pelo jogador)
    skills.md              ← Skills/upgrades ganhos
    appearance.md          ← Equipamentos por slot
    rewards.md             ← Histórico de recompensas
    weekly/YYYY-WXX.md     ← Registo semanal (transferido do PDF)
  assets/
    photos/                ← Fotos reais dos jogadores (para o PDF)
    avatars/               ← Avatares por classe
    enemies/               ← Artes dos inimigos
    backgrounds/           ← Fundos temáticos
pdfs/
  scripts/generate_monthly_pdf.py  ← Gerador das fichas mensais
  YYYY-MM/                 ← PDFs gerados do mês
```

## Frontend

Painel grimório em `frontend/` (Vite + React 19 + Tailwind 4 + Wouter). Em dev lê `docs/` local; em prod usa GitHub Raw.

```bash
cd frontend
npm install
npm run dev
# abrir http://localhost:5173/family-quest-rpg/
```

**Link do painel:** [https://rasta-mmn.github.io/family-quest-rpg/](https://rasta-mmn.github.io/family-quest-rpg/)  
(Deploy via GitHub Pages — workflow `.github/workflows/deploy-pages.yml`. Ativar Pages → Source: GitHub Actions no repo.)

## Gerar os PDFs Mensais

```bash
cd pdfs/scripts
pip install -r requirements.txt
python3 generate_monthly_pdf.py --month 2026-08
```

Gera 1 PDF por herói + 1 PDF combinado em `pdfs/2026-08/`. Preferência WeasyPrint; se faltar libs de sistema (pango/cairo no macOS), fallback automático para reportlab (`--engine reportlab` força).

## Privacidade

Todos os objetivos, nomes reais e prémios são **redactados** nos arquivos do jogo ("Missão Alpha", "Recompensa Lendária"). Os significados reais ficam apenas com a família.
