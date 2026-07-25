import { SITE_NAME, SITE_DESCRIPTION, getSiteUrl } from '@/lib/seo';

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f5f7',
    theme_color: '#0b1220',
    icons: [
      {
        src: '/urlbeam-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
