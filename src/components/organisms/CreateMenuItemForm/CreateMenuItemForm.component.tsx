import React, { useState } from 'react';
import { Typography, Button, FormInput, FormSelect, Grid } from '@/components/atoms';
import { FormTextArea } from '@/components/atoms/FormTextArea/FormTextArea.component';
import styles from './CreateMenuItemForm.module.scss';

export interface MenuCategory {
  id: string;
  name: string;
}

export interface CreateMenuItemFormProps {
  categories: MenuCategory[];
  onSubmit: (itemData: {
    name: string;
    description: string;
    price: string;
    category_id: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export const CreateMenuItemForm: React.FC<CreateMenuItemFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category_id: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      price: '',
      category_id: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
      });
      setErrors({
        name: '',
        price: '',
        category_id: '',
      });
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error creating item:', error);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <div className={`${styles.createForm} ${className}`}>
      <Typography variant="heading-5" className={styles.createForm__title}>
        Create New Menu Item
      </Typography>

      <Grid.Container gap="md" className={styles.createForm__content}>
        <Grid.Item sm={16} md={8}>
          <FormInput
            id="itemName"
            label="Item Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Margherita Pizza"
            error={errors.name}
            required
            disabled={isSubmitting}
          />
        </Grid.Item>

        <Grid.Item sm={16} md={8}>
          <FormInput
            id="itemPrice"
            label="Price (£)"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="5.99"
            error={errors.price}
            required
            disabled={isSubmitting}
          />
        </Grid.Item>

        <Grid.Item sm={16}>
          <FormSelect
            id="itemCategory"
            label="Category"
            value={formData.category_id}
            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
            options={categoryOptions}
            placeholder="Select a category"
            error={errors.category_id}
            required
            disabled={isSubmitting}
          />
        </Grid.Item>

        <Grid.Item sm={16}>
          <FormTextArea
            id="itemDescription"
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the item"
            rows={3}
            isDisabled={isSubmitting}
          />
        </Grid.Item>

        <Grid.Item sm={16}>
          <div className={styles.createForm__actions}>
            <Button 
              variant="secondary" 
              onClick={onCancel}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Create Item
            </Button>
          </div>
        </Grid.Item>
      </Grid.Container>
    </div>
  );
};

export default CreateMenuItemForm;
