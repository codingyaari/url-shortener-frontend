'use client';

import { useState, useEffect } from 'react';

export function RecentLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/links`);
      
      if (response.ok) {
        const data = await response.json();
        setLinks(Array.isArray(data) ? data : []);
      } else {
        // Backend not available, show placeholder
        setLinks([]);
      }
    } catch (error) {
      // Backend not available, show placeholder
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();

    // Listen for new link creation
    const handleLinkCreated = () => {
      fetchLinks();
    };
    window.addEventListener('linkCreated', handleLinkCreated);

    return () => {
      window.removeEventListener('linkCreated', handleLinkCreated);
    };
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5),0_0_80px_rgba(167,139,250,0.3)]">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Recent Links
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_40px_rgba(129,140,248,0.5),0_0_80px_rgba(167,139,250,0.3)]">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Recent Links
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No links yet. Create your first short link above!</p>
          <p className="text-sm mt-2">
            (Backend API at {process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'} not available)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Recent Links
      </h2>
      
      <div className="space-y-4">
        {links.slice(0, 10).map((link) => (
          <div
            key={link.id || link.slug}
            className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-lg p-4 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_20px_rgba(129,140,248,0.4)] hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_35px_rgba(129,140,248,0.8),0_0_70px_rgba(167,139,250,0.6)] dark:hover:border-indigo-300 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {link.title || 'Untitled Link'}
                  </h3>
                  {link.clicks !== undefined && (
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      {link.clicks} clicks
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                  {link.destinationUrl || link.destination}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400">
                    {link.shortUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${link.slug}` : `/${link.slug}`)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(link.shortUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${link.slug}` : `/${link.slug}`))}
                    className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Copy link"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

