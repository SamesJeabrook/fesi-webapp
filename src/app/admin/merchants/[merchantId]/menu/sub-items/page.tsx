'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid, FormInput, FormSelect, FormCheckbox } from '@/components/atoms';
import { AdminPageHeader, ExpandableCard, EditableListItem } from '@/components/molecules';
import { Badge } from '@/components/atoms/Badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './adminSubItems.module.scss';

interface SubItemGroup {
  id: string;
  name: string;
  description?: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number;
  display_order: number;
  merchant_id: string;
  merchant_name?: string;
  item_count: number;
  menu_item_count: number;
  sub_items: SubItem[];
  created_at: string;
  updated_at?: string;
}

interface SubItem {
  id: string;
  name: string;
  description?: string;
  additional_price: number;
  display_order: number;
  is_active: boolean;
  group_id: string;
  created_at: string;
  updated_at?: string;
}

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

// Group Edit Form Component
const GroupEditForm: React.FC<{
  group: SubItemGroup;
  onSave: (data: Partial<SubItemGroup>) => void;
  onCancel: () => void;
}> = ({ group, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || '',
    selection_type: group.selection_type,
    is_required: group.is_required,
    max_selections: group.max_selections?.toString() || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
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
        
        <FormInput
          label="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
  onSave: (data: Partial<SubItem>) => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description || '',
    additional_price: (item.additional_price / 100).toFixed(2),
    is_active: item.is_active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      additional_price: Math.round(parseFloat(formData.additional_price) * 100),
      is_active: formData.is_active
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.editForm__grid}>
        <FormInput
          label="Option Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          size="md"
        />
        
        <FormInput
          label="Price Adjustment ($)"
          type="number"
          step="0.01"
          value={formData.additional_price}
          onChange={(e) => setFormData({ ...formData, additional_price: e.target.value })}
          helpText="Enter 0 for no charge, negative for discount"
          size="md"
        />
        
        <FormInput
          label="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          size="md"
        />
      </div>
      
      <FormCheckbox
        label="Available to customers"
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

export default function AdminMenuSubItemsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [subItemGroups, setSubItemGroups] = useState<SubItemGroup[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const merchantId = params?.merchantId as string;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      // Fetch merchant and sub-groups data
      const [merchantResponse, subGroupsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-groups?merchant_id=${merchantId}`, {
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

      if (subGroupsResponse.ok) {
        const subGroupsData = await subGroupsResponse.json();
        
        if (subGroupsData.success && subGroupsData.data) {
          // Fetch detailed sub-groups with items
          const detailedSubGroups = await Promise.all(
            subGroupsData.data.map(async (group: any) => {
              try {
                const detailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-groups/${group.id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  return detailData.success ? detailData.data : group;
                }
              } catch (error) {
                console.error(`Error fetching details for group ${group.id}:`, error);
              }
              return group;
            })
          );
          
          setSubItemGroups(detailedSubGroups);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);

  const filteredGroups = selectedFilter === 'all' 
    ? subItemGroups 
    : subItemGroups.filter(group => {
        if (selectedFilter === 'required') return group.is_required;
        if (selectedFilter === 'optional') return !group.is_required;
        if (selectedFilter === 'single') return group.selection_type === 'single';
        if (selectedFilter === 'multiple') return group.selection_type === 'multiple';
        return true;
      });

  const handleGroupEdit = (groupId: string) => {
    setEditingGroup(groupId);
  };

  const handleItemEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSaveGroup = async (groupId: string, updatedData: Partial<SubItemGroup>) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSubItemGroups(groups => 
            groups.map(group => 
              group.id === groupId 
                ? { ...group, ...result.data }
                : group
            )
          );
          setEditingGroup(null);
        }
      }
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleSaveItem = async (itemId: string, updatedData: Partial<SubItem>) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-groups/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSubItemGroups(groups => 
            groups.map(group => ({
              ...group,
              sub_items: group.sub_items.map(item => 
                item.id === itemId 
                  ? { ...item, ...result.data }
                  : item
              )
            }))
          );
          setEditingItem(null);
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  console.log(merchant);

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.subItems}>
        <AdminPageHeader
          backLink={{
            href: `/admin/merchants/${merchantId}`,
            label: `Back to ${merchant?.name || 'Merchant'} Dashboard`
          }}
          adminContext={`Managing sub-items for ${merchant?.name || 'merchant'}`}
          title="Menu Sub-Items & Option Groups"
          description="Manage option groups (like sizes, add-ons) and their individual items"
        />

        {/* Action Bar */}
        <Grid.Container gap="lg" justifyContent="center" className={styles.subItems__actionBar}>
          <Grid.Item sm={16}>
            <div className={styles.subItems__actions}>
              <div className={styles.subItems__filters}>
                <Typography variant="body-medium" style={{ fontWeight: '500' }}>
                  Filter:
                </Typography>
                <FormSelect
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Groups' },
                    { value: 'required', label: 'Required Only' },
                    { value: 'optional', label: 'Optional Only' },
                    { value: 'single', label: 'Single Selection' },
                    { value: 'multiple', label: 'Multiple Selection' }
                  ]}
                  size="sm"
                />
              </div>
              <Button variant="primary" onClick={() => setIsCreatingGroup(true)}>
                Create New Group
              </Button>
            </div>
          </Grid.Item>
        </Grid.Container>

        {/* Main Content */}
        <Grid.Container gap="sm">
          {isLoading ? (
            <Grid.Item lg={12}>
              <div className={styles.subItems__loading}>
                <Typography variant="body-medium">Loading option groups...</Typography>
              </div>
            </Grid.Item>
          ) : filteredGroups.length === 0 ? (
            <Grid.Item sm={16} lg={16}>
              <div className={styles.subItems__empty}>
                <Typography variant="heading-5">
                  {selectedFilter === 'all' ? 'No option groups yet' : 'No option groups match the filter'}
                </Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                  {selectedFilter === 'all' 
                    ? 'Create the first option group for this merchant'
                    : 'Try selecting a different filter or create a new option group'
                  }
                </Typography>
              </div>
            </Grid.Item>
          ) : (
            filteredGroups.map((group) => (
              <Grid.Item sm={16} lg={8} key={group.id}>
                <ExpandableCard
                  title={group.name}
                  subtitle={`Used by ${group.menu_item_count} menu items • ${group.item_count} options`}
                  description={group.description}
                  badges={[
                    {
                      text: group.selection_type === 'single' ? 'Single Choice' : 'Multiple Choice',
                      variant: group.selection_type as 'single' | 'multiple'
                    },
                    {
                      text: group.is_required ? 'Required' : 'Optional',
                      variant: group.is_required ? 'required' : 'optional'
                    },
                    ...(group.max_selections ? [{
                      text: `Max: ${group.max_selections}`,
                      variant: 'info' as const
                    }] : [])
                  ]}
                  defaultExpanded={true}
                  headerActions={
                    editingGroup === group.id ? null : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleGroupEdit(group.id)}
                      >
                        Edit Group
                      </Button>
                    )
                  }
                  emptyState={
                    <div className={styles.subItems__emptyGroup}>
                      <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        No options in this group yet.
                      </Typography>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setIsCreatingItem(group.id)}
                        className={styles.subItems__addFirstButton}
                      >
                        Add First Option
                      </Button>
                    </div>
                  }
                >
                  {editingGroup === group.id ? (
                    <GroupEditForm 
                      group={group}
                      onSave={(data) => handleSaveGroup(group.id, data)}
                      onCancel={() => setEditingGroup(null)}
                    />
                  ) : (
                    <div className={styles.subItems__groupContent}>
                      <div className={styles.subItems__itemsHeader}>
                        <Typography variant="heading-6" style={{ color: 'var(--color-text-secondary)' }}>
                          Options in this group ({group.sub_items?.length || 0})
                        </Typography>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setIsCreatingItem(group.id)}
                        >
                          Add Option
                        </Button>
                      </div>
                      
                      <div className={styles.subItems__itemsList}>
                        {group.sub_items && group.sub_items.length > 0 && (
                          group.sub_items.map((subItem) => (
                            <EditableListItem
                              key={subItem.id}
                              title={subItem.name}
                              description={subItem.description}
                              price={subItem.additional_price}
                              badges={[
                                ...(subItem.is_active ? [] : [{ text: 'Inactive', variant: 'warning' as const }])
                              ]}
                              isEditing={editingItem === subItem.id}
                              onEdit={() => handleItemEdit(subItem.id)}
                              editForm={
                                <ItemEditForm 
                                  item={subItem}
                                  onSave={(data) => handleSaveItem(subItem.id, data)}
                                  onCancel={() => setEditingItem(null)}
                                />
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </ExpandableCard>
              </Grid.Item>
            ))
          )}
        </Grid.Container>
      </div>
    </ProtectedRoute>
  );
}