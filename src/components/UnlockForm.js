'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

function withUtm(destinationUrl, utm = {}) {
  const parsed = new URL(destinationUrl);
  if (utm.utmSource && !parsed.searchParams.has('utm_source')) {
    parsed.searchParams.set('utm_source', utm.utmSource);
  }
  if (utm.utmMedium && !parsed.searchParams.has('utm_medium')) {
    parsed.searchParams.set('utm_medium', utm.utmMedium);
  }
  if (utm.utmCampaign && !parsed.searchParams.has('utm_campaign')) {
    parsed.searchParams.set('utm_campaign', utm.utmCampaign);
  }
  return parsed.href;
}

export default function UnlockForm({ slug }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('password');

  const unlock = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const res = await publicApi.post(`/api/links/slug/${slug}/unlock`, { password });
      const link = res.data?.data;
      if (!res.data?.success || !link?.destinationUrl) {
        setStatus('password');
        setError('Incorrect password');
        return;
      }

      const href = withUtm(link.destinationUrl, {
        utmSource: link.utmSource,
        utmMedium: link.utmMedium,
        utmCampaign: link.utmCampaign,
      });

      publicApi
        .post('/api/clicks', {
          linkId: link._id || link.id,
          sessionId: `session_${Date.now()}`,
        })
        .catch(() => {});

      setStatus('redirecting');
      window.location.replace(href);
    } catch (err) {
      setStatus('password');
      setError(err.response?.data?.message || 'Incorrect password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-4 urlbeam-grid">
      <div className="surface w-full max-w-md p-8 text-center">
        {status === 'loading' || status === 'redirecting' ? (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--ink)]" />
            <p className="mt-4 text-[var(--muted)]">
              {status === 'redirecting' ? 'Taking you there…' : 'Checking password…'}
            </p>
          </>
        ) : (
          <form onSubmit={unlock} className="space-y-4 text-left">
            <div className="text-center">
              <h1 className="font-display text-2xl font-700">Protected link</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Enter the password to continue to the destination.
              </p>
            </div>
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Unlock
            </button>
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => router.push('/')}
            >
              Go home
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
