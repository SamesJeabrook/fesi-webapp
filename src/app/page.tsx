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
      console.log('Homepage - Full user object:', user);
      
      // Redirect based on role (admin takes precedence)
      if (userRoles.includes('admin')) {
        console.log('Redirecting admin to dashboard');
        router.push('/admin');
      } else if (userRoles.includes('organization')) {
        console.log('Redirecting organization to dashboard');
        router.push('/admin');
      } else if (userRoles.includes('merchant')) {
        console.log('Redirecting merchant to dashboard');
        router.push('/merchant/admin');
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
            Complete POS & Order Management
          </Typography>
          <Typography variant="body-large" className={styles.hero__description}>
            Everything you need to run your food business. Take online orders, manage in-person sales, 
            and track your performance in real-time. Professional point-of-sale system starting from just £10/month.
          </Typography>
          
          <div className={styles.hero__actions}>
            <Link href="/merchant/onboarding">
              <Button variant="primary" size="lg">
                Start Your Trial
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
                Professional POS System
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Fast, intuitive point-of-sale with table service, quick orders, split payments, and Tap to Pay. 
                Complete payment processing from just £10/month.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>📊</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Order Management & Analytics
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Manage all orders from one dashboard. Track sales, monitor popular items, and view 
                real-time performance. Make smart decisions to grow your revenue.
              </Typography>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.featureCard}>
              <div className={styles.featureCard__icon}>📱</div>
              <Typography as="h3" variant="heading-4" className={styles.featureCard__title}>
                Online Orders Made Easy
              </Typography>
              <Typography variant="body-medium" className={styles.featureCard__description}>
                Accept orders from customers via QR codes, digital menus, and in-person. 
                Real-time order tracking and instant notifications. All orders in one place.
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

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <div className={styles.pricing__container}>
          <Typography as="h2" variant="heading-2" className={styles.pricing__heading}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="body-large" className={styles.pricing__subheading}>
            Choose the plan that fits your business. All plans include complete POS, online ordering, and payment processing.
          </Typography>
          
          <div className={styles.pricing__grid}>
            <Card variant="elevated" padding="lg" className={styles.pricingCard}>
              <Typography as="h3" variant="heading-4" className={styles.pricingCard__name}>
                Starter
              </Typography>
              <div className={styles.pricingCard__price}>
                <span className={styles.pricingCard__currency}>£</span>
                <span className={styles.pricingCard__amount}>10</span>
                <span className={styles.pricingCard__period}>/month</span>
              </div>
              <Typography variant="body-small" className={styles.pricingCard__fee}>
                + 10% platform fee
              </Typography>
              <ul className={styles.pricingCard__features}>
                <li>✓ Complete POS System</li>
                <li>✓ Online Orders & QR Codes</li>
                <li>✓ Order Management</li>
                <li>✓ Real-time Analytics</li>
                <li>✓ Payment Processing</li>
                <li>✓ Digital Menus</li>
                <li>✓ Email Support</li>
              </ul>
              <Link href="/merchant/onboarding">
                <Button variant="outline" className={styles.pricingCard__button}>
                  Start Trial
                </Button>
              </Link>
            </Card>

            <Card variant="elevated" padding="lg" className={`${styles.pricingCard} ${styles['pricingCard--featured']}`}>
              <div className={styles.pricingCard__badge}>Most Popular</div>
              <Typography as="h3" variant="heading-4" className={styles.pricingCard__name}>
                Professional
              </Typography>
              <div className={styles.pricingCard__price}>
                <span className={styles.pricingCard__currency}>£</span>
                <span className={styles.pricingCard__amount}>39</span>
                <span className={styles.pricingCard__period}>/month</span>
              </div>
              <Typography variant="body-small" className={styles.pricingCard__fee}>
                + 8% platform fee
              </Typography>
              <ul className={styles.pricingCard__features}>
                <li>✓ Everything in Starter</li>
                <li>✓ Staff Management & PINs</li>
                <li>✓ Inventory Tracking</li>
                <li>✓ Table Reservations</li>
                <li>✓ Advanced Analytics</li>
                <li>✓ Priority Support</li>
                <li>✓ Custom Branding</li>
              </ul>
              <Link href="/merchant/onboarding">
                <Button variant="primary" className={styles.pricingCard__button}>
                  Start Trial
                </Button>
              </Link>
            </Card>

            <Card variant="elevated" padding="lg" className={styles.pricingCard}>
              <Typography as="h3" variant="heading-4" className={styles.pricingCard__name}>
                Business
              </Typography>
              <div className={styles.pricingCard__price}>
                <span className={styles.pricingCard__currency}>£</span>
                <span className={styles.pricingCard__amount}>89</span>
                <span className={styles.pricingCard__period}>/month</span>
              </div>
              <Typography variant="body-small" className={styles.pricingCard__fee}>
                + 5% platform fee
              </Typography>
              <ul className={styles.pricingCard__features}>
                <li>✓ Everything in Professional</li>
                <li>✓ Multiple Locations</li>
                <li>✓ Event Management</li>
                <li>✓ API Access</li>
                <li>✓ Dedicated Support</li>
                <li>✓ Custom Integrations</li>
                <li>✓ Lowest Platform Fee</li>
              </ul>
              <Link href="/merchant/onboarding">
                <Button variant="outline" className={styles.pricingCard__button}>
                  Start Trial
                </Button>
              </Link>
            </Card>
          </div>

          <Typography variant="body-medium" className={styles.pricing__note}>
            All plans include a 7-day trial. No credit card required to start. Platform fees are calculated on transaction value.
          </Typography>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.cta__content}>
          <Typography as="h2" variant="heading-2" className={styles.cta__title}>
            Start Taking Orders Today
          </Typography>
          <Typography variant="body-large" className={styles.cta__description}>
            Join hundreds of food businesses using Fesi. Complete POS system, online ordering, 
            and order management for less than the cost of a coffee per day. Start your 7-day trial now.
          </Typography>
          <div className={styles.cta__actions}>
            <Link href="/merchant/onboarding">
              <Button variant="primary" size="lg">
                Start Your Trial
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

      <footer className={styles.footer}>
        <Link href="/privacy">Privacy Policy</Link>
        {' · '}
        <Link href="/terms">Terms</Link>
      </footer>
    </main>
  );
}
