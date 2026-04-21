'use client';

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { AnalyticsPageTemplate } from '@/components/templates/AnalyticsPageTemplate';
import type { OverviewStats, MonthlyBreakdown } from '@/components/templates/AnalyticsPageTemplate';
import type { EventReport } from '@/components/organisms/EventReportsTable';
import { getAuthToken, getMerchantIdFromDevToken } from '@/utils/devAuth';
import { useSubscription } from '@/hooks/useSubscription';
import api from '@/utils/api';

export default function MerchantAnalyticsPage() {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
  const router = useRouter();
  const { getLimit, subscription, loading: subscriptionLoading } = useSubscription();

  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState<string>('');
  const [operatingMode, setOperatingMode] = useState<'event_based' | 'static'>('event_based');
  const [subscriptionTier, setSubscriptionTier] = useState<'starter' | 'basic' | 'premium'>('starter');
  const [dataRetentionMonths, setDataRetentionMonths] = useState<number>(1);
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalEvents: 0,
    averageOrderValue: 0,
  });
  const [events, setEvents] = useState<EventReport[]>([]);
  const [monthlyBreakdowns, setMonthlyBreakdowns] = useState<MonthlyBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get merchant ID from dev token, Auth0 token, or API
  useEffect(() => {
    const initializeMerchant = async () => {
      try {
        // Check for dev token first
        const devMerchantId = getMerchantIdFromDevToken();
        if (devMerchantId) {
          setMerchantId(devMerchantId);
          return;
        }

        // Otherwise wait for Auth0
        if (authLoading) return;
        
        if (!isAuthenticated) {
          router.push('/merchant/login');
          return;
        }

        // Try Auth0 user's merchant_ids
        const merchantIds = user?.['https://fesi.app/merchant_ids'];
        if (merchantIds && merchantIds.length > 0) {
          setMerchantId(merchantIds[0]);
          return;
        }

        // Get merchant ID from backend using Auth0 token
        const data = await api.get('/api/merchants/me');
        setMerchantId(data.id);
      } catch (err) {
        console.error('Error initializing merchant:', err);
        setError('Failed to load merchant profile');
      }
    };

    initializeMerchant();
  }, [user, isAuthenticated, authLoading, getAccessTokenSilently, router]);

  // Fetch analytics data
  useEffect(() => {
    if (!merchantId || subscriptionLoading) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch merchant details
        const merchantResponse = await api.get(`/api/merchants/${merchantId}`);
        // Handle wrapped response (API returns { success, data })
        const merchantData = merchantResponse.data || merchantResponse;
        setMerchantName(merchantData.business_name || 'Your Business');
        setOperatingMode(merchantData.operating_mode || 'event_based');
        setSubscriptionTier(merchantData.subscription_tier || 'starter');
        
        // Set data retention based on subscription limit
        const analyticsMonths = getLimit('analytics_history_months') || 3;
        console.log('Subscription data:', subscription);
        console.log('Analytics history months from subscription:', analyticsMonths);
        setDataRetentionMonths(analyticsMonths);

        // Fetch analytics data from backend
        const analyticsData = await api.get(`/api/analytics/merchant/${merchantId}`);
        setOverviewStats(analyticsData.overview || overviewStats);
        setEvents(analyticsData.events || []);
        setMonthlyBreakdowns(analyticsData.monthlyBreakdowns || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [merchantId, subscriptionLoading, getLimit, subscription]);

  const handleEventClick = (eventId: string) => {
    router.push(`/merchant/admin/events/${eventId}/analytics`);
  };

  const handleUpgrade = () => {
    router.push('/merchant/admin/subscription');
  };

  if (authLoading || loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <AnalyticsPageTemplate
      merchantId={merchantId!}
      merchantName={merchantName}
      overviewStats={overviewStats}
      recentEvents={events}
      monthlyBreakdowns={monthlyBreakdowns}
      subscriptionTier={subscriptionTier}
      dataRetentionMonths={dataRetentionMonths}
      isApproachingLimit={events.length > 0}
      loading={loading}
      onEventClick={handleEventClick}
      onUpgrade={handleUpgrade}
      backLink="/merchant/admin"
      operatingMode={operatingMode}
    />
  );
}
