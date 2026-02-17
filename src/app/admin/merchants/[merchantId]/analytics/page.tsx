'use client';

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, useParams } from 'next/navigation';
import { AnalyticsPageTemplate } from '@/components/templates/AnalyticsPageTemplate';
import type { OverviewStats, MonthlyBreakdown } from '@/components/templates/AnalyticsPageTemplate';
import type { EventReport } from '@/components/organisms/EventReportsTable';

export default function AdminMerchantAnalyticsPage() {
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
  const router = useRouter();
  const params = useParams();
  const merchantId = params?.merchantId as string;

  const [merchantName, setMerchantName] = useState<string>('');
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

  // Check authentication
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch analytics data
  useEffect(() => {
    if (!merchantId || !isAuthenticated || authLoading) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();

        // Fetch merchant details
        const merchantResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (merchantResponse.ok) {
          const merchantData = await merchantResponse.json();
          setMerchantName(merchantData.business_name || 'Unknown Business');
        }

        // Fetch analytics data from backend (admin has unrestricted access)
        const analyticsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/merchant/${merchantId}?admin=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const analyticsData = await analyticsResponse.json();
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
  }, [merchantId, isAuthenticated, authLoading, getAccessTokenSilently]);

  const handleEventClick = (eventId: string) => {
    router.push(`/admin/merchants/${merchantId}/events/${eventId}/analytics`);
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
      merchantId={merchantId}
      merchantName={merchantName}
      overviewStats={overviewStats}
      recentEvents={events}
      monthlyBreakdowns={monthlyBreakdowns}
      loading={loading}
      onEventClick={handleEventClick}
      backLink={`/admin/merchants/${merchantId}`}
    />
  );
}
