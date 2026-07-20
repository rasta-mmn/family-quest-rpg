---
roster:
- id: lich
  role: boss
  name: "Bone Lich"
  name_pt: "Lich dos Ossos"
  type: lich
  image: "docs/assets/bestiary/lich/boss.png"
  avatars:
  - "docs/assets/bestiary/lich/boss-avatar.png"
  - "docs/assets/bestiary/lich/boss-dark.png"
  lore: "Crowned in frost and bone — drains warmth from the living."
  lore_pt: "Coroado de gelo e osso — drena o calor dos vivos."
  vassals:
  - id: bone_skeleton
    role: vassal
    name: "Bone Skeleton"
    name_pt: "Esqueleto de Osso"
    type: morto_vivo
    image: "docs/assets/bestiary/lich/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/lich/vassal-01-alt.png"
    - "docs/assets/bestiary/lich/vassal-01-dark.png"
    lore: "Rattles forward with a rusted blade."
    lore_pt: "Avança chocalhando com lâmina enferrujada."
  - id: crypt_wight
    role: vassal
    name: "Crypt Wight"
    name_pt: "Wight da Cripta"
    type: morto_vivo
    image: "docs/assets/bestiary/lich/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/lich/vassal-02-alt.png"
    - "docs/assets/bestiary/lich/vassal-02-dark.png"
    lore: "Guards tombs that should stay shut."
    lore_pt: "Guarda túmulos que deveriam ficar fechados."
  - id: soul_thrall
    role: vassal
    name: "Soul Thrall"
    name_pt: "Servo da Alma"
    type: morto_vivo
    image: "docs/assets/bestiary/lich/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/lich/vassal-03-alt.png"
    - "docs/assets/bestiary/lich/vassal-03-dark.png"
    lore: "A bound spirit that echoes the lich will."
    lore_pt: "Espirito preso que ecoa a vontade do lich."
- id: dragon
  role: boss
  name: "Crimson Wyrm"
  name_pt: "Serpe Carmesim"
  type: dragao
  image: "docs/assets/bestiary/dragon/boss.png"
  avatars:
  - "docs/assets/bestiary/dragon/boss-avatar.png"
  - "docs/assets/bestiary/dragon/boss-dark.png"
  lore: "Hoards fire and fear beneath cracked mountains."
  lore_pt: "Acumula fogo e medo sob montanhas rachadas."
  vassals:
  - id: fire_cultist
    role: vassal
    name: "Fire Cultist"
    name_pt: "Cultista do Fogo"
    type: mago_mau
    image: "docs/assets/bestiary/dragon/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/dragon/vassal-01-alt.png"
    - "docs/assets/bestiary/dragon/vassal-01-dark.png"
    lore: "Chants until the scales glow."
    lore_pt: "Canta até as escamas brilharem."
  - id: ash_drake
    role: vassal
    name: "Ash Drake"
    name_pt: "Dragãozinho de Cinza"
    type: dragao
    image: "docs/assets/bestiary/dragon/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/dragon/vassal-02-alt.png"
    - "docs/assets/bestiary/dragon/vassal-02-dark.png"
    lore: "Small wings, hot temper."
    lore_pt: "Asas pequenas, temperamento quente."
  - id: scale_acolyte
    role: vassal
    name: "Scale Acolyte"
    name_pt: "Acólito das Escamas"
    type: mago_mau
    image: "docs/assets/bestiary/dragon/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/dragon/vassal-03-alt.png"
    - "docs/assets/bestiary/dragon/vassal-03-dark.png"
    lore: "Wears stolen dragon scales as prayer."
    lore_pt: "Usa escamas roubadas como oração."
