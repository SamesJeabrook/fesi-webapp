/**
 * API Utility
 * Centralized API request handler with CSRF protection and authentication
 */

import { secureFetch, getCsrfToken } from './csrf';
import { getDevToken } from './devAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  skipCsrf?: boolean;
}

/**
 * Global Auth0 token getter - will be set by AuthProvider
 */
let globalGetToken: (() => Promise<string>) | null = null;

export function setGlobalAuth0TokenGetter(getter: () => Promise<string>) {
  console.log('[API] Setting global token getter');
  globalGetToken = getter;
}

/**
 * Get auth token with fallback to dev token
 */
async function getAuthTokenForApi(): Promise<string | null> {
  // Use the global token getter from DevAuthContext
  if (globalGetToken) {
    try {
      console.log('[API] Requesting token from DevAuthContext...');
      const token = await globalGetToken();
      console.log('[API] Token received');
      return token;
    } catch (error) {
      console.error('[API] Token error:', error);
      return null;
    }
  }
  
  console.warn('[API] No auth method available (globalGetToken not set)');
  return null;
}

/**
 * Make an authenticated API request with CSRF protection
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { skipAuth = false, skipCsrf = false, ...fetchOptions } = options;
  
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${normalizedEndpoint}`;
  
  // Build headers
  const headers: Record<string, string> = {
    ...options.headers,
  };
  
  // Only set Content-Type if body is not FormData
  // FormData will set its own Content-Type with boundary
  const isFormData = fetchOptions.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Add authentication token
  if (!skipAuth) {
    const token = await getAuthTokenForApi();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('[API] Auth token added to request');
    } else {
      // No token available - this will likely cause a 401 error
      // but we let the API server decide if auth is required
      console.warn('[API] No auth token available for request to:', endpoint);
    }
  }
  
  // Prepare fetch options
  const requestOptions: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: 'include',
  };
  
  // Use secureFetch for state-changing methods (includes CSRF handling)
  const method = requestOptions.method?.toUpperCase() || 'GET';
  const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  
  let response: Response;
  
  if (needsCsrf && !skipCsrf) {
    response = await secureFetch(url, requestOptions);
  } else {
    response = await fetch(url, requestOptions);
  }
  
  // Handle response
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }
  
  // Return parsed JSON
  return response.json();
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T = any>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
    
  // Upload file/FormData
  upload: <T = any>(endpoint: string, formData: FormData, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    }),
};

export default api;
