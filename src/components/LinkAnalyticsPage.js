'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import api from '@/lib/axios';
import { getShortUrl } from '@/lib/urls';
import { useToast } from './ToastContainer';

const RANGES = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'all', label: 'All time' },
];

function StatCard({ label, value, hint }) {
  return (
    <div className="surface p-5">
      <p className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-display text-3xl font-800 tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

function RankList({ title, items, nameKey = 'name', empty = 'No data yet' }) {
  const max = items.length ? Math.max(...items.map((i) => i.count)) : 1;
  return (
    <div className="surface p-5">
      <h3 className="font-display text-lg font-700">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length === 0 && <p className="text-sm text-[var(--muted)]">{empty}</p>}
        {items.map((item) => (
          <div key={item[nameKey]}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-600">{item[nameKey]}</span>
              <span className="shrink-0 font-700 text-[var(--signal)]">{item.count}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full bg-[var(--ink)]"
                style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LinkAnalyticsPage({ slug }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [link, setLink] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setLoading(false);
        setError('No slug provided');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/links/analytics/${slug}?range=${range}`);
        if (response.data?.success && response.data?.data) {
          setLink(response.data.data.link);
          setAnalytics(response.data.data.analytics);
        } else {
          setError(response.data?.message || 'Failed to load analytics');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, range]);

  const shortUrl = link ? getShortUrl(link.slug) : '';

  const countries = useMemo(() => {
    if (analytics?.topCountries?.length) {
      return analytics.topCountries.map((c) => ({ name: c.country, count: c.count }));
    }
    return Object.entries(analytics?.clicksByCountry || {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [analytics]);

  const devices = useMemo(
    () => Object.entries(analytics?.clicksByDevice || {}).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    [analytics]
  );
  const browsers = useMemo(
    () => Object.entries(analytics?.clicksByBrowser || {}).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    [analytics]
  );
  const osList = useMemo(
    () => Object.entries(analytics?.clicksByOS || {}).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    [analytics]
  );
  const referrers = useMemo(() => {
    if (analytics?.topReferrers?.length) {
      return analytics.topReferrers.map((r) => ({ name: r.referrer, count: r.count }));
    }
    return Object.entries(analytics?.clicksByReferrer || {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [analytics]);
  const languages = useMemo(() => {
    if (analytics?.topLanguages?.length) {
      return analytics.topLanguages.map((l) => ({ name: l.language, count: l.count }));
    }
    return Object.entries(analytics?.clicksByLanguage || {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [analytics]);
  const utmSources = useMemo(
    () => Object.entries(analytics?.clicksByUTMSource || {}).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    [analytics]
  );

  const timeline = analytics?.clicksOverTime || [];
  const maxTimeline = timeline.length ? Math.max(...timeline.map((t) => t.count), 1) : 1;
  const hasLocalTraffic = (analytics?.recentClicks || []).some(
    (c) => c.ip === 'Localhost' || c.country === 'Local network' || String(c.referrer || '').includes('localhost')
  );

  const exportCsv = () => {
    const rows = [['Time', 'IP', 'Country', 'City', 'Device', 'Browser', 'OS', 'Referrer', 'Language', 'UTM']];
    (analytics?.recentClicks || []).forEach((c) => {
      rows.push([
        new Date(c.timestamp).toISOString(),
        c.ip,
        c.country,
        c.city,
        c.device,
        c.browser,
        c.os,
        c.referrer,
        c.language,
        c.utmSource || '',
      ]);
    });
    const csv = rows.map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-analytics-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported', 'success');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shortUrl);
    showToast('Short link copied', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)]">
        <Header solid />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
          <div className="surface p-12 text-center text-[var(--muted)]">Loading analytics…</div>
        </main>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-[var(--paper)]">
        <Header solid />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
          <div className="surface p-10 text-center">
            <h1 className="font-display text-2xl font-700">{error || 'Link not found'}</h1>
            <button className="btn-primary mt-6" onClick={() => router.push('/dashboard')}>Back to dashboard</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <Header solid />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="text-sm font-600 text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← Back to dashboard
        </button>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-700 uppercase tracking-[0.14em] text-[var(--signal)]">Analytics</p>
            <h1 className="mt-2 break-words font-display text-2xl font-800 tracking-tight sm:text-4xl">{link.title || 'Untitled link'}</h1>
            <p className="mt-2 break-all font-600 text-sm text-[var(--signal)] sm:truncate sm:text-base">{shortUrl}</p>
            <p className="mt-1 break-all text-sm text-[var(--muted)] sm:truncate">{link.destinationUrl}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" className="btn-secondary !w-full !px-3 !py-2 text-sm sm:!w-auto" onClick={copyLink}>Copy link</button>
            <button type="button" className="btn-secondary !w-full !px-3 !py-2 text-sm sm:!w-auto" onClick={exportCsv}>Export CSV</button>
            <a href={shortUrl} target="_blank" rel="noreferrer" className="btn-primary col-span-2 !w-full !px-3 !py-2 text-sm sm:col-auto sm:!w-auto">Open link</a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-700 transition ${
                range === item.id
                  ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                  : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {hasLocalTraffic && (
          <div className="mt-5 rounded-2xl border border-[var(--amber)]/35 bg-[rgba(230,162,60,0.12)] px-4 py-3 text-sm">
            <span className="font-700">Local testing mode:</span> clicks from localhost can’t resolve real countries/IPs.
            Deploy Urlbeam and share the link publicly to see live geo, cities, and referrers.
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total clicks" value={analytics?.totalClicks ?? 0} hint={`Range: ${range}`} />
          <StatCard label="Unique sessions" value={analytics?.uniqueSessions ?? 0} hint="Approx. unique visitors" />
          <StatCard label="Avg / day" value={analytics?.avgClicksPerDay ?? 0} hint="In selected range" />
          <StatCard label="Lifetime sources" value={referrers.length} hint="Where traffic came from" />
        </div>

        <div className="surface mt-6 p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-700">Clicks over time</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Bar chart of how many times this link was clicked each day
                {timeline[0]?.hour !== undefined ? ' (hourly for a single day)' : ''}.
              </p>
            </div>
            <p className="shrink-0 text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">
              {timeline[0]?.hour !== undefined ? 'Hourly' : 'Daily'}
            </p>
          </div>
          <div className="mt-6 h-48 sm:h-56">
            {timeline.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm text-[var(--muted)]">
                No clicks in this range yet
              </div>
            ) : (
              <div className="flex h-full items-end gap-1 overflow-x-auto pb-1 sm:gap-1.5">
                {timeline.map((item, idx) => {
                  const barPx = Math.max(6, Math.round((item.count / maxTimeline) * 160));
                  const showLabel =
                    timeline.length <= 8
                      ? true
                      : item.hour !== undefined
                        ? idx % 3 === 0
                        : idx === 0 || idx === timeline.length - 1 || idx % Math.ceil(timeline.length / 5) === 0;
                  return (
                    <div
                      key={`${item.label}-${idx}`}
                      className="group flex h-full min-w-[36px] flex-1 flex-col items-center justify-end gap-2 sm:min-w-[28px]"
                      title={`${item.label}: ${item.count} click${item.count === 1 ? '' : 's'}`}
                    >
                      <span className="text-[10px] font-700 text-[var(--signal)] opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                        {item.count}
                      </span>
                      <div
                        className="w-full max-w-[40px] rounded-t-md bg-[var(--signal)] transition group-hover:bg-[var(--ink)]"
                        style={{ height: `${barPx}px` }}
                      />
                      <span className={`h-8 w-full truncate text-center text-[9px] font-600 leading-tight text-[var(--muted)] sm:text-[10px] ${showLabel ? '' : 'invisible'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <RankList title="Top countries" items={countries} />
          <RankList title="Top cities" items={(analytics?.topCities || []).map((c) => ({ name: c.city, count: c.count }))} />
          <RankList title="Devices" items={devices} />
          <RankList title="Browsers" items={browsers} />
          <RankList title="Operating systems" items={osList} />
          <RankList title="Referrers" items={referrers} />
          <RankList title="Languages" items={languages} empty="No language signals yet" />
          <RankList title="UTM sources" items={utmSources} empty="Add ?utm_source=… to track campaigns" />
        </div>

        <div className="surface mt-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <h2 className="font-display text-lg font-700">Recent clicks</h2>
            <p className="text-xs text-[var(--muted)]">Latest 100 in range</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-[var(--paper)] text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                <tr>
                  {['Time', 'Location', 'Device', 'Browser', 'OS', 'Referrer', 'Language'].map((h) => (
                    <th key={h} className="px-4 py-3 font-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(analytics?.recentClicks || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[var(--muted)]">No clicks recorded in this range</td>
                  </tr>
                ) : (
                  analytics.recentClicks.map((click) => (
                    <tr key={click.id} className="border-t border-[var(--line)]">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(click.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-600">{click.city}</div>
                        <div className="text-xs text-[var(--muted)]">{click.country} · {click.ip}</div>
                      </td>
                      <td className="px-4 py-3">{click.device}</td>
                      <td className="px-4 py-3">{click.browser}</td>
                      <td className="px-4 py-3">{click.os}</td>
                      <td className="max-w-[180px] truncate px-4 py-3">{click.referrer}</td>
                      <td className="px-4 py-3">{click.language}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
