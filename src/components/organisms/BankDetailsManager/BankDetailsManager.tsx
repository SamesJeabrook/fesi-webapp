import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, GridContainer, GridItem, Card } from '@/components/atoms';
import styles from './BankDetailsManager.module.scss';

interface BankAccount {
  id: string;
  bank_name?: string;
  last4?: string;
  account_holder_name?: string;
  account_holder_type?: string;
  routing_number?: string;
  status?: string;
  default_for_currency?: boolean;
}

interface StripeAccountStatus {
  id?: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  requirements?: {
    currently_due?: string[];
    eventually_due?: string[];
    past_due?: string[];
    pending_verification?: string[];
  };
  external_accounts?: {
    data: BankAccount[];
  };
  onboarding_complete: boolean;
}

export interface BankDetailsManagerProps {
  merchantId: string;
  onUpdate?: () => void;
  onError?: (error: string) => void;
}

export const BankDetailsManager: React.FC<BankDetailsManagerProps> = ({
  merchantId,
  onUpdate,
  onError,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null);
  const [isCreatingOnboardingLink, setIsCreatingOnboardingLink] = useState(false);

  const loadAccountStatus = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading account status for merchant:', merchantId);
      
      const { getAuthToken } = await import('@/utils/devAuth');
      const token = await getAuthToken(getAccessTokenSilently);

      // Build URL with merchantId query parameter if provided
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/merchants/account-status`
      );
      if (merchantId) {
        url.searchParams.append('merchantId', merchantId);
      }

      console.log('🌐 Fetching from:', url.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to load bank account status');
      }

      const data = await response.json();
      console.log('✅ Account status loaded:', data);
      setAccountStatus(data.success ? data : null);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('❌ Failed to load account status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load bank details';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      console.log('🏁 Finished loading account status');
      setLoading(false);
    }
  };

  const handleSetupAccount = async () => {
    try {
      setIsCreatingOnboardingLink(true);
      const { getAuthToken } = await import('@/utils/devAuth');
      const token = await getAuthToken(getAccessTokenSilently);

      // First, create the Stripe account if it doesn't exist
      if (!accountStatus?.id) {
        const setupResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/merchants/setup-account`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              business_type: 'individual',
            }),
          }
        );

        if (!setupResponse.ok) {
          throw new Error('Failed to create Stripe account');
        }
      }

      // Get the onboarding link
      const linkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/merchants/onboarding-link`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!linkResponse.ok) {
        throw new Error('Failed to get onboarding link');
      }

      const linkData = await linkResponse.json();
      
      // Redirect to Stripe onboarding
      window.location.href = linkData.onboardingUrl;
    } catch (error) {
      console.error('Setup account error:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to setup account');
      }
    } finally {
      setIsCreatingOnboardingLink(false);
    }
  };

  const handleUpdateBankDetails = async () => {
    // Get new onboarding link to update details
    await handleSetupAccount();
  };

  useEffect(() => {
    if (merchantId) {
      loadAccountStatus();
    }
  }, [merchantId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Typography variant="body-medium">Loading bank details...</Typography>
        <Typography variant="body-small" className={styles.loadingSubtext}>
          Merchant ID: {merchantId || 'Not provided'}
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Typography variant="heading-4" as="h3">Bank Account Details</Typography>
        <Card className={styles.errorCard}>
          <Typography variant="body-medium" style={{ color: 'var(--color-danger, #ef4444)' }}>
            ⚠️ Error loading bank details
          </Typography>
          <Typography variant="body-small" style={{ marginTop: '0.5rem' }}>
            {error}
          </Typography>
          <div style={{ marginTop: '1rem' }}>
            <Button 
              variant="primary" 
              onClick={loadAccountStatus}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const bankAccount = accountStatus?.external_accounts?.data?.[0];
  const hasAccount = Boolean(accountStatus?.id);
  const isFullySetup = accountStatus?.onboarding_complete;
  const hasBankDetails = Boolean(bankAccount);

  return (
    <div className={styles.bankDetailsManager}>
      <Typography variant="heading-4" as="h3">Bank Account Details</Typography>
      <Typography variant="body-small" className={styles.description}>
        Manage your bank account for receiving payments. All bank details are securely stored and managed by Stripe.
      </Typography>

      <Card className={styles.statusCard}>
        <GridContainer>
          <GridItem sm={16} md={8}>
            <div className={styles.statusItem}>
              <Typography variant="body-small" className={styles.statusLabel}>
                Account Status
              </Typography>
              <div className={styles.statusValue}>
                {!hasAccount && (
                  <span className={styles.statusBadge} data-status="not-setup">
                    Not Setup
                  </span>
                )}
                {hasAccount && !isFullySetup && (
                  <span className={styles.statusBadge} data-status="incomplete">
                    Incomplete
                  </span>
                )}
                {isFullySetup && (
                  <span className={styles.statusBadge} data-status="active">
                    Active
                  </span>
                )}
              </div>
            </div>
          </GridItem>

          <GridItem sm={16} md={8}>
            <div className={styles.statusItem}>
              <Typography variant="body-small" className={styles.statusLabel}>
                Payments Enabled
              </Typography>
              <div className={styles.statusValue}>
                {accountStatus?.charges_enabled ? (
                  <span className={styles.iconCheck}>✓</span>
                ) : (
                  <span className={styles.iconCross}>✗</span>
                )}
              </div>
            </div>
          </GridItem>

          <GridItem sm={16} md={8}>
            <div className={styles.statusItem}>
              <Typography variant="body-small" className={styles.statusLabel}>
                Payouts Enabled
              </Typography>
              <div className={styles.statusValue}>
                {accountStatus?.payouts_enabled ? (
                  <span className={styles.iconCheck}>✓</span>
                ) : (
                  <span className={styles.iconCross}>✗</span>
                )}
              </div>
            </div>
          </GridItem>

          {hasBankDetails && (
            <>
              <GridItem sm={16} md={8}>
                <div className={styles.statusItem}>
                  <Typography variant="body-small" className={styles.statusLabel}>
                    Bank Name
                  </Typography>
                  <Typography variant="body-medium">
                    {bankAccount?.bank_name || 'N/A'}
                  </Typography>
                </div>
              </GridItem>

              <GridItem sm={16} md={8}>
                <div className={styles.statusItem}>
                  <Typography variant="body-small" className={styles.statusLabel}>
                    Account Number
                  </Typography>
                  <Typography variant="body-medium">
                    ••••{bankAccount?.last4 || '****'}
                  </Typography>
                </div>
              </GridItem>

              <GridItem sm={16} md={8}>
                <div className={styles.statusItem}>
                  <Typography variant="body-small" className={styles.statusLabel}>
                    Account Holder
                  </Typography>
                  <Typography variant="body-medium">
                    {bankAccount?.account_holder_name || 'N/A'}
                  </Typography>
                </div>
              </GridItem>
            </>
          )}
        </GridContainer>

        {accountStatus?.requirements && accountStatus.requirements.currently_due && accountStatus.requirements.currently_due.length > 0 && (
          <div className={styles.requirements}>
            <Typography variant="body-small" className={styles.requirementsTitle}>
              ⚠️ Required Information
            </Typography>
            <ul className={styles.requirementsList}>
              {accountStatus.requirements.currently_due.map((req) => (
                <li key={req}>
                  <Typography variant="body-small">{req.replace(/_/g, ' ')}</Typography>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <div className={styles.actions}>
        {!hasAccount && (
          <Button
            variant="primary"
            onClick={handleSetupAccount}
            isDisabled={isCreatingOnboardingLink}
          >
            {isCreatingOnboardingLink ? 'Loading...' : 'Setup Bank Account'}
          </Button>
        )}

        {hasAccount && !isFullySetup && (
          <Button
            variant="primary"
            onClick={handleSetupAccount}
            isDisabled={isCreatingOnboardingLink}
          >
            {isCreatingOnboardingLink ? 'Loading...' : 'Complete Setup'}
          </Button>
        )}

        {isFullySetup && (
          <Button
            variant="secondary"
            onClick={handleUpdateBankDetails}
            isDisabled={isCreatingOnboardingLink}
          >
            {isCreatingOnboardingLink ? 'Loading...' : 'Update Bank Details'}
          </Button>
        )}

        <Button variant="ghost" onClick={loadAccountStatus}>
          Refresh Status
        </Button>
      </div>

      <div className={styles.notice}>
        <Typography variant="body-small" className={styles.noticeText}>
          🔒 Your bank details are securely stored and encrypted by Stripe. We never have direct access to your full bank account information.
        </Typography>
      </div>
    </div>
  );
};
