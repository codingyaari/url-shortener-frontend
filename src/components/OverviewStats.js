'use client';

import { useSelector } from 'react-redux';

export function OverviewStats() {
  const { total, active, links } = useSelector((state) => state.links);
  
  // Calculate total clicks from links
  const totalClicks = links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
      {/* Total Links */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-blue-900/50 dark:to-blue-800/50 backdrop-blur-lg border-2 border-indigo-200/50 dark:border-blue-500/30 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] flex-shrink-0">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <div>
          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium">Total Links</div>
          <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-blue-400 dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
            {total}
          </div>
        </div>
      </div>

      {/* Active Links */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-blue-800/50 dark:to-blue-700/50 backdrop-blur-lg border-2 border-indigo-200/50 dark:border-blue-500/30 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] flex-shrink-0">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium">Active Links</div>
          <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-blue-400 dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
            {active}
          </div>
        </div>
      </div>

     
    </div>
  );
}

