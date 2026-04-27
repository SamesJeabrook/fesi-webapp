'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import api from '@/utils/api';
import { SubscriptionPaymentSetup } from '@/components/organisms/SubscriptionPaymentSetup';
import styles from './subscription.module.scss';

interface SubscriptionPlan {
  tier: string;
  name: string;
  price_monthly: number;
  transaction_fee_percentage: number;
  features: Record<string, boolean>;
  feature_descriptions?: string[];
  limits: Record<string, number | boolean | null>;
}

interface CurrentSubscription {
  subscription_tier: string;
  subscription_status: string;
  subscription_started_at: string;
  subscription_ends_at: string | null;
  plan_name: string;
  price_monthly: number;
  transaction_fee_percentage: number;
  features: Record<string, boolean>;
  feature_descriptions?: string[];
  limits: Record<string, number | boolean | null>;
  stripe_subscription_id?: string | null;
  trial_ends_at?: string | null;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [needsPaymentSetup, setNeedsPaymentSetup] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    console.log('Subscription page mounted');
    
    // Check for success parameter
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.pathname);
    }
    
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    // Check if payment setup is needed
    if (currentSubscription) {
      const hasPayment = currentSubscription.stripe_subscription_id !== null && 
                         currentSubscription.stripe_subscription_id !== undefined;
      const trialEndsAt = currentSubscription.trial_ends_at ? new Date(currentSubscription.trial_ends_at) : null;
      const isTrialExpired = trialEndsAt && trialEndsAt < new Date();
      
      setNeedsPaymentSetup(!hasPayment);
      setTrialExpired(!!isTrialExpired);
    }
  }, [currentSubscription]);

  const fetchSubscriptionData = async () => {
    console.log('fetchSubscriptionData called');

    try {
      // Get merchant ID first
      let currentMerchantId: string | undefined;
      const devToken = localStorage.getItem('dev_token');
      
      if (devToken && devToken.startsWith('dev-merchant-')) {
        // Extract merchant ID from dev token
        currentMerchantId = devToken.replace('dev-merchant-', '');
        console.log('[DEV MODE] Using merchant ID from dev token:', currentMerchantId);
      } else {
        // For real Auth0 tokens, get merchant_ids from /api/auth/me
        const userData = await api.get('/api/auth/me');
        const merchantIds = userData.user?.merchant_ids || [];
        
        if (merchantIds.length > 0) {
          currentMerchantId = merchantIds[0];
          console.log('[Auth0] User merchant_id:', currentMerchantId);
        } else {
          console.error('No merchant ID found for user');
          setLoading(false);
          return;
        }
      }

      if (!currentMerchantId) {
        console.error('No merchant ID found');
        setLoading(false);
        return;
      }

      setMerchantId(currentMerchantId);

      // Fetch plans first (public endpoint, no auth needed)
      console.log('Fetching plans...');
      const plansData = await api.get('/api/subscriptions/plans', { skipAuth: true });
      console.log('Plans data received:', plansData);
      setPlans(plansData.plans || []);

      // Fetch current subscription (requires auth, automatically gets merchant's subscription)
      console.log('Fetching current subscription...');
      const subscriptionData = await api.get('/api/subscriptions/current');
      console.log('Subscription data received:', subscriptionData);
      setCurrentSubscription(subscriptionData.subscription);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (tier: string) => {
    setSelectedPlan(tier);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan || !merchantId) return;

    try {
      await api.post(`/api/subscriptions/upgrade`, {
        merchant_id: merchantId,
        new_tier: selectedPlan
      });

      // Refresh subscription data
      await fetchSubscriptionData();
      setShowUpgradeModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading subscription information...</div>;
  }

  // If payment setup is needed, show that first
  if (needsPaymentSetup && currentSubscription) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/merchant/admin" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1>Payment Required</h1>
        </div>

        <div className={styles.paymentSetupSection}>
          {trialExpired && (
            <div className={styles.trialExpiredBanner}>
              <h2>⚠️ Trial Expired</h2>
              <p>Your 7-day trial has ended. Please add a payment method to continue using Fesi.</p>
            </div>
          )}
          
          {!trialExpired && currentSubscription.trial_ends_at && (
            <div className={styles.trialInfoBanner}>
              <h2>📅 Trial Active</h2>
              <p>
                Your trial ends on {new Date(currentSubscription.trial_ends_at).toLocaleDateString()}.
                Add a payment method now to avoid service interruption.
              </p>
            </div>
          )}

          <SubscriptionPaymentSetup
            selectedTier={currentSubscription.subscription_tier as 'starter' | 'professional' | 'business'}
            isOnboarding={false}
            onComplete={() => {
              // Refresh subscription data after payment setup
              fetchSubscriptionData();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/merchant/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>Subscription Management</h1>
      </div>

      {showSuccessMessage && (
        <div className={styles.successBanner}>
          <span className={styles.successIcon}>✅</span>
          <div>
            <strong>Payment Successful!</strong>
            <p>Your subscription is now active and your account is fully set up.</p>
          </div>
        </div>
      )}

      {currentSubscription && (
        <div className={styles.currentPlan}>
          <h2>Current Plan: {currentSubscription.plan_name}</h2>
          <p>Status: {currentSubscription.subscription_status}</p>
          <p>Monthly Fee: £{currentSubscription.price_monthly}</p>
          <p>Transaction Fee: {currentSubscription.transaction_fee_percentage}%</p>
          <p>Started: {new Date(currentSubscription.subscription_started_at).toLocaleDateString()}</p>
          {currentSubscription.subscription_ends_at && (
            <p>Ends: {new Date(currentSubscription.subscription_ends_at).toLocaleDateString()}</p>
          )}
        </div>
      )}

      <h2>Available Plans</h2>
      <div className={styles.plansGrid}>
        {plans
          .filter(plan => plan.tier !== 'enterprise' && plan.tier !== 'business')
          .map((plan) => (
          <div 
            key={plan.tier} 
            className={`${styles.planCard} ${currentSubscription?.subscription_tier === plan.tier ? styles.current : ''}`}
          >
            <h3>{plan.name}</h3>
            <p className={styles.price}>£{plan.price_monthly}/month</p>
            <p>Transaction Fee: {plan.transaction_fee_percentage}%</p>
            
            <div className={styles.features}>
              <h4>Features:</h4>
              <ul>
                {(plan.feature_descriptions || []).map((feature, index) => (
                  <li key={index}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.limits}>
              <h4>Limits:</h4>
              <ul>
                {Object.entries(plan.limits).map(([limit, value]) => (
                  <li key={limit}>
                    {limit.replace(/_/g, ' ')}: {
                      value === null ? 'Unlimited' : 
                      typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                      value
                    }
                  </li>
                ))}
              </ul>
            </div>

            {currentSubscription?.subscription_tier !== plan.tier && (
              <button 
                className={styles.upgradeBtn}
                onClick={() => handleUpgrade(plan.tier)}
              >
                {currentSubscription?.subscription_tier === 'starter' ? 'Upgrade' : 'Change Plan'}
              </button>
            )}
          </div>
        ))}
      </div>

      {showUpgradeModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Plan Change</h2>
            <p>Are you sure you want to change to the {selectedPlan} plan?</p>
            <div className={styles.modalActions}>
              <button onClick={confirmUpgrade}>Confirm</button>
              <button onClick={() => setShowUpgradeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
