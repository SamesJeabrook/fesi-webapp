'use client';

import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/providers/AdminProvider';
import { Typography, AdminBadge } from '@/components/atoms';
import { Button } from '@/components/atoms/Button/Button.component';
import { ImpersonationBar } from '@/components/molecules/ImpersonationBar';
import type { AdminHeaderProps } from './AdminHeader.types';
import styles from './AdminHeader.module.scss';

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  className,
  'data-testid': dataTestId,
}) => {
  const router = useRouter();
  const { selectedMerchant, isImpersonating, isAdmin, clearImpersonation } = useAdmin();

  if (!isAdmin) return null;

  const handleChangeMerchant = () => {
    // Clear current impersonation first
    clearImpersonation();
    // Navigate to merchant selection page
    router.push('/admin/merchants');
  };

  const handleExitAdminMode = () => {
    clearImpersonation();
  };

  const headerClasses = classNames(styles.adminHeader, className);

  return (
    <div className={headerClasses} data-testid={dataTestId}>
      <div className={styles.adminHeader__container}>
        <div className={styles.adminHeader__content}>
          {isImpersonating && selectedMerchant ? (
            <ImpersonationBar
              merchant={selectedMerchant}
              onChangeMerchant={handleChangeMerchant}
              onExitAdminMode={handleExitAdminMode}
            />
          ) : (
            <div className={styles.adminHeader__normal}>
              <AdminBadge variant="info">
                👑 Admin Dashboard
              </AdminBadge>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => router.push('/admin/merchants')}
              >
                Select Merchant
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};