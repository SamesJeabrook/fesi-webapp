'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import styles from './events.module.scss';

interface GroupEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  address: string;
  organization_name?: string;
  confirmed_participants: number;
  status: 'upcoming' | 'active' | 'completed';
  created_at: string;
}

export default function MerchantGroupEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/api/group-events');
      setEvents(response.events || []);
    } catch (err: any) {
      console.error('Error fetching group events:', err);
      setError(err.response?.data?.error || 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: { label: 'Upcoming', color: 'info' },
      active: { label: 'Active', color: 'success' },
      completed: { label: 'Completed', color: 'secondary' }
    };
    return badges[status as keyof typeof badges] || badges.upcoming;
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Typography variant="heading-3">Loading events...</Typography>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Typography variant="heading-2">My Group Events</Typography>
            <Typography variant="body-medium" className={styles.subtitle}>
              Organize and participate in collaborative events with other merchants
            </Typography>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push('/merchant/admin/group-events/create')}
          >
            + Create Event
          </Button>
        </div>

        {error && (
          <div className={styles.error}>
            <Typography variant="body-small">{error}</Typography>
          </div>
        )}

        {events.length === 0 ? (
          <Card className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <span className={styles.emptyIcon}>🤝</span>
              <Typography variant="heading-4">No group events yet</Typography>
              <Typography variant="body-medium" className={styles.emptyText}>
                Create your first group event to collaborate with other merchants and share revenue opportunities
              </Typography>
              <Button
                variant="primary"
                onClick={() => router.push('/merchant/admin/group-events/create')}
              >
                Create Your First Event
              </Button>
            </div>
          </Card>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map((event) => {
              const badge = getStatusBadge(event.status);
              return (
                <Card key={event.id} className={styles.eventCard}>
                  <div className={styles.cardHeader}>
                    <Typography variant="heading-5" className={styles.eventTitle}>
                      {event.title}
                    </Typography>
                    <span className={`${styles.statusBadge} ${styles[badge.color]}`}>
                      {badge.label}
                    </span>
                  </div>

                  {event.description && (
                    <Typography variant="body-small" className={styles.eventDescription}>
                      {event.description}
                    </Typography>
                  )}

                  <div className={styles.eventDetails}>
                    <div className={styles.detail}>
                      <span className={styles.detailIcon}>📅</span>
                      <Typography variant="body-small">
                        {formatDate(event.start_date)}
                        {event.end_date && event.end_date !== event.start_date && (
                          <> → {formatDate(event.end_date)}</>
                        )}
                      </Typography>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailIcon}>📍</span>
                      <Typography variant="body-small">{event.address}</Typography>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailIcon}>👥</span>
                      <Typography variant="body-small">
                        {event.confirmed_participants} confirmed merchant{event.confirmed_participants !== 1 ? 's' : ''}
                      </Typography>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <Link href={`/merchant/admin/group-events/${event.id}`}>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/merchant/admin/group-events/${event.id}`}>
                      <Button variant="primary" size="sm">
                        Manage Event
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
