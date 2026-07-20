#!/usr/bin/env node
/**
 * One-shot: rewrite docs/config/campaigns/01–12.md with Solstícia lore
 * and relink docs/config/months/*.md to calendar month → campaign.
 * season ids: primavera | verao | outono | inverno
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const SEASON = {
  inverno: { name: 'Ice Night', name_pt: 'Noite de Gelo' },
  primavera: { name: 'Living Green', name_pt: 'Verde Vivo' },
  verao: { name: 'Fire Sun', name_pt: 'Sol de Fogo' },
  outono: { name: 'Golden Leaves', name_pt: 'Folhas de Ouro' },
}

function esc(s) {
  return String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function img(id, file) {
  return `docs/assets/campaigns/${id}/${file}`
}

/** @type {Array<object>} */
const CAMPAIGNS = [
  {
    id: '01',
    month_number: 1,
    theme: 'fisico',
    season: 'inverno',
    city: 'Termópolis',
    title: 'Termópolis Under the Seal',
    title_pt: 'Termópolis sob o Selo',
    lore: 'The pilgrimage road ends in ice. Termópolis survives only in underground thermal caves — the surface belongs to Ice Night\'s hunger and a darkness that eats sanity. Citizens fled the frozen pines long ago; an ancestral Ice Jötunn sealed the cave mouth, and only disciplined bodies keep the last bastion warm until the caravan can move on.',
    lore_pt: 'A estrada da peregrinação termina no gelo. Termópolis sobrevive só em cavernas termais subterrâneas — a superfície pertence à fome da Noite de Gelo e a uma escuridão que come a sanidade. Os cidadãos fugiram dos pinheiros congelados há muito; um Jötunn de Gelo ancestral selou a boca da caverna, e só corpos disciplinados mantêm o último bastião quente até a caravana seguir.',
    month_objective: 'Hold the thermal caves and break the Ice Jötunn\'s seal',
    month_objective_pt: 'Manter as cavernas termais e romper o selo do Jötunn de Gelo',
    boss: {
      id: 'ice_jotunn_seal',
      name: 'Ancestral Ice Jötunn',
      name_pt: 'Jötunn de Gelo Ancestral',
      lore: 'Sealed the cave mouth; breath freezes resolve.',
      lore_pt: 'Selou a boca da caverna; o bafo congela a vontade.',
    },
    vassals: [
      {
        id: 'hunger_wraith',
        name: 'Hunger Wraith',
        name_pt: 'Espectro da Fome',
        objective: 'Week 1: endure the ration nights',
        objective_pt: 'Semana 1: aguentar as noites de ração',
        lore: 'Whispers that the stores are already empty.',
        lore_pt: 'Sussurra que os estoques já acabaram.',
      },
      {
        id: 'skoll_scout',
        name: 'Sköll Scout',
        name_pt: 'Batedor de Sköll',
        objective: 'Week 2: keep watch at the ice mouth',
        objective_pt: 'Semana 2: vigiar a boca de gelo',
        lore: 'A wolf of the pack testing the seal.',
        lore_pt: 'Lobo da matilha a testar o selo.',
      },
      {
        id: 'frost_draugr',
        name: 'Frost Draugr',
        name_pt: 'Draugr de Geada',
        objective: 'Week 3: reclaim a frozen tunnel',
        objective_pt: 'Semana 3: reconquistar um túnel congelado',
        lore: 'Dead warrior whose touch leaves frostbite.',
        lore_pt: 'Guerreiro morto cujo toque deixa geada.',
      },
      {
        id: 'sanity_blizzard',
        name: 'Sanity Blizzard',
        name_pt: 'Nevasca da Sanidade',
        objective: 'Week 4: hold mind through the dark',
        objective_pt: 'Semana 4: manter a mente na escuridão',
        lore: 'Wind that scrapes hope from the caves.',
        lore_pt: 'Vento que raspa a esperança das cavernas.',
      },
    ],
  },
  {
    id: '02',
    month_number: 2,
    theme: 'mental',
    season: 'inverno',
    city: 'Luzília',
    title: 'Luzília — Last Light',
    title_pt: 'Luzília — Última Luz',
    lore: 'Holiest city on Solstice, Luzília lifts a great temple to the benevolent One God, lit by living aurora. Sköll wolves circle the walls to devour the last light relic. Heroes must steady mind and faith — resist until the New Year turns the pilgrimage cycle and the caravan can leave with the relic unbroken.',
    lore_pt: 'Cidade mais sagrada de Solstícia, Luzília ergue um grande templo ao Deus Uno benevolente, iluminado por aurora viva. Lobos Sköll cercam os muros para devorar a relíquia da última luz. Heróis devem firmar mente e fé — resistir até o Ano Novo virar o ciclo da peregrinação e a caravana partir com a relíquia intacta.',
    month_objective: 'Guard the aurora relic until the New Year turn',
    month_objective_pt: 'Guardar a relíquia da aurora até a virada do Ano Novo',
    boss: {
      id: 'skoll_alpha',
      name: 'Sköll Alpha',
      name_pt: 'Alfa de Sköll',
      lore: 'Leads the pack that would swallow the last light.',
      lore_pt: 'Lidera a matilha que quer engolir a última luz.',
    },
    vassals: [
      {
        id: 'aurora_thief',
        name: 'Aurora Thief',
        name_pt: 'Ladrão da Aurora',
        objective: 'Week 1: protect temple lamps nightly',
        objective_pt: 'Semana 1: proteger as lâmpadas do templo',
        lore: 'Steals glow from the sanctuary glass.',
        lore_pt: 'Rouba o brilho do vidro do santuário.',
      },
      {
        id: 'doubt_howler',
        name: 'Doubt Howler',
        name_pt: 'Uivador da Dúvida',
        objective: 'Week 2: name fear before sleep',
        objective_pt: 'Semana 2: nomear o medo antes de dormir',
        lore: 'Howls that the One God has gone silent.',
        lore_pt: 'Uiva que o Deus Uno ficou em silêncio.',
      },
      {
        id: 'relic_gnawer',
        name: 'Relic Gnawer',
        name_pt: 'Roedor da Relíquia',
        objective: 'Week 3: keep vigil at the relic',
        objective_pt: 'Semana 3: vigília junto à relíquia',
        lore: 'Chews at sacred bindings under moonlight.',
        lore_pt: 'Roí amarras sagradas sob o luar.',
      },
      {
        id: 'night_pack',
        name: 'Night Pack Runner',
        name_pt: 'Corredor da Matilha Noturna',
        objective: 'Week 4: hold the wall until dawn',
        objective_pt: 'Semana 4: segurar o muro até o amanhecer',
        lore: 'Runs the perimeter testing every gate.',
        lore_pt: 'Corre o perímetro a testar cada portão.',
      },
    ],
  },
  {
    id: '03',
    month_number: 3,
    theme: 'profissional',
    season: 'primavera',
    city: 'Verdéia',
    title: 'Verdéia — Thorns After Snow',
    title_pt: 'Verdéia — Espinhos Após a Neve',
    lore: 'Living Green wakes with violence. Verdéia is a wooden frontier city newly freed from snow, ringed by living thorn walls. Meltwater flooded the mines and freed Forest Trolls that slept under ice. Pilgrims arrive to study the thaw, clear the shafts, and open the road before growth swallows the settlement whole.',
    lore_pt: 'O Verde Vivo acorda com violência. Verdéia é cidade fronteiriça de madeira recém-libertada da neve, cercada por muros de espinhos vivos. A água do degelo inundou as minas e libertou Trolls da Floresta que dormiam sob o gelo. Peregrinos chegam para estudar o degelo, limpar os poços e abrir a estrada antes que o crescimento engula o povoado.',
    month_objective: 'Clear the flooded mines and drive back Forest Trolls',
    month_objective_pt: 'Limpar as minas inundadas e repelir os Trolls da Floresta',
    boss: {
      id: 'forest_troll_chief',
      name: 'Forest Troll Chieftain',
      name_pt: 'Chefe dos Trolls da Floresta',
      lore: 'Woke in the flooded shafts; claims the thorn walls.',
      lore_pt: 'Acordou nos poços inundados; reivindica os muros de espinho.',
    },
    vassals: [
      {
        id: 'thaw_flood',
        name: 'Thaw Flood Spirit',
        name_pt: 'Espírito da Cheia do Degelo',
        objective: 'Week 1: drain one mine gallery',
        objective_pt: 'Semana 1: drenar uma galeria da mina',
        lore: 'Pushes meltwater into every tunnel.',
        lore_pt: 'Empurra água do degelo para cada túnel.',
      },
      {
        id: 'thorn_breaker',
        name: 'Thorn Wall Breaker',
        name_pt: 'Quebrador do Muro de Espinhos',
        objective: 'Week 2: repair the living walls',
        objective_pt: 'Semana 2: reparar os muros vivos',
        lore: 'Rips gaps for trolls to enter.',
        lore_pt: 'Abre buracos para os trolls entrarem.',
      },
      {
        id: 'spore_freed',
        name: 'Freed Spore Bearer',
        name_pt: 'Portador de Esporos Libertado',
        objective: 'Week 3: contain toxic bloom',
        objective_pt: 'Semana 3: conter o florescimento tóxico',
        lore: 'Spreads madness spores from the melt.',
        lore_pt: 'Espalha esporos de loucura do degelo.',
      },
      {
        id: 'mine_troll',
        name: 'Mine Troll Whelp',
        name_pt: 'Filhote de Troll da Mina',
        objective: 'Week 4: seal the deepest shaft',
        objective_pt: 'Semana 4: selar o poço mais fundo',
        lore: 'Learns cruelty in the dark water.',
        lore_pt: 'Aprende crueldade na água escura.',
      },
    ],
  },
  {
    id: '04',
    month_number: 4,
    theme: 'financas',
    season: 'primavera',
    city: 'Copária',
    title: 'Copária in the Canopy',
    title_pt: 'Copária no Dossel',
    lore: 'Copária hangs in giant treetops above a jungle that grows overnight. Toxic spores madden livestock; Fenrir beasts surround the tree bases and wait for anyone who climbs down. The One God\'s road runs through the canopy bridges — hold the stores, calm the herds, and clear the roots so the caravan can descend toward the fjords.',
    lore_pt: 'Copária pende nos topos de árvores gigantes sobre uma selva que cresce de noite. Esporos tóxicos enlouquecem o gado; bestas de Fenrir cercam as bases e esperam quem desça. A estrada do Deus Uno corre pelas pontes do dossel — segurem os estoques, acalmem os rebanhos e limpem as raízes para a caravana descer aos fiordes.',
    month_objective: 'Secure canopy stores and break the Fenrir siege at the roots',
    month_objective_pt: 'Segurar estoques do dossel e romper o cerco de Fenrir nas raízes',
    boss: {
      id: 'fenrir_alpha',
      name: 'Fenrir Beast Alpha',
      name_pt: 'Alfa das Bestas de Fenrir',
      lore: 'Circles the tree bases; leaps for falling climbers.',
      lore_pt: 'Ronda as bases das árvores; salta a quem cai.',
    },
    vassals: [
      {
        id: 'toxic_spore',
        name: 'Toxic Spore Cloud',
        name_pt: 'Nuvem de Esporos Tóxicos',
        objective: 'Week 1: mask and purge one grove',
        objective_pt: 'Semana 1: mascarar e limpar um bosque',
        lore: 'Turns breath into fever dreams.',
        lore_pt: 'Transforma o fôlego em febre.',
      },
      {
        id: 'maddened_herd',
        name: 'Maddened Herd Specter',
        name_pt: 'Espectro do Rebanho Enlouquecido',
        objective: 'Week 2: calm and secure livestock',
        objective_pt: 'Semana 2: acalmar e proteger o gado',
        lore: 'Drives animals to leap from the bridges.',
        lore_pt: 'Empurra animais a saltar das pontes.',
      },
      {
        id: 'root_strangler',
        name: 'Root Strangler',
        name_pt: 'Estrangulador de Raízes',
        objective: 'Week 3: clear a descent path',
        objective_pt: 'Semana 3: abrir um caminho de descida',
        lore: 'Living vines that crush ladder posts.',
        lore_pt: 'Vinhas vivas que esmagam postes de escada.',
      },
      {
        id: 'canopy_fenrir',
        name: 'Canopy Fenrir Pup',
        name_pt: 'Filhote de Fenrir do Dossel',
        objective: 'Week 4: drive pups from the stores',
        objective_pt: 'Semana 4: expulsar filhotes dos estoques',
        lore: 'Learns the hunt among hanging markets.',
        lore_pt: 'Aprende a caça nos mercados suspensos.',
      },
    ],
  },
  {
    id: '05',
    month_number: 5,
    theme: 'social',
    season: 'primavera',
    city: 'Rioporto',
    title: 'Rioporto — Flooded Gate',
    title_pt: 'Rioporto — Portão Inundado',
    lore: 'Rioporto is a port city wedged in a flooded canyon. Violent melt currents and water monsters block every boat bound for the summer regions. Pilgrims must coordinate crews, ropes, and courage — only a united party can open the water road so the caravan reaches Fire Sun\'s heat before Living Green\'s rivers tear the docks apart.',
    lore_pt: 'Rioporto é porto encravado num canhão inundado. Correntes violentas do degelo e monstros aquáticos bloqueiam todo barco rumo às regiões de verão. Peregrinos devem coordenar tripulações, cordas e coragem — só um grupo unido abre a estrada de água para a caravana alcançar o calor de Sol de Fogo antes que os rios do Verde Vivo destruam os cais.',
    month_objective: 'Open the canyon route and break the water blockade',
    month_objective_pt: 'Abrir a rota do canhão e romper o bloqueio aquático',
    boss: {
      id: 'melt_leviathan',
      name: 'Melt Current Leviathan',
      name_pt: 'Leviatã da Corrente do Degelo',
      lore: 'Coils in the canyon throat; sinks pilgrim boats.',
      lore_pt: 'Enrola na garganta do canhão; afunda barcos de peregrinos.',
    },
    vassals: [
      {
        id: 'undertow_spirit',
        name: 'Undertow Spirit',
        name_pt: 'Espírito da Ressaca',
        objective: 'Week 1: secure dock lines daily',
        objective_pt: 'Semana 1: segurar amarras do cais todos os dias',
        lore: 'Pulls swimmers under smiling foam.',
        lore_pt: 'Puxa nadadores sob espuma sorridente.',
      },
      {
        id: 'boat_breaker',
        name: 'Boat-Breaker',
        name_pt: 'Quebra-Barcos',
        objective: 'Week 2: repair and launch one skiff',
        objective_pt: 'Semana 2: reparar e lançar um barco',
        lore: 'Cracks keels with ice-hard fins.',
        lore_pt: 'Racha quilhas com barbatanas de gelo.',
      },
      {
        id: 'flood_wraith',
        name: 'Flood Wraith',
        name_pt: 'Espectro da Cheia',
        objective: 'Week 3: ferry supplies across the gorge',
        objective_pt: 'Semana 3: ferry de mantimentos pelo desfiladeiro',
        lore: 'Rides the crest and steals oars.',
        lore_pt: 'Cavalga a crista e rouba remos.',
      },
      {
        id: 'canyon_siren',
        name: 'Canyon Siren',
        name_pt: 'Sereia do Canhão',
        objective: 'Week 4: keep crews from answering the call',
        objective_pt: 'Semana 4: impedir tripulações de atender o canto',
        lore: 'Sings of safer ports that do not exist.',
        lore_pt: 'Canta portos seguros que não existem.',
      },
    ],
  },
  {
    id: '06',
    month_number: 6,
    theme: 'recreativo',
    season: 'verao',
    city: 'Solária',
    title: 'Solária — Blessed Spring',
    title_pt: 'Solária — Nascente Abençoada',
    lore: 'Fire Sun begins. Solária is an oasis of stone around a single spring blessed by the One God. Beyond the walls: red canyons, arid steppes, ash-dry rivers. Fire Giants march to dry the spring and burn the temples. Pilgrims reclaim rest and ritual joy here — without water and song, the road dies in heat madness.',
    lore_pt: 'Sol de Fogo começa. Solária é oásis de pedra em torno de uma única nascente abençoada pelo Deus Uno. Além dos muros: canhões vermelhos, estepes áridas, rios de cinza seca. Gigantes de Fogo marcham para secar a nascente e queimar os templos. Peregrinos recuperam descanso e alegria ritual aqui — sem água e canto, a estrada morre na loucura do calor.',
    month_objective: 'Defend the blessed spring from the Fire Giant host',
    month_objective_pt: 'Defender a nascente abençoada do exército de Gigantes de Fogo',
    boss: {
      id: 'fire_giant_marshal',
      name: 'Fire Giant Marshal',
      name_pt: 'Marechal dos Gigantes de Fogo',
      lore: 'Marches to boil the spring and torch the temples.',
      lore_pt: 'Marcha para ferver a nascente e incendiar os templos.',
    },
    vassals: [
      {
        id: 'spring_dryer',
        name: 'Spring Dryer',
        name_pt: 'Secador da Nascente',
        objective: 'Week 1: ration and guard the well',
        objective_pt: 'Semana 1: racionar e guardar o poço',
        lore: 'Drinks shadow from the blessed water.',
        lore_pt: 'Bebe sombra da água abençoada.',
      },
      {
        id: 'temple_ember',
        name: 'Temple Ember',
        name_pt: 'Brasa do Templo',
        objective: 'Week 2: keep sacred fires controlled',
        objective_pt: 'Semana 2: manter fogos sagrados sob controlo',
        lore: 'Sparks that want every altar to burn wild.',
        lore_pt: 'Faíscas que querem cada altar em chamas.',
      },
      {
        id: 'heat_mirage',
        name: 'Heat Mirage',
        name_pt: 'Miragem do Calor',
        objective: 'Week 3: rest without losing the road',
        objective_pt: 'Semana 3: descansar sem perder a estrada',
        lore: 'Shows false oases to wandering minds.',
        lore_pt: 'Mostra oásis falsos a mentes errantes.',
      },
      {
        id: 'ash_runner',
        name: 'Ash Steppe Runner',
        name_pt: 'Corredor da Estepe de Cinza',
        objective: 'Week 4: scout the canyon approach',
        objective_pt: 'Semana 4: explorar a aproximação do canhão',
        lore: 'Carries the marshal\'s war-drums ahead.',
        lore_pt: 'Leva à frente os tambores de guerra do marechal.',
      },
    ],
  },
  {
    id: '07',
    month_number: 7,
    theme: 'espiritual',
    season: 'verao',
    city: 'Cinzar',
    title: 'Cinzar Under Smoke',
    title_pt: 'Cinzar sob a Fumaça',
    lore: 'Cinzar crouches in a geographic depression under a ceiling of wildfire smoke. Purpose frays when the sun vanishes for days. Ash Serpents strike supply caravans on the rim roads. Pilgrims renew vows to the One God in the haze — without meaning, heat madness wins before the next city\'s gates open.',
    lore_pt: 'Cinzar agacha-se numa depressão geográfica sob um teto de fumaça de incêndios. O propósito esfarela quando o sol some por dias. Serpentes de Cinza atacam caravanas de mantimentos nas estradas da beira. Peregrinos renovam votos ao Deus Uno na névoa — sem sentido, a loucura do calor vence antes que se abram os portões da próxima cidade.',
    month_objective: 'Protect supply caravans and endure the smoke season',
    month_objective_pt: 'Proteger caravanas de mantimentos e aguentar a estação da fumaça',
    boss: {
      id: 'ash_serpent_matriarch',
      name: 'Ash Serpent Matriarch',
      name_pt: 'Matriarca da Serpente de Cinza',
      lore: 'Strikes caravans from under cinder dunes.',
      lore_pt: 'Ataca caravanas sob dunas de cinza.',
    },
    vassals: [
      {
        id: 'smoke_veil',
        name: 'Smoke Veil',
        name_pt: 'Véu de Fumaça',
        objective: 'Week 1: keep prayer hours in the dark',
        objective_pt: 'Semana 1: manter horas de oração no escuro',
        lore: 'Blots the sky so no landmark remains.',
        lore_pt: 'Apaga o céu para nenhum marco restar.',
      },
      {
        id: 'cinder_raider',
        name: 'Cinder Caravan Raider',
        name_pt: 'Saqueador de Caravanas de Cinza',
        objective: 'Week 2: escort one supply run',
        objective_pt: 'Semana 2: escoltar uma corrida de mantimentos',
        lore: 'Rides heat shimmer to cut wagon traces.',
        lore_pt: 'Cavalga o cintilar do calor para cortar rasto de carroças.',
      },
      {
        id: 'wildfire_ember',
        name: 'Wildfire Ember',
        name_pt: 'Brasa do Incêndio',
        objective: 'Week 3: clear firebreaks around Cinzar',
        objective_pt: 'Semana 3: limpar aceiros em torno de Cinzar',
        lore: 'Seeds new blazes in dry grass.',
        lore_pt: 'Semeia novos fogos na erva seca.',
      },
      {
        id: 'ash_whelp',
        name: 'Ash Serpent Whelp',
        name_pt: 'Filhote de Serpente de Cinza',
        objective: 'Week 4: seal a rim-road nest',
        objective_pt: 'Semana 4: selar um ninho na estrada da beira',
        lore: 'Learns to taste wagon grease and fear.',
        lore_pt: 'Aprende a saborear graxa de carroça e medo.',
      },
    ],
  },
  {
    id: '08',
    month_number: 8,
    theme: 'fisico',
    season: 'verao',
    city: 'Forjália',
    title: 'Forjália — Scorch Mines',
    title_pt: 'Forjália — Minas Ardentes',
    lore: 'Forjália digs into scorching rocky mountains where Heat Spirits ride the ore veins. Collective hallucinations turn guards against each other; rebellion blooms in the barracks. Body and discipline are the only antidote. Beat the spirits, steady the garrison, then the caravan leaves Fire Sun for the rotting gold of autumn.',
    lore_pt: 'Forjália cava montanhas rochosas escaldantes onde Espíritos do Calor cavalgam veios de minério. Alucinações coletivas viram guardas uns contra os outros; a rebelião floresce nos quartéis. Corpo e disciplina são o único antídoto. Vençam os espíritos, firmem a guarnição, e a caravana deixa Sol de Fogo para o ouro apodrecido do outono.',
    month_objective: 'End the Heat Spirit plague and restore the mine guard',
    month_objective_pt: 'Acabar com a praga dos Espíritos do Calor e restaurar a guarda da mina',
    boss: {
      id: 'heat_spirit_sovereign',
      name: 'Heat Spirit Sovereign',
      name_pt: 'Soberano dos Espíritos do Calor',
      lore: 'Fills minds with false orders and burning crowns.',
      lore_pt: 'Enche mentes com ordens falsas e coroas ardentes.',
    },
    vassals: [
      {
        id: 'hallucination_whisper',
        name: 'Hallucination Whisper',
        name_pt: 'Sussurro da Alucinação',
        objective: 'Week 1: train body to ground the mind',
        objective_pt: 'Semana 1: treinar o corpo para ancorar a mente',
        lore: 'Speaks a captain\'s voice into empty halls.',
        lore_pt: 'Fala com voz de capitão em corredores vazios.',
      },
      {
        id: 'rebel_guard_shade',
        name: 'Rebel Guard Shade',
        name_pt: 'Sombra da Guarda Rebelde',
        objective: 'Week 2: restore one barracks watch',
        objective_pt: 'Semana 2: restaurar uma vigia do quartel',
        lore: 'Turns comrades into enemies at noon.',
        lore_pt: 'Transforma camaradas em inimigos ao meio-dia.',
      },
      {
        id: 'scorch_miner',
        name: 'Scorch Miner',
        name_pt: 'Mineiro Escaldo',
        objective: 'Week 3: clear a safe ore shaft',
        objective_pt: 'Semana 3: limpar um poço de minério seguro',
        lore: 'Hammers rock until the vein screams fire.',
        lore_pt: 'Martela a rocha até o veio gritar fogo.',
      },
      {
        id: 'ore_fever',
        name: 'Ore Fever Spirit',
        name_pt: 'Espírito da Febre do Minério',
        objective: 'Week 4: cool the deep forges',
        objective_pt: 'Semana 4: arrefecer as forjas profundas',
        lore: 'Fever that makes pickaxes feel like swords.',
        lore_pt: 'Febre que faz picaretas parecerem espadas.',
      },
    ],
  },
  {
    id: '09',
    month_number: 9,
    theme: 'mental',
    season: 'outono',
    city: 'Dourália',
    title: 'Dourália — Rotting Gold',
    title_pt: 'Dourália — Ouro a Apodrecer',
    lore: 'Golden Leaves begins: red and gold forests rot before harvest. Dourália sits among wheat fields that blacken overnight. Mist Witches raise scarecrows and the restless dead to steal peasant souls through the thinning veil to Helheim. Stay calm, mark the fog, and break the coven before the caravan enters darker valleys.',
    lore_pt: 'Começa o Folhas de Ouro: florestas vermelho-ouro apodrecem antes da colheita. Dourália fica entre trigais que enegrecem de noite. Bruxas da Névoa erguem espantalhos e mortos inquietos para roubar almas camponesas pelo véu fino até Helheim. Mantenham a calma, marquem o nevoeiro e quebrem o coven antes da caravana entrar em vales mais escuros.',
    month_objective: 'Stop the Mist Witches from harvesting peasant souls',
    month_objective_pt: 'Impedir as Bruxas da Névoa de colher almas camponesas',
    boss: {
      id: 'mist_witch_queen',
      name: 'Mist Witch Queen',
      name_pt: 'Rainha das Bruxas da Névoa',
      lore: 'Reaps souls from rotting wheat under gray veils.',
      lore_pt: 'Ceifa almas do trigo apodrecido sob véus cinzentos.',
    },
    vassals: [
      {
        id: 'wheat_blight',
        name: 'Wheat Blight',
        name_pt: 'Praga do Trigo',
        objective: 'Week 1: salvage one field\'s worth',
        objective_pt: 'Semana 1: salvar o equivalente a um campo',
        lore: 'Gold that turns to black mush by dawn.',
        lore_pt: 'Ouro que vira papa negra ao amanhecer.',
      },
      {
        id: 'rotting_scarecrow',
        name: 'Rotting Scarecrow',
        name_pt: 'Espantalho em Putrefação',
        objective: 'Week 2: burn false watchers at dusk',
        objective_pt: 'Semana 2: queimar falsos vigias ao entardecer',
        lore: 'Walks the rows when mist thickens.',
        lore_pt: 'Anda nas fileiras quando a névoa engrossa.',
      },
      {
        id: 'soul_reaper',
        name: 'Soul-Reaping Shade',
        name_pt: 'Sombra Ceifadora de Almas',
        objective: 'Week 3: escort families through fog',
        objective_pt: 'Semana 3: escoltar famílias pela névoa',
        lore: 'Counts breaths that do not return.',
        lore_pt: 'Conta respirações que não voltam.',
      },
      {
        id: 'helheim_veil',
        name: 'Helheim Veil Tear',
        name_pt: 'Rasgo do Véu de Helheim',
        objective: 'Week 4: seal a thin place in the fields',
        objective_pt: 'Semana 4: selar um lugar fino nos campos',
        lore: 'A soft door the witches widen each night.',
        lore_pt: 'Porta macia que as bruxas alargam cada noite.',
      },
    ],
  },
  {
    id: '10',
    month_number: 10,
    theme: 'profissional',
    season: 'outono',
    city: 'Sombrália',
    title: 'Sombrália — Dark Valley',
    title_pt: 'Sombrália — Vale Escuro',
    lore: 'Sombrália is a gothic city in a valley where the sun barely reaches. Dark elves — Dökkálfar — invade through underground portals as Helheim\'s veil thins. Finish unfinished quests, map the tunnels, and push the invasion back. The pilgrimage road cannot tarry; fog and rot wait in the swamps ahead.',
    lore_pt: 'Sombrália é cidade gótica num vale onde o sol quase não chega. Elfos negros — Dökkálfar — invadem por portais subterrâneos enquanto o véu de Helheim afina. Concluam missões pendentes, mapeiem os túneis e repilam a invasão. A estrada da peregrinação não pode demorar; névoa e podridão esperam nos pântanos à frente.',
    month_objective: 'Close underground portals and repel the Dökkálfar invasion',
    month_objective_pt: 'Fechar portais subterrâneos e repelir a invasão Dökkálfar',
    boss: {
      id: 'dokkalfar_warlord',
      name: 'Dökkálfar Warlord',
      name_pt: 'Senhor da Guerra Dökkálfar',
      lore: 'Commands the portal host from lightless halls.',
      lore_pt: 'Comanda o exército dos portais em salões sem luz.',
    },
    vassals: [
      {
        id: 'portal_scout',
        name: 'Portal Scout',
        name_pt: 'Batedor do Portal',
        objective: 'Week 1: map one undergate',
        objective_pt: 'Semana 1: mapear um subportão',
        lore: 'Marks doors that should not open.',
        lore_pt: 'Marca portas que não deveriam abrir.',
      },
      {
        id: 'shadow_blade',
        name: 'Shadow Blade',
        name_pt: 'Lâmina das Sombras',
        objective: 'Week 2: clear a street of ambushes',
        objective_pt: 'Semana 2: limpar uma rua de emboscadas',
        lore: 'Strikes where lanterns fail.',
        lore_pt: 'Golpeia onde as lanternas falham.',
      },
      {
        id: 'undergate_spy',
        name: 'Undergate Spy',
        name_pt: 'Espião do Subportão',
        objective: 'Week 3: expose a sleeper cell',
        objective_pt: 'Semana 3: expor uma célula dormente',
        lore: 'Wears pilgrim faces in market crowds.',
        lore_pt: 'Usa rostos de peregrinos nas multidões do mercado.',
      },
      {
        id: 'dokkalfar_blade',
        name: 'Dökkálfar Blade-Sister',
        name_pt: 'Irmã-Lâmina Dökkálfar',
        objective: 'Week 4: hold the cathedral steps',
        objective_pt: 'Semana 4: segurar os degraus da catedral',
        lore: 'Oath-bound to widen Helheim\'s doors.',
        lore_pt: 'Jurada a alargar as portas de Helheim.',
      },
    ],
  },
  {
    id: '11',
    month_number: 11,
    theme: 'financas',
    season: 'outono',
    city: 'Pantanil',
    title: 'Pantanil on Sinking Stilts',
    title_pt: 'Pantanil sobre Palafitas a Afundar',
    lore: 'Pantanil stands on stilts over a fetid foggy swamp. Foundations sink as Nídhögg spawn dig under the mud, chewing the ledger of the city\'s future. Count carefully, shore the posts, and burn the nests — then the caravan can flee Golden Leaves toward winter\'s last fortress before the stilts vanish into Helheim\'s mud.',
    lore_pt: 'Pantanil ergue-se em palafitas sobre um pântano fétido e enevoado. As fundações afundam enquanto crias de Nídhögg cavam sob a lama, roendo o livro-razão do futuro da cidade. Contem com cuidado, escorem os postes e queimem os ninhos — depois a caravana foge do Folhas de Ouro rumo à última fortaleza do inverno antes que as palafitas desapareçam na lama de Helheim.',
    month_objective: 'Shore the stilts and purge Nídhögg spawn from the mud',
    month_objective_pt: 'Escorar as palafitas e purgar as crias de Nídhögg da lama',
    boss: {
      id: 'nidhogg_broodmother',
      name: 'Nídhögg Broodmother',
      name_pt: 'Mãe-Ninho de Nídhögg',
      lore: 'Digs beneath stilts until whole wards sink.',
      lore_pt: 'Cava sob palafitas até bairros inteiros afundarem.',
    },
    vassals: [
      {
        id: 'mud_digger',
        name: 'Mud Digger Spawn',
        name_pt: 'Cria Escavadora de Lama',
        objective: 'Week 1: inspect and brace stilts',
        objective_pt: 'Semana 1: inspecionar e escorar palafitas',
        lore: 'Chews wooden posts into soft pulp.',
        lore_pt: 'Roí postes de madeira até virarem polpa.',
      },
      {
        id: 'stilt_cracker',
        name: 'Stilt Cracker',
        name_pt: 'Quebra-Palafitas',
        objective: 'Week 2: rebuild one sunken walk',
        objective_pt: 'Semana 2: reconstruir uma ponte afundada',
        lore: 'Snaps supports when fog is thickest.',
        lore_pt: 'Parte apoios quando a névoa está mais densa.',
      },
      {
        id: 'fog_leech',
        name: 'Fog Leech',
        name_pt: 'Sanguessuga da Névoa',
        objective: 'Week 3: clear drains under the market',
        objective_pt: 'Semana 3: limpar drenos sob o mercado',
        lore: 'Drains coin and courage from traders.',
        lore_pt: 'Drena moeda e coragem dos comerciantes.',
      },
      {
        id: 'swamp_nidhogg',
        name: 'Swamp Nídhögg Whelp',
        name_pt: 'Filhote de Nídhögg do Pântano',
        objective: 'Week 4: burn a brood nest',
        objective_pt: 'Semana 4: queimar um ninho da ninhada',
        lore: 'Practices ruin on abandoned piers.',
        lore_pt: 'Pratica ruína em cais abandonados.',
      },
    ],
  },
  {
    id: '12',
    month_number: 12,
    theme: 'social',
    season: 'inverno',
    city: 'Nevália',
    title: 'Nevália — Ice Fortress',
    title_pt: 'Nevália — Fortaleza de Gelo',
    lore: 'Nevália is a fortress of magic ice and black stone under endless blizzard — Ice Night\'s closing gate. Relentless Draugr armies freeze what they touch. Here the pilgrimage year gathers: hold the circle, share the feast of the One God\'s light, and shatter the Draugr warlord so the road can turn again toward Termópolis when the cycle renews.',
    lore_pt: 'Nevália é fortaleza de gelo mágico e pedra negra sob nevasca sem fim — o portão final da Noite de Gelo. Exércitos implacáveis de Draugr congelam o que tocam. Aqui o ano da peregrinação reúne-se: segurem o círculo, partilhem o banquete da luz do Deus Uno e destroem o senhor da guerra Draugr para a estrada virar de novo a Termópolis quando o ciclo renovar.',
    month_objective: 'Hold Nevália and defeat the Draugr warhost',
    month_objective_pt: 'Segurar Nevália e derrotar o exército Draugr',
    boss: {
      id: 'draugr_warlord',
      name: 'Draugr Warlord',
      name_pt: 'Senhor da Guerra Draugr',
      lore: 'Freezes feast halls with a touch; leads the dead winter.',
      lore_pt: 'Congela salões de festa com um toque; lidera o inverno morto.',
    },
    vassals: [
      {
        id: 'touch_of_ice',
        name: 'Touch-of-Ice Draugr',
        name_pt: 'Draugr do Toque de Gelo',
        objective: 'Week 1: warm and guard the feast halls',
        objective_pt: 'Semana 1: aquecer e guardar os salões de festa',
        lore: 'Leaves black frost on every handshake.',
        lore_pt: 'Deixa geada negra em cada aperto de mão.',
      },
      {
        id: 'blizzard_legion',
        name: 'Blizzard Legionnaire',
        name_pt: 'Legionário da Nevasca',
        objective: 'Week 2: hold the black-stone gate',
        objective_pt: 'Semana 2: segurar o portão de pedra negra',
        lore: 'Marches in formation inside the storm.',
        lore_pt: 'Marcha em formação dentro da tempestade.',
      },
      {
        id: 'black_stone_wight',
        name: 'Black Stone Wight',
        name_pt: 'Wight da Pedra Negra',
        objective: 'Week 3: reinforce ice battlements',
        objective_pt: 'Semana 3: reforçar ameias de gelo',
        lore: 'Climbs magic ice as if it were stairs.',
        lore_pt: 'Sobe gelo mágico como se fossem escadas.',
      },
      {
        id: 'year_end_draugr',
        name: 'Year-End Draugr Herald',
        name_pt: 'Arauto Draugr do Fim do Ano',
        objective: 'Week 4: keep the circle unbroken',
        objective_pt: 'Semana 4: manter o círculo intacto',
        lore: 'Announces that the pilgrimage dies here.',
        lore_pt: 'Anuncia que a peregrinação morre aqui.',
      },
    ],
  },
]

