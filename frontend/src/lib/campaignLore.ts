import type { Campaign } from './types'

export type LoreLocale = 'en' | 'pt'

type CitySeed = {
  /** Unique plot beats; placeholders only — never frozen boss/city names. */
  story: { en: string; pt: string }
  objective: { en: string; pt: string }
  boss: { en: string; pt: string }
  /** Per-week vassal blurbs (index 0 = week 1). */
  vassals: { en: string; pt: string }[]
}

/** Canonical next city on the pilgrimage (caravan hook). */
const NEXT_CITY: Record<string, { en: string; pt: string }> = {
  '01': { en: 'Luzília', pt: 'Luzília' },
  '02': { en: 'Verdéia', pt: 'Verdéia' },
  '03': { en: 'Copária', pt: 'Copária' },
  '04': { en: 'Rioporto', pt: 'Rioporto' },
  '05': { en: 'Solária', pt: 'Solária' },
  '06': { en: 'Cinzar', pt: 'Cinzar' },
  '07': { en: 'Forjália', pt: 'Forjália' },
  '08': { en: 'Dourália', pt: 'Dourália' },
  '09': { en: 'Sombrália', pt: 'Sombrália' },
  '10': { en: 'Pantanil', pt: 'Pantanil' },
  '11': { en: 'Nevália', pt: 'Nevália' },
  '12': { en: 'Termópolis', pt: 'Termópolis' },
}

/**
 * Story seeds keyed by campaign id (stable if ADM renames the city).
 * Placeholders: {{world}} {{city}} {{season}} {{boss}} {{vassal1}}…{{vassal4}} {{nextCity}}
 * PT variants: {{world_pt}} {{city_pt}} {{season_pt}} {{boss_pt}} {{vassal1_pt}}…
 * Source: docs/planning/lore-cidades-inimigos.md
 */
