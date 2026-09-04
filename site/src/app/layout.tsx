import type { Metadata, Viewport } from 'next';
import { Inter, Chakra_Petch } from 'next/font/google';

import { getSiteSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/utils';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#07070c',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl();
  const ogImage = settings.og_image_url ?? '/og.svg';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo_title,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.seo_description || settings.description,
    keywords: settings.seo_keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean),
    applicationName: settings.site_name,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: siteUrl,
      siteName: settings.site_name,
      title: settings.seo_title,
      description: settings.seo_description || settings.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.site_name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo_title,
      description: settings.seo_description || settings.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${display.variable} dark`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
