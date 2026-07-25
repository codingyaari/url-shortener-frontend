'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export function Header({ solid = false }) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user;
  const displayName = user?.name || user?.email || 'Account';
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 ${solid ? 'border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md' : 'bg-[var(--paper)]/70 backdrop-blur-md'}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <Logo href="/" onClick={() => setMenuOpen(false)} />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-600 text-[var(--muted)] hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          {status === 'loading' ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-[var(--line)] sm:w-28" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="btn-secondary !hidden !px-3 !py-2 text-sm sm:!inline-flex"
              >
                Dashboard
              </Link>
              <div className="flex max-w-[42vw] items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] py-1 pl-1 pr-2 sm:max-w-none sm:pr-3">
                {user?.image || user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image || user.avatar}
                    alt={displayName}
                    className="h-7 w-7 shrink-0 rounded-full object-cover sm:h-8 sm:w-8"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-700 text-[var(--paper)] sm:h-8 sm:w-8 sm:text-[11px]">
                    {initials}
                  </span>
                )}
                <div className="hidden min-w-0 max-w-[140px] sm:block">
                  <p className="truncate text-xs font-700 leading-tight">{displayName}</p>
                  {user?.email && (
                    <p className="truncate text-[10px] leading-tight text-[var(--muted)]">{user.email}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-primary !hidden !px-3 !py-2 text-sm sm:!inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard', redirect: true })}
              className="btn-primary !px-3 !py-2 text-sm"
            >
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Get started</span>
            </button>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-[var(--line)] bg-[var(--paper)] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-700 text-[var(--ink)] hover:bg-[var(--line)]/40"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl px-3 py-3 text-sm font-700 text-[var(--ink)] hover:bg-[var(--line)]/40"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="mt-1 rounded-xl px-3 py-3 text-left text-sm font-700 text-[var(--danger)] hover:bg-[var(--line)]/40"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
