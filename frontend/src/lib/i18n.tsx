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

/** UI chrome (not game-data fields). */
export const ui: Dict = {
  chronicle: { en: 'Chronicle', pt: 'Crônica' },
  week: { en: 'Week', pt: 'Semana' },
  rankings: { en: 'Rankings', pt: 'Ranking' },
  admin: { en: 'Admin', pt: 'ADM' },
  heroesNav: { en: 'Heroes', pt: 'Heróis' },
  grimoireTag: { en: 'Family grimoire', pt: 'Grimório da família' },
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
  collectiveBoss: { en: 'Collective BOSS', pt: 'BOSS coletivo' },
  gloryForAll: { en: 'glory for everyone', pt: 'de glória para todos' },
  level: { en: 'Level', pt: 'Nível' },
  ptsThisWeek: { en: 'pts this week', pt: 'pts esta semana' },
  monthMissions: { en: 'Month missions', pt: 'Missões do mês' },
  total: { en: 'Total', pt: 'Total' },
  skills: { en: 'Skills', pt: 'Skills' },
  upgradeTree: { en: 'Upgrade tree', pt: 'Árvore de upgrades' },
  treeUnavailable: {
    en: 'Upgrade tree unavailable.',
    pt: 'Árvore de upgrades indisponível.',
  },
  day: { en: 'Day', pt: 'Dia' },
  done: { en: 'done', pt: 'cumprido' },
  pending: { en: 'pending', pt: 'pendente' },
  xpSquares: { en: 'XP squares', pt: 'Quadrados de XP' },
  squareFilled: { en: 'Square {n} filled', pt: 'Quadrado {n} preenchido' },
  squareEmpty: { en: 'Square {n} empty', pt: 'Quadrado {n} vazio' },
  loadingSheet: { en: 'Loading character sheet…', pt: 'Carregando ficha…' },
  heroMissing: {
    en: 'Hero not found in the grimoire.',
    pt: 'Herói não encontrado no grimório.',
  },
  hero: { en: 'Hero', pt: 'Herói' },
  loadingWeek: { en: 'Checking the week…', pt: 'Consultando a semana…' },
  weekIntro: {
    en: 'Family overview. Edit marks on each hero’s sheet (open the card).',
    pt: 'Visão da família. Edita marcações na ficha de cada herói (abre o cartão).',
  },
  noWeekly: {
    en: 'No weekly/{week}.md log yet.',
    pt: 'Sem registo weekly/{week}.md ainda.',
  },
  countingDeeds: { en: 'Counting deeds…', pt: 'Contando façanhas…' },
  weekGlory: { en: 'Glory for week', pt: 'Glória da semana' },
  loadingAdmin: { en: 'Loading panel…', pt: 'Carregando painel…' },
  badPin: {
    en: 'Wrong PIN. The grimoire stays sealed.',
    pt: 'PIN incorreto. O grimório permanece selado.',
  },
  adminTitle: { en: 'Admin panel', pt: 'Painel ADM' },
  adminGate: {
    en: 'Only the grimoire’s guardian passes here.',
    pt: 'Só o guardião do grimório passa daqui.',
  },
  enter: { en: 'Enter', pt: 'Entrar' },
  monthSetup: { en: 'Monthly setup', pt: 'Setup mensal' },
  monthSetupHelp: {
    en: 'Generates months/YYYY-MM.md for a manual commit. Objectives stay redacted.',
    pt: 'Gera months/YYYY-MM.md para commit manual. Objetivos ficam redactados.',
  },
  monthField: { en: 'Month (YYYY-MM)', pt: 'Mês (YYYY-MM)' },
  monthNumber: { en: 'Journey month number', pt: 'Nº do mês na jornada' },
  weeksComma: { en: 'Weeks (comma-separated)', pt: 'Semanas (vírgula)' },
  dominantTheme: { en: 'Dominant theme', pt: 'Tema dominante' },
  objectivesPerHero: { en: 'Objectives per hero', pt: 'Objetivos por herói' },
  theme: { en: 'Theme', pt: 'Tema' },
  threeMissions: {
    en: '3 missions (redacted, comma-separated)',
    pt: '3 missões (redactadas, vírgula)',
  },
  threeMissionsPt: {
    en: '3 missions PT (redacted, comma-separated)',
    pt: '3 missões PT (redactadas, vírgula)',
  },
  plannedBosses: { en: 'Planned BOSSes', pt: 'BOSS previstos' },
  download: { en: 'Download', pt: 'Descarregar' },
  failRead: { en: 'Failed to read', pt: 'Falha ao ler' },
  summonTitle: { en: 'Summon hero', pt: 'Invocar herói' },
  summonPreparing: { en: 'Preparing the summoning…', pt: 'Preparando a invocação…' },
  summonHelp: {
    en: 'Create on demand. Lives in this browser; download the pack to commit into docs/.',
    pt: 'Cria sob demanda. Fica neste browser; descarrega o pack para commit em docs/.',
  },
  charName: { en: 'Character name', pt: 'Nome do personagem' },
  classField: { en: 'Class', pt: 'Classe' },
  rankField: { en: 'Rank (hierarchy, redacted)', pt: 'Rank (hierarquia, redactado)' },
  rankHelp: {
    en: 'Family order without real names — Elder → Initiate.',
    pt: 'Ordem familiar sem nomes reais — Ancião → Iniciado.',
  },
  photoField: { en: 'Photo (optional)', pt: 'Foto (opcional)' },
  photoHelp: {
    en: 'Upload now or later. Stored in this browser; pack downloads .jpg for docs/assets/photos/.',
    pt: 'Upload agora ou depois. Fica neste browser; o pack baixa .jpg para docs/assets/photos/.',
  },
  photoFail: { en: 'Could not read that image.', pt: 'Não foi possível ler essa imagem.' },
  missionTheme: { en: 'Mission theme', pt: 'Tema das missões' },
  threeDaily: { en: '3 daily missions (redacted)', pt: '3 missões diárias (redactadas)' },
  downloadPack: {
    en: 'Download .md pack (+ photo) for the repo',
    pt: 'Descarregar pack .md (+ foto) para o repo',
  },
  needName: { en: 'Every hero needs a legendary name.', pt: 'Todo herói precisa de um nome lendário.' },
  needBoss: {
    en: 'No month BOSS — set up the month in Admin first.',
    pt: 'Sem BOSS do mês — faz o setup no ADM primeiro.',
  },
  summonCta: { en: 'Summon & open sheet', pt: 'Invocar e abrir ficha' },
  heroesHelp: {
    en: 'Open a sheet for full details. Local heroes live here until you commit their .md files.',
    pt: 'Abre a ficha para detalhes. Heróis locais ficam aqui até commit dos .md.',
  },
  summonHeroBtn: { en: '+ Summon hero', pt: '+ Invocar herói' },
  playerEditHelp: {
    en: 'Player sheet: edit your mission labels, weekly marks, photo and names. Admin calendar/BOSS live under ADM.',
    pt: 'Ficha do jogador: edita labels das missões, marcações semanais, foto e nomes. Calendário/BOSS ficam no ADM.',
  },
  missionsPlayerOnly: {
    en: 'These 3 daily missions belong to this hero — not the Admin panel.',
    pt: 'Estas 3 missões diárias pertencem a este herói — não ao painel ADM.',
  },
  saveSheet: { en: 'Save sheet', pt: 'Guardar ficha' },
  downloadSheet: { en: 'Download .md pack', pt: 'Descarregar pack .md' },
  savedLocal: {
    en: 'Saved in this browser. Download pack to commit into docs/.',
    pt: 'Guardado neste browser. Descarrega o pack para commit em docs/.',
  },
  bossMark: { en: 'Mark collective BOSS defeated', pt: 'Marcar BOSS coletivo derrotado' },
  bossUnmark: { en: 'Unmark collective BOSS', pt: 'Desmarcar BOSS coletivo' },
  adminScopeHelp: {
    en: 'Admin: month calendar, current week, dominant theme, collective BOSS missions.',
    pt: 'ADM: calendário do mês, semana atual, tema dominante, missões do BOSS coletivo.',
  },
  adminPlayerMissionsNote: {
    en: 'Per-hero daily missions are edited on each Player sheet (not here). Export mirrors them.',
    pt: 'Missões diárias por herói editam-se na ficha do Jogador (não aqui). O export espelha-as.',
  },
  currentWeek: { en: 'Current week (YYYY-WXX)', pt: 'Semana atual (YYYY-WXX)' },
  collectiveMissions: {
    en: 'Collective BOSS missions (redacted)',
    pt: 'Missões BOSS coletivo (redactadas)',
  },
  missionsFromSheets: {
    en: 'Daily missions (from player sheets)',
    pt: 'Missões diárias (das fichas)',
  },
  saveAdmin: { en: 'Save admin setup', pt: 'Guardar setup ADM' },
  githubToken: { en: 'GitHub token (Contents API)', pt: 'Token GitHub (Contents API)' },
  githubTokenHelp: {
    en: 'classic PAT with repo contents:write. Stored only in this browser’s localStorage.',
    pt: 'PAT classic com contents:write. Só neste browser (localStorage).',
  },
  saveToken: { en: 'Save token', pt: 'Guardar token' },
  tokenSaved: { en: 'Token saved in this browser.', pt: 'Token guardado neste browser.' },
  tokenCleared: { en: 'Token cleared.', pt: 'Token apagado.' },
  commitGithub: { en: 'Commit to GitHub', pt: 'Commit no GitHub' },
  committed: { en: 'Committed:', pt: 'Commit feito:' },
  needToken: {
    en: 'Set a GitHub token in Admin first (or use Download).',
    pt: 'Define token GitHub no ADM primeiro (ou usa Descarregar).',
  },
  levelUpTitle: { en: 'Month-end level-up', pt: 'Level-up fim de mês' },
  levelUpHelp: {
    en: 'Applies class upgrade for the journey month number. Commits if token set; else downloads .md pack.',
    pt: 'Aplica upgrade da classe para o nº do mês. Faz commit se houver token; senão descarrega pack .md.',
  },
  weeksHit: { en: 'Weeks that hit target (for €)', pt: 'Semanas com meta (para €)' },
  rewardLabel: { en: 'Reward label (redacted)', pt: 'Label da recompensa (redactada)' },
  applyLevelUp: { en: 'Apply level-up', pt: 'Aplicar level-up' },
  levelUpOk: { en: 'Level-up applied:', pt: 'Level-up aplicado:' },
}

const LocaleCtx = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: keyof typeof ui, vars?: Record<string, string | number>) => string
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

  function t(key: keyof typeof ui, vars?: Record<string, string | number>) {
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
