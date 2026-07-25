'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';

const features = [
  {
    title: 'URL shortener',
    body: 'Turn long destinations into clean short links you can share anywhere — social, ads, SMS, email, and print.',
  },
  {
    title: 'Custom short links',
    body: 'Choose memorable slugs so every campaign looks on-brand instead of a random string of characters.',
  },
  {
    title: 'QR codes',
    body: 'Generate a QR for every short link. Scans open the same redirect and show up in click analytics.',
  },
  {
    title: 'Click analytics',
    body: 'Track clicks over time plus country, city, device, browser, referrer, and UTM parameters.',
  },
  {
    title: 'Password & expiry',
    body: 'Lock sensitive destinations behind a password or auto-expire links after a campaign ends.',
  },
  {
    title: 'Link-in-bio',
    body: 'Publish a public bio page with your important links under one Urlbeam profile URL.',
  },
  {
    title: 'UTM builder',
    body: 'Attach source, medium, and campaign once — every click stays attributed without messy query strings in captions.',
  },
  {
    title: 'Tags & favorites',
    body: 'Organize links by campaign, star the ones you reuse, and find them fast in the dashboard.',
  },
];

export function FeaturesPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen urlbeam-grid">
      <Header solid />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-700 uppercase tracking-[0.16em] text-[var(--signal)]">Features</p>
          <h1 className="mt-3 font-display text-3xl font-800 tracking-tight sm:text-5xl">
            Everything in a modern URL shortener
          </h1>
          <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">
            Urlbeam combines short links, QR codes, analytics, and bio pages in one free workspace.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {session ? (
              <Link href="/dashboard" className="btn-primary w-full sm:w-auto">
                Open dashboard
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
                className="btn-primary w-full sm:w-auto"
              >
                Start free with Google
              </button>
            )}
            <Link href="/pricing" className="btn-secondary w-full sm:w-auto">
              See pricing
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="surface p-5 sm:p-6">
              <h2 className="font-display text-xl font-700">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.body}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
