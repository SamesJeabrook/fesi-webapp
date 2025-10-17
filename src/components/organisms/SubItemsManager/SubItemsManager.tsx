'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, GridContainer, GridItem } from '@/components/atoms';
import { AdminPageHeader, ConfirmationModal, AddSubGroupModal } from '@/components/molecules';
import { SubItemsAPIInterface, SubItemGroup, CreateSubGroupData } from '@/services/subItemsAPI';
import { SubGroupCard } from './SubGroupCard';
import styles from './SubItemsManager.module.scss';

export interface SubItemsManagerProps {
  api: SubItemsAPIInterface;
  title: string;
  description: string;
  showMerchantName?: boolean;
  backLink?: { label: string; href: string };
  adminContext?: string;
  onError?: (error: string) => void;
}

export const SubItemsManager: React.FC<SubItemsManagerProps> = ({
  api,
  title,
  description,
  showMerchantName = false,
  backLink,
  adminContext,
  onError
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [subGroups, setSubGroups] = useState<SubItemGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<string | null>(null);

  // Update auth headers function
  const updateAuthHeaders = async () => {
    try {
      const token = await getAccessTokenSilently();
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to get access token:', error);
      if (onError) {
        onError('Authentication failed');
      }
    }
  };

  // Load sub-groups
  const loadSubGroups = async () => {
    try {
      setLoading(true);
      await updateAuthHeaders();
      const groups = await api.getGroups();
      setSubGroups(groups);
    } catch (error) {
      console.error('Failed to load sub-groups:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sub-groups';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create group
  const handleCreateGroup = async (data: CreateSubGroupData) => {
    try {
      await updateAuthHeaders();
      await api.createGroup(data);
      await loadSubGroups(); // Reload data
      setShowAddGroupModal(false);
    } catch (error) {
      console.error('Failed to create group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create group';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Update group
  const handleUpdateGroup = async (groupId: string, data: any) => {
    try {
      await updateAuthHeaders();
      await api.updateGroup(groupId, data);
      await loadSubGroups(); // Reload data
    } catch (error) {
      console.error('Failed to update group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update group';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Delete group
  const handleDeleteGroup = async (groupId: string) => {
    try {
      await updateAuthHeaders();
      await api.deleteGroup(groupId);
      await loadSubGroups(); // Reload data
      setDeletingGroup(null);
    } catch (error) {
      console.error('Failed to delete group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete group';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Create item
  const handleCreateItem = async (groupId: string, data: any) => {
    try {
      await updateAuthHeaders();
      await api.createItem(groupId, data);
      await loadSubGroups(); // Reload data
    } catch (error) {
      console.error('Failed to create item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Update item
  const handleUpdateItem = async (itemId: string, data: any) => {
    try {
      await updateAuthHeaders();
      await api.updateItem(itemId, data);
      await loadSubGroups(); // Reload data
    } catch (error) {
      console.error('Failed to update item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    try {
      await updateAuthHeaders();
      await api.deleteItem(itemId);
      await loadSubGroups(); // Reload data
    } catch (error) {
      console.error('Failed to delete item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Load data on mount
  useEffect(() => {
    loadSubGroups();
  }, []);

  const groupToDelete = subGroups.find(g => g.id === deletingGroup);

  return (
    <div className={styles.subItemsManager}>
      <AdminPageHeader
        title={title}
        description={description}
        backLink={backLink}
        adminContext={adminContext}
        actions={
          <Button
            variant="primary"
            onClick={() => setShowAddGroupModal(true)}
            isDisabled={loading}
          >
            Add Option Group
          </Button>
        }
      />

      <GridContainer>
        {loading ? (
          <div className={styles.subItemsManager__loading}>
            <Typography variant="body-medium">Loading sub-groups...</Typography>
          </div>
        ) : subGroups.length === 0 ? (
          <div className={styles.subItemsManager__empty}>
            <Typography variant="heading-4">No Option Groups</Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Create your first option group to start adding customization options to your menu items.
            </Typography>
            <Button
              variant="primary"
              onClick={() => setShowAddGroupModal(true)}
              className={styles.subItemsManager__emptyButton}
            >
              Add Option Group
            </Button>
          </div>
        ) : (
          <>
            {subGroups.map(group => (
              <GridItem sm={16} md={8} key={group.id}>
                <SubGroupCard
                  group={group}
                  showMerchantName={showMerchantName}
                  onUpdateGroup={(data) => handleUpdateGroup(group.id, data)}
                  onDeleteGroup={() => setDeletingGroup(group.id)}
                  onCreateItem={(data) => handleCreateItem(group.id, data)}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                />
              </GridItem>
            ))}
          </>
        )}
      </GridContainer>

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <AddSubGroupModal
          onClose={() => setShowAddGroupModal(false)}
          onSubmit={handleCreateGroup}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingGroup && groupToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setDeletingGroup(null)}
          onConfirm={() => handleDeleteGroup(deletingGroup)}
          title="Delete Option Group"
          message={`Are you sure you want to delete "${groupToDelete.name}"? This will also delete all ${groupToDelete.sub_items.length} items in this group.`}
          confirmText="Delete"
          variant="danger"
        />
      )}
    </div>
  );
};