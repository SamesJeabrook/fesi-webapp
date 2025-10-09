'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Typography } from '@/components/atoms';
import { PublicOrderBoard } from '@/components/molecules';
import { Order } from '@/types';

interface PublicOrdersPageProps {
  params: {
    merchantId: string;
  };
}

export default function PublicOrdersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [merchantName, setMerchantName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const merchantId = params?.merchantId as string;
  const merchantSlug = searchParams?.get('merchant');

  useEffect(() => {
    const fetchPublicOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Determine the API endpoint based on available parameters
        let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/public/orders`;
        
        if (merchantId) {
          apiUrl += `?merchantId=${merchantId}`;
        } else if (merchantSlug) {
          apiUrl += `?merchantSlug=${merchantSlug}`;
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.orders || []);
        setMerchantName(data.merchantName || 'Restaurant');
      } catch (err) {
        console.error('Error fetching public orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPublicOrders, 30000);
    
    // Initial fetch
    fetchPublicOrders();

    return () => clearInterval(interval);
  }, [merchantId, merchantSlug]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        gap: '1rem'
      }}>
        <Typography variant="heading-3" style={{ color: 'var(--color-error)' }}>
          Unable to Load Orders
        </Typography>
        <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {error}
        </Typography>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-background)',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <PublicOrderBoard
        orders={orders}
        merchantName={merchantName}
        isLoading={isLoading}
      />
      
      {/* Auto-refresh indicator */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        background: 'var(--color-background-secondary)',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--color-border)',
        fontSize: '0.75rem',
        color: 'var(--color-text-secondary)'
      }}>
        Updates every 30 seconds
      </div>
    </div>
  );
}