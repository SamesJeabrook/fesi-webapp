import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import styles from './StaffCard.module.scss';

export interface StaffMember {
  id: string;
  merchant_id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'server' | 'kitchen' | 'manager' | 'bartender' | 'host';
  is_active: boolean;
  hire_date?: string;
  has_pin: boolean;
  created_at: string;
}

interface StaffCardProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
  onToggleActive: (staff: StaffMember) => void;
  roleLabel: string;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  onEdit,
  onDelete,
  onToggleActive,
  roleLabel
}) => {
  return (
    <Card className={styles.staffCard}>
      <div className={styles.staffCard__header}>
        <div className={styles.staffCard__info}>
          <Typography variant="heading-4">{staff.name}</Typography>
          <Typography variant="body-small">
            {roleLabel}
          </Typography>
        </div>
        <div className={styles.staffCard__actions}>
          <Button
            onClick={() => onEdit(staff)}
            variant="secondary"
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(staff.id)}
            variant="danger"
            size="sm"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className={styles.staffCard__details}>
        {staff.email && (
          <Typography variant="body-small">
            📧 {staff.email}
          </Typography>
        )}
        {staff.phone && (
          <Typography variant="body-small">
            📱 {staff.phone}
          </Typography>
        )}
        {staff.has_pin && (
          <Typography variant="body-small">
            🔐 PIN Configured
          </Typography>
        )}
      </div>

      <div className={styles.staffCard__footer}>
        <Button
          variant={staff.is_active ? 'outline' : 'primary'}
          size="sm"
          onClick={() => onToggleActive(staff)}
          fullWidth
        >
          {staff.is_active ? 'Active' : 'Inactive'}
        </Button>
      </div>
    </Card>
  );
};
