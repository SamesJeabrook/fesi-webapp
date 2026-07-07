/**
 * useMerchant Hook
 * Custom React hook for managing merchant selection in multi-outlet scenarios
 */

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getCurrentMerchantId, setCurrentMerchantId, getAllMerchantIds, hasMultipleOutlets } from '../merchantSelection';
import { getMerchantIdFromDevToken } from '../devAuth';

export interface UseMerchantResult {
  merchantId: string | null;
  allMerchantIds: string[];
  hasMultiple: boolean;
  isLoading: boolean;
  switchMerchant: (merchantId: string) => void;
}

/**
 * Hook to get and manage the current merchant ID
 * Handles both Auth0 and dev token scenarios
 * 
 * @returns Current merchant ID and helper functions
 */
export function useMerchant(): UseMerchantResult {
  const { user, isLoading: userLoading } = useAuth0();
  const [merchantId, setMerchantIdState] = useState<string | null>(null);
  const [allMerchantIds, setAllMerchantIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      return;
    }

    // Check for dev token first
    const devMerchantId = getMerchantIdFromDevToken();
    if (devMerchantId) {
      setMerchantIdState(devMerchantId);
      setAllMerchantIds([devMerchantId]);
      setIsLoading(false);
      return;
    }

    // Get from Auth0 user
    if (user) {
      const allIds = getAllMerchantIds(user);
      setAllMerchantIds(allIds);
      
      const currentId = getCurrentMerchantId(user);
      setMerchantIdState(currentId);
    }
    
    setIsLoading(false);
  }, [user, userLoading]);

  const switchMerchant = (newMerchantId: string) => {
    if (allMerchantIds.includes(newMerchantId)) {
      setCurrentMerchantId(newMerchantId);
      setMerchantIdState(newMerchantId);
      // Reload page to refresh all data with new merchant context
      window.location.reload();
    } else {
      console.error('Cannot switch to merchant - not in user\'s merchant list');
    }
  };

  return {
    merchantId,
    allMerchantIds,
    hasMultiple: hasMultipleOutlets(user),
    isLoading,
    switchMerchant
  };
}
