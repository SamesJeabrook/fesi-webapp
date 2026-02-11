"use client";

/**
 * EditMenuItemModal Component
 * 
 * A reusable modal for editing menu items with support for:
 * - Basic item details (name, price, description, category)
 * - Image upload with preview
 * - Display order management
 * - Option groups assignment (customization options)
 */

import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@/components/atoms';
import { FormInput, FormSelect, FormTextArea } from '@/components/atoms';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { Modal } from '@/components/molecules';
import OptionGroupSelector, { SubItemGroup } from '../OptionGroupSelector';
import { EditMenuItemModalProps } from './EditMenuItemModal.types';
import api from '@/utils/api';
import styles from './EditMenuItemModal.module.scss';

export const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  item,
  categories,
  isOpen,
  onClose,
  onSave,
  merchantId,
}) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description || '',
    price: (item.price / 100).toFixed(2), // Convert pence to pounds
    category_id: item.category_id,
    display_order: item.display_order.toString(),
    image_url: item.image_url || '',
    is_age_restricted: item.is_age_restricted || false,
    minimum_age: item.minimum_age || 18,
    restriction_type: item.restriction_type || 'alcohol',
    restriction_warning: item.restriction_warning || '',
    requires_id_verification: item.requires_id_verification || false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(item.image_url || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Option groups state
  const [availableOptionGroups, setAvailableOptionGroups] = useState<SubItemGroup[]>([]);
  const [selectedOptionGroupIds, setSelectedOptionGroupIds] = useState<number[]>([]);
  const [isLoadingOptionGroups, setIsLoadingOptionGroups] = useState(false);
  const [optionGroupsError, setOptionGroupsError] = useState<string>('');

  // Fetch available option groups when modal opens
  useEffect(() => {
    if (isOpen && merchantId) {
      fetchOptionGroups();
    }
  }, [isOpen, merchantId]);

  // Initialize selected option groups from item
  useEffect(() => {
    console.log('EditMenuItemModal - Item option_groups:', item.option_groups);
    if (item.option_groups) {
      const groupIds = item.option_groups.map(g => g.id);
      console.log('EditMenuItemModal - Setting selected IDs:', groupIds);
      setSelectedOptionGroupIds(groupIds);
    } else {
      console.log('EditMenuItemModal - No option_groups on item');
      setSelectedOptionGroupIds([]);
    }
  }, [item]);

  // Reset form when item changes
  useEffect(() => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: (item.price / 100).toFixed(2),
      category_id: item.category_id,
      display_order: item.display_order.toString(),
      image_url: item.image_url || '',
      is_age_restricted: item.is_age_restricted || false,
      minimum_age: item.minimum_age || 18,
      restriction_type: item.restriction_type || 'alcohol',
      restriction_warning: item.restriction_warning || '',
      requires_id_verification: item.requires_id_verification || false,
    });
    setImagePreview(item.image_url || '');
    setImageFile(null);
  }, [item]);

  const fetchOptionGroups = async () => {
    setIsLoadingOptionGroups(true);
    setOptionGroupsError('');
    
    try {
      const data = await api.get(`/api/sub-groups?merchant_id=${merchantId}`);
      setAvailableOptionGroups(data.data || []);
    } catch (error) {
      console.error('Error fetching option groups:', error);
      setOptionGroupsError('Failed to load option groups. Please try again.');
    } finally {
      setIsLoadingOptionGroups(false);
    }
  };

  const handleOptionGroupChange = async (newSelectedIds: number[]) => {
    // Determine which groups were added and which were removed
    const addedIds = newSelectedIds.filter(id => !selectedOptionGroupIds.includes(id));
    const removedIds = selectedOptionGroupIds.filter(id => !newSelectedIds.includes(id));

    console.log('Option group change:', { newSelectedIds, addedIds, removedIds });

    try {
      // Add new groups
      for (const groupId of addedIds) {
        console.log(`Adding option group ${groupId} to item ${item.id}`);
        const result = await api.post(`/api/menu/${item.id}/sub-groups`, { sub_group_id: groupId });
        console.log('Add response:', result);
      }

      // Remove groups
      for (const groupId of removedIds) {
        console.log(`Removing option group ${groupId} from item ${item.id}`);
        const result = await api.delete(`/api/menu/${item.id}/sub-groups/${groupId}`);
        console.log('Remove response:', result);
      }

      // Update local state
      setSelectedOptionGroupIds(newSelectedIds);
    } catch (error) {
      console.error('Error updating option groups:', error);
      alert('Failed to update option groups. Please try again.');
      // Revert to previous state on error
      setSelectedOptionGroupIds(selectedOptionGroupIds);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File) => {
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      uploadFormData.append('imageType', 'menu-item');
      uploadFormData.append('merchantId', merchantId);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Item name is required');
      return;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      alert('Valid price is required');
      return;
    }

    setIsSaving(true);
    
    try {
      // Upload image first if a new one was selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // Image upload failed, abort submission
          setIsSaving(false);
          return;
        }
      }

      const updatedData = {
        title: formData.name.trim(), // API expects 'title'
        description: formData.description.trim(),
        base_price: Math.round(parseFloat(formData.price) * 100), // API expects 'base_price' in pence
        category_id: formData.category_id || undefined,
        display_order: parseInt(formData.display_order) || 0,
        image_url: imageUrl || undefined,
        is_age_restricted: formData.is_age_restricted,
        minimum_age: formData.is_age_restricted ? formData.minimum_age : undefined,
        restriction_type: formData.is_age_restricted ? formData.restriction_type : undefined,
        restriction_warning: formData.is_age_restricted && formData.restriction_warning ? formData.restriction_warning : undefined,
        requires_id_verification: formData.is_age_restricted ? formData.requires_id_verification : undefined,
      };

      await onSave(updatedData);
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    setFormData({
      name: item.name,
      description: item.description || '',
      price: (item.price / 100).toFixed(2),
      category_id: item.category_id,
      display_order: item.display_order.toString(),
      image_url: item.image_url || '',
      is_age_restricted: item.is_age_restricted || false,
      minimum_age: item.minimum_age || 18,
      restriction_type: item.restriction_type || 'alcohol',
      restriction_warning: item.restriction_warning || '',
      requires_id_verification: item.requires_id_verification || false,
    });
    setImageFile(null);
    setImagePreview(item.image_url || '');
    onClose();
  };

  const modalFooter = (
    <>
      <Button
        variant="secondary"
        onClick={handleClose}
        isDisabled={isSaving || isUploadingImage}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleSave}
        isDisabled={isSaving || isUploadingImage}
      >
        {isUploadingImage ? 'Uploading Image...' : isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Menu Item"
      footer={modalFooter}
      size="medium"
    >
      <Grid.Container gap="md">
        <Grid.Item lg={12}>
          <FormInput
            label="Item Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Margherita Pizza"
            required
          />
        </Grid.Item>

        <Grid.Item sm={12} md={6}>
          <FormInput
            label="Price (£)"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="5.99"
            required
          />
        </Grid.Item>

        <Grid.Item sm={12} md={6}>
          <FormInput
            label="Display Order"
            type="number"
            min="0"
            value={formData.display_order}
            onChange={(e) => handleInputChange('display_order', e.target.value)}
            placeholder="0"
            helpText="Items with same order are sorted alphabetically"
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <FormSelect
            label="Category"
            value={formData.category_id}
            onChange={(e) => handleInputChange('category_id', e.target.value)}
            options={[
              { value: '', label: 'No Category' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <FormTextArea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the item"
            rows={3}
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <div className={styles.editMenuItemModal__imageSection}>
            <label className={styles.editMenuItemModal__imageLabel}>
              Item Image (Optional)
            </label>
            <ImageUpload
              value={imagePreview}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
              disabled={isSaving || isUploadingImage}
              buttonText="Choose Image"
              buttonVariant="secondary"
              maxSize={10 * 1024 * 1024}
            />
            <p className={styles.editMenuItemModal__imageHelpText}>
              Max size: 10MB. Supported formats: JPG, PNG, WebP
            </p>
          </div>
        </Grid.Item>

        <Grid.Item lg={12}>
          <div className={styles.editMenuItemModal__optionGroupsSection}>
            <label className={styles.editMenuItemModal__optionGroupsLabel}>
              Customization Options
            </label>
            <OptionGroupSelector
              availableGroups={availableOptionGroups}
              selectedGroupIds={selectedOptionGroupIds}
              onChange={handleOptionGroupChange}
              disabled={isSaving || isUploadingImage}
              loading={isLoadingOptionGroups}
              error={optionGroupsError}
            />
          </div>
        </Grid.Item>

        <Grid.Item lg={12}>
          <div style={{ 
            borderTop: '1px solid var(--color-border-primary, #e5e7eb)', 
            paddingTop: '16px',
            marginTop: '8px'
          }}>
            <label className={styles.editMenuItemModal__optionGroupsLabel} style={{ marginBottom: '12px', display: 'block' }}>
              Age & Legal Restrictions
            </label>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_age_restricted}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_age_restricted: e.target.checked }))}
                  disabled={isSaving || isUploadingImage}
                />
                <span style={{ fontSize: '0.875rem' }}>
                  This item is age-restricted (e.g., alcohol, tobacco)
                </span>
              </label>
            </div>
            
            {formData.is_age_restricted && (
              <div style={{ 
                paddingLeft: '24px', 
                borderLeft: '3px solid var(--color-warning-500, #ffc107)',
                marginLeft: '8px',
                paddingTop: '8px'
              }}>
                <Grid.Container gap="md">
                  <Grid.Item sm={12} md={6}>
                    <FormSelect
                      label="Restriction Type"
                      value={formData.restriction_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, restriction_type: e.target.value }))}
                      options={[
                        { value: 'alcohol', label: 'Alcohol' },
                        { value: 'tobacco', label: 'Tobacco' },
                        { value: 'adult_content', label: 'Adult Content' },
                        { value: 'prescription', label: 'Prescription Required' },
                        { value: 'custom', label: 'Custom Restriction' },
                      ]}
                      required
                    />
                  </Grid.Item>
                  
                  <Grid.Item sm={12} md={6}>
                    <FormInput
                      label="Minimum Age"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.minimum_age.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimum_age: parseInt(e.target.value) || 18 }))}
                      placeholder="18"
                      required
                    />
                  </Grid.Item>
                  
                  <Grid.Item lg={12}>
                    <FormTextArea
                      label="Custom Warning Message (Optional)"
                      value={formData.restriction_warning}
                      onChange={(e) => setFormData(prev => ({ ...prev, restriction_warning: e.target.value }))}
                      placeholder="e.g., Challenge 25 policy applies. Valid ID required."
                      rows={2}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Leave blank to use default warning based on age and restriction type
                    </p>
                  </Grid.Item>
                  
                  <Grid.Item lg={12}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.requires_id_verification}
                        onChange={(e) => setFormData(prev => ({ ...prev, requires_id_verification: e.target.checked }))}
                        disabled={isSaving || isUploadingImage}
                      />
                      <span style={{ fontSize: '0.875rem' }}>
                        Requires ID verification at point of sale/delivery
                      </span>
                    </label>
                  </Grid.Item>
                </Grid.Container>
              </div>
            )}
          </div>
        </Grid.Item>
      </Grid.Container>
    </Modal>
  );
};

export default EditMenuItemModal;