- id: mad_king
  role: boss
  name: "Mad King"
  name_pt: "Rei Louco"
  type: rei_mau
  image: "docs/assets/bestiary/mad_king/boss.png"
  avatars:
  - "docs/assets/bestiary/mad_king/boss-avatar.png"
  - "docs/assets/bestiary/mad_king/boss-dark.png"
  lore: "Issues decrees that only madness obeys."
  lore_pt: "Emite decretos que só a loucura obedece."
  vassals:
  - id: templar_zealot
    role: vassal
    name: "Templar Zealot"
    name_pt: "Templário Zelote"
    type: rei_mau
    image: "docs/assets/bestiary/mad_king/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/mad_king/vassal-01-alt.png"
    - "docs/assets/bestiary/mad_king/vassal-01-dark.png"
    lore: "Shield first, mercy never."
    lore_pt: "Escudo primeiro, misericórdia nunca."
  - id: court_mage
    role: vassal
    name: "Court Mage"
    name_pt: "Mago da Corte"
    type: mago_mau
    image: "docs/assets/bestiary/mad_king/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/mad_king/vassal-02-alt.png"
    - "docs/assets/bestiary/mad_king/vassal-02-dark.png"
    lore: "Turns royal whims into hexes."
    lore_pt: "Transforma caprichos reais em maldições."
  - id: crown_guard
    role: vassal
    name: "Crown Guard"
    name_pt: "Guarda da Coroa"
    type: rei_mau
    image: "docs/assets/bestiary/mad_king/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/mad_king/vassal-03-alt.png"
    - "docs/assets/bestiary/mad_king/vassal-03-dark.png"
    lore: "Halberd polished on dissenters."
    lore_pt: "Alabarda polida em dissidentes."
- id: elemental
  role: boss
  name: "Storm Elemental"
  name_pt: "Elemental da Tempestade"
  type: elemental
  image: "docs/assets/bestiary/elemental/boss.png"
  avatars:
  - "docs/assets/bestiary/elemental/boss-avatar.png"
  - "docs/assets/bestiary/elemental/boss-dark.png"
  lore: "A walking thunderhead with a temper."
  lore_pt: "Uma tempestade ambulante de mau génio."
  vassals:
  - id: spark_wisp
    role: vassal
    name: "Spark Wisp"
    name_pt: "Fogo-Fátuo da Faísca"
    type: elemental
    image: "docs/assets/bestiary/elemental/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/elemental/vassal-01-alt.png"
    - "docs/assets/bestiary/elemental/vassal-01-dark.png"
    lore: "Zips, snaps, vanishes."
    lore_pt: "Zune, estala, some."
  - id: stone_shard
    role: vassal
    name: "Stone Shard"
    name_pt: "Lasca de Pedra"
    type: elemental
    image: "docs/assets/bestiary/elemental/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/elemental/vassal-02-alt.png"
    - "docs/assets/bestiary/elemental/vassal-02-dark.png"
    lore: "Earth fragment that refuses to settle."
    lore_pt: "Fragmento de terra que se recusa a assentar."
  - id: tide_sprite
    role: vassal
    name: "Tide Sprite"
    name_pt: "Duende da Maré"
    type: elemental
    image: "docs/assets/bestiary/elemental/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/elemental/vassal-03-alt.png"
    - "docs/assets/bestiary/elemental/vassal-03-dark.png"
    lore: "Pulls heroes off balance with every wave."
    lore_pt: "Desequilibra heróis a cada onda."
- id: beast
  role: boss
  name: "Dire Beast"
  name_pt: "Besta Dire"
  type: besta
  image: "docs/assets/bestiary/beast/boss.png"
  avatars:
  - "docs/assets/bestiary/beast/boss-avatar.png"
  - "docs/assets/bestiary/beast/boss-dark.png"
  lore: "Claws carved from hunger itself."
  lore_pt: "Garras talhadas da própria fome."
  vassals:
  - id: claw_pup
    role: vassal
    name: "Claw Pup"
    name_pt: "Filhote de Garra"
    type: besta
    image: "docs/assets/bestiary/beast/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/beast/vassal-01-alt.png"
    - "docs/assets/bestiary/beast/vassal-01-dark.png"
    lore: "Small, loud, all teeth."
    lore_pt: "Pequeno, barulhento, só dentes."
  - id: horn_brute
    role: vassal
    name: "Horn Brute"
    name_pt: "Bruto de Chifre"
    type: besta
    image: "docs/assets/bestiary/beast/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/beast/vassal-02-alt.png"
    - "docs/assets/bestiary/beast/vassal-02-dark.png"
    lore: "Charges first, thinks never."
    lore_pt: "Investe primeiro, nunca pensa."
  - id: shell_crab
    role: vassal
    name: "Shell Crab"
    name_pt: "Caranguejo de Concha"
    type: besta
    image: "docs/assets/bestiary/beast/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/beast/vassal-03-alt.png"
    - "docs/assets/bestiary/beast/vassal-03-dark.png"
    lore: "Armor that pinches back."
    lore_pt: "Armadura que belisca de volta."
