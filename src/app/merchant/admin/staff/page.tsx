'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useMerchant } from '@/hooks/useMerchant';
import { StaffCard, StaffMember } from '@/components/organisms/StaffCard';
import { StaffFormModal, StaffFormData, StaffFormErrors } from '@/components/organisms/StaffFormModal';
import styles from './staff.module.scss';

const ROLE_LABELS = {
  server: 'Server',
  kitchen: 'Kitchen',
  manager: 'Manager',
  bartender: 'Bartender',
  host: 'Host'
};

export default function StaffManagementPage() {
  const { merchant, merchantId, isLoading: merchantLoading } = useMerchant();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<StaffFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'server',
    pin: '',
    hire_date: ''
  });
  const [formErrors, setFormErrors] = useState<StaffFormErrors>({});

  useEffect(() => {
    if (merchantId) {
      loadStaff();
    }
  }, [merchantId]);

  const loadStaff = async () => {
    if (!merchantId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/staff/merchant/${merchantId}`);
      setStaff(response.staff || []);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'server',
      pin: '',
      hire_date: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      role: staffMember.role,
      pin: '', // Don't show existing PIN
      hire_date: staffMember.hire_date || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleChange = (field: keyof StaffFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user types
    if (formErrors[field as keyof StaffFormErrors]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantId) return;

    try {
      const payload = {
        ...formData,
        merchant_id: merchantId,
        // Only include PIN if it's been entered
        ...(formData.pin && { pin: formData.pin })
      };

      if (editingStaff) {
        await api.put(`/api/staff/${editingStaff.id}`, payload);
      } else {
        await api.post('/api/staff', payload);
      }

      setShowModal(false);
      setFormErrors({});
      loadStaff();
    } catch (error: any) {
      console.error('Error saving staff:', error);
      const errorMessage = error.message || error.response?.data?.error || 'Failed to save staff member';
      
      // Handle duplicate PIN error
      if (errorMessage.includes('PIN already in use')) {
        setFormErrors({ pin: errorMessage });
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await api.delete(`/api/staff/${id}`);
      loadStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff member');
    }
  };

  const handleToggleActive = async (staffMember: StaffMember) => {
    try {
      await api.put(`/api/staff/${staffMember.id}`, {
        is_active: !staffMember.is_active
      });
      loadStaff();
    } catch (error) {
      console.error('Error toggling staff status:', error);
    }
  };

  if (merchantLoading || loading) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.loading}>
          <Typography variant="body-lg">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  if (!merchant || !merchantId) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.loading}>
          <Typography variant="body-lg">No merchant found</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.staffPage}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Link href="/merchant/admin" className={styles.backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-1">Staff Management</Typography>
            <Typography variant="body-md" color="secondary" className={styles.subtitle}>
              Manage your restaurant staff and track their performance
            </Typography>
          </div>
          <Button onClick={handleCreate} variant="primary">
            + Add Staff Member
          </Button>
        </div>

        <div className={styles.staffGrid}>
          {staff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              roleLabel={ROLE_LABELS[member.role]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>

        {staff.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyState__icon}>👥</div>
            <Typography variant="heading-4" color="secondary">
              No staff members yet
            </Typography>
            <Typography variant="body-md" color="secondary" className={styles.emptyState__subtitle}>
              Add your first staff member to start tracking orders
            </Typography>
          </div>
        )}

        <StaffFormModal
          isVisible={showModal}
          isEditing={!!editingStaff}
          formData={formData}
          errors={formErrors}
          roleLabels={ROLE_LABELS}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />
      </div>
    </ProtectedRoute>
  );
}
