/**
 * Development authentication helper
 * Allows overriding Auth0 authentication with dev tokens for testing
 */

export const getDevToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check for dev token in localStorage
  const devToken = localStorage.getItem('dev_token');
  if (devToken && devToken.startsWith('dev-merchant-')) {
    return devToken;
  }
  
  return null;
};

export const isDevMode = (): boolean => {
  return !!getDevToken();
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
 * Get authorization token - checks for dev token first, then falls back to provided token
 */
export const getAuthToken = async (
  getAccessTokenSilently?: () => Promise<string>
): Promise<string> => {
  // Check for dev token first
  const devToken = getDevToken();
  if (devToken) {
    console.log('[DEV MODE] Using development token:', devToken);
    return devToken;
  }
  
  // Fall back to Auth0
  if (getAccessTokenSilently) {
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      },
    });
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
