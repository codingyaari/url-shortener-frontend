'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { Header } from '@/components/Header';

export function HomePage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('error');
    if (authError) {
      console.error('[auth] Login issue:', authError);
    }
    if (session?.backendAuthError) {
      console.warn('[auth] Backend JWT issue:', session.backendAuthError);
    }
  }, [session]);

  return (
    <div className="relative min-h-screen overflow-hidden urlbeam-grid">
      <div className="pointer-events-none absolute inset-0 urlbeam-noise" />
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-[var(--signal-soft)] blur-3xl opacity-80" />
      <Header />

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:pt-24">
          <div className="max-w-3xl">
            <div className="animate-rise mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] px-3 py-1.5 text-[10px] font-700 uppercase tracking-[0.12em] text-[var(--muted)] sm:mb-6 sm:text-xs sm:tracking-[0.14em]">
              <span className="signal-dot shrink-0" />
              <span className="truncate">Link infrastructure for modern brands</span>
            </div>
            <h1 className="animate-rise-delay font-display text-4xl font-800 leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Short links that
              <span className="block text-[var(--signal)]">feel premium.</span>
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:mt-6 sm:text-xl">
              Urlbeam turns long URLs into branded, trackable, password-ready short links —
              with QR codes and analytics your audience (and clients) will trust.
            </p>
            <div className="animate-rise-delay-2 mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              {session ? (
                <Link href="/dashboard" className="btn-primary w-full sm:w-auto">Open dashboard</Link>
              ) : (
                <button
                  onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
                  className="btn-primary w-full sm:w-auto"
                >
                  Start free with Google
                </button>
              )}
              <Link href="/pricing" className="btn-secondary w-full sm:w-auto">See pricing</Link>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">Free plan includes 50 links · No credit card</p>
          </div>

          <div className="animate-rise-delay-2 mt-10 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--paper-elevated)] shadow-[var(--shadow-soft)] sm:mt-14 sm:rounded-[22px]">
            <div className="flex items-center gap-2 border-b border-[var(--line)] px-3 py-3 sm:px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 truncate text-xs font-600 text-[var(--muted)] sm:ml-3">urlbeam.app / launch</span>
            </div>
            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 p-4 sm:p-6 md:p-8">
                <p className="text-xs font-700 uppercase tracking-[0.16em] text-[var(--muted)]">Live preview</p>
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                  <p className="text-sm text-[var(--muted)]">Destination</p>
                  <p className="mt-1 break-all font-600 text-sm sm:truncate sm:text-base">https://yourbrand.com/summer-drop-2026?utm_source=ig</p>
                </div>
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink)] p-4 text-[var(--paper)]">
                  <p className="text-sm opacity-70">Short link</p>
                  <p className="mt-1 break-all font-display text-xl font-700 tracking-tight sm:text-2xl">urlbeam.app/summer</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['QR ready', 'Password lock', 'Click map', 'Custom slug'].map((item) => (
                    <span key={item} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-700 text-[var(--muted)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--line)] bg-[var(--ink)] p-4 text-[var(--paper)] sm:p-6 md:border-l md:border-t-0 md:p-8">
                <p className="text-xs font-700 uppercase tracking-[0.16em] opacity-60">Why teams switch</p>
                <ul className="mt-5 space-y-4 text-sm leading-relaxed">
                  <li>Branded short links that look trustworthy in bios, ads, and decks.</li>
                  <li>Know which campaigns convert with device, geo, and referrer insights.</li>
                  <li>Protect private drops with passwords and auto-expiry.</li>
                  <li>Generate QR codes instantly for print, packaging, and events.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
              Free URL shortener with analytics, QR codes &amp; custom short links
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              Urlbeam is built for creators, founders, and marketing teams who need a fast link shortener,
              click tracking, and branded short URLs in one place.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Custom slugs', 'Replace random codes with memorable paths that match your brand voice.'],
              ['QR codes', 'Download scannable QR art for every link — perfect for packaging and posters.'],
              ['Password gates', 'Share privately. Visitors unlock the destination with a password you set.'],
              ['Deep analytics', 'Clicks, countries, devices, browsers, and referrers in one clean view.'],
              ['Expiry controls', 'Auto-disable campaign links when the offer ends. No leftovers.'],
              ['Fast redirects', 'Optimized redirect path so visitors land quickly and bounce less.'],
            ].map(([title, copy]) => (
              <article key={title} className="surface p-6 transition hover:-translate-y-0.5">
                <h3 className="font-display text-xl font-700">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="border-y border-[var(--line)] bg-[var(--paper-elevated)]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-20 sm:px-6 md:grid-cols-3">
            {[
              ['01', 'Connect Google', 'Sign in once. Urlbeam issues a secure workspace for your links.'],
              ['02', 'Create & brand', 'Paste a URL, pick a slug, add tags, password, expiry, and QR.'],
              ['03', 'Share & learn', 'Publish everywhere, then watch real-time performance signals.'],
            ].map(([step, title, copy]) => (
              <div key={step}>
                <p className="font-display text-sm font-700 text-[var(--signal)]">{step}</p>
                <h3 className="mt-2 font-display text-2xl font-700">{title}</h3>
                <p className="mt-2 text-[var(--muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="surface overflow-hidden p-8 sm:p-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">Ready to make every link work harder?</h2>
              <p className="mt-3 text-[var(--muted)]">Join creators and teams using Urlbeam to look sharper and measure what matters.</p>
              <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
                  className="btn-primary w-full sm:w-auto"
                >
                  Create your free workspace
                </button>
                <Link href="/pricing" className="btn-secondary w-full sm:w-auto">Compare plans</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-700 tracking-tight sm:text-4xl">
              URL shortener FAQs
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              Common questions about shortening URLs, tracking clicks, and creating branded short links with Urlbeam.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                'What is a URL shortener?',
                'A URL shortener converts a long link into a short URL that redirects visitors to the original page. Urlbeam also tracks clicks and generates QR codes.',
              ],
              [
                'Can I create custom short links?',
                'Yes. Pick a custom slug like /launch so your short URL is memorable for social media, ads, SMS, and link-in-bio pages.',
              ],
              [
                'Does Urlbeam track clicks?',
                'Yes. See daily click charts plus country, city, device, browser, referrer, and UTM analytics for every short link.',
              ],
            ].map(([q, a]) => (
              <article key={q} className="surface p-5">
                <h3 className="font-display text-lg font-700">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{a}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-[var(--line)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© {new Date().getFullYear()} Urlbeam. Built for fast, beautiful short links.</p>
            <div className="flex gap-4">
              <Link href="/pricing">Pricing</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
