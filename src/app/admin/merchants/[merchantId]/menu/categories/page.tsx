'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { AdminPageHeader, CategoryCard, EditCategoryModal } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAuthToken } from '@/utils/devAuth';
import api from '@/utils/api';
import Link from 'next/link';
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

      // Fetch merchant details and categories in parallel
      const [merchantData, categoriesData] = await Promise.all([
        api.get(`/api/merchants/${merchantId}`),
        api.get(`/api/menu/categories?merchant_id=${merchantId}`)
      ]);

      setMerchant(merchantData.data);

      if (categoriesData.success && categoriesData.data) {
        setCategories(categoriesData.data);
      } else {
        console.error('❌ Categories fetch error:', categoriesData);
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
      await api.post('/api/menu/categories', {
        merchant_id: merchantId,
        name: newCategory.name,
        display_order: categories.length + 1,
      });

      setNewCategory({ name: '', description: '' });
      setIsCreating(false);
      fetchData();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEditCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setEditingCategory(category);
    }
  };

  const handleUpdateCategory = async (categoryId: string, updatedData: Partial<MenuCategory>) => {
    try {
      await api.put(`/api/menu/categories/${categoryId}`, updatedData);
      fetchData(); // Refresh the categories list
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const confirmMessage = `Are you sure you want to delete the category "${category.name}"?\n\nThis will remove the category, but any menu items in this category will NOT be deleted - they will become uncategorized.`;
    
    if (!confirm(confirmMessage)) return;

    try {
      await api.delete(`/api/menu/categories/${categoryId}`);
      fetchData(); // Refresh the categories list
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete category';
      
      if (errorMessage.includes('being used by menu items')) {
        alert('Cannot delete this category because it contains menu items.\n\nPlease move or delete all items in this category first, then try again.');
      } else {
        alert(`Failed to delete category: ${errorMessage}`);
      }
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
                  onDelete={handleDeleteCategory}
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