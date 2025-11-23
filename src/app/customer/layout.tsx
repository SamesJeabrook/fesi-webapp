'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms';
import styles from './layout.module.scss';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuth0();

  const navItems = [
    { href: '/customer/dashboard', label: 'Dashboard' },
    { href: '/customer/orders', label: 'Orders' },
    { href: '/customer/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Don't show nav on signup page or when not authenticated
  const showNav = isAuthenticated && pathname !== '/customer/signup';

  return (
    <div className={styles.layout}>
      {showNav && (
        <nav className={styles.nav}>
          <div className={styles.nav__container}>
            <Link href="/customer/dashboard" className={styles.nav__brand}>
              <Typography variant="heading-5">Fesi</Typography>
            </Link>
            <div className={styles.nav__links}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.nav__link} ${
                    pathname === item.href ? styles['nav__link--active'] : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <button className={styles.nav__logout} onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </nav>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
