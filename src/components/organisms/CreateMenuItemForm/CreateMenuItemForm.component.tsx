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
    image_url?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
  merchantId: string;
}

export const CreateMenuItemForm: React.FC<CreateMenuItemFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
  merchantId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category_id: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Upload image first if present
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // Image upload failed, abort submission
          return;
        }
      }

      await onSubmit({ ...formData, image_url: imageUrl });
      
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
      });
      setErrors({
        name: '',
        price: '',
        category_id: '',
      });
      setImageFile(null);
      setImagePreview('');
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
          <div>
            <Typography variant="body-medium" style={{ marginBottom: '8px' }}>
              Item Image (Optional)
            </Typography>
            {imagePreview ? (
              <div style={{ marginBottom: '12px' }}>
                <img 
                  src={imagePreview} 
                  alt="Menu item preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    objectFit: 'cover' 
                  }} 
                />
                <div style={{ marginTop: '8px' }}>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleRemoveImage}
                    isDisabled={isSubmitting || isUploadingImage}
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
                disabled={isSubmitting || isUploadingImage}
                style={{ marginBottom: '8px' }}
              />
            )}
            <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
              Max size: 10MB. Supported formats: JPG, PNG, WebP
            </Typography>
          </div>
        </Grid.Item>

        <Grid.Item sm={16}>
          <div className={styles.createForm__actions}>
            <Button 
              variant="secondary" 
              onClick={onCancel}
              isDisabled={isSubmitting || isUploadingImage}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              isDisabled={isSubmitting || isUploadingImage}
              isLoading={isSubmitting || isUploadingImage}
            >
              {isUploadingImage ? 'Uploading Image...' : 'Create Item'}
            </Button>
          </div>
        </Grid.Item>
      </Grid.Container>
    </div>
  );
};

export default CreateMenuItemForm;
