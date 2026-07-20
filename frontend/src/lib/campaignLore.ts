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
 */
const CITY_SEEDS: Record<string, CitySeed> = {
  '01': {
    story: {
      en: `Welcome to {{world}} — a magic land of four wild seasons! Our family caravan reaches {{city}}, a cave town with warm steam baths.

It is {{season}}. Outside, cold bites noses and snow squeaks under boots. Inside, soup and wood smoke smell like home. Cave magic makes the ice walls glow soft blue, like night-lights. Friendly snow hares hop near the doors. Sometimes a shy frost fox peeks out — ui, what a surprise! — then runs off with a fluffy tail.

Month challenge: {{boss}} froze the big ice door shut. Families cannot go fetch food! On the road we train with {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}.

Each day we stretch, sleep well, and finish chores. Daily missions make heroes stronger. Together we can open the door — then on to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}} — terra mágica das quatro estações loucas! A caravana da família chega a {{city_pt}}, uma cidade de cavernas com banhos de vapor quentinhos.

É tempo de {{season_pt}}. Lá fora o frio morde o nariz e a neve range debaixo das botas. Lá dentro cheira a sopa e a lenha. A magia das cavernas faz o gelo brilhar azul clarinho, como uma luz de noite. Lebres da neve saltitam junto às portas. Às vezes um raposinho de geada espreita — ui, que susto! — e foge com a cauda fofa.

Desafio do mês: {{boss_pt}} gelou a grande porta de gelo e ninguém sai buscar comida! No caminho treinamos com {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}.

Cada dia alongamos, dormimos bem e acabamos as tarefas. As missões do dia tornam-nos heróis mais fortes. Juntos abrimos a porta — e seguimos para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Keep {{city}}’s warm caves safe and break {{boss}}’s ice door`,
      pt: `Proteger as cavernas quentes de {{city_pt}} e abrir a porta de gelo de {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} guards the frozen door of {{city}}. Strong bodies and brave habits melt the ice!`,
      pt: `{{boss_pt}} guarda a porta congelada de {{city_pt}}. Corpos fortes e hábitos corajosos derretem o gelo!`,
    },
    vassals: [
      {
        en: `{{vassal1}} says the food stores are empty — share snacks fairly and finish dinner chores.`,
        pt: `{{vassal1_pt}} diz que a despensa está vazia — partilhamos o lanche com justiça e acabamos as tarefas do jantar.`,
      },
      {
        en: `{{vassal2}} tests the ice door; keep night watch with a friend.`,
        pt: `{{vassal2_pt}} testa a porta de gelo — fazemos a vigia da noite com um amigo.`,
      },
      {
        en: `{{vassal3}} hides in a cold tunnel — take it back, one brave step at a time.`,
        pt: `{{vassal3_pt}} esconde-se num túnel frio — reconquistamos o caminho, um passo corajoso de cada vez.`,
      },
      {
        en: `{{vassal4}} likes the dark; name one fear and hold a little light together.`,
        pt: `{{vassal4_pt}} gosta do escuro — dizemos um medo em voz alta e seguramos juntos uma luzinha.`,
      },
    ],
  },
  '02': {
    story: {
      en: `Welcome to {{world}}! We reach {{city}}, the lantern city at the edge of the map. A bright temple waits for brave pilgrims.

{{season}} wraps the streets in cold glitter. Cheeks turn pink. Breath makes tiny clouds. Temple magic paints northern lights on the sky like quiet fireworks. Soft arctic owls sit on the walls. Cheeky ravens steal shiny buttons — then drop them if you laugh!

Challenge: {{boss}} leads a hungry pack that wants the last light treasure. Without that light, New Year feels too dark. Ui!

First we train with {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}. We tell the truth about fear, guard one small flame, and show up every day. Daily missions make us braver. Guard the light, beat {{boss}}, follow the bells to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Chegamos a {{city_pt}}, a cidade-lampião no fim do mapa. Um templo brilhante espera peregrinos corajosos.

{{season_pt}} cobre as ruas com brilho frio. As faces ficam rosadas. O bafo faz nuvens pequeninas. A magia do templo pinta luzes do norte no céu, como fogos de artifício quietos. Corujas do ártico pousam nos muros. Corvos espertos roubam botões brilhantes — e largam-nos se rirmos!

Desafio: {{boss_pt}} guia uma matilha faminta que quer o tesouro da última luz. Sem essa luz, o Ano Novo parece demasiado escuro. Ui!

Primeiro treinamos com {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}. Dizemos a verdade sobre o medo, cuidamos de uma chama pequenina e aparecemos todos os dias. As missões do dia dão-nos coragem. Guardamos a luz, vencemos {{boss_pt}} — e seguimos os sinos até {{nextCity_pt}}!`,
    },
    objective: {
      en: `Guard {{city}}’s light treasure from {{boss}} until New Year`,
      pt: `Guardar o tesouro de luz de {{city_pt}} contra {{boss_pt}} até ao Ano Novo`,
    },
    boss: {
      en: `{{boss}} wants to swallow {{city}}’s last light. Calm minds keep the glow alive!`,
      pt: `{{boss_pt}} quer engolir a última luz de {{city_pt}}. Mentes calmas mantêm o brilho vivo!`,
    },
    vassals: [
      {
        en: `{{vassal1}} steals temple glow — protect the lamps each night.`,
        pt: `{{vassal1_pt}} rouba o brilho do templo — protegemos as lâmpadas todas as noites.`,
      },
      {
        en: `{{vassal2}} howls doubt; name your fear before sleep.`,
        pt: `{{vassal2_pt}} uiva dúvidas — dizemos o nosso medo antes de dormir.`,
      },
      {
        en: `{{vassal3}} gnaws at the treasure ropes — keep watch together.`,
        pt: `{{vassal3_pt}} rói as cordas do tesouro — fazemos vigia juntos.`,
      },
      {
        en: `{{vassal4}} races the walls; hold one gate until morning.`,
        pt: `{{vassal4_pt}} corre pelos muros — seguramos um portão até de manhã.`,
      },
    ],
  },
  '03': {
    story: {
      en: `Welcome to {{world}}! Spring brings us to {{city}}, a wooden town with living thorn walls and busy mine doors.

In {{season}}, snow goes ploc-ploc off the roofs. Soft mud sticks to boots. Green shoots poke up everywhere. Thorn-wall magic hums when you touch it gently — like a friendly buzz. Otters splash in melt streams. A cheeky badger steals carrots from the porch!

Challenge: meltwater floods the mines, and plants grow too fast. {{boss}} wants the tunnels and the walls for himself. A bit spooky… then we get brave!

Road practice with {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}. Clear a tunnel, fix a wall, finish a chore. Daily missions make the team strong. We can do this — drive {{boss}} back and ride to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! A primavera traz-nos a {{city_pt}}, uma cidade de madeira com muros de espinhos vivos e portas de mina bem ocupadas.

Em {{season_pt}}, a neve faz ploc-ploc nos telhados. A lama mole pega nas botas. Brotozinhos verdes aparecem em todo o lado. A magia dos muros de espinhos faz zumzum quando tocamos com jeito — como um abraço eléctrico simpático. Lontras brincam nos riachos do degelo. Um texugo esperto rouba cenouras no alpendre!

Desafio: a água enche as minas e as plantas crescem depressa demais. {{boss_pt}} quer os túneis e os muros só para ele. Um bocadinho assustador… e depois fazemos de coragem!

Treinamos na estrada com {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}. Limpar um túnel, consertar um muro, acabar a tarefa. As missões do dia fortalecem a equipa. Nós conseguimos — empurramos {{boss_pt}} para trás e seguimos para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Clear {{city}}’s flooded mines and send {{boss}} packing`,
      pt: `Limpar as minas inundadas de {{city_pt}} e mandar {{boss_pt}} embora`,
    },
    boss: {
      en: `{{boss}} woke in the wet mines of {{city}} and grabs the thorn walls. Teamwork wins!`,
      pt: `{{boss_pt}} acordou nas minas molhadas de {{city_pt}} e agarra os muros de espinhos. Trabalho em equipa vence!`,
    },
    vassals: [
      {
        en: `{{vassal1}} pushes meltwater into every tunnel — drain one gallery today.`,
        pt: `{{vassal1_pt}} empurra a água do degelo para todos os túneis — drenamos uma galeria hoje.`,
      },
      {
        en: `{{vassal2}} tears holes in living walls; fix them as a team.`,
        pt: `{{vassal2_pt}} rasga buracos nos muros vivos — consertamos em equipa.`,
      },
      {
        en: `{{vassal3}} spreads itchy bloom — contain it with careful chores.`,
        pt: `{{vassal3_pt}} espalha flores que coçam — controlamos isto com tarefas feitas com cuidado.`,
      },
      {
        en: `{{vassal4}} hides in deep dark water; seal the deepest shaft.`,
        pt: `{{vassal4_pt}} esconde-se na água escura e funda — fechamos o poço mais fundo.`,
      },
    ],
  },
  '04': {
    story: {
      en: `Welcome to {{world}}! High above the ground sits {{city}}, a tree-town of rope bridges, nests, and parrot chatter.

{{season}} makes the jungle grow overnight. Leaves drip warm rain. Air smells like wet wood and sweet fruit. Bridges sway — wheee! Singing-tree magic answers if you hum a little tune. Parrots copy your jokes. A shy tree-sloth waves hello. Once a spore-moth flutters by — soft and dusty, not mean.

Challenge: yellow spores scare the animals, and stores must be counted twice. At the roots waits {{boss}}!

Canopy trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}. Share tools, finish the list, practice the climb. Daily missions keep climbers safe. When {{boss}} falls, we swing toward {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Bem no alto fica {{city_pt}}, uma cidade nas árvores com pontes de corda, ninhos e papagaios a tagarelar.

{{season_pt}} faz a selva crescer de um dia para o outro. As folhas pingam chuva morna. O ar cheira a madeira molhada e a fruta doce. As pontes balançam — uuuuí! A magia das árvores cantoras responde se cantarmos baixinho. Os papagaios copiam as nossas piadas. Uma preguiça tímida acena. Uma vez passa uma traça de esporos — macia e poeirenta, sem maldade.

Desafio: esporos amarelos assustam os animais, e a despensa pede conta duas vezes. Nas raízes espera {{boss_pt}}!

Provas nas copas: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}. Partilhamos ferramentas, acabamos a lista, treinamos a subida. As missões do dia mantêm os escaladores seguros. Quando {{boss_pt}} cair, balançamos rumo a {{nextCity_pt}}!`,
    },
    objective: {
      en: `Protect {{city}}’s tree stores and beat {{boss}} at the roots`,
      pt: `Proteger a despensa nas árvores de {{city_pt}} e vencer {{boss_pt}} nas raízes`,
    },
    boss: {
      en: `{{boss}} waits under {{city}}’s roots for careless climbers. Plan first — then climb!`,
      pt: `{{boss_pt}} espera nas raízes de {{city_pt}} por quem sobe sem plano. Planeamos primeiro — depois subimos!`,
    },
    vassals: [
      {
        en: `{{vassal1}} spoils grain with spores — seal and sort the stores.`,
        pt: `{{vassal1_pt}} estraga o grão com esporos — fechamos e ordenamos a despensa.`,
      },
      {
        en: `{{vassal2}} shakes bridge ropes; check every knot before dusk.`,
        pt: `{{vassal2_pt}} abana as cordas das pontes — verificamos cada nó antes do anoitecer.`,
      },
      {
        en: `{{vassal3}} makes the herd wild — calm one pen with patience.`,
        pt: `{{vassal3_pt}} deixa o rebanho selvagem — acalmamos um curral com paciência.`,
      },
      {
        en: `{{vassal4}} hunts under the lowest branch; map a safe way down.`,
        pt: `{{vassal4_pt}} caça sob o ramo mais baixo — marcamos uma descida segura.`,
      },
    ],
  },
  '05': {
    story: {
      en: `Welcome to {{world}}! Splash — we sail into {{city}}, the harbor gate where ships creak and gulls argue all day.

In {{season}}, meltwater fills the docks. Boots go squelch-squelch. Cold spray kisses faces. Harbor magic makes little fish lights blink under the pier — like stars in the water! Seals clap for fish scraps. A curious dolphin follows the boats. One mist-crab pinches a rope — funny, not scary for long.

Challenge: wild currents scare pilgrims, and the big gate sticks half-open. {{boss}} rides those currents like a noisy wave-king.

Deep-road helpers: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}. Swim drills, tidy kits, help a neighbor, breathe slow. Daily missions make us steady. Master the gate, beat {{boss}}, sail to sunny {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Chape — entramos em {{city_pt}}, o portão do porto onde os navios rangem e as gaivotas discutem o dia inteiro.

Em {{season_pt}}, a água do degelo enche os cais. As botas fazem chape-chape. O salpico frio beija a cara. A magia do porto faz peixinhos-luzes piscar debaixo do cais — como estrelas na água! Focas batem palmas por restos de peixe. Um golfinho curioso segue os barcos. Um caranguejo da névoa belisca uma corda — engraçado, e o susto passa depressa.

Desafio: correntes loucas assustam os peregrinos, e o grande portão fica meio aberto. {{boss_pt}} cavalga essas correntes como um rei barulhento das ondas.

Ajudantes do caminho: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}. Treinos de natação, saco arrumado, ajudar o vizinho, respirar devagar. As missões do dia deixam-nos firmes. Dominamos o portão, vencemos {{boss_pt}} e navegamos para o sol de {{nextCity_pt}}!`,
    },
    objective: {
      en: `Reopen {{city}}’s flooded gate and defeat {{boss}}`,
      pt: `Reabrir o portão inundado de {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} rules the melt currents at {{city}}’s gate. Courage keeps the harbor road open!`,
      pt: `{{boss_pt}} manda nas correntes do degelo no portão de {{city_pt}}. A coragem mantém a estrada do porto aberta!`,
    },
    vassals: [
      {
        en: `{{vassal1}} tangles the boat ropes — practice calm hands on deck.`,
        pt: `{{vassal1_pt}} embaraça as cordas do barco — treinamos mãos calmas no convés.`,
      },
      {
        en: `{{vassal2}} floods a warehouse — bail and stack as a crew.`,
        pt: `{{vassal2_pt}} alaga um armazém — esvaziamos e empilhamos como uma boa tripulação.`,
      },
      {
        en: `{{vassal3}} sings sailors off course; keep the map and the habit.`,
        pt: `{{vassal3_pt}} canta e tira os marinheiros do rumo — guardamos o mapa e o bom hábito.`,
      },
      {
        en: `{{vassal4}} blocks the deep channel; clear one safe passage.`,
        pt: `{{vassal4_pt}} bloqueia o canal fundo — abrimos uma passagem segura.`,
      },
    ],
  },
  '06': {
    story: {
      en: `Welcome to {{world}}! Sunshine leads us to {{city}}, city of the blessed spring where fountains sparkle and markets smell like adventure.

It is {{season}}. Hot light sits on your shoulders. Stone streets warm bare feet. Shade feels like a gift. Spring magic makes the water taste sweet and cool even on the hottest day. Lizards sunbathe on walls. Golden bees hum lullabies. A heat-mirage cat seems to walk twice — ui! — then it is only one cat again.

Challenge: Fire Giants march on the ridge, and {{boss}} drills them like a summer army. They want the spring!

Road sparks: {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}. Drink water, rest with honor, finish today’s quest before play. Daily missions cool the fear. Defeat {{boss}}, bless the spring, climb toward smoky {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! O sol leva-nos a {{city_pt}}, a cidade da nascente abençoada, onde as fontes brilham e o mercado cheira a aventura.

É {{season_pt}}. A luz quente senta-se nos ombros. As pedras aquecem os pés. A sombra é um presente. A magia da nascente faz a água saber doce e fresca mesmo no dia mais quente. Lagartos tomam sol nos muros. Abelhas douradas cantam baixo. Um gato de miragem parece andar a dobrar — ui! — e depois é só um gato outra vez.

Desafio: Gigantes de Fogo marcham na crista, e {{boss_pt}} treina-os como um exército de verão. Querem a nascente!

Faíscas no caminho: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}. Bebemos água, descansamos com honra, acabamos a missão do dia antes da brincadeira. As missões do dia arrefecem o medo. Derrotamos {{boss_pt}}, abençoamos a nascente e subimos rumo à fumosa {{nextCity_pt}}!`,
    },
    objective: {
      en: `Defend {{city}}’s blessed spring and defeat {{boss}}`,
      pt: `Defender a nascente abençoada de {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} drills Fire Giants above {{city}}. Daily training cools the march!`,
      pt: `{{boss_pt}} treina Gigantes de Fogo acima de {{city_pt}}. O treino de cada dia arrefece a marcha!`,
    },
    vassals: [
      {
        en: `{{vassal1}} scouts the ridge — track the heat without panic.`,
        pt: `{{vassal1_pt}} explora a crista — seguimos o calor sem pânico.`,
      },
      {
        en: `{{vassal2}} sparks dry grass; practice safe camp habits.`,
        pt: `{{vassal2_pt}} ateia a erva seca — treinamos hábitos seguros de acampamento.`,
      },
      {
        en: `{{vassal3}} steals shade by the spring — share water fairly.`,
        pt: `{{vassal3_pt}} rouba a sombra junto à nascente — partilhamos a água com justiça.`,
      },
      {
        en: `{{vassal4}} boasts before battle; answer with quiet training.`,
        pt: `{{vassal4_pt}} gaba-se antes da luta — respondemos com treino quieto.`,
      },
    ],
  },
  '07': {
    story: {
      en: `Welcome to {{world}}! Ash falls like soft grey snow over {{city}}. Lanterns wear little hoods. Streets feel dusty and a bit scary — then we laugh and sweep together.

In {{season}}, the air tastes of forge smoke. Warm wind pushes grit into socks. Chimney magic turns some sparks into tiny floating lantern-bugs that help you see. Soot sparrows nest in rafters. A clever forge-dog brings your glove back. Once a smoke-weasel sneaks past — ui! — and is gone.

Challenge: {{boss}} coils through the chimneys and dares families to quit their chores.

Ash trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}. Courage can be a broom, a glass of water, a promise kept. Daily missions clear the road. Banish {{boss}}, breathe easy, haul the caravan to {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Cai cinza macia sobre {{city_pt}}, como neve cinzenta. As lanternas usam capuzinhos. As ruas estão poeirentas e um pouco assustadoras — e depois rimos e varremos juntos.

Em {{season_pt}}, o ar sabe a fumo de forja. O vento quente mete areia nas meias. A magia das chaminés transforma algumas faíscas em bichinhos-lanterna que ajudam a ver. Pardais de fuligem fazem ninho nas traves. Um cão da forja esperto traz a tua luva. Uma vez passa uma doninha de fumo — ui! — e desaparece.

Desafio: {{boss_pt}} enrosca-se nas chaminés e desafia as famílias a largar as tarefas.

Provas de cinza: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}. Coragem pode ser uma vassoura, um copo de água, uma promessa cumprida. As missões do dia abrem a estrada. Expulsamos {{boss_pt}}, respiramos melhor e puxamos a caravana para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Clear {{city}}’s ashy streets and defeat {{boss}}`,
      pt: `Limpar as ruas de cinza em {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} coils in {{city}}’s chimneys. Steady breath beats smoke-fear!`,
      pt: `{{boss_pt}} enrosca-se nas chaminés de {{city_pt}}. Respiração firme vence o medo do fumo!`,
    },
    vassals: [
      {
        en: `{{vassal1}} clogs doorways with ash — sweep one path clear.`,
        pt: `{{vassal1_pt}} entope as portas com cinza — varremos um caminho limpo.`,
      },
      {
        en: `{{vassal2}} hides tools in soot; find and share them fairly.`,
        pt: `{{vassal2_pt}} esconde ferramentas na fuligem — encontramos e partilhamos com justiça.`,
      },
      {
        en: `{{vassal3}} coughs smoke stories; drink water and finish one chore.`,
        pt: `{{vassal3_pt}} conta histórias de fumo — bebemos água e acabamos uma tarefa.`,
      },
      {
        en: `{{vassal4}} blocks a chimney vent; clear it with a buddy.`,
        pt: `{{vassal4_pt}} tapa uma chaminé — limpamos com um amigo.`,
      },
    ],
  },
  '08': {
    story: {
      en: `Welcome to {{world}}! We climb into {{city}}, where hot mountains hide shiny ore and pickaxes ring like bells.

It is {{season}}. Heat hugs your face. Sweat tickles your neck. Rock smells warm and dusty. Mine magic makes some crystals glow like orange candy in the dark. Mountain goats leap on high paths. Clever cave bats squeak maps if you listen. A heat-spirit lizard flickers on the wall — ui, what a trick! — then it is only stone again.

Challenge: {{boss}} is king of false orders. Guards start arguing: “Who said that?” Truth gets mixed up!

Road trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, and {{vassal4}}. Train, drink water, check the plan with a friend. Daily missions make minds clear. End the spirit tricks, steady the mine, leave for the gold fields of {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Subimos até {{city_pt}}, onde montanhas quentes escondem minério brilhante e as picaretas tocam como sinos.

É {{season_pt}}. O calor abraça a cara. O suor faz comichão no pescoço. A pedra cheira a pó quente. A magia da mina faz alguns cristais brilhar como rebuçados laranja no escuro. Cabras da montanha saltam nos caminhos altos. Morcegos espertos da gruta guincham mapas se escutarmos. Um lagarto-espírito do calor pisca na parede — ui, que truque! — e depois é só pedra outra vez.

Desafio: {{boss_pt}} é o rei das ordens falsas. Os guardas discutem: «Quem foi que disse isso?» A verdade fica toda misturada!

Provas do caminho: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}. Treinamos, bebemos água, confirmamos o plano com um amigo. As missões do dia deixam a cabeça clara. Acabamos com os truques dos espíritos, firmamos a mina e partimos para os campos de ouro de {{nextCity_pt}}!`,
    },
    objective: {
      en: `End {{boss}}’s heat-spirit tricks and restore {{city}}’s mine guard`,
      pt: `Acabar com os truques dos espíritos de {{boss_pt}} e restaurar a guarda da mina em {{city_pt}}`,
    },
    boss: {
      en: `{{boss}} fills minds with false orders in {{city}}. Truth and training win!`,
      pt: `{{boss_pt}} enche as cabeças com ordens falsas em {{city_pt}}. A verdade e o treino vencem!`,
    },
    vassals: [
      {
        en: `{{vassal1}} copies a captain’s voice in empty halls — ground the mind with training.`,
        pt: `{{vassal1_pt}} copia a voz do capitão nos corredores vazios — ancoramos a mente com treino.`,
      },
      {
        en: `{{vassal2}} turns friends against friends; check the real plan together.`,
        pt: `{{vassal2_pt}} põe amigos contra amigos — confirmamos juntos o plano verdadeiro.`,
      },
      {
        en: `{{vassal3}} overheats the dig; drink water and rest with honor.`,
        pt: `{{vassal3_pt}} aquece demais a escavação — bebemos água e descansamos com honra.`,
      },
      {
        en: `{{vassal4}} spreads ore fever greed; share tools and finish the shift.`,
        pt: `{{vassal4_pt}} espalha a febre da ganância do minério — partilhamos ferramentas e acabamos o turno.`,
      },
    ],
  },
  '09': {
    story: {
      en: `Welcome to {{world}}! Autumn gold covers {{city}}, where leaf piles hide treasure maps and harvest bells ring soft.

It is {{season}} — the leaf season! Cool wind flips scarves. Crunchy leaves smell sweet and dusty. Orchard magic makes fallen apples glow for a second when you catch them. Red squirrels race along fences. Fat hedgehogs roll through leaf piles. A shadow-deer steps out at dusk — ui! — then bows and vanishes kindly.

Challenge: {{boss}} wants the harvest feast for the lonely dark. No sharing allowed? Not on our watch!

Leaf-road trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}. Gather, share, finish chores before play. Daily missions fill the table. Beat {{boss}}, keep the feast warm, walk on to misty {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! O ouro do outono cobre {{city_pt}}, onde montes de folhas escondem mapas do tesouro e os sinos da colheita tocam baixinho.

É {{season_pt}} — a estação das folhas! O vento fresco vira os cachecóis. As folhas estalam e cheiram a doce e a pó. A magia do pomar faz as maçãs cair com um brilho de um segundo quando as apanhamos. Esquilos vermelhos correm nas vedações. Ouriços gordos rolam nos montes de folhas. Um veado-sombra aparece ao entardecer — ui! — faz uma vénia e some com bondade.

Desafio: {{boss_pt}} quer o banquete da colheita para a escuridão sozinha. Sem partilha? Nem pensar!

Provas da estrada das folhas: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}. Apanhamos, partilhamos, acabamos as tarefas antes da brincadeira. As missões do dia enchem a mesa. Vencemos {{boss_pt}}, mantemos o banquete quente e seguimos para a enevoada {{nextCity_pt}}!`,
    },
    objective: {
      en: `Protect {{city}}’s harvest feast from {{boss}}`,
      pt: `Proteger o banquete da colheita de {{city_pt}} contra {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} hoards {{city}}’s harvest in the lonely dark. Sharing wins!`,
      pt: `{{boss_pt}} guarda a colheita de {{city_pt}} na escuridão sozinha. Partilhar vence!`,
    },
    vassals: [
      {
        en: `{{vassal1}} hides apples in leaf piles — find and share them.`,
        pt: `{{vassal1_pt}} esconde maçãs nos montes de folhas — encontramos e partilhamos.`,
      },
      {
        en: `{{vassal2}} scatters the feast list; rewrite it as a team.`,
        pt: `{{vassal2_pt}} espalha a lista do banquete — reescrevemos em equipa.`,
      },
      {
        en: `{{vassal3}} steals warm cloaks; return one kindness today.`,
        pt: `{{vassal3_pt}} rouba capas quentes — devolvemos uma bondade hoje.`,
      },
      {
        en: `{{vassal4}} howls at the harvest bell; keep calm and finish chores.`,
        pt: `{{vassal4_pt}} uiva ao sino da colheita — ficamos calmos e acabamos as tarefas.`,
      },
    ],
  },
  '10': {
    story: {
      en: `Welcome to {{world}}! Fog wraps {{city}} like a soft grey blanket. Lanterns make gold coins of light on the wet stones.

{{season}} brings cool mist and quiet streets. Cheeks feel damp. Footsteps sound far away. Whisper-mist magic repeats your name if you call softly — friendly, not creepy if you stay together. Grey cats follow lanterns. Marsh frogs sing off-key. A fog-hound sniffs your boot — ui! — then wags and guides you home.

Challenge: {{boss}} hides true paths inside false fog. Heroes who rush get lost. Heroes who plan… find the door!

Mist trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}. Hold hands in the dark jokes, finish one careful chore. Daily missions sharpen our ears. Unmask {{boss}}, clear the fog road, march to boggy {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! O nevoeiro envolve {{city_pt}} como um cobertor cinzento e macio. As lanternas fazem moedas de luz dourada nas pedras molhadas.

{{season_pt}} traz névoa fresca e ruas quietas. As faces ficam húmidas. Os passos soam longe. A magia da névoa-sussurro repete o nosso nome se chamarmos baixinho — amiga, não assustadora, se formos juntos. Gatos cinzentos seguem as lanternas. Rãs do pântano cantam desafinadas. Um cão-névoa cheira a bota — ui! — abana a cauda e guia-nos a casa.

Desafio: {{boss_pt}} esconde os caminhos verdadeiros dentro de névoa falsa. Quem corre perde-se. Quem planeia… encontra a porta!

Provas da névoa: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}. Damos as mãos nas piadas do escuro, acabamos uma tarefa com cuidado. As missões do dia afiam os ouvidos. Desmascaramos {{boss_pt}}, limpamos a estrada de névoa e marchamos para a pantanosa {{nextCity_pt}}!`,
    },
    objective: {
      en: `Find {{city}}’s true path and defeat {{boss}}’s false fog`,
      pt: `Encontrar o caminho verdadeiro de {{city_pt}} e derrotar a névoa falsa de {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} hides roads in false fog around {{city}}. Calm plans win!`,
      pt: `{{boss_pt}} esconde estradas na névoa falsa em volta de {{city_pt}}. Planos calmos vencem!`,
    },
    vassals: [
      {
        en: `{{vassal1}} swaps street signs in the mist — check the map twice.`,
        pt: `{{vassal1_pt}} troca placas na névoa — vemos o mapa duas vezes.`,
      },
      {
        en: `{{vassal2}} muffles the lanterns; keep one bright for the team.`,
        pt: `{{vassal2_pt}} abafa as lanternas — mantemos uma bem acesa para a equipa.`,
      },
      {
        en: `{{vassal3}} echoes scary jokes; answer with a true brave word.`,
        pt: `{{vassal3_pt}} ecoa piadas assustadoras — respondemos com uma palavra corajosa e verdadeira.`,
      },
      {
        en: `{{vassal4}} loops the same alley; mark chalk arrows together.`,
        pt: `{{vassal4_pt}} faz a mesma viela em círculo — marcamos setas de giz juntos.`,
      },
    ],
  },
  '11': {
    story: {
      en: `Welcome to {{world}}! We step into {{city}}, a bog town of wooden walkways, reed whispers, and moon-puddles.

{{season}} makes the air cool and thick. Boots sink a little — squish! Mist smells like wet leaves. Bog magic lights tiny blue will-o-wisps that dance, then politely lead you back to the path. Water birds boom funny songs. Otters slide on mud. A bog-sprite frog wears a leaf hat — cute until it steals your sock. Ui!

Challenge: {{boss}} stirs the deep mud and tries to swallow the walkways. Stay light. Stay together!

Reed-road trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}. Test each plank, share dry socks, finish bog chores. Daily missions keep feet brave. Sink {{boss}}’s plans, cross the mire, aim for icy {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Entramos em {{city_pt}}, uma cidade do pântano com passadiços de madeira, caniços a sussurrar e poças de lua.

{{season_pt}} deixa o ar fresco e espesso. As botas afundam um bocadinho — chape! A névoa cheira a folhas molhadas. A magia do pântano acende luzinhas azuis que dançam e depois, com educação, levam-nos de volta ao caminho. Aves nadeiras cantam canções engraçadas. Lontras escorregam na lama. Uma rã-duende usa chapéu de folha — fofa… até roubar a tua meia. Ui!

Desafio: {{boss_pt}} remexe a lama funda e quer engolir os passadiços. Vamos leves. Vamos juntos!

Provas dos caniços: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}}, {{vassal4_pt}}. Testamos cada tábua, partilhamos meias secas, acabamos as tarefas do pântano. As missões do dia dão coragem aos pés. Afundamos os planos de {{boss_pt}}, cruzamos o lodo e apontamos para a gelada {{nextCity_pt}}!`,
    },
    objective: {
      en: `Keep {{city}}’s walkways safe and defeat {{boss}}`,
      pt: `Manter seguros os passadiços de {{city_pt}} e derrotar {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} stirs deep mud under {{city}}. Light steps and teamwork win!`,
      pt: `{{boss_pt}} remexe a lama funda sob {{city_pt}}. Passos leves e trabalho em equipa vencem!`,
    },
    vassals: [
      {
        en: `{{vassal1}} softens the planks — test and repair one bridge.`,
        pt: `{{vassal1_pt}} amolece as tábuas — testamos e consertamos uma ponte.`,
      },
      {
        en: `{{vassal2}} hides dry boots; return them before night.`,
        pt: `{{vassal2_pt}} esconde as botas secas — devolvemos antes da noite.`,
      },
      {
        en: `{{vassal3}} sings sleep into walkers; keep a bright chant together.`,
        pt: `{{vassal3_pt}} canta sono nos caminhantes — mantemos juntos um canto bem acordado.`,
      },
      {
        en: `{{vassal4}} bubbles under the pier; map a safe crossing.`,
        pt: `{{vassal4_pt}} borbulha debaixo do cais — marcamos uma travessia segura.`,
      },
    ],
  },
  '12': {
    story: {
      en: `Welcome to {{world}}! We reach {{city}}, magic ice and black stone — the closing gate of the year.

Endless {{season}} paints blue torch-shadows on the walls. Fingers tingle. Hot cocoa tastes like victory. Ice-rune magic draws little star maps on the windows at night. White wolves watch from far ridges, curious not cruel. Feast ravens steal crumbs and bow. A frozen-warrior statue blinks once — ui! — then smiles with frost and stays still.

Challenge: {{boss}} leads dead winter into the feast halls. Yet this is gathering month! Share light. Keep the circle.

Frost trials: {{vassal1}}, {{vassal2}}, {{vassal3}}, {{vassal4}}. Friendship beats fear. Daily missions warm every seat at the table. Shatter {{boss}}, sing the turn, and when the cycle renews we aim again for {{nextCity}}!`,
      pt: `Bem-vindos a {{world_pt}}! Chegamos a {{city_pt}}, gelo mágico e pedra negra — o portão final do ano.

{{season_pt}} sem fim pinta sombras azuis de tocha nas paredes. Os dedos formigam. O chocolate quente sabe a vitória. A magia das runas de gelo desenha mapinhas de estrelas nas janelas à noite. Lobos brancos observam nas cristas longe — curiosos, não maus. Corvos do banquete roubam migalhas e fazem vénia. Uma estátua de guerreiro congelado pestaneja uma vez — ui! — sorri com geada e fica quieta.

Desafio: {{boss_pt}} traz o inverno morto até aos salões de festa. Mas este é o mês da reunião! Partilhamos luz. Mantemos o círculo.

Provas de geada: {{vassal1_pt}}, {{vassal2_pt}}, {{vassal3_pt}} e {{vassal4_pt}}. A amizade vence o medo. As missões do dia aquecem cada lugar à mesa. Derrotamos {{boss_pt}}, cantamos a virada — e quando o ciclo renovar, apontamos de novo para {{nextCity_pt}}!`,
    },
    objective: {
      en: `Hold {{city}} and defeat {{boss}}’s frozen warhost`,
      pt: `Defender {{city_pt}} e derrotar o exército congelado de {{boss_pt}}`,
    },
    boss: {
      en: `{{boss}} freezes feast halls in {{city}}. Friendship thaws the dead winter!`,
      pt: `{{boss_pt}} congela os salões de festa em {{city_pt}}. A amizade derrete o inverno morto!`,
    },
    vassals: [
      {
        en: `{{vassal1}} leaves black frost on handshakes — warm the feast halls together.`,
        pt: `{{vassal1_pt}} deixa geada negra nos apertos de mão — aquecemos juntos os salões de festa.`,
      },
      {
        en: `{{vassal2}} marches inside the storm; hold the black-stone gate.`,
        pt: `{{vassal2_pt}} marcha dentro da tempestade — seguramos o portão de pedra negra.`,
      },
      {
        en: `{{vassal3}} climbs magic ice like stairs — reinforce the battlements.`,
        pt: `{{vassal3_pt}} sobe o gelo mágico como escadas — reforçamos as ameias.`,
      },
      {
        en: `{{vassal4}} announces the year’s end; keep the circle unbroken.`,
        pt: `{{vassal4_pt}} anuncia o fim do ano — mantemos o círculo intacto.`,
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
