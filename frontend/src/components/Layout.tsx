import { Link, useLocation } from 'wouter'
import type { ReactNode } from 'react'

const NAV = [
  { href: '/', label: 'Crônica' },
  { href: '/weekly', label: 'Semana' },
  { href: '/leaderboard', label: 'Ranking' },
  { href: '/admin', label: 'ADM' },
]

export function Layout({ children, title }: { children: ReactNode; title?: string }) {
  const [loc] = useLocation()
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-3 py-4 md:flex-row md:px-6">
      <aside className="panel flex shrink-0 flex-row gap-2 p-3 md:w-44 md:flex-col md:gap-1">
        <div className="mb-2 hidden md:block">
          <div className="font-decorative text-lg text-[var(--color-gold)]">Family Quest</div>
          <p className="mt-1 text-xs opacity-70">Grimório da família</p>
        </div>
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
