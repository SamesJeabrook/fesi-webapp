"use client";

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { CustomerNavigation } from './CustomerNavigation';

/**
 * CustomerNavigationWrapper
 * Wraps CustomerNavigation with Auth0 integration
 * Use this component in your pages instead of CustomerNavigation directly
 */
export function CustomerNavigationWrapper() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const router = useRouter();

  const handleLoginClick = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
      authorizationParams: {
        redirect_uri: `${window.location.origin}/customer/login`,
        screen_hint: 'login',
      },
    });
  };

  const handleLogoutClick = () => {
    sessionStorage.setItem('postLogoutRedirect', '/customer/login');
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <CustomerNavigation
      user={
        isAuthenticated && user
          ? {
              id: user.sub || '',
              name: user.name,
              email: user.email || '',
            }
          : undefined
      }
      onLoginClick={handleLoginClick}
      onLogoutClick={handleLogoutClick}
      showCart={false}
      cartItemCount={0}
    />
  );
}
