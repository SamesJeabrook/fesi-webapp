// Shared payment configuration for both frontend and backend
// All monetary values are in pence (integer)

export const paymentConfig = {
  // Online order fees (customer pays)
  platformFeePercentage: 0.10, // 10% platform fee
  minimumOrderValue: 100, // 100 pence = £1.00
  minimumPlatformProfit: 20, // 20 pence = £0.20
  smallOrderThreshold: 1000, // 1000 pence = £10.00
  
  // Stripe fees (same for all)
  stripeFeePct: 0.029, // 2.9%
  stripeFeeFixed: 30, // 30 pence = £0.30
  
  // POS fees (merchant pays) - tier-based
  posFees: {
    free: {
      percentage: 0.035, // 3.5%
      fixedPence: 30, // £0.30
    },
    professional: {
      percentage: 0.030, // 3.0%
      fixedPence: 40, // £0.40
    },
    business: {
      percentage: 0.029, // 2.9%
      fixedPence: 50, // £0.50
    },
    enterprise: {
      percentage: 0.029, // 2.9%
      fixedPence: 50, // £0.50
    },
  },
  
  currency: 'gbp',
};
