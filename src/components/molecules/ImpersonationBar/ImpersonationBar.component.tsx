import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import { Button } from '@/components/atoms/Button/Button.component';
import { AdminBadge } from '@/components/atoms/AdminBadge';
import type { ImpersonationBarProps } from './ImpersonationBar.types';
import styles from './ImpersonationBar.module.scss';

export const ImpersonationBar: React.FC<ImpersonationBarProps> = ({
  merchant,
  onChangeMerchant,
  onExitAdminMode,
  showChangeMerchant = true,
  className,
  'data-testid': dataTestId,
}) => {
  const barClasses = classNames(styles.impersonationBar, className);
  
  const merchantName = merchant.business_name || merchant.name || 'Unknown Merchant';

  return (
    <div className={barClasses} data-testid={dataTestId}>
      <div className={styles.impersonationBar__content}>
        <div className={styles.impersonationBar__info}>
          <AdminBadge variant="warning">
            🔧 ADMIN MODE: Viewing as
          </AdminBadge>
          <div className={styles.impersonationBar__merchant}>
            <Typography variant="body-medium" className={styles.impersonationBar__merchantName}>
              {merchantName}
            </Typography>
            {merchant.email && (
              <Typography variant="body-small" className={styles.impersonationBar__merchantEmail}>
                {merchant.email}
              </Typography>
            )}
          </div>
        </div>
        
        <div className={styles.impersonationBar__actions}>
          {showChangeMerchant && onChangeMerchant && (
            <Button variant="secondary" size="sm" onClick={onChangeMerchant}>
              Change Merchant
            </Button>
          )}
          {onExitAdminMode && (
            <Button variant="secondary" size="sm" onClick={onExitAdminMode}>
              Exit Admin Mode
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};