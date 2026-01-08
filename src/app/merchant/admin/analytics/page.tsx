'use client';

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { AnalyticsPageTemplate } from '@/components/templates/AnalyticsPageTemplate';
import { RefireAnalytics } from '@/components/organisms';
import type { OverviewStats, MonthlyBreakdown } from '@/components/templates/AnalyticsPageTemplate';
import type { EventReport } from '@/components/organisms/EventReportsTable';
import { getAuthToken, getMerchantIdFromDevToken } from '@/utils/devAuth';
import api from '@/utils/api';

export default function MerchantAnalyticsPage() {
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
  const router = useRouter();

  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState<string>('');
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'basic' | 'premium'>('free');
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

  // Get merchant ID from dev token or Auth0
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

        // Get merchant ID from backend using Auth0 token
        const data = await api.get('/api/merchants/me');
        setMerchantId(data.id);
      } catch (err) {
        console.error('Error initializing merchant:', err);
        setError('Failed to load merchant profile');
      }
    };

    initializeMerchant();
  }, [isAuthenticated, authLoading, getAccessTokenSilently, router]);

  // Fetch analytics data
  useEffect(() => {
    if (!merchantId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch merchant details
        const merchantData = await api.get(`/api/merchants/${merchantId}`);
        setMerchantName(merchantData.business_name || 'Your Business');
        setSubscriptionTier(merchantData.subscription_tier || 'free');
        
        // Set data retention based on subscription tier
        const retention = merchantData.subscription_tier === 'premium' 
          ? 6 
          : merchantData.subscription_tier === 'basic' 
          ? 3 
          : 1;
        setDataRetentionMonths(retention);

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
  }, [merchantId, getAccessTokenSilently]);

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
    <>
      <AnalyticsPageTemplate
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
      />
      
      {/* Refire Analytics Section */}
      {merchantId && (
        <div style={{ padding: '2rem', background: 'var(--color-background)', borderTop: '1px solid var(--color-border)' }}>
          <RefireAnalytics merchantId={merchantId} />
        </div>
      )}
    </>
  );
}