- id: demon
  role: boss
  name: "Infernal Demon"
  name_pt: "Demônio Infernal"
  type: demonio
  image: "docs/assets/bestiary/demon/boss.png"
  avatars:
  - "docs/assets/bestiary/demon/boss-avatar.png"
  - "docs/assets/bestiary/demon/boss-dark.png"
  lore: "Bargains in ash and broken promises."
  lore_pt: "Negocia em cinza e promessas partidas."
  vassals:
  - id: imp_ember
    role: vassal
    name: "Ember Imp"
    name_pt: "Diabrete de Brasa"
    type: demonio
    image: "docs/assets/bestiary/demon/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/demon/vassal-01-alt.png"
    - "docs/assets/bestiary/demon/vassal-01-dark.png"
    lore: "Tiny horns, big smirk."
    lore_pt: "Chifres minúsculos, sorriso enorme."
  - id: brimstone_hound
    role: vassal
    name: "Brimstone Hound"
    name_pt: "Cão de Enxofre"
    type: demonio
    image: "docs/assets/bestiary/demon/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/demon/vassal-02-alt.png"
    - "docs/assets/bestiary/demon/vassal-02-dark.png"
    lore: "Tracks fear by scent."
    lore_pt: "Fareja o medo."
  - id: horned_thrall
    role: vassal
    name: "Horned Thrall"
    name_pt: "Servo Cornudo"
    type: demonio
    image: "docs/assets/bestiary/demon/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/demon/vassal-03-alt.png"
    - "docs/assets/bestiary/demon/vassal-03-dark.png"
    lore: "Bound by a seal that still burns."
    lore_pt: "Preso por um selo que ainda queima."
- id: specter
  role: boss
  name: "Wailing Specter"
  name_pt: "Espectro Uivante"
  type: morto_vivo
  image: "docs/assets/bestiary/specter/boss.png"
  avatars:
  - "docs/assets/bestiary/specter/boss-avatar.png"
  - "docs/assets/bestiary/specter/boss-dark.png"
  lore: "Sings unfinished goodbyes through fog."
  lore_pt: "Canta adeuses inacabados através da névoa."
  vassals:
  - id: mist_shade
    role: vassal
    name: "Mist Shade"
    name_pt: "Sombra da Névoa"
    type: morto_vivo
    image: "docs/assets/bestiary/specter/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/specter/vassal-01-alt.png"
    - "docs/assets/bestiary/specter/vassal-01-dark.png"
    lore: "Half-seen, fully chilling."
    lore_pt: "Meio vista, totalmente gelada."
  - id: chain_ghost
    role: vassal
    name: "Chain Ghost"
    name_pt: "Fantasma das Correntes"
    type: morto_vivo
    image: "docs/assets/bestiary/specter/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/specter/vassal-02-alt.png"
    - "docs/assets/bestiary/specter/vassal-02-dark.png"
    lore: "Drags iron regrets behind it."
    lore_pt: "Arrasta arrependimentos de ferro."
  - id: echo_wraith
    role: vassal
    name: "Echo Wraith"
    name_pt: "Espectro do Eco"
    type: morto_vivo
    image: "docs/assets/bestiary/specter/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/specter/vassal-03-alt.png"
    - "docs/assets/bestiary/specter/vassal-03-dark.png"
    lore: "Repeats your worst thought louder."
    lore_pt: "Repete o teu pior pensamento mais alto."
