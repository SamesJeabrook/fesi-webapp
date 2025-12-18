'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { MenuItemManagementCard, EditMenuItemModal } from '@/components/molecules';
import { CreateMenuItemForm } from '@/components/organisms';
import { SubItemGroup } from '@/components/molecules/OptionGroupSelector';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAuthToken } from '@/utils/devAuth';
import api from '@/utils/api';
import Link from 'next/link';
import styles from './items.module.scss';

interface MenuItem {
  id: string;
  title: string; // API returns 'title', not 'name'
  description?: string;
  base_price: number;
  category_id: string;
  category_name?: string;
  is_active: boolean; // API returns 'is_active', not 'is_available'
  display_order: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  option_groups?: SubItemGroup[];
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [merchantId, setMerchantId] = useState<string>('');

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Extract merchant ID from dev token or get from /me endpoint
      let currentMerchantId: string;
      const devToken = localStorage.getItem('dev_token');
      
      if (devToken && devToken.startsWith('dev-merchant-')) {
        // Extract merchant ID from dev token
        currentMerchantId = devToken.replace('dev-merchant-', '');
        console.log('[DEV MODE] Using merchant ID from dev token:', currentMerchantId);
      } else {
        // For real Auth0 tokens, get merchant data from /me endpoint
        const merchantData = await api.get('/api/merchants/me');
        currentMerchantId = merchantData.id;
      }
      
      setMerchantId(currentMerchantId);

      // Fetch categories and menu items in parallel
      const [categoriesData, menuData] = await Promise.all([
        api.get(`/api/menu/categories?merchant_id=${currentMerchantId}`),
        // Use admin endpoint to get ALL items including inactive ones
        api.get(`/api/menu/merchant/${currentMerchantId}/admin`)
      ]);

      setCategories(categoriesData.data || []);
      
      // Extract all items from all categories
      const allItems: MenuItem[] = [];
      menuData.data.menu?.forEach((category: any) => {
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item: any) => {
            allItems.push({
              id: item.id,
              title: item.title,
              description: item.description,
              base_price: item.base_price,
              category_id: item.category_id,
              category_name: category.name,
              is_active: item.is_active,
              display_order: item.display_order || 0,
              image_url: item.image_url,
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString()
            });
          });
        }
      });
      setItems(allItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (itemData: {
    name: string;
    description: string;
    price: string;
    category_id: string;
    image_url?: string;
    optionGroupIds?: number[];
  }) => {
    setIsSubmitting(true);
    try {
      const responseData = await api.post('/api/menu', {
        title: itemData.name.trim(),
        description: itemData.description?.trim() || '',
        base_price: Math.round(parseFloat(itemData.price) * 100), // Convert pounds to pence
        category_id: itemData.category_id || null,
        display_order: items.length + 1,
        image_url: itemData.image_url || null,
      });

      const newItemId = responseData.data?.id;
      
      // If option groups were selected, assign them to the new item
      if (newItemId && itemData.optionGroupIds && itemData.optionGroupIds.length > 0) {
        for (const groupId of itemData.optionGroupIds) {
          try {
            await api.post(`/api/menu/${newItemId}/sub-groups`, { sub_group_id: groupId });
          } catch (error) {
            console.error(`Failed to assign option group ${groupId}:`, error);
            // Continue with other groups even if one fails
          }
        }
      }
      
      setIsCreating(false);
      await fetchData();
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Re-throw so form can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItemAvailability = async (itemId: string, isActive: boolean) => {
    try {
      await api.post(`/api/menu/${itemId}/toggle-active`);
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleEditItem = async (item: MenuItem) => {
    console.log('handleEditItem called with item:', item);
    // Fetch the full item with option groups
    try {
      const data = await api.get(`/api/menu/${item.id}`);
      console.log('API Response:', data);
      console.log('data.data:', data.data);
      console.log('data.option_groups:', data.option_groups);
      
      // The API might return data directly or wrapped in a data property
      const itemData = data.data || data;
      console.log('itemData.option_groups:', itemData.option_groups);
      
      const updatedItem = {
        ...item,
        option_groups: itemData.option_groups || []
      };
      console.log('Setting editingItem to:', updatedItem);
      
      setEditingItem(updatedItem);
    } catch (error) {
      console.error('Error fetching item details:', error);
      setEditingItem(item);
    }
  };

  const handleUpdateItem = async (updatedData: Partial<MenuItem>) => {
    if (!editingItem) return;

    try {
      console.log('Updating item with data:', updatedData);

      const result = await api.put(`/api/menu/${editingItem.id}`, updatedData);
      console.log('Menu item updated successfully:', result);
      fetchData(); // Refresh the list
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error; // Re-throw so modal can handle it
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory);

  useEffect(() => {
    fetchData();
  }, []);

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
          <CreateMenuItemForm
            categories={categories}
            onSubmit={createItem}
            onCancel={() => setIsCreating(false)}
            isSubmitting={isSubmitting}
            merchantId={merchantId}
          />
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
                  title={item.title}
                  description={item.description}
                  basePrice={item.base_price}
                  categoryName={categories.find(cat => cat.id === item.category_id)?.name || 'Unknown Category'}
                  isActive={item.is_active}
                  displayOrder={item.display_order}
                  imageUrl={item.image_url}
                  onToggleAvailability={toggleItemAvailability}
                  onEdit={() => handleEditItem(item)}
                />
              </Grid.Item>
            ))
          )}
        </Grid.Container>

        {/* Edit Item Modal */}
        {editingItem && (
          <EditMenuItemModal
            item={{
              id: editingItem.id,
              name: editingItem.title,
              description: editingItem.description,
              price: editingItem.base_price,
              category_id: editingItem.category_id,
              category_name: editingItem.category_name,
              is_available: editingItem.is_active,
              display_order: editingItem.display_order,
              image_url: editingItem.image_url,
              created_at: editingItem.created_at,
              updated_at: editingItem.updated_at,
              option_groups: editingItem.option_groups
            }}
            categories={categories}
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleUpdateItem}
            merchantId={merchantId}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}