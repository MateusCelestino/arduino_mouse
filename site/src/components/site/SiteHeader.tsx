import Link from 'next/link';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/perfil', label: 'Perfil' },
  { href: '/links', label: 'Links' },
  { href: '/#afiliados', label: 'Recomendações' },
];

export function SiteHeader({ siteName, live }: { siteName: string; live: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-white">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {live ? (
          <span className="badge bg-red-500/15 text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-live" />
            AO VIVO
          </span>
        ) : (
          <span className="badge bg-white/5 text-slate-400">Offline</span>
        )}
      </div>
    </header>
  );
}
