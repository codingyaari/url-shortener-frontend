import { getSiteUrl } from '@/lib/seo';

export default function robots() {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/features', '/blog', '/faq', '/about', '/privacy', '/terms', '/bio/'],
        disallow: ['/dashboard', '/api/', '/unlock/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
