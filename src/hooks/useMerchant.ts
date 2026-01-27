import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getMerchantIdFromDevToken, getAuthToken } from '@/utils/devAuth';
import api from '@/utils/api';

interface Merchant {
  id: string;
  business_name: string;
  operating_mode?: 'event_based' | 'static';
  is_currently_open?: boolean;
  has_table_service?: boolean;
  table_count?: number;
  static_location?: any;
  permanent_event_id?: string;
  reservation_enabled?: boolean;
  min_reservation_duration?: number;
  max_reservation_duration?: number;
  min_guests_per_reservation?: number;
  max_guests_per_reservation?: number;
  reservation_interval?: number;
  advance_booking_days?: number;
  deposit_required?: boolean;
  deposit_percentage?: number;
  auto_confirm_reservations?: boolean;
  allow_multiple_tables?: boolean;
  require_staff_login?: boolean;
}

export const useMerchant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setIsLoading(true);
        
        // Use /me endpoint which works for both dev tokens and Auth0
        const response = await api.get('/api/merchants/me');
        const merchantData = response.data || response;
        
        setMerchantId(merchantData.id);
        setMerchant(merchantData);
      } catch (err) {
        console.error('Error fetching merchant:', err);
        setError(err instanceof Error ? err.message : 'Failed to load merchant');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantData();
  }, []);

  const refetchMerchant = async () => {
    try {
      const response = await api.get('/api/merchants/me');
      const merchantData = response.data || response;
      setMerchantId(merchantData.id);
      setMerchant(merchantData);
    } catch (err) {
      console.error('Error refetching merchant:', err);
    }
  };

  return {
    merchant,
    merchantId,
    isLoading,
    error,
    refetchMerchant,
  };
};
