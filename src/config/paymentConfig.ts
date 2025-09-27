// Shared payment configuration for both frontend and backend

export const paymentConfig = {
  platformFeePercentage: 0.10, // 10% platform fee
  minimumOrderValue: 3.00, // £3 minimum
  stripeFeePct: 0.029, // 2.9%
  stripeFeeFixed: 0.30, // £0.30
  minimumPlatformProfit: 0.20, // Minimum £0.20 profit per order
  smallOrderThreshold: 10.00, // £10 threshold for small order fees
  currency: 'gbp',
};
