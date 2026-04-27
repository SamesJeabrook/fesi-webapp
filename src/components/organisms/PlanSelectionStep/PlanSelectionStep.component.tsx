import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { PlanSelectionStepProps, PlanSelectionData, SubscriptionPlan } from './PlanSelectionStep.types';
import styles from './PlanSelectionStep.module.scss';

const PLANS: SubscriptionPlan[] = [
  {
    tier: 'starter',
    name: 'Starter',
    price: 10,
    period: 'month',
    features: [
      'Up to 50 menu items',
      'Up to 3 menus',
      '1 staff account',
      '10% transaction fee (tiered caps: £3.50/£5.50/£8)',
      '3 months analytics history',
      'Event booking management',
      'Customer orders & payments',
      'Basic reporting',
    ],
    limits: {
      menuItems: 50,
      menus: 3,
      staff: 1,
    },
  },
  {
    tier: 'professional',
    name: 'Professional',
    price: 39,
    period: 'month',
    recommended: true,
    features: [
      'Unlimited menu items',
      'Unlimited menus',
      'Unlimited staff accounts',
      '8% transaction fee',
      '12 months analytics history',
      'Advanced inventory tracking',
      'Staff management & roles',
      'Advanced reporting',
      'Priority support',
    ],
    limits: {
      menuItems: null,
      menus: null,
      staff: null,
    },
  },
];

