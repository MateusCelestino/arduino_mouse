import Link from 'next/link';

import { LiveToggle } from '@/components/admin/LiveToggle';
import { PageHeader } from '@/components/admin/PageHeader';
import { getDashboardStats, getProfile } from '@/lib/data';
import { formatDateTime } from '@/lib/utils';

const LINK_TYPE_LABEL: Record<string, string> = {
  social: 'Rede social',
  custom: 'Link',
  affiliate: 'Afiliado',
  live: 'Botão de live',
};

function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [profile, stats] = await Promise.all([getProfile(), getDashboardStats()]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral do conteúdo cadastrado e dos cliques registrados."
      />

      <div className="space-y-6">
        <LiveToggle profileId={profile.id} live={profile.live_status} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Links cadastrados" value={stats.customLinks} />
          <StatCard label="Links afiliados" value={stats.affiliateLinks} />
          <StatCard label="Redes ativas" value={stats.activeSocials} />
          <StatCard
            label="Total de cliques"
            value={stats.totalClicks}
            hint={`${stats.clicksLast7Days} nos últimos 7 dias`}
          />
        </div>

        <section className="card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-white">Últimos links clicados</h2>
            <Link href="/admin/afiliados" className="text-xs text-neon-soft hover:underline">
              Ver afiliados →
            </Link>
          </div>

          {stats.recentClicks.length > 0 ? (
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-2 pb-2 font-semibold">Link</th>
                    <th className="px-2 pb-2 font-semibold">Tipo</th>
                    <th className="px-2 pb-2 font-semibold">Origem</th>
                    <th className="px-2 pb-2 font-semibold">Quando</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentClicks.map((click) => (
                    <tr key={click.id}>
                      <td className="max-w-[220px] truncate px-2 py-2.5 text-slate-200">
                        {click.label ?? '—'}
                      </td>
                      <td className="px-2 py-2.5 text-slate-400">
                        {LINK_TYPE_LABEL[click.link_type] ?? click.link_type}
                      </td>
                      <td className="max-w-[180px] truncate px-2 py-2.5 text-slate-500">
                        {click.referrer ?? 'direto'}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-slate-500">
                        {formatDateTime(click.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">
              Nenhum clique registrado ainda.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
