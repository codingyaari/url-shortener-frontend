'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { Header } from '@/components/Header';

const plans = [
  {
    name: 'Free',
    price: '$0',
    blurb: 'For creators validating ideas',
    features: ['50 short links', 'Custom slugs', 'QR codes', 'Basic analytics', 'Password protection', 'Link expiry'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    blurb: 'For marketers shipping campaigns weekly',
    features: ['Unlimited links', 'Advanced analytics', 'Tags & bulk tools', 'Priority redirects', 'Export reports', 'Early API access'],
    cta: 'Go Pro',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$39',
    blurb: 'For teams that need control',
    features: ['Everything in Pro', 'Team seats', 'Custom domains*', 'SSO roadmap', 'SLA support', 'Dedicated onboarding'],
    cta: 'Talk to us',
    highlight: false,
  },
];

export function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen urlbeam-grid">
      <Header solid />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-700 uppercase tracking-[0.16em] text-[var(--signal)]">Pricing</p>
          <h1 className="mt-3 font-display text-3xl font-800 tracking-tight sm:text-5xl">Simple plans that scale with your clicks</h1>
          <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">Start free. Upgrade when your links start driving real revenue.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`surface flex flex-col p-5 sm:p-6 ${plan.highlight ? 'border-[var(--ink)] ring-1 ring-[var(--ink)]' : ''}`}
            >
              {plan.highlight && (
                <p className="mb-3 text-xs font-700 uppercase tracking-[0.14em] text-[var(--signal)]">Most popular</p>
              )}
              <h2 className="font-display text-2xl font-700">{plan.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{plan.blurb}</p>
              <p className="mt-6 font-display text-4xl font-800">
                {plan.price}
                <span className="text-base font-600 text-[var(--muted)]">/mo</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[var(--muted)]">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                    {f}
                  </li>
                ))}
              </ul>
              {session ? (
                <Link href="/dashboard" className={`mt-8 ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
                  className={`mt-8 ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </button>
              )}
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">* Custom domains rolling out on Business. Stripe billing can be connected when you go live.</p>
      </main>
    </div>
  );
}
