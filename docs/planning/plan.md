# Plano de Implementação — "Family Quest RPG" (RPG da Vida Real)

## Objetivo

Criar um sistema completo de gamificação familiar composto por:

1. **Repositório GitHub** com base de dados exclusivamente em **arquivos `.md`** (pasta `docs/`)
2. **Frontend web** (React + Tailwind) que lê os `.md` e exibe o jogo: avatares, XP, bosses, ranking
3. **Gerador mensal de PDFs** — uma ficha imprimível por herói para marcação manual na vida real (o "sistema manual" que alimenta o "sistema digital")
4. **Painel ADM** para o setup mensal: objetivos de cada herói, BOSS coletivo semanal e calendário

> **Filosofia do sistema:** O PDF impresso é preenchido à mão durante o mês. No fim de cada semana, o utilizador transfere os dados do papel para os arquivos `.md` no GitHub (diretamente ou via painel ADM), e o frontend reflete a evolução dos personagens.

---

## Mecânica do Jogo (Consolidada)

| Elemento | Regra |
|---|---|
| Classes | **Guerreiro, Bardo, Mago, Ladino** |
| Objetivos diários | 3 objetivos fixos por dia (seg–dom), configuráveis por herói a cada mês |
| Pontos por objetivo | 30 pontos |
| Atividades extras | +2,5 pontos por extra realizada (espaço livre no PDF) |
| BOSS semanal | **1 por semana, COLETIVO** — a família cumpre junta; +30 pontos para todos |
| Tipo de BOSS | Dragões, monstros, demônios, reis maus, magos malignos, liches, mortos-vivos — **selecionado automaticamente conforme o tema dos objetivos do mês** |
| Meta semanal | 100 pontos |
| Barra de XP mensal | 400 pontos (4 semanas × 100; ajustável conforme o calendário do mês) |
| Upgrades | **12 por ano (1 por mês completado)**, específicos por classe |
| Recompensa semanal | Prémio pessoal real (redactado no jogo) |
| Recompensa mensal (400 XP) | Upgrade do avatar (equipamento/aparência/skill da classe) + vantagem real (10 €/semana) |
| ADM | Papel de administrador que faz o setup mês a mês |

### Sistema de Upgrades por Classe (12/ano)

Cada classe tem uma árvore de 12 upgrades (1 por mês), misturando equipamento, aparência e skill. Exemplos:

| Mês | Guerreiro | Bardo | Mago | Ladino |
|---|---|---|---|---|
| 1 | Espada de Ferro | Alaúde Simples | Cajado de Aprendiz | Adaga Curta |
| 2 | Escudo de Carvalho | Canção Inspiradora (skill) | Grimório Básico | Capa de Sombras |
| 3 | Armadura de Placas | Flauta Élfica | Bola de Fogo (skill) | Passo Furtivo (skill) |
| ... | ... | ... | ... | ... |
| 12 | Lâmina Lendária | Hino dos Heróis | Arquimago | Mestre das Sombras |

*(A árvore completa de 4 classes × 12 upgrades será definida na base de dados `.md` na implementação.)*

### Seleção Automática de BOSS por Tema

No setup mensal, o ADM marca o **tema dominante dos objetivos** do mês; o sistema seleciona automaticamente os inimigos das 4 semanas a partir de um bestiário temático em `.md`:

| Tema dos objetivos | Exemplos de inimigos |
|---|---|
| Alimentação | Demônio da Gula, Hidra do Açúcar, Rei Glutão |
| Treino / Exercício | Dragão da Preguiça, Golem Sedentário, Lich da Fadiga |
| Estudo / Leitura | Mago Maligno da Ignorância, Espectro da Distração |
| Organização / Casa | Rei Mau do Caos, Mortos-Vivos da Bagunça |
| Sono / Saúde | Vampiro da Insônia, Necromante do Cansaço |
| Finanças | Dragão Avarento, Demônio do Desperdício |

