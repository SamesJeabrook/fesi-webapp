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
        
        // Check for dev token first
        const devMerchantId = getMerchantIdFromDevToken();
        if (devMerchantId) {
          setMerchantId(devMerchantId);
          await fetchMerchantDetails(devMerchantId, getAuthToken());
          return;
        }

        // Get Auth0 token and user
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (response.ok) {
            const user = await response.json();
            if (user.merchant_id) {
              setMerchantId(user.merchant_id);
              await fetchMerchantDetails(user.merchant_id, token);
            } else {
              throw new Error('No merchant ID found for user');
            }
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (authError) {
          console.error('Auth error:', authError);
          throw new Error('Authentication failed');
        }
      } catch (err) {
        console.error('Error fetching merchant:', err);
        setError(err instanceof Error ? err.message : 'Failed to load merchant');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMerchantDetails = async (id: string, token: string) => {
      const response = await api.get(`/api/merchants/${id}`);
      setMerchant(response.data || response.merchant || response);
    };

    fetchMerchantData();
  }, [getAccessTokenSilently]);

  const refetchMerchant = async () => {
    if (!merchantId) return;
    
    try {
      const response = await api.get(`/api/merchants/${merchantId}`);
      setMerchant(response.data || response.merchant || response);
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
