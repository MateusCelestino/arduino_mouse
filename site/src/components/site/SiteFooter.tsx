import Link from 'next/link';

export function SiteFooter({ siteName, notice }: { siteName: string; notice: string }) {
  return (
    <footer className="mt-20 border-t border-white/5 bg-base-950/60">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10 sm:px-6">
        <p className="max-w-3xl text-xs leading-relaxed text-slate-500">{notice}</p>

        <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/perfil" className="transition hover:text-slate-300">
              Perfil
            </Link>
            <Link href="/links" className="transition hover:text-slate-300">
              Links
            </Link>
            <Link href="/admin" className="transition hover:text-slate-300">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
