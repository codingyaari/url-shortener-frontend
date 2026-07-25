import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPostPage({ post }) {
  return (
    <div className="min-h-screen urlbeam-grid">
      <Header solid />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
        <Link href="/blog" className="text-sm font-700 text-[var(--muted)] hover:text-[var(--ink)]">
          ← All guides
        </Link>
        <p className="mt-6 text-xs font-700 uppercase tracking-[0.16em] text-[var(--signal)]">Guide</p>
        <h1 className="mt-3 font-display text-3xl font-800 tracking-tight sm:text-5xl">{post.title}</h1>
        <time className="mt-4 block text-sm text-[var(--muted)]" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">{post.description}</p>

        <div className="mt-12 space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-700 tracking-tight">{section.heading}</h2>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-[var(--muted)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-[18px] border border-[var(--line)] bg-[var(--paper-elevated)] p-6 sm:p-8">
          <h2 className="font-display text-2xl font-700">Ready to shorten a URL?</h2>
          <p className="mt-2 text-[var(--muted)]">
            Create free short links with custom slugs, QR codes, and click analytics on Urlbeam.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-primary w-full sm:w-auto">
              Open dashboard
            </Link>
            <Link href="/pricing" className="btn-secondary w-full sm:w-auto">
              See pricing
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
