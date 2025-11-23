import React, { useState } from 'react';
import { Button, Grid } from '@/components/atoms';
import { FormInput, FormSelect, FormTextArea } from '@/components/atoms';
import { Modal } from '@/components/molecules';

interface MenuItem {
  id: string;
  title: string;
  description?: string;
  base_price: number;
  category_id: string;
  category_name?: string;
  is_active: boolean;
  display_order: number;
  image_url?: string;
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
  merchantId: string;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  categories,
  isOpen,
  onClose,
  onSave,
  merchantId,
}) => {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || '',
    price: (item.base_price / 100).toFixed(2), // Convert pence to pounds
    category_id: item.category_id,
    display_order: item.display_order.toString(),
    image_url: item.image_url || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(item.image_url || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('imageType', 'menu-item');
      formData.append('merchantId', merchantId);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Item name is required');
      return;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      alert('Valid price is required');
      return;
    }

    setIsSaving(true);
    
    try {
      // Upload new image if one was selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // Image upload failed, abort submission
          setIsSaving(false);
          return;
        }
      }

      const updatedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        base_price: Math.round(parseFloat(formData.price) * 100), // Convert to pence
        category_id: formData.category_id || undefined,
        display_order: parseInt(formData.display_order) || 0,
        image_url: imageUrl || undefined,
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
      title: item.title,
      description: item.description || '',
      price: (item.base_price / 100).toFixed(2),
      category_id: item.category_id,
      display_order: item.display_order.toString(),
      image_url: item.image_url || '',
    });
    setImageFile(null);
    setImagePreview(item.image_url || '');
    onClose();
  };

  const modalFooter = (
    <>
      <Button
        variant="secondary"
        onClick={handleClose}
        isDisabled={isSaving || isUploadingImage}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleSave}
        isDisabled={isSaving || isUploadingImage}
      >
        {isUploadingImage ? 'Uploading...' : isSaving ? 'Saving...' : 'Save Changes'}
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
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
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

        <Grid.Item lg={12}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 500,
              fontSize: '14px'
            }}>
              Item Image (Optional)
            </label>
            {imagePreview ? (
              <div style={{ marginBottom: '12px' }}>
                <img 
                  src={imagePreview} 
                  alt="Menu item preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    objectFit: 'cover',
                    marginBottom: '8px'
                  }} 
                />
                <div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleRemoveImage}
                    isDisabled={isSaving || isUploadingImage}
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSaving || isUploadingImage}
                style={{ marginBottom: '8px' }}
              />
            )}
            <p style={{ 
              fontSize: '12px', 
              color: 'var(--color-text-secondary)',
              margin: 0
            }}>
              Max size: 10MB. Supported formats: JPG, PNG, WebP
            </p>
          </div>
        </Grid.Item>
      </Grid.Container>
    </Modal>
  );
};

export default EditItemModal;