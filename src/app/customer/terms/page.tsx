"use client";

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { CustomerNavigationWrapper } from '@/components/molecules/CustomerNavigation';
import styles from './page.module.scss';

export default function CustomerTermsPage() {
  const { user, isAuthenticated } = useAuth0();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requireAcceptance = searchParams.get('accept') === 'true';
  const [hasAccepted, setHasAccepted] = useState(false);

  const handleAcceptTerms = () => {
    // Store acceptance in localStorage
    localStorage.setItem('fesi_terms_accepted', 'true');
    localStorage.setItem('fesi_terms_accepted_date', new Date().toISOString());
    
    setHasAccepted(true);
    
    // Redirect to return URL or profile
    const returnTo = searchParams.get('returnTo') || '/customer/profile';
    router.push(returnTo);
  };

  return (
    <div className={styles.terms}>
      <CustomerNavigationWrapper />
      
      <div className={styles.terms__container}>
        <Typography variant="heading-2" className={styles.terms__title}>
          Customer Terms & Conditions
        </Typography>

        <div className={styles.terms__content}>
          <Typography variant="body-small" className={styles.terms__updated}>
            Last Updated: May 12, 2026
          </Typography>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">1. Acceptance of Terms</Typography>
            <Typography variant="body-medium">
              By creating an account and using Fesi's services, you accept these terms and conditions in full. 
              If you disagree with any part of these terms, you must not use our services.
            </Typography>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">2. Account Registration</Typography>
            <ul>
              <li>You must provide accurate and complete information when creating your account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>You must be at least 16 years old to create an account</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">3. Use of Service</Typography>
            
            <Typography variant="heading-5">Permitted Use</Typography>
            <ul>
              <li>Browse and order from participating merchants</li>
              <li>Track your orders in real-time</li>
              <li>Leave ratings and reviews for completed orders</li>
              <li>Manage loyalty cards and rewards</li>
            </ul>

            <Typography variant="heading-5">Prohibited Use</Typography>
            <ul>
              <li>Provide false or misleading information</li>
              <li>Impersonate another person or entity</li>
              <li>Use the service for illegal purposes</li>
              <li>Harass or abuse merchants or other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">4. Orders and Payment</Typography>
            <ul>
              <li>All orders are subject to merchant acceptance</li>
              <li>Prices are as displayed at the time of order</li>
              <li>You are responsible for paying the full order amount</li>
              <li>Refunds are handled according to merchant policies</li>
              <li>We are not responsible for merchant-related issues</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">5. Your Data and Privacy</Typography>
            
            <Typography variant="heading-5">Data We Collect</Typography>
            <ul>
              <li>Personal information (name, email, phone number)</li>
              <li>Order history and preferences</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Location data (when using the app)</li>
            </ul>

            <Typography variant="heading-5">Your Rights (GDPR)</Typography>
            <ul>
              <li><strong>Right to Access:</strong> Download all your data at any time</li>
              <li><strong>Right to Rectification:</strong> Update your personal information</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your account</li>
              <li><strong>Right to Data Portability:</strong> Export your data in JSON format</li>
              <li><strong>Right to Object:</strong> Opt-out of marketing communications</li>
            </ul>

            <Typography variant="body-medium">
              See our <a href="/privacy" className={styles.terms__link}>Privacy Policy</a> for more details.
            </Typography>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">6. Account Deletion</Typography>
            <Typography variant="body-medium">
              You can delete your account at any time from your settings page. Upon deletion:
            </Typography>
            <ul>
              <li>Your personal data will be anonymized</li>
              <li>Order history will be retained for legal/accounting purposes but anonymized</li>
              <li>Saved payment methods will be removed</li>
              <li>Loyalty cards will be deactivated</li>
              <li>This action cannot be undone</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">7. Ratings and Reviews</Typography>
            <ul>
              <li>Reviews must be honest and based on actual experience</li>
              <li>We reserve the right to remove inappropriate content</li>
              <li>Reviews cannot be edited after 48 hours</li>
              <li>Fake or incentivized reviews are prohibited</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">8. Liability</Typography>
            <ul>
              <li>Fesi acts as a platform connecting customers with merchants</li>
              <li>We are not responsible for food safety, quality, or merchant actions</li>
              <li>Merchants are independent businesses responsible for their own operations</li>
              <li>We are not liable for any indirect or consequential losses</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">9. Changes to Terms</Typography>
            <ul>
              <li>We may update these terms at any time</li>
              <li>Continued use of the service constitutes acceptance of new terms</li>
              <li>Significant changes will be communicated via email</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">10. Termination</Typography>
            <Typography variant="body-medium">
              We reserve the right to suspend or terminate your account if you:
            </Typography>
            <ul>
              <li>Violate these terms and conditions</li>
              <li>Engage in fraudulent activity</li>
              <li>Abuse or harass merchants or staff</li>
              <li>Fail to pay for orders</li>
            </ul>
          </section>

          <section className={styles.terms__section}>
            <Typography variant="heading-4">11. Contact</Typography>
            <Typography variant="body-medium">
              For questions about these terms, contact us at:
            </Typography>
            <ul>
              <li>Email: <a href="mailto:info@fesi.app" className={styles.terms__link}>info@fesi.app</a></li>
              <li>Website: <a href="https://fesi.app" className={styles.terms__link}>https://fesi.app</a></li>
            </ul>
          </section>

          <div className={styles.terms__footer}>
            <Typography variant="body-small">
              By using Fesi, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </Typography>
          </div>
        </div>

        {requireAcceptance && !hasAccepted && (
          <div className={styles.terms__acceptance}>
            <div className={styles.terms__acceptanceBox}>
              <Typography variant="body-medium">
                Please read and accept the terms and conditions to continue.
              </Typography>
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleAcceptTerms}
              >
                I Accept the Terms & Conditions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
