import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/links`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/perfil`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