---

## Estrutura do Repositório GitHub

```
family-quest-rpg/
│
├── README.md                            ← Regras do jogo + link do frontend
│
├── docs/                                ← BASE DE DADOS (arquivos .md)
│   ├── README.md                        ← Guia de preenchimento
│   │
│   ├── config/
│   │   ├── game-config.md               ← Jogadores, classes, mês/semana atual, calendário
│   │   ├── classes.md                   ← 4 classes com árvore de 12 upgrades cada
│   │   ├── bestiary.md                  ← Bestiário: inimigos por tema (para seleção automática)
│   │   └── months/
│   │       ├── 2026-07.md               ← Setup do mês: tema, objetivos por herói, 4 BOSS, semanas
│   │       └── 2026-08.md
│   │
│   ├── Heroi1/
│   │   ├── profile.md                   ← Nome, classe, nível, XP, foto real (link), avatar
│   │   ├── objectives.md               ← Objetivos ativos do mês (3 fixos/dia) — editável pelo jogador
│   │   ├── skills.md                    ← Skills/upgrades ganhos (por mês completado)
│   │   ├── appearance.md                ← Equipamentos por slot conforme classe
│   │   ├── rewards.md                   ← Histórico de recompensas semanais/mensais
│   │   └── weekly/
│   │       └── 2026-W29.md              ← Registo semanal (transferido do PDF manual)
│   │
│   ├── Heroi2/ ... Heroi4/              ← Mesma estrutura por herói
│   │
│   └── assets/
│       ├── photos/                      ← Fotos reais dos jogadores (para o PDF)
│       └── avatars/                     ← Avatares gerados por classe/nível
│
├── pdfs/                                ← PDFs mensais gerados (1 página por herói)
│   ├── 2026-07/
│   │   ├── Heroi1.pdf
│   │   ├── Heroi2.pdf
│   │   └── family-quest-2026-07.pdf    ← PDF combinado da família
│   └── scripts/
│       └── generate_monthly_pdf.py     ← Gerador de PDF (lê os .md e monta as fichas)
│
└── frontend/                            ← Projeto WebDev (React + Tailwind)
    └── client/src/
        ├── pages/
        │   ├── Home.tsx                 ← Dashboard da família + BOSS coletivo da semana
        │   ├── Player.tsx               ← Perfil individual (avatar, XP, skills, objetivos)
        │   ├── Weekly.tsx               ← Semana atual: objetivos, extras, pontos
        │   ├── Leaderboard.tsx          ← Ranking familiar
        │   └── Admin.tsx                ← Painel ADM: setup mensal
        ├── components/
        │   ├── AvatarCard.tsx           ← Avatar da classe com equipamentos
        │   ├── XPBar.tsx                ← Barra 0–400 com quadrados de 100 pts
        │   ├── XPGrid.tsx               ← Quadro de quadrados (espelho do PDF)
        │   ├── TaskList.tsx             ← 3 objetivos/dia + extras
        │   ├── BossCard.tsx             ← BOSS coletivo com progresso da família
        │   ├── ClassBadge.tsx           ← Insígnia da classe
        │   └── UpgradeTree.tsx          ← Árvore de 12 upgrades da classe
        └── lib/
            ├── mdParser.ts              ← Parser frontmatter YAML + Markdown
            ├── githubApi.ts             ← Leitura/escrita dos .md via GitHub API
            ├── gameLogic.ts             ← Pontos, XP, level-up, seleção de BOSS
            └── bossSelector.ts          ← Seleção automática de inimigos por tema
```

---

## O PDF Mensal (Ficha de Herói Imprimível)

**Gerado todo início de mês, 1 página por herói.** É o instrumento de marcação manual da família. Layout da página:

