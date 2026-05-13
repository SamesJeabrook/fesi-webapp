'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { MenuList, MenuEditor } from '@/components/organisms';
import { ConfirmationModal, AdminPageHeader } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import { Menu, CreateMenuPayload, UpdateMenuPayload } from '@/types/menu.types';
import styles from './adminMenus.module.scss';

interface MenuItem {
  id: string;
  merchant_id: string;
  category_id: string;
  title: string;
  description: string;
  image_url: string;
  base_price: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  category_order: number;
  has_options: boolean;
}

interface Category {
  name: string;
  display_order: number;
  items: MenuItem[];
}

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMenusPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params?.merchantId as string;
  
  const [menus, setMenus] = useState<Menu[]>([]);
  const [availableItems, setAvailableItems] = useState<Category[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    menuId: string | null;
    menuName: string;
  }>({
    show: false,
    menuId: null,
    menuName: '',
  });

  useEffect(() => {
    if (merchantId) {
      loadMerchant();
      loadMenus();
      loadAvailableItems();
    }
  }, [merchantId]);

  const loadMerchant = async () => {
    try {
      const data = await api.get(`/api/merchants/${merchantId}`);
      setMerchant(data.data || data);
    } catch (error) {
      console.error('Error loading merchant:', error);
    }
  };

  const loadMenus = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Menu[]>(`/api/menus/merchant/${merchantId}`);
      setMenus(data);
    } catch (error) {
      console.error('Error loading menus:', error);
      alert('Failed to load menus');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableItems = async () => {
    try {
      const response = await api.get<any>(`/api/menu/merchant/${merchantId}/admin`);
      // Extract menu items from the nested response structure
      const items = response.data?.menu || [];
      setAvailableItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const handleCreateMenu = () => {
    setEditingMenu(null);
    setShowEditor(true);
  };

  const handleEditMenu = async (menuId: string) => {
    try {
      const menu = await api.get<Menu>(`/api/menus/${menuId}`);
      setEditingMenu(menu);
      setShowEditor(true);
    } catch (error) {
      console.error('Error loading menu:', error);
      alert('Failed to load menu');
    }
  };

  const handleDeleteMenu = (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId);
    if (menu) {
      setDeleteConfirm({
        show: true,
        menuId,
        menuName: menu.name,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.menuId) return;

    try {
      await api.delete(`/api/menus/${deleteConfirm.menuId}`);
      setMenus(menus.filter((m) => m.id !== deleteConfirm.menuId));
      setDeleteConfirm({ show: false, menuId: null, menuName: '' });
    } catch (error: any) {
      console.error('Error deleting menu:', error);
      alert(error.message || 'Failed to delete menu');
    }
  };

  const handleSetDefaultMenu = async (menuId: string) => {
    try {
      await api.put(`/api/menus/${menuId}/set-default`);
      await loadMenus(); // Reload to update default status
    } catch (error) {
      console.error('Error setting default menu:', error);
      alert('Failed to set default menu');
    }
  };

  const handleSubmit = async (payload: CreateMenuPayload | UpdateMenuPayload) => {
    try {
      setIsSubmitting(true);

      if (editingMenu) {
        // Update existing menu
        await api.put(`/api/menus/${editingMenu.id}`, payload);
      } else {
        // Create new menu
        await api.post('/api/menus', payload);
      }

      await loadMenus();
      setShowEditor(false);
      setEditingMenu(null);
    } catch (error: any) {
      console.error('Error saving menu:', error);
      alert(error.message || 'Failed to save menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingMenu(null);
  };

  const merchantName = merchant?.business_name || merchant?.name || 'Merchant';

  return (
    <ProtectedRoute requireRole="admin">
      <div className={styles.page}>
        <AdminPageHeader
          title="Menu Management"
          description={`Manage menus for ${merchantName}`}
          backLink={{
            href: `/admin/merchants/${merchantId}`,
            label: 'Back to Merchant',
          }}
        />

        <div className={styles.page__content}>
          {showEditor ? (
            <MenuEditor
              menu={editingMenu}
              availableItems={availableItems}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              merchantId={merchantId}
            />
          ) : (
            <MenuList
              menus={menus}
              isLoading={isLoading}
              onCreateMenu={handleCreateMenu}
              onEditMenu={handleEditMenu}
              onDeleteMenu={handleDeleteMenu}
              onSetDefaultMenu={handleSetDefaultMenu}
            />
          )}
        </div>

        <ConfirmationModal
          isOpen={deleteConfirm.show}
          title="Delete Menu"
          message={`Are you sure you want to delete "${deleteConfirm.menuName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onClose={() => setDeleteConfirm({ show: false, menuId: null, menuName: '' })}
          variant="danger"
        />
      </div>
    </ProtectedRoute>
  );
}
