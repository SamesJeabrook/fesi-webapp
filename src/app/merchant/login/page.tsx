'use client';

import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, GridContainer, GridItem, Button } from '@/components/atoms';
import styles from './login.module.scss';

export default function MerchantLoginPage() {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || '/merchant/admin';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRoles = user['https://fesi.app/roles'] || [];
      
      if (userRoles.includes('merchant') || userRoles.includes('admin')) {
        router.push(returnTo);
      } else {
        router.push('/?error=no-merchant-access');
      }
    }
  }, [isAuthenticated, user, router, returnTo]);

  const handleLogin = async () => {
    await loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope: 'openid profile email',
      },
      appState: {
        returnTo: returnTo,
      },
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Typography variant="heading-4">Loading...</Typography>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <Typography variant="heading-4">Redirecting to dashboard...</Typography>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      <GridContainer>
        <GridItem sm={16} md={12} lg={10} className={styles.centered}>
          <div className={styles.loginCard}>
            <div className={styles.header}>
              <Typography variant="heading-3">Fesi Portal</Typography>
              <Typography variant="body-large" className={styles.subtitle}>
                Manage menus, track orders, view analytics, and update settings
              </Typography>
            </div>

            <div className={styles.loginContent}>
              <Typography variant="body-medium" className={styles.welcomeText}>
                Welcome back! Sign in to access your merchant dashboard.
              </Typography>

              <Button
                onClick={handleLogin}
                variant="primary"
                fullWidth
                isDisabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Sign In with Auth0'}
              </Button>

              <Typography variant="body-small" className={styles.helpText}>
                Need help? Contact support@fesi.app
              </Typography>
            </div>

            <div className={styles.footer}>
              <Typography variant="body-small" className={styles.footerText}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}
