import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Locale = 'en' | 'pt'

const STORAGE_KEY = 'fq-locale'

type Dict = Record<string, { en: string; pt: string }>

/**
 * UI chrome (not game-data fields).
 * Prefer EN/PT pairs with similar length so chrome slots don’t jump.
 */
export const ui: Dict = {
  chronicle: { en: 'Chronicle', pt: 'Crônica' },
  week: { en: 'Week', pt: 'Semana' },
  rankings: { en: 'Ranking', pt: 'Ranking' },
  admin: { en: 'Admin', pt: 'Admin' },
  heroesNav: { en: 'Heroes', pt: 'Heróis' },
  families: { en: 'Houses', pt: 'Casas' },
  createFamilyNav: { en: '+ House', pt: '+ Casa' },
  createFamilyTitle: { en: 'Found a house', pt: 'Fundar uma casa' },
  createFamilyHelp: {
    en: 'Name your family and upload a crest. The crest rides on the city map carriage.',
    pt: 'Nomeia a família e faz upload do brasão. O brasão vai na carroça do mapa.',
  },
  createFamilyCta: { en: 'Found house', pt: 'Fundar casa' },
  familyNameEn: { en: 'House name (EN)', pt: 'Nome da casa (EN)' },
  familyNamePt: { en: 'House name (PT)', pt: 'Nome da casa (PT)' },
  familyCrest: { en: 'Crest', pt: 'Brasão' },
  familyCrestHelp: {
    en: 'Upload an image. Stored in this browser until committed.',
    pt: 'Upload de imagem. Fica neste browser até commit.',
  },
  needFamilyName: { en: 'Need a house name.', pt: 'Precisa de nome da casa.' },
  familyField: { en: 'House', pt: 'Casa' },
  cityMap: { en: 'City map', pt: 'Mapa da cidade' },
  cityMapsLab: { en: 'City maps lab', pt: 'Lab mapas das cidades' },
  cityMapsLabHelp: {
    en: 'Preview all 12 maps. Drag fake XP to move the carriage and check the route layout.',
    pt: 'Pré-visualiza os 12 mapas. Arrasta XP fake para mover a carroça e validar o layout da rota.',
  },
  fakeXpPool: { en: 'Fake XP pool', pt: 'Pool XP fake' },
  mapShowLabels: { en: 'Landmark labels', pt: 'Labels dos marcos' },
  familyStrength: { en: 'House strength', pt: 'Força da casa' },
  bossDoneLabel: { en: 'BOSS done — victory!', pt: 'BOSS feito — vitória!' },
  bossDefeatRetry: {
    en: 'Defeat — recover next week',
    pt: 'Derrota — recupera na próxima semana',
  },
  noFamilyMap: {
    en: 'Found a house to see the city map.',
    pt: 'Funda uma casa para ver o mapa da cidade.',
  },
  grimoireTag: { en: 'Family grimoire', pt: 'Grimório família' },
  opening: { en: 'Opening the grimoire…', pt: 'Abrindo o grimório…' },
  error: { en: 'Error', pt: 'Erro' },
  noData: { en: 'No data', pt: 'Sem dados' },
  journeyWeek: {
    en: 'This week’s journey awaits, heroes.',
    pt: 'A jornada desta semana aguarda, heróis.',
  },
  xpMirror: {
    en: 'XP mirror (current week · hero 1)',
    pt: 'Espelho XP (semana atual · herói 1)',
  },
  monthTheme: { en: 'Month theme', pt: 'Tema do mês' },
  weeklyTarget: { en: 'Weekly target', pt: 'Meta semanal' },
  heroes: { en: 'Heroes', pt: 'Heróis' },
  collectiveBoss: { en: 'Group BOSS', pt: 'BOSS grupo' },
  weekVassal: { en: 'Weekly vassal', pt: 'Súdito da semana' },
  monthBossLabel: { en: 'Month BOSS', pt: 'BOSS do mês' },
  gloryForAll: { en: 'glory for all', pt: 'glória a todos' },
  level: { en: 'Level', pt: 'Nível' },
  ptsThisWeek: { en: 'pts / week', pt: 'pts / sem.' },
  monthMissions: { en: 'Month focus', pt: 'Foco do mês' },
  monthObjective: { en: 'Month goal', pt: 'Meta do mês' },
  dimension: { en: 'Dimension', pt: 'Dimensão' },
  subareasHelp: { en: 'Focus areas', pt: 'Áreas foco' },
  total: { en: 'Total', pt: 'Total' },
  skills: { en: 'Skills', pt: 'Skills' },
  upgradeTree: { en: 'Upgrade tree', pt: 'Árvore upgrade' },
  earnedUpgrades: { en: 'Earned upgrades', pt: 'Upgrades ganhos' },
  noUpgradesYet: {
    en: 'No upgrades yet — keep earning XP.',
    pt: 'Sem upgrades — continua a ganhar XP.',
  },
  treeUnavailable: {
    en: 'Tree unavailable.',
    pt: 'Árvore ausente.',
  },
  bodyProgress: { en: 'Class form', pt: 'Forma da classe' },
  bodyStage: { en: 'Level', pt: 'Nível' },
  classEvolutions: { en: 'All evolutions', pt: 'Todas evoluções' },
  classEvolutionsHelp: {
    en: 'Lv0 = plain clothes. Each month adds a class reward (sword, lute, hat, cloak…).',
    pt: 'Lv0 = roupa simples. Cada mês soma um prémio da classe (espada, alaúde, chapéu, capa…).',
  },
  avatarPlain: { en: 'plain', pt: 'simples' },
  youAreHere: { en: 'you', pt: 'tu' },
  avatarsNav: { en: 'Avatars', pt: 'Avatares' },
  seeAllEvolutions: { en: 'See all 12 levels', pt: 'Ver os 12 níveis' },
  testSheetsHelp: {
    en: 'Temporary test sheets (104): sex × class × Lv0–12. Open card → sheet. Delete when done.',
    pt: 'Fichas teste (104): sexo × classe × Lv0–12. Abre o card → ficha. Apaga quando acabares.',
  },
  testSheetsSeed: { en: 'Generate 104 test sheets', pt: 'Gerar 104 fichas teste' },
  testSheetsClear: { en: 'Delete test sheets', pt: 'Apagar fichas teste' },
  testSheetsCount: { en: 'test sheets in browser', pt: 'fichas teste neste browser' },
  testSheetsSeeded: {
    en: 'Created {n} test sheets. Also listed under Heroes.',
    pt: 'Criadas {n} fichas teste. Também em Heróis.',
  },
  testSheetsCleared: {
    en: 'Removed {n} test sheets.',
    pt: 'Removidas {n} fichas teste.',
  },
  monthsShort: { en: 'months', pt: 'meses' },
  sexField: { en: 'Body', pt: 'Corpo' },
  sexMale: { en: 'Male', pt: 'Masc' },
  sexFemale: { en: 'Fem.', pt: 'Fem.' },
  sheetColors: { en: 'Sheet colors', pt: 'Cores ficha' },
  textColor: { en: 'Text color', pt: 'Cor texto' },
  blockColor: { en: 'Fill color', pt: 'Cor bloco' },
  blockOpacity: {
    en: 'Opacity',
    pt: 'Opacidade',
  },
  resetSheetColors: { en: 'Reset', pt: 'Repor' },
  applySheetColors: { en: 'Confirm', pt: 'Confirmar' },
  cancelSheetColors: { en: 'Cancel', pt: 'Cancelar' },
  sheetActions: { en: 'Save / sync', pt: 'Guardar/sync' },
  weekProgress: { en: 'Weekly path', pt: 'Via semanal' },
  editAllDays: { en: 'Show all', pt: 'Ver tudo' },
  collapseDays: { en: 'By day', pt: 'Por dia' },
  heroIdentity: { en: 'Hero', pt: 'Herói' },
  objective: { en: 'Goal', pt: 'Meta' },
  extras: { en: 'Extras', pt: 'Extras' },
  extra: { en: 'Extra', pt: 'Extra' },
  remove: { en: 'Remove', pt: 'Apagar' },
  day: { en: 'Day', pt: 'Dia' },
  done: { en: 'done', pt: 'feito' },
  pending: { en: 'open', pt: 'aberto' },
  xpSquares: { en: 'XP squares', pt: 'XP squares' },
  squareFilled: { en: 'Square {n} filled', pt: 'Quadrado {n} cheio' },
  squareEmpty: { en: 'Square {n} empty', pt: 'Quadrado {n} vazio' },
  loadingSheet: { en: 'Loading sheet…', pt: 'A carregar…' },
  heroMissing: {
    en: 'Hero not found in the grimoire.',
    pt: 'Herói não achado no grimório.',
  },
  hero: { en: 'Hero', pt: 'Herói' },
  loadingWeek: { en: 'Checking week…', pt: 'A ver semana…' },
  weekIntro: {
    en: 'Family overview. Edit marks on each hero sheet (open the card).',
    pt: 'Visão da família. Edita marcas na ficha de cada herói (abre o cartão).',
  },
  noWeekly: {
    en: 'No weekly/{week}.md log yet.',
    pt: 'Sem weekly/{week}.md ainda.',
  },
  countingDeeds: { en: 'Counting deeds…', pt: 'A contar feitos…' },
  weekGlory: { en: 'Week glory', pt: 'Glória sem.' },
  loadingAdmin: { en: 'Loading panel…', pt: 'A carregar…' },
  badPin: {
    en: 'Wrong PIN. The grimoire stays sealed.',
    pt: 'PIN errado. O grimório fica selado.',
  },
  adminTitle: { en: 'Admin panel', pt: 'Painel Admin' },
  adminGate: {
    en: 'Only the grimoire’s guardian passes here.',
    pt: 'Só o guardião do grimório passa daqui.',
  },
  enter: { en: 'Enter', pt: 'Entrar' },
  monthSetup: { en: 'Month setup', pt: 'Setup mês' },
  monthSetupHelp: {
    en: 'Generates months/YYYY-MM.md for a manual commit. Objectives stay redacted.',
    pt: 'Gera months/YYYY-MM.md para commit manual. Objetivos ficam redactados.',
  },
  monthField: { en: 'Month (YYYY-MM)', pt: 'Mês (YYYY-MM)' },
  monthNumber: { en: 'Journey month nº', pt: 'Nº mês jornada' },
  weeksComma: { en: 'Weeks (comma)', pt: 'Semanas (vírg)' },
  dominantTheme: { en: 'Dominant theme', pt: 'Tema dominante' },
  objectivesPerHero: { en: 'Goals per hero', pt: 'Metas / herói' },
  theme: { en: 'Theme', pt: 'Tema' },
  threeMissions: {
    en: '3 missions (redacted, comma)',
    pt: '3 missões (redactadas, vírg)',
  },
  threeMissionsPt: {
    en: '3 missions PT (redacted, comma)',
    pt: '3 missões PT (redactadas, vírg)',
  },
  plannedBosses: { en: 'Planned BOSSes', pt: 'BOSS previstos' },
  download: { en: 'Download', pt: 'Download' },
  failRead: { en: 'Failed to read', pt: 'Falha ao ler' },
  summonTitle: { en: 'Summon hero', pt: 'Invocar herói' },
  summonPreparing: { en: 'Preparing summon…', pt: 'A preparar…' },
  summonHelp: {
    en: 'Create on demand. Lives in this browser; download the pack to commit into docs/.',
    pt: 'Cria sob demanda. Fica neste browser; descarrega o pack para commit em docs/.',
  },
  charName: { en: 'Character name', pt: 'Nome personagem' },
  classField: { en: 'Class', pt: 'Classe' },
  rankField: { en: 'Rank (hierarchy, redacted)', pt: 'Rank (hierarquia, redact.)' },
  rankHelp: {
    en: 'Family order without real names — Elder → Initiate.',
    pt: 'Ordem familiar sem nomes reais — Ancião → Iniciado.',
  },
  photoField: { en: 'Photo (optional)', pt: 'Foto (opcional)' },
  photoHelp: {
    en: 'Upload now or later. Stored in this browser; pack downloads .jpg for docs/assets/photos/.',
    pt: 'Upload agora ou depois. Fica neste browser; o pack baixa .jpg para docs/assets/photos/.',
  },
  photoFail: { en: 'Could not read that image.', pt: 'Não deu para ler a imagem.' },
  missionTheme: { en: 'Mission theme', pt: 'Tema missão' },
  threeDaily: { en: '3 daily missions (redacted)', pt: '3 missões diárias (redact.)' },
  downloadPack: {
    en: 'Download .md pack (+ photo) for the repo',
    pt: 'Download pack .md (+ foto) para o repo',
  },
  needName: {
    en: 'Every hero needs a legendary name.',
    pt: 'Todo herói precisa de nome lendário.',
  },
  needBoss: {
    en: 'No month BOSS — set up the month in Admin first.',
    pt: 'Sem BOSS do mês — faz o setup no Admin primeiro.',
  },
  summonCta: { en: 'Summon & open sheet', pt: 'Invocar e abrir ficha' },
  heroesHelp: {
    en: 'Open a sheet for details. Local heroes stay here until you commit their .md files.',
    pt: 'Abre a ficha p/ detalhes. Heróis locais ficam aqui até commit dos .md.',
  },
  summonHeroBtn: { en: '+ Summon hero', pt: '+ Invocar herói' },
  playerEditHelp: {
    en: 'Player sheet: set month focus, write daily goals and extras, mark progress. Calendar/BOSS live under Admin.',
    pt: 'Ficha do jogador: define foco do mês, escreve metas e extras diários, marca progresso. Calendário/BOSS no Admin.',
  },
  missionsPlayerOnly: {
    en: 'Each weekday has its own 3 goals — written on this sheet, stored in the weekly log.',
    pt: 'Cada dia da semana tem as suas 3 metas — escritas nesta ficha, guardadas no weekly.',
  },
  saveSheet: { en: 'Save sheet', pt: 'Guardar ficha' },
  downloadSheet: { en: 'Download .md pack', pt: 'Download pack .md' },
  savedLocal: {
    en: 'Saved in this browser. Download pack to commit into docs/.',
    pt: 'Guardado neste browser. Faz download do pack p/ commit em docs/.',
  },
  bossMark: { en: 'Mark group BOSS defeated', pt: 'Marcar BOSS grupo derrotado' },
  bossUnmark: { en: 'Unmark group BOSS', pt: 'Desmarcar BOSS grupo' },
  adminScopeHelp: {
    en: 'Admin: Calendar for dates; Campaign for BOSS + vassals; Bestiary for avatar roster.',
    pt: 'Admin: Calendário p/ datas; Campanha p/ BOSS + súditos; Bestiário p/ avatares.',
  },
  adminPlayerMissionsNote: {
    en: 'Per-hero daily goals are edited on each Player sheet (not here). Export mirrors them.',
    pt: 'Metas diárias por herói editam-se na ficha do Jogador (não aqui). O export espelha-as.',
  },
  adminTabCalendar: { en: 'Calendar', pt: 'Calendário' },
  adminTabCampaign: { en: 'Campaign', pt: 'Campanha' },
  adminTabBestiary: { en: 'Bestiary', pt: 'Bestiário' },
  bestiaryTabHelp: {
    en: 'Curated roster: 12 BOSS avatars with 3 vassals each. Pick them when editing a campaign.',
    pt: 'Lista curada: 12 avatares de BOSS com 3 súditos cada. Escolhe-os ao editar a campanha.',
  },
  bestiaryRegenHint: {
    en: 'Painted PNG bosses (realistic). Pick avatar per challenge in Campaign.',
    pt: 'Bosses PNG realistas. Escolhe avatar por desafio na Campanha.',
  },
  pickFromRoster: { en: 'Pick from bestiary', pt: 'Escolher do bestiário' },
  pickAvatar: { en: 'Pick avatar', pt: 'Escolher avatar' },
  pickAvatarHelp: {
    en: 'Tap one creature for this challenge only. Pick each week yourself.',
    pt: 'Toca num monstro só para este desafio. Escolhe cada semana tu.',
  },
  allFamilies: { en: 'All', pt: 'Todos' },
  avatarField: { en: 'Avatar', pt: 'Avatar' },
  avatarVsPhotoHelp: {
    en: 'Avatar = bestiary art for this challenge (campaign/map).',
    pt: 'Avatar = arte do bestiário para este desafio (campanha/mapa).',
  },
  close: { en: 'Close', pt: 'Fechar' },
  campaignTabHelp: {
    en: 'Last calendar week = Month BOSS. Earlier weeks = vassals (slots = weeks − 1 from Calendar).',
    pt: 'Última semana do calendário = BOSS do mês. Semanas anteriores = súditos (slots = semanas − 1 do Calendário).',
  },
  lastWeekBoss: {
    en: 'Locked to last week of month',
    pt: 'Fixo na última semana do mês',
  },
  vassalSlotsHelp: {
    en: 'Vassal slots follow Calendar week count (N−1). 5-week months unlock a 4th vassal.',
    pt: 'Slots de súdito seguem semanas do Calendário (N−1). Meses com 5 semanas abrem o 4.º súdito.',
  },
  campaignPick: { en: 'Campaign (journey month)', pt: 'Campanha (mês jornada)' },
  journeyMonth: { en: 'Journey month', pt: 'Mês jornada' },
  campaignMeta: { en: 'Campaign', pt: 'Campanha' },
  campaignWorld: { en: 'World', pt: 'Mundo' },
  campaignSeason: { en: 'Season', pt: 'Estação' },
  campaignSeasonName: { en: 'Season name', pt: 'Nome da estação' },
  campaignCity: { en: 'City', pt: 'Cidade' },
  campaignSeasonHelp: {
    en: 'Spain meteo: Jan–Feb+Dec = inverno (Ice Night), Mar–May = primavera (Living Green), Jun–Aug = verão (Fire Sun), Sep–Nov = outono (Golden Leaves).',
    pt: 'Meteo Espanha: jan–fev+dez = inverno (Noite de Gelo), mar–mai = primavera (Verde Vivo), jun–ago = verão (Sol de Fogo), set–nov = outono (Folhas de Ouro).',
  },
  seasonPrimavera: { en: 'Living Green (primavera)', pt: 'Verde Vivo (primavera)' },
  seasonVerao: { en: 'Fire Sun (verão)', pt: 'Sol de Fogo (verão)' },
  seasonOutono: { en: 'Golden Leaves (outono)', pt: 'Folhas de Ouro (outono)' },
  seasonInverno: { en: 'Ice Night (inverno)', pt: 'Noite de Gelo (inverno)' },
  campaignTitle: { en: 'Title', pt: 'Título' },
  campaignLore: { en: 'Campaign lore', pt: 'Lore da campanha' },
  campaignLoreHelp: {
    en: 'Story auto-updates from city, season, BOSS and vassal names unless you lock custom lore.',
    pt: 'História atualiza sozinha com cidade, estação, BOSS e súditos — salvo se bloqueares lore custom.',
  },
  loreCustom: {
    en: 'Custom lore (do not auto-update)',
    pt: 'Lore custom (não atualizar automaticamente)',
  },
  regenerateLore: { en: 'Regenerate lore', pt: 'Regenerar lore' },
  loreRegenerated: {
    en: 'Lore regenerated from templates (custom lock cleared). Save to keep.',
    pt: 'Lore regenerada a partir dos templates (bloqueio custom limpo). Guarda para manter.',
  },
  loreRegenHint: {
    en: 'Regenerate always rebuilds story + objectives + BOSS/vassal blurbs from names.',
    pt: 'Regenerar reconstrói sempre história + objetivos + lore BOSS/súditos a partir dos nomes.',
  },
  monthObjectiveField: { en: 'Month objective', pt: 'Objetivo do mês' },
  monthBoss: { en: 'Month BOSS', pt: 'BOSS do mês' },
  bossName: { en: 'Name', pt: 'Nome' },
  bossLore: { en: 'BOSS lore', pt: 'Lore do BOSS' },
  victoryPoints: { en: 'Victory bonus points', pt: 'Pontos extra por vitória' },
  weeklyVassals: { en: 'Weekly vassals (BOSS minions)', pt: 'Súditos semanais (do BOSS)' },
  vassal: { en: 'Vassal', pt: 'Súdito' },
  weekObjective: { en: 'Week objective', pt: 'Objetivo da semana' },
  vassalLore: { en: 'Vassal lore', pt: 'Lore do súdito' },
  commitCampaign: { en: 'Commit campaign', pt: 'Commit campanha' },
  linkCampaign: { en: 'Linked campaign', pt: 'Campanha ligada' },
  currentWeek: { en: 'Current week (YYYY-WXX)', pt: 'Semana atual (YYYY-WXX)' },
  collectiveMissions: {
    en: 'Group BOSS missions (redacted)',
    pt: 'Missões BOSS grupo (redact.)',
  },
  missionsFromSheets: {
    en: 'Daily goals (from player sheets)',
    pt: 'Metas diárias (das fichas)',
  },
  saveAdmin: { en: 'Save admin setup', pt: 'Guardar setup Adm' },
  githubToken: { en: 'GitHub token (Contents API)', pt: 'Token GitHub (Contents API)' },
  githubTokenHelp: {
    en: 'classic PAT with contents:write. Stored only in this browser (localStorage).',
    pt: 'PAT classic com contents:write. Só neste browser (localStorage).',
  },
  saveToken: { en: 'Save token', pt: 'Guardar token' },
  tokenSaved: { en: 'Token saved in this browser.', pt: 'Token guardado neste browser.' },
  tokenCleared: { en: 'Token cleared.', pt: 'Token apagado.' },
  commitGithub: { en: 'Commit month setup', pt: 'Commit setup mês' },
  commitAllSheets: { en: 'Commit all hero sheets', pt: 'Commit todas fichas' },
  commitAllSheetsHelp: {
    en: 'Uploads every hero’s current sheet from this browser (missions, week marks, photo/names) to docs/. Needs token.',
    pt: 'Sobe a ficha atual de cada herói deste browser (missões, semana, foto/nomes) para docs/. Precisa de token.',
  },
  committed: { en: 'Committed:', pt: 'Commitado:' },
  committedAllSheets: { en: 'All sheets committed:', pt: 'Fichas commitadas:' },
  needToken: {
    en: 'Set a GitHub token in Admin first (or use Download).',
    pt: 'Define token GitHub no Admin primeiro (ou usa Download).',
  },
  levelUpTitle: { en: 'Level-up after BOSS victory', pt: 'Level-up após vitória BOSS' },
  levelUpHelp: {
    en: 'After family boss_done: only heroes with ≥400 pts level up (base+extras+BOSS bonus 30/20/50). Others skip.',
    pt: 'Após boss_done da família: só heróis com ≥400 pts sobem (base+extras+bónus BOSS 30/20/50). Outros ficam.',
  },
  levelUpNeed400: {
    en: 'Need 400 pts (BOSS bonus counts after victory).',
    pt: 'Precisa 400 pts (bónus BOSS conta após vitória).',
  },
  weeksHit: { en: 'Weeks that hit target (€)', pt: 'Semanas com meta (€)' },
  rewardLabel: { en: 'Reward label (redacted)', pt: 'Label recompensa (redact.)' },
  applyLevelUp: { en: 'Apply level-up', pt: 'Aplicar level-up' },
  levelUpOk: { en: 'Level-up applied:', pt: 'Level-up aplicado:' },
  levelUpNeedBoss: {
    en: 'Mark family BOSS done first (Houses tab).',
    pt: 'Marca BOSS da família feito primeiro (aba Casas).',
  },
  adminFamilies: { en: 'Houses', pt: 'Casas' },
  familyBossDone: { en: 'BOSS activity done', pt: 'Atividade BOSS feita' },
  applyFamilyVictory: {
    en: 'Apply victory (advance + level-up)',
    pt: 'Aplicar vitória (avançar + level-up)',
  },
  applyFamilyDefeat: { en: 'Mark defeat', pt: 'Marcar derrota' },
  familyPoolLabel: { en: 'Map pool (no BOSS pts)', pt: 'Pool mapa (sem pts BOSS)' },
  familyMapCity: { en: 'Map city id', pt: 'Id cidade no mapa' },
  removeHero: { en: 'Remove', pt: 'Apagar' },
  removeHeroHelp: {
    en: 'Delete is permanent. Repo heroes need an Admin GitHub token — removes game-config entry, the whole docs/HeroiN/ folder, and photo.',
    pt: 'Exclusão é permanente. Heróis do repo precisam de token no Admin — apaga entrada no game-config, pasta docs/HeroiN/ inteira e foto.',
  },
  confirmRemoveHero: {
    en: 'DELETE this hero completely? This cannot be undone. Repo heroes: token required (config + folder + photo).',
    pt: 'APAGAR este herói por completo? Não dá para desfazer. Do repo: precisa de token (config + pasta + foto).',
  },
  heroRemovedLocal: { en: 'Local hero deleted.', pt: 'Herói local apagado.' },
  heroRemovedFully: {
    en: 'Hero fully deleted from GitHub.',
    pt: 'Herói apagado por completo no GitHub.',
  },
  filesDeleted: { en: 'file(s) removed.', pt: 'ficheiro(s) remov.' },
  needTokenToDelete: {
    en: 'Set a GitHub token in Admin first — full delete needs Contents write.',
    pt: 'Define token GitHub no Admin primeiro — delete total precisa Contents write.',
  },
  noHeroes: {
    en: 'No heroes yet. Summon one to begin.',
    pt: 'Sem heróis ainda. Invoca um p/ começar.',
  },
}