export const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({
  onComplete,
  onBack,
  initialData,
  loading = false,
  className,
  userEmail,
}) => {
  const [selectedTier, setSelectedTier] = useState<'starter' | 'professional'>(
    initialData?.selectedTier || 'starter'
  );
  const [trialInfo, setTrialInfo] = useState<{
    hasTrialAccess: boolean;
    isBetaUser: boolean;
    trialEndsAt?: string;
    daysRemaining?: number;
    subscriptionTier?: string;
  } | null>(null);
  const [isCheckingTrial, setIsCheckingTrial] = useState(true);

  useEffect(() => {
    const checkTrialAccess = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(
          `${apiUrl}/api/subscriptions/check-trial?email=${encodeURIComponent(userEmail)}`
        );

        if (response.ok) {
          const data = await response.json();
          setTrialInfo({
            hasTrialAccess: data.hasTrial,
            isBetaUser: data.isBeta,
            trialEndsAt: data.trialEndsAt,
            daysRemaining: data.daysRemaining,
            subscriptionTier: data.subscriptionTier,
          });

          // If they have a trial, pre-select the tier they were granted
          if (data.hasTrial && data.subscriptionTier) {
            setSelectedTier(data.subscriptionTier as 'starter' | 'professional');
          }
        }
      } catch (error) {
        console.error('Error checking trial access:', error);
      } finally {
        setIsCheckingTrial(false);
      }
    };

    if (userEmail) {
      checkTrialAccess();
    } else {
      setIsCheckingTrial(false);
    }
  }, [userEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: PlanSelectionData = {
      selectedTier,
      hasTrialAccess: trialInfo?.hasTrialAccess,
      isBetaUser: trialInfo?.isBetaUser,
      trialEndsAt: trialInfo?.trialEndsAt,
      daysRemaining: trialInfo?.daysRemaining,
    };

    onComplete(data);
  };

  const containerClasses = [
    styles.planSelectionStep,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.planSelectionStep__header}>
        <Typography variant="heading-2" className={styles.planSelectionStep__title}>
          Choose Your Plan
        </Typography>
        <Typography variant="body-large" className={styles.planSelectionStep__description}>
          Select the plan that best fits your business needs
        </Typography>
      </div>

      {/* Trial/Beta Banner */}
      {!isCheckingTrial && trialInfo?.hasTrialAccess && (
        <div className={styles.planSelectionStep__trialBanner}>
          <div className={styles.planSelectionStep__trialIcon}>🎟️</div>
          <div className={styles.planSelectionStep__trialContent}>
            <Typography variant="body-medium" className={styles.planSelectionStep__trialTitle}>
              {trialInfo.isBetaUser ? 'Beta Access Granted!' : 'Free Trial Available!'}
            </Typography>
            <Typography variant="body-small" className={styles.planSelectionStep__trialText}>
              {trialInfo.isBetaUser
                ? `You've been granted beta access to the ${trialInfo.subscriptionTier} plan. Your account will remain active during the beta period.`
                : `You have a ${trialInfo.daysRemaining}-day free trial on the ${trialInfo.subscriptionTier} plan. Your trial will start when you create your account.`}
            </Typography>
            {!trialInfo.isBetaUser && (
              <Typography variant="body-small" className={styles.planSelectionStep__trialWarning}>
                ⚠️ After your trial ends, your subscription will be paused until you select a paid plan.
              </Typography>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isCheckingTrial && (
        <div className={styles.planSelectionStep__loading}>
          <Typography variant="body-medium">Checking for available offers...</Typography>
        </div>
      )}

      {/* Plan Cards */}
      {!isCheckingTrial && (
        <form className={styles.planSelectionStep__form} onSubmit={handleSubmit}>
          <div className={styles.planSelectionStep__plans}>
            {PLANS.map((plan) => {
              const isSelected = selectedTier === plan.tier;
              const hasTrialForThisPlan =
                trialInfo?.hasTrialAccess &&
                trialInfo?.subscriptionTier === plan.tier;

              return (
                <div
                  key={plan.tier}
                  className={`${styles.planSelectionStep__planCard} ${
                    isSelected ? styles['planSelectionStep__planCard--selected'] : ''
                  } ${plan.recommended ? styles['planSelectionStep__planCard--recommended'] : ''}`}
                  onClick={() => setSelectedTier(plan.tier)}
                >
                  {/* Recommended Badge */}
                  {plan.recommended && (
                    <div className={styles.planSelectionStep__badge}>
                      Recommended
                    </div>
                  )}

                  {/* Trial Badge */}
                  {hasTrialForThisPlan && (
                    <div className={styles.planSelectionStep__trialBadge}>
                      {trialInfo?.isBetaUser ? '🌟 Beta Access' : '🎟️ Trial Available'}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className={styles.planSelectionStep__planHeader}>
                    <Typography variant="heading-3" className={styles.planSelectionStep__planName}>
                      {plan.name}
                    </Typography>
                    <div className={styles.planSelectionStep__planPrice}>
                      <span className={styles.planSelectionStep__planPriceAmount}>
                        £{plan.price}
                      </span>
                      <span className={styles.planSelectionStep__planPricePeriod}>
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className={styles.planSelectionStep__featuresList}>
                    {plan.features.map((feature, index) => (
                      <li key={index} className={styles.planSelectionStep__feature}>
                        <span className={styles.planSelectionStep__featureIcon}>✓</span>
                        <span className={styles.planSelectionStep__featureText}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <div className={styles.planSelectionStep__selectButton}>
                    <Button
                      variant={isSelected ? 'primary' : 'secondary'}
                      size="md"
                      fullWidth
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTier(plan.tier);
                      }}
                    >
                      {isSelected ? '✓ Selected' : 'Select Plan'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className={styles.planSelectionStep__actions}>
            <Button
              variant="secondary"
              size="lg"
              onClick={onBack}
              isDisabled={loading}
              type="button"
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              isDisabled={loading || !selectedTier}
            >
              {loading ? 'Processing...' : 'Continue'}
            </Button>
          </div>

          {/* Plan Change Notice */}
          <div className={styles.planSelectionStep__notice}>
            <Typography variant="body-small" className={styles.planSelectionStep__noticeText}>
              💡 You can upgrade or downgrade your plan at any time from your account settings.
            </Typography>
          </div>
        </form>
      )}
    </div>
  );
};
