'use client';

import React, { useState } from 'react';
import { FormInput, FormSelect, FormCheckbox, Button } from '@/components/atoms';
import type { StockUnit } from '@/types/stock.types';
import styles from './StockItemFormModal.module.scss';
import type { StockItemFormProps, StockItemFormData } from './StockItemFormModal.types';

const STOCK_UNITS: { value: StockUnit; label: string }[] = [
  { value: 'portions', label: 'Portions' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'grams', label: 'Grams (g)' },
  { value: 'liters', label: 'Liters (L)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'units', label: 'Units' },
  { value: 'pieces', label: 'Pieces' },
];

export const StockItemForm: React.FC<StockItemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  existingCategories = [],
}) => {
  const [formData, setFormData] = useState<StockItemFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    unit: initialData?.unit || 'portions',
    current_quantity: initialData?.current_quantity || 0,
    low_stock_threshold: initialData?.low_stock_threshold || 10,
    reorder_quantity: initialData?.reorder_quantity || undefined,
    cost_per_unit: initialData?.cost_per_unit || undefined,
    supplier: initialData?.supplier || '',
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StockItemFormData, string>>>({});
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const handleChange = (field: keyof StockItemFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StockItemFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (formData.current_quantity < 0) {
      newErrors.current_quantity = 'Quantity cannot be negative';
    }

    if (formData.low_stock_threshold < 0) {
      newErrors.low_stock_threshold = 'Threshold cannot be negative';
    }

    if (formData.cost_per_unit !== undefined && formData.cost_per_unit < 0) {
      newErrors.cost_per_unit = 'Cost cannot be negative';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.form__grid}>
        {/* Item Name */}
        <div className={styles.form__field}>
          <FormInput
            label="Item Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="e.g., Burger Patties"
            required
            disabled={isLoading}
          />
        </div>

        {/* Unit */}
        <div className={styles.form__field}>
          <FormSelect
            label="Unit of Measurement"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value as StockUnit)}
            error={errors.unit}
            required
            options={STOCK_UNITS}
          />
        </div>

        {/* Category */}
        <div className={`${styles.form__field} ${styles['form__field--full']}`}>
          <FormInput
            label="Category"
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            error={errors.category}
            placeholder="e.g., Meat, Vegetables, Dairy (optional)"
            disabled={isLoading}
            list="category-suggestions"
            helpText="Optional - helps organize your inventory"
          />
          {existingCategories.length > 0 && (
            <datalist id="category-suggestions">
              {existingCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          )}
        </div>

        {/* Current Quantity */}
        <div className={styles.form__field}>
          <FormInput
            label="Current Quantity"
            type="number"
            value={formData.current_quantity}
            onChange={(e) => handleChange('current_quantity', parseFloat(e.target.value) || 0)}
            error={errors.current_quantity}
            min="0"
            step="0.01"
            required
            disabled={isLoading}
          />
        </div>

        {/* Low Stock Threshold */}
        <div className={styles.form__field}>
          <FormInput
            label="Low Stock Threshold"
            type="number"
            value={formData.low_stock_threshold}
            onChange={(e) => handleChange('low_stock_threshold', parseFloat(e.target.value) || 0)}
            error={errors.low_stock_threshold}
            helpText="Alert when stock falls below this level"
            min="0"
            step="0.01"
            required
            disabled={isLoading}
          />
        </div>

        {/* Reorder Quantity */}
        <div className={styles.form__field}>
          <FormInput
            label="Reorder Quantity"
            type="number"
            value={formData.reorder_quantity || ''}
            onChange={(e) => handleChange('reorder_quantity', e.target.value ? parseFloat(e.target.value) : undefined)}
            error={errors.reorder_quantity}
            helpText="Suggested reorder amount (optional)"
            min="0"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        {/* Cost Per Unit */}
        <div className={styles.form__field}>
          <FormInput
            label="Cost Per Unit"
            type="number"
            value={formData.cost_per_unit || ''}
            onChange={(e) => handleChange('cost_per_unit', e.target.value ? parseFloat(e.target.value) : undefined)}
            error={errors.cost_per_unit}
            helpText="Cost in your currency (optional)"
            min="0"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        {/* Supplier */}
        <div className={`${styles.form__field} ${styles['form__field--full']}`}>
          <FormInput
            label="Supplier"
            value={formData.supplier || ''}
            onChange={(e) => handleChange('supplier', e.target.value)}
            error={errors.supplier}
            placeholder="e.g., ABC Meat Suppliers"
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className={`${styles.form__field} ${styles['form__field--full']}`}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className={styles.form__textarea}
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Additional notes or description"
            rows={3}
            disabled={isLoading}
          />
          {errors.description && <span className={styles.form__error}>{errors.description}</span>}
        </div>

        {/* Is Active */}
        <div className={`${styles.form__field} ${styles['form__field--full']}`}>
          <FormCheckbox
            label="Active"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            helpText="Inactive items won't trigger alerts or affect menu availability"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className={styles.form__actions}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          isDisabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isDisabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
};

export default StockItemForm;
