import React, { useState } from 'react';
import { Button, Grid } from '@/components/atoms';
import { FormInput, FormCheckbox } from '@/components/atoms';
import { Modal } from '@/components/molecules';

interface SubItem {
  id: string;
  name: string;
  additional_price: number;
  display_order: number;
  is_active: boolean;
  group_id: string;
  created_at: string;
}

interface SubGroup {
  id: string;
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number;
  display_order: number;
  sub_items: SubItem[];
}

interface AddSubItemModalProps {
  group: SubGroup;
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupId: string, subItemData: Partial<SubItem>) => Promise<void>;
}

export const AddSubItemModal: React.FC<AddSubItemModalProps> = ({
  group,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    additional_price: '0.00',
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Option name is required');
      return;
    }
    
    if (isNaN(parseFloat(formData.additional_price))) {
      alert('Valid price is required');
      return;
    }

    setIsSaving(true);
    
    try {
      const subItemData = {
        name: formData.name.trim(),
        additional_price: Math.round(parseFloat(formData.additional_price) * 100), // Convert to pence
        is_active: formData.is_active,
        display_order: (group.sub_items?.length || 0) + 1, // Next order
      };

      await onSave(group.id, subItemData);
      handleClose();
    } catch (error) {
      console.error('Error saving sub-item:', error);
      alert('Error saving option. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      additional_price: '0.00',
      is_active: true,
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
        {isSaving ? 'Adding...' : 'Add Option'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add Option to "${group.name}"`}
      footer={modalFooter}
      size="medium"
    >
      <Grid.Container gap="md">
        <Grid.Item lg={12}>
          <FormInput
            label="Option Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Large Size, Extra Cheese"
            required
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <FormInput
            label="Additional Price (£)"
            type="number"
            step="0.01"
            min="-99.99"
            value={formData.additional_price}
            onChange={(e) => handleInputChange('additional_price', e.target.value)}
            placeholder="0.00"
            helpText="Enter 0 for no charge, negative for discount"
            required
          />
        </Grid.Item>

        <Grid.Item lg={12}>
          <FormCheckbox
            label="Available to customers"
            checked={formData.is_active}
            onChange={(e) => handleInputChange('is_active', e.target.checked)}
          />
        </Grid.Item>
      </Grid.Container>
    </Modal>
  );
};