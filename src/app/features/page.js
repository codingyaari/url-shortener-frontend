import { FeaturesPage } from '@/components/FeaturesPage';
import { buildPageMetadata, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Features — URL Shortener Tools | ${SITE_NAME}`,
  description:
    'Urlbeam features: free URL shortener, custom short links, QR codes, click analytics, password protection, UTM tracking, tags, and link-in-bio pages.',
  path: '/features',
  keywords: [
    'url shortener features',
    'custom short links',
    'qr code generator',
    'link analytics',
    'link in bio',
    'urlbeam features',
  ],
});

export default function Page() {
  return <FeaturesPage />;
}
