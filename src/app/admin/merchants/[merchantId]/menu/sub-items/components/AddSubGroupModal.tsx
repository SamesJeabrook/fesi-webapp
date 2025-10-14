import React, { useState } from 'react';
import { Button, Grid } from '@/components/atoms';
import { FormInput, FormSelect, FormCheckbox } from '@/components/atoms';
import { Modal } from '@/components/molecules';

interface SubItemGroup {
  id: string;
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number;
  display_order: number;
  merchant_id: string;
  merchant_name?: string;
  item_count: number;
  menu_item_count: number;
  sub_items: any[];
  created_at: string;
}

interface AddSubGroupModalProps {
  merchantId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: Partial<SubItemGroup>) => Promise<void>;
}

export const AddSubGroupModal: React.FC<AddSubGroupModalProps> = ({
  merchantId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    selection_type: 'single' as 'single' | 'multiple',
    is_required: false,
    max_selections: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Group name is required');
      return;
    }

    // Validate max_selections for multiple choice
    if (formData.selection_type === 'multiple' && formData.max_selections) {
      const maxSelections = parseInt(formData.max_selections);
      if (isNaN(maxSelections) || maxSelections < 1) {
        alert('Maximum selections must be a positive number');
        return;
      }
    }

    setIsSaving(true);
    
    try {
      const groupData = {
        merchant_id: merchantId,
        name: formData.name.trim(),
        selection_type: formData.selection_type,
        is_required: formData.is_required,
        max_selections: formData.max_selections ? parseInt(formData.max_selections) : undefined,
        display_order: 0, // Will be set by backend
      };

      await onSave(groupData);
      handleClose();
    } catch (error) {
      console.error('Error saving sub-group:', error);
      alert('Error creating option group. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      selection_type: 'single',
      is_required: false,
      max_selections: '',
    });
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
        {isSaving ? 'Creating...' : 'Create Group'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Option Group"
      footer={modalFooter}
      size="medium"
    >
      <Grid.Container gap="md">
        <Grid.Item lg={12}>
          <FormInput
            label="Group Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Size Options, Add-ons, Toppings"
            required
            helpText="Give this option group a descriptive name"
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <FormSelect
            label="Selection Type"
            value={formData.selection_type}
            onChange={(e) => handleInputChange('selection_type', e.target.value)}
            options={[
              { value: 'single', label: 'Single Choice - Customers can select only one option' },
              { value: 'multiple', label: 'Multiple Choice - Customers can select multiple options' }
            ]}
            required
          />
        </Grid.Item>

        {formData.selection_type === 'multiple' && (
          <Grid.Item lg={12}>
            <FormInput
              label="Maximum Selections (Optional)"
              type="number"
              min="1"
              value={formData.max_selections}
              onChange={(e) => handleInputChange('max_selections', e.target.value)}
              placeholder="Leave empty for unlimited"
              helpText="Limit how many options customers can select"
            />
          </Grid.Item>
        )}

        <Grid.Item lg={12}>
          <FormCheckbox
            label="Required Selection"
            checked={formData.is_required}
            onChange={(e) => handleInputChange('is_required', e.target.checked)}
            helpText="Customers must select at least one option from this group"
          />
        </Grid.Item>
      </Grid.Container>
    </Modal>
  );
};