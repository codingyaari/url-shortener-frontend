export function getShortBase() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

export function getShortUrl(slug) {
  return `${getShortBase()}/${slug}`;
}

export function getBioUrl(username) {
  if (!username) return '';
  return `${getShortBase()}/bio/${username}`;
}

export function getFastRedirectUrl(slug) {
  const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
  return `${api.replace(/\/$/, '')}/r/${slug}`;
}