const CITY_SEEDS: Record<string, CitySeed> = {
  '01': {
    story: {
      en: `Welcome to {{world}}! Our family caravan reaches {{city}}, born in warm caves where steam rises like a sleepy dragon’s breath. The first people made steam baths and ice doors to keep out the wind. They say the first soup of {{world}} was cooked here!

It is {{season}}. Outside, cold bites noses and snow squeaks. Inside smells like wood smoke and soup. Ice walls glow soft blue.

City values: welcome the cold, care for your body, share warmth.

Month challenge: {{boss}} woke when the big door had no watch — and froze it shut! No one can fetch food. On the road we train with {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}.

Each day we stretch, sleep well, and finish chores. Daily missions make heroes stronger. Together we open the door — then on to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! A caravana da família chega a {{city_pt}}, nascida em cavernas quentes onde o vapor sobe como sopro de dragão dorminhoco. Os primeiros habitantes fizeram banhos de vapor e portas de gelo contra o vento. Dizem que a primeira sopa de {{world_pt}} foi cozinhada aqui!

É tempo de {{season_pt}}. Lá fora o frio morde o nariz e a neve range. Lá dentro cheira a lenha e sopa. As paredes de gelo brilham azul clarinho.

Valores da cidade: acolher quem tem frio, cuidar do corpo, partilhar calor.

Desafio do mês: {{boss_pt}} acordou quando a porta grande ficou sem vigia — e gelou-a! Ninguém sai buscar comida. No caminho treinamos com {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

Cada dia alongamos, dormimos bem e acabamos as tarefas. As missões do dia tornam-nos heróis mais fortes. Juntos abrimos a porta — e seguimos para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Keep {{city}}’s warm caves safe and break {{boss}}’s ice door`,
      pt: `Proteger as cavernas quentes de {{city_pt}} e abrir a porta de gelo de {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} is an ancient ice giant who woke when the door had no watch. He froze the city gate — no one can fetch food. Strong bodies and brave habits melt the ice!`,
      pt: `{{boss_pt}} é um gigante de gelo antigo que acordou quando a porta ficou sem vigia. Gelou o portão da cidade — ninguém sai buscar comida. Corpos fortes e hábitos corajosos derretem o gelo!`,
    },
    vassals: [
      {
        en: `{{vassal1}} was born from the fear of “no snacks.” Makes the pantry look empty and starts dinner fights — share fairly and finish dinner chores.`,
        pt: `{{vassal1_pt}} nasceu do medo de «não há lanche». Faz a despensa parecer vazia e discute o jantar — partilhamos com justiça e acabamos as tarefas da mesa.`,
      },
      {
        en: `{{vassal2}} was sent by Sköll’s pack to test the door. Scares the night watch and cracks the ice — keep watch with a friend.`,
        pt: `{{vassal2_pt}} foi enviado pela matilha de Sköll para testar a porta. Assusta a vigia e abre fendas no gelo — fazemos vigia com um amigo.`,
      },
      {
        en: `{{vassal3}} is an old warrior stuck in a cold tunnel. Closes paths and freezes corridors — take the way back, one brave step at a time.`,
        pt: `{{vassal3_pt}} é um guerreiro antigo preso num túnel frio. Fecha caminhos e gela corredores — reconquistamos o caminho, um passo corajoso de cada vez.`,
      },
      {
        en: `{{vassal4}} came from a nameless fear on the night wind. Fills heads with scary thoughts until no one sleeps — name one fear and hold a little light together.`,
        pt: `{{vassal4_pt}} veio de um medo sem nome no vento da noite. Enche a cabeça de sustos até ninguém dormir — dizemos um medo e seguramos juntos uma luzinha.`,
      },
    ],
  },
  '02': {
    story: {
      en: `Welcome to {{world}}! We reach {{city}}, the lantern city at the edge of the winter map. Pilgrims built a temple of light to keep a glow until New Year. Every lantern tells a calm-brave story.

{{season}} wraps the streets in cold glitter. Breath makes tiny clouds. At night the temple paints northern lights on the sky.

City values: hope, calm minds, guard the light together.

Challenge: {{boss}} grew hungry for light and moon — and wants to swallow {{city}}’s last glow! First we train with {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}.

Daily missions make us braver. Guard the light, beat {{boss}}, follow the bells to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Chegamos a {{city_pt}}, a cidade-lampião no fim do mapa de inverno. Peregrinos construíram um templo de luz para guardar um brilho até ao Ano Novo. Cada lampião conta uma história de coragem calma.

{{season_pt}} cobre as ruas com brilho frio. O bafo faz nuvens pequeninas. À noite o templo pinta luzes do norte no céu.

Valores da cidade: esperança, mente calma, guardar a luz juntos.

Desafio: {{boss_pt}} cresceu com fome de luz e de luar — e quer engolir a última luz de {{city_pt}}! Primeiro treinamos com {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

As missões do dia dão-nos coragem. Guardamos a luz, vencemos {{boss_pt}} — e seguimos os sinos até {{nextCity_pt}}!`,
    },
    objective: {
      en: `Guard {{city}}’s light treasure from {{boss}} until New Year`,
      pt: `Guardar o tesouro de luz de {{city_pt}} contra {{boss_pt}} até ao Ano Novo`,
    },
    boss: {
      en: `{{boss}} is a magic wolf who grew hungry for light and moon. Wants to swallow {{city}}’s last glow. Calm minds keep the light alive!`,
      pt: `{{boss_pt}} é um lobo mágico que cresceu com fome de luz e de luar. Quer engolir a última luz de {{city_pt}}. Mentes calmas mantêm o brilho vivo!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is a shadow that steals the first morning ray. Puts lamps out too soon — protect the lanterns each night.`,
        pt: `{{vassal1_pt}} é uma sombra que rouba o primeiro raio da manhã. Apaga lampiões cedo demais — protegemos as lâmpadas todas as noites.`,
      },
      {
        en: `{{vassal2}} was born from “can we do it?” whispered many nights. Makes people doubt even simple plans — name your fear before sleep.`,
        pt: `{{vassal2_pt}} nasceu de um «será que conseguimos?» repetido muitas noites. Faz duvidar até do plano simples — dizemos o nosso medo antes de dormir.`,
      },
      {
        en: `{{vassal3}} sniffed out the temple treasure. Tries to gnaw the relic until it fades — keep watch together.`,
        pt: `{{vassal3_pt}} farejou o tesouro do templo. Tenta roer a relíquia até perder o brilho — fazemos vigia juntos.`,
      },
      {
        en: `{{vassal4}} is a quiet runner from Sköll’s pack. Spreads fear street to street — hold one gate until morning.`,
        pt: `{{vassal4_pt}} é um corredor silencioso da matilha de Sköll. Espalha medo de rua em rua — seguramos um portão até de manhã.`,
      },
    ],
  },
  '03': {
    story: {
      en: `Welcome to {{world}}! Spring brings us to {{city}}, a wooden town with living thorn walls. It was born when miners and gardeners made peace: the mine gives stone, the garden gives food, the thorns guard both.

In {{season}}, snow goes ploc-ploc off roofs. Soft mud sticks to boots. Green shoots poke up everywhere. Thorn walls hum like a friendly buzz.

City values: teamwork, grow with care, open paths together.

Challenge: {{boss}} woke in the wet mines after a long winter sleep — and grabs the thorn walls so the city cannot breathe! Road practice with {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}.

Daily missions make the team strong. Drive {{boss}} back and ride to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! A primavera traz-nos a {{city_pt}}, uma cidade de madeira com muros de espinhos vivos. Nasceu quando mineiros e jardineiros fizeram as pazes: a mina dá pedra, o jardim dá comida, os espinhos guardam os dois.

Em {{season_pt}}, a neve faz ploc-ploc nos telhados. A lama mole pega nas botas. Brotozinhos verdes aparecem em todo o lado. Os muros de espinhos fazem zumzum amigo.

Valores da cidade: trabalho em equipa, crescer com cuidado, abrir caminhos juntos.

Desafio: {{boss_pt}} acordou nas minas molhadas depois do longo sono de inverno — e agarra os muros de espinhos para a cidade não respirar! Treinamos com {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

As missões do dia fortalecem a equipa. Empurramos {{boss_pt}} para trás e seguimos para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Clear {{city}}’s flooded mines and send {{boss}} packing`,
      pt: `Limpar as minas inundadas de {{city_pt}} e mandar {{boss_pt}} embora`,
    },
    boss: {
      en: `{{boss}} woke in the wet mines after a long winter sleep. Grabs the thorn walls so the city cannot breathe. Teamwork wins!`,
      pt: `{{boss_pt}} acordou nas minas molhadas depois do longo sono de inverno. Agarra os muros de espinhos e impede a cidade de respirar. Trabalho em equipa vence!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is meltwater with nowhere to go. Floods tunnels and spoils tools — drain one gallery today.`,
        pt: `{{vassal1_pt}} é água do degelo sem sítio para ir. Inunda túneis e estraga ferramentas — drenamos uma galeria hoje.`,
      },
      {
        en: `{{vassal2}} is a stubborn troll who hates closed gates. Tears the living walls — fix them as a team.`,
        pt: `{{vassal2_pt}} é um troll teimoso que odeia portões fechados. Rompe a proteção viva — consertamos em equipa.`,
      },
      {
        en: `{{vassal3}} escaped from a forgotten seed bag in the mine. Spreads itchy dust that slows work — contain it with careful chores.`,
        pt: `{{vassal3_pt}} saiu de um saco de sementes esquecido na mina. Espalha pó que faz tossir e atrasa o trabalho — controlamos com tarefas feitas com cuidado.`,
      },
      {
        en: `{{vassal4}} is the chief’s cub, still learning mischief. Hides pickaxes and makes noise in the galleries — seal the deepest shaft.`,
        pt: `{{vassal4_pt}} é filho do chefe, ainda a aprender estragos. Esconde picaretas e faz barulho nas galerias — fechamos o poço mais fundo.`,
      },
    ],
  },
  '04': {
    story: {
      en: `Welcome to {{world}}! High above sits {{city}}, a tree-town of rope bridges and nests. Families built it to see the world from above and keep the pantry safe from mud.

{{season}} makes the jungle grow overnight. Leaves drip warm rain. Air smells like wet wood and sweet fruit. Bridges sway — wheee!

City values: plan before you climb, stay curious, care for the pantry.

Challenge: {{boss}} made a den under the roots and waits for careless climbers — then cuts the bridges! Canopy trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}.

Daily missions keep climbers safe. When {{boss}} falls, we swing toward {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Bem no alto fica {{city_pt}}, uma cidade nas árvores com pontes de corda e ninhos. Famílias construíram-na para ver o mundo de cima e guardar a despensa longe da lama.

{{season_pt}} faz a selva crescer de um dia para o outro. As folhas pingam chuva morna. O ar cheira a madeira molhada e a fruta doce. As pontes balançam — uuuuí!

Valores da cidade: planear antes de subir, curiosidade, cuidar da despensa.

Desafio: {{boss_pt}} fez covil sob as raízes e espera quem sobe sem plano — depois corta as pontes! Provas nas copas: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

As missões do dia mantêm os escaladores seguros. Quando {{boss_pt}} cair, balançamos rumo a {{nextCity_pt}}!`,
    },
    objective: {
      en: `Protect {{city}}’s tree stores and beat {{boss}} at the roots`,
      pt: `Proteger a despensa nas árvores de {{city_pt}} e vencer {{boss_pt}} nas raízes`,
    },
    boss: {
      en: `{{boss}} made a den under {{city}}’s roots. Waits for careless climbers and cuts bridges. Plan first — then climb!`,
      pt: `{{boss_pt}} fez covil sob as raízes de {{city_pt}}. Espera quem sobe sem plano e corta as pontes. Planeamos primeiro — depois subimos!`,
    },
    vassals: [
      {
        en: `{{vassal1}} grew from rotten leaves left uncleared. Makes air heavy and bridges slippery — seal and sort the stores.`,
        pt: `{{vassal1_pt}} nasceu de folhas podres sem limpeza. Deixa o ar pesado e as pontes escorregadias — fechamos e ordenamos a despensa.`,
      },
      {
        en: `{{vassal2}} is the animals’ fear when they hear false howls. Sends the herd running and panic into the nests — calm one pen with patience.`,
        pt: `{{vassal2_pt}} é o medo dos animais quando ouvem uivos falsos. Põe o rebanho a correr e espalha pânico nos ninhos — acalmamos um curral com paciência.`,
      },
      {
        en: `{{vassal3}} is an angry vine that grew to hate the city. Squeezes trunks and twists rope stairs — check every knot before dusk.`,
        pt: `{{vassal3_pt}} é uma vinha magoa que cresceu com raiva da cidade. Aperta troncos e torce as escadas de corda — verificamos cada nó antes do anoitecer.`,
      },
      {
        en: `{{vassal4}} is the alpha’s cub, training to leap between branches. Scares food-carriers on the bridge — map a safe way down.`,
        pt: `{{vassal4_pt}} é cria da alfa, a treinar saltos entre ramos. Assusta quem carrega comida na ponte — marcamos uma descida segura.`,
      },
    ],
  },
  '05': {
    story: {
      en: `Welcome to {{world}}! Splash — we sail into {{city}}, the harbor gate. Ships creak, gulls argue. It was born where the river meets the melt-sea: trade, fresh fish, and letters from far away.

In {{season}}, meltwater fills the docks. Boots go squelch-squelch. Little fish-lights blink under the pier like stars in the water!

City values: courage, open the way, help those who arrive by boat.

Challenge: {{boss}} woke with the strong spring current and seals the harbor gate with waves and whirlpools! Deep-road helpers: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}.

Daily missions make us steady. Master the gate, beat {{boss}}, sail to sunny {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Chape — entramos em {{city_pt}}, o portão do porto. Navios rangem, gaivotas discutem. Nasceu onde o rio encontra o mar do degelo: troca, peixe fresco e cartas de longe.

Em {{season_pt}}, a água do degelo enche os cais. As botas fazem chape-chape. Peixinhos-luzes piscam debaixo do cais — como estrelas na água!

Valores da cidade: coragem, abrir caminhos, ajudar quem chega de barco.

Desafio: {{boss_pt}} acordou com a corrente forte da primavera e fecha o portão com ondas e redemoinhos! Ajudantes do caminho: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}.

As missões do dia deixam-nos firmes. Dominamos o portão, vencemos {{boss_pt}} e navegamos para o sol de {{nextCity_pt}}!`,
    },
    objective: {
      en: `Reopen {{city}}’s flooded gate and defeat {{boss}}`,
      pt: `Reabrir o portão inundado de {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} is a giant fish woken by the strong spring current. Seals the harbor gate with waves and whirlpools. Courage keeps the road open!`,
      pt: `{{boss_pt}} é um peixe-gigante acordado pela corrente forte da primavera. Fecha o portão do porto com ondas e redemoinhos. A coragem mantém a estrada aberta!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is angry tide-foam. Pulls ropes and soaks important maps — practice calm hands on deck.`,
        pt: `{{vassal1_pt}} é espuma zangada das marés. Puxa cordas e molha mapas importantes — treinamos mãos calmas no convés.`,
      },
      {
        en: `{{vassal2}} is living rock that likes the sound of cracking wood. Damages hulls and delays trips — bail and stack as a crew.`,
        pt: `{{vassal2_pt}} é rocha viva que gosta do som de madeira a rachar. Danifica cascos e atrasa viagens — esvaziamos e empilhamos como tripulação.`,
      },
      {
        en: `{{vassal3}} is water risen too high without warning. Covers docks and hides the safe path — keep the map and the habit.`,
        pt: `{{vassal3_pt}} é água alta demais sem aviso. Cobre as docas e esconde o caminho seguro — guardamos o mapa e o bom hábito.`,
      },
      {
        en: `{{vassal4}} once sang true songs, then swapped them for false alarms. Tricks sailors onto the wrong course — clear one safe passage.`,
        pt: `{{vassal4_pt}} trocou canções boas por alarmes falsos. Engana marinheiros e manda barcos para o sítio errado — abrimos uma passagem segura.`,
      },
    ],
  },
  '06': {
    story: {
      en: `Welcome to {{world}}! Sunshine leads us to {{city}}, city of the blessed spring. Markets in the shade, sparkling fountains. Thirsty travelers found sweet water in the heat and promised to care for it forever.

It is {{season}}. Hot light sits on your shoulders. Stone warms bare feet. Shade is a gift. Spring water tastes cool even on the hottest day.

City values: discipline, train a little each day, share water.

Challenge: {{boss}} drills Fire Giants on the hills above — and plans a hot march on the spring! Road sparks: {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}.

Daily missions cool the fear. Defeat {{boss}}, bless the spring, climb toward smoky {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! O sol leva-nos a {{city_pt}}, a cidade da nascente abençoada. Mercados à sombra, fontes brilhantes. Viajantes sedentos acharam água doce no calor e prometeram cuidar dela para sempre.

É {{season_pt}}. A luz quente senta-se nos ombros. As pedras aquecem os pés. A sombra é um presente. A água da nascente sabe fresca mesmo no dia mais quente.

Valores da cidade: disciplina, treinar um pouco cada dia, partilhar água.

Desafio: {{boss_pt}} treina Gigantes de Fogo nas colinas acima — e prepara uma marcha quente contra a nascente! Faíscas no caminho: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

As missões do dia arrefecem o medo. Derrotamos {{boss_pt}}, abençoamos a nascente e subimos rumo à fumosa {{nextCity_pt}}!`,
    },
    objective: {
      en: `Defend {{city}}’s blessed spring and defeat {{boss}}`,
      pt: `Defender a nascente abençoada de {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} is a general who drills Fire Giants on the hills above {{city}}. Plans a hot march on the spring. Daily training cools the march!`,
      pt: `{{boss_pt}} é um general que treina Gigantes de Fogo nas colinas acima de {{city_pt}}. Prepara uma marcha quente contra a nascente. O treino de cada dia arrefece a marcha!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is a too-dry wind with no cloud. Tries to dry the sacred water — share water fairly.`,
        pt: `{{vassal1_pt}} é vento seco demais, sem nuvem. Tenta secar a água sagrada — partilhamos a água com justiça.`,
      },
      {
        en: `{{vassal2}} is a spark that jumped from a brazier and grew a will. Overheats the temple — practice safe camp habits.`,
        pt: `{{vassal2_pt}} é uma faísca que saltou dum braseiro e ganhou vontade. Aquece demais o templo — treinamos hábitos seguros.`,
      },
      {
        en: `{{vassal3}} is an illusion made of hot air. Shows false paths and hides the true spring — track the heat without panic.`,
        pt: `{{vassal3_pt}} é uma ilusão do ar quente. Mostra caminhos falsos e esconde a fonte verdadeira — seguimos o calor sem pânico.`,
      },
      {
        en: `{{vassal4}} is a giant’s messenger, fast as smoke. Spreads attack orders across the plain — answer with quiet training.`,
        pt: `{{vassal4_pt}} é mensageiro dos gigantes, rápido como fumo. Espalha ordens de ataque pela planície — respondemos com treino quieto.`,
      },
    ],
  },
  '07': {
    story: {
      en: `Welcome to {{world}}! Ash falls like soft grey snow over {{city}}. Lanterns wear little hoods. The town was born by old forges: people learned to sweep together, laugh at the dust, and light lamps even in smoke.

In {{season}}, the air tastes of forge smoke. Warm wind pushes grit into socks. Sparks become tiny lantern-bugs that help you see.

City values: breathe calm, clean together, brave without rush.

Challenge: {{boss}} nested in forgotten chimneys and fills the streets with smoke and fear! Ash trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}.

Daily missions clear the road. Banish {{boss}}, breathe easy, haul the caravan to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Cai cinza macia sobre {{city_pt}}, como neve cinzenta. As lanternas usam capuzinhos. A cidade nasceu junto às forjas antigas: o povo aprendeu a varrer juntos, rir do pó e acender luz mesmo com fumo.

Em {{season_pt}}, o ar sabe a fumo de forja. O vento quente mete areia nas meias. Faíscas viram bichinhos-lanterna que ajudam a ver.

Valores da cidade: respirar com calma, limpar juntos, coragem sem pressa.

Desafio: {{boss_pt}} fez ninho nas chaminés esquecidas e enche as ruas de fumo e medo! Provas de cinza: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}.

As missões do dia abrem a estrada. Expulsamos {{boss_pt}}, respiramos melhor e puxamos a caravana para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Clear {{city}}’s ashy streets and defeat {{boss}}`,
      pt: `Limpar as ruas de cinza em {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} nested in forgotten chimneys. Fills the streets with smoke and fear. Steady breath beats smoke-fear!`,
      pt: `{{boss_pt}} fez ninho nas chaminés esquecidas. Enche as ruas de fumo e medo. Respiração firme vence o medo do fumo!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is an ash cloud that will not settle. Covers eyes and hides doors — sweep one path clear.`,
        pt: `{{vassal1_pt}} é uma nuvem de cinza que não quer baixar. Tapa os olhos e esconde as portas — varremos um caminho limpo.`,
      },
      {
        en: `{{vassal2}} is a thief who hides steps in ash. Steals cargo and delays caravans — find and share tools fairly.`,
        pt: `{{vassal2_pt}} é um ladrão que esconde os passos na cinza. Rouba cargas e atrasa caravanas — encontramos e partilhamos com justiça.`,
      },
      {
        en: `{{vassal3}} is a stubborn ember that flees hearths. Threatens dry roofs and stores — drink water and finish one chore.`,
        pt: `{{vassal3_pt}} é uma brasa teimosa que foge das lareiras. Ameaça telhados secos e depósitos — bebemos água e acabamos uma tarefa.`,
      },
      {
        en: `{{vassal4}} is the matriarch’s small spitfire cub. Spits hot ash on hero boots — clear a chimney vent with a buddy.`,
        pt: `{{vassal4_pt}} é cria pequena e espirrada da matriarca. Cospe cinza quente nas botas — limpamos uma chaminé com um amigo.`,
      },
    ],
  },
  '08': {
    story: {
      en: `Welcome to {{world}}! We climb into {{city}}, hot mountains and shiny ore, pickaxes ringing like bells. A smiths’ and miners’ city, born from a pact: honest guards, strong work, true orders.

It is {{season}}. Heat hugs your face. Mine crystals glow like orange candy in the dark.

City values: truth, honor in training, work well done.

Challenge: {{boss}} learned to copy voices and give false orders — guards argue and the mine stops! Road trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}.

Daily missions make minds clear. End the tricks, steady the mine, leave for the gold fields of {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Subimos até {{city_pt}}, montanhas quentes e minério brilhante, picaretas a tocar como sinos. Cidade de ferreiros e mineiros, nascida do pacto: guarda honesta, trabalho forte, ordens verdadeiras.

É {{season_pt}}. O calor abraça a cara. Cristais da mina brilham como rebuçados laranja no escuro.

Valores da cidade: verdade, honra no treino, trabalho bem feito.

Desafio: {{boss_pt}} aprendeu a copiar vozes e dar ordens falsas — a guarda discute e a mina pára! Provas do caminho: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

As missões do dia deixam a cabeça clara. Acabamos com os truques, firmamos a mina e partimos para os campos de ouro de {{nextCity_pt}}!`,
    },
    objective: {
      en: `End {{boss}}’s false orders and restore {{city}}’s mine guard`,
      pt: `Acabar com as ordens falsas de {{boss_pt}} e restaurar a guarda da mina em {{city_pt}}`,
    },
    boss: {
      en: `{{boss}} learned to copy voices and give false orders. Fills minds with wrong commands until the mine stops. Truth and training win!`,
      pt: `{{boss_pt}} aprendeu a copiar vozes e dar ordens falsas. Enche as cabeças de comandos errados até a mina parar. A verdade e o treino vencem!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is {{boss}}’s zeal shield. Copies the captain’s voice in empty halls — ground the mind with training.`,
        pt: `{{vassal1_pt}} é o escudo zelote de {{boss_pt}}. Copia a voz do capitão nos corredores vazios — ancoramos a mente com treino.`,
      },
      {
        en: `{{vassal2}} turns royal whims into hexes. Turns friends against friends with hard rumors — check the real plan together.`,
        pt: `{{vassal2_pt}} transforma caprichos reais em maldições. Põe amigos contra amigos com rumores duros — confirmamos juntos o plano verdadeiro.`,
      },
      {
        en: `{{vassal3}} polishes the crown on dissenters. Overheats the dig and tires the crew — drink water and rest with honor.`,
        pt: `{{vassal3_pt}} polia a coroa em dissidentes. Aquece demais a escavação e cansa a equipa — bebemos água e descansamos com honra.`,
      },
      {
        en: `{{vassal4}} spreads ore-greed fever. Share tools and finish the shift.`,
        pt: `{{vassal4_pt}} espalha a febre da ganância do minério — partilhamos ferramentas e acabamos o turno.`,
      },
    ],
  },
  '09': {
    story: {
      en: `Welcome to {{world}}! Autumn gold covers {{city}}, orchards and harvest bells. It was born when families promised never to keep the feast for themselves alone: autumn’s gold is for everyone’s table.

It is {{season}} — the leaf season! Cool wind flips scarves. Crunchy leaves smell sweet and dusty. Apples glow for a second when you catch them.

City values: share, give thanks, keep the harvest fair.

Challenge: {{boss}} wanted the harvest only for her lonely dark — and hides the feast! Leaf-road trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}.

Daily missions fill the table. Beat {{boss}}, keep the feast warm, walk on to misty {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! O ouro do outono cobre {{city_pt}}, pomares e sinos de colheita. Nasceu quando famílias prometeram nunca guardar a festa só para si: o ouro do outono é para a mesa de todos.

É {{season_pt}} — a estação das folhas! O vento fresco vira os cachecóis. As folhas estalam e cheiram a doce e a pó. As maçãs brilham um segundo quando as apanhas.

Valores da cidade: partilhar, agradecer, guardar a colheita com justiça.

Desafio: {{boss_pt}} quis a colheita só para a escuridão dela — e esconde o banquete! Provas da estrada das folhas: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}.

As missões do dia enchem a mesa. Vencemos {{boss_pt}}, mantemos o banquete quente e seguimos para a enevoada {{nextCity_pt}}!`,
    },
    objective: {
      en: `Protect {{city}}’s harvest feast from {{boss}}`,
      pt: `Proteger o banquete da colheita de {{city_pt}} contra {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} wanted the harvest only for her lonely dark. Hides the feast and leaves the city hungry for celebration. Sharing wins!`,
      pt: `{{boss_pt}} quis a colheita só para a escuridão dela. Esconde o banquete e deixa a cidade com fome de festa. Partilhar vence!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is a bad stain on a forgotten field. Spoils ears of grain and scares farmers — find and share the apples.`,
        pt: `{{vassal1_pt}} é uma mancha má no campo esquecido. Estraga espigas e assusta agricultores — encontramos e partilhamos as maçãs.`,
      },
      {
        en: `{{vassal2}} is an abandoned scarecrow that grew a mean will. Drives helpers from the fields — rewrite the feast list as a team.`,
        pt: `{{vassal2_pt}} é um espantalho abandonado que ganhou má vontade. Afasta ajudantes dos campos — reescrevemos a lista do banquete em equipa.`,
      },
      {
        en: `{{vassal3}} is a long shadow of autumn nights. Cuts the joy of harvest and leaves people sad — return one kindness today.`,
        pt: `{{vassal3_pt}} é uma sombra longa das noites de outono. Corta a alegria da colheita e deixa as pessoas tristes — devolvemos uma bondade hoje.`,
      },
      {
        en: `{{vassal4}} is a tiny tear between our world and the deep cold. Lets icy wind into the orchard and snuffs lanterns — keep calm and finish chores.`,
        pt: `{{vassal4_pt}} é um buraco pequenino entre o nosso mundo e o frio profundo. Deixa passar vento gelado no pomar e apaga lanternas — ficamos calmos e acabamos as tarefas.`,
      },
    ],
  },
  '10': {
    story: {
      en: `Welcome to {{world}}! Fog wraps {{city}} like a soft grey blanket. Lanterns make gold coins of light on wet stones. The city was born to guide lost travelers: call softly, and the kind mist answers with the true path.

{{season}} brings cool mist and quiet streets. Footsteps sound far away. Grey cats follow lanterns.

City values: calm plans, trust, find the way together.

Challenge: {{boss}} hates clear roads and hides paths in false fog around the city! Mist trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}.

Daily missions sharpen our ears. Unmask {{boss}}, clear the fog road, march to boggy {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! O nevoeiro envolve {{city_pt}} como um cobertor cinzento e macio. As lanternas fazem moedas de luz nas pedras molhadas. A cidade nasceu para guiar viajantes perdidos: quem chama baixinho, a névoa boa responde com o caminho certo.

{{season_pt}} traz névoa fresca e ruas quietas. Os passos soam longe. Gatos cinzentos seguem as lanternas.

Valores da cidade: planos calmos, confiança, achar o caminho juntos.

Desafio: {{boss_pt}} odeia estradas claras e esconde caminhos em névoa falsa à volta da cidade! Provas da névoa: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}.

As missões do dia afiam os ouvidos. Desmascaramos {{boss_pt}}, limpamos a estrada de névoa e marchamos para a pantanosa {{nextCity_pt}}!`,
    },
    objective: {
      en: `Find {{city}}’s true path and defeat {{boss}}’s false fog`,
      pt: `Encontrar o caminho verdadeiro de {{city_pt}} e derrotar a névoa falsa de {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} is a shadow lord who hates clear roads. Hides paths in false fog around {{city}}. Calm plans win!`,
      pt: `{{boss_pt}} é um senhor das sombras que odeia estradas claras. Esconde caminhos em névoa falsa em volta de {{city_pt}}. Planos calmos vencem!`,
    },
    vassals: [
      {
        en: `{{vassal1}} was sent to find holes in the wall. Marks the wrong doors for heroes — check the map twice.`,
        pt: `{{vassal1_pt}} foi enviado para achar buracos na muralha. Marca portas erradas para os heróis — vemos o mapa duas vezes.`,
      },
      {
        en: `{{vassal2}} fights only where light cannot reach. Cuts lanterns and leaves dark stretches — keep one bright for the team.`,
        pt: `{{vassal2_pt}} luta só onde a luz não chega. Corta lanternas e deixa trechos escuros — mantemos uma bem acesa para a equipa.`,
      },
      {
        en: `{{vassal3}} listens in the tunnels under the city. Steals plans and moves map arrows — answer with a true brave word.`,
        pt: `{{vassal3_pt}} ouve nos túneis debaixo da cidade. Rouba planos e muda setas dos mapas — respondemos com uma palavra corajosa e verdadeira.`,
      },
      {
        en: `{{vassal4}} is the warlord’s sister, fast and silent. Ambushes those who walk alone in the mist — mark chalk arrows together.`,
        pt: `{{vassal4_pt}} é a irmã do senhor da guerra, rápida e silenciosa. Embosca quem anda sozinho na névoa — marcamos setas de giz juntos.`,
      },
    ],
  },
  '11': {
    story: {
      en: `Welcome to {{world}}! We step into {{city}}, a bog town of wooden walkways, whispering reeds, and moon-puddles. Families learned to step light: care for the ground so the ground cares for them.

{{season}} makes the air cool and thick. Boots sink a little — squish! Tiny blue lights dance, then kindly lead you back to the path.

City values: light steps, care for home, equip together.

Challenge: {{boss}} stirs deep mud under the town, shakes the walkways, and scares those who live on stilts! Reed-road trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}.

Daily missions keep feet brave. Sink {{boss}}’s plans, cross the mire, aim for icy {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Entramos em {{city_pt}}, uma cidade do pântano com passadiços de madeira, caniços a sussurrar e poças de lua. Famílias aprenderam a pisar leve: cuidar do chão para o chão cuidar delas.

{{season_pt}} deixa o ar fresco e espesso. As botas afundam um bocadinho — chape! Luzinhas azuis dançam e, com educação, voltam a pôr-nos no caminho.

Valores da cidade: passos leves, cuidar da casa, equipar juntos.

Desafio: {{boss_pt}} remexe a lama funda sob a cidade, abala os passadiços e assusta quem vive em palafitas! Provas dos caniços: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}.

As missões do dia dão coragem aos pés. Afundamos os planos de {{boss_pt}}, cruzamos o lodo e apontamos para a gelada {{nextCity_pt}}!`,
    },
    objective: {
      en: `Keep {{city}}’s walkways safe and defeat {{boss}}`,
      pt: `Manter seguros os passadiços de {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} is a great mother-serpent who stirs deep mud under {{city}}. Shakes walkways and scares stilt-homes. Light steps and teamwork win!`,
      pt: `{{boss_pt}} é uma grande mãe-serpente que remexe a lama funda sob {{city_pt}}. Abala os passadiços e assusta quem vive em palafitas. Passos leves e trabalho em equipa vencem!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is a pup that digs tunnels without asking. Makes holes under the planks — test and repair one bridge.`,
        pt: `{{vassal1_pt}} é um filhote que cava túneis sem pedir licença. Faz buracos debaixo das tábuas — testamos e consertamos uma ponte.`,
      },
      {
        en: `{{vassal2}} is the brute force of mud when the nest moves. Snaps stilts and leaves houses swaying — return dry boots before night.`,
        pt: `{{vassal2_pt}} é a força bruta da lama quando o ninho se mexe. Parte postes e deixa casas a balançar — devolvemos as botas secas antes da noite.`,
      },
      {
        en: `{{vassal3}} is sticky bog mist with an appetite. Tires heroes and steals energy on the path — keep a bright chant together.`,
        pt: `{{vassal3_pt}} é névoa pegajosa do pântano com fome. Cansa os heróis e rouba energia no caminho — mantemos juntos um canto bem acordado.`,
      },
      {
        en: `{{vassal4}} is the broodmother’s cub, still learning to be big. Coils ropes and hides tools in the mud — map a safe crossing.`,
        pt: `{{vassal4_pt}} é cria da mãe-ninho, ainda a aprender a ser grande. Enrola cordas e esconde ferramentas na lama — marcamos uma travessia segura.`,
      },
    ],
  },
  '12': {
    story: {
      en: `Welcome to {{world}}! We reach {{city}}, magic ice and black stone — the closing gate of the year. Here families hold the turn feast: sing, share hot cocoa, and promise to begin the cycle again.

Endless {{season}} paints blue torch-shadows on the walls. Fingers tingle. Ice-rune magic draws little star maps on the windows at night.

City values: friendship, keep the circle, celebrate together.

Challenge: {{boss}} is an old king who would not let the year end — and freezes the feast halls with dead winter! Frost trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}.

Friendship beats fear. Daily missions warm every seat. Shatter {{boss}}, sing the turn, and when the cycle renews we aim again for {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Chegamos a {{city_pt}}, gelo mágico e pedra negra — o portão final do ano. Aqui as famílias fazem o grande banquete de virada: cantam, partilham chocolate quente e prometem recomeçar o ciclo.

{{season_pt}} sem fim pinta sombras azuis de tocha nas paredes. Os dedos formigam. A magia das runas de gelo desenha mapinhas de estrelas nas janelas à noite.

Valores da cidade: amizade, manter o círculo, celebrar juntos.

Desafio: {{boss_pt}} é um rei antigo que não quis deixar o ano acabar — e congela os salões de festa com inverno morto! Provas de geada: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

A amizade vence o medo. As missões do dia aquecem cada lugar à mesa. Derrotamos {{boss_pt}}, cantamos a virada — e quando o ciclo renovar, apontamos de novo para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Hold {{city}} and defeat {{boss}}’s frozen warhost`,
      pt: `Defender {{city_pt}} e derrotar o exército congelado de {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} is an old king who would not let the year end. Freezes feast halls and brings dead winter to the table. Friendship thaws the ice!`,
      pt: `{{boss_pt}} é um rei antigo que não quis deixar o ano acabar. Congela os salões de festa e traz inverno morto à mesa. A amizade derrete o gelo!`,
    },
    vassals: [
      {
        en: `{{vassal1}} is a soldier who shook too many hands with frost in his heart. Leaves black frost on greetings — warm the feast halls together.`,
        pt: `{{vassal1_pt}} é um soldado que apertou mãos demais com geada no coração. Deixa geada negra nos cumprimentos — aquecemos juntos os salões de festa.`,
      },
      {
        en: `{{vassal2}} marched inside a storm until he became part of it. Attacks the black-stone gate with wind and snow — hold the gate.`,
        pt: `{{vassal2_pt}} marchou dentro duma tempestade até virar parte dela. Ataca o portão de pedra negra com vento e neve — seguramos o portão.`,
      },
      {
        en: `{{vassal3}} is a spirit trapped in the battlements. Climbs ice like stairs and weakens the walls — reinforce the battlements.`,
        pt: `{{vassal3_pt}} é um espírito preso nas ameias. Sobe o gelo como escadas e enfraquece as defesas — reforçamos as ameias.`,
      },
      {
        en: `{{vassal4}} is a messenger who only knows how to cry “it’s over.” Breaks the circle’s joy — keep the circle unbroken.`,
        pt: `{{vassal4_pt}} é um mensageiro que só sabe anunciar «acabou, acabou». Quebra a alegria do círculo — mantemos o círculo intacto.`,
      },
    ],
  },
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '')
}

