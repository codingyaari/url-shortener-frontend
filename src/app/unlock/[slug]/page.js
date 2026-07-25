import UnlockForm from '@/components/UnlockForm';

export default async function UnlockPage({ params }) {
  const { slug } = await params;
  return <UnlockForm slug={slug} />;
}
