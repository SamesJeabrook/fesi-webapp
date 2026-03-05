'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import { GroupEventForm, GroupEventFormData } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import styles from './create.module.scss';

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: GroupEventFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get user's organization_id (optional - will be created if needed)
      try {
        const userData = await api.get('/api/users/me');
        if (userData.user?.organization_id) {
          formData.organization_id = userData.user.organization_id;
        }
      } catch (err) {
        console.log('No existing organization, will be created automatically');
      }

      const response = await api.post('/api/group-events', formData);
      
      // Redirect to the event detail page
      router.push(`/admin/group-events/${response.id}`);
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.error || 'Failed to create event');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/group-events');
  };

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className={styles.backButton}
          >
            ← Back to Events
          </Button>
          <Typography variant="heading-2">Create Group Event</Typography>
          <Typography variant="body-medium" className={styles.subtitle}>
            Organize a group event and invite merchants to participate
          </Typography>
        </div>

        {error && (
          <div className={styles.error}>
            <Typography variant="body-small">{error}</Typography>
          </div>
        )}

        <Card className={styles.formCard}>
          <GroupEventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitLabel="Create Event"
          />
        </Card>

        <div className={styles.infoBox}>
          <Typography variant="heading-6">What happens next?</Typography>
          <ul className={styles.infoList}>
            <li>
              <Typography variant="body-small">
                After creating the event, you&apos;ll be able to invite merchants via email
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                Merchants will receive invitation emails with event details and secure acceptance links
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                Track participation, manage invitations, and view revenue sharing from the event dashboard
              </Typography>
            </li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