function buildCampaignMd(c) {
  const s = SEASON[c.season]
  const id = c.id
  const vassalYaml = c.vassals
    .map(
      (v, i) => `  - id: ${v.id}
    week_index: ${i + 1}
    name: "${esc(v.name)}"
    name_pt: "${esc(v.name_pt)}"
    theme: ${c.theme}
    image: "${img(id, `vassal-0${i + 1}.svg`)}"
    objective: "${esc(v.objective)}"
    objective_pt: "${esc(v.objective_pt)}"
    lore: "${esc(v.lore)}"
    lore_pt: "${esc(v.lore_pt)}"
    points: 30`,
    )
    .join('\n')

  return `---
id: "${id}"
month_number: ${c.month_number}
theme: ${c.theme}
world: "Solstice"
world_pt: "Solstícia"
season: ${c.season}
season_name: "${esc(s.name)}"
season_name_pt: "${esc(s.name_pt)}"
city: "${esc(c.city)}"
city_pt: "${esc(c.city)}"
title: "${esc(c.title)}"
title_pt: "${esc(c.title_pt)}"
lore: "${esc(c.lore)}"
lore_pt: "${esc(c.lore_pt)}"
map: "docs/assets/backgrounds/${c.theme}.jpg"
month_objective: "${esc(c.month_objective)}"
month_objective_pt: "${esc(c.month_objective_pt)}"
boss:
  id: ${c.boss.id}
  name: "${esc(c.boss.name)}"
  name_pt: "${esc(c.boss.name_pt)}"
  theme: ${c.theme}
  image: "${img(id, 'boss.svg')}"
  lore: "${esc(c.boss.lore)}"
  lore_pt: "${esc(c.boss.lore_pt)}"
  points: 50
vassals:
${vassalYaml}
---

# Campaign ${id} — ${c.title} / ${c.title_pt}

**World:** Solstice / Solstícia · **City:** ${c.city} · **Season:** ${c.season} (${s.name} / ${s.name_pt})

**EN:** Arrival → city climate → month objective → weekly vassals → last week BOSS → caravan + class upgrade.  
**PT:** Chegada → clima da cidade → objetivo do mês → súditos semanais → última semana BOSS → caravana + upgrade de classe.
`
}

