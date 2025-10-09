'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './sub-items.module.scss';

interface SubItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

const SUB_ITEM_CATEGORIES = [
  { value: 'customization', label: 'Customizations', description: 'Modifications to existing items' },
  { value: 'add_on', label: 'Add-ons', description: 'Extra items that can be added' },
  { value: 'side', label: 'Sides', description: 'Side dishes and accompaniments' },
  { value: 'drink', label: 'Drinks', description: 'Beverages and drinks' },
  { value: 'sauce', label: 'Sauces', description: 'Sauces and condiments' },
  { value: 'topping', label: 'Toppings', description: 'Pizza toppings, burger additions, etc.' },
];

export default function SubItemsPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newSubItem, setNewSubItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  const fetchSubItems = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/sub-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubItems(data.subItems || []);
      }
    } catch (error) {
      console.error('Error fetching sub-items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubItem = async () => {
    if (!newSubItem.name.trim() || !newSubItem.category) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/sub-items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSubItem,
          price: newSubItem.price ? parseFloat(newSubItem.price) * 100 : 0, // Convert to cents
        }),
      });

      if (response.ok) {
        setNewSubItem({ name: '', description: '', price: '', category: '' });
        setIsCreating(false);
        fetchSubItems();
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/sub-items/${subItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_available: !isAvailable }),
      });

      if (response.ok) {
        fetchSubItems();
      }
    } catch (error) {
      console.error('Error updating sub-item:', error);
    }
  };

  const filteredSubItems = selectedCategory === 'all' 
    ? subItems 
    : subItems.filter(item => item.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    const cat = SUB_ITEM_CATEGORIES.find(c => c.value === category);
    return cat?.label || category;
  };

  useEffect(() => {
    fetchSubItems();
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `+$${(price / 100).toFixed(2)}`;
  };

  return (
    <ProtectedRoute requireRole={['merchant', 'admin']}>
      <div className={styles.subItems}>
        <div className={styles.subItems__header}>
          <div className={styles.subItems__headerContent}>
            <Link href="/merchant/admin" className={styles.subItems__backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-3">
              Sub-Items & Options
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Manage customizations, add-ons, and options for your menu items
            </Typography>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreating(true)}
            className={styles.subItems__createButton}
          >
            + Add Sub-Item
          </Button>
        </div>

        <div className={styles.subItems__filters}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.subItems__categoryFilter}
          >
            <option value="all">All Categories</option>
            {SUB_ITEM_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
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
                  placeholder="e.g., Extra Cheese, Large Size, BBQ Sauce"
                  className={styles.subItems__input}
                />
              </div>
              <div className={styles.subItems__formGroup}>
                <label htmlFor="subItemPrice">Extra Price ($)</label>
                <input
                  id="subItemPrice"
                  type="number"
                  step="0.01"
                  value={newSubItem.price}
                  onChange={(e) => setNewSubItem(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00 (leave empty for free)"
                  className={styles.subItems__input}
                />
              </div>
            </div>
            <div className={styles.subItems__formGroup}>
              <label htmlFor="subItemCategory">Category</label>
              <select
                id="subItemCategory"
                value={newSubItem.category}
                onChange={(e) => setNewSubItem(prev => ({ ...prev, category: e.target.value }))}
                className={styles.subItems__select}
              >
                <option value="">Select a category</option>
                {SUB_ITEM_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label} - {category.description}
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
                placeholder="Brief description of this option..."
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

        <div className={styles.subItems__categoryGrid}>
          {SUB_ITEM_CATEGORIES.map((category) => {
            const categoryItems = subItems.filter(item => item.category === category.value);
            if (selectedCategory !== 'all' && selectedCategory !== category.value) return null;
            
            return (
              <div key={category.value} className={styles.subItems__categorySection}>
                <div className={styles.subItems__categoryHeader}>
                  <Typography variant="heading-5">
                    {category.label}
                  </Typography>
                  <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                    {category.description} ({categoryItems.length} items)
                  </Typography>
                </div>
                
                <div className={styles.subItems__categoryItems}>
                  {categoryItems.length === 0 ? (
                    <div className={styles.subItems__emptyCategory}>
                      <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        No {category.label.toLowerCase()} yet
                      </Typography>
                    </div>
                  ) : (
                    categoryItems.map((item) => (
                      <div key={item.id} className={styles.subItems__item}>
                        <div className={styles.subItems__itemContent}>
                          <div className={styles.subItems__itemHeader}>
                            <Typography variant="heading-6">
                              {item.name}
                            </Typography>
                            <div className={styles.subItems__itemPrice}>
                              <Typography variant="body-medium" className={styles.subItems__price}>
                                {formatPrice(item.price)}
                              </Typography>
                            </div>
                          </div>
                          <div className={styles.subItems__itemMeta}>
                            <span className={`${styles.subItems__status} ${
                              item.is_available ? styles['subItems__status--available'] : styles['subItems__status--unavailable']
                            }`}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          {item.description && (
                            <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                              {item.description}
                            </Typography>
                          )}
                        </div>
                        <div className={styles.subItems__itemActions}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleSubItemAvailability(item.id, item.is_available)}
                          >
                            {item.is_available ? 'Disable' : 'Enable'}
                          </Button>
                          <Link href={`/merchant/admin/menu/sub-items/${item.id}/edit`}>
                            <Button variant="primary" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className={styles.subItems__loading}>
            <Typography variant="body-medium">Loading sub-items...</Typography>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}