// Shared payment configuration for both frontend and backend
// All monetary values are in pence (integer)

export const paymentConfig = {
  platformFeePercentage: 0.10, // 10% platform fee
  minimumOrderValue: 300, // 300 pence = £3.00
  stripeFeePct: 0.029, // 2.9%
  stripeFeeFixed: 30, // 30 pence = £0.30
  minimumPlatformProfit: 20, // 20 pence = £0.20
  smallOrderThreshold: 1000, // 1000 pence = £10.00
  currency: 'gbp',
};
