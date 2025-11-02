'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

// Create public API instance (no auth required for public short URL redirects)
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function ShortUrlPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!slug) {
        setStatus('error');
        setError('Invalid link');
        // Redirect to home page immediately for invalid slug
        setTimeout(() => {
          router.push('/');
        }, 1500);
        return;
      }

      try {
        // Fetch link details (public endpoint, no auth needed)
        const linkResponse = await publicApi.get(`/api/links/slug/${slug}`);
        
        if (!linkResponse.data?.success || !linkResponse.data?.data) {
          setStatus('error');
          setError('Link not found');
          // Redirect to home page after showing error
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }

        const link = linkResponse.data.data;
        const destinationUrl = link.destinationUrl || link.destination;

        if (!destinationUrl) {
          setStatus('error');
          setError('Invalid destination URL');
          // Redirect to home page after showing error
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }

        // Collect additional client-side data
        const clientData = collectClientData();
        
        // Track click asynchronously (don't wait for it)
        trackClick(link._id || link.id, clientData).catch(err => {
          console.error('Failed to track click:', err);
          // Don't block redirect if tracking fails
        });

        // Show redirecting status briefly for UX
        setStatus('redirecting');
        
        // Redirect after a brief delay to show loading state
        setTimeout(() => {
          window.location.href = destinationUrl;
        }, 500);

      } catch (err) {
        console.error('Redirect error:', err);
        
        // Handle different error types
        if (err.response?.status === 404) {
          setError('Link not found');
        } else if (err.response?.status === 410) {
          setError('This link has expired');
        } else if (err.response?.status === 403) {
          setError('This link is no longer active');
        } else {
          setError(err.response?.data?.message || 'Failed to load link');
        }
        
        setStatus('error');
        
        // Redirect to home page after showing error briefly
        setTimeout(() => {
          router.push('/');
        }, 2000); // Show error message for 2 seconds before redirecting
      }
    };

    handleRedirect();
  }, [slug]);

  // Collect client-side data for analytics
  const collectClientData = () => {
    const data = {};
    
    try {
      // Screen resolution
      if (window.screen) {
        data.screenResolution = `${window.screen.width}x${window.screen.height}`;
        data.viewportSize = `${window.innerWidth}x${window.innerHeight}`;
      }
      
      // Language
      data.language = navigator.language || navigator.userLanguage || 'Unknown';
      
      // Timezone
      try {
        data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
      } catch (e) {
        data.timezone = 'Unknown';
      }
      
      // UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('utm_source')) data.utmSource = urlParams.get('utm_source');
      if (urlParams.get('utm_medium')) data.utmMedium = urlParams.get('utm_medium');
      if (urlParams.get('utm_campaign')) data.utmCampaign = urlParams.get('utm_campaign');
      
      // Generate session ID (store in sessionStorage for this session)
      if (typeof window !== 'undefined' && window.sessionStorage) {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('analytics_session_id', sessionId);
        }
        data.sessionId = sessionId;
      }
      
      // Connection type (if available)
      if (navigator.connection) {
        data.connectionType = navigator.connection.effectiveType || 'Unknown';
      }
      
    } catch (error) {
      console.error('Error collecting client data:', error);
    }
    
    return data;
  };

  // Track click function (public endpoint, no auth needed)
  const trackClick = async (linkId, clientData = {}) => {
    try {
      await publicApi.post('/api/clicks', {
        linkId,
        ...clientData,
      });
    } catch (error) {
      // Silent fail - don't block redirect
      console.error('Click tracking failed:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading link...</p>
        </div>
      </div>
    );
  }

  if (status === 'redirecting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Something went wrong'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error === 'Link not found' && 'The link you\'re looking for doesn\'t exist or has been removed.'}
            {error === 'This link has expired' && 'This short link has expired and is no longer available.'}
            {error === 'This link is no longer active' && 'This link has been deactivated by its owner.'}
            {!error && 'Please check the link and try again.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:via-violet-500 dark:to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-lg dark:shadow-[0_0_30px_rgba(129,140,248,0.7),0_0_60px_rgba(167,139,250,0.5)] dark:hover:shadow-[0_0_50px_rgba(129,140,248,1),0_0_100px_rgba(167,139,250,0.9)] transition-all duration-300 cursor-pointer"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return null;
}

