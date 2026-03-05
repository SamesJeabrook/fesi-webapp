import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, Button } from '@/components/atoms';
import { InvitationCard } from '@/components/molecules/InvitationCard';
import api from '@/utils/api';
import styles from './MyInvitations.module.scss';

export interface MyInvitationsProps {
  merchantEmail?: string;
  maxDisplay?: number;
  showAll?: boolean;
}

export const MyInvitations: React.FC<MyInvitationsProps> = ({
  merchantEmail,
  maxDisplay = 3,
  showAll = false
}) => {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, [merchantEmail]);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch invitations for the current merchant
      const response = await api.get('/api/invitations/my-invitations');
      
      // Filter and sort: pending first, then by invited_at desc
      const allInvitations = response.data || [];
      const sortedInvitations = allInvitations.sort((a: any, b: any) => {
        // Pending invitations first
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        
        // Then by date (newest first)
        return new Date(b.invited_at).getTime() - new Date(a.invited_at).getTime();
      });
      
      setInvitations(sortedInvitations);
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
      setError(err.response?.data?.error || 'Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (invitationId: string) => {
    try {
      setActionLoading(invitationId);
      setError(null);
      
      await api.post(`/api/invitations/${invitationId}/accept`);
      
      // Refresh invitations
      await fetchInvitations();
      
      // Show success message (could use a toast notification)
      alert('Invitation accepted! You\'re now participating in this event.');
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      setError(err.response?.data?.error || 'Failed to accept invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    if (!confirm('Are you sure you want to decline this invitation?')) {
      return;
    }
    
    try {
      setActionLoading(invitationId);
      setError(null);
      
      await api.post(`/api/invitations/${invitationId}/decline`);
      
      // Refresh invitations
      await fetchInvitations();
    } catch (err: any) {
      console.error('Error declining invitation:', err);
      setError(err.response?.data?.error || 'Failed to decline invitation');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.myInvitations}>
        <div className={styles.header}>
          <Typography variant="heading-4">📨 My Invitations</Typography>
        </div>
        <div className={styles.loading}>
          <Typography variant="body-medium">Loading invitations...</Typography>
        </div>
      </div>
    );
  }

  const displayedInvitations = showAll 
    ? invitations 
    : invitations.slice(0, maxDisplay);
  
  const pendingCount = invitations.filter(inv => inv.status === 'pending').length;
  const hasMore = invitations.length > maxDisplay && !showAll;

  if (invitations.length === 0) {
    return (
      <div className={styles.myInvitations}>
        <div className={styles.header}>
          <Typography variant="heading-4">📨 My Invitations</Typography>
        </div>
        <div className={styles.empty}>
          <Typography variant="body-medium">
            No invitations yet. When an organization invites you to participate in a group event, it will appear here.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.myInvitations}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <Typography variant="heading-4">📨 My Invitations</Typography>
          {pendingCount > 0 && (
            <span className={styles.badge}>{pendingCount} pending</span>
          )}
        </div>
        {hasMore && (
          <Link href="/merchant/admin/invitations" className={styles.viewAllLink}>
            View All ({invitations.length})
          </Link>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <Typography variant="body-small">{error}</Typography>
        </div>
      )}

      <div className={styles.invitationsList}>
        {displayedInvitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onAccept={handleAccept}
            onDecline={handleDecline}
            isLoading={actionLoading === invitation.id}
          />
        ))}
      </div>

      {hasMore && (
        <div className={styles.viewAllFooter}>
          <Link href="/merchant/admin/invitations">
            <Button variant="secondary" size="md">
              View All Invitations ({invitations.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyInvitations;
