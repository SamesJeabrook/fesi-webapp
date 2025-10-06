'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/atoms';

export default function LoginButton() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Button variant="primary" isDisabled>Loading...</Button>;
  }

  if (isAuthenticated) {
    return null; // Don't show login button if already authenticated
  }

  return (
    <Button
      variant="primary"
      onClick={() => loginWithRedirect({
        appState: {
          returnTo: '/merchant/admin/orders'
        }
      })}
    >
      Log In
    </Button>
  );
}