- id: golem
  role: boss
  name: "Ruin Golem"
  name_pt: "Golem das Ruínas"
  type: monstro
  image: "docs/assets/bestiary/golem/boss.png"
  avatars:
  - "docs/assets/bestiary/golem/boss-avatar.png"
  - "docs/assets/bestiary/golem/boss-dark.png"
  lore: "Built from fallen walls and stubborn rock."
  lore_pt: "Feito de muros caídos e pedra teimosa."
  vassals:
  - id: rubble_chunk
    role: vassal
    name: "Rubble Chunk"
    name_pt: "Pedaço de Entulho"
    type: monstro
    image: "docs/assets/bestiary/golem/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/golem/vassal-01-alt.png"
    - "docs/assets/bestiary/golem/vassal-01-dark.png"
    lore: "Walks like a landslide."
    lore_pt: "Anda como um deslizamento."
  - id: rune_core
    role: vassal
    name: "Rune Core"
    name_pt: "Núcleo de Runas"
    type: monstro
    image: "docs/assets/bestiary/golem/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/golem/vassal-02-alt.png"
    - "docs/assets/bestiary/golem/vassal-02-dark.png"
    lore: "Heart of stone, lit with glyphs."
    lore_pt: "Coração de pedra, aceso com glifos."
  - id: iron_fist
    role: vassal
    name: "Iron Fist"
    name_pt: "Punho de Ferro"
    type: monstro
    image: "docs/assets/bestiary/golem/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/golem/vassal-03-alt.png"
    - "docs/assets/bestiary/golem/vassal-03-dark.png"
    lore: "One purpose: smash."
    lore_pt: "Um propósito: esmagar."
- id: evil_mage
  role: boss
  name: "Void Mage"
  name_pt: "Mago do Vazio"
  type: mago_mau
  image: "docs/assets/bestiary/evil_mage/boss.png"
  avatars:
  - "docs/assets/bestiary/evil_mage/boss-avatar.png"
  - "docs/assets/bestiary/evil_mage/boss-dark.png"
  lore: "Reads tomes that erase the reader first."
  lore_pt: "Lê tomos que apagam primeiro o leitor."
  vassals:
  - id: apprentice_shade
    role: vassal
    name: "Apprentice Shade"
    name_pt: "Aprendiz Sombra"
    type: mago_mau
    image: "docs/assets/bestiary/evil_mage/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/evil_mage/vassal-01-alt.png"
    - "docs/assets/bestiary/evil_mage/vassal-01-dark.png"
    lore: "Still learning which hexes explode."
    lore_pt: "Ainda a aprender quais hexes explodem."
  - id: tome_familiar
    role: vassal
    name: "Tome Familiar"
    name_pt: "Familiar do Tomo"
    type: mago_mau
    image: "docs/assets/bestiary/evil_mage/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/evil_mage/vassal-02-alt.png"
    - "docs/assets/bestiary/evil_mage/vassal-02-dark.png"
    lore: "A book with teeth and opinions."
    lore_pt: "Um livro com dentes e opiniões."
  - id: hex_puppet
    role: vassal
    name: "Hex Puppet"
    name_pt: "Marioneta do Hex"
    type: mago_mau
    image: "docs/assets/bestiary/evil_mage/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/evil_mage/vassal-03-alt.png"
    - "docs/assets/bestiary/evil_mage/vassal-03-dark.png"
    lore: "Strings of violet curse-thread."
    lore_pt: "Fios de maldição violeta."
- id: forest_spirit
  role: boss
  name: "Thorn Spirit"
  name_pt: "Espírito do Espinho"
  type: espirito
  image: "docs/assets/bestiary/forest_spirit/boss.png"
  avatars:
  - "docs/assets/bestiary/forest_spirit/boss-avatar.png"
  - "docs/assets/bestiary/forest_spirit/boss-dark.png"
  lore: "Roots remember every axe wound."
  lore_pt: "As raízes lembram cada ferida de machado."
  vassals:
  - id: moss_sprite
    role: vassal
    name: "Moss Sprite"
    name_pt: "Duende do Musgo"
    type: espirito
    image: "docs/assets/bestiary/forest_spirit/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/forest_spirit/vassal-01-alt.png"
    - "docs/assets/bestiary/forest_spirit/vassal-01-dark.png"
    lore: "Soft steps, sharp thorns."
    lore_pt: "Passos suaves, espinhos afiados."
  - id: vine_wisp
    role: vassal
    name: "Vine Wisp"
    name_pt: "Fogo-Fátuo de Vinha"
    type: espirito
    image: "docs/assets/bestiary/forest_spirit/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/forest_spirit/vassal-02-alt.png"
    - "docs/assets/bestiary/forest_spirit/vassal-02-dark.png"
    lore: "Coils around ankles mid-step."
    lore_pt: "Enrola-se nos tornozelos a meio do passo."
  - id: root_guardian
    role: vassal
    name: "Root Guardian"
    name_pt: "Guardião das Raízes"
    type: espirito
    image: "docs/assets/bestiary/forest_spirit/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/forest_spirit/vassal-03-alt.png"
    - "docs/assets/bestiary/forest_spirit/vassal-03-dark.png"
    lore: "Ancient bark, patient rage."
    lore_pt: "Casca antiga, raiva paciente."
