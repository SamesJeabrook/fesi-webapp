import React from 'react';
import { Typography } from '@/components/atoms';
import { formatPrice } from '@/utils/menu';
import styles from './OrderCostBreakdown.module.scss';

export interface OrderCostBreakdownProps {
  subtotal: number;
  basePlatformFee: number;
  smallOrderFee: number;
  totalPlatformFee: number;
  merchantAmount: number;
  totalOrderAmount: number;
  minimumOrderValue: number;
  smallOrderProtectionApplied: boolean;
}

const OrderCostBreakdown: React.FC<OrderCostBreakdownProps> = ({
  subtotal,
  basePlatformFee,
  smallOrderFee,
  totalPlatformFee,
  merchantAmount,
  totalOrderAmount,
  minimumOrderValue,
  smallOrderProtectionApplied
}) => (
  <div className={styles.breakdown}>
    <Typography variant="heading-6">Order Cost Breakdown</Typography>
    <div className={styles.row}><span>Subtotal:</span> <span>{formatPrice(subtotal)}</span></div>
    <div className={styles.row}><span>Platform Fee (10%):</span> <span>{formatPrice(basePlatformFee)}</span></div>
    {smallOrderProtectionApplied && (
      <div className={styles.row}><span>Small Order Fee:</span> <span>{formatPrice(smallOrderFee)}</span></div>
    )}
    <div className={styles.row}><span>Total Platform Fee:</span> <span>{formatPrice(totalPlatformFee)}</span></div>
    <div className={styles.row}><span>Merchant Receives:</span> <span>{formatPrice(merchantAmount)}</span></div>
    <div className={styles.row}><span>Total to Pay:</span> <span>{formatPrice(totalOrderAmount)}</span></div>
    <div className={styles.note}>
      <Typography variant="body-small">
        Minimum order value: {formatPrice(minimumOrderValue)}. {smallOrderProtectionApplied ? 'A small order fee has been applied to ensure platform costs are covered.' : 'No small order fee applied.'}
      </Typography>
    </div>
  </div>
);

export default OrderCostBreakdown;
