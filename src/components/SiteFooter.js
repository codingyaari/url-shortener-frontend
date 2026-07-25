import Link from 'next/link';
import { Logo } from '@/components/Logo';
import {
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_OPERATOR,
  SITE_TAGLINE,
  getSiteUrl,
} from '@/lib/seo';

const productLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
];

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: `mailto:${SITE_CONTACT_EMAIL}`, label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function SiteFooter() {
  const siteUrl = getSiteUrl();
  let host = SITE_DOMAIN;
  try {
    host = new URL(siteUrl).host || SITE_DOMAIN;
  } catch {
    host = SITE_DOMAIN;
  }
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo href="/" size="sm" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {SITE_TAGLINE}. {SITE_DESCRIPTION.split('.')[0]}.
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              A product by{' '}
              <span className="font-700 text-[var(--ink)]">{SITE_OPERATOR}</span>
            </p>
            <a
              href={`mailto:${SITE_CONTACT_EMAIL}`}
              className="mt-2 inline-block text-sm font-700 text-[var(--signal)] hover:underline"
            >
              {SITE_CONTACT_EMAIL}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-1 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-xs font-700 uppercase tracking-[0.14em] text-[var(--ink)]">Product</p>
              <ul className="mt-4 space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-700 uppercase tracking-[0.14em] text-[var(--ink)]">Company</p>
              <ul className="mt-4 space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('mailto:') ? (
                      <a href={link.href} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-700 uppercase tracking-[0.14em] text-[var(--ink)]">Legal</p>
              <ul className="mt-4 space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME} by {SITE_OPERATOR}. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm">
            Hosted at{' '}
            <a href={siteUrl} className="font-600 text-[var(--ink)] hover:underline">
              {host}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