export type UiKey = keyof typeof ui

/** Max EN/PT length in `ch` — reserve slot so locale switch doesn’t resize. */
export function uiCh(...keys: UiKey[]): number {
  let n = 0
  for (const k of keys) {
    n = Math.max(n, ui[k].en.length, ui[k].pt.length)
  }
  return n
}

/** Label with reserved width (longer locale). */
export function StableT({
  k,
  also,
  className,
  align = 'center',
}: {
  k: UiKey
  /** Extra keys that share the same slot (e.g. toggle labels). */
  also?: UiKey[]
  className?: string
  align?: 'center' | 'start' | 'end'
}) {
  const { t } = useLocale()
  const ch = uiCh(k, ...(also || []))
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        minWidth: `${ch}ch`,
        maxWidth: '100%',
        textAlign: align,
      }}
    >
      {t(k)}
    </span>
  )
}

const LocaleCtx = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: UiKey, vars?: Record<string, string | number>) => string
} | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'pt' || saved === 'en' ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  function setLocale(l: Locale) {
    setLocaleState(l)
  }

  function t(key: UiKey, vars?: Record<string, string | number>) {
    let s = ui[key][locale] || ui[key].en
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(`{${k}}`, String(v))
      }
    }
    return s
  }

  return (
    <LocaleCtx.Provider value={{ locale, setLocale, t }}>{children}</LocaleCtx.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleCtx)
  if (!ctx) throw new Error('useLocale outside LocaleProvider')
  return ctx
}

/** Pick `key` or `key_pt` from a game-data object. */
export function pickL<T extends Record<string, unknown>>(
  obj: T | null | undefined,
  key: string,
  locale: Locale,
): string {
  if (!obj) return ''
  if (locale === 'pt') {
    const pt = obj[`${key}_pt`]
    if (typeof pt === 'string' && pt.trim()) return pt
  }
  const en = obj[key]
  return typeof en === 'string' ? en : ''
}

export const DAY_LABELS: Record<string, { en: string; pt: string }> = {
  seg: { en: 'Mon', pt: 'Seg' },
  ter: { en: 'Tue', pt: 'Ter' },
  qua: { en: 'Wed', pt: 'Qua' },
  qui: { en: 'Thu', pt: 'Qui' },
  sex: { en: 'Fri', pt: 'Sex' },
  sab: { en: 'Sat', pt: 'Sáb' },
  dom: { en: 'Sun', pt: 'Dom' },
}
