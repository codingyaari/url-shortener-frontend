'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from './Header';
import { LinkModal } from './LinkModal';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './ToastContainer';
import { fetchLinks, deleteLink, updateLink, createLink } from '@/store/slices/linksSlice';
import { getShortUrl, getBioUrl } from '@/lib/urls';
import Link from 'next/link';
import { QrPanel } from './QrPanel';
import api from '@/lib/axios';

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function DashboardContent() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const { links, loading, total, active, error } = useSelector((state) => state.links);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLink, setEditLink] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', bioHeadline: '', bioEnabled: true });
  const [profileSaving, setProfileSaving] = useState(false);
  const [localUsername, setLocalUsername] = useState('');
  const [copyMenuId, setCopyMenuId] = useState(null);

  const username = localUsername || session?.user?.username;

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  useEffect(() => {
    if (session?.user) {
      setProfileForm({
        username: session.user.username || '',
        bioHeadline: session.user.bioHeadline || '',
        bioEnabled: session.user.bioEnabled !== false,
      });
      if (session.user.username) setLocalUsername(session.user.username);
    }
  }, [session?.user]);

  const allTags = useMemo(() => {
    const set = new Set();
    links.forEach((l) => (l.tags || []).forEach((t) => set.add(t)));
    return [...set].sort();
  }, [links]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return links.filter((l) => {
      if (favoritesOnly && !l.isFavorite) return false;
      if (tagFilter && !(l.tags || []).includes(tagFilter)) return false;
      if (!q) return true;
      return [l.title, l.slug, l.destinationUrl, l.notes, ...(l.tags || [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [links, query, tagFilter, favoritesOnly]);

  const totalClicks = useMemo(
    () => links.reduce((sum, l) => sum + (l.clicks || 0), 0),
    [links]
  );

  const onCopy = async (text, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(label, 'success');
    } catch {
      showToast('Could not copy — check browser permissions', 'error');
    } finally {
      setCopyMenuId(null);
    }
  };

  const copyFormats = (link) => {
    const shortUrl = getShortUrl(link.slug);
    const title = link.title || link.slug;
    return [
      { label: 'Short URL', text: shortUrl, toast: 'Short link copied' },
      { label: 'Markdown', text: `[${title}](${shortUrl})`, toast: 'Markdown copied' },
      { label: 'HTML', text: `<a href="${shortUrl}">${title}</a>`, toast: 'HTML copied' },
    ];
  };

  const onDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    const id = linkToDelete._id || linkToDelete.id;
    const result = await dispatch(deleteLink(id));
    setIsDeleting(false);
    setLinkToDelete(null);
    if (deleteLink.fulfilled.match(result)) showToast('Link deleted', 'success');
    else showToast(result.payload || 'Delete failed', 'error');
  };

  const patchLink = async (link, patch, successMsg) => {
    const result = await dispatch(
      updateLink({
        id: link._id || link.id,
        destinationUrl: link.destinationUrl,
        title: link.title,
        slug: link.slug,
        notes: link.notes || '',
        tags: link.tags || [],
        expiry: link.expiry || null,
        isActive: link.isActive,
        isFavorite: link.isFavorite,
        showOnBio: link.showOnBio !== false,
        utmSource: link.utmSource || '',
        utmMedium: link.utmMedium || '',
        utmCampaign: link.utmCampaign || '',
        ...patch,
      })
    );
    if (updateLink.fulfilled.match(result)) {
      showToast(successMsg, 'success');
      dispatch(fetchLinks());
    } else {
      showToast(result.payload || 'Update failed', 'error');
    }
  };

  const toggleActive = (link) =>
    patchLink(link, { isActive: !link.isActive }, link.isActive ? 'Link paused' : 'Link activated');

  const toggleFavorite = (link) =>
    patchLink(link, { isFavorite: !link.isFavorite }, link.isFavorite ? 'Removed from favorites' : 'Added to favorites');

  const duplicateLink = async (link) => {
    const result = await dispatch(
      createLink({
        destinationUrl: link.destinationUrl,
        title: `${link.title || 'Untitled'} (copy)`,
        notes: link.notes || '',
        tags: link.tags || [],
        isActive: true,
        isFavorite: false,
        showOnBio: link.showOnBio !== false,
        utmSource: link.utmSource || '',
        utmMedium: link.utmMedium || '',
        utmCampaign: link.utmCampaign || '',
        expiry: link.expiry || null,
      })
    );
    if (createLink.fulfilled.match(result)) {
      showToast('Link duplicated', 'success');
      dispatch(fetchLinks());
    } else {
      showToast(result.payload || 'Duplicate failed', 'error');
    }
  };

  const exportCsv = () => {
    const rows = [
      ['title', 'slug', 'short_url', 'destination', 'tags', 'notes', 'clicks', 'active', 'favorite', 'utm_source', 'utm_medium', 'utm_campaign', 'created_at'],
      ...filtered.map((l) => [
        l.title,
        l.slug,
        getShortUrl(l.slug),
        l.destinationUrl,
        (l.tags || []).join('|'),
        l.notes || '',
        l.clicks || 0,
        l.isActive ? 'yes' : 'no',
        l.isFavorite ? 'yes' : 'no',
        l.utmSource || '',
        l.utmMedium || '',
        l.utmCampaign || '',
        l.createdAt || '',
      ]),
    ];
    const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urlbeam-links-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported', 'success');
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await api.put('/api/auth/profile', profileForm);
      if (!res.data?.success) throw new Error(res.data?.message || 'Save failed');
      showToast('Profile updated', 'success');
      if (res.data.data?.username) setLocalUsername(res.data.data.username);
      setProfileOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Save failed', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <Header solid />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-700 uppercase tracking-[0.14em] text-[var(--signal)]">Workspace</p>
            <h1 className="mt-2 font-display text-2xl font-800 tracking-tight sm:text-4xl">
              Welcome{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
              Tags organize campaigns · Notes are private reminders · Bio page shares your public links.
            </p>
            {username && (
              <p className="mt-2 text-sm">
                Your bio:{' '}
                <a
                  href={getBioUrl(username)}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all font-700 text-[var(--signal)] underline underline-offset-2 hover:opacity-80"
                >
                  {getBioUrl(username)}
                </a>
              </p>
            )}
            {session?.backendAuthError && (
              <p className="mt-3 rounded-xl border border-[var(--amber)]/40 bg-[rgba(230,162,60,0.12)] px-3 py-2 text-sm">
                Backend auth issue: {session.backendAuthError}. API actions may fail until this is fixed.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => setProfileOpen(true)}>
              Bio settings
            </button>
            <button
              type="button"
              className="btn-primary w-full sm:w-auto"
              onClick={() => {
                setEditLink(null);
                setIsModalOpen(true);
              }}
            >
              Create link
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            ['Total links', total ?? links.length],
            ['Active', active ?? links.filter((l) => l.isActive).length],
            ['Total clicks', totalClicks],
          ].map(([label, value]) => (
            <div key={label} className="surface p-3 sm:p-5">
              <p className="text-[10px] font-700 uppercase tracking-[0.1em] text-[var(--muted)] sm:text-xs sm:tracking-[0.12em]">{label}</p>
              <p className="mt-1 font-display text-xl font-800 sm:mt-2 sm:text-3xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <input
              className="input-field w-full sm:max-w-xs"
              placeholder="Search title, slug, tag, notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="input-field w-full sm:max-w-[11rem]"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="">All tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm font-600 whitespace-nowrap">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
              />
              Favorites only
            </label>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" className="btn-secondary !px-3 !py-2 text-sm w-full sm:w-auto" onClick={exportCsv} disabled={!filtered.length}>
              Export CSV
            </button>
            <p className="text-sm text-[var(--muted)]">{filtered.length} shown · Free plan up to 50 links</p>
          </div>
        </div>

        <div className="mt-5">
          {loading && links.length === 0 && (
            <div className="surface p-8 text-center text-[var(--muted)]">Loading your links…</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="surface p-10 text-center">
              <h3 className="font-display text-xl font-700">No links yet</h3>
              <p className="mt-2 text-[var(--muted)]">Create your first Urlbeam link and start tracking.</p>
              <button type="button" className="btn-primary mt-5" onClick={() => setIsModalOpen(true)}>Create link</button>
            </div>
          )}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((link) => {
              const shortUrl = getShortUrl(link.slug);
              const linkId = link._id || link.id;
              return (
                <article key={linkId} className="surface flex min-w-0 flex-col p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 order-2 sm:order-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          title={link.isFavorite ? 'Unfavorite' : 'Favorite'}
                          className="text-lg leading-none"
                          onClick={() => toggleFavorite(link)}
                          aria-label="Toggle favorite"
                        >
                          {link.isFavorite ? '★' : '☆'}
                        </button>
                        <h3 className="min-w-0 break-words font-display text-lg font-700">{link.title || 'Untitled'}</h3>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-700 ${link.isActive ? 'bg-[var(--signal-soft)] text-[var(--signal)]' : 'bg-[var(--line)] text-[var(--muted)]'}`}>
                          {link.isActive ? 'Active' : 'Paused'}
                        </span>
                        {link.hasPassword && (
                          <span className="rounded-full bg-[var(--line)] px-2 py-0.5 text-[11px] font-700 text-[var(--muted)]">Password</span>
                        )}
                        {link.showOnBio === false && (
                          <span className="rounded-full bg-[var(--line)] px-2 py-0.5 text-[11px] font-700 text-[var(--muted)]">Hidden</span>
                        )}
                      </div>
                    </div>
                    <div className="order-1 mx-auto shrink-0 sm:order-2 sm:mx-0">
                      <QrPanel slug={link.slug} title={link.title} size="sm" showActions={false} />
                    </div>
                  </div>

                  <p className="mt-3 break-all font-600 text-[var(--signal)] text-sm sm:truncate sm:text-base">{shortUrl}</p>
                  <p className="mt-1 break-all text-sm text-[var(--muted)] sm:truncate">{link.destinationUrl}</p>
                  {link.notes ? (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--ink)]/80">
                      <span className="font-700 text-[var(--muted)]">Note:</span> {link.notes}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(link.tags || []).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-700 ${tagFilter === tag ? 'border-[var(--signal)] text-[var(--signal)]' : 'border-[var(--line)] text-[var(--muted)]'}`}
                        onClick={() => setTagFilter((prev) => (prev === tag ? '' : tag))}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  <Link
                    href={`/dashboard/analytics/${link.slug}`}
                    className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--signal)]/25 bg-[var(--signal-soft)] px-3 py-3 transition hover:border-[var(--signal)]"
                  >
                    <div className="flex h-10 shrink-0 items-end gap-0.5" aria-hidden>
                      {[16, 26, 14, 32, 22, 36, 20].map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 rounded-sm bg-[var(--signal)]"
                          style={{ height: `${h}px`, opacity: 0.45 + i * 0.07 }}
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xl font-800 leading-none text-[var(--ink)]">
                        {link.clicks || 0}
                        <span className="ml-1 text-sm font-700 text-[var(--muted)]">clicks</span>
                      </p>
                      <p className="mt-1 text-xs font-700 text-[var(--signal)]">
                        View charts &amp; details →
                      </p>
                    </div>
                  </Link>

                  <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[var(--line)] pt-4 mt-4 sm:flex sm:flex-wrap">
                    <div className="relative col-span-1">
                      <button
                        type="button"
                        className="btn-secondary !w-full !px-3 !py-2 text-sm sm:!w-auto"
                        onClick={() => setCopyMenuId((id) => (id === linkId ? null : linkId))}
                      >
                        Copy
                      </button>
                      {copyMenuId === linkId && (
                        <div className="absolute left-0 bottom-full z-20 mb-1 min-w-[140px] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] shadow-lg">
                          {copyFormats(link).map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm font-600 hover:bg-[var(--line)]/50"
                              onClick={() => onCopy(opt.text, opt.toast)}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="button" className="btn-secondary !w-full !px-3 !py-2 text-sm sm:!w-auto" onClick={() => setQrLink(link)}>
                      QR
                    </button>
                    <button type="button" className="btn-secondary !w-full !px-3 !py-2 text-sm sm:!w-auto" onClick={() => duplicateLink(link)}>
                      Duplicate
                    </button>
                    <button type="button" className="btn-secondary !w-full !px-3 !py-2 text-sm sm:!w-auto" onClick={() => toggleActive(link)}>
                      {link.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary !w-full !px-3 !py-2 text-sm sm:!w-auto"
                      onClick={() => {
                        setEditLink(link);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-secondary !w-full !px-3 !py-2 text-sm text-[var(--danger)] sm:!w-auto"
                      onClick={() => setLinkToDelete(link)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>}
      </main>

      <LinkModal
        isOpen={isModalOpen}
        editLink={editLink}
        onClose={() => {
          setIsModalOpen(false);
          setEditLink(null);
        }}
        onSuccess={() => {
          dispatch(fetchLinks());
          showToast(editLink ? 'Link updated' : 'Link created', 'success');
        }}
      />

      {qrLink && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(11,18,32,0.45)] p-4">
          <div className="w-full max-w-sm space-y-3">
            <QrPanel slug={qrLink.slug} title={qrLink.title} />
            <button type="button" className="btn-secondary w-full" onClick={() => setQrLink(null)}>Close</button>
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[rgba(11,18,32,0.45)] p-3 sm:items-center">
          <form onSubmit={saveProfile} className="surface w-full max-w-md space-y-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-700">Bio page settings</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Public page that lists your active links.</p>
              </div>
              <button type="button" className="btn-secondary !px-3 !py-2 text-sm" onClick={() => setProfileOpen(false)}>Close</button>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">Username</span>
              <input
                className="input-field"
                required
                minLength={3}
                value={profileForm.username}
                onChange={(e) => setProfileForm((s) => ({ ...s, username: e.target.value }))}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">Headline</span>
              <input
                className="input-field"
                maxLength={160}
                placeholder="Links worth clicking"
                value={profileForm.bioHeadline}
                onChange={(e) => setProfileForm((s) => ({ ...s, bioHeadline: e.target.value }))}
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-600">
              <input
                type="checkbox"
                checked={profileForm.bioEnabled}
                onChange={(e) => setProfileForm((s) => ({ ...s, bioEnabled: e.target.checked }))}
              />
              Bio page is public
            </label>
            {profileForm.username && (
              <p className="text-sm text-[var(--muted)]">
                Preview:{' '}
                <a
                  href={getBioUrl(profileForm.username)}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all font-700 text-[var(--signal)] underline underline-offset-2"
                >
                  {getBioUrl(profileForm.username)}
                </a>
              </p>
            )}
            <button type="submit" disabled={profileSaving} className="btn-primary w-full disabled:opacity-60">
              {profileSaving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(linkToDelete)}
        title="Delete this link?"
        message="This cannot be undone. Short URL will stop working."
        confirmText={isDeleting ? 'Deleting…' : 'Delete'}
        isLoading={isDeleting}
        onConfirm={onDelete}
        onClose={() => setLinkToDelete(null)}
      />
    </div>
  );
}
