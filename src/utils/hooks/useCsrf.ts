/**
 * CSRF Hook
 * React hook for CSRF token management
 */

import { useEffect, useState } from 'react';
import { getCsrfToken, prefetchCsrfToken } from '../csrf';

/**
 * Hook to prefetch CSRF token on component mount
 */
export function useCsrfToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getCsrfToken()
      .then(setToken)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { token, loading, error };
}

/**
 * Hook to initialize CSRF on app mount
 */
export function useCsrfInit() {
  useEffect(() => {
    prefetchCsrfToken();
  }, []);
}

export default {
  useCsrfToken,
  useCsrfInit,
};
