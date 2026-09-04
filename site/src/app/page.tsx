import { AffiliateCard } from '@/components/site/AffiliateCard';
import { BannerStrip } from '@/components/site/BannerStrip';
import { Hero } from '@/components/site/Hero';
import { LinkButton } from '@/components/site/LinkButton';
import { EmptyState, Section } from '@/components/site/Section';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SocialCard } from '@/components/site/SocialCard';
import {
  getAffiliateLinks,
  getBanners,
  getCustomLinks,
  getProfile,
  getSiteSettings,
  getSocialLinks,
} from '@/lib/data';

export default async function HomePage() {
  const [profile, settings, socials, links, affiliates, banners] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getSocialLinks(),
    getCustomLinks(),
    getAffiliateLinks(),
    getBanners('home'),
  ]);

  const liveSocial =
    socials.find((social) => social.platform.toLowerCase().includes('twitch')) ??
    socials.find((social) => social.platform.toLowerCase().includes('kick')) ??
    socials[0] ??
    null;

  return (
    <>
      <SiteHeader siteName={settings.site_name} live={profile.live_status} />

      <main>
        <Hero profile={profile} headline={settings.headline} fallbackLive={liveSocial} />

        <BannerStrip banners={banners} />

        <Section
          id="redes"
          eyebrow="Meus canais"
          title="Onde eu transmito"
          description="Escolha a plataforma e vem assistir. Todos os canais são oficiais."
        >
          {socials.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socials.map((social) => (
                <SocialCard key={social.id} link={social} />
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhuma rede social cadastrada ainda. Adicione as suas em /admin/redes." />
          )}
        </Section>

        {links.length > 0 ? (
          <Section
            id="links"
            eyebrow="Atalhos"
            title="Meus links"
            description="Comunidade, contato e tudo que costumo divulgar nas lives."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <LinkButton key={link.id} link={link} />
              ))}
            </div>
          </Section>
        ) : null}

        <Section
          id="afiliados"
          eyebrow="Parceiros"
          title="Meus Links / Recomendações"
          description="Produtos, serviços e parceiros que eu uso e recomendo."
        >
          {affiliates.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {affiliates.map((item) => (
                  <AffiliateCard key={item.id} item={item} />
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-slate-500">
                {settings.affiliate_notice}
              </p>
            </>
          ) : (
            <EmptyState message="Nenhuma recomendação cadastrada ainda. Adicione em /admin/afiliados." />
          )}
        </Section>
      </main>

      <SiteFooter siteName={settings.site_name} notice={settings.affiliate_notice} />
    </>
  );
}
