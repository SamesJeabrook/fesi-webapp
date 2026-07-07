'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import styles from './outlets.module.scss';

interface Outlet {
  id: string;
  name: string;
  description?: string;
  operating_mode: string;
  created_at: string;
  is_active: boolean;
}

interface OutletInfo {
  merchants: Outlet[];
  subscription: {
    current_outlets: number;
    max_outlets: number;
    total_allowed: number | null;
    can_add_more: boolean;
    addon_price?: number;
    is_beta_user?: boolean;
    is_trial?: boolean;
    message?: string;
  };
}

export default function AdminOutletManagementPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params?.merchantId as string;
  
  const [merchantName, setMerchantName] = useState<string>('');
  const [outletInfo, setOutletInfo] = useState<OutletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOutlet, setNewOutlet] = useState({
    name: '',
    description: '',
    operating_mode: 'event_based' as 'event_based' | 'static'
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchOutletInfo();
  }, [merchantId]);

  const fetchOutletInfo = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get merchant info
      const merchantData = await api.get(`/api/merchants/${merchantId}`);
      setMerchantName(merchantData.data?.name || merchantData.merchant?.name || 'Merchant');
      
      // Get outlets for this merchant
      const response = await api.get(`/api/merchants/${merchantId}/outlets/admin`);
      setOutletInfo(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load outlet information');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOutlet = async () => {
    if (!newOutlet.name.trim()) {
      alert('Outlet name is required');
      return;
    }

    try {
      setCreating(true);
      setError('');
      
      await api.post(`/api/merchants/${merchantId}/outlets/admin`, newOutlet);
      
      setShowAddModal(false);
      setNewOutlet({ name: '', description: '', operating_mode: 'event_based' });
      await fetchOutletInfo();
      
      alert('Outlet created successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create outlet');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOutlet = async (outletId: string, outletName: string) => {
    if (!confirm(`Are you sure you want to delete "${outletName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/merchants/${merchantId}/outlets/${outletId}/admin`);
      await fetchOutletInfo();
      alert('Outlet deleted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to delete outlet');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.container}>
          <Typography variant="body-medium">Loading outlet information...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href={`/admin/merchants/${merchantId}/settings`} className={styles.backLink}>
            ← Back to Settings
          </Link>
          <Typography variant="heading-2">Outlet Management</Typography>
          <Typography variant="body-medium" className={styles.subtitle}>
            Manage outlets for {merchantName}
          </Typography>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <Typography variant="body-medium">⚠️ {error}</Typography>
          </div>
        )}

        {outletInfo && (
          <>
            <Card className={styles.summaryCard}>
              <div className={styles.summary}>
                <div className={styles.summaryInfo}>
                  <Typography variant="heading-4">
                    {outletInfo.subscription.current_outlets} of{' '}
                    {outletInfo.subscription.is_beta_user 
                      ? '∞' 
                      : (outletInfo.subscription.total_allowed || outletInfo.subscription.max_outlets)
                    }{' '}
                    outlets
                  </Typography>
                  
                  {outletInfo.subscription.message && (
                    <Typography variant="body-small" className={styles.summaryMessage}>
                      {outletInfo.subscription.message}
                    </Typography>
                  )}
                  
                  {!outletInfo.subscription.is_beta_user && !outletInfo.subscription.is_trial && outletInfo.subscription.addon_price && (
                    <Typography variant="body-small" className={styles.summaryPrice}>
                      Additional outlets: £{outletInfo.subscription.addon_price}/month each
                    </Typography>
                  )}
                </div>
                
                <Button
                  onClick={() => setShowAddModal(true)}
                  variant="primary"
                  isDisabled={!outletInfo.subscription.can_add_more}
                >
                  + Add Outlet
                </Button>
              </div>
              
              {!outletInfo.subscription.can_add_more && (
                <div className={styles.limitWarning}>
                  <Typography variant="body-small">
                    ⚠️ Maximum outlets reached. Upgrade the subscription or grant beta access to add more.
                  </Typography>
                </div>
              )}
            </Card>

            <div className={styles.outletList}>
              {outletInfo.merchants.map((outlet) => (
                <Card key={outlet.id} className={styles.outletCard}>
                  <div className={styles.outletInfo}>
                    <div>
                      <Typography variant="heading-5">{outlet.name}</Typography>
                      {outlet.description && (
                        <Typography variant="body-small" className={styles.outletDescription}>
                          {outlet.description}
                        </Typography>
                      )}
                      <div className={styles.outletMeta}>
                        <span className={styles.badge}>
                          {outlet.operating_mode === 'static' ? '📍 Fixed Location' : '🚚 Event-Based'}
                        </span>
                        <span className={styles.date}>
                          Added {new Date(outlet.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {outletInfo.merchants.length > 1 && (
                      <Button
                        onClick={() => handleDeleteOutlet(outlet.id, outlet.name)}
                        variant="secondary"
                        className={styles.deleteButton}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Add Outlet Modal */}
        {showAddModal && (
          <div className={styles.modal}>
            <div className={styles.modalOverlay} onClick={() => !creating && setShowAddModal(false)} />
            <Card className={styles.modalContent}>
              <Typography variant="heading-4">Add New Outlet</Typography>
              
              <div className={styles.form}>
                <div className={styles.field}>
                  <label>
                    <Typography variant="body-small">Outlet Name *</Typography>
                    <input
                      type="text"
                      value={newOutlet.name}
                      onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
                      placeholder="e.g., Coffee Shop, Burger Hut"
                      className={styles.input}
                      disabled={creating}
                    />
                  </label>
                </div>
                
                <div className={styles.field}>
                  <label>
                    <Typography variant="body-small">Description</Typography>
                    <textarea
                      value={newOutlet.description}
                      onChange={(e) => setNewOutlet({ ...newOutlet, description: e.target.value })}
                      placeholder="Describe what you serve at this outlet"
                      className={styles.textarea}
                      rows={3}
                      disabled={creating}
                    />
                  </label>
                </div>
                
                <div className={styles.field}>
                  <label>
                    <Typography variant="body-small">Operating Mode *</Typography>
                    <select
                      value={newOutlet.operating_mode}
                      onChange={(e) => setNewOutlet({ 
                        ...newOutlet, 
                        operating_mode: e.target.value as 'event_based' | 'static' 
                      })}
                      className={styles.select}
                      disabled={creating}
                    >
                      <option value="event_based">Event-Based (Markets, Festivals)</option>
                      <option value="static">Fixed Location (Restaurant, Café)</option>
                    </select>
                  </label>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <Button
                  onClick={handleCreateOutlet}
                  variant="primary"
                  isDisabled={creating || !newOutlet.name.trim()}
                >
                  {creating ? 'Creating...' : 'Create Outlet'}
                </Button>
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="secondary"
                  isDisabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
