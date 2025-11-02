'use client';

import { useState, useEffect } from 'react';
import { LiveAnalytics } from './LiveAnalytics';

export function AnalyticsPanel() {
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // TODO: Call API to fetch stats
        // const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
        // const response = await fetch(`${apiBase}/api/links/stats`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // const data = await response.json();
        
        // For now, set default values
        setStats({
          totalLinks: 0,
          totalClicks: 0,
          activeLinks: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
          Overview
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-indigo-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-blue-900/70 dark:to-blue-800/70 backdrop-blur-lg rounded-xl p-5 border-2 border-indigo-200/50 dark:border-blue-500/50 dark:shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_0_20px_rgba(37,99,235,0.15)] hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-200">
                  Total Links
                </div>
                <svg className="w-5 h-5 text-indigo-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-white dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                {stats.totalLinks || 0}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-blue-800/70 dark:to-blue-700/70 backdrop-blur-lg rounded-xl p-5 border-2 border-indigo-200/50 dark:border-blue-500/50 dark:shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_0_20px_rgba(37,99,235,0.15)] hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-200">
                  Active Links
                </div>
                <svg className="w-5 h-5 text-indigo-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-white dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                {stats.activeLinks || 0}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Analytics */}
      {/* <LiveAnalytics /> */}
    </div>
  );
}

