'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { MenuItemManagementCard, EditMenuItemModal } from '@/components/molecules';
import { CreateMenuItemForm } from '@/components/organisms';
import { SubItemGroup } from '@/components/molecules/OptionGroupSelector';
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
  const [authToken, setAuthToken] = useState<string>('');

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken(getAccessTokenSilently);
      setAuthToken(token);

      // Extract merchant ID from dev token if present
      let currentMerchantId: string;
      if (token.startsWith('dev-merchant-')) {
        currentMerchantId = token.replace('dev-merchant-', '');
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
        currentMerchantId = merchantData.id;
      }

      setMerchantId(currentMerchantId);

      // Fetch categories and menu items in parallel
      const [categoriesResponse, menuResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/categories?merchant_id=${currentMerchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        // Use admin endpoint to get ALL items including inactive ones
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/merchant/${currentMerchantId}/admin`, {
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
      const token = await getAuthToken(getAccessTokenSilently);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: itemData.name.trim(),
          description: itemData.description?.trim() || '',
          base_price: Math.round(parseFloat(itemData.price) * 100), // Convert pounds to pence
          category_id: itemData.category_id || null,
          display_order: items.length + 1,
          image_url: itemData.image_url || null,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const newItemId = responseData.data?.id;
        
        // If option groups were selected, assign them to the new item
        if (newItemId && itemData.optionGroupIds && itemData.optionGroupIds.length > 0) {
          for (const groupId of itemData.optionGroupIds) {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${newItemId}/sub-groups`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sub_group_id: groupId }),
              });
            } catch (error) {
              console.error(`Failed to assign option group ${groupId}:`, error);
              // Continue with other groups even if one fails
            }
          }
        }
        
        setIsCreating(false);
        await fetchData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Re-throw so form can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const token = await getAuthToken(getAccessTokenSilently);

      // Use the toggle endpoint that works for merchants
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${itemId}/toggle-active`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleEditItem = async (item: MenuItem) => {
    console.log('handleEditItem called with item:', item);
    // Fetch the full item with option groups
    try {
      const token = await getAuthToken(getAccessTokenSilently);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/menu/${item.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        console.log('data.option_groups:', data.option_groups);
        
        const updatedItem = {
          ...item,
          option_groups: data.option_groups || []
        };
        console.log('Setting editingItem to:', updatedItem);
        
        setEditingItem(updatedItem);
      } else {
        setEditingItem(item);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      setEditingItem(item);
    }
  };

  const handleUpdateItem = async (updatedData: any) => {
    if (!editingItem) return;

    try {
      const token = await getAuthToken(getAccessTokenSilently);

      console.log('Updating item with data:', updatedData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Menu item updated successfully:', result);
        fetchData(); // Refresh the list
        setEditingItem(null);
      } else {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      throw error; // Re-throw so modal can handle it
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

        {isCreating && merchantId && authToken && (
          <CreateMenuItemForm
            categories={categories}
            onSubmit={createItem}
            onCancel={() => setIsCreating(false)}
            isSubmitting={isSubmitting}
            merchantId={merchantId}
            authToken={authToken}
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
                  title={item.name}
                  description={item.description}
                  basePrice={item.price}
                  categoryName={categories.find(cat => cat.id === item.category_id)?.name || 'Unknown Category'}
                  isActive={item.is_available}
                  displayOrder={item.display_order}
                  onToggleAvailability={toggleItemAvailability}
                  onEdit={() => handleEditItem(item)}
                />
              </Grid.Item>
            ))
          )}
        </Grid.Container>

        {/* Edit Item Modal */}
        {editingItem && merchantId && authToken && (
          <EditMenuItemModal
            item={editingItem}
            categories={categories}
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleUpdateItem}
            merchantId={merchantId}
            authToken={authToken}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}