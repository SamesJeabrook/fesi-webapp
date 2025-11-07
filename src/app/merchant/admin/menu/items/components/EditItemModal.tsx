import React, { useState } from 'react';
import { Button, Grid } from '@/components/atoms';
import { FormInput, FormSelect, FormTextArea } from '@/components/atoms';
import { Modal } from '@/components/molecules';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  category_name?: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface MenuCategory {
  id: string;
  name: string;
}

interface EditItemModalProps {
  item: MenuItem;
  categories: MenuCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: Partial<MenuItem>) => Promise<void>;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description || '',
    price: (item.price / 100).toFixed(2), // Convert pence to pounds
    category_id: item.category_id,
    display_order: item.display_order.toString(),
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      const updatedData = {
        title: formData.name.trim(), // API expects 'title'
        description: formData.description.trim(),
        base_price: Math.round(parseFloat(formData.price) * 100), // API expects 'base_price' in pence
        category_id: formData.category_id || undefined,
        display_order: parseInt(formData.display_order) || 0,
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
        {isSaving ? 'Saving...' : 'Save Changes'}
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
      </Grid.Container>
    </Modal>
  );
};

export default EditItemModal;