```
┌─────────────────────────────────────────────────────────┐
│  [TEMA VISUAL DO MÊS: cores/ambiente conforme objetivo] │
│                                                         │
│  ┌────────┐   NOME DO JOGADOR        ┌────────┐        │
│  │ FOTO   │   Classe: Mago           │ AVATAR │        │
│  │ REAL   │   Level: 3               │ (arte) │        │
│  └────────┘   Skills: ✦ ✦ ✦          └────────┘        │
│                                                         │
│  OBJETIVOS DO MÊS (tema: ex. Alimentação)               │
│  1. Missão Alpha   2. Missão Beta   3. Missão Gama     │
│                                                         │
│  BOSS DA SEMANA (coletivo): [Nome do inimigo + arte]    │
│                                                         │
│  QUADRO DE EXPERIÊNCIA (1 quadrado = 100 pts)           │
│  Semana 1: □   Semana 2: □   Semana 3: □   Semana 4: □ │
│                                                         │
│  ATIVIDADES DIÁRIAS (7 dias)                            │
│  ┌────┬─────────┬─────────┬─────────┬────────────────┐ │
│  │Dia │ Obj. 1  │ Obj. 2  │ Obj. 3  │ Extras (2,5pt) │ │
│  ├────┼─────────┼─────────┼─────────┼────────────────┤ │
│  │Seg │   ☐     │   ☐     │   ☐     │ ______________ │ │
│  │Ter │   ☐     │   ☐     │   ☐     │ ______________ │ │
│  │ ...│         │         │         │                │ │
│  │Dom │   ☐     │   ☐     │   ☐     │ ______________ │ │
│  └────┴─────────┴─────────┴─────────┴────────────────┘ │
│  (4 grades semanais, uma por semana do mês)             │
└─────────────────────────────────────────────────────────┘
```

**Tema visual dinâmico:** o gerador de PDF lê o tema do mês no setup (`docs/config/months/YYYY-MM.md`) e aplica paleta de cores, ilustrações de fundo e arte do BOSS coerentes:

| Tema | Paleta / Ambiente |
|---|---|
| Alimentação | Tons quentes (laranja/verde), taverna medieval, banquetes |
| Treino | Vermelho/bronze, arena de batalha, ferraria |
| Estudo | Azul/roxo, biblioteca arcana, torre de mago |
| Organização | Dourado/cinza, castelo, salão real |
| Sono/Saúde | Azul-noite/prata, floresta encantada ao luar |

**Ciclo semanal:** todas as semanas o utilizador envia o PDF preenchido (foto/scan) e o ADM (ou Manus em tarefas futuras) transfere as marcações para o `weekly/YYYY-WXX.md` correspondente — atualizando o sistema digital.

---

## Painel ADM (Setup Mensal)

Página `Admin.tsx` protegida por senha simples (definida em `game-config.md`), com os passos do setup:

1. **Definir o mês:** selecionar mês e número de semanas (4 normalmente, ajustável conforme calendário e início da jornada)
2. **Objetivos por herói:** para cada herói, definir os 3 objetivos fixos diários do mês (redactados) e o tema dominante
3. **Seleção de BOSS:** ao marcar o tema, o sistema sugere automaticamente 4 inimigos do bestiário (1 por semana) — o ADM pode aceitar ou trocar
4. **Gerar arquivo de setup:** o painel produz o conteúdo do `docs/config/months/YYYY-MM.md` pronto para commit (download do .md ou commit via GitHub API com token)
5. **Gerar PDFs:** disparar o script de geração dos PDFs mensais de todos os heróis

> **Nota técnica:** como a base de dados são arquivos `.md` no GitHub, a escrita a partir do painel ADM usa a GitHub Contents API com um token de acesso pessoal configurado pelo ADM (guardado apenas no localStorage do navegador). Alternativa sem token: o painel gera os arquivos `.md` prontos para o ADM copiar/colar ou fazer upload manual no GitHub.

---

## Esquemas dos Arquivos `.md` (Base de Dados)

