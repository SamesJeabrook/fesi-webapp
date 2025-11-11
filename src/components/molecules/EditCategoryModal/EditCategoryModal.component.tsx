'use client';

import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@/components/atoms';
import { FormInput, FormTextArea } from '@/components/atoms';
import { Modal } from '@/components/molecules';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
}

interface EditCategoryModalProps {
  category: MenuCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryId: string, updatedCategory: Partial<MenuCategory>) => Promise<void>;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    display_order: '0',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        display_order: category.display_order.toString(),
      });
    }
  }, [category]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (!category) return;

    setIsSaving(true);
    
    try {
      const updatedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        display_order: parseInt(formData.display_order) || 0,
      };

      await onSave(category.id, updatedData);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        display_order: category.display_order.toString(),
      });
    }
    onClose();
  };

  const modalFooter = (
    <>
      <Button
        variant="secondary"
        onClick={handleClose}
        isDisabled={isSaving}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleSave}
        isDisabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </>
  );

  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Category"
      footer={modalFooter}
      size="medium"
    >
      <Grid.Container gap="md">
        <Grid.Item lg={12}>
          <FormInput
            label="Category Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Main Courses, Desserts"
            required
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <FormInput
            label="Display Order"
            type="number"
            min="0"
            value={formData.display_order}
            onChange={(e) => handleInputChange('display_order', e.target.value)}
            placeholder="0"
            helpText="Categories with same order are sorted alphabetically"
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <FormTextArea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of this category"
            rows={3}
          />
        </Grid.Item>
      </Grid.Container>
    </Modal>
  );
};

export default EditCategoryModal;
