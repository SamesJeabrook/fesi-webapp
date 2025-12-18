'use client';

import { useEffect } from 'react';
import { prefetchCsrfToken } from '@/utils/csrf';

/**
 * CSRF Initializer Component
 * Prefetches CSRF token on app initialization
 */
export function CsrfInit() {
  useEffect(() => {
    // Prefetch CSRF token on mount
    prefetchCsrfToken();
  }, []);

  return null; // This component doesn't render anything
}

export default CsrfInit;
