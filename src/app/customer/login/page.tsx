'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import Link from 'next/link';
import styles from '../signup/signup.module.scss';

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      const returnTo = searchParams?.get('returnTo') || '/customer/dashboard';
      router.push(returnTo);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleLogin = async () => {
    const returnTo = searchParams?.get('returnTo') || '/customer/dashboard';
    
    await loginWithRedirect({
      appState: {
        returnTo,
      },
      authorizationParams: {
        redirect_uri: `${window.location.origin}${returnTo}`,
      },
    });
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
          <div className={styles.signup__actions}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              className={styles.signup__button}
            >
              Log In
            </Button>

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
    </div>
  );
}
