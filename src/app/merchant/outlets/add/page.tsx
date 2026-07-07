'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import api from '@/utils/api';
import styles from './add.module.scss';

export default function AddOutletPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    operating_mode: 'event_based' as 'event_based' | 'static'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        setError('Outlet name is required');
        setLoading(false);
        return;
      }

      // Create outlet
      const response = await api.post('/api/merchants/outlets/create', formData);
      
      if (response.requiresReauth) {
        // Store the new merchant ID
        localStorage.setItem('currentMerchantId', response.merchant.id);
        
        // Show success message
        alert('Outlet created successfully! Please log out and log back in to access your new outlet.');
        
        // Redirect to login
        router.push('/api/auth/logout');
      } else {
        // Store the new merchant ID and redirect
        localStorage.setItem('currentMerchantId', response.merchant.id);
        router.push('/merchant/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Failed to create outlet:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create outlet. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styles.addOutlet}>
      <div className={styles.addOutlet__header}>
        <Typography variant="heading-2">Add New Outlet</Typography>
        <Typography variant="body">
          Create an additional outlet to manage from your account. Each outlet has its own menus, 
          events, and orders, but shares your subscription.
        </Typography>
      </div>

      <Card className={styles.addOutlet__card}>
        <form onSubmit={handleSubmit} className={styles.addOutlet__form}>
          {error && (
            <div className={styles.addOutlet__error}>
              <Typography variant="body" className={styles.addOutlet__errorText}>
                ⚠️ {error}
              </Typography>
            </div>
          )}

          <div className={styles.addOutlet__field}>
            <label htmlFor="name" className={styles.addOutlet__label}>
              <Typography variant="body">Outlet Name *</Typography>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Coffee Shop, Burger Hut"
              className={styles.addOutlet__input}
              required
              disabled={loading}
            />
            <Typography variant="body-small" className={styles.addOutlet__hint}>
              Give your outlet a unique name to identify it
            </Typography>
          </div>

          <div className={styles.addOutlet__field}>
            <label htmlFor="description" className={styles.addOutlet__label}>
              <Typography variant="body">Description</Typography>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you serve at this outlet"
              className={styles.addOutlet__textarea}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.addOutlet__field}>
            <label htmlFor="operating_mode" className={styles.addOutlet__label}>
              <Typography variant="body">Operating Mode *</Typography>
            </label>
            <select
              id="operating_mode"
              value={formData.operating_mode}
              onChange={(e) => setFormData({ 
                ...formData, 
                operating_mode: e.target.value as 'event_based' | 'static' 
              })}
              className={styles.addOutlet__select}
              disabled={loading}
            >
              <option value="event_based">Event-Based (Markets, Festivals)</option>
              <option value="static">Fixed Location (Restaurant, Café)</option>
            </select>
            <Typography variant="body-small" className={styles.addOutlet__hint}>
              {formData.operating_mode === 'event_based' 
                ? 'Perfect for food trucks, market stalls, and pop-up vendors' 
                : 'Perfect for restaurants, cafés, and permanent locations'}
            </Typography>
          </div>

          <div className={styles.addOutlet__actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Outlet'}
            </Button>
          </div>
        </form>
      </Card>

      <div className={styles.addOutlet__info}>
        <Card>
          <Typography variant="heading-4">📍 What's an outlet?</Typography>
          <Typography variant="body">
            An outlet is a separate business location or operation that you manage. For example:
          </Typography>
          <ul className={styles.addOutlet__list}>
            <li>
              <Typography variant="body">• A burger van and a coffee cart at different markets</Typography>
            </li>
            <li>
              <Typography variant="body">• Multiple restaurant locations</Typography>
            </li>
            <li>
              <Typography variant="body">• Different food concepts under one company</Typography>
            </li>
          </ul>
          <Typography variant="body">
            Each outlet has its own menus, prices, and orders, making it easy to manage 
            different operations from one account.
          </Typography>
        </Card>
      </div>
    </div>
  );
}
