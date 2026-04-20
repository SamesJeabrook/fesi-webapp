import React, { useState, useEffect } from 'react';
import { Typography, Button, FormInput, FormSelect, Grid } from '@/components/atoms';
import { FormTextArea } from '@/components/atoms/FormTextArea/FormTextArea.component';
import OptionGroupSelector, { SubItemGroup } from '@/components/molecules/OptionGroupSelector';
import api from '@/utils/api';
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
    optionGroupIds?: number[];
    is_age_restricted?: boolean;
    minimum_age?: number;
    restriction_type?: string;
    restriction_warning?: string;
    requires_id_verification?: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
  merchantId: string;
  authToken: string;
}

export const CreateMenuItemForm: React.FC<CreateMenuItemFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
  merchantId,
  authToken,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_age_restricted: false,
    minimum_age: 18,
    restriction_type: 'alcohol',
    restriction_warning: '',
    requires_id_verification: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category_id: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Option groups state
  const [availableOptionGroups, setAvailableOptionGroups] = useState<SubItemGroup[]>([]);
  const [selectedOptionGroupIds, setSelectedOptionGroupIds] = useState<number[]>([]);
  const [isLoadingOptionGroups, setIsLoadingOptionGroups] = useState(false);
  const [optionGroupsError, setOptionGroupsError] = useState<string>('');

  // Fetch available option groups when component mounts
  useEffect(() => {
    if (merchantId) {
      fetchOptionGroups();
    }
  }, [merchantId]);

  const fetchOptionGroups = async () => {
    setIsLoadingOptionGroups(true);
    setOptionGroupsError('');
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sub-groups?merchant_id=${merchantId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch option groups');
      }

      const data = await response.json();
      setAvailableOptionGroups(data.data || []);
    } catch (error) {
      console.error('Error fetching option groups:', error);
      setOptionGroupsError('Failed to load option groups. Please try again.');
    } finally {
      setIsLoadingOptionGroups(false);
    }
  };

  const handleOptionGroupChange = (newSelectedIds: number[]) => {
    setSelectedOptionGroupIds(newSelectedIds);
  };

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
      console.log('[CreateMenuItemForm] uploadImage - Starting upload');
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('imageType', 'menu-item');
      formData.append('merchantId', merchantId);

      console.log('[CreateMenuItemForm] uploadImage - Calling api.upload');
      const data = await api.upload<{ success: boolean; image: { url: string; publicId: string; optimizedUrl: string } }>('/api/upload/image', formData);
      console.log('[CreateMenuItemForm] uploadImage - Upload response:', data);
      console.log('[CreateMenuItemForm] uploadImage - Extracted URL:', data.image?.url || data.image?.optimizedUrl);
      return data.image?.url || data.image?.optimizedUrl || null;
    } catch (error) {
      console.error('[CreateMenuItemForm] uploadImage - Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    console.log('[CreateMenuItemForm] handleSubmit called');
    if (!validateForm()) {
      console.log('[CreateMenuItemForm] Form validation failed');
      return;
    }

    console.log('[CreateMenuItemForm] Starting submission');
    try {
      // Upload image first if present
      let imageUrl = formData.image_url;
      if (imageFile) {
        console.log('[CreateMenuItemForm] Uploading image...');
        const uploadedUrl = await uploadImage();
        console.log('[CreateMenuItemForm] Image uploaded:', uploadedUrl);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // Image upload failed, abort submission
          console.error('[CreateMenuItemForm] Image upload returned null');
          return;
        }
      }

      console.log('[CreateMenuItemForm] Final image URL:', imageUrl);
      console.log('[CreateMenuItemForm] Calling onSubmit with data');
      
      await onSubmit({ 
        ...formData, 
        image_url: imageUrl,
        optionGroupIds: selectedOptionGroupIds.length > 0 ? selectedOptionGroupIds : undefined,
        is_age_restricted: formData.is_age_restricted,
        minimum_age: formData.is_age_restricted ? formData.minimum_age : undefined,
        restriction_type: formData.is_age_restricted ? formData.restriction_type : undefined,
        restriction_warning: formData.is_age_restricted && formData.restriction_warning ? formData.restriction_warning : undefined,
        requires_id_verification: formData.is_age_restricted ? formData.requires_id_verification : undefined,
      });
      
      console.log('[CreateMenuItemForm] onSubmit completed successfully');
      
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_age_restricted: false,
        minimum_age: 18,
        restriction_type: 'alcohol',
        restriction_warning: '',
        requires_id_verification: false,
      });
      setErrors({
        name: '',
        price: '',
        category_id: '',
      });
      setImageFile(null);
      setImagePreview('');
      setSelectedOptionGroupIds([]);
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
          <div style={{ 
            borderTop: '1px solid var(--color-border-primary, #e5e7eb)', 
            paddingTop: '16px',
            marginTop: '8px'
          }}>
            <Typography variant="body-medium" style={{ marginBottom: '12px' }}>
              Age & Legal Restrictions
            </Typography>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_age_restricted}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_age_restricted: e.target.checked }))}
                  disabled={isSubmitting || isUploadingImage}
                />
                <Typography variant="body-medium">
                  This item is age-restricted (e.g., alcohol, tobacco)
                </Typography>
              </label>
            </div>
            
            {formData.is_age_restricted && (
              <div style={{ 
                paddingLeft: '24px', 
                borderLeft: '3px solid var(--color-warning-500, #ffc107)',
                marginLeft: '8px',
                paddingTop: '8px'
              }}>
                <Grid.Container gap="md">
                  <Grid.Item sm={16} md={8}>
                    <FormSelect
                      id="restrictionType"
                      label="Restriction Type"
                      value={formData.restriction_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, restriction_type: e.target.value }))}
                      options={[
                        { value: 'alcohol', label: 'Alcohol' },
                        { value: 'tobacco', label: 'Tobacco' },
                        { value: 'adult_content', label: 'Adult Content' },
                        { value: 'prescription', label: 'Prescription Required' },
                        { value: 'custom', label: 'Custom Restriction' },
                      ]}
                      disabled={isSubmitting || isUploadingImage}
                      required
                    />
                  </Grid.Item>
                  
                  <Grid.Item sm={16} md={8}>
                    <FormInput
                      id="minimumAge"
                      label="Minimum Age"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.minimum_age.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimum_age: parseInt(e.target.value) || 18 }))}
                      placeholder="18"
                      disabled={isSubmitting || isUploadingImage}
                      required
                    />
                  </Grid.Item>
                  
                  <Grid.Item sm={16}>
                    <FormTextArea
                      id="restrictionWarning"
                      label="Custom Warning Message (Optional)"
                      value={formData.restriction_warning}
                      onChange={(e) => setFormData(prev => ({ ...prev, restriction_warning: e.target.value }))}
                      placeholder="e.g., Challenge 25 policy applies. Valid ID required."
                      rows={2}
                      isDisabled={isSubmitting || isUploadingImage}
                    />
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Leave blank to use default warning based on age and restriction type
                    </Typography>
                  </Grid.Item>
                  
                  <Grid.Item sm={16}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.requires_id_verification}
                        onChange={(e) => setFormData(prev => ({ ...prev, requires_id_verification: e.target.checked }))}
                        disabled={isSubmitting || isUploadingImage}
                      />
                      <Typography variant="body-small">
                        Requires ID verification at point of sale/delivery
                      </Typography>
                    </label>
                  </Grid.Item>
                </Grid.Container>
              </div>
            )}
          </div>
        </Grid.Item>

        <Grid.Item sm={16}>
          <div style={{ 
            borderTop: '1px solid var(--color-border-primary, #e5e7eb)', 
            paddingTop: '16px',
            marginTop: '8px'
          }}>
            <Typography variant="body-medium" style={{ marginBottom: '12px' }}>
              Customization Options
            </Typography>
            <OptionGroupSelector
              availableGroups={availableOptionGroups}
              selectedGroupIds={selectedOptionGroupIds}
              onChange={handleOptionGroupChange}
              disabled={isSubmitting || isUploadingImage}
              loading={isLoadingOptionGroups}
              error={optionGroupsError}
            />
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