- id: yokai
  role: boss
  name: "Masked Yokai"
  name_pt: "Yokai Mascarado"
  type: yokai
  image: "docs/assets/bestiary/yokai/boss.png"
  avatars:
  - "docs/assets/bestiary/yokai/boss-avatar.png"
  - "docs/assets/bestiary/yokai/boss-dark.png"
  lore: "Smiles with a mask that never blinks."
  lore_pt: "Sorri com uma máscara que nunca pisca."
  vassals:
  - id: fox_trickster
    role: vassal
    name: "Fox Trickster"
    name_pt: "Raposa Trapaceira"
    type: yokai
    image: "docs/assets/bestiary/yokai/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/yokai/vassal-01-alt.png"
    - "docs/assets/bestiary/yokai/vassal-01-dark.png"
    lore: "Three tails of mischief."
    lore_pt: "Três caudas de travessura."
  - id: lantern_spirit
    role: vassal
    name: "Lantern Spirit"
    name_pt: "Espírito da Lanterna"
    type: yokai
    image: "docs/assets/bestiary/yokai/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/yokai/vassal-02-alt.png"
    - "docs/assets/bestiary/yokai/vassal-02-dark.png"
    lore: "Leads wanderers off the path."
    lore_pt: "Leva andarilhos para fora do caminho."
  - id: paper_oni
    role: vassal
    name: "Paper Oni"
    name_pt: "Oni de Papel"
    type: yokai
    image: "docs/assets/bestiary/yokai/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/yokai/vassal-03-alt.png"
    - "docs/assets/bestiary/yokai/vassal-03-dark.png"
    lore: "Folded rage, sharp corners."
    lore_pt: "Raiva dobrada, cantos afiados."
- id: cockatrice
  role: boss
  name: "Cockatrice"
  name_pt: "Cocatriz"
  type: monstro
  image: "docs/assets/bestiary/cockatrice/boss.png"
  avatars:
  - "docs/assets/bestiary/cockatrice/boss-avatar.png"
  - "docs/assets/bestiary/cockatrice/boss-dark.png"
  lore: "A glance that turns courage to stone."
  lore_pt: "Um olhar que transforma coragem em pedra."
  vassals:
  - id: basilisk_chick
    role: vassal
    name: "Basilisk Chick"
    name_pt: "Pintainho Basilisco"
    type: monstro
    image: "docs/assets/bestiary/cockatrice/vassal-01.png"
    avatars:
    - "docs/assets/bestiary/cockatrice/vassal-01-alt.png"
    - "docs/assets/bestiary/cockatrice/vassal-01-dark.png"
    lore: "Tiny stare, growing danger."
    lore_pt: "Olhar minúsculo, perigo crescente."
  - id: stone_gaze_imp
    role: vassal
    name: "Stone-Gaze Imp"
    name_pt: "Diabrete do Olhar de Pedra"
    type: monstro
    image: "docs/assets/bestiary/cockatrice/vassal-02.png"
    avatars:
    - "docs/assets/bestiary/cockatrice/vassal-02-alt.png"
    - "docs/assets/bestiary/cockatrice/vassal-02-dark.png"
    lore: "Practices petrify on beetles."
    lore_pt: "Treina petrificar em escaravelhos."
  - id: plume_harpy
    role: vassal
    name: "Plume Harpy"
    name_pt: "Harpia de Penas"
    type: monstro
    image: "docs/assets/bestiary/cockatrice/vassal-03.png"
    avatars:
    - "docs/assets/bestiary/cockatrice/vassal-03-alt.png"
    - "docs/assets/bestiary/cockatrice/vassal-03-dark.png"
    lore: "Screeches the hunt into motion."
    lore_pt: "Guinchando, põe a caça em movimento."
---

# Bestiary Roster

12 BOSS + 3 vassals. Painted `.png` preferred when present; SVG fallback.
Active display: `image` → main png. Selectable extras: `avatars` (exactly 2 per boss/vassal: alt/avatar + dark) — never delete.
Admin → Bestiário / Campanha → Escolher avatar.
Regen SVG silhouettes: `node docs/assets/bestiary/generate-bestiary.mjs`
