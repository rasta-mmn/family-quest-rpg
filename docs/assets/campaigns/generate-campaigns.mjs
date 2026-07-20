/**
 * Seed 12 monthly campaigns + SVG avatars (boss + 4 vassals each).
 * Run: node docs/assets/campaigns/generate-campaigns.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

const THEMES = [
  'fisico',
  'mental',
  'profissional',
  'financas',
  'social',
  'recreativo',
  'espiritual',
  'fisico',
  'mental',
  'profissional',
  'financas',
  'social',
]

const PALETTES = {
  fisico: ['#C92A2A', '#A87900', '#3D2B1F'],
  mental: ['#7C3AED', '#C4B5FD', '#1E1B2E'],
  profissional: ['#2563EB', '#93C5FD', '#0F172A'],
  financas: ['#996515', '#166534', '#1C1917'],
  social: ['#15803D', '#86EFAC', '#14532D'],
  recreativo: ['#EA580C', '#FDBA74', '#431407'],
  espiritual: ['#1E3A8A', '#94A3B8', '#0F172A'],
}

/** @type {Array<{title:string,title_pt:string,lore:string,lore_pt:string,obj:string,obj_pt:string,boss:object,vassals:object[]}>} */
const CAMPAIGNS = [
  {
    title: 'Forge of the Slumbering Drake',
    title_pt: 'Forja do Dragão Adormecido',
    lore: 'The arena floor cracks. A red dragon of laziness stirs beneath the forge — its breath is snooze alarms and soft couches. Only daily sweat opens the vault.',
    lore_pt: 'O chão da arena racha. Um dragão vermelho da preguiça mexe sob a forja — o bafo são alarmes adiados e sofás macios. Só o suor diário abre o cofre.',
    obj: 'Collective month: train body and beat the Drake',
    obj_pt: 'Mês coletivo: treinar o corpo e vencer o Dragão',
    boss: {
      id: 'drake_laziness',
      name: 'Slumbering Drake',
      name_pt: 'Dragão Adormecido',
      lore: 'Hoards skipped workouts like gold.',
      lore_pt: 'Acumula treinos saltados como ouro.',
      points: 50,
      shape: 'dragon',
    },
    vassals: [
      {
        id: 'golem_sofa',
        name: 'Sofa Golem',
        name_pt: 'Golem do Sofá',
        objective: 'Week 1: move every day',
        objective_pt: 'Semana 1: mexer todos os dias',
        lore: 'Stone and cushions fused.',
        lore_pt: 'Pedra e almofadas fundidas.',
        points: 30,
        shape: 'golem',
      },
      {
        id: 'lich_fatigue',
        name: 'Lich of Fatigue',
        name_pt: 'Lich da Fadiga',
        objective: 'Week 2: sleep on schedule',
        objective_pt: 'Semana 2: dormir no horário',
        lore: 'Drains will at dusk.',
        lore_pt: 'Drena a vontade ao entardecer.',
        points: 30,
        shape: 'lich',
      },
      {
        id: 'knight_exhaustion',
        name: 'Knight of Exhaustion',
        name_pt: 'Cavaleiro do Cansaço',
        objective: 'Week 3: finish hard sessions',
        objective_pt: 'Semana 3: completar sessões duras',
        lore: 'Challenges heroes when legs shake.',
        lore_pt: 'Desafia heróis quando as pernas tremem.',
        points: 30,
        shape: 'knight',
      },
      {
        id: 'specter_skip',
        name: 'Specter of Skip Day',
        name_pt: 'Espectro do Dia Saltado',
        objective: 'Week 4: no zero days',
        objective_pt: 'Semana 4: zero dias a zero',
        lore: 'Whispers tomorrow is fine.',
        lore_pt: 'Sussurra que amanhã serve.',
        points: 30,
        shape: 'specter',
      },
    ],
  },
  {
    title: 'Tower of Whispering Mirrors',
    title_pt: 'Torre dos Espelhos Sussurrantes',
    lore: 'Floating books slam shut. Anxiety wears a crown of cracked glass. Name the fear, and the tower loses a floor.',
    lore_pt: 'Livros flutuantes fecham-se. A ansiedade usa coroa de vidro rachado. Nomeia o medo e a torre perde um andar.',
    obj: 'Collective month: steady mind and clear the Tower',
    obj_pt: 'Mês coletivo: mente estável e limpar a Torre',
    boss: {
      id: 'mirror_anxiety',
      name: 'Mirror Queen of Anxiety',
      name_pt: 'Rainha-Espelho da Ansiedade',
      lore: 'Shows only worst futures.',
      lore_pt: 'Mostra só futuros piores.',
      points: 50,
      shape: 'mage',
    },
    vassals: [
      {
        id: 'demon_doubt',
        name: 'Demon of Doubt',
        name_pt: 'Demônio da Dúvida',
        objective: 'Week 1: one brave choice',
        objective_pt: 'Semana 1: uma escolha corajosa',
        lore: 'Loops every decision.',
        lore_pt: 'Repete cada decisão.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'mage_confusion',
        name: 'Mage of Fog',
        name_pt: 'Mago da Névoa',
        objective: 'Week 2: name feelings daily',
        objective_pt: 'Semana 2: nomear sentimentos',
        lore: 'Blurs thought and heart.',
        lore_pt: 'Embaça pensamento e coração.',
        points: 30,
        shape: 'mage',
      },
      {
        id: 'dragon_stress',
        name: 'Wyrm of Worry',
        name_pt: 'Serpente da Preocupação',
        objective: 'Week 3: short resets',
        objective_pt: 'Semana 3: resets curtos',
        lore: 'Breathes piled-up tasks.',
        lore_pt: 'Cospe tarefas acumuladas.',
        points: 30,
        shape: 'dragon',
      },
      {
        id: 'specter_spiral',
        name: 'Spiral Specter',
        name_pt: 'Espectro da Espiral',
        objective: 'Week 4: stop the rumination',
        objective_pt: 'Semana 4: cortar ruminação',
        lore: 'Circles the same thought.',
        lore_pt: 'Roda o mesmo pensamento.',
        points: 30,
        shape: 'specter',
      },
    ],
  },
  {
    title: 'Library of the Closed Gate',
    title_pt: 'Biblioteca do Portão Fechado',
    lore: 'Ignorance seals the arcane stacks. Each finished lesson turns a key. The gate opens only for those who study when bored.',
    lore_pt: 'A ignorância sela os corredores arcanos. Cada lição concluída vira chave. O portão abre só a quem estuda no tédio.',
    obj: 'Collective month: learn with focus and open the Gate',
    obj_pt: 'Mês coletivo: estudar com foco e abrir o Portão',
    boss: {
      id: 'mage_ignorance',
      name: 'Archmage of Ignorance',
      name_pt: 'Arquimago da Ignorância',
      lore: 'Casts fog over open books.',
      lore_pt: 'Lança névoa sobre livros abertos.',
      points: 50,
      shape: 'mage',
    },
    vassals: [
      {
        id: 'specter_notif',
        name: 'Notification Specter',
        name_pt: 'Espectro das Notificações',
        objective: 'Week 1: deep work blocks',
        objective_pt: 'Semana 1: blocos de foco',
        lore: 'Haunts every screen.',
        lore_pt: 'Assombra cada ecrã.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'demon_tomorrow',
        name: 'Demon of Tomorrow',
        name_pt: 'Demônio do Amanhã',
        objective: 'Week 2: start before ready',
        objective_pt: 'Semana 2: começar antes de estar pronto',
        lore: 'Always postpones the first page.',
        lore_pt: 'Adia sempre a primeira página.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'dragon_forget',
        name: 'Dragon of Forgetfulness',
        name_pt: 'Dragão do Esquecimento',
        objective: 'Week 3: review what you learned',
        objective_pt: 'Semana 3: rever o aprendido',
        lore: 'Eats unreviewed notes.',
        lore_pt: 'Come notas não revistas.',
        points: 30,
        shape: 'dragon',
      },
      {
        id: 'golem_busywork',
        name: 'Busywork Golem',
        name_pt: 'Golem do Afazer Vazio',
        objective: 'Week 4: finish one hard project slice',
        objective_pt: 'Semana 4: terminar um pedaço difícil',
        lore: 'Looks busy, moves nowhere.',
        lore_pt: 'Parece ocupado, não anda.',
        points: 30,
        shape: 'golem',
      },
    ],
  },
  {
    title: 'Vault of the Miser Wyrm',
    title_pt: 'Cofre do Dragão Avarento',
    lore: 'Debt coils like a sleeping wyrm around the treasury. Impulse kings decree fake urgency. Count gold before it vanishes.',
    lore_pt: 'A dívida enrola-se como wyrm à volta da tesouraria. Reis do impulso decretam urgência falsa. Conta o ouro antes que suma.',
    obj: 'Collective month: guard the vault and starve the Wyrm',
    obj_pt: 'Mês coletivo: guardar o cofre e matar o Wyrm de fome',
    boss: {
      id: 'miser_wyrm',
      name: 'Miser Wyrm',
      name_pt: 'Dragão Avarento',
      lore: 'Hoards debt as treasure.',
      lore_pt: 'Acumula dívida como tesouro.',
      points: 50,
      shape: 'dragon',
    },
    vassals: [
      {
        id: 'demon_waste',
        name: 'Demon of Waste',
        name_pt: 'Demônio do Desperdício',
        objective: 'Week 1: track every spend',
        objective_pt: 'Semana 1: registar cada gasto',
        lore: 'Turns coins into impulse.',
        lore_pt: 'Transforma moedas em impulso.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'king_impulse',
        name: 'Impulse King',
        name_pt: 'Rei do Impulso',
        objective: 'Week 2: 48h rule on buys',
        objective_pt: 'Semana 2: regra 48h nas compras',
        lore: 'Decrees irresistible deals.',
        lore_pt: 'Decreta ofertas irresistíveis.',
        points: 30,
        shape: 'knight',
      },
      {
        id: 'specter_subs',
        name: 'Subscription Specter',
        name_pt: 'Espectro das Assinaturas',
        objective: 'Week 3: cancel unused drains',
        objective_pt: 'Semana 3: cancelar drenos inúteis',
        lore: 'Charges forgotten fees.',
        lore_pt: 'Cobra taxas esquecidas.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'lich_debt',
        name: 'Lich of Debt Interest',
        name_pt: 'Lich dos Juros',
        objective: 'Week 4: pay the plan',
        objective_pt: 'Semana 4: pagar o plano',
        lore: 'Grows stronger each unpaid day.',
        lore_pt: 'Fica mais forte a cada dia em atraso.',
        points: 30,
        shape: 'lich',
      },
    ],
  },
  {
    title: 'Tavern of Sealed Doors',
    title_pt: 'Taverna das Portas Seladas',
    lore: 'Silence bricked the long table. Pride forbids apologies. The tavern reopens when someone speaks first.',
    lore_pt: 'O silêncio tijolou a mesa longa. O orgulho proíbe desculpas. A taverna reabre quando alguém fala primeiro.',
    obj: 'Collective month: reconnect and unseal the Tavern',
    obj_pt: 'Mês coletivo: reconectar e abrir a Taverna',
    boss: {
      id: 'pride_king',
      name: 'King of Sealed Pride',
      name_pt: 'Rei do Orgulho Selado',
      lore: 'Forbids soft words in court.',
      lore_pt: 'Proíbe palavras brandas na corte.',
      points: 50,
      shape: 'knight',
    },
    vassals: [
      {
        id: 'specter_isolation',
        name: 'Isolation Specter',
        name_pt: 'Espectro do Isolamento',
        objective: 'Week 1: reach out once a day',
        objective_pt: 'Semana 1: contactar alguém por dia',
        lore: 'Seals doors with quiet.',
        lore_pt: 'Sela portas com silêncio.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'demon_envy',
        name: 'Demon of Envy',
        name_pt: 'Demônio da Inveja',
        objective: 'Week 2: celebrate another',
        objective_pt: 'Semana 2: celebrar outro',
        lore: 'Poisons friendship with compare.',
        lore_pt: 'Envenena amizade com comparação.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'golem_wall',
        name: 'Wall Golem',
        name_pt: 'Golem do Muro',
        objective: 'Week 3: say the hard thing kindly',
        objective_pt: 'Semana 3: dizer o difícil com cuidado',
        lore: 'Grows with unspoken words.',
        lore_pt: 'Cresce com palavras não ditas.',
        points: 30,
        shape: 'golem',
      },
      {
        id: 'lich_grudge',
        name: 'Lich of Old Grudge',
        name_pt: 'Lich do Rancor Antigo',
        objective: 'Week 4: repair one bond',
        objective_pt: 'Semana 4: reparar um laço',
        lore: 'Freezes warmth in ice.',
        lore_pt: 'Congela o calor em gelo.',
        points: 30,
        shape: 'lich',
      },
    ],
  },
  {
    title: 'Festival Under Gray Banners',
    title_pt: 'Festival sob Bandeiras Cinzentas',
    lore: 'Overwork guards the calendar. Joy was declared unproductive. Steal back play before the banners bleach white.',
    lore_pt: 'O excesso de trabalho guarda o calendário. A alegria foi declarada improdutiva. Rouba de volta o brincar antes das bandeiras branquearem.',
    obj: 'Collective month: reclaim play and light the Festival',
    obj_pt: 'Mês coletivo: recuperar o brincar e acender o Festival',
    boss: {
      id: 'dragon_overwork',
      name: 'Dragon of Overwork',
      name_pt: 'Dragão do Excesso de Trabalho',
      lore: 'Guards the calendar from joy.',
      lore_pt: 'Guarda o calendário da alegria.',
      points: 50,
      shape: 'dragon',
    },
    vassals: [
      {
        id: 'demon_grind',
        name: 'Demon of Grind',
        name_pt: 'Demônio da Rotina',
        objective: 'Week 1: schedule real leisure',
        objective_pt: 'Semana 1: marcar lazer de verdade',
        lore: 'Steals joy, names it duty.',
        lore_pt: 'Rouba alegria, chama dever.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'specter_boredom',
        name: 'Boredom Specter',
        name_pt: 'Espectro do Tédio',
        objective: 'Week 2: try one new pastime',
        objective_pt: 'Semana 2: tentar um passatempo novo',
        lore: 'Turns free time gray.',
        lore_pt: 'Torna o tempo livre cinzento.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'lich_guilt',
        name: 'Lich of Guilt',
        name_pt: 'Lich da Culpa',
        objective: 'Week 3: play without apology',
        objective_pt: 'Semana 3: brincar sem pedir desculpa',
        lore: 'Freezes hobbies with should.',
        lore_pt: 'Congela hobbies com "devias".',
        points: 30,
        shape: 'lich',
      },
      {
        id: 'mage_scroll',
        name: 'Mage of Endless Scroll',
        name_pt: 'Mago do Scroll Eterno',
        objective: 'Week 4: create, do not only consume',
        objective_pt: 'Semana 4: criar, não só consumir',
        lore: 'Feeds hours to the feed.',
        lore_pt: 'Alimenta horas ao feed.',
        points: 30,
        shape: 'mage',
      },
    ],
  },
  {
    title: 'Moonlit Grove of Forgotten Purpose',
    title_pt: 'Bosque ao Luar do Propósito Esquecido',
    lore: 'Emptiness whispers that nothing matters. Cynicism mocks the path. Walk slow under the moon until meaning answers.',
    lore_pt: 'O vazio sussurra que nada importa. O cinismo zomba do caminho. Anda devagar sob a lua até o sentido responder.',
    obj: 'Collective month: listen within and reclaim the Grove',
    obj_pt: 'Mês coletivo: ouvir por dentro e recuperar o Bosque',
    boss: {
      id: 'dragon_forgotten_soul',
      name: 'Dragon of Forgotten Soul',
      name_pt: 'Dragão da Alma Esquecida',
      lore: 'Hoards meaning in a sealed cave.',
      lore_pt: 'Guarda o sentido numa caverna selada.',
      points: 50,
      shape: 'dragon',
    },
    vassals: [
      {
        id: 'specter_void',
        name: 'Specter of Emptiness',
        name_pt: 'Espectro do Vazio',
        objective: 'Week 1: quiet practice daily',
        objective_pt: 'Semana 1: prática quieta diária',
        lore: 'Whispers nothing matters.',
        lore_pt: 'Sussurra que nada importa.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'demon_rush',
        name: 'Demon of Rush',
        name_pt: 'Demônio da Pressa',
        objective: 'Week 2: pause before react',
        objective_pt: 'Semana 2: pausar antes de reagir',
        lore: 'Never lets heroes listen.',
        lore_pt: 'Nunca deixa os heróis ouvir.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'mage_cynic',
        name: 'Mage of Cynicism',
        name_pt: 'Mago do Cinismo',
        objective: 'Week 3: act on one value',
        objective_pt: 'Semana 3: agir por um valor',
        lore: 'Mocks purpose until hope fades.',
        lore_pt: 'Zomba do propósito até a esperança apagar.',
        points: 30,
        shape: 'mage',
      },
      {
        id: 'lich_numb',
        name: 'Lich of Numbness',
        name_pt: 'Lich do Entorpecimento',
        objective: 'Week 4: leave a small legacy act',
        objective_pt: 'Semana 4: um ato de legado pequeno',
        lore: 'Freezes wonder in ash.',
        lore_pt: 'Congela o espanto em cinza.',
        points: 30,
        shape: 'lich',
      },
    ],
  },
  {
    title: 'Second Trial of the Iron Arena',
    title_pt: 'Segundo Julgamento da Arena de Ferro',
    lore: 'The Drake returns thinner, meaner. Habit is the new armor. Vassals test consistency, not first spark.',
    lore_pt: 'O Dragão volta mais magro e cruel. Hábito é a nova armadura. Os súditos testam constância, não o primeiro fogo.',
    obj: 'Collective month: hold the habit and retake the Arena',
    obj_pt: 'Mês coletivo: manter o hábito e reconquistar a Arena',
    boss: {
      id: 'iron_drake',
      name: 'Iron Drake Reloaded',
      name_pt: 'Dragão de Ferro Renascido',
      lore: 'Returns when routines crack.',
      lore_pt: 'Volta quando a rotina racha.',
      points: 50,
      shape: 'dragon',
    },
    vassals: [
      {
        id: 'golem_plateau',
        name: 'Plateau Golem',
        name_pt: 'Golem do Platô',
        objective: 'Week 1: raise one load',
        objective_pt: 'Semana 1: subir uma carga',
        lore: 'Blocks progress with sameness.',
        lore_pt: 'Bloqueia progresso com o mesmo.',
        points: 30,
        shape: 'golem',
      },
      {
        id: 'specter_excuse',
        name: 'Excuse Specter',
        name_pt: 'Espectro da Desculpa',
        objective: 'Week 2: train anyway',
        objective_pt: 'Semana 2: treinar mesmo assim',
        lore: 'Invent weather for every skip.',
        lore_pt: 'Inventa tempo para cada falta.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'knight_sore',
        name: 'Sore Knight',
        name_pt: 'Cavaleiro da Dorzinha',
        objective: 'Week 3: recover smart',
        objective_pt: 'Semana 3: recuperar com inteligência',
        lore: 'Confuses pain with glory.',
        lore_pt: 'Confunde dor com glória.',
        points: 30,
        shape: 'knight',
      },
      {
        id: 'demon_binge',
        name: 'Demon of Rebound',
        name_pt: 'Demônio do Compensar',
        objective: 'Week 4: steady over extremes',
        objective_pt: 'Semana 4: constante acima de extremos',
        lore: 'Pushes all-or-nothing.',
        lore_pt: 'Empurra tudo-ou-nada.',
        points: 30,
        shape: 'demon',
      },
    ],
  },
  {
    title: 'Chronicle of the Calm Storm',
    title_pt: 'Crónica da Tempestade Calma',
    lore: 'The Mirror Queen splinters into weather. Heroes write the chronicle by choosing response over reaction.',
    lore_pt: 'A Rainha-Espelho estilhaça-se em clima. Os heróis escrevem a crónica escolhendo resposta em vez de reação.',
    obj: 'Collective month: keep calm under the Storm',
    obj_pt: 'Mês coletivo: manter calma sob a Tempestade',
    boss: {
      id: 'storm_anxiety',
      name: 'Storm of Old Anxiety',
      name_pt: 'Tempestade da Velha Ansiedade',
      lore: 'Returns louder after quiet weeks.',
      lore_pt: 'Volta mais alta após semanas quietas.',
      points: 50,
      shape: 'mage',
    },
    vassals: [
      {
        id: 'specter_trigger',
        name: 'Trigger Specter',
        name_pt: 'Espectro do Gatilho',
        objective: 'Week 1: map your triggers',
        objective_pt: 'Semana 1: mapear gatilhos',
        lore: 'Appears from nowhere.',
        lore_pt: 'Aparece do nada.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'demon_compare',
        name: 'Compare Demon',
        name_pt: 'Demônio da Comparação',
        objective: 'Week 2: your pace only',
        objective_pt: 'Semana 2: só o teu ritmo',
        lore: 'Scores you against ghosts.',
        lore_pt: 'Pontua-te contra fantasmas.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'lich_shame',
        name: 'Lich of Shame',
        name_pt: 'Lich da Vergonha',
        objective: 'Week 3: self-talk rewrite',
        objective_pt: 'Semana 3: reescrever diálogo interno',
        lore: 'Freezes courage mid-step.',
        lore_pt: 'Congela coragem a meio do passo.',
        points: 30,
        shape: 'lich',
      },
      {
        id: 'golem_numb',
        name: 'Numb Golem',
        name_pt: 'Golem do Entorpecido',
        objective: 'Week 4: feel then act',
        objective_pt: 'Semana 4: sentir e depois agir',
        lore: 'Shuts the heart to stay safe.',
        lore_pt: 'Fecha o coração para ficar seguro.',
        points: 30,
        shape: 'golem',
      },
    ],
  },
  {
    title: 'Guildhall of Unfinished Quests',
    title_pt: 'Guilda das Missões Inacabadas',
    lore: 'Half-done projects litter the hall. The Archmage of Ignorance hired clerks of distraction. Finish what you start.',
    lore_pt: 'Projetos a meio enchem a sala. O Arquimago da Ignorância contratou escriturários da distração. Acaba o que comesças.',
    obj: 'Collective month: close open loops and reclaim the Guildhall',
    obj_pt: 'Mês coletivo: fechar loops e recuperar a Guilda',
    boss: {
      id: 'archmage_backlog',
      name: 'Archmage of Backlog',
      name_pt: 'Arquimago do Acervo',
      lore: 'Rules a kingdom of half-starts.',
      lore_pt: 'Governa um reino de meios-começos.',
      points: 50,
      shape: 'mage',
    },
    vassals: [
      {
        id: 'specter_tab',
        name: 'Tab Specter',
        name_pt: 'Espectro das Abas',
        objective: 'Week 1: close or finish tabs',
        objective_pt: 'Semana 1: fechar ou concluir abas',
        lore: 'Multiplies open loops.',
        lore_pt: 'Multiplica loops abertos.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'demon_scope',
        name: 'Scope Demon',
        name_pt: 'Demônio do Scope',
        objective: 'Week 2: shrink one goal',
        objective_pt: 'Semana 2: encolher um objetivo',
        lore: 'Inflates every task.',
        lore_pt: 'Infla cada tarefa.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'knight_meeting',
        name: 'Meeting Knight',
        name_pt: 'Cavaleiro das Reuniões',
        objective: 'Week 3: protect maker time',
        objective_pt: 'Semana 3: proteger tempo de fazer',
        lore: 'Charges calendars with noise.',
        lore_pt: 'Carrega calendários de ruído.',
        points: 30,
        shape: 'knight',
      },
      {
        id: 'golem_done',
        name: 'Almost-Done Golem',
        name_pt: 'Golem do Quase Pronto',
        objective: 'Week 4: ship the last 10%',
        objective_pt: 'Semana 4: entregar os últimos 10%',
        lore: 'Lives forever at 90%.',
        lore_pt: 'Vive eternamente nos 90%.',
        points: 30,
        shape: 'golem',
      },
    ],
  },
  {
    title: 'Siege of the Golden Ledger',
    title_pt: 'Cerco do Livro-Razão Dourado',
    lore: 'The Wyrm learned accounting. False urgency surrounds the ledger. Hold the line: plan, pay, protect.',
    lore_pt: 'O Wyrm aprendeu contabilidade. Urgência falsa cerca o livro-razão. Segura a linha: planear, pagar, proteger.',
    obj: 'Collective month: defend the Ledger and break the Siege',
    obj_pt: 'Mês coletivo: defender o Livro e partir o Cerco',
    boss: {
      id: 'siege_wyrm',
      name: 'Siege Wyrm of Gold',
      name_pt: 'Wyrm de Cerco do Ouro',
      lore: 'Starves kingdoms with interest.',
      lore_pt: 'Mata reinos de fome com juros.',
      points: 50,
      shape: 'dragon',
    },
    vassals: [
      {
        id: 'demon_fomo',
        name: 'FOMO Demon',
        name_pt: 'Demônio do FOMO',
        objective: 'Week 1: no panic buys',
        objective_pt: 'Semana 1: sem compras de pânico',
        lore: 'Sells fear as opportunity.',
        lore_pt: 'Vende medo como oportunidade.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'specter_leak',
        name: 'Leak Specter',
        name_pt: 'Espectro do Vazamento',
        objective: 'Week 2: plug money leaks',
        objective_pt: 'Semana 2: tapar fugas de dinheiro',
        lore: 'Small drips, big drought.',
        lore_pt: 'Pingos pequenos, seca grande.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'knight_status',
        name: 'Status Knight',
        name_pt: 'Cavaleiro do Status',
        objective: 'Week 3: buy need not flex',
        objective_pt: 'Semana 3: comprar necessidade, não flex',
        lore: 'Armors ego with receipts.',
        lore_pt: 'Arma o ego com recibos.',
        points: 30,
        shape: 'knight',
      },
      {
        id: 'lich_interest',
        name: 'Compound Lich',
        name_pt: 'Lich dos Juros Compostos',
        objective: 'Week 4: fund the future pile',
        objective_pt: 'Semana 4: reforçar o monte futuro',
        lore: 'Works against you — or for you.',
        lore_pt: 'Trabalha contra ti — ou a teu favor.',
        points: 30,
        shape: 'lich',
      },
    ],
  },
  {
    title: 'Feast of the Open Circle',
    title_pt: 'Banquete do Círculo Aberto',
    lore: 'The sealed tavern became a feast. Pride still lurks under the table. Invite, listen, belong — write the last chronicle of the year together.',
    lore_pt: 'A taverna selada virou banquete. O orgulho ainda espreita debaixo da mesa. Convida, ouve, pertence — escrevam juntos a última crónica do ano.',
    obj: 'Collective month: host the Circle and end the year as one party',
    obj_pt: 'Mês coletivo: acolher o Círculo e fechar o ano em grupo',
    boss: {
      id: 'circle_pride',
      name: 'Pride Beneath the Table',
      name_pt: 'Orgulho Debaixo da Mesa',
      lore: 'Smiles while dividing the feast.',
      lore_pt: 'Sorri enquanto divide o banquete.',
      points: 50,
      shape: 'knight',
    },
    vassals: [
      {
        id: 'specter_ghost',
        name: 'Ghosting Specter',
        name_pt: 'Espectro do Ghosting',
        objective: 'Week 1: answer with care',
        objective_pt: 'Semana 1: responder com cuidado',
        lore: 'Vanishes mid-conversation.',
        lore_pt: 'Desaparece a meio da conversa.',
        points: 30,
        shape: 'specter',
      },
      {
        id: 'demon_score',
        name: 'Scorekeeping Demon',
        name_pt: 'Demônio da Conta',
        objective: 'Week 2: give without tally',
        objective_pt: 'Semana 2: dar sem apontar',
        lore: 'Keeps a ledger of favors.',
        lore_pt: 'Mantém livro-razão de favores.',
        points: 30,
        shape: 'demon',
      },
      {
        id: 'golem_crowd',
        name: 'Crowd Golem',
        name_pt: 'Golem da Multidão',
        objective: 'Week 3: one deep talk',
        objective_pt: 'Semana 3: uma conversa profunda',
        lore: 'Prefers noise to intimacy.',
        lore_pt: 'Prefere barulho a intimidade.',
        points: 30,
        shape: 'golem',
      },
      {
        id: 'lich_farewell',
        name: 'Lich of Cold Farewell',
        name_pt: 'Lich do Adeus Frio',
        objective: 'Week 4: thank and close well',
        objective_pt: 'Semana 4: agradecer e fechar bem',
        lore: 'Ends bonds without warmth.',
        lore_pt: 'Termina laços sem calor.',
        points: 30,
        shape: 'lich',
      },
    ],
  },
]

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function shapePaths(shape, accent) {
  switch (shape) {
    case 'dragon':
      return `<path d="M18 48 Q28 22 40 28 Q52 22 62 48 Q52 58 40 52 Q28 58 18 48 Z M40 28 L38 14 L42 14 Z" fill="${accent}" stroke="#D4A945" stroke-width="1.5"/>
  <circle cx="34" cy="40" r="2" fill="#1a1410"/><circle cx="46" cy="40" r="2" fill="#1a1410"/>`
    case 'golem':
      return `<rect x="26" y="22" width="28" height="36" rx="4" fill="${accent}" stroke="#D4A945" stroke-width="1.5"/>
  <rect x="32" y="30" width="6" height="6" fill="#1a1410"/><rect x="42" y="30" width="6" height="6" fill="#1a1410"/>
  <rect x="34" y="42" width="12" height="4" fill="#1a1410"/>`
    case 'lich':
      return `<ellipse cx="40" cy="36" rx="16" ry="20" fill="${accent}" stroke="#D4A945" stroke-width="1.5"/>
  <path d="M28 30 Q40 38 52 30" fill="none" stroke="#1a1410" stroke-width="2"/>
  <circle cx="34" cy="34" r="2.5" fill="#e8e0d0"/><circle cx="46" cy="34" r="2.5" fill="#e8e0d0"/>
  <path d="M32 48 Q40 54 48 48" fill="none" stroke="#1a1410" stroke-width="1.5"/>`
    case 'knight':
      return `<path d="M40 16 L54 28 L54 52 L26 52 L26 28 Z" fill="${accent}" stroke="#D4A945" stroke-width="1.5"/>
  <rect x="34" y="34" width="12" height="8" fill="#1a1410"/>
  <path d="M30 22 L40 18 L50 22" fill="none" stroke="#D4A945" stroke-width="2"/>`
    case 'specter':
      return `<path d="M26 22 Q40 12 54 22 L56 50 Q48 44 40 52 Q32 44 24 50 Z" fill="${accent}" opacity="0.85" stroke="#D4A945" stroke-width="1.5"/>
  <circle cx="34" cy="32" r="3" fill="#1a1410"/><circle cx="46" cy="32" r="3" fill="#1a1410"/>`
    case 'demon':
      return `<path d="M24 50 L28 24 L40 30 L52 24 L56 50 Z" fill="${accent}" stroke="#D4A945" stroke-width="1.5"/>
  <path d="M28 24 L22 14 M52 24 L58 14" stroke="#D4A945" stroke-width="2"/>
  <circle cx="34" cy="36" r="2.5" fill="#ffcc00"/><circle cx="46" cy="36" r="2.5" fill="#ffcc00"/>`
    case 'mage':
      return `<path d="M40 14 L58 54 L22 54 Z" fill="${accent}" stroke="#D4A945" stroke-width="1.5"/>
  <circle cx="40" cy="38" r="6" fill="#1a1410" stroke="#D4A945"/>
  <path d="M40 14 L40 8" stroke="#D4A945" stroke-width="2"/>`
    default:
      return `<circle cx="40" cy="40" r="22" fill="${accent}" stroke="#D4A945" stroke-width="1.5"/>`
  }
}

