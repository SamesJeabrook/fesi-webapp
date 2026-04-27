'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import api from '@/utils/api';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import styles from './SubscriptionPaymentSetup.module.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionPaymentSetupProps {
  selectedTier: 'starter' | 'professional' | 'business';
  onComplete?: () => void;
  onSkip?: () => void;
  isOnboarding?: boolean;
  isBetaUser?: boolean;
  hasTrialAccess?: boolean;
  trialDays?: number;
}

export const SubscriptionPaymentSetup: React.FC<SubscriptionPaymentSetupProps> = ({
  selectedTier,
  onComplete,
  onSkip,
  isOnboarding = false,
  isBetaUser = false,
  hasTrialAccess = false,
  trialDays = 7,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierPrices = {
    starter: 10,
    professional: 39,
    business: 89,
  };

  const price = tierPrices[selectedTier];

  const handleStartPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create checkout session
      const response = await api.post('/api/subscription-checkout/create-session', {
        tier: selectedTier,
        success_url: isOnboarding 
          ? `${window.location.origin}/onboarding/complete?session_id={CHECKOUT_SESSION_ID}`
          : `${window.location.origin}/merchant/admin/subscription?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: isOnboarding
          ? `${window.location.origin}/onboarding/payment-setup?canceled=true`
          : `${window.location.origin}/merchant/admin/subscription?canceled=true`,
      });

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err: any) {
      console.error('Error starting payment setup:', err);
      setError(err.message || 'Failed to start payment setup');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else if (isOnboarding) {
      router.push('/merchant/admin');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>💳</div>
        
        <Typography variant="heading-3" className={styles.title}>
          Set Up Your Subscription Payment
        </Typography>

        <Typography variant="body-large" className={styles.subtitle}>
          You've set up your bank account to receive payments from customers. Now we need to set up how you'll pay for your Fesi subscription.
        </Typography>

        <div className={styles.explanation}>
          <div className={styles.explanationItem}>
            <span className={styles.explanationIcon}>✅</span>
            <div>
              <Typography variant="body-medium" style={{ fontWeight: 600 }}>
                Bank Account (Already Set Up)
              </Typography>
              <Typography variant="body-small" className={styles.secondaryText}>
                This is where customer payments are deposited
              </Typography>
            </div>
          </div>

          <div className={styles.explanationItem}>
            <span className={styles.explanationIcon}>💳</span>
            <div>
              <Typography variant="body-medium" style={{ fontWeight: 600 }}>
                Payment Card (Set Up Now)
              </Typography>
              <Typography variant="body-small" className={styles.secondaryText}>
                This is how you'll pay your £{price}/month subscription
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.pricingBox}>
          <Typography variant="heading-4">
            {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Plan
          </Typography>
          <Typography variant="heading-2" className={styles.price}>
            £{price}
            <span className={styles.period}>/month</span>
          </Typography>
          <Typography variant="body-small" className={styles.secondaryText}>
            Billed monthly • Cancel anytime
          </Typography>
        </div>

        {error && (
          <div className={styles.error}>
            <Typography variant="body-small" className={styles.errorText}>
              {error}
            </Typography>
          </div>
        )}

        {/* Trial/Beta Information Banner */}
        {isOnboarding && (isBetaUser || hasTrialAccess) && (
          <div className={styles.trialBanner}>
            <div className={styles.trialBannerIcon}>
              {isBetaUser ? '🌟' : '🎟️'}
            </div>
            <div className={styles.trialBannerContent}>
              {isBetaUser ? (
                <>
                  <Typography variant="body-medium" style={{ fontWeight: 600 }}>
                    Beta Access Active
                  </Typography>
                  <Typography variant="body-small">
                    As a beta user, you won't be charged during the testing period. You can skip payment setup for now.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body-medium" style={{ fontWeight: 600 }}>
                    {trialDays}-Day Free Trial Available
                  </Typography>
                  <Typography variant="body-small">
                    Click "Start Free Trial" below to begin your {trialDays}-day trial. You won't be charged until the trial ends.
                  </Typography>
                </>
              )}
            </div>
          </div>
        )}

        {/* Trial Warning for Non-Trial Users */}
        {isOnboarding && !isBetaUser && !hasTrialAccess && (
          <div className={styles.trialInfo}>
            <Typography variant="body-small" className={styles.secondaryText}>
              💡 If you skip payment now, you'll get a 7-day free trial. After 7 days, you'll need to add payment to continue using Fesi.
            </Typography>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartPayment}
            isDisabled={loading}
            fullWidth
          >
            {loading ? 'Redirecting to payment...' : 'Continue to Payment'}
          </Button>

          {isOnboarding && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleSkip}
              isDisabled={loading}
              fullWidth
            >
              {isBetaUser ? 'Continue Without Payment' : `Start ${trialDays}-Day Free Trial`}
            </Button>
          )}
        </div>

        <div className={styles.secureNote}>
          <Typography variant="caption" className={styles.secureText}>
            🔒 Secure payment powered by Stripe
          </Typography>
        </div>
      </div>
    </div>
  );
};
