import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/atoms';
import { Button } from '@/components/atoms/Button/Button.component';

interface Merchant {
  id: string;
  business_name: string;
  name: string; // Added for compatibility
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

interface MerchantSelectorProps {
  onMerchantSelect: (merchant: Merchant) => void;
  selectedMerchant?: Merchant | null;
}

export default function MerchantSelector({ onMerchantSelect, selectedMerchant }: MerchantSelectorProps) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch merchants');
      }

      const data = await response.json();
      const merchantsWithName = (data.merchants || []).map((merchant: any) => ({
        ...merchant,
        name: merchant.business_name // Ensure name property exists
      }));
      setMerchants(merchantsWithName);
    } catch (err) {
      console.error('Error fetching merchants:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch merchants');
    } finally {
      setLoading(false);
    }
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={fetchMerchants}
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
            Currently viewing: {selectedMerchant.business_name}
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
          placeholder="Search merchants by name or email..."
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
          filteredMerchants.map((merchant) => (
            <div
              key={merchant.id}
              className={`merchant-selector__item ${selectedMerchant?.id === merchant.id ? 'merchant-selector__item--selected' : ''}`}
              onClick={() => onMerchantSelect(merchant)}
            >
              <div className="merchant-selector__item-content">
                <Typography variant="body-large" style={{ fontWeight: 'bold' }}>
                  {merchant.business_name}
                </Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  {merchant.email}
                </Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  Phone: {merchant.phone} • Status: {merchant.status}
                </Typography>
              </div>
              <div className="merchant-selector__item-action">
                <Button variant="primary" size="sm">
                  View Dashboard
                </Button>
              </div>
            </div>
          ))
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
          max-height: 500px;
          overflow-y: auto;
        }

        .merchant-selector__item {
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .merchant-selector__item:hover {
          border-color: var(--color-primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .merchant-selector__item--selected {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }

        .merchant-selector__item-content {
          flex: 1;
        }

        .merchant-selector__item-action {
          margin-left: 1rem;
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