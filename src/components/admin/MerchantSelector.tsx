import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms';
import { Button } from '@/components/atoms/Button/Button.component';

interface Merchant {
  id: string;
  name: string;
  username: string;
  phone: string;
  status: string;
  created_at: string;
}

interface MerchantSelectorProps {
  onMerchantSelect: (merchant: Merchant) => void;
  selectedMerchant?: Merchant | null;
}

export default function MerchantSelector({ onMerchantSelect, selectedMerchant }: MerchantSelectorProps) {
  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only fetch merchants once when user is authenticated and we haven't initialized yet
    if (isAuthenticated && !authLoading && !hasInitialized && !loading) {
      console.log('🚀 Initializing merchant fetch...');
      setHasInitialized(true);
      fetchMerchants();
    }
  }, [isAuthenticated, authLoading, hasInitialized, loading]);

  const fetchMerchants = async () => {
    // Don't fetch if not authenticated or already loading
    if (!isAuthenticated || loading) {
      console.log('⏭️ Skipping fetch - not authenticated or already loading');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Getting access token for merchants API...');
      // Get fresh token from Auth0
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🌐 Merchants API response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        if (response.status === 204) {
          console.log('📭 No content returned (204) - setting empty merchants array');
          setMerchants([]);
          return;
        }
        throw new Error(`Failed to fetch merchants: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Merchants data received:', data);
      
      if (!data || !data.data) {
        console.log('⚠️ No merchants array in response');
        setMerchants([]);
        return;
      }
      
      const merchantsWithName = (data.data || []).map((merchant: any) => ({
        ...merchant,
        name: merchant.name // Ensure name property exists
      }));
      
      console.log('✅ Setting merchants:', merchantsWithName.length, 'merchants');
      setMerchants(merchantsWithName);
    } catch (err) {
      console.error('❌ Error fetching merchants:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch merchants');
    } finally {
      setLoading(false);
    }
  };  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="merchant-selector__loading">
        <Typography variant="body-medium">Authenticating...</Typography>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="merchant-selector__error">
        <Typography variant="body-medium" style={{ color: 'var(--color-error)' }}>
          Please log in to access the merchant selector.
        </Typography>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="merchant-selector__loading">
        <Typography variant="body-medium">Loading merchants...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="merchant-selector__error">
        <Typography variant="body-medium" style={{ color: 'var(--color-error)' }}>
          Error: {error}
        </Typography>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => {
            console.log('🔄 Manual retry triggered');
            setHasInitialized(false);
            setError(null);
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="merchant-selector">
      <div className="merchant-selector__header">
        <Typography variant="heading-4">Select Merchant Dashboard</Typography>
        <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
          Choose a merchant to view and manage their orders
        </Typography>
      </div>

      {selectedMerchant && (
        <div className="merchant-selector__current">
          <Typography variant="body-medium" style={{ color: 'var(--color-success)' }}>
            Currently viewing: {selectedMerchant.name}
          </Typography>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => onMerchantSelect(null as any)}
          >
            Change Merchant
          </Button>
        </div>
      )}

      <div className="merchant-selector__search">
        <input
          type="text"
          placeholder="Search merchants by name or user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="merchant-selector__search-input"
        />
      </div>

      <div className="merchant-selector__list">
        {filteredMerchants.length === 0 ? (
          <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
            No merchants found matching your search.
          </Typography>
        ) : (
          <div className="merchant-selector__table">
            <div className="merchant-selector__table-header">
              <div className="merchant-selector__table-cell merchant-selector__table-cell--header">Name</div>
              <div className="merchant-selector__table-cell merchant-selector__table-cell--header">Username</div>
              <div className="merchant-selector__table-cell merchant-selector__table-cell--header">Phone</div>
              <div className="merchant-selector__table-cell merchant-selector__table-cell--header">Status</div>
              <div className="merchant-selector__table-cell merchant-selector__table-cell--header">Actions</div>
            </div>
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className={`merchant-selector__table-row ${selectedMerchant?.id === merchant.id ? 'merchant-selector__table-row--selected' : ''}`}
              >
                <div className="merchant-selector__table-cell">
                  <Typography variant="body-medium" style={{ fontWeight: 'bold' }}>
                    {merchant.name}
                  </Typography>
                </div>
                <div className="merchant-selector__table-cell">
                  <Typography variant="body-small">
                    {merchant.username}
                  </Typography>
                </div>
                <div className="merchant-selector__table-cell">
                  <Typography variant="body-small">
                    {merchant.phone}
                  </Typography>
                </div>
                <div className="merchant-selector__table-cell">
                  <span className={`merchant-selector__status merchant-selector__status--${merchant.status}`}>
                    {merchant.status}
                  </span>
                </div>
                <div className="merchant-selector__table-cell">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onMerchantSelect(merchant)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .merchant-selector {
          background: var(--color-background);
          border-radius: 8px;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .merchant-selector__header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .merchant-selector__current {
          background: var(--color-success-light);
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .merchant-selector__search {
          margin-bottom: 2rem;
        }

        .merchant-selector__search-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-size: 1rem;
        }

        .merchant-selector__search-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-light);
        }

        .merchant-selector__list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .merchant-selector__table {
          border: 1px solid var(--color-border);
          border-radius: 6px;
          overflow: hidden;
        }

        .merchant-selector__table-header {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr;
          background: var(--color-background-secondary);
          border-bottom: 1px solid var(--color-border);
        }

        .merchant-selector__table-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr;
          border-bottom: 1px solid var(--color-border);
          transition: background-color 0.2s ease;
        }

        .merchant-selector__table-row:hover {
          background: var(--color-background-secondary);
        }

        .merchant-selector__table-row--selected {
          background: var(--color-primary-light);
        }

        .merchant-selector__table-row:last-child {
          border-bottom: none;
        }

        .merchant-selector__table-cell {
          padding: 0.75rem;
          display: flex;
          align-items: center;
          border-right: 1px solid var(--color-border);
        }

        .merchant-selector__table-cell:last-child {
          border-right: none;
        }

        .merchant-selector__table-cell--header {
          font-weight: bold;
          background: var(--color-background-secondary);
        }

        .merchant-selector__status {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .merchant-selector__status--active {
          background: var(--color-success-light);
          color: var(--color-success);
        }

        .merchant-selector__status--inactive {
          background: var(--color-error-light);
          color: var(--color-error);
        }

        .merchant-selector__status--pending {
          background: var(--color-warning-light);
          color: var(--color-warning);
        }

        @media (max-width: 768px) {
          .merchant-selector__table-header,
          .merchant-selector__table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          
          .merchant-selector__table-cell {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding: 0.5rem;
          }
          
          .merchant-selector__table-cell:last-child {
            border-bottom: none;
          }
        }

        .merchant-selector__loading,
        .merchant-selector__error {
          text-align: center;
          padding: 3rem;
        }
      `}</style>
    </div>
  );
}