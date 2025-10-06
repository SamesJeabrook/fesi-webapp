'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/atoms';

export default function LogoutButton() {
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Button variant="secondary" isDisabled>Loading...</Button>;
  }

  if (!isAuthenticated) {
    return null; // Don't show logout button if not authenticated
  }

  return (
    <Button
      variant="secondary"
      onClick={() => logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })}
    >
      Log Out
    </Button>
  );
}