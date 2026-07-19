import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LinkAnalyticsPage } from '@/components/LinkAnalyticsPage';

export default async function AnalyticsPage({ params }) {
  const session = await getSession();
  
  if (!session) {
    redirect('/');
  }

  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  
  return <LinkAnalyticsPage slug={slug} />;
}

