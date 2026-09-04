import { CrudManager } from '@/components/admin/CrudManager';
import { PageHeader } from '@/components/admin/PageHeader';
import { getAffiliateLinks } from '@/lib/data';

export default async function AdminAffiliatesPage() {
  const affiliates = await getAffiliateLinks(false);

  return (
    <>
      <PageHeader
        title="Afiliados"
        description="Produtos e parceiros da seção “Meus Links / Recomendações”."
      />
      <CrudManager
        table="affiliate_links"
        records={affiliates as unknown as Record<string, unknown>[]}
      />
    </>
  );
}
