import { Link, useLocation } from 'wouter'
import type { ReactNode } from 'react'
import { useLocale, type Locale } from '../lib/i18n'

function LangSwitch() {
  const { locale, setLocale } = useLocale()
  const opts: { id: Locale; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'pt', label: 'Português' },
  ]
  return (
    <div
      className="flex items-center gap-1 rounded border border-[var(--color-gold)]/50 p-0.5"
      role="group"
      aria-label="Language / Idioma"
    >
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setLocale(o.id)}
          className={`px-3 py-1.5 font-display text-[11px] tracking-wider ${
            locale === o.id
              ? 'bg-[var(--color-gold)] text-[var(--color-charcoal)]'
              : 'text-[var(--color-gold)]/80 hover:text-[var(--color-gold)]'
          }`}
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
    { href: '/', label: t('chronicle') },
    { href: '/heroes', label: t('heroesNav') },
    { href: '/weekly', label: t('week') },
    { href: '/leaderboard', label: t('rankings') },
    { href: '/admin', label: t('admin') },
  ]

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-3 py-4 md:flex-row md:px-6">
      <aside className="panel flex shrink-0 flex-col gap-2 p-3 md:w-48">
        <div className="mb-1">
          <div className="font-decorative text-lg text-[var(--color-gold)]">Family Quest</div>
          <p className="mt-1 text-xs opacity-70">{t('grimoireTag')}</p>
        </div>
        <LangSwitch />
        <nav className="flex flex-1 flex-wrap gap-1 md:flex-col">
          {NAV.map((item) => {
            const active = loc === item.href || (item.href !== '/' && loc.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 font-display text-xs tracking-widest ${
                  active
                    ? 'bg-[var(--color-parchment-deep)] text-[var(--color-gold)]'
                    : 'text-[var(--color-ink)]/80 hover:text-[var(--color-gold)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="page-enter min-w-0 flex-1">
        <div className="mb-3 flex justify-end md:hidden">
          <LangSwitch />
        </div>
        {title && (
          <header className="mb-4">
            <h1 className="text-2xl text-[var(--color-gold)] md:text-3xl">{title}</h1>
            <div className="flourish mt-2">❦</div>
          </header>
        )}
        {children}
      </main>
    </div>
  )
}
