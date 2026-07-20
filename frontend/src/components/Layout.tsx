import { Link, useLocation } from 'wouter'
import type { ReactNode } from 'react'
import { StableT, useLocale, type Locale } from '../lib/i18n'

function LangSwitch() {
  const { locale, setLocale } = useLocale()
  const opts: { id: Locale; label: string; full: string }[] = [
    { id: 'en', label: 'EN', full: 'English' },
    { id: 'pt', label: 'PT', full: 'Português' },
  ]
  return (
    <div
      className="grid w-full grid-cols-2 gap-0.5 rounded border border-[var(--color-gold)]/50 p-0.5"
      role="group"
      aria-label="Language / Idioma"
    >
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.full}
          onClick={() => setLocale(o.id)}
          className={`min-w-0 px-2 py-1.5 font-display text-[11px] tracking-wider ${
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

export function Layout({ children, title }: { children: ReactNode; title?: string }) {
  const [loc] = useLocation()
  const { t } = useLocale()

  const NAV = [
    { href: '/', labelKey: 'chronicle' as const },
    { href: '/heroes', labelKey: 'heroesNav' as const },
    { href: '/avatars', labelKey: 'avatarsNav' as const },
    { href: '/weekly', labelKey: 'week' as const },
    { href: '/leaderboard', labelKey: 'rankings' as const },
    { href: '/admin', labelKey: 'admin' as const },
  ]

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-3 py-4 md:flex-row md:px-6">
      <aside className="panel flex w-full shrink-0 flex-col gap-2 p-3 md:w-52">
        <div className="mb-1 min-w-0">
          <div className="font-decorative text-lg text-[var(--color-gold)]">Family Quest</div>
          <p className="mt-1 truncate text-xs opacity-70" title={t('grimoireTag')}>
            <StableT k="grimoireTag" align="start" />
          </p>
        </div>
        <div className="hidden md:block">
          <LangSwitch />
        </div>
        <nav className="flex flex-1 flex-wrap gap-1 md:flex-col md:flex-nowrap">
          {NAV.map((item) => {
            const active = loc === item.href || (item.href !== '/' && loc.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                title={t(item.labelKey)}
                className={`min-w-0 truncate px-3 py-2 font-display text-xs tracking-widest md:block ${
                  active
                    ? 'bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
                    : 'text-[var(--color-ink)]/80 hover:text-[var(--color-gold)]'
                }`}
              >
                <StableT k={item.labelKey} align="start" />
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="page-enter min-w-0 flex-1">
        <div className="mb-3 flex md:hidden">
          <div className="w-28">
            <LangSwitch />
          </div>
        </div>
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
