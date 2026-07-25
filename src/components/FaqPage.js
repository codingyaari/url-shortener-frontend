import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { faqItems } from '@/content/faq';

export function FaqPage() {
  return (
    <div className="min-h-screen urlbeam-grid">
      <Header solid />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
        <p className="text-xs font-700 uppercase tracking-[0.16em] text-[var(--signal)]">FAQ</p>
        <h1 className="mt-3 font-display text-3xl font-800 tracking-tight sm:text-5xl">
          URL shortener questions, answered
        </h1>
        <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">
          Everything about shortening URLs, tracking clicks, QR codes, and branded short links with Urlbeam.
        </p>

        <div className="mt-12 space-y-4">
          {faqItems.map((item) => (
            <article key={item.question} className="surface p-5 sm:p-6">
              <h2 className="font-display text-lg font-700 sm:text-xl">{item.question}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{item.answer}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-[var(--muted)]">
          Still curious? Read the{' '}
          <Link href="/blog" className="font-700 text-[var(--ink)] hover:text-[var(--signal)]">
            blog
          </Link>{' '}
          or{' '}
          <Link href="/pricing" className="font-700 text-[var(--ink)] hover:text-[var(--signal)]">
            compare plans
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
