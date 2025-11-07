'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { AdminPageHeader, MenuItemManagementCard } from '@/components/molecules';
import { CreateMenuItemForm } from '@/components/organisms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import EditItemModal from './components/EditItemModal';
import styles from './adminItems.module.scss';

interface MenuItem {
  id: string;
  title: string; // API returns 'title', not 'name'
  description?: string;
  base_price: number;
  category_id: string;
  category_name?: string;
  is_active: boolean; // API returns 'is_active', not 'is_available'
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

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
      const [merchantResponse, menuResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/merchant/${merchantId}/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/categories?merchant_id=${merchantId}`, {
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

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        }
      }

      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        // Extract items from menu data
        if (menuData.success && menuData.data && menuData.data.menu) {

          // Extract all items from all categories
          const allItems: MenuItem[] = [];
          menuData.data.menu.forEach((category: any) => {
            if (category.items && Array.isArray(category.items)) {
              category.items.forEach((item: any) => {
                allItems.push({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  base_price: item.base_price,
                  category_id: item.category_id, // Use the actual UUID category_id
                  category_name: category.name,  // Keep category name for display
                  is_active: item.is_active,
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

  const createItem = async (itemData: {
    name: string;
    description: string;
    price: string;
    category_id: string;
  }) => {
    setIsSubmitting(true);
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const requestData = {
        title: itemData.name.trim(),
        description: itemData.description?.trim() || '',
        base_price: Math.round(parseFloat(itemData.price) * 100), // Convert pounds to pence
        category_id: itemData.category_id || null,
        merchant_id: merchantId,
        display_order: items.length + 1,
      };

      console.log('Creating menu item with data:', requestData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Menu item created successfully:', result);
        setIsCreating(false);
        await fetchData();
      } else {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || 'Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Re-throw so form can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItemAvailability = async (itemId: string, isActive: boolean) => {
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
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (updatedData: Partial<MenuItem>) => {
    if (!editingItem) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

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
              <Grid.Item sm={16}>
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
                  <CreateMenuItemForm
                    categories={categories}
                    onSubmit={createItem}
                    onCancel={() => setIsCreating(false)}
                    isSubmitting={isSubmitting}
                  />
                </Grid.Item>
              </Grid.Container>
            )}

            {/* Items List Section */}
            <Grid.Container gap="lg" justifyContent="start" className={styles.items__listSection}>
              {isLoading ? (
                <Grid.Item>
                  <div className={styles.items__loading}>
                    <Typography variant="body-medium">Loading items...</Typography>
                  </div>
                </Grid.Item>
              ) : filteredItems.length === 0 ? (
                <Grid.Item sm={16} md={8} lg={4}>
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
                  <Grid.Item sm={16} md={8} xl={4} key={item.id}>
                    <MenuItemManagementCard
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      basePrice={item.base_price}
                      categoryName={categories.find(cat => cat.id === item.category_id)?.name || 'Unknown Category'}
                      isActive={item.is_active}
                      displayOrder={item.display_order}
                      onToggleAvailability={toggleItemAvailability}
                      onEdit={() => handleEditItem(item)}
                    />
                  </Grid.Item>
                ))
              )}
            </Grid.Container>
          </>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <EditItemModal
            item={editingItem}
            categories={categories}
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleUpdateItem}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}