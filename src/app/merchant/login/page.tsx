'use client';

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, GridContainer, GridItem } from '@/components/atoms';
import { Auth0LockWidget } from '@/components/auth/Auth0LockWidget';
import styles from './login.module.scss';

export default function MerchantLoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || '/merchant/admin';
  const [showLock, setShowLock] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('MerchantLoginPage - User authenticated:', user);
      const userRoles = user['https://fesi.app/roles'] || [];
      console.log('MerchantLoginPage - User roles:', userRoles);
      
      if (userRoles.includes('merchant') || userRoles.includes('admin')) {
        console.log('MerchantLoginPage - User has merchant/admin role, redirecting to:', returnTo);
        router.push(returnTo);
      } else {
        console.log('MerchantLoginPage - User does not have merchant access');
        router.push('/?error=no-merchant-access');
      }
    }
  }, [isAuthenticated, user, router, returnTo]);

  // Show lock after initial load to avoid SSR issues
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setShowLock(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleAuthenticated = async (authResult: any) => {
    // Wait a moment for Auth0 context to update
    setTimeout(() => {
      router.push(returnTo);
      // Force reload to ensure Auth0 context is updated
      window.location.href = returnTo;
    }, 500);
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
              {showLock ? (
                <div className={styles.lockContainer}>
                  <Auth0LockWidget
                    onAuthenticated={handleAuthenticated}
                    returnTo={returnTo}
                    container="merchant-lock-container"
                    allowSignUp={true}
                    allowLogin={true}
                    initialScreen="login"
                  />
                </div>
              ) : (
                <Typography variant="body-medium">Loading login form...</Typography>
              )}

              <Typography variant="body-small" className={styles.helpText}>
                Need help? Contact support@fesi.app
              </Typography>

              <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  New merchant?{' '}
                  <a 
                    href="/merchant/onboarding"
                    style={{
                      color: 'var(--color-primary-600)',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Get started here
                  </a>
                </Typography>
              </div>
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
