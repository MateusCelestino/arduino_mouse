import { CrudManager } from '@/components/admin/CrudManager';
import { PageHeader } from '@/components/admin/PageHeader';
import { getCustomLinks } from '@/lib/data';

export default async function AdminLinksPage() {
  const links = await getCustomLinks(false);

  return (
    <>
      <PageHeader
        title="Links"
        description="Links personalizados exibidos na Home e na página /links."
      />
      <CrudManager table="custom_links" records={links as unknown as Record<string, unknown>[]} />
    </>
  );
}
