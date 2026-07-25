import { AboutPage } from '@/components/AboutPage';
import { buildPageMetadata, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `About ${SITE_NAME} — Free URL Shortener`,
  description: SITE_DESCRIPTION,
  path: '/about',
  keywords: ['urlbeam', 'about urlbeam', 'url shortener', 'free url shortener'],
});

export default function Page() {
  return <AboutPage />;
}
