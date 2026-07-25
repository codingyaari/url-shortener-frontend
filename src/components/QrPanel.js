'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { getShortUrl } from '@/lib/urls';

export function QrPanel({ slug, title, size = 'md', showActions = true, className = '' }) {
  const [dataUrl, setDataUrl] = useState('');
  const shortUrl = useMemo(() => (slug ? getShortUrl(slug) : ''), [slug]);
  const px = size === 'sm' ? 132 : 280;
  const box = size === 'sm' ? 'h-[132px] w-[132px]' : 'h-44 w-44';

  useEffect(() => {
    if (!shortUrl) return;
    let cancelled = false;
    QRCode.toDataURL(shortUrl, {
      width: px,
      margin: 1,
      color: { dark: '#0b1220', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [shortUrl, px]);

  if (!slug) return null;

  return (
    <div className={className || (size === 'sm' ? '' : 'surface p-4')}>
      {size !== 'sm' && (
        <>
          <p className="text-xs font-700 uppercase tracking-[0.14em] text-[var(--muted)]">QR code</p>
          <p className="mt-1 truncate text-sm font-600">{title || shortUrl}</p>
        </>
      )}
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt={`QR for ${slug}`}
          className={`${size === 'sm' ? 'mx-auto' : 'mx-auto mt-4'} ${box} rounded-xl border border-[var(--line)] bg-white p-1.5`}
        />
      ) : (
        <div className={`${size === 'sm' ? 'mx-auto' : 'mx-auto mt-4'} ${box} animate-pulse rounded-xl bg-[var(--line)]`} />
      )}
      {showActions && (
        <div className="mt-4 flex gap-2">
          <a
            href={dataUrl || '#'}
            download={`${slug}-qr.png`}
            className="btn-secondary !py-2 !px-3 flex-1 text-center text-sm"
          >
            Download
          </a>
          <button
            type="button"
            className="btn-primary !py-2 !px-3 flex-1 text-sm"
            onClick={() => navigator.clipboard.writeText(shortUrl)}
          >
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}
