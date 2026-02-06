import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import styles from './StaffFormModal.module.scss';

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: 'server' | 'kitchen' | 'manager' | 'bartender' | 'host';
  pin: string;
  hire_date: string;
}

export interface StaffFormErrors {
  pin?: string;
}

interface StaffFormModalProps {
  isVisible: boolean;
  isEditing: boolean;
  formData: StaffFormData;
  errors?: StaffFormErrors;
  roleLabels: Record<string, string>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof StaffFormData, value: string) => void;
}

export const StaffFormModal: React.FC<StaffFormModalProps> = ({
  isVisible,
  isEditing,
  formData,
  errors = {},
  roleLabels,
  onClose,
  onSubmit,
  onChange
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modal__overlay} onClick={onClose} />
      <Card className={styles.modal__content}>
        <Typography variant="heading-3" className={styles.modal__title}>
          {isEditing ? 'Edit Staff Member' : 'Add Staff Member'}
        </Typography>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.form__field}>
            <label className={styles.form__label}>Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              required
              fullWidth
            />
          </div>

          <div className={styles.form__field}>
            <label className={styles.form__label}>Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              fullWidth
            />
          </div>

          <div className={styles.form__field}>
            <label className={styles.form__label}>Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              fullWidth
            />
          </div>

          <div className={styles.form__field}>
            <label className={styles.form__label}>Role *</label>
            <select
              value={formData.role}
              onChange={(e) => onChange('role', e.target.value)}
              className={styles.form__select}
              required
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.form__field}>
            <label className={styles.form__label}>
              PIN (4-6 digits) {isEditing && '(leave blank to keep current)'}
            </label>
            <Input
              type="text"
              value={formData.pin}
              onChange={(e) => onChange('pin', e.target.value)}
              pattern="\d{4,6}"
              placeholder="1234"
              errorMessage={errors.pin}
              fullWidth
            />
          </div>

          <div className={styles.form__field}>
            <label className={styles.form__label}>Hire Date</label>
            <Input
              type="date"
              value={formData.hire_date}
              onChange={(e) => onChange('hire_date', e.target.value)}
              fullWidth
            />
          </div>

          <div className={styles.form__actions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
