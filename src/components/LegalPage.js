import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';

export function LegalPage({ eyebrow, title, updated, children }) {
  return (
    <div className="min-h-screen urlbeam-grid">
      <Header solid />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
        <p className="text-xs font-700 uppercase tracking-[0.16em] text-[var(--signal)]">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-800 tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">Last updated: {updated}</p>
        <div className="legal-prose mt-10 space-y-8 text-base leading-relaxed text-[var(--muted)]">
          {children}
        </div>
        <p className="mt-12 text-sm text-[var(--muted)]">
          Related:{' '}
          <Link href="/privacy" className="font-700 text-[var(--ink)] hover:text-[var(--signal)]">
            Privacy Policy
          </Link>
          {' · '}
          <Link href="/terms" className="font-700 text-[var(--ink)] hover:text-[var(--signal)]">
            Terms of Service
          </Link>
          {' · '}
          <Link href="/about" className="font-700 text-[var(--ink)] hover:text-[var(--signal)]">
            About
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-xl font-700 tracking-tight text-[var(--ink)] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
