'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LinkCard({ link, onEdit, onDelete }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const shortUrl = link.shortUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${link.slug}` : `/${link.slug}`);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if link is expired
  const isExpired = link.expiry ? new Date(link.expiry) < new Date() : false;
  const isActive = link.expiry ? !isExpired : true;

  const handleCardClick = (e) => {
    // Don't trigger if clicking on buttons or copy button
    if (e.target.closest('button') || e.target.closest('code')) {
      return;
    }
    // Navigate to analytics page
    router.push(`/dashboard/analytics/${link.slug}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_20px_rgba(59,130,246,0.4),0_0_40px_rgba(37,99,235,0.2)] hover:border-indigo-400/50 dark:hover:border-blue-400/60 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_0_60px_rgba(37,99,235,0.3)] transition-all duration-500 ease-out cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
            {link.title || 'Untitled Link'}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Created {formatDate(link.createdAt)}
          </p>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(link)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
              aria-label="Edit link"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(link)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
              aria-label="Delete link"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Destination URL */}
      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
          {link.destinationUrl || link.destination}
        </p>
      </div>

      {/* Short URL */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-50/50 dark:bg-gray-700/50 border border-indigo-200/50 dark:border-gray-600/50 mb-3 sm:mb-4">
        <code className="flex-1 text-xs sm:text-sm font-mono text-indigo-700 dark:text-blue-300 truncate">
          {shortUrl}
        </code>
        <button
          onClick={() => copyToClipboard(shortUrl)}
          className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg bg-indigo-600 dark:bg-blue-500 hover:bg-indigo-700 dark:hover:bg-blue-400 text-white transition-colors shadow-lg dark:shadow-[0_0_10px_rgba(59,130,246,0.6)] cursor-pointer whitespace-nowrap"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-indigo-500/10 dark:border-gray-600/50">
        <div className="text-center">
          <div className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-blue-400 dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
            {link.clicks || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Clicks</div>
        </div>
        <div className="text-center">
          <div className={`text-lg sm:text-xl font-bold ${
            isExpired 
              ? 'text-red-600 dark:text-red-400 dark:drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]' 
              : 'text-teal-600 dark:text-emerald-400 dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]' 
          }`}>
            {isExpired ? 'Expired' : 'Active' }
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Status</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-xl font-bold text-violet-600 dark:text-blue-400 dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
            {link.expiry ? formatDate(link.expiry).split(',')[0] : 'Never'}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Expires</div>
        </div>
      </div>
    </div>
  );
}

