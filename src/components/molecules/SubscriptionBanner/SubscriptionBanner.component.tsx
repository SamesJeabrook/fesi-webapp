import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { SubscriptionBannerProps, SubscriptionTier } from './SubscriptionBanner.types';
import styles from './SubscriptionBanner.module.scss';

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  currentTier,
  dataRetentionMonths,
  isApproachingLimit = false,
  onUpgrade,
  className,
}) => {
  const router = useRouter();
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push('/merchant/subscription');
    }
  };
  
  const getTierInfo = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return {
          name: 'Free',
          icon: '🆓',
          color: 'secondary',
          nextTier: 'Professional',
          nextRetention: 12,
        };
      case 'basic':
      case 'professional':
        return {
          name: 'Professional',
          icon: '📊',
          color: 'primary',
          nextTier: 'Business',
          nextRetention: null, // Unlimited
        };
      case 'business':
        return {
          name: 'Business',
          icon: '⭐',
          color: 'success',
          nextTier: 'Enterprise',
          nextRetention: null, // Unlimited
        };
      case 'premium':
      case 'enterprise':
        return {
          name: 'Enterprise',
          icon: '💎',
          color: 'success',
          nextTier: null,
          nextRetention: null,
        };
    }
  };

  const tierInfo = getTierInfo(currentTier);
  const showUpgradePrompt = !['business', 'enterprise', 'premium'].includes(currentTier) && (isApproachingLimit || onUpgrade);

  const bannerClasses = [
    styles.subscriptionBanner,
    styles[`subscriptionBanner--${tierInfo.color}`],
    isApproachingLimit ? styles['subscriptionBanner--warning'] : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <Card variant="outlined" className={bannerClasses}>
      <div className={styles.subscriptionBanner__content}>
        <div className={styles.subscriptionBanner__info}>
          <div className={styles.subscriptionBanner__header}>
            <span className={styles.subscriptionBanner__icon}>{tierInfo.icon}</span>
            <Typography variant="heading-4" className={styles.subscriptionBanner__title}>
              {tierInfo.name} Plan
            </Typography>
          </div>
          
          <Typography variant="body-medium" className={styles.subscriptionBanner__description}>
            {isApproachingLimit ? (
              <>
                ⚠️ You're viewing data from the past <strong>{dataRetentionMonths} months</strong>.
                {tierInfo.nextTier && tierInfo.nextRetention && (
                  <> Upgrade to <strong>{tierInfo.nextTier}</strong> to access {tierInfo.nextRetention} months of history.</>
                )}
                {tierInfo.nextTier && !tierInfo.nextRetention && (
                  <> Upgrade to <strong>{tierInfo.nextTier}</strong> for unlimited history.</>
                )}
              </>
            ) : (
              <>
                Access to <strong>{dataRetentionMonths === null ? 'unlimited' : `${dataRetentionMonths} months`}</strong> of analytics data.
                {tierInfo.nextTier && tierInfo.nextRetention && (
                  <> Upgrade to unlock {tierInfo.nextRetention} months of history.</>
                )}
                {tierInfo.nextTier && !tierInfo.nextRetention && (
                  <> Upgrade for unlimited history.</>
                )}
              </>
            )}
          </Typography>
        </div>

        {showUpgradePrompt && tierInfo.nextTier && (
          <div className={styles.subscriptionBanner__action}>
            <Button
              variant={isApproachingLimit ? 'primary' : 'secondary'}
              size="md"
              onClick={handleUpgrade}
              className={styles.subscriptionBanner__upgradeButton}
            >
              🚀 Upgrade to {tierInfo.nextTier}
            </Button>
          </div>
        )}
      </div>

      {['business', 'enterprise', 'premium'].includes(currentTier) && (
        <div className={styles.subscriptionBanner__badge}>
          <Typography variant="body-small" className={styles.subscriptionBanner__badgeText}>
            ✨ Unlimited History
          </Typography>
        </div>
      )}
    </Card>
  );
};
