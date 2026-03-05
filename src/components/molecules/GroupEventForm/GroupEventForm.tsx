import React, { useState } from 'react';
import { Typography, Button } from '@/components/atoms';
import { LocationPicker } from '@/components/molecules';
import styles from './GroupEventForm.module.scss';

export interface GroupEventFormData {
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  organization_id?: string;
}

export interface GroupEventFormProps {
  initialData?: Partial<GroupEventFormData>;
  onSubmit: (data: GroupEventFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const GroupEventForm: React.FC<GroupEventFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Create Event'
}) => {
  const [formData, setFormData] = useState<GroupEventFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    start_date: initialData.start_date || '',
    end_date: initialData.end_date || '',
    address: initialData.address || '',
    latitude: initialData.latitude,
    longitude: initialData.longitude,
    organization_id: initialData.organization_id
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GroupEventFormData, string>>>({});

  const handleChange = (field: keyof GroupEventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GroupEventFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Location is required';
    }

    if (formData.end_date && formData.start_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          <Typography variant="body-medium">Event Title *</Typography>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="e.g., Summer Food Festival 2026"
          disabled={isLoading}
        />
        {errors.title && (
          <Typography variant="body-small" className={styles.errorText}>
            {errors.title}
          </Typography>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          <Typography variant="body-medium">Description</Typography>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={styles.textarea}
          placeholder="Describe the event and what merchants can expect..."
          rows={4}
          disabled={isLoading}
        />
        <Typography variant="body-small" className={styles.helpText}>
          This will be shown to merchants in the invitation
        </Typography>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="start_date" className={styles.label}>
            <Typography variant="body-medium">Start Date *</Typography>
          </label>
          <input
            id="start_date"
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            className={`${styles.input} ${errors.start_date ? styles.inputError : ''}`}
            disabled={isLoading}
            min={new Date().toISOString().slice(0, 16)}
          />
          {errors.start_date && (
            <Typography variant="body-small" className={styles.errorText}>
              {errors.start_date}
            </Typography>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="end_date" className={styles.label}>
            <Typography variant="body-medium">End Date (Optional)</Typography>
          </label>
          <input
            id="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            className={`${styles.input} ${errors.end_date ? styles.inputError : ''}`}
            disabled={isLoading}
            min={formData.start_date || new Date().toISOString().slice(0, 16)}
          />
          {errors.end_date && (
            <Typography variant="body-small" className={styles.errorText}>
              {errors.end_date}
            </Typography>
          )}
          <Typography variant="body-small" className={styles.helpText}>
            Leave blank for single-day events
          </Typography>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.label}>
          <Typography variant="body-medium">Location *</Typography>
        </label>
        <input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
          placeholder="Enter event location/address"
          disabled={isLoading}
        />
        {errors.address && (
          <Typography variant="body-small" className={styles.errorText}>
            {errors.address}
          </Typography>
        )}
        <Typography variant="body-small" className={styles.helpText}>
          Drag the map pin to set the exact location
        </Typography>
        <LocationPicker
          latitude={formData.latitude || 51.5074}
          longitude={formData.longitude || -0.1278}
          onLocationChange={(lat: number, lng: number) => {
            handleChange('latitude', lat);
            handleChange('longitude', lng);
          }}
          label="Drag pin to set exact location"
          height="300px"
        />
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isDisabled={isLoading}
        >
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default GroupEventForm;
