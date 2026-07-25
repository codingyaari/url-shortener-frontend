import { FaqPage } from '@/components/FaqPage';
import { JsonLd } from '@/components/JsonLd';
import { faqToJsonLd } from '@/content/faq';
import { buildPageMetadata, getSiteUrl, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `FAQ — URL Shortener Questions | ${SITE_NAME}`,
  description:
    'Frequently asked questions about Urlbeam: free URL shortener, custom short links, click tracking, QR codes, password links, and link-in-bio pages.',
  path: '/faq',
  keywords: [
    'url shortener faq',
    'urlbeam faq',
    'shorten url questions',
    'custom short links',
    'link analytics',
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd data={faqToJsonLd(getSiteUrl())} />
      <FaqPage />
    </>
  );
}
