'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import api from '@/utils/api';
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
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    console.log('Subscription page mounted');
    fetchSubscriptionData();
  }, []);

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/merchant/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>Subscription Management</h1>
      </div>

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
