/**
 * Development authentication helper
 * Allows overriding Auth0 authentication with dev tokens for testing
 * 
 * ⚠️ WARNING: Dev tokens are ONLY enabled in development mode
 * They will be rejected by the API in production environments
 */

export const getDevToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Only allow dev tokens in development
  // MUST be development mode AND localhost
  const isDevelopment = process.env.NODE_ENV === 'development' && 
                        (window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1');
  
  if (!isDevelopment) {
    return null;
  }
  
  // Check for dev token in localStorage
  const devToken = localStorage.getItem('dev_token');
  
  if (devToken && (devToken.startsWith('dev-merchant-') || devToken.startsWith('dev-admin-'))) {
    return devToken;
  }
  
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
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV MODE] Using development token');
    }
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
