import { PageHeader } from '@/components/admin/PageHeader';
import { SingletonForm } from '@/components/admin/SingletonForm';
import { PROFILE_FIELDS } from '@/lib/admin/schema';
import { getProfile } from '@/lib/data';

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        title="Perfil"
        description="Dados exibidos na Home, na página /perfil e na página /links."
      />
      <SingletonForm
        kind="profile"
        fields={PROFILE_FIELDS}
        record={profile as unknown as Record<string, unknown>}
        submitLabel="Salvar perfil"
      />
    </>
  );
}
