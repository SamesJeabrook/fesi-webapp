import React from 'react';
import Link from 'next/link';
import { Typography, Button } from '@/components/atoms';
import styles from './InvitationCard.module.scss';

export interface InvitationCardProps {
  invitation: {
    id: string;
    group_event_id: string;
    merchant_email: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    invited_at: string;
    expires_at: string;
    message?: string;
    event_title?: string;
    event_start_date?: string;
    event_location?: string;
    organization_name?: string;
    invitation_token?: string;
  };
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  isLoading?: boolean;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
  isLoading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'declined':
        return 'danger';
      case 'expired':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'expired':
        return 'Expired';
      default:
        return 'Pending Response';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = invitation.status === 'expired' || 
                   new Date(invitation.expires_at) < new Date();
  
  const isPending = invitation.status === 'pending' && !isExpired;

  return (
    <div className={styles.invitationCard}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <Typography variant="heading-5" className={styles.eventTitle}>
            {invitation.event_title || 'Group Event'}
          </Typography>
          <span className={`${styles.statusBadge} ${styles[getStatusColor(invitation.status)]}`}>
            {getStatusLabel(invitation.status)}
          </span>
        </div>
        {invitation.organization_name && (
          <Typography variant="body-small" className={styles.organization}>
            Organized by {invitation.organization_name}
          </Typography>
        )}
      </div>

      <div className={styles.details}>
        {invitation.event_start_date && (
          <div className={styles.detail}>
            <span className={styles.icon}>📅</span>
            <Typography variant="body-small">
              {formatDate(invitation.event_start_date)}
            </Typography>
          </div>
        )}
        
        {invitation.event_location && (
          <div className={styles.detail}>
            <span className={styles.icon}>📍</span>
            <Typography variant="body-small">
              {invitation.event_location}
            </Typography>
          </div>
        )}

        <div className={styles.detail}>
          <span className={styles.icon}>⏰</span>
          <Typography variant="body-small" className={styles.expiryText}>
            {isPending 
              ? `Expires: ${formatDate(invitation.expires_at)}`
              : `Invited: ${formatDate(invitation.invited_at)}`
            }
          </Typography>
        </div>
      </div>

      {invitation.message && (
        <div className={styles.message}>
          <Typography variant="body-small" className={styles.messageLabel}>
            Message:
          </Typography>
          <Typography variant="body-small" className={styles.messageText}>
            "{invitation.message}"
          </Typography>
        </div>
      )}

      {isPending && (
        <div className={styles.actions}>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => onAccept?.(invitation.id)}
            isDisabled={isLoading}
          >
            ✓ Accept
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onDecline?.(invitation.id)}
            isDisabled={isLoading}
          >
            ✗ Decline
          </Button>
          {invitation.invitation_token && (
            <Link 
              href={`/invitations/${invitation.invitation_token}`}
              className={styles.viewLink}
            >
              View Details →
            </Link>
          )}
        </div>
      )}

      {invitation.status === 'accepted' && (
        <div className={styles.acceptedNotice}>
          <Typography variant="body-small">
            You're participating in this event! Orders will be linked to this group event.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default InvitationCard;
