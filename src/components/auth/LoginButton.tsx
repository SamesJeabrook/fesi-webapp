'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/atoms';

interface LoginButtonProps {
  useMerchantLogin?: boolean;
}

export default function LoginButton({ useMerchantLogin }: LoginButtonProps = {}) {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();
  const pathname = usePathname();

  // Auto-detect if we're on a merchant or admin page
  // Both merchants and admins use the same login page
  const isMerchantOrAdminPage = useMerchantLogin || 
    (pathname?.startsWith('/merchant') && !pathname?.startsWith('/merchant/login')) ||
    pathname?.startsWith('/admin');

  console.log('LoginButton - pathname:', pathname, 'isMerchantOrAdminPage:', isMerchantOrAdminPage);

  if (isLoading) {
    return <Button variant="primary" isDisabled>Loading...</Button>;
  }

  if (isAuthenticated) {
    return null; // Don't show login button if already authenticated
  }

  const handleLogin = () => {
    console.log('LoginButton clicked - isMerchantOrAdminPage:', isMerchantOrAdminPage, 'pathname:', pathname);
    
    if (isMerchantOrAdminPage) {
      // Redirect to custom merchant login page (used for both merchants and admins)
      const returnTo = pathname || '/merchant/admin';
      console.log('Redirecting to merchant login page with returnTo:', returnTo);
      router.push(`/merchant/login?returnTo=${encodeURIComponent(returnTo)}`);
    } else {
      // Use Auth0 hosted login for other pages
      console.log('Using Auth0 hosted login');
      loginWithRedirect({
        appState: {
          returnTo: pathname || '/merchant/admin/orders'
        }
      });
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleLogin}
    >
      Log In
    </Button>
  );
}