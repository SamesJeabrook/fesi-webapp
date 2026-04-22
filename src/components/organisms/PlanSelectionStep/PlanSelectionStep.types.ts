export interface PlanSelectionData {
  selectedTier: 'starter' | 'professional';
  hasTrialAccess?: boolean;
  isBetaUser?: boolean;
  trialEndsAt?: string;
  daysRemaining?: number;
}

export interface PlanSelectionStepProps {
  onComplete: (data: PlanSelectionData) => void;
  onBack: () => void;
  initialData?: PlanSelectionData;
  loading?: boolean;
  className?: string;
  userEmail: string; // We need this to check trial/beta status
}

export interface SubscriptionPlan {
  tier: 'starter' | 'professional';
  name: string;
  price: number;
  period: string;
  features: string[];
  limits: {
    menuItems: number | null;
    menus: number | null;
    staff: number | null;
  };
  recommended?: boolean;
}
