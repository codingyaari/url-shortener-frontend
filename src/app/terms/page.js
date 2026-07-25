import { TermsPage } from '@/components/TermsPage';
import { buildPageMetadata, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Terms of Service | ${SITE_NAME}`,
  description:
    'Terms of Service for Urlbeam by CodingYari. Rules for using our free URL shortener, short links, QR codes, analytics, and link-in-bio pages.',
  path: '/terms',
  keywords: ['urlbeam terms', 'url shortener terms of service', 'codingyari terms'],
});

export default function Page() {
  return <TermsPage />;
}
