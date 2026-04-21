"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/atoms';
import { CustomerNavigationProps, NavItem } from './CustomerNavigation.types';
import styles from './CustomerNavigation.module.scss';

const navItems: NavItem[] = [
  { label: 'Browse Events', path: '/vendors', icon: '🎪' },
  { label: 'My Orders', path: '/vendors/orders', icon: '📦', requiresAuth: true },
  // { label: 'Favorites', path: '/vendors/favorites', icon: '❤️', requiresAuth: true },
];

export function CustomerNavigation({
  activePath,
  user,
  onLoginClick,
  onLogoutClick,
  cartItemCount = 0,
  showCart = false,
  orderCount = 0,
  onOrdersClick,
  hasActiveOrders = false
}: CustomerNavigationProps) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only showing orders button after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={styles.customerNavigation}>
      <div className={styles.customerNavigation__container}>
        {/* Logo */}
        <Link href="/vendors" className={styles.customerNavigation__logo}>
          Fesi
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.customerNavigation__nav}>
          {navItems.map((item) => {
            // Hide auth-required items if user is not logged in
            if (item.requiresAuth && !user) return null;
            
            const isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.customerNavigation__navItem} ${
                  isActive ? styles['customerNavigation__navItem--active'] : ''
                }`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className={styles.customerNavigation__actions}>
          {/* Orders Button (for guest users) - only render after mount to prevent hydration mismatch */}
          {isMounted && orderCount > 0 && onOrdersClick && (
            <button 
              className={styles.customerNavigation__ordersButton}
              onClick={onOrdersClick}
            >
              📋
              <span className={styles.customerNavigation__ordersBadge}>
                {orderCount}
              </span>
              {hasActiveOrders && (
                <span className={styles.customerNavigation__ordersPulse} />
              )}
            </button>
          )}
          
          {/* Cart Button */}
          {showCart && (
            <button className={styles.customerNavigation__cartButton}>
              🛒
              {cartItemCount > 0 && (
                <span className={styles.customerNavigation__cartBadge}>
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {/* User Section */}
          {user ? (
            <div className={styles.customerNavigation__user}>
              <div className={styles.customerNavigation__userInfo}>
                {user.name && (
                  <span className={styles.customerNavigation__userName}>
                    {user.name}
                  </span>
                )}
                <span className={styles.customerNavigation__userEmail}>
                  {user.email}
                </span>
              </div>
              <div className={styles.customerNavigation__avatar}>
                {getInitials(user.name, user.email)}
              </div>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onLoginClick}
              className={styles.customerNavigation__loginButton}
            >
              Login
            </Button>
          )}

          {/* Mobile Menu Button */}
          <div className={styles.customerNavigation__mobileMenu}>
            <button
              className={styles.customerNavigation__menuButton}
              onClick={handleMobileMenuToggle}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className={styles.customerNavigation__mobileMenuContent}>
          {navItems.map((item) => {
            // Hide auth-required items if user is not logged in
            if (item.requiresAuth && !user) return null;
            
            const isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.customerNavigation__mobileNavItem} ${
                  isActive ? styles['customerNavigation__mobileNavItem--active'] : ''
                }`}
                onClick={handleNavClick}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            );
          })}
          
          {user && onLogoutClick && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onLogoutClick();
                handleNavClick();
              }}
              className={styles.customerNavigation__logoutButton}
            >
              Logout
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
