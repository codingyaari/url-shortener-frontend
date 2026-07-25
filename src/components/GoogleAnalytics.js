'use client';

import { useEffect } from 'react';

/**
 * Loads gtag via DOM (not a React <script>), avoiding React 19's
 * "Encountered a script tag while rendering React component" warning.
 */
export function GoogleAnalytics({ gaId }) {
  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;
    if (window.__gaInitialized === gaId) return;
    window.__gaInitialized = gaId;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId);
  }, [gaId]);

  return null;
}
