'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { AdminPageHeader } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './adminItems.module.scss';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  category_id: string;
  category_name?: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface MenuCategory {
  id: string;
  name: string;
}

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMenuItemsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
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

      // Fetch merchant, categories, and items in parallel
      const [merchantResponse, menuResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
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

      if (merchantResponse.ok) {
        const merchantData = await merchantResponse.json();
        setMerchant(merchantData.data);
      }

      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        // Extract categories and items from menu data
        if (menuData.success && menuData.data && menuData.data.menu) {
          // Extract categories
          const categoryList = menuData.data.menu.map((category: any, index: number) => ({
            id: category.name,
            name: category.name
          }));
          setCategories(categoryList);

          // Extract all items from all categories
          const allItems: MenuItem[] = [];
          menuData.data.menu.forEach((category: any) => {
            if (category.items && Array.isArray(category.items)) {
              category.items.forEach((item: any) => {
                allItems.push({
                  id: item.id,
                  name: item.title || item.name,
                  description: item.description,
                  base_price: item.base_price,
                  category_id: category.name,
                  category_name: category.name,
                  is_available: item.is_active,
                  display_order: item.display_order || 0,
                  created_at: item.created_at || new Date().toISOString(),
                  updated_at: item.updated_at || new Date().toISOString()
                });
              });
            }
          });
          setItems(allItems);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async () => {
    if (!newItem.name.trim() || !newItem.category_id || !newItem.price) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newItem.name,
          description: newItem.description,
          price_pence: Math.round(parseFloat(newItem.price) * 100),
          category_id: newItem.category_id,
          merchant_id: merchantId,
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${itemId}/toggle-active`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isAvailable }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory);

  useEffect(() => {
    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.items}>
        <AdminPageHeader
          backLink={{
            href: `/admin/merchants/${merchantId}`,
            label: `Back to ${merchant?.business_name || 'Merchant'} Dashboard`
          }}
          adminContext={`Managing menu items for ${merchant?.business_name || 'merchant'}`}
          title="Menu Items"
          description="Manage menu items and their availability for this merchant"
          actions={
            <Button
              variant="primary"
              onClick={() => setIsCreating(true)}
              className={styles.items__createButton}
              isDisabled={categories.length === 0}
            >
              + Add Item
            </Button>
          }
        />

        {categories.length === 0 && !isLoading && (
          <Grid.Container gap="lg">
            <Grid.Item md={12} lg={8}>
              <div className={styles.items__noCategories}>
                <Typography variant="heading-5">No categories available</Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  You need to create menu categories before adding items.
                </Typography>
                <Link href={`/admin/merchants/${merchantId}/menu/categories`}>
                  <Button variant="primary">Create Categories</Button>
                </Link>
              </div>
            </Grid.Item>
          </Grid.Container>
        )}

        {categories.length > 0 && (
          <>
            {/* Filters Section */}
            <Grid.Container gap="lg" className={styles.items__filtersSection}>
              <Grid.Item lg={12} xl={8}>
                <div className={styles.items__filters}>
                  <Typography variant="body-medium" style={{ fontWeight: '500' }}>
                    Filter by category:
                  </Typography>
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
              </Grid.Item>
            </Grid.Container>

            {/* Create Form Section */}
            {isCreating && (
              <Grid.Container gap="lg" className={styles.items__createSection}>
                <Grid.Item lg={12} xl={10}>
                  <div className={styles.items__createForm}>
                    <Typography variant="heading-5" className={styles.items__formTitle}>
                      Create New Menu Item
                    </Typography>
                    
                    <div className={styles.items__formRow}>
                      <div className={styles.items__formGroup}>
                        <label htmlFor="itemName">Item Name</label>
                        <input
                          id="itemName"
                          type="text"
                          value={newItem.name}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Margherita Pizza"
                          className={styles.items__input}
                        />
                      </div>
                      <div className={styles.items__formGroup}>
                        <label htmlFor="itemPrice">Price ($)</label>
                        <input
                          id="itemPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newItem.price}
                          onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
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
                        placeholder="Brief description of the item"
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
                </Grid.Item>
              </Grid.Container>
            )}

            {/* Items List Section */}
            <Grid.Container gap="lg" className={styles.items__listSection}>
              {isLoading ? (
                <Grid.Item>
                  <div className={styles.items__loading}>
                    <Typography variant="body-medium">Loading items...</Typography>
                  </div>
                </Grid.Item>
              ) : filteredItems.length === 0 ? (
                <Grid.Item md={12} lg={8}>
                  <div className={styles.items__empty}>
                    <Typography variant="heading-5">
                      {selectedCategory === 'all' ? 'No items yet' : 'No items in this category'}
                    </Typography>
                    <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedCategory === 'all' 
                        ? 'Create the first menu item for this merchant'
                        : 'Try selecting a different category or create a new item'
                      }
                    </Typography>
                  </div>
                </Grid.Item>
              ) : (
                filteredItems.map((item) => (
                  <Grid.Item sm={8} md={8} lg={6} xl={4} key={item.id}>
                    <div className={styles.items__item}>
                      <div className={styles.items__itemContent}>
                        <div className={styles.items__itemHeader}>
                          <div className={styles.items__itemTitle}>
                            <Typography variant="heading-5">
                              {item.name}
                            </Typography>
                            <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                              {categories.find(cat => cat.id === item.category_id)?.name || 'Unknown Category'}
                            </Typography>
                          </div>
                          <div className={styles.items__itemMeta}>
                            <Typography variant="heading-5" style={{ color: 'var(--color-primary)' }}>
                              £{formatPrice(item.base_price)}
                            </Typography>
                            <span className={`${styles.items__status} ${
                              item.is_available ? styles['items__status--available'] : styles['items__status--unavailable']
                            }`}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                        {item.description && (
                          <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            {item.description}
                          </Typography>
                        )}
                        <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                          Order: {item.display_order}
                        </Typography>
                      </div>
                      <div className={styles.items__itemActions}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleItemAvailability(item.id, item.is_available)}
                        >
                          {item.is_available ? 'Make Unavailable' : 'Make Available'}
                        </Button>
                        <Link href={`/admin/merchants/${merchantId}/menu/items/${item.id}/edit`}>
                          <Button variant="primary" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Grid.Item>
                ))
              )}
            </Grid.Container>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}