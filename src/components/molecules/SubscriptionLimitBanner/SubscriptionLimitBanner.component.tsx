'use client';

import React from 'react';
import { Typography, Button } from '@/components/atoms';
import { useRouter } from 'next/navigation';
import styles from './SubscriptionLimitBanner.module.scss';

export interface SubscriptionLimitBannerProps {
  /** Type of resource being limited */
  resourceType: 'menu_items' | 'menus' | 'staff';
  /** Current count of the resource */
  current: number;
  /** Maximum allowed by subscription (null = unlimited) */
  limit: number | null;
  /** Current subscription tier */
  tier?: string;
  /** Additional CSS classes */
  className?: string;
}

export const SubscriptionLimitBanner: React.FC<SubscriptionLimitBannerProps> = ({
  resourceType,
  current,
  limit,
  tier = 'starter',
  className
}) => {
  const router = useRouter();

  // If unlimited (null), don't show banner
  if (limit === null) {
    return null;
  }

  const percentage = (current / limit) * 100;
  const isAtLimit = current >= limit;
  const isApproachingLimit = percentage >= 80 && !isAtLimit;

  // Don't show banner if usage is low
  if (percentage < 80) {
    return null;
  }

  const resourceLabel = {
    menu_items: 'menu items',
    menus: 'menus',
    staff: 'staff members'
  }[resourceType];

  const getVariant = () => {
    if (isAtLimit) return 'danger';
    if (isApproachingLimit) return 'warning';
    return 'info';
  };

  const getMessage = () => {
    if (isAtLimit) {
      return `You've reached your limit of ${limit} ${resourceLabel}`;
    }
    return `You're using ${current} of ${limit} ${resourceLabel}`;
  };

  const bannerClasses = [
    styles.banner,
    styles[`banner--${getVariant()}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={bannerClasses}>
      <div className={styles.banner__content}>
        <div className={styles.banner__icon}>
          {isAtLimit ? '🚫' : '⚠️'}
        </div>
        <div className={styles.banner__text}>
          <Typography variant="body-medium" className={styles.banner__message}>
            {getMessage()}
          </Typography>
          {isAtLimit && (
            <Typography variant="body-small" className={styles.banner__hint}>
              Upgrade to Professional for unlimited {resourceLabel}
            </Typography>
          )}
        </div>
      </div>
      
      <div className={styles.banner__progress}>
        <div 
          className={styles.banner__progressBar}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {tier === 'starter' && (
        <div className={styles.banner__action}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/merchant/admin/subscription')}
          >
            Upgrade Now
          </Button>
        </div>
      )}
    </div>
  );
};

SubscriptionLimitBanner.displayName = 'SubscriptionLimitBanner';
