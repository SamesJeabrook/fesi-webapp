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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManagingOtherMerchant, setIsManagingOtherMerchant] = useState(false);

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
      // Check if managing a specific merchant (for admin)
      const merchantIdParam = searchParams.get('merchantId');
      console.log('merchantIdParam from URL:', merchantIdParam);
      
      // Get merchant ID first
      let currentMerchantId: string | undefined;
      const devToken = localStorage.getItem('dev_token');
      
      // Check if user is admin
      console.log('Fetching user data to check admin status...');
      const userData = await api.get('/api/auth/me');
      const userRoles = userData.user?.roles || [];
      const isAdminUser = userRoles.includes('admin');
      console.log('User roles:', userRoles, 'isAdmin:', isAdminUser);
      setIsAdmin(isAdminUser);
      
      // Priority 1: Admin with merchantId param (most specific)
      if (merchantIdParam && isAdminUser) {
        // Admin is managing a specific merchant
        currentMerchantId = merchantIdParam;
        setIsManagingOtherMerchant(true);
        console.log('[ADMIN MODE] Managing merchant:', currentMerchantId);
        
        // Set merchantId state immediately for admin mode
        console.log('Setting merchantId state to:', currentMerchantId);
        setMerchantId(currentMerchantId);
      } 
      // Priority 2: Admin with merchantId param but roles not detected (fallback for auth issues)
      else if (merchantIdParam && !isAdminUser) {
        console.warn('⚠️ merchantId param present but admin role not detected. Checking AuthGuard...');
        // If we have a merchantId param but roles aren't loaded, still try to use it
        // This handles the case where Auth0 metadata hasn't synced yet
        currentMerchantId = merchantIdParam;
        setIsManagingOtherMerchant(true);
        setIsAdmin(true); // Assume admin if accessing via merchantId param
        console.log('[ADMIN MODE FALLBACK] Managing merchant:', currentMerchantId);
        
        // Set merchantId state immediately
        console.log('Setting merchantId state to:', currentMerchantId);
        setMerchantId(currentMerchantId);
      }
      // Priority 3: Dev token
      else if (devToken && devToken.startsWith('dev-merchant-')) {
        // Extract merchant ID from dev token
        currentMerchantId = devToken.replace('dev-merchant-', '');
        console.log('[DEV MODE] Using merchant ID from dev token:', currentMerchantId);
        
        // Set merchantId state immediately for dev mode
        console.log('Setting merchantId state to:', currentMerchantId);
        setMerchantId(currentMerchantId);
      } else if (!isAdminUser) {
        // Only check merchant_ids if user is NOT an admin
        // For real Auth0 tokens, get merchant_ids from /api/auth/me
        const merchantIds = userData.user?.merchant_ids || [];
        
        if (merchantIds.length > 0) {
          currentMerchantId = merchantIds[0];
          console.log('[Auth0] User merchant_id:', currentMerchantId);
          
          // Set merchantId state immediately (with null check)
          if (currentMerchantId) {
            console.log('Setting merchantId state to:', currentMerchantId);
            setMerchantId(currentMerchantId);
          }
        } else {
          console.error('No merchant ID found for user');
          setLoading(false);
          return;
        }
      } else if (isAdminUser && !merchantIdParam) {
        // Admin without merchantId param - show error
        console.error('Admin must access this page with ?merchantId parameter');
        setLoading(false);
        return;
      } else {
        // Fallback - no valid merchant ID could be determined
        console.error('Unable to determine merchant ID from any source');
        setLoading(false);
        return;
      }

      if (!currentMerchantId) {
        console.error('No merchant ID found after all checks');
        setLoading(false);
        return;
      }

      // Fetch merchant details for name (used in delete confirmation)
      console.log('Fetching merchant details for:', currentMerchantId);
      const merchantData = await api.get(`/api/merchants/${currentMerchantId}`);
      console.log('Merchant data received:', merchantData);
      // Handle both response formats: merchantData.data or merchantData.merchant
      const merchantInfo = merchantData.merchant || merchantData.data || merchantData;
      setMerchantName(merchantInfo?.name || merchantInfo?.business_name || '');

      // Fetch plans first (public endpoint, no auth needed)
      console.log('Fetching plans...');
      const plansData = await api.get('/api/subscriptions/plans', { skipAuth: true });
      console.log('Plans data received:', plansData);
      setPlans(plansData.plans || []);

      // Fetch current subscription (requires auth, automatically gets merchant's subscription)
      console.log('Fetching current subscription...');
      
      // If admin is managing another merchant, pass merchant_id as query param
      const subscriptionUrl = (merchantIdParam && isAdminUser)
        ? `/api/subscriptions/current?merchant_id=${currentMerchantId}`
        : '/api/subscriptions/current';
      
      const subscriptionData = await api.get(subscriptionUrl);
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
      const payload: any = {
        tier: selectedPlan
      };
      
      // If admin is managing another merchant, include merchant_id
      if (isManagingOtherMerchant) {
        payload.merchant_id = merchantId;
      }

      await api.post(`/api/subscriptions/upgrade`, payload);

      // Refresh subscription data
      await fetchSubscriptionData();
      setShowUpgradeModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!merchantId) return;

    try {
      const payload: any = {
        immediate: false // Cancel at end of billing period
      };
      
      // If admin is managing another merchant, include merchant_id
      if (isManagingOtherMerchant) {
        payload.merchant_id = merchantId;
      }

      await api.post('/api/subscriptions/cancel', payload);

      // Refresh subscription data
      await fetchSubscriptionData();
      setShowCancelModal(false);
      alert('The subscription has been cancelled and will end at the end of the billing period.');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const handleExportData = async () => {
    console.log('handleExportData called, merchantId:', merchantId);
    console.log('Current state - merchantName:', merchantName);
    console.log('Current state - isManagingOtherMerchant:', isManagingOtherMerchant);
    
    if (!merchantId) {
      console.error('No merchant ID for export');
      alert('Unable to export data: No merchant ID found');
      return;
    }

    setIsExporting(true);
    try {
      console.log('Starting data export for merchant:', merchantId);
      
      // Get the access token
      const token = await getAccessTokenSilently();
      console.log('Token obtained, fetching export...');
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const exportUrl = `${apiUrl}/api/merchants/${merchantId}/export-data`;
      console.log('Export URL:', exportUrl);
      
      const response = await fetch(exportUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Export response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export failed:', errorText);
        throw new Error(`Failed to export data: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Blob received, size:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fesi-data-export-${merchantName || merchantId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('Export download triggered successfully');
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!merchantId || deleteConfirmText !== merchantName) {
      alert('Please type your merchant name exactly to confirm deletion.');
      return;
    }

    if (!confirm('This action cannot be undone. All your data will be permanently deleted. Are you absolutely sure?')) {
      return;
    }

    try {
      // Get CSRF token
      const csrfResponse = await api.get('/api/auth/csrf-token');
      const csrfToken = csrfResponse.csrfToken;

      await api.delete(`/api/merchants/${merchantId}`, {
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });

      // Redirect to a goodbye page or logout
      alert('Your account has been successfully deleted. You will now be logged out.');
      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please contact support.');
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

        {isManagingOtherMerchant && merchantName && (
          <div className={styles.adminBanner}>
            <span className={styles.adminIcon}>👤</span>
            <div>
              <strong>Admin Mode</strong>
              <p>You are managing the subscription for: <strong>{merchantName}</strong></p>
            </div>
          </div>
        )}

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

        {/* GDPR Danger Zone - Always available */}
        <div className={styles.dangerZone}>
          <div className={styles.dangerZoneHeader}>
            <span className={styles.warningIcon}>⚠️</span>
            <h2>Danger Zone</h2>
          </div>
          
          <div className={styles.dangerZoneContent}>
            <div className={styles.dangerZoneSection}>
              <h3>Export Your Data</h3>
              <p>
                Download all your merchant data including orders, menus, customers, and analytics. 
                This is required before deleting your account.
              </p>
              <button 
                className={styles.exportButton}
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : '📥 Download My Data'}
              </button>
            </div>

            <div className={styles.dangerZoneDivider}></div>

            <div className={styles.dangerZoneSection}>
              <h3>Delete Account</h3>
              <p>
                Permanently delete your account and all associated data. This action <strong>cannot be undone</strong>.
              </p>
              <p className={styles.deletionWarning}>
                <strong>This will delete:</strong> All orders, menus, menu items, customers, loyalty data, analytics, 
                payment history, and any other data associated with your account. If you have an active subscription, 
                it will be cancelled immediately.
              </p>
              <button 
                className={styles.deleteButton}
                onClick={() => setShowDeleteModal(true)}
              >
                🗑️ Delete My Account
              </button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className={styles.modal}>
            <div className={`${styles.modalContent} ${styles.deleteModalContent}`}>
              <div className={styles.deleteModalHeader}>
                <span className={styles.deleteIcon}>⚠️</span>
                <h2>Delete Account</h2>
              </div>
              <p>
                This action is <strong>permanent and cannot be undone</strong>. All your data will be permanently deleted 
                from our servers.
              </p>
              <div className={styles.deleteConfirmation}>
                <p>
                  To confirm deletion, please type your merchant name <strong>{merchantName}</strong> below:
                </p>
                <input
                  type="text"
                  className={styles.deleteConfirmInput}
                  placeholder={merchantName}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  className={styles.deleteConfirmButton}
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== merchantName}
                >
                  Delete My Account Forever
                </button>
                <button 
                  className={styles.cancelActionButton}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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

      {isManagingOtherMerchant && merchantName && (
        <div className={styles.adminBanner}>
          <span className={styles.adminIcon}>👤</span>
          <div>
            <strong>Admin Mode</strong>
            <p>You are managing the subscription for: <strong>{merchantName}</strong></p>
          </div>
        </div>
      )}

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

      {/* Cancel Subscription Section */}
      {currentSubscription && 
       currentSubscription.subscription_status === 'active' && 
       currentSubscription.subscription_tier !== 'starter' && 
       currentSubscription.stripe_subscription_id && (
        <div className={styles.cancelSection}>
          <h2>Cancel Subscription</h2>
          <p>
            You're currently on the <strong>{currentSubscription.plan_name}</strong> plan (£{currentSubscription.price_monthly}/month).
          </p>
          <p>
            If you cancel, your subscription will continue until{' '}
            {currentSubscription.subscription_ends_at 
              ? new Date(currentSubscription.subscription_ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'the end of your billing period'
            }, then you'll be downgraded to the Starter (free) tier.
          </p>
          <button 
            className={styles.cancelButton}
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {showCancelModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Cancel Subscription</h2>
            <p>
              Are you sure you want to cancel your subscription? Your subscription will remain active until the end of your billing period, 
              then you'll be downgraded to the Starter (free) tier.
            </p>
            <p className={styles.warningText}>
              <strong>⚠️ You will lose access to:</strong>
            </p>
            <ul className={styles.featureList}>
              {currentSubscription?.feature_descriptions?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={handleCancelSubscription}>
                Yes, Cancel Subscription
              </button>
              <button className={styles.cancelActionButton} onClick={() => setShowCancelModal(false)}>
                Keep Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Danger Zone */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerZoneHeader}>
          <span className={styles.warningIcon}>⚠️</span>
          <h2>Danger Zone</h2>
        </div>
        
        <div className={styles.dangerZoneContent}>
          <div className={styles.dangerZoneSection}>
            <h3>Export Your Data</h3>
            <p>
              Download all your merchant data including orders, menus, customers, and analytics. 
              This is required before deleting your account.
            </p>
            <button 
              className={styles.exportButton}
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : '📥 Download My Data'}
            </button>
          </div>

          <div className={styles.dangerZoneDivider}></div>

          <div className={styles.dangerZoneSection}>
            <h3>Delete Account</h3>
            <p>
              Permanently delete your account and all associated data. This action <strong>cannot be undone</strong>.
            </p>
            <p className={styles.deletionWarning}>
              <strong>This will delete:</strong> All orders, menus, menu items, customers, loyalty data, analytics, 
              payment history, and any other data associated with your account. If you have an active subscription, 
              it will be cancelled immediately.
            </p>
            <button 
              className={styles.deleteButton}
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️ Delete My Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={`${styles.modalContent} ${styles.deleteModalContent}`}>
            <div className={styles.deleteModalHeader}>
              <span className={styles.deleteIcon}>⚠️</span>
              <h2>Delete Account</h2>
            </div>
            <p>
              This action is <strong>permanent and cannot be undone</strong>. All your data will be permanently deleted 
              from our servers.
            </p>
            <div className={styles.deleteConfirmation}>
              <p>
                To confirm deletion, please type your merchant name <strong>{merchantName}</strong> below:
              </p>
              <input
                type="text"
                className={styles.deleteConfirmInput}
                placeholder={merchantName}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.deleteConfirmButton}
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== merchantName}
              >
                Delete My Account Forever
              </button>
              <button 
                className={styles.cancelActionButton}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
