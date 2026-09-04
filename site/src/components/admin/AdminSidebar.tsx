'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { signOut } from '@/app/login/actions';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/perfil', label: 'Perfil', icon: '☺' },
  { href: '/admin/redes', label: 'Redes sociais', icon: '⌘' },
  { href: '/admin/links', label: 'Links', icon: '⛓' },
  { href: '/admin/afiliados', label: 'Afiliados', icon: '★' },
  { href: '/admin/banners', label: 'Banners', icon: '▭' },
  { href: '/admin/configuracoes', label: 'Configurações', icon: '⚙' },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
              active
                ? 'bg-neon/15 text-white shadow-[inset_0_0_0_1px_rgba(162,89,255,0.35)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white',
            )}
          >
            <span className="w-4 text-center text-base opacity-80" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Barra superior no celular */}
      <div className="flex items-center justify-between border-b border-white/5 bg-base-950/90 px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-display font-bold text-white">
          Painel Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn-secondary px-3 py-1.5 text-xs"
          aria-expanded={open}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
      </div>

      {open ? (
        <div className="border-b border-white/5 bg-base-900 p-4 lg:hidden">
          {nav}
          <SidebarFooter email={email} />
        </div>
      ) : null}

      {/* Menu lateral no desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-base-900/70 p-4 lg:flex">
        <Link href="/admin" className="mb-6 block px-2 font-display text-lg font-bold text-white">
          Painel Admin
        </Link>
        {nav}
        <SidebarFooter email={email} />
      </aside>
    </>
  );
}

function SidebarFooter({ email }: { email: string }) {
  return (
    <div className="mt-6 space-y-3 border-t border-white/5 pt-4 lg:mt-auto">
      <p className="truncate px-2 text-xs text-slate-500" title={email}>
        {email}
      </p>
      <Link
        href="/"
        className="block rounded-xl px-3.5 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        ↗ Ver o site
      </Link>
      <form action={signOut}>
        <button type="submit" className="btn-secondary w-full text-sm">
          Sair
        </button>
      </form>
    </div>
  );
}
