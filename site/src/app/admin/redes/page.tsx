import { CrudManager } from '@/components/admin/CrudManager';
import { PageHeader } from '@/components/admin/PageHeader';
import { getSocialLinks } from '@/lib/data';

export default async function AdminSocialPage() {
  const socials = await getSocialLinks(false);

  return (
    <>
      <PageHeader
        title="Redes sociais"
        description="Cards de Twitch, Kick, YouTube, X e qualquer outra plataforma que você criar."
      />
      <CrudManager table="social_links" records={socials as unknown as Record<string, unknown>[]} />
    </>
  );
}
