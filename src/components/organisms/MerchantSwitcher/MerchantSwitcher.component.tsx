import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import api from '@/utils/api';
import styles from './MerchantSwitcher.module.scss';

interface Merchant {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  operating_mode?: string;
}

interface SubscriptionInfo {
  current_outlets: number;
  max_outlets: number;
  additional_outlets?: number;
  total_allowed?: number | null;
  can_add_more: boolean;
  addon_price?: number;
  message?: string;
  is_beta_user?: boolean;
  is_trial?: boolean;
}

interface MerchantSwitcherProps {
  onMerchantChange?: (merchantId: string) => void;
}

export const MerchantSwitcher: React.FC<MerchantSwitcherProps> = ({ onMerchantChange }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth0();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [currentMerchantId, setCurrentMerchantId] = useState<string>('');
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMerchants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/merchants/outlets/all');
      
      setMerchants(response.merchants || []);
      setSubscription(response.subscription || null);
      
      // Set current merchant from localStorage or use first
      const savedMerchantId = localStorage.getItem('currentMerchantId');
      const validMerchants = response.merchants || [];
      
      if (savedMerchantId && validMerchants.find((m: Merchant) => m.id === savedMerchantId)) {
        setCurrentMerchantId(savedMerchantId);
      } else if (validMerchants.length > 0) {
        const firstMerchantId = validMerchants[0].id;
        setCurrentMerchantId(firstMerchantId);
        localStorage.setItem('currentMerchantId', firstMerchantId);
      }
    } catch (error) {
      console.error('Failed to load merchants:', error);
      // Set empty state on error so component can hide itself
      setMerchants([]);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadMerchants();
    } else if (!isAuthenticated) {
      // If not authenticated, stop loading
      setLoading(false);
    }
  }, [isAuthenticated, user, loadMerchants]);

  const handleMerchantChange = (merchantId: string) => {
    setCurrentMerchantId(merchantId);
    localStorage.setItem('currentMerchantId', merchantId);
    
    if (onMerchantChange) {
      onMerchantChange(merchantId);
    }
    
    // Reload the page to refresh all data with new merchant context
    window.location.reload();
  };

  const handleAddOutlet = () => {
    router.push('/merchant/outlets/add');
  };

  const handleManageOutlets = () => {
    router.push('/merchant/admin/subscription#outlets');
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  // Hide component if there's an error, no merchants, or only one merchant and can't add more
  if (!merchants || merchants.length === 0 || (merchants.length === 1 && !subscription?.can_add_more)) {
    return null;
  }

  return (
    <div className={styles.merchantSwitcher}>
      <div className={styles.merchantSwitcher__selector}>
        <label htmlFor="merchant-select" className={styles.merchantSwitcher__label}>
          <Typography variant="body-small">Current Outlet:</Typography>
        </label>
        
        <select
          id="merchant-select"
          value={currentMerchantId}
          onChange={(e) => handleMerchantChange(e.target.value)}
          className={styles.merchantSwitcher__select}
        >
          {merchants.map((merchant) => (
            <option key={merchant.id} value={merchant.id}>
              {merchant.name}
            </option>
          ))}
        </select>
      </div>

      {subscription?.can_add_more && (
        <Button
          onClick={handleAddOutlet}
          variant="secondary"
          size="sm"
          className={styles.merchantSwitcher__addButton}
        >
          + Add Outlet
          {subscription.addon_price && !subscription.is_beta_user && !subscription.is_trial && (
            <span className={styles.merchantSwitcher__price}> (£{subscription.addon_price}/mo)</span>
          )}
          {subscription.is_beta_user && (
            <span className={styles.merchantSwitcher__badge}> BETA</span>
          )}
        </Button>
      )}

      {!subscription?.can_add_more && merchants.length > 1 && (
        <button
          onClick={handleManageOutlets}
          className={styles.merchantSwitcher__upgradeLink}
        >
          <Typography variant="body-small">
            Upgrade for more outlets
          </Typography>
        </button>
      )}

      {subscription && merchants.length > 1 && (
        <div className={styles.merchantSwitcher__info}>
          <Typography variant="body-small">
            {subscription.current_outlets} of {
              subscription.is_beta_user 
                ? '∞' 
                : (subscription.total_allowed || subscription.max_outlets)
            } outlets
          </Typography>
        </div>
      )}
    </div>
  );
};
