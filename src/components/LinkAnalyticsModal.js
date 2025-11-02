'use client';

import { useState, useEffect } from 'react';
export function LinkAnalyticsModal({ isOpen, onClose, link }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (isOpen && link) {
        try {
          setLoading(true);
          // TODO: Call API to fetch analytics
          // const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
          // const response = await fetch(`${apiBase}/api/links/${link.id || link.slug}/analytics`, {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // const data = await response.json();
          // setAnalytics(data);
          
          // For now, set empty/default values
          setAnalytics({
            totalClicks: 0,
            clicksByCountry: {},
            clicksByDevice: {},
            clicksByBrowser: {},
            clicksByOS: {},
            clicksOverTime: [],
            recentClicks: [],
          });
        } catch (error) {
          console.error('Error fetching analytics:', error);
          setAnalytics({
            totalClicks: 0,
            clicksByCountry: {},
            clicksByDevice: {},
            clicksByBrowser: {},
            clicksByOS: {},
            clicksOverTime: [],
            recentClicks: [],
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();
  }, [isOpen, link]);

  if (!isOpen || !link) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Prepare chart data
  const countryData = analytics ? Object.entries(analytics.clicksByCountry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) : [];

  const deviceData = analytics ? Object.entries(analytics.clicksByDevice) : [];
  const browserData = analytics ? Object.entries(analytics.clicksByBrowser) : [];
  const osData = analytics ? Object.entries(analytics.clicksByOS) : [];

  // Calculate max for bar charts
  const maxCountryClicks = countryData.length > 0 ? Math.max(...countryData.map(d => d[1])) : 1;
  const maxDeviceClicks = deviceData.length > 0 ? Math.max(...deviceData.map(d => d[1])) : 1;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-indigo-500/30 dark:border-indigo-400/70 dark:shadow-[0_0_60px_rgba(129,140,248,0.6),0_0_120px_rgba(167,139,250,0.4)] max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-black/90 backdrop-blur-xl border-b-2 border-indigo-500/20 dark:border-indigo-400/50 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Analytics: {link.title || 'Untitled Link'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {link.shortUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.slug}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-4 cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : analytics && analytics.totalClicks > 0 ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40 backdrop-blur-lg rounded-xl p-5 border-2 border-indigo-200/50 dark:border-indigo-500/50">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Total Clicks</div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{analytics.totalClicks}</div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/40 backdrop-blur-lg rounded-xl p-5 border-2 border-teal-200/50 dark:border-teal-500/50">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Countries</div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{countryData.length}</div>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/40 backdrop-blur-lg rounded-xl p-5 border-2 border-violet-200/50 dark:border-violet-500/50">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Devices</div>
                  <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{deviceData.length}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/40 backdrop-blur-lg rounded-xl p-5 border-2 border-pink-200/50 dark:border-pink-500/50">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Browsers</div>
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{browserData.length}</div>
                </div>
              </div>

              {/* Clicks Over Time Chart */}
              <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5)]">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Clicks Over Time</h3>
                <div className="h-48 flex items-end gap-2">
                  {analytics.clicksOverTime.length > 0 ? (
                    analytics.clicksOverTime.map((item, index) => {
                      const maxCount = Math.max(...analytics.clicksOverTime.map(i => i.count));
                      const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 rounded-t-lg transition-all hover:from-indigo-600 hover:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400" style={{ height: `${height}%` }} />
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                            <div className="font-semibold">{item.count}</div>
                            <div className="text-[10px]">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full text-center text-gray-500 dark:text-gray-400 py-8">No data available</div>
                  )}
                </div>
              </div>

              {/* Two Column Layout for Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Countries */}
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Top Countries</h3>
                  <div className="space-y-3">
                    {countryData.length > 0 ? (
                      countryData.map(([country, count]) => (
                        <div key={country} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{country}</span>
                              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 h-2 rounded-full transition-all"
                                style={{ width: `${(count / maxCountryClicks) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">No country data</div>
                    )}
                  </div>
                </div>

                {/* Devices */}
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Devices</h3>
                  <div className="space-y-3">
                    {deviceData.length > 0 ? (
                      deviceData.map(([device, count]) => (
                        <div key={device} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{device}</span>
                              <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 h-2 rounded-full transition-all"
                                style={{ width: `${(count / maxDeviceClicks) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">No device data</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Browser & OS Distribution */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Browsers</h3>
                  <div className="space-y-2">
                    {browserData.length > 0 ? (
                      browserData.map(([browser, count]) => (
                        <div key={browser} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{browser}</span>
                          <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">No browser data</div>
                    )}
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Operating Systems</h3>
                  <div className="space-y-2">
                    {osData.length > 0 ? (
                      osData.map(([os, count]) => (
                        <div key={os} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{os}</span>
                          <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">No OS data</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Clicks Table */}
              <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5)]">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Recent Clicks</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Time</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">IP Address</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Country</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Device</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Browser</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentClicks.length > 0 ? (
                        analytics.recentClicks.map((click) => (
                          <tr key={click.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-400">{formatTime(click.timestamp)}</td>
                            <td className="py-3 px-4 text-xs font-mono text-gray-700 dark:text-gray-300">{click.ip}</td>
                            <td className="py-3 px-4 text-xs text-gray-700 dark:text-gray-300">{click.country}</td>
                            <td className="py-3 px-4 text-xs text-gray-700 dark:text-gray-300">{click.device}</td>
                            <td className="py-3 px-4 text-xs text-gray-700 dark:text-gray-300">{click.browser}</td>
                            <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-400 truncate max-w-[150px]">{click.referrer}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">No clicks recorded yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">No Analytics Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This link hasn't been clicked yet. Analytics will appear here once users start clicking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

