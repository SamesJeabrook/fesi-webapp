import React, { useState } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { PaymentSetupStepProps, PaymentSetupData } from './PaymentSetupStep.types';
import styles from './PaymentSetupStep.module.scss';

export const PaymentSetupStep: React.FC<PaymentSetupStepProps> = ({
  onComplete,
  onBack,
  initialData,
  loading = false,
  className,
  merchantId,
}) => {
  const [formData, setFormData] = useState<PaymentSetupData>({
    stripeAccountId: initialData?.stripeAccountId,
    accountStatus: initialData?.accountStatus,
    bankAccountLast4: initialData?.bankAccountLast4,
    acceptedTerms: initialData?.acceptedTerms || false,
    agreedToPaymentProcessing: initialData?.agreedToPaymentProcessing || false,
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isConnecting, setIsConnecting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!formData.stripeAccountId) {
      newErrors.stripe = 'Please connect your Stripe account to continue';
    }

    if (formData.accountStatus !== 'active') {
      newErrors.stripeStatus = 'Your Stripe account must be fully verified';
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the terms and conditions';
    }

    if (!formData.agreedToPaymentProcessing) {
      newErrors.agreedToPaymentProcessing = 'You must agree to payment processing terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStripeConnect = async () => {
    setIsConnecting(true);

    try {
      if (!merchantId) {
        throw new Error('Merchant ID is required');
      }

      // Call the real Stripe onboarding API
      const response = await fetch(`/api/payments/merchant/${merchantId}/stripe-onboarding`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Adjust based on your auth implementation
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Stripe account');
      }

      const data = await response.json();

      if (data.success && data.accountLinkUrl) {
        // Store the account ID temporarily
        setFormData(prev => ({
          ...prev,
          stripeAccountId: data.accountId,
          accountStatus: 'pending'
        }));

        if (errors.stripe) {
          setErrors(prev => ({ ...prev, stripe: undefined }));
        }

        // Redirect to Stripe Connect onboarding
        window.location.href = data.accountLinkUrl;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Stripe Connect error:', error);
      setErrors(prev => ({ 
        ...prev, 
        stripe: error instanceof Error ? error.message : 'Failed to connect to Stripe. Please try again.' 
      }));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onComplete(formData);
  };

  const containerClasses = [
    styles.paymentSetupStep,
    className || ''
  ].filter(Boolean).join(' ');

  const isStripeConnected = !!formData.stripeAccountId;
  const isStripeActive = formData.accountStatus === 'active';
  const canProceed = isStripeConnected && isStripeActive && formData.acceptedTerms && formData.agreedToPaymentProcessing;

  return (
    <div className={containerClasses}>
      <div className={styles.paymentSetupStep__header}>
        <Typography variant="heading-2" className={styles.paymentSetupStep__title}>
          Payment Setup
        </Typography>
        <Typography variant="body-large" className={styles.paymentSetupStep__description}>
          Connect your bank account to receive payments from customers
        </Typography>
      </div>

      <form className={styles.paymentSetupStep__form} onSubmit={handleSubmit}>
        {/* Info Box */}
        <div className={styles.paymentSetupStep__infoBox}>
          <span className={styles.paymentSetupStep__infoIcon}>ℹ️</span>
          <div className={styles.paymentSetupStep__infoText}>
            <strong>Secure Payment Processing with Stripe:</strong>
            <ul>
              <li>Industry-leading security and fraud protection</li>
              <li>Automatic payouts to your bank account</li>
              <li>Support for all major payment methods</li>
              <li>Detailed transaction reporting and analytics</li>
            </ul>
          </div>
        </div>

        {/* Stripe Connection Section */}
        <div className={styles.paymentSetupStep__section}>
          <h3 className={styles.paymentSetupStep__sectionTitle}>Connect Your Account</h3>
          <p className={styles.paymentSetupStep__sectionDescription}>
            Fesi uses Stripe to securely process payments and transfer funds to your bank account.
          </p>

          {!isStripeConnected ? (
            <>
              <div className={styles.paymentSetupStep__stripeCard}>
                <div className={styles.paymentSetupStep__stripeLogo}>stripe</div>
                <div className={styles.paymentSetupStep__stripeText}>
                  Connect with Stripe to start accepting payments. You'll be redirected to Stripe to complete your account setup securely.
                </div>
                
                <div className={styles.paymentSetupStep__features}>
                  <div className={styles.paymentSetupStep__feature}>
                    <span className={styles.paymentSetupStep__featureIcon}>✓</span>
                    Secure & PCI Compliant
                  </div>
                  <div className={styles.paymentSetupStep__feature}>
                    <span className={styles.paymentSetupStep__featureIcon}>✓</span>
                    Fast Payouts
                  </div>
                  <div className={styles.paymentSetupStep__feature}>
                    <span className={styles.paymentSetupStep__featureIcon}>✓</span>
                    Low Transaction Fees
                  </div>
                  <div className={styles.paymentSetupStep__feature}>
                    <span className={styles.paymentSetupStep__featureIcon}>✓</span>
                    24/7 Support
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.paymentSetupStep__stripeButton}
                  onClick={handleStripeConnect}
                  disabled={loading || isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <span className={styles.paymentSetupStep__spinner}></span>
                      {' '}Connecting...
                    </>
                  ) : (
                    'Connect with Stripe'
                  )}
                </button>
              </div>
              {errors.stripe && (
                <span className={styles.paymentSetupStep__error}>⚠️ {errors.stripe}</span>
              )}
            </>
          ) : (
            <>
              {/* Connected Status */}
              <div className={`${styles.paymentSetupStep__statusCard} ${
                isStripeActive 
                  ? styles['paymentSetupStep__statusCard--success']
                  : styles['paymentSetupStep__statusCard--warning']
              }`}>
                <span className={styles.paymentSetupStep__statusIcon}>
                  {isStripeActive ? '✓' : '⏳'}
                </span>
                <div className={styles.paymentSetupStep__statusContent}>
                  <h4 className={styles.paymentSetupStep__statusTitle}>
                    {isStripeActive ? 'Account Connected' : 'Account Pending'}
                  </h4>
                  <p className={styles.paymentSetupStep__statusText}>
                    {isStripeActive 
                      ? 'Your Stripe account is active and ready to accept payments'
                      : 'Complete your Stripe verification to start accepting payments'
                    }
                  </p>
                </div>
              </div>

              {/* Account Details */}
              {isStripeActive && (
                <div className={styles.paymentSetupStep__accountDetails}>
                  <div className={styles.paymentSetupStep__detailRow}>
                    <span className={styles.paymentSetupStep__detailLabel}>Status</span>
                    <span className={styles.paymentSetupStep__detailValue}>
                      ✓ Verified
                    </span>
                  </div>
                  <div className={styles.paymentSetupStep__detailRow}>
                    <span className={styles.paymentSetupStep__detailLabel}>Bank Account</span>
                    <span className={styles.paymentSetupStep__detailValue}>
                      ••••{formData.bankAccountLast4}
                    </span>
                  </div>
                  <div className={styles.paymentSetupStep__detailRow}>
                    <span className={styles.paymentSetupStep__detailLabel}>Payout Schedule</span>
                    <span className={styles.paymentSetupStep__detailValue}>
                      Daily (2 business days)
                    </span>
                  </div>
                </div>
              )}

              {errors.stripeStatus && (
                <span className={styles.paymentSetupStep__error}>⚠️ {errors.stripeStatus}</span>
              )}
            </>
          )}
        </div>

        {/* Terms & Agreements Section */}
        <div className={styles.paymentSetupStep__section}>
          <h3 className={styles.paymentSetupStep__sectionTitle}>Terms & Agreements</h3>

          <div className={`${styles.paymentSetupStep__checkbox} ${
            errors.acceptedTerms ? styles['paymentSetupStep__checkbox--error'] : ''
          }`}>
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptedTerms}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, acceptedTerms: e.target.checked }));
                if (errors.acceptedTerms) {
                  setErrors(prev => ({ ...prev, acceptedTerms: undefined }));
                }
              }}
              disabled={loading}
            />
            <label htmlFor="acceptTerms">
              I accept the <a href="/merchant/terms" target="_blank" rel="noopener noreferrer"><strong>Fesi Merchant Terms and Conditions</strong></a> and agree to comply with all platform policies including refund handling, food safety standards, and customer service requirements.
            </label>
          </div>
          {errors.acceptedTerms && (
            <span className={styles.paymentSetupStep__error}>⚠️ {errors.acceptedTerms}</span>
          )}

          <div className={`${styles.paymentSetupStep__checkbox} ${
            errors.agreedToPaymentProcessing ? styles['paymentSetupStep__checkbox--error'] : ''
          }`}>
            <input
              type="checkbox"
              id="agreePayment"
              checked={formData.agreedToPaymentProcessing}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, agreedToPaymentProcessing: e.target.checked }));
                if (errors.agreedToPaymentProcessing) {
                  setErrors(prev => ({ ...prev, agreedToPaymentProcessing: undefined }));
                }
              }}
              disabled={loading}
            />
            <label htmlFor="agreePayment">
              I understand that Fesi will process payments on my behalf and that a <strong>2.9% + £0.20 transaction fee</strong> will be deducted from each order. I agree to the <strong>Stripe Connected Account Agreement</strong>.
            </label>
          </div>
          {errors.agreedToPaymentProcessing && (
            <span className={styles.paymentSetupStep__error}>⚠️ {errors.agreedToPaymentProcessing}</span>
          )}

          <span className={styles.paymentSetupStep__helpText}>
            By checking these boxes, you confirm that you have read, understood, and agree to be bound by these terms. You can review the full terms and conditions at any time from your merchant dashboard.
          </span>
        </div>

        {/* Action Buttons */}
        <div className={styles.paymentSetupStep__actions}>
          <button
            type="button"
            className={`${styles.paymentSetupStep__button} ${styles['paymentSetupStep__button--secondary']}`}
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className={`${styles.paymentSetupStep__button} ${styles['paymentSetupStep__button--primary']}`}
            disabled={loading || !canProceed}
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
};
