import { getSiteUrl } from '@/lib/seo';

export default function sitemap() {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
