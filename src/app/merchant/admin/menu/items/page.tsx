'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './items.module.scss';

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  display_order: number;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

interface MenuCategory {
  id: string;
  name: string;
}

export default function MenuItemsPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      // Fetch categories and items in parallel
      const [categoriesResponse, itemsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/items`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);
      }

      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setItems(itemsData.items || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async () => {
    if (!newItem.name.trim() || !newItem.price || !newItem.category_id) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          price: parseFloat(newItem.price) * 100, // Convert to cents
          display_order: items.length + 1,
        }),
      });

      if (response.ok) {
        setNewItem({ name: '', description: '', price: '', category_id: '' });
        setIsCreating(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/items/${itemId}`, {
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
      console.error('Error updating item:', error);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory);

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <ProtectedRoute requireRole={['merchant', 'admin']}>
      <div className={styles.items}>
        <div className={styles.items__header}>
          <div className={styles.items__headerContent}>
            <Link href="/merchant/admin" className={styles.items__backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-3">
              Menu Items
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Manage your menu items and pricing
            </Typography>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreating(true)}
            className={styles.items__createButton}
          >
            + Add Item
          </Button>
        </div>

        <div className={styles.items__filters}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.items__categoryFilter}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {isCreating && (
          <div className={styles.items__createForm}>
            <div className={styles.items__formRow}>
              <div className={styles.items__formGroup}>
                <label htmlFor="itemName">Item Name</label>
                <input
                  id="itemName"
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Chicken Caesar Salad"
                  className={styles.items__input}
                />
              </div>
              <div className={styles.items__formGroup}>
                <label htmlFor="itemPrice">Price ($)</label>
                <input
                  id="itemPrice"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="12.99"
                  className={styles.items__input}
                />
              </div>
            </div>
            <div className={styles.items__formGroup}>
              <label htmlFor="itemCategory">Category</label>
              <select
                id="itemCategory"
                value={newItem.category_id}
                onChange={(e) => setNewItem(prev => ({ ...prev, category_id: e.target.value }))}
                className={styles.items__select}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.items__formGroup}>
              <label htmlFor="itemDescription">Description (Optional)</label>
              <textarea
                id="itemDescription"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Fresh romaine lettuce, grilled chicken, parmesan cheese..."
                className={styles.items__textarea}
                rows={3}
              />
            </div>
            <div className={styles.items__formActions}>
              <Button variant="secondary" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={createItem}>
                Create Item
              </Button>
            </div>
          </div>
        )}

        <div className={styles.items__list}>
          {isLoading ? (
            <div className={styles.items__loading}>
              <Typography variant="body-medium">Loading menu items...</Typography>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.items__empty}>
              <Typography variant="heading-5">No menu items found</Typography>
              <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {selectedCategory === 'all' 
                  ? 'Create your first menu item to get started'
                  : 'No items in this category yet'
                }
              </Typography>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className={styles.items__item}>
                <div className={styles.items__itemContent}>
                  <div className={styles.items__itemHeader}>
                    <Typography variant="heading-5">
                      {item.name}
                    </Typography>
                    <div className={styles.items__itemPrice}>
                      <Typography variant="heading-6">
                        {formatPrice(item.price)}
                      </Typography>
                    </div>
                  </div>
                  <div className={styles.items__itemMeta}>
                    <span className={styles.items__category}>
                      {categories.find(cat => cat.id === item.category_id)?.name || 'Unknown Category'}
                    </span>
                    <span className={`${styles.items__status} ${
                      item.is_available ? styles['items__status--available'] : styles['items__status--unavailable']
                    }`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {item.description && (
                    <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.description}
                    </Typography>
                  )}
                </div>
                <div className={styles.items__itemActions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleItemAvailability(item.id, item.is_available)}
                  >
                    {item.is_available ? 'Mark Unavailable' : 'Mark Available'}
                  </Button>
                  <Link href={`/merchant/admin/menu/items/${item.id}/edit`}>
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
    </ProtectedRoute>
  );
}