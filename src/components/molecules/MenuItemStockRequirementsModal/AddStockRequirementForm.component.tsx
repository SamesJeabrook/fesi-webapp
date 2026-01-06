'use client';

import React, { useState } from 'react';
import { FormInput, FormSelect, FormCheckbox, Button } from '@/components/atoms';
import type { StockItem } from '@/types/stock.types';
import styles from './MenuItemStockRequirementsModal.module.scss';
import type { AddStockRequirementFormProps, StockRequirementFormData } from './MenuItemStockRequirementsModal.types';

export const AddStockRequirementForm: React.FC<AddStockRequirementFormProps> = ({
  availableStockItems,
  onAdd,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StockRequirementFormData>({
    stock_item_id: '',
    quantity_required: 1,
    is_optional: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StockRequirementFormData, string>>>({});

  const handleChange = (field: keyof StockRequirementFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StockRequirementFormData, string>> = {};

    if (!formData.stock_item_id) {
      newErrors.stock_item_id = 'Please select a stock item';
    }

    if (formData.quantity_required <= 0) {
      newErrors.quantity_required = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await onAdd(formData);
      // Reset form
      setFormData({
        stock_item_id: '',
        quantity_required: 1,
        is_optional: false,
      });
    } catch (error) {
      console.error('Error adding requirement:', error);
    }
  };

  const selectedItem = availableStockItems.find(item => item.id === formData.stock_item_id);

  return (
    <form onSubmit={handleSubmit} className={styles.addForm}>
      <div className={styles.addForm__header}>
        <h3 className={styles.addForm__title}>Add Stock Requirement</h3>
      </div>

      <div className={styles.addForm__fields}>
        <div className={styles.addForm__field}>
          <FormSelect
            label="Stock Item"
            value={formData.stock_item_id}
            onChange={(e) => handleChange('stock_item_id', e.target.value)}
            error={errors.stock_item_id}
            required
            options={availableStockItems.map(item => ({
              value: item.id,
              label: `${item.name} (${item.current_quantity} ${item.unit})`,
            }))}
            placeholder="Select a stock item..."
          />
        </div>

        <div className={styles.addForm__field}>
          <FormInput
            label={`Quantity Required ${selectedItem ? `(${selectedItem.unit})` : ''}`}
            type="number"
            value={formData.quantity_required}
            onChange={(e) => handleChange('quantity_required', parseFloat(e.target.value) || 0)}
            error={errors.quantity_required}
            min="0.01"
            step="0.01"
            required
            helpText="How much of this stock item is needed per order"
          />
        </div>

        <div className={styles.addForm__field}>
          <FormCheckbox
            label="Optional"
            checked={formData.is_optional}
            onChange={(e) => handleChange('is_optional', e.target.checked)}
            helpText="Orders can still be placed if this item is out of stock"
          />
        </div>
      </div>

      <div className={styles.addForm__actions}>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isDisabled={isLoading}
        >
          {isLoading ? 'Adding...' : '+ Add Requirement'}
        </Button>
      </div>
    </form>
  );
};

export default AddStockRequirementForm;
