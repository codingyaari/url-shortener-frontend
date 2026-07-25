import { BlogIndexPage } from '@/components/BlogIndexPage';
import { JsonLd } from '@/components/JsonLd';
import { getAllPosts } from '@/content/blog';
import { buildPageMetadata, getSiteUrl, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Blog — URL Shortener Guides & Tips | ${SITE_NAME}`,
  description:
    'Urlbeam blog: learn how to shorten URLs, create custom short links, generate QR codes, track clicks, and grow campaigns with a free URL shortener.',
  path: '/blog',
  keywords: [
    'url shortener blog',
    'how to shorten a url',
    'short link tips',
    'qr code guide',
    'link analytics',
    'urlbeam',
  ],
});

export default function Page() {
  const siteUrl = getSiteUrl();
  const posts = getAllPosts();

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: `${siteUrl}/blog`,
    description: 'Guides on URL shorteners, short links, QR codes, and click analytics.',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${siteUrl}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={blogLd} />
      <BlogIndexPage />
    </>
  );
}
