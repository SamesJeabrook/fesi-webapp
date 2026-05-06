'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { CategoryCard, EditCategoryModal } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAuthToken, getMerchantIdFromDevToken } from '@/utils/devAuth';
import api from '@/utils/api';
import Link from 'next/link';
import styles from './categories.module.scss';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function MenuCategoriesPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  // Get merchant ID from dev token or API
  useEffect(() => {
    const getMerchantId = async () => {
      // Check for dev token first
      const devMerchantId = getMerchantIdFromDevToken();
      if (devMerchantId) {
        setMerchantId(devMerchantId);
        return;
      }

      // For real Auth0 tokens, get merchant_ids from /api/auth/me
      try {
        const userData = await api.get('/api/auth/me');
        const merchantIds = userData.user?.merchant_ids || [];
        
        if (merchantIds.length > 0) {
          setMerchantId(merchantIds[0]);
          console.log('[Auth0] User merchant_id:', merchantIds[0]);
        } else {
          console.error('No merchant ID found for user');
        }
      } catch (error) {
        console.error('Error fetching merchant ID:', error);
      }
    };

    getMerchantId();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      const data = await api.get(`/api/menu/categories?merchant_id=${merchantId}`);
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.name.trim() || !merchantId) return;

    try {
      await api.post('/api/menu/categories', {
        name: newCategory.name,
        description: newCategory.description,
        display_order: categories.length + 1,
        merchant_id: merchantId,
      });

      setNewCategory({ name: '', description: '' });
      setIsCreating(false);
      fetchCategories();
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
      fetchCategories(); // Refresh the categories list
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
      fetchCategories(); // Refresh the categories list
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
      fetchCategories();
    }
  }, [merchantId]);

  return (
    <ProtectedRoute requireRole={['merchant', 'admin']}>
      <div className={styles.categories}>
        <div className={styles.categories__header}>
          <div className={styles.categories__headerContent}>
            <Link href="/merchant/admin" className={styles.categories__backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-3">
              Menu Categories
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Organize your menu items into categories
            </Typography>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreating(true)}
            className={styles.categories__createButton}
          >
            + Add Category
          </Button>
        </div>

        {isCreating && (
          <div className={styles.categories__createForm}>
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
            <div className={styles.categories__formGroup}>
              <label htmlFor="categoryDescription">Description (Optional)</label>
              <textarea
                id="categoryDescription"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category"
                className={styles.categories__textarea}
                rows={3}
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
        )}

        <Grid.Container gap="lg" justifyContent="start" className={styles.categories__list}>
          {isLoading ? (
            <Grid.Item>
              <div className={styles.categories__loading}>
                <Typography variant="body-medium">Loading categories...</Typography>
              </div>
            </Grid.Item>
          ) : categories.length === 0 ? (
            <Grid.Item sm={16} md={8} lg={4}>
              <div className={styles.categories__empty}>
                <Typography variant="heading-5">No categories yet</Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Create your first menu category to get started
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