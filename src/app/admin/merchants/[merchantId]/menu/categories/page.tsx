'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './adminCategories.module.scss';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

  const merchantId = params?.merchantId as string;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      // Fetch merchant details and categories in parallel
      const [merchantResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/menu/categories`, {
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
        setCategories(categoriesData.categories || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.name.trim()) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/menu/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          display_order: categories.length + 1,
        }),
      });

      if (response.ok) {
        setNewCategory({ name: '', description: '' });
        setIsCreating(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const toggleCategoryStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/menu/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating category:', error);
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
        <div className={styles.categories__header}>
          <div className={styles.categories__headerContent}>
            <Link href={`/admin/merchants/${merchantId}`} className={styles.categories__backLink}>
              ← Back to {merchant?.business_name || 'Merchant'} Dashboard
            </Link>
            <div className={styles.categories__adminBadge}>
              <span className={styles.categories__badge}>🔧 ADMIN MODE</span>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Managing menu categories for {merchant?.business_name || 'merchant'}
              </Typography>
            </div>
            <Typography variant="heading-3">
              Menu Categories
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Organize menu items into categories for this merchant
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

        <div className={styles.categories__list}>
          {isLoading ? (
            <div className={styles.categories__loading}>
              <Typography variant="body-medium">Loading categories...</Typography>
            </div>
          ) : categories.length === 0 ? (
            <div className={styles.categories__empty}>
              <Typography variant="heading-5">No categories yet</Typography>
              <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Create the first menu category for this merchant
              </Typography>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className={styles.categories__item}>
                <div className={styles.categories__itemContent}>
                  <div className={styles.categories__itemHeader}>
                    <Typography variant="heading-5">
                      {category.name}
                    </Typography>
                    <span className={`${styles.categories__status} ${
                      category.is_active ? styles['categories__status--active'] : styles['categories__status--inactive']
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {category.description && (
                    <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {category.description}
                    </Typography>
                  )}
                  <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                    Order: {category.display_order}
                  </Typography>
                </div>
                <div className={styles.categories__itemActions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                  >
                    {category.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Link href={`/admin/merchants/${merchantId}/menu/categories/${category.id}/edit`}>
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