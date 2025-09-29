import React from 'react';
import { Typography } from '@/components/atoms';
import styles from './EmptyBasketNotice.module.scss';

const EmptyBasketNotice: React.FC = () => (
  <div className={styles.noticeWrapper}>
    <span className={styles.donut}>&#x1F369;</span>
    <Typography variant="heading-6" as='h2'>You haven't added any items yet!</Typography>
    <Typography variant="body-small">Add items to your basket to begin your order.</Typography>
  </div>
);

export default EmptyBasketNotice;
