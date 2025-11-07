/**
 * Development authentication helper
 * Allows overriding Auth0 authentication with dev tokens for testing
 * 
 * ⚠️ WARNING: Dev tokens are ONLY enabled in development mode
 * They will be rejected by the API in production environments
 */

export const getDevToken = (): string | null => {
  if (typeof window === 'undefined') {
    console.log('[DEV TOKEN] Server side - returning null');
    return null;
  }
  
  console.log('[DEV TOKEN] NODE_ENV:', process.env.NODE_ENV);
  console.log('[DEV TOKEN] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  
  // Only allow dev tokens in development
  // Check both NODE_ENV and if we're on localhost
  const isDevelopment = process.env.NODE_ENV !== 'production' || 
                        window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';
  
  if (!isDevelopment) {
    console.log('[DEV TOKEN] Not in development mode');
    return null;
  }
  
  // Check for dev token in localStorage
  const devToken = localStorage.getItem('dev_token');
  console.log('[DEV TOKEN] Retrieved from localStorage:', devToken);
  
  if (devToken && devToken.startsWith('dev-merchant-')) {
    console.log('[DEV TOKEN] ✅ Valid dev token found!');
    return devToken;
  }
  
  console.log('[DEV TOKEN] ❌ No valid dev token found');
  return null;
};

export const isDevMode = (): boolean => {
  return process.env.NODE_ENV === 'development' && !!getDevToken();
};

export const getMerchantIdFromDevToken = (): string | null => {
  const devToken = getDevToken();
  if (devToken) {
    // Extract merchant ID from "dev-merchant-{id}"
    return devToken.replace('dev-merchant-', '');
  }
  return null;
};

/**
 * Get authorization token - checks for dev token first, then falls back to Auth0
 * 
 * ⚠️ Dev tokens only work in development mode
 */
export const getAuthToken = async (
  getAccessTokenSilently?: any
): Promise<string> => {
  // Check for dev token first (only in development)
  const devToken = getDevToken();
  if (devToken) {
    console.log('[DEV MODE] Using development token:', devToken);
    console.warn('⚠️ WARNING: Development tokens are NOT allowed in production');
    return devToken;
  }
  
  // Fall back to Auth0
  if (getAccessTokenSilently) {
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
    } catch (error) {
      console.error('❌ Auth0 error:', error);
      // If login required, check if we should use a dev token instead
      if (process.env.NODE_ENV === 'development') {
        console.error('💡 TIP: Set a dev token in localStorage:');
        console.error('   localStorage.setItem("dev_token", "dev-merchant-YOUR-MERCHANT-ID")');
      }
      throw error;
    }
  }
  
  throw new Error('No authentication method available');
};

/**
 * Hook to get auth token with dev token support
 * Use this instead of getAccessTokenSilently directly
 */
import { useAuth0 } from '@auth0/auth0-react';

export const useAuthToken = () => {
  const { getAccessTokenSilently } = useAuth0();
  
  return async (): Promise<string> => {
    return getAuthToken(getAccessTokenSilently);
  };
};
