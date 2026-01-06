'use client';

import React, { useState } from 'react';
import { FormInput, FormSelect, Button } from '@/components/atoms';
import type { StockTransactionType } from '@/types/stock.types';
import styles from './AdjustStockModal.module.scss';
import type { AdjustStockFormProps, AdjustStockFormData } from './AdjustStockModal.types';

const TRANSACTION_TYPES: { value: StockTransactionType; label: string }[] = [
  { value: 'restock', label: 'Restock (Add)' },
  { value: 'deduct', label: 'Deduct (Remove)' },
  { value: 'adjust', label: 'Adjust (Set to specific amount)' },
  { value: 'waste', label: 'Waste/Spoilage' },
  { value: 'transfer', label: 'Transfer' },
];

export const AdjustStockForm: React.FC<AdjustStockFormProps> = ({
  stockItem,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<AdjustStockFormData>({
    transaction_type: 'restock',
    quantity_change: 0,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdjustStockFormData, string>>>({});

  const handleChange = (field: keyof AdjustStockFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateNewQuantity = (): number => {
    const current = stockItem.current_quantity;
    const change = formData.quantity_change;

    switch (formData.transaction_type) {
      case 'restock':
        return current + change;
      case 'deduct':
      case 'waste':
        return current - change;
      case 'adjust':
        return change;
      case 'transfer':
        return current - change;
      default:
        return current;
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AdjustStockFormData, string>> = {};

    if (formData.quantity_change === 0 && formData.transaction_type !== 'adjust') {
      newErrors.quantity_change = 'Quantity change cannot be zero';
    }

    if (formData.quantity_change < 0) {
      newErrors.quantity_change = 'Quantity cannot be negative';
    }

    const newQuantity = calculateNewQuantity();
    if (newQuantity < 0) {
      newErrors.quantity_change = 'This would result in negative stock';
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

  const newQuantity = calculateNewQuantity();
  const quantityDiff = newQuantity - stockItem.current_quantity;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Stock Item Info */}
      <div className={styles.stockInfo}>
        <div className={styles.stockInfo__header}>
          <h3 className={styles.stockInfo__name}>{stockItem.name}</h3>
          <div className={styles.stockInfo__current}>
            Current: <strong>{stockItem.current_quantity} {stockItem.unit}</strong>
          </div>
        </div>
        {stockItem.description && (
          <p className={styles.stockInfo__description}>{stockItem.description}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className={styles.form__fields}>
        {/* Transaction Type */}
        <div className={styles.form__field}>
          <FormSelect
            label="Action"
            value={formData.transaction_type}
            onChange={(e) => handleChange('transaction_type', e.target.value as StockTransactionType)}
            error={errors.transaction_type}
            required
            options={TRANSACTION_TYPES}
          />
        </div>

        {/* Quantity */}
        <div className={styles.form__field}>
          <FormInput
            label={formData.transaction_type === 'adjust' ? 'New Quantity' : 'Quantity'}
            type="number"
            value={formData.quantity_change}
            onChange={(e) => handleChange('quantity_change', parseFloat(e.target.value) || 0)}
            error={errors.quantity_change}
            min="0"
            step="0.01"
            required
            disabled={isLoading}
            helpText={
              formData.transaction_type === 'adjust'
                ? 'Set exact quantity'
                : formData.transaction_type === 'restock'
                ? 'Amount to add'
                : 'Amount to remove'
            }
          />
        </div>

        {/* Notes */}
        <div className={`${styles.form__field} ${styles['form__field--full']}`}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className={styles.form__textarea}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Optional notes about this adjustment"
            rows={3}
            disabled={isLoading}
          />
          {errors.notes && <span className={styles.form__error}>{errors.notes}</span>}
        </div>
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.preview__row}>
          <span className={styles.preview__label}>Current Quantity:</span>
          <span className={styles.preview__value}>{stockItem.current_quantity} {stockItem.unit}</span>
        </div>
        <div className={styles.preview__row}>
          <span className={styles.preview__label}>
            {formData.transaction_type === 'adjust' ? 'Set to:' : 'Change:'}
          </span>
          <span className={`${styles.preview__value} ${quantityDiff > 0 ? styles['preview__value--positive'] : quantityDiff < 0 ? styles['preview__value--negative'] : ''}`}>
            {formData.transaction_type === 'adjust' 
              ? `${formData.quantity_change} ${stockItem.unit}`
              : `${quantityDiff > 0 ? '+' : ''}${quantityDiff} ${stockItem.unit}`
            }
          </span>
        </div>
        <div className={`${styles.preview__row} ${styles['preview__row--total']}`}>
          <span className={styles.preview__label}>New Quantity:</span>
          <span className={styles.preview__value}>
            <strong>{newQuantity} {stockItem.unit}</strong>
          </span>
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
          {isLoading ? 'Adjusting...' : 'Confirm Adjustment'}
        </Button>
      </div>
    </form>
  );
};

export default AdjustStockForm;
