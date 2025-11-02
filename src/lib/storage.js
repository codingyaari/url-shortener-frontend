// localStorage utility for managing links
const STORAGE_KEY = 'url-shortener-links';

// Get all links from localStorage
export function getLinks() {
  if (typeof window === 'undefined') return [];
  
  try {
    const linksJson = localStorage.getItem(STORAGE_KEY);
    return linksJson ? JSON.parse(linksJson) : [];
  } catch (error) {
    console.error('Error reading links from localStorage:', error);
    return [];
  }
}

// Save a link (create or update)
export function saveLink(linkData) {
  if (typeof window === 'undefined') return null;
  
  try {
    const links = getLinks();
    const isEdit = linkData.id || linkData.slug;
    
    if (isEdit) {
      // Update existing link
      const index = links.findIndex(
        (link) => link.id === linkData.id || link.slug === linkData.slug
      );
      
      if (index !== -1) {
        // Preserve existing values if not provided, but allow null to clear expiry
        links[index] = {
          ...links[index],
          ...linkData,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
        console.log('Link updated in localStorage:', links[index]); // Debug log
        return links[index];
      } else {
        console.warn('Link not found for update:', linkData.id || linkData.slug);
        return null;
      }
    } else {
      // Create new link
      const generatedSlug = linkData.customSlug || generateSlug();
      const newLink = {
        id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        slug: generatedSlug,
        destinationUrl: linkData.destinationUrl,
        destination: linkData.destinationUrl, // For compatibility
        title: linkData.title || '',
        expiry: linkData.expiry || null,
        clicks: 0,
        clickHistory: [], // Array to store detailed click data
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shortUrl: typeof window !== 'undefined' 
          ? `${window.location.origin}/${generatedSlug}`
          : '',
      };
      
      links.unshift(newLink); // Add to beginning
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
      console.log('New link saved to localStorage:', newLink); // Debug log
      console.log('All links in storage:', links); // Debug log
      return newLink;
    }
  } catch (error) {
    console.error('Error saving link to localStorage:', error);
    return null;
  }
}

// Delete a link
export function deleteLink(linkId) {
  if (typeof window === 'undefined') return false;
  
  try {
    const links = getLinks();
    const filtered = links.filter(
      (link) => link.id !== linkId && link.slug !== linkId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting link from localStorage:', error);
    return false;
  }
}

// Track a click with detailed information
export function trackClick(linkId, clickData = {}) {
  if (typeof window === 'undefined') return false;
  
  try {
    const links = getLinks();
    const index = links.findIndex(
      (link) => link.id === linkId || link.slug === linkId
    );
    
    if (index !== -1) {
      // Initialize clickHistory if it doesn't exist
      if (!links[index].clickHistory) {
        links[index].clickHistory = [];
      }
      
      // Create detailed click record
      const clickRecord = {
        id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ip: clickData.ip || 'Unknown',
        country: clickData.country || 'Unknown',
        city: clickData.city || 'Unknown',
        userAgent: clickData.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'),
        device: clickData.device || detectDevice(),
        referrer: clickData.referrer || (typeof document !== 'undefined' ? document.referrer : 'Direct'),
        browser: clickData.browser || detectBrowser(),
        os: clickData.os || detectOS(),
      };
      
      // Add to history (keep last 1000 clicks)
      links[index].clickHistory.unshift(clickRecord);
      if (links[index].clickHistory.length > 1000) {
        links[index].clickHistory = links[index].clickHistory.slice(0, 1000);
      }
      
      // Update click count
      links[index].clicks = links[index].clickHistory.length;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error tracking click:', error);
    return false;
  }
}

// Get detailed analytics for a specific link
export function getLinkAnalytics(linkId) {
  const links = getLinks();
  const link = links.find((l) => l.id === linkId || l.slug === linkId);
  
  // Initialize clickHistory if it doesn't exist (for old links)
  if (link && !link.clickHistory) {
    link.clickHistory = [];
    // Update in storage
    const updatedLinks = links.map(l => 
      l.id === link.id || l.slug === link.slug 
        ? { ...l, clickHistory: [] } 
        : l
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLinks));
  }
  
  if (!link || !link.clickHistory || link.clickHistory.length === 0) {
    return {
      totalClicks: 0,
      clicksByCountry: {},
      clicksByDevice: {},
      clicksByBrowser: {},
      clicksByOS: {},
      clicksOverTime: [],
      recentClicks: [],
    };
  }
  
  const history = link.clickHistory;
  const clicksByCountry = {};
  const clicksByDevice = {};
  const clicksByBrowser = {};
  const clicksByOS = {};
  const clicksOverTime = [];
  const recentClicks = history.slice(0, 50); // Last 50 clicks
  
  history.forEach((click) => {
    // Country distribution
    clicksByCountry[click.country] = (clicksByCountry[click.country] || 0) + 1;
    
    // Device distribution
    clicksByDevice[click.device] = (clicksByDevice[click.device] || 0) + 1;
    
    // Browser distribution
    clicksByBrowser[click.browser] = (clicksByBrowser[click.browser] || 0) + 1;
    
    // OS distribution
    clicksByOS[click.os] = (clicksByOS[click.os] || 0) + 1;
    
    // Time series (group by date)
    const date = new Date(click.timestamp).toISOString().split('T')[0];
    const existing = clicksOverTime.find((item) => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      clicksOverTime.push({ date, count: 1 });
    }
  });
  
  // Sort time series by date
  clicksOverTime.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return {
    totalClicks: history.length,
    clicksByCountry,
    clicksByDevice,
    clicksByBrowser,
    clicksByOS,
    clicksOverTime,
    recentClicks,
  };
}

// Helper functions for device detection
function detectDevice() {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function detectBrowser() {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
}

function detectOS() {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || /iPad|iPhone|iPod/.test(ua)) return 'iOS';
  return 'Other';
}

// Increment click count for a link (backward compatibility)
export function incrementClick(linkId) {
  return trackClick(linkId);
}

// Get statistics
export function getStats() {
  const links = getLinks();
  const now = new Date();
  
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter((link) => {
    if (!link.expiry) return true;
    const expiryDate = new Date(link.expiry);
    return expiryDate > now;
  }).length;
  
  return {
    totalLinks,
    totalClicks,
    activeLinks,
  };
}

// Generate a random slug
function generateSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

// Clear all links (for testing/reset)
export function clearLinks() {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing links:', error);
    return false;
  }
}

