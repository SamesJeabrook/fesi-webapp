'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { MenuItemManagementCard } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAuthToken } from '@/utils/devAuth';
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
  const [isMounted, setIsMounted] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
  });

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken(getAccessTokenSilently);

      // Extract merchant ID from dev token if present
      let merchantId: string;
      if (token.startsWith('dev-merchant-')) {
        merchantId = token.replace('dev-merchant-', '');
      } else {
        // For real Auth0 tokens, get merchant data from /me endpoint
        const merchantResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!merchantResponse.ok) {
          console.error('Failed to fetch merchant data');
          return;
        }

        const merchantData = await merchantResponse.json();
        merchantId = merchantData.id;
      }

      // Fetch categories and menu items in parallel
      const [categoriesResponse, menuResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/categories?merchant_id=${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/merchant/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data || []);
      }

      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        // The menu endpoint returns an array of categories with items
        const allItems = menuData.data.menu?.flatMap((cat: any) => 
          cat.items?.map((item: any) => ({
            ...item,
            name: item.title, 
            price: item.base_price,
            is_available: item.is_active,
            category_name: cat.name
          })) || []
        ) || [];
        setItems(allItems);
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
      const token = await getAuthToken(getAccessTokenSilently);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          base_price: parseFloat(newItem.price) * 100, // Convert to cents - API expects base_price
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
      const token = await getAuthToken(getAccessTokenSilently);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isAvailable }), // API uses is_active, not is_available
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

  // Prevent hydration mismatch by only rendering after client mount
  if (!isMounted) {
    return null;
  }

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

        <Grid.Container gap="lg" justifyContent="start" className={styles.items__list}>
          {isLoading ? (
            <Grid.Item>
              <div className={styles.items__loading}>
                <Typography variant="body-medium">Loading menu items...</Typography>
              </div>
            </Grid.Item>
          ) : filteredItems.length === 0 ? (
            <Grid.Item sm={16} md={8} lg={4}>
              <div className={styles.items__empty}>
                <Typography variant="heading-5">No menu items found</Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedCategory === 'all' 
                    ? 'Create your first menu item to get started'
                    : 'No items in this category yet'
                  }
                </Typography>
              </div>
            </Grid.Item>
          ) : (
            filteredItems.map((item) => (
              <Grid.Item sm={16} md={8} xl={4} key={item.id}>
                <MenuItemManagementCard
                  id={item.id}
                  title={item.name}
                  description={item.description}
                  basePrice={item.price}
                  categoryName={categories.find(cat => cat.id === item.category_id)?.name || 'Unknown Category'}
                  isActive={item.is_available}
                  displayOrder={item.display_order}
                  onToggleAvailability={toggleItemAvailability}
                  onEdit={(id) => window.location.href = `/merchant/admin/menu/items/${id}/edit`}
                />
              </Grid.Item>
            ))
          )}
        </Grid.Container>
      </div>
    </ProtectedRoute>
  );
}