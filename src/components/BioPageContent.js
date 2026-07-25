'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { getShortUrl } from '@/lib/urls';

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export function BioPageContent() {
  const params = useParams();
  const username = params?.username;
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const run = async () => {
      if (!username) {
        setStatus('error');
        setError('Invalid username');
        return;
      }
      try {
        const res = await publicApi.get(`/api/bio/${username}`);
        if (!res.data?.success) {
          setStatus('error');
          setError(res.data?.message || 'Bio not found');
          return;
        }
        setProfile(res.data.data.profile);
        setLinks(res.data.data.links || []);
        setStatus('ready');
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.message || 'Bio page not found');
      }
    };
    run();
  }, [username]);

  return (
    <div className="min-h-screen bg-[var(--paper)] urlbeam-grid px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-lg">
        {status === 'loading' && (
          <div className="surface p-10 text-center text-[var(--muted)]">Loading bio…</div>
        )}
        {status === 'error' && (
          <div className="surface p-10 text-center">
            <h1 className="font-display text-2xl font-700">Not found</h1>
            <p className="mt-2 text-[var(--muted)]">{error}</p>
            <Link href="/" className="btn-primary mt-6 inline-flex">Go to Urlbeam</Link>
          </div>
        )}
        {status === 'ready' && profile && (
          <>
            <header className="mb-8 text-center">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt=""
                  className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-[var(--line)]"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--signal-soft)] font-display text-2xl font-800 text-[var(--signal)]">
                  {(profile.name || profile.username || '?').slice(0, 1).toUpperCase()}
                </div>
              )}
              <h1 className="mt-4 font-display text-3xl font-800 tracking-tight">{profile.name}</h1>
              <p className="mt-1 text-sm font-600 text-[var(--muted)]">@{profile.username}</p>
              <p className="mt-3 text-[var(--ink)]/80">{profile.headline}</p>
            </header>

            <div className="space-y-3">
              {links.length === 0 && (
                <div className="surface p-8 text-center text-[var(--muted)]">No public links yet.</div>
              )}
              {links.map((link) => (
                <a
                  key={link.id}
                  href={getShortUrl(link.slug)}
                  className="surface block p-4 transition hover:-translate-y-0.5 hover:border-[var(--signal)]"
                >
                  <p className="font-display text-lg font-700">{link.title || link.slug}</p>
                  {(link.tags || []).length > 0 && (
                    <p className="mt-1 text-xs font-700 text-[var(--muted)]">
                      {(link.tags || []).map((t) => `#${t}`).join(' ')}
                    </p>
                  )}
                </a>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-[var(--muted)]">
              Powered by{' '}
              <Link href="/" className="font-700 text-[var(--ink)]">
                Urlbeam
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