function enemySvg({ label, accent, bg, shape, crown }) {
  const gem = crown
    ? `<path d="M28 18 L32 10 L40 14 L48 10 L52 18 Z" fill="#D4A945" stroke="#1a1410" stroke-width="1"/>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="${label}">
  <rect width="80" height="80" rx="8" fill="${bg}"/>
  <circle cx="40" cy="40" r="32" fill="${accent}" opacity="0.22"/>
  ${gem}
  ${shapePaths(shape, accent)}
</svg>
`
}

function campaignMd(n, theme, c) {
  const id = String(n).padStart(2, '0')
  const bossImg = `docs/assets/campaigns/${id}/boss.svg`
  const vassalYaml = c.vassals
    .map((v, i) => {
      const img = `docs/assets/campaigns/${id}/vassal-${String(i + 1).padStart(2, '0')}.svg`
      return `  - id: ${v.id}
    week_index: ${i + 1}
    name: "${esc(v.name)}"
    name_pt: "${esc(v.name_pt)}"
    image: "${img}"
    objective: "${esc(v.objective)}"
    objective_pt: "${esc(v.objective_pt)}"
    lore: "${esc(v.lore)}"
    lore_pt: "${esc(v.lore_pt)}"
    points: ${v.points}`
    })
    .join('\n')

  return `---
id: "${id}"
month_number: ${n}
theme: ${theme}
title: "${esc(c.title)}"
title_pt: "${esc(c.title_pt)}"
lore: "${esc(c.lore)}"
lore_pt: "${esc(c.lore_pt)}"
map: "docs/assets/backgrounds/${theme}.jpg"
month_objective: "${esc(c.obj)}"
month_objective_pt: "${esc(c.obj_pt)}"
boss:
  id: ${c.boss.id}
  name: "${esc(c.boss.name)}"
  name_pt: "${esc(c.boss.name_pt)}"
  image: "${bossImg}"
  lore: "${esc(c.boss.lore)}"
  lore_pt: "${esc(c.boss.lore_pt)}"
  points: ${c.boss.points}
vassals:
${vassalYaml}
---

# Campaign ${id} — ${c.title} / ${c.title_pt}

Monthly BOSS + weekly vassals (súditos). Edit via Admin → Campanha.
`
}

function main() {
  const configDir = join(root, '../../config/campaigns')
  mkdirSync(configDir, { recursive: true })

  CAMPAIGNS.forEach((c, idx) => {
    const n = idx + 1
    const id = String(n).padStart(2, '0')
    const theme = THEMES[idx]
    const [accent, , bg] = PALETTES[theme]
    const dir = join(root, id)
    mkdirSync(dir, { recursive: true })

    writeFileSync(
      join(dir, 'boss.svg'),
      enemySvg({
        label: c.boss.id,
        accent,
        bg,
        shape: c.boss.shape,
        crown: true,
      }),
    )
    c.vassals.forEach((v, i) => {
      writeFileSync(
        join(dir, `vassal-${String(i + 1).padStart(2, '0')}.svg`),
        enemySvg({
          label: v.id,
          accent,
          bg,
          shape: v.shape,
          crown: false,
        }),
      )
    })

    writeFileSync(join(configDir, `${id}.md`), campaignMd(n, theme, c))
    console.log(`campaign ${id} (${theme})`)
  })
}

main()
