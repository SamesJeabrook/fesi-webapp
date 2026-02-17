export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'business' | 'premium' | 'enterprise';

export interface SubscriptionBannerProps {
  currentTier: SubscriptionTier;
  dataRetentionMonths: number;
  isApproachingLimit?: boolean;
  onUpgrade?: () => void;
  className?: string;
}
