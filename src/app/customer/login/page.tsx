'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms';
import { Auth0LockWidget } from '@/components/auth/Auth0LockWidget';
import Link from 'next/link';
import styles from '../signup/signup.module.scss';

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth0();
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const returnTo = searchParams?.get('returnTo') || '/customer/dashboard';
      router.push(returnTo);
    }
  }, [isAuthenticated, router, searchParams]);

  // Show lock after initial load to avoid SSR issues
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setShowLock(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleAuthenticated = async (authResult: any) => {
    const returnTo = searchParams?.get('returnTo') || '/customer/dashboard';
    // Wait a moment for Auth0 context to update
    setTimeout(() => {
      router.push(returnTo);
      // Force reload to ensure Auth0 context is updated
      window.location.href = returnTo;
    }, 500);
  };

  if (isLoading) {
    return (
      <div className={styles.signup}>
        <div className={styles.signup__container}>
          <Typography variant="heading-3">Loading...</Typography>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={styles.signup}>
        <div className={styles.signup__container}>
          <Typography variant="heading-3">Redirecting...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.signup}>
      <div className={styles.signup__container}>
        <div className={styles.signup__header}>
          <Typography variant="heading-2">Welcome Back</Typography>
          <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
            Log in to your account to continue
          </Typography>
        </div>

        <div className={styles.signup__card}>
          {showLock ? (
            <div style={{ padding: 'var(--spacing-4)' }}>
              <Auth0LockWidget
                onAuthenticated={handleAuthenticated}
                returnTo={searchParams?.get('returnTo') || '/customer/dashboard'}
                container="customer-lock-container"
                allowSignUp={false}
                allowLogin={true}
                initialScreen="login"
              />
            </div>
          ) : (
            <Typography variant="body-medium">Loading login form...</Typography>
          )}

          <div className={styles.signup__footer}>
            <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <Link href="/customer/signup" className={styles.signup__link}>
                Sign Up
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
