import React, { useState } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { BusinessDetailsStepProps, BusinessDetailsData } from './BusinessDetailsStep.types';
import styles from './BusinessDetailsStep.module.scss';

const FOOD_CATEGORIES = [
  'Pizza', 'Chinese', 'Indian', 'Mexican', 'Italian', 'Japanese',
  'Thai', 'Korean', 'Vietnamese', 'Greek', 'Turkish', 'Lebanese',
  'Burger', 'Chicken', 'BBQ', 'Seafood', 'Vegetarian', 'Vegan',
  'Street Food', 'Fast Food', 'Dessert', 'Coffee', 'Bakery'
];

export const BusinessDetailsStep: React.FC<BusinessDetailsStepProps> = ({
  onComplete,
  onBack,
  initialData,
  loading = false,
  className,
}) => {
  const [formData, setFormData] = useState<BusinessDetailsData>({
    businessName: initialData?.businessName || '',
    description: initialData?.description || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      postcode: initialData?.address?.postcode || '',
      country: initialData?.address?.country || 'United Kingdom',
    },
    categories: initialData?.categories || [],
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Business description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s+()-]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    } else if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(formData.address.postcode)) {
      newErrors.postcode = 'Please enter a valid UK postcode';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BusinessDetailsData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });

    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onComplete(formData);
  };

  const containerClasses = [
    styles.businessDetailsStep,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.businessDetailsStep__header}>
        <Typography variant="heading-2" className={styles.businessDetailsStep__title}>
          Tell Us About Your Business
        </Typography>
        <Typography variant="body-large" className={styles.businessDetailsStep__description}>
          Help customers find you by providing your business information
        </Typography>
      </div>

      <form className={styles.businessDetailsStep__form} onSubmit={handleSubmit}>
        {/* Business Information Section */}
        <div className={styles.businessDetailsStep__section}>
          <h3 className={styles.businessDetailsStep__sectionTitle}>Business Information</h3>

          <div className={styles.businessDetailsStep__field}>
            <label className={styles.businessDetailsStep__label}>
              Business Name<span className={styles.businessDetailsStep__required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.businessDetailsStep__input} ${errors.businessName ? styles['businessDetailsStep__input--error'] : ''}`}
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Your Business Name"
              disabled={loading}
            />
            {errors.businessName && (
              <span className={styles.businessDetailsStep__error}>⚠️ {errors.businessName}</span>
            )}
          </div>

          <div className={styles.businessDetailsStep__field}>
            <label className={styles.businessDetailsStep__label}>
              Business Description<span className={styles.businessDetailsStep__required}>*</span>
            </label>
            <textarea
              className={`${styles.businessDetailsStep__textarea} ${errors.description ? styles['businessDetailsStep__input--error'] : ''}`}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell customers what makes your food special..."
              disabled={loading}
            />
            {errors.description && (
              <span className={styles.businessDetailsStep__error}>⚠️ {errors.description}</span>
            )}
            <span className={styles.businessDetailsStep__helpText}>
              {formData.description.length}/500 characters
            </span>
          </div>

          <div className={styles.businessDetailsStep__field}>
            <label className={styles.businessDetailsStep__label}>
              Phone Number<span className={styles.businessDetailsStep__required}>*</span>
            </label>
            <input
              type="tel"
              className={`${styles.businessDetailsStep__input} ${errors.phoneNumber ? styles['businessDetailsStep__input--error'] : ''}`}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="07123 456789"
              disabled={loading}
            />
            {errors.phoneNumber && (
              <span className={styles.businessDetailsStep__error}>⚠️ {errors.phoneNumber}</span>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className={styles.businessDetailsStep__section}>
          <h3 className={styles.businessDetailsStep__sectionTitle}>Business Address</h3>

          <div className={styles.businessDetailsStep__field}>
            <label className={styles.businessDetailsStep__label}>
              Street Address<span className={styles.businessDetailsStep__required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.businessDetailsStep__input} ${errors.street ? styles['businessDetailsStep__input--error'] : ''}`}
              value={formData.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              placeholder="123 High Street"
              disabled={loading}
            />
            {errors.street && (
              <span className={styles.businessDetailsStep__error}>⚠️ {errors.street}</span>
            )}
          </div>

          <div className={styles.businessDetailsStep__grid}>
            <div className={styles.businessDetailsStep__field}>
              <label className={styles.businessDetailsStep__label}>
                City<span className={styles.businessDetailsStep__required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.businessDetailsStep__input} ${errors.city ? styles['businessDetailsStep__input--error'] : ''}`}
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                placeholder="London"
                disabled={loading}
              />
              {errors.city && (
                <span className={styles.businessDetailsStep__error}>⚠️ {errors.city}</span>
              )}
            </div>

            <div className={styles.businessDetailsStep__field}>
              <label className={styles.businessDetailsStep__label}>
                Postcode<span className={styles.businessDetailsStep__required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.businessDetailsStep__input} ${errors.postcode ? styles['businessDetailsStep__input--error'] : ''}`}
                value={formData.address.postcode}
                onChange={(e) => handleInputChange('address.postcode', e.target.value.toUpperCase())}
                placeholder="SW1A 1AA"
                disabled={loading}
              />
              {errors.postcode && (
                <span className={styles.businessDetailsStep__error}>⚠️ {errors.postcode}</span>
              )}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className={styles.businessDetailsStep__section}>
          <h3 className={styles.businessDetailsStep__sectionTitle}>Food Categories</h3>
          <div className={styles.businessDetailsStep__field}>
            <label className={styles.businessDetailsStep__label}>
              Select your food categories<span className={styles.businessDetailsStep__required}>*</span>
            </label>
            <div className={styles.businessDetailsStep__categories}>
              {FOOD_CATEGORIES.map(category => (
                <button
                  key={category}
                  type="button"
                  className={`${styles.businessDetailsStep__categoryChip} ${
                    formData.categories.includes(category) 
                      ? styles['businessDetailsStep__categoryChip--selected'] 
                      : ''
                  }`}
                  onClick={() => toggleCategory(category)}
                  disabled={loading}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.categories && (
              <span className={styles.businessDetailsStep__error}>⚠️ {errors.categories}</span>
            )}
            <span className={styles.businessDetailsStep__helpText}>
              Selected: {formData.categories.length} categor{formData.categories.length === 1 ? 'y' : 'ies'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.businessDetailsStep__actions}>
          <button
            type="button"
            className={`${styles.businessDetailsStep__button} ${styles['businessDetailsStep__button--secondary']}`}
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className={`${styles.businessDetailsStep__button} ${styles['businessDetailsStep__button--primary']}`}
            disabled={loading}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};
