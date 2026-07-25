import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Dashboard',
  description: 'Manage your Urlbeam short links, QR codes, and analytics.',
  path: '/dashboard',
  noIndex: true,
});

export default function DashboardLayout({ children }) {
  return children;
}
