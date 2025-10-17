'use client';

import React, { useState } from 'react';
import { Typography, Button, FormInput, FormSelect, FormCheckbox } from '@/components/atoms';
import { ExpandableCard, EditableListItem, ConfirmationModal, AddSubItemModal } from '@/components/molecules';
import { Badge } from '@/components/atoms/Badge';
import { SubItemGroup, SubItem, UpdateSubGroupData, CreateSubItemData, UpdateSubItemData } from '@/services/subItemsAPI';
import styles from './SubGroupCard.module.scss';

export interface SubGroupCardProps {
  group: SubItemGroup;
  showMerchantName?: boolean;
  onUpdateGroup: (data: UpdateSubGroupData) => void;
  onDeleteGroup: () => void;
  onCreateItem: (data: CreateSubItemData) => void;
  onUpdateItem: (itemId: string, data: UpdateSubItemData) => void;
  onDeleteItem: (itemId: string) => void;
}

// Group Edit Form Component
const GroupEditForm: React.FC<{
  group: SubItemGroup;
  onSave: (data: UpdateSubGroupData) => void;
  onCancel: () => void;
}> = ({ group, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: group.name,
    selection_type: group.selection_type,
    is_required: group.is_required,
    max_selections: group.max_selections?.toString() || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      selection_type: formData.selection_type,
      is_required: formData.is_required,
      max_selections: formData.max_selections ? parseInt(formData.max_selections) : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.editForm__grid}>
        <FormInput
          label="Group Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          size="md"
        />
        
        <FormSelect
          label="Selection Type"
          value={formData.selection_type}
          onChange={(e) => setFormData({ ...formData, selection_type: e.target.value as 'single' | 'multiple' })}
          options={[
            { value: 'single', label: 'Single Choice (radio buttons)' },
            { value: 'multiple', label: 'Multiple Choice (checkboxes)' }
          ]}
          required
          size="md"
        />
        
        {formData.selection_type === 'multiple' && (
          <FormInput
            label="Maximum Selections (optional)"
            type="number"
            value={formData.max_selections}
            onChange={(e) => setFormData({ ...formData, max_selections: e.target.value })}
            helpText="Leave empty for unlimited selections"
            size="md"
          />
        )}
      </div>
      
      <FormCheckbox
        label="Required for customers"
        checked={formData.is_required}
        onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
        size="md"
      />
      
      <div className={styles.editForm__actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

// Item Edit Form Component
const ItemEditForm: React.FC<{
  item: SubItem;
  onSave: (data: UpdateSubItemData) => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    additional_price: (item.additional_price / 100).toFixed(2),
    is_active: item.is_active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      additional_price: Math.round(parseFloat(formData.additional_price) * 100),
      is_active: formData.is_active
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.editForm__grid}>
        <FormInput
          label="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          size="md"
        />
        
        <FormInput
          label="Additional Price (£)"
          type="number"
          step="0.01"
          value={formData.additional_price}
          onChange={(e) => setFormData({ ...formData, additional_price: e.target.value })}
          helpText="Enter 0 for no additional charge"
          size="md"
        />
      </div>
      
      <FormCheckbox
        label="Active (available to customers)"
        checked={formData.is_active}
        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
        size="md"
      />
      
      <div className={styles.editForm__actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export const SubGroupCard: React.FC<SubGroupCardProps> = ({
  group,
  showMerchantName = false,
  onUpdateGroup,
  onDeleteGroup,
  onCreateItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [editingGroup, setEditingGroup] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);

  const handleUpdateGroup = (data: UpdateSubGroupData) => {
    onUpdateGroup(data);
    setEditingGroup(false);
  };

  const handleUpdateItem = (itemId: string, data: UpdateSubItemData) => {
    onUpdateItem(itemId, data);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    onDeleteItem(itemId);
    setDeletingItem(null);
  };

  const itemToDelete = group.sub_items?.find(item => item.id === deletingItem);

  return (
    <>
      <ExpandableCard
        title={group.name}
        badges={[
          {
            text: group.selection_type === 'single' ? 'Single Choice' : 'Multiple Choice',
            variant: group.selection_type === 'single' ? 'info' : 'warning'
          },
          ...(group.is_required ? [{
            text: 'Required',
            variant: 'required' as const
          }] : []),
          {
            text: `${group.sub_items?.length || 0} ${(group.sub_items?.length || 0) === 1 ? 'item' : 'items'}`,
            variant: 'default' as const
          }
        ]}
        headerActions={
          <div className={styles.subGroupCard__headerActions}>
            {showMerchantName && group.merchant_name && (
              <Typography variant="body-small" className={styles.subGroupCard__merchantName}>
                {group.merchant_name}
              </Typography>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddItemModal(true)}
            >
              Add Option
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditingGroup(true)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteGroup}
            >
              Delete
            </Button>
          </div>
        }
        defaultExpanded={false}
      >
        {editingGroup ? (
          <GroupEditForm
            group={group}
            onSave={handleUpdateGroup}
            onCancel={() => setEditingGroup(false)}
          />
        ) : (
          <div className={styles.subGroupCard__content}>
            <div className={styles.subGroupCard__info}>
              <Typography variant="body-medium">
                <strong>Selection Type:</strong> {group.selection_type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                {group.selection_type === 'multiple' && group.max_selections && (
                  <span> (max {group.max_selections})</span>
                )}
              </Typography>
              <Typography variant="body-medium">
                <strong>Required:</strong> {group.is_required ? 'Yes' : 'No'}
              </Typography>
            </div>

            {!group.sub_items || group.sub_items.length === 0 ? (
              <div className={styles.subGroupCard__empty}>
                <Typography variant="body-medium">
                  No options added yet. Click "Add Option" to create the first one.
                </Typography>
              </div>
            ) : (
              <div className={styles.subGroupCard__items}>
                <Typography variant="heading-6">
                  Options ({group.sub_items.length})
                </Typography>
                
                {group.sub_items.map(item => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <ItemEditForm
                        item={item}
                        onSave={(data) => handleUpdateItem(item.id, data)}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <EditableListItem
                        title={item.name}
                        subtitle={item.additional_price > 0 ? `+£${(item.additional_price / 100).toFixed(2)}` : 'No additional charge'}
                        badges={[
                          {
                            text: item.is_active ? 'Active' : 'Inactive',
                            variant: item.is_active ? 'success' : 'default'
                          }
                        ]}
                        canEdit={true}
                        canDelete={true}
                        onEdit={() => setEditingItem(item.id)}
                        onDelete={() => setDeletingItem(item.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ExpandableCard>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <AddSubItemModal
          groupName={group.name}
          onClose={() => setShowAddItemModal(false)}
          onSubmit={(data) => {
            onCreateItem(data);
            setShowAddItemModal(false);
          }}
        />
      )}

      {/* Delete Item Confirmation */}
      {deletingItem && itemToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          onConfirm={() => handleDeleteItem(deletingItem!)}
          title="Delete Option"
          message={`Are you sure you want to delete "${itemToDelete.name}"?`}
          confirmText="Delete"
          variant="danger"
        />
      )}
    </>
  );
};