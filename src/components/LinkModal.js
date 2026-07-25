'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createLink, updateLink } from '@/store/slices/linksSlice';
import { QrPanel } from '@/components/QrPanel';

const emptyForm = {
  destinationUrl: '',
  customSlug: '',
  title: '',
  notes: '',
  tags: '',
  password: '',
  clearPassword: false,
  expiry: null,
  isActive: true,
  isFavorite: false,
  showOnBio: true,
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
};

export function LinkModal({ isOpen, onClose, onSuccess, editLink = null }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdSlug, setCreatedSlug] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editLink) {
      setFormData({
        destinationUrl: editLink.destinationUrl || '',
        customSlug: editLink.slug || '',
        title: editLink.title || '',
        notes: editLink.notes || '',
        tags: Array.isArray(editLink.tags) ? editLink.tags.join(', ') : '',
        password: '',
        clearPassword: false,
        expiry: editLink.expiry ? new Date(editLink.expiry) : null,
        isActive: editLink.isActive !== false,
        isFavorite: Boolean(editLink.isFavorite),
        showOnBio: editLink.showOnBio !== false,
        utmSource: editLink.utmSource || '',
        utmMedium: editLink.utmMedium || '',
        utmCampaign: editLink.utmCampaign || '',
      });
      setCreatedSlug(editLink.slug || null);
    } else {
      setFormData(emptyForm);
      setCreatedSlug(null);
    }
    setError(null);
  }, [isOpen, editLink]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.customSlug && /\s/.test(formData.customSlug)) {
        throw new Error('Slug cannot contain spaces');
      }

      const tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const linkData = {
        destinationUrl: formData.destinationUrl,
        slug: formData.customSlug || undefined,
        title: formData.title || undefined,
        notes: formData.notes || '',
        tags,
        isActive: formData.isActive,
        isFavorite: formData.isFavorite,
        showOnBio: formData.showOnBio,
        utmSource: formData.utmSource || '',
        utmMedium: formData.utmMedium || '',
        utmCampaign: formData.utmCampaign || '',
        expiry: formData.expiry
          ? (() => {
              const d = new Date(formData.expiry);
              d.setHours(23, 59, 59, 999);
              return d.toISOString();
            })()
          : null,
      };

      if (formData.clearPassword) linkData.clearPassword = true;
      if (formData.password) linkData.password = formData.password;

      const result = editLink
        ? await dispatch(updateLink({ id: editLink._id || editLink.id, ...linkData }))
        : await dispatch(createLink(linkData));

      if (createLink.fulfilled.match(result) || updateLink.fulfilled.match(result)) {
        onSuccess?.();
        onClose();
      } else {
        throw new Error(result.payload || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message || 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  const previewSlug = createdSlug || editLink?.slug || formData.customSlug;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[rgba(11,18,32,0.55)] sm:items-center sm:p-4">
      <div
        className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-[var(--paper-elevated)] shadow-[var(--shadow-soft)] sm:h-auto sm:max-h-[90dvh] sm:rounded-[var(--radius)] sm:border sm:border-[var(--line)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-modal-title"
      >
        {/* Fixed header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 id="link-modal-title" className="font-display text-xl font-700 sm:text-2xl">
              {editLink ? 'Edit link' : 'Create short link'}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">Brand it, protect it, track every click.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary shrink-0 !px-3 !py-2 text-sm"
          >
            Close
          </button>
        </div>

        {/* Scrollable body only */}
        <form id="link-modal-form" onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
            <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">
                    Destination URL
                  </span>
                  <input
                    required
                    className="input-field"
                    placeholder="https://example.com/your-page"
                    value={formData.destinationUrl}
                    onChange={(e) => setFormData((s) => ({ ...s, destinationUrl: e.target.value }))}
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">Title</span>
                    <input
                      className="input-field"
                      placeholder="Summer launch"
                      value={formData.title}
                      onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">Custom slug</span>
                    <input
                      className="input-field"
                      placeholder="summer-drop"
                      value={formData.customSlug}
                      onChange={(e) => setFormData((s) => ({ ...s, customSlug: e.target.value }))}
                    />
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">Tags</span>
                  <input
                    className="input-field"
                    placeholder="instagram, launch, q3"
                    value={formData.tags}
                    onChange={(e) => setFormData((s) => ({ ...s, tags: e.target.value }))}
                  />
                  <p className="text-xs text-[var(--muted)]">For filtering in your dashboard — not shown to visitors.</p>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">Private notes</span>
                  <textarea
                    className="input-field min-h-[72px] resize-y"
                    placeholder="Internal reminder for you"
                    value={formData.notes}
                    onChange={(e) => setFormData((s) => ({ ...s, notes: e.target.value }))}
                  />
                </label>

                <div className="rounded-2xl border border-[var(--line)] p-3 sm:p-4">
                  <p className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">UTM tracking</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">Appended on redirect for GA / Ads tracking.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="block space-y-1.5">
                      <span className="text-[11px] font-700 text-[var(--muted)]">utm_source</span>
                      <input
                        className="input-field"
                        placeholder="instagram"
                        value={formData.utmSource}
                        onChange={(e) => setFormData((s) => ({ ...s, utmSource: e.target.value }))}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-[11px] font-700 text-[var(--muted)]">utm_medium</span>
                      <input
                        className="input-field"
                        placeholder="social"
                        value={formData.utmMedium}
                        onChange={(e) => setFormData((s) => ({ ...s, utmMedium: e.target.value }))}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-[11px] font-700 text-[var(--muted)]">utm_campaign</span>
                      <input
                        className="input-field"
                        placeholder="summer-drop"
                        value={formData.utmCampaign}
                        onChange={(e) => setFormData((s) => ({ ...s, utmCampaign: e.target.value }))}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">
                      Password {editLink?.hasPassword ? '(set)' : ''}
                    </span>
                    <input
                      type="password"
                      className="input-field"
                      placeholder={editLink?.hasPassword ? 'Leave blank to keep' : 'Optional'}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((s) => ({ ...s, password: e.target.value, clearPassword: false }))
                      }
                    />
                    {editLink?.hasPassword && (
                      <label className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                        <input
                          type="checkbox"
                          checked={formData.clearPassword}
                          onChange={(e) =>
                            setFormData((s) => ({
                              ...s,
                              clearPassword: e.target.checked,
                              password: '',
                            }))
                          }
                        />
                        Remove password
                      </label>
                    )}
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-700 uppercase tracking-[0.12em] text-[var(--muted)]">Expiry</span>
                    <DatePicker
                      selected={formData.expiry}
                      onChange={(date) => setFormData((s) => ({ ...s, expiry: date }))}
                      className="input-field"
                      placeholderText="No expiry"
                      minDate={new Date()}
                      isClearable
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-2.5 rounded-2xl border border-[var(--line)] p-3 text-sm font-600 sm:p-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((s) => ({ ...s, isActive: e.target.checked }))}
                    />
                    Link is active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFavorite}
                      onChange={(e) => setFormData((s) => ({ ...s, isFavorite: e.target.checked }))}
                    />
                    Favorite (pin on bio)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.showOnBio}
                      onChange={(e) => setFormData((s) => ({ ...s, showOnBio: e.target.checked }))}
                    />
                    Show on public bio page
                  </label>
                </div>

                {error && (
                  <p className="rounded-xl border border-[var(--danger)]/30 bg-[rgba(214,69,69,0.08)] px-3 py-2 text-sm text-[var(--danger)]">
                    {error}
                  </p>
                )}
              </div>

              <div className="hidden md:block">
                <div className="sticky top-0 space-y-3">
                  {previewSlug ? (
                    <QrPanel slug={previewSlug} title={formData.title} />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">
                      QR appears after you save, or when you set a custom slug.
                    </div>
                  )}
                  <div className="rounded-2xl border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">
                    Tip: memorable slugs like{' '}
                    <span className="font-700 text-[var(--ink)]">/offer</span> get more clicks.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed footer */}
          <div className="shrink-0 border-t border-[var(--line)] bg-[var(--paper-elevated)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 sm:flex-none sm:!px-5"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-[2] disabled:opacity-60 sm:flex-1"
              >
                {loading ? 'Saving…' : editLink ? 'Save changes' : 'Create short link'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
