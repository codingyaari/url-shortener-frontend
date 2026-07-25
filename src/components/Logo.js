'use client';

import Link from 'next/link';

export function Logo({ href = '/', size = 'md', showWordmark = true, onClick }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const text = size === 'sm' ? 'text-lg' : 'text-xl';

  const mark = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`relative inline-flex ${box} items-center justify-center overflow-hidden rounded-xl bg-[var(--ink)]`}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-[70%] w-[70%]" fill="none">
          <path d="M7 16h9" stroke="var(--signal)" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M16 10.5L24 16l-8 5.5V10.5z" fill="var(--signal)" />
          <circle cx="7" cy="16" r="2.4" fill="var(--paper)" />
        </svg>
      </span>
      {showWordmark && (
        <span className={`font-display ${text} font-700 tracking-tight`}>Urlbeam</span>
      )}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="group inline-flex items-center" onClick={onClick} aria-label="Urlbeam home">
      {mark}
    </Link>
  );
}
