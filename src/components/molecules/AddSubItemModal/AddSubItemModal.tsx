'use client';

import React, { useState } from 'react';
import { Typography, Button, FormInput, FormCheckbox } from '@/components/atoms';
import { Modal } from '@/components/molecules/Modal';
import { CreateSubItemData } from '@/services/subItemsAPI';
import styles from './AddSubItemModal.module.scss';

export interface AddSubItemModalProps {
  groupName: string;
  onClose: () => void;
  onSubmit: (data: CreateSubItemData) => void;
}

export const AddSubItemModal: React.FC<AddSubItemModalProps> = ({
  groupName,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    additional_price: '0.00',
    display_order: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Option name is required';
    }
    
    const price = parseFloat(formData.additional_price);
    if (isNaN(price) || price < 0) {
      newErrors.additional_price = 'Price must be a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submitData: CreateSubItemData = {
      name: formData.name.trim(),
      additional_price: Math.round(parseFloat(formData.additional_price) * 100), // Convert to pence
      display_order: formData.display_order,
      is_active: formData.is_active
    };

    onSubmit(submitData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Add Option to ${groupName}`}
      size="medium"
      footer={
        <div className={styles.modalFooter}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={() => {
              const form = document.getElementById('add-item-form') as HTMLFormElement;
              if (form) {
                form.requestSubmit();
              }
            }}
          >
            Add Option
          </Button>
        </div>
      }
    >
      <form id="add-item-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__section}>
          <Typography variant="heading-6" style={{ marginBottom: 'var(--spacing-sm)' }}>
            Option Details
          </Typography>
          
          <FormInput
            label="Option Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="e.g., Large, Extra Cheese, No Onions"
            required
          />
          
          <FormInput
            label="Additional Price (£)"
            type="number"
            step="0.01"
            min="0"
            value={formData.additional_price}
            onChange={(e) => setFormData({ ...formData, additional_price: e.target.value })}
            error={errors.additional_price}
            helpText="Enter 0.00 for no additional charge"
          />
        </div>

        <div className={styles.form__section}>
          <Typography variant="heading-6" style={{ marginBottom: 'var(--spacing-sm)' }}>
            Settings
          </Typography>
          
          <FormInput
            label="Display Order"
            type="number"
            min="0"
            value={formData.display_order.toString()}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            helpText="Lower numbers appear first (0 = first)"
          />
          
          <FormCheckbox
            label="Active (available to customers)"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            helpText="Uncheck to hide this option from customers"
          />
        </div>
      </form>
    </Modal>
  );
};