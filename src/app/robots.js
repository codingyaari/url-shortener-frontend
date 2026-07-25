import { getSiteUrl, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

export default function robots() {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/bio/'],
        disallow: ['/dashboard', '/api/', '/unlock/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
