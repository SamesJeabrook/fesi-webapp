'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { AdminPageHeader, CategoryCard } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAuthToken } from '@/utils/devAuth';
import Link from 'next/link';
import { EditCategoryModal } from './components/EditCategoryModal';
import styles from './adminCategories.module.scss';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
}

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMenuCategoriesPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const merchantId = params?.merchantId as string;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken(getAccessTokenSilently);

      // Fetch merchant details and categories in parallel
      const [merchantResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
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
      } else {
        const errorData = await categoriesResponse.json();
        console.error('❌ Categories fetch error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // If it's an Auth0 error, show more details
      if (error && typeof error === 'object' && 'error' in error && error.error === 'login_required') {
        console.error('⚠️ Auth0 session expired. User needs to log in again.');
        alert('Your session has expired. Please log in again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.name.trim()) return;

    try {
      const token = await getAuthToken(getAccessTokenSilently);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: merchantId,
          name: newCategory.name,
          display_order: categories.length + 1,
        }),
      });

      if (response.ok) {
        setNewCategory({ name: '', description: '' });
        setIsCreating(false);
        fetchData();
      } else {
        const errorData = await response.json();
        console.error('Error creating category:', errorData);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async (updatedData: Partial<MenuCategory>) => {
    if (!editingCategory) return;

    try {
      const token = await getAuthToken(getAccessTokenSilently);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        fetchData(); // Refresh the categories list
      } else {
        const errorData = await response.json();
        console.error('Error updating category:', errorData);
        throw new Error(errorData.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.categories}>
        {/* Header Section */}
        <AdminPageHeader
          backLink={{
            href: `/admin/merchants/${merchantId}`,
            label: `Back to ${merchant?.business_name || 'Merchant'} Dashboard`
          }}
          adminContext={`Managing menu categories for ${merchant?.name || 'merchant'}`}
          title="Menu Categories"
          description="Organize menu items into categories for this merchant"
          actions={
            <Button
              variant="primary"
              onClick={() => setIsCreating(true)}
              className={styles.categories__createButton}
            >
              + Add Category
            </Button>
          }
        />

        {/* Create Form Section */}
        {isCreating && (
          <Grid.Container gap="lg" className={styles.categories__createSection}>
            <Grid.Item lg={12} xl={8} className={styles.categories__createFormWrapper}>
              <div className={styles.categories__createForm}>
                <Typography variant="heading-5" className={styles.categories__formTitle}>
                  Create New Category
                </Typography>
                
                <div className={styles.categories__formGroup}>
                  <label htmlFor="categoryName">Category Name</label>
                  <input
                    id="categoryName"
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Appetizers, Main Courses, Desserts"
                    className={styles.categories__input}
                  />
                </div>
                
                <div className={styles.categories__formActions}>
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={createCategory}>
                    Create Category
                  </Button>
                </div>
              </div>
            </Grid.Item>
          </Grid.Container>
        )}

        {/* Categories List Section */}
        <Grid.Container gap="lg" className={styles.categories__listSection}>
          {isLoading ? (
            <Grid.Item className={styles.categories__loadingWrapper}>
              <div className={styles.categories__loading}>
                <Typography variant="body-medium">Loading categories...</Typography>
              </div>
            </Grid.Item>
          ) : categories.length === 0 ? (
            <Grid.Item md={12} lg={8} className={styles.categories__emptyWrapper}>
              <div className={styles.categories__empty}>
                <Typography variant="heading-5">No categories yet</Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Create the first menu category for this merchant
                </Typography>
              </div>
            </Grid.Item>
          ) : (
            categories.map((category) => (
              <Grid.Item sm={16} md={8} xl={4} key={category.id}>
                <CategoryCard
                  id={category.id}
                  name={category.name}
                  description={category.description}
                  displayOrder={category.display_order}
                  onEdit={handleEditCategory}
                />
              </Grid.Item>
            ))
          )}
        </Grid.Container>

        {/* Edit Category Modal */}
        {editingCategory && (
          <EditCategoryModal
            category={editingCategory}
            isOpen={!!editingCategory}
            onClose={() => setEditingCategory(null)}
            onSave={handleUpdateCategory}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}