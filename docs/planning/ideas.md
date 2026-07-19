# Family Quest RPG — Brainstorm de Design

## Três Abordagens Estilísticas

### 1. Grimório de Pergaminho (Illuminated Manuscript)
Interface como um livro de crônicas medieval iluminado: pergaminho envelhecido, iniciais capitulares douradas, bordas ornamentadas à mão. Sensação de folhear o diário de aventuras da família.
**Probabilidade:** 0.04

### 2. Dark Fantasy Tavern (Baldur's Gate / Diablo UI)
Painel escuro de taverna: madeira, pedra, metal forjado, tochas. Ouro sobre carvão, molduras entalhadas. Sensação de menu de RPG AAA.
**Probabilidade:** 0.08

### 3. Pixel Quest Retro (16-bit JRPG)
Estética SNES: pixel art, caixas de diálogo azuis, fontes bitmap. Nostalgia divertida de Final Fantasy IV.
**Probabilidade:** 0.02

---

## Abordagem Escolhida: **Grimório de Pergaminho** (com estrutura de painel dark fantasy)

Escolhida por unir perfeitamente o mundo físico (PDFs impressos preenchidos à mão) e o digital: o site É o grimório da família, o mesmo objeto que vive no papel. Fundo escuro profundo com painéis de pergaminho — o melhor dos mundos 1 e 2.

### Design Movement
Illuminated Manuscript × Dark Fantasy Game UI (referências: Pillars of Eternity, Divinity Original Sin 2, códices medievais)

### Core Principles
1. **O site é um artefato**: cada painel parece pergaminho, couro ou pedra — nunca "cards de SaaS"
2. **Ouro conta a história do progresso**: XP, level-ups e conquistas sempre em dourado iluminado
3. **Assimetria de códice**: layouts com margens desiguais, capitulares, colunas laterais como notas de margem
4. **Ornamento com propósito**: molduras e flourishes apenas em momentos de celebração (level-up, boss derrotado)

### Color Philosophy
Fundo: carvão profundo com tom quente (quase marrom-escuro, como couro de capa de livro antigo) — `oklch(0.16 0.015 60)`. Painéis: pergaminho escurecido `oklch(0.28 0.02 75)` com textura sutil. O ouro `oklch(0.75 0.12 85)` é o Signature Color — reservado para XP, títulos e conquistas. Acentos por classe: Guerreiro vermelho-ferro, Bardo verde-esmeralda, Mago azul-arcano, Ladino roxo-sombra. Emocionalmente: aconchego de taverna + reverência de biblioteca arcana.

### Layout Paradigm
Estrutura de códice: sidebar esquerda estreita como "lombada do livro" (navegação com ícones de classe), conteúdo principal como página do grimório com cabeçalho ornamentado. Dashboard usa grid assimétrico: BOSS da semana grande à esquerda (2/3), coluna de heróis à direita como fichas empilhadas. Nunca centrado-simétrico.

### Signature Elements
1. **Quadrados de XP entalhados** — grade de quadrados que preenchem com ouro líquido (espelho exato do PDF impresso)
2. **Selo de cera da classe** — badge circular com ícone da classe em relevo, usado em toda ficha de herói
3. **Divisores de flourish** — linha ornamental fina (❦ estilizado) separando seções, como em manuscritos

### Interaction Philosophy
Interações têm peso físico: marcar um objetivo "carimba" o check com pequena rotação; abrir uma ficha de herói desliza como virar página; o boss derrotado recebe um "X" de tinta vermelha animado.

### Animation
- Preenchimento de XP: ouro flui da esquerda para a direita, 600ms ease-out, com brilho no fim
- Entradas de página: fade + translateY(8px), 250ms, stagger 50ms entre fichas
- Level-up: burst de partículas douradas (única animação exuberante permitida)
- Hover em cards: elevação sutil + borda dourada acendendo (150ms)
- Sem animações em navegação por teclado

### Typography System
- **Display/Títulos:** "Cinzel" (serifada lapidar romana — gravada em pedra)
- **Subtítulos/Nomes de personagem:** "Cinzel Decorative" para momentos especiais
- **Corpo/UI:** "Crimson Pro" (serifada legível de livro)
- **Dados/números:** "Crimson Pro" semibold tabular
- Hierarquia: títulos em Cinzel caps espaçado (tracking 0.08em), corpo em Crimson Pro 16-17px

### Brand Essence
O grimório digital da família aventureira — para famílias que transformam disciplina em lenda. Adjetivos: épico, caloroso, artesanal.

### Brand Voice
Tom de mestre de RPG narrando a crônica da família. Headlines soam como convocações de aventura; microcopy usa vocabulário de fantasia (missões, façanhas, bestiário).
- Ex. 1: "A jornada desta semana aguarda, heróis."
- Ex. 2: "O Dragão da Preguiça foi derrotado. +30 de glória para todos."

### Wordmark & Logo
Símbolo: escudo heráldico dividido em 4 quartos (espada, alaúde, cajado, adaga — as 4 classes), gravado em ouro sobre fundo escuro. Wordmark "FAMILY QUEST" em Cinzel com Q ornamentada.

### Signature Brand Color
Ouro Iluminado — `oklch(0.75 0.12 85)` (#D4A945 aprox.) — o ouro dos manuscritos iluminados, usado exclusivamente para progresso e glória.
