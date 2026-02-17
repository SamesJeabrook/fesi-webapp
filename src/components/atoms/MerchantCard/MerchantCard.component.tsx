import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import { Button } from '@/components/atoms/Button/Button.component';
import type { MerchantCardProps } from './MerchantCard.types';
import styles from './MerchantCard.module.scss';

export const MerchantCard: React.FC<MerchantCardProps> = ({
  merchant,
  isSelected = false,
  onSelect,
  className,
  'data-testid': dataTestId,
}) => {
  const cardClasses = classNames(
    styles.merchantCard,
    {
      [styles.selected]: isSelected,
      [styles.clickable]: !!onSelect,
    },
    className
  );

  const handleSelect = () => {
    if (onSelect) {
      onSelect(merchant);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <div className={cardClasses} data-testid={dataTestId}>
      <div className={styles.merchantCard__header}>
        <div className={styles.merchantCard__info}>
          <Typography variant="heading-4" className={styles.merchantCard__name}>
            {merchant.name}
          </Typography>
          <Typography variant="body-small" className={styles.merchantCard__username}>
            @{merchant.username}
          </Typography>
        </div>
        <div className={`${styles.merchantCard__status} ${styles[getStatusVariant(merchant.overall_status || merchant.status || '')]}`}>
          <Typography variant="body-small">
            {merchant.overall_status || merchant.status}
          </Typography>
        </div>
      </div>
      
      <div className={styles.merchantCard__details}>
        <Typography variant="body-small" className={styles.merchantCard__phone}>
          📞 {merchant.phone}
        </Typography>
        <Typography variant="body-small" className={styles.merchantCard__date}>
          📅 Joined {formatDate(merchant.created_at)}
        </Typography>
      </div>

      {onSelect && (
        <div className={styles.merchantCard__actions}>
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={handleSelect}
            fullWidth
          >
            {isSelected ? 'Selected' : 'Select Merchant'}
          </Button>
        </div>
      )}
    </div>
  );
};