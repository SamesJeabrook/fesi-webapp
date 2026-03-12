'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography } from '@/components/atoms';
import { DisplayMenuSection } from '@/components/organisms/DisplayMenuSection';
import { DisplayOrdersSection } from '@/components/organisms/DisplayOrdersSection';
import api from '@/utils/api';
import styles from './display.module.scss';

interface MerchantData {
  merchant: {
    id: string;
    name: string;
    description?: string;
    currency: string;
  };
  menu: Array<{
    name: string;
    display_order: number;
    items: Array<{
      id: string;
      title: string; // Changed from 'name' to 'title' to match DisplayMenuSection
      description: string;
      base_price: number;
      category_name: string;
      image_url?: string;
    }>;
  }>;
}

export default function CustomerDisplayPage() {
  const params = useParams();
  const merchantId = params?.merchantId as string;
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load merchant data once on mount
  useEffect(() => {
    if (merchantId) {
      loadMerchantData();
    }
  }, [merchantId]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  const handleScreenClick = () => {
    if (isFullscreen) {
      exitFullscreen();
    }
  };

  const loadMerchantData = async () => {
    try {
      const response = await api.get(`/api/menu/merchant/${merchantId}`);
      if (response.success && response.data) {
        // Transform API response to match component interface
        // Handle both 'name' and 'title' fields with fallbacks
        const transformedData = {
          ...response.data,
          menu: response.data.menu.map((category: any) => ({
            ...category,
            items: category.items.map((item: any) => ({
              ...item,
              title: item.title || item.name || 'Untitled Item',
            }))
          }))
        };
        setMerchantData(transformedData);
      }
    } catch (error) {
      console.error('Failed to load merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Typography variant="heading-3">Loading...</Typography>
      </div>
    );
  }

  if (!merchantData) {
    return (
      <div className={styles.loading}>
        <Typography variant="heading-3">Merchant not found</Typography>
      </div>
    );
  }

  return (
    <div className={styles.displayPage} onClick={handleScreenClick}>
      {/* Fullscreen Button - only show when not in fullscreen */}
      {!isFullscreen && (
        <button 
          className={styles.fullscreenButton}
          onClick={(e) => {
            e.stopPropagation();
            enterFullscreen();
          }}
          aria-label="Enter fullscreen mode"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          Fullscreen
        </button>
      )}

      {/* Menu Section */}
      <DisplayMenuSection merchantData={merchantData} merchantId={merchantId} />

      {/* Orders Section */}
      <DisplayOrdersSection merchantId={merchantId} />
    </div>
  );
}
