'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import classNames from 'classnames';
import { Typography, Input } from '@/components/atoms';
import { Button } from '@/components/atoms/Button/Button.component';
import { MerchantGrid } from '@/components/molecules/MerchantGrid';
import api from '@/utils/api';
import type { MerchantSelectorProps } from './MerchantSelector.types';
import styles from './MerchantSelector.module.scss';

interface Merchant {
  id: string;
  name: string;
  username: string;
  phone: string;
  status: string;
  created_at: string;
}

export const MerchantSelector: React.FC<MerchantSelectorProps> = ({
  onMerchantSelect,
  selectedMerchant,
  viewMode = 'grid',
  gridColumns = 3,
  className,
  'data-testid': dataTestId,
}) => {
  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const selectorClasses = classNames(styles.merchantSelector, className);

  useEffect(() => {
    if (isAuthenticated && !authLoading && !hasInitialized && !loading) {
      console.log('🚀 Initializing merchant fetch...');
      setHasInitialized(true);
      fetchMerchants();
    }
  }, [isAuthenticated, authLoading, hasInitialized, loading]);

  const fetchMerchants = async () => {
    if (!isAuthenticated || loading) {
      console.log('⏭️ Skipping fetch - not authenticated or already loading');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Getting access token for merchants API...');
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
      
      console.log('🎫 Token received for merchants API');
      
      if (!token) {
        setError('Failed to get authentication token');
        return;
      }

      console.log('📡 Calling merchants API...');
      const data = await api.get('/merchants');

      console.log('📦 Merchants data received:', data);
      
      if (!data || !data.data) {
        console.log('⚠️ No merchants array in response');
        setMerchants([]);
        return;
      }
      
      const merchantsWithName = (data.data || []).map((merchant: any) => ({
        ...merchant,
        name: merchant.name
      }));
      
      console.log('✅ Setting merchants:', merchantsWithName.length, 'merchants');
      setMerchants(merchantsWithName);
    } catch (error) {
      console.error('❌ Error fetching merchants:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch merchants');
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setHasInitialized(false);
    setMerchants([]);
    setError(null);
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={selectorClasses} data-testid={dataTestId}>
      <div className={styles.merchantSelector__header}>
        <Typography variant="heading-2">
          Select Merchant
        </Typography>
        <Typography variant="body-medium" className={styles.merchantSelector__subtitle}>
          Choose a merchant to manage their orders and settings
        </Typography>
      </div>

      <div className={styles.merchantSelector__controls}>
        <div className={styles.merchantSelector__search}>
          <Input
            id="merchant-search"
            type="text"
            placeholder="Search merchants by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.merchantSelector__searchInput}
          />
        </div>
        
        <div className={styles.merchantSelector__actions}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isDisabled={loading}
          >
            🔄 Refresh
          </Button>
        </div>
      </div>

      <div className={styles.merchantSelector__content}>
        <MerchantGrid
          merchants={filteredMerchants}
          selectedMerchantId={selectedMerchant?.id}
          onMerchantSelect={onMerchantSelect}
          isLoading={loading}
          error={error}
          emptyMessage={
            searchTerm 
              ? `No merchants found matching "${searchTerm}"` 
              : 'No merchants available'
          }
          columns={gridColumns}
        />
      </div>

      {merchants.length > 0 && (
        <div className={styles.merchantSelector__footer}>
          <Typography variant="body-small" className={styles.merchantSelector__count}>
            Showing {filteredMerchants.length} of {merchants.length} merchants
          </Typography>
        </div>
      )}
    </div>
  );
};