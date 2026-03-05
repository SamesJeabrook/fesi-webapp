'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import api from '@/utils/api';
import styles from './invitation.module.scss';

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  
  const token = params?.token as string;
  
  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Public endpoint - no auth required
      const response = await api.get(`/api/invitations/token/${token}`, {
        skipAuth: true
      });
      
      setInvitation(response.data);
    } catch (err: any) {
      console.error('Error fetching invitation:', err);
      const errorMessage = err.response?.data?.error || 'Failed to load invitation';
      setError(errorMessage);
      
      // Check for specific error types
      if (errorMessage.includes('expired')) {
        setError('This invitation has expired. Please contact the organization for a new invitation.');
      } else if (errorMessage.includes('not found')) {
        setError('This invitation could not be found. Please check the link and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!isAuthenticated) {
      // Redirect to login with returnTo URL
      await loginWithRedirect({
        appState: {
          returnTo: window.location.pathname
        }
      });
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      await api.post(`/api/invitations/${invitation.id}/accept`);
      
      // Show success and redirect
      alert('Invitation accepted! You\'re now participating in this event.');
      router.push('/merchant/admin');
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      setError(err.response?.data?.error || 'Failed to accept invitation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm('Are you sure you want to decline this invitation?')) {
      return;
    }

    if (!isAuthenticated) {
      // Redirect to login with returnTo URL
      await loginWithRedirect({
        appState: {
          returnTo: window.location.pathname
        }
      });
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      await api.post(`/api/invitations/${invitation.id}/decline`);
      
      // Show message and redirect
      alert('Invitation declined.');
      router.push('/merchant/admin');
    } catch (err: any) {
      console.error('Error declining invitation:', err);
      setError(err.response?.data?.error || 'Failed to decline invitation');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <Typography variant="heading-4">Loading invitation...</Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.error}>
            <span className={styles.errorIcon}>❌</span>
            <Typography variant="heading-3">Unable to Load Invitation</Typography>
            <Typography variant="body-medium">{error || 'Invitation not found'}</Typography>
            <Button 
              variant="primary" 
              onClick={() => router.push('/')}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = invitation.status === 'expired' || 
                   new Date(invitation.expires_at) < new Date();
  const isAlreadyResponded = ['accepted', 'declined'].includes(invitation.status);
  const canRespond = !isExpired && !isAlreadyResponded;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>🎉</div>
          <Typography variant="heading-2" className={styles.title}>
            You're Invited!
          </Typography>
          <Typography variant="heading-4" className={styles.organization}>
            {invitation.organization_name}
          </Typography>
        </div>

        {/* Status Banner */}
        {isAlreadyResponded && (
          <div className={`${styles.statusBanner} ${styles[invitation.status]}`}>
            <Typography variant="body-medium">
              {invitation.status === 'accepted' 
                ? '✓ You have accepted this invitation' 
                : '✗ You have declined this invitation'}
            </Typography>
          </div>
        )}

        {isExpired && !isAlreadyResponded && (
          <div className={`${styles.statusBanner} ${styles.expired}`}>
            <Typography variant="body-medium">
              ⏰ This invitation has expired
            </Typography>
          </div>
        )}

        {/* Event Details */}
        <div className={styles.eventDetails}>
          <Typography variant="heading-3" className={styles.eventTitle}>
            {invitation.event_title || 'Group Event'}
          </Typography>
          
          {invitation.event_description && (
            <Typography variant="body-medium" className={styles.eventDescription}>
              {invitation.event_description}
            </Typography>
          )}

          <div className={styles.detailsList}>
            {invitation.event_start_date && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>📅</span>
                <div>
                  <Typography variant="body-small" className={styles.detailLabel}>
                    Date
                  </Typography>
                  <Typography variant="body-medium" className={styles.detailValue}>
                    {formatDate(invitation.event_start_date)}
                    {invitation.event_end_date && invitation.event_end_date !== invitation.event_start_date && (
                      <> to {formatDate(invitation.event_end_date)}</>
                    )}
                  </Typography>
                </div>
              </div>
            )}

            {invitation.event_location && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>📍</span>
                <div>
                  <Typography variant="body-small" className={styles.detailLabel}>
                    Location
                  </Typography>
                  <Typography variant="body-medium" className={styles.detailValue}>
                    {invitation.event_location}
                  </Typography>
                </div>
              </div>
            )}

            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📧</span>
              <div>
                <Typography variant="body-small" className={styles.detailLabel}>
                  Invited Email
                </Typography>
                <Typography variant="body-medium" className={styles.detailValue}>
                  {invitation.merchant_email}
                </Typography>
              </div>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>⏰</span>
              <div>
                <Typography variant="body-small" className={styles.detailLabel}>
                  Invitation Expires
                </Typography>
                <Typography variant="body-medium" className={styles.detailValue}>
                  {formatDate(invitation.expires_at)}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Message */}
        {invitation.message && (
          <div className={styles.customMessage}>
            <Typography variant="heading-4" className={styles.messageHeader}>
              💬 Message from {invitation.organization_name}
            </Typography>
            <Typography variant="body-medium" className={styles.messageText}>
              "{invitation.message}"
            </Typography>
          </div>
        )}

        {/* Benefits Section */}
        <div className={styles.benefits}>
          <Typography variant="heading-4">What This Means for You</Typography>
          <ul className={styles.benefitsList}>
            <li>Participate in the group event with other merchants</li>
            <li>Receive orders from attendees through Fesi</li>
            <li>Benefit from coordinated promotion by {invitation.organization_name}</li>
            <li>Connect with the community at {invitation.event_location}</li>
          </ul>
          <Typography variant="body-small" className={styles.revenueNote}>
            A small revenue share (typically 20%) of the platform fee will be allocated to support {invitation.organization_name}'s event coordination efforts.
          </Typography>
        </div>

        {/* Actions */}
        {canRespond && (
          <>
            {!isAuthenticated && (
              <div className={styles.loginNotice}>
                <Typography variant="body-medium">
                  Please log in to respond to this invitation
                </Typography>
              </div>
            )}
            
            <div className={styles.actions}>
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleAccept}
                isDisabled={isProcessing}
              >
                {isAuthenticated ? '✓ Accept Invitation' : '🔒 Login to Accept'}
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleDecline}
                isDisabled={isProcessing}
              >
                {isAuthenticated ? '✗ Decline' : '🔒 Login to Decline'}
              </Button>
            </div>
          </>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <Typography variant="body-small">{error}</Typography>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <Typography variant="body-small">
            Questions? Contact {invitation.organization_name} at {invitation.organization_contact_email || invitation.organization_email}
          </Typography>
          <Typography variant="caption" className={styles.footerBrand}>
            Powered by Fesi
          </Typography>
        </div>
      </div>
    </div>
  );
}
