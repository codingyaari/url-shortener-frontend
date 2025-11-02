'use client';

import { useState } from 'react';

export function LinkForm() {
  const [formData, setFormData] = useState({
    destinationUrl: '',
    customSlug: '',
    title: '',
    expiry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
      
      const response = await fetch(`${apiBase}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationUrl: formData.destinationUrl,
          customSlug: formData.customSlug || undefined,
          title: formData.title || undefined,
          expiry: formData.expiry || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create link' }));
        throw new Error(errorData.message || 'Failed to create link');
      }

      const data = await response.json();
      setSuccess(`Link created successfully! Short URL: ${data.shortUrl || 'N/A'}`);
      
      // Reset form
      setFormData({
        destinationUrl: '',
        customSlug: '',
        title: '',
        expiry: '',
      });

      // Trigger refresh of recent links (you can use a context or callback here)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('linkCreated'));
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5),0_0_80px_rgba(167,139,250,0.3)]">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Create Short Link
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination URL */}
        <div>
          <label htmlFor="destinationUrl" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
            Destination URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="destinationUrl"
            required
            value={formData.destinationUrl}
            onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
            placeholder="https://example.com/very/long/url"
          />
        </div>

        {/* Custom Slug */}
        <div>
          <label htmlFor="customSlug" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Custom Slug (optional)
          </label>
          <input
            type="text"
            id="customSlug"
            value={formData.customSlug}
            onChange={(e) => setFormData({ ...formData, customSlug: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
            placeholder="my-custom-link"
            pattern="[a-zA-Z0-9-_]+"
            title="Only alphanumeric characters, hyphens, and underscores allowed"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty for auto-generated slug
          </p>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
            placeholder="My Awesome Link"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Expiry Date (optional)
          </label>
          <input
            type="datetime-local"
            id="expiry"
            value={formData.expiry}
            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/60 dark:shadow-[0_0_15px_rgba(129,140,248,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-white dark:focus:shadow-[0_0_25px_rgba(129,140,248,0.8)] transition-all"
          />
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9),0_0_150px_rgba(236,72,153,0.7)] dark:border-2 dark:border-indigo-400/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-black"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </span>
          ) : (
            'Create Short Link'
          )}
        </button>
      </form>
    </div>
  );
}