function parseWeeks(front) {
  const m = front.match(/weeks:\s*\[([^\]]*)\]/)
  if (!m) return []
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
}

function parseObjectivesBlock(front) {
  const m = front.match(/objectives:\n([\s\S]*)$/)
  return m ? m[1].trimEnd() : ''
}

function monthNames(ym) {
  const [y, mo] = ym.split('-').map(Number)
  const en = new Date(Date.UTC(y, mo - 1, 1)).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const pt = new Date(Date.UTC(y, mo - 1, 1)).toLocaleString('pt-PT', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return { en, pt: pt.charAt(0).toUpperCase() + pt.slice(1) }
}

function buildBossLines(campaign, weeks) {
  const slots = Math.max(0, weeks.length - 1)
  const lines = []
  for (let i = 0; i < slots; i++) {
    const v = campaign.vassals[i] || campaign.vassals[campaign.vassals.length - 1]
    const week = weeks[i]
    lines.push(
      `  - { week: "${week}", id: ${v.id}, name: "${esc(v.name)}", name_pt: "${esc(v.name_pt)}", type: vassal, collective: true, points: 30, mission_redacted: "${esc(v.objective)}", mission_redacted_pt: "${esc(v.objective_pt)}" }`,
    )
  }
  const last = weeks[weeks.length - 1]
  const b = campaign.boss
  lines.push(
    `  - { week: "${last}", id: ${b.id}, name: "${esc(b.name)}", name_pt: "${esc(b.name_pt)}", type: boss, collective: true, points: 50, mission_redacted: "${esc(campaign.month_objective)}", mission_redacted_pt: "${esc(campaign.month_objective_pt)}" }`,
  )
  return lines.join('\n')
}

// Write campaigns
for (const c of CAMPAIGNS) {
  const out = path.join(root, 'docs/config/campaigns', `${c.id}.md`)
  fs.writeFileSync(out, buildCampaignMd(c))
  console.log('wrote', out)
}

const byId = Object.fromEntries(CAMPAIGNS.map((c) => [c.id, c]))

// Relink months
const monthsDir = path.join(root, 'docs/config/months')
for (const file of fs.readdirSync(monthsDir).filter((f) => f.endsWith('.md'))) {
  const full = path.join(monthsDir, file)
  const raw = fs.readFileSync(full, 'utf8')
  const parts = raw.split(/^---$/m)
  if (parts.length < 3) {
    console.warn('skip (no frontmatter):', file)
    continue
  }
  const front = parts[1]
  const ym = file.replace(/\.md$/, '')
  const calMonth = Number(ym.split('-')[1])
  const campId = String(calMonth).padStart(2, '0')
  const campaign = byId[campId]
  if (!campaign) {
    console.warn('no campaign for', file)
    continue
  }
  const weeks = parseWeeks(front)
  const objectives = parseObjectivesBlock(front)
  const { en, pt } = monthNames(ym)
  const next = `---
month: "${ym}"
month_number: ${calMonth}
campaign: "${campId}"
weeks: [${weeks.map((w) => `"${w}"`).join(', ')}]
theme: ${campaign.theme}
bosses:
${buildBossLines(campaign, weeks)}
objectives:
${objectives}
---

# Month Setup — ${en} / Setup do Mês — ${pt}

**EN:** Calendar month ${calMonth} → campaign \`${campId}\` (${campaign.city}, ${campaign.season}). Weeks ${weeks.length}: vassals on weeks 1–${weeks.length - 1}, Month BOSS on last week (${weeks[weeks.length - 1] || '?'}).
**PT:** Mês civil ${calMonth} → campanha \`${campId}\` (${campaign.city}, ${campaign.season}). ${weeks.length} semanas: súditos nas semanas 1–${weeks.length - 1}, BOSS do mês na última (${weeks[weeks.length - 1] || '?'}).
`
  fs.writeFileSync(full, next)
  console.log('relinked', file, '→', campId)
}

console.log('done')
