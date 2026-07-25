import { PrivacyPolicyPage } from '@/components/PrivacyPolicyPage';
import { buildPageMetadata, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Privacy Policy | ${SITE_NAME}`,
  description:
    'Privacy Policy for Urlbeam by CodingYari. Learn how we collect and use account, short link, analytics, and bio page data at shortener.codingyari.com.',
  path: '/privacy',
  keywords: ['urlbeam privacy', 'url shortener privacy policy', 'codingyari privacy'],
});

export default function Page() {
  return <PrivacyPolicyPage />;
}
