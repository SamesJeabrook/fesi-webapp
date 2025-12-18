/**
 * CSRF Token Management
 * Handles CSRF token fetching and caching for secure API requests
 */

let cachedToken: string | null = null;
let tokenPromise: Promise<string> | null = null;

/**
 * Get a CSRF token from the API
 * Caches the token to avoid unnecessary requests
 */
export async function getCsrfToken(): Promise<string> {
  // If we already have a token, return it
  if (cachedToken) {
    return cachedToken;
  }

  // If a request is already in progress, wait for it
  if (tokenPromise) {
    return tokenPromise;
  }

  // Fetch a new token
  tokenPromise = fetchNewToken();
  
  try {
    const token = await tokenPromise;
    cachedToken = token;
    return token;
  } finally {
    tokenPromise = null;
  }
}

/**
 * Fetch a new CSRF token from the API
 */
async function fetchNewToken(): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${apiUrl}/api/csrf-token`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}

/**
 * Clear the cached CSRF token
 * Call this when a CSRF error occurs to force a new token fetch
 */
export function clearCsrfToken(): void {
  cachedToken = null;
}

/**
 * Make a secure API request with CSRF protection
 * Automatically handles token fetching and retry on CSRF failure
 */
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = options.method?.toUpperCase() || 'GET';
  
  // Only add CSRF token for state-changing methods
  const needsCsrfToken = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  
  if (needsCsrfToken) {
    try {
      const token = await getCsrfToken();
      
      options.headers = {
        ...options.headers,
        'X-CSRF-Token': token,
      };
    } catch (error) {
      // If CSRF token fetch fails, log warning but continue
      // The API will reject the request if CSRF is required
      console.warn('Failed to get CSRF token, continuing without it:', error);
    }
  }

  try {
    const response = await fetch(url, options);
    
    // If we get a 403 (CSRF failure), clear token and retry once
    if (response.status === 403 && needsCsrfToken) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.error === 'Invalid CSRF token') {
        clearCsrfToken();
        
        // Retry with new token
        try {
          const newToken = await getCsrfToken();
          options.headers = {
            ...options.headers,
            'X-CSRF-Token': newToken,
          };
          
          return fetch(url, options);
        } catch (retryError) {
          console.error('Failed to retry with new CSRF token:', retryError);
          return response; // Return original 403 response
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error('Secure fetch error:', error);
    throw error;
  }
}

/**
 * Pre-fetch CSRF token on app initialization
 * Call this in your app's root component to avoid delays on first request
 */
export function prefetchCsrfToken(): void {
  getCsrfToken().catch(error => {
    console.warn('Failed to prefetch CSRF token:', error);
  });
}

export default {
  getCsrfToken,
  clearCsrfToken,
  secureFetch,
  prefetchCsrfToken,
};
