import { PageHeader } from '@/components/admin/PageHeader';
import { SingletonForm } from '@/components/admin/SingletonForm';
import { SETTINGS_FIELDS } from '@/lib/admin/schema';
import { getSiteSettings } from '@/lib/data';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Nome do site, textos gerais, SEO e aviso de afiliados."
      />
      <SingletonForm
        kind="settings"
        fields={SETTINGS_FIELDS}
        record={settings as unknown as Record<string, unknown>}
        submitLabel="Salvar configurações"
      />
    </>
  );
}
