'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { EventAnalyticsPageTemplate } from '@/components/templates/EventAnalyticsPageTemplate';
import { getAuthToken } from '@/utils/devAuth';

interface EventAnalytics {
  event: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isOpen: boolean;
  };
  stats: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  topItems: Array<{
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
}

export default function AdminEventAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [analyticsData, setAnalyticsData] = useState<EventAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const merchantId = params?.merchantId as string;
  const eventId = params?.eventId as string;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken(getAccessTokenSilently);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/event/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event analytics');
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching event analytics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId, getAccessTokenSilently]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading event analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '1rem'
      }}>
        <h2>Error Loading Analytics</h2>
        <p>{error}</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <EventAnalyticsPageTemplate
      eventName={analyticsData.event.name}
      startDate={analyticsData.event.startDate}
      endDate={analyticsData.event.endDate}
      isOpen={analyticsData.event.isOpen}
      stats={analyticsData.stats}
      topItems={analyticsData.topItems}
      hourlyBreakdown={analyticsData.hourlyBreakdown}
      backLink={`/admin/merchants/${merchantId}/analytics`}
    />
  );
}
