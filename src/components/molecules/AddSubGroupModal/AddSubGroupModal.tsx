'use client';

import React, { useState } from 'react';
import { Typography, Button, FormInput, FormSelect, FormCheckbox } from '@/components/atoms';
import { Modal } from '@/components/molecules/Modal';
import { CreateSubGroupData } from '@/services/subItemsAPI';
import styles from './AddSubGroupModal.module.scss';

export interface AddSubGroupModalProps {
  onClose: () => void;
  onSubmit: (data: CreateSubGroupData) => void;
}

export const AddSubGroupModal: React.FC<AddSubGroupModalProps> = ({
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selection_type: 'single' as 'single' | 'multiple',
    is_required: false,
    max_selections: '',
    display_order: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }
    
    if (formData.selection_type === 'multiple' && formData.max_selections) {
      const maxSel = parseInt(formData.max_selections);
      if (isNaN(maxSel) || maxSel < 1) {
        newErrors.max_selections = 'Maximum selections must be a positive number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submitData: CreateSubGroupData = {
      name: formData.name.trim(),
      selection_type: formData.selection_type,
      is_required: formData.is_required,
      display_order: formData.display_order
    };

    if (formData.description.trim()) {
      submitData.description = formData.description.trim();
    }

    if (formData.selection_type === 'multiple' && formData.max_selections) {
      submitData.max_selections = parseInt(formData.max_selections);
    }

    onSubmit(submitData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create Option Group"
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
              const form = document.getElementById('add-group-form') as HTMLFormElement;
              if (form) {
                form.requestSubmit();
              }
            }}
          >
            Create Group
          </Button>
        </div>
      }
    >
      <form id="add-group-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__section}>
          <Typography variant="heading-6" style={{ marginBottom: 'var(--spacing-sm)' }}>
            Basic Information
          </Typography>
          
          <FormInput
            label="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="e.g., Size Options, Add-ons, Toppings"
            required
            size="md"
          />
          
          <FormInput
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this option group"
            size="md"
          />
        </div>

        <div className={styles.form__section}>
          <Typography variant="heading-6" style={{ marginBottom: 'var(--spacing-sm)' }}>
            Selection Settings
          </Typography>
          
          <FormSelect
            label="Selection Type"
            value={formData.selection_type}
            onChange={(e) => setFormData({ ...formData, selection_type: e.target.value as 'single' | 'multiple' })}
            options={[
              { value: 'single', label: 'Single Choice (customers can pick one option)' },
              { value: 'multiple', label: 'Multiple Choice (customers can pick multiple options)' }
            ]}
            required
            size="md"
          />
          
          {formData.selection_type === 'multiple' && (
            <FormInput
              label="Maximum Selections (Optional)"
              type="number"
              min="1"
              value={formData.max_selections}
              onChange={(e) => setFormData({ ...formData, max_selections: e.target.value })}
              error={errors.max_selections}
              helpText="Leave empty to allow unlimited selections"
              size="md"
            />
          )}
          
          <FormCheckbox
            label="Required for customers"
            checked={formData.is_required}
            onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
            helpText="If checked, customers must select at least one option from this group"
            size="md"
          />
        </div>

        <div className={styles.form__section}>
          <Typography variant="heading-6" style={{ marginBottom: 'var(--spacing-sm)' }}>
            Display Settings
          </Typography>
          
          <FormInput
            label="Display Order"
            type="number"
            min="0"
            value={formData.display_order.toString()}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            helpText="Lower numbers appear first (0 = first)"
            size="md"
          />
        </div>
      </form>
    </Modal>
  );
};