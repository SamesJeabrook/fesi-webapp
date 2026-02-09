import React from 'react';
import { Typography } from '@/components/atoms';
import styles from './DisplayOrderCard.module.scss';

interface DisplayOrderCardProps {
  orderNumber: string;
}

export const DisplayOrderCard: React.FC<DisplayOrderCardProps> = ({ orderNumber }) => {
  return (
    <div className={styles.orderCard}>
      <Typography variant="heading-3" className={styles.orderNumber}>
        #{orderNumber}
      </Typography>
    </div>
  );
};
