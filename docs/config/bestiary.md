---
themes:
  alimentacao:
    name: "Alimentação"
    palette: ["#E8590C", "#2F9E44", "#5C3A1E"]
    environment: "taverna medieval com banquetes"
    background: "docs/assets/backgrounds/alimentacao.svg"
    enemies:
      - { id: demonio_gula, name: "Demônio da Gula", type: demonio, description: "Sussurra desejos de doces e frituras ao ouvido dos heróis.", image: "docs/assets/enemies/demonio.svg" }
      - { id: hidra_acucar, name: "Hidra do Açúcar", type: monstro, description: "Corte uma cabeça (doce) e duas aparecem — só a disciplina a derrota.", image: "docs/assets/enemies/monstro.svg" }
      - { id: rei_glutao, name: "Rei Glutão", type: rei_mau, description: "Tirano que ordena banquetes intermináveis à meia-noite.", image: "docs/assets/enemies/rei_mau.svg" }
      - { id: zumbi_faminto, name: "Zumbi Faminto", type: morto_vivo, description: "Vagueia pela cozinha à procura de restos fora de hora.", image: "docs/assets/enemies/morto_vivo.svg" }
  treino:
    name: "Treino"
    palette: ["#C92A2A", "#A87900", "#3D2B1F"]
    environment: "arena de batalha e ferraria"
    background: "docs/assets/backgrounds/treino.svg"
    enemies:
      - { id: dragao_preguica, name: "Dragão da Preguiça", type: dragao, description: "Dorme sobre um tesouro de despertadores adiados.", image: "docs/assets/enemies/dragao.svg" }
      - { id: golem_sedentario, name: "Golem Sedentário", type: monstro, description: "Feito de pedra e sofá, imobiliza quem senta ao seu lado.", image: "docs/assets/enemies/monstro.svg" }
      - { id: lich_fadiga, name: "Lich da Fadiga", type: lich, description: "Drena a energia vital de quem não se movimenta.", image: "docs/assets/enemies/lich.svg" }
      - { id: cavaleiro_cansaco, name: "Cavaleiro Negro do Cansaço", type: rei_mau, description: "Desafia os heróis ao anoitecer, quando a vontade enfraquece.", image: "docs/assets/enemies/rei_mau.svg" }
  estudo:
    name: "Estudo"
    palette: ["#4263EB", "#7048E8", "#1E2A5C"]
    environment: "biblioteca arcana e torre de mago"
    background: "docs/assets/backgrounds/estudo.svg"
    enemies:
      - { id: mago_ignorancia, name: "Mago Maligno da Ignorância", type: mago_mau, description: "Lança feitiços de confusão sobre livros abertos.", image: "docs/assets/enemies/mago_mau.svg" }
      - { id: espectro_distracao, name: "Espectro da Distração", type: morto_vivo, description: "Assombra ecrãs e notificações a cada página lida.", image: "docs/assets/enemies/morto_vivo.svg" }
      - { id: dragao_esquecimento, name: "Dragão do Esquecimento", type: dragao, description: "Devora o conhecimento não revisado.", image: "docs/assets/enemies/dragao.svg" }
      - { id: demonio_amanha, name: "Demônio do Amanhã", type: demonio, description: "Convence os heróis de que estudar amanhã é melhor.", image: "docs/assets/enemies/demonio.svg" }
  organizacao:
    name: "Organização"
    palette: ["#B8860B", "#6B7280", "#2D2A24"]
    environment: "castelo e salão real"
    background: "docs/assets/backgrounds/organizacao.svg"
    enemies:
      - { id: rei_caos, name: "Rei Mau do Caos", type: rei_mau, description: "Governa reinos de gavetas desarrumadas e meias perdidas.", image: "docs/assets/enemies/rei_mau.svg" }
      - { id: zumbis_bagunca, name: "Mortos-Vivos da Bagunça", type: morto_vivo, description: "Horda que espalha objetos por onde passa.", image: "docs/assets/enemies/morto_vivo.svg" }
      - { id: golem_entulho, name: "Golem do Entulho", type: monstro, description: "Cresce a cada objeto guardado 'só por agora'.", image: "docs/assets/enemies/monstro.svg" }
      - { id: lich_adiamento, name: "Lich do Adiamento", type: lich, description: "Congela tarefas domésticas em gelo eterno.", image: "docs/assets/enemies/lich.svg" }
  saude:
    name: "Sono & Saúde"
    palette: ["#1E3A8A", "#94A3B8", "#0F172A"]
    environment: "floresta encantada ao luar"
    background: "docs/assets/backgrounds/saude.svg"
    enemies:
      - { id: vampiro_insonia, name: "Vampiro da Insônia", type: morto_vivo, description: "Mantém os heróis acordados com ecrãs brilhantes.", image: "docs/assets/enemies/morto_vivo.svg" }
      - { id: necromante_cansaco, name: "Necromante do Cansaço", type: mago_mau, description: "Ressuscita o sono perdido como exaustão diurna.", image: "docs/assets/enemies/mago_mau.svg" }
      - { id: demonio_madrugada, name: "Demônio da Madrugada", type: demonio, description: "Sussurra 'só mais um episódio' às 23h.", image: "docs/assets/enemies/demonio.svg" }
      - { id: dragao_estresse, name: "Dragão do Estresse", type: dragao, description: "Cospe fogo de preocupações acumuladas.", image: "docs/assets/enemies/dragao.svg" }
  financas:
    name: "Finanças"
    palette: ["#996515", "#166534", "#1C1917"]
    environment: "tesouraria do castelo"
    background: "docs/assets/backgrounds/financas.svg"
    enemies:
      - { id: dragao_avarento, name: "Dragão Avarento", type: dragao, description: "Acumula dívidas como tesouro maldito.", image: "docs/assets/enemies/dragao.svg" }
      - { id: demonio_desperdicio, name: "Demônio do Desperdício", type: demonio, description: "Transforma moedas de ouro em compras por impulso.", image: "docs/assets/enemies/demonio.svg" }
      - { id: rei_impulso, name: "Rei Mau do Impulso", type: rei_mau, description: "Decreta promoções irresistíveis em todo o reino.", image: "docs/assets/enemies/rei_mau.svg" }
      - { id: espectro_assinaturas, name: "Espectro das Assinaturas", type: morto_vivo, description: "Cobra mensalidades de serviços esquecidos.", image: "docs/assets/enemies/morto_vivo.svg" }
---

# Bestiário

Os inimigos do Family Quest RPG são sempre **dragões, monstros, demônios, reis maus, magos malignos, liches e mortos-vivos**. Cada tema de objetivos tem 4 inimigos — um por semana do mês.

Quando o ADM define o **tema dominante** do mês no setup, o sistema seleciona automaticamente os 4 BOSS coletivos da lista do tema (na ordem, podendo ser trocados manualmente).

Cada BOSS é um **objetivo coletivo da semana**: a família inteira deve cumpri-lo junta. Se derrotado, **todos os heróis ganham +30 pontos**.
