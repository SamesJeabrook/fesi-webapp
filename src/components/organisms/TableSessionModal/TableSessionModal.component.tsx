'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/molecules';
import { Typography, Button, SessionTimer } from '@/components/atoms';
import { SessionOrderList, BillSummary } from '@/components/molecules';
import api from '@/utils/api';
import type { TableSessionModalProps, TableSession } from './TableSessionModal.types';
import styles from './TableSessionModal.module.scss';

export const TableSessionModal: React.FC<TableSessionModalProps> = ({
  isOpen,
  onClose,
  tableId,
  sessionId,
  onSessionUpdate,
  className = '',
}) => {
  const [session, setSession] = useState<TableSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchSessionDetails();
    }
  }, [isOpen, sessionId]);

  const fetchSessionDetails = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const data = await api.get(`/api/table-sessions/${sessionId}/orders`);
      setSession(data.session);
      setError(null);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!sessionId) return;

    try {
      await api.post(`/api/table-sessions/${sessionId}/complete`, {});
      onSessionUpdate?.();
      onClose();
    } catch (err) {
      console.error('Error completing session:', err);
      setError('Failed to complete session');
    }
  };

  const handleRequestBill = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    fetchSessionDetails();
    onSessionUpdate?.();
  };

  const footer = session && (
    <div className={styles.modalFooter}>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      {session.payment_status !== 'complete' && (
        <Button variant="primary" onClick={handleRequestBill}>
          Request Bill
        </Button>
      )}
      {session.payment_status === 'complete' && (
        <Button variant="primary" onClick={handleCompleteSession}>
          Complete Session
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={session ? `Table ${session.table_number}` : 'Table Session'}
      size="large"
      footer={footer}
    >
      <div className={`${styles.tableSessionModal} ${className}`}>
        {loading && (
          <div className={styles.loading}>
            <Typography variant="body-medium">Loading session...</Typography>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <Typography variant="body-medium" className={styles.errorText}>
              {error}
            </Typography>
          </div>
        )}

        {session && !loading && (
          <>
            <div className={styles.sessionInfo}>
              <div className={styles.infoRow}>
                <Typography variant="body-medium">
                  <strong>Guests:</strong> {session.guest_count}
                </Typography>
                <SessionTimer startTime={session.seated_at} />
              </div>
              {session.server_name && (
                <Typography variant="body-medium">
                  <strong>Server:</strong> {session.server_name}
                </Typography>
              )}
              <div className={styles.paymentStatus}>
                <Typography variant="body-medium">
                  <strong>Payment Status:</strong>
                </Typography>
                <span className={`${styles.badge} ${styles[session.payment_status]}`}>
                  {session.payment_status.charAt(0).toUpperCase() + session.payment_status.slice(1)}
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.ordersSection}>
              <Typography variant="heading-5" className={styles.sectionTitle}>
                Orders
              </Typography>
              <SessionOrderList
                orders={session.orders}
                sessionTotal={session.total_amount}
              />
            </div>

            {showPayment && (
              <>
                <div className={styles.divider} />
                <div className={styles.billSection}>
                  <Typography variant="heading-5" className={styles.sectionTitle}>
                    Bill Summary
                  </Typography>
                  <BillSummary
                    subtotal={session.total_amount}
                    total={session.total_amount}
                    paidAmount={session.paid_amount}
                    remainingAmount={session.total_amount - session.paid_amount}
                    showSplitOptions={true}
                    guestCount={session.guest_count}
                  />
                </div>
              </>
            )}
          </>
        )}

        {!session && !loading && !error && (
          <div className={styles.emptyState}>
            <Typography variant="body-medium">
              No active session for this table.
            </Typography>
          </div>
        )}
      </div>
    </Modal>
  );
};
