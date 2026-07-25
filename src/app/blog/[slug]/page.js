import { notFound } from 'next/navigation';
import { BlogPostPage } from '@/components/BlogPostPage';
import { JsonLd } from '@/components/JsonLd';
import { getAllPostSlugs, getPostBySlug } from '@/content/blog';
import { buildPageMetadata, getSiteUrl, SITE_NAME } from '@/lib/seo';

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return buildPageMetadata({
      title: `Guide not found | ${SITE_NAME}`,
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    keywords: post.keywords.join(', '),
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <BlogPostPage post={post} />
    </>
  );
}
