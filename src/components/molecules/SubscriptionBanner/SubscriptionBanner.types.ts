export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface SubscriptionBannerProps {
  currentTier: SubscriptionTier;
  dataRetentionMonths: number;
  isApproachingLimit?: boolean;
  onUpgrade?: () => void;
  className?: string;
}
