---
themes:
  alimentacao:
    name: "Nutrition"
    name_pt: "Alimentação"
    palette: ["#E8590C", "#2F9E44", "#5C3A1E"]
    environment: "medieval tavern with banquets"
    environment_pt: "taverna medieval com banquetes"
    background: "docs/assets/backgrounds/alimentacao.svg"
    enemies:
      - { id: demonio_gula, name: "Demon of Gluttony", name_pt: "Demônio da Gula", type: demonio, description: "Whispers cravings for sweets and fries into the heroes' ears.", description_pt: "Sussurra desejos de doces e frituras aos ouvidos dos heróis.", image: "docs/assets/enemies/demonio.svg" }
      - { id: hidra_acucar, name: "Sugar Hydra", name_pt: "Hidra do Açúcar", type: monstro, description: "Cut off one head (sweet) and two grow back — only discipline defeats it.", description_pt: "Corta-se uma cabeça (doce) e nascem duas — só a disciplina a derrota.", image: "docs/assets/enemies/monstro.svg" }
      - { id: rei_glutao, name: "Glutton King", name_pt: "Rei Glutão", type: rei_mau, description: "A tyrant who orders endless midnight feasts.", description_pt: "Tirano que ordena banquetes sem fim à meia-noite.", image: "docs/assets/enemies/rei_mau.svg" }
      - { id: zumbi_faminto, name: "Hungry Zombie", name_pt: "Zumbi Faminto", type: morto_vivo, description: "Wanders the kitchen hunting leftovers at odd hours.", description_pt: "Vagueia pela cozinha à caça de sobras a horas estranhas.", image: "docs/assets/enemies/morto_vivo.svg" }
  treino:
    name: "Training"
    name_pt: "Treino"
    palette: ["#C92A2A", "#A87900", "#3D2B1F"]
    environment: "battle arena and forge"
    environment_pt: "arena de batalha e ferraria"
    background: "docs/assets/backgrounds/treino.svg"
    enemies:
      - { id: dragao_preguica, name: "Dragon of Laziness", name_pt: "Dragão da Preguiça", type: dragao, description: "Sleeps atop a hoard of snoozed alarms.", description_pt: "Dorme sobre um tesouro de alarmes adiados.", image: "docs/assets/enemies/dragao.svg" }
      - { id: golem_sedentario, name: "Sedentary Golem", name_pt: "Golem Sedentário", type: monstro, description: "Made of stone and sofa — immobilizes whoever sits beside it.", description_pt: "Feito de pedra e sofá — imobiliza quem se senta ao lado.", image: "docs/assets/enemies/monstro.svg" }
      - { id: lich_fadiga, name: "Lich of Fatigue", name_pt: "Lich da Fadiga", type: lich, description: "Drains the life energy of those who stay still.", description_pt: "Drena a energia vital de quem permanece parado.", image: "docs/assets/enemies/lich.svg" }
      - { id: cavaleiro_cansaco, name: "Dark Knight of Exhaustion", name_pt: "Cavaleiro Negro do Cansaço", type: rei_mau, description: "Challenges the heroes at dusk, when willpower weakens.", description_pt: "Desafia os heróis ao entardecer, quando a vontade enfraquece.", image: "docs/assets/enemies/rei_mau.svg" }
  estudo:
    name: "Study"
    name_pt: "Estudo"
    palette: ["#4263EB", "#7048E8", "#1E2A5C"]
    environment: "arcane library and mage tower"
    environment_pt: "biblioteca arcana e torre de mago"
    background: "docs/assets/backgrounds/estudo.svg"
    enemies:
      - { id: mago_ignorancia, name: "Evil Mage of Ignorance", name_pt: "Mago Maligno da Ignorância", type: mago_mau, description: "Casts confusion spells over open books.", description_pt: "Lança feitiços de confusão sobre livros abertos.", image: "docs/assets/enemies/mago_mau.svg" }
      - { id: espectro_distracao, name: "Specter of Distraction", name_pt: "Espectro da Distração", type: morto_vivo, description: "Haunts screens and notifications with every page read.", description_pt: "Assombra ecrãs e notificações a cada página lida.", image: "docs/assets/enemies/morto_vivo.svg" }
      - { id: dragao_esquecimento, name: "Dragon of Forgetfulness", name_pt: "Dragão do Esquecimento", type: dragao, description: "Devours knowledge that goes unreviewed.", description_pt: "Devora o conhecimento que não é revisto.", image: "docs/assets/enemies/dragao.svg" }
      - { id: demonio_amanha, name: "Demon of Tomorrow", name_pt: "Demônio do Amanhã", type: demonio, description: "Convinces heroes that studying tomorrow is better.", description_pt: "Convence os heróis de que estudar amanhã é melhor.", image: "docs/assets/enemies/demonio.svg" }
  organizacao:
    name: "Organization"
    name_pt: "Organização"
    palette: ["#B8860B", "#6B7280", "#2D2A24"]
    environment: "castle and royal hall"
    environment_pt: "castelo e salão real"
    background: "docs/assets/backgrounds/organizacao.svg"
    enemies:
      - { id: rei_caos, name: "Chaos Evil King", name_pt: "Rei Mau do Caos", type: rei_mau, description: "Rules kingdoms of messy drawers and lost socks.", description_pt: "Governa reinos de gavetas bagunçadas e meias perdidas.", image: "docs/assets/enemies/rei_mau.svg" }
      - { id: zumbis_bagunca, name: "Undead of Mess", name_pt: "Mortos-Vivos da Bagunça", type: morto_vivo, description: "A horde that scatters objects wherever it goes.", description_pt: "Horda que espalha objetos por onde passa.", image: "docs/assets/enemies/morto_vivo.svg" }
      - { id: golem_entulho, name: "Clutter Golem", name_pt: "Golem do Entulho", type: monstro, description: "Grows with every item put away 'just for now'.", description_pt: "Cresce com cada item guardado 'só por agora'.", image: "docs/assets/enemies/monstro.svg" }
      - { id: lich_adiamento, name: "Lich of Delay", name_pt: "Lich do Adiamento", type: lich, description: "Freezes household chores in eternal ice.", description_pt: "Congela as tarefas de casa em gelo eterno.", image: "docs/assets/enemies/lich.svg" }
  saude:
    name: "Sleep & Health"
    name_pt: "Sono e Saúde"
    palette: ["#1E3A8A", "#94A3B8", "#0F172A"]
    environment: "enchanted forest under moonlight"
    environment_pt: "floresta encantada ao luar"
    background: "docs/assets/backgrounds/saude.svg"
    enemies:
      - { id: vampiro_insonia, name: "Vampire of Insomnia", name_pt: "Vampiro da Insônia", type: morto_vivo, description: "Keeps heroes awake with glowing screens.", description_pt: "Mantém os heróis acordados com ecrãs acesos.", image: "docs/assets/enemies/morto_vivo.svg" }
      - { id: necromante_cansaco, name: "Necromancer of Exhaustion", name_pt: "Necromante do Cansaço", type: mago_mau, description: "Raises lost sleep as daytime fatigue.", description_pt: "Ressuscita o sono perdido como cansaço diurno.", image: "docs/assets/enemies/mago_mau.svg" }
      - { id: demonio_madrugada, name: "Demon of Late Night", name_pt: "Demônio da Madrugada", type: demonio, description: "Whispers 'just one more episode' at 11pm.", description_pt: "Sussurra 'só mais um episódio' às 23h.", image: "docs/assets/enemies/demonio.svg" }
      - { id: dragao_estresse, name: "Dragon of Stress", name_pt: "Dragão do Stress", type: dragao, description: "Breathes fire of piled-up worries.", description_pt: "Cospe fogo de preocupações acumuladas.", image: "docs/assets/enemies/dragao.svg" }
  financas:
    name: "Finances"
    name_pt: "Finanças"
    palette: ["#996515", "#166534", "#1C1917"]
    environment: "castle treasury"
    environment_pt: "tesouraria do castelo"
    background: "docs/assets/backgrounds/financas.svg"
    enemies:
      - { id: dragao_avarento, name: "Miser Dragon", name_pt: "Dragão Avarento", type: dragao, description: "Hoards debt like a cursed treasure.", description_pt: "Acumula dívida como tesouro amaldiçoado.", image: "docs/assets/enemies/dragao.svg" }
      - { id: demonio_desperdicio, name: "Demon of Waste", name_pt: "Demônio do Desperdício", type: demonio, description: "Turns gold coins into impulse buys.", description_pt: "Transforma moedas de ouro em compras por impulso.", image: "docs/assets/enemies/demonio.svg" }
      - { id: rei_impulso, name: "Impulse Evil King", name_pt: "Rei Mau do Impulso", type: rei_mau, description: "Decrees irresistible deals across the realm.", description_pt: "Decreta ofertas irresistíveis por todo o reino.", image: "docs/assets/enemies/rei_mau.svg" }
      - { id: espectro_assinaturas, name: "Specter of Subscriptions", name_pt: "Espectro das Assinaturas", type: morto_vivo, description: "Charges monthly fees for forgotten services.", description_pt: "Cobra mensalidades de serviços esquecidos.", image: "docs/assets/enemies/morto_vivo.svg" }
---

# Bestiary / Bestiário

**EN:** Enemies by theme for automatic collective BOSS selection. Display fields: `name`/`description` + `name_pt`/`description_pt`.

**PT:** Inimigos por tema para seleção automática de BOSS coletivo. Campos: `name`/`description` + `name_pt`/`description_pt`.

