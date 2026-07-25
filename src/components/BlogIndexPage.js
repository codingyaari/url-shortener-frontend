import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { getAllPosts } from '@/content/blog';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen urlbeam-grid">
      <Header solid />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-700 uppercase tracking-[0.16em] text-[var(--signal)]">Blog</p>
          <h1 className="mt-3 font-display text-3xl font-800 tracking-tight sm:text-5xl">
            Guides for short links that convert
          </h1>
          <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">
            Practical tips on URL shorteners, custom short links, QR codes, and click analytics —
            from the Urlbeam team.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="surface group block p-5 transition hover:border-[var(--ink)] sm:p-6"
            >
              <time className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
              <h2 className="mt-3 font-display text-xl font-700 tracking-tight group-hover:text-[var(--signal)] sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{post.description}</p>
              <span className="mt-4 inline-block text-sm font-700 text-[var(--ink)]">Read guide →</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
