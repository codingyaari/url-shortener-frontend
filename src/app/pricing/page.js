import { PricingPage } from '@/components/PricingPage';
import { buildPageMetadata, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Pricing — Free & Pro URL Shortener Plans | ${SITE_NAME}`,
  description:
    'Urlbeam pricing: start free with 50 short links, QR codes, and analytics. Upgrade to Pro for unlimited links, advanced analytics, and more URL shortener features.',
  path: '/pricing',
});

export default function Page() {
  return <PricingPage />;
}
