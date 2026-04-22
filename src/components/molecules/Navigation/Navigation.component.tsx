'use client';

import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms';
import LoginButton from '@/components/auth/LoginButton';
import LogoutButton from '@/components/auth/LogoutButton';
import type { NavigationProps } from './Navigation.types';
import styles from './Navigation.module.scss';

export const Navigation: React.FC<NavigationProps> = ({
  className,
  'data-testid': dataTestId,
}) => {
  const { isAuthenticated, user } = useAuth0();
  const userRoles = user?.['https://fesi.app/roles'] || [];
  const isAdmin = userRoles.includes('admin');
  const isMerchant = userRoles.includes('merchant');

  const navigationClasses = classNames(styles.navigation, className);

  return (
    <nav className={navigationClasses} data-testid={dataTestId}>
      <div className={styles.navigation__container}>
        <div className={styles.navigation__brand}>
          <Link href="/">
            <Typography variant="heading-4" style={{ color: 'var(--color-primary)' }}>
              Fesi
            </Typography>
          </Link>
        </div>

        <div className={styles.navigation__links}>
          {!isAuthenticated && (
            <Link href="/merchant/login" className={styles.navigation__link}>
              <Typography variant="body-medium">Merchant Login</Typography>
            </Link>
          )}
          
          {isAuthenticated && (
            <>
              {isAdmin && (
                <>
                  <Link href="/admin" className={styles.navigation__link}>
                    <Typography variant="body-medium">Admin Dashboard</Typography>
                  </Link>
                  <Link href="/merchant/admin" className={styles.navigation__link}>
                    <Typography variant="body-medium">Merchant Dashboard</Typography>
                  </Link>
                  <Link href="/merchant/admin/settings" className={styles.navigation__link}>
                    <Typography variant="body-medium">Merchant Settings</Typography>
                  </Link>
                </>
              )}
              
              {(isMerchant && !isAdmin) && (
                <>
                  <Link href="/merchant/admin" className={styles.navigation__link}>
                    <Typography variant="body-medium">Dashboard</Typography>
                  </Link>
                  <Link href="/merchant/admin/orders" className={styles.navigation__link}>
                    <Typography variant="body-medium">Orders</Typography>
                  </Link>
                  <Link href="/merchant/admin/settings" className={styles.navigation__link}>
                    <Typography variant="body-medium">Settings</Typography>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.navigation__auth}>
          {isAuthenticated ? (
            <div className={styles.navigation__user}>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                {user?.email} {isAdmin && '(Admin)'} {isMerchant && !isAdmin && '(Merchant)'}
              </Typography>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
};