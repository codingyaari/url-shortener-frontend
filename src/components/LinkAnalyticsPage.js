'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import api from '@/lib/axios';

export function LinkAnalyticsPage({ slug }) {
  const router = useRouter();
  const [link, setLink] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinkAndAnalytics = async () => {
      if (!slug) {
        setLoading(false);
        setError('No slug provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch link and analytics in one API call
        const response = await api.get(`/api/links/analytics/${slug}`);
        
        if (response.data?.success && response.data?.data) {
          setLink(response.data.data.link);
          setAnalytics(response.data.data.analytics);
        } else {
          setError(response.data?.message || 'Failed to load analytics');
          setLink(null);
          setAnalytics(null);
        }
      } catch (err) {
        console.error('Error fetching link analytics:', err);
        setError(err.response?.data?.message || 'Failed to load analytics');
        setLink(null);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkAndAnalytics();
  }, [slug]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const topCountries = useMemo(() => {
    if (!analytics) return [];
    return Object.entries(analytics.clicksByCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [analytics]);

  const devices = useMemo(() => {
    return analytics ? Object.entries(analytics.clicksByDevice) : [];
  }, [analytics]);

  const browsers = useMemo(() => {
    return analytics ? Object.entries(analytics.clicksByBrowser) : [];
  }, [analytics]);

  const osList = useMemo(() => {
    return analytics ? Object.entries(analytics.clicksByOS) : [];
  }, [analytics]);

  const maxCountryCount = useMemo(() => {
    return topCountries.length > 0 ? Math.max(...topCountries.map(item => item[1])) : 1;
  }, [topCountries]);

  const maxDeviceCount = useMemo(() => {
    return devices.length > 0 ? Math.max(...devices.map(item => item[1])) : 1;
  }, [devices]);

  const maxTimeCount = useMemo(() => {
    if (!analytics?.clicksOverTime?.length) return 1;
    return Math.max(...analytics.clicksOverTime.map(item => item.count));
  }, [analytics]);

  const shortUrl = link?.shortUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${link?.slug}` : '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black dark:text-white transition-colors duration-500">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black dark:text-white transition-colors duration-500">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {error || 'Link Not Found'}
              </h2>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-blue-500 dark:via-blue-600 dark:to-indigo-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(59,130,246,0.7),0_0_60px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const defaultAnalytics = {
    totalClicks: 0,
    clicksByCountry: {},
    clicksByDevice: {},
    clicksByBrowser: {},
    clicksByOS: {},
    clicksOverTime: [],
    recentClicks: [],
  };

  const analyticsData = analytics || defaultAnalytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black dark:text-white transition-colors duration-500">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-blue-400 hover:text-indigo-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white dark:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
              Analytics: {link.title || 'Untitled Link'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 truncate">{shortUrl}</p>
          </div>

          {!analytics ? (
            <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-12 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)] text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Error Loading Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Unable to load analytics data.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] transition-all duration-300 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-blue-900/60 dark:to-blue-800/60 backdrop-blur-lg rounded-xl p-5 border-2 border-indigo-200/50 dark:border-blue-500/50 dark:shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_0_20px_rgba(37,99,235,0.1)] hover:scale-[1.02] transition-all duration-300">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-1">Total Clicks</div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-white dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">{analyticsData.totalClicks || 0}</div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-emerald-900/60 dark:to-emerald-800/60 backdrop-blur-lg rounded-xl p-5 border-2 border-teal-200/50 dark:border-emerald-500/50 dark:shadow-[0_0_20px_rgba(16,185,129,0.5),inset_0_0_20px_rgba(5,150,105,0.1)] hover:scale-[1.02] transition-all duration-300">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-1">Countries</div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-white dark:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">{topCountries.length}</div>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-purple-900/60 dark:to-purple-800/60 backdrop-blur-lg rounded-xl p-5 border-2 border-violet-200/50 dark:border-purple-500/50 dark:shadow-[0_0_20px_rgba(168,85,247,0.5),inset_0_0_20px_rgba(147,51,234,0.1)] hover:scale-[1.02] transition-all duration-300">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-1">Devices</div>
                  <div className="text-3xl font-bold text-violet-600 dark:text-white dark:drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">{devices.length}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-rose-900/60 dark:to-rose-800/60 backdrop-blur-lg rounded-xl p-5 border-2 border-pink-200/50 dark:border-rose-500/50 dark:shadow-[0_0_20px_rgba(244,63,94,0.5),inset_0_0_20px_rgba(225,29,72,0.1)] hover:scale-[1.02] transition-all duration-300">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-1">Browsers</div>
                  <div className="text-3xl font-bold text-pink-600 dark:text-white dark:drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">{browsers.length}</div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                  Clicks Over Time
                  {analyticsData.clicksOverTime?.[0]?.hour !== undefined && (
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                      (Hourly View)
                    </span>
                  )}
                </h3>
                <div className="h-64 flex items-end gap-1 sm:gap-2 overflow-x-auto pb-2">
                  {analyticsData.clicksOverTime && analyticsData.clicksOverTime.length > 0 ? (
                    analyticsData.clicksOverTime.map((item, idx) => {
                      const height = maxTimeCount > 0 ? (item.count / maxTimeCount) * 100 : 0;
                      const isHourlyView = item.hour !== undefined;
                      const displayLabel = isHourlyView ? item.label : formatDate(item.date);
                      const showLabel = isHourlyView ? (idx % 4 === 0 || item.count > 0) : true; // Show every 4th hour or hours with clicks
                      
                      return (
                        <div key={idx} className={`flex flex-col items-center gap-1 ${isHourlyView ? 'min-w-[24px]' : 'flex-1'}`}>
                          <div 
                            className={`w-full bg-gradient-to-t from-indigo-500 to-indigo-400 dark:from-blue-500 dark:to-blue-400 rounded-t-lg transition-all hover:from-indigo-600 hover:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-blue-300 dark:shadow-[0_0_10px_rgba(59,130,246,0.6)] cursor-pointer group relative`}
                            style={{ height: `${Math.max(height, 2)}%`, minHeight: '2px' }}
                            title={isHourlyView ? `${displayLabel} - ${item.count} clicks` : `${displayLabel} - ${item.count} clicks`}
                          >
                            {item.count > 0 && (
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                                {item.count} {item.count === 1 ? 'click' : 'clicks'}
                              </div>
                            )}
                          </div>
                          {showLabel && (
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1 whitespace-nowrap">
                              {item.count > 0 && (
                                <div className="font-semibold dark:text-white mb-0.5">{item.count}</div>
                              )}
                              <div className={isHourlyView ? 'text-[9px]' : ''}>{displayLabel}</div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full text-center text-gray-500 dark:text-gray-400 py-8">No data available</div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">Top Countries</h3>
                  <div className="space-y-3">
                    {topCountries.length > 0 ? (
                      topCountries.map(([country, count]) => (
                        <div key={country} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{country}</span>
                              <span className="text-sm font-bold text-indigo-600 dark:text-blue-400 dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-blue-500 dark:to-blue-400 h-2 rounded-full transition-all dark:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                style={{ width: `${(count / maxCountryCount) * 100}%` }}
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

                <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">Devices</h3>
                  <div className="space-y-3">
                    {devices.length > 0 ? (
                      devices.map(([device, count]) => (
                        <div key={device} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{device}</span>
                              <span className="text-sm font-bold text-teal-600 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-emerald-500 dark:to-emerald-400 h-2 rounded-full transition-all dark:shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                style={{ width: `${(count / maxDeviceCount) * 100}%` }}
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">Browsers</h3>
                  <div className="space-y-2">
                    {browsers.length > 0 ? (
                      browsers.map(([browser, count]) => (
                        <div key={browser} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/30">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{browser}</span>
                          <span className="text-sm font-bold text-violet-600 dark:text-purple-400 dark:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">{count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">No browser data</div>
                    )}
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">Operating Systems</h3>
                  <div className="space-y-2">
                    {osList.length > 0 ? (
                      osList.map(([os, count]) => (
                        <div key={os} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/30">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{os}</span>
                          <span className="text-sm font-bold text-pink-600 dark:text-rose-400 dark:drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">{count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">No OS data</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">Recent Clicks</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600/50">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Time</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">IP Address</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Country</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Device</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Browser</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.recentClicks && analyticsData.recentClicks.length > 0 ? (
                        analyticsData.recentClicks.map(click => (
                          <tr key={click.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
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

              {(!analyticsData || analyticsData.totalClicks === 0) && (
                <div className="bg-white/80 dark:bg-blue-950/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-indigo-500/20 dark:border-blue-500/40 dark:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)] text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    This link hasn't been clicked yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
