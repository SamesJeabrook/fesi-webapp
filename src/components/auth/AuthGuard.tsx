'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Typography } from '@/components/atoms';
import { getDevToken } from '@/utils/devAuth';

interface AuthGuardProps {
  children: ReactNode;
  requireRole?: 'customer' | 'merchant' | 'admin';
  loginPath?: string;
}

/**
 * AuthGuard component
 * Redirects users to login if not authenticated
 * Use in layouts to protect entire sections of the app
 */
export function AuthGuard({ 
  children, 
  requireRole,
  loginPath 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Skip auth check in development mode if dev token exists
    const devToken = getDevToken();
    if (devToken) {
      console.log('AuthGuard - Dev token detected, skipping auth check');
      return;
    }

    // Only run auth check after loading is complete and component is mounted
    if (!isLoading && isMounted) {
      console.log('AuthGuard - Running auth check', {
        isAuthenticated,
        requireRole,
        pathname,
        user: user ? { email: user.email, roles: user['https://fesi.app/roles'] } : null
      });

      if (!isAuthenticated) {
        // Determine which login page to redirect to
        let redirectPath = '/customer/login';
        
        if (loginPath) {
          redirectPath = loginPath;
        } else if (requireRole === 'merchant') {
          redirectPath = '/merchant/login';
        } else if (requireRole === 'admin') {
          redirectPath = '/merchant/login'; // Admin uses merchant login
        }

        // Store the current path to return after login
        const returnTo = pathname || '/';
        
        console.log('AuthGuard - Not authenticated, redirecting to:', redirectPath);
        
        // Navigate to login page instead of Auth0 redirect
        // The login page will use Auth0 Lock for embedded authentication
        router.push(`${redirectPath}?returnTo=${encodeURIComponent(returnTo)}`);
      } else if (requireRole && user) {
        // Check if user has the required role
        const userRoles = user['https://fesi.app/roles'] || [];
        
        console.log('AuthGuard - User:', user);
        console.log('AuthGuard - Required role:', requireRole);
        console.log('AuthGuard - User roles:', userRoles);
        
        if (!userRoles.includes(requireRole)) {
          console.warn('AuthGuard - User does not have required role. Redirecting to unauthorized.');
          console.warn('AuthGuard - Available roles:', userRoles);
          console.warn('AuthGuard - Required role:', requireRole);
          // User doesn't have required role, redirect to unauthorized page
          router.push(`/?error=unauthorized&required=${requireRole}`);
        }
      }
    }
  }, [isAuthenticated, isLoading, isMounted, user, requireRole, loginPath, pathname, router]);

  // Don't render anything while checking authentication or during mount
  if (!isMounted || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: 'var(--spacing-8)'
      }}>
        <Typography variant="body-large">Loading...</Typography>
      </div>
    );
  }

  // Don't render anything while not authenticated (will redirect)
  const devToken = getDevToken();
  if (!devToken && !isAuthenticated) {
    return null;
  }

  // Check role if required
  if (requireRole && user && !devToken) {
    const userRoles = user['https://fesi.app/roles'] || [];
    
    // If user just logged in and roles haven't loaded yet, show loading
    // This prevents the unauthorized redirect during the brief moment roles are loading
    if (userRoles.length === 0 && isAuthenticated) {
      console.log('AuthGuard - User authenticated but roles not loaded yet, waiting...');
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          padding: 'var(--spacing-8)'
        }}>
          <Typography variant="body-large">Loading your account...</Typography>
        </div>
      );
    }
    
    if (!userRoles.includes(requireRole)) {
      return null; // Will redirect via useEffect
    }
  }

  return <>{children}</>;
}