### `docs/config/game-config.md`
```markdown
---
admin_pin: "0000"                      # PIN do painel ADM (trocar)
journey_start: "2026-08-01"            # Início da jornada dos heróis
current_month: "2026-08"
players:
  - id: Heroi1
    character_name: "Dragão de Fogo"
    class: guerreiro
    real_name_redacted: "Pai"
    photo: "docs/assets/photos/heroi1.jpg"
  - id: Heroi2
    character_name: "Melodia Errante"
    class: bardo
    real_name_redacted: "Mãe"
    photo: "docs/assets/photos/heroi2.jpg"
points:
  per_task: 30
  per_extra: 2.5
  boss: 30
  weekly_target: 100
  monthly_xp: 400
  weekly_reward_euros: 10
---
```

### `docs/config/classes.md`
```markdown
---
classes:
  guerreiro:
    name: "Guerreiro"
    description: "Força e disciplina"
    upgrades:                          # 12 upgrades = 12 meses
      - { month: 1, type: weapon, name: "Espada de Ferro" }
      - { month: 2, type: armor, name: "Escudo de Carvalho" }
      - { month: 3, type: skill, name: "Golpe Poderoso" }
      # ... até month: 12
  bardo:    { ... }
  mago:     { ... }
  ladino:   { ... }
---
```

### `docs/config/bestiary.md`
```markdown
---
themes:
  alimentacao:
    palette: ["#E8590C", "#2F9E44"]
    environment: "taverna medieval"
    enemies:
      - { name: "Demônio da Gula", type: demonio }
      - { name: "Hidra do Açúcar", type: monstro }
      - { name: "Rei Glutão", type: rei_mau }
      - { name: "Zumbi Faminto", type: morto_vivo }
  treino:
    palette: ["#C92A2A", "#A87900"]
    environment: "arena de batalha"
    enemies:
      - { name: "Dragão da Preguiça", type: dragao }
      - { name: "Golem Sedentário", type: monstro }
      - { name: "Lich da Fadiga", type: lich }
      - { name: "Cavaleiro Negro do Cansaço", type: rei_mau }
  estudo:       { ... }
  organizacao:  { ... }
  saude:        { ... }
  financas:     { ... }
---
```

### `docs/config/months/2026-08.md` (gerado pelo painel ADM)
```markdown
---
month: "2026-08"
weeks: ["2026-W32", "2026-W33", "2026-W34", "2026-W35"]
theme: treino                          # tema dominante do mês
bosses:                                # selecionados automaticamente pelo tema
  - { week: "2026-W32", name: "Dragão da Preguiça", collective: true, points: 30 }
  - { week: "2026-W33", name: "Golem Sedentário", collective: true, points: 30 }
  - { week: "2026-W34", name: "Lich da Fadiga", collective: true, points: 30 }
  - { week: "2026-W35", name: "Cavaleiro Negro do Cansaço", collective: true, points: 30 }
objectives:                            # 3 objetivos fixos/dia por herói
  Heroi1:
    theme: treino
    daily: ["Missão Alpha", "Missão Beta", "Missão Gama"]
  Heroi2:
    theme: alimentacao
    daily: ["Missão Delta", "Missão Épsilon", "Missão Zeta"]
---
```

### `docs/[Heroi]/objectives.md` (editável pelo jogador)
```markdown
---
month: "2026-08"
theme: treino
daily_objectives:
  - { id: obj1, name: "Missão Alpha", points: 30, real_meaning_redacted: true }
  - { id: obj2, name: "Missão Beta", points: 30, real_meaning_redacted: true }
  - { id: obj3, name: "Missão Gama", points: 30, real_meaning_redacted: true }
extras_allowed: true
---
```

