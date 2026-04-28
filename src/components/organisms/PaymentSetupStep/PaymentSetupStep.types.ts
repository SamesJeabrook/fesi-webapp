export interface PaymentSetupData {
  stripeAccountId?: string;
  accountStatus?: 'pending' | 'active' | 'enabled' | 'restricted';
  bankAccountLast4?: string;
  acceptedTerms: boolean;
  agreedToPaymentProcessing: boolean;
}

export interface PaymentSetupStepProps {
  onComplete: (data: PaymentSetupData) => void;
  onBack: () => void;
  initialData?: PaymentSetupData;
  loading?: boolean;
  className?: string;
  merchantId?: string; // For Stripe Connect account linking
}

export interface StripeConnectResponse {
  accountId: string;
  accountLink: string;
  status: 'pending' | 'active' | 'enabled' | 'restricted';
}
