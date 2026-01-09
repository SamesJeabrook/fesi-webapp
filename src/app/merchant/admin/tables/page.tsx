'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Typography, Button } from '@/components/atoms';
import { TableFloorPlan, TableSessionModal, PaymentModal, CreateTablesModal } from '@/components/organisms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useMerchant } from '@/hooks/useMerchant';
import api from '@/utils/api';
import styles from './tables.module.scss';

export default function TablesManagement() {
  const { merchant, merchantId, isLoading } = useMerchant();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateTablesModal, setShowCreateTablesModal] = useState(false);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionPaid, setSessionPaid] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTableClick = async (tableId: string) => {
    setSelectedTableId(tableId);
    
    // Fetch current session for this table
    try {
      const data = await api.get(`/api/tables/${tableId}/current-session`);
      if (data.session) {
        setSelectedSessionId(data.session.id);
        setShowSessionModal(true);
      }
    } catch (error) {
      console.error('Error fetching table session:', error);
    }
  };

  const handleSessionUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseSessionModal = () => {
    setShowSessionModal(false);
    setSelectedTableId(null);
    setSelectedSessionId(null);
  };

  const handlePaymentRequest = (total: number, paid: number) => {
    setSessionTotal(total);
    setSessionPaid(paid);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    handleSessionUpdate();
    setShowPaymentModal(false);
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.loading}>
          <Typography variant="body-medium">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.loading}>
          <Typography variant="body-medium">Loading merchant data...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  // Check if merchant is in static mode
  const isStaticMode = merchant.operating_mode === 'static';

  if (!isStaticMode) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.notStaticMode}>
          <Typography variant="heading-4">Table Management Not Available</Typography>
          <Typography variant="body-medium" className={styles.description}>
            Table management is only available for static restaurants. 
            Please switch your operating mode to "Static" in settings to use this feature.
          </Typography>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/merchant/admin/settings'}
          >
            Go to Settings
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.tablesPage}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Link href="/merchant/admin" className={styles.backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-3">Table Management</Typography>
            <Typography variant="body-medium" className={styles.subtitle}>
              Manage your restaurant tables and dining sessions
            </Typography>
          </div>

          <div className={styles.headerActions}>
            {merchant.is_currently_open ? (
              <div className={styles.statusBadge}>
                <span className={styles.openIndicator}>●</span>
                <Typography variant="body-medium">Open for Service</Typography>
              </div>
            ) : (
              <div className={`${styles.statusBadge} ${styles.closed}`}>
                <span className={styles.closedIndicator}>●</span>
                <Typography variant="body-medium">Closed</Typography>
              </div>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <TableFloorPlan
            key={refreshKey}
            merchantId={merchantId!}
            onCreateTables={() => setShowCreateTablesModal(true)}
          />
        </div>

        {/* Modals */}
        <CreateTablesModal
          isOpen={showCreateTablesModal}
          onClose={() => setShowCreateTablesModal(false)}
          merchantId={merchantId!}
          onTablesCreated={handleSessionUpdate}
        />

        {showSessionModal && selectedSessionId && (
          <TableSessionModal
            isOpen={showSessionModal}
            onClose={handleCloseSessionModal}
            tableId={selectedTableId!}
            sessionId={selectedSessionId}
            onSessionUpdate={handleSessionUpdate}
          />
        )}

        {showPaymentModal && selectedSessionId && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            sessionId={selectedSessionId}
            totalAmount={sessionTotal}
            paidAmount={sessionPaid}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
