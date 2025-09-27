import React from 'react';
import OrderCostBreakdown from './OrderCostBreakdown';

export default {
  title: 'Molecules/OrderCostBreakdown',
  component: OrderCostBreakdown,
};

export const Default = () => (
  <OrderCostBreakdown
    subtotal={8.50}
    basePlatformFee={0.85}
    smallOrderFee={0.35}
    totalPlatformFee={1.20}
    merchantAmount={8.50}
    totalOrderAmount={9.70}
    minimumOrderValue={3.00}
    smallOrderProtectionApplied={true}
  />
);

export const NoSmallOrderFee = () => (
  <OrderCostBreakdown
    subtotal={15.00}
    basePlatformFee={1.50}
    smallOrderFee={0.00}
    totalPlatformFee={1.50}
    merchantAmount={15.00}
    totalOrderAmount={16.50}
    minimumOrderValue={3.00}
    smallOrderProtectionApplied={false}
  />
);