### `docs/[Heroi]/weekly/2026-W32.md` (transferido do PDF manual)
```markdown
---
week: "2026-W32"
player: Heroi1
boss: { name: "Dragão da Preguiça", completed: true, points: 30 }
days:
  seg: { obj1: true, obj2: true, obj3: true, extras: 2 }
  ter: { obj1: true, obj2: true, obj3: false, extras: 0 }
  qua: { obj1: true, obj2: true, obj3: true, extras: 1 }
  qui: { obj1: true, obj2: true, obj3: true, extras: 0 }
  sex: { obj1: true, obj2: true, obj3: true, extras: 1 }
  sab: { obj1: true, obj2: true, obj3: true, extras: 0 }
  dom: { obj1: true, obj2: true, obj3: true, extras: 0 }
total_points: 130
xp_squares_filled: 1                   # quadrados de 100 pts preenchidos
reward_status: pending
---
```

*(Os arquivos `profile.md`, `skills.md`, `appearance.md` e `rewards.md` seguem os esquemas já definidos, agora vinculados à classe e à árvore de upgrades.)*

---

## Fases de Implementação

### Fase 1 — Repositório GitHub e Base de Dados `.md`
1. Criar repositório privado `family-quest-rpg`
2. Criar estrutura `docs/` completa: `config/` (game-config, classes com 4×12 upgrades, bestiário com 6 temas), pastas de heróis com todos os templates, `assets/`
3. Escrever `README.md` com regras completas e `docs/README.md` com guia de edição
4. Popular com dados de exemplo (2 heróis placeholder, mês de exemplo com setup completo)
5. Commit inicial

### Fase 2 — Assets Visuais (Geração de Imagens)
1. **4 avatares base** (Guerreiro, Bardo, Mago, Ladino) em estilo fantasy consistente
2. **Evoluções visuais dos avatares** (versões nível baixo/médio/alto por classe)
3. **Artes de inimigos** do bestiário (dragão, demônio, lich, golem, rei mau, morto-vivo — 1 por tipo)
4. **Fundos temáticos** para os 6 temas de PDF (taverna, arena, biblioteca arcana, castelo, floresta, tesouraria)
5. Ícones de equipamento, badges de semana/mês completo, molduras decorativas
6. Guardar em `docs/assets/avatars/` e upload para o frontend

### Fase 3 — Gerador de PDF Mensal (Python)
1. Script `generate_monthly_pdf.py` que lê `game-config.md`, `months/YYYY-MM.md`, `profile.md`, `skills.md` de cada herói
2. Layout de 1 página por herói: foto real + avatar + classe + level + skills + objetivos do mês + BOSS coletivo semanal + quadro de XP em quadrados (1 quadrado = 100 pts) + grade de atividades diárias (7 dias × 3 objetivos + coluna de extras), repetida por semana
3. **Tema visual dinâmico** conforme o tema do mês (paleta e fundo do bestiário)
4. Saída: PDF individual por herói + PDF combinado da família em `pdfs/YYYY-MM/`
5. Testar com o mês de exemplo e validar visualmente

### Fase 4 — Frontend React
1. Inicializar projeto WebDev `web-static` em `frontend/`, estilo dark fantasy
2. `lib/`: mdParser (frontmatter YAML), githubApi (leitura Raw + escrita Contents API), gameLogic (pontos/XP/level), bossSelector (tema → inimigos)
3. Componentes: XPBar/XPGrid (quadrados de 100 pts, espelho do PDF), AvatarCard, BossCard coletivo (progresso da família), TaskList, ClassBadge, UpgradeTree (12 upgrades da classe)
4. Páginas: Home (dashboard + BOSS coletivo), Player (perfil completo), Weekly (semana atual), Leaderboard (ranking)
5. **Painel ADM** (`/admin`, PIN): setup mensal — semanas do mês, objetivos por herói, tema, seleção automática de BOSS (com opção de troca), geração do arquivo `months/YYYY-MM.md` (commit via API ou download)

