import { BioPageContent } from '@/components/BioPageContent';
import { buildPageMetadata, SITE_NAME, getSiteUrl } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { username } = await params;
  const handle = String(username || '').toLowerCase();
  return buildPageMetadata({
    title: `@${handle} — Link in bio | ${SITE_NAME}`,
    description: `Public Urlbeam bio page for @${handle}. Discover short links, branded URLs, and shared destinations powered by ${SITE_NAME} URL shortener.`,
    path: `/bio/${handle}`,
  });
}

export default async function BioPage({ params }) {
  const { username } = await params;
  return <BioPageContent key={username} />;
}
