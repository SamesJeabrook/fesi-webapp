import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import { MerchantCard } from '@/components/atoms/MerchantCard';
import type { MerchantGridProps } from './MerchantGrid.types';
import styles from './MerchantGrid.module.scss';

export const MerchantGrid: React.FC<MerchantGridProps> = ({
  merchants,
  selectedMerchantId,
  onMerchantSelect,
  isLoading = false,
  error = null,
  emptyMessage = 'No merchants found',
  columns = 3,
  className,
  'data-testid': dataTestId,
}) => {
  const gridClasses = classNames(
    styles.merchantGrid,
    styles[`columns${columns}`],
    className
  );

  if (isLoading) {
    return (
      <div className={styles.merchantGrid__loading} data-testid={dataTestId}>
        <div className={styles.merchantGrid__spinner}>⏳</div>
        <Typography variant="body-medium">Loading merchants...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.merchantGrid__error} data-testid={dataTestId}>
        <Typography variant="body-medium" className={styles.merchantGrid__errorText}>
          ⚠️ {error}
        </Typography>
      </div>
    );
  }

  if (!merchants || merchants.length === 0) {
    return (
      <div className={styles.merchantGrid__empty} data-testid={dataTestId}>
        <Typography variant="body-medium" className={styles.merchantGrid__emptyText}>
          📭 {emptyMessage}
        </Typography>
      </div>
    );
  }

  return (
    <div className={gridClasses} data-testid={dataTestId}>
      {merchants.map((merchant) => (
        <MerchantCard
          key={merchant.id}
          merchant={merchant}
          isSelected={selectedMerchantId === merchant.id}
          onSelect={onMerchantSelect}
          className={styles.merchantGrid__card}
        />
      ))}
    </div>
  );
};