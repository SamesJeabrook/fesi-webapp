import React from 'react';
import { Typography } from '@/components/atoms';
import styles from './PaymentHoldingNotice.module.scss';

const PaymentHoldingNotice: React.FC = () => (
  <div className={styles.holdingWrapper}>
    <span className={styles.icon}>&#x1F44D;</span>
    <Typography variant="heading-6" as='h2'>Waiting for merchant to accept your order…</Typography>
    <Typography variant="body-small">Your payment details are securely held. You will only be charged if the merchant accepts your order.</Typography>
  </div>
);

export default PaymentHoldingNotice;
