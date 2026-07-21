import { Link, useLocation } from 'wouter'
import type { ReactNode } from 'react'
import { StableT, useLocale, type Locale } from '../lib/i18n'

const NAV = [
  { href: '/', labelKey: 'chronicle' as const, icon: '◈' },
  { href: '/heroes', labelKey: 'heroesNav' as const, icon: '⚔' },
  { href: '/avatars', labelKey: 'avatarsNav' as const, icon: '✧' },
  { href: '/weekly', labelKey: 'week' as const, icon: '☽' },
  { href: '/leaderboard', labelKey: 'rankings' as const, icon: '★' },
  { href: '/admin', labelKey: 'admin' as const, icon: '⚙' },
]

function LangSwitch({ compact }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale()
  const opts: { id: Locale; label: string; full: string }[] = [
    { id: 'en', label: 'EN', full: 'English' },
    { id: 'pt', label: 'PT', full: 'Português' },
  ]
  return (
    <div
      className={`grid grid-cols-2 gap-0.5 rounded border border-[var(--color-gold)]/50 p-0.5 ${
        compact ? 'w-full' : 'w-full'
      }`}
      role="group"
      aria-label="Language / Idioma"
    >
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.full}
          onClick={() => setLocale(o.id)}
          className={`min-w-0 px-1.5 py-1 font-display text-[10px] tracking-wider ${
            locale === o.id
              ? 'bg-[var(--color-gold)] text-[var(--color-charcoal)]'
              : 'text-[var(--color-gold)]/80 hover:text-[var(--color-gold)]'
          }`}
          aria-label={o.full}
          aria-pressed={locale === o.id}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function NavRail({ mapMode }: { mapMode?: boolean }) {
  const [loc] = useLocation()
  const { t } = useLocale()

  return (
    <aside
      className={`nav-rail hud-panel flex shrink-0 flex-col items-center gap-1 p-1.5 ${
        mapMode
          ? 'absolute bottom-3 left-1/2 z-20 max-w-[min(100%-1.5rem,36rem)] -translate-x-1/2 flex-row gap-1 px-2 py-1.5 md:bottom-auto md:left-3 md:top-1/2 md:max-w-none md:-translate-y-1/2 md:translate-x-0 md:flex-col md:py-2'
          : 'fixed bottom-0 left-0 right-0 z-20 flex-row justify-around gap-0.5 rounded-none border-x-0 border-b-0 px-1 py-1.5 md:bottom-auto md:left-0 md:right-auto md:top-0 md:h-full md:w-[4.25rem] md:flex-col md:justify-start md:gap-1 md:rounded-none md:border-y-0 md:border-l-0 md:px-1.5 md:py-3'
      }`}
    >
      {!mapMode && (
        <div className="mb-1 hidden min-w-0 text-center md:block">
          <div className="font-decorative text-[10px] leading-tight text-[var(--color-gold)]">FQ</div>
        </div>
      )}
      <div className={`hidden w-full md:block ${mapMode ? 'mb-1' : 'mb-2'}`}>
        <LangSwitch compact />
      </div>
      <nav
        className={`flex flex-1 items-center gap-0.5 ${
          mapMode ? 'flex-row md:flex-col' : 'flex-row justify-around md:flex-col md:justify-start'
        }`}
        aria-label="Main"
      >
        {NAV.map((item) => {
          const active = loc === item.href || (item.href !== '/' && loc.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              title={t(item.labelKey)}
              aria-label={t(item.labelKey)}
              className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded text-[var(--color-ink)]/80 transition duration-150 hover:text-[var(--color-gold)] ${
                active
                  ? 'bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
                  : ''
              }`}
            >
              <span className="text-base leading-none" aria-hidden>
                {item.icon}
              </span>
              <span className="mt-0.5 max-w-[2.75rem] truncate font-display text-[8px] tracking-wider normal-case">
                <StableT k={item.labelKey} align="center" />
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="w-16 md:hidden">
        <LangSwitch compact />
      </div>
    </aside>
  )
}

export function Layout({
  children,
  title,
  variant = 'codex',
}: {
  children: ReactNode
  title?: string
  variant?: 'codex' | 'map'
}) {
  if (variant === 'map') {
    return (
      <div className="map-shell">
        {children}
        <NavRail mapMode />
      </div>
    )
  }

  return (
    <div className="codex-shell mx-auto max-w-6xl px-3 py-4 md:px-6">
      <NavRail />
      <main className="page-enter min-w-0 flex-1">
        {title && (
          <header className="mb-4 min-w-0">
            <h1 className="truncate text-2xl text-[var(--color-gold)] md:text-3xl">{title}</h1>
            <div className="flourish mt-2">❦</div>
          </header>
        )}
        {children}
      </main>
    </div>
  )
}