function varsFromCampaign(c: Campaign): Record<string, string> {
  const id = (c.id || '01').padStart(2, '0')
  const next = NEXT_CITY[id] || { en: 'the next city', pt: 'a próxima cidade' }
  const vassals = [...(c.vassals || [])].sort((a, b) => a.week_index - b.week_index)
  const v = (i: number, pt = false) => {
    const row = vassals[i]
    if (!row) return pt ? 'um súdito da estrada' : 'a road trial'
    return pt ? row.name_pt || row.name : row.name
  }
  return {
    world: c.world || 'Solstice',
    world_pt: c.world_pt || c.world || 'Solstícia',
    city: c.city || 'the city',
    city_pt: c.city_pt || c.city || 'a cidade',
    season: c.season_name || c.season || 'the season',
    season_pt: c.season_name_pt || c.season_name || c.season || 'a estação',
    boss: c.boss?.name || 'the Month BOSS',
    boss_pt: c.boss?.name_pt || c.boss?.name || 'o grande inimigo do mês',
    vassal1: v(0),
    vassal1_pt: v(0, true),
    vassal2: v(1),
    vassal2_pt: v(1, true),
    vassal3: v(2),
    vassal3_pt: v(2, true),
    vassal4: v(3),
    vassal4_pt: v(3, true),
    nextCity: next.en,
    nextCity_pt: next.pt,
  }
}

