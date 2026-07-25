import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import {
  SITE_CONTACT_EMAIL,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_OPERATOR,
  SITE_TAGLINE,
} from '@/lib/seo';

export function AboutPage() {
  return (
    <div className="min-h-screen urlbeam-grid">
      <Header solid />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
        <p className="text-xs font-700 uppercase tracking-[0.16em] text-[var(--signal)]">About</p>
        <h1 className="mt-3 font-display text-3xl font-800 tracking-tight sm:text-5xl">
          {SITE_NAME} — {SITE_TAGLINE}
        </h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          <p>
            {SITE_NAME} is a free URL shortener from {SITE_OPERATOR}, available at{' '}
            <strong className="text-[var(--ink)]">{SITE_DOMAIN}</strong>. It is built for creators
            and marketers who need branded short links that feel as polished as the products they
            promote.
          </p>
          <p>
            We focus on the essentials that matter every day: custom slugs, QR codes, click
            analytics, password protection, UTM tracking, and link-in-bio pages — without enterprise
            complexity or surprise paywalls on day one.
          </p>
          <p>
            Whether you are launching a product, running ads, or cleaning up a social bio,{' '}
            {SITE_NAME} helps you share links people trust and numbers you can act on.
          </p>
          <p>
            Contact:{' '}
            <a
              href={`mailto:${SITE_CONTACT_EMAIL}`}
              className="font-700 text-[var(--signal)] hover:underline"
            >
              {SITE_CONTACT_EMAIL}
            </a>
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn-primary w-full sm:w-auto">
            Get started
          </Link>
          <Link href="/blog" className="btn-secondary w-full sm:w-auto">
            Read the blog
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
