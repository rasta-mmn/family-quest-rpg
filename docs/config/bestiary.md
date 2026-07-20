---
themes:
  mental:
    name: "Mental & Emotional"
    name_pt: "Mental e emocional"
    palette: ["#7C3AED", "#C4B5FD", "#1E1B2E"]
    environment: "mage tower with floating books"
    environment_pt: "torre do mago com livros flutuantes"
    background: "docs/assets/backgrounds/mental.jpg"
    subareas:
      - { id: inteligencia_emocional, name: "Emotional intelligence", name_pt: "Inteligência emocional" }
      - { id: autoconhecimento, name: "Self-knowledge", name_pt: "Autoconhecimento" }
      - { id: resiliencia, name: "Psychological resilience", name_pt: "Resiliência psicológica" }
      - { id: agilidade_cognitiva, name: "Cognitive agility", name_pt: "Agilidade cognitiva" }
    enemies:
      - { id: espectro_ansiedade, name: "Specter of Anxiety", name_pt: "Espectro da Ansiedade", type: morto_vivo, description: "Whispers worst-case futures until focus shatters.", description_pt: "Sussurra futuros piores até o foco quebrar.", image: "docs/assets/enemies/morto_vivo.png" }
      - { id: demonio_duvida, name: "Demon of Doubt", name_pt: "Demônio da Dúvida", type: demonio, description: "Turns every choice into an endless spiral.", description_pt: "Transforma cada escolha numa espiral sem fim.", image: "docs/assets/enemies/demonio.png" }
      - { id: mago_confusao, name: "Mage of Confusion", name_pt: "Mago da Confusão", type: mago_mau, description: "Casts fog over feelings and thoughts alike.", description_pt: "Lança névoa sobre sentimentos e pensamentos.", image: "docs/assets/enemies/mago_mau.png" }
      - { id: dragao_estresse_mental, name: "Dragon of Mental Stress", name_pt: "Dragão do Stress Mental", type: dragao, description: "Breathes fire made of piled-up worries.", description_pt: "Cospe fogo de preocupações acumuladas.", image: "docs/assets/enemies/dragao.png" }
  fisico:
    name: "Physical & Biological"
    name_pt: "Física e biológica"
    palette: ["#C92A2A", "#A87900", "#3D2B1F"]
    environment: "battle arena and forge"
    environment_pt: "arena de batalha e ferraria"
    background: "docs/assets/backgrounds/fisico.jpg"
    subareas:
      - { id: saude_preventiva, name: "Preventive health", name_pt: "Saúde preventiva" }
      - { id: nutricao, name: "Nutrition & hydration", name_pt: "Nutrição e hidratação" }
      - { id: condicionamento, name: "Physical conditioning", name_pt: "Condicionamento físico" }
      - { id: sono, name: "Sleep hygiene", name_pt: "Higiene do sono" }
    enemies:
      - { id: dragao_preguica, name: "Dragon of Laziness", name_pt: "Dragão da Preguiça", type: dragao, description: "Sleeps atop a hoard of snoozed alarms.", description_pt: "Dorme sobre um tesouro de alarmes adiados.", image: "docs/assets/enemies/dragao.png" }
      - { id: golem_sedentario, name: "Sedentary Golem", name_pt: "Golem Sedentário", type: monstro, description: "Made of stone and sofa — immobilizes whoever sits beside it.", description_pt: "Feito de pedra e sofá — imobiliza quem se senta ao lado.", image: "docs/assets/enemies/monstro.png" }
      - { id: lich_fadiga, name: "Lich of Fatigue", name_pt: "Lich da Fadiga", type: lich, description: "Drains the life energy of those who stay still.", description_pt: "Drena a energia vital de quem permanece parado.", image: "docs/assets/enemies/lich.png" }
      - { id: cavaleiro_cansaco, name: "Dark Knight of Exhaustion", name_pt: "Cavaleiro Negro do Cansaço", type: rei_mau, description: "Challenges the heroes at dusk, when willpower weakens.", description_pt: "Desafia os heróis ao entardecer, quando a vontade enfraquece.", image: "docs/assets/enemies/rei_mau.png" }
  profissional:
    name: "Professional & Intellectual"
    name_pt: "Profissional e intelectual"
    palette: ["#2563EB", "#93C5FD", "#0F172A"]
    environment: "arcane library and mage tower"
    environment_pt: "biblioteca arcana e torre de mago"
    background: "docs/assets/backgrounds/profissional.jpg"
    subareas:
      - { id: carreira, name: "Career & vocation", name_pt: "Carreira e vocação" }
      - { id: educacao, name: "Continuous education", name_pt: "Educação contínua" }
      - { id: produtividade, name: "Productivity", name_pt: "Produtividade" }
    enemies:
      - { id: mago_ignorancia, name: "Evil Mage of Ignorance", name_pt: "Mago Maligno da Ignorância", type: mago_mau, description: "Casts confusion spells over open books.", description_pt: "Lança feitiços de confusão sobre livros abertos.", image: "docs/assets/enemies/mago_mau.png" }
      - { id: espectro_distracao, name: "Specter of Distraction", name_pt: "Espectro da Distração", type: morto_vivo, description: "Haunts screens and notifications with every page read.", description_pt: "Assombra ecrãs e notificações a cada página lida.", image: "docs/assets/enemies/morto_vivo.png" }
      - { id: dragao_esquecimento, name: "Dragon of Forgetfulness", name_pt: "Dragão do Esquecimento", type: dragao, description: "Devours knowledge that goes unreviewed.", description_pt: "Devora o conhecimento que não é revisto.", image: "docs/assets/enemies/dragao.png" }
      - { id: demonio_amanha, name: "Demon of Tomorrow", name_pt: "Demônio do Amanhã", type: demonio, description: "Convinces heroes that studying tomorrow is better.", description_pt: "Convence os heróis de que estudar amanhã é melhor.", image: "docs/assets/enemies/demonio.png" }
  financas:
    name: "Financial"
    name_pt: "Financeira"
    palette: ["#996515", "#166534", "#1C1917"]
    environment: "castle treasury"
    environment_pt: "tesouraria do castelo"
    background: "docs/assets/backgrounds/financas.jpg"
    subareas:
      - { id: orcamento, name: "Budget management", name_pt: "Gestão de orçamento" }
      - { id: patrimonio, name: "Wealth building", name_pt: "Acumulação de patrimônio" }
      - { id: seguranca, name: "Financial safety", name_pt: "Segurança financeira" }
    enemies:
      - { id: dragao_avarento, name: "Miser Dragon", name_pt: "Dragão Avarento", type: dragao, description: "Hoards debt like a cursed treasure.", description_pt: "Acumula dívida como tesouro amaldiçoado.", image: "docs/assets/enemies/dragao.png" }
      - { id: demonio_desperdicio, name: "Demon of Waste", name_pt: "Demônio do Desperdício", type: demonio, description: "Turns gold coins into impulse buys.", description_pt: "Transforma moedas de ouro em compras por impulso.", image: "docs/assets/enemies/demonio.png" }
      - { id: rei_impulso, name: "Impulse Evil King", name_pt: "Rei Mau do Impulso", type: rei_mau, description: "Decrees irresistible deals across the realm.", description_pt: "Decreta ofertas irresistíveis por todo o reino.", image: "docs/assets/enemies/rei_mau.png" }
      - { id: espectro_assinaturas, name: "Specter of Subscriptions", name_pt: "Espectro das Assinaturas", type: morto_vivo, description: "Charges monthly fees for forgotten services.", description_pt: "Cobra mensalidades de serviços esquecidos.", image: "docs/assets/enemies/morto_vivo.png" }
  social:
    name: "Social & Relational"
    name_pt: "Social e relacional"
    palette: ["#15803D", "#86EFAC", "#14532D"]
    environment: "tavern with friends at a long table"
    environment_pt: "taverna com amigos numa mesa longa"
    background: "docs/assets/backgrounds/social.jpg"
    subareas:
      - { id: familia, name: "Family bonds", name_pt: "Relações familiares" }
      - { id: amoroso, name: "Romantic relationship", name_pt: "Relacionamento amoroso" }
      - { id: circulo, name: "Social circle", name_pt: "Círculo social" }
      - { id: networking, name: "Professional networking", name_pt: "Networking profissional" }
    enemies:
      - { id: espectro_isolamento, name: "Specter of Isolation", name_pt: "Espectro do Isolamento", type: morto_vivo, description: "Seals doors between hearts with silence.", description_pt: "Sela portas entre corações com silêncio.", image: "docs/assets/enemies/morto_vivo.png" }
      - { id: demonio_inveja, name: "Demon of Envy", name_pt: "Demônio da Inveja", type: demonio, description: "Poisons friendships with comparison.", description_pt: "Envenena amizades com comparação.", image: "docs/assets/enemies/demonio.png" }
      - { id: rei_orgulho, name: "King of Pride", name_pt: "Rei do Orgulho", type: rei_mau, description: "Forbids apologies in his court.", description_pt: "Proíbe pedidos de desculpa na sua corte.", image: "docs/assets/enemies/rei_mau.png" }
      - { id: golem_muro, name: "Wall Golem", name_pt: "Golem do Muro", type: monstro, description: "Grows taller with every unspoken word.", description_pt: "Cresce com cada palavra não dita.", image: "docs/assets/enemies/monstro.png" }
  recreativo:
    name: "Recreational & Cultural"
    name_pt: "Recreativa e cultural"
    palette: ["#EA580C", "#FDBA74", "#431407"]
    environment: "festival with banners and instruments"
    environment_pt: "festival com bandeiras e instrumentos"
    background: "docs/assets/backgrounds/recreativo.jpg"
    subareas:
      - { id: hobbies, name: "Hobbies & pastimes", name_pt: "Hobbies e passatempos" }
      - { id: lazer, name: "Leisure & rest", name_pt: "Lazer e descanso" }
    enemies:
      - { id: demonio_rotina, name: "Demon of Grind", name_pt: "Demônio da Rotina", type: demonio, description: "Steals joy and calls it productivity.", description_pt: "Rouba a alegria e chama-lhe produtividade.", image: "docs/assets/enemies/demonio.png" }
      - { id: espectro_tedio, name: "Specter of Boredom", name_pt: "Espectro do Tédio", type: morto_vivo, description: "Turns free time into gray fog.", description_pt: "Transforma tempo livre em névoa cinzenta.", image: "docs/assets/enemies/morto_vivo.png" }
      - { id: dragao_trabalho, name: "Dragon of Overwork", name_pt: "Dragão do Excesso de Trabalho", type: dragao, description: "Guards the calendar and forbids play.", description_pt: "Guarda o calendário e proíbe o brincar.", image: "docs/assets/enemies/dragao.png" }
      - { id: lich_culpa, name: "Lich of Guilt", name_pt: "Lich da Culpa", type: lich, description: "Freezes hobbies with 'you should be working'.", description_pt: "Congela hobbies com 'devias estar a trabalhar'.", image: "docs/assets/enemies/lich.png" }
  espiritual:
    name: "Spiritual & Existential"
    name_pt: "Espiritual e existencial"
    palette: ["#1E3A8A", "#94A3B8", "#0F172A"]
    environment: "enchanted forest under moonlight"
    environment_pt: "floresta encantada ao luar"
    background: "docs/assets/backgrounds/espiritual.jpg"
    subareas:
      - { id: proposito, name: "Life purpose", name_pt: "Propósito de vida" }
      - { id: conexao, name: "Transcendent connection", name_pt: "Conexão transcendental" }
      - { id: legado, name: "Contribution & legacy", name_pt: "Contribuição e legado" }
    enemies:
      - { id: espectro_vazio, name: "Specter of Emptiness", name_pt: "Espectro do Vazio", type: morto_vivo, description: "Whispers that nothing matters.", description_pt: "Sussurra que nada importa.", image: "docs/assets/enemies/morto_vivo.png" }
      - { id: demonio_apuracao, name: "Demon of Rush", name_pt: "Demônio da Pressa", type: demonio, description: "Never lets heroes pause to listen within.", description_pt: "Nunca deixa os heróis pausar para ouvir por dentro.", image: "docs/assets/enemies/demonio.png" }
      - { id: mago_cinismo, name: "Mage of Cynicism", name_pt: "Mago do Cinismo", type: mago_mau, description: "Mocks purpose until hope fades.", description_pt: "Zomba do propósito até a esperança apagar.", image: "docs/assets/enemies/mago_mau.png" }
      - { id: dragao_esquecimento_alma, name: "Dragon of Forgotten Soul", name_pt: "Dragão da Alma Esquecida", type: dragao, description: "Hoards meaning in a sealed cave.", description_pt: "Guarda o sentido numa caverna selada.", image: "docs/assets/enemies/dragao.png" }
---

# Bestiary / Bestiário

**EN:** Seven life dimensions. Each has subareas (UI help) + 4 enemies for collective BOSS.  
**PT:** Sete dimensões de vida. Cada uma tem subáreas (ajuda UI) + 4 inimigos para BOSS coletivo.
