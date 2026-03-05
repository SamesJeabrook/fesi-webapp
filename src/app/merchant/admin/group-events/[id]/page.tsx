'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import { InvitationManager } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import styles from './eventDetail.module.scss';

interface GroupEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  address: string;
  latitude: number;
  longitude: number;
  organization_id: string;
  organization_name: string;
  status: 'upcoming' | 'active' | 'completed';
  created_at: string;
}

interface Participant {
  id: string;
  merchant_id: string;
  merchant_name: string;
  business_name?: string;
  status: 'invited' | 'accepted' | 'declined';
  invitation_sent_at: string;
  responded_at?: string;
}

interface Invitation {
  id: string;
  invitation_token: string;
  merchant_email: string;
  custom_message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sent_at: string;
  responded_at?: string;
}

export default function MerchantEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<GroupEvent | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingInvitations, setIsSendingInvitations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [eventRes, participantsRes, invitationsRes] = await Promise.all([
        api.get(`/api/group-events/${eventId}`),
        api.get(`/api/group-events/${eventId}/participants`),
        api.get(`/api/group-events/${eventId}/invitations`)
      ]);

      setEvent(eventRes);
      setParticipants(participantsRes || []);
      setInvitations(invitationsRes || []);
    } catch (err: any) {
      console.error('Error fetching event details:', err);
      setError(err.response?.data?.error || 'Failed to load event details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvitations = async (emails: string[], customMessage?: string) => {
    try {
      setIsSendingInvitations(true);
      setError(null);

      await api.post(`/api/group-events/${eventId}/invitations`, {
        merchant_emails: emails,
        custom_message: customMessage
      });

      // Refresh invitations list
      await fetchEventDetails();
      
      alert(`Successfully sent ${emails.length} invitation${emails.length !== 1 ? 's' : ''}!`);
    } catch (err: any) {
      console.error('Error sending invitations:', err);
      setError(err.response?.data?.error || 'Failed to send invitations');
    } finally {
      setIsSendingInvitations(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Pending', color: 'warning' },
      invited: { label: 'Invited', color: 'info' },
      accepted: { label: 'Accepted', color: 'success' },
      declined: { label: 'Declined', color: 'danger' },
      expired: { label: 'Expired', color: 'secondary' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Typography variant="heading-3">Loading event...</Typography>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.container}>
          <div className={styles.error}>
            <Typography variant="body-medium">Event not found</Typography>
            <Button onClick={() => router.push('/merchant/admin/group-events')}>
              Back to Events
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const acceptedCount = participants.filter(p => p.status === 'accepted').length;
  const pendingCount = invitations.filter(i => i.status === 'pending').length;

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/merchant/admin/group-events')}
            className={styles.backButton}
          >
            ← Back to Events
          </Button>

          <div className={styles.titleRow}>
            <Typography variant="heading-2">{event.title}</Typography>
            <span className={`${styles.statusBadge} ${styles[event.status]}`}>
              {event.status}
            </span>
          </div>

          {event.description && (
            <Typography variant="body-medium" className={styles.description}>
              {event.description}
            </Typography>
          )}
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <Typography variant="body-small">{error}</Typography>
          </div>
        )}

        <div className={styles.content}>
          {/* Event Details */}
          <div className={styles.column}>
            <Card className={styles.section}>
              <Typography variant="heading-5" className={styles.sectionTitle}>
                Event Details
              </Typography>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📅</span>
                  <div>
                    <Typography variant="caption" className={styles.detailLabel}>
                      Start Date
                    </Typography>
                    <Typography variant="body-small">
                      {formatDate(event.start_date)}
                    </Typography>
                  </div>
                </div>
                {event.end_date && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📅</span>
                    <div>
                      <Typography variant="caption" className={styles.detailLabel}>
                        End Date
                      </Typography>
                      <Typography variant="body-small">
                        {formatDate(event.end_date)}
                      </Typography>
                    </div>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📍</span>
                  <div>
                    <Typography variant="caption" className={styles.detailLabel}>
                      Location
                    </Typography>
                    <Typography variant="body-small">{event.address}</Typography>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🏢</span>
                  <div>
                    <Typography variant="caption" className={styles.detailLabel}>
                      Organizer
                    </Typography>
                    <Typography variant="body-small">{event.organization_name}</Typography>
                  </div>
                </div>
              </div>
            </Card>

            {/* Statistics */}
            <Card className={styles.section}>
              <Typography variant="heading-5" className={styles.sectionTitle}>
                Statistics
              </Typography>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <Typography variant="heading-3" className={styles.statValue}>
                    {acceptedCount}
                  </Typography>
                  <Typography variant="caption" className={styles.statLabel}>
                    Participating Merchants
                  </Typography>
                </div>
                <div className={styles.statCard}>
                  <Typography variant="heading-3" className={styles.statValue}>
                    {pendingCount}
                  </Typography>
                  <Typography variant="caption" className={styles.statLabel}>
                    Pending Invitations
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Participants */}
            <Card className={styles.section}>
              <Typography variant="heading-5" className={styles.sectionTitle}>
                Participants ({participants.length})
              </Typography>
              {participants.length === 0 ? (
                <Typography variant="body-small" className={styles.emptyText}>
                  No participants yet. Send invitations to get started.
                </Typography>
              ) : (
                <div className={styles.participantsList}>
                  {participants.map((participant) => {
                    const badge = getStatusBadge(participant.status);
                    return (
                      <div key={participant.id} className={styles.participantItem}>
                        <div>
                          <Typography variant="body-medium">
                            {participant.merchant_name}
                          </Typography>
                          {participant.business_name && (
                            <Typography variant="caption" className={styles.businessName}>
                              {participant.business_name}
                            </Typography>
                          )}
                        </div>
                        <span className={`${styles.badge} ${styles[badge.color]}`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Invitations */}
            <Card className={styles.section}>
              <Typography variant="heading-5" className={styles.sectionTitle}>
                Recent Invitations ({invitations.length})
              </Typography>
              {invitations.length === 0 ? (
                <Typography variant="body-small" className={styles.emptyText}>
                  No invitations sent yet.
                </Typography>
              ) : (
                <div className={styles.invitationsList}>
                  {invitations.slice(0, 10).map((invitation) => {
                    const badge = getStatusBadge(invitation.status);
                    return (
                      <div key={invitation.id} className={styles.invitationItem}>
                        <div>
                          <Typography variant="body-small">
                            {invitation.merchant_email}
                          </Typography>
                          <Typography variant="caption" className={styles.invitationDate}>
                            Sent {formatDate(invitation.sent_at)}
                          </Typography>
                        </div>
                        <span className={`${styles.badge} ${styles[badge.color]}`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Invitation Manager */}
          <div className={styles.column}>
            <Card className={styles.section}>
              <Typography variant="heading-5" className={styles.sectionTitle}>
                Invite Merchants
              </Typography>
              <InvitationManager
                groupEventId={eventId}
                onSendInvitations={handleSendInvitations}
                isLoading={isSendingInvitations}
              />
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
