import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import { getMerchantIdFromDevToken } from '@/utils/devAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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
      
      if (plansData?.plans) {
        setPlans(plansData.plans);
        console.log('Plans set:', plansData.plans.length, 'plans');
      } else {
        console.warn('No plans in response');
      }

      // Try to fetch current subscription (requires auth)
      const hasMerchantId = getMerchantIdFromDevToken();
      console.log('Has merchant ID from dev token:', hasMerchantId);
      
      // Only try to fetch if we have a merchant ID
      if (hasMerchantId) {
        try {
          console.log('Fetching current subscription...');
          const currentData = await api.get('/api/subscriptions/current');
          console.log('Current subscription data:', currentData);
          
          if (currentData?.subscription) {
            setCurrentSubscription(currentData.subscription);
            console.log('Current subscription set');
          }
        } catch (authError: any) {
          console.log('Could not fetch current subscription (this is normal if not authenticated):', authError.message);
          // User might not have access - that's okay, just show plans
        }
      } else {
        console.log('No merchant ID, skipping current subscription fetch');
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    setSelectedPlan(tier);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      const response = await api.post('/api/subscriptions/upgrade', {
        tier: selectedPlan
      });

      if (response?.success) {
        await fetchSubscriptionData();
        setShowUpgradeModal(false);
        alert('Subscription upgraded successfully!');
      } else {
        alert(response?.message || 'Failed to upgrade subscription');
      }
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('An error occurred during upgrade');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of your billing period.')) {
      return;
    }

    try {
      const response = await api.post('/api/subscriptions/cancel', {
        immediate: false
      });

      if (response?.success) {
        await fetchSubscriptionData();
        alert('Subscription cancelled. You will retain access until the end of your billing period.');
      } else {
        alert(response?.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling:', error);
      alert('An error occurred');
    }
  };

  const getFeatureList = (tier: string): string[] => {
    const features: Record<string, string[]> = {
      free: [
        'Events & online ordering',
        'Basic analytics (3 months)',
        '1 staff account',
        '50 menu items',
        '10% transaction fee'
      ],
      professional: [
        'Everything in Free, plus:',
        'Table service',
        'Staff management (10 accounts)',
        'Reservations',
        'Inventory management',
        'POS system',
        'Tipping',
        'Analytics (12 months)',
        '200 menu items',
        '20 tables',
        '8% transaction fee'
      ],
      business: [
        'Everything in Professional, plus:',
        'Unlimited staff & tables',
        'Unlimited menu items',
        'Custom branding',
        'Priority support',
        'Advanced reporting',
        'API access',
        'Webhooks',
        'Unlimited analytics',
        '6% transaction fee'
      ],
      enterprise: [
        'Everything in Business, plus:',
        'White-label capabilities',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees',
        '5% transaction fee'
      ]
    };
    return features[tier] || [];
  };

  const getPlanColor = (tier: string) => {
    const colors: Record<string, string> = {
      free: '#6B7280',
      professional: '#3B82F6',
      business: '#8B5CF6',
      enterprise: '#F59E0B'
    };
    return colors[tier] || '#6B7280';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading subscription details...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Subscription Management</h1>
          <p>Choose the plan that best fits your business needs</p>
        </div>

      {/* Current Plan Section */}
      {currentSubscription && (
        <div className={styles.currentPlan}>
          <h2>Your Current Plan</h2>
          <div className={styles.currentPlanCard}>
            <div className={styles.planHeader}>
              <h3>{currentSubscription.plan_name}</h3>
              <div className={styles.price}>
                £{Number(currentSubscription.price_monthly).toFixed(2)}
                <span>/month</span>
              </div>
            </div>
            <div className={styles.planDetails}>
              <p><strong>Transaction Fee:</strong> {Number(currentSubscription.transaction_fee_percentage)}%</p>
              <p><strong>Status:</strong> <span className={styles.status}>{currentSubscription.subscription_status}</span></p>
              {currentSubscription.subscription_ends_at && (
                <p><strong>Ends:</strong> {new Date(currentSubscription.subscription_ends_at).toLocaleDateString()}</p>
              )}
            </div>
            {currentSubscription.subscription_tier !== 'free' && (
              <button 
                className={styles.cancelButton}
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className={styles.plansSection}>
        <h2>Available Plans</h2>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div 
              key={plan.tier}
              className={`${styles.planCard} ${currentSubscription?.subscription_tier === plan.tier ? styles.current : ''}`}
              style={{ borderColor: getPlanColor(plan.tier) }}
            >
              <div className={styles.planCardHeader}>
                <h3>{plan.name}</h3>
                {currentSubscription?.subscription_tier === plan.tier && (
                  <span className={styles.currentBadge}>Current Plan</span>
                )}
              </div>
              
              <div className={styles.planPrice}>
                <span className={styles.amount}>£{Number(plan.price_monthly).toFixed(0)}</span>
                <span className={styles.period}>/month</span>
              </div>

              <div className={styles.transactionFee}>
                + {Number(plan.transaction_fee_percentage)}% per transaction
              </div>

              <ul className={styles.featuresList}>
                {getFeatureList(plan.tier).map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              {currentSubscription?.subscription_tier !== plan.tier && (
                <button
                  className={styles.upgradeButton}
                  onClick={() => handleUpgrade(plan.tier)}
                  style={{ backgroundColor: getPlanColor(plan.tier) }}
                >
                  {Number(plan.price_monthly) > Number(currentSubscription?.price_monthly || 0) ? 'Upgrade' : 'Downgrade'} to {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Subscription Change</h2>
            <p>
              You are about to {Number(plans.find(p => p.tier === selectedPlan)?.price_monthly || 0) > Number(currentSubscription?.price_monthly || 0) ? 'upgrade' : 'downgrade'} to the{' '}
              <strong>{plans.find(p => p.tier === selectedPlan)?.name}</strong> plan.
            </p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowUpgradeModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={confirmUpgrade} className={styles.confirmBtn}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
