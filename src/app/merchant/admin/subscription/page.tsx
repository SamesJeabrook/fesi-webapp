'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { getMerchantIdFromDevToken } from '@/utils/devAuth';
import styles from './subscription.module.scss';

interface SubscriptionPlan {
  tier: string;
  name: string;
  price_monthly: number;
  transaction_fee_percentage: number;
  features: Record<string, boolean>;
  limits: Record<string, number | null>;
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
  limits: Record<string, number | null>;
}

export default function SubscriptionPage() {
  const router = useRouter();
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
      // Fetch plans first (public endpoint, no auth needed)
      console.log('Fetching plans...');
      const plansData = await api.get('/api/subscriptions/plans', { skipAuth: true });
      console.log('Plans data received:', plansData);
      setPlans(plansData.data || []);

      // Fetch current subscription (requires auth)
      console.log('Fetching current subscription...');
      const merchantId = getMerchantIdFromDevToken();
      if (!merchantId) {
        console.error('No merchant ID found');
        setLoading(false);
        return;
      }

      const subscriptionData = await api.get(`/api/subscriptions/merchant/${merchantId}`);
      console.log('Subscription data received:', subscriptionData);
      setCurrentSubscription(subscriptionData.data);
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
    if (!selectedPlan) return;

    try {
      const merchantId = getMerchantIdFromDevToken();
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
      <h1>Subscription Management</h1>

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
        {plans.map((plan) => (
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
                {Object.entries(plan.features).map(([feature, enabled]) => (
                  <li key={feature} className={enabled ? styles.enabled : styles.disabled}>
                    {feature.replace(/_/g, ' ')}: {enabled ? '✓' : '✗'}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.limits}>
              <h4>Limits:</h4>
              <ul>
                {Object.entries(plan.limits).map(([limit, value]) => (
                  <li key={limit}>
                    {limit.replace(/_/g, ' ')}: {value === null ? 'Unlimited' : value}
                  </li>
                ))}
              </ul>
            </div>

            {currentSubscription?.subscription_tier !== plan.tier && (
              <button 
                className={styles.upgradeBtn}
                onClick={() => handleUpgrade(plan.tier)}
              >
                {currentSubscription?.subscription_tier === 'free' ? 'Upgrade' : 'Change Plan'}
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
