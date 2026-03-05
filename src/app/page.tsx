'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import styles from './page.module.scss';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth0();

  // Check if user just logged out and should be redirected
  useEffect(() => {
    const postLogoutRedirect = sessionStorage.getItem('postLogoutRedirect');
    if (postLogoutRedirect) {
      sessionStorage.removeItem('postLogoutRedirect');
      router.push(postLogoutRedirect);
      return;
    }

    // Check if user just logged in and should be redirected
    const postLoginRedirect = sessionStorage.getItem('postLoginRedirect');
    if (postLoginRedirect) {
      sessionStorage.removeItem('postLoginRedirect');
      router.push(postLoginRedirect);
      return;
    }

    // Auto-redirect authenticated users to their dashboard
    if (isAuthenticated && user && !isLoading) {
      const userRoles = user['https://fesi.app/roles'] || [];
      console.log('Homepage - User authenticated with roles:', userRoles);
      
      // Redirect based on role
      if (userRoles.includes('merchant')) {
        console.log('Redirecting merchant to dashboard');
        router.push('/merchant/admin');
      } else if (userRoles.includes('organization') || userRoles.includes('admin')) {
        console.log('Redirecting organization/admin to dashboard');
        router.push('/admin');
      }
      // If no recognized role, stay on homepage
    }
  }, [router, isAuthenticated, user, isLoading]);

  return (
    <main className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.hero__content}>
          <Typography as="h1" variant="heading-1" className={styles.hero__title}>
            Fesi
          </Typography>
          <Typography variant="heading-3" className={styles.hero__subtitle}>
            Empowering Food & Beverage Merchants
          </Typography>
          <Typography variant="body-large" className={styles.hero__description}>
            Complete point-of-sale and order management platform designed for restaurants, 
            cafes, food trucks, and event vendors. Accept online orders with real-time tracking, 
            streamline operations, and deliver exceptional customer experiences. Free to get started.
          </Typography>
          
          <div className={styles.hero__actions}>
            <Link href="/merchant/onboarding">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/merchant/login">
              <Button variant="outline" size="lg">
                Merchant Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.features__container}>
          <Typography as="h2" variant="heading-2" className={styles.features__heading}>
            Everything You Need to Run Your Business
          </Typography>
          
          <div className={styles.features__grid}>
            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>💳</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Point of Sale
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Fast, intuitive POS system with table service, quick orders, and split payments. 
                Perfect for busy service environments.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>📊</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Real-Time Analytics
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Track sales, popular items, and customer preferences. Make data-driven decisions 
                to grow your business.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>📱</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Multi-Platform Orders
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Accept orders from customers in-person, via QR codes, or through your digital menu. 
                All in one seamless system.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>🎫</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Event Management
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Perfect for festivals, markets, and events. Manage multiple locations and track 
                performance across venues.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>📦</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Inventory Control
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Real-time stock tracking, low stock alerts, and automated menu updates. 
                Never oversell out-of-stock items.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>💰</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Integrated Payments
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Secure payment processing with Stripe. Accept cards, contactless, and digital wallets 
                with competitive rates.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>👥</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Staff Management
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Create staff accounts with custom permissions and PIN login. Track performance 
                and manage your team efficiently.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>📅</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Table Reservations
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Manage bookings with an integrated reservation system. Track table availability, 
                customer details, and reduce no-shows.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>🍽️</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Flexible Menu System
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Digital menus with unlimited customization options, modifiers, and variants. 
                Update pricing and availability instantly.
              </Typography>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.cta__content}>
          <Typography as="h2" variant="heading-2" className={styles.cta__title}>
            Ready to Transform Your Business?
          </Typography>
          <Typography variant="body-large" className={styles.cta__description}>
            Take control with Fesi. 
            Accept online orders, track sales in real-time, and grow your revenue. Start for free today.
          </Typography>
          <div className={styles.cta__actions}>
            <Link href="/merchant/onboarding">
              <Button variant="primary" size="lg">
                Get started for free
              </Button>
            </Link>
            <Link href="/merchant/login">
              <Button variant="ghost" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