export type GeneratedLore = {
  lore: string
  lore_pt: string
  month_objective: string
  month_objective_pt: string
  bossLore: string
  bossLore_pt: string
  vassalLores: { lore: string; lore_pt: string }[]
}

/** Generate bilingual campaign/boss/vassal prose from current structured names. */
export function generateCampaignLore(c: Campaign): GeneratedLore {
  const id = (c.id || '01').padStart(2, '0')
  const seed = CITY_SEEDS[id] || CITY_SEEDS['01']
  const vars = varsFromCampaign({ ...c, id })

  const vassalLores = (c.vassals || [])
    .slice()
    .sort((a, b) => a.week_index - b.week_index)
    .map((_, i) => {
      const row = seed.vassals[i] || {
        en: `{{vassal${i + 1}}} is a trial on the road to {{boss}}.`,
        pt: `{{vassal${i + 1}_pt}} é uma prova no caminho até {{boss_pt}}.`,
      }
      return {
        lore: fill(row.en, vars),
        lore_pt: fill(row.pt, vars),
      }
    })

  return {
    lore: fill(seed.story.en, vars),
    lore_pt: fill(seed.story.pt, vars),
    month_objective: fill(seed.objective.en, vars),
    month_objective_pt: fill(seed.objective.pt, vars),
    bossLore: fill(seed.boss.en, vars),
    bossLore_pt: fill(seed.boss.pt, vars),
    vassalLores,
  }
}

/** Overwrite derived lore fields from templates (when lore_custom is false). */
export function applyGeneratedLore(c: Campaign): Campaign {
  const gen = generateCampaignLore(c)
  const sorted = [...(c.vassals || [])].sort((a, b) => a.week_index - b.week_index)
  const vassals = sorted.map((v, i) => ({
    ...v,
    lore: gen.vassalLores[i]?.lore ?? v.lore,
    lore_pt: gen.vassalLores[i]?.lore_pt ?? v.lore_pt,
  }))
  return {
    ...c,
    lore_custom: false,
    lore: gen.lore,
    lore_pt: gen.lore_pt,
    month_objective: gen.month_objective,
    month_objective_pt: gen.month_objective_pt,
    boss: {
      ...c.boss,
      lore: gen.bossLore,
      lore_pt: gen.bossLore_pt,
    },
    vassals,
  }
}

export function hasCitySeed(campaignId: string): boolean {
  return Boolean(CITY_SEEDS[(campaignId || '').padStart(2, '0')])
}
