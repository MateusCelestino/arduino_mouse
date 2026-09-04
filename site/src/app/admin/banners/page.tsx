import { CrudManager } from '@/components/admin/CrudManager';
import { PageHeader } from '@/components/admin/PageHeader';
import { getBanners } from '@/lib/data';

export default async function AdminBannersPage() {
  const banners = await getBanners(undefined, false);

  return (
    <>
      <PageHeader
        title="Banners"
        description="Imagens promocionais exibidas nas páginas do site."
      />
      <CrudManager table="banners" records={banners as unknown as Record<string, unknown>[]} />
    </>
  );
}
