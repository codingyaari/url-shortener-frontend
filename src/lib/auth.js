import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get backend JWT token from session
 * @returns {Promise<string|null>} Backend JWT token or null
 */
export async function getBackendToken() {
  const session = await getSession();
  return session?.backendToken || null;
}

/**
 * Get backend user data from session
 * @returns {Promise<Object|null>} Backend user object or null
 */
export async function getBackendUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Get authorization header for backend API calls
 * @returns {Promise<string>} Authorization header value (Bearer token)
 */
export async function getAuthHeader() {
  const token = await getBackendToken();
  return token ? `Bearer ${token}` : '';
}

