'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { MenuList, MenuEditor } from '@/components/organisms';
import { ConfirmationModal } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import { getMerchantIdFromDevToken } from '@/utils/devAuth';
import { Menu, CreateMenuPayload, UpdateMenuPayload } from '@/types/menu.types';
import styles from './menus.module.scss';

interface MenuItem {
  id: string;
  title: string;
  category_name?: string;
  base_price: number;
}

export default function MenusPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
  const [merchantId, setMerchantId] = useState<string>('');
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

  // Get merchant ID on mount
  useEffect(() => {
    const fetchMerchantId = async () => {
      try {
        // Check for dev token first
        const devMerchantId = getMerchantIdFromDevToken();
        
        if (devMerchantId) {
          console.log('Using dev merchant ID:', devMerchantId);
          setMerchantId(devMerchantId);
        } else {
          // Get from /me endpoint
          console.log('Fetching merchant ID from /api/merchants/me...');
          const response = await api.get('/api/merchants/me');
          console.log('Merchant response received:', response);
          // API returns { success: true, data: { id, ... } }
          const merchantData = response.data || response;
          setMerchantId(merchantData.id);
        }
      } catch (error) {
        console.error('Error fetching merchant ID:', error);
        alert('Failed to get merchant information. Please ensure you have completed merchant onboarding.');
      }
    };

    fetchMerchantId();
  }, []);

  useEffect(() => {
    if (merchantId) {
      loadMenus();
      loadAvailableItems();
    }
  }, [merchantId]);

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

  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <div className={styles.page__header}>
          <div>
            <Typography variant="heading-2">Menu Management</Typography>
            <Typography variant="body" color="secondary">
              Create and manage different menus for your events
            </Typography>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/merchant/admin')}
          >
            ← Back to Dashboard
          </Button>
        </div>

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
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, menuId: null, menuName: '' })}
          variant="danger"
        />
      </div>
    </ProtectedRoute>
  );
}
