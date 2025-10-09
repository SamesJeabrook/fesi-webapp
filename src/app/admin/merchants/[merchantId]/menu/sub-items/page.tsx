'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './adminSubItems.module.scss';

interface SubItem {
  id: string;
  name: string;
  description?: string;
  additional_price: number;
  item_id: string;
  item_name?: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  id: string;
  name: string;
  category_name?: string;
}

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMenuSubItemsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedItem, setSelectedItem] = useState('all');
  const [newSubItem, setNewSubItem] = useState({
    name: '',
    description: '',
    price_adjustment: '',
    item_id: '',
  });

  const merchantId = params?.merchantId as string;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      // Fetch merchant, items, and sub-items in parallel
      const [merchantResponse, itemsResponse, subItemsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/menu/items`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/menu/sub-items`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (merchantResponse.ok) {
        const merchantData = await merchantResponse.json();
        setMerchant(merchantData.data);
      }

      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setItems(itemsData.items || []);
      }

      if (subItemsResponse.ok) {
        const subItemsData = await subItemsResponse.json();
        setSubItems(subItemsData.subItems || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubItem = async () => {
    if (!newSubItem.name.trim() || !newSubItem.item_id || newSubItem.price_adjustment === '') return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/menu/sub-items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubItem.name,
          description: newSubItem.description,
          price_adjustment: parseFloat(newSubItem.price_adjustment) * 100, // Convert to cents
          item_id: newSubItem.item_id,
          display_order: subItems.length + 1,
        }),
      });

      if (response.ok) {
        setNewSubItem({ name: '', description: '', price_adjustment: '', item_id: '' });
        setIsCreating(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating sub-item:', error);
    }
  };

  const toggleSubItemAvailability = async (subItemId: string, isAvailable: boolean) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/menu/sub-items/${subItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_available: !isAvailable }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating sub-item:', error);
    }
  };

  const formatPriceAdjustment = (adjustmentInCents: number) => {
    const adjustment = adjustmentInCents / 100;
    return adjustment >= 0 ? `+$${adjustment.toFixed(2)}` : `-$${Math.abs(adjustment).toFixed(2)}`;
  };

  const filteredSubItems = selectedItem === 'all' 
    ? subItems 
    : subItems.filter(subItem => subItem.item_id === selectedItem);

  useEffect(() => {
    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.subItems}>
        <div className={styles.subItems__header}>
          <div className={styles.subItems__headerContent}>
            <Link href={`/admin/merchants/${merchantId}`} className={styles.subItems__backLink}>
              ← Back to {merchant?.business_name || 'Merchant'} Dashboard
            </Link>
            <div className={styles.subItems__adminBadge}>
              <span className={styles.subItems__badge}>🔧 ADMIN MODE</span>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Managing sub-items for {merchant?.business_name || 'merchant'}
              </Typography>
            </div>
            <Typography variant="heading-3">
              Menu Sub-Items
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Manage variations and add-ons for menu items
            </Typography>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreating(true)}
            className={styles.subItems__createButton}
            disabled={items.length === 0}
          >
            + Add Sub-Item
          </Button>
        </div>

        {items.length === 0 && !isLoading && (
          <div className={styles.subItems__noItems}>
            <Typography variant="heading-5">No menu items available</Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              You need to create menu items before adding sub-items.
            </Typography>
            <Link href={`/admin/merchants/${merchantId}/menu/items`}>
              <Button variant="primary">Create Menu Items</Button>
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className={styles.subItems__filters}>
              <Typography variant="body-medium" style={{ fontWeight: '500' }}>
                Filter by menu item:
              </Typography>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className={styles.subItems__itemFilter}
              >
                <option value="all">All Items</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.category_name && `(${item.category_name})`}
                  </option>
                ))}
              </select>
            </div>

            {isCreating && (
              <div className={styles.subItems__createForm}>
                <div className={styles.subItems__formRow}>
                  <div className={styles.subItems__formGroup}>
                    <label htmlFor="subItemName">Sub-Item Name</label>
                    <input
                      id="subItemName"
                      type="text"
                      value={newSubItem.name}
                      onChange={(e) => setNewSubItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Extra Cheese, Large Size"
                      className={styles.subItems__input}
                    />
                  </div>
                  <div className={styles.subItems__formGroup}>
                    <label htmlFor="priceAdjustment">Price Adjustment ($)</label>
                    <input
                      id="priceAdjustment"
                      type="number"
                      step="0.01"
                      value={newSubItem.price_adjustment}
                      onChange={(e) => setNewSubItem(prev => ({ ...prev, price_adjustment: e.target.value }))}
                      placeholder="0.00 (use negative for discounts)"
                      className={styles.subItems__input}
                    />
                  </div>
                </div>
                <div className={styles.subItems__formGroup}>
                  <label htmlFor="parentItem">Parent Menu Item</label>
                  <select
                    id="parentItem"
                    value={newSubItem.item_id}
                    onChange={(e) => setNewSubItem(prev => ({ ...prev, item_id: e.target.value }))}
                    className={styles.subItems__select}
                  >
                    <option value="">Select a menu item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.category_name && `(${item.category_name})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.subItems__formGroup}>
                  <label htmlFor="subItemDescription">Description (Optional)</label>
                  <textarea
                    id="subItemDescription"
                    value={newSubItem.description}
                    onChange={(e) => setNewSubItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this variation or add-on"
                    className={styles.subItems__textarea}
                    rows={3}
                  />
                </div>
                <div className={styles.subItems__formActions}>
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={createSubItem}>
                    Create Sub-Item
                  </Button>
                </div>
              </div>
            )}

            <div className={styles.subItems__list}>
              {isLoading ? (
                <div className={styles.subItems__loading}>
                  <Typography variant="body-medium">Loading sub-items...</Typography>
                </div>
              ) : filteredSubItems.length === 0 ? (
                <div className={styles.subItems__empty}>
                  <Typography variant="heading-5">
                    {selectedItem === 'all' ? 'No sub-items yet' : 'No sub-items for this item'}
                  </Typography>
                  <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedItem === 'all' 
                      ? 'Create the first sub-item for this merchant'
                      : 'Try selecting a different item or create a new sub-item'
                    }
                  </Typography>
                </div>
              ) : (
                filteredSubItems.map((subItem) => (
                  <div key={subItem.id} className={styles.subItems__item}>
                    <div className={styles.subItems__itemContent}>
                      <div className={styles.subItems__itemHeader}>
                        <div className={styles.subItems__itemTitle}>
                          <Typography variant="heading-5">
                            {subItem.name}
                          </Typography>
                          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                            For: {items.find(item => item.id === subItem.item_id)?.name || 'Unknown Item'}
                          </Typography>
                        </div>
                        <div className={styles.subItems__itemMeta}>
                          <Typography 
                            variant="heading-5" 
                            style={{ 
                              color: subItem.price_adjustment >= 0 ? 'var(--color-success-dark)' : 'var(--color-warning-dark)' 
                            }}
                          >
                            {formatPriceAdjustment(subItem.additional_price)}
                          </Typography>
                          <span className={`${styles.subItems__status} ${
                            subItem.is_available ? styles['subItems__status--available'] : styles['subItems__status--unavailable']
                          }`}>
                            {subItem.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      {subItem.description && (
                        <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          {subItem.description}
                        </Typography>
                      )}
                      <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Order: {subItem.display_order}
                      </Typography>
                    </div>
                    <div className={styles.subItems__itemActions}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleSubItemAvailability(subItem.id, subItem.is_available)}
                      >
                        {subItem.is_available ? 'Make Unavailable' : 'Make Available'}
                      </Button>
                      <Link href={`/admin/merchants/${merchantId}/menu/sub-items/${subItem.id}/edit`}>
                        <Button variant="primary" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}