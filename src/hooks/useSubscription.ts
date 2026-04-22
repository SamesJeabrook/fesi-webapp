import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';

interface SubscriptionFeatures {
  events: boolean;
  online_ordering: boolean;
  basic_analytics: boolean;
  table_service: boolean;
  staff_management: boolean;
  reservations: boolean;
  inventory_management: boolean;
  pos_system: boolean;
  tipping: boolean;
  custom_branding: boolean;
  priority_support: boolean;
  analytics_export: boolean;
  advanced_reporting: boolean;
  api_access: boolean;
  webhook_notifications: boolean;
}

interface SubscriptionLimits {
  staff_accounts?: number | null;
  max_menu_items?: number | null;
  menu_items?: number | null; // Alias for max_menu_items
  max_menus?: number | null;
  max_staff_members?: number | null;
  analytics_history_months?: number | null;
  tables?: number | null;
  monthly_orders?: number | null;
  has_inventory_tracking?: boolean;
}

interface Subscription {
  subscription_tier: string;
  subscription_status: string;
  subscription_started_at: string;
  subscription_ends_at: string | null;
  plan_name: string;
  price_monthly: number;
  transaction_fee_percentage: number;
  features: SubscriptionFeatures;
  feature_descriptions?: string[];
  limits: SubscriptionLimits;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/subscriptions/current');

      if (data?.subscription) {
        setSubscription(data.subscription);
        setError(null);
      } else {
        // No subscription data
        setSubscription(null);
      }
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      // If it's a 401, user is not authenticated - that's okay
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setSubscription(null);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const hasFeature = useCallback((feature: keyof SubscriptionFeatures): boolean => {
    return subscription?.features?.[feature] ?? false;
  }, [subscription]);

  const getLimit = useCallback((limit: keyof SubscriptionLimits): number | null => {
    const value = subscription?.limits?.[limit];
    // Filter out boolean values and only return numbers or null
    if (typeof value === 'boolean') return null;
    return value ?? null;
  }, [subscription]);

  const isWithinLimit = useCallback((limit: keyof SubscriptionLimits, currentCount: number): boolean => {
    const limitValue = getLimit(limit);
    if (limitValue === null) return true; // Unlimited
    return currentCount < limitValue;
  }, [getLimit]);

  const canUpgrade = useCallback((): boolean => {
    const tier = subscription?.subscription_tier;
    return tier === 'starter' || tier === 'professional' || tier === 'business';
  }, [subscription]);

  const getTierName = useCallback((): string => {
    return subscription?.plan_name || 'Starter';
  }, [subscription]);

  const getTransactionFee = useCallback((): number => {
    return subscription?.transaction_fee_percentage || 10;
  }, [subscription]);

  const requiresUpgrade = useCallback((feature: keyof SubscriptionFeatures): boolean => {
    return !hasFeature(feature);
  }, [hasFeature]);

  return {
    subscription,
    loading,
    error,
    refresh: fetchSubscription,
    // Feature checks
    hasFeature,
    requiresUpgrade,
    // Limit checks
    getLimit,
    isWithinLimit,
    // Tier info
    canUpgrade,
    getTierName,
    getTransactionFee
  };
}