### Fase 5 — Integração, Teste e Deploy
1. Integrar frontend ↔ GitHub (leitura dos `.md`; escrita opcional via token)
2. Testar fluxo completo: setup ADM → geração de PDF → preenchimento simulado → registo semanal → XP → upgrade mensal
3. Verificar cálculos (90 base + 30 boss + extras; 400 XP/mês; 12 upgrades/ano)
4. Publicar frontend via WebDev Publish e adicionar link no `README.md`
5. Entregar: repositório completo + frontend publicado + PDFs do primeiro mês de exemplo

---

## Fluxo Operacional Mensal (Sistema Manual → Sistema Digital)

```
INÍCIO DO MÊS (ADM)
  1. Painel ADM: definir semanas do mês, objetivos de cada herói e tema
  2. Sistema seleciona automaticamente os 4 BOSS coletivos do bestiário
  3. Commit do setup em docs/config/months/YYYY-MM.md
  4. Gerar PDFs mensais (1 página/herói, tema visual do mês)
  5. Imprimir e entregar às crianças/família

DURANTE A SEMANA (papel)
  └─ Cada herói marca ☑ nos 3 objetivos diários e anota extras no PDF
  └─ Família enfrenta o BOSS coletivo juntos

FIM DA SEMANA (utilizador → Manus/ADM)
  └─ Enviar foto/scan do PDF preenchido
  └─ Transferir marcações para docs/[Heroi]/weekly/YYYY-WXX.md
  └─ Frontend atualiza XP, quadrados e ranking automaticamente

FIM DO MÊS (400 XP)
  └─ Level-up: aplicar upgrade do mês da classe (equipamento/skill/aparência)
  └─ Atualizar profile.md, skills.md, appearance.md, rewards.md
  └─ Registar recompensa real (10 €/semana atingida)
```

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Repositório | GitHub (privado) |
| **Base de Dados** | **Arquivos `.md` com frontmatter YAML** (docs/) |
| Frontend | React 19 + Tailwind 4 + shadcn/ui |
| Leitura/Escrita de dados | GitHub Raw API (leitura) + Contents API (escrita opcional com token) |
| Gerador de PDF | Python (reportlab/weasyprint) lendo os `.md` |
| Assets visuais | Manus built-in image generation |
| Deploy | Manus WebDev Publish (`*.manus.space`) |

---

## Pressupostos e Pontos em Aberto

| Item | Detalhe |
|---|---|
| Nomes e fotos dos jogadores | Placeholders iniciais; o utilizador substituirá nomes e adicionará fotos reais em `docs/assets/photos/` |
| Número de heróis | Estrutura preparada para 2–6; exemplos com 4 (um por classe) |
| Objetivos e prémios reais | Sempre redactados nos `.md` ("Missão Alpha", "Recompensa Lendária") |
| Semanas por mês | 4 por padrão, ajustável no setup ADM conforme calendário/início da jornada |
| Escrita no GitHub pelo painel ADM | Requer token pessoal do utilizador; alternativa: painel gera o `.md` para upload manual |
| Atualização semanal via PDF enviado | O utilizador envia o PDF preenchido em tarefas futuras; a transferência para os `.md` pode ser feita por mim (leitura da imagem) ou manualmente |
| Repositório privado | Frontend lê repos privados apenas com token; se preferir leitura sem token, o repositório precisará ser público (dados já estão redactados) |

---

## Revisão Jul 2026

Pipeline local fechado sem Manus WebDev:

| Fase | Status | Nota |
|---|---|---|
| 1 — DB `.md` | Feita | `docs/` com 4 heróis + config |
| 2a — Assets placeholder | Feita | SVG em `docs/assets/` (2b artes IA depois) |
| 3 — PDF | Feita | `pdfs/scripts/generate_monthly_pdf.py` (WeasyPrint → reportlab fallback) |
| 4 — Frontend | Feita | `frontend/` grimório Vite/React/Tailwind/Wouter |
| 5 — Deploy | Feita | GitHub Raw + Pages workflow; ADM = download `.md` (Contents API opcional depois) |

Stack local: Vite em `frontend/` (não Manus). Deploy: GitHub Pages a partir de `frontend/dist`.
