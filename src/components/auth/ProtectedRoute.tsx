'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { ReactNode, useEffect, useRef } from 'react';
import { Typography } from '@/components/atoms';
import LoginButton from './LoginButton';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: string | string[];
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requireRole,
  fallback 
}: ProtectedRouteProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    getAccessTokenSilently 
  } = useAuth0();

  // Use ref to track if we've already synced this user session
  const syncedRef = useRef<string | null>(null);

  // Store token in localStorage for API calls and sync user
  useEffect(() => {
    const storeTokenAndSyncUser = async () => {
      if (isAuthenticated && user && user.sub) {
        // Prevent multiple syncs for the same user session
        if (syncedRef.current === user.sub) {
          return;
        }

        try {
          console.log('🔄 Getting access token for user:', user.email);
          // Get token with audience for proper JWT format
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            },
            cacheMode: 'off' // Force fresh token request
          });
          console.log('🎫 Token received (first 50 chars):', token?.substring(0, 50) + '...');
          console.log('🎫 Token type:', typeof token, 'Length:', token?.length);
          
          if (!token) {
            console.error('❌ No token received from Auth0');
            return;
          }
          
          localStorage.setItem('auth-token', token);
          console.log('💾 Token stored in localStorage');
          
          // Sync user to database
          console.log('🔗 Calling API:', `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            console.error('Failed to sync user to database');
          } else {
            const userData = await response.json();
            console.log('User synced:', userData.user);
            // Mark this user as synced
            syncedRef.current = user.sub;
          }
        } catch (error) {
          console.error('❌ Error storing token or syncing user:', error);
          
          // Handle consent required error
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('consent_required') || errorMessage.includes('Consent required')) {
            console.log('🔄 Consent required - redirecting to login...');
            // Clear the cache and redirect to login
            localStorage.removeItem('auth-token');
            window.location.href = '/api/auth/login';
            return;
          }
        }
      } else {
        localStorage.removeItem('auth-token');
        syncedRef.current = null;
      }
    };

    storeTokenAndSyncUser();
  }, [isAuthenticated, user?.sub, getAccessTokenSilently]); // Only depend on authentication state and user ID

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography variant="body-medium">Loading...</Typography>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '1rem'
      }}>
        <Typography variant="heading-4">Authentication Required</Typography>
        <Typography variant="body-medium">
          Please log in to access this page.
        </Typography>
        <LoginButton />
      </div>
    );
  }

  // Check role if required
  if (requireRole) {
    const userRoles = user?.['https://fesi.app/roles'] || [];
    const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    
    // Admin has access to everything
    const hasAccess = userRoles.includes('admin') || 
                     requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasAccess) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: '1rem'
        }}>
          <Typography variant="heading-4">Access Denied</Typography>
          <Typography variant="body-medium">
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body-small">
            Required role: {Array.isArray(requireRole) ? requireRole.join(' or ') : requireRole}
          </Typography>
        </div>
      );
    }
  }

  return <>{children}</>;
}