'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group relative bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-indigo-500/20 dark:border-indigo-400/30 dark:shadow-[0_0_15px_rgba(129,140,248,0.2)] hover:border-indigo-400/50 dark:hover:border-indigo-400/50 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
    >
      {/* Inside Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:via-violet-500/10 group-hover:to-purple-500/10 dark:group-hover:from-indigo-400/20 dark:group-hover:via-violet-400/20 dark:group-hover:to-purple-400/20 transition-all duration-300 pointer-events-none"></div>
      
      {/* Content - Relative to appear above glow */}
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 flex-shrink-0"></div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
              {link.title || 'Untitled Link'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Created {formatDate(link.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(link)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
              aria-label="Edit link"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(link)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
              aria-label="Delete link"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Destination URL */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
            {link.destinationUrl || link.destination}
          </p>
        </div>
      </div>

      {/* Short URL */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/30 dark:to-violet-900/30 border border-indigo-200/60 dark:border-indigo-400/30 mb-3 sm:mb-4">
        <code className="flex-1 text-xs sm:text-sm font-mono text-indigo-700 dark:text-indigo-300 truncate">
          {shortUrl}
        </code>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(shortUrl)}
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 hover:from-indigo-700 hover:to-violet-700 dark:hover:from-indigo-400 dark:hover:to-violet-400 text-white transition-all shadow-md dark:shadow-[0_0_10px_rgba(129,140,248,0.4)] cursor-pointer whitespace-nowrap flex items-center gap-1"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-indigo-500/10 dark:border-gray-600/30">
        <div className="text-center p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 dark:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
              {link.clicks || 0}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Clicks</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-teal-50/50 dark:bg-teal-900/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className={`w-2 h-2 rounded-full ${
              isExpired 
                ? 'bg-red-500 dark:bg-red-400' 
                : 'bg-teal-500 dark:bg-emerald-400' 
            }`}></div>
            <div className={`text-base sm:text-lg font-bold ${
              isExpired 
                ? 'text-red-600 dark:text-red-400 dark:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                : 'text-teal-600 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
            }`}>
              {isExpired ? 'Expired' : 'Active' }
            </div>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Status</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-violet-50/50 dark:bg-violet-900/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <svg className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-base sm:text-lg font-bold text-violet-600 dark:text-violet-400 dark:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">
              {link.expiry ? formatDate(link.expiry).split(',')[0] : 'Never'}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Expires</div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}

