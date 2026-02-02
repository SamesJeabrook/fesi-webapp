'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/atoms';

export default function LogoutButton() {
  const { logout, isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return <Button variant="secondary" isDisabled>Loading...</Button>;
  }

  if (!isAuthenticated) {
    return null; // Don't show logout button if not authenticated
  }

  const handleLogout = () => {
    // Determine redirect based on user role
    const userRoles = user?.['https://fesi.app/roles'] || [];
    const loginPath = (userRoles.includes('merchant') || userRoles.includes('admin')) 
      ? '/merchant/login' 
      : '/customer/login';
    
    // Store the intended redirect
    sessionStorage.setItem('postLogoutRedirect', loginPath);
    
    // Logout with just the origin as returnTo (must be whitelisted in Auth0)
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
    >
      Log Out
    </Button>
  );
}